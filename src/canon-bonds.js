// Rule 20: canon people close to the protagonist get scenes of their own.
// A boss scene comes when a canon person leads the protagonist's crew or service; a bond scene comes when a
// canon contact's liking (rule 13 score) reaches a threshold. Each is a small personal moment that keeps
// the person true to the manga and invents no canon event.
import { rosterFor } from "./canon-crews.js";
import { rollTier, fill } from "./fates.js";
import { storyBefore } from "./world.js";
import BOSS_SCENES from "./bonds/boss.js";
import BOND_SCENES from "./bonds/affinity.js";

const STAT_LABEL = { skill: "기술", health: "건강", supplies: "물자", bond: "양육자와의 유대", friendBond: "친구와의 유대", trust: "지역의 신뢰" };
// At most one such scene every few years, so they stay special.
const GAP = 3;

function toScene(life, base, id, scene, onResolve) {
  return { ...base, id, urgent: true, art: scene.art || "deck", title: scene.title, body: fill(scene.body, life),
    choices: scene.choices.map((choice) => ({ id: choice.id, label: choice.label, personality: choice.personality,
      risk: `${choice.hint} · ${STAT_LABEL[choice.check.stat]}에 따라 결과가 갈림`,
      apply: (state) => {
        state.people ||= {};
        const { tier, text } = rollTier(state, `${id}:${choice.id}`, choice);
        state.people.lastBondAge = base.age;
        onResolve?.(state, choice, tier);
        return text;
      } })) };
}

function bossScene(life, age, base) {
  const rosterLife = { ...life, age };
  // The status panel limits low-ranked marines to one famous name; authored supervisor scenes use the full era roster.
  if (life.path === "marine" && !life.canonCrew) rosterLife.canonCrew = "해군";
  const names = rosterFor(rosterLife, Infinity).map((person) => person.name);
  // crew: a person on two rosters (Shanks sailed with Roger before his own crew) only gets the scene written for one.
  const scene = BOSS_SCENES.find((entry) => names.includes(entry.person) && (!entry.paths || entry.paths.includes(life.path))
    && (!entry.crew || entry.crew === (life.canonCrew || life.affiliation))
    && (life.rankTier || 0) >= (entry.minRank || 0) && !life.seen.includes(`life_boss_${entry.id}`));
  return scene && toScene(life, base, `life_boss_${scene.id}`, scene);
}

function bondScene(life, age, base) {
  const contacts = life.people?.canonContacts || {};
  const before = storyBefore(life, age);
  const scene = BOND_SCENES.find((entry) => (contacts[entry.key]?.score || 0) >= entry.threshold
    && before <= (entry.from ?? 99) && before >= (entry.to ?? 0)
    && (!entry.beforeWar || !life.seen.includes("life_marineford_news"))
    // places: scenes set on one island; untilBeat: the canon beat after which the person is out of reach (Ace is captured).
    && (!entry.places || entry.places.some((place) => life.location.includes(place)))
    && (!entry.untilBeat || !life.seen.includes(`canon_before_${entry.untilBeat}`))
    && contacts[entry.key]?.custody !== "held" && contacts[entry.key]?.custody !== "transferred"
    && !life.seen.includes(`life_bond_${entry.id}`));
  return scene && toScene(life, base, `life_bond_${scene.id}`, scene, (state, choice, tier) => {
    const record = state.people.canonContacts[scene.key];
    record.score = Math.max(-100, Math.min(100, record.score + (choice.score?.[tier] || 0)));
  });
}

export function canonBondScene(life, age, base) {
  if (life.creationVersion < 20 || !life.path || age - (life.people?.lastBondAge ?? -100) < GAP) return null;
  return bondScene(life, age, base) || bossScene(life, age, base);
}
