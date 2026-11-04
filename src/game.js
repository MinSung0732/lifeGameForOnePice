import { CANON_CHAPTER, scenes } from "./story.js";

export const SAVE_VERSION = 1;
export const MODES = ["original", "free"];
export const ART = {
  birth: { src: "./design/assets/birth-harbor.webp", alt: "양육자와 조산사가 아기를 돌보는 조용한 항구와 온전한 가족의 배" },
  storm: { src: "./design/assets/storm-harbor-neutral.webp", alt: "폭풍 뒤 부두에 걸린 가족의 배와 난간에 놓인 나침반" },
  repaired: { src: "./design/assets/repaired-harbor-neutral.webp", alt: "다시 물에 뜬 가족의 배와 수리 도구 옆에 놓인 나침반" },
  harbor: { src: "./design/assets/harbor-now.webp", alt: "일하는 배가 드나드는 항구, 부두 난간 위에 놓인 가족의 나침반" },
  rescue: { src: "./design/assets/rescue-storm-neutral.webp", alt: "비바람 속에서 구조선과 밧줄, 불빛을 준비하는 항구 사람들" },
  retirement: { src: "./design/assets/retirement-harbor-neutral.webp", alt: "오랜 세월 뒤 항구에서 나침반을 다음 일꾼에게 건네는 두 사람" }
};

function nextRandom(seed) {
  let value = seed || 0x9e3779b9;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return value >>> 0;
  };
}

function nextEligibleIndex(life, from) {
  for (let index = from; index < scenes.length; index += 1) {
    if (!scenes[index].when || scenes[index].when(life)) return index;
  }
  return scenes.length;
}

export function createGame(mode, seed) {
  if (!MODES.includes(mode)) throw new Error("알 수 없는 모드입니다.");
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error("잘못된 시드입니다.");
  const random = nextRandom(seed);
  const names = ["리안", "미오", "테오", "라나", "이본", "카이"];
  const genders = ["남성", "여성", "비이분법"];
  const homes = ["해무 항구", "돌등대 항구", "물결목 항구"];
  const means = ["넉넉지 않은", "그럭저럭 버틸 수 있는"];
  const birth = {
    name: names[random() % names.length],
    gender: genders[random() % genders.length],
    species: "인간",
    home: homes[random() % homes.length],
    means: means[random() % means.length],
    yearsBeforeCurrent: 66
  };
  return {
    version: SAVE_VERSION, canonChapter: CANON_CHAPTER, mode, seed, birth,
    index: 0, age: 0, location: birth.home, trade: "", job: "아직 없음", affiliation: "무소속", role: "없음",
    goal: "아직 없음", skill: 0, supplies: birth.means === "넉넉지 않은" ? 1 : 2,
    health: 3, bond: 1, friendBond: 1, apprenticeBond: 0, trust: 1,
    successor: false, independent: false, leftHome: false, continued: false, rescued: 0,
    ending: null, finished: false, lastOutcome: "", actions: [], journal: [], seen: []
  };
}

export function getScene(life) {
  if (life.finished || life.index >= scenes.length) return null;
  const card = scenes[life.index];
  const artKey = typeof card.art === "function" ? card.art(life) : card.art;
  return {
    id: card.id, act: card.act, age: card.age, title: card.title,
    body: typeof card.body === "function" ? card.body(life) : card.body,
    art: ART[artKey], canon: card.canon || null,
    choices: (card.choices || []).filter((choice) => !choice.when || choice.when(life))
      .map(({ id, label, risk }) => ({ id, label, risk: typeof risk === "function" ? risk(life) : risk }))
  };
}

export function advance(life, choiceId = null) {
  const view = getScene(life);
  if (!view) throw new Error("이미 끝난 생애입니다.");
  const card = scenes[life.index];
  const chosen = card.choices?.find((choice) => choice.id === choiceId && (!choice.when || choice.when(life)));
  if (card.choices && !chosen) throw new Error("이 장면에서 고를 수 없는 선택입니다.");
  if (!card.choices && choiceId !== null) throw new Error("관찰 장면에는 선택지가 없습니다.");

  const next = structuredClone(life);
  const result = chosen ? chosen.apply(next) : card.after?.(next) || "";
  next.age = card.age;
  next.lastOutcome = result;
  next.actions.push(choiceId);
  next.seen.push(card.id);
  next.journal.push({ id: card.id, act: card.act, age: card.age, title: card.title, choice: chosen?.label || null, result });
  next.index = nextEligibleIndex(next, life.index + 1);
  next.finished = next.index === scenes.length;
  return next;
}

export function saveRecord(life) {
  return { version: SAVE_VERSION, mode: life.mode, seed: life.seed, actions: [...life.actions] };
}

export function replay(record) {
  if (!record || record.version !== SAVE_VERSION || !Array.isArray(record.actions) || record.actions.length > scenes.length) {
    throw new Error("저장 기록 형식이 맞지 않습니다.");
  }
  let life = createGame(record.mode, record.seed);
  for (const action of record.actions) {
    if (action !== null && typeof action !== "string") throw new Error("선택 기록 형식이 맞지 않습니다.");
    life = advance(life, action);
  }
  return life;
}

export function getContentStats() {
  return {
    cards: scenes.length,
    choices: scenes.filter((card) => card.choices).length,
    canon: scenes.filter((card) => card.canon).length,
    byAct: [1, 2, 3, 4].map((act) => scenes.filter((card) => card.act === act).length)
  };
}
