import { CANON_CHAPTER, scenes } from "./story.js";

export const SAVE_VERSION = 1;
export const MODES = ["original", "free"];
export const PROFILE_OPTIONS = {
  names: ["리안", "미오", "테오", "라나", "이본", "카이"],
  genders: ["남성", "여성", "비이분법"],
  species: ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"],
  homes: {
    인간: ["해무 항구", "돌등대 항구", "물결목 항구"],
    어인: ["어인섬 조개길", "어인섬 해류마을"],
    밍크족: ["조 바람숲", "조 나무다리 마을"],
    "하늘섬 사람": ["스카이피아 구름해안", "스카이피아 바람둑"],
    거인족: ["엘바프 북쪽 만", "엘바프 솔바람 마을"]
  },
  means: ["넉넉지 않은", "그럭저럭 버틸 수 있는"]
};
export const STATS = [
  { key: "skill", label: "기술", max: 5 },
  { key: "health", label: "건강", max: 3 },
  { key: "supplies", label: "물자", max: 5 },
  { key: "bond", label: "양육자와의 유대", max: 5 },
  { key: "friendBond", label: "친구와의 유대", max: 5 },
  { key: "trust", label: "지역의 신뢰", max: 5 }
];
export const ART = {
  birth: { src: "./design/assets/birth-harbor.webp", alt: "양육자와 조산사가 아기를 돌보는 조용한 항구와 온전한 가족의 배" },
  storm: { src: "./design/assets/storm-harbor-neutral.webp", alt: "폭풍 뒤 부두에 걸린 가족의 배와 난간에 놓인 나침반" },
  repaired: { src: "./design/assets/repaired-harbor-neutral.webp", alt: "다시 물에 뜬 가족의 배와 수리 도구 옆에 놓인 나침반" },
  harbor: { src: "./design/assets/harbor-now.webp", alt: "일하는 배가 드나드는 항구, 부두 난간 위에 놓인 가족의 나침반" },
  rescue: { src: "./design/assets/rescue-storm-neutral.webp", alt: "비바람 속에서 구조선과 밧줄, 불빛을 준비하는 항구 사람들" },
  retirement: { src: "./design/assets/retirement-harbor-neutral.webp", alt: "오랜 세월 뒤 항구에서 나침반을 다음 일꾼에게 건네는 두 사람" },
  fishman: { src: "./design/assets/fishman-home.webp", alt: "어인섬의 생활 구역과 물속 통로" },
  fishmanCrisis: { src: "./design/assets/fishman-crisis.webp", alt: "어인섬의 통로에 밀려든 거센 해류와 이를 막는 주민들" },
  mink: { src: "./design/assets/mink-home.webp", alt: "거대한 코끼리의 등 위에 자리한 조의 창작 마을" },
  minkCrisis: { src: "./design/assets/mink-crisis.webp", alt: "조의 흔들리는 길목에서 서로를 돕는 주민들" },
  sky: { src: "./design/assets/sky-home.webp", alt: "구름 바다 위 스카이피아의 창작 마을" },
  skyCrisis: { src: "./design/assets/sky-crisis.webp", alt: "스카이피아의 구름 길을 덮친 폭풍과 이를 지키는 주민들" },
  giant: { src: "./design/assets/giant-home.webp", alt: "거인들이 사는 엘바프의 창작 해안 마을" },
  giantCrisis: { src: "./design/assets/giant-crisis.webp", alt: "엘바프 해안의 거친 파도 앞에서 커다란 배를 지키는 거인들" }
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
    const card = scenes[index];
    if ((card.species || "인간") === life.birth.species && (!card.when || card.when(life))) return index;
  }
  return scenes.length;
}

function normalizeProfile(profile) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) throw new Error("캐릭터 설정 형식이 맞지 않습니다.");
  const allowed = ["name", "gender", "species", "home", "means"];
  if (Object.keys(profile).some((key) => !allowed.includes(key))) throw new Error("알 수 없는 캐릭터 설정입니다.");
  const chosen = {};
  if (profile.name !== undefined) {
    if (typeof profile.name !== "string") throw new Error("이름을 확인해 주세요.");
    const name = profile.name.trim();
    if (!name || Array.from(name).length > 12 || /[\x00-\x1f\x7f]/.test(name)) throw new Error("이름은 줄바꿈 없이 1~12자로 입력해 주세요.");
    chosen.name = name;
  }
  for (const [key, values] of [["gender", PROFILE_OPTIONS.genders], ["species", PROFILE_OPTIONS.species], ["means", PROFILE_OPTIONS.means]]) {
    if (profile[key] !== undefined) {
      if (!values.includes(profile[key])) throw new Error(`${key} 설정을 확인해 주세요.`);
      chosen[key] = profile[key];
    }
  }
  if (profile.home !== undefined) {
    if (!chosen.species || !PROFILE_OPTIONS.homes[chosen.species].includes(profile.home)) {
      throw new Error("고향을 직접 고르려면 먼저 해당 종족을 선택해 주세요.");
    }
    chosen.home = profile.home;
  }
  return chosen;
}

export function createGame(mode, seed, profile = {}, rules = 2) {
  if (!MODES.includes(mode)) throw new Error("알 수 없는 모드입니다.");
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error("잘못된 시드입니다.");
  if (rules !== 1 && rules !== 2) throw new Error("알 수 없는 이야기 규칙입니다.");
  const chosen = normalizeProfile(profile);
  const random = nextRandom(seed);
  const randomName = PROFILE_OPTIONS.names[random() % PROFILE_OPTIONS.names.length];
  const randomGender = PROFILE_OPTIONS.genders[random() % PROFILE_OPTIONS.genders.length];
  const randomSpecies = rules === 1 ? "인간" : PROFILE_OPTIONS.species[random() % PROFILE_OPTIONS.species.length];
  const species = rules === 1 ? "인간" : chosen.species || randomSpecies;
  const randomHome = PROFILE_OPTIONS.homes[species][random() % PROFILE_OPTIONS.homes[species].length];
  const randomMeans = PROFILE_OPTIONS.means[random() % PROFILE_OPTIONS.means.length];
  const birth = {
    name: chosen.name || randomName,
    gender: chosen.gender || randomGender,
    species,
    home: chosen.home || randomHome,
    means: chosen.means || randomMeans,
    yearsBeforeCurrent: 66
  };
  const life = {
    version: SAVE_VERSION, canonChapter: CANON_CHAPTER, mode, seed, profile: chosen, rules, birth,
    index: 0, age: 0, location: birth.home, trade: "", job: "아직 없음", affiliation: "무소속", role: "없음",
    goal: "아직 없음", skill: 0, supplies: birth.means === "넉넉지 않은" ? 1 : 2,
    health: 3, bond: 1, friendBond: 1, apprenticeBond: 0, trust: 1,
    successor: false, independent: false, leftHome: false, continued: false, rescued: 0,
    ending: null, finished: false, lastOutcome: "", lastChanges: [], actions: [], journal: [], seen: []
  };
  life.index = nextEligibleIndex(life, 0);
  return life;
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
  if (next.rules === 2) {
    for (const stat of STATS) next[stat.key] = Math.max(0, Math.min(stat.max, next[stat.key]));
  }
  const changes = STATS.filter((stat) => next[stat.key] !== life[stat.key])
    .map((stat) => ({ key: stat.key, delta: next[stat.key] - life[stat.key] }));
  next.age = card.age;
  next.lastOutcome = result;
  next.lastChanges = changes;
  next.actions.push(choiceId);
  next.seen.push(card.id);
  next.journal.push({ id: card.id, act: card.act, age: card.age, title: card.title, choice: chosen?.label || null, result, changes });
  next.index = nextEligibleIndex(next, life.index + 1);
  next.finished = next.index === scenes.length;
  return next;
}

export function saveRecord(life) {
  return { version: SAVE_VERSION, mode: life.mode, seed: life.seed, profile: life.profile, rules: life.rules, actions: [...life.actions] };
}

export function replay(record) {
  if (!record || record.version !== SAVE_VERSION || !Array.isArray(record.actions) || record.actions.length > scenes.length) {
    throw new Error("저장 기록 형식이 맞지 않습니다.");
  }
  const rules = record.rules === undefined ? 1 : record.rules;
  let life = createGame(record.mode, record.seed, record.profile === undefined ? {} : record.profile, rules);
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
