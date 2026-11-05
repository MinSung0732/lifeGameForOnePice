// Rule 14: every life draws one childhood fate and one youth fate, each a branching story of a few chapters.
// A chapter's choice rolls against one stat, so the same choice reads differently for a strong or a weak life.
import { yearRoll } from "./world.js";
import { childhoodArt } from "./childhood.js";
import CHILD_A from "./fates/child-a.js";
import CHILD_B from "./fates/child-b.js";
import YOUTH_A from "./fates/youth-a.js";
import YOUTH_B from "./fates/youth-b.js";

export const FATES = { child: [...CHILD_A, ...CHILD_B], youth: [...YOUTH_A, ...YOUTH_B] };
const SALT = { child: 0x2f6b1c09, youth: 0x5e13a7d1 };
const STAT_LABEL = { skill: "기술", health: "건강", supplies: "물자", bond: "양육자와의 유대", friendBond: "친구와의 유대", trust: "지역의 신뢰" };

// Giants grow up about six times slower, so their chapters come at proportionally later ages.
const fateAge = (life, age) => life.birth.species === "거인족" ? Math.round(age * 5.8) : age;

export function drawnFate(life, kind) {
  const pool = FATES[kind].filter((fate) => !fate.species || fate.species.includes(life.birth.species));
  return pool[yearRoll(life.seed ^ SALT[kind], 3) % pool.length];
}

function hash(text) {
  let value = 0;
  for (const char of text) value = Math.imul(value ^ char.codePointAt(0), 0x01000193) >>> 0;
  return value;
}

const fill = (text, life) => text.replaceAll("{name}", life.birth.name).replaceAll("{home}", life.birth.home);

// The next chapter is the first variant of the next step whose required marks the life holds.
function nextChapter(life, fate) {
  const state = life.fates?.[fate.key] || { step: 0, marks: [] };
  return fate.chapters.find((chapter) => chapter.step === state.step + 1
    && (!chapter.requires || chapter.requires.some((mark) => state.marks.includes(mark)))
    && (!chapter.unless || !chapter.unless.some((mark) => state.marks.includes(mark))));
}

function resolve(state, fate, chapter, choice) {
  const roll = yearRoll(state.seed ^ hash(`${fate.key}:${chapter.id}:${choice.id}`), state.age) % 100 + 1;
  const edge = state[choice.check.stat] - choice.check.against;
  const tier = roll + edge >= 80 ? "great" : roll + edge >= 40 ? "good" : "bad";
  const outcome = choice.outcomes[tier];
  for (const [key, change] of Object.entries(outcome.effects || {})) state[key] += change;
  const record = state.fates[fate.key] ||= { step: 0, marks: [], title: fate.title };
  record.step = chapter.step;
  record.marks.push(...[choice.mark, outcome.mark].filter(Boolean));
  record.last = tier;
  const target = Math.max(1, Math.min(99, 40 - edge));
  state.lastDice = { roll, target, success: tier !== "bad" };
  return `주사위 ${roll} (${target} 이상 성공) · ${{ great: "대성공", good: "성공", bad: "실패" }[tier]}. ${fill(outcome.text, state)}`;
}

export function fateScene(life, age, base) {
  if (life.creationVersion < 14) return null;
  for (const kind of ["child", "youth"]) {
    const fate = drawnFate(life, kind);
    const chapter = nextChapter(life, fate);
    if (!chapter || age < fateAge(life, chapter.age)) continue;
    return { ...base, id: `life_fate_${fate.key}_${chapter.id}`, urgent: true, fate: true,
      art: childhoodArt(life, chapter.art), title: chapter.title, body: fill(chapter.body, life),
      choices: chapter.choices.map((choice) => ({ id: choice.id, label: choice.label, personality: choice.personality,
        risk: `${choice.hint} · ${STAT_LABEL[choice.check.stat]}에 따라 결과가 갈림`,
        apply: (state) => resolve(state, fate, chapter, choice) })) };
  }
  return null;
}

// The ending record keeps one line per fate: the legacy of the last mark that has one, else the default.
export function fateLegacy(life) {
  return Object.keys(life.fates || {}).map((key) => {
    const fate = [...FATES.child, ...FATES.youth].find((item) => item.key === key);
    const record = life.fates[key];
    const mark = [...record.marks].reverse().find((item) => fate.legacy[item]);
    return `${fate.title} — ${fill(fate.legacy[mark] || fate.legacy.default, life)}`;
  });
}
