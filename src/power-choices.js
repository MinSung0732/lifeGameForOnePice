// Power-specific choices per mishap/danger: `fruit` for devil-fruit users, `haki` for haki users,
// `nonuser` for people without a fruit. `{power}` in fruit texts is replaced with FRUIT_POWER[fruit].
export const FRUIT_POWER = {
  "고무고무 열매": "팔다리를 고무처럼 길게 늘려",
  "이글이글 열매": "온몸에서 불꽃을 일으켜",
  "꽃꽃 열매": "주위에 수많은 손을 피워 내",
  "수술수술 열매": "푸른 막을 펼쳐 공간을 갈라",
  "동강동강 열매": "몸을 조각조각 나누어 날려",
  "어둠어둠 열매": "손바닥에 어둠을 끌어모아",
  "고요고요 열매": "주위의 소리를 모조리 지워",
  "쿠릉쿠릉 열매": "푸른 번개를 휘감아 전류를 뿜어",
  "얼음얼음 열매": "차가운 냉기로 주위를 순식간에 얼려",
  "모래모래 열매": "몸을 거센 모래바람으로 풀어",
  "번쩍번쩍 열매": "눈부신 빛의 속도로 몸을 날려",
  "뭉게뭉게 열매": "짙은 하얀 연기를 뿜어 몸을 늘려",
  "눈눈 열매": "매서운 눈보라를 일으켜 시야를 덮어",
  "가스가스 열매": "보랏빛 가스로 몸을 띄워 퍼뜨려",
  "흔들흔들 열매": "허공을 강타해 거대한 진동을 일으켜",
  "실실 열매": "보이지 않는 예리한 실을 사방에 뻗어",
  "떡떡 열매": "차지고 단단한 떡으로 팔을 키워",
  "도르도르 열매": "강철처럼 굳는 하얀 밀랍을 빚어내",
  "새새 열매 모델 불사조": "재생의 푸른 불꽃 날개를 펼쳐"
};

export const POWER_CHOICES = {
  mishap_feast: {
    fruit: { label: "[열매] 능력으로 고기를 낚아챈다", hint: "모두의 눈이 쏠림", check: { stat: "skill", against: 45 }, personality: { ambition: 5, freedom: 4 },
      outcomes: {
        great: { text: "{power} 갑판 건너편의 고기 덩이를 단숨에 낚아챘다. 동료들은 항의하다가 결국 박수를 쳤고, 고기는 다 함께 나눠 먹었다.", effects: { health: 8, friendBond: 12 } },
        good: { text: "{power} 고기 끝자락을 겨우 붙잡았다. 절반은 빼앗겼지만 남은 것만으로도 배가 불렀다.", effects: { health: 5 } },
        bad: { text: "능력을 쓰려다 힘 조절을 잘못해 고기가 통째로 바다에 빠졌다. 밤새 모두의 원망 섞인 눈길을 받았다.", effects: { friendBond: -12, health: -3 } } } },
    haki: { kind: "observation", label: "[패기] 기척을 읽고 빈틈을 노린다", hint: "모두의 손이 빠름", check: { stat: "skill", against: 50 }, personality: { caution: 3, ambition: 4 },
      outcomes: {
        great: { text: "견문색으로 모두의 손이 움직일 순간을 읽었다. 단 한 번의 빈틈에 고기를 집어 들자 갑판 전체가 탄성을 질렀다.", effects: { health: 8, friendBond: 10 } },
        good: { text: "기척은 읽었지만 손이 반 박자 늦었다. 그래도 뼈에 붙은 살점을 넉넉히 뜯어 먹었다.", effects: { health: 4, friendBond: 2 } },
        bad: { text: "기척에 집중하느라 눈을 감은 사이 고기가 사라졌다. 동료들은 수련이 부족하다며 밤새 놀려 댔다.", effects: { friendBond: -8, health: -6 } } } }
  },
  mishap_poster_photo: {
    fruit: { label: "[열매] 능력을 뽐내며 다시 찍힌다", hint: "더 멋지게 찍힐지도", check: { stat: "skill", against: 40 }, personality: { freedom: 6, ambition: 4 },
      outcomes: {
        great: { text: "{power} 항구 한가운데서 근사한 자세를 잡았다. 몰래 찍힌 사진이 신문에 실리자 수배서보다 그쪽이 더 유명해졌다.", effects: { trust: 10, friendBond: 8 } },
        good: { text: "{power} 자세를 잡았지만 셔터가 한 박자 늦었다. 그래도 재채기 사진보다는 훨씬 나았다.", effects: { friendBond: 5 } },
        bad: { text: "힘을 과시하다 항구 상점의 간판을 부숴 버렸다. 수리비를 물어 주고 나니 남은 것은 또 한 장의 우스운 사진뿐이었다.", effects: { supplies: -12, trust: -4 } } } },
    haki: { kind: "observation", label: "[패기] 기척을 숨기고 사진사를 찾는다", hint: "범인을 만날지도", check: { stat: "skill", against: 45 }, personality: { caution: 3, freedom: 4 },
      outcomes: {
        great: { text: "견문색으로 사진사의 기척을 쫓아 해군 지부 뒤편 창고를 찾아냈다. 원본을 바꿔 치우고 나오는 길에 사진사와 악수까지 나눴다.", effects: { skill: 10, friendBond: 8 } },
        good: { text: "사진사를 찾아냈지만 원본은 이미 본부로 보내진 뒤였다. 대신 사진사가 미안하다며 말린 생선 한 꾸러미를 쥐여 주었다.", effects: { supplies: 5 } },
        bad: { text: "기척을 숨겼다고 믿었지만 지부 앞 개가 먼저 짖었다. 해병들에게 쫓기다 수배서 앞에서 또 넘어졌다.", effects: { health: -10, trust: -5 } } } }
  },
  mishap_drinking: {
    fruit: { label: "[열매] 능력으로 몰래 잔을 비운다", hint: "들키면 큰일", check: { stat: "skill", against: 50 }, personality: { freedom: 5, caution: -3 },
      outcomes: {
        great: { text: "{power} 상대의 눈을 피해 잔을 바닥 틈으로 흘려보냈다. 터줏대감이 먼저 쓰러지자 술집 주인이 판돈을 통째로 건넸다.", effects: { supplies: 15, trust: 5 } },
        good: { text: "{power} 몇 잔은 몰래 비웠지만 나머지는 정직하게 마셨다. 무승부로 끝나 술값은 반씩 냈다.", effects: { supplies: 4 } },
        bad: { text: "능력을 쓰다 잔을 엎어 터줏대감의 머리에 술을 쏟았다. 술값에 수리비까지 물고 술집에서 쫓겨났다.", effects: { supplies: -12, trust: -5 } } } },
    haki: { kind: "conqueror", label: "[패기] 패기로 상대의 기세를 꺾는다", hint: "기세 싸움", check: { stat: "health", against: 50 }, personality: { ambition: 6 },
      outcomes: {
        great: { text: "무장색으로 몸을 다잡고 잔을 비울 때마다 상대의 눈을 똑바로 쏘아보았다. 기세에 눌린 터줏대감이 잔을 내려놓고 항복했다.", effects: { supplies: 14, trust: 6 } },
        good: { text: "기세로는 이겼지만 술로는 비겼다. 터줏대감이 어깨를 두드리며 다음에 다시 겨루자고 했다.", effects: { trust: 5 } },
        bad: { text: "패기를 끌어올리다 취기까지 함께 올라왔다. 탁자 위에서 춤을 추다 떨어진 기억만 희미하게 남았다.", effects: { health: -8, supplies: -8 } } } }
  },
  mishap_upside_map: {
    fruit: { label: "[열매] 능력으로 높은 곳에서 길을 찾는다", hint: "바다에 떨어질 수도", check: { stat: "skill", against: 45 }, personality: { freedom: 4, ambition: 3 },
      outcomes: {
        great: { text: "{power} 돛대 꼭대기에 올라 수평선을 살폈다. 멀리 낯선 섬과 해류의 흐름이 한눈에 들어와 지름길까지 찾아냈다.", effects: { skill: 10, supplies: 8 } },
        good: { text: "{power} 돛대 위에 올랐지만 안개가 짙었다. 섬의 방향만 겨우 짐작해 하루를 더 돌아 항로로 돌아왔다.", effects: { skill: 5 } },
        bad: { text: "돛대 위에서 균형을 잃고 바다로 떨어졌다. 힘이 빠진 몸이 가라앉는 사이 동료가 뛰어들어 끌어올렸지만 식량 상자도 함께 떠내려갔다.", effects: { health: -8, supplies: -8 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 바다의 기척을 읽는다", hint: "막연한 감각", check: { stat: "skill", against: 50 }, personality: { caution: 4 },
      outcomes: {
        great: { text: "눈을 감고 바다 너머의 기척을 더듬었다. 먼 섬의 갈매기 떼와 사람들의 숨결이 느껴져 곧장 그쪽으로 뱃머리를 돌렸다.", effects: { skill: 12, supplies: 6 } },
        good: { text: "희미한 기척 하나를 따라갔더니 작은 어촌이 나왔다. 길을 묻고 물을 채워 다시 떠났다.", effects: { supplies: 5 } },
        bad: { text: "기척인 줄 알고 따라간 것은 거대한 고래 떼였다. 고래들 사이를 빠져나오느라 배 옆구리가 깨졌다.", effects: { supplies: -10, health: -5 } } } }
  },
  mishap_marine_kitchen: {
    fruit: { label: "[열매] 능력으로 담장 너머 고기를 훔친다", hint: "기지 한복판", check: { stat: "skill", against: 50 }, personality: { freedom: 6, caution: -5 },
      outcomes: {
        great: { text: "{power} 담장 너머 석쇠 위의 고기를 하나씩 집어 왔다. 해병들은 고기가 사라질 때마다 서로를 의심했다.", effects: { supplies: 15, friendBond: 6 } },
        good: { text: "{power} 고기 몇 점을 겨우 챙겼다. 동료들과 한 입씩 나누니 허기는 조금 가셨다.", effects: { supplies: 5 } },
        bad: { text: "능력을 쓰다 해루석 철망에 닿아 온몸의 힘이 쭉 빠졌다. 철망에 매달린 채 해병들에게 들켜 겨우 도망쳤다.", effects: { health: -12, supplies: -4 } } } },
    haki: { kind: "observation", label: "[패기] 순찰의 기척을 피해 숨어든다", hint: "발소리를 읽음", check: { stat: "skill", against: 50 }, personality: { caution: 3, freedom: 4 },
      outcomes: {
        great: { text: "견문색으로 순찰병의 발소리를 미리 읽고 빈 복도만 골라 걸었다. 주방에서 고기 한 바구니를 들고 나올 때까지 아무도 마주치지 않았다.", effects: { supplies: 14, skill: 6 } },
        good: { text: "순찰은 피했지만 주방장의 기척은 놓쳤다. 고기 대신 감자 한 자루를 들고 나왔다.", effects: { supplies: 5 } },
        bad: { text: "기척에만 집중하다 바닥의 국자를 밟았다. 요란한 소리에 기지 전체가 깨어 담장을 넘어 도망쳤다.", effects: { health: -10, supplies: -6 } } } },
    nonuser: { label: "[비능력자] 수문으로 헤엄쳐 들어간다", hint: "물속은 차가움", check: { stat: "health", against: 45 }, personality: { freedom: 5, caution: -3 },
      outcomes: {
        great: { text: "기지 아래 수문으로 헤엄쳐 들어가 식료품 창고 바로 밑에서 고개를 내밀었다. 젖은 몸으로 고기 상자를 끌고 다시 물속으로 사라졌다.", effects: { supplies: 14, friendBond: 6 } },
        good: { text: "수문은 찾았지만 창고는 비어 있었다. 대신 물에 떠다니던 통조림 몇 개를 건져 왔다.", effects: { supplies: 5 } },
        bad: { text: "물속 철창에 옷이 걸려 한참을 버둥거렸다. 겨우 빠져나왔을 때는 이가 덜덜 떨렸고 감기가 오래갔다.", effects: { health: -14 } } } }
  },
  mishap_treasure_map: {
    fruit: { label: "[열매] 능력으로 장사꾼을 붙잡는다", hint: "도망치기 전에", check: { stat: "skill", against: 45 }, personality: { ambition: 4, empathy: 2 },
      outcomes: {
        great: { text: "{power} 골목 끝으로 달아나던 장사꾼의 발목을 붙잡았다. 진짜 보물이 묻힌 곳을 털어놓게 하자 낡은 상자 하나가 나왔다.", effects: { supplies: 15, trust: 6 } },
        good: { text: "{power} 장사꾼을 붙잡았지만 진짜 보물은 없었다. 대신 그동안 받아 챙긴 돈을 사람들에게 돌려주게 했다.", effects: { trust: 6 } },
        bad: { text: "능력을 휘두르다 골목의 과일 수레를 엎었다. 장사꾼은 소란을 틈타 사라졌고 과일값은 고스란히 떠안았다.", effects: { supplies: -12, trust: -4 } } } },
    haki: { kind: "observation", label: "[패기] 거짓말의 기척을 읽는다", hint: "속마음이 보일지도", check: { stat: "skill", against: 45 }, personality: { caution: 4 },
      outcomes: {
        great: { text: "견문색으로 장사꾼의 속마음을 더듬자 품속에 감춘 진짜 지도가 느껴졌다. 가짜 지도와 바꿔 들고 나와 정말로 금화를 찾아냈다.", effects: { supplies: 16, skill: 4 } },
        good: { text: "거짓말이라는 것만은 확실히 읽었다. 지도를 사지 않고 돌아서자 장사꾼이 아쉬운 듯 혀를 찼다.", effects: { skill: 5 } },
        bad: { text: "기척을 읽는다고 오래 노려보다 장사꾼의 패거리에게 둘러싸였다. 지갑을 털리고 골목 밖으로 내쫓겼다.", effects: { supplies: -12, health: -5 } } } }
  },
  mishap_giant_fish: {
    fruit: { label: "[열매] 능력으로 괴물을 끌어 올린다", hint: "물가는 위험", check: { stat: "skill", against: 50 }, personality: { ambition: 7, caution: -4 },
      outcomes: {
        great: { text: "{power} 낚싯줄째 괴물을 수면 위로 끌어 올렸다. 갑판에 떨어진 생선은 배 길이만 했고 동료들은 한 달 내내 생선 요리를 먹었다.", effects: { supplies: 18, friendBond: 5 } },
        good: { text: "{power} 한동안 버텼지만 줄이 끊어지며 꼬리 한 토막만 남았다. 그래도 저녁 식탁은 넉넉했다.", effects: { supplies: 6 } },
        bad: { text: "괴물이 줄을 홱 당기자 몸이 바다로 끌려 들어갔다. 힘이 빠진 채 가라앉다 동료의 갈고리에 겨우 걸려 올라왔다.", effects: { health: -14, supplies: -4 } } } },
    haki: { kind: "armament", label: "[패기] 검게 물든 주먹을 내리꽂는다", hint: "한 방이면 될지도", check: { stat: "health", against: 50 }, personality: { ambition: 6 },
      outcomes: {
        great: { text: "무장색으로 검게 물든 주먹을 수면 위로 솟은 괴물의 머리에 내리꽂았다. 괴물은 기절한 채 떠올랐고 배에는 고기가 넘쳐 났다.", effects: { supplies: 16, skill: 5 } },
        good: { text: "주먹은 빗맞았지만 괴물은 겁을 먹고 낚싯바늘을 뱉었다. 바늘에 걸려 있던 작은 물고기들로 저녁을 차렸다.", effects: { supplies: 5 } },
        bad: { text: "괴물의 비늘이 생각보다 단단했다. 주먹이 얼얼한 사이 꼬리에 맞아 갑판을 굴렀다.", effects: { health: -14, supplies: -2 } } } },
    nonuser: { label: "[비능력자] 뛰어들어 작살을 꽂는다", hint: "헤엄칠 수 있다면", check: { stat: "health", against: 50 }, personality: { ambition: 5, caution: -6 },
      outcomes: {
        great: { text: "작살을 입에 물고 바다로 뛰어들었다. 괴물의 아가미 틈에 작살을 꽂고 떠오르자 동료들이 함성을 질렀다.", effects: { supplies: 16, friendBond: 6 } },
        good: { text: "작살은 꽂았지만 괴물이 몸부림치며 달아났다. 비늘 몇 장과 살점 하나를 건져 올렸다.", effects: { supplies: 5 } },
        bad: { text: "괴물의 꼬리에 휘말려 깊이 끌려 들어갔다. 숨이 끊어지기 직전에야 겨우 수면 위로 올라왔다.", effects: { health: -16 } } } }
  },
  mishap_disguise: {
    fruit: { label: "[열매] 능력으로 감시를 따돌린다", hint: "눈에 띄기 쉬움", check: { stat: "skill", against: 50 }, personality: { freedom: 6, caution: -4 },
      outcomes: {
        great: { text: "{power} 해병들의 시선을 엉뚱한 곳으로 돌려놓고 정문을 지나갔다. 항구 시장에서 넉넉히 장을 보고 돌아올 때까지 아무도 몰랐다.", effects: { supplies: 14, skill: 6 } },
        good: { text: "{power} 정문은 지났지만 뒤늦게 수상하다는 외침이 들렸다. 장은 반만 보고 서둘러 배로 돌아왔다.", effects: { supplies: 5 } },
        bad: { text: "능력을 쓰는 순간 해병 하나가 수배서와 얼굴을 번갈아 보았다. 해루석 그물을 피해 달아나느라 온몸이 긁혔다.", effects: { health: -12, supplies: -5 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 감시의 빈틈을 읽는다", hint: "교대 시간을 노림", check: { stat: "skill", against: 50 }, personality: { caution: 5 },
      outcomes: {
        great: { text: "해병들의 기척이 흐트러지는 교대 시간을 정확히 읽었다. 가짜 수염도 없이 정문을 지나 시장을 한 바퀴 돌고 나왔다.", effects: { supplies: 14, skill: 6 } },
        good: { text: "빈틈은 읽었지만 너무 짧았다. 필요한 물건 몇 가지만 사서 곧장 돌아왔다.", effects: { supplies: 5 } },
        bad: { text: "기척을 읽느라 걸음이 멈칫한 것이 오히려 수상해 보였다. 추격전 끝에 빠져나왔지만 물건은 하나도 사지 못했다.", effects: { health: -10, supplies: -6 } } } },
    nonuser: { label: "[비능력자] 부두 밑으로 헤엄쳐 들어간다", hint: "물에 젖을 각오", check: { stat: "health", against: 45 }, personality: { freedom: 4, caution: 2 },
      outcomes: {
        great: { text: "부두 아래 기둥 사이를 헤엄쳐 시장 뒤편 계단으로 올라섰다. 젖은 옷 그대로 장을 보고 같은 길로 유유히 돌아왔다.", effects: { supplies: 14, skill: 5 } },
        good: { text: "헤엄쳐 들어가는 데는 성공했지만 젖은 몰골이 눈에 띄었다. 서둘러 몇 가지만 사서 물속으로 돌아왔다.", effects: { supplies: 5 } },
        bad: { text: "부두 밑에서 해군 순찰선과 마주쳤다. 숨을 참고 기둥 뒤에 매달려 버티다 몸이 꽁꽁 얼었다.", effects: { health: -14 } } } }
  },
  mishap_odd_merchant: {
    fruit: { label: "[열매] 능력으로 물건을 시험해 본다", hint: "망가뜨릴 수도", check: { stat: "skill", against: 40 }, personality: { freedom: 5 },
      outcomes: {
        great: { text: "{power} 행상인의 상자를 하나씩 열어 진짜와 가짜를 가려냈다. 숨겨 둔 진짜 날씨 조개가 드러나자 행상인이 손을 들고 헐값에 넘겼다.", effects: { skill: 10, supplies: 8 } },
        good: { text: "{power} 물건을 시험하자 대부분 가짜로 드러났다. 행상인은 사과의 뜻으로 말린 과일 한 봉지를 내밀었다.", effects: { supplies: 5 } },
        bad: { text: "능력을 쓰다 행상인의 상자를 통째로 부숴 버렸다. 깨진 병값을 다 물어 주고 앵무새에게 욕까지 들었다.", effects: { supplies: -14, trust: -3 } } } },
    haki: { kind: "observation", label: "[패기] 앵무새의 속마음을 듣는다", hint: "말이 통할지도", check: { stat: "skill", against: 45 }, personality: { empathy: 5 },
      outcomes: {
        great: { text: "앵무새의 기척에 귀를 기울이자 겁에 질린 마음이 느껴졌다. 앵무새를 풀어 주자 행상인이 감동해 상자 속 가장 좋은 물건을 내주었다.", effects: { supplies: 12, friendBond: 6 } },
        good: { text: "앵무새가 정말 말을 할 줄 안다는 것만은 확인했다. 헐값에 사 온 앵무새는 동료들의 이름을 금세 외웠다.", effects: { friendBond: 5 } },
        bad: { text: "기척을 읽느라 넋을 놓은 사이 행상인이 지갑을 슬쩍 가져갔다. 정신을 차렸을 때는 상자도 사람도 없었다.", effects: { supplies: -14, skill: -2 } } } }
  },
  mishap_cake_thief: {
    fruit: { label: "[열매] 능력으로 범인을 덮친다", hint: "범인이 날아갈지도", check: { stat: "skill", against: 45 }, personality: { loyalty: 4, ambition: 3 },
      outcomes: {
        great: { text: "{power} 날아오르려던 갈매기를 공중에서 붙잡았다. 부리 끝의 크림과 날개 밑의 케이크 조각이 증거가 되어 기지에 웃음이 퍼졌다.", effects: { trust: 12, skill: 6 } },
        good: { text: "{power} 갈매기의 깃털 몇 가닥만 붙잡았다. 증거로는 모자랐지만 상관은 노력을 인정했다.", effects: { trust: 5 } },
        bad: { text: "능력을 휘두르다 상관의 책상을 뒤엎었다. 케이크 대신 기밀 서류가 바닥에 흩어져 벌로 화장실 청소를 맡았다.", effects: { trust: -12, health: -4 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 범인의 기척을 쫓는다", hint: "누군가 숨기고 있음", check: { stat: "skill", against: 45 }, personality: { caution: 4, loyalty: 3 },
      outcomes: {
        great: { text: "기지 안의 기척을 하나씩 더듬었다. 유난히 들뜬 기척을 따라가니 케이크를 숨긴 부관이 상관의 깜짝 파티를 준비하고 있었다.", effects: { trust: 12, friendBond: 6 } },
        good: { text: "수상한 기척은 찾았지만 정작 케이크는 이미 반쯤 사라진 뒤였다. 남은 조각만 상관에게 돌려주었다.", effects: { trust: 5 } },
        bad: { text: "엉뚱한 기척을 따라가 상관의 낮잠을 깨웠다. 범인 대신 단잠을 방해한 죄로 밤 당직이 늘었다.", effects: { trust: -8, health: -6 } } } }
  },
  mishap_silly_code: {
    fruit: { label: "[열매] 능력으로 몰래 신호를 보낸다", hint: "말 대신 다른 방법", check: { stat: "skill", against: 40 }, personality: { freedom: 5, caution: 2 },
      outcomes: {
        great: { text: "{power} 상대에게만 보이는 신호를 보냈다. 암호를 소리 내지 않고도 접선이 끝나 연락망에서 칭찬이 쏟아졌다.", effects: { trust: 12, skill: 6 } },
        good: { text: "{power} 신호를 보냈지만 상대가 한참 뒤에야 알아들었다. 어색한 침묵 끝에 접선은 무사히 끝났다.", effects: { trust: 5 } },
        bad: { text: "능력을 쓰는 모습을 항구 사람들이 전부 보고 말았다. 접선은커녕 구경꾼이 몰려들어 약속 장소를 옮겨야 했다.", effects: { trust: -12, supplies: -4 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 접선 상대를 찾는다", hint: "말이 필요 없을지도", check: { stat: "skill", against: 45 }, personality: { caution: 5, loyalty: 3 },
      outcomes: {
        great: { text: "인파 속에서 긴장한 기척 하나를 찾아냈다. 다가가 눈빛만 주고받자 상대가 고개를 끄덕였고 암호 없이도 접선이 끝났다.", effects: { trust: 12, skill: 6 } },
        good: { text: "상대를 찾긴 했지만 결국 암호는 말해야 했다. 둘 다 귀가 빨개진 채 서류를 주고받았다.", effects: { trust: 5 } },
        bad: { text: "긴장한 기척을 따라갔더니 해군 첩보원이었다. 엉뚱한 사람에게 암호를 말해 버려 연락망 전체가 몸을 숨겼다.", effects: { trust: -14, health: -4 } } } }
  },
  mishap_eating_contest: {
    fruit: { label: "[열매] 능력으로 그릇을 몰래 비운다", hint: "들키면 망신", check: { stat: "skill", against: 45 }, personality: { ambition: 5, freedom: 3 },
      outcomes: {
        great: { text: "{power} 심판의 눈을 피해 그릇을 비워 나갔다. 거한이 얼이 빠진 사이 그릇 탑이 하늘에 닿았고 마을 입구에 이름이 걸렸다.", effects: { trust: 14, health: 4 } },
        good: { text: "{power} 몇 그릇은 몰래 비웠지만 나머지는 정직하게 먹었다. 아슬아슬하게 비겨 거한과 우승을 나눴다.", effects: { trust: 5 } },
        bad: { text: "능력을 쓰다 심판에게 들켜 실격당했다. 마을 사람들은 고향의 명예를 더럽혔다며 한동안 눈을 흘겼다.", effects: { trust: -14, health: -2 } } } },
    haki: { kind: "conqueror", label: "[패기] 패기로 거한의 기를 꺾는다", hint: "먹기 전의 기세", check: { stat: "health", against: 50 }, personality: { ambition: 6, loyalty: 3 },
      outcomes: {
        great: { text: "첫 숟가락을 들기 전 패기를 실어 거한을 똑바로 바라보았다. 기가 꺾인 거한은 숟가락을 떨어뜨렸고 마을 전체가 환호했다.", effects: { trust: 14, friendBond: 6 } },
        good: { text: "기세 싸움은 팽팽했다. 그릇 수도 비슷해 결국 둘이 나란히 시상대에 올랐다.", effects: { trust: 5 } },
        bad: { text: "기세를 끌어올리느라 힘을 다 써 버렸다. 몇 그릇 먹지도 못하고 배를 움켜쥔 채 쓰러졌다.", effects: { health: -12, trust: -4 } } } }
  },
  mishap_mate_dream: {
    fruit: { label: "[열매] 능력으로 큰 고기를 잡아 준다", hint: "꿈을 앞당김", check: { stat: "skill", against: 45 }, personality: { empathy: 4, loyalty: 4 },
      outcomes: {
        great: { text: "{power} 지나가던 해왕류 한 마리를 갑판 위로 끌어 올렸다. 친구는 세상에서 제일 큰 고기라며 눈물을 글썽였고 둘은 밤새 고기를 구웠다.", effects: { friendBond: 14, supplies: 6 } },
        good: { text: "{power} 제법 큰 물고기를 잡아 왔다. 세상에서 제일 크지는 않았지만 친구는 꿈의 첫걸음이라며 웃었다.", effects: { friendBond: 5 } },
        bad: { text: "능력을 쓰다 갑판 끝에서 미끄러져 바다로 떨어졌다. 힘이 빠진 몸을 친구가 건져 올렸지만 꿈 이야기는 잔소리로 바뀌었다.", effects: { health: -10, friendBond: -5 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 큰 고기를 찾아 준다", hint: "바다 밑의 기척", check: { stat: "skill", against: 45 }, personality: { empathy: 4, loyalty: 3 },
      outcomes: {
        great: { text: "바다 밑의 기척을 더듬어 가장 큰 그림자를 찾아냈다. 둘이 함께 낚싯줄을 당겨 올린 고기는 갑판을 가득 채웠다.", effects: { friendBond: 14, supplies: 6 } },
        good: { text: "기척 하나를 따라 낚싯대를 드리웠다. 크지는 않았지만 둘이 나눠 먹기에는 충분했다.", effects: { friendBond: 5 } },
        bad: { text: "가장 큰 기척을 쫓았더니 거대한 해파리 떼였다. 둘 다 온몸을 쏘여 며칠을 앓았다.", effects: { health: -10, friendBond: -4 } } } }
  },
  mishap_fruit_show: {
    fruit: { label: "[열매] 능력으로 물 밖을 붙잡는다", hint: "힘이 빠지는 중", check: { stat: "skill", against: 55 }, personality: { ambition: 4, caution: -3 },
      outcomes: {
        great: { text: "{power} 마지막 힘을 짜내 부두 기둥을 붙잡았다. 물 밖으로 올라서자 아이들이 이것도 묘기냐며 손뼉을 쳤다.", effects: { trust: 12, skill: 6 } },
        good: { text: "{power} 부두 끝을 겨우 붙잡았다. 아이들이 줄을 던져 주어 간신히 기어 올라왔다.", effects: { trust: 5 } },
        bad: { text: "물속에서는 능력이 말을 듣지 않았다. 바닥까지 가라앉았다가 지나가던 어부의 그물에 걸려 올라왔다.", effects: { health: -15, trust: -3 } } } },
    haki: { kind: "observation", label: "[패기] 기척으로 가장 가까운 손을 찾는다", hint: "숨이 남았을 때", check: { stat: "skill", against: 50 }, personality: { caution: 4 },
      outcomes: {
        great: { text: "가라앉는 와중에도 기척을 더듬어 다가오는 어부의 손을 정확히 붙잡았다. 끌어올려진 뒤 아이들에게 바다 앞에서는 겸손하라고 일러 주었다.", effects: { trust: 12, skill: 6 } },
        good: { text: "기척은 읽었지만 손이 닿지 않았다. 한참 물을 먹은 뒤에야 동료에게 건져졌다.", effects: { trust: 5 } },
        bad: { text: "물속에서는 정신이 흐려져 기척이 하나도 잡히지 않았다. 의식을 잃은 채 건져져 하루를 꼬박 누워 지냈다.", effects: { health: -16 } } } }
  },
  mishap_haki_bet: {
    fruit: { label: "[열매] 능력까지 써서 간식을 찾는다", hint: "반칙일지도", check: { stat: "skill", against: 45 }, personality: { freedom: 5, ambition: 3 },
      outcomes: {
        great: { text: "{power} 손이 닿지 않는 곳까지 샅샅이 뒤졌다. 간식을 전부 찾아내자 동료들은 반칙이라면서도 당직을 대신 서 주었다.", effects: { friendBond: 12, health: 6 } },
        good: { text: "{power} 간식 몇 개를 찾았지만 마지막 하나는 끝내 못 찾았다. 당직은 반만 면제되었다.", effects: { friendBond: 5 } },
        bad: { text: "능력을 쓰다 화약통을 쓰러뜨렸다. 간식은커녕 갑판 청소와 밤 당직을 한꺼번에 떠안았다.", effects: { health: -8, friendBond: -6 } } } },
    haki: { kind: "observation+armament", label: "[패기] 두 가지 패기를 함께 끌어올린다", hint: "온 힘을 다함", check: { stat: "skill", against: 55 }, personality: { ambition: 6 },
      outcomes: {
        great: { text: "견문색과 무장색을 한꺼번에 끌어올리자 배 안의 기척이 손바닥처럼 펼쳐졌다. 간식을 전부 맞히고 동료들의 다음 장난까지 미리 말해 주었다.", effects: { friendBond: 12, skill: 8 } },
        good: { text: "간식 대부분을 찾아냈다. 마지막 하나는 요리사가 이미 먹어 치운 뒤였다.", effects: { friendBond: 5 } },
        bad: { text: "너무 무리하게 패기를 끌어올리다 코피가 터졌다. 간식은 동료들이 나눠 먹었고 당직은 그대로였다.", effects: { health: -12, friendBond: -4 } } } }
  },

  danger_sea_king: {
    fruit: { label: "[열매] 능력으로 해왕류를 붙잡는다", hint: "바다에 빠지면 끝", check: { stat: "skill", against: 60 }, personality: { ambition: 7, loyalty: 4, caution: -5 },
      outcomes: {
        great: { text: "{power} 해왕류의 턱을 붙잡아 그대로 바다에 내리꽂았다. 떠오른 거대한 몸뚱이는 한 달 치 식량이 되었고 항구마다 소문이 퍼졌다.", effects: { supplies: 14, trust: 8 } },
        good: { text: "{power} 해왕류의 아가리를 비껴 냈다. 해왕류는 비늘 몇 장을 남기고 깊은 바다로 사라졌다.", effects: { skill: 5 } },
        bad: { text: "능력이 닿기 전에 해왕류의 꼬리가 갑판을 쳤다. 바다에 떨어진 몸에서 힘이 빠져나갔고 동료들이 밧줄로 겨우 끌어올렸다.", effects: { health: -18 } } } },
    haki: { kind: "armament", label: "[패기] 패기로 해왕류에 맞선다", hint: "기세가 통할지도", check: { stat: "skill", against: 60 }, personality: { ambition: 6, caution: -3 },
      outcomes: {
        great: { text: "무장색으로 검게 물든 주먹이 해왕류의 미간에 꽂혔다. 거대한 몸이 천천히 가라앉자 동료들이 뱃머리로 몰려와 함성을 질렀다.", effects: { supplies: 12, trust: 8 } },
        good: { text: "견문색으로 아가리가 닫히는 순간을 읽고 뱃머리를 돌렸다. 해왕류는 허공을 물고 물러났다.", effects: { skill: 5 } },
        bad: { text: "기세를 끌어올렸지만 해왕류는 물러서지 않았다. 이빨이 어깨를 스치며 깊은 상처를 남겼다.", effects: { health: -18 } } } },
    nonuser: { label: "[비능력자] 바다로 뛰어들어 시선을 끈다", hint: "헤엄칠 수 있음", check: { stat: "health", against: 55 }, personality: { loyalty: 7, caution: -6 },
      outcomes: {
        great: { text: "바다로 뛰어들어 해왕류의 눈앞을 헤엄쳐 가로질렀다. 해왕류가 쫓아오는 사이 배는 멀리 빠져나갔고, 바위섬에 숨었다가 동료들의 밧줄을 잡았다.", effects: { friendBond: 14, trust: 6 } },
        good: { text: "해왕류의 시선을 끄는 데는 성공했다. 배가 빠져나간 뒤 한참을 헤엄쳐 겨우 올라탔다.", effects: { friendBond: 5 } },
        bad: { text: "해왕류가 일으킨 소용돌이에 휘말렸다. 바닷속에서 정신을 잃었다가 동료들에게 건져졌다.", effects: { health: -18 } } } }
  },
  danger_storm: {
    fruit: { label: "[열매] 능력으로 돛과 동료를 붙든다", hint: "바다는 적", check: { stat: "skill", against: 55 }, personality: { loyalty: 6, caution: -3 },
      outcomes: {
        great: { text: "{power} 찢어지려던 돛과 휩쓸리던 동료를 한꺼번에 붙들었다. 폭풍이 지나간 새벽, 갑판 위에서 빠진 사람은 아무도 없었다.", effects: { friendBond: 12, skill: 8 } },
        good: { text: "{power} 돛은 놓쳤지만 동료 하나를 붙잡아 배 안으로 끌어들였다. 배는 기우뚱한 채 폭풍을 빠져나왔다.", effects: { friendBond: 5 } },
        bad: { text: "거대한 파도가 갑판을 덮쳤다. 바닷물을 뒤집어쓰자 능력은커녕 몸을 가눌 힘도 사라져 돛대에 묶인 채 밤을 버텼다.", effects: { health: -16, supplies: -4 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 파도의 길을 읽는다", hint: "한순간의 판단", check: { stat: "skill", against: 55 }, personality: { caution: 4, loyalty: 4 },
      outcomes: {
        great: { text: "다가오는 파도의 기척을 하나씩 읽어 키를 꺾었다. 배는 폭풍의 틈새로 미끄러지듯 빠져나갔다.", effects: { skill: 12, supplies: 8 } },
        good: { text: "몇 번의 큰 파도는 피했지만 마지막 파도에 짐 몇 개를 잃었다. 그래도 모두 살아남았다.", effects: { skill: 5 } },
        bad: { text: "폭풍의 기척이 너무 커서 아무것도 읽히지 않았다. 키를 놓친 사이 파도에 휩쓸려 갑판에 부딪혔다.", effects: { health: -16, supplies: -4 } } } },
    nonuser: { label: "[비능력자] 바다에 빠진 동료를 건진다", hint: "헤엄칠 수 있음", check: { stat: "health", against: 55 }, personality: { loyalty: 8, empathy: 6, caution: -5 },
      outcomes: {
        great: { text: "밧줄을 허리에 감고 검은 바다로 뛰어들었다. 휩쓸리던 동료들을 차례로 붙잡아 끌어올리자 배 위에서 울음 섞인 웃음이 터졌다.", effects: { friendBond: 16, trust: 4 } },
        good: { text: "동료 하나를 붙잡아 밧줄을 쥐여 주었다. 둘 다 바닷물을 잔뜩 먹었지만 살아 돌아왔다.", effects: { friendBond: 6 } },
        bad: { text: "파도가 밧줄을 끊었다. 한참을 떠다니다 부서진 판자에 매달려 아침을 맞았다.", effects: { health: -18 } } } }
  },
  danger_poison: {
    fruit: { label: "[열매] 능력으로 범인을 쫓는다", hint: "몸이 버틸 때", check: { stat: "health", against: 50 }, personality: { ambition: 4, caution: -4 },
      outcomes: {
        great: { text: "{power} 골목 끝으로 달아나던 범인의 앞을 막아섰다. 품속의 해독제를 빼앗아 마시자 감각이 돌아왔고, 범인은 자경단에 넘겨졌다.", effects: { trust: 12, health: 6 } },
        good: { text: "{power} 범인을 붙잡았지만 해독제는 반 병뿐이었다. 사흘을 앓은 끝에 겨우 일어났다.", effects: { health: 4 } },
        bad: { text: "능력을 쓰자 독이 더 빨리 퍼졌다. 범인을 놓친 채 길바닥에 쓰러져 동료들에게 업혀 갔다.", effects: { health: -18 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 범인의 기척을 쫓는다", hint: "시간이 없음", check: { stat: "skill", against: 55 }, personality: { caution: 3, ambition: 4 },
      outcomes: {
        great: { text: "흐려지는 의식 속에서도 범인의 기척을 붙잡았다. 숨어 있던 창고에서 해독제를 받아 내고 범인의 배후까지 알아냈다.", effects: { trust: 10, skill: 8 } },
        good: { text: "범인의 기척을 쫓아 해독제의 이름만 알아냈다. 의원이 같은 약을 구해 와 열흘 만에 일어났다.", effects: { health: 4 } },
        bad: { text: "기척을 쫓다 의식을 잃었다. 낯선 골목에서 깨어났을 때는 몸 곳곳이 마비되어 있었다.", effects: { health: -18 } } } },
    nonuser: { label: "[비능력자] 바닷물을 들이켜 독을 게운다", hint: "거친 민간요법", check: { stat: "health", against: 55 }, personality: { caution: -3, freedom: 4 },
      outcomes: {
        great: { text: "부두로 달려가 짠 바닷물을 들이켜고 먹은 것을 모조리 게워 냈다. 독이 퍼지기 전에 빠져나가 이튿날 아침 멀쩡히 일어났다.", effects: { health: 12, skill: 6 } },
        good: { text: "독의 절반은 토해 냈다. 남은 독으로 며칠을 앓았지만 목숨은 건졌다.", effects: { health: 4 } },
        bad: { text: "바닷물을 너무 많이 마셔 오히려 몸이 축났다. 독과 탈수가 겹쳐 한동안 일어나지 못했다.", effects: { health: -18 } } } }
  },
  danger_capture: {
    fruit: { label: "[열매] 능력으로 포위망을 무너뜨린다", hint: "해루석에 주의", check: { stat: "skill", against: 65 }, personality: { ambition: 7, freedom: 6, caution: -6 },
      outcomes: {
        great: { text: "{power} 포위망의 가장 두꺼운 곳을 정면으로 무너뜨렸다. 갈라진 틈으로 동료들이 모두 빠져나갔고 다음 날 신문에 탈출 장면이 크게 실렸다.", effects: { trust: 10, friendBond: 10 } },
        good: { text: "{power} 작은 틈을 내고 빠져나왔다. 쫓기는 동안 상처를 입었지만 바다까지는 닿았다.", effects: { friendBond: 5 } },
        bad: { text: "해루석 그물이 날아와 몸을 감쌌다. 힘이 쭉 빠진 채 끌려가다 동료들이 그물을 끊어 겨우 빼냈다.", effects: { health: -14, supplies: -6 } } } },
    haki: { kind: "conqueror", label: "[패기] 패기로 추격대를 압도한다", hint: "기세로 가르는 길", check: { stat: "skill", against: 65 }, personality: { ambition: 8, freedom: 5 },
      outcomes: {
        great: { text: "무장색을 두른 주먹으로 포탄을 쳐 내며 앞으로 나아갔다. 견문색으로 읽은 빈틈을 따라 동료들과 함께 바다로 빠져나왔다.", effects: { trust: 10, friendBond: 10 } },
        good: { text: "포탄 몇 발은 막아 냈지만 결국 숲으로 물러섰다. 밤이 깊어서야 느슨해진 포위의 틈으로 빠져나왔다.", effects: { skill: 5 } },
        bad: { text: "추격대의 지휘관도 패기를 썼다. 정면으로 부딪친 끝에 갈비뼈가 부러진 채 숲으로 도망쳤다.", effects: { health: -18 } } } },
    nonuser: { label: "[비능력자] 바다로 뛰어들어 잠수한다", hint: "해루석도 소용없음", check: { stat: "health", against: 55 }, personality: { freedom: 7, caution: -3 },
      outcomes: {
        great: { text: "절벽에서 바다로 뛰어들어 오래 숨을 참았다. 해루석 그물도 능력자를 잡는 덫도 소용이 없었다. 포위망 바깥에서 떠올라 동료들의 배에 올랐다.", effects: { trust: 8, friendBond: 10 } },
        good: { text: "물속으로 빠져나가는 데는 성공했다. 차가운 바다를 오래 헤엄친 끝에 작은 무인도에 닿았다.", effects: { skill: 5 } },
        bad: { text: "물속에 쳐 둔 그물에 걸렸다. 겨우 칼로 끊고 나왔지만 폐에 물이 차 한참을 쿨럭였다.", effects: { health: -18 } } } }
  },
  danger_duel: {
    fruit: { label: "[열매] 능력으로 검을 받아 낸다", hint: "검객도 대비했을 것", check: { stat: "skill", against: 65 }, personality: { ambition: 7, caution: -5 },
      outcomes: {
        great: { text: "{power} 검객의 마지막 일격을 정면으로 받아 냈다. 검이 튕겨 나가자 검객은 무릎을 꿇고 오랜만에 진짜 강자를 만났다며 웃었다.", effects: { trust: 14, skill: 8 } },
        good: { text: "{power} 몇 합을 버텼고 승부는 나지 않았다. 검객은 다음에 다시 오겠다며 검을 거뒀다.", effects: { skill: 5 } },
        bad: { text: "검객의 검에는 해루석이 박혀 있었다. 칼날이 스치는 순간 힘이 빠졌고 깊은 상처를 안고 쓰러졌다.", effects: { health: -18 } } } },
    haki: { kind: "armament", label: "[패기] 무장색으로 칼날을 맞받는다", hint: "패기와 패기", check: { stat: "skill", against: 65 }, personality: { ambition: 8, caution: -4 },
      outcomes: {
        great: { text: "무장색을 두른 팔로 칼날을 맞받고 견문색으로 다음 일격을 읽었다. 검이 부러지자 부두의 구경꾼들이 숨을 삼켰다.", effects: { trust: 14, skill: 8 } },
        good: { text: "패기와 검이 부딪칠 때마다 불꽃이 튀었다. 해가 질 때까지 승부가 나지 않아 둘은 이름을 주고받고 헤어졌다.", effects: { skill: 5 } },
        bad: { text: "검객의 검에도 패기가 실려 있었다. 막아 낸 팔 위로 칼날이 파고들어 오래 남을 상처가 생겼다.", effects: { health: -18 } } } }
  },
  danger_mutiny: {
    fruit: { label: "[열매] 능력으로 반란자들을 제압한다", hint: "바다로 밀리면 끝", check: { stat: "skill", against: 60 }, personality: { ambition: 6, empathy: -3 },
      outcomes: {
        great: { text: "{power} 무기를 든 선원들을 한꺼번에 제압했다. 칼 한 자루 휘두르지 않고 끝난 반란에 선원들은 선장을 다시 보았다.", effects: { trust: 10, friendBond: 10 } },
        good: { text: "{power} 주동자 몇을 붙잡았다. 반란은 흩어졌지만 갑판의 공기는 한동안 무거웠다.", effects: { trust: 5 } },
        bad: { text: "누군가 등 뒤에서 몸을 밀었다. 바다에 떨어지자 힘이 빠졌고, 남은 충직한 선원들이 뛰어들어 건져 냈다.", effects: { health: -14, friendBond: -5 } } } },
    haki: { kind: "conqueror", label: "[패기] 패기를 터뜨려 반란을 잠재운다", hint: "기세로 누름", check: { stat: "skill", against: 60 }, personality: { ambition: 7, loyalty: 3 },
      outcomes: {
        great: { text: "온몸의 패기를 갑판 위에 터뜨렸다. 무기를 든 손들이 하나둘 떨렸고 선원들은 칼을 내려놓고 다시 고개를 숙였다.", effects: { trust: 12, friendBond: 8 } },
        good: { text: "기세에 눌린 선원 절반이 물러섰다. 남은 주동자만 붙잡아 다음 항구에 내려 주었다.", effects: { trust: 5 } },
        bad: { text: "패기를 버텨 낸 선원이 생각보다 많았다. 칼끝이 옆구리를 스쳤고 선장실 문을 걸어 잠근 채 밤을 새웠다.", effects: { health: -16, friendBond: -4 } } } },
    nonuser: { label: "[비능력자] 바다에 빠진 척 배 밑에 숨는다", hint: "물에 강한 몸", check: { stat: "health", against: 50 }, personality: { caution: 4, freedom: 4 },
      outcomes: {
        great: { text: "일부러 바다로 떨어진 척하고 배 밑을 헤엄쳐 선미로 올라왔다. 방심한 주동자를 뒤에서 붙잡자 반란은 순식간에 끝났다.", effects: { trust: 10, friendBond: 8 } },
        good: { text: "배 밑에 숨어 있다가 반란자들이 다투는 틈에 올라왔다. 반란은 저절로 흐지부지되었다.", effects: { trust: 5 } },
        bad: { text: "배 밑에서 숨이 모자라 일찍 떠올랐다. 갑판 위에서 기다리던 칼끝에 어깨를 베였다.", effects: { health: -16 } } } }
  },
  danger_plague: {
    fruit: { label: "[열매] 능력으로 환자를 실어 나른다", hint: "몸이 버텨야 함", check: { stat: "health", against: 55 }, personality: { empathy: 8 },
      outcomes: {
        great: { text: "{power} 쓰러진 사람들을 빠짐없이 의원 앞까지 옮겼다. 손이 모자라던 의원이 숨을 돌렸고 열병은 보름 만에 물러갔다.", effects: { trust: 16, friendBond: 4 } },
        good: { text: "{power} 환자 몇을 옮기고 약을 날랐다. 열병은 오래갔지만 항구 사람들은 지친 얼굴로 뛰어다니던 모습을 잊지 않았다.", effects: { trust: 6 } },
        bad: { text: "능력을 쉬지 않고 쓰다 몸이 먼저 무너졌다. 열병이 옮아 환자 옆 침상에 나란히 누웠다.", effects: { health: -18 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 위급한 환자를 찾는다", hint: "기척이 약한 쪽", check: { stat: "skill", against: 55 }, personality: { empathy: 8, caution: 2 },
      outcomes: {
        great: { text: "문이 닫힌 집들 사이에서 꺼져 가는 기척들을 찾아냈다. 가장 위급한 사람부터 의원에게 데려가 아무도 잃지 않았다.", effects: { trust: 16, skill: 4 } },
        good: { text: "기척이 약한 집 몇 곳을 찾아 의원에게 알렸다. 모두를 구하지는 못했지만 여럿이 살아났다.", effects: { trust: 6 } },
        bad: { text: "꺼져 가는 기척을 너무 많이 느낀 탓에 마음이 먼저 지쳤다. 열병까지 옮아 오래 앓았다.", effects: { health: -16, trust: -2 } } } }
  },
  danger_base_raid: {
    fruit: { label: "[열매] 능력으로 정문을 막아선다", hint: "해적도 능력자일지도", check: { stat: "skill", against: 60 }, personality: { loyalty: 7, ambition: 4 },
      outcomes: {
        great: { text: "{power} 정문으로 몰려드는 해적들을 한꺼번에 막아섰다. 해적단은 새벽이 오기 전에 물러났고 본부에서 이름을 물어 왔다.", effects: { trust: 14, skill: 6 } },
        good: { text: "{power} 정문은 지켰지만 창고 하나가 불탔다. 기지는 겨우 살아남았다.", effects: { trust: 5 } },
        bad: { text: "해적 선장이 해루석 사슬을 휘둘렀다. 사슬에 감기자 힘이 빠졌고 병사들이 끌어내 주었다.", effects: { health: -16, trust: -2 } } } },
    haki: { kind: "observation", label: "[패기] 견문색으로 기습의 흐름을 읽는다", hint: "다음 공격을 읽음", check: { stat: "skill", against: 60 }, personality: { loyalty: 6, caution: 3 },
      outcomes: {
        great: { text: "해적들이 다음에 노릴 곳을 하나씩 짚어 병사들을 보냈다. 기습은 번번이 막혔고 해적단은 빈손으로 물러났다.", effects: { trust: 14, skill: 6 } },
        good: { text: "몇 번의 기습은 읽어 냈지만 마지막 한 번을 놓쳤다. 기지는 지켰지만 부상자가 늘었다.", effects: { trust: 5 } },
        bad: { text: "기척이 너무 많아 머리가 깨질 듯 아팠다. 판단이 늦어진 사이 해적의 칼에 등을 베였다.", effects: { health: -16, trust: -2 } } } },
    nonuser: { label: "[비능력자] 헤엄쳐 해적선의 닻줄을 끊는다", hint: "물속은 비어 있음", check: { stat: "health", against: 55 }, personality: { freedom: 4, loyalty: 5, caution: -4 },
      outcomes: {
        great: { text: "어둠을 틈타 바다로 들어가 해적선의 닻줄을 끊었다. 배가 떠밀려 가자 해적들이 허둥지둥 돌아섰고 기지는 지켜졌다.", effects: { trust: 14, skill: 6 } },
        good: { text: "닻줄 하나는 끊었지만 해적선은 버텼다. 그래도 해적들의 발이 묶여 기지가 숨을 돌렸다.", effects: { trust: 5 } },
        bad: { text: "해적선의 감시꾼에게 들켰다. 물속으로 쏟아지는 총알을 피해 오래 숨을 참다 겨우 돌아왔다.", effects: { health: -16 } } } }
  }
};

// Event-specific Devil Fruit synergy: positive matches get a roll bonus and synergy note;
// mismatched fruits get a penalty and a backfire reason tailored to the fruit and situation.
const SYNERGY_RULES = {
  sea: {
    events: ["mishap_giant_fish", "mishap_fruit_show", "mishap_mate_dream", "danger_sea_king", "danger_storm"],
    good: {
      "얼음얼음 열매": ["해수면 결빙 유리", "바다 수면 자체를 단숨에 얼려 발판으로 삼으니 능력자의 약점이 사라졌다."],
      "쿠릉쿠릉 열매": ["수중 감전 유리", "바닷물을 타고 퍼진 고압 전류가 수면 아래까지 단번에 관통했다."],
      "새새 열매 모델 불사조": ["푸른 날개 체공 유리", "푸른 불꽃 날개로 수면 위를 날아올라 바닷물에 닿지 않고 대처했다."],
      "뭉게뭉게 열매": ["연기 체공 유리", "하반신을 연기로 바꾸어 바다에 빠지지 않고 허공에서 버텨 냈다."],
      "가스가스 열매": ["가스 부유 유리", "가스로 몸을 가볍게 띄워 거친 파도 위에서도 물에 닿지 않았다."],
      "번쩍번쩍 열매": ["공중 광속 이동 유리", "빛의 속도로 파도 위를 가로질러 바닷물이 스칠 틈조차 주지 않았다."],
      "동강동강 열매": ["발바닥 고정 분리 유리", "발만 안전한 갑판에 남겨 두고 상체만 날려 바다 위를 자유롭게 누볐다."],
      "고무고무 열매": ["원거리 신축 유리", "갑판 기둥에 발을 감고 팔만 길게 뻗어 바다에 빠질 위험을 피했다."],
      "꽃꽃 열매": ["원거리 개화 유리", "물에 가까이 가지 않고도 필요한 자리마다 손을 피워 올려 붙잡았다."],
      "실실 열매": ["구름·선체 고정 유리", "구름과 돛대에 실을 걸어 허공에서 안전하게 힘을 썼다."],
      "수술수술 열매": ["공간 절단·교환 유리", "바닷물에 손대지 않고 푸른 막 안의 위치만 바꿔 단숨에 끌어 올렸다."]
    },
    bad: {
      "모래모래 열매": ["물기 치명적 상성 불리", "튀어 오른 바닷물에 모래가 젖어 무겁게 굳어 버리는 바람에 능력이 제대로 풀리지 않았다."],
      "이글이글 열매": ["바닷물·폭우 상성 불리", "덮쳐 오는 물보라와 파도에 불길이 힘없이 사그라들어 뜨거운 김만 피어올랐다."],
      "흔들흔들 열매": ["선박 전복 역효과 위험", "바다 위에서 진동을 일으켰다가 역파도와 해일이 치솟아 아군 배까지 뒤집힐 뻔했다."],
      "어둠어둠 열매": ["인력 역효과 위험", "어둠의 인력이 바닷물과 충격까지 몸 쪽으로 끌어당겨 타격이 두 배로 돌아왔다."]
    }
  },
  stealth: {
    events: ["mishap_marine_kitchen", "mishap_disguise", "mishap_silly_code", "mishap_cake_thief"],
    good: {
      "고요고요 열매": ["완전 무음 결계 유리", "발소리와 숨소리, 문 열리는 소리까지 완벽히 지워 코앞을 지나가도 아무도 눈치채지 못했다."],
      "수술수술 열매": ["무소음 공간 교환 유리", "문도 열지 않고 공간 안의 물건만 조용히 바꿔 치워 흔적 하나 남기지 않았다."],
      "꽃꽃 열매": ["원격 시야·손 개화 유리", "몸은 그늘에 숨긴 채 벽 너머에 눈과 손만 피워 올려 감쪽같이 일을 마쳤다."],
      "뭉게뭉게 열매": ["연막 은폐 유리", "안개처럼 옅은 연기로 시야를 가려 경비병들의 눈앞을 유유히 빠져나갔다."],
      "눈눈 열매": ["눈보라 시야 차단 유리", "하얀 눈발로 순찰병들의 시야를 가리고 발자국까지 눈으로 덮었다."],
      "가스가스 열매": ["수면 가스 잠입 유리", "무색의 수면 가스를 흘려보내 보초들을 소리 없이 잠재웠다."],
      "도르도르 열매": ["밀랍 복제 열쇠 유리", "밀랍으로 자물쇠에 꼭 맞는 열쇠와 모형을 즉석에서 빚어 흔적 없이 다녀왔다."]
    },
    bad: {
      "쿠릉쿠릉 열매": ["뇌성·섬광 노출 불리", "능력을 쓰는 순간 파지직 튀는 번개 빛과 천둥소리가 울려 사방의 시선이 한꺼번에 쏠렸다."],
      "흔들흔들 열매": ["진동·굉음 노출 불리", "살짝 힘을 썼는데도 바닥과 유리창이 덜컥거려 기지 전체에 경보가 울렸다."],
      "이글이글 열매": ["화염 불빛 노출 불리", "숨어들어야 할 자리에서 몸의 불꽃이 횃불처럼 타올라 어둠 속 위치를 그대로 광고하고 말았다."],
      "번쩍번쩍 열매": ["황금빛 섬광 노출 불리", "몸이 빛나는 순간 눈부신 황금빛이 골목 끝까지 번쩍여 순찰대가 일제히 몰려왔다."]
    }
  },
  duel: {
    events: ["danger_duel"],
    good: {
      "동강동강 열매": ["참격 완전 무효 유리", "검객의 필살 참격이 닿는 순간 몸이 저절로 동강 나 칼날이 헛개비를 베고 지나갔다."],
      "수술수술 열매": ["공간 절단 우위", "검객의 칼이 닿기 전에 푸른 막 안에서 칼자루와 몸의 위치를 단숨에 갈라 놓았다."],
      "도르도르 열매": ["강철 경도 밀랍 방벽 유리", "강철 못지않은 밀랍 방벽으로 참격을 붙잡아 칼날을 그 자리에 가두었다."],
      "떡떡 열매": ["유체 회피·무장 경화 유리", "검날이 스칠 자리만 떡처럼 구멍을 내어 흘려보내고 단단하게 굳힌 주먹으로 되받아쳤다."],
      "실실 열매": ["초고강도 실 방어 유리", "팽팽하게 얽은 실 거미줄로 검객의 칼날을 허공에서 멈춰 세웠다."],
      "얼음얼음 열매": ["검신 동결 유리", "맞부딪친 칼날을 타고 퍼진 냉기가 검객의 손목까지 순식간에 얼려 버렸다."],
      "쿠릉쿠릉 열매": ["금속 전도 감전 유리", "검객의 강철 칼날을 타고 고압 전류가 흘러들어가 검을 쥔 손을 마비시켰다."],
      "번쩍번쩍 열매": ["광속 회피·타격 유리", "칼날이 움직이기도 전에 빛의 속도로 등 뒤로 돌아가 승부를 결정지었다."]
    },
    bad: {
      "고무고무 열매": ["참격 약점 상성 불리", "타격에는 강해도 날 선 검날에는 약한 고무 몸이라 뻗은 팔이 베일 뻔해 고전했다."],
      "어둠어둠 열매": ["통증 배가·회피 불가 불리", "공격을 흘려보내지 못하고 통증을 두 배로 빨아들이는 어둠의 체질 탓에 예리한 검기에 큰 피를 흘렸다."],
      "고요고요 열매": ["물리 방어력 부재 불리", "소리는 지웠지만 날아오는 검기를 막아 낼 물리적인 힘이 없어 정면 승부에서 밀렸다."]
    }
  },
  medical: {
    events: ["danger_poison", "danger_plague"],
    good: {
      "수술수술 열매": ["외과적 독소·병소 분리 유리", "푸른 막을 펼쳐 고통 없이 몸속의 독기와 병든 기운만 정교하게 분리해 뽑아냈다."],
      "새새 열매 모델 불사조": ["재생의 푸른 불꽃 유리", "뜨겁지 않은 재생의 불꽃이 쓰러진 몸을 감싸 독과 열병으로 무너진 기력을 빠르게 되살렸다."],
      "가스가스 열매": ["독가스·오염 공기 정화 유리", "주변 공기에 퍼진 독기와 나쁜 가스를 빨아들이고 깨끗한 산소를 불어넣었다."],
      "얼음얼음 열매": ["고열 진정·독 확산 지연 유리", "적절한 냉기로 끓어오르는 열을 식히고 독이 혈관을 타고 퍼지는 속도를 늦추었다."],
      "눈눈 열매": ["냉찜질·열기 완화 유리", "부드러운 눈송이로 열에 들뜬 환자들을 식혀 주어 고비를 넘기게 했다."]
    },
    bad: {
      "이글이글 열매": ["고열 악화 상성 불리", "몸에서 뿜어져 나온 뜨거운 열기가 오히려 열병과 독기 순환을 부채질해 숨이 더 가빠졌다."],
      "쿠릉쿠릉 열매": ["신경 자극 역효과 위험", "전류가 쇠약해진 몸의 맥박을 빠르게 뛰게 해 독이 더 빨리 퍼질 뻔했다."],
      "흔들흔들 열매": ["환자 충격 역효과 위험", "거친 진동이 앓아누운 사람들의 몸에 큰 무리를 주어 정밀한 구호에는 독이 되었다."],
      "어둠어둠 열매": ["고통 배가 체질 불리", "모든 통증을 두 배로 흡수하는 어둠의 몸이라 독과 열병의 고통까지 배로 덮쳐 왔다."]
    }
  },
  crowd: {
    events: ["danger_capture", "danger_base_raid"],
    good: {
      "흔들흔들 열매": ["광역 대기 진동 유리", "단 한 번의 진동으로 포위망과 진형을 통째로 갈라놓아 추격대가 발도 떼지 못하게 만들었다."],
      "쿠릉쿠릉 열매": ["광역 낙뢰 제압 유리", "하늘에서 내리꽂힌 번개가 포위망 일대를 단숨에 휩쓸어 길을 열었다."],
      "이글이글 열매": ["화염 장벽 차단 유리", "거대한 불기둥으로 추격대의 앞길을 가로막아 누구도 섣불리 다가오지 못했다."],
      "얼음얼음 열매": ["광역 빙결 봉쇄 유리", "바닥을 타고 번진 얼음이 몰려오는 병력의 발을 그 자리에 얼려 붙였다."],
      "모래모래 열매": ["모래폭풍 돌파 유리", "거센 모래폭풍을 일으켜 포위망의 시야와 진형을 단숨에 무너뜨렸다."],
      "번쩍번쩍 열매": ["광역 섬광·광속 돌파 유리", "눈을 뜰 수 없는 섬광과 빛의 이동으로 포위망이 닫히기 전에 빠져나갔다."],
      "어둠어둠 열매": ["블랙홀 인력 제압 유리", "바닥에 펼친 어둠으로 무기와 장애물을 한꺼번에 집어삼켜 토해 냈다."],
      "실실 열매": ["다수 동시 포박 유리", "보이지 않는 실로 선두에 선 추격자들의 움직임을 한꺼번에 묶어 버렸다."]
    },
    bad: {
      "고요고요 열매": ["정면 돌파 화력 부재 불리", "소리는 지웠지만 겹겹이 에워싼 무장 병력을 물리적으로 뚫어 낼 타격력이 없었다."]
    }
  },
  confined: {
    events: ["danger_mutiny", "mishap_odd_merchant", "mishap_treasure_map", "mishap_haki_bet", "mishap_poster_photo"],
    good: {
      "꽃꽃 열매": ["정밀 제압·수색 유리", "물건이나 선체를 하나도 부수지 않고 피어난 손으로 원하는 상대와 물건만 정확히 붙잡았다."],
      "실실 열매": ["비파괴 포박 유리", "보이지 않는 실로 손목만 정교하게 묶어 소란이 번지기 전에 끝냈다."],
      "떡떡 열매": ["끈적한 결박 유리", "차진 떡으로 무기와 발목을 단단히 붙여 놓아 다치는 사람 없이 제압했다."],
      "수술수술 열매": ["정밀 공간 분리 유리", "필요한 목표만 푸른 막 안에서 골라내어 주변에 흠집 하나 내지 않았다."],
      "도르도르 열매": ["밀랍 수갑·틀 고정 유리", "빠르게 굳는 밀랍으로 움직임만 깔끔하게 봉쇄했다."]
    },
    bad: {
      "흔들흔들 열매": ["선체·건물 파손 역효과 위험", "좁은 자리에서 진동을 일으켰다가 아군 배의 갑판과 주변 건물까지 통째로 무너뜨릴 뻔했다."],
      "이글이글 열매": ["화재 번짐 역효과 위험", "나무 갑판과 화약통, 상점 천막에 불똥이 옮겨붙어 불부터 끄느라 진땀을 뺐다."],
      "쿠릉쿠릉 열매": ["과전류 폭발 역효과 위험", "전류가 주변 집기와 화약통에 튀어 엉뚱한 폭발이 일어났다."]
    }
  },
  consume: {
    events: ["mishap_feast", "mishap_drinking", "mishap_eating_contest"],
    good: {
      "고무고무 열매": ["고무 위장 팽창 유리", "배가 고무 풍선처럼 한도 끝도 없이 늘어나 산더미 같은 양도 거뜬히 들어갔다."],
      "떡떡 열매": ["신체 확장 소화 유리", "몸을 떡처럼 넓게 늘려 남들 몇 배나 되는 양을 아무렇지 않게 받아냈다."],
      "수술수술 열매": ["공간 치환 트릭 유리", "보이지 않게 작은 막을 열어 잔과 그릇의 내용물만 감쪽같이 다른 곳으로 빼돌렸다."],
      "어둠어둠 열매": ["어둠 흡수 트릭 유리", "식탁 아래 어둠 속으로 음식과 술을 소리 없이 빨아들여 흔적도 남기지 않았다."],
      "꽃꽃 열매": ["다중 손 동시 집기 유리", "피어난 여러 개의 손이 동시에 움직여 누구보다 빠르게 접시를 비웠다."]
    },
    bad: {
      "얼음얼음 열매": ["음식·술 동결 역효과 위험", "입에 닿는 족족 술과 음식이 차갑게 얼어붙어 속이 꽁꽁 얼고 이가 시려 더 먹을 수 없었다."],
      "눈눈 열매": ["냉기 체증 역효과 위험", "몸의 한기 때문에 따뜻한 음식과 술이 목에서 굳어 버렸다."],
      "이글이글 열매": ["알코올·식탁 인화 위험", "독한 술기운과 기름기에 몸의 불꽃이 옮겨붙어 식탁 한가운데서 불기둥이 솟구쳤다."],
      "모래모래 열매": ["수분 급속 흡수 역효과 위험", "몸의 모래가 국물과 수분을 빨아들이자 오히려 입안이 사막처럼 바짝 말라 삼키기 힘들었다."],
      "가스가스 열매": ["가스 팽만 역효과 위험", "급하게 삼킨 음식과 체내 가스가 뒤섞여 배가 부풀어 오르고 보랏빛 트림이 터져 나왔다."]
    }
  },
  scout: {
    events: ["mishap_upside_map"],
    good: {
      "새새 열매 모델 불사조": ["고공 비행 정찰 유리", "푸른 불꽃 날개로 구름 위까지 솟구쳐 올라 주변 바다의 지형과 섬을 한눈에 내려다보았다."],
      "번쩍번쩍 열매": ["상공 광속 관측 유리", "빛의 기둥을 타고 하늘 높이 솟구쳐 수평선 너머의 항로를 단숨에 확인했다."],
      "쿠릉쿠릉 열매": ["전파·고공 시야 유리", "벼락처럼 마스트 끝으로 솟구쳐 전자기 파장으로 먼 섬의 윤곽을 잡아냈다."],
      "뭉게뭉게 열매": ["연기 상승 관측 유리", "연기를 타고 바람 위로 높이 떠올라 안개 너머의 해류를 살폈다."],
      "가스가스 열매": ["공중 부유 관측 유리", "공기보다 가벼운 가스로 하늘 높이 떠올라 안전하게 항로를 내려다보았다."],
      "꽃꽃 열매": ["돛대 꼭대기 눈 개화 유리", "직접 올라갈 필요 없이 돛대 꼭대기에 눈을 피워 사방의 수평선을 살폈다."]
    },
    bad: {
      "흔들흔들 열매": ["항해 계기 파손 위험", "발판으로 삼으려 힘을 주었다가 돛대와 나침반까지 흔들려 바늘이 더 어지러워졌다."],
      "어둠어둠 열매": ["중력 낙하 위험", "몸이 무겁게 가라앉는 힘이라 높은 돛대 위에서 중심을 잡기가 오히려 더 위태로웠다."]
    }
  }
};

export function fruitSynergy(fruitText = "", eventKey = "") {
  if (!fruitText) return { tier: "neutral", delta: 0, tag: "", note: "" };
  const name = String(fruitText).replace(/\(.*\)$/, "");
  for (const group of Object.values(SYNERGY_RULES)) {
    if (!group.events.includes(eventKey)) continue;
    if (group.good[name]) {
      const [tag, note] = group.good[name];
      return { tier: "good", delta: 16, tag, note };
    }
    if (group.bad[name]) {
      const [tag, note] = group.bad[name];
      return { tier: "bad", delta: -22, tag, note };
    }
  }
  return { tier: "neutral", delta: 0, tag: "", note: "" };
}
