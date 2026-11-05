import { travelScene, yearRoll } from "./world.js";

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
  const recent = life.journal.slice(-10).map((entry) => entry.title);
  let index = yearRoll(life.seed ^ 0x5cd98e41, life.canonDailyIndex) % MOMENTS.length;
  while (recent.includes(MOMENTS[index].title)) index = (index + 1) % MOMENTS.length;
  const moment = MOMENTS[index];
  const decision = yearRoll(life.seed ^ 0x4629fb10, life.canonDailyIndex) % 7 === 0;
  return { id: `life_canon_daily_${life.canonDailyIndex}`, age: life.age, act: 3, species: "all",
    yearly: true, urgent: true, canonDaily: true, art: moment.art, title: moment.title,
    timeLabel: `${time} · ${life.location}`, body: moment.body,
    ...(decision ? { choices: [
      { id: "listen", label: "곁의 사람과 오늘 일을 함께 정한다", risk: "친구와의 유대 +5", personality: { empathy: 3, loyalty: 3 },
        apply: (state) => { state.friendBond += 5; return "서로 듣지 못했던 사정을 나누고 내일의 순서를 정했다."; } },
      { id: "prepare", label: "다음 일을 위한 도구를 먼저 챙긴다", risk: "기술 +5", personality: { caution: 3 },
        apply: (state) => { state.skill += 5; return "도구를 손보니 다음 날의 첫 일이 조금 수월해졌다."; } }
    ] } : {}) };
}
