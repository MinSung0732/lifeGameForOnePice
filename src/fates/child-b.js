// Childhood fates, set B: a split treasure map, a guardian's old name, and a coughing winter.
export default [
  {
    key: "half_map", title: "반쪽짜리 보물지도",
    legacy: {
      default: "반쪽만 쥔 지도로도 길을 나설 수 있다는 배짱이 남았다.",
      treasure_found: "땅속에서 꺼낸 상자보다, 끝까지 파 내려간 손의 기억이 오래 남았다.",
      saved_miju: "경쟁자의 손을 잡아 끌어올린 날부터, 지도의 나머지 반쪽은 늘 사람이라고 믿게 되었다.",
      drak_jailed: "어른의 욕심 앞에서 물러서지 않았던 밤이 평생의 등뼈가 되었다."
    },
    chapters: [
      { step: 1, id: "gift", age: 6, art: "childChart", title: "취한 선원의 선물",
        body: "부두 끝 술통 위에서 늙은 선원 보로가 노래를 부르다 {name}에게 찢어진 양피지를 쥐여 주었다. 반쪽짜리 보물지도라고, 나머지 반쪽은 이 섬 어딘가에 있다고 혀 꼬인 소리로 말했다. 그 모습을 고물상 드락이 가게 문간에서 가만히 지켜보고 있었다.",
        choices: [
          { id: "hide", label: "지도를 집 마루 밑에 숨긴다", hint: "아무도 모르게", check: { stat: "skill", against: 30 },
            personality: { caution: 6, ambition: 3 }, mark: "kept_map",
            outcomes: {
              great: { text: "숨기기 전에 등불에 쬐어 보다가 양피지 뒷면에 레몬즙으로 쓴 글씨가 떠오르는 걸 발견했다. 바위 셋과 갈매기 하나, 뜻 모를 그림이었지만 {name}은 밤새 그것을 외웠다.", effects: { skill: 8, supplies: 2 }, mark: "read_map" },
              good: { text: "마루 밑 판자를 들어 지도를 넣고 못을 다시 박았다. 손가락을 찧어 한동안 숟가락을 왼손으로 들었지만, 지도는 무사했다.", effects: { skill: 4, health: -1 } },
              bad: { text: "숨기는 내내 콧노래를 불렀더니 지나가던 드락이 창문 너머로 다 보았다. 다음 날부터 드락은 {name}에게 유난히 친절하게 사탕을 내밀었다.", effects: { trust: -4, health: -2 }, mark: "drak_saw" }
            } },
          { id: "follow", label: "보로를 따라가 이야기를 더 듣는다", hint: "취객의 말에도 진실이", check: { stat: "trust", against: 30 },
            personality: { empathy: 5, freedom: 3 }, mark: "boro_story",
            outcomes: {
              great: { text: "보로는 바닷바람에 술이 깨자 진지해졌다. 나머지 반쪽은 언덕 위 돛 수선집 아이 미주의 할아버지가 가져갔다고, 두 사람은 한때 같은 배를 탔다고 털어놓았다.", effects: { trust: 6, skill: 3 }, mark: "knew_half" },
              good: { text: "보로는 바다왕류를 맨손으로 쫓았다는 허풍을 한참 늘어놓았다. 반은 거짓말 같았지만 지도가 가리키는 곳이 언덕 아래 바다동굴이라는 말만은 또렷했다.", effects: { skill: 3, trust: 2 } },
              bad: { text: "보로는 이야기 도중 그물 더미에 쓰러져 코를 골았다. 늦게 돌아온 {name}은 양육자에게 술 냄새 묻은 옷을 들켜 호되게 혼났다.", effects: { bond: -5, health: -2 } }
            } },
          { id: "sell", label: "드락에게 지도를 팔아 본다", hint: "어른은 값을 알겠지", check: { stat: "supplies", against: 30 },
            personality: { ambition: 7, loyalty: -3 }, mark: "sold_map",
            outcomes: {
              great: { text: "드락이 내민 동전을 받기 전에 {name}은 지도를 한참 들여다보는 척하며 모든 선을 외워 두었다. 돈도 받고 길도 남긴 셈이었다.", effects: { supplies: 7, skill: 3 }, mark: "read_map" },
              good: { text: "드락은 동전 몇 닢을 던져 주고 지도를 낚아챘다. 생각보다 무거운 동전이었지만, 주머니가 무거워질수록 마음 한쪽은 이상하게 허전해졌다.", effects: { supplies: 5, trust: -2 } },
              bad: { text: "드락은 지도를 받아 들고 눅눅한 사탕 하나를 내밀었다. 따지려 하자 고물상 개가 짖었고, {name}은 사탕을 문 채 울면서 도망쳤다.", effects: { supplies: -3, trust: -3, health: -2 } }
            } }
        ] },

      { step: 2, id: "drak_map", age: 8, art: "workbench", requires: ["sold_map"], title: "고물상의 반쪽",
        body: "드락은 {name}의 지도를 쥐고도 만족하지 못했다. 언덕 위 돛 수선집에 사는 아이 미주에게 나머지 반쪽이 있다는 걸 알아내고는 밤마다 그 집 창문을 두드렸다. 장터에서 마주친 미주의 눈가가 붉게 부어 있었다.",
        choices: [
          { id: "steal_back", label: "고물상에 숨어들어 지도를 되찾는다", hint: "잡히면 끝장", check: { stat: "skill", against: 38 },
            personality: { freedom: 6, ambition: 3 }, mark: "drak_angry",
            outcomes: {
              great: { text: "녹슨 닻과 깨진 전보벌레 껍데기 사이에서 지도를 찾아냈고, 그 자리에 똑같이 찢은 생선 포장지를 넣어 두었다. 드락은 한동안 생선 냄새 나는 지도를 연구했다.", effects: { skill: 7, supplies: 3 }, mark: "partner" },
              good: { text: "지도를 품에 넣고 빠져나오다 고물 더미가 무너졌다. 소리에 깬 드락의 고함이 골목을 울렸지만 {name}은 얼굴을 보이지 않고 달아났다.", effects: { skill: 4, health: -2 } },
              bad: { text: "개가 바지 끝을 물고 놓지 않았다. 드락은 {name}의 멱살을 잡고 양육자 앞에 끌고 가 도둑을 키운다고 장터가 떠나가게 떠들었다.", effects: { trust: -7, bond: -3 } }
            } },
          { id: "warn_miju", label: "미주에게 가서 전부 털어놓는다", hint: "미안하다는 말부터", check: { stat: "friendBond", against: 32 },
            personality: { empathy: 7, loyalty: 3 }, mark: "partner",
            outcomes: {
              great: { text: "미주는 한참 말없이 노려보다가 반쪽 지도를 꺼내 탁자에 놓았다. 너 하나 때문에 시작된 일이니 너도 끝까지 같이 파라고, 그게 사과라고 했다.", effects: { friendBond: 9, skill: 2 } },
              good: { text: "미주는 {name}의 정강이를 한 번 걷어찬 뒤에야 문을 열어 주었다. 아팠지만 그날부터 둘은 드락의 발소리를 함께 망보았다.", effects: { friendBond: 5, health: -2 } },
              bad: { text: "미주는 문을 쾅 닫았고, 마침 지나가던 드락이 그 장면을 보고 둘을 한패로 여겼다. 이제 드락은 두 집을 번갈아 기웃거렸다.", effects: { friendBond: -3, trust: -2 }, mark: "drak_angry" }
            } },
          { id: "tell_town", label: "장터 어른들에게 드락의 짓을 알린다", hint: "어른은 어른이 막는다", check: { stat: "trust", against: 35 },
            personality: { loyalty: 5, caution: 4 }, mark: "drak_angry",
            outcomes: {
              great: { text: "생선 장수와 대장장이가 드락의 가게 앞에 나란히 섰다. 아이 집 창문을 한 번만 더 두드리면 섬에서 물건 하나 못 팔 거라는 말에 드락은 얼굴이 하얘졌다.", effects: { trust: 8, friendBond: 3 }, mark: "partner" },
              good: { text: "어른들은 혀를 찼지만 정작 나서지는 않았다. 그래도 소문이 돌자 드락은 밤마다 창문을 두드리는 일만은 그만두었다.", effects: { trust: 4 } },
              bad: { text: "드락은 오히려 {name}이 먼저 지도를 팔러 왔다고 큰소리쳤다. 어른들은 애들 장난에 끼지 않겠다며 고개를 돌렸고, 거짓말쟁이라는 말은 {name}에게 돌아왔다.", effects: { trust: -6, friendBond: -2 } }
            } }
        ] },
      { step: 2, id: "boro_leaves", age: 8, art: "harbor", requires: ["boro_story"], title: "보로의 마지막 노래",
        body: "어느 새벽 보로가 물 새는 쪽배에 올라 부두를 떠나려 했다. 빚쟁이들이 몰려오기 전에 간다며 {name}에게 마지막 수수께끼를 남겼다. 반쪽끼리 만나야 바위가 입을 연다고, 미주라는 아이를 찾으라고.",
        choices: [
          { id: "stop_boro", label: "쪽배를 붙잡고 같이 가자고 조른다", hint: "늙은이의 고집", check: { stat: "health", against: 35 },
            personality: { empathy: 5, freedom: 4 },
            outcomes: {
              great: { text: "밧줄을 붙든 채 버티자 보로가 결국 웃음을 터뜨렸다. 보로는 쪽배 대신 등대지기 창고에 숨어 겨울을 나기로 했고, 그곳에서 {name}에게 매듭과 별 읽는 법을 가르쳤다.", effects: { skill: 7, trust: 3 }, mark: "boro_saved" },
              good: { text: "보로는 끝내 떠났지만 손때 묻은 나침반을 던져 주었다. 바늘이 북쪽이 아니라 언덕 아래 동굴 쪽을 가리켰다.", effects: { skill: 4, supplies: 2 } },
              bad: { text: "쪽배가 기우뚱하는 바람에 {name}은 차가운 바다에 처박혔다. 보로가 건져 올려 부두에 내려놓고는 미안하다는 말도 없이 노를 저어 갔다.", effects: { health: -8, bond: -2 } }
            } },
          { id: "find_miju", label: "곧장 미주를 찾아간다", hint: "수수께끼의 반쪽", check: { stat: "friendBond", against: 30 },
            personality: { ambition: 4, empathy: 3 }, mark: "partner",
            outcomes: {
              great: { text: "미주는 할아버지가 남긴 반쪽을 이미 다 외우고 있었다. 두 조각을 맞대자 끊긴 선이 이어지며 바위 셋과 갈매기 하나가 그려졌고, 둘은 동시에 소리를 질렀다.", effects: { friendBond: 9, skill: 3 }, mark: "read_map" },
              good: { text: "미주는 의심 많은 눈으로 지도를 반만 보여 주었다. 그래도 같은 날 같은 동굴에 가자는 약속에는 새끼손가락을 걸었다.", effects: { friendBond: 5 } },
              bad: { text: "미주는 할아버지 지도를 훔치러 왔다고 소리치며 빗자루를 휘둘렀다. 그 소리를 들은 드락이 골목 어귀에서 귀를 쫑긋 세웠다.", effects: { friendBond: -4, health: -3 }, mark: "drak_saw" }
            } }
        ] },
      { step: 2, id: "rival_dig", age: 8, art: "childChart", title: "언덕 위의 경쟁자",
        body: "{name}이 지도에 그려진 바위를 찾아 언덕을 헤매던 날, 돛 수선집 아이 미주가 삽을 들고 앞을 막았다. 그 지도는 할아버지 것을 누가 훔쳐 간 반쪽이라고, 나머지 반쪽은 자기한테 있다고 했다. 둘 사이로 바람이 세게 불었다.",
        choices: [
          { id: "race", label: "먼저 파는 쪽이 임자라고 내기한다", hint: "삽질은 체력이다", check: { stat: "health", against: 35 },
            personality: { ambition: 7, freedom: 2 }, mark: "rival",
            outcomes: {
              great: { text: "해 질 녘까지 판 구덩이에서 녹슨 쇠고리가 나왔다. 미주는 분해서 울다가도 그 고리에 새겨진 갈매기 그림을 보고 입을 다물었다. 진짜 보물은 더 아래 있다는 신호였다.", effects: { health: 4, skill: 5 }, mark: "read_map" },
              good: { text: "둘 다 구덩이 하나씩을 팠고 둘 다 아무것도 찾지 못했다. 흙투성이로 내려오는 길에 미주가 다음엔 안 진다고 했고, {name}도 같은 말을 했다.", effects: { health: 2, friendBond: 2 } },
              bad: { text: "구덩이 가장자리가 무너져 {name}은 허리까지 흙에 묻혔다. 미주가 혀를 차며 꺼내 주었지만, 그 대가로 지도를 한 번 보여 줘야 했다.", effects: { health: -6, supplies: -1 } }
            } },
          { id: "join", label: "반쪽끼리 합치자고 손을 내민다", hint: "나누면 반, 합치면 전부", check: { stat: "friendBond", against: 32 },
            personality: { empathy: 6, loyalty: 3 }, mark: "partner",
            outcomes: {
              great: { text: "미주는 손을 맞잡는 대신 지도를 맞댔다. 두 조각이 이어지자 바위 셋이 만나는 자리에 작은 해골이 그려져 있었다. 둘은 그날부터 같은 비밀을 가진 사이가 되었다.", effects: { friendBond: 9, skill: 2 }, mark: "read_map" },
              good: { text: "미주는 조건을 걸었다. 찾은 것은 반씩, 위험한 곳은 {name}이 먼저 들어가기. 불공평했지만 둘은 침을 뱉고 악수했다.", effects: { friendBond: 5, health: -1 } },
              bad: { text: "손을 내밀자 미주는 그 틈에 {name}의 지도를 채 가려 했다. 둘은 언덕을 굴러 떨어졌고 지도 귀퉁이가 찢어져 바람에 날아갔다.", effects: { friendBond: -4, health: -4 }, mark: "rival" }
            } },
          { id: "trick", label: "가짜 지도를 그려 미주를 따돌린다", hint: "꾀가 앞서면", check: { stat: "skill", against: 35 },
            personality: { ambition: 5, caution: 3, empathy: -3 }, mark: "rival",
            outcomes: {
              great: { text: "가짜 지도를 들고 반대편 언덕을 판 건 미주가 아니라 미주를 몰래 따라다니던 드락이었다. {name}은 그날 숨어서 배를 잡고 웃었고, 누가 진짜 적인지도 알게 되었다.", effects: { skill: 7, trust: 2 }, mark: "drak_angry" },
              good: { text: "미주는 가짜 지도를 따라 하루를 허탕 쳤다. 이긴 기분이었지만 다음 날 장터에서 미주가 {name}을 보고 고개를 돌렸을 때 이상하게 가슴이 따끔했다.", effects: { skill: 4, friendBond: -2 } },
              bad: { text: "미주는 가짜 지도를 한눈에 알아보고 큰 소리로 읽어 주었다. 철자가 다 틀렸다는 것까지. 장터 아이들이 한 달 내내 그 철자를 흉내 냈다.", effects: { trust: -4, friendBond: -3 } }
            } }
        ] },

      { step: 3, id: "cave_drak", age: 11, art: "dangerPrison", requires: ["drak_angry", "drak_saw"], title: "동굴 입구의 그림자",
        body: "썰물이 가장 깊어진 밤, {name}은 언덕 아래 바다동굴로 내려갔다. 바위 셋이 만나는 자리에서 쇠상자 모서리가 드러났을 때, 등 뒤에서 등불이 켜졌다. 드락이 부두 건달 둘을 데리고 동굴 입구를 막아서 있었다.",
        choices: [
          { id: "trap_drak", label: "동굴 속 해적의 덫 쪽으로 유인한다", hint: "동굴은 주인을 가린다", check: { stat: "skill", against: 40 },
            personality: { ambition: 4, freedom: 4 },
            outcomes: {
              great: { text: "가짜 상자를 걷어차는 척 물러서자 드락이 달려들었고, 해적들이 깔아 둔 썩은 판자가 꺼졌다. 드락과 건달들은 밀물 웅덩이에 갇혀 아침까지 울었고, 순찰 나온 해군이 그 꼴을 보고 장부를 펼쳤다.", effects: { skill: 8, trust: 6 }, mark: "drak_jailed" },
              good: { text: "덫은 드락 대신 건달 하나를 삼켰다. 소란을 틈타 {name}은 상자를 안고 바위틈으로 빠져나왔지만, 무릎이 찢어져 한 달을 절뚝였다.", effects: { supplies: 5, health: -3 }, mark: "treasure_found" },
              bad: { text: "덫이 엉뚱한 순간에 꺼지며 {name}이 먼저 빠졌다. 드락은 웅덩이에 빠진 아이를 내려다보며 상자를 들고 유유히 동굴을 나갔다.", effects: { health: -8, supplies: -3 } }
            } },
          { id: "shout", label: "동굴이 울리도록 소리쳐 마을을 깨운다", hint: "메아리는 멀리 간다", check: { stat: "trust", against: 38 },
            personality: { loyalty: 5, caution: 3 },
            outcomes: {
              great: { text: "동굴이 소라껍데기처럼 소리를 키워 언덕 위까지 보냈다. 횃불을 든 이웃들이 몰려왔고, 아이를 덮치려던 어른이라는 소문이 퍼지자 드락은 섬을 떠나는 배에 쫓겨 올랐다.", effects: { trust: 9, bond: 2 }, mark: "drak_jailed" },
              good: { text: "몇몇 어부가 그물을 든 채 내려왔다. 드락은 물러갔지만, 그 틈에 상자 안의 금화 절반이 건달들 주머니로 사라졌다.", effects: { trust: 4, supplies: 2 }, mark: "treasure_found" },
              bad: { text: "메아리는 파도 소리에 묻혔다. 건달 하나가 {name}의 입을 막았고, 상자를 빼앗긴 채 동굴 밖 모래밭에 내동댕이쳐졌다.", effects: { health: -6, trust: -3 } }
            } },
          { id: "give_box", label: "상자를 내주고 지도만은 지킨다", hint: "진짜 보물은 따로", check: { stat: "supplies", against: 35 },
            personality: { caution: 7 },
            outcomes: {
              great: { text: "드락은 상자를 안고 신이 나서 떠났지만, 안에는 돌멩이와 낡은 해적기뿐이었다. 지도를 다시 들여다보다 찾아낸 진짜 자리에서 {name}은 이튿날 작은 금화 주머니를 꺼냈다.", effects: { supplies: 9, skill: 3 }, mark: "treasure_found" },
              good: { text: "상자는 빼앗겼지만 지도만은 지켰다. 언젠가 읽을 수 있을 거라 믿으며 {name}은 양피지를 가슴에 품고 집으로 돌아왔다.", effects: { supplies: 2, skill: 3 } },
              bad: { text: "드락은 상자와 지도를 모두 빼앗고 {name}의 등을 떠밀었다. 바위에 부딪친 이마에서 피가 났고, 그날 밤 양육자는 아무것도 묻지 않고 상처만 닦아 주었다.", effects: { health: -6, supplies: -3, bond: 2 }, mark: "lost_map" }
            } }
        ] },
      { step: 3, id: "cave_partner", age: 11, art: "rescue", requires: ["partner"], title: "밀물이 차오르는 동굴",
        body: "{name}과 미주는 이어 붙인 지도를 들고 썰물의 바다동굴로 들어갔다. 바위 셋이 만나는 자리의 돌을 들어 올리는 순간 바닥이 꺼지며 미주가 아래 굴로 떨어졌다. 동굴 입구로 밀물이 하얗게 밀려들기 시작했다.",
        choices: [
          { id: "pull_up", label: "밧줄을 내려 미주부터 끌어올린다", hint: "보물은 그다음", check: { stat: "health", against: 38 },
            personality: { empathy: 7, loyalty: 4 }, mark: "saved_miju",
            outcomes: {
              great: { text: "끌어올리고 보니 미주의 품에 굴 바닥의 쇠상자가 안겨 있었다. 둘은 물이 무릎까지 찬 동굴을 웃으며 빠져나왔고, 상자 안에는 금화와 낡은 항해일지가 들어 있었다.", effects: { friendBond: 8, supplies: 6 }, mark: "treasure_found" },
              good: { text: "미주는 무사히 올라왔지만 상자는 밀물에 휩쓸려 굴 깊숙이 사라졌다. 젖은 채 모래밭에 드러누운 둘은 보물 대신 서로의 숨소리를 들었다.", effects: { friendBond: 6, health: -2 } },
              bad: { text: "밧줄이 바위에 쓸려 끊어지며 {name}도 굴로 떨어졌다. 둘은 물이 목까지 차는 동안 서로 붙들고 버텼고, 새벽에 어부들이 횃불을 들고 찾아왔다.", effects: { health: -9, friendBond: 4, bond: -2 } }
            } },
          { id: "solve", label: "지도의 해골 표시를 다시 읽는다", hint: "덫에는 풀이도 있다", check: { stat: "skill", against: 40 },
            personality: { caution: 5, ambition: 3 },
            outcomes: {
              great: { text: "해골은 덫이 아니라 손잡이 그림이었다. 벽의 해골 모양 돌을 돌리자 바닥이 다시 맞물려 올라왔고, 미주는 쇠상자 위에 앉은 채 떠올라 왔다. 둘은 동시에 기절할 듯 웃었다.", effects: { skill: 8, supplies: 5 }, mark: "treasure_found" },
              good: { text: "돌을 돌리자 물길이 바뀌어 밀물이 반대편으로 빠졌다. 미주는 스스로 기어 올라왔지만, 왜 이렇게 오래 걸렸냐고 한 시간 동안 따졌다.", effects: { skill: 5, friendBond: -1 }, mark: "saved_miju" },
              bad: { text: "엉뚱한 돌을 돌리자 천장에서 박쥐 떼가 쏟아졌다. 혼비백산한 와중에 어부들이 미주를 구했고, {name}은 겁쟁이라는 별명을 얻었다.", effects: { trust: -4, friendBond: -4, health: -2 } }
            } }
        ] },
      { step: 3, id: "cave_alone", age: 11, art: "childInlet", title: "혼자 들어간 동굴",
        body: "{name}은 누구에게도 말하지 않고 언덕 아래 바다동굴로 내려갔다. 미주가 먼저 다녀간 흔적이 모래에 찍혀 있었고, 안쪽에서 누군가 도와 달라고 외치는 소리가 들렸다. 발밑으로 밀물이 스며들고 있었다.",
        choices: [
          { id: "go_in", label: "소리를 따라 안으로 들어간다", hint: "경쟁자일지라도", check: { stat: "health", against: 38 },
            personality: { empathy: 6, freedom: 3 }, mark: "saved_miju",
            outcomes: {
              great: { text: "바위틈에 발이 낀 미주를 빼내고 보니 그 옆에 쇠상자가 반쯤 묻혀 있었다. 둘은 상자를 함께 끌고 나왔고, 그날 이후 미주는 다시는 경쟁자라는 말을 쓰지 않았다.", effects: { friendBond: 9, supplies: 4 }, mark: "treasure_found" },
              good: { text: "미주를 업고 나오느라 상자는 포기했다. 미주는 고맙다는 말 대신 다음엔 자기가 구해 줄 차례라고 중얼거렸다.", effects: { friendBond: 6, health: -3 } },
              bad: { text: "들어가다 미끄러져 둘 다 갇혔다. 밤새 바위에 매달려 있다가 아침 썰물에 겨우 기어 나왔고, {name}은 한 달 넘게 기침을 달고 살았다.", effects: { health: -10, friendBond: 3 } }
            } },
          { id: "dig_first", label: "외침을 못 들은 척 상자를 판다", hint: "보물은 기다려 주지 않는다", check: { stat: "skill", against: 35 },
            personality: { ambition: 8, empathy: -5 },
            outcomes: {
              great: { text: "상자를 꺼내자마자 정신이 들어 안쪽으로 달려갔다. 미주는 이미 스스로 빠져나와 있었지만, 상자를 든 {name}을 보고는 아무 말 없이 등을 돌렸다.", effects: { supplies: 9, friendBond: -3 }, mark: "treasure_found" },
              good: { text: "상자는 생각보다 깊었다. 밀물이 차오르자 결국 빈손으로 뛰쳐나왔고, 미주는 어부들이 구했다. 그 뒤로 미주의 시선이 등에 꽂힐 때마다 차가웠다.", effects: { supplies: 1, friendBond: -4, trust: -1 } },
              bad: { text: "상자는 텅 비어 있었고 밑바닥에 해적의 낙서만 남아 있었다. 욕심쟁이에게는 아무것도 없다는. 미주를 구한 어부들이 그 장면을 다 보았다.", effects: { trust: -7, friendBond: -4 }, mark: "lost_map" }
            } }
        ] },

      { step: 4, id: "echo_miju", age: 26, art: "legacy", requires: ["saved_miju"], title: "미주의 편지",
        body: "어느 항구에서 {name}에게 낡은 봉투가 전해졌다. 돛 수선공이 된 미주가 할아버지의 낡은 항해일지를 끝까지 해독했다는 편지였다. 일지에 적힌 섬이 실제로 있으니 반쪽씩 다시 들고 가 보자고 적혀 있었다.",
        choices: [
          { id: "reply_go", label: "답장을 보내 약속 날짜를 정한다", hint: "다시 반쪽이 되어", check: { stat: "friendBond", against: 35 },
            personality: { freedom: 6, loyalty: 4 },
            outcomes: {
              great: { text: "약속한 항구에서 만난 미주는 여전히 삽부터 내밀었다. 일지 속 섬에서 찾은 것은 금화가 아니라 보로와 미주 할아버지가 함께 새긴 이름이었고, 둘은 그 옆에 자기들 이름을 새겼다.", effects: { friendBond: 10, skill: 3 } },
              good: { text: "일정이 몇 번이나 어긋났지만 결국 짧은 하루를 함께 보냈다. 섬은 찾지 못했고, 대신 밤새 동굴 이야기를 하며 웃었다.", effects: { friendBond: 5, supplies: -1 } },
              bad: { text: "답장은 폭풍에 실려 엉뚱한 섬으로 갔다. 한참 뒤 미주가 혼자 다녀왔다는 소식을 들었을 때, {name}은 부두에 앉아 오래 바다를 보았다.", effects: { friendBond: -3, bond: -1 } }
            } },
          { id: "send_half", label: "간직한 지도 조각을 미주에게 보낸다", hint: "몸은 못 가도", check: { stat: "trust", against: 30 },
            personality: { empathy: 5, caution: 3 },
            outcomes: {
              great: { text: "조각을 받은 미주가 마지막 표시를 읽어 냈고, 그 섬의 이름은 이후 해도에 정식으로 실렸다. 발견자 이름 옆에 {name}의 이름도 나란히 적혔다.", effects: { trust: 8, friendBond: 4 } },
              good: { text: "미주는 고맙다는 짧은 답장과 함께 그 섬의 조개껍데기 하나를 보내왔다. 책상 위의 조개는 오래도록 바다 냄새를 풍겼다.", effects: { friendBond: 4, trust: 2 } },
              bad: { text: "편지를 맡긴 배달꾼이 중간에서 조각을 팔아 버렸다. 미주는 오래 기다리다 화를 냈고, 오해를 푸는 데 몇 해가 걸렸다.", effects: { friendBond: -5, supplies: -2 } }
            } }
        ] },
      { step: 4, id: "echo_drak", age: 26, art: "dangerPrison", requires: ["drak_jailed", "drak_angry"], title: "늙은 고물상의 현상금",
        body: "낯선 항구의 게시판에 낡은 수배서가 붙어 있었다. 얼굴은 늙었지만 틀림없는 드락이었다. 그 섬을 떠난 뒤 아이들을 꾀어 보물을 캐게 하는 작은 해적단을 꾸렸다고 했다. 바로 그날 밤, 선술집 구석에서 드락의 웃음소리가 들렸다.",
        choices: [
          { id: "confront", label: "드락 앞에 앉아 옛날 동굴 이야기를 꺼낸다", hint: "기억은 칼보다 무겁다", check: { stat: "trust", against: 40 },
            personality: { loyalty: 4, ambition: 4 },
            outcomes: {
              great: { text: "{name}을 알아본 드락의 얼굴이 하얗게 질렸다. 그 사이 선술집 사람들이 수배서를 들고 하나둘 일어섰고, 드락이 데리고 있던 아이들은 그날 밤 각자의 집으로 돌아갔다.", effects: { trust: 9, skill: 3 } },
              good: { text: "드락은 억지로 웃으며 동전 주머니를 밀어 놓고 달아났다. 잡지는 못했지만, 그 항구에서 드락에게 일하는 아이는 다시 보이지 않았다.", effects: { trust: 4, supplies: 2 } },
              bad: { text: "드락은 큰 소리로 {name}의 어린 시절 이야기를 우스꽝스럽게 떠벌렸다. 선술집이 웃음바다가 된 틈에 드락은 뒷문으로 사라졌다.", effects: { trust: -5, health: -2 } }
            } },
          { id: "free_kids", label: "드락의 배에 남은 아이들부터 빼낸다", hint: "그 동굴의 아이처럼", check: { stat: "skill", against: 38 },
            personality: { empathy: 7, freedom: 3 },
            outcomes: {
              great: { text: "밧줄을 끊고 배 밑창 문을 열자 아이들이 줄지어 나왔다. 맨 마지막 아이가 반쪽짜리 지도를 내밀며 이걸 드락이 노린다고 했고, {name}은 그 지도를 아이 손에 다시 쥐여 주었다.", effects: { trust: 8, friendBond: 4 } },
              good: { text: "아이 둘을 빼내는 데 성공했지만 셋째를 데리러 갔다가 들켰다. 소동 끝에 셋째도 갑판에서 뛰어내려 무사히 부두로 빠져나왔다.", effects: { trust: 5, health: -2 } },
              bad: { text: "드락의 부하에게 붙잡혀 밤새 돛대에 묶여 있었다. 아침에 항구 사람들이 풀어 주었을 때 드락의 배는 이미 수평선 너머였다.", effects: { health: -7, trust: -2 } }
            } }
        ] },
      { step: 4, id: "echo_rumor", age: 26, art: "childMarket", title: "장터에 나온 반쪽",
        body: "먼 항구의 장터 좌판에서 {name}은 익숙한 양피지를 보았다. 바위 셋과 갈매기 하나, 찢어진 가장자리. 상인은 {home} 근처에서 흘러나온 보물지도 반쪽이라며 터무니없는 값을 불렀다. 옆에서 어린아이 하나가 그 지도를 뚫어져라 보고 있었다.",
        choices: [
          { id: "buy_kid", label: "값을 치르고 아이에게 지도를 건넨다", hint: "그때의 나에게", check: { stat: "supplies", against: 35 },
            personality: { empathy: 6, freedom: 3 },
            outcomes: {
              great: { text: "아이는 지도를 받아 들고 한참 굳어 있다가, 언젠가 나머지 반쪽을 찾으면 꼭 알려 주겠다고 했다. 몇 해 뒤 정말로 낯선 글씨의 편지가 {name}에게 날아왔다.", effects: { trust: 6, friendBond: 5 } },
              good: { text: "값을 깎느라 반나절이 걸렸지만 지도는 아이 손에 들어갔다. 아이는 고맙다는 말도 없이 뛰어갔고, {name}은 그게 꼭 옛날 자신 같아 웃었다.", effects: { supplies: -3, trust: 5 } },
              bad: { text: "비싸게 산 지도는 잉크가 마르지도 않은 가짜였다. 아이와 둘이 손가락이 시커메진 채 상인을 쫓았지만 좌판은 이미 사라졌다.", effects: { supplies: -6, health: -1 } }
            } },
          { id: "tell_truth", label: "이 지도의 진짜 이야기를 들려준다", hint: "보물보다 이야기", check: { stat: "skill", against: 32 },
            personality: { loyalty: 4, caution: 4 },
            outcomes: {
              great: { text: "동굴과 덫과 밀물 이야기에 장터 사람들이 하나둘 모여들었다. 상인은 얼굴이 빨개져 지도를 내려놓았고, 이야기가 끝나자 누군가 {name}에게 따뜻한 국 한 그릇을 사 주었다.", effects: { trust: 7, supplies: 3 } },
              good: { text: "아이는 끝까지 귀를 기울였다. 지도를 사지는 않았지만, 보물보다 그걸 함께 찾을 사람이 먼저라는 말만은 외우고 돌아갔다.", effects: { trust: 4, friendBond: 1 } },
              bad: { text: "이야기가 길어지는 동안 상인은 지도를 다른 손님에게 팔아 버렸다. 아이는 하품을 하며 가 버렸고 {name}은 빈 좌판 앞에 남았다.", effects: { trust: -2, supplies: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "guardian_secret", title: "양육자의 옛 이름",
    legacy: {
      default: "누구에게나 접어 둔 이름이 있다는 것을, 그리고 그 이름을 함부로 펼치지 않는 법을 배웠다.",
      chose_truth: "진실은 사랑하는 사람에게서도 숨기지 않는다는 원칙이 그 겨울에 생겼다.",
      town_shielded: "섬 전체가 한 사람의 과거를 덮어 준 날, 고향이라는 말의 뜻을 처음 알았다.",
      guardian_fled: "밤배에 올라 떠난 뒷모습이 평생 수평선 끝에 걸려 있었다.",
      guardian_taken: "끌려가는 양육자를 끝까지 바라본 눈이, 정의라는 말을 오래 의심하게 만들었다."
    },
    chapters: [
      { step: 1, id: "poster", age: 7, art: "workbench", title: "마루 밑의 수배서",
        body: "공구함을 찾다가 마루 밑에서 기름종이에 싼 상자를 꺼냈다. 그 안에 접힌 수배서 한 장이 있었다. 지금보다 훨씬 젊은 양육자의 얼굴 아래에 리안이라는 낯선 이름과 꽤 큰 현상금이 적혀 있었다. 바깥에서 양육자가 {name}을 부르는 소리가 들렸다.",
        choices: [
          { id: "ask", label: "수배서를 들고 가 곧장 묻는다", hint: "모르는 채로는 못 산다", check: { stat: "bond", against: 32 },
            personality: { freedom: 3, loyalty: 3 }, mark: "asked",
            outcomes: {
              great: { text: "양육자는 오래 말이 없다가 부엌 의자에 앉아 이야기를 시작했다. 천룡인의 노예선을 털어 사람들을 풀어 준 해적단에 있었다고, 그래서 이 이름은 아직 바다에서 쫓긴다고 했다.", effects: { bond: 9, skill: 2 }, mark: "told_truth" },
              good: { text: "양육자는 옛날 일이라고만 하고 수배서를 다시 접었다. 하지만 그날 저녁상에는 {name}이 좋아하는 생선이 두 마리나 올라와 있었다.", effects: { bond: 4 } },
              bad: { text: "양육자의 얼굴이 처음 보는 표정으로 굳었다. 수배서는 그날 밤 아궁이에서 타 버렸고, 집 안에는 한동안 아무도 그 이야기를 꺼내지 않았다.", effects: { bond: -6, health: -1 }, mark: "poster_burned" }
            } },
          { id: "put_back", label: "아무것도 못 본 척 제자리에 둔다", hint: "말하지 않는 것도 사랑", check: { stat: "skill", against: 30 },
            personality: { caution: 6, loyalty: 3 }, mark: "kept_quiet",
            outcomes: {
              great: { text: "상자를 닫기 전, 수배서 밑에 깔린 편지 한 장이 눈에 들어왔다. 언젠가 빚을 갚으러 가겠다는 글 끝에 카스텔이라는 서명이 있었다. {name}은 그 이름을 마음속 깊이 넣어 두었다.", effects: { skill: 6, bond: 2 }, mark: "found_letter" },
              good: { text: "기름종이를 원래대로 접고 마루를 닫았다. 저녁을 먹는 동안 양육자의 얼굴을 몰래 보며, 그 얼굴 뒤에 다른 얼굴이 있다는 걸 혼자 알았다.", effects: { skill: 3, bond: 1 } },
              bad: { text: "서두르다 상자 걸쇠를 부러뜨렸다. 다음 날 양육자는 마루 밑을 한참 들여다보았고, 그 뒤로 집 안에 자물쇠가 하나 늘었다.", effects: { bond: -4, skill: 1 } }
            } },
          { id: "show_friend", label: "단짝 토비에게 몰래 보여 준다", hint: "혼자 지기엔 무거운 비밀", check: { stat: "friendBond", against: 35 },
            personality: { freedom: 5, loyalty: -3 }, mark: "told_friend",
            outcomes: {
              great: { text: "토비는 수배서를 보고 눈을 반짝였다. 그럼 너희 집 어른이 영웅이라는 거네, 하고. 둘은 손가락을 걸고 이 비밀을 무덤까지 가져가기로 했다.", effects: { friendBond: 8, bond: 1 } },
              good: { text: "토비는 입이 무겁지 않았지만 이번만은 참았다. 대신 며칠 동안 양육자를 볼 때마다 경례를 붙여서 {name}의 등에 식은땀이 흘렀다.", effects: { friendBond: 4, trust: -1 } },
              bad: { text: "토비는 딱 한 사람에게만 말했고, 그 한 사람도 딱 한 사람에게만 말했다. 장날이 되자 {home}의 장터에 수상한 소문이 돌기 시작했다.", effects: { trust: -6, friendBond: -2 }, mark: "rumor" }
            } }
        ] },

      { step: 2, id: "hunter", age: 9, art: "harbor", requires: ["rumor", "poster_burned"], title: "현상금 사냥꾼",
        body: "어디서 냄새를 맡았는지 현상금 사냥꾼 오르덴이 {home}의 부두에 내렸다. 회색 외투에 낡은 수배서 뭉치를 든 오르덴은 아이들에게 사탕을 나눠 주며 이런 얼굴을 본 적 있냐고 물었다. 그 뭉치 맨 위에 젊은 양육자의 얼굴이 있었다.",
        choices: [
          { id: "lie", label: "눈 하나 깜빡이지 않고 거짓말한다", hint: "어른을 속이려면", check: { stat: "skill", against: 40 },
            personality: { loyalty: 7, caution: 2 }, mark: "sided_guardian",
            outcomes: {
              great: { text: "{name}은 그 얼굴이 옆 섬 등대지기와 닮았다고, 거기서 봤다고 말했다. 오르덴은 고개를 끄덕이며 첫배로 떠났고, 양육자는 그날 이유도 모른 채 {name}을 꼭 안아 주었다.", effects: { skill: 7, bond: 4 }, mark: "hunter_fooled" },
              good: { text: "오르덴은 거짓말을 반쯤 믿은 눈치였다. 섬을 떠나긴 했지만 부두의 술집 주인에게 동전을 쥐여 주고 연락을 부탁했다.", effects: { skill: 3, trust: 1 }, mark: "hunter_suspicious" },
              bad: { text: "말을 더듬는 사이 오르덴의 눈이 가늘어졌다. 오르덴은 사탕을 하나 더 주며 고맙다고 했고, 그날 저녁 집 앞을 천천히 지나갔다.", effects: { bond: -2, trust: -3, health: -1 }, mark: "hunter_suspicious" }
            } },
          { id: "warn_home", label: "집으로 달려가 양육자에게 알린다", hint: "달리기라면 자신 있다", check: { stat: "health", against: 32 },
            personality: { loyalty: 6, empathy: 2 }, mark: "sided_guardian",
            outcomes: {
              great: { text: "양육자는 놀라지 않았다. 오래 기다려 온 사람처럼 지붕 밑 다락을 열어 {name}에게 숨을 자리를 보여 주고, 이제부터는 너도 아는 사람이니까 같이 지키자고 했다.", effects: { bond: 9, health: 1 }, mark: "chose_truth" },
              good: { text: "숨이 턱에 차서 전한 소식에 양육자는 한동안 장터에 나가지 않았다. 오르덴은 며칠 뒤 떠났지만, 집 안의 공기는 오래 무거웠다.", effects: { bond: 4, supplies: -2 } },
              bad: { text: "지름길로 달리다 돌담에서 굴러떨어졌다. 다친 아이를 업고 집까지 데려다준 사람은 하필 오르덴이었다. 문을 연 양육자와 오르덴의 눈이 마주쳤다.", effects: { health: -7, bond: 1 }, mark: "hunter_suspicious" }
            } }
        ] },
      { step: 2, id: "castel", age: 9, art: "repaired", requires: ["told_truth", "found_letter", "told_friend"], title: "외눈의 옛 동료",
        body: "폭풍이 지난 아침, 부서진 범선 한 척이 {home}에 닿았다. 배에서 내린 외눈 사내가 양육자를 보고 리안이라고 불렀다. 카스텔이라는 이름의 옛 동료였다. 그날 밤 {name}은 문틈으로 마지막 한탕을 같이 하자는 낮은 목소리를 들었다.",
        choices: [
          { id: "confess", label: "들었다고 양육자에게 털어놓는다", hint: "같은 편이라면", check: { stat: "bond", against: 35 },
            personality: { loyalty: 6, empathy: 3 }, mark: "chose_truth",
            outcomes: {
              great: { text: "양육자는 {name}의 손을 잡고 카스텔 앞에 함께 섰다. 이 아이가 지금의 내 배라고, 다른 항해는 없다고 말했다. 카스텔은 한참 웃더니 고개를 숙이고 떠날 채비를 했다.", effects: { bond: 10, trust: 2 }, mark: "met_castel" },
              good: { text: "양육자는 걱정하지 말라고만 했다. 카스텔은 사흘을 더 머물다 떠났고, 떠나기 전 {name}에게 낡은 단검 하나를 맡겼다.", effects: { bond: 4, supplies: 2 }, mark: "met_castel" },
              bad: { text: "털어놓는 순간 문가에 서 있던 카스텔이 모두 들었다. 엿듣는 아이를 키우는 줄은 몰랐다며 껄껄 웃었고, 양육자는 처음으로 {name}에게 화를 냈다.", effects: { bond: -5, friendBond: -1 }, mark: "met_castel" }
            } },
          { id: "sabotage", label: "카스텔의 배 밧줄을 몰래 풀어 둔다", hint: "떠나는 배가 없으면", check: { stat: "skill", against: 38 },
            personality: { freedom: 5, loyalty: 4 }, mark: "sided_guardian",
            outcomes: {
              great: { text: "밧줄이 풀린 범선이 썰물에 떠내려가 등대 앞 모래톱에 걸렸다. 카스텔은 배를 빼내느라 한 달을 고생했고, 그동안 양육자의 마음은 끝내 흔들리지 않았다.", effects: { skill: 7, bond: 3 }, mark: "met_castel" },
              good: { text: "배는 반쯤 떠내려갔다가 어부들 손에 돌아왔다. 카스텔은 범인을 눈치챈 듯 {name}에게 윙크를 하고 혼자 바다로 나갔다.", effects: { skill: 4, trust: -1 }, mark: "met_castel" },
              bad: { text: "밧줄을 푸는 순간 카스텔의 손이 {name}의 뒷덜미를 잡았다. 그대로 양육자 앞에 끌려가자, 양육자는 웃지도 화내지도 못한 얼굴로 한숨만 쉬었다.", effects: { bond: -3, health: -3, trust: -2 }, mark: "met_castel" }
            } }
        ] },
      { step: 2, id: "fever", age: 9, art: "lifeStorm", title: "열에 들뜬 밤",
        body: "폭풍 속에서 고깃배를 끌어올리던 양육자가 크게 다쳐 돌아왔다. 상처를 닦던 {name}은 오래된 낙인 자국을 보았다. 열에 들뜬 양육자는 밤새 리안, 리안 하고 스스로를 부르며 어느 섬의 이름을 되뇌었다.",
        choices: [
          { id: "nurse", label: "밤새 곁을 지키며 열을 내린다", hint: "물수건과 인내", check: { stat: "supplies", against: 32 },
            personality: { empathy: 7, loyalty: 3 }, mark: "fever_words",
            outcomes: {
              great: { text: "새벽에 열이 내리자 양육자는 {name}의 손에 젖은 수건이 쥐여 있는 걸 보고 울었다. 그리고 들었냐고, 이제 다 말해 주겠다고 했다.", effects: { bond: 10, health: -1 }, mark: "told_truth" },
              good: { text: "양육자는 사흘 만에 일어났다. 무슨 말을 들었는지 묻지 않았고, {name}도 말하지 않았다. 둘 사이에는 말없는 약속 하나가 생겼다.", effects: { bond: 5, health: -2 } },
              bad: { text: "약초가 떨어져 밤새 찬물만 갈았다. 양육자는 열흘을 앓았고, 그사이 {name}은 이웃집에 빌린 쌀을 갚느라 장터에서 짐을 날랐다.", effects: { supplies: -6, health: -3, bond: 2 } }
            } },
          { id: "doctor", label: "마을 의원을 불러온다", hint: "낙인을 보면 어쩌나", check: { stat: "trust", against: 35 },
            personality: { caution: -2, empathy: 4 },
            outcomes: {
              great: { text: "늙은 의원은 낙인을 보고도 붕대를 감으며 아무 말 하지 않았다. 나가는 길에 {name}에게 속삭였다. 이 섬엔 이런 상처를 가진 사람이 생각보다 많다고.", effects: { trust: 7, bond: 3 }, mark: "sided_guardian" },
              good: { text: "의원은 상처를 꿰매고 비싼 약값을 불렀다. 낙인에 대해서는 묻지 않았지만, 의원의 눈빛이 오래 머물렀다.", effects: { supplies: -3, health: 3, trust: 1 } },
              bad: { text: "의원 조수가 낙인 이야기를 장터에 흘렸다. 양육자가 회복했을 때 {home}에는 이미 수군거림이 퍼져 있었다.", effects: { trust: -5, bond: -2 }, mark: "rumor" }
            } },
          { id: "search_box", label: "양육자가 잠든 사이 상자를 뒤진다", hint: "그 섬의 이름을 찾아", check: { stat: "skill", against: 35 },
            personality: { ambition: 5, freedom: 3, loyalty: -3 }, mark: "chose_truth",
            outcomes: {
              great: { text: "상자 밑바닥에서 노예선에서 풀려난 사람들이 쓴 감사 편지 묶음이 나왔다. 양육자가 쫓기는 이유가 무엇인지, {name}은 그날 밤 전부 알았다.", effects: { skill: 6, bond: 2 }, mark: "fever_words" },
              good: { text: "옛 해도 한 장을 찾았다. 양육자가 되뇌던 섬에 붉은 동그라미가 쳐져 있었다. 무엇을 뜻하는지는 몰랐지만 {name}은 해도를 베껴 두었다.", effects: { skill: 4 } },
              bad: { text: "상자를 뒤지는 소리에 양육자가 눈을 떴다. 열에 들뜬 눈으로 {name}을 한참 보다가, 너도 날 수배서로 보는구나 하고 돌아누웠다.", effects: { bond: -7 } }
            } }
        ] },

      { step: 3, id: "marines", age: 12, art: "dangerPrison", requires: ["hunter_suspicious", "met_castel", "rumor"], title: "장터 게시판의 얼굴",
        body: "해군 순찰선이 {home}에 닻을 내렸다. 장터 게시판에 새로 붙은 수배서에는 리안이라는 이름과 양육자의 젊은 얼굴이 선명했다. 이웃들은 게시판 앞에서 서로의 눈치를 보았고, 해군 대위는 내일 아침 집집마다 문을 두드리겠다고 했다.",
        choices: [
          { id: "night_boat", label: "밤배를 구해 양육자를 떠나보낸다", hint: "이별을 각오하고", check: { stat: "skill", against: 40 },
            personality: { loyalty: 6, freedom: 4 }, mark: "guardian_fled",
            outcomes: {
              great: { text: "등대 뒤 작은 만에 어부의 쪽배를 숨겨 두고 밤바다 길을 미리 살폈다. 양육자는 떠나기 전 {name}의 이마에 손을 얹고, 어디에 있든 이 이름은 네 것이라며 리안이라 쓴 쪽지를 남겼다.", effects: { skill: 8, bond: 4 } },
              good: { text: "쪽배는 구했지만 짐을 챙길 틈이 없었다. 양육자는 맨손으로 떠났고, {name}은 텅 빈 집에서 혼자 아침을 맞았다.", effects: { skill: 4, bond: 2, supplies: -2 } },
              bad: { text: "쪽배가 등대 불빛에 걸려 해군 망원경에 잡혔다. 양육자는 아이를 두고 갈 수 없다며 스스로 노를 놓고 해변으로 돌아와 손을 내밀었다.", effects: { bond: 3, trust: -4, health: -4 }, mark: "guardian_taken" }
            } },
          { id: "stand_up", label: "장터 한가운데서 양육자의 옛일을 외친다", hint: "진실이 방패가 되도록", check: { stat: "trust", against: 42 },
            personality: { empathy: 5, freedom: 5 }, mark: "chose_truth",
            outcomes: {
              great: { text: "{name}이 양육자가 노예선 사람들을 풀어 준 해적이었다고 외치자 장터가 조용해졌다. 생선 장수가 먼저 그런 사람 이 섬엔 없다고 말했고, 하나둘 그 말을 따라 했다. 해군 대위는 빈손으로 닻을 올렸다.", effects: { trust: 10, bond: 4 }, mark: "town_shielded" },
              good: { text: "몇몇은 고개를 끄덕였고 몇몇은 등을 돌렸다. 해군은 결국 증인을 찾지 못하고 떠났지만, {home}의 인사 몇 개는 그날 이후 사라졌다.", effects: { trust: 3, bond: 4 }, mark: "town_shielded" },
              bad: { text: "외치는 소리가 해군 대위의 귀에 가장 먼저 닿았다. 아이가 증언했다는 기록이 남았고, 양육자는 손목에 해루석 수갑을 찬 채 {name}을 보며 괜찮다고 웃었다.", effects: { trust: -4, bond: -2, health: -3 }, mark: "guardian_taken" }
            } },
          { id: "tear_posters", label: "밤새 섬의 수배서를 전부 떼어 낸다", hint: "얼굴이 없으면", check: { stat: "health", against: 36 },
            personality: { loyalty: 5, caution: 2 }, mark: "sided_guardian",
            outcomes: {
              great: { text: "새벽까지 떼어 낸 수배서를 바다에 띄우는데, 골목마다 같은 일을 하는 그림자들이 보였다. 이웃들이었다. 아침 해군 대위 앞에 남은 게시판은 깨끗했다.", effects: { trust: 7, health: -1, bond: 3 }, mark: "town_shielded" },
              good: { text: "수배서는 대부분 사라졌지만 해군 숙소 문에 붙은 한 장은 손이 닿지 않았다. 해군은 의심만 남긴 채 다음 섬으로 떠났다.", effects: { health: -2, bond: 4 } },
              bad: { text: "마지막 한 장을 떼다 순찰병에게 붙잡혔다. 품 안에서 수배서 수십 장이 쏟아졌고, 그것이 곧 양육자가 이 섬에 있다는 증거가 되었다.", effects: { health: -5, trust: -5 }, mark: "guardian_taken" }
            } }
        ] },
      { step: 3, id: "debt", age: 12, art: "childLantern", requires: ["chose_truth", "told_truth", "fever_words"], title: "빚을 받으러 온 가면",
        body: "가면을 쓴 낯선 이가 밤중에 문을 두드렸다. 리안이 옛 선장에게서 빼돌린 금고 열쇠를 내놓으라고, 아니면 이 섬에 그 이름을 퍼뜨리겠다고 했다. 양육자는 {name}을 등 뒤로 숨기며 그 열쇠는 노예선 사람들의 몫이었다고 낮게 말했다.",
        choices: [
          { id: "fake_key", label: "공방에서 가짜 열쇠를 깎아 건넨다", hint: "손재주가 통한다면", check: { stat: "skill", against: 40 },
            personality: { caution: 4, ambition: 3 },
            outcomes: {
              great: { text: "생선 뼈 무늬까지 흉내 낸 가짜 열쇠를 받아 든 가면은 만족해서 떠났다. 다시는 돌아오지 않았고, 몇 달 뒤 엉뚱한 금고를 털다 붙잡혔다는 소문이 들려왔다.", effects: { skill: 9, bond: 3 }, mark: "town_shielded" },
              good: { text: "가면은 열쇠를 의심하면서도 받아 갔다. 양육자는 그날 밤부터 문 앞에 작살을 세워 두었고, {name}은 매일 밤 그 작살을 확인하고 잠들었다.", effects: { skill: 5, health: -1 } },
              bad: { text: "가면은 열쇠를 보자마자 바닥에 던졌다. 아이 장난에 속을 줄 알았냐며 장터 게시판에 리안의 수배서를 붙이고 떠났다.", effects: { trust: -6, bond: -1 }, mark: "rumor" }
            } },
          { id: "ring_bell", label: "몰래 빠져나가 등대 종을 친다", hint: "섬 전체를 깨워", check: { stat: "trust", against: 38 },
            personality: { freedom: 4, loyalty: 4 },
            outcomes: {
              great: { text: "종소리에 횃불을 든 이웃들이 몰려왔다. 가면은 수십 개의 눈 앞에서 아무 말도 하지 못하고 달아났고, 다음 날 아무도 그 일을 묻지 않았다. 그게 이 섬의 대답이었다.", effects: { trust: 9, bond: 3 }, mark: "town_shielded" },
              good: { text: "몇몇 이웃이 달려와 가면은 달아났다. 하지만 왜 그런 자가 찾아왔는지 묻는 눈길이 한동안 양육자를 따라다녔다.", effects: { trust: 3, bond: 2 } },
              bad: { text: "종을 치기도 전에 가면이 {name}을 붙잡았다. 양육자는 아이를 돌려받는 대가로 상자 속에 간직하던 편지 묶음까지 모두 내주어야 했다.", effects: { health: -5, bond: -2, supplies: -4 } }
            } }
        ] },
      { step: 3, id: "silence", age: 12, art: "childMarket", title: "말하지 않은 해",
        body: "수배서 일을 아무도 입 밖에 내지 않은 채 해가 바뀌었다. 그해 겨울, 장터 게시판에 새 수배서가 붙었다. 얼굴은 낯설었지만 같은 해적단의 이름 아래, 동료 명단 끝에 리안이라는 이름이 작게 적혀 있었다. 양육자는 그 게시판 앞을 매일 지나갔다.",
        choices: [
          { id: "finally_ask", label: "이번에는 정면으로 묻는다", hint: "늦어도 묻는 게 낫다", check: { stat: "bond", against: 38 },
            personality: { freedom: 4, empathy: 4 }, mark: "chose_truth",
            outcomes: {
              great: { text: "양육자는 마침내 모든 걸 말했다. 다 듣고 난 {name}이 그래도 내 양육자라고 하자, 양육자는 처음으로 웃으며 자신의 옛 이름을 소리 내어 불렀다.", effects: { bond: 10, skill: 1 } },
              good: { text: "양육자는 절반만 말했다. 나머지 절반은 네가 어른이 되면 하겠다고. {name}은 그 약속이 수배서보다 무겁다는 걸 알았다.", effects: { bond: 5 } },
              bad: { text: "양육자는 대답 대신 짐을 쌌다가 다시 풀었다. 그 밤 이후 집에는 웃음이 줄었고, {name}은 묻지 말았어야 했나 오래 생각했다.", effects: { bond: -5, health: -2 } }
            } },
          { id: "guard_board", label: "몰래 수배서의 이름 칸을 지운다", hint: "작은 거짓의 무게", check: { stat: "skill", against: 35 },
            personality: { loyalty: 6, caution: 3 }, mark: "sided_guardian",
            outcomes: {
              great: { text: "숯을 녹인 물로 리안이라는 글자만 감쪽같이 번지게 했다. 다음 날 그것을 본 양육자가 게시판 앞에서 한참 서 있다가, 집에 와서 {name}의 머리를 말없이 쓰다듬었다.", effects: { skill: 7, bond: 4 } },
              good: { text: "이름은 지웠지만 손에 묻은 숯이 사흘을 갔다. 장터 아이들이 굴뚝 청소부라고 놀렸지만 {name}은 웃어넘겼다.", effects: { skill: 3, trust: -1, bond: 2 } },
              bad: { text: "지우는 걸 장터 관리인에게 들켰다. 왜 하필 그 이름이냐는 질문에 대답을 못 하자, 관리인은 오히려 그 이름을 수첩에 적어 두었다.", effects: { trust: -6, bond: -1 }, mark: "rumor" }
            } }
        ] },

      { step: 4, id: "echo_far", age: 30, art: "legacy", requires: ["guardian_fled", "guardian_taken"], title: "수평선 너머의 소식",
        body: "어느 항구 신문 귀퉁이에 리안이라는 이름이 실렸다. 오래전 잡혀갔다고도, 바다로 사라졌다고도 하던 해적단 일원이 먼 바다의 작은 섬에서 노예선 생존자들과 함께 살고 있다는 짧은 기사였다. 기사 끝에 그 섬으로 가는 우편선 이름이 적혀 있었다.",
        choices: [
          { id: "write", label: "우편선에 편지를 실어 보낸다", hint: "닿기만 한다면", check: { stat: "bond", against: 35 },
            personality: { loyalty: 6, empathy: 3 },
            outcomes: {
              great: { text: "몇 달 뒤 돌아온 답장에는 떨리는 글씨로 {name}의 이름이 적혀 있었다. 네가 그 밤에 한 일 덕분에 이 섬이 있다고, 이제 리안이라는 이름이 부끄럽지 않다고.", effects: { bond: 10, trust: 2 } },
              good: { text: "답장은 짧았다. 잘 지낸다는 한 줄과 서툴게 그린 등대 그림 하나. {name}은 그것을 오래 품에 지니고 다녔다.", effects: { bond: 5 } },
              bad: { text: "편지는 수취인 불명으로 돌아왔다. 봉투 뒷면에 누군가 연필로 그 섬은 지난겨울 해군이 비웠다고 적어 두었다.", effects: { bond: -3, health: -2 } }
            } },
          { id: "go_see", label: "직접 그 섬으로 간다", hint: "얼굴을 보고 싶다", check: { stat: "supplies", against: 40 },
            personality: { freedom: 7, loyalty: 3 },
            outcomes: {
              great: { text: "작은 부두에서 그물을 깁던 노인이 고개를 들었다. 둘은 아무 말 없이 한참 서 있다가, 노인이 먼저 밥은 먹었냐고 물었다. 그 섬에서 보낸 사흘은 어린 시절 어느 날보다 길었다.", effects: { bond: 12, supplies: -2 } },
              good: { text: "뱃삯을 마련하느라 몇 해가 걸렸다. 그래도 섬에 닿았을 때 양육자는 아직 그곳에 있었고, 손을 잡은 채 짧은 저녁을 함께 먹었다.", effects: { bond: 6, supplies: -4 } },
              bad: { text: "가는 길에 배가 폭풍에 밀려 다른 섬에 닿았다. 겨우 도착했을 때 양육자는 이미 다른 곳으로 떠난 뒤였고, 문 앞에 {name}의 이름이 새겨진 매듭 하나만 걸려 있었다.", effects: { supplies: -6, bond: 2 } }
            } }
        ] },
      { step: 4, id: "echo_home", age: 30, art: "harbor", requires: ["town_shielded"], title: "섬이 지킨 이름",
        body: "어느 항구 선술집에서 늙은 해군 하나가 술에 취해 옛 이야기를 했다. 젊은 시절 어떤 섬에서 수배범 하나를 놓쳤는데, 섬사람 전부가 입을 맞춰 거짓말을 했다고. 노인이 말한 부두와 언덕은 틀림없이 {home}의 것이었다. 노인의 눈이 {name}의 얼굴에 머물렀다.",
        choices: [
          { id: "own_it", label: "그 섬 사람이 바로 나라고 말한다", hint: "이제는 숨길 것 없다", check: { stat: "trust", against: 36 },
            personality: { freedom: 5, loyalty: 4 },
            outcomes: {
              great: { text: "노인은 껄껄 웃으며 잔을 내밀었다. 그날 놓친 게 평생 잘한 일 중 하나였다고, 그 섬 사람들에게 미안하다는 말을 전해 달라고 했다.", effects: { trust: 9, bond: 3 } },
              good: { text: "노인은 잠시 굳었다가 어깨를 으쓱했다. 이제 다 지난 일이라며 술값을 반씩 내자고 했다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "노인의 젊은 부하가 그 말을 듣고 수첩을 꺼냈다. 노인이 말렸지만, 그 항구에서는 한동안 {name}의 뒤를 밟는 발소리가 들렸다.", effects: { trust: -5, health: -2 } }
            } },
          { id: "smile", label: "웃으며 처음 듣는 섬이라고 한다", hint: "섬이 그랬던 것처럼", check: { stat: "skill", against: 32 },
            personality: { caution: 6, loyalty: 4 },
            outcomes: {
              great: { text: "노인은 {name}의 눈을 오래 보다가 피식 웃었다. 그 섬 사람들은 다 그렇게 웃더라고. 노인은 다음 잔을 샀고, 둘은 끝까지 다른 이야기만 했다.", effects: { skill: 6, trust: 4 } },
              good: { text: "노인은 고개를 끄덕이고 다른 손님에게로 갔다. 고향의 거짓말을 한 번 더 지켰다는 생각에 {name}은 그날 밤 쉽게 잠들었다.", effects: { skill: 3, bond: 2 } },
              bad: { text: "웃음이 너무 어색해서 옆자리 손님까지 돌아보았다. 노인은 아무 말도 하지 않았지만, 그 표정이 오래 마음에 걸렸다.", effects: { trust: -3, health: -1 } }
            } }
        ] },
      { step: 4, id: "echo_knot", age: 30, art: "deck", title: "매듭을 알아본 사람",
        body: "어느 항구에서 {name}이 밧줄을 묶고 있을 때, 지나가던 늙은 선원이 걸음을 멈췄다. 그 매듭은 리안만 쓰던 거라고, 어디서 배웠냐고 떨리는 목소리로 물었다. 늙은 선원은 오래전 노예선에서 풀려난 사람 중 하나였다.",
        choices: [
          { id: "tell_all", label: "양육자의 이야기를 들려준다", hint: "이제는 말해도 될까", check: { stat: "bond", against: 34 },
            personality: { empathy: 6, freedom: 2 },
            outcomes: {
              great: { text: "늙은 선원은 이야기를 듣다 울다 웃었다. 그리고 리안에게 전해 달라며 자기 배의 이름을 알려 주었다. 그 배는 지금도 풀려난 사람들을 실어 나르고 있었다.", effects: { bond: 8, trust: 4 } },
              good: { text: "늙은 선원은 고맙다며 말린 생선 한 꾸러미를 안겨 주었다. 그 생선 맛은 어린 시절 양육자가 굽던 것과 똑같았다.", effects: { bond: 4, supplies: 2 } },
              bad: { text: "이야기를 꺼내던 중 옆에서 현상금 사냥꾼처럼 보이는 자가 귀를 기울였다. {name}은 황급히 말을 끊었고, 늙은 선원은 실망한 얼굴로 떠났다.", effects: { bond: -2, trust: -3 } }
            } },
          { id: "keep_name", label: "모른다고 하고 매듭만 풀어 보인다", hint: "이름은 접어 둔 채로", check: { stat: "skill", against: 30 },
            personality: { caution: 6, loyalty: 4 },
            outcomes: {
              great: { text: "매듭을 풀었다 다시 묶는 손을 보며 늙은 선원은 다 알았다는 듯 고개를 끄덕였다. 이름은 묻지 않겠다고, 그 손이면 충분하다고 했다.", effects: { skill: 6, bond: 4 } },
              good: { text: "늙은 선원은 아쉬워하며 돌아섰다. {name}은 그날 밤 양육자에게 보낼 편지에 그 선원 이야기를 적었다가, 몇 번이나 지웠다.", effects: { skill: 3, bond: 2 } },
              bad: { text: "매듭이 손에서 엉켜 엉망이 되었다. 늙은 선원은 리안의 아이는 아니구먼, 하고 떠났고 {name}은 엉킨 밧줄 앞에서 어쩐지 서운했다.", effects: { skill: -2, bond: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "plague_winter", title: "기침이 번진 겨울",
    legacy: {
      default: "한 사람의 기침 소리에도 걸음을 멈추는 버릇이 그 겨울에 생겼다.",
      doctor_freed: "모두가 손가락질한 사람의 문을 두드린 기억이, 평생 남의 말보다 자기 눈을 믿게 했다.",
      fair_share: "약 한 상자를 공평하게 나누던 손이, 어른이 된 뒤에도 몫을 세는 기준이 되었다.",
      ship_guided: "눈보라 속에 등대 불을 지킨 밤 이후로 어둠 속의 불빛을 결코 가볍게 보지 않았다.",
      smuggle_run: "규칙을 어기고 약을 날랐던 겨울이, 법과 옳음이 다를 수 있다는 걸 가르쳤다."
    },
    chapters: [
      { step: 1, id: "cough", age: 8, art: "childClinic", title: "회색 기침",
        body: "그해 겨울 {home}에 회색 기침이 번졌다. 해군은 섬 출입을 막았고, 약재상 고르반은 약값을 날마다 올렸다. 양육자마저 밤새 기침을 하던 새벽, {name}은 어른들이 수군대던 세 가지 이름을 떠올렸다. 등대 아래 쫓겨난 의사, 밤의 밀수꾼, 그리고 고르반의 창고.",
        choices: [
          { id: "doctor", label: "등대 아래 쫓겨난 의사를 찾아간다", hint: "모두가 피하는 집", check: { stat: "health", against: 32 },
            personality: { empathy: 5, freedom: 4 }, mark: "met_doctor",
            outcomes: {
              great: { text: "눈길을 헤치고 찾아간 오두막의 의사 하넬은 {name}의 얼굴을 보자마자 약초 꾸러미를 싸 주었다. 이 섬이 십 년 전 누명을 씌운 사람이라는 건 나중에야 알았다.", effects: { health: 3, bond: 6 }, mark: "doctor_trust" },
              good: { text: "하넬은 문을 반만 열고 약초 이름 세 개를 알려 주었다. 그것을 찾느라 언덕을 다 뒤졌지만, 양육자의 기침은 조금씩 잦아들었다.", effects: { bond: 4, health: -1 } },
              bad: { text: "눈보라에 길을 잃고 등대 아래 바위틈에서 밤을 지새웠다. 새벽에 {name}을 발견해 업고 간 사람이 하넬이었고, 이번엔 {name}이 기침을 시작했다.", effects: { health: -9, bond: 1 } }
            } },
          { id: "work", label: "고르반의 약재상에서 일하고 약을 얻는다", hint: "정직한 거래", check: { stat: "supplies", against: 30 },
            personality: { loyalty: 4, caution: 4 }, mark: "gorban_debt",
            outcomes: {
              great: { text: "약재 상자를 나르다 창고 뒤편에 해열제가 산처럼 쌓여 있는 걸 보았다. 고르반은 없다고 장터에 말한 약이었다. {name}은 받은 약 한 봉지를 들고 그 산을 오래 생각했다.", effects: { supplies: 5, skill: 3 }, mark: "saw_hoard" },
              good: { text: "닷새를 일하고 해열제 반 봉지를 받았다. 손등이 터서 피가 났지만 양육자는 그 약으로 겨우 열을 내렸다.", effects: { supplies: 3, health: -1, bond: 2 } },
              bad: { text: "고르반은 일을 시키고 나서 약값이 또 올랐다며 빈손으로 돌려보냈다. 따지려 하자 아이 말을 누가 믿냐며 문을 닫았다.", effects: { supplies: -5, trust: -2 } }
            } },
          { id: "smuggler", label: "밤의 작은 만에서 밀수꾼을 기다린다", hint: "위험한 거래", check: { stat: "skill", against: 35 },
            personality: { ambition: 5, freedom: 5 }, mark: "met_smuggler",
            outcomes: {
              great: { text: "검은 쪽배에서 내린 밀수꾼 제비는 아이를 보고 혀를 찼다. 그래도 {name}이 해군 순찰 시간을 정확히 외우고 있다는 걸 알자, 약 한 병을 외상으로 내주었다.", effects: { supplies: 6, skill: 3 }, mark: "saw_hoard" },
              good: { text: "제비는 약 한 병과 바꾸는 값으로 양육자의 낡은 나침반을 받아 갔다. 양육자는 나중에 그걸 알고 아무 말 없이 {name}의 손을 잡았다.", effects: { supplies: 2, bond: 3 } },
              bad: { text: "기다리던 쪽배 대신 해군 순찰선의 불빛이 다가왔다. 바위 뒤에 숨어 밤을 새운 {name}은 빈손으로 돌아와 열이 올랐다.", effects: { health: -7, supplies: -1 } }
            } }
        ] },

      { step: 2, id: "smuggle", age: 9, art: "childInlet", requires: ["met_smuggler", "saw_hoard"], title: "제비의 부탁",
        body: "기침은 더 번졌다. 밀수꾼 제비는 해군 봉쇄선 바깥에 약 상자를 숨겨 두었지만 어른 얼굴로는 부두를 지날 수 없었다. 아이 하나면 생선 바구니에 약을 숨겨 지나갈 수 있다고 했다. 그 무렵 고르반의 창고에는 밤마다 자물쇠가 하나씩 늘었다.",
        choices: [
          { id: "carry", label: "생선 바구니에 약을 숨겨 나른다", hint: "들키면 감옥", check: { stat: "health", against: 38 },
            personality: { freedom: 6, empathy: 4 }, mark: "smuggle_run",
            outcomes: {
              great: { text: "검문하던 해군이 생선 냄새에 코를 막는 사이 {name}은 바구니를 흔들며 지나갔다. 그 겨울 바구니에 실려 간 약으로 골목 세 곳의 기침이 멎었다.", effects: { trust: 8, health: 2 } },
              good: { text: "약은 무사히 전했지만 바구니를 지고 언덕을 오르내린 탓에 열이 올랐다. 제비는 말없이 자기 몫의 약 한 병을 {name}의 집 앞에 두고 갔다.", effects: { trust: 4, health: -3, supplies: 2 } },
              bad: { text: "바구니 밑이 빠지며 약병이 해군 발치에 굴렀다. {name}은 하룻밤을 해군 초소에 갇혔고, 양육자가 빚을 내서 벌금을 물었다.", effects: { supplies: -7, bond: -2, trust: -2 }, mark: "caught_marine" }
            } },
          { id: "expose", label: "고르반의 창고를 장터에 폭로한다", hint: "증거가 필요하다", check: { stat: "skill", against: 38 },
            personality: { freedom: 5, ambition: 3 }, mark: "hoard_exposed",
            outcomes: {
              great: { text: "창고 환기창으로 들어가 해열제 상자 하나를 장터 한복판에 끌어다 놓았다. 상자 옆면에 찍힌 고르반의 인장을 본 어른들의 얼굴이 하나씩 붉어졌다.", effects: { trust: 8, skill: 3 } },
              good: { text: "약병 하나를 증거로 들고 나왔지만 고르반은 남은 재고라고 우겼다. 그래도 장터에 의심의 씨앗은 확실히 뿌려졌다.", effects: { trust: 4, skill: 2 } },
              bad: { text: "환기창에 끼어 꼼짝 못 하는 걸 고르반이 발견했다. 고르반은 도둑을 잡았다며 장터에 {name}을 세워 두었고, 창고 이야기는 아무도 믿지 않았다.", effects: { trust: -7, health: -3 }, mark: "gorban_enemy" }
            } },
          { id: "refuse", label: "밀수는 거절하고 이웃들과 나눌 방법을 찾는다", hint: "법 안에서", check: { stat: "trust", against: 35 },
            personality: { caution: 6, loyalty: 3 },
            outcomes: {
              great: { text: "{name}의 말에 이웃들이 남은 약을 한데 모아 공동 치료실을 열었다. 고르반도 장터의 눈을 피하지 못하고 상자 몇 개를 내놓아야 했다.", effects: { trust: 8, bond: 2 }, mark: "hoard_exposed" },
              good: { text: "몇몇 집이 약을 나눠 쓰기로 했다. 충분하진 않았지만 가장 아픈 집부터 차례를 정하는 법을 그해 겨울 처음 배웠다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "어른들은 아이 말에 고개만 끄덕였고 아무도 자기 약을 내놓지 않았다. 거절당한 제비는 다른 섬으로 떠났고 약은 더 귀해졌다.", effects: { trust: -3, supplies: -4 } }
            } }
        ] },
      { step: 2, id: "root", age: 9, art: "childLantern", requires: ["met_doctor"], title: "봉쇄선 너머의 뿌리",
        body: "하넬은 회색 기침을 멎게 할 약을 알고 있었다. 다만 그 약초 뿌리는 해군이 막아 둔 언덕 너머 옛 묘지에서만 자랐다. 쫓겨난 의사가 봉쇄선을 넘었다간 그대로 끌려갈 터였다. 하넬은 {name}에게 낡은 삽과 뿌리 그림을 건넸다.",
        choices: [
          { id: "sneak", label: "보초 교대 시간에 몰래 넘어간다", hint: "발소리를 죽이고", check: { stat: "skill", against: 38 },
            personality: { freedom: 6, ambition: 2 }, mark: "line_crossed",
            outcomes: {
              great: { text: "보초가 교대하는 틈에 묘지로 들어가 뿌리를 한 바구니 캐 왔다. 하넬은 그 뿌리로 밤새 약을 달였고, 이튿날 아침 골목마다 기침 소리가 줄어들었다.", effects: { skill: 8, trust: 4 }, mark: "doctor_trust" },
              good: { text: "뿌리를 한 줌 캐 오는 데 성공했지만 돌아오는 길에 보초의 등불을 피하다 개울에 빠졌다. 흠뻑 젖은 채 하넬의 오두막 문을 두드렸다.", effects: { skill: 4, health: -3 } },
              bad: { text: "묘지 울타리를 넘다 보초에게 뒷덜미를 잡혔다. 누가 시켰냐는 추궁에 {name}은 끝까지 입을 다물었지만, 삽에 새겨진 하넬의 이름이 대신 말해 버렸다.", effects: { health: -4, trust: -4 }, mark: "caught_marine" }
            } },
          { id: "ask_sentry", label: "보초에게 사정을 정직하게 말한다", hint: "해군도 사람이다", check: { stat: "trust", against: 36 },
            personality: { empathy: 5, caution: 3 }, mark: "sentry_friend",
            outcomes: {
              great: { text: "젊은 보초 펠린은 고향의 동생 이야기를 꺼내며 등불을 들어 주었다. 둘이 함께 캐 온 뿌리는 하넬의 오두막에서 약이 되었고, 펠린은 그 뒤로 몰래 하넬에게 소금을 날라 주었다.", effects: { trust: 8, friendBond: 3 }, mark: "line_crossed" },
              good: { text: "보초는 규칙은 규칙이라며 막았다. 대신 다음 날 아침 묘지 쪽 울타리 문이 우연히 열려 있었다.", effects: { trust: 4 }, mark: "line_crossed" },
              bad: { text: "보초는 쫓겨난 의사의 심부름이라는 말에 얼굴을 굳혔다. 그날 밤 해군이 하넬의 오두막을 뒤졌고, 약초 단지들이 눈밭에 깨져 흩어졌다.", effects: { trust: -5, bond: -2 }, mark: "caught_marine" }
            } }
        ] },
      { step: 2, id: "friend_sick", age: 9, art: "childClinic", title: "누리의 빈자리",
        body: "단짝 누리가 장터에 나오지 않은 지 사흘째였다. 누리네 집 문에는 해군이 붙인 붉은 천이 걸려 있었다. 들어가지 말라는 표시였다. 창문 너머로 누리가 기침을 하며 손을 흔들었고, 집 안엔 약도 장작도 떨어져 보였다.",
        choices: [
          { id: "sit_by", label: "붉은 천을 무시하고 들어가 곁을 지킨다", hint: "옮을지라도", check: { stat: "health", against: 40 },
            personality: { empathy: 8, loyalty: 3 }, mark: "nursed_friend",
            outcomes: {
              great: { text: "{name}은 장작을 패고 물을 끓이며 누리 곁을 지켰다. 누리는 열이 내리던 밤에 너 바보지 하고 웃었고, 신기하게도 {name}은 끝내 기침 한 번 하지 않았다.", effects: { friendBond: 10, health: 1 } },
              good: { text: "누리는 나았지만 {name}이 대신 앓아누웠다. 이번엔 누리가 붉은 천을 무시하고 들어와 이상한 맛의 죽을 끓여 주었다.", effects: { friendBond: 7, health: -5 } },
              bad: { text: "들어간 지 이틀 만에 {name}도 쓰러졌다. 두 집 모두 붉은 천이 걸렸고 양육자까지 문밖에서 발을 동동 굴렀다. 누리는 미안하다고 울었다.", effects: { health: -10, friendBond: 4, bond: -2 } }
            } },
          { id: "signal", label: "등대에서 지나가는 배에 불빛 신호를 보낸다", hint: "바다 너머의 도움", check: { stat: "skill", against: 38 },
            personality: { freedom: 5, ambition: 4 }, mark: "signal_ship",
            outcomes: {
              great: { text: "등불을 가렸다 열었다 하며 밤새 신호를 보냈다. 새벽녘 먼바다의 상선 하나가 답 불빛을 보냈고, 봉쇄선 바깥에 약 상자를 띄워 보내 주었다.", effects: { skill: 8, trust: 4, supplies: 2 } },
              good: { text: "신호에 답한 배는 없었지만, 등대지기가 {name}의 끈기에 감동해 자기 약을 누리네 창문 앞에 두고 왔다.", effects: { skill: 4, friendBond: 3 } },
              bad: { text: "엉뚱한 신호가 해적 깃발을 단 배를 불러들였다. 해적들은 섬에 병이 돈다는 말에 혼비백산해 도망쳤지만, 해군은 등대 불을 함부로 다룬 아이를 찾아다녔다.", effects: { trust: -5, health: -2 }, mark: "caught_marine" }
            } },
          { id: "beg_gorban", label: "고르반에게 무릎 꿇고 약을 부탁한다", hint: "자존심보다 친구", check: { stat: "supplies", against: 36 },
            personality: { loyalty: 6, ambition: -3 }, mark: "gorban_debt",
            outcomes: {
              great: { text: "고르반은 비웃다가 {name}이 내민 저금통을 보고 표정이 변했다. 동전 대신 약을 한 봉지 더 얹어 주며, 남의 애 앞에서 자기가 부끄럽다고 중얼거렸다.", effects: { supplies: 4, friendBond: 6 }, mark: "spared_gorban" },
              good: { text: "모아 둔 돈을 전부 주고 약 한 봉지를 얻었다. 누리는 나았고 {name}의 저금통은 비었다.", effects: { supplies: -3, friendBond: 7 } },
              bad: { text: "고르반은 돈만 받고 반쯤 빈 약봉지를 내주었다. 누리는 겨울 끝까지 앓았고, {name}은 처음으로 어른을 미워하는 법을 배웠다.", effects: { supplies: -6, friendBond: 2 }, mark: "gorban_enemy" }
            } }
        ] },

      { step: 3, id: "riot", age: 11, art: "childFestival", requires: ["hoard_exposed", "gorban_enemy"], title: "창고 앞의 횃불",
        body: "두 번째 겨울, 기침이 다시 번지자 사람들의 인내가 끊어졌다. 횃불을 든 이웃들이 고르반의 창고를 에워쌌다. 창고 안에서 고르반이 떨리는 손으로 문빗장을 붙들고 있었고, 누군가 기름통을 들고 앞으로 나섰다. {name}은 그 앞에 서 있었다.",
        choices: [
          { id: "fair", label: "상자를 집집마다 나눌 명부를 만든다", hint: "분노를 질서로", check: { stat: "trust", against: 42 },
            personality: { loyalty: 4, caution: 4, empathy: 3 }, mark: "fair_share",
            outcomes: {
              great: { text: "{name}이 장터 칠판에 아픈 사람 순서대로 이름을 적기 시작하자 횃불이 하나씩 내려갔다. 그날 밤 약은 가장 아픈 집부터 차례로 돌았고, 단 한 상자도 남거나 모자라지 않았다.", effects: { trust: 12, skill: 2 } },
              good: { text: "명부는 몇 번이나 고쳐 써야 했고 다투는 소리도 끊이지 않았다. 그래도 창고는 불타지 않았고, 약은 새벽까지 거의 모든 집에 돌았다.", effects: { trust: 6, health: -1 } },
              bad: { text: "명부를 만드는 사이 힘센 어른들이 상자를 먼저 들고 갔다. 정작 아픈 노인들 집에는 빈 상자만 남았고, 그 장면을 {name}은 오래 잊지 못했다.", effects: { trust: -4, health: -2 } }
            } },
          { id: "shield", label: "고르반 앞을 막아서서 횃불을 내리게 한다", hint: "미운 사람이라도", check: { stat: "health", against: 40 },
            personality: { empathy: 7, caution: 2 }, mark: "spared_gorban",
            outcomes: {
              great: { text: "아이 하나가 팔을 벌리고 서자 횃불들이 멈췄다. 창고 안에서 그 모습을 본 고르반은 스스로 문을 열고, 상자를 하나씩 들고 나와 이웃들 앞에 내려놓았다.", effects: { trust: 9, health: -1 }, mark: "fair_share" },
              good: { text: "{name}이 버티는 사이 어른 몇이 정신을 차렸다. 창고는 무사했지만 누군가 던진 돌에 {name}의 어깨가 멍들었다.", effects: { trust: 5, health: -4 } },
              bad: { text: "밀치는 사람들 사이에서 {name}이 넘어졌고, 그 소란에 횃불 하나가 창고 지붕으로 날아갔다. 불은 꺼졌지만 약 상자의 절반이 재가 되었다.", effects: { health: -7, supplies: -4 } }
            } },
          { id: "grab", label: "혼란을 틈타 집에 가져갈 상자를 챙긴다", hint: "우리 집이 먼저", check: { stat: "skill", against: 36 },
            personality: { ambition: 7, empathy: -5 },
            outcomes: {
              great: { text: "상자를 들고 골목을 빠져나가다 기침하는 노인과 눈이 마주쳤다. {name}은 그 자리에서 상자를 열어 노인 몫을 덜어 주었고, 남은 것으로도 집안의 겨울은 충분했다.", effects: { supplies: 8, trust: 3 } },
              good: { text: "약 상자 하나를 집으로 가져왔다. 양육자는 그 상자를 오래 보다가 절반을 옆집으로 보냈고, {name}은 왜인지 안도했다.", effects: { supplies: 4, bond: 1 } },
              bad: { text: "상자를 안고 뛰다가 고르반의 하인과 정면으로 부딪쳤다. 도둑이라는 고함 속에 상자는 빼앗겼고, 장터 사람들은 {name}을 다르게 보기 시작했다.", effects: { trust: -8, health: -2 } }
            } }
        ] },
      { step: 3, id: "trial", age: 11, art: "dangerPrison", requires: ["caught_marine", "line_crossed", "doctor_trust"], title: "의사를 위한 재판",
        body: "기침이 다시 돌던 이듬해, 마을 원로들은 쫓겨난 의사 하넬을 해군에 넘기기로 했다. 봉쇄선 너머 묘지를 들쑤셔 병을 불렀다는 이유였다. 장터에 차려진 임시 재판석에서 해군 대위는 증인을 불렀고, 하넬은 묶인 손으로 군중을 둘러보며 고개를 저었다. 아무도 나서지 말라는 뜻이었다.",
        choices: [
          { id: "testify", label: "하넬은 죄가 없다고 증언한다", hint: "진실은 비싸다", check: { stat: "trust", against: 42 },
            personality: { loyalty: 6, freedom: 4 }, mark: "doctor_freed",
            outcomes: {
              great: { text: "{name}은 하넬의 약으로 기침이 멎은 집들의 이름을 하나씩 댔다. 이름이 불린 집 사람들이 차례로 일어섰고, 해군 대위는 결국 하넬의 밧줄을 풀라고 명령했다.", effects: { trust: 11, bond: 2 } },
              good: { text: "증언 덕에 하넬은 풀려났지만 섬을 떠나라는 판결을 받았다. 떠나는 배에서 하넬은 {name}에게 손으로 쓴 약초 책을 던져 주었다.", effects: { trust: 5, skill: 4 } },
              bad: { text: "아이의 증언을 귀담아듣는 사람은 없었다. 하넬은 끌려갔고, {name}의 양육자는 아이 단속을 못 했다며 벌금을 물고 한동안 장터에 얼굴을 들지 못했다.", effects: { trust: -6, bond: -4 }, mark: "doctor_exiled" }
            } },
          { id: "patients", label: "하넬이 살린 사람들을 데리고 온다", hint: "말보다 얼굴", check: { stat: "friendBond", against: 38 },
            personality: { empathy: 6, loyalty: 3 },
            outcomes: {
              great: { text: "{name}이 집집마다 문을 두드리자 기침이 멎은 아이들과 노인들이 줄지어 장터로 나왔다. 그 줄이 재판석을 한 바퀴 감자 원로들은 말을 잃었고, 하넬은 그 자리에서 풀려났다.", effects: { trust: 9, friendBond: 4 }, mark: "doctor_freed" },
              good: { text: "몇 사람만 나섰지만 충분했다. 하넬은 풀려났고, 장터 사람들은 쫓겨난 의사를 다시 의사라고 부르기 시작했다.", effects: { trust: 5, friendBond: 2 }, mark: "doctor_freed" },
              bad: { text: "다들 해군 눈치를 보며 문을 닫았다. 빈손으로 돌아온 {name}이 재판석에 닿았을 때 하넬은 이미 순찰선에 실린 뒤였다.", effects: { trust: -4, friendBond: -3 }, mark: "doctor_exiled" }
            } },
          { id: "break_out", label: "밤에 초소 창살을 끊어 빼낸다", hint: "법보다 사람", check: { stat: "skill", against: 44 },
            personality: { freedom: 8, caution: -4 }, mark: "smuggle_run",
            outcomes: {
              great: { text: "줄칼로 창살을 끊고 하넬을 밀수꾼의 쪽배까지 데려갔다. 하넬은 떠나기 전 약초 책을 쥐여 주며, 이 섬에 다음 의사가 필요할 거라고 했다. 그 뒤로 해군은 범인을 끝내 찾지 못했다.", effects: { skill: 9, trust: 1 }, mark: "doctor_freed" },
              good: { text: "하넬은 빠져나갔지만 {name}의 신발 한 짝이 초소 앞에 남았다. 해군은 그 신발을 들고 섬을 돌았고, 양육자는 아무 말 없이 그 신발을 태웠다.", effects: { skill: 5, bond: 2, trust: -2 }, mark: "doctor_freed" },
              bad: { text: "줄칼이 미끄러지는 소리에 보초가 달려왔다. 하넬은 {name}을 감싸며 자기가 시켰다고 말했고, 그 거짓말로 죄가 하나 더 늘었다.", effects: { health: -4, trust: -4, bond: -2 }, mark: "doctor_exiled" }
            } }
        ] },
      { step: 3, id: "medicine_ship", age: 11, art: "storm", title: "눈보라 속의 약선",
        body: "두 번째 겨울 끝자락, 다른 섬에서 약을 실은 배가 온다는 전보벌레 소식이 들어왔다. 그날 밤 눈보라가 몰아쳤고 등대지기가 기침으로 쓰러졌다. 암초 너머에서 약선의 뱃고동이 길을 잃은 듯 길게 울리고 있었다.",
        choices: [
          { id: "light", label: "등대 꼭대기로 올라가 불을 지킨다", hint: "얼어붙은 계단", check: { stat: "health", against: 40 },
            personality: { loyalty: 5, empathy: 4 }, mark: "ship_guided",
            outcomes: {
              great: { text: "꺼져 가던 등불에 기름을 붓고 밤새 거울을 돌렸다. 새벽녘 약선이 암초 사이 물길로 들어섰고, 갑판의 선원들이 등대를 향해 모자를 흔들었다.", effects: { trust: 10, health: -2 } },
              good: { text: "불은 지켰지만 손끝이 얼어 한동안 숟가락을 쥐기 힘들었다. 약선은 무사히 들어왔고, 첫 약봉지는 등대지기와 {name}의 집으로 갔다.", effects: { trust: 6, health: -4, supplies: 2 } },
              bad: { text: "언 계단에서 미끄러져 굴러떨어졌다. 등불은 끝내 꺼졌고 약선은 암초에 긁힌 채 아침에야 겨우 들어왔다. 약 상자의 절반이 바닷물에 젖었다.", effects: { health: -9, supplies: -2 } }
            } },
          { id: "bonfire", label: "아이들을 모아 해변에 모닥불 길을 낸다", hint: "혼자가 아니라면", check: { stat: "friendBond", against: 36 },
            personality: { freedom: 4, empathy: 4 },
            outcomes: {
              great: { text: "골목 아이들이 장작과 헌 그물을 들고 나왔다. 해변을 따라 늘어선 모닥불이 물길을 그렸고, 약선은 그 불빛을 따라 들어왔다. 그날 밤 아이들은 섬의 영웅이 되었다.", effects: { friendBond: 9, trust: 4 }, mark: "ship_guided" },
              good: { text: "모닥불 절반은 눈보라에 꺼졌지만 나머지가 버텼다. 약선은 비틀거리며 들어왔고, 아이들은 그을린 얼굴로 서로를 보며 웃었다.", effects: { friendBond: 5, health: -2 }, mark: "ship_guided" },
              bad: { text: "모은 장작이 젖어 연기만 피어올랐다. 연기 속에서 기침을 하던 아이들은 결국 어른들에게 끌려 집으로 돌아갔고, 약선은 다음 날 오후에야 닿았다.", effects: { health: -5, friendBond: -2 } }
            } }
        ] },

      { step: 4, id: "echo_doctor", age: 28, art: "childClinic", requires: ["doctor_freed", "doctor_exiled"], title: "약초 책의 여백",
        body: "어느 항구 약방에서 {name}은 손때 묻은 약초 책을 보았다. 하넬의 글씨였다. 회색 기침을 멎게 하는 처방이 적힌 쪽 여백에 작은 글씨로 {home}에서 보낸 겨울과 그곳 아이들의 이야기가 적혀 있었다. 약방 주인은 그 처방으로 이 항구의 겨울을 넘겼다고 했다.",
        choices: [
          { id: "find_hanel", label: "하넬의 행방을 수소문한다", hint: "그 겨울의 빚", check: { stat: "trust", against: 36 },
            personality: { loyalty: 6, empathy: 3 },
            outcomes: {
              great: { text: "하넬은 두 섬 건너 작은 치료소에 있었다. 백발이 된 의사는 {name}을 단번에 알아보고, 그 겨울 이후 한 번도 문을 잠근 적이 없다고 웃었다.", effects: { trust: 8, bond: 3 } },
              good: { text: "직접 만나지는 못했지만 하넬에게 편지를 맡겼다. 답장 대신 그 항구 약방에 {name}의 이름으로 약 값이 미리 치러져 있었다.", effects: { trust: 4, supplies: 3 } },
              bad: { text: "하넬이 지난겨울 세상을 떠났다는 소식만 들었다. {name}은 약방 주인에게 책을 잘 지켜 달라고 부탁하고 오래 그 앞을 떠나지 못했다.", effects: { bond: -2, health: -2 } }
            } },
          { id: "copy_book", label: "처방을 베껴 다른 항구에 퍼뜨린다", hint: "약은 나눌수록", check: { stat: "skill", against: 34 },
            personality: { freedom: 5, empathy: 5 },
            outcomes: {
              great: { text: "베낀 처방은 항구에서 항구로 건너갔고, 이듬해 겨울 회색 기침이 번진 섬 세 곳이 그 쪽지로 버텼다. 쪽지 끝에는 늘 하넬의 이름이 먼저 적혀 있었다.", effects: { trust: 9, skill: 3 } },
              good: { text: "베낀 처방을 아는 약방 몇 곳에 맡겼다. 얼마나 퍼졌는지는 몰라도, 바다 어딘가에서 누군가는 그 쪽지로 기침을 멈췄을 것이다.", effects: { trust: 4, skill: 2 } },
              bad: { text: "서두르다 약초 이름 하나를 잘못 옮겨 적었다. 그 쪽지를 받은 약방에서 항의 편지가 왔고, {name}은 바다를 건너가 사과해야 했다.", effects: { trust: -4, supplies: -3 } }
            } }
        ] },
      { step: 4, id: "echo_gorban", age: 28, art: "legacy", requires: ["spared_gorban", "fair_share"], title: "약재상의 마지막 편지",
        body: "늙은 고르반에게서 편지가 왔다. 그 겨울 자기 앞에 섰던 아이를 잊지 못했다고, 남은 재산으로 {home}에 치료실을 짓고 싶은데 누구 손에 맡길지 정해 달라고 했다. 봉투 안에는 약재상 창고 열쇠가 들어 있었다.",
        choices: [
          { id: "accept", label: "열쇠를 받고 치료실을 맡을 사람을 고른다", hint: "공평한 눈으로", check: { stat: "trust", against: 38 },
            personality: { loyalty: 5, caution: 3 },
            outcomes: {
              great: { text: "{name}은 그 겨울 가장 오래 앓았던 집의 아이, 이제는 의원이 된 이웃에게 치료실을 맡겼다. 문 위 현판에는 고르반의 이름 대신 기침이 번진 겨울이라는 글씨가 새겨졌다.", effects: { trust: 10, friendBond: 3 } },
              good: { text: "치료실은 지어졌지만 누가 맡을지를 두고 섬 사람들이 한동안 다퉜다. 결국 순번을 정하는 명부가 다시 만들어졌다.", effects: { trust: 5, supplies: -1 } },
              bad: { text: "열쇠를 둘러싸고 고르반의 친척들이 소송을 걸었다. 치료실은 몇 해 늦어졌고, {name}은 바다 건너에서 편지로만 다툼을 지켜보았다.", effects: { trust: -4, supplies: -3 } }
            } },
          { id: "return_key", label: "열쇠를 돌려보내며 직접 하라고 답한다", hint: "용서는 대신 못 한다", check: { stat: "bond", against: 34 },
            personality: { freedom: 4, empathy: 4 },
            outcomes: {
              great: { text: "고르반은 지팡이를 짚고 직접 장터에 나가 이웃들 앞에서 고개를 숙였다. 그 장면을 전해 들은 {name}은 그해 처음으로 고향에 편지를 길게 썼다.", effects: { bond: 6, trust: 5 } },
              good: { text: "고르반은 한참 뒤 짧은 답장을 보냈다. 네 말이 맞다고. 치료실은 고르반의 손으로 조금씩 지어졌다.", effects: { bond: 3, trust: 3 } },
              bad: { text: "답장이 닿기 전에 고르반이 세상을 떠났다. 열쇠는 주인 없이 떠돌다 결국 다시 {name}에게 돌아왔다.", effects: { bond: -2, supplies: -2 } }
            } }
        ] },
      { step: 4, id: "echo_port", age: 28, art: "harbor", title: "낯선 항구의 기침 소리",
        body: "{name}이 머물던 항구에 회색 기침이 번지기 시작했다. 약방 앞에 줄이 늘어섰고, 어느 상인이 약값을 날마다 올리고 있었다. 기침 소리와 닫힌 창고 문, 아이들의 붉게 언 손. 어린 시절의 겨울이 그대로 눈앞에 있었다.",
        choices: [
          { id: "organize", label: "그 겨울에 배운 대로 명부를 만든다", hint: "아픈 사람부터", check: { stat: "trust", against: 40 },
            personality: { loyalty: 4, empathy: 5 },
            outcomes: {
              great: { text: "낯선 사람의 말에도 항구 사람들은 줄을 다시 섰다. 가장 아픈 집부터 약이 돌았고, 버티던 상인도 결국 창고를 열었다. 겨울이 끝나고 누군가 {name}을 그 항구의 의원이라 불렀다.", effects: { trust: 10, skill: 2 } },
              good: { text: "몇몇 집은 따랐고 몇몇은 무시했다. 그래도 줄이 조금 공평해졌고, 겨울 끝에 인사를 건네는 얼굴이 늘었다.", effects: { trust: 5 } },
              bad: { text: "외지인이 끼어든다며 항구 사람들이 등을 돌렸다. 명부는 바람에 날아갔고, {name}은 그 겨울 기침을 얻어 배에 올랐다.", effects: { trust: -4, health: -5 } }
            } },
          { id: "leave_port", label: "병이 옮기 전에 항구를 떠난다", hint: "살아남는 것도 선택", check: { stat: "supplies", against: 32 },
            personality: { caution: 7, freedom: 2 },
            outcomes: {
              great: { text: "떠나는 배에서 {name}은 남은 약을 부두의 아이 하나에게 쥐여 주었다. 몇 달 뒤 그 항구를 다시 지났을 때, 그 아이가 약방 앞에서 손을 흔들었다.", effects: { health: 3, trust: 4 } },
              good: { text: "무사히 떠났지만 수평선 너머로 멀어지는 기침 소리가 한동안 귀에서 떠나지 않았다.", effects: { health: 3, bond: -1 } },
              bad: { text: "뱃삯이 오른 바람에 가진 것을 다 털어야 했고, 배 안에서도 기침이 번졌다. 도망친 바다가 결국 같은 겨울이었다.", effects: { supplies: -6, health: -4 } }
            } }
        ] }
    ]
  }
];
