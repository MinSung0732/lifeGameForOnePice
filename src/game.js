import { CANON_CHAPTER, scenes } from "./story.js";
import { branchScene, yearlyScene } from "./life-story.js";
import { encounterScene } from "./world.js";

export const SAVE_VERSION = 1;
export const MODES = ["original", "free"];
export const PROFILE_OPTIONS = {
  names: ["리안", "미오", "테오", "라나", "이본", "카이"],
  genders: ["남성", "여성"],
  species: ["인간", "어인", "밍크족", "하늘섬 사람", "거인족"],
  homes: {
    인간: ["이스트 블루 · 로그 타운", "사우스 블루 · 바테리라", "웨스트 블루 · 카노 나라", "노스 블루 · 루브니르 왕국", "위대한 항로 · 알라바스타 나노하나", "신세계 · 스핑크스 섬"],
    어인: ["위대한 항로 해저 · 어인섬"],
    밍크족: ["신세계 · 조"],
    "하늘섬 사람": ["위대한 항로 상공 · 스카이피아"],
    거인족: ["신세계 · 엘바프"]
  },
  means: ["넉넉지 않은", "그럭저럭 버틸 수 있는"]
};

// Older saves must keep the same birthplace selected by their original seed.
const LEGACY_HOMES = {
    인간: ["해무 항구", "돌등대 항구", "물결목 항구"],
    어인: ["어인섬 조개길", "어인섬 해류마을"],
    밍크족: ["조 바람숲", "조 나무다리 마을"],
    "하늘섬 사람": ["스카이피아 구름해안", "스카이피아 바람둑"],
    거인족: ["엘바프 북쪽 만", "엘바프 솔바람 마을"]
};
const LEGACY_GENDERS = ["남성", "여성", "비이분법"];
// Game balance values, not numerical traits stated by the original work.
const SPECIES_START = {
  인간: { skill: 20, health: 70 },
  어인: { skill: 21, health: 78 },
  밍크족: { skill: 23, health: 72 },
  "하늘섬 사람": { skill: 22, health: 68 },
  거인족: { skill: 19, health: 84 }
};
export const STATS = [
  { key: "skill", label: "기술", max: 100 },
  { key: "health", label: "건강", max: 100 },
  { key: "supplies", label: "물자", max: 100 },
  { key: "bond", label: "양육자와의 유대", max: 100 },
  { key: "friendBond", label: "친구와의 유대", max: 100 },
  { key: "trust", label: "지역의 신뢰", max: 100 }
];
export const PERSONALITY = [
  { key: "empathy", label: "배려" },
  { key: "ambition", label: "야망" },
  { key: "loyalty", label: "의리" },
  { key: "caution", label: "신중함" },
  { key: "freedom", label: "자유로움" }
];

export function personalitySummary(personality) {
  const ranked = [...PERSONALITY].sort((a, b) => personality[b.key] - personality[a.key]);
  if (personality[ranked[0].key] - personality[ranked[1].key] < 8 && personality[ranked[0].key] < 65) return "균형을 찾는 사람";
  const adjective = { empathy: "다정한", ambition: "도전적인", loyalty: "의리 있는", caution: "신중한", freedom: "자유로운" };
  const role = { empathy: "동료", ambition: "개척자", loyalty: "동행자", caution: "항해자", freedom: "탐험가" };
  return `${adjective[ranked[0].key]} ${role[ranked[1].key]}`;
}
export const ART = {
  deck: { src: "./design/assets/life-deck.png", alt: "인물 없는 배의 갑판과 먼바다" },
  workbench: { src: "./design/assets/life-workbench.png", alt: "해도를 펼친 빈 작업대와 바다가 보이는 창" },
  lifeStorm: { src: "./design/assets/life-storm.png", alt: "거친 비바람에 밧줄이 풀린 빈 계류장" },
  legacy: { src: "./design/assets/life-legacy.png", alt: "일지와 나침반이 놓인 빈 작업대" },
  fruit: { src: "./design/assets/life-fruit.png", alt: "항구 작업대 위 상자에 놓인 정체 모를 무늬 열매" },
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

function personalize(text, name) {
  const last = name.codePointAt(name.length - 1);
  const batchim = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
  const words = {
    "너에게": `${name}에게`, "네게": `${name}에게`, "네가": `${name}${batchim ? "이" : "가"}`,
    "너는": `${name}${batchim ? "은" : "는"}`, "너를": `${name}${batchim ? "을" : "를"}`,
    "너와": `${name}${batchim ? "과" : "와"}`, "너의": `${name}의`, "너도": `${name}도`, "네": `${name}의`
  };
  return text.replace(/(?<![가-힣])(?:너에게|네게|네가|너는|너를|너와|너의|너도|네(?=\s))/gu, (word) => words[word]);
}

function nextEligibleIndex(life, from) {
  for (let index = from; index < scenes.length; index += 1) {
    const card = scenes[index];
    if ((card.species === "all" || (card.species || "인간") === life.birth.species) && (!card.rules || card.rules.includes(life.rules)) && (!card.when || card.when(life))) return index;
  }
  return scenes.length;
}

function normalizeProfile(profile, homes, genders) {
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
  for (const [key, values] of [["gender", genders], ["species", PROFILE_OPTIONS.species], ["means", PROFILE_OPTIONS.means]]) {
    if (profile[key] !== undefined) {
      if (!values.includes(profile[key])) throw new Error(`${key} 설정을 확인해 주세요.`);
      chosen[key] = profile[key];
    }
  }
  if (profile.home !== undefined) {
    if (!chosen.species || !homes[chosen.species].includes(profile.home)) {
      throw new Error("고향을 직접 고르려면 먼저 해당 종족을 선택해 주세요.");
    }
    chosen.home = profile.home;
  }
  return chosen;
}

export function createGame(mode, seed, profile = {}, rules = 3, creationVersion = 2) {
  if (!MODES.includes(mode)) throw new Error("알 수 없는 모드입니다.");
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error("잘못된 시드입니다.");
  if (![1, 2, 3].includes(rules)) throw new Error("알 수 없는 이야기 규칙입니다.");
  if (![1, 2].includes(creationVersion)) throw new Error("알 수 없는 출생 규칙입니다.");
  const homes = rules === 3 ? PROFILE_OPTIONS.homes : LEGACY_HOMES;
  const genders = rules === 3 ? PROFILE_OPTIONS.genders : LEGACY_GENDERS;
  const chosen = normalizeProfile(profile, homes, genders);
  const random = nextRandom(seed);
  const randomName = PROFILE_OPTIONS.names[random() % PROFILE_OPTIONS.names.length];
  const randomGender = genders[random() % genders.length];
  const randomSpecies = rules === 1 ? "인간" : PROFILE_OPTIONS.species[random() % PROFILE_OPTIONS.species.length];
  const species = rules === 1 ? "인간" : chosen.species || randomSpecies;
  const randomHome = homes[species][random() % homes[species].length];
  const randomMeans = PROFILE_OPTIONS.means[random() % PROFILE_OPTIONS.means.length];
  const birth = {
    name: chosen.name || randomName,
    gender: chosen.gender || randomGender,
    species,
    home: chosen.home || randomHome,
    means: chosen.means || randomMeans,
    yearsBeforeCurrent: rules === 3
      ? creationVersion === 2
        ? species === "거인족" ? 160 + random() % 101 : 35 + random() % 51
        : species === "거인족" ? 280 + random() % 71 : 95 + random() % 26
      : 66
  };
  // Keep old rule-3 saves on their original fixed birth values.
  const birthStats = rules === 3 && creationVersion === 2 ? {
    species: SPECIES_START[species],
    individual: { skill: random() % 11 - 5, health: random() % 17 - 8 },
    personality: Object.fromEntries(PERSONALITY.map(({ key }) => [key, random() % 13 - 6]))
  } : null;
  const life = {
    version: SAVE_VERSION, canonChapter: CANON_CHAPTER, mode, seed, profile: chosen, rules,
    creationVersion: rules === 3 ? creationVersion : 1, birth, birthStats,
    index: 0, age: 0, location: birth.home, trade: "", job: "아직 없음", affiliation: "무소속", role: "없음",
    goal: "아직 없음", skill: birthStats ? birthStats.species.skill + birthStats.individual.skill : rules === 3 ? 20 : 0,
    supplies: rules === 3 ? birth.means === "넉넉지 않은" ? 30 : 50 : birth.means === "넉넉지 않은" ? 1 : 2,
    health: birthStats ? birthStats.species.health + birthStats.individual.health : rules === 3 ? 70 : 3,
    bond: rules === 3 ? 40 : 1, friendBond: rules === 3 ? 40 : 1,
    apprenticeBond: 0, trust: rules === 3 ? 40 : 1,
    personality: Object.fromEntries(PERSONALITY.map(({ key }) => [key, 50 + (birthStats?.personality[key] || 0)])),
    devilFruit: null, fruitMastery: 0, haki: { observation: 0, armament: 0, conqueror: 0 },
    successor: false, independent: false, leftHome: false, continued: false, retired: false, rescued: 0,
    homebound: false, rankTier: 0, careerStartAge: null, lastRankOfferAge: -100,
    lastMarineOfferAge: -100, lastPirateOfferAge: -100, lastCivilianOfferAge: -100,
    lastCrewOfferAge: -100, lastRevolutionOfferAge: -100, injustice: false,
    routeIndex: -1, travelHistory: [birth.home], pendingEncounter: null, pendingBranch: false,
    worldBranch: null, alliance: false, coalition: false, rival: false,
    ending: null, deathCause: "", finished: false, lastOutcome: "", lastChanges: [], actions: [], journal: [], seen: []
  };
  life.index = nextEligibleIndex(life, 0);
  return life;
}

function sceneCard(life) {
  const authored = scenes[life.index];
  if (life.rules !== 3) return authored;
  if (life.pendingEncounter) return encounterScene(life);
  if (life.pendingBranch) return branchScene(life);
  const age = authored && (typeof authored.age === "function" ? authored.age(life) : authored.age);
  if (age === life.age) return authored;
  const yearly = yearlyScene(life);
  if (yearly.urgent || !authored || age > life.age + 1) return yearly;
  return authored;
}

function canChoose(choice, life) {
  const cost = typeof choice.cost === "function" ? choice.cost(life) : choice.cost || 0;
  return life.supplies >= cost && (!choice.available || choice.available(life));
}

export function getScene(life) {
  if (life.finished || (life.rules !== 3 && life.index >= scenes.length)) return null;
  const card = sceneCard(life);
  const artKey = typeof card.art === "function" ? card.art(life) : card.art;
  const age = typeof card.age === "function" ? card.age(life) : card.age;
  return {
    id: card.id, act: card.act, age, title: card.title,
    body: personalize(typeof card.body === "function" ? card.body(life) : card.body, life.birth.name),
    art: ART[artKey], canon: card.canon || null,
    choices: (card.choices || []).filter((choice) => !choice.when || choice.when(life))
      .map((choice) => {
        const cost = typeof choice.cost === "function" ? choice.cost(life) : choice.cost || 0;
        const risk = typeof choice.risk === "function" ? choice.risk(life) : choice.risk;
        return { id: choice.id, label: typeof choice.label === "function" ? choice.label(life) : choice.label,
          risk: life.supplies < cost && !risk.includes(`물자 ${cost} 필요`) ? `${risk} · 물자 ${cost} 필요` : risk,
          disabled: !canChoose(choice, life) };
      })
  };
}

export function advance(life, choiceId = null) {
  const view = getScene(life);
  if (!view) throw new Error("이미 끝난 생애입니다.");
  const card = sceneCard(life);
  const chosen = card.choices?.find((choice) => choice.id === choiceId && (!choice.when || choice.when(life)) && canChoose(choice, life));
  if (card.choices && !chosen) throw new Error("이 장면에서 고를 수 없는 선택입니다.");
  if (!card.choices && choiceId !== null) throw new Error("관찰 장면에는 선택지가 없습니다.");

  const next = structuredClone(life);
  if (card.encounter) next.pendingEncounter = null;
  const result = personalize((chosen ? chosen.apply(next) : card.after?.(next)) || "", life.birth.name);
  if (next.rules >= 2) {
    for (const stat of STATS) next[stat.key] = Math.max(0, Math.min(next.rules === 3 ? stat.max : stat.key === "health" ? 3 : 5, next[stat.key]));
  }
  if (next.rules === 3 && chosen?.personality) {
    for (const { key } of PERSONALITY) {
      next.personality[key] = Math.max(0, Math.min(100, next.personality[key] + (chosen.personality[key] || 0)));
    }
  }
  const changes = STATS.filter((stat) => next[stat.key] !== life[stat.key])
    .map((stat) => ({ key: stat.key, delta: next[stat.key] - life[stat.key] }));
  if (next.rules === 3) {
    for (const { key } of PERSONALITY) {
      if (next.personality[key] !== life.personality[key]) changes.push({ key: `personality.${key}`, delta: next.personality[key] - life.personality[key] });
    }
  }
  next.age = view.age;
  next.lastOutcome = result;
  next.lastChanges = changes;
  next.actions.push(choiceId);
  next.seen.push(card.id);
  next.journal.push({ id: card.id, act: card.act, age: view.age, title: card.title, choice: view.choices.find((choice) => choice.id === choiceId)?.label || null, result, changes, canon: card.canon || null });
  next.index = nextEligibleIndex(next, life.index + (card.yearly ? 0 : 1));
  next.finished = next.rules === 3 ? Boolean(next.ending) : next.index === scenes.length;
  return next;
}

export function saveRecord(life) {
  return { version: SAVE_VERSION, mode: life.mode, seed: life.seed, profile: life.profile, rules: life.rules,
    creationVersion: life.creationVersion, actions: [...life.actions] };
}

export function replay(record) {
  if (!record || record.version !== SAVE_VERSION || !Array.isArray(record.actions) || record.actions.length > (record.rules === 3 ? 600 : scenes.length)) {
    throw new Error("저장 기록 형식이 맞지 않습니다.");
  }
  const rules = record.rules === undefined ? 1 : record.rules;
  let life = createGame(record.mode, record.seed, record.profile === undefined ? {} : record.profile, rules,
    record.creationVersion === undefined ? 1 : record.creationVersion);
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
