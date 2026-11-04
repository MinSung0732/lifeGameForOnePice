// Named stops follow places shown in the original story; the exact voyage is this game's fiction.
const BLUE_ROUTE = ["리버스 마운틴", "쌍둥이 언덕", "위스키 피크", "리틀 가든", "드럼섬", "알라바스타 · 나노하나", "자야 · 모크 타운", "롱 링 롱 랜드", "워터 세븐", "샤본디 제도", "어인섬", "드레스로자", "그린 비트", "조", "스핑크스 섬", "엘바프"];
const GRAND_ROUTE = BLUE_ROUTE.slice(6);
const NEW_ROUTE = ["스핑크스 섬", "드레스로자", "그린 비트", "조", "엘바프", "하치노스 근해", "와노국 외해", "홀케이크 아일랜드 외해"];

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
  { id: "kureha", place: "드럼섬", earliest: 30, latest: 3, name: "닥터 쿠레하", canon: "https://one-piece.com/character/Dr_Kureha/index.html",
    body: "드럼섬에서 오래 일한 의사 닥터 쿠레하를 만났다. 그는 환자의 몸보다 먼저 여행 준비가 허술하다고 지적했다.",
    choices: [
      { id: "treat", label: "치료와 진찰을 부탁한다", available: (life) => life.supplies >= 20, risk: "물자 20 필요 · 건강 +20", personality: { caution: 5 }, apply: (life) => { life.supplies -= 20; life.health += 20; return "진찰은 거칠었지만 돌아갈 힘이 생겼다."; } },
      { id: "listen", label: "준비에 관한 말을 듣는다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "약보다 먼저 필요한 물자와 쉬는 날을 적었다."; } }
    ] },
  { id: "crocus", place: "쌍둥이 언덕", earliest: 24, latest: 3, name: "크로커스", canon: "https://one-piece.com/character/Crocus/index.html",
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
  return ENCOUNTERS.find((entry) => life.location === entry.place && beforePresent <= entry.earliest && beforePresent >= entry.latest && !life.seen.includes(`life_meet_${entry.id}`))?.id || null;
}

export function encounterScene(life) {
  const encounter = ENCOUNTERS.find((entry) => entry.id === life.pendingEncounter);
  if (!encounter) throw new Error("만남 기록을 찾을 수 없습니다.");
  return { id: `life_meet_${encounter.id}`, age: life.age, act: 2, species: "all", yearly: true, encounter: true,
    art: "deck", title: `${encounter.name}와의 마주침`, body: encounter.body, canon: encounter.canon, choices: encounter.choices };
}

export function travelScene(life, age) {
  const route = routeFor(life);
  const nearIndex = (life.routeIndex + 1) % route.length;
  const farIndex = (life.routeIndex + 2) % route.length;
  function visit(state, index, cost) {
    state.routeIndex = index;
    state.location = route[index];
    state.age = age;
    state.travelHistory.push(state.location);
    state.supplies -= cost;
    state.pendingEncounter = encounterAt(state);
    return `${state.birth.name}의 배는 ${state.location}에 닿았다. 새 기항지의 물길과 사람을 살피기 시작했다.`;
  }
  return { id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true, art: "deck",
    title: life.creationVersion === 1 ? "다음 기항지를 고르다" : `${life.location}에서의 출항`,
    body: `${life.location}에서 다음 항로를 정할 때가 왔다. 기록지침과 동행의 준비를 확인했다. 먼 섬으로 갈수록 식량과 배를 손볼 물자가 더 필요했다.`, choices: [
      { id: "near", label: `${route[nearIndex]}으로 간다`, available: (state) => state.supplies >= 10, risk: "물자 10 필요 · 가까운 항로", personality: { freedom: 5 }, apply: (state) => visit(state, nearIndex, 10) },
      { id: "far", label: `${route[farIndex]}으로 긴 항해를 한다`, available: (state) => state.supplies >= 20, risk: "물자 20 필요 · 긴 항로", personality: { ambition: 7, freedom: 5 }, apply: (state) => visit(state, farIndex, 20) },
      { id: "convoy", label: `동행 선단과 ${route[nearIndex]}으로 간다`, risk: "물자 없이 이동 · 친구와의 유대 -5", personality: { loyalty: 4, freedom: -3 }, apply: (state) => { const result = visit(state, nearIndex, 0); state.friendBond -= 5; return result; } }
    ] };
}
