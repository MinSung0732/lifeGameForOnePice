import assert from "node:assert/strict";
import { advance, createGame, getScene, STATS, replay, saveRecord } from "../src/game.js";
import { balancedPublicBounty } from "../src/bounty.js";

const version = Number(process.env.CREATION_VERSION || 35);
const species = ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"];
const modes = ["original", "free"];
const policies = ["first", "last", "balanced", "helpful"];
const keys = STATS.map((row) => row.key);
const marks = [30, 45, 60];
const thresholds = [10_000_000, 30_000_000, 100_000_000, 300_000_000, 500_000_000, 1_000_000_000, 2_000_000_000];
const emptyStats = () => Object.fromEntries(keys.map((key) => [key, 0]));
const ages = Object.fromEntries(marks.map((age) => [age, { samples: 0, total: emptyStats() }]));
const ending = { count: 0, total: emptyStats(), reached90: emptyStats(), reached100: emptyStats(),
  three90: 0, five90: 0, six100: 0, bothSkillTrust90: 0 };
const bounty = { final: [], finalOutlaws: [], byThreshold: {}, incrementsByEvent: {}, topEvents: [], milestoneAges: {}, byPolicy: {} };
const overall = { finished: 0, replayed: 0, endings: {}, byPolicy: {}, byCareer: {},
  majorIF: { emperor: 0, admiral: 0 } };
const bump = (object, key) => { object[key] = (object[key] || 0) + 1; };
const median = (values) => {
  if (!values.length) return null;
  const ordered = [...values].sort((a, b) => a - b);
  const mid = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[mid] : (ordered[mid - 1] + ordered[mid]) / 2;
};
const average = (values) => values.length ? Math.round(values.reduce((sum, n) => sum + n, 0) / values.length) : null;
const choose = (scene, policy, seed, step) => {
  const options = scene.choices.filter((choice) => !choice.disabled);
  if (!options.length) return null;
  if (policy === "last") return options.at(-1).id;
  if (policy === "balanced") return options[(seed + step) % options.length].id;
  if (policy === "helpful") {
    return (options.find((choice) => /구조|도움|구호|신뢰 \+|유대 \+|피난|고친다|치료/.test(choice.label + " " + choice.risk))
      || options[(seed + step) % options.length]).id;
  }
  return options[0].id;
};
const failures = [];
for (let index = 0; index < 1000; index++) {
  const seed = index * 137 + 17;
  const mode = modes[index % modes.length];
  const kind = species[index % species.length];
  const policy = policies[Math.floor(index / 5) % policies.length];
  try {
    let life = createGame(mode, seed, { species: kind }, 3, version);
    const visited = new Set(), milestones = new Set();
    for (let step = 0; step < 450 && !life.finished; step++) {
      const scene = getScene(life);
      assert.ok(scene, "unfinished life without scene");
      const chosen = choose(scene, policy, seed, step);
      const before = life;
      life = advance(life, chosen);
      for (const age of marks) {
        if (!visited.has(age) && before.age < age && life.age >= age) {
          visited.add(age);
          const slot = ages[age];
          slot.samples++;
          for (const key of keys) slot.total[key] += life[key];
        }
      }
      const gain = life.bounty - before.bounty;
      if (version >= 36) {
        for (const key of ["skill", "bond", "friendBond", "trust"]) {
          assert.ok(Number.isFinite(life.growthCarry[key]) && life.growthCarry[key] >= 0
            && life.growthCarry[key] < 1, "invalid fractional growth for " + key);
        }
        if (scene.id.startsWith("life_bounty_act_") && chosen === "intervene") {
          assert.ok(life.lastDice, "the public intervention must make a roll");
          assert.equal(gain, life.lastDice.success ? balancedPublicBounty(before) : 1_000_000,
            "actual bounty and announced successful/failed intervention reward must agree");
        }
      }
      if (gain > 0) {
        const id = scene.id.replace(/_(\d+)$/, "");
        const row = bounty.incrementsByEvent[id] ||= { count: 0, total: 0, max: 0, successes: 0, failures: 0 };
        row.count++; row.total += gain; row.max = Math.max(row.max, gain);
        if (life.lastDice) {
          if (life.lastDice.success) row.successes++;
          else row.failures++;
        }
        bounty.topEvents.push({ id, amount: gain, seed, age: life.age, choice: chosen,
          diceSuccess: life.lastDice?.success ?? null });
        bounty.topEvents.sort((a, b) => b.amount - a.amount);
        bounty.topEvents.length = Math.min(10, bounty.topEvents.length);
      }
      for (const threshold of thresholds) {
        if (!milestones.has(threshold) && before.bounty < threshold && life.bounty >= threshold) {
          milestones.add(threshold);
          (bounty.milestoneAges[threshold] ||= []).push(life.age);
        }
      }
      for (const key of keys) assert.ok(life[key] >= 0 && life[key] <= 100, "bad stat " + key);
      assert.ok(life.bounty >= 0 && Number.isFinite(life.bounty), "bad bounty");
    }
    assert.ok(life.finished, "life not finished");
    assert.deepEqual(replay(saveRecord(life)), life, "replay mismatch");
    overall.finished++; overall.replayed++;
    bump(overall.endings, life.ending || "unknown");
    const career = overall.byCareer[life.path || "none"] ||= { count: 0, rank2: 0, rank3: 0, rank4: 0 };
    career.count++;
    if (life.rankTier >= 2) career.rank2++;
    if (life.rankTier >= 3) career.rank3++;
    if (life.rankTier >= 4) career.rank4++;
    if (life.worldBranch === "emperor") overall.majorIF.emperor++;
    if (life.worldBranch === "admiral") overall.majorIF.admiral++;
    const byPolicy = overall.byPolicy[policy] ||= { lives: 0, present: 0, ages: [], maxStat90: 0 };
    byPolicy.lives++;
    if (life.ending === "present") byPolicy.present++;
    byPolicy.ages.push(life.age);
    const high = keys.filter((key) => life[key] >= 90).length;
    byPolicy.maxStat90 += high;
    ending.count++;
    if (high >= 3) ending.three90++;
    if (high >= 5) ending.five90++;
    if (keys.every((key) => life[key] >= 100)) ending.six100++;
    if (life.skill >= 90 && life.trust >= 90) ending.bothSkillTrust90++;
    for (const key of keys) {
      ending.total[key] += life[key];
      if (life[key] >= 90) ending.reached90[key]++;
      if (life[key] === 100) ending.reached100[key]++;
    }
    bounty.final.push(life.bounty);
    if (life.path === "pirate" || life.path === "liberator") bounty.finalOutlaws.push(life.bounty);
    (bounty.byPolicy[policy] ||= []).push(life.bounty);
    for (const threshold of thresholds) if (life.bounty >= threshold) bump(bounty.byThreshold, threshold);
  } catch (err) {
    if (failures.length < 12) failures.push({ index, seed, message: String(err.stack || err).slice(0, 450) });
  }
}
const summary = {
  version, finished: overall.finished, replayed: overall.replayed, failures,
  endingReasons: overall.endings,
  byCareer: overall.byCareer, majorIF: overall.majorIF,
  ageSnapshots: Object.fromEntries(Object.entries(ages).map(([age, row]) =>
    [age, { samples: row.samples, average: Object.fromEntries(keys.map((key) =>
      [key, row.samples ? Number((row.total[key] / row.samples).toFixed(1)) : null])) }])),
  finalStats: {
    mean: Object.fromEntries(keys.map((key) => [key, Number((ending.total[key] / ending.count).toFixed(1))])),
    atLeast90: ending.reached90, at100: ending.reached100,
    threeAt90: ending.three90, fiveAt90: ending.five90,
    allAt100: ending.six100, skillTrustAt90: ending.bothSkillTrust90
  },
  bounty: {
    averageFinal: average(bounty.final), medianFinal: median(bounty.final), maxFinal: Math.max(...bounty.final),
    outlawAverage: average(bounty.finalOutlaws), outlawMedian: median(bounty.finalOutlaws),
    atLeastThreshold: bounty.byThreshold,
    ageAtFirstThreshold: Object.fromEntries(Object.entries(bounty.milestoneAges).map(([key, values]) =>
      [key, { reached: values.length, meanAge: average(values) }])),
    highestSingleIncrease: bounty.topEvents[0]?.amount || 0,
    topEvents: bounty.topEvents,
    incrementsByEvent: Object.fromEntries(Object.entries(bounty.incrementsByEvent).map(([id, row]) =>
      [id, { count: row.count, mean: Math.round(row.total / row.count), max: row.max,
        withSuccessfulDice: row.successes, withFailedDice: row.failures }])),
    byPolicy: Object.fromEntries(Object.entries(bounty.byPolicy).map(([name, values]) =>
      [name, { count: values.length, average: average(values), median: median(values),
        atLeastOneBillion: values.filter((v) => v >= 1_000_000_000).length }]))
  },
  byPolicy: Object.fromEntries(Object.entries(overall.byPolicy).map(([name, row]) =>
    [name, { lives: row.lives, present: row.present, meanAge: average(row.ages),
      meanNumberStatsAt90: Number((row.maxStat90 / row.lives).toFixed(2)) }]))
};
console.log("BALANCE_REPORT_START");
console.log(JSON.stringify(summary, null, 2));
console.log("BALANCE_REPORT_END");
if (overall.finished !== 1000 || overall.replayed !== 1000) process.exitCode = 1;
