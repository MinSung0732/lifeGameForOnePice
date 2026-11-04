// Named stops follow places shown in the original story; the exact voyage is this game's fiction.
const BLUE_ROUTE = ["리버스 마운틴", "쌍둥이 언덕", "위스키 피크", "리틀 가든", "드럼섬", "알라바스타 · 나노하나", "자야 · 모크 타운", "롱 링 롱 랜드", "워터 세븐", "샤본디 제도", "어인섬", "드레스로자", "그린 비트", "조", "스핑크스 섬", "엘바프"];
const GRAND_ROUTE = BLUE_ROUTE.slice(6);
const NEW_ROUTE = ["스핑크스 섬", "드레스로자", "그린 비트", "조", "엘바프", "하치노스 근해", "와노국 외해", "홀케이크 아일랜드 외해"];

// Rule-4 routes branch at islands. Older saves keep their linear route lists below.
const ROUTES_V4 = {
  "리버스 마운틴": ["쌍둥이 언덕", "위스키 피크"],
  "쌍둥이 언덕": ["위스키 피크", "리틀 가든"],
  "위스키 피크": ["리틀 가든", "드럼섬"],
  "리틀 가든": ["드럼섬", "알라바스타 · 나노하나"],
  "드럼섬": ["알라바스타 · 나노하나", "자야 · 모크 타운"],
  "알라바스타 · 나노하나": ["자야 · 모크 타운", "롱 링 롱 랜드"],
  "자야 · 모크 타운": ["롱 링 롱 랜드", "워터 세븐"],
  "롱 링 롱 랜드": ["워터 세븐", "샤본디 제도"],
  "워터 세븐": ["샤본디 제도", "롱 링 롱 랜드"],
  "샤본디 제도": ["어인섬", "워터 세븐"],
  "어인섬": ["펑크 하자드", "드레스로자"],
  "펑크 하자드": ["드레스로자", "그린 비트"],
  "스핑크스 섬": ["드레스로자", "조"],
  "드레스로자": ["그린 비트", "조"],
  "그린 비트": ["조", "홀케이크 아일랜드 외해"],
  "조": ["와노국 외해", "홀케이크 아일랜드 외해"],
  "홀케이크 아일랜드 외해": ["와노국 외해", "엘바프"],
  "와노국 외해": ["에그헤드 외해", "엘바프"],
  "에그헤드 외해": ["엘바프", "조"],
  "엘바프": ["스핑크스 섬", "하치노스 근해"],
  "하치노스 근해": ["스핑크스 섬", "조"]
};

// Places where pirates gather; marines start with less goodwill there and pirates with more.
const PIRATE_HAVENS = ["자야 · 모크 타운", "하치노스 근해", "샤본디 제도"];

function firstTrust(life, place) {
  let hash = 0;
  for (const char of place) hash = Math.imul(hash ^ char.codePointAt(0), 0x01000193) >>> 0;
  const lean = PIRATE_HAVENS.includes(place) ? { pirate: 15, marine: -15 }[life.path] || 0 : 0;
  return [15, 30, 45][yearRoll(life.seed ^ hash, 3) % 3] + lean;
}

// Standing inside an organization follows the best reputation built anywhere, not the island the ship happens to be at.
export function standing(life) {
  return life.creationVersion >= 3 ? Math.max(life.trust, ...Object.values(life.trustBy)) : life.trust;
}

export function knownTrust(life, place) {
  return place === life.location ? life.trust : life.trustBy?.[place];
}

// Rule 3 keeps one trust value per place: leaving stores it, arriving loads it (or a first impression).
export function moveTo(life, place) {
  if (life.creationVersion >= 3 && place !== life.location) {
    life.trustBy[life.location] = life.trust;
    life.trust = life.trustBy[place] ?? firstTrust(life, place);
  }
  life.location = place;
  life.travelHistory.push(place);
}

// "로" after a vowel or ㄹ, "으로" after any other final consonant.
export function ro(word) {
  const code = word.codePointAt(word.length - 1) - 0xac00;
  return `${word}${code >= 0 && code <= 11171 && code % 28 !== 0 && code % 28 !== 8 ? "으로" : "로"}`;
}

// Canon crews a nameless deckhand could join; from/to are years before the original present.
const CANON_CREWS = [
  { name: "로저 해적단", from: 30, to: 25 },
  { name: "흰 수염 해적단", from: 60, to: 3 },
  { name: "빅 맘 해적단", from: 60, to: 1 },
  { name: "백수 해적단", from: 30, to: 1 },
  { name: "붉은 머리 해적단", from: 20, to: 0 },
  { name: "태양 해적단", from: 15, to: 12, species: "어인" }
];

export function canonCrew(life, age = life.age) {
  const before = life.birth.yearsBeforeCurrent - age;
  const open = CANON_CREWS.filter((crew) => before <= crew.from && before >= crew.to && (!crew.species || crew.species === life.birth.species));
  return open.length ? open[yearRoll(life.seed ^ 0x2c1b3c6d, age) % open.length].name : null;
}

export function routeFor(life) {
  if (life.birth.species === "거인족" || life.birth.species === "밍크족" || life.birth.home.includes("신세계")) return NEW_ROUTE;
  if (life.birth.species === "어인") return ["샤본디 제도", "어인섬", ...NEW_ROUTE];
  if (life.birth.species === "하늘섬 사람") return ["자야 · 모크 타운", ...GRAND_ROUTE.slice(1)];
  if (life.birth.home.includes("위대한 항로")) return GRAND_ROUTE;
  return BLUE_ROUTE;
}

const ENCOUNTERS = [
  { id: "dorry_brogy", place: "리틀 가든", earliest: 100, latest: 3, name: "도리와 브로기", canon: "https://one-piece.com/story/alabasta/index.html",
    body: "리틀 가든에서 도리와 브로기의 결투 소리가 들렸다. 둘은 오래된 승부를 이어 가고 있었다. 지나가는 배는 싸움에 끼어들지 않고 해안에 닻을 내렸다.",
    choices: [
      { id: "share", label: "두 거인에게 식량을 나눈다", available: (life) => life.supplies >= 20, risk: "물자 20 필요 · 지역의 신뢰 +10", personality: { empathy: 8, loyalty: 5 }, apply: (life) => { life.supplies -= 20; life.trust += 10; return "두 거인은 식량을 받아 들고 다시 자기들의 승부로 돌아갔다."; } },
      { id: "watch", label: "멀리서 결투를 보고 떠난다", risk: "결투에 끼어들지 않음 · 기술 +10", personality: { caution: 6 }, apply: (life) => { life.skill += 10; return "물러설 때를 아는 것도 오래 남는 배움이었다."; } }
    ] },
  { id: "kureha", place: "드럼섬", earliest: 30, latest: 3, latestV3: 0, name: "닥터 쿠레하", canon: "https://one-piece.com/character/Dr_Kureha/index.html",
    body: "드럼섬에서 오래 일한 의사 닥터 쿠레하를 만났다. 그는 환자의 몸보다 먼저 여행 준비가 허술하다고 지적했다.",
    choices: [
      { id: "treat", label: "치료와 진찰을 부탁한다", available: (life) => life.supplies >= 20, risk: "물자 20 필요 · 건강 +20", personality: { caution: 5 }, apply: (life) => { life.supplies -= 20; life.health += 20; return "진찰은 거칠었지만 돌아갈 힘이 생겼다."; } },
      { id: "listen", label: "준비에 관한 말을 듣는다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "약보다 먼저 필요한 물자와 쉬는 날을 적었다."; } }
    ] },
  { id: "crocus", place: "쌍둥이 언덕", earliest: 24, latest: 3, latestV3: 0, name: "크로커스", canon: "https://one-piece.com/character/Crocus/index.html",
    body: "쌍둥이 언덕의 등대에서 크로커스를 만났다. 항로를 묻자 그는 기록지침과 기다릴 시간을 먼저 확인했다.",
    choices: [
      { id: "ask", label: "기록지침을 살펴 달라고 한다", cost: 10, risk: "기술 +10 · 물자 -10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; life.supplies -= 10; return "새 항로보다 먼저 틀린 기록을 고쳤다."; } },
      { id: "go", label: "인사를 하고 길을 떠난다", risk: "현재 상태 유지", apply: () => "등대의 불빛을 뒤로하고 출항했다." }
    ] },
  { id: "rayleigh", place: "샤본디 제도", earliest: 10, latest: 3, name: "실버즈 레일리", canon: "https://one-piece.com/character/Silvers_Rayleigh/index.html",
    body: "샤본디 제도에서 코팅 일을 하던 실버즈 레일리를 잠깐 만났다. 그는 배의 상태를 살피고 깊은 바다에 필요한 준비를 물었다.",
    choices: [
      { id: "prepare", label: "코팅과 안전 장비를 의논한다", available: (life) => life.supplies >= 30, risk: "물자 30 필요 · 건강 +10", personality: { caution: 6 }, apply: (life) => { life.supplies -= 30; life.health += 10; return "코팅과 비상 밧줄을 갖춘 뒤에야 출항 날짜를 정했다."; } },
      { id: "wait", label: "더 준비할 때까지 머문다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "서두르지 않고 배의 약한 곳부터 고쳤다."; } }
    ] },
  { id: "tom", place: "워터 세븐", earliest: 30, latest: 11, name: "톰", canon: "https://one-piece.com/character/Tom/index.html",
    body: "워터 세븐의 조선소에서 톰을 만났다. 낡은 배를 다시 쓰려면 배의 약점을 숨기지 말고 먼저 살펴야 한다는 이야기를 들었다.",
    choices: [
      { id: "learn", label: "배의 구조를 함께 점검한다", available: (life) => life.supplies >= 10, risk: "물자 10 필요 · 기술 +20", personality: { caution: 5, ambition: 4 }, apply: (life) => { life.supplies -= 10; life.skill += 20; return "나무가 물을 먹는 자리와 보강할 부분을 기록했다."; } },
      { id: "thank", label: "조언을 듣고 일터로 돌아간다", risk: "기술 +10", personality: { loyalty: 4 }, apply: (life) => { life.skill += 10; return "톰의 작업을 방해하지 않고 자기 배로 돌아왔다."; } }
    ] },
  { id: "jarul", place: "엘바프", earliest: 63, latest: 3, name: "야를", canon: "https://one-piece.com/character/Jarul/index.html",
    body: "엘바프에 기항한 날, 장로 야를을 만났다. 그는 다른 배가 무엇을 얻으러 왔는지보다 누구와 함께 돌아갈지를 먼저 물었다.",
    choices: [
      { id: "share", label: "동행의 사정을 솔직히 말한다", risk: "지역의 신뢰 +10", personality: { loyalty: 6, empathy: 5 }, apply: (life) => { life.trust += 10; return "야를은 짧게 고개를 끄덕이고 기항할 자리를 알려 주었다."; } },
      { id: "observe", label: "예의를 갖추고 섬을 둘러본다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "낯선 땅에서는 먼저 길과 일상을 익히기로 했다."; } }
    ] },
  { id: "luffy_elbaf", place: "엘바프", earliest: 0, latest: 0, name: "몽키 D. 루피", canon: "https://one-piece.com/story/elbaph/index.html",
    body: "엘바프에서 밀짚모자 루피를 잠깐 마주쳤다. 그는 동료들이 있는 쪽을 묻고 있었고, 항구의 길은 여러 갈래였다.",
    choices: [
      { id: "guide", label: "동료들이 지나간 길을 가리킨다", risk: "짧은 대화 · 지역의 신뢰 +10", personality: { empathy: 5 }, apply: (life) => { life.trust += 10; return "루피는 고맙다며 손을 흔들었다. 이어지는 모험은 그의 동료들과 함께할 일이었다."; } },
      { id: "pass", label: "다른 길목을 살피러 간다", risk: "기술 +10 · 각자의 항로", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "떠들썩한 항구를 뒤로하고 자기 배의 길을 확인했다."; } }
    ] }
];

export function encounterAt(life) {
  const beforePresent = life.birth.yearsBeforeCurrent - life.age;
  // latestV3: canon still shows them there in the present; older rules keep their original window for replay.
  const latest = (entry) => life.creationVersion >= 3 && entry.latestV3 !== undefined ? entry.latestV3 : entry.latest;
  return ENCOUNTERS.find((entry) => life.location === entry.place && beforePresent <= entry.earliest && beforePresent >= latest(entry) && !life.seen.includes(`life_meet_${entry.id}`))?.id || null;
}

export function encounterScene(life) {
  const encounter = ENCOUNTERS.find((entry) => entry.id === life.pendingEncounter);
  if (!encounter) throw new Error("만남 기록을 찾을 수 없습니다.");
  return { id: `life_meet_${encounter.id}`, age: life.age, act: 2, species: "all", yearly: true, encounter: true,
    art: "deck", title: `${encounter.name}와의 마주침`, body: encounter.body, canon: encounter.canon, choices: encounter.choices };
}

export function travelScene(life, age) {
  if (life.creationVersion >= 4) return branchingTravelScene(life, age);
  const route = routeFor(life);
  const nearIndex = (life.routeIndex + 1) % route.length;
  const farIndex = (life.routeIndex + 2) % route.length;
  function visit(state, index, cost) {
    state.routeIndex = index;
    moveTo(state, route[index]);
    state.age = age;
    state.supplies -= cost;
    state.pendingEncounter = encounterAt(state);
    if (state.creationVersion < 3) return `${state.birth.name}의 배는 ${state.location}에 닿았다. 새 기항지의 물길과 사람을 살피기 시작했다.`;
    const mood = state.trust >= 45 ? "반기는 얼굴이 많았다" : state.trust <= 20 ? "낯선 배를 경계하는 눈길이 날카로웠다" : "사람들은 아직 지켜보기만 했다";
    return `${state.birth.name}의 배는 ${state.location}에 닿았다. 부두에서는 ${mood}.`;
  }
  const place = (index) => {
    if (life.creationVersion < 3) return "";
    const known = knownTrust(life, route[index]);
    return known === undefined ? " · 처음 가는 곳" : ` · 그곳의 신뢰 ${known}`;
  };
  return { id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true, art: "deck",
    title: life.creationVersion === 1 ? "다음 기항지를 고르다" : `${life.location}에서의 출항`,
    body: `${life.location}에서 다음 항로를 정할 때가 왔다. 기록지침과 동행의 준비를 확인했다. 먼 섬으로 갈수록 식량과 배를 손볼 물자가 더 필요했다.`, choices: [
      { id: "near", label: `${ro(route[nearIndex])} 간다`, available: (state) => state.supplies >= 10, risk: `물자 10 필요 · 가까운 항로${place(nearIndex)}`, personality: { freedom: 5 }, apply: (state) => visit(state, nearIndex, 10) },
      { id: "far", label: `${ro(route[farIndex])} 긴 항해를 한다`, available: (state) => state.supplies >= 20, risk: `물자 20 필요 · 긴 항로${place(farIndex)}`, personality: { ambition: 7, freedom: 5 }, apply: (state) => visit(state, farIndex, 20) },
      { id: "convoy", label: `동행 선단과 ${ro(route[nearIndex])} 간다`, risk: `물자 없이 이동 · 친구와의 유대 -5${place(nearIndex)}`, personality: { loyalty: 4, freedom: -3 }, apply: (state) => { const result = visit(state, nearIndex, 0); state.friendBond -= 5; return result; } }
    ] };
}

function branchingTravelScene(life, age) {
  const log = ROUTES_V4[life.location] || ROUTES_V4[routeFor(life)[0]];
  const isNewWorld = (place) => place.includes("신세계") || NEW_ROUTE.includes(place) || ["펑크 하자드", "에그헤드 외해"].includes(place);
  const newWorld = isNewWorld(life.location);
  const candidates = newWorld ? ["드레스로자", "조", "와노국 외해", "엘바프", "스핑크스 섬"]
    : ["워터 세븐", "샤본디 제도", "어인섬", "자야 · 모크 타운", "알라바스타 · 나노하나"];
  const poseOptions = candidates.filter((place) => place !== life.location && place !== "어인섬" && !log.includes(place));
  const poseDestination = poseOptions[yearRoll(life.seed ^ 0x6d3c, age) % poseOptions.length];
  const passageCost = (place, ordinary) => life.location === "샤본디 제도" && place === "어인섬" ? 30 : ordinary;
  function visit(state, place, cost) {
    state.age = age;
    state.supplies -= cost;
    moveTo(state, place);
    state.pendingEncounter = encounterAt(state);
    return `${state.birth.name}의 배는 ${place}에 닿았다. 낡은 해도에는 없던 부두의 소란이 먼저 들렸다.`;
  }
  const title = `${life.location}에서 바늘이 갈라질 때`;
  let displayTitle = title;
  if (life.creationVersion >= 5) {
    const departures = life.journal.filter((entry) => entry.title === title || entry.title.startsWith(`${title} · `)).length;
    if (departures) displayTitle = `${title} · ${departures + 1}번째 출항`;
  } else if (life.journal.slice(-10).some((entry) => entry.title === title)) {
    displayTitle = `${title} · ${age}세의 재출항`;
  }
  return { id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true, art: "deck",
    title: displayTitle,
    body: `기록지침이 서로 다른 섬을 가리켰다. 선원들은 식량을 세고 한쪽을 고르자고 했다. 영구 지침이 있으면 익숙한 목적지로 길을 틀 수도 있었다.`,
    choices: [
      { id: "near", label: `기록지침을 따라 ${ro(log[0])} 간다`, available: (state) => state.supplies >= passageCost(log[0], 10),
        risk: `물자 ${passageCost(log[0], 10)} 필요 · ${log[0] === "어인섬" ? "선박 코팅 포함" : "기록지침 첫 항로"}`,
        personality: { caution: 4 }, apply: (state) => visit(state, log[0], passageCost(log[0], 10)) },
      { id: "far", label: `다른 바늘을 따라 ${ro(log[1])} 간다`, available: (state) => state.supplies >= passageCost(log[1], 20),
        risk: `물자 ${passageCost(log[1], 20)} 필요 · ${log[1] === "어인섬" ? "선박 코팅 포함" : "다른 항로"}`,
        personality: { freedom: 5 }, apply: (state) => visit(state, log[1], passageCost(log[1], 20)) },
      { id: "convoy", label: `동행 선단과 ${ro(log[0])} 간다`, risk: `${log[0] === "어인섬" ? "코팅된 선박에 동승" : "물자 없이 이동"} · 친구와의 유대 -5`,
        personality: { loyalty: 4 }, apply: (state) => { state.friendBond -= 5; return visit(state, log[0], 0); } },
      { id: "pose", label: `영구 지침으로 ${ro(life.eternalPose || log[0])} 간다`,
        when: (state) => Boolean(state.eternalPose) && state.eternalPose !== state.location && isNewWorld(state.eternalPose) === newWorld,
        available: (state) => state.supplies >= 15, risk: "물자 15 필요 · 가지고 있는 영구 지침 사용",
        personality: { caution: 4 }, apply: (state) => visit(state, state.eternalPose, 15) },
      { id: "buy_pose", label: `영구 지침을 사서 ${ro(poseDestination)} 간다`, when: () => Boolean(poseDestination),
        available: (state) => state.supplies >= 30, risk: "물자 30 필요 · 영구 지침 보유",
        personality: { ambition: 5 }, apply: (state) => { state.eternalPose = poseDestination; return visit(state, poseDestination, 30); } }
    ] };
}

export function yearRoll(seed, age) {
  let value = (seed ^ Math.imul(age, 0x9e3779b1)) >>> 0;
  value = Math.imul(value ^ value >>> 16, 0x7feb352d);
  value = Math.imul(value ^ value >>> 15, 0x846ca68b);
  return (value ^ value >>> 16) >>> 0;
}

// A one-line public summary of the canon crew's whereabouts in the same year, in this game's own words.
export function crewNews(life, age = life.age) {
  const before = life.birth.yearsBeforeCurrent - age;
  const line = before > 19 ? "아직 없다. 훗날의 선장도 태어나기 전이다."
    : before > 12 ? "훗날의 선장 루피는 이스트 블루 푸샤 마을의 어린아이다."
      : before === 12 ? "푸샤 마을을 떠나는 샹크스가 어린 루피에게 밀짚모자를 맡겼다."
        : before > 2 ? "루피는 코르보산에서 형제들과 자라며 바다로 나갈 날을 기다린다."
          : before === 2 ? "루피가 바다로 나가 동료를 모았다. 마린포드 전쟁 뒤 일당은 흩어져 수련에 들어갔다."
            : before === 1 ? "흩어진 일당이 각자의 섬에서 2년의 수련을 이어 간다."
              : before === 0 ? "다시 모인 일당이 신세계를 건너 엘바프에 닿았다."
                : "원작이 아직 그리지 않은 시간이다. 일당의 다음 항해는 공개되지 않았다.";
  const taken = life.people?.fruitOwner;
  return taken ? `${line} (이 세계선의 ${taken.owner}는 ${taken.fruit}를 먹지 않았다.)` : line;
}
