import assert from "node:assert/strict";
import { advance, createGame, getScene, replay, saveRecord } from "../src/game.js";
import { endingMemories } from "../src/ending-memories.js";
import { PERSONAL_AIMS } from "../src/life-aim.js";
import { createObservation } from "../src/observation.js";

const VERSION = Number(process.env.CREATION_VERSION || 35);
const SPECIES = ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"];
const MODES = ["original", "free"];
const POLICIES = ["first", "last", "balanced", "helpful"];
const EVENTS = [
  "life_first_skill", "life_personal_aim", "life_retire_choice", "life_memory",
  "life_loguetown_signal_offer", "life_loguetown_false_order", "life_loguetown_last_signal",
  "life_meet_kureha", "life_meet_crocus",
  "life_encounter_return_kureha", "life_encounter_return_crocus",
  ...["pirate", "marine", "liberator", "civilian"].map((path) => "life_path_" + path + "_choice"),
  "life_path_marine_after", "life_path_civilian_after", "life_path_civilian_legacy",
  "life_people_mate_meet", "life_people_mate_path", "life_people_mate_crisis", "life_people_mate_reunion",
  "life_people_ward_meet", "life_people_ward_return", "life_people_ward_legacy"
];

const counts = Object.fromEntries(EVENTS.map((id) => [id, 0]));
const modes = Object.fromEntries(MODES.map((mode) => [mode, 0]));
const speciesCounts = Object.fromEntries(SPECIES.map((species) => [species, 0]));
const careers = {};
const finishedReasons = {};
const uniqueEndings = new Set();
const lastTenBySpecies = new Map();
const problems = [];
const relationChoices = {};
const relationGaps = { mate: [], ward: [], civilian: [] };
// Diagnose whether a 10-year gap contains no choices or only choices excluded by the meaning heuristic.
const gapDiagnostics = Object.fromEntries(SPECIES.map((name) => [name, {
  livesWithTenYearGaps: 0, intervalsWithTenYearGaps: 0, intervalsWithPlayableChoices: 0,
  longestGapYears: 0, examples: []
}]));
let relationshipEndingMemories = 0;
const personalAimChoices = Object.fromEntries([...Object.keys(PERSONAL_AIMS), "undecided", "not_reached"].map((key) => [key, 0]));
let aimInEnding = 0, aimLinkedToMajorChoice = 0, aimReframedInLateLife = 0, lateDecisions = 0;
let finished = 0, replayed = 0, chosenCount = 0, repeatedTitles = 0, repeatedIds = 0;
let switchedCareers = 0, earlyOverlap = 0, earlyCompared = 0, relevantLoguetown = 0;
const bands = ["childhood", "young", "middle", "late"];
const sceneBands = Object.fromEntries(bands.map((band) => [band, { choices: 0, observation: 0, years: 0 }]));
const sceneKinds = { voyage: 0, everyday: 0, relationship: 0, affiliation: 0, canon: 0, other: 0 };
const speciesBalance = Object.fromEntries(SPECIES.map((name) => [name, { lives: 0, ageTotal: 0, ages: [], earlyEndings: 0, choices: 0, locked: 0, offered: 0, suppliesEndTotal: 0, healthEndTotal: 0, endingReasons: {} }]));
const affiliationBalance = {};
let meaningfulChoices = 0, observationScenes = 0, totalGapYears = 0, gapIntervals = 0;
let longestGapYears = 0, longGapLives = 0, runsOfSameCategory = 0, maxCategoryRun = 0;
let offeredChoices = 0, lockedChoices = 0, diceTrials = 0, diceSuccesses = 0, chosenRisky = 0;
let timedObservationScenes = 0, canonDailyTimedScenes = 0, observationWaitMs = 0, canonDailyWaitMs = 0;
const powerSummary = {
  attempts: 0, wins: 0, great: 0, byAbility: {}, byMastery: {},
  finalFruit: { count: 0, total: 0, peak: 0, perfect: 0 },
  finalHaki: Object.fromEntries(["observation", "armament", "conqueror"]
    .map((name) => [name, { count: 0, total: 0, peak: 0, perfect: 0 }]))
};
const recordMastery = (row, value) => {
  row.count++; row.total += value; row.peak = Math.max(row.peak, value);
  if (value === 100) row.perfect++;
};

let genericDailyOffers = 0, genericBothNearCap = 0, genericNoSkillOrFriendGain = 0;
const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const category = (scene) => scene.id.startsWith("life_voyage_") ? "voyage"
  : /life_(people_|encounter_return_|meet_|friend_reunion)/.test(scene.id) ? "relationship"
    : /^life_path_|^life_rank_|^life_recruit_/.test(scene.id) ? "affiliation"
      : scene.canonDaily || scene.canon ? "canon"
        : /^life_(year_|years_|training|practice|routine)/.test(scene.id) ? "everyday" : "other";
const bandFor = (life, age) => {
  const giant = life.birth.species === "거인족";
  return giant ? age < 112 ? "childhood" : age < 171 ? "young" : age < 282 ? "middle" : "late"
    : age < 19 ? "childhood" : age < 35 ? "young" : age < 60 ? "middle" : "late";
};

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
    life = createGame(mode, seed, { species }, 3, VERSION);
    if (life.birth.species === "인간" && life.birth.home === "이스트 블루 · 로그 타운") relevantLoguetown += 1;
    const pathHistory = new Set();
    const firstTen = [];
    let lastDecisionAge = 0, longestThisLife = 0, prevKind = null, kindRun = 0, choicesThisLife = 0;
    let recentGapScenes = [];
    const recordLongGap = (endAge, nextScene, terminal = false) => {
      const years = Math.max(0, endAge - lastDecisionAge);
      if (years < 10) return;
      const row = gapDiagnostics[species];
      row.intervalsWithTenYearGaps++;
      if (recentGapScenes.some((entry) => entry.options > 0)) row.intervalsWithPlayableChoices++;
      if (row.examples.length < 4) row.examples.push({
        seed, mode, policy, fromAge: lastDecisionAge, toAge: endAge, years,
        nextScene, terminal, precedingScenes: recentGapScenes.slice(-8)
      });
    };
    let offeredThisLife = 0, lockedThisLife = 0;
    while (!life.finished && step < 450) {
      const scene = getScene(life);
      assert.ok(scene, "unfinished life must have a scene");
      sceneId = scene.id;
      assert.ok(scene.art?.src && scene.body.length <= 300, "scene needs art and concise body: " + scene.id);
      if (life.seen.includes(scene.id)) repeatedIds += 1;
      if (life.journal.slice(-10).some((entry) => entry.title === scene.title)) repeatedTitles += 1;
      if (firstTen.length < 10) firstTen.push(scene.id + ":" + scene.title);
      if (counts[scene.id] !== undefined) counts[scene.id] += 1;
      const band = bandFor(life, scene.age), kind = category(scene);
      const genericDaily = scene.canonDaily && scene.choices.some((choice) => choice.id === "listen")
        && scene.choices.some((choice) => choice.id === "prepare");
      if (genericDaily) {
        genericDailyOffers++;
        if (life.skill >= 99 && life.friendBond >= 99) genericBothNearCap++;
      }
      const beforeSkill = life.skill, beforeFriend = life.friendBond;
      const available = scene.choices.filter((choice) => !choice.disabled);
      sceneKinds[kind]++;
      if (kind === prevKind) kindRun += 1;
      else { prevKind = kind; kindRun = 1; }
      maxCategoryRun = Math.max(maxCategoryRun, kindRun);
      if (kindRun === 3) runsOfSameCategory++;
      for (const choice of scene.choices) {
        if (choice.id === "fallback_skip") continue;
        offeredChoices++; offeredThisLife++;
        if (choice.disabled) { lockedChoices++; lockedThisLife++; }
      }
      if (!scene.choices.length && !scene.manual) {
        const waiting = createObservation(scene, 0).duration;
        timedObservationScenes++; observationWaitMs += waiting;
        if (scene.canonDaily) { canonDailyTimedScenes++; canonDailyWaitMs += waiting; }
      }
      const meaningful = available.length >= 2 && new Set(available.map((choice) => choice.risk)).size > 1;
      if (meaningful) {
        meaningfulChoices++;
        sceneBands[band].choices++;
        const years = Math.max(0, scene.age - lastDecisionAge);
        recordLongGap(scene.age, scene.id);
        totalGapYears += years; gapIntervals++;
        longestThisLife = Math.max(longestThisLife, years);
        lastDecisionAge = scene.age;
        recentGapScenes = [];
      } else {
        observationScenes++; sceneBands[band].observation++;
        sceneBands[band].years += Math.max(0, scene.age - life.age);
        if (recentGapScenes.length < 20) recentGapScenes.push({ age: scene.age, id: scene.id, options: available.length });
      }
      const action = choose(scene, policy, seed, step);
      const selectedPower = available.find((choice) => choice.id === action)?.powerOdds;
      if (action !== null) { chosenCount += 1; choicesThisLife++; }
      if (action && available.find((choice) => choice.id === action)?.dice) chosenRisky++;
      life = advance(life, action);
      if (genericDaily && life.skill === beforeSkill && life.friendBond === beforeFriend) genericNoSkillOrFriendGain++;
      if (life.lastDice) { diceTrials++; if (life.lastDice.success) diceSuccesses++; }
      if (selectedPower) {
        assert.ok(life.lastDice, "A mastery ability must roll a die");
        assert.equal(life.lastDice.target, selectedPower.target, "Shown chance and actual die must match");
        const bucket = String(Math.min(90, Math.floor(selectedPower.mastery / 20) * 20));
        powerSummary.attempts++;
        if (life.lastDice.success) powerSummary.wins++;
        if (life.lastDice.tier === "great") powerSummary.great++;
        const byAbility = powerSummary.byAbility[selectedPower.ability] ||= { attempts: 0, wins: 0 };
        byAbility.attempts++; if (life.lastDice.success) byAbility.wins++;
        const byMastery = powerSummary.byMastery[bucket] ||= { attempts: 0, wins: 0, chanceSum: 0 };
        byMastery.attempts++; byMastery.chanceSum += selectedPower.chance;
        if (life.lastDice.success) byMastery.wins++;
      }
      if (life.path) pathHistory.add(life.path);
      bounded(life);
      step += 1;
    }
    recordLongGap(life.age, "life-ended", true);
    longestThisLife = Math.max(longestThisLife, life.age - lastDecisionAge);
    longestGapYears = Math.max(longestGapYears, longestThisLife);
    gapDiagnostics[species].longestGapYears = Math.max(gapDiagnostics[species].longestGapYears, longestThisLife);
    if (longestThisLife >= 10) { longGapLives++; gapDiagnostics[species].livesWithTenYearGaps++; }
    if (life.creationVersion >= 35) {
      if (life.devilFruit) recordMastery(powerSummary.finalFruit, life.powerProficiency.fruit);
      for (const key of ["observation", "armament", "conqueror"]) {
        if (life.haki[key]) recordMastery(powerSummary.finalHaki[key], life.powerProficiency.haki[key]);
      }
    }
    const speciesRow = speciesBalance[species];
    speciesRow.lives++; speciesRow.ages.push(life.age); speciesRow.ageTotal += life.age;
    if (life.age < (species === "거인족" ? 170 : 35)) speciesRow.earlyEndings++;
    speciesRow.choices += choicesThisLife; speciesRow.locked += lockedThisLife;
    speciesRow.offered += offeredThisLife; speciesRow.suppliesEndTotal += life.supplies;
    speciesRow.healthEndTotal += life.health;
    const endingReason = life.ending || "unknown";
    speciesRow.endingReasons[endingReason] = (speciesRow.endingReasons[endingReason] || 0) + 1;
    const pathRow = affiliationBalance[life.path || "none"] ||= { lives: 0, choices: 0, healthEndTotal: 0, suppliesEndTotal: 0 };
    pathRow.lives++; pathRow.choices += choicesThisLife; pathRow.healthEndTotal += life.health; pathRow.suppliesEndTotal += life.supplies;
    assert.ok(life.finished, "step limit reached without a completed life");
    finished += 1;
    assert.equal(getScene(life), null, "completed life must have no new scene");
    assert.deepStrictEqual(replay(saveRecord(life)), life, "save and replay must match");
    replayed += 1;
    if (pathHistory.size > 1) switchedCareers += 1;
    careers[life.path || "none"] = (careers[life.path || "none"] || 0) + 1;
    finishedReasons[life.ending || "unknown"] = (finishedReasons[life.ending || "unknown"] || 0) + 1;
    const recap = endingMemories(life);
    uniqueEndings.add(recap.map((entry) => entry.id + ":" + (entry.choice || "-")).join("|"));
    if (recap.some((entry) => /^life_people_(mate|ward)_|^life_path_civilian_(after|legacy)/.test(entry.id))) relationshipEndingMemories++;
    if (VERSION >= 32) {
      const aimEvent = life.journal.find((entry) => entry.id === "life_personal_aim");
      const aim = aimEvent ? life.personalAim || "undecided" : "not_reached";
      assert.ok(Object.hasOwn(personalAimChoices, aim), "Unknown or unsupported selected goal: " + aim);
      personalAimChoices[aim]++;
      if (life.personalAim) assert.ok(aimEvent, "No goal without an explicit action");
      if (recap.some((entry) => entry.id === "life_personal_aim")) aimInEnding++;
      if (aimEvent && life.journal.some((entry) => entry.age >= aimEvent.age && entry.choice
        && /^life_(path_(pirate|marine|liberator|civilian)_choice|people_ward_return|path_(marine|civilian)_after|free_rank)$/.test(entry.id)))
        aimLinkedToMajorChoice++;
      const retired = life.journal.find((entry) => entry.id === "life_retire_choice" && entry.choice);
      if (retired) {
        lateDecisions++;
        if (retired.choice.includes("처음의 꿈을 다른 뜻으로")) aimReframedInLateLife++;
      }
    }
    for (const entry of life.journal.filter((e) => /^(life_people_(mate|ward)|life_path_civilian)/.test(e.id) && e.choice)) {
      const key = entry.id + ":" + entry.choice;
      relationChoices[key] = (relationChoices[key] || 0) + 1;
    }
    for (const [name, first, last] of [
      ["mate", "life_people_mate_meet", "life_people_mate_reunion"],
      ["ward", "life_people_ward_meet", "life_people_ward_return"],
      ["civilian", "life_path_civilian_choice", "life_path_civilian_after"]]) {
      const firstEntry = life.journal.find((entry) => entry.id === first);
      const lastEntry = life.journal.find((entry) => entry.id === last);
      if (firstEntry && lastEntry) relationGaps[name].push(lastEntry.age - firstEntry.age);
    }
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
  creationVersion: VERSION, requested: 1000, finished, completionRate: finished / 1000,
  replayed, replayFailures: finished - replayed,
  modes, species: speciesCounts, endingByPath: careers, endingReasons: finishedReasons,
  switchedCareers, averageChoices: Number((chosenCount / 1000).toFixed(2)),
  recentTitleDuplicates: repeatedTitles, duplicateEventIds: repeatedIds,
  openingTenOverlap: earlyCompared ? Number((earlyOverlap / earlyCompared).toFixed(3)) : null,
  distinctEndingMemories: uniqueEndings.size, loguetownHumanBirths: relevantLoguetown,
  eventReach: counts, relationshipEndingMemories,
  personalAimChoices, aimInEnding, aimLinkedToMajorChoice, lateDecisions, aimReframedInLateLife,
  relationChoiceCounts: relationChoices,
  meanYearsBetweenRelationshipEvents: Object.fromEntries(Object.entries(relationGaps).map(([name, gaps]) =>
    [name, gaps.length ? Number((gaps.reduce((total, gap) => total + gap, 0) / gaps.length).toFixed(1)) : null])),
  flow: {
    meaningfulChoices, observationScenes,
    sceneBands, sceneKinds,
    averageGapYearsBetweenMeaningfulDecisions: gapIntervals ? Number((totalGapYears / gapIntervals).toFixed(2)) : null,
    longestGapYears, livesWithTenYearGaps: longGapLives,
    runsOfThreeSameCategory: runsOfSameCategory, maxCategoryRun,
    offeredChoices, lockedChoices, lockedChoiceRate: offeredChoices ? Number((lockedChoices / offeredChoices).toFixed(4)) : null,
    chosenRisky, diceTrials, diceSuccesses,
    timedObservationScenes, canonDailyTimedScenes,
    genericDailyOffers, genericBothNearCap, genericNoSkillOrFriendGain,
    estimatedObservationMinutesPerLifeAt1x: Number((observationWaitMs / 1000 / 60 / 1000).toFixed(2)),
    estimatedCanonDayMinutesPerLifeAt1x: Number((canonDailyWaitMs / 1000 / 60 / 1000).toFixed(2))
  },
  powerMastery: {
    attempts: powerSummary.attempts, wins: powerSummary.wins, great: powerSummary.great,
    byAbility: powerSummary.byAbility,
    byMastery: Object.fromEntries(Object.entries(powerSummary.byMastery).map(([key, row]) => [key, {
      attempts: row.attempts, wins: row.wins,
      expectedSuccessRate: Number((row.chanceSum / row.attempts / 100).toFixed(3)),
      actualSuccessRate: Number((row.wins / row.attempts).toFixed(3))
    }])),
    finalFruit: powerSummary.finalFruit.count ? { count: powerSummary.finalFruit.count,
      average: Number((powerSummary.finalFruit.total / powerSummary.finalFruit.count).toFixed(1)),
      peak: powerSummary.finalFruit.peak, perfect: powerSummary.finalFruit.perfect } : null,
    finalHaki: Object.fromEntries(Object.entries(powerSummary.finalHaki).map(([key, row]) => [key, row.count
      ? { count: row.count, average: Number((row.total / row.count).toFixed(1)), peak: row.peak, perfect: row.perfect } : null]))
  },
  gapDiagnostics,
  speciesBalance: Object.fromEntries(Object.entries(speciesBalance).map(([name, row]) => [name, {
    lives: row.lives, meanEndAge: row.lives ? Number((row.ageTotal / row.lives).toFixed(1)) : null,
    medianEndAge: median(row.ages), earlyEndings: row.earlyEndings,
    meanChoices: row.lives ? Number((row.choices / row.lives).toFixed(1)) : null,
    lockedChoiceRate: row.offered ? Number((row.locked / row.offered).toFixed(4)) : null,
    meanEndHealth: row.lives ? Number((row.healthEndTotal / row.lives).toFixed(1)) : null,
    meanEndSupplies: row.lives ? Number((row.suppliesEndTotal / row.lives).toFixed(1)) : null,
    reasons: row.endingReasons
  }])),
  affiliationBalance: Object.fromEntries(Object.entries(affiliationBalance).map(([name, row]) => [name, {
    lives: row.lives, meanChoices: Number((row.choices / row.lives).toFixed(1)),
    meanEndHealth: Number((row.healthEndTotal / row.lives).toFixed(1)),
    meanEndSupplies: Number((row.suppliesEndTotal / row.lives).toFixed(1))
  }])),
  failures: problems
};
console.log("AUDIT_REPORT_START");
console.log(JSON.stringify(report, null, 2));
console.log("AUDIT_REPORT_END");
if (finished !== 1000 || replayed !== 1000) process.exitCode = 1;
