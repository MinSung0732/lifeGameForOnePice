// Filled by rule 20 boss scenes. The engine picks the first unseen entry whose person is around the protagonist,
// so each person's everyday scene comes before their second one.
export default [
  // 해군
  {
    id: "kong_inspection", person: "콩", paths: ["marine"], art: "deck",
    title: "원수의 시찰",
    body: "해군 원수 콩이 기지를 시찰하러 왔다. 줄지어 선 병사들 앞을 천천히 지나던 원수가 내 앞에서 걸음을 멈추고, 이 기지의 바다에서 요즘 무엇이 가장 문제냐고 짧게 물었다.",
    choices: [
      { id: "honest", label: "보급이 늦어 순찰이 끊긴다고 솔직히 말한다", hint: "상관들의 눈총을 살 수 있다",
        check: { stat: "trust", against: 50 }, personality: { loyalty: 4, empathy: 3 },
        outcomes: {
          great: { text: "원수는 말없이 고개를 끄덕이고 부관에게 무언가를 적게 했다. 다음 달 보급선이 두 배로 들어왔고, 동료들은 내 어깨를 두드렸다.", effects: { trust: 10, supplies: 10 } },
          good: { text: "원수는 들었다는 듯 짧게 답하고 지나갔다. 별일은 없었지만, 그날 저녁 기지 사령관이 나를 따로 불러 순찰표를 다시 짰다.", effects: { trust: 5 } },
          bad: { text: "원수가 떠난 뒤 기지 사령관에게 크게 꾸지람을 들었다. 밖에서 기지 흉을 봤다는 말이 돌았고, 한동안 궂은 당직만 돌아왔다.", effects: { trust: -8, health: -4 } }
        } },
      { id: "safe", label: "별문제 없다고 경례로 답한다", hint: "무난하지만 남는 것이 적다",
        check: { stat: "skill", against: 35 }, personality: { caution: 5 },
        outcomes: {
          great: { text: "자세가 흐트러지지 않은 것이 눈에 띄었는지, 원수가 이름을 물었다. 시찰 기록 끝에 내 이름이 한 줄 남았다.", effects: { trust: 8, skill: 4 } },
          good: { text: "원수는 그대로 지나갔다. 긴장이 풀려 다리가 후들거렸지만, 아무 일도 일어나지 않은 하루였다.", effects: { skill: 3 } },
          bad: { text: "경례하다 모자를 떨어뜨렸다. 원수는 아무 말도 하지 않았지만, 동기들은 그 이야기를 몇 년이나 우려먹었다.", effects: { trust: -5 } }
        } }
    ]
  },
  {
    id: "sengoku_okaki", person: "센고쿠", paths: ["marine"], art: "workbench",
    title: "원수실의 오카키",
    body: "서류를 전하러 원수실에 들어가니 센고쿠 원수가 오카키 봉지를 옆에 두고 보고서를 넘기고 있었다. 방 한쪽에서는 염소가 서류 끝을 씹고 있었다. 원수가 고개도 들지 않고 보고서를 읽어 보라고 했다.",
    choices: [
      { id: "read", label: "보고서를 또박또박 읽고 내 의견을 덧붙인다", hint: "엄격한 원수에게 시험받는다",
        check: { stat: "skill", against: 55 }, personality: { ambition: 6 },
        outcomes: {
          great: { text: "원수가 처음으로 고개를 들었다. 틀린 곳 하나 없는 보고였다며 오카키 봉지를 내 쪽으로 밀어 주었다. 그 뒤로 원수실 심부름이 자주 내게 왔다.", effects: { skill: 10, trust: 10 } },
          good: { text: "원수는 몇 군데를 고쳐 주고 다음부터는 결론부터 말하라고 했다. 엄했지만 고친 곳은 모두 옳았다.", effects: { skill: 6 } },
          bad: { text: "숫자를 하나 잘못 읽었다. 원수의 호통이 복도까지 울렸고, 보고서를 처음부터 다시 써 오라는 명이 떨어졌다.", effects: { trust: -6, health: -4 } }
        } },
      { id: "goat", label: "먼저 염소에게서 서류를 구해 낸다", hint: "원수의 염소를 건드린다",
        check: { stat: "health", against: 45 }, personality: { empathy: 4, caution: -2 },
        outcomes: {
          great: { text: "염소를 살살 달래 서류를 빼냈다. 원수가 그 녀석이 사람을 잘 안 따르는데 하며 웃었다. 부처 같은 얼굴이 아니라 평범한 노인의 웃음이었다.", effects: { trust: 8, friendBond: 6 } },
          good: { text: "서류는 반쯤 젖은 채 돌아왔다. 원수는 한숨을 쉬고 깨끗한 사본을 가져오라고 했다.", effects: { trust: 3 } },
          bad: { text: "염소에게 들이받혀 책상에 부딪혔다. 오카키 봉지가 바닥에 쏟아졌고, 원수의 얼굴이 굳었다.", effects: { health: -6, trust: -6 } }
        } }
    ]
  },
  {
    id: "garp_senbei", person: "몽키 D. 가프", paths: ["marine"], art: "deck",
    title: "가프 중장의 센베",
    body: "가프 중장이 군함 갑판에서 센베를 씹으며 작전을 설명하다가, 말이 끊기더니 그대로 코를 골기 시작했다. 장교들은 익숙한 듯 한숨을 쉬었다. 출항 시각은 다가오는데 작전의 결론을 들은 사람은 아무도 없었다.",
    choices: [
      { id: "wake", label: "어깨를 흔들어 중장을 깨운다", hint: "잠결의 주먹이 날아올지도",
        check: { stat: "health", against: 50 }, personality: { ambition: 4, caution: -3 },
        outcomes: {
          great: { text: "중장이 눈을 번쩍 뜨더니 자기가 잤냐며 크게 웃었다. 남은 작전을 한 줄로 끝내고 센베 한 장을 내 손에 쥐여 주었다.", effects: { trust: 8, friendBond: 8 } },
          good: { text: "중장은 깨어났지만 작전 이야기를 처음부터 다시 했다. 출항이 조금 늦었어도 아무도 나를 탓하지 않았다.", effects: { trust: 4 } },
          bad: { text: "잠결에 휘두른 팔에 맞아 갑판 끝까지 날아갔다. 중장은 깨어나서 미안하다며 웃었고, 나는 사흘을 의무실에 누워 있었다.", effects: { health: -12, friendBond: 3 } }
        } },
      { id: "plan", label: "앞서 들은 말을 정리해 장교들에게 돌린다", hint: "틀리면 내 책임이 된다",
        check: { stat: "skill", against: 55 }, personality: { loyalty: 4, caution: 3 },
        outcomes: {
          great: { text: "정리한 대로 배는 제시간에 떠났다. 나중에 깨어난 중장이 바로 그거라며 내 등을 세게 쳤다. 아팠지만 웃음이 났다.", effects: { skill: 10, trust: 8, health: -2 } },
          good: { text: "대략 맞았다. 중장은 깨어나 몇 군데만 고치고 다시 센베를 집었다.", effects: { skill: 5 } },
          bad: { text: "엉뚱한 섬으로 배를 돌릴 뻔했다. 깨어난 중장은 껄껄 웃었지만 함장은 웃지 않았다.", effects: { trust: -8 } }
        } }
    ]
  },
  {
    id: "tsuru_report", person: "츠루", paths: ["marine"], minRank: 4, art: "workbench",
    title: "츠루 중장의 차 한 잔",
    body: "츠루 중장이 내 작전 보고서를 끝까지 읽고 펜으로 한 줄을 그었다. 이 부분은 부하들을 너무 오래 바다에 세워 둔 계획이라고 했다. 날카로운 말 뒤에 중장이 찻잔 하나를 더 꺼냈다.",
    choices: [
      { id: "argue", label: "그 계획이 필요했던 이유를 설명한다", hint: "노련한 참모와 정면으로 겨룬다",
        check: { stat: "skill", against: 65 }, personality: { ambition: 6, freedom: 2 },
        outcomes: {
          great: { text: "중장은 끝까지 듣더니, 그렇다면 보급선을 하나 더 붙이라고만 했다. 그날 고친 계획으로 한 명도 잃지 않고 돌아왔다.", effects: { skill: 12, trust: 8 } },
          good: { text: "중장은 내 말에서 맞는 반쪽만 남기고 나머지를 지웠다. 반박할 수 없을 만큼 정확했다.", effects: { skill: 6 } },
          bad: { text: "중장이 조용히 찻잔을 내려놓았다. 큰 소리 한 번 없었는데, 그 방을 나설 때 얼굴이 화끈거렸다.", effects: { trust: -6, skill: 2 } }
        } },
      { id: "tea", label: "고개를 숙이고 차를 받는다", hint: "배울 것을 배운다",
        check: { stat: "trust", against: 40 }, personality: { empathy: 5, caution: 3 },
        outcomes: {
          great: { text: "중장이 차를 따르며 젊은 장교 시절 자기도 같은 실수를 했다고 했다. 꾸중보다 그 말이 더 오래 남았다.", effects: { trust: 8, health: 6 } },
          good: { text: "따뜻한 차를 마시는 동안 중장이 고칠 곳을 하나씩 짚어 주었다.", effects: { skill: 4, health: 3 } },
          bad: { text: "긴장해서 찻잔을 엎었다. 중장은 손수건을 건네며 그 손으로 부하들 목숨을 쥐고 있다는 것을 잊지 말라고 했다.", effects: { trust: -4, health: -2 } }
        } }
    ]
  },
  {
    id: "sakazuki_order", person: "사카즈키", paths: ["marine"], art: "dangerPrison",
    title: "원수의 물음",
    body: "새 원수 사카즈키가 기지 장교들을 모았다. 지난 순찰에서 항복한 해적 몇을 놓아준 일이 보고에 올라 있었다. 원수가 그 결정을 한 사람이 누구냐고 물었다. 방 안의 공기가 뜨겁게 가라앉았다.",
    choices: [
      { id: "own", label: "내 결정이었다고 앞으로 나선다", hint: "원수 앞에서 책임을 진다",
        check: { stat: "trust", against: 65 }, personality: { loyalty: 6, empathy: 4, caution: -4 },
        outcomes: {
          great: { text: "원수는 긴 침묵 끝에 다음은 없다고만 했다. 처벌은 감봉으로 그쳤고, 그 자리에 있던 부하들은 끝까지 나를 따랐다.", effects: { trust: 12, friendBond: 8, supplies: -6 } },
          good: { text: "견책과 함께 먼 기지로 전출되었다. 그래도 놓아준 사람들 이야기는 더 묻지 않았다.", effects: { trust: 4, supplies: -8 } },
          bad: { text: "원수의 말 한마디에 계급장이 떨어졌다. 놓아준 해적들은 다시 붙잡혔다는 소식이 들렸다.", effects: { trust: -15, supplies: -10 } }
        } },
      { id: "silent", label: "입을 다물고 기록을 고쳐 둔다", hint: "들키면 더 큰 죄가 된다",
        check: { stat: "skill", against: 60 }, personality: { caution: 6, ambition: 3 },
        outcomes: {
          great: { text: "고친 기록은 아무도 의심하지 않았다. 원수는 다른 장교를 꾸짖고 넘어갔지만, 그날 밤 잠이 오지 않았다.", effects: { skill: 8, trust: 4, friendBond: -4 } },
          good: { text: "일은 흐지부지 끝났다. 다만 옆자리 동료가 나를 보는 눈이 조금 달라졌다.", effects: { friendBond: -4, skill: 3 } },
          bad: { text: "고친 흔적이 드러났다. 원수 앞에 다시 불려 간 일은 평생 잊히지 않았다.", effects: { trust: -14, health: -8 } }
        } }
    ]
  },
  {
    id: "garp_fist", person: "몽키 D. 가프", paths: ["marine"], art: "deck",
    title: "사랑의 주먹",
    body: "가프 중장이 직접 훈련을 맡겠다고 나섰다. 갑판에 포탄 상자를 쌓아 놓고 손으로 하나씩 집어 던지며, 맞기 싫으면 피하든지 받아 내든지 하라고 웃었다. 실수한 병사의 머리에는 어김없이 주먹이 떨어졌다.",
    choices: [
      { id: "catch", label: "날아오는 포탄을 받아 내려 한다", hint: "크게 얻거나 크게 다친다",
        check: { stat: "health", against: 65 }, personality: { ambition: 8, caution: -6 },
        outcomes: {
          great: { text: "온몸으로 포탄 하나를 끌어안고 버텼다. 중장이 배를 잡고 웃으며 그놈 쓸 만하다고 외쳤다. 그 뒤로 훈련 때마다 내 이름이 먼저 불렸다.", effects: { skill: 14, trust: 8, health: -6 } },
          good: { text: "받아 내지는 못했지만 끝까지 쓰러지지 않았다. 중장이 그래도 도망은 안 쳤다며 머리를 쓰다듬었다. 손바닥도 주먹만큼 아팠다.", effects: { skill: 7, health: -6 } },
          bad: { text: "포탄에 맞아 바다에 빠졌다. 건져 올린 뒤 정신 차리라며 사랑의 주먹까지 한 대 더 맞았다.", effects: { health: -15, skill: 3 } }
        } },
      { id: "dodge", label: "포탄이 떨어지는 곳을 읽고 피한다", hint: "눈과 다리가 버텨야 한다",
        check: { stat: "skill", against: 50 }, personality: { caution: 5, freedom: 3 },
        outcomes: {
          great: { text: "하루 종일 한 발도 맞지 않았다. 중장이 재미있다며 두 개씩 던지기 시작했고, 그것까지 피하자 센베 한 봉지를 상으로 주었다.", effects: { skill: 10, health: 4 } },
          good: { text: "몇 발은 스쳤지만 크게 다치지는 않았다. 저녁에 다리가 후들거려 계단을 기어서 올라갔다.", effects: { skill: 5, health: -3 } },
          bad: { text: "피하다가 동기와 부딪혀 둘 다 나뒹굴었다. 중장의 주먹이 두 머리에 공평하게 떨어졌다.", effects: { health: -8, friendBond: 2 } }
        } }
    ]
  },
  {
    id: "sengoku_garp_scold", person: "센고쿠", paths: ["marine"], art: "workbench",
    title: "원수의 호통",
    body: "원수실 문 너머로 센고쿠 원수의 호통이 쏟아졌다. 또 누군가 원수의 과자를 집어 먹었다는 이야기였다. 문을 열고 나온 원수가 복도에 서 있던 나를 보고, 방금 들은 것은 잊으라며 한숨을 쉬었다.",
    choices: [
      { id: "joke", label: "아무것도 못 들었다고 시치미를 뗀다", hint: "원수의 기분을 읽어야 한다",
        check: { stat: "trust", against: 50 }, personality: { freedom: 4, empathy: 3 },
        outcomes: {
          great: { text: "원수가 피식 웃더니 오늘 일은 둘만 아는 것으로 하자고 했다. 며칠 뒤 원수실에서 새 오카키 봉지 하나가 내게 건너왔다.", effects: { trust: 10, friendBond: 6 } },
          good: { text: "원수는 됐다며 손을 저었다. 엄한 얼굴 뒤로 피곤함이 비쳤다.", effects: { trust: 4 } },
          bad: { text: "웃음을 참다 들켰다. 원수의 호통이 이번에는 내게 떨어졌다.", effects: { trust: -6, health: -3 } }
        } },
      { id: "errand", label: "새 과자를 사 오겠다고 나선다", hint: "주머니를 털어야 한다",
        check: { stat: "supplies", against: 45 }, personality: { loyalty: 5, ambition: 2 },
        outcomes: {
          great: { text: "가장 좋은 오카키를 구해 왔다. 원수는 쓸데없는 짓이라 하면서도 봉지를 받아 서랍 깊숙이 넣었다. 그 서랍 자리를 아는 사람이 한 명 늘었다.", effects: { trust: 10, supplies: -4 } },
          good: { text: "과자를 받은 원수가 고맙다고 짧게 말했다. 값은 비쌌지만 그 한마디가 남았다.", effects: { trust: 5, supplies: -6 } },
          bad: { text: "사 온 과자가 원수가 싫어하는 맛이었다. 원수는 말없이 염소에게 주었다.", effects: { supplies: -8, trust: -3 } }
        } }
    ]
  },

  // 흰 수염 해적단
  {
    id: "whitebeard_child", person: "에드워드 뉴게이트", art: "mishapFeast",
    title: "선장의 자식",
    body: "모비딕호에 오른 지 얼마 안 된 밤, 흰 수염이 커다란 술잔을 든 채 나를 불렀다. 갑판의 형제들이 숨을 죽였다. 선장은 이 배에 탄 이상 너도 내 자식이라며, 무엇이 되고 싶은지 말해 보라고 했다.",
    choices: [
      { id: "dream", label: "숨김없이 내 꿈을 말한다", hint: "형제들 앞에서 속을 드러낸다",
        check: { stat: "friendBond", against: 50 }, personality: { freedom: 6, ambition: 4 },
        outcomes: {
          great: { text: "선장이 땅이 울릴 만큼 크게 웃었다. 좋은 꿈이라며 잔을 들었고, 형제들이 함성으로 받았다. 그날 밤 처음으로 이 배가 집 같았다.", effects: { friendBond: 12, trust: 8 } },
          good: { text: "선장은 고개를 끄덕이고 술을 한 모금 마셨다. 몇몇 형제가 다가와 잔을 부딪쳤다.", effects: { friendBond: 6 } },
          bad: { text: "말이 엉켜 나오다 말았다. 형제들이 웃었지만 선장은 천천히 해도 된다며 손을 저었다.", effects: { friendBond: 2, trust: -4 } }
        } },
      { id: "drink", label: "말 대신 잔을 비운다", hint: "선장의 술은 독하다",
        check: { stat: "health", against: 55 }, personality: { loyalty: 6, caution: -3 },
        outcomes: {
          great: { text: "단숨에 잔을 비우자 선장이 그 녀석 배짱 좋다며 무릎을 쳤다. 형제들이 나를 들어 올려 갑판을 한 바퀴 돌았다.", effects: { friendBond: 10, trust: 6, health: -2 } },
          good: { text: "절반쯤 마시고 기침을 했다. 선장은 웃으며 남은 잔을 자기가 비웠다.", effects: { friendBond: 5, health: -3 } },
          bad: { text: "그대로 갑판에 쓰러졌다. 깨어 보니 선의들 침상이었고, 이틀 동안 머리가 깨질 듯했다.", effects: { health: -10, friendBond: 3 } }
        } }
    ]
  },
  {
    id: "ace_meal", person: "포트거스 D. 에이스", art: "mishapFeast",
    title: "식사 중의 잠",
    body: "에이스가 내 옆자리에 앉아 잘 먹겠다고 꾸벅 인사부터 했다. 고기를 몇 점 먹더니 갑자기 접시에 얼굴을 묻고 잠들었다. 식당이 술렁였다. 처음 보는 신입들은 대장이 쓰러진 줄 알고 의사를 부르려 했다.",
    choices: [
      { id: "calm", label: "신입들을 말리고 접시를 치워 둔다", hint: "대장의 버릇을 아는지가 관건",
        check: { stat: "trust", against: 40 }, personality: { empathy: 4, caution: 3 },
        outcomes: {
          great: { text: "잠에서 깬 에이스가 얼굴의 소스를 닦으며 덕분에 살았다고 웃었다. 그리고 내 접시에 고기 한 점을 얹어 주며 고맙다고 고개를 숙였다.", effects: { friendBond: 10, trust: 6 } },
          good: { text: "에이스는 깨어나 아무 일 없었다는 듯 다시 먹었다. 신입들만 어리둥절했다.", effects: { friendBond: 4 } },
          bad: { text: "신입 하나가 물을 끼얹었다. 깨어난 에이스의 어깨에서 불꽃이 피어올랐고, 수습은 내 몫이 되었다.", effects: { health: -5, trust: -3 } }
        } },
      { id: "steal", label: "그 틈에 대장의 고기를 한 점 집어 먹는다", hint: "깨면 들킨다",
        check: { stat: "skill", against: 60 }, personality: { freedom: 6, caution: -4 },
        outcomes: {
          great: { text: "들키지 않았다. 아니, 들켰다. 깨어난 에이스가 내 입가를 보고 크게 웃더니 반쪽을 마저 밀어 주었다.", effects: { friendBond: 12, supplies: 4 } },
          good: { text: "에이스가 눈을 뜨고 나를 빤히 보았다. 잠깐의 침묵 뒤에 둘 다 웃음을 터뜨렸다.", effects: { friendBond: 6 } },
          bad: { text: "포크를 뻗는 순간 에이스가 깨어났다. 화를 내지는 않았지만, 그 뒤로 2번대 형제들이 나를 고기 도둑이라 불렀다.", effects: { trust: -6, friendBond: 2 } }
        } }
    ]
  },
  {
    id: "marco_wound", person: "마르코", art: "deck",
    title: "1번대 대장의 손",
    body: "싸움이 끝난 갑판에서 다친 자리를 감추고 있었는데, 마르코가 먼저 알아보고 다가왔다. 졸린 듯한 눈으로 상처를 들여다보더니 손끝에 푸른 불꽃을 올렸다. 참지 말고 아프면 아프다고 하라고, 조용히 말했다.",
    choices: [
      { id: "trust", label: "상처를 맡기고 그날 일을 털어놓는다", hint: "대장 앞에서 실수를 인정한다",
        check: { stat: "trust", against: 45 }, personality: { empathy: 5, loyalty: 4 },
        outcomes: {
          great: { text: "치료를 마친 마르코가 그 판단은 틀리지 않았다고 했다. 다음 항해부터 1번대 일을 거들게 되었다.", effects: { health: 12, trust: 8, skill: 4 } },
          good: { text: "상처는 깨끗이 아물었다. 마르코는 다음엔 혼자 앞서지 말라고만 하고 다른 부상자에게 갔다.", effects: { health: 8 } },
          bad: { text: "말을 하다 보니 변명만 늘어놓았다. 마르코는 한숨을 쉬고 상처만 감아 주었다.", effects: { health: 4, trust: -4 } }
        } },
      { id: "tough", label: "괜찮다며 다른 형제부터 봐 달라고 한다", hint: "버티다 덧날 수 있다",
        check: { stat: "health", against: 55 }, personality: { loyalty: 6, caution: -4 },
        outcomes: {
          great: { text: "마르코가 피식 웃고 그 말대로 했다. 밤늦게 돌아와 내 상처를 마저 봐 주며 좋은 형제라고 했다.", effects: { friendBond: 10, trust: 6, health: 4 } },
          good: { text: "기다리는 동안 열이 올랐다. 마르코는 그러니까 말하라고 하지 않았냐며 혀를 찼다.", effects: { friendBond: 5, health: -3 } },
          bad: { text: "상처가 덧나 한 달을 앓았다. 마르코가 매일 들러 붕대를 갈며 다시는 그러지 말라고 했다.", effects: { health: -12, friendBond: 4 } }
        } }
    ]
  },
  {
    id: "teach_pie", person: "마셜 D. 티치", art: "deck",
    title: "체리 파이와 밤 당번",
    body: "밤 당번을 함께 서게 된 티치가 어디서 구했는지 체리 파이를 한 판 들고 나왔다. 제하하 웃으며 한 조각을 내밀었다. 별을 보던 티치가 문득, 사람은 무엇을 기다릴 줄 알아야 한다고 중얼거렸다.",
    choices: [
      { id: "listen", label: "파이를 받고 이야기를 듣는다", hint: "긴 밤을 함께 보낸다",
        check: { stat: "friendBond", against: 40 }, personality: { empathy: 5 },
        outcomes: {
          great: { text: "티치는 항구마다 들은 바다의 소문을 밤새 늘어놓았다. 새벽이 되자 남은 파이를 통째로 내게 넘겼다.", effects: { friendBond: 8, skill: 6, supplies: 4 } },
          good: { text: "파이는 달았고 밤은 길었다. 티치의 이야기는 반쯤 허풍 같았지만 지루하지 않았다.", effects: { friendBond: 5 } },
          bad: { text: "졸다가 망을 놓쳤다. 다음 날 아침 둘 다 대장에게 혼났지만 티치는 제하하 웃기만 했다.", effects: { trust: -6, friendBond: 2 } }
        } },
      { id: "watch", label: "파이는 나중에 먹고 망을 본다", hint: "당번 일을 지킨다",
        check: { stat: "skill", against: 45 }, personality: { caution: 5, loyalty: 3 },
        outcomes: {
          great: { text: "수평선의 불빛을 먼저 알아보고 종을 울렸다. 배는 미리 방향을 틀었고, 티치가 눈이 좋다며 어깨를 쳤다.", effects: { skill: 8, trust: 8 } },
          good: { text: "아무 일 없는 밤이었다. 아침에 보니 파이는 티치가 다 먹고 없었다.", effects: { skill: 3 } },
          bad: { text: "파도 소리를 배로 착각해 온 배를 깨웠다. 형제들의 원성이 아침 내내 이어졌다.", effects: { trust: -5, health: -2 } }
        } }
    ]
  },
  {
    id: "ace_flame", person: "포트거스 D. 에이스", art: "deck",
    title: "추운 밤의 불꽃",
    body: "겨울 섬 근처를 지나던 밤, 갑판 위 당번들이 추위에 떨었다. 에이스가 모자를 눌러쓰고 나와 손바닥 위에 작은 불을 피웠다. 둘러앉은 형제들 틈에서, 대장이 내게 요즘 이 배가 편하냐고 물었다.",
    choices: [
      { id: "true", label: "아직 형제들 사이가 어렵다고 털어놓는다", hint: "대장 앞에서 약한 소리를 한다",
        check: { stat: "friendBond", against: 50 }, personality: { empathy: 5, freedom: 2 },
        outcomes: {
          great: { text: "에이스는 자기도 처음엔 이 배에서 가장 삐딱한 녀석이었다며 웃었다. 다음 날부터 2번대 형제들이 나를 일에 끼워 주었다.", effects: { friendBond: 12, trust: 6 } },
          good: { text: "에이스는 천천히 하면 된다고만 했다. 불이 꺼질 때까지 곁에 있어 주었다.", effects: { friendBond: 6, health: 3 } },
          bad: { text: "말을 꺼내자 주변 형제들이 서운한 얼굴을 했다. 그날 밤 불은 따뜻했지만 분위기는 차가웠다.", effects: { friendBond: -5 } }
        } },
      { id: "fine", label: "편하다며 당번을 대신 서겠다고 한다", hint: "추위를 견뎌야 한다",
        check: { stat: "health", against: 55 }, personality: { loyalty: 6 },
        outcomes: {
          great: { text: "밤새 망루를 지켰다. 새벽에 에이스가 따뜻한 국 한 그릇을 들고 올라와 고맙다며 고개를 숙였다.", effects: { trust: 10, friendBond: 6, health: -2 } },
          good: { text: "추위에 손끝이 얼었지만 밤은 무사히 지나갔다.", effects: { trust: 5, health: -4 } },
          bad: { text: "새벽에 열이 올라 쓰러졌다. 에이스가 직접 나를 업어 선의에게 데려갔다.", effects: { health: -12, friendBond: 4 } }
        } }
    ]
  },
  {
    id: "whitebeard_sake", person: "에드워드 뉴게이트", art: "mishapFeast",
    title: "아버지의 술",
    body: "선의들이 술을 줄이라고 몇 번이나 말했지만, 흰 수염은 오늘도 술통을 옆에 두었다. 마침 술을 나르던 내게 선장이 한 잔 따르라고 했다. 뒤에서 선의가 고개를 젓고 있었다.",
    choices: [
      { id: "pour", label: "선장의 잔을 채운다", hint: "선장의 뜻을 따른다",
        check: { stat: "trust", against: 45 }, personality: { loyalty: 6, freedom: 3 },
        outcomes: {
          great: { text: "선장은 잔을 받아 들고 내게도 한 잔 따르게 했다. 바다가 좋냐는 물음에 고개를 끄덕이자, 그럼 됐다며 크게 웃었다.", effects: { friendBond: 10, trust: 8 } },
          good: { text: "선장은 술을 마시며 말없이 바다를 보았다. 곁에 앉아 있는 것만으로 충분했다.", effects: { friendBond: 5 } },
          bad: { text: "선의에게 붙잡혀 한참 잔소리를 들었다. 선장은 그걸 보며 웃기만 했다.", effects: { trust: -4, friendBond: 3 } }
        } },
      { id: "water", label: "술 대신 물을 반쯤 섞어 드린다", hint: "선장에게 들키면 곤란하다",
        check: { stat: "skill", against: 65 }, personality: { empathy: 6, caution: 3 },
        outcomes: {
          great: { text: "선장은 한 모금 마시고 나를 내려다보더니, 이놈 하고 웃었다. 그래도 잔을 끝까지 비웠다. 선의가 나를 보고 몰래 엄지를 들었다.", effects: { trust: 12, friendBond: 8 } },
          good: { text: "선장이 맛이 싱겁다며 투덜댔지만 더 묻지 않았다.", effects: { trust: 5 } },
          bad: { text: "단번에 들켰다. 선장의 웃음소리에 갑판이 흔들렸고, 형제들은 그 일을 두고두고 놀렸다.", effects: { trust: -5, health: -2 } }
        } }
    ]
  },

  // 빅 맘 해적단
  {
    id: "linlin_craving", person: "샬롯 링링", art: "arcWholeCake",
    title: "한밤의 허기",
    body: "한밤중에 선장 샬롯 링링의 방에서 단 것을 내놓으라는 고함이 울렸다. 그 허기가 시작되면 배 전체가 위험하다는 것을 다들 알았다. 창고 앞에 선 사람은 나 하나였고, 남은 과자는 별로 없었다.",
    choices: [
      { id: "bake", label: "남은 재료로 급히 케이크를 굽는다", hint: "맛이 없으면 끝장이다",
        check: { stat: "skill", against: 65 }, personality: { ambition: 6, caution: -4 },
        outcomes: {
          great: { text: "선장이 케이크를 통째로 삼키고 어린아이처럼 웃었다. 맛있다는 그 한마디 덕분에 주방에서 내 자리가 단단해졌다.", effects: { trust: 14, supplies: 6 } },
          good: { text: "허기는 가라앉았다. 선장은 다음엔 더 크게 만들라고 했다.", effects: { trust: 6, supplies: -4 } },
          bad: { text: "케이크가 덜 달았다. 성난 손짓 한 번에 주방 벽이 무너졌고, 나는 잔해 밑에서 겨우 기어 나왔다.", effects: { health: -15, supplies: -8 } }
        } },
      { id: "all", label: "창고에 남은 과자를 모조리 바친다", hint: "배의 비축분이 바닥난다",
        check: { stat: "supplies", against: 50 }, personality: { caution: 6 },
        outcomes: {
          great: { text: "선장은 과자를 다 먹고 잠이 들었다. 다음 날 아침 아무것도 기억하지 못했지만, 주방장은 내 이름을 기억했다.", effects: { trust: 8, supplies: -6 } },
          good: { text: "간신히 고비를 넘겼다. 창고는 텅 비었고 다음 항구까지 모두가 허리띠를 졸라맸다.", effects: { supplies: -10, trust: 4 } },
          bad: { text: "모자랐다. 선장의 고함에 귀가 멍했고, 한동안 그 방 근처에도 가지 못했다.", effects: { supplies: -12, health: -8 } }
        } }
    ]
  },

  // 태양 해적단
  {
    id: "jinbe_karate", person: "징베", art: "arcFishman",
    title: "징베의 물 읽기",
    body: "갑판에서 징베가 어인 공수도의 기본을 보여 주었다. 주먹이 물통에 닿지도 않았는데 물이 출렁였다. 징베는 힘으로 치는 것이 아니라 물의 흐름을 읽는 것이라며, 한번 해 보라고 물통을 내 앞으로 밀었다.",
    choices: [
      { id: "try", label: "징베를 따라 주먹을 내지른다", hint: "몸이 따라가야 한다",
        check: { stat: "health", against: 55 }, personality: { ambition: 5 },
        outcomes: {
          great: { text: "세 번째에 물 표면이 아주 조금 떨렸다. 징베가 눈을 크게 뜨고 껄껄 웃으며 매일 아침 함께 하자고 했다.", effects: { skill: 12, friendBond: 6 } },
          good: { text: "물은 꿈쩍도 하지 않았지만, 징베는 자세가 바르다며 고칠 곳을 하나 짚어 주었다.", effects: { skill: 6 } },
          bad: { text: "힘을 너무 주다가 물통을 쳐서 손목을 삐었다. 징베가 직접 붕대를 감아 주며 서두르지 말라고 했다.", effects: { health: -8, skill: 2 } }
        } },
      { id: "ask", label: "왜 이 힘을 배우는지 먼저 묻는다", hint: "징베의 마음을 듣는다",
        check: { stat: "friendBond", against: 45 }, personality: { empathy: 6, caution: 2 },
        outcomes: {
          great: { text: "징베는 한참 바다를 보다가, 지키는 데 쓰는 힘이어야 한다고 했다. 그날 이후 징베는 나를 형제처럼 대했다.", effects: { friendBond: 12, trust: 6 } },
          good: { text: "징베는 짧게 답하고 다시 자세를 보여 주었다. 말보다 그 등을 보는 편이 많은 것을 알려 주었다.", effects: { friendBond: 5, skill: 3 } },
          bad: { text: "질문이 날카로웠는지 징베의 얼굴이 굳었다. 그날 훈련은 거기서 끝났다.", effects: { friendBond: -5 } }
        } }
    ]
  },

  // 로저 해적단
  {
    id: "roger_detour", person: "골 D. 로저", art: "dangerSeaKing",
    title: "선장의 샛길",
    body: "해도 위에 아무도 가지 않는 해역이 있었다. 레일리는 고개를 저었지만 로저는 해도를 손가락으로 두드리며 크게 웃었다. 재미있어 보인다는 것이 이유의 전부였다. 선장이 키를 쥔 내게 어떻게 하겠냐고 물었다.",
    choices: [
      { id: "go", label: "선장의 웃음을 따라 키를 꺾는다", hint: "크게 얻거나 크게 다친다",
        check: { stat: "skill", against: 65 }, personality: { freedom: 8, caution: -6 },
        outcomes: {
          great: { text: "폭풍을 뚫고 나가자 아무도 본 적 없는 섬이 나타났다. 로저가 내 머리를 헝클어뜨리며 이 녀석 키 잡는 솜씨 좀 보라고 외쳤다.", effects: { skill: 14, friendBond: 8, health: -4 } },
          good: { text: "섬은 없었지만 바다왕류 떼를 보았다. 갑판은 엉망이 되었고 선장은 배를 잡고 웃었다.", effects: { skill: 6, supplies: -6 } },
          bad: { text: "돛대가 부러지고 나는 갑판에 내동댕이쳐졌다. 로저가 나를 붙잡아 올리며 그래도 재미있었지 하고 웃었다.", effects: { health: -14, supplies: -8, friendBond: 4 } }
        } },
      { id: "chart", label: "부선장의 말대로 안전한 항로를 권한다", hint: "선장이 실망할지도",
        check: { stat: "trust", against: 50 }, personality: { caution: 6, loyalty: 3 },
        outcomes: {
          great: { text: "로저는 입을 삐죽였지만 끝내 웃으며 그럼 다음에 가자고 했다. 레일리가 나를 보고 고개를 끄덕였다.", effects: { trust: 10, supplies: 4 } },
          good: { text: "배는 무사히 다음 섬에 닿았다. 선장은 하루 종일 심심하다고 투덜댔다.", effects: { trust: 5 } },
          bad: { text: "선장은 내 말을 듣는 둥 마는 둥 하더니 직접 키를 꺾었다. 결국 폭풍 속으로 들어갔고, 나는 할 말이 없었다.", effects: { health: -8, trust: -3 } }
        } }
    ]
  },
  {
    id: "rayleigh_cards", person: "실버즈 레일리", art: "mishapFeast",
    title: "부선장과의 카드",
    body: "항구의 밤, 레일리가 선원들과 카드를 치고 있었다. 판돈이 꽤 쌓였는데도 부선장은 여유로운 얼굴로 술잔만 기울였다. 레일리가 내게 빈자리를 가리키며, 한 판 하겠냐고 웃었다.",
    choices: [
      { id: "play", label: "주머니를 털어 판에 끼어든다", hint: "부선장의 눈을 속여야 한다",
        check: { stat: "supplies", against: 55 }, personality: { freedom: 5, ambition: 4 },
        outcomes: {
          great: { text: "마지막 판에서 이겼다. 레일리가 패를 내려놓고 내가 보는 눈이 좋다고 했다. 그날 밤 그는 상대의 기척을 읽는 법을 조금 알려 주었다.", effects: { supplies: 10, skill: 8 } },
          good: { text: "본전만 건졌다. 레일리는 웃으며 술 한 잔을 샀다.", effects: { friendBond: 5 } },
          bad: { text: "가진 것을 모두 잃었다. 레일리가 미안하다며 웃었지만 돈은 돌려주지 않았다.", effects: { supplies: -14 } }
        } },
      { id: "watch", label: "옆에 앉아 부선장의 패를 지켜본다", hint: "배울 것은 많다",
        check: { stat: "skill", against: 45 }, personality: { caution: 5 },
        outcomes: {
          great: { text: "레일리가 패보다 상대의 숨을 보라고 귓속말을 했다. 그날 이후 싸움터에서도 사람의 숨이 먼저 보였다.", effects: { skill: 12 } },
          good: { text: "밤새 지켜보았지만 레일리가 언제 이기는지 끝내 알 수 없었다.", effects: { skill: 4 } },
          bad: { text: "졸다가 패를 엎었다. 판이 엉망이 되어 선원들에게 쫓겨났다.", effects: { friendBond: -4, health: -2 } }
        } }
    ]
  },
  {
    id: "roger_apprentices", person: "골 D. 로저", art: "deck",
    title: "견습들의 싸움",
    body: "견습 선원 샹크스와 버기가 또 갑판에서 뒹굴며 싸웠다. 말리러 간 나까지 엉켜 셋이 굴렀다. 그때 로저가 나타나 셋을 한꺼번에 들어 올리더니, 웃음을 터뜨리며 싸울 거면 제대로 싸우라고 했다.",
    choices: [
      { id: "spar", label: "선장 앞에서 제대로 겨뤄 본다", hint: "견습들의 눈이 매섭다",
        check: { stat: "health", against: 55 }, personality: { ambition: 6, freedom: 3 },
        outcomes: {
          great: { text: "한참을 뒹군 끝에 셋 다 대자로 뻗었다. 로저가 술을 들고 와 셋의 잔을 채우며 좋은 싸움이었다고 웃었다.", effects: { friendBond: 12, skill: 6, health: -4 } },
          good: { text: "버기에게 코를 맞았다. 샹크스가 웃으며 손을 내밀었다.", effects: { friendBond: 6, health: -5 } },
          bad: { text: "둘이 편을 먹고 나를 바다에 던졌다. 로저가 직접 뛰어들어 건져 주며 배꼽을 잡았다.", effects: { health: -10, friendBond: 3 } }
        } },
      { id: "split", label: "둘을 떼어 놓고 갑판 청소를 시킨다", hint: "견습들의 원망을 산다",
        check: { stat: "trust", against: 45 }, personality: { caution: 4, loyalty: 4 },
        outcomes: {
          great: { text: "로저가 그거 좋다며 셋 다 청소하라고 했다. 해 질 녘 반짝이는 갑판 위에서 셋이 나란히 웃었다.", effects: { friendBond: 8, trust: 8 } },
          good: { text: "둘은 투덜대며 걸레를 들었다. 저녁에 버기가 내 몫의 빵을 감췄다.", effects: { trust: 4, supplies: -3 } },
          bad: { text: "둘이 동시에 내게 달려들었다. 선장은 말리기는커녕 응원했다.", effects: { health: -8 } }
        } }
    ]
  },

  // 붉은 머리 해적단
  {
    id: "shanks_feast", person: "샹크스", crew: "붉은 머리 해적단", art: "mishapFeast",
    title: "붉은 머리의 잔치",
    body: "섬에 닿자마자 샹크스가 잔치를 열자고 했다. 이유를 묻자 섬에 닿았으니까라며 웃었다. 라키 루는 고기를 굽고 벤 베크만은 담배를 문 채 술통을 굴렸다. 선장이 내 잔부터 채우고 오늘은 마시라고 했다.",
    choices: [
      { id: "drink", label: "선장과 잔을 맞대고 끝까지 마신다", hint: "선장의 주량은 끝이 없다",
        check: { stat: "health", against: 55 }, personality: { freedom: 6 },
        outcomes: {
          great: { text: "새벽까지 버텼다. 샹크스가 너는 오늘부터 술 동료라며 어깨동무를 했다. 그날 밤 선원들 이름이 하나씩 마음에 들어왔다.", effects: { friendBond: 12, health: -2 } },
          good: { text: "자정쯤 쓰러졌다. 깨어 보니 누군가 덮어 준 외투가 있었다.", effects: { friendBond: 6, health: -3 } },
          bad: { text: "물 대신 술로 세수할 만큼 취했다. 다음 날 하루 종일 일어나지 못했다.", effects: { health: -10, friendBond: 3 } }
        } },
      { id: "cook", label: "라키 루를 도와 고기를 굽는다", hint: "고기를 지켜야 한다",
        check: { stat: "skill", against: 45 }, personality: { empathy: 4, loyalty: 3 },
        outcomes: {
          great: { text: "라키 루가 고기를 한 입 먹고 잘 구웠다며 엄지를 들었다. 샹크스가 그 고기를 들고 와 함께 먹자고 했다.", effects: { friendBond: 8, supplies: 6 } },
          good: { text: "고기는 몇 점 탔지만 아무도 신경 쓰지 않았다.", effects: { friendBond: 4 } },
          bad: { text: "고기를 통째로 태웠다. 라키 루의 실망한 얼굴이 꽤 오래 기억에 남았다.", effects: { supplies: -8, friendBond: -2 } }
        } }
    ]
  },
  {
    id: "yasopp_son", person: "야솝", crew: "붉은 머리 해적단", art: "deck",
    title: "야솝의 아들 자랑",
    body: "망루에서 야솝과 함께 바다를 지켰다. 수평선에 떠 있는 갈매기를 맞히겠다며 총을 겨누던 야솝이 갑자기 고향에 두고 온 아들 이야기를 꺼냈다. 몇 번째 듣는 자랑이었지만 야솝의 얼굴은 처음처럼 들떠 있었다.",
    choices: [
      { id: "listen", label: "처음 듣는 것처럼 맞장구를 친다", hint: "긴 이야기를 들어 준다",
        check: { stat: "friendBond", against: 40 }, personality: { empathy: 6 },
        outcomes: {
          great: { text: "야솝은 신이 나서 총 쏘는 요령까지 알려 주었다. 그날 처음으로 먼 표적을 맞혔다.", effects: { friendBond: 8, skill: 8 } },
          good: { text: "이야기는 해가 질 때까지 이어졌다. 야솝은 좋은 녀석이라며 등을 두드렸다.", effects: { friendBond: 6 } },
          bad: { text: "하품을 하다 들켰다. 야솝은 서운한 척하며 망루에서 내려가 버렸다.", effects: { friendBond: -4 } }
        } },
      { id: "shoot", label: "아들보다 내가 낫다며 사격 대결을 건다", hint: "명사수에게 덤빈다",
        check: { stat: "skill", against: 65 }, personality: { ambition: 7, caution: -3 },
        outcomes: {
          great: { text: "한 발이 겨우 표적 끝을 스쳤다. 야솝이 크게 웃더니 우리 아들한테는 아직 안 된다며 내 총을 고쳐 잡아 주었다.", effects: { skill: 12, friendBond: 6 } },
          good: { text: "보기 좋게 졌다. 야솝은 웃으며 연습 탄을 한 상자 내주었다.", effects: { skill: 5, supplies: 3 } },
          bad: { text: "총이 튀어 어깨를 다쳤다. 야솝이 혀를 차며 그래서 총은 함부로 드는 게 아니라고 했다.", effects: { health: -10 } }
        } }
    ]
  },
  {
    id: "shanks_haki", person: "샹크스", crew: "붉은 머리 해적단", art: "deck",
    title: "선장의 기척",
    body: "갑판에서 혼자 검을 휘두르고 있는데 등 뒤에 샹크스가 와 있었다. 언제 왔는지 전혀 몰랐다. 선장은 웃으며 기척은 귀가 아니라 마음으로 듣는 것이라고 했다. 그리고 눈을 감고 자기 손을 피해 보라고 했다.",
    choices: [
      { id: "eyes", label: "눈을 감고 선장의 손을 기다린다", hint: "크게 얻거나 크게 다친다",
        check: { stat: "skill", against: 70 }, personality: { ambition: 8, caution: -4 },
        outcomes: {
          great: { text: "열 번째에 몸이 먼저 움직였다. 샹크스가 박수를 치며 오늘은 술을 사겠다고 했다. 그 감각은 평생 사라지지 않았다.", effects: { skill: 15, friendBond: 6 } },
          good: { text: "모두 맞았지만 마지막에 바람이 스치는 것을 느꼈다. 샹크스가 그걸로 됐다고 했다.", effects: { skill: 7 } },
          bad: { text: "선장의 손이 이마에 닿을 때마다 머리가 띵했다. 저녁 내내 두통에 시달렸다.", effects: { health: -8, skill: 2 } }
        } },
      { id: "ask", label: "선장이 이 힘을 어디서 배웠는지 묻는다", hint: "선장의 과거를 건드린다",
        check: { stat: "friendBond", against: 50 }, personality: { empathy: 4, freedom: 3 },
        outcomes: {
          great: { text: "샹크스는 잠시 바다를 보다가 옛날 견습 시절 이야기를 조금 들려주었다. 그러고는 다시 웃으며 술이나 마시자고 했다.", effects: { friendBond: 12 } },
          good: { text: "샹크스는 웃기만 하고 대답하지 않았다. 그래도 그날 밤 내 잔을 직접 채워 주었다.", effects: { friendBond: 5 } },
          bad: { text: "선장의 웃음이 잠깐 멈췄다. 곧 아무렇지 않게 돌아섰지만, 괜히 물었다는 생각이 오래 남았다.", effects: { friendBond: -4 } }
        } }
    ]
  },

  // 밀짚모자 일당
  {
    id: "luffy_meat", person: "몽키 D. 루피", art: "mishapFeast",
    title: "선장의 손",
    body: "상디가 차린 저녁상 앞에서 루피의 팔이 쭉 늘어나 내 접시의 고기를 낚아챘다. 상디의 발길질이 날아가고 나미의 주먹이 떨어지는 동안, 루피는 볼이 터지도록 고기를 문 채 웃고 있었다.",
    choices: [
      { id: "fight", label: "내 고기를 되찾으러 달려든다", hint: "고무 선장과 맞붙는다",
        check: { stat: "health", against: 55 }, personality: { freedom: 6, ambition: 3 },
        outcomes: {
          great: { text: "루피의 볼에서 고기 반쪽을 빼앗았다. 루피는 분해하다가 금세 너 대단하다며 웃었다. 그날 식탁은 유난히 시끄러웠다.", effects: { friendBond: 12, supplies: 4 } },
          good: { text: "고기는 되찾지 못했지만 상디가 새 접시를 내왔다. 루피는 그 접시도 노렸다.", effects: { friendBond: 6 } },
          bad: { text: "늘어난 팔에 휘감겨 식탁째 넘어갔다. 상디에게 둘 다 혼났다.", effects: { health: -6, friendBond: 4 } }
        } },
      { id: "give", label: "웃으며 남은 고기도 내준다", hint: "내 저녁은 사라진다",
        check: { stat: "supplies", against: 40 }, personality: { empathy: 6 },
        outcomes: {
          great: { text: "루피가 눈을 반짝이며 고맙다고 외쳤다. 밤늦게 상디가 몰래 내 몫의 야식을 챙겨 주었다.", effects: { friendBond: 10, health: 4 } },
          good: { text: "배는 고팠지만 루피의 웃음을 보니 아깝지 않았다.", effects: { friendBond: 6, health: -2 } },
          bad: { text: "그 뒤로 루피가 매 끼니 내 접시를 노렸다.", effects: { supplies: -6, health: -4 } }
        } }
    ]
  },
  {
    id: "luffy_nakama", person: "몽키 D. 루피", art: "deck",
    title: "선장이 보는 등",
    body: "싸움에서 진 날 밤, 갑판 끝에 혼자 앉아 있었다. 루피가 와서 아무 말 없이 옆에 앉았다. 한참 바다만 보던 루피가 다음엔 이기면 된다고, 너는 우리 동료니까 같이 강해지면 된다고 했다.",
    choices: [
      { id: "train", label: "내일부터 같이 훈련하자고 한다", hint: "선장의 훈련은 거칠다",
        check: { stat: "health", against: 60 }, personality: { ambition: 7, loyalty: 3 },
        outcomes: {
          great: { text: "조로까지 끼어들어 셋이 해가 뜰 때까지 훈련했다. 온몸이 쑤셨지만 다음 싸움에서는 물러서지 않았다.", effects: { skill: 14, friendBond: 8, health: -6 } },
          good: { text: "루피는 신이 나서 몇 번이고 덤볐다. 나는 몇 번이고 나가떨어졌다.", effects: { skill: 7, health: -6 } },
          bad: { text: "첫날부터 무리하다 갈비뼈가 상했다. 쵸파에게 둘 다 크게 혼났다.", effects: { health: -14, friendBond: 4 } }
        } },
      { id: "thanks", label: "고맙다고만 하고 함께 바다를 본다", hint: "말없이 마음을 나눈다",
        check: { stat: "friendBond", against: 45 }, personality: { empathy: 6 },
        outcomes: {
          great: { text: "루피가 시시시 웃으며 밀짚모자를 고쳐 썼다. 그 밤 이후 진 것이 부끄럽지 않았다.", effects: { friendBond: 12, health: 4 } },
          good: { text: "루피는 배고프다며 금방 일어났다. 그래도 마음이 한결 가벼웠다.", effects: { friendBond: 6 } },
          bad: { text: "루피가 잠들어 버려 나 혼자 남았다. 쓸쓸했지만 조금 웃음이 났다.", effects: { friendBond: 2, health: -2 } }
        } }
    ]
  },

  // 혁명군
  {
    id: "dragon_wind", person: "몽키 D. 드래곤", paths: ["liberator"], art: "lifeStorm",
    title: "총사령관의 바람",
    body: "본부의 높은 곳에서 드래곤이 바람을 맞으며 바다를 보고 있었다. 보고를 전하러 간 나는 한참 말을 꺼내지 못했다. 드래곤은 돌아보지 않은 채 들은 것을 전부 말하라고만 했다.",
    choices: [
      { id: "all", label: "현장에서 본 것을 빠짐없이 전한다", hint: "불리한 사실도 숨기지 않는다",
        check: { stat: "trust", against: 55 }, personality: { loyalty: 6, empathy: 3 },
        outcomes: {
          great: { text: "드래곤은 끝까지 듣고 짧게 수고했다고 했다. 다음 작전의 연락 임무가 내게 맡겨졌다.", effects: { trust: 12, skill: 6 } },
          good: { text: "드래곤은 고개를 끄덕이고 다시 바다를 보았다. 그 침묵이 꾸중은 아니라는 것을 나중에 알았다.", effects: { trust: 5 } },
          bad: { text: "중요한 숫자를 빠뜨렸다. 드래곤이 처음으로 돌아보았고, 나는 그 눈을 오래 잊지 못했다.", effects: { trust: -8 } }
        } },
      { id: "opinion", label: "보고 끝에 내 의견을 덧붙인다", hint: "총사령관에게 말을 보탠다",
        check: { stat: "skill", against: 60 }, personality: { ambition: 6, freedom: 4 },
        outcomes: {
          great: { text: "바람이 잠시 멎은 것 같았다. 드래곤이 그 의견을 참모들에게도 전하라고 했다.", effects: { skill: 10, trust: 10 } },
          good: { text: "드래곤은 대답 없이 들었다. 며칠 뒤 작전 계획에 내 말의 한 조각이 들어 있었다.", effects: { skill: 5, trust: 3 } },
          bad: { text: "드래곤이 그것은 네가 정할 일이 아니라고 했다. 낮은 목소리였는데 바람보다 차가웠다.", effects: { trust: -8, health: -2 } }
        } }
    ]
  },
  {
    id: "sabo_pipe", person: "사보", paths: ["liberator"], art: "deck",
    title: "사보의 쇠파이프",
    body: "훈련장에서 사보가 쇠파이프를 어깨에 걸치고 나를 불렀다. 실전처럼 한번 덤벼 보라며 모자를 고쳐 썼다. 주변의 요원들이 하던 일을 멈추고 구경하러 모여들었다.",
    choices: [
      { id: "charge", label: "정면으로 달려든다", hint: "크게 얻거나 크게 다친다",
        check: { stat: "health", against: 65 }, personality: { ambition: 7, caution: -5 },
        outcomes: {
          great: { text: "한 번 파이프를 막아 냈다. 사보가 눈을 반짝이며 좋다고 외치더니 그날부터 내 훈련을 직접 봐 주었다.", effects: { skill: 14, friendBond: 6, health: -4 } },
          good: { text: "세 합 만에 바닥에 누웠다. 사보가 손을 내밀며 겁 없는 게 마음에 든다고 웃었다.", effects: { skill: 7, health: -6 } },
          bad: { text: "파이프 한 방에 정신을 잃었다. 깨어 보니 사보가 미안하다며 머리를 긁적이고 있었다.", effects: { health: -14, friendBond: 3 } }
        } },
      { id: "read", label: "사보의 움직임을 읽으며 버틴다", hint: "끈기가 필요하다",
        check: { stat: "skill", against: 50 }, personality: { caution: 6 },
        outcomes: {
          great: { text: "끝까지 쓰러지지 않았다. 사보가 파이프를 내리고 다음 임무에 같이 가자고 했다.", effects: { skill: 10, trust: 8 } },
          good: { text: "버티기는 했지만 숨이 턱까지 찼다. 사보는 자세가 좋다고 짧게 말했다.", effects: { skill: 5, health: -3 } },
          bad: { text: "피하기만 하다 구석에 몰렸다. 구경하던 요원들이 웃음을 터뜨렸다.", effects: { trust: -5, health: -4 } }
        } }
    ]
  },
  {
    id: "koala_karate", person: "코알라", paths: ["liberator"], art: "arcFishman",
    title: "코알라의 수업",
    body: "코알라가 새 요원들에게 어인 공수도의 기본을 가르쳤다. 웃는 얼굴로 시작했지만 자세가 무너진 사람에게는 가차 없었다. 내 차례가 오자 코알라가 손바닥을 펴 들고, 여기를 쳐 보라고 했다.",
    choices: [
      { id: "strike", label: "힘껏 손바닥을 친다", hint: "사범의 손은 단단하다",
        check: { stat: "health", against: 55 }, personality: { ambition: 6 },
        outcomes: {
          great: { text: "코알라의 손바닥이 아주 조금 뒤로 밀렸다. 코알라가 오 하고 놀라더니 다음 수업에서 시범 상대로 나를 불렀다.", effects: { skill: 12, trust: 6 } },
          good: { text: "손이 얼얼했지만 코알라가 힘은 있으니 흐름만 익히면 된다고 했다.", effects: { skill: 6, health: -2 } },
          bad: { text: "손목이 꺾였다. 코알라가 붕대를 감아 주며 힘으로만 치니까 그렇다고 혀를 찼다.", effects: { health: -9, skill: 2 } }
        } },
      { id: "flow", label: "먼저 흐름을 묻고 천천히 친다", hint: "배우는 자세를 보인다",
        check: { stat: "skill", against: 45 }, personality: { caution: 5, empathy: 3 },
        outcomes: {
          great: { text: "코알라가 웃으며 그걸 먼저 묻는 사람은 드물다고 했다. 수업이 끝난 뒤에도 따로 남아 동작을 봐 주었다.", effects: { skill: 10, friendBond: 8 } },
          good: { text: "코알라가 자세 하나를 고쳐 주었다. 다음 날 아침 그 자세로 몸이 저절로 움직였다.", effects: { skill: 6 } },
          bad: { text: "너무 천천히 쳐서 코알라가 장난하냐고 물었다. 그날 훈련량이 두 배가 되었다.", effects: { health: -6 } }
        } }
    ]
  },
  {
    id: "dragon_report", person: "몽키 D. 드래곤", paths: ["liberator"], art: "workbench",
    title: "돌아온 보고서",
    body: "내가 쓴 해방 작전 보고서가 드래곤의 손을 거쳐 돌아왔다. 한 줄에만 표시가 있었다. 그 섬 사람들이 작전 뒤에 어떻게 살아가는지 적혀 있지 않다는 것이었다. 드래곤은 다시 다녀오라는 말 없이 지도를 내 앞에 놓았다.",
    choices: [
      { id: "return", label: "직접 그 섬에 다시 다녀온다", hint: "먼 길과 위험을 감수한다",
        check: { stat: "supplies", against: 55 }, personality: { empathy: 7, loyalty: 3 },
        outcomes: {
          great: { text: "섬 사람들과 한 달을 함께 지내며 새 보고서를 썼다. 드래곤은 그것을 받아 들고 처음으로 고개를 끄덕였다.", effects: { trust: 14, skill: 6, supplies: -4 } },
          good: { text: "다녀오는 길은 고되었지만 빈칸은 채웠다. 드래곤은 말없이 보고서를 받아 갔다.", effects: { trust: 6, supplies: -6 } },
          bad: { text: "가는 길에 해군 순찰선에 쫓겨 돌아왔다. 빈칸은 그대로였고 물자만 잃었다.", effects: { supplies: -14, health: -6 } }
        } },
      { id: "ask_locals", label: "섬에서 온 연락원들에게 물어 채운다", hint: "빠르지만 남의 눈을 빌린다",
        check: { stat: "trust", against: 45 }, personality: { caution: 5 },
        outcomes: {
          great: { text: "연락원들이 생각보다 많은 것을 알려 주었다. 드래곤은 보고서를 읽고 그 연락원들의 이름까지 적어 두라고 했다.", effects: { trust: 10, friendBond: 6 } },
          good: { text: "빈칸은 채웠지만 어딘가 남의 이야기 같았다. 드래곤은 아무 말도 하지 않았다.", effects: { trust: 4 } },
          bad: { text: "연락원의 말이 틀렸다. 드래곤의 침묵이 이번에는 무겁게 느껴졌다.", effects: { trust: -8 } }
        } }
    ]
  },
  {
    id: "sabo_koala_plan", person: "사보", paths: ["liberator"], art: "workbench",
    title: "참모의 작전 회의",
    body: "작전 회의 도중 사보가 혼자 적진 한가운데로 들어가겠다고 했다. 코알라가 탁자를 치며 또 그런다고 화를 냈다. 두 사람의 눈이 동시에 회의 기록을 맡은 내게 향했다. 어느 쪽 편을 드느냐고 묻는 눈이었다.",
    choices: [
      { id: "koala", label: "코알라 편을 들어 다른 길을 낸다", hint: "참모총장의 고집을 꺾어야 한다",
        check: { stat: "skill", against: 60 }, personality: { caution: 6, empathy: 3 },
        outcomes: {
          great: { text: "내가 그린 우회로를 보고 사보가 머리를 긁으며 이게 낫겠다고 했다. 코알라가 몰래 엄지를 들어 보였다.", effects: { skill: 10, trust: 10 } },
          good: { text: "사보는 마지못해 받아들였다. 대신 맨 앞에는 자기가 서겠다고 우겼다.", effects: { trust: 5 } },
          bad: { text: "내 계획에 구멍이 있었다. 사보가 그 구멍을 하나씩 짚었고, 코알라마저 한숨을 쉬었다.", effects: { trust: -6, skill: 2 } }
        } },
      { id: "sabo", label: "사보와 함께 들어가겠다고 나선다", hint: "크게 얻거나 크게 다친다",
        check: { stat: "health", against: 65 }, personality: { freedom: 6, loyalty: 4, caution: -5 },
        outcomes: {
          great: { text: "사보가 크게 웃으며 좋다고 했다. 작전은 성공했고, 돌아온 둘은 코알라에게 나란히 꾸중을 들었다.", effects: { skill: 12, friendBond: 10, health: -4 } },
          good: { text: "작전은 끝났지만 몸 곳곳이 멍투성이였다. 코알라가 붕대를 감아 주며 다음엔 말리라고 했다.", effects: { skill: 6, health: -8 } },
          bad: { text: "적진에서 부상을 입고 사보의 등에 업혀 나왔다. 코알라는 한동안 내 얼굴을 보지 않았다.", effects: { health: -15, friendBond: 3 } }
        } }
    ]
  }
];
