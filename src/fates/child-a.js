// Childhood fates A: a child washed ashore, a bandit toll, a World Noble procession.
export default [
  {
    key: "drift_child", title: "파도가 데려온 아이",
    legacy: {
      default: "바다가 무엇을 데려오든 먼저 손을 내미는 사람이 됐다.",
      cave_found: "닫힌 문을 보면 그 너머부터 궁금해하는 사람이 됐다.",
      lio_sailed: "어디서든 쫓기는 사람의 편에 먼저 서는 사람이 됐다.",
      lio_taken: "지키지 못한 손 하나를 평생 마음에 품고 살았다.",
      lio_reunited: "헤어진 사람도 바다 어딘가에서 다시 만난다고 믿는 사람이 됐다.",
      sunken_seen: "아무도 가 보지 않은 바다 밑의 이야기를 평생 간직하게 됐다."
    },
    chapters: [
      { step: 1, id: "found", age: 6, art: "childInlet", title: "모래 위의 아이",
        body: "폭풍이 지나간 새벽, {name}은 후미의 모래밭에서 또래만 한 아이를 발견했다. 아이는 정신을 잃은 채 깨진 나침반 문양이 새겨진 은빛 목걸이를 꼭 쥐고 있었다. 수평선 너머로 검은 돛 한 척이 천천히 멀어지고 있었다.",
        choices: [
          { id: "carry", label: "아이를 업고 집까지 달린다", hint: "작은 등에는 무거운 짐",
            check: { stat: "health", against: 45 }, personality: { empathy: 6, freedom: 2 },
            outcomes: {
              great: { text: "{name}은 쉬지 않고 언덕길을 올라 집 문을 두드렸다. 따뜻한 수프를 먹고 깨어난 아이는 자기 이름이 리오라는 것만 겨우 말하고, {name}의 소매를 놓지 않았다.", effects: { bond: 5, health: -1, friendBond: 6 }, mark: "kept_child" },
              good: { text: "몇 번이나 넘어지며 겨우 집에 닿았다. 무릎이 다 까졌지만, 깨어난 리오는 경계하는 눈으로 집 안을 둘러보다 끝내 수프 그릇을 비웠다.", effects: { health: -3, bond: 4, friendBond: 3 }, mark: "kept_child" },
              bad: { text: "중간에 힘이 빠져 아이를 내려놓고 어른을 부르러 간 사이, 아이는 깨어나 사라졌다. 모래 위에는 작은 발자국과 은빛 목걸이만 남아 있었다.", effects: { health: -5, trust: -2 }, mark: "locket_only" }
            } },
          { id: "call_adults", label: "부두로 달려가 어른들을 부른다", hint: "어른들은 어른의 셈을 한다",
            check: { stat: "trust", against: 45 }, personality: { caution: 4, loyalty: 3 },
            outcomes: {
              great: { text: "의원 마렌이 담요를 들고 달려왔고, 부두 사람들은 아이를 돌아가며 돌보기로 했다. 깨어난 아이는 리오라고 이름을 밝혔고, 가장 먼저 자신을 찾아낸 {name}에게 목걸이를 맡겼다.", effects: { trust: 6, friendBond: 4 }, mark: "kept_child" },
              good: { text: "항만장은 아이를 해군 초소에 넘기며 장부에 이름을 적었다. 리오라는 아이는 초소 창살 너머에서 {name}에게 짧게 손을 흔들었다.", effects: { trust: 3, friendBond: 1 }, mark: "marine_ledger" },
              bad: { text: "어른들을 데리고 돌아왔을 때 아이는 이미 없었다. 물가에 떨어진 은빛 목걸이를 주운 {name}은 괜히 어른들을 불렀다는 핀잔까지 들었다.", effects: { trust: -3, bond: -2 }, mark: "locket_only" }
            } },
          { id: "hide_locket", label: "목걸이부터 몰래 감춘다", hint: "누군가 이걸 찾으러 올지도",
            check: { stat: "skill", against: 40 }, personality: { caution: 6, empathy: -1 }, mark: "locket_hidden",
            outcomes: {
              great: { text: "{name}은 목걸이를 등대 돌벽 틈에 숨긴 뒤 아이를 깨웠다. 리오라는 아이는 목걸이가 무사하다는 말에 처음으로 울음을 터뜨렸고, 그날부터 {name}의 집에서 지냈다.", effects: { skill: 4, friendBond: 6 }, mark: "kept_child" },
              good: { text: "목걸이를 숨기는 사이 깨어난 아이가 그것을 내놓으라며 달려들었다. 한바탕 뒹군 끝에 둘은 숨긴 곳을 함께 알기로 했고, 아이는 리오라고 이름을 말했다.", effects: { health: -2, friendBond: 4 }, mark: "kept_child" },
              bad: { text: "숨길 곳을 고르느라 시간을 끄는 사이 아이는 깨어나 비틀거리며 언덕 너머로 달아났다. {name}의 주머니에는 주인 잃은 목걸이만 무겁게 남았다.", effects: { friendBond: -4, skill: 1 }, mark: "locket_only" }
            } }
        ] },

      { step: 2, id: "seekers", age: 8, art: "harbor", title: "장갑 낀 손님", requires: ["kept_child"],
        body: "리오가 {home}에서 지낸 지 두 해째 되던 봄, 검은 돛배가 부두에 닿았다. 흰 장갑을 낀 오브레라는 사내가 깨진 나침반 문양을 그린 종이를 장터마다 붙이며, 목걸이를 가진 아이를 데려오면 큰돈을 주겠다고 했다. 그날 밤 리오는 한마디도 하지 않았다.",
        choices: [
          { id: "lie", label: "그런 아이는 본 적 없다고 한다", hint: "거짓말은 표정에서 샌다",
            check: { stat: "skill", against: 45 }, personality: { loyalty: 6, caution: -2 },
            outcomes: {
              great: { text: "{name}은 리오가 서쪽 섬으로 가는 배를 탔다는 그럴듯한 이야기를 지어냈다. 오브레는 고맙다며 동전까지 쥐여 주고 엉뚱한 바다로 떠났다.", effects: { skill: 5, supplies: 3, friendBond: 4 }, mark: "lio_stayed" },
              good: { text: "오브레는 웃으며 떠났지만 부두 술집에 사람 하나를 남겨 두었다. 리오는 그날부터 해가 지면 집 밖에 나가지 못했다.", effects: { friendBond: 3, trust: -1 }, mark: "lio_stayed" },
              bad: { text: "말끝이 떨린 것을 오브레는 놓치지 않았다. 장갑 낀 손이 {name}의 어깨를 붙잡으며 다시 오겠다고 속삭였고, 그 손은 바닷물처럼 차가웠다.", effects: { health: -3, bond: -2 }, mark: "seeker_suspects" }
            } },
          { id: "ask_lio", label: "리오에게 진실을 묻는다", hint: "알고 나면 돌이킬 수 없다",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 6, loyalty: 2 },
            outcomes: {
              great: { text: "리오는 떨리는 목소리로 털어놓았다. 먼 섬의 귀족 저택에 하인으로 팔려 다니다 도망쳤고, 오브레는 사람을 사고파는 중개인이라고. {name}은 끝까지 숨겨 주겠다고 약속했다.", effects: { friendBond: 8, bond: 2 }, mark: "lio_truth" },
              good: { text: "리오는 오브레가 나쁜 사람이라는 말만 하고 입을 닫았다. 대신 그날 밤부터 {name}에게 몰래 문 따는 법과 발소리 죽이는 법을 가르쳤다.", effects: { skill: 4, friendBond: 2 }, mark: "lio_stayed" },
              bad: { text: "다음 날 아침 리오의 이불은 차갑게 비어 있었다. 머리맡에는 서툰 글씨로 고맙고 미안하다는 쪽지 한 장만 놓여 있었다.", effects: { friendBond: -6, bond: -1 }, mark: "lio_gone" }
            } },
          { id: "tell_marines", label: "해군 초소에 알린다", hint: "제복이 늘 정의는 아니다",
            check: { stat: "trust", against: 50 }, personality: { loyalty: 3, caution: 4 },
            outcomes: {
              great: { text: "초소의 하스케 상사는 오브레의 얼굴을 수배 전단과 맞춰 보더니 그 자리에서 수갑을 채웠다. 사람을 사고파는 중개인이었다. 리오는 처음으로 부두를 마음껏 뛰어다녔다.", effects: { trust: 8, friendBond: 4 }, mark: "broker_caught" },
              good: { text: "하스케 상사는 증거가 없다며 체포는 못 했지만 밤마다 부두를 순찰했다. 오브레는 사흘 만에 돛을 올렸다.", effects: { trust: 4 }, mark: "lio_stayed" },
              bad: { text: "초소의 다른 병사가 오브레에게 술값을 받고 리오가 사는 집을 알려 주었다. {name}은 제복도 돈 앞에서 고개를 숙인다는 걸 처음 알았다.", effects: { trust: -4, bond: -3 }, mark: "seeker_suspects" }
            } }
        ] },
      { step: 2, id: "locket", age: 8, art: "childChart", title: "목걸이 속의 지도", requires: ["locket_only"],
        body: "{name}은 주인 잃은 목걸이를 두 해 동안 베개 밑에 두었다. 어느 날 떨어뜨린 목걸이가 반으로 갈라지며, 안에서 콩알만 한 해도와 낯선 아이의 초상이 나왔다. 같은 주에 장터에 나타난 노파 에델이 깨진 나침반 문양을 본 적 있느냐고 묻고 다녔다.",
        choices: [
          { id: "show_edel", label: "에델에게 목걸이를 보여 준다", hint: "늙은 눈이 반짝였다",
            check: { stat: "trust", against: 40 }, personality: { empathy: 4, caution: -4 },
            outcomes: {
              great: { text: "에델은 초상을 보자마자 주저앉아 울었다. 바다에서 잃은 손주를 찾아 여러 섬을 떠돌던 할머니였다. 에델은 해도의 뜻을 {name}에게 일러 주고, 아이가 살아 있다는 희망을 안고 다시 길을 떠났다.", effects: { trust: 5, skill: 4 }, mark: "map_read" },
              good: { text: "에델은 목걸이를 한참 쓰다듬다 값을 치르고 가져가려 했다. {name}이 거절하자 노파는 해도만 베껴 가게 해 달라고 부탁했고, 둘은 말없이 밤을 새웠다.", effects: { skill: 3, supplies: 2 }, mark: "map_read" },
              bad: { text: "에델은 친절한 얼굴로 목걸이를 빌려 가더니 그날 밤 배를 타고 사라졌다. 다음 날 노파가 흰 장갑을 낀 사내에게 돈을 받는 걸 봤다는 소문이 돌았다.", effects: { supplies: -3, trust: -3 }, mark: "lost_locket" }
            } },
          { id: "keep_secret", label: "아무에게도 말하지 않는다", hint: "비밀은 혼자 지면 무겁다",
            check: { stat: "skill", against: 45 }, personality: { caution: 6, freedom: 2 },
            outcomes: {
              great: { text: "{name}은 밤마다 등대 불빛 아래서 해도를 베껴 그렸다. 바늘 끝 같은 표시가 {home}의 후미 바위굴을 가리킨다는 걸 알아냈을 때, 손이 떨려 등잔이 흔들렸다.", effects: { skill: 7 }, mark: "map_read" },
              good: { text: "해도는 아무리 들여다봐도 반쯤만 읽혔다. 그래도 {name}은 그 반쪽이 이 섬 어딘가를 가리킨다는 것만은 확신했다.", effects: { skill: 3 }, mark: "map_read" },
              bad: { text: "비밀을 품고 끙끙 앓던 {name}은 잠꼬대로 목걸이 이야기를 늘어놓았다. 다음 날 아침 동생뻘 아이들이 온 동네에 보물 지도 소문을 퍼뜨려 놓았다.", effects: { friendBond: -2, trust: -3 }, mark: "map_rumor" }
            } },
          { id: "sell", label: "장터에 내다 판다", hint: "은은 은값을 받는다",
            check: { stat: "supplies", against: 40 }, personality: { ambition: 6, empathy: -4 },
            outcomes: {
              great: { text: "고물상 주인은 목걸이를 보더니 값을 곱절로 쳐주겠다며 오히려 몸을 낮췄다. 이상한 낌새에 {name}은 해도만은 빼 두었고, 그 돈으로 집의 겨울 땔감을 샀다.", effects: { supplies: 8, bond: 2 }, mark: "map_read" },
              good: { text: "목걸이는 생각보다 헐값에 팔렸다. 그래도 그 돈으로 양육자에게 새 그물을 사 주었고, 그날 저녁 밥상은 오래도록 따뜻했다.", effects: { supplies: 4, bond: 2 }, mark: "lost_locket" },
              bad: { text: "고물상은 목걸이를 받자마자 문을 잠그고 누군가에게 전보벌레를 걸었다. 겁에 질려 돈도 못 받고 도망친 {name}은 한동안 장터 쪽으로 고개도 돌리지 못했다.", effects: { supplies: -2, health: -2, trust: -2 }, mark: "lost_locket" }
            } }
        ] },
      { step: 2, id: "hillthief", age: 8, art: "childMarket", title: "언덕의 좀도둑",
        body: "해군 초소에 맡겨진 리오는 이송선이 오기 전날 밤 창살을 빠져나가 사라졌다. 두 해 뒤, {home}의 장터에서 빵과 생선이 하나씩 없어지기 시작했고, 어른들은 언덕 숲에 사는 들짐승 같은 아이를 잡겠다며 몽둥이를 챙겼다.",
        choices: [
          { id: "lure", label: "몰래 음식을 들고 숲으로 간다", hint: "들짐승도 배는 고프다",
            check: { stat: "friendBond", against: 40 }, personality: { empathy: 7, caution: -3 },
            outcomes: {
              great: { text: "{name}이 바위 위에 빵을 두고 기다리자, 해 질 녘 깡마른 리오가 나타났다. 둘은 아무 말 없이 빵을 나눠 먹었고, 그날 밤 리오는 {name}을 따라 집으로 내려왔다.", effects: { friendBond: 8, bond: 2 }, mark: "lio_stayed" },
              good: { text: "리오는 음식만 낚아채 달아났지만 다음 날 바위 위에 조개껍질 목걸이 하나를 두고 갔다. 그 뒤로 둘은 말 대신 물건을 주고받았다.", effects: { friendBond: 4 }, mark: "lio_stayed" },
              bad: { text: "비탈에서 굴러 다친 {name}을 업고 마을로 내려온 건 리오였다. 그러나 리오는 기다리던 어른들의 몽둥이를 피해 바다 쪽으로 달아나 다시는 돌아오지 않았다.", effects: { health: -6, friendBond: 2 }, mark: "lio_gone" }
            } },
          { id: "trap", label: "친구들과 덫을 놓아 잡는다", hint: "잡은 다음이 문제다",
            check: { stat: "skill", against: 45 }, personality: { ambition: 4, empathy: -2 },
            outcomes: {
              great: { text: "그물 덫에 걸린 건 리오였다. 어른들보다 먼저 덫에 닿은 {name}은 그물을 풀어 주고, 함께 장터에 서서 사정을 이야기했다. 상인들은 투덜대면서도 리오에게 일자리를 줬다.", effects: { trust: 6, friendBond: 5 }, mark: "lio_stayed" },
              good: { text: "덫에는 리오 대신 장터 고양이가 걸렸지만, 소란을 듣고 나온 리오와 마주쳤다. 리오는 도둑질을 그만두는 대신 아무에게도 알리지 말라는 약속을 받아 냈다.", effects: { friendBond: 3, trust: -1 }, mark: "lio_stayed" },
              bad: { text: "덫은 리오를 잡았고, 어른들이 먼저 달려왔다. 다시 초소로 끌려가는 리오는 {name}을 원망하는 눈으로 쳐다봤다. 그 눈빛은 오래 잊히지 않았다.", effects: { friendBond: -6, trust: 3 }, mark: "lio_gone" }
            } },
          { id: "tell_home", label: "양육자에게 털어놓는다", hint: "어른의 등도 가끔은 넓다",
            check: { stat: "bond", against: 45 }, personality: { loyalty: 5, caution: 3 },
            outcomes: {
              great: { text: "양육자는 말없이 듣다가 그날 밤 등불을 들고 숲으로 올라갔다. 리오는 처음엔 돌을 던졌지만 결국 담요에 싸여 집으로 내려왔고, 마을에는 먼 친척 아이라고만 알려졌다.", effects: { bond: 7, friendBond: 3 }, mark: "lio_stayed" },
              good: { text: "양육자는 장터 상인들에게 대신 값을 치르며 사냥을 멈춰 달라고 고개를 숙였다. 리오는 여전히 숲에 살았지만, 더는 쫓기지 않았다.", effects: { bond: 3, supplies: -2, trust: 2 }, mark: "lio_stayed" },
              bad: { text: "양육자는 위험한 아이에게 가까이 가지 말라며 {name}을 집에 가둬 두었다. 창 너머로 횃불이 숲을 훑던 밤이 지나고, 리오의 흔적은 영영 사라졌다.", effects: { bond: -4, friendBond: -3 }, mark: "lio_gone" }
            } }
        ] },

      { step: 3, id: "lantern", age: 11, art: "childFestival", title: "등불 축제의 추격",
        requires: ["lio_stayed", "lio_truth", "broker_caught", "seeker_suspects"],
        body: "등불 축제 날 밤, 깨진 나침반 깃발을 단 무장선이 {home} 앞바다에 닻을 내렸다. 리오를 찾는 사냥꾼들이 횃불을 들고 골목마다 문을 두드렸고, 리오는 {name}의 손을 붙잡고 오늘 밤 안에 섬을 떠나야 한다고 말했다.",
        choices: [
          { id: "smuggle", label: "상선 짐칸에 리오를 숨긴다", hint: "선장은 값을 부를 것이다",
            check: { stat: "supplies", against: 45 }, personality: { loyalty: 5, freedom: 4 },
            outcomes: {
              great: { text: "{name}은 모아 둔 돈을 몽땅 털어 늙은 상선 선장을 설득했다. 소금 자루 틈에 숨은 리오는 새벽 안개 속으로 사라지며, 은빛 목걸이를 {name}의 손에 쥐여 주었다.", effects: { supplies: -4, friendBond: 8, trust: 4 }, mark: "lio_sailed" },
              good: { text: "선장은 돈이 모자라다며 투덜댔지만 결국 배를 띄웠다. 리오를 태운 배가 떠난 뒤, {name}은 빈 지갑과 함께 사냥꾼들의 의심 어린 눈초리를 견뎌야 했다.", effects: { supplies: -6, friendBond: 5, trust: 2 }, mark: "lio_sailed" },
              bad: { text: "선장은 돈을 받고도 사냥꾼들에게 짐칸을 열어 주었다. 끌려가는 리오가 마지막으로 {name}을 돌아보았고, 축제의 등불이 그 얼굴을 환히 비추었다.", effects: { supplies: -5, friendBond: -5 }, mark: "lio_taken" }
            } },
          { id: "decoy", label: "등불로 가짜 길을 만든다", hint: "불빛은 사람을 홀린다",
            check: { stat: "skill", against: 50 }, personality: { freedom: 5, ambition: 3 },
            outcomes: {
              great: { text: "{name}은 친구들과 등불을 언덕 반대편으로 줄지어 흘려보냈다. 사냥꾼들이 엉뚱한 언덕을 뒤지는 동안 리오는 고깃배로 빠져나갔고, 사람들은 그 등불 행렬을 올해 최고의 장관이라 불렀다.", effects: { skill: 5, friendBond: 5, trust: 3 }, mark: "lantern_decoy" },
              good: { text: "가짜 불빛 덕에 리오는 빠져나갔지만, 등불 하나가 장터 천막에 옮겨붙었다. {name}은 불을 끄느라 밤을 새웠고, 이듬해 축제 준비를 혼자 떠맡았다.", effects: { skill: 3, health: -2, trust: -1, friendBond: 3 }, mark: "lio_sailed" },
              bad: { text: "바람이 바뀌어 등불들이 모두 {name}이 숨은 골목 쪽으로 날아왔다. 사냥꾼들은 불빛을 따라 곧장 리오를 찾아냈고, 막아서던 {name}은 거칠게 밀쳐져 돌바닥에 쓰러졌다.", effects: { health: -7, friendBond: -2 }, mark: "lio_taken" }
            } },
          { id: "hide", label: "등대 지하에 함께 숨는다", hint: "기다림은 숨이 길어야 한다",
            check: { stat: "health", against: 45 }, personality: { caution: 6, loyalty: 3 },
            outcomes: {
              great: { text: "둘은 등대 지하 저장고에서 꼬박 사흘을 버텼다. 사냥꾼들은 빈손으로 돛을 올렸고, 등대지기는 못 본 척 문 앞에 빵을 놓아두었다. 리오는 그해 겨울 스스로 바다로 나가기로 했다.", effects: { health: -2, friendBond: 6, trust: 4 }, mark: "lio_sailed" },
              good: { text: "저장고의 습기에 둘 다 열병을 앓았지만 사냥꾼들은 끝내 찾아내지 못했다. 몸을 추스른 리오는 더는 짐이 될 수 없다며 지나가던 고깃배를 탔다.", effects: { health: -5, friendBond: 5 }, mark: "lio_sailed" },
              bad: { text: "기침 한 번이 모든 걸 망쳤다. 문을 박차고 들어온 사냥꾼들이 리오를 끌어냈고, {name}에게 귀찮다는 듯 동전 한 닢을 던져 주었다.", effects: { health: -4, friendBond: -5, bond: -1 }, mark: "lio_taken" }
            } }
        ] },
      { step: 3, id: "poster", age: 11, art: "harbor", title: "되찾기 공고", requires: ["lio_gone"],
        body: "리오가 사라지고 몇 해가 지난 어느 날, 부두 게시판에 낯익은 얼굴이 붙었다. 현상금 수배서가 아니라 잃어버린 재산을 찾는다는 귀족 가문의 공고였다. 그림 속 리오는 {name}이 기억하는 얼굴보다 훨씬 말라 있었다.",
        choices: [
          { id: "search", label: "옆 섬 항구까지 찾아간다", hint: "아이 혼자 가기엔 먼 바다",
            check: { stat: "health", against: 50 }, personality: { freedom: 6, loyalty: 4 },
            outcomes: {
              great: { text: "{name}은 우편선 밑칸에 숨어 옆 섬 항구에 닿았고, 하역장 구석에서 짐을 나르던 리오를 찾아냈다. 둘은 해가 질 때까지 숨어서 이야기했고, 리오는 언젠가 반드시 자유로워지겠다고 약속했다.", effects: { health: -2, friendBond: 9, skill: 2 }, mark: "searched_port" },
              good: { text: "항구까지는 갔지만 리오는 이미 다른 배로 옮겨진 뒤였다. 대신 하역장 인부에게서 리오가 늘 {home} 쪽 바다를 바라봤다는 이야기를 들었다.", effects: { health: -3, friendBond: 4 }, mark: "searched_port" },
              bad: { text: "폭풍을 만난 우편선이 되돌아왔고, 몰래 탄 {name}은 선원들에게 들켜 부두에서 크게 혼났다. 양육자는 사흘 동안 말을 걸지 않았다.", effects: { health: -4, bond: -5 }, mark: "lio_lost" }
            } },
          { id: "tear", label: "친구들과 공고를 모두 뜯는다", hint: "종이는 찢어도 또 붙는다",
            check: { stat: "trust", against: 45 }, personality: { freedom: 6, caution: -4 },
            outcomes: {
              great: { text: "{name}과 친구들은 밤새 섬의 공고를 모두 뜯어 바다에 띄웠다. 다음 날 아무도 공고 이야기를 꺼내지 않았고, 장터 할머니는 잘했다며 몰래 사탕을 쥐여 주었다.", effects: { trust: 5, friendBond: 6 }, mark: "tore_posters" },
              good: { text: "공고를 뜯다 순찰병에게 들켰지만, 동네 어른들이 아이들 장난이라며 감싸 주었다. 벌로 부두 청소를 했지만 친구들과는 더 끈끈해졌다.", effects: { friendBond: 5, trust: -1 }, mark: "tore_posters" },
              bad: { text: "뜯어낸 공고를 집에 숨겼다가 들켰다. 귀족 가문과 엮이면 집안이 망한다며 양육자는 {name}을 크게 꾸짖었고, 그해 내내 부두 출입이 금지되었다.", effects: { bond: -5, trust: -3 }, mark: "lio_lost" }
            } },
          { id: "keep", label: "공고 한 장을 몰래 간직한다", hint: "얼굴을 잊지 않기 위해",
            check: { stat: "bond", against: 40 }, personality: { loyalty: 6, caution: 3 },
            outcomes: {
              great: { text: "{name}은 공고를 접어 양육자에게 보여 주었다. 양육자는 오래 그림을 보다가, 가문의 문장과 배 이름을 꼼꼼히 받아 적는 법을 가르쳐 주었다. 언젠가 쓸 데가 있을 거라고 했다.", effects: { bond: 7, skill: 3 }, mark: "poster_kept" },
              good: { text: "공고는 서랍 깊숙이 들어갔다. {name}은 가끔 꺼내 보며 리오가 어디쯤 있을지 바다 지도 위에 손가락으로 길을 그렸다.", effects: { skill: 2, friendBond: 2 }, mark: "poster_kept" },
              bad: { text: "어느 날 서랍을 열자 공고는 젖어서 얼굴이 번져 있었다. 리오의 얼굴이 기억 속에서도 함께 흐려지는 것 같아, {name}은 한참을 울었다.", effects: { friendBond: -3, bond: -1 }, mark: "lio_lost" }
            } }
        ] },
      { step: 3, id: "cave", age: 11, art: "childInlet", title: "썰물 아래의 굴",
        body: "그해 가장 큰 썰물이 오던 날, 목걸이 속 해도가 가리키던 후미의 바위굴 입구가 물 밖으로 드러났다. 이끼 낀 돌문에는 깨진 나침반 문양이 새겨져 있었다. 물이 다시 차기까지는 반나절도 남지 않았다.",
        choices: [
          { id: "alone", label: "혼자 굴 안으로 들어간다", hint: "물때를 잊지 말 것",
            check: { stat: "health", against: 50 }, personality: { freedom: 6, caution: -5 },
            outcomes: {
              great: { text: "굴 안쪽 돌방에서 {name}은 녹슨 상자를 찾아냈다. 안에는 몰락한 왕국의 항해 일지와 금화 몇 닢이 들어 있었고, 마지막 장에는 바다에 띄워 보낸 왕실 아이의 기록이 적혀 있었다.", effects: { supplies: 8, skill: 4 }, mark: "cave_found" },
              good: { text: "돌방까지 갔지만 물이 차오르기 시작해 항해 일지 한 권만 들고 겨우 빠져나왔다. 젖은 일지는 반쯤 지워졌어도 먼 바다의 항로가 또렷했다.", effects: { skill: 5, health: -2 }, mark: "cave_found" },
              bad: { text: "굴 안에서 길을 잃은 사이 물이 들이쳤다. 등대지기가 밧줄을 던져 건져 냈을 때 {name}은 덜덜 떨고 있었고, 굴 입구는 그날 무너져 내렸다.", effects: { health: -8, bond: -2 }, mark: "cave_flooded" }
            } },
          { id: "friends", label: "친구들을 모아 함께 간다", hint: "보물은 나누면 줄어든다",
            check: { stat: "friendBond", against: 45 }, personality: { loyalty: 6, ambition: -2 },
            outcomes: {
              great: { text: "친구들이 밧줄을 잡고 입구를 지키는 동안 {name}은 돌방의 상자를 꺼내 왔다. 안에서 나온 금화는 똑같이 나눴고, 항해 일지는 모두의 비밀이 되었다.", effects: { friendBond: 8, supplies: 3 }, mark: "cave_found" },
              good: { text: "누가 먼저 들어갈지 다투느라 시간을 다 보내고, 겨우 일지 몇 장만 건졌다. 그래도 그날 이후 아이들은 스스로를 바위굴 선단이라 불렀다.", effects: { friendBond: 4, skill: 1 }, mark: "cave_found" },
              bad: { text: "한 친구가 미끄러져 다치는 바람에 모두 굴을 포기하고 돌아왔다. 어른들에게 크게 혼난 뒤 친구들은 한동안 {name}과 놀지 말라는 말을 들었다.", effects: { friendBond: -6, trust: -2 }, mark: "cave_flooded" }
            } },
          { id: "tell_adult", label: "어른에게 알리고 기다린다", hint: "어른은 대개 먼저 챙긴다",
            check: { stat: "bond", against: 40 }, personality: { caution: 6, loyalty: 2 },
            outcomes: {
              great: { text: "양육자는 {name}과 함께 굴에 들어가 상자를 꺼냈고, 그 안의 금화를 마을 방파제 수리에 내놓았다. 항해 일지만은 {name}의 몫으로 남겨 주었다.", effects: { bond: 6, trust: 5 }, mark: "cave_found" },
              good: { text: "어른들이 굴을 뒤지는 동안 {name}은 입구에서 기다렸다. 나온 건 녹슨 상자 하나뿐이었지만, 양육자는 그 속의 일지를 {name}에게 건넸다.", effects: { bond: 3, skill: 2 }, mark: "cave_found" },
              bad: { text: "소문을 들은 마을 어른 몇이 먼저 굴에 들어가 상자를 가져가 버렸다. 누가 가져갔는지 끝내 밝혀지지 않았고, {name}은 어른들의 웃는 얼굴을 한동안 믿지 못했다.", effects: { trust: -5, bond: -2 }, mark: "cave_flooded" }
            } }
        ] },

      { step: 4, id: "letter", age: 27, art: "legacy", title: "깨진 나침반의 편지", requires: ["lio_sailed", "lantern_decoy"],
        body: "어디에 몸을 두고 있든 편지는 용케 {name}을 찾아왔다. 봉투에는 깨진 나침반 문양이 찍혀 있었고, 안에는 작은 배의 선장이 되어 쫓기는 사람들을 실어 나른다는 리오의 글씨가 있었다. 마지막 줄은 한번 만나고 싶다는 부탁이었다.",
        choices: [
          { id: "meet", label: "약속한 항구로 찾아간다", hint: "옛 친구도 세월을 입는다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 6, freedom: 3 },
            outcomes: {
              great: { text: "항구 선술집에서 마주친 리오는 단숨에 {name}을 알아보고 끌어안았다. 둘은 밤새 웃고 떠들었고, 헤어질 때 리오는 무슨 일이 생기면 깨진 나침반 깃발을 찾으라고 했다.", effects: { friendBond: 8, trust: 3 }, mark: "lio_reunited" },
              good: { text: "약속 장소에는 리오 대신 해군 순찰대가 서 있었다. 멀리 정박한 작은 배에서 깨진 나침반 깃발이 한 번 흔들리고 사라졌고, {name}은 그것으로 충분하다고 생각했다.", effects: { friendBond: 4 }, mark: "lio_reunited" },
              bad: { text: "가는 길에 폭풍을 만나 약속한 날을 넘겼다. 비어 있는 선술집 탁자 위에는 리오가 남긴 은빛 목걸이와 다음을 기약하는 쪽지만 놓여 있었다.", effects: { health: -4, friendBond: -2 } }
            } },
          { id: "reply", label: "긴 답장만 보낸다", hint: "글은 마음보다 느리다",
            check: { stat: "bond", against: 40 }, personality: { caution: 5, empathy: 3 },
            outcomes: {
              great: { text: "{name}은 밤새 답장을 썼다. 몇 달 뒤 돌아온 두 번째 편지에는 리오가 구해 낸 아이들이 삐뚤빼뚤 그린 {name}의 얼굴이 들어 있었다.", effects: { bond: 4, friendBond: 5 }, mark: "lio_reunited" },
              good: { text: "답장은 보냈지만 다시 소식은 오지 않았다. 대신 가끔 낯선 선원들이 리오 선장의 친구냐며 {name}에게 술을 샀다.", effects: { friendBond: 3, trust: 2 } },
              bad: { text: "답장을 들고 간 우편 갈매기가 해군 검문에 걸렸다. 편지 때문에 {name}은 한동안 수상한 사람으로 장부에 오르내렸다.", effects: { trust: -5, friendBond: 1 } }
            } }
        ] },
      { step: 4, id: "raid_news", age: 29, art: "harbor", title: "노예선을 덮친 깃발",
        requires: ["lio_taken", "lio_lost", "searched_port", "poster_kept", "tore_posters"],
        body: "어느 항구에서든 신문은 같은 소식을 실었다. 귀족에게 팔려 가던 노예선이 깨진 나침반 깃발을 단 배에 습격당해, 갇혀 있던 사람들이 모두 사라졌다는 것이었다. 흐릿한 사진 속 선장의 옆얼굴은 {name}이 아는 누군가를 닮아 있었다.",
        choices: [
          { id: "track", label: "그 깃발의 행방을 쫓는다", hint: "쫓는 사람도 쫓긴다",
            check: { stat: "skill", against: 50 }, personality: { freedom: 6, loyalty: 4 },
            outcomes: {
              great: { text: "항구 정보상들을 수소문한 끝에 {name}은 이름 없는 섬의 숨은 정박지에 닿았다. 리오가 웃으며 손을 흔들었다. 지키지 못한 날을 사과하자, 리오는 그날 돌아봐 준 얼굴 덕에 버텼다고 말했다.", effects: { friendBond: 10, skill: 2 }, mark: "lio_reunited" },
              good: { text: "정박지에 닿았을 때 배는 이미 떠난 뒤였다. 부두 기둥에는 {name}의 이름과 함께 고맙다는 한마디가 칼로 새겨져 있었다.", effects: { friendBond: 5, health: -1 } },
              bad: { text: "깃발을 수소문하던 {name}은 오히려 해적과 내통한다는 의심을 받아 하룻밤을 감옥에서 보냈다. 철창 너머로 들려오는 노랫소리가 어쩐지 리오가 부르던 자장가 같았다.", effects: { trust: -5, health: -2 } }
            } },
          { id: "clip", label: "신문을 오려 간직한다", hint: "멀리서 지키는 방법도 있다",
            check: { stat: "bond", against: 40 }, personality: { caution: 6 },
            outcomes: {
              great: { text: "{name}은 기사를 오려 고향으로 보냈다. 답장에는 그 기사를 마을 게시판에 붙였더니 사람들이 한참을 모여 읽었다는 이야기가 적혀 있었다.", effects: { bond: 5, trust: 4 } },
              good: { text: "오린 기사는 지갑 속에서 닳아 갔다. 힘든 날이면 {name}은 그것을 꺼내 보며, 누군가는 끝내 자유로워졌다는 사실로 하루를 버텼다.", effects: { health: 3, friendBond: 2 } },
              bad: { text: "기사를 들여다보다 그날 아무것도 하지 못한 자신이 떠올라 술을 마셨다. 다음 날 아침 {name}은 기사를 잃어버린 채 깨어났다.", effects: { health: -4, bond: -1 } }
            } }
        ] },
      { step: 4, id: "chart_shop", age: 26, art: "childChart", title: "항로를 알아본 노인",
        body: "어느 항구의 해도 가게에서 {name}은 어릴 적 목걸이 속에서 본 해도 이야기를 꺼냈다. 주인 노인은 안색이 바뀌더니, 그것이 오래전 바다에 가라앉은 왕국으로 가는 길이라고 낮게 말했다. 가게 밖에서 누군가 그 이야기를 엿듣고 있었다.",
        choices: [
          { id: "sell_info", label: "항로를 노인에게 판다", hint: "아는 것도 값이 있다",
            check: { stat: "trust", against: 45 }, personality: { ambition: 6, freedom: -2 },
            outcomes: {
              great: { text: "노인은 값을 넉넉히 치르고, 그 왕국의 마지막 왕자가 아기 때 바다에 띄워졌다는 이야기를 덤으로 들려주었다. {name}은 후미의 모래 위에 누워 있던 아이의 얼굴을 떠올렸다.", effects: { supplies: 9, skill: 2 } },
              good: { text: "값은 받았지만 엿듣던 자가 뒤를 밟았다. 골목 몇 개를 돌아 겨우 따돌린 뒤에야 {name}은 그 항로가 아직도 누군가에게 목숨값이라는 걸 알았다.", effects: { supplies: 5, health: -2 } },
              bad: { text: "노인에게 건넨 항로는 다음 날 엿듣던 사냥꾼 패거리의 손에 들어가 있었다. {name}은 그 길 끝에 무엇이 있었는지 영영 알 수 없게 되었다.", effects: { supplies: -3, trust: -4 } }
            } },
          { id: "sail", label: "직접 그 항로를 따라간다", hint: "가라앉은 것은 이유가 있다",
            check: { stat: "health", against: 50 }, personality: { freedom: 7, caution: -4 },
            outcomes: {
              great: { text: "짧은 항해 끝에 {name}은 맑은 물 아래 가라앉은 성벽을 보았다. 성문에는 깨진 나침반 문양이 새겨져 있었고, 그곳에서 건진 은 장식 하나가 평생의 부적이 되었다.", effects: { skill: 5, supplies: 4 }, mark: "sunken_seen" },
              good: { text: "항로는 맞았지만 바다는 거칠었다. 성벽의 그림자만 보고 돌아섰지만, {name}은 그것으로 어린 날의 질문에 답을 얻었다고 생각했다.", effects: { skill: 3, health: -2 }, mark: "sunken_seen" },
              bad: { text: "항로 중간에서 바다왕류의 등이 수면 위로 솟았다. 배는 겨우 돌아섰고, {name}은 그 뒤로 그 해도를 다시 떠올리지 않으려 애썼다.", effects: { health: -8, supplies: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "bandit_toll", title: "산적이 걷는 통행세",
    legacy: {
      default: "부당한 값을 치를 때마다 그 언덕길을 떠올리는 사람이 됐다.",
      silenced: "목소리를 삼킨 날을 잊지 못해 남의 침묵에 예민한 사람이 됐다.",
      bandit_errand: "살아남으려 고개 숙인 사람을 함부로 탓하지 않게 됐다.",
      exposed: "거짓 구원을 보면 반드시 목소리를 내는 사람이 됐다.",
      ledger_stolen: "말보다 기록이 사람을 지킨다는 걸 아는 사람이 됐다.",
      gate_burned: "막힌 길 앞에서 사람들을 모으는 법을 아는 사람이 됐다.",
      tobi_turned: "적의 얼굴 뒤에서 사람을 먼저 찾는 사람이 됐다.",
      forgave_bargo: "원수에게도 밥 한 그릇은 차려 줄 수 있는 사람이 됐다.",
      stopped_again: "어른이 되어서도 통행세 앞에서 물러서지 않았다."
    },
    chapters: [
      { step: 1, id: "toll", age: 7, art: "childMarket", title: "언덕길의 통행세",
        body: "장날 아침, 양육자의 수레를 따라 언덕길을 넘던 {name}의 앞을 붉은 두건을 쓴 산적들이 막아섰다. 외눈의 두목 바르고는 길에 통나무를 걸쳐 놓고, 오늘부터 이 길을 지나는 짐은 반을 내놓아야 한다고 웃었다. 뒤에 선 이웃들은 아무도 고개를 들지 못했다.",
        choices: [
          { id: "hide_goods", label: "제일 좋은 물건을 몰래 숨긴다", hint: "작은 손이 빠를 때가 있다",
            check: { stat: "skill", against: 40 }, personality: { caution: 4, ambition: 3 },
            outcomes: {
              great: { text: "산적들이 앞자루를 뒤지는 사이 {name}은 말린 생선 꾸러미를 수레 밑 널빤지 틈에 밀어 넣었다. 반을 빼앗긴 줄 알았던 양육자는 장터에 도착해서야 눈을 동그랗게 떴다.", effects: { supplies: 6, bond: 4 }, mark: "hid_goods" },
              good: { text: "숨긴 꾸러미 하나는 무사했지만 다른 하나는 들켰다. 바르고는 영리한 꼬마라며 {name}의 어깨를 툭툭 쳤고, 그 손길은 칭찬보다 경고에 가까웠다.", effects: { supplies: 2, health: -1 }, mark: "hid_goods" },
              bad: { text: "꾸러미가 수레 밑으로 굴러떨어지며 모두가 보는 앞에서 들통났다. 벌로 산적들은 수레를 통째로 끌고 갔고, 양육자는 빈손으로 흙길에 주저앉았다.", effects: { supplies: -8, bond: -2 }, mark: "marked_family" }
            } },
          { id: "talk_back", label: "이건 도둑질이라고 소리친다", hint: "목소리는 생각보다 멀리 간다",
            check: { stat: "trust", against: 45 }, personality: { freedom: 7, caution: -6 }, mark: "spoke_up",
            outcomes: {
              great: { text: "{name}의 외침에 줄 선 이웃들이 웅성거리기 시작했다. 사람들의 눈이 무서워진 바르고는 오늘만 봐준다며 통나무를 치웠고, 두건단 막내 토비는 뒤에서 몰래 웃음을 참았다.", effects: { trust: 6, friendBond: 3 } },
              good: { text: "주먹 대신 수레 바퀴가 걷어차였다. 짐은 반을 빼앗겼지만, 돌아오는 길에 이웃들이 하나둘 {name}에게 다가와 속이 시원했다고 속삭였다.", effects: { trust: 4, supplies: -3 } },
              bad: { text: "바르고는 웃음을 거두고 {name}의 멱살을 잡아 들어 올렸다. 겁먹은 양육자가 짐을 전부 내놓고서야 풀려났고, 그날부터 산적들은 그 수레만 보면 길을 막았다.", effects: { supplies: -6, health: -3, bond: -1 }, mark: "marked_family" }
            } },
          { id: "pay", label: "양육자 곁에서 조용히 짐을 내놓는다", hint: "오늘을 넘기는 것도 지혜",
            check: { stat: "bond", against: 40 }, personality: { caution: 6, loyalty: 4 }, mark: "paid",
            outcomes: {
              great: { text: "{name}이 공손하게 자루를 내밀자 바르고는 기특하다며 나무패 하나를 던져 주었다. 그 패를 보여 주면 다음 장날부터는 덜 걷겠다는 것이었다.", effects: { supplies: 3, bond: 4 } },
              good: { text: "짐의 반은 산적 수레로 넘어갔다. 집에 돌아온 양육자는 잘 참았다며 {name}을 꼭 안아 주었지만, 그날 밤 등잔은 평소보다 오래 꺼지지 않았다.", effects: { supplies: -3, bond: 5 } },
              bad: { text: "순순히 내놓는 모습에 산적들은 더 욕심을 냈다. 결국 수레의 짐 대부분을 빼앗겼고, 이웃들은 저 집이 길을 쉽게 만들어 놓았다며 수군거렸다.", effects: { supplies: -6, trust: -3 } }
            } }
        ] },

      { step: 2, id: "meeting", age: 9, art: "childLantern", title: "마을 회의의 밤", requires: ["spoke_up", "marked_family"],
        body: "두 해가 지나자 바르고의 두건단은 언덕길을 넘어 {home}까지 내려와 집집마다 보호세를 걷었다. 마을 회의에서 촌장 고르딘은 조용히 돈을 내자고 했고, 대장장이 하냐는 망치를 내리치며 싸우자고 했다. 어른들 틈에 끼어 앉은 {name}은 자신이 할 수 있는 일을 생각했다.",
        choices: [
          { id: "messenger", label: "먼 해군 지부까지 소식을 전한다", hint: "산길은 밤이 더 길다",
            check: { stat: "health", against: 50 }, personality: { loyalty: 5, freedom: 3 },
            outcomes: {
              great: { text: "{name}은 이틀 밤낮을 걸어 해군 지부에 닿았다. 지부장은 흙투성이 아이를 보고 한참 말이 없다가, 다음 달 토벌대를 보내겠다고 약속했다.", effects: { health: -3, trust: 9 }, mark: "sent_marines" },
              good: { text: "지부에 닿긴 했지만 당번병은 접수만 하고 아이를 돌려보냈다. 그래도 접수 장부에 {home}의 이름이 처음 올랐다.", effects: { health: -3, trust: 5 }, mark: "sent_marines" },
              bad: { text: "산길에서 두건단 보초에게 붙잡혔다. 바르고는 {name}을 하룻밤 헛간에 가둔 뒤, 다음에 또 그러면 집을 태우겠다는 말과 함께 풀어 주었다.", effects: { health: -6, bond: -3 }, mark: "silenced" }
            } },
          { id: "spy", label: "두건단 소굴을 몰래 염탐한다", hint: "아는 것이 힘이 된다",
            check: { stat: "skill", against: 45 }, personality: { ambition: 4, caution: -3 },
            outcomes: {
              great: { text: "{name}은 덤불 속에 엎드려 보초가 바뀌는 시간과 화약 창고의 위치를 모두 외웠다. 하냐는 그 이야기를 듣고 처음으로 이길 수도 있겠다며 웃었다.", effects: { skill: 7, trust: 3 }, mark: "spied_camp" },
              good: { text: "소굴 근처에서 두건단 막내 토비와 딱 마주쳤다. 토비는 소리를 지르는 대신 쉿 하는 시늉을 하고 {name}을 덤불 밖으로 밀어냈다.", effects: { skill: 2, friendBond: 4 }, mark: "tobi_friend" },
              bad: { text: "나뭇가지 밟는 소리에 개들이 짖었다. 정신없이 도망친 {name}은 가시덤불에 온통 긁혔고, 그 소동 탓에 다음 날 보호세가 곱절로 올랐다.", effects: { health: -5, trust: -4 }, mark: "silenced" }
            } },
          { id: "befriend", label: "두건단 막내 토비에게 말을 건다", hint: "적 안에도 사람이 있다",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 6, loyalty: -1 },
            outcomes: {
              great: { text: "토비는 산적이 된 게 빚 때문이라고 털어놓았다. 둘은 냇가에서 몰래 만나 물수제비를 뜨는 사이가 되었고, 토비는 언젠가 두건을 벗고 싶다고 했다.", effects: { friendBond: 8 }, mark: "tobi_friend" },
              good: { text: "토비는 퉁명스러웠지만 {name}이 건넨 주먹밥을 받아 들었다. 다음 보호세 날, 토비는 {name}의 집 앞만 슬쩍 건너뛰었다.", effects: { friendBond: 4, supplies: 1 }, mark: "tobi_friend" },
              bad: { text: "말을 거는 모습을 동료들에게 들킨 토비는 크게 맞았다. 그 뒤로 토비는 {name}을 볼 때마다 더 험하게 굴었다.", effects: { friendBond: -5, trust: -2 }, mark: "silenced" }
            } }
        ] },
      { step: 2, id: "bypass", age: 9, art: "childChart", title: "통행세 없는 길", requires: ["hid_goods"],
        body: "통나무 하나에 장터가 반쯤 죽어 가자, {name}은 어른들이 모르는 길을 찾아 나섰다. 등대 아래 바위틈에서 시작해 언덕 뒤편으로 이어지는 옛 염전 길이었다. 그 길로 짐을 옮기면 두건단의 통나무를 지나지 않아도 되었다.",
        choices: [
          { id: "guide", label: "밤마다 짐꾼들을 이끈다", hint: "밤길은 발이 먼저 기억한다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 5, freedom: 4 },
            outcomes: {
              great: { text: "{name}은 달 없는 밤마다 짐꾼 행렬을 이끌었다. 몇 달 만에 장터가 되살아났고, 상인들은 그 길을 꼬마길이라 불렀다.", effects: { trust: 8, health: -2 }, mark: "smuggle_route" },
              good: { text: "길은 쓸 만했지만 밤샘에 {name}은 낮마다 꾸벅꾸벅 졸았다. 그래도 짐 몇 수레는 통행세 없이 장터에 닿았다.", effects: { trust: 4, health: -2 }, mark: "smuggle_route" },
              bad: { text: "짐꾼 하나가 술김에 길 이야기를 떠벌렸다. 두건단은 옛 염전 길 입구에 덫을 놓았고, 그 덫에 처음 걸려든 {name}은 밤새 그물 속에서 떨었다.", effects: { health: -6, trust: -2 }, mark: "route_betrayed" }
            } },
          { id: "draw_map", label: "길을 지도로 그려 어른들에게 준다", hint: "지도는 손을 떠나면 남의 것",
            check: { stat: "skill", against: 45 }, personality: { caution: 4, empathy: 2 },
            outcomes: {
              great: { text: "{name}이 그린 지도는 놀랄 만큼 정확했다. 하냐는 지도를 들고 사람들을 모았고, 어른들은 처음으로 아이의 말에 진지하게 귀를 기울였다.", effects: { skill: 6, trust: 4 }, mark: "route_found" },
              good: { text: "지도는 쓸 만했지만 몇 군데가 틀려 짐꾼들이 길을 헤맸다. 투덜거림 속에서도 길은 조금씩 다져졌다.", effects: { skill: 3, trust: 1 }, mark: "route_found" },
              bad: { text: "지도 한 장이 촌장 고르딘의 손을 거쳐 바르고에게 흘러갔다. 고르딘은 마을을 위해서였다고 변명했고, {name}은 어른도 배신한다는 걸 배웠다.", effects: { trust: -4, skill: 1 }, mark: "route_betrayed" }
            } },
          { id: "keep_route", label: "우리 집 수레만 그 길을 쓴다", hint: "모두의 길은 금방 들킨다",
            check: { stat: "bond", against: 40 }, personality: { caution: 6, empathy: -3 },
            outcomes: {
              great: { text: "{name}의 집 수레만 조용히 옛 염전 길을 오갔다. 살림은 금세 펴졌고, 양육자는 그 돈으로 이웃 몇 집의 통행세를 몰래 대신 내 주었다.", effects: { supplies: 6, bond: 4 }, mark: "route_found" },
              good: { text: "집은 조금 넉넉해졌지만 이웃들은 저 집만 왜 멀쩡하냐며 눈을 흘겼다.", effects: { supplies: 4, trust: -2 }, mark: "route_found" },
              bad: { text: "이웃 하나가 뒤를 밟아 길을 알아냈고, 앙심을 품은 채 두건단에게 일러바쳤다. 길은 막혔고 {name}의 집은 본보기로 곱절의 통행세를 냈다.", effects: { supplies: -6, trust: -3 }, mark: "route_betrayed" }
            } }
        ] },
      { step: 2, id: "ronin", age: 9, art: "harbor", title: "칼을 판다는 나그네",
        body: "통행세는 해마다 올라 {home}의 장터는 반쯤 문을 닫았다. 그 무렵 부두에 시오네라는 떠돌이 검객이 내려, 돈만 주면 두건단을 쫓아내 주겠다고 했다. 어른들은 망설였고, 아이들은 칼집에 새겨진 상처 자국을 넋을 놓고 바라봤다.",
        choices: [
          { id: "collect", label: "이웃을 돌며 삯을 모은다", hint: "모두가 조금씩이면 된다",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 5, ambition: 2 },
            outcomes: {
              great: { text: "{name}이 집집마다 문을 두드리자 망설이던 어른들도 동전을 내놓았다. 삯을 받은 시오네는 아이에게 직접 받은 돈은 처음이라며 칼끝을 들어 약속했다.", effects: { trust: 7, supplies: -1 }, mark: "hired_sword" },
              good: { text: "삯은 반밖에 모이지 않았다. 시오네는 반값이면 반만 싸우겠다고 농담했지만 결국 칼을 챙겨 언덕으로 올라갔다.", effects: { trust: 3, supplies: -2 }, mark: "hired_sword" },
              bad: { text: "모은 돈을 받은 시오네는 다음 날 아침 배를 타고 사라졌다. 사기꾼이었다. 이웃들은 아이가 바람을 넣었다며 {name}의 집을 원망했다.", effects: { trust: -7, supplies: -3 }, mark: "sword_fraud" }
            } },
          { id: "sell_treasure", label: "아끼는 보물을 팔아 삯을 보탠다", hint: "가장 아끼는 것을 내놓는다",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 5, ambition: -2 },
            outcomes: {
              great: { text: "{name}은 어릴 때부터 아끼던 조개 나팔을 팔았다. 사연을 들은 시오네는 나팔을 되찾아 돌려주고는 삯을 반만 받았다.", effects: { supplies: 2, bond: 3, trust: 4 }, mark: "hired_sword" },
              good: { text: "보물을 판 돈은 삯의 귀퉁이를 채웠다. 시오네는 그 돈을 따로 주머니에 넣으며 이건 꼭 갚겠다고 중얼거렸다.", effects: { supplies: -3, trust: 3 }, mark: "hired_sword" },
              bad: { text: "보물을 팔러 간 고물상이 하필 두건단의 장물아비였다. 바르고는 그 나팔을 목에 걸고 다니며 {name}을 볼 때마다 불어 댔다.", effects: { supplies: -5, friendBond: -2 }, mark: "silenced" }
            } },
          { id: "watch", label: "검객을 믿지 않고 뒤를 밟는다", hint: "칼보다 사람을 본다",
            check: { stat: "skill", against: 45 }, personality: { caution: 7, empathy: -2 },
            outcomes: {
              great: { text: "{name}은 시오네가 밤마다 바르고와 술잔을 기울이는 걸 봤다. 둘이 짜고 마을 돈을 털려던 것이었다. 아이의 증언에 시오네는 쫓겨났고, 어른들은 처음으로 스스로 무기를 들었다.", effects: { skill: 5, trust: 6 }, mark: "spied_camp" },
              good: { text: "뒤를 밟던 {name}은 검객이 밤마다 혼자 칼을 갈며 우는 걸 봤다. 이유는 묻지 못했지만, 그 칼이 진심이라는 건 알 수 있었다.", effects: { skill: 2, friendBond: 2 }, mark: "hired_sword" },
              bad: { text: "뒤를 밟다 시오네에게 들킨 {name}은 칼등으로 꿀밤을 맞고 돌아왔다. 의심받아 기분이 상한 검객은 삯을 곱절로 불렀다.", effects: { health: -3, supplies: -3 }, mark: "sword_fraud" }
            } }
        ] },

      { step: 3, id: "corrupt", age: 11, art: "harbor", title: "한패였던 구원자", requires: ["sent_marines", "hired_sword"],
        body: "기다리던 칼이 마침내 언덕에 닿은 날, {name}은 숲속 공터에서 믿을 수 없는 장면을 봤다. 구원하러 온 이가 바르고와 마주 앉아 돈 자루를 나누며, 마을 사람들에게는 산적을 쫓아냈다고 말하기로 짜고 있었다.",
        choices: [
          { id: "expose", label: "축제 날 모두 앞에서 폭로한다", hint: "진실은 크게 말해야 들린다",
            check: { stat: "trust", against: 50 }, personality: { freedom: 6, caution: -5 },
            outcomes: {
              great: { text: "{name}이 축제 무대에 올라 숲에서 본 것을 낱낱이 외치자, 하냐가 망치를 들고 맨 앞에 섰다. 거짓 구원자는 도망쳤고, 그날 밤 마을 사람들은 스스로 통나무를 불태웠다.", effects: { trust: 10, friendBond: 2 }, mark: "exposed" },
              good: { text: "사람들은 반쯤만 믿었다. 그래도 의심이 퍼지자 거짓 구원자는 서둘러 떠났고, 통나무는 그대로 남았지만 보호세는 끊겼다.", effects: { trust: 5 }, mark: "exposed" },
              bad: { text: "아이 말을 누가 믿느냐는 웃음이 터졌다. 그날 밤 {name}의 집 창문에 돌이 날아들었고, 양육자는 다시는 나서지 말라며 {name}을 붙잡고 떨었다.", effects: { trust: -6, bond: -2 }, mark: "silenced" }
            } },
          { id: "ledger", label: "돈 장부를 훔쳐 낸다", hint: "글씨는 말보다 오래 간다",
            check: { stat: "skill", against: 50 }, personality: { ambition: 4, caution: -3 },
            outcomes: {
              great: { text: "{name}은 술에 취한 틈을 타 바르고의 장부를 빼냈다. 거짓 구원자에게 건넨 뇌물까지 날짜별로 적힌 장부는 신문사로 보내졌고, 그해 가을 두건단과 한패들은 모두 끌려갔다.", effects: { skill: 6, trust: 6 }, mark: "ledger_stolen" },
              good: { text: "장부를 반쯤 찢어 들고 나오는 데 성공했다. 반쪽짜리 증거로도 어른들은 거짓 구원자를 쫓아낼 수 있었지만, 바르고는 산으로 숨어 버렸다.", effects: { skill: 3, trust: 3 }, mark: "ledger_stolen" },
              bad: { text: "장부를 품에 넣는 순간 바르고가 깨어났다. 둘러싸인 {name}을 빼내 준 건 두건단 막내 토비였고, 토비는 그 대가로 두건단에서 쫓겨나 절뚝이며 떠났다.", effects: { health: -5, friendBond: -3 }, mark: "silenced" }
            } },
          { id: "tell_hanya", label: "대장장이 하냐에게 털어놓는다", hint: "어른 하나면 달라진다",
            check: { stat: "bond", against: 45 }, personality: { loyalty: 6, caution: 3 },
            outcomes: {
              great: { text: "하냐는 이야기를 다 듣고 대장간 문을 닫았다. 그날 밤 하냐와 어른들은 공터를 덮쳐 거짓 구원자와 바르고를 함께 묶어 해군 본부로 가는 우편선에 실어 보냈다.", effects: { trust: 6, bond: 4 }, mark: "exposed" },
              good: { text: "하냐는 믿었지만 다른 어른들은 머뭇거렸다. 결국 하냐 혼자 언덕에 올라가 통나무를 도끼로 쪼갰고, 그 뒤로 두건단은 그 대장간만은 건드리지 못했다.", effects: { trust: 3, bond: 2 } },
              bad: { text: "하냐는 분노해 혼자 공터로 쳐들어갔다가 크게 다쳐 돌아왔다. 망치 소리가 끊긴 겨울, {name}은 괜히 말했다는 생각에 밤마다 뒤척였다.", effects: { bond: -3, trust: -4 }, mark: "silenced" }
            } }
        ] },
      { step: 3, id: "raid", age: 11, art: "childLantern", title: "통나무가 타던 밤",
        requires: ["spied_camp", "tobi_friend", "smuggle_route", "route_found"],
        body: "두건단이 방앗간 집 딸을 인질로 끌고 가 몸값을 요구하자, 마을은 더 참지 않기로 했다. 어른들은 {name}이 아는 길과 소식에 기대어 그믐밤에 언덕을 오르기로 했다. 횃불 대신 숯을 칠한 얼굴들이 골목에 모였다.",
        choices: [
          { id: "lead", label: "앞장서서 어른들을 이끈다", hint: "앞에 선 사람은 먼저 보인다",
            check: { stat: "trust", against: 50 }, personality: { loyalty: 6, ambition: 4 },
            outcomes: {
              great: { text: "{name}이 이끈 길은 보초 하나 마주치지 않고 소굴 뒤편에 닿았다. 어른들이 함성을 지르며 쏟아져 들어가자 두건단은 짐도 못 챙기고 달아났고, 언덕의 통나무는 새벽까지 활활 탔다.", effects: { trust: 10, health: -1 }, mark: "gate_burned" },
              good: { text: "길 중간에서 보초에게 들켜 싸움이 벌어졌다. 여럿이 다쳤지만 결국 두건단은 물러났고 통나무는 불탔다. {name}은 그날 다친 어른들의 이름을 오래 외우고 다녔다.", effects: { trust: 5, health: -3 }, mark: "gate_burned" },
              bad: { text: "길을 잘못 들어 어른들이 늪에 빠진 사이 두건단이 기다리고 있었다. 습격은 실패했고, 마을은 벌로 한 해 치 통행세를 한꺼번에 바쳤다.", effects: { trust: -6, supplies: -4 }, mark: "raid_failed" }
            } },
          { id: "hostage", label: "토비와 함께 인질부터 구한다", hint: "소리 없이, 빠르게",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7, caution: -2 },
            outcomes: {
              great: { text: "두건단 막내 토비가 헛간 열쇠를 훔쳐 오고 {name}이 망을 봤다. 둘은 방앗간 집 딸을 데리고 함성이 터지기 전에 빠져나왔고, 토비는 그 자리에서 붉은 두건을 벗어 던졌다.", effects: { friendBond: 8, trust: 4 }, mark: "tobi_turned" },
              good: { text: "인질은 구했지만 토비가 동료들에게 들켰다. 토비는 {name}과 인질을 먼저 보내고 혼자 남았고, 사흘 뒤 멍투성이로 마을 어귀에 나타났다.", effects: { friendBond: 5, health: -1 }, mark: "tobi_turned" },
              bad: { text: "헛간 문이 삐걱이는 소리에 모든 게 틀어졌다. 인질은 다른 곳으로 옮겨졌고, 토비는 배신자로 몰려 산 너머로 끌려갔다. 그 뒤로 토비의 소식은 끊겼다.", effects: { friendBond: -7, trust: -2 }, mark: "raid_failed" }
            } },
          { id: "powder", label: "화약 창고에 불을 놓는다", hint: "불은 누구 편도 아니다",
            check: { stat: "skill", against: 50 }, personality: { freedom: 6, caution: -6 },
            outcomes: {
              great: { text: "{name}이 심지에 불을 붙이자 화약 창고가 하늘로 솟았다. 놀란 두건단은 마을 사람들이 몰려온 줄 알고 산 너머로 달아났고, 다친 사람은 하나도 없었다.", effects: { skill: 6, trust: 6 }, mark: "gate_burned" },
              good: { text: "폭발은 성공했지만 불길이 숲으로 번졌다. 두건단은 쫓겨났지만, 마을은 한 달 내내 산불 뒤처리를 해야 했다.", effects: { skill: 3, trust: 2, health: -2 }, mark: "gate_burned" },
              bad: { text: "심지가 너무 짧았다. 폭발에 휩쓸린 {name}은 한동안 아무 소리도 듣지 못했고, 두건단은 도망치기는커녕 화가 나서 마을로 쳐들어왔다.", effects: { health: -9, trust: -3 }, mark: "raid_failed" }
            } }
        ] },
      { step: 3, id: "rule", age: 12, art: "childMarket", title: "산적이 촌장이 된 해",
        body: "끝내 아무도 막지 못했다. 바르고는 마을 회관을 차지하고 스스로 촌장이라 불렀고, 붉은 두건들이 장터의 저울을 쥐었다. 바르고는 영리한 아이를 심부름꾼으로 쓰겠다며 {name}을 불러들였다.",
        choices: [
          { id: "errand", label: "가족을 위해 심부름꾼이 된다", hint: "가까이 있으면 보이는 것이 있다",
            check: { stat: "bond", against: 45 }, personality: { loyalty: 6, freedom: -5 },
            outcomes: {
              great: { text: "{name}은 심부름을 하며 바르고의 장부와 금고 위치를 모두 알게 되었다. 그리고 해가 바뀔 무렵, 그것을 적은 쪽지를 지나가던 해군 순찰선에 몰래 던졌다.", effects: { skill: 5, bond: 3, trust: 2 }, mark: "ledger_stolen" },
              good: { text: "심부름 덕에 집은 보호세를 면했지만, 이웃들은 {name}을 두건단의 개라고 불렀다. 양육자만은 매일 밤 따뜻한 국을 끓여 기다렸다.", effects: { bond: 5, trust: -3 }, mark: "bandit_errand" },
              bad: { text: "바르고는 {name}에게 이웃집 빚을 받아 오라고 시켰다. 울면서 문을 두드린 그날 이후, 그 집 아이는 다시는 {name}과 말을 섞지 않았다.", effects: { friendBond: -6, trust: -4, supplies: 2 }, mark: "bandit_errand" }
            } },
          { id: "graffiti", label: "밤마다 회관 벽에 낙서를 한다", hint: "작은 저항도 저항이다",
            check: { stat: "skill", against: 40 }, personality: { freedom: 7, caution: -4 },
            outcomes: {
              great: { text: "회관 벽에 그린 외눈 바르고의 우스꽝스러운 그림은 금세 마을의 자랑거리가 되었다. 웃음이 퍼지자 사람들은 두건단을 덜 두려워했고, 이듬해 봄 스스로 일어섰다.", effects: { trust: 7, friendBond: 3 }, mark: "exposed" },
              good: { text: "낙서는 아침마다 지워졌지만 밤마다 다시 그려졌다. 누가 그리는지 다들 아는 눈치였지만, 아무도 일러바치지 않았다.", effects: { trust: 4, friendBond: 1 } },
              bad: { text: "붓을 든 채 붙잡혔다. 바르고는 {name}에게 장터 한가운데서 벽을 혼자 닦게 했고, 구경하던 아이들의 웃음소리가 오래 귓가에 남았다.", effects: { trust: -3, health: -2, friendBond: -2 }, mark: "silenced" }
            } }
        ] },

      { step: 4, id: "old_bandit", age: 31, art: "harbor", title: "늙은 산적의 방문", requires: ["exposed", "ledger_stolen", "gate_burned"],
        body: "어디에 머물고 있든 소문은 바람처럼 닿았다. 쫓겨나 떠돌던 외눈의 바르고가 지팡이를 짚고 {name}을 찾아다닌다는 것이었다. 어느 저녁, 머물던 곳 문 앞에 붉은 두건을 손에 쥔 늙은이가 서 있었다.",
        choices: [
          { id: "forgive", label: "들어와서 밥이나 먹으라고 한다", hint: "용서는 배고픈 사람부터",
            check: { stat: "bond", against: 40 }, personality: { empathy: 7, caution: -3 },
            outcomes: {
              great: { text: "바르고는 밥 한 그릇을 비우고 오래 울었다. 남기고 간 붉은 두건 속에는 빼앗았던 돈을 갚겠다며 모은 동전이 가득했고, {name}은 그것을 {home}의 방파제 기금으로 보냈다.", effects: { trust: 6, bond: 4 }, mark: "forgave_bargo" },
              good: { text: "바르고는 밥을 먹고도 끝내 사과하지 못했다. 그래도 문을 나서며 고개를 한 번 깊이 숙였고, {name}은 그것으로 충분하다고 생각했다.", effects: { bond: 3, trust: 1 }, mark: "forgave_bargo" },
              bad: { text: "밥을 먹던 바르고는 옛 버릇처럼 은수저 한 벌을 품에 넣고 사라졌다. 화가 나기보다 웃음이 나서, {name}은 그날 밤 혼자 한참을 웃었다.", effects: { supplies: -4, bond: 1 } }
            } },
          { id: "refuse", label: "문을 닫고 돌려보낸다", hint: "닫힌 문도 대답이다",
            check: { stat: "trust", against: 40 }, personality: { loyalty: 4, empathy: -4 },
            outcomes: {
              great: { text: "{name}은 고향 사람들에게 먼저 사과하라며 문을 닫았다. 몇 달 뒤 {home}에서 온 편지에는 바르고가 장터를 돌며 집집마다 무릎을 꿇었다는 이야기가 적혀 있었다.", effects: { trust: 7, bond: 2 } },
              good: { text: "문을 닫은 뒤에도 마음은 개운하지 않았다. 다음 날 문 앞에는 녹슨 통행세 나무패 하나가 놓여 있었다.", effects: { trust: 3 } },
              bad: { text: "돌려보낸 바르고는 그날 밤 술집에서 옛날이야기를 떠벌리다 싸움에 휘말렸다. 그 소식을 들은 {name}은 문을 닫은 손이 한동안 무거웠다.", effects: { bond: -3, trust: -2 } }
            } }
        ] },
      { step: 4, id: "ferryman", age: 30, art: "deck", title: "두건을 벗은 친구", requires: ["tobi_turned", "tobi_friend"],
        body: "어느 항구에서 배를 기다리던 {name}에게 낯익은 목소리가 말을 걸었다. 붉은 두건 대신 나룻배 사공의 낡은 챙모자를 쓴 토비였다. 토비는 그 시절 이야기를 하다 말고, 요즘 이 항구에도 통행세를 걷는 무리가 있다며 목소리를 낮췄다.",
        choices: [
          { id: "help_tobi", label: "이번엔 함께 막자고 한다", hint: "어른이 된 아이들의 싸움",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 6, freedom: 4 },
            outcomes: {
              great: { text: "{name}과 토비는 그 시절처럼 길을 알아내고 사람을 모았다. 사흘 만에 항구의 통행세 패거리는 해군에게 넘겨졌고, 사공들은 둘에게 평생 공짜 뱃삯을 약속했다.", effects: { trust: 8, friendBond: 4 }, mark: "stopped_again" },
              good: { text: "패거리를 몰아내긴 했지만 토비의 나룻배가 불탔다. {name}이 새 배값을 보태자 토비는 이번엔 내가 빚졌다며 웃었다.", effects: { trust: 4, supplies: -3, friendBond: 4 }, mark: "stopped_again" },
              bad: { text: "패거리 뒤에는 생각보다 큰 해적단이 있었다. {name}과 토비는 쫓기듯 항구를 떠났고, 아직 어른이 덜 되었다며 서로 쓴웃음을 지었다.", effects: { health: -5, trust: -3, friendBond: 2 } }
            } },
          { id: "drink", label: "술 한잔으로 옛정만 나눈다", hint: "모든 싸움이 내 몫은 아니다",
            check: { stat: "friendBond", against: 40 }, personality: { caution: 5, empathy: 3 },
            outcomes: {
              great: { text: "둘은 밤새 그 시절 이야기를 했다. 토비는 헤어지며 그날 곁을 지켜 준 친구가 있어 사람이 될 수 있었다고 말했다.", effects: { friendBond: 8, bond: 2 } },
              good: { text: "술잔이 비어 갈수록 말은 줄었다. 그래도 헤어질 때 토비는 {name}의 짐을 대신 배에 실어 주었다.", effects: { friendBond: 4 } },
              bad: { text: "술에 취한 토비가 통행세 패거리에게 시비를 걸었고, 둘은 함께 얻어맞고 부두에 나뒹굴었다. 다음 날 아침, 멍든 얼굴로 서로를 보며 웃음을 터뜨렸다.", effects: { health: -6, friendBond: 3 } }
            } }
        ] },
      { step: 4, id: "still_tolled", age: 30, art: "harbor", title: "아직 막힌 언덕길",
        body: "{home}에서 온 소식에는 두건단의 통행세가 아직도 언덕길에서 걷힌다는 이야기가 있었다. 늙은 바르고는 진짜 촌장 행세를 하고, 아이들은 통행세를 당연한 것으로 배우며 자란다고 했다. {name}은 오래 잊었던 그 아침의 흙냄새를 떠올렸다.",
        choices: [
          { id: "send_money", label: "번 돈을 고향에 보낸다", hint: "돈은 길을 열기도 한다",
            check: { stat: "supplies", against: 45 }, personality: { loyalty: 5, empathy: 4 },
            outcomes: {
              great: { text: "{name}이 보낸 돈으로 마을은 바다 쪽에 새 선착장을 만들었다. 언덕길을 지나지 않아도 장터에 물건이 닿자, 통나무 앞은 금세 한산해졌다.", effects: { supplies: -4, trust: 10, bond: 2 } },
              good: { text: "보낸 돈은 몇 집의 통행세가 되어 사라졌다. 그래도 받은 사람들은 {name}의 이름을 장터에서 자주 입에 올렸다.", effects: { supplies: -4, trust: 5 } },
              bad: { text: "돈은 바르고의 손을 거쳐야만 마을에 들어갈 수 있었다. 보낸 돈 일부가 두건단의 술값이 되었다는 걸 알고, {name}은 한참을 이를 갈았다.", effects: { supplies: -6, trust: -2 } }
            } },
          { id: "report", label: "해군과 신문사에 편지를 보낸다", hint: "이번엔 어른의 글씨로",
            check: { stat: "skill", against: 45 }, personality: { freedom: 4, loyalty: 4 },
            outcomes: {
              great: { text: "어른이 되어 쓴 고발장은 어릴 적 외침보다 무거웠다. 몇 달 뒤 {home}의 언덕길에 해군 깃발이 꽂혔고, 마을 아이들은 처음으로 통행세 없는 장날을 맞았다.", effects: { trust: 9, skill: 2 }, mark: "stopped_again" },
              good: { text: "편지는 신문 귀퉁이에 짧게 실렸다. 그것만으로도 두건단은 한동안 몸을 사렸고, 통행세는 반으로 줄었다.", effects: { trust: 4 } },
              bad: { text: "편지는 어디에도 실리지 않았다. 대신 고향의 양육자에게 두건단이 찾아와 단속을 잘하라고 겁을 줬다는 소식이 돌아왔다.", effects: { bond: -4, trust: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "noble_parade", title: "천룡인이 지나간 날",
    legacy: {
      default: "누구 앞에서도 무릎보다 마음을 먼저 지키려는 사람이 됐다.",
      peto_taken: "끌려간 친구의 이름을 평생 입 속으로 되뇌는 사람이 됐다.",
      watched: "평생 어딘가의 장부에 이름이 올라 있다는 걸 알고 살았다.",
      talked_anger: "분노를 버리지 않고 쓸 곳을 찾는 사람이 됐다.",
      refused_kneel: "누구 앞에서도 함부로 무릎 꿇지 않는 사람이 됐다.",
      helped_escape: "사슬을 보면 풀 방법부터 궁리하는 사람이 됐다.",
      peto_freed: "닫힌 문 앞에서 열쇠부터 찾는 사람이 됐다.",
      kept_village: "한 사람을 감싸는 마을의 힘을 믿는 사람이 됐다.",
      peto_home: "잃어버린 사람도 돌아올 수 있다고 믿는 사람이 됐다.",
      freed_again: "어른이 되어서도 사슬 앞에서 물러서지 않았다.",
      stood_tall: "그날 엎드렸던 아이를 대신해 어른이 되어 일어선 사람이 됐다."
    },
    chapters: [
      { step: 1, id: "parade", age: 7, art: "harbor", title: "무릎 꿇은 항구",
        body: "양육자를 따라 큰 항구 세렌항의 장터에 간 날, 갑자기 나팔이 울리고 사람들이 일제히 땅에 엎드렸다. 둥근 유리 투구를 쓴 천룡인이 노예가 끄는 가마를 타고 지나갔다. 그때 함께 온 이웃집 아이 페토의 사과 하나가 데굴데굴 가마 앞으로 굴러갔다.",
        choices: [
          { id: "pull_down", label: "페토를 끌어당겨 함께 엎드린다", hint: "땅에 이마를 대면 살 수도",
            check: { stat: "bond", against: 45 }, personality: { caution: 7, freedom: -4 },
            outcomes: {
              great: { text: "{name}은 페토의 손목을 낚아채 함께 땅에 이마를 댔다. 천룡인은 사과를 짓밟고 하품을 하더니 그대로 지나갔다. 가마가 멀어진 뒤에야 두 아이는 서로를 끌어안고 울었다.", effects: { bond: 4, friendBond: 6 }, mark: "knelt" },
              good: { text: "둘은 엎드렸지만 호위병 하나가 본보기라며 페토의 등을 걷어찼다. 페토는 집에 돌아오는 내내 한마디도 하지 않았다.", effects: { friendBond: 2, health: -1 }, mark: "knelt" },
              bad: { text: "엎드리는 순간 {name}의 목도리가 풀려 가마 쪽으로 날아갔다. 천룡인은 재미있다는 듯 페토를 가리켰고, 호위병들이 울부짖는 페토를 가마 뒤 쇠사슬 행렬로 끌고 갔다.", effects: { friendBond: -8, bond: -2 }, mark: "peto_taken" }
            } },
          { id: "distract", label: "반대편 생선 수레를 엎어 소란을 낸다", hint: "모두의 눈을 돌린다",
            check: { stat: "skill", against: 45 }, personality: { freedom: 6, caution: -4 },
            outcomes: {
              great: { text: "생선이 와르르 쏟아지고 갈매기 떼가 몰려들었다. 천룡인은 갈매기에 정신이 팔려 깔깔 웃었고, 그 틈에 페토는 무리 속으로 숨어들었다. 아무도 {name}을 보지 못했다.", effects: { skill: 5, friendBond: 5 }, mark: "unseen_hero" },
              good: { text: "소란은 먹혔지만 호위병 하나가 수레 옆에 선 {name}의 얼굴을 똑똑히 봤다. 가마는 지나갔고 페토는 무사했지만, 그 눈빛은 오래 따라다녔다.", effects: { friendBond: 4, trust: -1 }, mark: "guard_saw" },
              bad: { text: "소란에 놀란 천룡인이 총을 뽑아 아무 데나 쏘았다. 수레 주인인 부두 인부 브론이 쓰러졌고, 피 냄새 속에서 {name}은 자신이 한 일을 깨달았다.", effects: { health: -3, trust: -5 }, mark: "bron_shot" }
            } },
          { id: "step_in", label: "앞으로 나가 사과를 대신 줍는다", hint: "작은 몸이 큰 그늘 앞에",
            check: { stat: "health", against: 50 }, personality: { empathy: 6, freedom: 5, caution: -7 },
            outcomes: {
              great: { text: "{name}이 사과를 집어 드는 순간, 해군 장교 레안이 앞을 가로막고 아이가 길을 치웠다며 넙죽 엎드렸다. 천룡인은 흥미를 잃고 지나갔고, 레안은 {name}에게 다시는 그러지 말라고 낮게 꾸짖었다.", effects: { health: 1, trust: 4, friendBond: 4 }, mark: "marine_lean" },
              good: { text: "호위병의 몽둥이가 {name}의 어깨를 내리쳤다. 쓰러진 아이를 두고 행렬은 지나갔고, 페토는 무사했다. 어깨의 멍은 한 달이 지나서야 빠졌다.", effects: { health: -5, friendBond: 6 }, mark: "stood_up" },
              bad: { text: "호위병들은 {name}을 걷어차 쓰러뜨리고, 옆에서 울던 페토를 대신 끌고 갔다. 양육자가 땅에 이마를 찧으며 빌었지만 행렬은 멈추지 않았다.", effects: { health: -6, friendBond: -5 }, mark: "peto_taken" }
            } }
        ] },

      { step: 2, id: "empty_house", age: 9, art: "childLantern", title: "빈 집의 등불", requires: ["peto_taken"],
        body: "페토가 끌려간 뒤 어머니 미라는 등불을 끄지 않고 밤마다 문 앞에 앉아 있었다. 두 해째 되던 겨울, 미라는 집을 팔아 성지로 가는 배를 타겠다고 했다. 아무도 말리지 못했고, 미라는 떠나기 전 {name}에게 페토의 나무 팽이를 건넸다.",
        choices: [
          { id: "petition", label: "신문사에 편지를 보낸다", hint: "글은 멀리 가지만 걸린다",
            check: { stat: "skill", against: 45 }, personality: { freedom: 6, caution: -3 },
            outcomes: {
              great: { text: "{name}이 삐뚤빼뚤 쓴 편지는 떠돌이 기자의 눈에 띄어 작은 기사가 되었다. 기사를 읽은 사람들이 미라의 뱃삯을 모아 주었고, 어느 항구의 상인은 페토를 찾는 데 힘을 보태겠다고 연락해 왔다.", effects: { trust: 6, skill: 3 }, mark: "news_story" },
              good: { text: "편지는 실리지 않았지만 답장이 왔다. 기자는 그런 이야기는 쓸 수 없다면서도, 노예선들이 들르는 항구 이름을 몰래 적어 보냈다.", effects: { skill: 3, trust: 1 }, mark: "news_story" },
              bad: { text: "편지는 정부 검열관의 손에 들어갔다. 얼마 뒤 낯선 사내들이 {home}에 와서 편지를 쓴 아이가 누구냐고 묻고 다녔고, 마을은 숨을 죽였다.", effects: { trust: -5, bond: -2 }, mark: "watched" }
            } },
          { id: "save", label: "뱃삯에 보태려 일을 한다", hint: "작은 동전도 쌓인다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 6, empathy: 4 },
            outcomes: {
              great: { text: "{name}은 그물 손질과 짐 나르기로 겨울 내내 동전을 모았다. 미라는 내민 주머니를 받고 한참 말을 잇지 못했고, 반드시 페토를 데려오겠다며 배에 올랐다.", effects: { health: -2, trust: 5, bond: 3 }, mark: "mira_sailed" },
              good: { text: "모은 돈은 뱃삯의 한 귀퉁이에 불과했지만 미라는 소중히 품었다. 떠나는 배 위에서 미라는 오래 손을 흔들었다.", effects: { health: -3, trust: 3 }, mark: "mira_sailed" },
              bad: { text: "무리하게 일하다 열병으로 쓰러졌고, 모은 돈은 약값으로 사라졌다. 미라는 {name}의 머리맡에 편지 한 장을 두고 조용히 떠났다.", effects: { health: -8 }, mark: "mira_sailed" }
            } },
          { id: "stop_her", label: "가지 말라고 붙잡는다", hint: "남는 것도 용기다",
            check: { stat: "friendBond", against: 45 }, personality: { caution: 6, empathy: 3 },
            outcomes: {
              great: { text: "{name}은 페토가 돌아올 곳이 있어야 한다며 미라를 붙잡았다. 미라는 배표를 찢고 집을 지켰고, 둘은 해마다 페토가 끌려간 날 항구에 등불을 띄웠다.", effects: { bond: 4, friendBond: 5, trust: 2 }, mark: "kept_lantern" },
              good: { text: "미라는 떠나지 않았지만 웃음도 잃었다. {name}은 매일 미라의 집에 들러 물을 길어 주었다.", effects: { friendBond: 3, health: -1 }, mark: "kept_lantern" },
              bad: { text: "미라는 {name}을 밀쳐 내고 새벽 배에 올랐다. 무서워서 붙잡은 거라는 말이 가슴에 오래 박혀 있었다.", effects: { friendBond: -4, bond: -2 }, mark: "mira_sailed" }
            } }
        ] },
      { step: 2, id: "agents", age: 9, art: "dangerPrison", title: "찾아온 검은 옷", requires: ["bron_shot", "guard_saw"],
        body: "세렌항의 소란을 조사한다며 검은 옷을 입은 정부 요원들이 {home}에 나타났다. 요원들은 생선 수레 곁에 있던 아이를 찾고 있었다. 그날 수레를 잃은 부두 인부 브론은 벌금까지 떠안아 집 안의 솥이 비어 갔다.",
        choices: [
          { id: "confess", label: "제가 했다고 나선다", hint: "정직에는 값이 따른다",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 4, empathy: 4, caution: -6 },
            outcomes: {
              great: { text: "{name}이 앞에 나서자 마을 어른들이 일제히 뒤따라 나서며 모두 자기가 했다고 우겼다. 어이가 없어진 요원들은 장부에 아이들 장난이라고 적고 떠났다.", effects: { trust: 9, bond: 2 }, mark: "confessed" },
              good: { text: "요원들은 양육자에게 큰 벌금을 물리고 떠났다. 집은 한동안 어려워졌지만, 브론은 그 뒤로 {name}의 집 지붕을 공짜로 고쳐 주었다.", effects: { supplies: -6, trust: 5, bond: 2 }, mark: "confessed" },
              bad: { text: "요원들은 {name}을 사흘 동안 초소에 가두고 이름과 얼굴을 장부에 적었다. 풀려난 뒤에도 마을 사람들은 정부 장부에 오른 아이를 조금 멀리했다.", effects: { health: -4, trust: -4 }, mark: "watched" }
            } },
          { id: "help_bron", label: "브론의 집 일을 대신한다", hint: "갚을 수 있는 만큼 갚는다",
            check: { stat: "health", against: 45 }, personality: { empathy: 7, loyalty: 2 },
            outcomes: {
              great: { text: "{name}은 매일 새벽 브론의 그물을 걷고 아이들의 밥을 챙겼다. 사정을 알게 된 브론은 화를 내는 대신 그물 짜는 법을 가르쳐 주었다.", effects: { skill: 5, trust: 4, health: -1 }, mark: "helped_bron" },
              good: { text: "일은 고됐고 요원들의 눈은 여전히 마을을 훑었다. 그래도 브론의 집 솥에는 다시 김이 올랐다.", effects: { health: -3, trust: 4 }, mark: "helped_bron" },
              bad: { text: "몰래 일을 돕던 {name}을 본 요원이 브론에게 저 아이가 범인 아니냐고 물었다. 브론은 끝까지 모른다고 했고, 그 대가로 벌금이 곱절이 되었다.", effects: { trust: -3, bond: -2, friendBond: -1 }, mark: "watched" }
            } },
          { id: "hide", label: "등대 다락에 숨어 지낸다", hint: "시간이 지나면 잊힐까",
            check: { stat: "supplies", against: 40 }, personality: { caution: 8, loyalty: -3 },
            outcomes: {
              great: { text: "{name}은 등대지기의 도움으로 한 달을 숨어 지냈다. 요원들은 끝내 찾지 못하고 떠났고, 등대지기는 그동안 바다 별자리 읽는 법을 가르쳐 주었다.", effects: { skill: 6, supplies: -1 }, mark: "hid_away" },
              good: { text: "요원들은 떠났지만 숨어 있던 동안 마을 사람들이 대신 시달렸다. {name}은 돌아와서 한동안 고개를 들지 못했다.", effects: { trust: -2, health: -1, skill: 1 }, mark: "hid_away" },
              bad: { text: "비상식량이 떨어져 몰래 내려왔다가 요원과 마주쳤다. 요원은 {name}의 얼굴을 한참 바라보다가 다음은 없다는 말만 남기고 떠났다.", effects: { health: -3, trust: -2 }, mark: "watched" }
            } }
        ] },
      { step: 2, id: "kneel_game", age: 9, art: "childInlet", title: "엎드리던 친구",
        body: "그날 이후 페토는 지나가는 해군에게도, 장터 상인에게도 먼저 고개를 숙였다. 아이들 사이에서는 천룡인 놀이가 유행해 한 명이 가마에 앉고 나머지가 엎드렸다. {name}은 그 놀이를 볼 때마다 가슴 한구석이 뜨거워졌다.",
        choices: [
          { id: "new_game", label: "새 놀이를 만든다", hint: "놀이는 마음을 바꾼다",
            check: { stat: "friendBond", against: 45 }, personality: { freedom: 6, empathy: 4 },
            outcomes: {
              great: { text: "{name}은 가마에 앉은 아이를 모두가 바닷물에 던지는 해적 놀이를 만들었다. 깔깔대며 노는 사이 페토도 웃었고, 그날 처음으로 고개를 들고 집에 돌아갔다.", effects: { friendBond: 8 }, mark: "peto_brave" },
              good: { text: "새 놀이는 금방 시들었지만, 페토는 {name}과 둘이 있을 때만은 고개를 숙이지 않게 되었다.", effects: { friendBond: 4 }, mark: "peto_brave" },
              bad: { text: "놀이를 본 어른들이 사색이 되어 아이들을 혼냈다. 천룡인을 놀리는 놀이가 정부 귀에 들어가면 마을이 끝장난다는 것이었다. 페토는 더 깊이 움츠러들었다.", effects: { friendBond: -3, trust: -3 } }
            } },
          { id: "pamphlet", label: "떠돌이 이야기꾼의 전단을 베낀다", hint: "위험한 종이 한 장",
            check: { stat: "skill", against: 45 }, personality: { freedom: 7, caution: -5 }, mark: "pamphlet",
            outcomes: {
              great: { text: "천룡인도 피를 흘리는 사람일 뿐이라는 전단을 {name}은 밤새 베껴 썼다. 아이들 사이에 몰래 돈 전단은 놀이보다 빠르게 퍼졌고, 페토도 한 장을 품에 넣었다.", effects: { skill: 4, friendBond: 4 }, mark: "peto_brave" },
              good: { text: "베낀 전단은 몇 장 되지 않았지만, 읽은 아이들의 눈빛이 달라졌다. 양육자는 그것을 발견하고 아무 말 없이 아궁이에 넣었다.", effects: { skill: 3, bond: -1 } },
              bad: { text: "전단을 붙이다 마을 순찰병에게 들켰다. 순찰병은 전단을 찢으며 {name}의 이름을 수첩에 적었고, 그 수첩은 언젠가 정부로 올라갈 것이었다.", effects: { trust: -4, bond: -2 }, mark: "watched" }
            } },
          { id: "talk_home", label: "양육자에게 화가 난다고 말한다", hint: "분노에도 이름이 필요하다",
            check: { stat: "bond", against: 45 }, personality: { empathy: 4, caution: 3 },
            outcomes: {
              great: { text: "양육자는 {name}의 말을 끝까지 듣고, 자신도 젊을 적 같은 길에 엎드렸던 이야기를 해 주었다. 화를 버리지 말고 쓸 곳을 찾으라는 말이 오래 남았다.", effects: { bond: 8, skill: 1 }, mark: "talked_anger" },
              good: { text: "양육자는 위험한 생각이라고 걱정하면서도 {name}의 등을 쓸어 주었다. 화는 그대로였지만 혼자가 아니라는 건 알았다.", effects: { bond: 4 }, mark: "talked_anger" },
              bad: { text: "양육자는 놀라 다시는 그런 말 하지 말라며 {name}의 입을 막았다. 그날부터 화를 꾹꾹 눌러 담는 법만 배웠다.", effects: { bond: -4, health: -1 } }
            } }
        ] },

      { step: 3, id: "slave_ship", age: 12, art: "dangerPrison", title: "닻을 내린 노예선", requires: ["mira_sailed", "news_story", "kept_lantern"],
        body: "세렌항에 천룡인에게 바칠 사람들을 실은 배가 닻을 내렸다는 소문이 돌았다. 화물 명부에 페토라는 이름이 있었다는 이야기도 함께였다. 배는 사흘 뒤 성지로 떠날 예정이었고, {name}의 주머니에는 페토의 나무 팽이가 들어 있었다.",
        choices: [
          { id: "sneak", label: "밤에 몰래 배에 오른다", hint: "열쇠는 늘 허리춤에 있다",
            check: { stat: "skill", against: 55 }, personality: { freedom: 7, caution: -7 },
            outcomes: {
              great: { text: "{name}은 술 취한 간수의 열쇠꾸러미를 빼내 화물칸 문을 열었다. 어둠 속에서 팽이를 본 페토가 이름을 불렀고, 둘은 다른 사람들까지 데리고 새벽 안개 속 부두로 빠져나왔다.", effects: { friendBond: 10, trust: 4, health: -2 }, mark: "peto_freed" },
              good: { text: "화물칸 문은 열었지만 페토는 사슬에 묶여 함께 올 수 없었다. 페토는 갇힌 아이들을 먼저 보내 달라고 했고, {name}은 낯선 아이 셋을 데리고 내려왔다.", effects: { friendBond: 3, trust: 5, health: -2 }, mark: "freed_others" },
              bad: { text: "갑판에 오르자마자 붙잡혔다. 간수들은 {name}을 바다에 던져 버렸고, 부두 기둥을 붙잡고 겨우 살아난 다음 날 배는 이미 떠나고 없었다.", effects: { health: -10, friendBond: -2 }, mark: "peto_lost" }
            } },
          { id: "bribe", label: "모은 돈으로 선원을 매수한다", hint: "돈은 문을 연다, 가끔은",
            check: { stat: "supplies", against: 50 }, personality: { ambition: 4, caution: 3 },
            outcomes: {
              great: { text: "늙은 선원은 돈을 받고도 손을 저었지만, 팽이 이야기를 듣고는 눈시울을 붉혔다. 그날 밤 화물칸 문 하나가 잠기지 않았고, 페토는 짐 자루 속에 숨어 내려왔다.", effects: { supplies: -5, friendBond: 9, trust: 3 }, mark: "peto_freed" },
              good: { text: "선원은 페토를 빼 주지는 못하고 팽이와 쪽지만 전해 주었다. 다음 날 아침 답장이 돌아왔다. 살아 있다고, 꼭 돌아가겠다고.", effects: { supplies: -5, friendBond: 5 }, mark: "peto_lost" },
              bad: { text: "선원은 돈만 챙기고 {name}을 간수에게 일러바쳤다. 겨우 도망쳐 나왔지만 돈도 페토도 잃은 채였다.", effects: { supplies: -8, friendBond: -3 }, mark: "peto_lost" }
            } },
          { id: "crowd", label: "부두 사람들을 모아 길을 막는다", hint: "한 사람은 약해도",
            check: { stat: "trust", against: 50 }, personality: { loyalty: 5, freedom: 5 },
            outcomes: {
              great: { text: "{name}이 부두를 돌며 페토의 이야기를 하자 인부들이 하나둘 짐을 내려놓았다. 출항 날 부두가 사람으로 꽉 막히자 선장은 골칫거리를 덜려고 몇 사람을 내려놓았고, 그중에 페토가 있었다.", effects: { trust: 9, friendBond: 6, health: -2 }, mark: "peto_freed" },
              good: { text: "사람들은 모였지만 해군이 출동해 해산시켰다. 배는 떠났지만, 그날 모였던 인부들은 그 뒤로 노예선이 들어올 때마다 일손을 놓았다.", effects: { trust: 5, health: -2 }, mark: "peto_lost" },
              bad: { text: "모인 사람은 몇 되지 않았고, 해군의 총구 앞에서 모두 흩어졌다. {name}은 끌려가 이름이 장부에 적혔고, 배는 그대로 떠났다.", effects: { trust: -4, health: -3 }, mark: "peto_lost" }
            } }
        ] },
      { step: 3, id: "black_coats", age: 12, art: "dangerPrison", title: "다시 온 검은 옷", requires: ["confessed", "helped_bron", "hid_away", "watched"],
        body: "세 해 뒤, 검은 옷의 요원들이 다시 {home}에 왔다. 이번에는 천룡인을 모욕하는 불온한 자를 찾는다며 집집마다 장부와 서랍을 뒤졌다. 우두머리의 수첩에는 그날 세렌항의 아이를 찾는다는 메모가 적혀 있었다.",
        choices: [
          { id: "witness", label: "마을 사람들 앞에 당당히 선다", hint: "숨지 않는 것도 방패",
            check: { stat: "trust", against: 50 }, personality: { freedom: 6, loyalty: 4, caution: -5 },
            outcomes: {
              great: { text: "{name}이 마을 한가운데 서자, 브론과 어른들이 하나둘 곁에 섰다. 온 마을이 한 아이를 감싸는 모습에 요원들은 귀찮은 일이라 여기고 철수했다.", effects: { trust: 9, bond: 2 }, mark: "kept_village" },
              good: { text: "요원들은 {name}을 하루 동안 심문하고 풀어 주었다. 무서웠지만 끝까지 목소리가 떨리지 않았다는 게 오래 자랑이 되었다.", effects: { trust: 4, health: -2 }, mark: "kept_village" },
              bad: { text: "요원들은 {name}을 본보기로 삼아 양육자의 가게 문을 닫게 했다. 집안은 크게 기울었고, 닫힌 가게 문 앞에서 오래 서 있었다.", effects: { supplies: -7, bond: -3 }, mark: "agent_grudge" }
            } },
          { id: "decoy", label: "가짜 증거로 요원들을 헛돌게 한다", hint: "장부에도 구멍은 있다",
            check: { stat: "skill", against: 50 }, personality: { ambition: 4, caution: -3 },
            outcomes: {
              great: { text: "{name}은 옆 섬 술집 이름을 적은 가짜 편지를 요원들이 찾을 만한 곳에 흘렸다. 요원들은 그 편지를 들고 엉뚱한 섬으로 몰려갔고, {home}은 조용해졌다.", effects: { skill: 7, trust: 3 }, mark: "kept_village" },
              good: { text: "속임수는 통했지만 엉뚱한 섬의 술집 주인이 곤욕을 치렀다는 소식이 들려왔다. {name}은 그 미안함을 오래 품었다.", effects: { skill: 4, trust: 1, health: -1 }, mark: "kept_village" },
              bad: { text: "가짜 편지의 글씨체가 {name}의 공책과 똑같았다. 요원들은 그 이름을 정부 감시 명단에 올렸고, 그 명단은 평생 따라다닐 것이었다.", effects: { trust: -5, skill: -1 }, mark: "agent_grudge" }
            } },
          { id: "run", label: "섬을 잠시 떠나 숨는다", hint: "도망도 기술이다",
            check: { stat: "health", against: 45 }, personality: { freedom: 7, loyalty: -4 },
            outcomes: {
              great: { text: "{name}은 고깃배를 얻어 타고 이웃 섬으로 숨었다. 몇 달을 그곳 부두에서 일하며 넓은 바다를 처음 제대로 보았고, 요원들이 떠난 뒤 조금 자라서 돌아왔다.", effects: { skill: 4, health: 2, supplies: 1 } },
              good: { text: "숨어 지내는 동안 집 걱정에 밤마다 잠을 설쳤다. 돌아왔을 땐 요원들도 떠났지만, 친구들도 조금 멀어져 있었다.", effects: { friendBond: -2, skill: 3 } },
              bad: { text: "배를 잘못 타 낯선 항구에 내렸고, 집에 돌아오기까지 석 달이 걸렸다. 그 사이 양육자는 요원들에게 몇 번이나 불려 갔다.", effects: { health: -4, bond: -4 }, mark: "agent_grudge" }
            } }
        ] },
      { step: 3, id: "second_horn", age: 12, art: "harbor", title: "다시 울린 나팔",
        body: "다섯 해 만에 세렌항에 다시 나팔이 울렸다. 이번엔 {name}이 장터 한복판에 서 있었고, 가마 뒤로 사슬에 묶인 낯선 아이 하나가 비틀거리며 끌려가고 있었다. 사람들은 다시 일제히 땅에 엎드렸다.",
        choices: [
          { id: "endure", label: "주먹을 쥔 채 엎드린다", hint: "오늘은 살아남는 날",
            check: { stat: "bond", against: 40 }, personality: { caution: 7, freedom: -3 },
            outcomes: {
              great: { text: "{name}은 엎드린 채 가마의 문장과 호위병의 수, 행렬이 향하는 부두를 모두 기억했다. 그날 밤 그 기록을 떠돌이 이야기꾼에게 건넸고, 기록은 누군가의 손을 거쳐 멀리 흘러갔다.", effects: { skill: 5, bond: 3 }, mark: "endured" },
              good: { text: "엎드린 땅바닥은 뜨거웠고, 끌려가는 아이의 울음은 오래 귓가에 남았다. {name}은 언젠가 다시는 엎드리지 않겠다고 다짐했다.", effects: { bond: 2, health: 1 }, mark: "endured" },
              bad: { text: "참다못해 고개를 들었다가 호위병과 눈이 마주쳤다. 양육자가 대신 매를 맞았고, {name}은 그 등을 바라보며 아무것도 하지 못했다.", effects: { bond: -5, health: -2 }, mark: "endured" }
            } },
          { id: "free_child", label: "소란 틈에 사슬 아이를 빼낸다", hint: "단 한 번의 틈",
            check: { stat: "skill", against: 55 }, personality: { empathy: 7, freedom: 5, caution: -7 },
            outcomes: {
              great: { text: "가마꾼 하나가 발을 헛디딘 틈에 {name}은 사슬의 고리를 풀었다. 둘은 골목 미로로 사라졌고, 그 아이는 등대지기의 배를 타고 먼 섬으로 떠났다. 떠나며 남긴 이름은 사엘이었다.", effects: { friendBond: 6, skill: 4, trust: 2 }, mark: "helped_escape" },
              good: { text: "아이를 골목으로 빼내긴 했지만 사슬은 끝내 풀지 못했다. 대장간까지 아이를 끌고 가는 사이 {name}의 손은 사슬에 쓸려 엉망이 되었지만, 아이는 그날 밤 자유로워졌다.", effects: { health: -4, friendBond: 4, trust: 2 }, mark: "helped_escape" },
              bad: { text: "고리에 손을 대는 순간 호위병이 {name}의 손목을 낚아챘다. 지나가던 해군 장교가 아이의 실수라며 끼어들지 않았다면 함께 사슬에 묶였을 것이었다.", effects: { health: -6, trust: -3 }, mark: "caught_once" }
            } },
          { id: "stand", label: "끝까지 서 있는다", hint: "모두가 엎드릴 때",
            check: { stat: "health", against: 50 }, personality: { freedom: 8, caution: -8 }, mark: "refused_kneel",
            outcomes: {
              great: { text: "{name}은 엎드리지 않았다. 군중 틈에 섞인 해적 하나가 그 모습을 보고 씩 웃더니 커다란 외투로 덮어 가려 주었고, 행렬은 끝내 아이를 알아채지 못했다.", effects: { health: 2, trust: 3, friendBond: 3 } },
              good: { text: "서 있는 {name}을 본 호위병이 몽둥이를 휘둘렀다. 쓰러져서도 무릎을 꿇지 않았다는 사실이 이상하게 자랑스러웠다.", effects: { health: -5, skill: 2, trust: 2 } },
              bad: { text: "호위병들에게 붙잡혀 행렬 뒤에서 하룻밤을 갇혀 지냈다. 양육자가 집 한 채 값의 벌금을 내고서야 {name}은 풀려났다.", effects: { health: -4, supplies: -7, bond: -1 } }
            } }
        ] },

      { step: 4, id: "debt_paid", age: 28, art: "harbor", title: "빚을 갚으러 온 얼굴", requires: ["peto_freed", "helped_escape", "freed_others"],
        body: "어느 항구에서든, 어느 처지에 있든, 그 사람은 {name}을 찾아냈다. 소매로 사슬 자국을 가린 채 웃는 얼굴이 낯익었다. 그날 함께 빠져나온 이는 이제 노예선을 쫓는 사람들과 일한다며, 한 번만 더 손을 빌려 달라고 했다.",
        choices: [
          { id: "join", label: "한 번 더 손을 보탠다", hint: "이번엔 어른의 싸움",
            check: { stat: "skill", against: 50 }, personality: { empathy: 6, freedom: 5, caution: -5 },
            outcomes: {
              great: { text: "{name}이 아는 바닷길과 항구 사정 덕에 노예선 한 척이 성지에 닿기 전에 멈춰 섰다. 풀려난 사람들 사이에서, 옛 친구는 그날 항구의 아이 이야기를 하며 웃었다.", effects: { trust: 8, skill: 3 }, mark: "freed_again" },
              good: { text: "작전은 성공했지만 {name}의 얼굴이 정부 수배 전단 귀퉁이에 흐릿하게 실렸다. 현상금은 우스울 만큼 적었지만, 처음 붙은 값이었다.", effects: { trust: 4, health: -1, skill: 2 }, mark: "freed_again" },
              bad: { text: "정보가 새어 나가 작전은 실패했다. {name}과 옛 친구는 바다왕류가 사는 물길로 도망쳐 겨우 살아남았고, 서로를 탓하지 않았다.", effects: { health: -8, friendBond: 2 } }
            } },
          { id: "decline", label: "지금의 삶을 지키겠다고 말한다", hint: "거절도 정직하다",
            check: { stat: "bond", against: 40 }, personality: { caution: 6, loyalty: 3 },
            outcomes: {
              great: { text: "옛 친구는 이해한다며 웃었다. 둘은 밤새 그날의 항구 이야기를 했고, 헤어질 때 {name}의 짐에는 언제든 부르면 오겠다는 쪽지 하나가 들어 있었다.", effects: { friendBond: 6, bond: 3 } },
              good: { text: "거절한 뒤 한동안 마음이 무거웠다. {name}은 대신 번 돈의 일부를 그들의 배에 보냈다.", effects: { supplies: -3, trust: 4, friendBond: 2 } },
              bad: { text: "옛 친구는 실망한 얼굴로 떠났다. 몇 달 뒤 그 배가 해군에게 붙잡혔다는 소식을 듣고, {name}은 그날의 거절을 오래 되씹었다.", effects: { friendBond: -5, bond: -1 } }
            } }
        ] },
      { step: 4, id: "holy_rumor", age: 28, art: "legacy", title: "성지에서 온 소문", requires: ["peto_lost", "peto_taken"],
        body: "어디에 있든 신문은 같은 소식을 실었다. 성지에서 큰 소란이 일어 수많은 노예가 풀려나 뿔뿔이 흩어졌다는 것이었다. 풀려난 이들 중 페토가 있었을지 몰라, {name}은 오래 간직한 나무 팽이를 꺼내 들었다.",
        choices: [
          { id: "search_mira", label: "미라를 찾아 소식을 묻는다", hint: "오래된 주소 하나",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 6, empathy: 4 },
            outcomes: {
              great: { text: "수소문 끝에 찾은 미라의 오두막 마당에서, 어른이 된 페토가 장작을 패고 있었다. 페토는 팽이를 보자마자 {name}을 알아봤고, 셋은 그날 밤 바다에 등불을 띄웠다.", effects: { friendBond: 10, bond: 2 }, mark: "peto_home" },
              good: { text: "미라는 아직 기다리고 있었다. {name}은 미라와 함께 풀려난 사람들의 명단을 한 줄씩 읽었고, 이름은 없었지만 희망은 남았다.", effects: { friendBond: 3, trust: 2 } },
              bad: { text: "옛 주소에는 낯선 사람이 살고 있었다. 미라도 떠난 지 오래라는 말에, {name}은 팽이를 쥔 채 부두 끝에 오래 앉아 있었다.", effects: { friendBond: -3, health: -1 } }
            } },
          { id: "light", label: "바다에 등불 하나를 띄운다", hint: "기도도 행동일 때가 있다",
            check: { stat: "bond", against: 40 }, personality: { empathy: 5, caution: 3 },
            outcomes: {
              great: { text: "등불을 띄우고 몇 주 뒤, 보낸 사람 이름 없는 편지가 {name}에게 닿았다. 안에는 팽이를 그린 서툰 그림 한 장과 고맙다는 한 줄뿐이었다.", effects: { bond: 4, friendBond: 6 }, mark: "peto_home" },
              good: { text: "등불은 바람을 타고 멀리 흘러갔다. {name}은 그것으로 그날 엎드렸던 항구에 작은 작별을 고했다.", effects: { bond: 3, health: 2 } },
              bad: { text: "등불은 띄우자마자 파도에 꺼졌다. 괜히 했다 싶어 돌아서는 모습이 그날의 아이와 겹쳐, {name}은 한참을 울었다.", effects: { health: -3, bond: -1 } }
            } }
        ] },
      { step: 4, id: "again_parade", age: 28, art: "harbor", title: "다시 지나가는 행렬",
        body: "어른이 된 {name}이 머물던 항구에도 어느 날 나팔이 울렸다. 사람들이 엎드리기 시작했고, 가마 뒤로는 여전히 사슬 행렬이 이어졌다. 어린 날의 땅바닥 냄새가 되살아났다.",
        choices: [
          { id: "shield", label: "곁의 아이를 품에 감싼다", hint: "이번엔 지켜 줄 차례",
            check: { stat: "health", against: 45 }, personality: { empathy: 7, caution: -2 },
            outcomes: {
              great: { text: "{name}은 곁에서 떨던 낯선 아이를 감싸 안고 함께 엎드렸다. 행렬은 지나갔고, 아이의 어머니는 몇 번이고 고맙다며 고개를 숙였다. 그날의 페토에게 진 빚을 조금 갚은 기분이었다.", effects: { trust: 5, friendBond: 4 } },
              good: { text: "아이를 감싼 {name}의 등에 호위병의 발길질이 떨어졌다. 아팠지만, 아이는 털끝 하나 다치지 않았다.", effects: { health: -4, trust: 5 } },
              bad: { text: "아이를 감싸려다 함께 넘어지며 행렬 앞으로 굴러 나갔다. 총구 앞에서 겨우 빌고 물러났고, 그 굴욕은 오래 {name}의 잠을 빼앗았다.", effects: { health: -5, trust: -2 } }
            } },
          { id: "stand_tall", label: "이번엔 끝까지 서 있는다", hint: "어른의 무릎은 무겁다",
            check: { stat: "trust", against: 50 }, personality: { freedom: 8, caution: -7 },
            outcomes: {
              great: { text: "{name}이 서 있자 곁의 몇 사람도 엎드리던 몸을 멈췄다. 호위병들은 어쩔 줄 몰라 했고, 행렬은 서둘러 그 항구를 빠져나갔다. 그날 이후 항구 사람들은 {name}을 조금 다르게 불렀다.", effects: { trust: 9, skill: 1 }, mark: "stood_tall" },
              good: { text: "호위병에게 끌려가 하룻밤을 갇혀 있었지만, 다음 날 아침 감옥 앞에는 먹을 것을 든 사람들이 줄을 서 있었다.", effects: { health: -3, trust: 6 }, mark: "stood_tall" },
              bad: { text: "서 있던 {name}은 호위병의 개머리판에 쓰러졌다. 깨어나 보니 행렬은 떠났고, 아무도 그 일을 입에 올리지 않았다.", effects: { health: -9, trust: -1 } }
            } }
        ] }
    ]
  }
];
