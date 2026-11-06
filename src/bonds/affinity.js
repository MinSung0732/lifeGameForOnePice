// Rule 20 bond scenes: a canon contact who has grown fond of the protagonist shares a small personal moment.
// Each keeps the person as the manga shows them and adds no canon event. Windows use storyBefore:
// 2 = the voyage before the war, 1 = the two years apart, 0 = the New World.
const LIKE = { great: 10, good: 5, bad: -5 };
const CLOSE = { great: 12, good: 6, bad: -8 };

export default [
  // 몽키 D. 루피
  { id: "luffy_30", key: "luffy", threshold: 30, from: 2, art: "mishapFeast", title: "빈 접시 앞의 밀짚모자",
    body: "항구 식당에서 고기 접시가 산처럼 쌓인 탁자를 지나던 {name}의 소매를 누가 붙잡았다. 밀짚모자를 쓴 루피였다. 시시시 웃으며 반갑다고 하더니, 돈이 하나도 없다고 태연하게 말했다. 주인은 국자를 든 채 이쪽을 노려보고 있었다.",
    choices: [
      { id: "pay", label: "밥값을 대신 치러 준다", hint: "지갑은 가벼워지고 배는 든든해진다",
        check: { stat: "supplies", against: 40 }, personality: { empathy: 5, loyalty: 3 }, score: LIKE,
        outcomes: {
          great: { text: "값을 치르자 루피는 너 좋은 녀석이라며 남은 고기 한 덩이를 {name}에게 내밀었다. 그날 밤 식당은 둘의 웃음소리로 시끄러웠다.", effects: { friendBond: 10, supplies: -3 } },
          good: { text: "계산서는 생각보다 길었다. 루피는 고맙다며 꾸벅 고개를 숙이고 다음엔 자기가 사겠다고 했지만, 그 말을 믿는 사람은 아무도 없었다.", effects: { friendBond: 5, supplies: -6 } },
          bad: { text: "지갑을 털어도 모자랐다. 결국 둘이 나란히 설거지를 했고, 루피는 접시를 세 장이나 깨뜨렸다.", effects: { supplies: -10, health: -2 } }
        } },
      { id: "contest", label: "남은 빚을 걸고 먹기 시합을 제안한다", hint: "루피를 상대로 먹기 시합이라니",
        check: { stat: "health", against: 65 }, personality: { ambition: 5, freedom: 4 }, score: { great: 12, good: 6, bad: 2 },
        outcomes: {
          great: { text: "{name}은 끝까지 버텼다. 루피는 배가 풍선처럼 부푼 채 드러누워 너 굉장하다며 깔깔 웃었고, 구경하던 손님들이 박수를 쳤다.", effects: { friendBond: 12, health: 3 } },
          good: { text: "당연히 졌다. 그래도 루피는 이렇게 재밌게 먹은 건 오랜만이라며 {name}의 등을 퍽퍽 두드렸다.", effects: { friendBond: 6, health: -3 } },
          bad: { text: "세 접시째에서 {name}은 탁자에 이마를 박았다. 눈을 떴을 때 루피는 이미 떠났고, 계산서만 둘 몫으로 남아 있었다.", effects: { health: -8, supplies: -8 } }
        } },
      { id: "slip", label: "주인이 한눈판 틈에 함께 빠져나간다", hint: "웃음과 현상수배 전단은 한 끗 차이다",
        check: { stat: "skill", against: 50 }, personality: { freedom: 7, caution: -3 }, score: LIKE,
        outcomes: {
          great: { text: "뒷문으로 빠져나온 둘은 골목 끝까지 달려 숨을 몰아쉬다가 동시에 웃음을 터뜨렸다. 루피는 너 진짜 재밌다고 했다.", effects: { friendBond: 9, skill: 4 } },
          good: { text: "빠져나오긴 했지만 주인의 고함이 항구 끝까지 따라왔다. 한동안 그 거리에는 얼굴을 내밀 수 없었다.", effects: { friendBond: 5, trust: -4 } },
          bad: { text: "루피는 고무처럼 늘어나 지붕 위로 사라졌고, 붙잡힌 사람은 {name} 혼자였다. 항구 사람들 사이에 좋지 않은 소문이 돌았다.", effects: { trust: -10, supplies: -5 } }
        } }
    ] },
  { id: "luffy_60", key: "luffy", threshold: 60, from: 0, to: 0, art: "deck", title: "친구라고 부르는 목소리",
    body: "신세계의 어느 항구에서 질 나쁜 해적들이 {name}의 배를 둘러싸고 통행세를 요구했다. 그때 뒤에서 낯익은 목소리가 들렸다. 루피가 밀짚모자를 눌러쓰고 서 있었다. 내 친구한테 뭐 하는 거냐고 묻는 목소리가 낮았다.",
    choices: [
      { id: "side", label: "루피 옆에 나란히 선다", hint: "등을 맡기는 일은 등을 내놓는 일이다",
        check: { stat: "skill", against: 60 }, personality: { loyalty: 6, ambition: 4, caution: -3 }, score: CLOSE,
        outcomes: {
          great: { text: "싸움은 순식간에 끝났다. {name}이 맡은 쪽도 하나 남김없이 쓰러졌고, 루피는 너 강해졌다며 이를 드러내고 웃었다.", effects: { skill: 12, friendBond: 10 } },
          good: { text: "대부분은 루피가 날려 버렸지만 {name}도 제 몫은 해냈다. 터진 입술을 문지르며 웃는 루피의 얼굴이 오래 기억에 남았다.", effects: { skill: 6, friendBond: 6, health: -3 } },
          bad: { text: "{name}은 첫 합에서 나가떨어졌다. 루피가 대신 막아 섰지만, 정신을 차렸을 때 배의 돛대가 부러져 있었다.", effects: { health: -14, supplies: -6 } }
        } },
      { id: "own", label: "이건 내 싸움이라며 혼자 나선다", hint: "루피는 친구의 싸움을 존중한다",
        check: { stat: "health", against: 70 }, personality: { freedom: 6, ambition: 6 }, score: { great: 15, good: 8, bad: -2 },
        outcomes: {
          great: { text: "루피는 팔짱을 끼고 끝까지 지켜보기만 했다. 마지막 해적이 쓰러지자 고기나 먹으러 가자며 {name}의 어깨에 팔을 둘렀다.", effects: { skill: 14, trust: 8 } },
          good: { text: "간신히 이겼다. 비틀거리는 {name}을 루피가 붙잡아 주며 그래도 잘했다고 했다.", effects: { skill: 7, health: -5 } },
          bad: { text: "버티지 못했다. 쓰러지기 직전 루피가 끼어들어 남은 놈들을 날려 버렸고, {name}은 고마움과 부끄러움을 함께 삼켰다.", effects: { health: -15, trust: -4 } }
        } },
      { id: "calm", label: "항구가 부서지기 전에 협상으로 끝낸다", hint: "루피가 참아 줄 시간은 길지 않다",
        check: { stat: "trust", against: 55 }, personality: { caution: 6, empathy: 4 }, score: { great: 6, good: 3, bad: -6 },
        outcomes: {
          great: { text: "{name}의 말에 해적들은 루피의 얼굴을 다시 보더니 슬금슬금 물러났다. 항구 사람들은 부서진 것 하나 없는 부두를 보며 고개를 숙였다.", effects: { trust: 12, friendBond: 5 } },
          good: { text: "해적들은 물러났지만 루피는 싱겁다며 입을 삐죽였다. 그래도 저녁엔 같이 고기를 먹었다.", effects: { trust: 6, friendBond: 3 } },
          bad: { text: "협상이 길어지자 해적 하나가 먼저 칼을 뽑았다. 그다음은 루피의 주먹이었고, 부두 절반이 바다에 잠겼다.", effects: { trust: -10, supplies: -5 } }
        } }
    ] },

  // 롤로노아 조로
  { id: "zoro_30", key: "zoro", threshold: 30, from: 2, art: "deck", title: "길을 잃지 않았다는 검사",
    body: "항구 뒤편 술통 더미 사이에서 낮잠을 자던 조로가 {name}의 발소리에 한쪽 눈을 떴다. 배로 돌아가는 길이라고 했지만, 그가 가리킨 방향은 바다와 정반대인 산이었다. 본인은 길을 잃은 적이 없다고 우겼다.",
    choices: [
      { id: "guide", label: "모른 척 같은 방향이라며 앞장선다", hint: "체면을 지켜 주는 데도 요령이 든다",
        check: { stat: "trust", against: 40 }, personality: { empathy: 5, caution: 3 }, score: LIKE,
        outcomes: {
          great: { text: "조로는 투덜대면서도 순순히 따라왔다. 부두에 닿자 고맙다는 말 대신 술병 하나를 {name}에게 던져 주었다.", effects: { friendBond: 9, supplies: 4 } },
          good: { text: "중간에 두 번이나 조로를 놓쳤다. 겨우 배 앞에 세워 놓자 그는 원래 여기 오려 했다는 얼굴을 했다.", effects: { friendBond: 5, health: -2 } },
          bad: { text: "돌아보니 조로는 이미 사라졌고 {name}도 처음 보는 골목에서 헤맸다. 해가 다 지고서야 숙소로 돌아왔다.", effects: { health: -5, supplies: -4 } }
        } },
      { id: "sake", label: "술 한잔하자며 옆에 앉는다", hint: "조로보다 먼저 취하면 진다",
        check: { stat: "health", against: 55 }, personality: { freedom: 5, loyalty: 3 }, score: { great: 12, good: 5, bad: -3 },
        outcomes: {
          great: { text: "술통 하나가 비도록 둘은 말이 별로 없었다. 마지막 잔을 비운 조로가 너 꽤 마신다며 처음으로 웃었다.", effects: { friendBond: 12, health: 2 } },
          good: { text: "조로는 멀쩡했고 {name}은 휘청거렸다. 그래도 그는 쓰러지기 전에 숙소 앞까지 끌어다 주었다. 물론 반대편 숙소였다.", effects: { friendBond: 6, health: -4 } },
          bad: { text: "다음 날 아침 {name}은 머리가 깨질 듯 아팠고, 술값은 전부 {name}의 이름으로 달려 있었다.", effects: { health: -8, supplies: -6 } }
        } }
    ] },
  { id: "zoro_60", key: "zoro", threshold: 60, from: 0, to: 0, art: (life) => life?.creationVersion >= 20 ? "deckDuelChallenge" : "deck", title: "새벽 갑판의 수련",
    body: "신세계의 항구에서 다시 마주친 조로는 새벽마다 무거운 추를 들고 수련하고 있었다. 한참 {name}의 손을 보던 그가 칼을 쥐는 법이 엉망이라고 했다. 해가 뜨기 전까지만이라면 상대해 주겠다고 했다.",
    choices: [
      { id: "spar", label: "진검으로 상대해 달라고 청한다", hint: "조로는 봐주지 않는다",
        check: { stat: "skill", against: 70 }, personality: { ambition: 7, caution: -4 }, score: { great: 15, good: 8, bad: -2 },
        outcomes: {
          great: { text: "단 한 합이었지만 {name}의 칼끝이 조로의 옷깃을 스쳤다. 조로는 잠시 말이 없다가, 그 감각을 잊지 말라고만 했다.", effects: { skill: 15, health: -3 } },
          good: { text: "열 번 넘게 나가떨어졌다. 그래도 매번 일어서는 {name}을 보며 조로는 끝까지 칼을 거두지 않았다.", effects: { skill: 8, health: -6 } },
          bad: { text: "칼등에 맞았는데도 갈비뼈가 울렸다. 조로는 아직 이르다며 칼을 집어넣고 다시 추를 들었다.", effects: { health: -15 } }
        } },
      { id: "weights", label: "추 드는 수련부터 따라 한다", hint: "기초는 배신하지 않는다",
        check: { stat: "health", against: 50 }, personality: { loyalty: 4, caution: 4 }, score: CLOSE,
        outcomes: {
          great: { text: "해가 뜰 때까지 버틴 {name}에게 조로는 남은 술을 반 나눠 주었다. 그가 술을 나누는 일은 흔하지 않았다.", effects: { health: 10, skill: 6, friendBond: 4 } },
          good: { text: "팔이 덜덜 떨렸지만 끝까지 따라 했다. 조로는 내일도 오려면 오라고 하고는 그대로 갑판에 누워 잠들었다.", effects: { health: 5, skill: 4 } },
          bad: { text: "무리하다 허리를 삐끗했다. 조로는 혀를 차며 의사한테나 가 보라고 했다.", effects: { health: -10 } }
        } }
    ] },

  // 우솝
  { id: "usopp_30", key: "usopp", threshold: 30, from: 2, art: "childMarket", title: "부하 8천 명의 선장님",
    body: "항구 장터에서 우솝이 아이들에게 둘러싸여 자신에게 부하가 8천 명 있다는 이야기를 늘어놓고 있었다. {name}을 발견한 그는 눈짓으로 살려 달라는 신호를 보냈다. 아이들 하나가 그럼 그 부하들은 어디 있냐고 물었다.",
    choices: [
      { id: "playalong", label: "자신이 그 부하 중 하나라고 거든다", hint: "거짓말도 둘이면 이야기가 된다",
        check: { stat: "trust", against: 35 }, personality: { empathy: 4, freedom: 4 }, score: LIKE,
        outcomes: {
          great: { text: "{name}이 맞장구를 치자 이야기는 해왕류 백 마리를 쓰러뜨린 전설로 부풀었다. 아이들은 눈을 반짝였고 우솝은 몰래 엄지를 들어 보였다.", effects: { friendBond: 9, trust: 5 } },
          good: { text: "이야기가 산으로 갔지만 아이들은 즐거워했다. 우솝은 덕분에 살았다며 새총 탄 한 줌을 쥐여 주었다.", effects: { friendBond: 5, skill: 2 } },
          bad: { text: "둘의 이야기가 서로 어긋났다. 아이들이 거짓말쟁이라고 외치며 흩어지자 우솝은 {name}을 원망스럽게 쳐다봤다.", effects: { friendBond: -4, trust: -4 } }
        } },
      { id: "slingshot", label: "실력을 보여 달라며 과녁을 세운다", hint: "우솝의 진짜 자랑은 이야기가 아니다",
        check: { stat: "skill", against: 45 }, personality: { ambition: 4, loyalty: 3 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "{name}이 세운 과녁을 우솝은 장터 끝에서 단번에 꿰뚫었다. 아이들의 환호 속에서 그는 이번만큼은 거짓 없이 가슴을 폈다. 덤으로 {name}에게 조준하는 법도 알려 주었다.", effects: { skill: 10, friendBond: 5 } },
          good: { text: "과녁은 맞혔지만 튕겨 나간 탄이 생선 좌판을 엎었다. 둘은 생선 장수에게 쫓겨 달아났다.", effects: { skill: 4, supplies: -3 } },
          bad: { text: "과녁을 세우다 {name}이 엉뚱한 탄에 이마를 맞았다. 우솝은 미안하다며 붕대를 감아 주었다.", effects: { health: -6 } }
        } }
    ] },
  { id: "usopp_60", key: "usopp", threshold: 60, from: 0, to: 0, art: "deck", title: "떨리는 다리의 저격수",
    body: "{name}이 머물던 섬 근해에 약탈선이 나타났다. 마침 들른 우솝은 다리를 덜덜 떨며 섬에 들어가면 안 되는 병이 도졌다고 했다. 그런데 주민들이 피하는 모습을 보더니 새총을 꺼내 들고, 높은 곳까지 시간을 벌어 달라고 했다.",
    choices: [
      { id: "cover", label: "해안에서 약탈자들의 눈을 끈다", hint: "미끼가 버텨야 저격이 산다",
        check: { stat: "health", against: 60 }, personality: { loyalty: 6, caution: -4 }, score: CLOSE,
        outcomes: {
          great: { text: "{name}이 버티는 동안 우솝의 탄이 차례로 약탈선의 돛줄을 끊었다. 배가 떠내려가자 그는 다 계획대로였다며 코를 높이 들었다.", effects: { trust: 12, friendBond: 8 } },
          good: { text: "약탈자들은 물러났지만 {name}은 몇 대 맞았다. 우솝은 울먹이며 약을 발라 주고, 넌 진짜 용감한 녀석이라고 했다.", effects: { trust: 6, health: -5 } },
          bad: { text: "미끼는 너무 빨리 잡혔다. 우솝이 겨우 연막탄으로 빼내 주었지만, 창고 하나가 불탔다.", effects: { health: -12, supplies: -8 } }
        } },
      { id: "spot", label: "우솝 옆에서 바람과 거리를 읽어 준다", hint: "두 사람의 눈이 하나의 탄이 된다",
        check: { stat: "skill", against: 55 }, personality: { caution: 4, loyalty: 4 }, score: CLOSE,
        outcomes: {
          great: { text: "{name}이 바람을 불러 주자 우솝의 탄이 선장의 모자를 꿰뚫었다. 겁에 질린 약탈선은 그대로 뱃머리를 돌렸다.", effects: { skill: 12, trust: 6 } },
          good: { text: "몇 발은 빗나갔지만 결국 약탈선을 쫓아냈다. 우솝은 땀을 닦으며 다음엔 네가 쏴 보라고 했다.", effects: { skill: 6, trust: 4 } },
          bad: { text: "바람을 잘못 읽었다. 빗나간 탄이 아군 쪽 지붕에 떨어졌고, 우솝은 바다 쪽 바람이 이상했다고 끝까지 우겼다.", effects: { trust: -8, skill: -2 } }
        } }
    ] },

  // 상디
  { id: "sanji_30", key: "sanji", threshold: 30, from: 0, to: 0, art: "specialGalleyKitchen", title: "배고픈 자에게 한 접시",
    body: "물자가 바닥나 사흘째 굶던 {name} 앞에 김이 오르는 접시가 놓였다. 담배를 문 상디였다. 배고픈 놈은 누구든 먹여야 한다며 앉으라고 했다. 잠깐 뒤 지나가는 여자 손님을 보고는 눈이 하트가 되어 주방으로 사라졌다.",
    choices: [
      { id: "dishes", label: "밥값 대신 설거지를 맡는다", hint: "요리사의 주방은 전쟁터다",
        check: { stat: "health", against: 40 }, personality: { loyalty: 4, empathy: 4 }, score: LIKE,
        outcomes: {
          great: { text: "그릇 하나 남김없이 반짝였다. 상디는 접시를 비춰 보더니 쓸 만하다며 남은 재료로 도시락까지 싸 주었다.", effects: { supplies: 10, health: 4 } },
          good: { text: "설거지는 끝냈지만 손이 퉁퉁 불었다. 상디는 다음엔 장갑을 끼라며 새 행주를 던져 주었다.", effects: { supplies: 5, health: 2 } },
          bad: { text: "접시를 떨어뜨린 순간 상디의 발이 {name}의 코앞에서 멈췄다. 음식 그릇을 함부로 하지 말라는 말이 차가웠다.", effects: { health: -5, friendBond: -4 } }
        } },
      { id: "recipe", label: "이 맛을 배우고 싶다고 청한다", hint: "상디는 레시피를 아끼지 않지만 손맛은 다르다",
        check: { stat: "skill", against: 50 }, personality: { ambition: 4, caution: 3 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "상디는 잠시 {name}을 보더니 칼을 건넸다. 해 질 녘까지 배운 수프 하나는 그 뒤 몇 번이나 {name}의 배를 살렸다.", effects: { skill: 8, supplies: 6 } },
          good: { text: "따라 만든 수프는 그럭저럭이었다. 상디는 불 조절이 문제라며 담배 연기를 길게 내뿜었다.", effects: { skill: 4, supplies: 2 } },
          bad: { text: "냄비를 태웠다. 상디는 말없이 다시 만들어 주었지만, 재료를 버린 일만은 용서하지 않는 눈치였다.", effects: { supplies: -6, friendBond: -2 } }
        } }
    ] },
  { id: "sanji_60", key: "sanji", threshold: 60, from: 0, to: 0, art: "deck", title: "식재료를 짓밟은 대가",
    body: "항구 시장에서 술 취한 해적들이 노점 할머니의 생선 상자를 걷어찼다. 마침 {name}과 장을 보던 상디가 담배를 비벼 끄며 장바구니를 맡겼다. 그는 식재료를 짓밟는 놈들은 그냥 둘 수 없다며 앞으로 나섰다.",
    choices: [
      { id: "back", label: "상디의 등 뒤를 맡는다", hint: "발차기 범위 안은 위험하다",
        check: { stat: "skill", against: 60 }, personality: { loyalty: 6, caution: -3 }, score: CLOSE,
        outcomes: {
          great: { text: "상디의 발차기가 해적들을 줄줄이 날려 보내는 동안 {name}은 뒤에서 덤빈 놈을 막아 냈다. 끝나고 상디는 고맙다며 저녁을 대접했다.", effects: { skill: 12, friendBond: 8 } },
          good: { text: "싸움은 금방 끝났지만 {name}은 소매가 찢어졌다. 상디는 꿰매 줄 레이디는 없냐며 혀를 찼다.", effects: { skill: 6, health: -4 } },
          bad: { text: "뒤를 맡기는커녕 장바구니를 떨어뜨렸다. 쏟아진 달걀을 본 상디의 표정이 해적들을 볼 때보다 무서웠다.", effects: { supplies: -10, health: -4 } }
        } },
      { id: "grandma", label: "할머니와 생선부터 챙긴다", hint: "싸움보다 먼저 지킬 것이 있다",
        check: { stat: "trust", against: 50 }, personality: { empathy: 7 }, score: { great: 14, good: 7, bad: -4 },
        outcomes: {
          great: { text: "{name}이 할머니를 부축해 생선 상자를 지켜 내자, 싸움을 마친 상디가 담배에 불을 붙이며 너 좋은 놈이라고 했다. 그날 저녁 할머니의 생선은 상디의 손에서 잔칫상이 되었다.", effects: { trust: 12, supplies: 6 } },
          good: { text: "상자 반은 건졌다. 상디는 남은 생선을 손질해 할머니께 돌려드리고 {name}에게도 한 마리 나눠 주었다.", effects: { trust: 6, supplies: 3 } },
          bad: { text: "{name}이 엉거주춤하는 사이 상자가 바다로 떨어졌다. 할머니는 울었고, 상디는 말없이 제 돈으로 생선값을 쳐 드렸다.", effects: { trust: -8, friendBond: -4 } }
        } }
    ] },

  // 토니토니 쵸파
  { id: "chopper_30", key: "chopper", threshold: 30, from: 2, art: "childClinic", title: "너구리가 아니라 순록",
    body: "상처가 곪아 열에 들뜬 {name}을 진찰한 건 모자를 쓴 작은 순록 쵸파였다. 너구리냐고 묻는 아이에게 순록이라고 소리친 그는 진지한 얼굴로 붕대를 감았다. 약이 쓰다고 투덜대자 쵸파가 눈을 크게 떴다.",
    choices: [
      { id: "praise", label: "최고의 의사라고 진심으로 칭찬한다", hint: "칭찬에 약한 의사다",
        check: { stat: "friendBond", against: 35 }, personality: { empathy: 5 }, score: { great: 12, good: 6, bad: -2 },
        outcomes: {
          great: { text: "쵸파는 칭찬해도 하나도 안 기쁘다고 소리치면서 온몸을 배배 꼬며 춤을 췄다. 그러고는 가장 좋은 약초를 몰래 한 봉지 더 넣어 주었다.", effects: { health: 12, friendBond: 5 } },
          good: { text: "쵸파는 기쁘지 않다며 고개를 홱 돌렸지만 발끝이 들썩였다. 상처는 사흘 만에 아물었다.", effects: { health: 7 } },
          bad: { text: "칭찬하다 약을 몰래 버리는 걸 들켰다. 쵸파는 화가 나서 처방을 두 배로 늘렸다.", effects: { supplies: -4 } }
        } },
      { id: "rest", label: "처방대로 꼬박꼬박 약을 먹고 쉰다", hint: "좋은 환자도 의사를 웃게 한다",
        check: { stat: "health", against: 40 }, personality: { caution: 6 }, score: LIKE,
        outcomes: {
          great: { text: "쵸파가 놀랄 만큼 빨리 나았다. 그는 진료 기록에 모범 환자라고 적으며 뿌듯하게 코를 훌쩍였다.", effects: { health: 14 } },
          good: { text: "열은 내렸지만 흉터가 남았다. 쵸파는 다음엔 더 일찍 오라며 연고를 한 통 쥐여 주었다.", effects: { health: 8, supplies: 2 } },
          bad: { text: "가만있지 못하고 일을 나갔다가 상처가 도졌다. 쵸파는 울먹이며 의사 말을 왜 안 듣냐고 혼냈다.", effects: { health: -8 } }
        } }
    ] },
  { id: "chopper_60", key: "chopper", threshold: 60, from: 0, to: 0, art: "childClinic", title: "손이 모자란 진료소",
    body: "{name}이 들른 섬에 열병이 번졌다. 진료소에는 환자가 넘쳤고, 그 한가운데서 쵸파가 쉴 새 없이 약을 달이고 있었다. 그는 {name}을 보자마자 약초를 구해 올 사람이 필요하다고 외쳤다. 약초는 절벽 위에 있었다.",
    choices: [
      { id: "cliff", label: "절벽 위 약초를 캐러 간다", hint: "약초보다 절벽이 먼저 사람을 잡는다",
        check: { stat: "health", against: 65 }, personality: { empathy: 5, caution: -4 }, score: CLOSE,
        outcomes: {
          great: { text: "바구니 가득 약초를 안고 돌아오자 쵸파가 달려와 안겼다. 그날 밤 진료소의 기침 소리가 처음으로 잦아들었다.", effects: { trust: 12, health: -2, friendBond: 6 } },
          good: { text: "약초는 반만 구했고 팔이 긁혀 피가 났다. 쵸파는 고맙다며 {name}의 상처부터 치료했다.", effects: { trust: 6, health: -5 } },
          bad: { text: "발을 헛디뎌 굴러떨어졌다. 환자가 하나 늘어난 진료소에서 쵸파는 울면서도 손을 멈추지 않았다.", effects: { health: -15 } }
        } },
      { id: "assist", label: "진료소에 남아 쵸파를 돕는다", hint: "의사의 손이 되려면 손이 떨리면 안 된다",
        check: { stat: "skill", against: 55 }, personality: { loyalty: 5, caution: 4 }, score: CLOSE,
        outcomes: {
          great: { text: "{name}은 밤새 붕대를 갈고 약을 날랐다. 새벽녘 쵸파는 꾸벅꾸벅 졸면서도 네 덕분에 한 명도 잃지 않았다고 했다.", effects: { skill: 10, trust: 8 } },
          good: { text: "실수도 있었지만 쵸파가 하나하나 바로잡아 주었다. 응급 처치 몇 가지가 손에 익었다.", effects: { skill: 6, trust: 3 } },
          bad: { text: "약을 잘못 건넸다. 쵸파가 바로 알아채 큰일은 없었지만, 그 뒤로는 물만 나르게 되었다.", effects: { trust: -6, skill: -2 } }
        } }
    ] },

  // 니코 로빈
  { id: "robin_30", key: "robin", threshold: 30, from: 2, art: "specialLibraryStudy", title: "배 안 서재의 조용한 손님",
    body: "항해 중 배 안의 작은 서재에서 {name}은 높은 선반의 책을 꺼내려다 손이 닿지 않았다. 그때 선반에서 손 하나가 피어나 책을 건네주었다. 창가에 앉은 로빈이 미소 지었다. 그 책의 결말은 다들 죽는 이야기라고 덧붙이면서.",
    choices: [
      { id: "ask", label: "그녀가 읽는 역사책에 대해 묻는다", hint: "로빈은 질문을 좋아하지만 경계도 한다",
        check: { stat: "trust", against: 45 }, personality: { empathy: 3, ambition: 3 }, score: LIKE,
        outcomes: {
          great: { text: "로빈은 한참 동안 사라진 나라들 이야기를 들려주었다. 헤어질 때 그녀는 {name}에게 얇은 지도책 한 권을 남겼다.", effects: { skill: 9, friendBond: 5 } },
          good: { text: "로빈은 몇 가지만 알려 주고 책을 덮었다. 그래도 그 짧은 이야기 덕분에 항로 하나가 눈에 들어왔다.", effects: { skill: 5 } },
          bad: { text: "너무 캐물었다. 로빈은 여전히 웃었지만 다음 순간 자리에는 책만 남아 있었다.", effects: { friendBond: -5 } }
        } },
      { id: "quiet", label: "말없이 맞은편에 앉아 함께 읽는다", hint: "침묵이 편한 사람도 있다",
        check: { stat: "friendBond", against: 40 }, personality: { caution: 5, empathy: 3 }, score: { great: 12, good: 6, bad: -2 },
        outcomes: {
          great: { text: "해가 질 때까지 둘은 한마디도 하지 않았다. 일어서며 로빈은 오랜만에 편한 오후였다고 말했다.", effects: { friendBond: 10, health: 3 } },
          good: { text: "편안한 오후였다. 로빈은 떠나며 {name}이 고른 책이 꽤 괜찮다고 했다.", effects: { friendBond: 5 } },
          bad: { text: "{name}은 책장을 넘기다 잠들었다. 깨어나 보니 얼굴에 낙서가 되어 있었고, 범인은 이미 떠난 뒤였다.", effects: { trust: -4 } }
        } }
    ] },
  { id: "robin_60", key: "robin", threshold: 60, from: 0, to: 0, art: "childLantern", title: "등불 아래의 고백",
    body: "신세계의 항구에서 다시 만난 로빈은 {name}의 얼굴을 보자마자 무슨 일이 있었냐고 물었다. 고향 소식이 좋지 않았다. 로빈은 찻잔을 내려놓고, 살아 있으면 돌아갈 곳은 다시 생긴다고 조용히 말했다.",
    choices: [
      { id: "open", label: "숨겨 온 이야기를 털어놓는다", hint: "말하는 데에도 용기가 든다",
        check: { stat: "friendBond", against: 50 }, personality: { empathy: 6 }, score: CLOSE,
        outcomes: {
          great: { text: "로빈은 끝까지 들어 주었다. 이야기가 끝나자 자신도 오래 혼자였다고만 말했다. 그 한마디가 {name}에게 오래 남았다.", effects: { friendBond: 14, health: 4 } },
          good: { text: "다 말하지는 못했다. 그래도 로빈은 재촉하지 않고 차를 한 잔 더 따라 주었다.", effects: { friendBond: 7 } },
          bad: { text: "말이 엉켜 화를 내고 말았다. 로빈은 상처받은 기색 없이 웃었지만, {name}은 그날 밤 잠들지 못했다.", effects: { friendBond: -6, health: -4 } }
        } },
      { id: "watch", label: "추적자가 없는지 대신 망을 본다", hint: "로빈의 과거는 아직 그녀를 쫓는다",
        check: { stat: "skill", against: 60 }, personality: { loyalty: 6, caution: 3 }, score: { great: 14, good: 7, bad: -6 },
        outcomes: {
          great: { text: "{name}은 수상한 사내 둘을 먼저 알아채고 엉뚱한 골목으로 유인했다. 돌아오자 로빈은 고맙다며 처음으로 소리 내어 웃었다.", effects: { skill: 12, trust: 4 } },
          good: { text: "아무도 나타나지 않았다. 로빈은 그래도 덕분에 마음 편히 쉬었다고 했다.", effects: { skill: 5, friendBond: 4 } },
          bad: { text: "현상금 사냥꾼이 {name}을 먼저 덮쳤다. 피어난 손들이 그들을 꺾어 놓았지만, 로빈은 그날로 항구를 떠났다.", effects: { health: -12 } }
        } }
    ] },

  // 프랑키
  { id: "franky_30", key: "franky", threshold: 30, from: 2, art: (life) => life?.creationVersion >= 20 ? "workbenchSkillTraining" : "workbench", title: "콜라 한 병의 수리",
    body: "항구에서 {name}의 배 바닥에 물이 새고 있었다. 지나가던 프랑키가 선글라스를 내리고 선체를 툭툭 두드리더니, 이건 배가 울고 있는 소리라고 했다. 콜라 몇 병만 주면 슈퍼하게 고쳐 주겠다며 양팔을 모아 포즈를 잡았다.",
    choices: [
      { id: "cola", label: "콜라를 사 와서 맡긴다", hint: "연료비는 들지만 솜씨는 확실하다",
        check: { stat: "supplies", against: 40 }, personality: { empathy: 3, caution: 4 }, score: LIKE,
        outcomes: {
          great: { text: "프랑키는 반나절 만에 선체를 새것처럼 만들었다. 덤으로 키 손잡이까지 손봐 놓고 슈퍼라고 외쳤다.", effects: { supplies: 8, skill: 3 } },
          good: { text: "물은 멎었다. 콜라는 예상보다 많이 들었지만 프랑키는 배를 아껴 주라며 엄지를 세웠다.", effects: { supplies: 4 } },
          bad: { text: "콜라가 모자라 수리가 반쯤에서 멈췄다. 프랑키는 미안하다며 임시 땜질만 해 주었다.", effects: { supplies: -6 } }
        } },
      { id: "learn", label: "옆에서 망치를 들고 배운다", hint: "조선공의 손은 빠르고 거칠다",
        check: { stat: "skill", against: 50 }, personality: { ambition: 5, loyalty: 2 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "프랑키는 {name}의 망치질을 보더니 너 소질 있다며 이음매 짜는 법을 하나 알려 주었다. 그 기술은 오래 쓸모가 있었다.", effects: { skill: 12 } },
          good: { text: "손가락 두 개에 멍이 들었지만 배는 고쳐졌다. 프랑키는 땀을 닦으며 콜라를 한 병 나눠 주었다.", effects: { skill: 5, health: -2 } },
          bad: { text: "못을 잘못 박아 새 구멍을 냈다. 프랑키는 이마를 짚으며 배한테 사과하라고 했다.", effects: { supplies: -8, trust: -2 } }
        } }
    ] },
  { id: "franky_60", key: "franky", threshold: 60, from: 0, to: 0, art: "workbench", title: "슈퍼한 시운전",
    body: "다시 만난 프랑키가 {name}의 배를 위해 장치 하나를 만들었다고 했다. 콜라를 연료로 쓰는 작은 추진기였다. 다만 아직 시험해 보지 않았다며 선글라스 너머로 씩 웃었다. 직접 타 볼 사람이 필요하다고 했다.",
    choices: [
      { id: "ride", label: "직접 키를 잡고 시운전한다", hint: "성공하면 바람보다 빠르고, 아니면 바다 밑이다",
        check: { stat: "skill", against: 65 }, personality: { freedom: 6, ambition: 5, caution: -5 }, score: { great: 15, good: 8, bad: -2 },
        outcomes: {
          great: { text: "배가 물 위를 미끄러지듯 튀어 나갔다. 돌아온 {name}을 프랑키가 번쩍 들어 올리며 슈퍼하다고 외쳤다. 추진기는 그대로 {name}의 배에 남았다.", effects: { skill: 10, supplies: 10 } },
          good: { text: "추진기는 몇 번 털털거리다 제대로 돌았다. 프랑키는 수첩에 고칠 곳을 적으며 만족스럽게 콜라를 들이켰다.", effects: { skill: 6, supplies: 5 } },
          bad: { text: "추진기가 콜라 거품을 뿜으며 폭발했다. {name}은 바다에 처박혔고 프랑키가 건져 올렸다. 그는 진심으로 미안해했다.", effects: { health: -14, supplies: -6 } }
        } },
      { id: "test", label: "빈 배에 달아 먼저 시험해 보자고 한다", hint: "신중함은 느리지만 안전하다",
        check: { stat: "trust", against: 45 }, personality: { caution: 7 }, score: CLOSE,
        outcomes: {
          great: { text: "빈 배로 시험해 결함 두 곳을 찾았다. 프랑키는 너 같은 녀석이 조선소에 있어야 한다며 고친 추진기를 달아 주었다.", effects: { supplies: 9, skill: 5 } },
          good: { text: "시험 중에 추진기가 고장 났지만 다친 사람은 없었다. 프랑키는 다음엔 더 슈퍼하게 만들겠다고 했다.", effects: { supplies: 3, skill: 3 } },
          bad: { text: "빈 배가 폭주해 부두를 들이받았다. 항구 관리인에게 둘이 나란히 혼났다.", effects: { trust: -8, supplies: -5 } }
        } }
    ] },

  // 브룩
  { id: "brook_30", key: "brook", threshold: 30, from: 0, to: 0, art: "childLantern", title: "해골의 바이올린",
    body: "밤 항구에서 바이올린 소리가 들렸다. 연주하던 건 아프로 머리의 해골, 브룩이었다. {name}을 알아본 그는 반가워 심장이 뛴다고 했다가, 자기는 심장이 없다며 요호호 웃었다. 그러고는 한 곡 신청을 받겠다고 했다.",
    choices: [
      { id: "song", label: "고향 바다의 노래를 청한다", hint: "그리움은 음악이 되면 덜 아프다",
        check: { stat: "friendBond", against: 35 }, personality: { empathy: 5 }, score: LIKE,
        outcomes: {
          great: { text: "처음 듣는 노래였을 텐데 브룩은 {name}의 흥얼거림만으로 곡을 완성했다. 그 선율을 들으며 {name}은 오랜만에 고향을 웃으며 떠올렸다.", effects: { friendBond: 10, health: 4 } },
          good: { text: "좋은 연주였다. 브룩은 눈물이 날 것 같다고 하더니, 자기는 눈이 없다며 또 웃었다.", effects: { friendBond: 5 } },
          bad: { text: "{name}의 노래가 너무 엉망이라 브룩도 따라 하지 못했다. 둘은 웃다가 그냥 헤어졌다.", effects: { friendBond: -4 } }
        } },
      { id: "duet", label: "손뼉과 노래로 연주에 끼어든다", hint: "음치라도 흥은 전염된다",
        check: { stat: "trust", against: 45 }, personality: { freedom: 6 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "어느새 항구 사람들이 몰려와 함께 노래했다. 브룩은 오늘 밤 관객은 최고였다며 모자를 벗어 정중히 인사했다.", effects: { trust: 10, friendBond: 5 } },
          good: { text: "박자가 몇 번 어긋났지만 브룩은 능숙하게 맞춰 주었다. 즐거운 밤이었다.", effects: { trust: 5, friendBond: 3 } },
          bad: { text: "소란에 잠이 깬 주민이 물을 끼얹었다. 브룩은 뼛속까지 젖었다며 요호호 웃었다.", effects: { trust: -6, health: -2 } }
        } }
    ] },
  { id: "brook_60", key: "brook", threshold: 60, from: 0, to: 0, art: "childLantern", title: "떠난 이를 위한 한 곡",
    body: "{name}이 소중한 사람을 잃었다는 소식을 들은 브룩이 찾아왔다. 그는 농담 하나 없이 바이올린을 꺼내며, 떠난 사람에게 닿는 곡이 있다고 했다. 다만 부르는 사람이 끝까지 울지 않고 들어야 한다고 했다.",
    choices: [
      { id: "listen", label: "끝까지 곁에서 듣는다", hint: "슬픔을 마주하는 일은 체력이 든다",
        check: { stat: "health", against: 50 }, personality: { empathy: 6, loyalty: 4 }, score: CLOSE,
        outcomes: {
          great: { text: "곡이 끝났을 때 {name}의 얼굴은 젖어 있었지만 마음은 가벼웠다. 브룩은 울어도 괜찮았다며, 오래 혼자였던 자신도 노래 덕분에 버텼다고 했다.", effects: { health: 12, friendBond: 8 } },
          good: { text: "중간에 고개를 떨궜지만 브룩은 연주를 멈추지 않았다. 그날 밤은 오랜만에 깊이 잤다.", effects: { health: 6, friendBond: 4 } },
          bad: { text: "견디지 못하고 자리를 떴다. 브룩은 연주를 마친 뒤 말없이 기다렸고, 다음 날 아침 문 앞에 악보 한 장이 놓여 있었다.", effects: { health: -6 } }
        } },
      { id: "together", label: "고인이 좋아하던 노래를 함께 부른다", hint: "목소리가 떨리면 노래도 흔들린다",
        check: { stat: "friendBond", against: 55 }, personality: { empathy: 5, freedom: 3 }, score: { great: 14, good: 7, bad: -4 },
        outcomes: {
          great: { text: "브룩의 바이올린과 {name}의 목소리가 밤바다 위로 퍼졌다. 노래가 끝나자 브룩은 모자를 벗고 오래 고개를 숙였다.", effects: { friendBond: 14, trust: 4 } },
          good: { text: "목소리는 자꾸 끊겼지만 브룩이 선율로 이어 주었다. 슬픔이 조금 덜어졌다.", effects: { friendBond: 7 } },
          bad: { text: "노래가 울음으로 바뀌었다. 브룩은 연주를 멈추고 뼈만 남은 손으로 {name}의 어깨를 토닥였다.", effects: { health: -5 } }
        } }
    ] },

  // 징베
  { id: "jinbe_30", key: "jinbe", threshold: 30, from: 0, to: 0, art: "harbor", title: "어인과 인간 사이의 중재",
    body: "항구에서 어인 선원과 인간 하역꾼들 사이에 시비가 붙었다. 주먹이 오가기 직전, 묵직한 목소리가 끼어들었다. 징베였다. 그는 양쪽 말을 다 들어 보자며 {name}에게 무슨 일인지 설명해 달라고 청했다.",
    choices: [
      { id: "fair", label: "본 그대로 공정하게 증언한다", hint: "정직은 양쪽 모두에게 미움받을 수 있다",
        check: { stat: "trust", against: 45 }, personality: { loyalty: 5, empathy: 3 }, score: LIKE,
        outcomes: {
          great: { text: "징베는 {name}의 말을 듣고 양쪽 모두의 잘못을 짚었다. 고개를 숙인 하역꾼과 어인 선원이 악수했고, 징베는 {name}에게 정중히 감사를 표했다.", effects: { trust: 10, friendBond: 4 } },
          good: { text: "시비는 가라앉았다. 몇몇은 투덜댔지만 징베는 바른 말을 한 용기를 높이 산다고 했다.", effects: { trust: 5 } },
          bad: { text: "한쪽 편만 든다는 오해를 샀다. 징베가 수습했지만 그 부두에서 {name}을 보는 눈이 차가워졌다.", effects: { trust: -8 } }
        } },
      { id: "between", label: "몸으로 두 무리 사이를 막아선다", hint: "주먹이 먼저 나오면 맞는 건 가운데다",
        check: { stat: "health", against: 55 }, personality: { empathy: 6, caution: -3 }, score: { great: 12, good: 6, bad: -2 },
        outcomes: {
          great: { text: "{name}이 버티는 사이 징베가 양쪽을 진정시켰다. 그는 의리 있는 사람이라며 {name}에게 깊이 고개를 숙였다.", effects: { trust: 8, friendBond: 6 } },
          good: { text: "주먹 한 대를 대신 맞았다. 징베는 미안하다며 상처를 살펴 주었다.", effects: { trust: 5, health: -4 } },
          bad: { text: "양쪽에서 날아온 주먹에 정신을 잃었다. 깨어났을 때 싸움은 끝나 있었고, 징베가 곁을 지키고 있었다.", effects: { health: -12 } }
        } }
    ] },
  { id: "jinbe_60", key: "jinbe", threshold: 60, from: 0, to: 0, art: "lifeStorm", title: "해류를 읽는 법",
    body: "신세계의 항구에서 징베가 {name}의 배에 들러 하늘과 물빛을 한참 보았다. 사흘 뒤 큰 폭풍이 온다고 했다. 그 전에 출항하려면 해류를 제대로 읽어야 한다며, 원한다면 하룻밤 가르쳐 주겠다고 했다.",
    choices: [
      { id: "learn", label: "밤을 새워 해류 읽는 법을 배운다", hint: "바다를 아는 이의 가르침은 엄하다",
        check: { stat: "skill", against: 60 }, personality: { ambition: 4, caution: 5 }, score: CLOSE,
        outcomes: {
          great: { text: "새벽녘 {name}은 물결의 방향만으로 숨은 해류를 짚어 냈다. 징베는 크게 웃으며 훌륭하다고 했다. 그 감각은 평생 {name}의 배를 지켰다.", effects: { skill: 14, supplies: 4 } },
          good: { text: "다 익히지는 못했지만 폭풍을 피할 항로는 잡았다. 징베는 바다는 평생 배우는 것이라고 했다.", effects: { skill: 7 } },
          bad: { text: "졸다가 징베에게 혼났다. 그는 꾸짖으면서도 항로 하나를 직접 해도에 그려 주었다.", effects: { trust: -4 } }
        } },
      { id: "sail", label: "징베를 믿고 폭풍 전에 바로 출항한다", hint: "가르침을 시험할 시간은 바다가 정한다",
        check: { stat: "health", against: 65 }, personality: { freedom: 6, caution: -4 }, score: { great: 12, good: 5, bad: -6 },
        outcomes: {
          great: { text: "징베가 일러 준 해류를 타고 배는 폭풍을 비껴 나갔다. 다음 항구에서 받은 전보에 그는 무사해서 다행이라고만 적었다.", effects: { supplies: 12, health: 3 } },
          good: { text: "폭풍 끝자락에 걸려 돛이 찢어졌지만 모두 무사했다.", effects: { supplies: 4, health: -4 } },
          bad: { text: "서두른 탓에 해류를 놓쳤다. 폭풍 속에서 화물 절반을 바다에 버려야 했다.", effects: { supplies: -14, health: -6 } }
        } }
    ] },

  // 포트거스 D. 에이스
  { id: "ace_30", key: "ace", threshold: 30, from: 5, to: 2, beforeWar: true, untilBeat: "water_seven", art: "mishapFeast", title: "밥 먹다 잠든 사내",
    body: "항구 식당에서 옆자리 사내가 밥을 먹다 말고 접시에 얼굴을 묻었다. 손님들이 비명을 질렀지만 {name}은 알아보았다. 에이스였다. 잠시 뒤 벌떡 일어난 그는 깜빡 잠들었다며 주위에 정중히 고개를 숙이고 다시 먹기 시작했다.",
    choices: [
      { id: "napkin", label: "말없이 냅킨을 건네준다", hint: "작은 친절은 기억된다",
        check: { stat: "friendBond", against: 30 }, personality: { empathy: 5 }, score: LIKE,
        outcomes: {
          great: { text: "에이스는 고맙다며 꾸벅 인사하더니 {name}의 밥값까지 계산하겠다고 나섰다. 그리고 동생 이야기를 한참 자랑했다.", effects: { friendBond: 10, supplies: 5 } },
          good: { text: "에이스는 쑥스럽게 웃으며 얼굴을 닦았다. 둘은 바다 이야기를 조금 나눴다.", effects: { friendBond: 5 } },
          bad: { text: "냅킨을 건네는 순간 에이스가 다시 잠들었다. 쏟아진 국물이 {name}의 옷을 적셨다.", effects: { supplies: -4 } }
        } },
      { id: "drink", label: "한잔 사며 무슨 일로 바다에 나왔냐고 묻는다", hint: "그는 쫓는 사람이 있다",
        check: { stat: "trust", against: 45 }, personality: { ambition: 3, empathy: 3 }, score: { great: 12, good: 6, bad: -4 },
        outcomes: {
          great: { text: "에이스는 사람을 쫓고 있다고만 했다. 대신 아버지라 부르는 선장 이야기를 할 때는 얼굴이 환해졌다. 헤어질 때 그는 정중히 고개 숙여 인사했다.", effects: { friendBond: 12, trust: 3 } },
          good: { text: "에이스는 웃으며 말을 돌렸다. 그래도 술은 기분 좋게 받았다.", effects: { friendBond: 5, supplies: -2 } },
          bad: { text: "캐묻는 말에 에이스의 눈빛이 잠깐 식었다. 그는 예의 바르게 인사하고 곧 자리를 떴다.", effects: { friendBond: -4, supplies: -3 } }
        } }
    ] },
  { id: "ace_60", key: "ace", threshold: 60, from: 5, to: 2, beforeWar: true, untilBeat: "water_seven", art: "dangerSeaKing", title: "불꽃이 가른 바다",
    body: "{name}의 배가 해왕류에 둘러싸였을 때, 작은 배 한 척이 물살을 가르며 다가왔다. 에이스였다. 그는 팔에 불을 두르고 해왕류 앞을 막아서며, 이 녀석은 내가 맡을 테니 그 틈에 빠져나가라고 외쳤다.",
    choices: [
      { id: "flee", label: "말대로 배를 돌려 빠져나간다", hint: "믿고 맡기는 것도 용기다",
        check: { stat: "skill", against: 50 }, personality: { caution: 6, loyalty: 3 }, score: CLOSE,
        outcomes: {
          great: { text: "배는 무사히 빠져나왔다. 해 질 녘 에이스가 다가와 다친 데 없냐고 물었고, 무사하다는 답에 환하게 웃었다.", effects: { health: 6, supplies: 6, friendBond: 6 } },
          good: { text: "꼬리에 스쳐 난간이 부서졌지만 모두 살았다. 멀리서 에이스가 손을 흔들었다.", effects: { supplies: -3, friendBond: 5 } },
          bad: { text: "방향을 잘못 잡아 다른 해왕류의 영역으로 들어갔다. 에이스가 다시 구하러 와야 했고, 배는 크게 부서졌다.", effects: { supplies: -12, health: -6 } }
        } },
      { id: "help", label: "작살을 들고 에이스를 돕는다", hint: "불길 곁은 뜨겁다",
        check: { stat: "health", against: 65 }, personality: { loyalty: 6, ambition: 4, caution: -4 }, score: { great: 15, good: 8, bad: -3 },
        outcomes: {
          great: { text: "{name}의 작살이 해왕류의 눈을 노린 순간 에이스의 불주먹이 그 머리를 날렸다. 그는 네 덕분에 쉬웠다며 고개 숙여 인사했고, 그날 밤 둘은 구운 해왕류를 나눠 먹었다.", effects: { skill: 12, friendBond: 10 } },
          good: { text: "해왕류는 쫓겨 갔다. 불꽃에 눈썹이 그을린 {name}을 보고 에이스는 미안하다며 웃음을 참았다.", effects: { skill: 6, health: -4 } },
          bad: { text: "파도에 휩쓸려 바다에 빠졌다. 에이스는 물에 들어가지 못해 밧줄을 던졌고, 겨우 끌려 올라왔다.", effects: { health: -14 } }
        } }
    ] },

  // 트라팔가 로 (해군 경로에서만 만나는 인물)
  { id: "law_30", key: "law", threshold: 30, from: 4, art: "childClinic", title: "빵을 남긴 의사",
    body: "부두에서 짐에 깔린 인부를 누가 먼저 일으켜 세웠다. 얼룩무늬 모자를 쓴 로였다. 그는 말없이 다친 다리를 고정하더니 {name}을 흘끗 보았다. 인부가 고맙다며 빵을 내밀자 로는 빵은 싫다며 고개를 돌렸다.",
    choices: [
      { id: "onigiri", label: "가지고 있던 주먹밥을 대신 건넨다", hint: "그의 취향은 단순하다",
        check: { stat: "supplies", against: 35 }, personality: { empathy: 5 }, score: LIKE,
        outcomes: {
          great: { text: "로는 잠깐 주먹밥을 보다가 받아 들었다. 고맙다는 말은 없었지만, 떠나며 인부를 의사에게 데려가라는 처방 쪽지를 {name}에게 넘겼다.", effects: { trust: 8, friendBond: 5 } },
          good: { text: "로는 받지 않았지만 빵이 아니라는 점은 인정하는 눈치였다.", effects: { trust: 4 } },
          bad: { text: "로는 해군 제복을 한 번 보고는 대꾸 없이 자리를 떴다.", effects: { friendBond: -4 } }
        } },
      { id: "assist", label: "부목 대는 일을 거든다", hint: "외과의 앞에서는 손이 정확해야 한다",
        check: { stat: "skill", against: 50 }, personality: { loyalty: 3, caution: 4 }, score: { great: 12, good: 5, bad: -4 },
        outcomes: {
          great: { text: "로는 {name}의 손을 보더니 나쁘지 않다고만 했다. 그에게서 들을 수 있는 칭찬으로는 최고였다.", effects: { skill: 10 } },
          good: { text: "로가 두 번 손을 고쳐 잡아 주었다. 응급 처치 하나를 제대로 배웠다.", effects: { skill: 5 } },
          bad: { text: "부목을 거꾸로 댔다. 로는 한숨을 쉬고 처음부터 다시 했다.", effects: { trust: -4, skill: -2 } }
        } }
    ] },
  { id: "law_60", key: "law", threshold: 60, from: 4, art: "harbor", title: "보지 못한 잠수함",
    body: "순찰 중이던 {name}은 외딴 만에서 노란 잠수함이 수리 중인 것을 보았다. 갑판 위에서 로가 장검을 어깨에 기댄 채 이쪽을 내려다보았다. 그는 이틀이면 떠난다고만 했다. 보고서를 쓸지는 {name}의 몫이었다.",
    choices: [
      { id: "silent", label: "보지 못한 것으로 한다", hint: "규정과 신의 사이에서 하나를 고른다",
        check: { stat: "trust", against: 55 }, personality: { freedom: 6, empathy: 3 }, score: { great: 15, good: 8, bad: -3 },
        outcomes: {
          great: { text: "이틀 뒤 잠수함은 조용히 사라졌다. 며칠 뒤 {name}의 숙소에 출처 모를 약상자 하나가 도착했다. 쪽지는 없었다.", effects: { health: 10, supplies: 6 } },
          good: { text: "아무 일도 없었다. 다만 순찰 기록의 빈칸을 두고 상관이 고개를 갸웃했다.", effects: { trust: -3, supplies: 3 } },
          bad: { text: "다른 순찰조가 잠수함을 발견했고, {name}이 그 만을 돌았다는 기록이 문제가 되었다.", effects: { trust: -15 } }
        } },
      { id: "report", label: "규정대로 보고하되 하루 늦게 올린다", hint: "의리와 의무를 반씩 지킨다",
        check: { stat: "skill", against: 45 }, personality: { loyalty: 5, caution: 5 }, score: { great: 6, good: 2, bad: -8 },
        outcomes: {
          great: { text: "함대가 도착했을 때 만은 이미 비어 있었다. 보고는 정확했고, 로는 아무것도 잃지 않았다.", effects: { trust: 10 } },
          good: { text: "보고는 늦었다는 지적을 받았지만 큰 문제는 없었다.", effects: { trust: 4 } },
          bad: { text: "함대가 생각보다 빨리 움직였다. 잠수함은 포화 속에 빠져나갔고, 로가 {name}을 다시 볼 일은 없을 것 같았다.", effects: { friendBond: -6 } }
        } }
    ] },

  // 사보 (드레스로자 이후 공개된 혁명군 참모총장)
  { id: "sabo_30", key: "sabo", threshold: 30, from: 0, to: 0, art: "childInlet", title: "실크해트의 신사",
    body: "항구 뒷골목에서 실크해트를 쓴 청년이 {name}에게 정중히 길을 물었다. 드레스로자에서 본 사보였다. 그는 정부의 감시선이 오가는 이 항구를 조용히 지나가야 한다며, 눈에 띄지 않는 길을 아느냐고 물었다.",
    choices: [
      { id: "route", label: "어부들이 쓰는 뒷길로 안내한다", hint: "감시선의 순찰 시간을 맞혀야 한다",
        check: { stat: "skill", against: 50 }, personality: { freedom: 5, loyalty: 3 }, score: LIKE,
        outcomes: {
          great: { text: "감시선이 지나간 직후 둘은 부두 끝에 닿았다. 사보는 모자를 벗어 정중히 인사하고 이 은혜는 꼭 갚겠다고 했다.", effects: { friendBond: 9, skill: 4 } },
          good: { text: "한 번 들킬 뻔했지만 무사히 빠져나갔다. 사보는 웃으며 덕분에 살았다고 했다.", effects: { friendBond: 5 } },
          bad: { text: "순찰선과 마주쳤다. 사보가 불꽃으로 시선을 돌려 둘 다 도망쳤지만, {name}의 얼굴이 수상한 자 명단에 올랐다.", effects: { trust: -10, health: -3 } }
        } },
      { id: "decoy", label: "자신이 앞서 걸으며 시선을 끈다", hint: "위험은 대신 지는 쪽이 진다",
        check: { stat: "trust", against: 50 }, personality: { empathy: 4, caution: -3 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "단골 상인들과 인사를 나누며 걷는 {name} 뒤로 사보는 사람들 속에 섞여 사라졌다. 이튿날 감사 쪽지와 함께 약간의 물자가 도착했다.", effects: { trust: 4, supplies: 10 } },
          good: { text: "검문에 붙잡혔지만 별일 없이 풀려났다. 사보는 이미 떠난 뒤였다.", effects: { trust: 3, supplies: 2 } },
          bad: { text: "검문이 길어져 하루를 붙잡혔다. 풀려나 보니 배에 실어 둔 물자 일부가 압수되어 있었다.", effects: { supplies: -10, health: -2 } }
        } }
    ] },
  { id: "sabo_60", key: "sabo", threshold: 60, from: 0, to: 0, art: "childInlet", title: "약상자를 맡기는 부탁",
    body: "다시 나타난 사보가 {name}에게 작은 상자 하나를 내밀었다. 근처 섬에 병이 돌고 있는데, 정부 배는 그 섬을 들르지 않는다고 했다. 혁명군의 배는 눈에 띄니 평범한 배인 {name}이 약을 전해 줄 수 없겠냐며 고개를 숙였다.",
    choices: [
      { id: "deliver", label: "봉쇄 해역을 뚫고 약을 전한다", hint: "들키면 혁명군 협력자로 낙인찍힌다",
        check: { stat: "skill", against: 65 }, personality: { empathy: 6, freedom: 5, caution: -4 }, score: { great: 15, good: 8, bad: -2 },
        outcomes: {
          great: { text: "약상자는 무사히 섬에 닿았다. 몇 달 뒤 사보는 그 섬의 아이들이 다 나았다는 소식을 전하며 진심으로 고맙다고 했다.", effects: { trust: 12, friendBond: 8 } },
          good: { text: "약은 전했지만 돌아오는 길에 추격을 받아 돛이 찢겼다.", effects: { trust: 6, supplies: -5 } },
          bad: { text: "검문에 걸려 약상자를 빼앗길 뻔했다. 바다에 상자를 던지고 겨우 도망쳤다. 사보는 탓하지 않았지만 {name}은 오래 마음이 무거웠다.", effects: { health: -10, trust: -6 } }
        } },
      { id: "trader", label: "믿을 만한 상선에 다리를 놓아 준다", hint: "직접 가지 않아도 길은 있다",
        check: { stat: "trust", against: 55 }, personality: { caution: 6, empathy: 3 }, score: CLOSE,
        outcomes: {
          great: { text: "오랜 거래처 선장이 기꺼이 상자를 실었다. 사보는 이런 연결이 세상을 바꾼다며 웃었다.", effects: { trust: 10, supplies: 3 } },
          good: { text: "약은 늦게나마 도착했다. 사보는 늦어도 닿은 게 중요하다고 했다.", effects: { trust: 5 } },
          bad: { text: "소개한 선장이 겁을 먹고 상자를 항구 관리에게 넘겼다. {name}의 이름도 함께 넘어갔다.", effects: { trust: -12 } }
        } }
    ] },

  // 네펠타리 비비 (알라바스타 이후, 공주로서 나라를 지키는 시기)
  { id: "vivi_30", key: "vivi", threshold: 30, from: 2, to: 1, art: (life) => life?.creationVersion >= 20 ? "workbenchReportLetters" : "arcAlabasta", title: "왕실 문장이 찍힌 편지",
    body: "{name}에게 알라바스타 왕실의 문장이 찍힌 편지가 도착했다. 비비였다. 그날 도와준 사람들을 하나하나 기억하고 있다며, 나라는 조금씩 비를 되찾고 있다고 적혀 있었다. 끝에는 답장을 기다린다는 말이 있었다.",
    choices: [
      { id: "reply", label: "정성껏 답장을 쓴다", hint: "글솜씨보다 마음이 닿아야 한다",
        check: { stat: "friendBond", against: 35 }, personality: { empathy: 5, loyalty: 3 }, score: LIKE,
        outcomes: {
          great: { text: "몇 달 뒤 두 번째 편지가 왔다. 비비는 {name}의 답장을 몇 번이고 읽었다며, 언젠가 꼭 다시 만나자고 했다.", effects: { friendBond: 10, trust: 4 } },
          good: { text: "짧은 답장이 오갔다. 비비의 글씨는 반듯했고 따뜻했다.", effects: { friendBond: 5 } },
          bad: { text: "답장은 폭풍에 휩쓸려 닿지 못했다. 그 사실을 {name}은 한참 뒤에야 알았다.", effects: { friendBond: -4 } }
        } },
      { id: "gift", label: "알라바스타에 보낼 물자를 함께 부친다", hint: "가뭄의 나라에 보내는 마음이다",
        check: { stat: "supplies", against: 50 }, personality: { empathy: 6 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "보낸 씨앗과 약초가 마을 하나에 닿았다. 비비의 답장에는 그 마을 아이들이 그린 그림이 함께 들어 있었다.", effects: { trust: 10, supplies: -4 } },
          good: { text: "물자는 무사히 도착했다. 비비는 고맙다며 왕실 상인단에 {name}의 이름을 일러 두었다.", effects: { trust: 6, supplies: -5 } },
          bad: { text: "운송 중에 짐 절반이 사라졌다. 비비는 마음만으로도 고맙다고 했지만 손해가 컸다.", effects: { supplies: -12 } }
        } }
    ] },
  { id: "vivi_60", key: "vivi", threshold: 60, from: 2, to: 1, places: ["알라바스타"], art: "arcAlabasta", title: "공주의 부탁",
    body: "알라바스타 항구에 닿은 {name}을 마중 나온 것은 큰 오리 카루를 탄 비비였다. 그녀는 외딴 오아시스 마을로 물을 나르는 수송대가 도적에게 시달린다며, 왕실 병사로는 손이 모자라 함께 가 줄 수 없겠냐고 물었다.",
    choices: [
      { id: "escort", label: "수송대 호위를 맡는다", hint: "사막의 도적은 모래 속에서 나타난다",
        check: { stat: "skill", against: 60 }, personality: { loyalty: 6, caution: -2 }, score: CLOSE,
        outcomes: {
          great: { text: "도적들은 {name}의 경고에 물러났고, 물은 한 방울도 흘리지 않고 마을에 닿았다. 비비는 마을 사람들 앞에서 {name}의 손을 잡고 고맙다고 했다.", effects: { trust: 14, friendBond: 6 } },
          good: { text: "물통 몇 개를 잃었지만 수송대는 도착했다. 비비는 지친 {name}에게 손수 물을 떠 주었다.", effects: { trust: 7, health: -4 } },
          bad: { text: "모래 폭풍 속에서 도적에게 기습당했다. 비비와 카루가 달려와 수송대를 수습했지만, {name}은 크게 다쳤다.", effects: { health: -14, trust: -4 } }
        } },
      { id: "well", label: "도적보다 마을에 우물을 파자고 제안한다", hint: "오래가는 해결은 오래 걸린다",
        check: { stat: "trust", against: 55 }, personality: { caution: 5, empathy: 5 }, score: { great: 14, good: 7, bad: -4 },
        outcomes: {
          great: { text: "비비는 눈을 반짝이며 그 생각을 왕에게 전하겠다고 했다. 이듬해 그 마을에서 우물을 팠다는 편지가 왔다.", effects: { trust: 12, friendBond: 8 } },
          good: { text: "비비는 좋은 생각이라며 기록해 두었다. 당장은 수송대가 먼저였지만, 그 대화는 오래 남았다.", effects: { trust: 6, friendBond: 4 } },
          bad: { text: "말만 앞섰다는 대신들의 눈총을 받았다. 비비가 감싸 주었지만 {name}은 부끄러웠다.", effects: { trust: -8 } }
        } }
    ] },

  // 한 단계만 있는 인물들
  { id: "smoker_30", key: "smoker", threshold: 30, from: 2, art: "harbor", title: "시가 연기 너머의 칭찬",
    body: "순찰을 마친 {name}에게 스모커가 다가왔다. 시가 두 개를 문 채 한참 말이 없더니, 어제 민간인을 먼저 대피시킨 판단은 옳았다고 툭 던졌다. 뒤에서 따라오던 타시기가 넘어지며 안경을 떨어뜨렸다.",
    choices: [
      { id: "glasses", label: "타시기의 안경부터 주워 준다", hint: "상관의 부하를 챙기는 일도 일이다",
        check: { stat: "friendBond", against: 35 }, personality: { empathy: 5 }, score: LIKE,
        outcomes: {
          great: { text: "타시기는 연신 고개를 숙였고, 스모커는 연기를 길게 뿜으며 다음 작전에 {name}을 넣겠다고 했다.", effects: { trust: 9, skill: 3 } },
          good: { text: "타시기가 고맙다고 했다. 스모커는 별말 없이 지나갔지만 고개를 한 번 끄덕였다.", effects: { trust: 5 } },
          bad: { text: "안경을 줍다가 밟아 버렸다. 스모커의 이마에 핏줄이 섰다.", effects: { trust: -6 } }
        } },
      { id: "question", label: "정의에 대해 솔직한 의문을 털어놓는다", hint: "스모커는 위에서 시키는 정의를 싫어한다",
        check: { stat: "trust", against: 50 }, personality: { freedom: 5, loyalty: 3 }, score: { great: 12, good: 6, bad: -4 },
        outcomes: {
          great: { text: "스모커는 시가를 비벼 끄며, 그 의문을 버리지 말라고만 했다. 그 뒤로 그는 {name}의 보고서를 끝까지 읽었다.", effects: { trust: 12, skill: 4 } },
          good: { text: "스모커는 대답 대신 연기만 뿜었다. 그래도 내쫓지는 않았다.", effects: { trust: 5 } },
          bad: { text: "말이 지나쳤다. 스모커는 그런 소리는 결과를 낸 뒤에 하라며 등을 돌렸다.", effects: { trust: -8 } }
        } }
    ] },
  { id: "aokiji_30", key: "aokiji", threshold: 30, from: 2, to: 2, art: "deck", title: "벤치 위의 대장",
    body: "항구 벤치에서 키 큰 사내가 안대를 쓰고 자고 있었다. 자전거가 옆에 세워져 있었다. 해군 대장 쿠잔이었다. {name}의 발소리에 안대를 들어 올린 그는, 어디서 봤더라 하고 한참 생각하다가 다시 눕더니 잠깐 이야기나 하자고 했다.",
    choices: [
      { id: "talk", label: "옆에 앉아 느긋하게 이야기를 나눈다", hint: "느긋한 사람의 말에도 뼈가 있다",
        check: { stat: "trust", against: 45 }, personality: { caution: 4, freedom: 3 }, score: LIKE,
        outcomes: {
          great: { text: "쿠잔은 하품을 섞어 가며 정의는 사람마다 다르다고 했다. 무심한 말투였지만 그 말은 {name}의 마음에 오래 남았다.", effects: { trust: 8, skill: 5 } },
          good: { text: "이야기는 대부분 날씨 이야기였다. 그래도 헤어질 때 쿠잔은 {name}의 이름을 기억해 냈다.", effects: { trust: 4, friendBond: 3 } },
          bad: { text: "쿠잔은 이야기 도중에 잠들었다. 깨울 수도 없어 {name}은 해가 질 때까지 옆에 앉아 있었다.", effects: { supplies: -4 } }
        } },
      { id: "guard", label: "잠든 동안 짐과 자전거를 지켜 준다", hint: "대장의 낮잠을 지키는 일이다",
        check: { stat: "skill", against: 40 }, personality: { loyalty: 5, empathy: 3 }, score: { great: 12, good: 5, bad: -3 },
        outcomes: {
          great: { text: "자전거를 노리던 좀도둑을 쫓아냈다. 깨어난 쿠잔은 상황을 듣고 느릿하게 웃더니, 고맙다며 얼린 과일 하나를 건넸다.", effects: { friendBond: 8, health: 4 } },
          good: { text: "아무 일도 없었다. 깨어난 쿠잔은 수고했다며 기지개를 켜고 자전거를 타고 떠났다.", effects: { friendBond: 4 } },
          bad: { text: "{name}도 같이 잠들었다. 깨어 보니 둘 다 짐 하나씩을 잃어버린 뒤였다.", effects: { supplies: -8 } }
        } }
    ] },
  { id: "dorry_30", key: "dorry", threshold: 30, from: 2, to: 2, places: ["리틀 가든"], art: "arcLittleGarden", title: "거인의 잔칫상",
    body: "{name}의 배가 리틀 가든 근해를 지날 때 화산은 조용했다. 해안에 내리자 거인 도리가 게갸갸갸 웃으며 반겼다. 다음 결투까지는 시간이 있다며 막 잡은 해왕류를 굽고 있으니 먹고 가라고 했다.",
    choices: [
      { id: "feast", label: "거인의 잔칫상에 앉는다", hint: "거인 몫의 한 접시는 사람 몫이 아니다",
        check: { stat: "health", against: 45 }, personality: { freedom: 5, empathy: 3 }, score: LIKE,
        outcomes: {
          great: { text: "고기 한 조각이 배를 채우고도 남았다. 도리는 엘바프 전사의 이야기를 들려주었고, 남은 고기를 소금에 절여 실어 주었다.", effects: { supplies: 12, health: 4 } },
          good: { text: "배가 터질 것 같았지만 즐거운 밤이었다. 도리의 웃음소리가 정글을 울렸다.", effects: { supplies: 5, friendBond: 4 } },
          bad: { text: "덜 익은 부위를 먹고 배탈이 났다. 도리는 미안하다며 커다란 손으로 등을 두드려 주었는데, 그게 더 아팠다.", effects: { health: -8 } }
        } },
      { id: "spar", label: "전사의 기량을 배우고 싶다고 청한다", hint: "거인의 연습 상대는 목숨을 건다",
        check: { stat: "skill", against: 65 }, personality: { ambition: 6, caution: -4 }, score: { great: 14, good: 6, bad: -2 },
        outcomes: {
          great: { text: "도리는 칼등으로 살살 상대해 주었지만 바람만으로 몸이 날아갔다. 끝까지 일어서는 {name}에게 그는 너도 전사라며 크게 웃었다.", effects: { skill: 14, health: -4 } },
          good: { text: "세 번 날아가고 세 번 일어섰다. 도리는 그거면 됐다고 했다.", effects: { skill: 6, health: -6 } },
          bad: { text: "첫 바람에 나무까지 날아갔다. 도리는 당황해서 결투도 잊고 {name}을 치료했다.", effects: { health: -15 } }
        } }
    ] },
  { id: "hachi_30", key: "hachi", threshold: 30, from: 1, to: 1, places: ["샤본디 제도"], art: "arcSabaody", title: "공짜 타코야키",
    body: "샤본디 제도의 맹그로브 사이에서 타코야키 냄새가 났다. 몸을 추스른 하치가 팔 여섯 개로 타코야키를 굴리던 하치가 {name}을 보고 뉴 하고 웃었다. 은혜를 잊지 않았다며 오늘은 공짜라고 했다. 다만 근처에 수상한 인간 상인이 서성였다.",
    choices: [
      { id: "eat", label: "고맙게 받아 먹고 장사를 돕는다", hint: "노점 일은 생각보다 바쁘다",
        check: { stat: "skill", against: 40 }, personality: { empathy: 4, loyalty: 3 }, score: LIKE,
        outcomes: {
          great: { text: "{name}이 손님을 부르자 줄이 길게 늘어섰다. 하치는 오늘 최고 매출이라며 남은 타코야키를 몽땅 싸 주었다.", effects: { supplies: 10, friendBond: 5 } },
          good: { text: "타코야키는 맛있었고 장사도 그럭저럭이었다. 하치는 뉴 하고 웃으며 또 오라고 했다.", effects: { supplies: 5 } },
          bad: { text: "철판을 엎어 타코야키 반이 날아갔다. 하치는 괜찮다고 했지만 {name}은 재료값을 물어 줬다.", effects: { supplies: -6 } }
        } },
      { id: "watch", label: "서성이는 수상한 상인을 막아선다", hint: "샤본디에는 어인을 노리는 자들이 있다",
        check: { stat: "trust", against: 55 }, personality: { loyalty: 5, caution: -2 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "{name}이 다가가자 상인은 슬금슬금 사라졌다. 하치는 눈물을 글썽이며 너는 좋은 인간이라고 했다.", effects: { trust: 8, friendBond: 8 } },
          good: { text: "상인은 시비를 걸다 물러났다. 하치는 고맙다며 타코야키를 두 배로 얹어 주었다.", effects: { trust: 4, supplies: 4 } },
          bad: { text: "상인이 데려온 패거리에게 둘러싸였다. 하치가 문어 팔로 막아 주었지만, 노점이 부서졌다.", effects: { health: -10, supplies: -4 } }
        } }
    ] },
  { id: "rebecca_30", key: "rebecca", threshold: 30, from: 0, to: 0, places: ["드레스로자"], art: "arcDressrosa", title: "콜로세움의 검투사였던 소녀",
    body: "드레스로자에서 알게 된 레베카가 {name}에게 편지를 보냈다. 나라는 다시 일어서고 있고, 장난감이었던 사람들도 가족 곁으로 돌아왔다고 했다. 가까이 오면 해바라기 밭을 보여 주겠다는 말도 있었다. 마침 배는 드레스로자 근해였다.",
    choices: [
      { id: "visit", label: "드레스로자에 들러 해바라기 밭을 걷는다", hint: "아직 상처가 남은 나라다",
        check: { stat: "trust", against: 40 }, personality: { empathy: 5 }, score: LIKE,
        outcomes: {
          great: { text: "레베카는 해바라기 사이를 앞장서 걸으며 웃었다. 싸우지 않아도 되는 날이 좋다고 했다. 그 웃음을 {name}은 오래 기억했다.", effects: { friendBond: 10, health: 4 } },
          good: { text: "짧은 만남이었다. 레베카는 바빠 보였지만 꼭 다시 오라고 했다.", effects: { friendBond: 5 } },
          bad: { text: "항구 검문이 길어져 약속 시간에 늦었다. 레베카는 이미 성으로 돌아간 뒤였고, 쪽지만 남아 있었다.", effects: { friendBond: -4, supplies: -3 } }
        } },
      { id: "train", label: "그녀의 방어 검술을 배우고 싶다고 청한다", hint: "다치게 하지 않는 검은 어렵다",
        check: { stat: "skill", against: 55 }, personality: { ambition: 4, caution: 4 }, score: { great: 12, good: 6, bad: -3 },
        outcomes: {
          great: { text: "레베카는 피하고 막는 법만 가르쳤다. 해 질 녘 {name}은 그녀의 칼을 한 번도 맞지 않고 버텨 냈다.", effects: { skill: 12, health: 2 } },
          good: { text: "몇 번 맞았지만 감은 잡았다. 레베카는 미안하다며 연고를 발라 주었다.", effects: { skill: 6, health: -3 } },
          bad: { text: "공격 위주로 덤비자 레베카의 얼굴이 굳었다. 그녀는 오늘은 그만하자며 칼을 내려놓았다.", effects: { friendBond: -5, health: -4 } }
        } }
    ] },
  { id: "bonney_30", key: "bonney", threshold: 30, from: 0, to: 0, art: "mishapFeast", title: "남의 접시를 노리는 손",
    body: "선술집에서 {name}이 주문한 피자가 나오자마자 반이 사라졌다. 맞은편에 앉은 보니가 입 안 가득 피자를 물고 있었다. 그녀는 사과는커녕 하나 더 시키라고 했다. 탁자 위에는 빈 접시가 이미 탑처럼 쌓여 있었다.",
    choices: [
      { id: "order", label: "웃으며 피자를 더 시킨다", hint: "보니의 식욕에는 바닥이 없다",
        check: { stat: "supplies", against: 50 }, personality: { empathy: 4, freedom: 3 }, score: LIKE,
        outcomes: {
          great: { text: "열 판째에서 보니가 드디어 숨을 돌렸다. 너 좀 괜찮은 녀석이라며, 이 근처 바다에서 해군 순찰이 뜸한 길을 알려 주었다.", effects: { friendBond: 8, skill: 4, supplies: -3 } },
          good: { text: "계산서가 무시무시했다. 보니는 배를 두드리며 다음에 또 사라고 했다.", effects: { friendBond: 5, supplies: -7 } },
          bad: { text: "돈이 모자라자 보니는 사라지고 없었다. 계산서만 {name}의 앞에 남았다.", effects: { supplies: -12 } }
        } },
      { id: "protest", label: "남의 음식에 손대지 말라고 맞선다", hint: "화난 보니는 무섭다",
        check: { stat: "trust", against: 55 }, personality: { ambition: 4, caution: -2 }, score: { great: 10, good: 4, bad: -5 },
        outcomes: {
          great: { text: "보니는 눈을 가늘게 뜨더니 이내 크게 웃었다. 배짱이 마음에 든다며 남은 피자를 반으로 나눠 주었다.", effects: { friendBond: 10, trust: 4 } },
          good: { text: "보니는 혀를 차며 제 몫을 따로 시켰다. 그래도 탁자는 같이 썼다.", effects: { friendBond: 4 } },
          bad: { text: "말다툼 끝에 탁자가 엎어졌다. 둘 다 선술집에서 쫓겨났다.", effects: { trust: -8, health: -3 } }
        } }
    ] },
  { id: "blackbeard_30", key: "blackbeard", threshold: 30, from: 2, to: 2, beforeWar: true, art: "arcJaya", title: "체리 파이를 권하는 사내",
    body: "어느 항구의 선술집에서 이 빠진 거구의 사내가 {name}에게 체리 파이를 밀어 주었다. 자야에서 본 티치였다. 그는 제하하하 웃으며 요즘 바다에 도는 소문을 묻더니, 특히 현상금이 오른 해적들 이야기에 귀를 기울였다.",
    choices: [
      { id: "pie", label: "파이만 먹고 소문은 모른다고 한다", hint: "모른다는 말이 가장 안전하다",
        check: { stat: "trust", against: 40 }, personality: { caution: 7 }, score: { great: 6, good: 3, bad: -4 },
        outcomes: {
          great: { text: "티치는 아쉬운 기색 없이 웃으며 파이 한 판을 더 시켰다. 그의 눈이 웃지 않는다는 것을 {name}은 그날 처음 알았다.", effects: { supplies: 6, trust: 4 } },
          good: { text: "티치는 금세 관심을 잃고 다른 손님에게 갔다. 파이는 달았다.", effects: { supplies: 3 } },
          bad: { text: "티치는 정말 모르냐며 한참 {name}을 바라보았다. 그날 밤 숙소 문 앞에서 누군가 서성이는 소리가 났다.", effects: { health: -5, trust: -3 } }
        } },
      { id: "rumor", label: "들은 소문 하나를 값으로 판다", hint: "이 사내에게 정보를 파는 대가는 알 수 없다",
        check: { stat: "skill", against: 60 }, personality: { ambition: 6, caution: -5 }, score: { great: 12, good: 6, bad: -8 },
        outcomes: {
          great: { text: "티치는 제하하하 웃으며 금화 주머니를 탁자에 던졌다. 사람의 운명은 정해져 있다는 말을 남기고 그는 떠났다. 왜인지 등이 서늘했다.", effects: { supplies: 14, trust: -2 } },
          good: { text: "티치는 그 정도는 이미 안다며 동전 몇 닢만 내밀었다.", effects: { supplies: 4 } },
          bad: { text: "소문이 틀렸다는 것을 안 티치의 부하들이 다음 항구에서 {name}을 기다리고 있었다. 가까스로 빠져나왔지만 물자를 잃었다.", effects: { supplies: -12, health: -8 } }
        } }
    ] }
];
