import { travelScene, yearRoll } from "./world.js";
import { eraAdventure } from "./adventures.js";
import { personalBeat } from "./people.js";

const DAYS = ["이틀 뒤", "사흘 뒤", "며칠 뒤", "나흘 뒤", "한 주쯤 뒤"];
const MOMENTS = [
  { title: "다시 묶은 밧줄", art: "deck", body: (life) => `${life.location}의 부두에서 낡은 밧줄을 새것으로 바꿨다. 먼 바다의 큰 사건이 들려와도 배는 오늘의 매듭으로 떠났다.` },
  { title: "항구의 식탁", art: "workbench", body: (life) => `${life.affiliation}의 사람들이 같은 식탁에 앉았다. 신문에서 싸움을 읽다가도 자기 몫의 국이 식기 전에 내일 일할 순서를 정했다.` },
  { title: "짧아진 물자 목록", art: "workbench", body: (life) => `${life.location}에서 식량과 약값을 다시 셌다. 다른 섬의 소문이 커진 만큼 작은 배에 돌아갈 몫도 신중히 나눠야 했다.` },
  { title: "밤 당직의 목소리", art: "deck", body: (life) => `${life.birth.name}은 어두운 물길을 살피며 당직을 섰다. 멀리서 불빛 하나가 보였지만, 다가올 배가 누구의 편인지는 아침까지 알 수 없었다.` },
  { title: "두 장의 서로 다른 신문", art: "workbench", body: "같은 사건을 다룬 신문 두 장의 제목이 달랐다. 항구 사람들은 직접 본 일과 전해 들은 일을 나눠 말하기 시작했다." },
  { title: "돌아온 전보벌레", art: "deck", body: "전보벌레가 한참 울리다가 잠들었다. 다시 깨워 받은 연락은 세계의 비밀이 아니라 다음 기항지에 필요한 돛감의 수량이었다." },
  { title: "낯선 섬의 표식", art: "deck", body: (life) => `${life.location}의 낡은 안내 표식이 바뀌었다. 처음 오는 배가 길을 잃지 않도록 누군가 이름과 방향을 새로 적어 두었다.` },
  { title: "친구의 안부", art: "workbench", body: (life) => `${life.friendName || "옛 친구"}의 이름이 편지 끝에 있었다. ${life.birth.name}은 큰 소식보다 그 사람이 오늘 무사한지를 먼저 확인했다.` },
  { title: "비를 피한 오후", art: "deck", body: "비가 잠깐 항해를 막았다. 선원들은 돛을 말리고 젖은 지도를 펴 놓았다. 출항을 못 한 날에도 해야 할 일은 남았다." },
  { title: "새로 온 일손", art: "workbench", body: "새 일꾼이 매듭을 반대로 묶었다. 한 번 웃고 다시 가르치는 사이 부두에는 조금 다른 손길이 더해졌다." },
  { title: "소문보다 가까운 일", art: "workbench", body: (life) => `${life.location}에 또 다른 전보가 닿았다. ${life.birth.name}은 내용을 적어 두고 눈앞의 고장 난 배부터 살폈다.` },
  { title: "작은 배의 출항", art: "deck", body: "이름난 배가 아니어도 떠나는 사람에게는 큰 날이었다. 부두에 선 이들은 무사히 돌아올 물때를 함께 확인했다." },
  { title: "동료의 다른 생각", art: "deck", body: "같은 소식을 듣고도 동료는 다른 판단을 내렸다. 누가 옳은지 결론 내리기보다 각자 지킬 사람의 이름을 먼저 말했다." },
  { title: "장부에 남은 한 줄", art: "workbench", body: (life) => `${life.birth.name}은 지난 항해에서 쓴 물자를 한 줄씩 적었다. 영웅의 이름은 신문에 남고, 다음 배를 띄우는 숫자는 장부에 남았다.` },
  { title: "바늘이 가리킨 곳", art: "deck", body: "기록지침이 흔들리는 동안 선원들은 물통을 채웠다. 다음 섬을 알아도 거기까지 버틸 방법은 별도로 마련해야 했다." },
  { title: "거래가 끝난 저녁", art: "workbench", body: "상인은 값이 오른 이유를 길게 설명했다. 일꾼들은 가격보다 오늘 필요한 양을 다시 물었다. 저녁이 되자 창고 문이 닫혔다." },
  { title: "항로를 모르는 손님", art: "deck", body: "방문객이 섬의 지름길을 물었다. 가장 짧은 길과 가장 안전한 길이 달라서, 부두 사람들은 둘 다 알려 주었다." },
  { title: "수리할 순서", art: "workbench", body: "세 척의 배가 한꺼번에 수리를 청했다. 가장 큰 배부터 고치자는 말에 작은 배의 선장이 찡그렸다. 일꾼들은 손상된 곳부터 살폈다." },
  { title: "잠깐 비운 자리", art: "deck", body: (life) => `${life.birth.name}이 잠시 자리를 비운 사이 동료가 일을 이어 했다. 돌아와 보니 서로 다른 방법으로도 같은 매듭을 만들 수 있었다.` },
  { title: "약 한 봉지", art: "workbench", body: "작은 상처를 치료할 약이 모자랐다. 큰 배가 오기 전에도 마을 사람은 아프다는 사실을 장부에 남겼다." },
  { title: "대답 없는 편지", art: "workbench", body: "지난번에 보낸 편지는 아직 답이 없었다. 기다리는 사람은 배가 늦는 이유를 짐작했지만, 확인되지 않은 불행을 먼저 쓰지 않았다." },
  { title: "서로 다른 깃발", art: "deck", body: "낯선 깃발의 배 두 척이 같은 부두를 원했다. 항구 사람들은 이름보다 먼저 실은 물자와 다친 사람이 있는지를 물었다." },
  { title: "길어진 그림자", art: "deck", body: "해가 낮아질수록 창고의 그림자가 길어졌다. 먼 곳의 전쟁 이야기는 잠시 멎었고, 일꾼들은 내일 쓸 나무를 안으로 옮겼다." },
  { title: "빈 의자 하나", art: "workbench", body: "식탁의 빈 의자에 누구를 앉힐지 정하지 못했다. 돌아올 사람을 기다리는 일에도 서로 다른 시간이 필요했다." },
  { title: "기다린 물때", art: "deck", body: "지금 떠나면 빠르다는 선원도 있었다. 그러나 물때가 바뀌길 기다린 뒤에야 짐을 실을 수 있었다. 늦은 출항이 곧 잘못은 아니었다." },
  { title: "새로 적은 가격", art: "workbench", body: "장터의 물값이 바뀌었다. 상인은 먼 사건을 이유로 들었고 주민은 가까운 우물을 가리켰다. 서로의 계산이 맞지 않는 날이었다." },
  { title: "누구의 실수인가", art: "workbench", body: "젖은 물자가 창고에서 발견됐다. 책임자를 찾는 소리가 먼저 나왔지만, 빗물이 어디로 흘렀는지 확인하는 일이 더 급했다." },
  { title: "늦은 낮잠", art: "deck", body: "당직을 마친 사람이 부두 그늘에서 잠들었다. 전보벌레도 그 옆에서 잠깐 울다 말았다. 오후의 일은 깨어 있는 사람들이 나눴다." },
  { title: "깃발을 꿰맨 날", art: "workbench", body: (life) => `${life.affiliation}의 낡은 깃발에 작은 구멍이 났다. 새 깃발을 살지 꿰맬지 의논하다가, 결국 바늘을 든 사람이 먼저 일을 시작했다.` },
  { title: "항구의 웃음소리", art: "deck", body: "짐을 잘못 내린 선원이 자기 배 이름을 크게 외쳤다. 한바탕 웃고 짐을 다시 옮겼다. 저녁에는 모두 어느 배였는지 정확히 기억했다." },
  { title: "지도 바깥의 길", art: "deck", body: "오래된 해도에 없는 얕은 물길이 보였다. 누구도 바로 배를 밀어 넣지 않았다. 낯선 길을 발견한 하루와 그 길을 쓰는 하루는 달랐다." }
];


// Rule 11 adds dailies with their own small choices, so long stretches of the canon era are not all reading.
const MOMENTS_V11 = [
  { title: "갈매기가 떨어뜨린 신문", art: "deck", body: "뉴스 쿠가 떨어뜨린 신문 사이로 새 수배서 몇 장이 미끄러져 나왔다. 처음 보는 얼굴과 낯익은 얼굴이 섞여 있었다.",
    choices: [{ id: "pin", label: "수배서를 부두 게시판에 붙인다", risk: "지역의 신뢰가 오를 수 있음", personality: { loyalty: 3 }, apply: (s) => { s.trust += 5; return "사람들이 게시판 앞에 모여 이름을 하나씩 읽었다."; } },
      { id: "keep", label: "몰래 한 장 챙겨 둔다", risk: "언젠가 쓸모가 있을지 모름", personality: { freedom: 3 }, apply: (s) => { s.skill += 3; return "접어 넣은 수배서의 얼굴을 밤마다 한 번씩 떠올렸다."; } }] },
  { title: "비싸진 기록지침", art: "workbench", body: "위대한 항로로 가려는 신참 해적이 늘면서 기록지침 값이 두 배로 뛰었다. 상인은 다음 배가 언제 올지 모른다고 했다.",
    choices: [{ id: "buy", label: "여분 하나를 미리 사 둔다", cost: 10, risk: "물자가 든다", personality: { caution: 4 }, apply: (s) => { s.supplies -= 10; s.skill += 5; return "바늘이 둘이면 길을 잃을 걱정도 반이 됐다."; } },
      { id: "haggle", label: "값을 깎아 본다", risk: "결과는 알 수 없음", personality: { ambition: 3 }, apply: (s) => { if (yearRoll(s.seed ^ 0x51, s.canonDailyIndex) % 2) { s.supplies += 5; return "상인이 졌다는 듯 웃으며 덤까지 얹어 주었다."; } return "상인은 끝까지 버텼다. 오늘은 빈손으로 돌아섰다."; } }] },
  { title: "밀짚모자를 흉내 내는 아이들", art: "deck", body: "부두의 아이들이 낡은 밀짚모자를 돌려 쓰며 해적 놀이를 했다. 서로 자기가 선장이라며 다투는 중이었다.",
    choices: [{ id: "play", label: "해군 역할을 맡아 준다", risk: "친구와의 유대가 오를 수 있음", personality: { empathy: 4 }, apply: (s) => { s.friendBond += 5; return "한참을 쫓겨 다닌 끝에 아이들에게 붙잡혔다. 모두 숨이 차도록 웃었다."; } },
      { id: "story", label: "진짜 바다 이야기를 들려준다", risk: "아이들이 귀를 기울임", personality: { loyalty: 3 }, apply: (s) => { s.trust += 5; return "아이들은 이야기가 끝나자 언젠가 바다로 나가겠다고 약속했다."; } }] },
  { title: "항구에 들른 낯선 군함", art: "deck", body: "평소 보지 못한 깃발의 군함이 물을 채우러 들렀다. 수병들은 말을 아꼈고 장교 하나가 부두의 배들을 오래 바라보았다.",
    choices: [{ id: "trade", label: "물과 식량을 팔아 준다", risk: "물자가 늘 수 있음", personality: { ambition: 3 }, apply: (s) => { s.supplies += 10; return "장교는 값을 깎지 않았다. 떠나면서 다음 항로의 날씨를 귀띔해 주었다."; } },
      { id: "avoid", label: "배를 뒤쪽 부두로 옮긴다", risk: "눈에 띄지 않음", personality: { caution: 4 }, apply: (s) => { s.health += 3; return "군함이 떠날 때까지 조용히 그물을 손질했다."; } }] },
  { title: "주점의 무용담", art: "workbench", body: "주점 한쪽에서 누군가 밀짚모자와 같은 배를 탔었다고 떠들었다. 듣는 사람마다 표정이 달랐다.",
    choices: [{ id: "buy", label: "술 한 잔 사고 끝까지 듣는다", cost: 5, risk: "이야기가 진짜일지는 모름", personality: { freedom: 3 }, apply: (s) => { s.supplies -= 5; s.skill += 3; return "절반은 거짓말 같았지만 바다 이야기 하나는 진짜였다."; } },
      { id: "doubt", label: "허풍이라며 웃어넘긴다", risk: "주점 분위기가 식을 수 있음", personality: { caution: 3 }, apply: () => "사내는 머쓱하게 잔을 비웠다. 그래도 이야기는 다음 테이블로 옮겨 갔다." }] },
  { title: "폭풍이 지나간 해변", art: "deck", body: "밤새 폭풍이 지나간 해변에 부서진 상자와 밧줄이 잔뜩 떠밀려 왔다. 어느 배의 것인지는 알 수 없었다.",
    choices: [{ id: "collect", label: "쓸 만한 것을 줍는다", risk: "물자가 늘 수 있음", personality: { ambition: 3 }, apply: (s) => { s.supplies += 8; return "멀쩡한 밧줄 두 타래와 젖은 통조림 몇 개를 건졌다."; } },
      { id: "search", label: "조난자가 없는지 먼저 살핀다", risk: "시간이 걸림", personality: { empathy: 5 }, apply: (s) => { s.trust += 6; return "바위 틈에서 지친 선원 하나를 찾아 마을로 업고 왔다."; } }] },
  { title: "새 현상금 소식에 술렁인 부두", art: "workbench", body: "새로 나온 수배서 금액을 두고 부두가 술렁였다. 누군가는 겁을 먹었고, 누군가는 언젠가 저 금액을 넘기겠다고 했다.",
    choices: [{ id: "dream", label: "언젠가의 자기 금액을 상상한다", risk: "야망이 자람", personality: { ambition: 5 }, apply: () => "수배서 속 숫자 옆에 자기 얼굴을 대 보았다. 동료가 등을 툭 쳤다." },
      { id: "worry", label: "가족에게 조심하라는 편지를 쓴다", risk: "양육자와의 유대가 오를 수 있음", personality: { caution: 4 }, apply: (s) => { s.bond += 5; return "답장에는 오히려 이쪽 걱정이 가득했다."; } }] }
];

// Some arcs follow closely; others leave space for several ordinary scenes.
export function canonGapFor(life, phase, step) {
  const salt = phase === "before" ? 0x31b7c5a9 : 0x7da4e26f;
  if (life.creationVersion >= 10) return [1, 2, 1, 3, 2, 1, 2, 0, 3, 1][yearRoll(life.seed ^ salt, step) % 10];
  if (phase === "before") return [0, 1, 2, 0, 3, 1][yearRoll(life.seed ^ salt, step) % 6];
  const gap = [1, 2, 3, 1, 0, 2, 1, 3][yearRoll(life.seed ^ salt, step) % 8];
  const previousWasZero = step > 0 && yearRoll(life.seed ^ salt, step - 1) % 8 === 4;
  return gap === 0 && (step === 0 || previousWasZero) ? 1 : gap;
}

export function canonInterludeScene(life) {
  if (life.creationVersion < 5 || life.canonGapRemaining <= 0) return null;
  const time = DAYS[yearRoll(life.seed ^ 0x298ca7d3, life.canonDailyIndex) % DAYS.length];
  if (life.leftHome && !life.homebound && yearRoll(life.seed ^ 0x52ac417e, life.canonDailyIndex) % 8 === 0) {
    const voyage = travelScene(life, life.age);
    return { ...voyage, id: `life_canon_daily_${life.canonDailyIndex}`, act: 3, canonDaily: true,
      timeLabel: `${time} · ${life.location}`, choices: [...voyage.choices,
        { id: "stay", label: "이번 물때는 여기서 지낸다", risk: "지역의 신뢰 +5 · 현재 섬에 머묾",
          personality: { caution: 3 }, apply: (state) => { state.trust += 5; return "다음 바늘이 움직일 때까지 이곳 사람들의 일을 도왔다."; } }] };
  }
  const v11 = life.creationVersion >= 11;
  if (v11) {
    // Every few slots the era lets a mishap, danger or a recurring person's scene through.
    const roll = yearRoll(life.seed ^ 0x2d4f81b3, life.canonDailyIndex) % 5;
    const slotBase = { age: life.age, act: 3, species: "all", yearly: true, canonDaily: true, timeLabel: `${time} · ${life.location}` };
    const event = roll === 0 ? eraAdventure(life, life.canonDailyIndex, slotBase) : roll === 1 ? personalBeat(life, life.age, slotBase) : null;
    if (event) return { ...event, canonDaily: true, timeLabel: `${time} · ${life.location}` };
  }
  const recent = life.journal.slice(-10).map((entry) => entry.title);
  const pool = v11 ? [...MOMENTS, ...MOMENTS_V11] : MOMENTS;
  // Rule 11 also avoids any daily already seen in this life until the pool runs out.
  const seenTitles = v11 ? new Set(life.journal.map((entry) => entry.title)) : new Set();
  let index = yearRoll(life.seed ^ 0x5cd98e41, life.canonDailyIndex) % pool.length;
  for (let tries = 0; tries < pool.length && (seenTitles.has(pool[index].title) || recent.includes(pool[index].title)); tries += 1) index = (index + 1) % pool.length;
  while (recent.includes(pool[index].title)) index = (index + 1) % pool.length;
  const moment = pool[index];
  const decision = !moment.choices && yearRoll(life.seed ^ 0x4629fb10, life.canonDailyIndex) % (v11 ? 3 : 7) === 0;
  return { id: `life_canon_daily_${life.canonDailyIndex}`, age: life.age, act: 3, species: "all",
    yearly: true, urgent: true, canonDaily: true, art: moment.art, title: moment.title,
    timeLabel: `${time} · ${life.location}`, body: moment.body,
    ...(moment.choices ? { choices: moment.choices } : {}),
    ...(decision ? { choices: [
      { id: "listen", label: "곁의 사람과 오늘 일을 함께 정한다", risk: "친구와의 유대 +5", personality: { empathy: 3, loyalty: 3 },
        apply: (state) => { state.friendBond += 5; return "서로 듣지 못했던 사정을 나누고 내일의 순서를 정했다."; } },
      { id: "prepare", label: "다음 일을 위한 도구를 먼저 챙긴다", risk: "기술 +5", personality: { caution: 3 },
        apply: (state) => { state.skill += 5; return "도구를 손보니 다음 날의 첫 일이 조금 수월해졌다."; } }
    ] } : {}) };
}
