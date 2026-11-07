import { crewTie } from "./canon-crews.js";
import { storyBefore } from "./world.js";

const CHARACTER_POWERS = {
  luffy: {
    east_blue: 48,
    alabasta: 68,
    skypiea: 76,
    enies_lobby: 88,
    marineford: 102,
    fishman: 120,
    dressrosa: 135,
    whole_cake: 152,
    wano_present: 182
  },
  zoro: {
    east_blue: 44,
    alabasta: 64,
    skypiea: 72,
    enies_lobby: 80,
    marineford: 90,
    fishman: 112,
    dressrosa: 124,
    whole_cake: 135,
    wano_present: 158
  },
  sanji: {
    east_blue: 42,
    alabasta: 62,
    skypiea: 70,
    enies_lobby: 78,
    marineford: 88,
    fishman: 110,
    dressrosa: 118,
    whole_cake: 132,
    wano_present: 152
  },
  jinbe: {
    marineford: 110,
    fishman: 122,
    whole_cake: 128,
    wano_present: 138,
    default: 110
  },
  usopp: {
    east_blue: 25,
    alabasta: 35,
    enies_lobby: 50,
    marineford: 55,
    fishman: 65,
    dressrosa: 78,
    wano_present: 84
  },
  chopper: {
    alabasta: 38,
    enies_lobby: 60,
    marineford: 68,
    fishman: 78,
    wano_present: 92
  },
  robin: {
    alabasta: 62,
    enies_lobby: 72,
    marineford: 78,
    fishman: 90,
    wano_present: 118
  },
  franky: {
    enies_lobby: 72,
    marineford: 78,
    fishman: 92,
    wano_present: 115
  },
  brook: {
    marineford: 72,
    fishman: 85,
    whole_cake: 105,
    wano_present: 110
  },
  crocodile: {
    alabasta: 82,
    marineford: 108,
    wano_present: 130,
    default: 95
  },
  blackbeard: {
    skypiea: 92,
    marineford: 140,
    wano_present: 185,
    default: 120
  },
  bigMom: {
    whole_cake: 195,
    wano_present: 195,
    default: 195
  },
  aokiji: {
    default: 175
  },
  kizaru: {
    default: 175
  },
  smoker: {
    east_blue: 65,
    marineford: 80,
    fishman: 95,
    default: 80
  },
  ace: {
    default: 98
  },
  law: {
    marineford: 82,
    fishman: 118,
    dressrosa: 122,
    wano_present: 162,
    default: 115
  },
  sabo: {
    dressrosa: 142,
    wano_present: 148,
    default: 142
  },
  demaro: {
    default: 15
  },
  foxy: {
    default: 36
  },
  bonney: {
    marineford: 68,
    wano_present: 118,
    default: 80
  },
  vegapunk: {
    default: 15
  },
  dorry: {
    default: 82
  },
  wapol: {
    default: 40
  },
  vivi: {
    default: 28
  },
  rebecca: {
    default: 42
  },
  hachi: {
    default: 46
  }
};

export function canonEraFor(life, beatId) {
  if (beatId) {
    if (["departure", "zoro", "buggy", "usopp", "baratie", "arlong", "loguetown", "bounty_30m"].includes(beatId)) return "east_blue";
    if (["laboon", "whiskey", "reverse_mountain", "vivi_join", "little_garden", "drum", "chopper_join", "alabasta", "alabasta_war", "rainbase", "alubarna", "rain", "alabasta_end", "robin_join", "bounty_100m"].includes(beatId)) return "alabasta";
    if (["jaya", "knock_up", "skypiea", "skypiea_trial", "upper_yard", "maxim", "skypiea_bell", "davy", "aokiji_ice"].includes(beatId)) return "skypiea";
    if (["water_seven", "water_7", "franky_house", "usopp_duel", "cp9", "sea_train", "enies_lobby", "gear_second", "bridge", "buster_call", "merry", "post_enies", "thousand_sunny", "bounty_300m", "garp", "thriller_bark", "thriller_shadows", "oars", "moria", "thriller_aftermath"].includes(beatId)) return "enies_lobby";
    if (["supernovas", "sabaody", "sabaody_auction", "sabaody_scatter", "amazon_lily", "impel_down", "marineford", "war_after"].includes(beatId)) return "marineford";
    if (["training", "reunion", "fishman", "punk_hazard"].includes(beatId)) return "fishman";
    if (["dressrosa", "zou"].includes(beatId)) return "dressrosa";
    if (["whole_cake", "reverie"].includes(beatId)) return "whole_cake";
    if (["wano", "egghead", "elbaf"].includes(beatId)) return "wano_present";
  }
  if (life?.seen?.includes("life_marineford_news")) {
    const step = life.canonStep || 0;
    if (step >= 10) return "wano_present";
    if (step >= 7) return "whole_cake";
    if (step >= 4) return "dressrosa";
    return "fishman";
  }
  const preStep = life?.preCanonStep || 0;
  if (preStep >= 30) return "marineford";
  if (preStep >= 20) return "enies_lobby";
  if (preStep >= 10) return "alabasta";
  return "east_blue";
}

export function canonPowerAt(key, life, beatId) {
  const profile = CHARACTER_POWERS[key];
  if (!profile) return 50;
  const era = canonEraFor(life, beatId);
  return profile[era] || profile.default || profile.wano_present || profile.east_blue || 50;
}

export function playerCombatRating(life) {
  if (!life) return 50;
  let power = Math.round((life.skill || 0) * 0.7 + (life.health || 0) * 0.3);
  const haki = life.haki || {};
  power += (haki.armament || 0) * 16;
  power += (haki.observation || 0) * 10;
  power += (haki.conqueror || 0) * 22;
  if (life.devilFruit) {
    power += 15 + Math.min(30, (life.fruitMastery || 1) * 10);
  }
  if (life.path === "marine") {
    const tierBonus = [0, 5, 12, 22, 32, 44, 58, 70];
    power += tierBonus[Math.min(tierBonus.length - 1, Math.max(0, life.rankTier || 0))];
  } else if (life.path === "pirate") {
    if (life.fleetBounty) {
      power += Math.min(35, Math.floor(life.fleetBounty / 100_000_000) * 6);
    }
  }
  if (life.pureHuman) power += 10;
  return Math.max(10, power);
}

export function computeCaptureDiceTarget(contactKey, life, beatId) {
  const oppPower = canonPowerAt(contactKey, life, beatId);
  const myPower = playerCombatRating(life);
  const diff = oppPower - myPower;
  let target = Math.round(55 + diff * 0.7);

  // Authority & force disparity penalty for low-rank Marines:
  // A rookie seaman or petty officer (rankTier <= 1) attempting to solo arrest a high-threat pirate (oppPower >= 85)
  if (life?.path === "marine" && (life.rankTier || 0) <= 1 && oppPower >= 85) {
    const hasHighHaki = (life.haki?.armament || 0) >= 2 || (life.haki?.conqueror || 0) >= 1;
    if (!hasHighHaki) {
      target += 15;
    }
  }

  return Math.max(15, Math.min(95, target));
}

export function computeContestDiceTarget(contactKey, life, beatId) {
  const oppPower = canonPowerAt(contactKey, life, beatId);
  const myPower = playerCombatRating(life);
  const diff = oppPower - myPower;
  let target = Math.round(50 + diff * 0.6);
  return Math.max(15, Math.min(95, target));
}

export function custodyContactStatus(life, key = "luffy") {
  return life?.people?.canonContacts?.[key]?.custody || null;
}

export function custodyDivergenceText(life, beatId, defaultText = "", isNear = false) {
  if (!life || life.creationVersion < 20) return null;
  const contacts = life.people?.canonContacts;
  if (!contacts) return null;

  const luffyCustody = contacts.luffy?.custody;
  if (["held", "transferred"].includes(luffyCustody)) {
    const statusLabel = luffyCustody === "held" ? "호송선 구금" : "해군 본부 수감";
    const luffyBeats = [
      "departure", "zoro", "buggy", "usopp", "baratie", "arlong", "bounty_30m",
      "loguetown", "reverse_mountain", "laboon", "whiskey", "vivi_join", "drum", "chopper_join",
      "alabasta_war", "rainbase", "alubarna", "rain", "alabasta_end", "robin_join", "bounty_100m",
      "jaya", "knock_up", "skypiea_trial", "upper_yard", "maxim", "skypiea_bell", "davy", "aokiji_ice",
      "water_seven", "franky_house", "usopp_duel", "cp9", "sea_train", "enies_lobby", "gear_second",
      "bridge", "buster_call", "merry", "post_enies", "thousand_sunny", "bounty_300m", "garp",
      "thriller_shadows", "oars", "moria", "thriller_aftermath", "supernovas", "sabaody_auction",
      "sabaody_scatter", "amazon_lily", "impel_down",
      "training", "reunion", "fishman", "punk_hazard", "dressrosa", "zou", "whole_cake", "wano", "egghead", "elbaf"
    ];

    if (luffyBeats.includes(beatId)) {
      if (beatId === "impel_down") {
        return `밀짚모자 루피가 이미 해군에 체포되어 ${statusLabel} 상태인 세계선이다. 해저 감옥 임펠 다운과 마린포드 주변의 경계는 유례없이 삼엄해졌고, 선장을 구출하려는 밀짚모자 일당 잔당들의 움직임이 바다의 긴장을 고조시켰다.`;
      }
      if (beatId === "sabaody_scatter") {
        return `선장 루피가 체포되어 ${statusLabel} 중인 가운데, 선장을 탈환하려던 밀짚모자 일당이 샤본디 제도에서 해군 전력과 충돌해 뿔뿔이 흩어졌다는 비보가 전해졌다.`;
      }
      if (beatId === "reunion") {
        return `원작의 약속 시각이었지만 샤본디 제도에 진짜 밀짚모자 루피의 모습은 없었다. 선장이 여전히 해군에 구금된 채, 흩어졌던 일당은 은밀히 구출 계획을 도모하고 있었다.`;
      }
      if (beatId === "dressrosa") {
        return `도플라밍고의 몰락을 알리는 신문이 바다에 뿌려졌지만 루피의 이름은 없었다. 선장이 수감된 사이 혁명군과 트라팔가 로의 결탁이 드레스로자를 뒤흔들었다는 보고가 들어왔다.`;
      }
      if (beatId === "wano") {
        return `와노국에서 사황의 패권이 흔들렸으나, 새 사황의 자리에 밀짚모자 루피는 오르지 못했다. 수감된 루피의 공백 속에 신세계는 예측할 수 없는 혼돈의 군웅할거로 치달았다.`;
      }
      if (["egghead", "elbaf"].includes(beatId)) {
        return `밀짚모자 루피가 수감된 채 흐른 시간 속에서 바다의 역사는 원작의 궤도를 크게 벗어났다. 베가펑크의 방송과 거인의 나라 소식 속에서도 갇힌 선장의 행방은 여전히 암운에 싸여 있다.`;
      }

      if (isNear) {
        return `[IF 세계선] 밀짚모자 루피가 해군에 ${statusLabel}된 상황이다. 선장을 잃은 일당의 잔당들이 호송망을 추적한다는 소문 속에, 이곳 현장의 질서는 원작과 크게 다른 양상으로 흘러갔다.`;
      }
      return `[IF 세계선] 신문에는 밀짚모자 루피가 ${statusLabel} 중이라는 소식이 여전히 대서특필되어 있었다. 선장의 부재 속에서 원작의 사건은 전혀 다른 결말로 뒤틀리고 있었다.`;
    }
  }

  for (const [key, record] of Object.entries(contacts)) {
    if (["held", "transferred"].includes(record.custody)) {
      const person = CHARACTERS[key];
      if (person && (defaultText.includes(person.name) || defaultText.includes(person.display))) {
        const statusLabel = record.custody === "held" ? "호송선 구금" : "본부 수감";
        return `[IF 세계선] ${person.display}이(가) 해군에 ${statusLabel} 중인 세계선이다. 그 사람의 부재 속에 사건의 전개는 원작의 기록과 크게 달라졌다.`;
      }
    }
  }

  return null;
}

const CHARACTERS = {
  luffy: { name: "몽키 D. 루피", display: "루피", group: "밀짚모자 일당", captureable: true },
  zoro: { name: "롤로노아 조로", display: "조로", group: "밀짚모자 일당", captureable: true },
  usopp: { name: "우솝", display: "우솝", group: "밀짚모자 일당", captureable: true },
  sanji: { name: "상디", display: "상디", group: "밀짚모자 일당", captureable: true },
  chopper: { name: "토니토니 쵸파", display: "쵸파", group: "밀짚모자 일당", captureable: true },
  robin: { name: "니코 로빈", display: "로빈", group: "밀짚모자 일당", captureable: true },
  franky: { name: "프랑키", display: "프랑키", group: "밀짚모자 일당", captureable: true },
  brook: { name: "브룩", display: "브룩", group: "밀짚모자 일당", captureable: true },
  jinbe: { name: "징베", display: "징베", group: "밀짚모자 일당", captureable: true },
  smoker: { name: "스모커", display: "스모커", group: "해군" },
  dorry: { name: "도리", display: "도리", group: "거인 전사" },
  wapol: { name: "와포루", display: "와포루", group: "드럼 왕국" },
  ace: { name: "포트거스 D. 에이스", display: "에이스", group: "흰 수염 해적단", captureable: true },
  vivi: { name: "네펠타리 비비", display: "비비", group: "알라바스타 왕국" },
  crocodile: { name: "크로커다일", display: "크로커다일", group: "바로크 워크스", captureable: true },
  blackbeard: { name: "마셜 D. 티치", display: "검은수염", group: "검은수염 해적단", captureable: true },
  foxy: { name: "폭시", display: "폭시", group: "폭시 해적단", captureable: true },
  aokiji: { name: "쿠잔", display: "쿠잔", group: "해군" },
  hachi: { name: "하치", display: "하치", group: "어인", captureable: true },
  kizaru: { name: "볼사리노", display: "키자루", group: "해군" },
  demaro: { name: "데마로 블랙", display: "가짜 루피", group: "가짜 밀짚모자 일당", captureable: true },
  law: { name: "트라팔가 로", display: "로", group: "하트 해적단", captureable: true },
  rebecca: { name: "레베카", display: "레베카", group: "드레스로자 왕국" },
  sabo: { name: "사보", display: "사보", group: "혁명군", captureable: true },
  bigMom: { name: "샬롯 링링", display: "빅 맘", group: "빅 맘 해적단", captureable: true },
  vegapunk: { name: "베가펑크", display: "베가펑크", group: "세계정부" },
  bonney: { name: "쥬얼리 보니", display: "보니", group: "보니 해적단", captureable: true },
  nami: { name: "나미", display: "나미", group: "밀짚모자 일당", captureable: true },
  buggy: { name: "버기", display: "버기", group: "버기 해적단", captureable: true },
  kaya: { name: "카야", display: "카야", group: "시럽 마을" },
  zeff: { name: "제프", display: "제프", group: "바라티에" },
  arlong: { name: "아론", display: "아론", group: "아론 일당", captureable: true },
  wyper: { name: "와이퍼", display: "와이퍼", group: "샨디아 전사" },
  enel: { name: "에넬", display: "에넬", group: "스카이피아", captureable: true },
  lucci: { name: "롭 루치", display: "루치", group: "CP9", captureable: true },
  moria: { name: "겟코 모리아", display: "모리아", group: "스릴러 바크", captureable: true },
  hancock: { name: "보아 핸콕", display: "핸콕", group: "구사 해적단" }
};

// Each entry is the named person the player can actually meet in that authored island scene.
const ARC_CONTACTS = {
  // These indices match the new rule-23 island scenes, so every direct meeting records a bond.
  departure: ["luffy"],
  zoro: ["zoro", "zoro"],
  buggy: ["luffy", "nami"],
  usopp: ["usopp", "kaya"],
  baratie: ["sanji", "zoro"],
  arlong: ["nami", "nami"],
  skypiea_trial: ["wyper", "enel"],
  skypiea_bell: ["luffy"],
  enies_lobby: ["robin", "zoro"],
  thriller_shadows: ["brook", "moria"],
  thriller_aftermath: ["zoro"],
  amazon_lily: ["hancock", "luffy"],
  loguetown: ["luffy", (life) => life.path === "marine" ? "smoker" : "luffy"],
  whiskey: ["zoro"],
  little_garden: ["dorry"],
  drum: ["wapol", "chopper"],
  alabasta_war: ["ace", "vivi", "crocodile", "luffy"],
  jaya: ["blackbeard", "luffy"],
  davy: ["foxy", "aokiji"],
  water_seven: ["franky", "robin", "usopp"],
  sabaody_auction: [(life) => life.path === "marine" ? "luffy" : "hachi", (life) => life.path === "marine" ? "kizaru" : "luffy"],
  reunion: ["demaro"],
  fishman: ["jinbe"],
  dressrosa: [(life) => life.path === "marine" ? "law" : "sabo", "rebecca", "luffy"],
  zou: ["chopper"],
  whole_cake: [(life) => life.path === "marine" ? "bigMom" : life.path === "liberator" ? "brook" : "sanji"],
  wano: ["zoro"],
  egghead: [(life) => life.path === "marine" ? "vegapunk" : "bonney"],
  elbaf: ["luffy"]
};

const ARC_CUSTODY_TARGETS = {
  loguetown: [["luffy"], ["luffy"]],
  whiskey: [["zoro"]],
  drum: [["wapol"], ["chopper"]],
  alabasta_war: [["ace"], ["vivi"], ["crocodile"], ["luffy"]],
  jaya: [["blackbeard"], ["luffy"]],
  davy: [["foxy"], ["luffy"]],
  water_seven: [["franky"], ["franky", "robin"], ["robin", "usopp"]],
  sabaody_auction: [["luffy", "robin", "zoro", "sanji", "usopp", "chopper", "franky", "brook", "jinbe", "hachi"],
    ["luffy", "robin", "zoro", "sanji", "usopp", "chopper", "franky", "brook", "jinbe"]],
  fishman: [["luffy", "jinbe"]],
  dressrosa: [["luffy", "law", "sabo"], ["usopp", "robin"], ["luffy", "law", "rebecca"]],
  zou: [["chopper", "sanji"]],
  whole_cake: [["luffy", "sanji", "brook", "bigMom"]],
  wano: [["luffy", "zoro", "sanji", "jinbe"]],
  egghead: [["luffy", "robin", "franky", "brook", "bonney", "vegapunk"]],
  elbaf: [["luffy", "brook"]]
};

const enabled = (life) => life?.rules === 3 && (life.mode === "free" || (life.mode === "original" && life.creationVersion >= 20)) && life.creationVersion >= 13;
const clamp = (value) => Math.max(-100, Math.min(100, value));
const relationWord = (score) => score <= -45 ? "적대" : score <= -15 ? "경계" : score < 15 ? "안면" : score < 45 ? "우호" : "신뢰";
const hasBatchim = (name) => {
  const last = name.codePointAt(name.length - 1);
  return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
};
const subject = (name) => `${name}${hasBatchim(name) ? "이" : "가"}`;
const topic = (name) => `${name}${hasBatchim(name) ? "은" : "는"}`;
const object = (name) => `${name}${hasBatchim(name) ? "을" : "를"}`;
const withName = (name) => `${name}${hasBatchim(name) ? "과" : "와"}`;

export function canonContactForArc(life, beatId, index) {
  const entry = ARC_CONTACTS[beatId]?.[index];
  const key = typeof entry === "function" ? entry(life) : entry;
  return key && CHARACTERS[key] ? { key, ...CHARACTERS[key] } : null;
}

function contactRecord(state, key) {
  state.people ||= {};
  state.people.canonContacts ||= {};
  return state.people.canonContacts[key] ||= { score: 0, meetings: 0, captureAttempts: 0 };
}

function noteMeeting(state, key, beatId, age, delta, choice) {
  const record = contactRecord(state, key);
  record.score = clamp(record.score + delta);
  record.meetings += 1;
  record.lastAge = age;
  record.lastPlace = state.location;
  record.lastBeat = beatId;
  record.lastOrder = (state.actions?.length || 0) + 1;
  record.lastChoice = choice;
  return record;
}

function baseChoiceDelta(id) {
  if (/^(aid|help|rescue|protect|evacuate|feast|children|share|change_)/.test(id)) return 7;
  if (/^(fight|join|stand|capture|report|checkpoint|enter|attack)/.test(id)) return -7;
  return 0;
}

function withContactTracking(choice, contact, beatId, age) {
  const wrapped = { ...choice };
  if (choice.apply) wrapped.apply = (state, name) => {
    const result = choice.apply(state, name);
    noteMeeting(state, contact.key, beatId, age, baseChoiceDelta(choice.id), choice.id);
    return result;
  };
  if (choice.fail) wrapped.fail = (state, name) => {
    const result = choice.fail(state, name);
    noteMeeting(state, contact.key, beatId, age, -8, choice.id);
    return result;
  };
  return wrapped;
}

function interactionChoices(life, contact, beatId, index, age) {
  const previous = life.people?.canonContacts?.[contact.key] || { score: 0, meetings: 0, captureAttempts: 0 };
  const cautiousLabel = previous.score <= -20 ? `${contact.display}에게 경계를 무릅쓰고 말을 건다`
    : previous.score >= 25 ? `${contact.display}에게 지난 대화를 꺼내 협력을 청한다` : `${contact.display}에게 이름을 밝히고 말을 건다`;
  const talk = {
    id: "canon_contact_talk", label: cautiousLabel, risk: "관계가 달라질 수 있음 · 친구와의 유대 +2",
    personality: { empathy: 4, caution: 2 },
    apply: (state) => {
      const delta = previous.score <= -20 ? 20 : previous.score >= 25 ? 10 : 15;
      noteMeeting(state, contact.key, beatId, age, delta, "talk");
      state.friendBond += 2;
      return `${withName(contact.display)} 짧게 말을 나눴다. 다음에 다시 만났을 때 어떤 얼굴을 보일지는 아직 알 수 없었다.`;
    }
  };

  if (life.path === "marine") {
    const choices = [talk, {
      id: "canon_contact_report", label: previous.score <= -15 ? `${contact.display}의 동선을 상관에게 알린다` : `${contact.display}와의 접촉을 보고서에 남긴다`,
      risk: "지역의 신뢰 +5 · 관계에 파장이 있을 수 있음", personality: { loyalty: 4, caution: 3 },
      apply: (state) => {
        noteMeeting(state, contact.key, beatId, age, -10, "report");
        state.trust += 5;
        return `${contact.display}의 행적이 해군 기록에 남았다. 그 사람은 다음 만남에서 이 일을 기억할지도 모른다.`;
      }
    }];
    if (life.creationVersion >= 20) choices.push({
      id: "canon_contact_aid", label: `${contact.display}에게 필요한 일을 조용히 돕는다`, cost: 5,
      risk: "물자 -5 · 관계가 달라질 수 있음 · 해군 내부의 평판에 영향",
      personality: { empathy: 7, loyalty: 3, caution: -2 },
      apply: (state) => {
        noteMeeting(state, contact.key, beatId, age, 30, "aid");
        state.supplies -= 5;
        state.friendBond += 3;
        return `${contact.display}가 부탁한 일을 끝까지 마쳤다. 짧은 감사 인사는 다음 만남에도 두 사람 사이에 남았다.`;
      }
    });
    if ((life.mode === "free" || (life.mode === "original" && life.creationVersion >= 20)) && contact.captureable && !["pending", "held", "transferred"].includes(previous.custody) && previous.captureAttempts < 3) {
      if (life.creationVersion >= 20) {
        const oppPower = canonPowerAt(contact.key, life, beatId);
        const myPower = playerCombatRating(life);
        const target = computeCaptureDiceTarget(contact.key, life, beatId);
        const rankWarning = (life.path === "marine" && (life.rankTier || 0) <= 1 && oppPower >= 85) ? " · 수병/하사 단독 체포 극히 불리" : "";
        choices.push({
          id: "canon_contact_capture", label: previous.score <= -20 ? `${contact.display}의 경계가 흐트러진 틈을 노린다` : `${contact.display}의 퇴로를 막는다`,
          needs: { skill: Math.min(100, Math.round(oppPower * 0.65)), health: Math.min(100, Math.round(oppPower * 0.45)) },
          risk: `상대 전투력 ${oppPower} vs 내 전투력 ${myPower}${rankWarning} · 실패 시 건강 -20`,
          failRisk: "건강 -20 · 관계에 파장이 있을 수 있음",
          diceTarget: () => target,
          diceLabel: "체포 판정",
          personality: { ambition: 4, loyalty: 4, caution: -3 },
          apply: (state) => {
            const record = noteMeeting(state, contact.key, beatId, age, -45, "capture");
            record.captureAttempts += 1;
            record.custody = "pending";
            record.custodyDivergenceSeen = false;
            state.people.pendingCanonContact = { key: contact.key, beatId, index, age, place: state.location, attempt: record.captureAttempts };
            return `${object(contact.display)} 제압해 수갑을 채웠다. 정식 인계 전, 현장에서 어떻게 처리할지 결정해야 한다.`;
          },
          fail: (state) => {
            const record = noteMeeting(state, contact.key, beatId, age, -18, "capture_failed");
            record.captureAttempts += 1;
            state.health -= 20;
            return `${subject(contact.display)} 틈을 뚫고 달아났다. 포위망은 무너졌고, 둘 사이의 경계는 더 짙어졌다.`;
          }
        });
      } else {
        choices.push({
          id: "canon_contact_capture", label: previous.score <= -20 ? `${contact.display}의 경계가 흐트러진 틈을 노린다` : `${contact.display}의 퇴로를 막는다`,
          needs: { skill: 60, health: 40 }, risk: "기술 60 · 건강 40 필요 · 주사위 결과가 변수", failRisk: "건강 -20 · 관계에 파장이 있을 수 있음",
          personality: { ambition: 4, loyalty: 4, caution: -3 },
          apply: (state) => {
            const record = noteMeeting(state, contact.key, beatId, age, -45, "capture");
            record.captureAttempts += 1;
            record.custody = "pending";
            record.custodyDivergenceSeen = false;
            state.people.pendingCanonContact = { key: contact.key, beatId, index, age, place: state.location, attempt: record.captureAttempts };
            return `${object(contact.display)} 제압해 수갑을 채웠다. 정식 인계 전, 현장에서 어떻게 처리할지 결정해야 한다.`;
          },
          fail: (state) => {
            const record = noteMeeting(state, contact.key, beatId, age, -18, "capture_failed");
            record.captureAttempts += 1;
            state.health -= 20;
            return `${subject(contact.display)} 틈을 뚫고 달아났다. 포위망은 무너졌고, 둘 사이의 경계는 더 짙어졌다.`;
          }
        });
      }
    }
    return choices;
  }

  const help = {
    id: "canon_contact_help", label: previous.score <= -20 ? `${contact.display}에게 지난 충돌의 빚을 갚는다` : `${subject(contact.display)} 처한 곤란에 손을 보탠다`,
    risk: "물자 -5 · 관계가 달라질 수 있음", cost: 5, personality: { empathy: 6, loyalty: 3 },
    apply: (state) => {
      noteMeeting(state, contact.key, beatId, age, life.creationVersion >= 20 ? 30 : 18, "help");
      state.supplies -= 5;
      state.friendBond += 3;
      return `${subject(contact.display)} 도움을 받아들였다. 고마움이 오래갈지, 그날의 일로 끝날지는 아직 알 수 없었다.`;
    }
  };
  const contest = life.creationVersion >= 20 ? (() => {
    const oppPower = canonPowerAt(contact.key, life, beatId);
    const myPower = playerCombatRating(life);
    const target = computeContestDiceTarget(contact.key, life, beatId);
    return {
      id: "canon_contact_contest", label: previous.score < 0 ? `${contact.display} 앞에서 이번에는 물러서지 않는다` : `${contact.display}와 실력을 조심스레 겨룬다`,
      needs: { skill: Math.min(100, Math.round(oppPower * 0.55)), health: Math.min(100, Math.round(oppPower * 0.35)) },
      risk: `상대 전투력 ${oppPower} vs 내 전투력 ${myPower} · 실패 시 건강 -20`,
      failRisk: "건강 -20 · 관계에 파장이 있을 수 있음",
      diceTarget: () => target,
      diceLabel: "겨루기 판정",
      personality: { ambition: 5, caution: -3 },
      apply: (state) => {
        noteMeeting(state, contact.key, beatId, age, previous.score < 0 ? -8 : 4, "contest");
        state.skill += 3;
        return `${withName(contact.display)} 짧게 겨뤘다. 승패보다 서로의 이름을 기억하게 된 일이 더 오래 남았다.`;
      },
      fail: (state) => {
        noteMeeting(state, contact.key, beatId, age, -15, "contest_failed");
        state.health -= 20;
        return `${contact.display}의 움직임을 따라가지 못했다. 다친 몸을 추스르는 동안 그 사람은 시야 밖으로 사라졌다.`;
      }
    };
  })() : {
    id: "canon_contact_contest", label: previous.score < 0 ? `${contact.display} 앞에서 이번에는 물러서지 않는다` : `${contact.display}와 실력을 조심스레 겨룬다`,
    needs: { skill: 50, health: 35 }, risk: "기술 50 · 건강 35 필요 · 결과는 알 수 없음", failRisk: "건강 -20 · 관계에 파장이 있을 수 있음",
    personality: { ambition: 5, caution: -3 },
    apply: (state) => {
      noteMeeting(state, contact.key, beatId, age, previous.score < 0 ? -8 : 4, "contest");
      state.skill += 3;
      return `${withName(contact.display)} 짧게 겨뤘다. 승패보다 서로의 이름을 기억하게 된 일이 더 오래 남았다.`;
    },
    fail: (state) => {
      noteMeeting(state, contact.key, beatId, age, -15, "contest_failed");
      state.health -= 20;
      return `${contact.display}의 움직임을 따라가지 못했다. 다친 몸을 추스르는 동안 그 사람은 시야 밖으로 사라졌다.`;
    }
  };
  const choices = [talk, help, contest];
  if (!life.path || life.path === "civilian") choices[1] = {
    ...help, id: "canon_contact_trade", label: "항구에서 얻은 정보를 나눈다", risk: "물자 -5 · 관계가 달라질 수 있음"
  };
  return choices;
}

export function attachCanonContact(life, beatId, index, age, scene) {
  if (!enabled(life)) return scene;
  const contact = canonContactForArc(life, beatId, index);
  if (!contact) return scene;
  const baseChoices = (scene.choices || []).map((choice) => withContactTracking(choice, contact, beatId, age));
  return { ...scene, manual: false, choices: [...baseChoices, ...interactionChoices(life, contact, beatId, index, age)] };
}

// Rule 15: once Luffy's crew trusts someone outside the marines, Luffy asks them aboard (free mode only).
function strawHatInvite(life) {
  if (life.creationVersion < 15 || life.path === "marine" || life.canonCrew === "밀짚모자 일당" || life.seen.includes("canon_strawhat_invite")
    || !crewTie(life, "밀짚모자 일당") || storyBefore(life) > 2) return null;
  return { id: "canon_strawhat_invite", age: life.age, act: 3, yearly: true, urgent: true, art: "mishapFeast", title: "밀짚모자의 권유",
    timeLabel: `IF 세계선 · ${life.location}`,
    body: `연회가 한창일 때 루피가 고기를 든 채 ${life.birth.name} 앞에 섰다. 너 재밌는 녀석이라며, 우리 배에 타라고 했다. 뒤에서 나미는 한숨을 쉬었고 조로는 술잔을 든 채 웃었다.`,
    choices: [
      { id: "join", label: "밀짚모자 일당의 동료가 된다", risk: "원작과 다른 세계선 · 지금의 소속을 떠남", personality: { freedom: 9, loyalty: 6 },
        apply: (state) => {
          Object.assign(state, { path: "pirate", job: "해적", affiliation: "밀짚모자 일당", canonCrew: "밀짚모자 일당", role: "동료",
            independent: false, rankTier: 0, leftHome: true, homebound: false });
          state.careerStartAge ??= state.age + 1;
          const ship = (state.preCanonStep ?? 99) >= 34 || state.seen?.includes("canon_before_merry")
            || state.seen?.includes("canon_before_bounty_300m") || state.seen?.includes("life_marineford_news")
            ? "사우전드 써니호"
            : (state.preCanonStep ?? 99) >= 4 || state.seen?.includes("canon_before_usopp")
              ? "고잉 메리호" : "루피의 작은 배";
          return `그날 밤 ${ship}의 갑판에 이름이 하나 더 새겨졌다. 원작에 없던 동료가 탄 배는 같은 바다를 조금 다르게 달리기 시작했다.`;
        } },
      { id: "decline", label: "웃으며 고개를 젓는다", risk: "관계는 그대로 · 친구와의 유대 +5", personality: { loyalty: 5, caution: 3 },
        apply: (state) => { state.friendBond += 5; return "루피는 아쉬운 얼굴도 잠깐, 그럼 다음에 또 보자며 고기를 한 입 크게 베어 물었다."; } }
    ] };
}

export function pendingCanonContactScene(life) {
  if (!enabled(life)) return null;
  const invite = strawHatInvite(life);
  if (invite) return invite;
  const pending = life.people?.pendingCanonContact;
  const contact = pending && CHARACTERS[pending.key];
  if (!pending || !contact) return null;
  const base = { age: life.age, act: 3, yearly: true, urgent: true, art: "dangerPrison", timeLabel: `같은 시각 · ${pending.place}` };
  const finish = (state, custody, delta) => {
    const record = contactRecord(state, pending.key);
    record.custody = custody;
    record.score = clamp(record.score + delta);
    state.people.pendingCanonContact = null;
  };
  return {
    ...base, id: `canon_contact_arrest_${pending.key}_${pending.attempt || 1}`, title: `${contact.display}에게 채운 수갑`,
    body: `체포는 성공했다. 하지만 ${contact.display}의 운명까지 지금 정해진 것은 아니다. 보고서를 올리고 본부에 인계할지, 직접 호송할지, 이 만남을 조용히 끝낼지 ${life.birth.name}가 결정해야 했다.`,
    choices: [
      { id: "canon_contact_transfer", label: "정식 인계 절차를 밟는다", risk: "지역의 신뢰 +8 · 원작 흐름에 변화가 생길 수 있음", personality: { loyalty: 5, caution: 3 },
        apply: (state) => { finish(state, "transferred", -10); state.trust += 8; return `${topic(contact.display)} 해군 본부로 이송됐다. 사건 기록에는 체포자의 이름도 함께 남았다.`; } },
      { id: "canon_contact_guard", label: "호송을 맡아 직접 감시한다", risk: "신병을 계속 확보함 · 다음 행선지가 달라질 수 있음", personality: { loyalty: 4, ambition: 3 },
        apply: (state) => { finish(state, "held", -4); return `${object(contact.display)} 태운 배가 항구를 떠났다. 수감자의 다음 행선지는 ${life.birth.name}의 보고를 기다렸다.`; } },
      { id: "canon_contact_release", label: "수갑을 채운 손을 잠시 늦춘다", risk: "지역의 신뢰 -12 · 관계가 달라질 수 있음", personality: { empathy: 6, freedom: 4 },
        apply: (state) => { finish(state, "escaped", 25); state.trust -= 12; state.injustice = true; return `소란을 틈타 ${topic(contact.display)} 자취를 감췄다. 보고서에는 놓쳤다고 적었지만, 그날의 선택은 두 사람 사이에 남았다.`; } }
    ]
  };
}

export function custodyArcScene(life, beatId, index, age, time, originalId) {
  if (!enabled(life)) return null;
  const fallback = canonContactForArc(life, beatId, index);
  const candidates = ARC_CUSTODY_TARGETS[beatId]?.[index] || (fallback ? [fallback.key] : []);
  const key = candidates.find((candidate) => CHARACTERS[candidate]?.captureable
    && ["held", "transferred"].includes(life.people?.canonContacts?.[candidate]?.custody));
  const contact = key && { key, ...CHARACTERS[key] };
  const record = contact && life.people?.canonContacts?.[contact.key];
  if (!contact?.captureable || !["held", "transferred"].includes(record?.custody)) return null;
  const base = { age, act: 3, species: "all", yearly: true, urgent: true, art: "dangerPrison",
    skipSceneId: originalId, timeLabel: `IF 세계선 · ${time}` };
  if (record.custodyDivergenceSeen) {
    return { ...base, id: `canon_custody_absence_${beatId}_${index}_${contact.key}`, title: "원작 기록에서 비어 있는 자리",
      manual: true, body: `${contact.name}의 이름은 그날 현장 보고서에서 빠져 있었다. ${record.custody === "held" ? "본부 수감 상태라는 짧은 전보만 도착했다." : "해군 본부로 옮겨졌다는 소식 뒤로 생사는 알려지지 않았다."} 현장에 남은 동료들은 다른 길을 택했다.` };
  }
  return {
    ...base, id: `canon_custody_diverge_${beatId}_${index}_${contact.key}`, title: `${contact.display}가 빠진 작전 기록`,
    body: `${subject(contact.name)} 해군에 붙잡힌 뒤, 이 원작 사건의 현장 구성이 달라졌다. 동료들은 빈자리를 알아차리고 움직였고, ${life.birth.name}에게는 구금 기록을 지킬지 풀어 줄지 선택할 순간이 왔다.`,
    choices: [
      { id: "canon_custody_keep", label: "교대 기록을 확인하고 감시를 강화한다", needs: { skill: 45 }, risk: "기술 45 필요 · 신병 확보를 이어감", failRisk: "건강 -15 · 호송 상황이 변수", personality: { loyalty: 5, caution: 4 },
        apply: (state) => {
          const entry = contactRecord(state, contact.key);
          entry.custodyDivergenceSeen = true;
          entry.custody = "transferred";
          state.trust += 5;
          return `연락선과 호송 경로를 다시 확인했다. ${contact.display}의 자리는 비었지만, 해군의 수감 기록은 이어졌다.`;
        },
        fail: (state) => {
          const entry = contactRecord(state, contact.key);
          entry.custodyDivergenceSeen = true;
          entry.custody = "escaped";
          entry.score = clamp(entry.score + 18);
          state.health -= 15;
          return `소란 속에서 ${contact.display}이 사라졌다. 함께 있던 동료들의 모습도 연기 너머로 흩어졌다.`;
        } },
      { id: "canon_custody_open", label: "수송 명단에서 작은 빈틈을 남긴다", risk: "관계 회복 · 지역의 신뢰 -10", personality: { empathy: 5, freedom: 5 },
        apply: (state) => {
          const entry = contactRecord(state, contact.key);
          entry.custodyDivergenceSeen = true;
          entry.custody = "escaped";
          entry.score = clamp(entry.score + 24);
          state.trust -= 10;
          return `호송선이 떠난 뒤 ${contact.display}은 더는 수감자 명단에 없었다. 바다 건너 누군가가 기다리고 있었다.`;
        } }
    ]
  };
}

export function canonRelationshipChanged(life) {
  return enabled(life) && Object.values(life.people?.canonContacts || {}).some((entry) =>
    ["pending", "held", "transferred", "escaped"].includes(entry.custody));
}

// Return every recorded contact for the relationship dialog; the compact line still shows three.
export function canonRelationshipEntries(life) {
  if (!enabled(life)) return [];
  return Object.entries(life.people?.canonContacts || {})
    .filter(([, entry]) => entry.meetings > 0)
    .sort((a, b) => (b[1].lastOrder || 0) - (a[1].lastOrder || 0))
    .map(([key, entry]) => {
      const person = CHARACTERS[key];
      const custody = entry.custody === "pending" ? " · 임시 구금"
        : entry.custody === "held" ? " · 호송 중"
        : entry.custody === "transferred" ? " · 본부 수감"
          : entry.custody === "escaped" ? " · 도주" : "";
      const value = `${entry.score >= 0 ? "+" : ""}${entry.score}`;
      return { name: person?.display || key, role: `${relationWord(entry.score)} ${value}${custody} · ${entry.meetings}회` };
    });
}

export function canonRelationshipSummary(life) {
  return canonRelationshipEntries(life).slice(0, 3).map(({ name, role }) => `${name} · ${role}`).join(" / ");
}

export function canonRelationshipLine(life) {
  if (life?.rules !== 3) return "더 자유로운 모드에서 관계를 기록합니다";
  if (life.mode !== "free" && life.creationVersion < 20) return "더 자유로운 모드에서 관계를 기록합니다";
  if (life.creationVersion < 13) return "새 생애부터 인물 관계를 기록합니다";
  return canonRelationshipSummary(life) || "아직 접점 없음";
}
