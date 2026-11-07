import assert from "node:assert/strict";
import { advance, createGame, getScene, replay, saveRecord } from "../src/game.js";
import { endingMemories } from "../src/ending-memories.js";

const SPECIES = ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"];
const MODES = ["original", "free"];
const POLICIES = ["first", "last", "balanced", "helpful"];
const EVENTS = [
  "life_first_skill",
  "life_loguetown_signal_offer", "life_loguetown_false_order", "life_loguetown_last_signal",
  "life_meet_kureha", "life_meet_crocus",
  "life_encounter_return_kureha", "life_encounter_return_crocus",
  ...["pirate", "marine", "liberator", "civilian"].map((path) => "life_path_" + path + "_choice"),
  "life_path_marine_after", "life_path_civilian_after"
];

const counts = Object.fromEntries(EVENTS.map((id) => [id, 0]));
const modes = Object.fromEntries(MODES.map((mode) => [mode, 0]));
const speciesCounts = Object.fromEntries(SPECIES.map((species) => [species, 0]));
const careers = {};
const finishedReasons = {};
const uniqueEndings = new Set();
const lastTenBySpecies = new Map();
const problems = [];
let finished = 0, replayed = 0, chosenCount = 0, repeatedTitles = 0, repeatedIds = 0;
let switchedCareers = 0, earlyOverlap = 0, earlyCompared = 0, relevantLoguetown = 0;

function choose(scene, policy, seed, step) {
  const available = scene.choices.filter((choice) => !choice.disabled);
  if (!available.length) return null;
  if (policy === "last") return available.at(-1).id;
  if (policy === "balanced") return available[(seed + step) % available.length].id;
  if (policy === "helpful") {
    return (available.find((c) => /구조|도움|구호|신뢰 \+|유대 \+|피난|고친다|치료/.test(c.label + " " + c.risk))
      || available[(seed + step) % available.length]).id;
  }
  return available[0].id;
}
function errorSample(index, seed, mode, species, policy, step, sceneId, error) {
  if (problems.length < 16) problems.push({ index, seed, mode, species, policy, step, sceneId, error: String(error.message || error).slice(0, 400) });
}
function bounded(life) {
  for (const name of ["skill", "health", "supplies", "bond", "friendBond", "trust"]) {
    const stat = life[name];
    assert.ok(Number.isFinite(stat) && stat >= 0 && stat <= 100, name + "=" + stat);
  }
  assert.ok(Number.isFinite(life.bounty) && life.bounty >= 0, "bounty must remain finite and nonnegative");
  if (life.mode === "original") assert.equal(life.worldBranch, null, "original mode must not enter a major IF");
}

for (let index = 0; index < 1000; index += 1) {
  const seed = index * 137 + 17;
  const mode = MODES[index % MODES.length];
  const species = SPECIES[index % SPECIES.length];
  const policy = POLICIES[Math.floor(index / 5) % POLICIES.length];
  modes[mode] += 1;
  speciesCounts[species] += 1;
  let life, sceneId = null, step = 0;
  try {
    life = createGame(mode, seed, { species }, 3, 29);
    if (life.birth.species === "인간" && life.birth.home === "이스트 블루 · 로그 타운") relevantLoguetown += 1;
    const pathHistory = new Set();
    const firstTen = [];
    while (!life.finished && step < 450) {
      const scene = getScene(life);
      assert.ok(scene, "unfinished life must have a scene");
      sceneId = scene.id;
      assert.ok(scene.art?.src && scene.body.length <= 300, "scene needs art and concise body: " + scene.id);
      if (life.seen.includes(scene.id)) repeatedIds += 1;
      if (life.journal.slice(-10).some((entry) => entry.title === scene.title)) repeatedTitles += 1;
      if (firstTen.length < 10) firstTen.push(scene.id + ":" + scene.title);
      if (counts[scene.id] !== undefined) counts[scene.id] += 1;
      const action = choose(scene, policy, seed, step);
      if (action !== null) chosenCount += 1;
      life = advance(life, action);
      if (life.path) pathHistory.add(life.path);
      bounded(life);
      step += 1;
    }
    assert.ok(life.finished, "step limit reached without a completed life");
    finished += 1;
    assert.equal(getScene(life), null, "completed life must have no new scene");
    assert.deepStrictEqual(replay(saveRecord(life)), life, "save and replay must match");
    replayed += 1;
    if (pathHistory.size > 1) switchedCareers += 1;
    careers[life.path || "none"] = (careers[life.path || "none"] || 0) + 1;
    finishedReasons[life.ending || "unknown"] = (finishedReasons[life.ending || "unknown"] || 0) + 1;
    uniqueEndings.add(endingMemories(life).map((entry) => entry.id + ":" + (entry.choice || "-")).join("|"));
    const oldTen = lastTenBySpecies.get(species);
    if (oldTen) {
      earlyOverlap += firstTen.filter((entry) => oldTen.includes(entry)).length;
      earlyCompared += Math.min(firstTen.length, oldTen.length);
    }
    lastTenBySpecies.set(species, firstTen);
  } catch (error) {
    errorSample(index, seed, mode, species, policy, step, sceneId, error);
  }
}

const report = {
  requested: 1000, finished, completionRate: finished / 1000,
  replayed, replayFailures: finished - replayed,
  modes, species: speciesCounts, endingByPath: careers, endingReasons: finishedReasons,
  switchedCareers, averageChoices: Number((chosenCount / 1000).toFixed(2)),
  recentTitleDuplicates: repeatedTitles, duplicateEventIds: repeatedIds,
  openingTenOverlap: earlyCompared ? Number((earlyOverlap / earlyCompared).toFixed(3)) : null,
  distinctEndingMemories: uniqueEndings.size, loguetownHumanBirths: relevantLoguetown,
  eventReach: counts, failures: problems
};
console.log("AUDIT_REPORT_START");
console.log(JSON.stringify(report, null, 2));
console.log("AUDIT_REPORT_END");
if (finished !== 1000 || replayed !== 1000) process.exitCode = 1;
