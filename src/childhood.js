import { yearRoll } from "./world.js";

const HOME = [
  { title: "장터가 열린 아침", art: "childMarket", body: (life) => `${life.birth.home}의 장터에는 오늘 처음 보는 물건이 놓였다. ${life.birth.name}은 물건보다 그것을 가져온 사람들의 서로 다른 말투를 오래 기억했다.` },
  { title: "약 냄새가 나는 집", art: "childClinic", body: (life) => `동네 치료실의 문이 바쁜 날에도 열려 있었다. ${life.birth.name}은 다친 사람보다 먼저 물을 데우는 손과 빈자리를 챙기는 손을 보았다.` },
  { title: "식탁 위의 지도", art: "childChart", body: (life) => `양육자가 ${life.birth.home} 밖의 길이 그려진 지도를 폈다. ${life.birth.name}은 먼 섬의 이름보다 집으로 돌아오는 표시가 어디인지 먼저 찾았다.` },
  { title: "축제를 앞둔 식탁", art: "childFestival", body: (life) => `${life.birth.home}의 공동 식탁에 그릇이 하나씩 늘었다. ${life.birth.name}은 음식을 맛보기보다 누가 어떤 가면을 만들었는지 묻고 다녔다.` },
  { title: "처음 본 기항선", art: "childInlet", body: (life) => `${life.birth.home}에 낯선 배가 잠시 머물렀다. ${life.birth.name}은 배의 이름을 알아내지 못했지만, 돌아가는 사람마다 다른 이야기를 들려준다는 걸 알았다.` },
  { title: "불이 켜지는 순서", art: "childLantern", body: (life) => `해가 지자 ${life.birth.home}의 집들이 하나씩 불을 켰다. ${life.birth.name}은 같은 길도 밤에는 다른 얼굴로 보인다는 것을 알았다.` }
];

const FRIENDS = [
  { title: "반씩 나눈 간식", art: "childMarket", body: "장터에서 간식 하나를 두고 또래와 마주쳤다. 누가 먼저 손을 뻗었는지는 곧 잊혔지만, 둘은 다음 장날에도 함께 앉을 자리를 정했다." },
  { title: "지도를 거꾸로 든 친구", art: "childChart", body: "낡은 지도를 거꾸로 들고 길을 찾던 또래와 웃음이 터졌다. 둘은 알지 못하는 길을 서로에게 아는 척하지 않기로 했다." },
  { title: "따뜻한 물 한 그릇", art: "childClinic", body: "친구가 아픈 이웃을 기다리며 치료실 앞에 앉아 있었다. 함께 물을 가져다준 뒤, 둘은 기다림이 끝날 때까지 곁을 지켰다." },
  { title: "축제 가면의 주인", art: "childFestival", body: "서로의 가면을 바꿔 쓴 채 친구와 장터를 한 바퀴 돌았다. 누가 누구인지 알아보는 사람보다 먼저 웃는 사람이 많았다." },
  { title: "닻을 세는 친구", art: "childInlet", body: "또래와 함께 낯선 배의 닻을 세었다. 둘은 배가 어디서 왔는지 맞히지 못했지만, 물어볼 때는 함께 가기로 했다." },
  { title: "같은 등불 아래", art: "childLantern", body: "돌아가는 길의 등불이 꺼지자 또래가 손에 든 작은 불빛을 내밀었다. 둘은 집에 닿을 때까지 오늘 본 이상한 구름 이야기를 주고받았다." }
];

const PRACTICE = [
  { title: "약초를 고르는 오후", art: "childClinic", body: "치료실에서 말린 약초가 뒤섞였다. 어른은 누가 아픈지 묻기 전에 물건의 이름부터 다시 맞춰 보자고 했다.", choices: [
    { id: "learn", label: "모양과 냄새를 비교해 분류한다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "작은 차이를 적어 두니 다음에는 약초를 더 빨리 찾을 수 있었다." },
    { id: "help", label: "기다리는 이웃에게 물과 자리를 마련한다", risk: "친구와의 유대 +5 · 지역의 신뢰 +10", effects: { friendBond: 5, trust: 10 }, personality: { empathy: 6 }, result: "진료가 늦어지는 동안 기다리는 사람과 함께 있었다." }
  ] },
  { title: "길을 잘못 그린 지도", art: "childChart", body: "오래된 지도의 길 하나가 실제와 달랐다. 어른들은 다음 배가 오기 전에 표시를 고쳐 두려 했다.", choices: [
    { id: "learn", label: "예전 기록과 새 표식을 대조한다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "다른 사람의 기억을 맞춰 틀린 길목을 찾아냈다." },
    { id: "help", label: "길을 아는 이웃에게 차례로 물어본다", risk: "친구와의 유대 +5 · 지역의 신뢰 +10", effects: { friendBond: 5, trust: 10 }, personality: { empathy: 4, loyalty: 4 }, result: "서로 다르게 기억한 길을 하나씩 확인했다." }
  ] },
  { title: "장터의 첫 계산", art: "childMarket", body: "상인이 자리를 비운 사이 손님들이 몰렸다. 계산을 틀리면 작은 좌판의 하루 수입이 달라질 수 있었다.", choices: [
    { id: "learn", label: "가격표와 받은 돈을 천천히 맞춘다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "한 사람씩 기다려 달라고 말하고 장부의 숫자를 맞췄다." },
    { id: "help", label: "줄을 정리하고 무거운 꾸러미를 나른다", risk: "물자 +5 · 지역의 신뢰 +10", effects: { supplies: 5, trust: 10 }, personality: { empathy: 4, loyalty: 4 }, result: "상인이 돌아왔을 때 물건과 손님 모두 제자리에 있었다." }
  ] },
  { title: "등불을 켜는 차례", art: "childLantern", body: "해가 지기 전에 길목의 등불을 살펴야 했다. 불빛이 닿지 않는 곳은 밤에 돌아오는 사람들이 먼저 알아챘다.", choices: [
    { id: "learn", label: "꺼진 등불의 심지를 손본다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "불이 켜지는 원리를 배우자 고장 난 곳이 눈에 들어왔다." },
    { id: "help", label: "친구와 함께 어두운 길을 알린다", risk: "친구와의 유대 +10 · 지역의 신뢰 +5", effects: { friendBond: 10, trust: 5 }, personality: { loyalty: 5 }, result: "돌아오는 사람들은 다른 길을 골라 무사히 집에 닿았다." }
  ] },
  { title: "전보벌레의 엉뚱한 말", art: "childMarket", body: "전보벌레가 옆 가게의 주문을 이쪽으로 전했다. 식량을 기다리던 사람과 약을 기다리던 사람이 서로의 짐을 받기 직전이었다.", choices: [
    { id: "learn", label: "받은 내용을 다시 읽고 주소를 맞춘다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "두 주소를 바꾸어 적고 전보벌레에게 다시 한 번 확인했다." },
    { id: "help", label: "두 가게를 찾아가 주문을 바로잡는다", risk: "친구와의 유대 +5 · 지역의 신뢰 +10", effects: { friendBond: 5, trust: 10 }, personality: { empathy: 5 }, result: "짐은 늦었지만 기다린 사람에게 맞는 물건으로 도착했다." }
  ] },
  { title: "축제 전날의 빈 자리", art: "childMarket", body: "작은 축제의 식탁이 차려지는 동안 한 이웃의 자리가 비어 있었다. 준비하는 사람들은 음식을 남길지 먼저 나눌지 의논했다.", choices: [
    { id: "learn", label: "남은 음식을 세어 오래 보관할 방법을 찾는다", risk: "기술 +10 · 물자 +5", effects: { skill: 10, supplies: 5 }, personality: { caution: 5 }, result: "먹을 만큼만 내고 남은 몫을 다음 날까지 지켰다." },
    { id: "help", label: "친구와 이웃의 안부를 확인하러 간다", risk: "친구와의 유대 +10 · 지역의 신뢰 +5", effects: { friendBond: 10, trust: 5 }, personality: { empathy: 6 }, result: "빈자리는 늦게 도착할 사람을 위한 자리로 남았다." }
  ] },
  { title: "뒤섞인 축제 가면", art: "childFestival", body: "축제 가면을 돌려놓던 날, 주인을 알 수 없는 가면이 몇 개 남았다. 어른들은 가면을 찾는 사람과 돌려줄 곳을 함께 기억해 두자고 했다.", choices: [
    { id: "learn", label: "가면 안쪽에 구별할 표식을 남긴다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "다음날부터 가면을 바꾸어 쓴 사람도 자기 것을 쉽게 찾았다." },
    { id: "help", label: "친구와 마을을 돌며 주인을 찾는다", risk: "친구와의 유대 +10 · 지역의 신뢰 +5", effects: { friendBond: 10, trust: 5 }, personality: { empathy: 5 }, result: "마지막 가면은 저녁에야 원래 주인에게 돌아갔다." }
  ] },
  { title: "물때가 남긴 상자", art: "childInlet", body: "기항지가 비운 자리에 작은 봉인 상자가 남았다. 물에 닿기 전에 보관해야 했지만 누구의 물건인지는 표시가 흐려져 있었다.", choices: [
    { id: "learn", label: "상자가 밀려온 위치와 물때를 적는다", risk: "기술 +10", effects: { skill: 10 }, personality: { caution: 5 }, result: "상자의 출발지를 찾을 단서를 기록에 남겼다." },
    { id: "help", label: "경비와 함께 맡길 곳을 찾는다", risk: "지역의 신뢰 +10 · 양육자와의 유대 +5", effects: { trust: 10, bond: 5 }, personality: { loyalty: 5 }, result: "누군가 찾아올 때까지 상자는 마을 보관소에 놓였다." }
  ] }
];

const SCHOOL = [
  { title: "해도에 없는 길", art: "childChart", body: "오래된 해도에는 최근 생긴 길이 없었다. 어른은 정답을 외우기보다 누가 언제 그 길을 확인했는지 물으라고 했다." },
  { title: "장터의 두 장부", art: "childMarket", body: "같은 물건을 판 두 상인의 장부가 서로 달랐다. 숫자를 맞추는 동안 값만큼이나 약속한 날짜가 중요하다는 것을 알았다." },
  { title: "치료실의 긴 하루", art: "childClinic", body: "다친 사람이 한꺼번에 찾아온 날, 먼저 아픈 사람을 가리는 일과 기다리는 사람에게 설명하는 일이 모두 필요했다." },
  { title: "축제가 끝난 뒤", art: "childFestival", body: "가면과 식탁을 치운 자리에 잃어버린 물건이 남았다. 놀던 날이 지나도 누군가는 마지막까지 자리를 돌봐야 했다." },
  { title: "기항선이 남긴 말", art: "childInlet", body: "낯선 선원이 길을 묻고 떠났다. 같은 바다를 지나온 사람도 지도를 다르게 읽는다는 것을 그날 알았다." },
  { title: "밤길의 약속", art: "childLantern", body: "등불을 고치는 사람이 돌아오는 시간을 알려 주었다. 기다리는 사람에게 시간을 전하는 일도 길을 밝히는 일의 일부였다." }
];

const TRAINING = [
  { title: "새로 그린 항로", art: "childChart", body: "연습 삼아 그린 항로에 빠진 표식이 있었다. 다시 그릴 시간은 있었지만, 다음 일을 맡으려면 오늘 안에 끝내야 했다.", choices: [
    { id: "practice", label: "재료를 써서 해도를 다시 그린다", cost: 10, risk: "기술 +10 · 물자 -10", effects: { skill: 10, supplies: -10 }, personality: { ambition: 5, caution: 4 }, result: "표식 하나씩 확인한 뒤 다음 사람도 읽을 수 있는 해도를 남겼다." },
    { id: "earn", label: "먼저 다른 기록 정리 일을 맡는다", risk: "물자 +10 · 건강 -10", effects: { supplies: 10, health: -10 }, personality: { ambition: 7, caution: -4 }, result: "품삯은 받았지만 늦은 밤까지 장부를 붙잡고 있어야 했다." },
    { id: "help", label: "친구와 서로의 경로를 맞춰 본다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", effects: { friendBond: 10, trust: 10 }, personality: { empathy: 5, loyalty: 6 }, result: "둘이 놓친 곳을 서로 찾아 주었다. 해도는 다음 날 함께 고쳤다." }
  ] },
  { title: "축제 뒤의 셈", art: "childFestival", body: "축제가 끝났는데도 계산이 맞지 않았다. 상인들은 그릇과 식량을 다시 세느라 가게 문을 늦게 열었다.", choices: [
    { id: "practice", label: "새 장부를 사서 항목을 다시 적는다", cost: 10, risk: "기술 +10 · 물자 -10", effects: { skill: 10, supplies: -10 }, personality: { ambition: 5, caution: 4 }, result: "어느 그릇이 누구 것인지 다음 축제에도 확인할 수 있게 됐다." },
    { id: "earn", label: "남은 좌판 정리 일을 맡는다", risk: "물자 +10 · 건강 -10", effects: { supplies: 10, health: -10 }, personality: { ambition: 7, caution: -4 }, result: "늦게까지 일을 마치고 받은 품삯으로 다음 날 식사를 샀다." },
    { id: "help", label: "상인과 친구의 기억을 함께 맞춘다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", effects: { friendBond: 10, trust: 10 }, personality: { empathy: 5, loyalty: 6 }, result: "기억이 다른 곳을 적어 두자 셈이 왜 달랐는지 보였다." }
  ] },
  { title: "귀항한 환자", art: "childClinic", body: "오래 항해한 배에서 열이 난 선원이 내렸다. 치료실은 사람을 돌보는 손과 약을 정리하는 손을 모두 찾았다.", choices: [
    { id: "practice", label: "약과 도구를 익히기 위해 물자를 쓴다", cost: 10, risk: "기술 +10 · 물자 -10", effects: { skill: 10, supplies: -10 }, personality: { ambition: 5, caution: 4 }, result: "치료사가 부르는 도구를 헤매지 않고 건넬 수 있었다." },
    { id: "earn", label: "다른 배의 짐 나르는 일을 맡는다", risk: "물자 +10 · 건강 -10", effects: { supplies: 10, health: -10 }, personality: { ambition: 7, caution: -4 }, result: "물자를 벌어 왔지만 하루가 끝나자 몸이 무거웠다." },
    { id: "help", label: "친구와 기다리는 가족을 돌본다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", effects: { friendBond: 10, trust: 10 }, personality: { empathy: 5, loyalty: 6 }, result: "환자가 치료받는 동안 가족이 혼자 기다리지 않게 됐다." }
  ] },
  { title: "낯선 배의 품삯", art: "childInlet", body: "처음 보는 배가 하루만 손을 빌려 달라고 했다. 할 일은 여러 가지였고 약속한 품삯은 해가 지기 전에 받아야 했다.", choices: [
    { id: "practice", label: "배의 장부를 배우며 필요한 도구를 산다", cost: 10, risk: "기술 +10 · 물자 -10", effects: { skill: 10, supplies: -10 }, personality: { ambition: 5, caution: 4 }, result: "장부에 적힌 짐과 실제 상자의 수를 맞춰 보았다." },
    { id: "earn", label: "하역 일을 끝까지 맡는다", risk: "물자 +10 · 건강 -10", effects: { supplies: 10, health: -10 }, personality: { ambition: 7, caution: -4 }, result: "품삯을 받았지만 다음 날 아침에는 팔을 쉬게 해야 했다." },
    { id: "help", label: "친구와 품삯 약속을 함께 확인한다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", effects: { friendBond: 10, trust: 10 }, personality: { empathy: 5, loyalty: 6 }, result: "둘이 들은 약속을 맞춰 두니 일을 마친 뒤 서로 다른 말을 할 일이 없었다." }
  ] }
];

const CRISES = [
  { key: "medicine", title: "사라진 약 꾸러미", art: "childClinic", body: "치료실에서 쓰려던 약 꾸러미가 보이지 않았다. 기다리는 환자는 있었고, 마지막으로 문을 닫은 사람은 누군지 서로 기억이 달랐다.",
    safe: ["어른들과 마지막 기록을 확인한다", "친구와의 유대 +5 · 지역의 신뢰 +5", { friendBond: 5, trust: 5 }, "기록을 나눠 보자 다른 치료실로 옮겼다는 말을 들을 수 있었다."],
    act: ["혼자 약의 행방을 좇아간다", "기술 30이 단서의 기준 · 헛걸음 위험", { skill: 5, trust: 10 }, "빈 상자에 붙은 표시를 따라가 약 꾸러미를 찾아왔다."],
    fail: ["건강 -5", { health: -5 }, "서두르다 잘못된 창고에서 넘어졌다. 약은 뒤따라온 어른들이 찾았다."],
    follow: ["치료실의 장부가 바뀌었다. 누구의 실수였는지를 따지기보다 다음 환자가 기다리지 않게 하는 일이 먼저였다.", "약의 위치가 확인되자 치료실은 다시 문을 열었다. 혼자 찾은 단서도 어른들의 확인을 거쳐 기록에 남았다.", "약은 찾아졌지만 다친 곳이 아물 때까지 며칠 쉬어야 했다."] },
  { key: "map", title: "지워진 길표시", art: "childChart", body: "여행자가 맡긴 지도에서 돌아오는 길만 지워져 있었다. 그가 떠나기 전에 틀린 길을 알려 주어야 했지만, 누가 지웠는지는 알 수 없었다.",
    safe: ["길을 아는 사람들을 불러 함께 확인한다", "지역의 신뢰 +10", { trust: 10 }, "서로 다른 지도를 맞춰 보니 안전한 길이 남아 있었다."],
    act: ["옛 표식을 따라 직접 길을 살핀다", "기술 30이 길 읽기의 기준 · 건강 손실 위험", { skill: 10 }, "오래된 표식 아래 새로 그은 선을 발견했다."],
    fail: ["건강 -5", { health: -5 }, "갈림길에서 발을 헛디뎠다. 여행자는 다른 길잡이와 떠났다."],
    follow: ["여행자는 지도를 고쳐 들고 떠났다. 마을에는 길을 함께 확인하던 사람들의 이름이 남았다.", "지워진 선 옆에 새 길을 표시했다. 다음 여행자는 한 사람의 기억에만 기대지 않게 됐다.", "넘어진 곳은 금세 나았지만, 모르는 길을 혼자 아는 척하지 않게 됐다."] },
  { key: "message", title: "밤중의 잘못된 전보", art: "childLantern", body: "전보벌레가 짧은 구조 요청을 전하더니 잠들었다. 말끝이 끊겨 장소를 알 수 없었다. 어른들은 불빛과 연락망부터 확인했다.",
    safe: ["받은 말을 정확히 적어 사람들과 나눈다", "양육자와의 유대 +10", { bond: 10 }, "서로 들은 말을 비교하자 다른 섬에서 온 전보임을 알았다."],
    act: ["등불을 들고 가까운 길목을 살핀다", "기술 30이 표식의 기준 · 건강 손실 위험", { skill: 5, trust: 10 }, "꺼진 등불 곁에 남은 발자국을 발견해 돌아오는 사람을 안내했다."],
    fail: ["건강 -5", { health: -5 }, "어두운 길에 걸려 넘어졌다. 어른들은 다른 연락망으로 사람의 위치를 확인했다."],
    follow: ["연락을 다시 받은 날, 마을은 잘못 들은 말보다 함께 확인한 순서를 기억했다.", "그날 밤의 등불 위치가 바뀌었다. 어두운 길에는 누구나 볼 수 있는 표식을 남겼다.", "등불을 들고 나간 일을 나무라는 사람도 있었다. 다친 곳을 돌보며 다음에는 먼저 사람을 부르기로 했다."] },
  { key: "festival", title: "축제의 빈 그릇", art: "childFestival", body: "축제 음식이 예상보다 빨리 떨어졌다. 새로 온 가족에게 돌릴 몫이 모자라자 누군가 그들이 너무 많이 가져갔다고 말했다.",
    safe: ["먼저 배분 기록과 남은 음식을 확인한다", "지역의 신뢰 +10", { trust: 10 }, "처음부터 인원 수를 잘못 셌다는 사실이 드러났다."],
    act: ["직접 다른 식탁에서 음식을 구해 온다", "기술 30이 계산의 기준 · 물자 손실 위험", { friendBond: 10, trust: 5 }, "여분이 있는 식탁을 찾아 모두가 함께 먹을 몫을 나눴다."],
    fail: ["물자 -5", { supplies: -5 }, "서두르다 자기 집의 몫까지 내주었다. 어른들이 남은 음식을 다시 나눴다."],
    follow: ["그 가족은 다음 축제에도 찾아왔다. 잘못된 의심은 그날의 음식보다 오래 기억됐다.", "빈 그릇은 다시 채워졌다. 새로 온 가족도 다음번에는 준비할 양을 함께 세기로 했다.", "집의 식탁은 잠시 작아졌지만, 이웃이 다음 날 음식을 건넸다."] },
  { key: "flag", title: "낯선 깃발의 밤", art: "childInlet", body: "이름을 밝히지 않은 배가 해 질 무렵 기항했다. 상인이라기에는 짐을 급히 숨기는 모습이었다. 어른들은 아이들에게 가까이 가지 말라고 했다.",
    safe: ["경비를 맡은 어른들에게 본 것을 전한다", "양육자와의 유대 +5 · 지역의 신뢰 +5", { bond: 5, trust: 5 }, "어른들은 다른 사람의 말과 맞춰 본 뒤 배의 주인에게 신분을 물었다."],
    act: ["멀리서 짐을 내리는 곳을 살핀다", "기술 30이 단서의 기준 · 건강 손실 위험", { skill: 5, trust: 10 }, "배의 표식과 목적지를 기억해 마을 경비에게 알렸다."],
    fail: ["건강 -10", { health: -10 }, "들키지 않으려다 넘어져 다쳤다. 어른들이 아이를 데리고 물러났다."],
    follow: ["낯선 배는 오래 머물지 않았다. 그 뒤로는 깃발보다 실은 짐을 먼저 확인하게 됐다.", "표식을 적어 둔 덕에 그 배가 다른 항구에 닿았을 때도 정체를 확인할 수 있었다.", "몸의 상처가 나은 뒤에도 혼자 다가가지 말라는 말을 오래 들었다."] },
  { key: "friend", title: "친구에게 남은 누명", art: "childChart", body: "공동 작업장의 도구 하나가 사라졌다. 마지막으로 자리에 있던 친구가 의심받았지만, 친구는 말없이 빈 손을 내보였다.",
    safe: ["친구와 함께 그날의 순서를 되짚는다", "친구와의 유대 +10", { friendBond: 10 }, "어디에 앉았는지 차근차근 말하자 다른 작업대가 떠올랐다."],
    act: ["도구가 옮겨진 흔적을 직접 찾는다", "기술 30이 단서의 기준 · 친구 관계 손실 위험", { skill: 5, friendBond: 5, trust: 5 }, "다른 일꾼이 도구를 빌려 간 기록을 찾아냈다."],
    fail: ["친구와의 유대 -5", { friendBond: -5 }, "성급히 누군가를 지목했다가 친구의 표정이 굳었다. 기록은 어른들이 찾아냈다."],
    follow: ["도구는 돌아왔고 친구와도 다시 말을 나눴다. 의심을 거두는 데에는 찾는 시간보다 더 걸렸다.", "도구를 돌려놓은 뒤 둘은 다른 사람을 의심할 때의 말을 조심하게 됐다.", "도구를 찾은 날에도 친구는 한동안 말을 아꼈다. 사과는 다음 날에야 전할 수 있었다."] },
  { key: "parcel", title: "주인을 잃은 꾸러미", art: "childMarket", body: "장터 끝에 주소가 지워진 꾸러미가 놓여 있었다. 해가 지면 가게들이 문을 닫는다. 안에는 누군가 당장 써야 할 물건이 있을지도 몰랐다.",
    safe: ["공동 보관소에 맡기고 주인을 기다린다", "지역의 신뢰 +10", { trust: 10 }, "찾으러 온 사람이 꾸러미의 매듭을 알아보고 받아 갔다."],
    act: ["남은 표시를 보고 주인을 찾아 나선다", "기술 30이 단서의 기준 · 물자 손실 위험", { skill: 5, friendBond: 5 }, "손잡이의 색을 알아본 가게를 찾아 꾸러미를 전했다."],
    fail: ["물자 -5", { supplies: -5 }, "엉뚱한 집까지 옮기느라 가진 물자를 썼다. 꾸러미는 결국 보관소로 돌아왔다."],
    follow: ["다음 날 장터에는 이름을 쓰는 작은 표가 놓였다. 꾸러미를 찾는 일에 온 마을이 들썩일 필요가 없어졌다.", "전해 준 사람은 짧게 인사했다. 큰 사건은 아니었지만 돌아온 물건은 그 사람에게 중요했다.", "꾸러미의 주인은 늦게 나타났다. 다음에는 보관소의 도움을 먼저 받기로 했다."] },
  { key: "guest", title: "돌아오지 않은 손님", art: "childInlet", body: "마을에 하룻밤 머물던 손님이 약속한 시간에 돌아오지 않았다. 짐은 숙소에 남아 있었다. 다른 섬으로 떠났다고 단정하기에는 배가 없었다.",
    safe: ["숙소와 길목을 나눠 살피자고 제안한다", "양육자와의 유대 +5 · 지역의 신뢰 +5", { bond: 5, trust: 5 }, "여럿이 다른 길을 확인하니 손님이 치료실에서 쉬고 있었다."],
    act: ["마지막으로 봤던 길을 직접 따라간다", "기술 30이 길 찾기의 기준 · 건강 손실 위험", { skill: 5, friendBond: 5 }, "길가에 놓인 손님의 물통을 발견해 찾으러 온 사람들에게 길을 알렸다."],
    fail: ["건강 -5", { health: -5 }, "어두워지자 길을 잃었다. 찾아 나선 사람들이 손님과 아이를 모두 데리고 돌아왔다."],
    follow: ["손님은 다음 날 떠났다. 숙소에는 늦을 때 연락할 방법을 적어 두었다.", "물통을 찾은 자리에 작은 표식이 남았다. 길을 잃은 이가 다음번에는 쉬어 갈 수 있었다.", "돌아온 뒤 며칠은 양육자와 가까운 길만 걸었다. 그동안 길목의 이름을 새로 익혔다."] }
];

const FOLLOW_ART = { medicine: "childChart", map: "childMarket", message: "childClinic", festival: "childLantern",
  flag: "childChart", friend: "childClinic", parcel: "childChart", guest: "childMarket" };

export const childhoodQuiet = [
  ["작은 장날", "상인들이 서로의 물건을 만져 보고 값을 정했다. 어린 눈에는 큰 거래보다 흥정 뒤에 나눈 간식이 남았다.", "childMarket"],
  ["약초를 말리는 창", "치료실 창가에 약초가 가지런히 놓였다. 누가 아플지 몰라도 준비하는 날은 정해져 있었다.", "childClinic"],
  ["빈 지도 한 칸", "해도에서 비어 있는 곳을 발견했다. 모른다고 적어 둔 칸이 아는 척 그린 길보다 안전했다.", "childChart"],
  ["등불을 바꾼 저녁", "집으로 돌아오는 길에 등불의 위치가 바뀌어 있었다. 어른들이 길을 고치던 일을 낮에는 몰랐다.", "childLantern"],
  ["길을 묻는 손님", "처음 온 여행자가 시장으로 가는 길을 물었다. 짧은 길과 쉬운 길이 다르다는 말을 그날 배웠다.", "childMarket"],
  ["늦게 열린 상자", "작은 상자에는 다른 섬에서 온 소금과 씨앗이 있었다. 냄새를 맡으며 집에서 자라지 않는 것들을 생각했다.", "childMarket"],
  ["기다리는 의자", "치료실의 빈 의자는 금세 채워졌다. 순서를 양보한 이웃은 밖에서 바람을 쐬며 기다렸다.", "childClinic"],
  ["다른 색의 잉크", "한 장의 지도에 두 사람이 다른 색으로 길을 그었다. 잘못된 표시를 지우기 전에 왜 달라졌는지부터 물었다.", "childChart"],
  ["작은 밤의 약속", "친구와 서로의 집에 불이 켜지면 손을 흔들기로 했다. 멀리서는 보이지 않아도 가까운 길에서는 충분했다.", "childLantern"],
  ["숨겨 둔 동전", "장터 바닥에서 동전 하나를 주웠다. 누구의 것인지 알아내는 동안 손에 쥔 돈보다 주인을 찾는 이야기가 커졌다.", "childMarket"],
  ["꽃을 세는 아침", "치료실 앞 화분에 새로운 꽃이 폈다. 어제는 보이지 않았던 작은 변화가 오늘은 먼저 눈에 들어왔다.", "childClinic"],
  ["돌아오는 표시", "어른은 지도의 가장자리보다 집을 가리키는 점을 먼저 찾았다. 떠나는 길에도 돌아오는 길의 표시는 필요했다.", "childChart"],
  ["낮에 본 불빛", "등불을 손보던 사람이 낮에도 불을 켰다. 밤에 켜지지 않는 불은 지금 발견해야 한다고 했다.", "childLantern"],
  ["두 개의 가격표", "같은 물건을 두 상인이 다르게 불렀다. 사람들은 비싼 쪽의 사정도 싼 쪽의 사정도 들었다.", "childMarket"],
  ["비어 있는 약병", "치료실에서 빈 약병을 씻어 말렸다. 남은 것이 없다는 사실을 숨기지 않아야 다음 배에 부탁할 수 있었다.", "childClinic"],
  ["길 없는 섬", "해도의 한 구석에 이름만 있는 섬이 있었다. 그림을 그린 사람도 그곳을 직접 보지는 못했다고 했다.", "childChart"],
  ["낯선 발소리", "저녁 길목에서 낯선 발소리가 들렸다. 돌아온 여행자라는 걸 알고 나서야 기다리던 집의 문이 열렸다.", "childLantern"],
  ["장터의 맨 끝", "시장 끝의 작은 좌판은 손님이 적었다. 사람들이 지나가다 무엇을 찾는지 듣는 일도 장사의 일부였다.", "childMarket"],
  ["가면의 뒷면", "축제 가면 뒤쪽에는 만든 사람의 작은 표식이 있었다. 앞모습이 달라도 안쪽을 보면 누구 손을 거쳤는지 알 수 있었다.", "childFestival"],
  ["한 그릇 더", "공동 식탁의 냄비에 아직 음식이 남았다. 늦게 도착한 이웃은 모두가 자리를 치우기 전에 자기 몫을 받았다.", "childFestival"],
  ["이상한 노랫소리", "축제 준비 중 바다 쪽에서 처음 듣는 노래가 들렸다. 배에서 부른 것인지 언덕에서 부른 것인지는 끝내 알아내지 못했다.", "childFestival"],
  ["빈 닻자리", "어제 닿아 있던 낯선 배가 사라졌다. 모래 위의 닻자국만 남아 배가 정말 있었는지 다시 확인했다.", "childInlet"],
  ["봉인된 꾸러미", "기항선이 맡긴 꾸러미의 밀랍이 손대지 않은 모양 그대로였다. 마을 보관소는 주인이 올 때까지 봉인을 지켰다.", "childInlet"],
  ["물가의 작은 표식", "낯선 선원이 바위에 방향을 가리키는 선을 남겼다. 어른들은 누구를 위한 표식인지 확인한 뒤 그대로 둘지 정했다.", "childInlet"]
];

function selected(life, salt, pool, avoidArt) {
  let index = yearRoll(life.seed ^ salt, life.birth.yearsBeforeCurrent) % pool.length;
  for (let tries = 0; tries < pool.length && childhoodArt(life, pool[index].art) === avoidArt; tries += 1) {
    index = (index + 1) % pool.length;
  }
  return pool[index];
}

export function childhoodArt(life, art) {
  if (!["childMarket", "childLantern", "childFestival", "childInlet"].includes(art)) return art;
  return { 인간: art, 어인: "childUndersea", 밍크족: "childMink", "하늘섬 사람": "childSky", 거인족: "childGiant" }[life.birth.species];
}

function applyEffects(state, effects) {
  for (const [key, change] of Object.entries(effects)) state[key] += change;
}

function buildChoice(option, memory) {
  return { id: option.id, label: option.label, risk: option.risk, personality: option.personality,
    ...(option.cost ? { cost: option.cost } : {}),
    ...(option.needs ? { needs: option.needs, failRisk: option.failRisk,
      fail: (state) => { applyEffects(state, option.failEffects); state.childhoodMemory = { key: memory, outcome: "fail" }; return option.failResult; } } : {}),
    apply: (state) => { applyEffects(state, option.effects); if (memory) state.childhoodMemory = { key: memory, outcome: option.id }; return option.result; } };
}

function crisisChoices(crisis) {
  const [safeLabel, safeRisk, safeEffects, safeResult] = crisis.safe;
  const [actLabel, actRisk, actEffects, actResult] = crisis.act;
  const [failRisk, failEffects, failResult] = crisis.fail;
  return [
    buildChoice({ id: "safe", label: safeLabel, risk: safeRisk, effects: safeEffects, result: safeResult,
      personality: { empathy: 4, caution: 4 } }, crisis.key),
    buildChoice({ id: "act", label: actLabel, risk: actRisk, effects: actEffects, result: actResult,
      needs: { skill: 30 }, failRisk, failEffects, failResult, personality: { ambition: 5, caution: -3 } }, crisis.key)
  ];
}

export function childhoodScene(life, card) {
  if (life.creationVersion < 6 || !["life_home", "life_friend", "life_first_skill", "life_child_crisis", "life_after_storm", "life_school", "life_training"].includes(card.id)) return card;
  const home = selected(life, 0x7b201e51, HOME);
  const friend = selected(life, 0x6c31a773, FRIENDS, childhoodArt(life, home.art));
  const practice = selected(life, 0x19e6c2a1, PRACTICE, childhoodArt(life, friend.art));
  const crisis = selected(life, 0x5a7180e4, CRISES, childhoodArt(life, practice.art));
  const school = selected(life, 0x1d6ee143, SCHOOL);
  const training = selected(life, 0x24c1532b, TRAINING, childhoodArt(life, school.art));

  // Rule 25: this single Loguetown childhood route gains local color and a choice remembered years later.
  if (life.creationVersion >= 25 && life.birth.species === "인간" && life.birth.home === "이스트 블루 · 로그 타운") {
    if (card.id === "life_home") return { ...card, title: "수배서가 날아온 아침", art: "childMarket",
      body: "로그 타운의 장터에 해군이 놓친 수배서가 눈처럼 흩날렸다. 한 장이 생선 장수의 얼굴에 붙자 아이들은 해적 선장이 나타났다며 깔깔 웃었다. 그러나 항구의 어른들은 멀리 들어오는 낯선 깃발을 보자 웃음을 멈췄다." };

    if (card.id === "life_first_skill") return { ...card, title: "전보벌레가 뒤섞은 신호", art: "childInlet",
      body: "전보벌레가 해군 순찰선의 검문 명령과 상선의 구조 요청을 한꺼번에 따라 했다. 수평선에는 정체 모를 해적 깃발도 떠올랐다. 어른들이 항구를 지키는 사이, 너도 신호를 가리거나 안내등을 밝힐 수 있었다.",
      choices: practice.choices.map((option) => {
        const learned = option.id === "learn";
        const base = buildChoice({ ...option,
          label: learned ? "순찰선과 상선의 신호를 구분해 적는다" : "이웃과 함께 상선에 안전한 길을 알린다",
          result: learned ? "신호를 하나씩 구분해 기록했다. 헷갈리던 전보벌레도 마침내 정확한 말을 따라 했다."
            : "해안의 불빛을 따라 상선이 암초를 벗어났다. 선장은 이름을 물었고 사람들은 너를 기억했다." });
        return { ...base, apply: (state) => { const result = base.apply(state); state.loguetownSignal = option.id; return result; } };
      }) };

    if (card.id === "life_school") return { ...card, title: "항구에 남은 기억", art: "childChart",
      body: life.loguetownSignal === "learn"
        ? "몇 해 전 네가 구분해 적은 전보벌레 신호가 해군 초소의 장부에 남아 있었다. 새 수병이 상선의 신호를 해적의 암호로 오해하자, 경비는 그때의 기록을 펼쳐 보였다. 목소리 하나를 정확히 듣는 일이 바다에서는 중요했다."
        : "몇 해 전 네가 안내했던 상선이 다시 로그 타운에 들어왔다. 선장은 그날 불빛을 비춰 준 아이를 기억했다. 해군의 검문이 길어지자 선장은 네게 항구의 안전한 길을 알려 달라고 부탁했다." };

    if (card.id === "life_training") {
      const memory = life.loguetownSignal;
      const bonus = memory === "learn" ? { skill: 5 } : memory === "help" ? { trust: 5 } : null;
      const reminder = memory === "learn" ? "그때의 기록 덕분에 신호를 읽는 기술이 한층 늘었다."
        : "지난번 도움을 기억한 선장의 소개로 항구 사람들의 신뢰가 더해졌다.";
      return { ...card, title: "다시 울린 구조 신호", art: "childLantern",
        body: memory === "learn"
          ? "몇 해 전 신호를 헷갈렸던 전보벌레가 다시 울었다. 새로 온 상선이 암초에 접근했지만, 네가 남긴 신호표가 해군 순찰선의 장부에 있었다. 이번에는 누구도 경고를 잘못 듣지 않도록 해야 했다."
          : "몇 해 전 네가 길을 알려 준 상선이 구조 신호를 보내며 돌아왔다. 선장은 네 이름을 기억했고, 해군 순찰선도 항구 진입로를 물었다. 위험한 밤바다를 지나려면 이번에도 여러 사람의 손이 필요했다.",
        choices: training.choices.map((option) => {
          const labels = { practice: "구조 신호표를 다시 익힌다", earn: "순찰선의 보급 일을 맡는다", help: "상선과 해군에 함께 안전 항로를 알린다" };
          const results = { practice: "밤새 신호표를 고쳐 써서 다음 배도 알아볼 수 있게 했다.",
            earn: "군함과 상선 사이에서 물자를 옮기고 품삯을 받았다. 쉬는 시간은 줄었다.",
            help: "등불을 나눠 들자 상선과 순찰선이 차례로 암초를 빠져나왔다." };
          const base = buildChoice({ ...option, label: labels[option.id], result: results[option.id] });
          return { ...base, risk: bonus ? `${base.risk} · ${memory === "learn" ? "옛 신호 기록으로 기술 +5" : "옛 인연으로 지역의 신뢰 +5"}` : base.risk,
            apply: (state) => { const result = base.apply(state); if (bonus) applyEffects(state, bonus); return bonus ? `${result} ${reminder}` : result; } };
        }) };
    }
  }
  if (card.id === "life_home") {
    return { ...card, ...home, art: childhoodArt(life, home.art) };
  }
  if (card.id === "life_friend") {
    return { ...card, ...friend, art: childhoodArt(life, friend.art) };
  }
  if (card.id === "life_first_skill") {
    return { ...card, ...practice, art: childhoodArt(life, practice.art),
      choices: practice.choices.map((choice) => buildChoice(choice)) };
  }
  if (card.id === "life_school") return { ...card, ...school, art: childhoodArt(life, school.art) };
  if (card.id === "life_training" && life.creationVersion >= 30
    && ["어인", "밍크족"].includes(life.birth.species)) {
    const oldChoice = life.journal.find((entry) => entry.id === "life_first_skill")?.choice;
    const memory = practice.choices.find((choice) => choice.label === oldChoice)?.id;
    if (memory) {
      const learned = memory === "learn", place = life.birth.species === "어인" ? "어인섬의 물길" : "조의 숲길";
      return { ...card, ...training, art: childhoodArt(life, training.art),
        body: training.body + " " + place + "에서 " + (learned
          ? "어릴 때 기록해 두었던 표식을 다시 떠올렸다." : "함께 일을 나눴던 이웃들의 방법을 다시 떠올렸다."),
        choices: training.choices.map((choice) => {
          const built = buildChoice(choice);
          const bonus = learned && choice.id === "practice" ? { skill: 3 }
            : !learned && choice.id === "help" ? { friendBond: 3 } : null;
          return bonus ? { ...built,
            risk: built.risk + (learned ? " · 옛 기록으로 기술 +3" : " · 옛 협력으로 친구 유대 +3"),
            apply: (state) => {
              const result = built.apply(state); applyEffects(state, bonus);
              return result + (learned ? " 어린 날의 관찰이 기술에 보탬이 됐다." : " 오래된 협력의 기억이 동료와의 일을 도왔다.");
            }
          } : built;
        }) };
    }
  }
  if (card.id === "life_training") return { ...card, ...training, art: childhoodArt(life, training.art),
    choices: training.choices.map((choice) => buildChoice(choice)) };
  if (card.id === "life_child_crisis" || card.id === "life_after_storm") {
    const crisisArt = childhoodArt(life, crisis.art);
    const followArt = childhoodArt(life, FOLLOW_ART[crisis.key]);
    const art = card.id === "life_after_storm" ? followArt === crisisArt ? "childChart" : followArt : crisisArt;
    if (card.id === "life_child_crisis") return { ...card, title: crisis.title, art, body: crisis.body,
      choices: crisisChoices(crisis) };
    const outcomes = { safe: 0, act: 1, fail: 2 };
    const ending = life.childhoodMemory?.key === crisis.key ? life.childhoodMemory.outcome : "safe";
    return { ...card, title: `${crisis.title} 뒤`, art, body: crisis.follow[outcomes[ending]] };
  }
  return card;
}
