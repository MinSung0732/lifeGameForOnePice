import assert from "node:assert/strict";
import { advance, createGame, getScene, replay, saveRecord } from "../src/game.js";
import { endingMemories } from "../src/ending-memories.js";
import { personalAimSummary } from "../src/life-aim.js";

const VERSION = Number(process.env.CREATION_VERSION || 29);
const species = ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"];
const pairs = [];
const repeatedBodies = new Map();
const failures = [];

function play(mode, seed, kind, policy) {
  let life = createGame(mode, seed, { species: kind }, 3, VERSION);
  const birth = structuredClone(life.birth);
  const initial = structuredClone(life.birthStats);
  const early = [], middle = [], decisions = new Map(), roles = new Set(), contactNames = new Set();
  let steps = 0;
  while (!life.finished && steps < 450) {
    const scene = getScene(life);
    assert.ok(scene, "No scene for unfinished life");
    const enabled = scene.choices.filter((choice) => !choice.disabled);
    const action = !enabled.length ? null
      : policy === "first" ? enabled[0].id
        : enabled.at(-1).id;
    const marker = scene.id + ":" + (action ?? "observe");
    if (early.length < 10) early.push(marker);
    if (scene.age >= 35 && scene.age <= 60) middle.push(marker);
    if (action !== null && !decisions.has(scene.id)) decisions.set(scene.id, action);
    const body = scene.body;
    const category = /^life_(voyage|canon_daily|path_|training|practice)/.exec(scene.id)?.[0] || "other";
    const repeatKey = category + "|" + body;
    repeatedBodies.set(repeatKey, (repeatedBodies.get(repeatKey) || 0) + 1);
    life = advance(life, action);
    if (life.path) roles.add(life.path + ":" + life.role);
    for (const [name, contact] of Object.entries(life.people?.canonContacts || {})) {
      if (contact.meetings) contactNames.add(name);
    }
    steps++;
  }
  assert.ok(life.finished, "Unfinished " + seed + " " + policy);
  assert.deepStrictEqual(replay(saveRecord(life)), life, "Replay mismatch " + seed);
  const mate = life.people?.mate, ward = life.people?.ward;
  const civil = life.people?.affiliationChapters?.civilian;
  const relationOutcome = {
    mate: mate ? [mate.name, mate.fate, mate.path || "", Boolean(mate.together)] : null,
    ward: ward ? [ward.name, ward.fate, ward.legacy || null] : null,
    civilian: civil ? [civil.choice, civil.after || null, civil.legacy || null] : null
  };
  return {
    birth, initial, early, middle, decisions, roles: [...roles], contacts: [...contactNames], relationOutcome,
    personalAim: life.personalAim ?? null,
    personalAimReached: life.seen.includes("life_personal_aim"),
    personalAimSummary: VERSION >= 32 ? personalAimSummary(life) : null,
    lateAimChoice: life.journal.find((entry) => entry.id === "life_retire_choice")?.choice || null,
    aimEnding: endingMemories(life).filter((entry) => entry.id === "life_personal_aim" || entry.id === "life_retire_choice")
      .map((entry) => entry.id + ":" + (entry.choice || "-")),
    path: life.path, role: life.role, ending: endingMemories(life).map((entry) => entry.id + ":" + (entry.choice || "-")),
    journalLength: life.journal.length
  };
}
function overlap(a, b) {
  const one = new Set(a), two = new Set(b);
  const shared = [...one].filter((id) => two.has(id)).length;
  return Math.round(1000 * shared / (one.size + two.size - shared || 1)) / 1000;
}
for (let index = 0; index < 24; index++) {
  const seed = index * 199 + 41;
  const mode = index % 2 ? "free" : "original";
  const kind = species[index % species.length];
  try {
    const a = play(mode, seed, kind, "first");
    const b = play(mode, seed, kind, "last");
    assert.deepStrictEqual(a.birth, b.birth);
    assert.deepStrictEqual(a.initial, b.initial);
    let common = 0, differentChoices = 0;
    for (const [id, choice] of a.decisions) {
      if (b.decisions.has(id)) { common++; if (b.decisions.get(id) !== choice) differentChoices++; }
    }
    pairs.push({
      index, seed, mode, species: kind, sameBirth: true, sameStartStats: true,
      earlyOverlap: overlap(a.early, b.early), middleOverlap: overlap(a.middle, b.middle),
      sharedChoiceScenes: common, differentSharedChoices: differentChoices,
      finalPathDifferent: a.path !== b.path, finalRoleDifferent: a.role !== b.role,
      personalAimDifferent: a.personalAim !== b.personalAim || a.personalAimReached !== b.personalAimReached,
      personalAimSummaryDifferent: a.personalAimSummary !== b.personalAimSummary,
      lateAimChoiceDifferent: a.lateAimChoice !== b.lateAimChoice,
      aimEndingDifferent: JSON.stringify(a.aimEnding) !== JSON.stringify(b.aimEnding),
      contactsDifferent: JSON.stringify(a.contacts.sort()) !== JSON.stringify(b.contacts.sort()),
      personalRelationshipDifferent: JSON.stringify(a.relationOutcome) !== JSON.stringify(b.relationOutcome),
      relationEndingDifferent: JSON.stringify(a.ending.filter((entry) => /^life_(people_(mate|ward)|path_civilian_(after|legacy))/.test(entry)))
        !== JSON.stringify(b.ending.filter((entry) => /^life_(people_(mate|ward)|path_civilian_(after|legacy))/.test(entry))),
      endingDifferent: JSON.stringify(a.ending) !== JSON.stringify(b.ending),
      endA: { path: a.path, role: a.role, memories: a.ending, relationships: a.relationOutcome, aim: a.personalAim, late: a.lateAimChoice },
      endB: { path: b.path, role: b.role, memories: b.ending, relationships: b.relationOutcome, aim: b.personalAim, late: b.lateAimChoice }
    });
  } catch (e) {
    failures.push({ seed, mode, species: kind, error: String(e) });
  }
}
const repeated = [...repeatedBodies.entries()]
  .filter(([, count]) => count > 5).sort((a, b) => b[1] - a[1])
  .slice(0, 12).map(([name, count]) => ({ count, family: name.split("|")[0], body: name.split("|")[1].slice(0, 85) }));
const mean = (key) => pairs.length ? Number((pairs.reduce((total, item) => total + item[key], 0) / pairs.length).toFixed(3)) : null;
const report = {
  creationVersion: VERSION, requestedPairs: 24, completedPairs: pairs.length,
  meanEarlyOverlap: mean("earlyOverlap"), meanMiddleOverlap: mean("middleOverlap"),
  meanDifferentChoicesOnCommonScenes: mean("differentSharedChoices"),
  finalPathDifferences: pairs.filter((p) => p.finalPathDifferent).length,
  personalAimDifferences: pairs.filter((p) => p.personalAimDifferent).length,
  personalAimSummaryDifferences: pairs.filter((p) => p.personalAimSummaryDifferent).length,
  lateAimChoiceDifferences: pairs.filter((p) => p.lateAimChoiceDifferent).length,
  aimEndingDifferences: pairs.filter((p) => p.aimEndingDifferent).length,
  finalRoleDifferences: pairs.filter((p) => p.finalRoleDifferent).length,
  contactsDifferences: pairs.filter((p) => p.contactsDifferent).length,
  personalRelationshipDifferences: pairs.filter((p) => p.personalRelationshipDifferent).length,
  relationEndingDifferences: pairs.filter((p) => p.relationEndingDifferent).length,
  endingDifferences: pairs.filter((p) => p.endingDifferent).length,
  mostRepeatedBodies: repeated,
  examples: pairs.slice(0, 3), failures
};
console.log("CHOICE_COMPARE_START");
console.log(JSON.stringify(report, null, 2));
console.log("CHOICE_COMPARE_END");
if (failures.length || pairs.length !== 24) process.exitCode = 1;
