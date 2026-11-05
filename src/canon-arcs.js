import { moveTo, ro, routeFor, yearRoll } from "./world.js";
import { takenText } from "./canon-timeline.js";
import { attachCanonContact, canonRelationshipChanged, custodyArcScene } from "./canon-relationships.js";

// Rule 8: a canon milestone opens a few dated scenes on its island. Someone already there gets swept up;
// someone sailing nearby may hear the rumor and head there. The canon outcome never changes in these
// scenes: the player stays a bystander with their own stakes. Days are relative, never a calendar date.
const batchim = (word) => { const last = word.codePointAt(word.length - 1); return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0; };
const eun = (word) => `${word}${batchim(word) ? "은" : "는"}`;
const outlaw = (life) => ["pirate", "liberator"].includes(life.path);
const lucky = (life, salt, percent) => yearRoll(life.seed ^ salt, life.age) % 100 < percent;

const ARCS = {
  loguetown: { place: "로그 타운", art: "arcLoguetown", scenes: [
    { time: "그날 낮 · 처형대 광장", title: "처형대 위의 밀짚모자",
      body: "로저가 처형됐던 광장에 사람이 몰렸다. 밀짚모자를 쓴 소년이 처형대 위로 기어 올라가 바다를 내려다보고 있었다. 광장 한쪽에서는 빨간 코의 해적이 수상한 웃음을 흘렸다.",
      choices: [
        { id: "watch", label: "인파 속에서 지켜본다", risk: "기술 +5", personality: { freedom: 4 }, apply: (life) => { life.skill += 5; return "소년이 웃는 얼굴로 처형대에 묶이는 장면까지 보았다. 이상하게도 겁먹은 얼굴이 아니었다."; } },
        { id: "children", label: "구경하던 아이들을 처마 밑으로 데려간다", risk: "지역의 신뢰 +10", personality: { empathy: 6 }, apply: (life) => { life.trust += 10; return "곧 무슨 일이 터질 것 같았다. 아이들을 가게 안으로 들여보내자마자 광장이 소란해졌다."; } }
      ] },
    { time: "같은 날 오후 · 폭풍 속", title: "처형대에 떨어진 번개",
      body: "칼날이 내려오기 직전, 번개가 처형대를 때렸다. 무너진 처형대 잔해 속에서 밀짚모자 소년이 일어나 웃었고, 연기의 해군이 빗속을 가르며 뒤쫓았다. 해군이 소년을 붙잡은 순간 두건 쓴 사내가 그 팔을 움켜쥐었고, 거센 돌풍이 소년을 항구 쪽으로 날려 보냈다. 항구로 향하는 길이 순식간에 막혔다.",
      choices: [
        { id: "checkpoint", label: "해군의 검문을 돕는다", when: (life) => life.path === "marine", risk: "지역의 신뢰 +10", personality: { loyalty: 6 },
          apply: (life) => { life.trust += 10; return "골목마다 검문을 섰지만 배는 폭풍 사이로 빠져나갔다. 상관은 바람이 이상하게 그쪽으로만 불었다고 중얼거렸다."; } },
        { id: "slip", label: "빗속에서 해군의 눈을 피해 배로 달린다", when: (life) => outlaw(life), needs: { skill: 40 }, bounty: 3_000_000, risk: "기술 40 필요 · 현상금이 오를 수 있음", failRisk: "건강 -15",
          personality: { freedom: 7 }, apply: () => "혼란을 틈타 닻줄을 끊었다. 등 뒤의 광장에서는 아직 번개의 냄새가 났다.",
          fail: (life) => { life.health -= 15; return "골목 끝에서 해군과 부딪혔다. 몸싸움 끝에 겨우 배에 올랐다."; } },
        { id: "shelter", label: "문을 걸고 폭풍을 피한다", risk: "건강 +5", personality: { caution: 6 }, apply: (life) => { life.health += 5; return "덧창을 닫고 밤을 보냈다. 다음 날 아침 광장에는 무너진 처형대의 그을린 잔해만 남아 있었다."; } }
      ] }
  ] },
  whiskey: { place: "위스키 피크", art: "arcWhiskey", scenes: [
    { time: "환영 잔치 뒤 · 한밤", title: "백 명의 현상금 사냥꾼",
      body: "잔치가 끝나자 마을 사람들이 칼을 꺼냈다. 잠든 해적들을 잡을 테니 한몫 끼라는 제안이 왔다. 그때 지붕 위에서 칼 세 자루를 찬 검객이 혼자 내려다보고 있었다.",
      choices: [
        { id: "join", label: "사냥꾼들 편에 서서 덤빈다", needs: { skill: 60 }, risk: "기술 60 필요 · 상대가 심상치 않음", failRisk: "건강 -20",
          personality: { ambition: 6, caution: -5 }, apply: (life) => { life.health -= 5; return "한 합을 겨루고 살아남은 것만으로도 운이 좋았다. 날이 밝자 마을 사냥꾼 백 명이 전부 쓰러져 있었다."; },
          fail: (life) => { life.health -= 20; return "검을 뽑기도 전에 바닥에 누워 있었다. 검객은 이미 다음 사냥꾼을 상대하고 있었다."; } },
        { id: "hide", label: "술통 뒤에 숨어 지켜본다", risk: "기술 +5", personality: { caution: 7 }, apply: (life) => { life.skill += 5; return "한 사람이 백 명을 쓰러뜨리는 밤을 숨죽여 보았다. 검 쓰는 법 하나를 몰래 배웠다."; } },
        { id: "leave", label: "밤배로 마을을 빠져나간다", cost: 10, risk: "물자 -10", personality: { caution: 6 }, apply: (life) => { life.supplies -= 10; return "선인장 바위산이 멀어지는 동안 마을에서 칼 부딪히는 소리가 밤새 들렸다."; } }
      ] }
  ] },
  little_garden: { place: "리틀 가든", art: "arcLittleGarden", scenes: [
    { time: "거인의 결투가 멈춘 날 · 숲속", title: "밀랍으로 굳은 무대",
      body: "숲 한가운데에 거대한 밀랍 케이크 같은 무대가 솟았다. 그 위에서 사람들이 하얗게 굳어 가고 있었다. 바로크 워크스의 이름이 숲 여기저기서 들렸다.",
      choices: [
        { id: "fire", label: "불을 피워 밀랍을 녹이는 걸 돕는다", needs: { skill: 40 }, risk: "기술 40 필요 · 지역의 신뢰 +10", failRisk: "건강 -15",
          personality: { empathy: 6, ambition: 4 }, apply: (life) => { life.trust += 10; return "누군가 붙인 불이 무대를 휘감았다. 밀랍이 녹아내리는 연기 속에서 굳어 가던 사람들이 숨을 몰아쉬었다."; },
          fail: (life) => { life.health -= 15; return "다리가 밀랍에 붙어 움직이지 않았다. 불길이 번진 뒤에야 겨우 빠져나왔다."; } },
        { id: "flee", label: "공룡을 피해 해안으로 물러난다", risk: "물자 +10", personality: { caution: 6 }, apply: (life) => { life.supplies += 10; return "해안에서 열매를 모으며 숲의 소동이 끝나기를 기다렸다. 멀리서 두 거인의 웃음이 다시 울렸다."; } }
      ] }
  ] },
  drum: { place: "드럼섬", art: "arcDrum", scenes: [
    { time: "폭설이 그친 날 · 산기슭 마을", title: "돌아온 옛 왕",
      body: "해적에게 쫓겨 도망쳤던 옛 왕이 배를 끌고 돌아왔다. 마을 사람들은 문을 걸었고, 덩치 큰 남자 한 명이 홀로 왕의 앞을 막아섰다.",
      choices: [
        { id: "guard", label: "그 남자의 곁에 서서 길을 막는다", needs: { health: 50 }, risk: "건강 50 필요 · 지역의 신뢰 +20", failRisk: "건강 -20",
          personality: { loyalty: 7, caution: -5 }, apply: (life) => { life.trust += 20; return "왕의 부하들이 주춤했다. 그 틈에 아이들이 집 안으로 피신했다."; },
          fail: (life) => { life.health -= 20; return "단번에 눈밭에 처박혔다. 덩치 큰 남자가 대신 앞을 막았다."; } },
        { id: "evacuate", label: "노인과 아이를 이웃 마을로 옮긴다", risk: "건강 -5 · 지역의 신뢰 +10", personality: { empathy: 7 }, apply: (life) => { life.health -= 5; life.trust += 10; return "눈길을 반나절 걸었다. 이웃 마을에서 따뜻한 국을 얻어먹었다."; } }
      ] },
    { time: "그날 밤 · 산 위", title: "분홍빛으로 물든 눈",
      body: "성 꼭대기에서 무언가가 터지더니 하늘에서 분홍빛 가루가 쏟아졌다. 눈 덮인 산 전체가 벚꽃처럼 물들었다. 마을 사람 하나가 오래전 죽은 돌팔이 의사의 이름을 부르며 울었다.",
      after: (life) => { life.health += 10; return "그 밤의 하늘을 오래 올려다보았다. 이상하게 몸이 가벼워졌다."; } }
  ] },
  alabasta_war: { place: "알라바스타", art: "arcAlabasta", scenes: [
    { time: "첫날 · 나노하나 시장", title: "시장 한복판의 불과 연기",
      body: "향수 냄새가 나는 나노하나 시장에서 갑자기 불기둥이 솟았다. 불꽃을 두른 사내와 연기를 두른 해군이 골목 하나를 사이에 두고 맞섰다. 좌판이 날아가고 상인들이 비명을 질렀다.",
      choices: [
        { id: "stall", label: "상인을 도와 좌판을 옮긴다", risk: "지역의 신뢰 +10", personality: { empathy: 6 }, apply: (life) => { life.trust += 10; return "향수병을 반쯤 건졌다. 상인은 고맙다며 작은 병 하나를 쥐여 주었다."; } },
        { id: "gawk", label: "가까이서 구경한다", needs: { health: 40 }, risk: "건강 40 필요 · 불똥이 튈 수 있음", failRisk: "건강 -15",
          personality: { freedom: 6, caution: -5 }, apply: (life) => { life.skill += 5; return "불과 연기가 맞부딪히는 모습을 똑똑히 보았다. 자연계 능력자들의 싸움은 상상 이상이었다."; },
          fail: (life) => { life.health -= 15; return "날아온 불똥에 옷소매가 타들어 갔다. 물통에 팔을 담그고서야 정신이 들었다."; } }
      ] },
    { time: "며칠 뒤 · 말라 버린 오아시스 유바", title: "모래를 파는 노인",
      body: "모래 폭풍에 묻힌 오아시스 마을 유바에서 한 노인이 홀로 땅을 파고 있었다. 반란군이 떠난 마을에 다시 물이 솟을 거라고 믿는다고 했다.",
      choices: [
        { id: "dig", label: "삽을 들고 함께 판다", cost: 10, risk: "물자 -10 · 건강 -5 · 지역의 신뢰 +20", personality: { empathy: 8, loyalty: 4 },
          apply: (life) => { life.supplies -= 10; life.health -= 5; life.trust += 20; return "해가 질 때까지 모래를 퍼냈다. 노인은 아껴 둔 물 한 통을 내밀었다. 마른 땅에서 나온 물이었다."; } },
        { id: "water", label: "가진 물을 나눠 준다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 6 },
          apply: (life) => { life.supplies -= 10; life.trust += 10; return "노인은 물을 받아 마시고 다시 삽을 들었다. 포기하지 않는 등이 오래 기억에 남았다."; } },
        { id: "pass", label: "노인의 이야기만 듣고 길을 재촉한다", risk: "기술 +5", personality: { caution: 5 },
          apply: (life) => { life.skill += 5; return "이 마을에 물이 있던 시절의 이야기를 들었다. 모래 폭풍이 오기 전에 다음 마을로 향했다."; } }
      ] },
    { time: "이튿날 · 레인베이스", title: "비를 부르는 카지노",
      body: "사막 한가운데 도시 레인베이스에는 거대한 카지노가 서 있었다. 주인이 칠무해 크로커다일이라 손님들은 안심하고 돈을 걸었다. 지하에서 이상한 물소리가 들린다는 소문도 있었다.",
      choices: [
        { id: "gamble", label: "판돈을 건다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { ambition: 6, freedom: 5 },
          apply: (life) => { life.supplies -= 10; if (lucky(life, 0x8a01, 35)) { life.supplies += 30; return "주사위가 연달아 맞았다! 칩을 바꿔 들고 서둘러 나왔다."; } return "칩은 순식간에 사라졌다. 오늘의 운은 끝내 이쪽으로 오지 않았다."; } },
        { id: "listen", label: "지하의 소문을 캐 본다", needs: { skill: 50 }, risk: "기술 50 필요 · 위험한 소문", failRisk: "건강 -15",
          personality: { caution: 4, freedom: 5 }, apply: (life) => { life.skill += 10; return "지하에는 거대한 악어들이 사는 물길과 바다의 돌로 만든 우리가 있다고 했다. 이 나라의 비가 왜 끊겼는지 짐작이 갔다."; },
          fail: (life) => { life.health -= 15; return "직원들에게 끌려 나와 사막에 내던져졌다. 모래 맛이 오래 남았다."; } }
      ] },
    { time: "결전의 날 · 수도 알바나", title: "시계탑의 오후",
      body: "국왕군과 반란군이 수도 알바나의 광장에서 맞붙었다. 왕녀가 싸움을 멈추라고 외쳤지만 포성에 묻혔다. 시계탑 근처에 거대한 포탄이 숨겨져 있다고 외치며 달려가는 이들이 있었다.",
      choices: [
        { id: "plaza", label: "시민들을 광장 밖으로 이끈다", risk: "건강 -10 · 지역의 신뢰 +20", personality: { empathy: 9, loyalty: 5 },
          apply: (life) => { life.health -= 10; life.trust += 20; return "골목마다 사람을 밀어 넣으며 광장을 비웠다. 오후 네 시 반, 하늘 높은 곳에서 무언가가 터졌다."; } },
        { id: "search", label: "시계탑 주변을 뒤진다", needs: { skill: 55, health: 45 }, risk: "기술 55 · 건강 45 필요", failRisk: "건강 -25",
          personality: { ambition: 6, empathy: 6, caution: -6 }, apply: (life) => { life.trust += 10; return "시계탑을 가리키며 외쳤다. 누군가 그 말을 듣고 탑으로 달려갔다. 마지막 일은 다른 이들의 몫이었다."; },
          fail: (life) => { life.health -= 25; return "병사들의 싸움에 휘말려 계단에서 굴렀다. 정신을 차렸을 때 하늘에서 폭음이 울렸다."; } },
        { id: "cover", label: "건물 안에 몸을 숨긴다", risk: "신중함이 자람", personality: { caution: 7 }, apply: () => "창틈으로 광장을 보았다. 몇 해 만에 하늘에서 비가 내렸고, 그제야 싸움이 멎었다." }
      ] }
  ] },
  jaya: { place: "모크 타운", art: "arcJaya", scenes: [
    { time: "그날 · 모크 타운 술집", title: "꿈을 비웃는 자와 웃는 자",
      body: "술집에서 이름난 해적이 하늘섬을 믿는 신참 해적들을 두들겨 팼다. 밀짚모자 소년은 끝까지 맞서지 않았다. 구석 자리의 이 빠진 사내가 사람의 꿈은 끝나지 않는다며 크게 웃었다.",
      choices: [
        { id: "laugh", label: "사내의 말에 잔을 들어 맞장구친다", risk: "자유로움이 자람 · 친구와의 유대 +5", personality: { freedom: 8 }, apply: (life) => { life.friendBond += 5; return "사내는 기분 좋게 체리 파이를 하나 더 시켰다. 나중에야 그 얼굴을 수배서에서 다시 보게 됐다."; } },
        { id: "mock", label: "술집 분위기에 맞춰 함께 비웃는다", risk: "신중함이 자람", personality: { caution: 5, freedom: -5 }, apply: () => "웃음은 금방 식었다. 밀짚모자 소년이 말없이 나가는 뒷모습이 이상하게 마음에 걸렸다." }
      ] },
    { time: "다음 날 정오 · 앞바다", title: "하늘로 솟구친 해류",
      body: "정오가 되자 먼바다가 거대하게 부풀어 올랐다. 바다가 하늘을 향해 기둥처럼 솟구쳤고, 작은 배 한 척이 그 꼭대기를 타고 구름 속으로 사라졌다.",
      after: (life) => { life.skill += 5; return "그날 본 바다 기둥을 떠올릴 때마다 하늘섬을 비웃던 술집의 웃음소리가 조금 작게 느껴졌다."; } }
  ] },
  davy: { place: "롱 링 롱 랜드", art: "arcLongRing", scenes: [
    { time: "경기 날 · 길쭉한 섬", title: "데이비 백 파이트의 응원석",
      body: "길쭉한 섬에서 동료를 건 해적 놀이가 열렸다. 관중석에서는 이미 판돈이 오가고 있었다. 상대 선장의 이상한 광선에 맞은 사람들은 한동안 느릿느릿 움직였다.",
      choices: [
        { id: "straw", label: "밀짚모자 쪽에 건다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { freedom: 5 },
          apply: (life) => { life.supplies -= 10; life.supplies += 25; return "마지막 경기에서 밀짚모자가 이겼다. 판돈을 두 배로 챙겼다."; } },
        { id: "foxy", label: "홈팀에 건다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { caution: 4 },
          apply: (life) => { life.supplies -= 10; return "홈팀은 끝내 졌다. 그래도 경기 내내 웃은 값이라 생각하기로 했다."; } },
        { id: "cheer", label: "돈은 걸지 않고 목청껏 응원한다", risk: "친구와의 유대 +5", personality: { freedom: 5 },
          apply: (life) => { life.friendBond += 5; return "옆자리 관중과 어깨동무를 하고 소리를 질렀다. 목이 쉬었지만 즐거운 하루였다."; } }
      ] },
    { time: "경기 뒤 · 해변", title: "얼어붙은 바다",
      body: "눈가리개를 한 키 큰 사내가 선 채로 자다 일어났다. 해군 대장이라는 말에 섬의 공기가 얼어붙었다. 실제로 바다 한쪽이 하얗게 얼어 있었다.",
      after: (life) => { life.health -= 5; return "얼음 바람을 피해 배로 돌아왔다. 대장 하나가 바다를 얼린다는 이야기는 과장이 아니었다."; } }
  ] },
  water_seven: { place: "워터 세븐", art: "arcWater7", scenes: [
    { time: "도착한 날 · 뒷골목", title: "해체업자의 집",
      body: "뒷골목에서 해체업자 무리가 돈 가방을 둘러싸고 환호했다. 밀짚모자 일행의 돈이라는 말이 들리더니, 얼마 뒤 그 집이 통째로 무너지는 소리가 났다.",
      choices: [
        { id: "watch", label: "구경꾼 틈에서 지켜본다", risk: "기술 +5", personality: { freedom: 4 }, apply: (life) => { life.skill += 5; return "무너진 집 앞에서 해체업자들이 울상을 지었다. 도시 사람들은 늘 있는 일이라는 듯 웃었다."; } },
        { id: "help", label: "다친 사람을 부두로 옮긴다", risk: "지역의 신뢰 +10", personality: { empathy: 6 }, apply: (life) => { life.trust += 10; return "누가 먼저 잘못했는지는 묻지 않았다. 다친 사람은 누구든 다친 사람이었다."; } }
      ] },
    { time: "그날 밤 · 조선회사 본사", title: "본사를 덮친 가면들",
      body: "한밤중에 조선회사 본사에서 불길이 솟았다. 가면을 쓴 이들이 시장을 노렸다는 말이 돌았다. 직공들이 물통을 들고 뛰었고, 불은 옆 건물로 번지려 했다.",
      choices: [
        { id: "fire", label: "물통을 들고 불을 끈다", needs: { health: 45 }, risk: "건강 45 필요 · 지역의 신뢰 +20", failRisk: "건강 -20",
          personality: { empathy: 7, loyalty: 5 }, apply: (life) => { life.trust += 20; life.health -= 5; return "새벽녘에야 불이 잡혔다. 그을린 얼굴의 직공들이 함께 물통을 내려놓았다."; },
          fail: (life) => { life.health -= 20; return "무너진 들보에 깔릴 뻔했다. 직공 하나가 끌어내 주었다."; } },
        { id: "away", label: "불길에서 물러나 배를 지킨다", risk: "물자 +5", personality: { caution: 6 }, apply: (life) => { life.supplies += 5; return "부두에서 불길을 바라보았다. 다음 날 도시에는 아무도 믿기 어려운 소문이 퍼졌다."; } }
      ] },
    { time: "아쿠아 라구나의 날 · 역", title: "폭풍 속으로 떠난 열차",
      body: "해일이 몰려오는데도 바다 위를 달리는 열차 한 대가 역을 박차고 나갔다. 정부의 사법의 섬으로 가는 길이라고 했다. 역무원들은 미친 짓이라며 고개를 저었다.",
      after: (life) => { life.health -= 5; return "높은 곳으로 피해 해일을 견뎠다. 며칠 뒤 정부의 섬에서 깃발이 불탔다는 소식이 왔다."; } }
  ] },
  sabaody_auction: { place: "샤본디 제도", art: "arcSabaody", scenes: [
    { time: "그날 · 1번 그로브 경매장", title: "경매장의 총성",
      body: "인간 경매장에서 천룡인이 문어 어인을 쐈다. 모두가 고개를 숙인 순간, 밀짚모자 소년이 객석 계단을 걸어 내려가 천룡인을 주먹으로 날려 버렸다. 경매장이 뒤집혔다.",
      choices: [
        { id: "kneel", label: "바닥에 엎드려 지나가기를 기다린다", risk: "신중함이 자람", personality: { caution: 8 }, apply: () => "머리 위로 사람이 날아다녔다. 한순간 숨이 막히는 기운이 지나가더니 경비병들이 줄줄이 쓰러졌다. 고개를 들었을 때 경매장 문은 해군에게 포위돼 있었다." },
        { id: "free", label: "혼란을 틈타 사슬에 묶인 이들을 푼다", needs: { skill: 50 }, bounty: 10_000_000, risk: "기술 50 필요 · 현상금이 오를 수 있음", failRisk: "건강 -20",
          personality: { empathy: 9, freedom: 8, caution: -6 }, apply: (life) => { life.trust += 20; return "사슬 열쇠를 찾아 세 사람을 풀어 주었다. 그들은 고맙다는 말도 못 하고 군중 속으로 사라졌다."; },
          fail: (life) => { life.health -= 20; return "경비병의 곤봉에 맞아 쓰러졌다. 혼란이 너무 커서 아무도 신경 쓰지 않았다."; } },
        { id: "exit", label: "뒷문으로 빠져나간다", risk: "기술 +5", personality: { caution: 5 }, apply: (life) => { life.skill += 5; return "거품 사이로 달렸다. 섬 전체에 해군 대장이 온다는 소리가 퍼지고 있었다."; } }
      ] },
    { time: "같은 날 오후 · 맹그로브 숲", title: "숲을 가르는 빛",
      body: "맹그로브 숲 사이로 노란 빛이 번쩍였다. 빛에 맞은 나무가 쓰러지고 거품이 터졌다. 해군 대장 한 명이 신인 해적들을 하나씩 쓰러뜨리고 있었다.",
      choices: [
        { id: "run", label: "거품 보트를 타고 섬을 벗어난다", needs: { skill: 45 }, risk: "기술 45 필요", failRisk: "건강 -25",
          personality: { caution: 6 }, apply: () => "거품 보트가 물 위를 미끄러졌다. 등 뒤의 섬에서 빛이 몇 번 더 번쩍였다.",
          fail: (life) => { life.health -= 25; return "빛 하나가 바로 옆 나무를 쓰러뜨렸다. 파편에 맞은 채 간신히 숨었다."; } },
        { id: "hide", label: "뿌리 사이에 숨어 숨을 죽인다", risk: "건강 -5", personality: { caution: 8 }, apply: (life) => { life.health -= 5; return "해가 질 때까지 움직이지 않았다. 저녁이 되자 밀짚모자 일당이 사라졌다는 소문이 돌았다."; } }
      ] }
  ] },
  reunion: { place: "샤본디 제도", art: "arcSabaody", scenes: [
    { time: "2년 뒤 · 샤본디", title: "가짜 밀짚모자의 모집",
      body: "밀짚모자 루피라고 자칭하는 사내가 샤본디에서 선원을 모았다. 현상금 4억이라고 떠들었지만 키도 얼굴도 수배서와 딴판이었다.",
      choices: [
        { id: "laugh", label: "면접만 보고 웃으며 나온다", risk: "친구와의 유대 +5", personality: { freedom: 5 }, apply: (life) => { life.friendBond += 5; return "가짜 선장은 해군이 들이닥치자 손쓸 새도 없이 붙잡혔다. 그날 진짜는 따로 있었다."; } },
        { id: "report", label: "해군에 제보한다", when: (life) => life.path === "marine", risk: "지역의 신뢰 +10", personality: { loyalty: 5 }, apply: (life) => { life.trust += 10; return "가짜는 체포됐다. 진짜 밀짚모자는 그 사이 바다 밑으로 떠났다."; } }
      ] }
  ] },
  fishman: { place: "어인섬", art: "arcFishman", scenes: [
    { time: "그날 · 광장", title: "광장의 처형대",
      body: "어인섬의 광장에 처형대가 세워졌다. 인간을 증오하는 어인 무리가 왕국을 차지하겠다고 외쳤고, 머리 위 바다에서는 거대한 배 그림자가 섬으로 떨어지고 있었다.",
      choices: [
        { id: "evacuate", label: "주민들을 거품 통로로 피신시킨다", risk: "건강 -10 · 지역의 신뢰 +20", personality: { empathy: 9 }, apply: (life) => { life.health -= 10; life.trust += 20; return "통로 끝까지 아이들을 업어 날랐다. 머리 위의 그림자는 섬에 닿기 직전에 멈췄다."; } },
        { id: "stand", label: "무리 앞에 맞선다", needs: { skill: 55, health: 45 }, risk: "기술 55 · 건강 45 필요", failRisk: "건강 -25",
          personality: { loyalty: 6, caution: -6 }, apply: (life) => { life.trust += 10; return "한 무리를 막는 사이 광장에 밀짚모자 일당이 들이닥쳤다. 싸움의 중심은 그들의 몫이었다."; },
          fail: (life) => { life.health -= 25; return "작살에 어깨를 찔렸다. 주민들이 거품 통로로 끌고 갔다."; } }
      ] }
  ] },
  dressrosa: { place: "드레스로자", art: "arcDressrosa", scenes: [
    { time: "첫날 · 콜로세움", title: "불꽃 열매가 걸린 투기장",
      body: "드레스로자의 콜로세움에서 이글이글 열매를 걸고 싸우는 대회가 열렸다. 관중석 너머로 진 투사들이 어디론가 끌려갔다. 거리에서는 말하는 장난감들이 사람처럼 일을 했다.",
      choices: [
        { id: "enter", label: "투기장에 출전한다", needs: { skill: 65, health: 55 }, risk: "기술 65 · 건강 55 필요 · 진 사람은 어딘가로 끌려감", failRisk: "건강 -25",
          personality: { ambition: 9, caution: -7 }, apply: (life) => { life.skill += 10; return "예선 한 조에서 살아남았다. 결승은 이름난 괴물들의 무대였다. 그 이상은 무리였다."; },
          fail: (life) => { life.health -= 25; return "패자 대기실로 끌려가던 중 소동을 틈타 빠져나왔다. 그곳에서 무슨 일이 일어나는지 보지 않은 게 다행이었다."; } },
        { id: "crowd", label: "관중석에서 응원한다", risk: "기술 +5", personality: { freedom: 4 }, apply: (life) => { life.skill += 5; return "투구를 쓰고 수염을 붙인 투사 루시가 투기장을 휩쓸었다. 관중들은 그 정체를 몰랐지만 모두 환호했다."; } }
      ] },
    { time: "같은 날 · 거리", title: "장난감이 사람으로 돌아온 날",
      body: "한낮에 거리의 장난감들이 한꺼번에 사람으로 돌아왔다. 잊고 있던 가족의 얼굴이 갑자기 떠올라 사람들이 길바닥에 주저앉아 울었다.",
      choices: [
        { id: "help", label: "가족을 찾는 사람들을 돕는다", risk: "지역의 신뢰 +20 · 친구와의 유대 +5", personality: { empathy: 9 }, apply: (life) => { life.trust += 20; life.friendBond += 5; return "장난감이었던 남자가 딸을 찾았다. 둘이 껴안는 모습을 끝까지 지켜보았다."; } },
        { id: "remember", label: "잊고 있던 이름을 떠올려 본다", risk: "건강 +5", personality: { loyalty: 5 }, apply: (life) => { life.health += 5; return "이 섬에서 만났던 장난감 하나의 이름이 떠올랐다. 그 사람도 어딘가에서 돌아왔기를 바랐다."; } }
      ] },
    { time: "같은 날 오후 · 새장 안", title: "조여 오는 새장",
      body: "하늘에서 실이 내려와 섬 전체를 새장처럼 가뒀다. 왕은 특정 인물들의 목에 현상금을 걸고 시민끼리 사냥하게 했다. 실은 조금씩 안쪽으로 조여 왔다.",
      choices: [
        { id: "protect", label: "현상금에 눈먼 사람들로부터 도망자를 숨긴다", risk: "건강 -10 · 지역의 신뢰 +20", personality: { empathy: 8, loyalty: 6 }, apply: (life) => { life.health -= 10; life.trust += 20; return "골목 창고에 부상자를 숨겼다. 해가 질 무렵 새장의 실이 하늘로 흩어졌다."; } },
        { id: "escape", label: "새장 끝까지 달려 탈출을 노린다", needs: { health: 55 }, risk: "건강 55 필요", failRisk: "건강 -30",
          personality: { caution: 4, freedom: 6 }, apply: () => "실 사이로 빠져나갈 틈은 없었다. 달리다 지쳐 쓰러졌을 때 하늘이 다시 열렸다.",
          fail: (life) => { life.health -= 30; return "조여 오는 실에 팔이 베였다. 사람들이 끌어당겨 주지 않았다면 끝이었다."; } }
      ] }
  ] },
  zou: { place: "조", art: "arcZou", scenes: [
    { time: "도착한 날 · 코끼리 등", title: "상처 입은 마을",
      body: "조의 마을은 폐허에 가까웠다. 독가스 공격을 받고 살아남은 밍크족들이 붕대를 감은 채 서로를 돌보고 있었다. 그래도 그들은 낯선 손님에게 먼저 인사를 건넸다.",
      choices: [
        { id: "aid", label: "약과 물자를 나눈다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +20", personality: { empathy: 8 }, apply: (life) => { life.supplies -= 10; life.trust += 20; return "밍크족 아이가 꼬리를 흔들며 고맙다고 했다. 마을의 회복은 더뎠지만 확실했다."; } },
        { id: "rebuild", label: "무너진 나무집을 고친다", risk: "기술 +10 · 건강 -5", personality: { loyalty: 5 }, apply: (life) => { life.skill += 10; life.health -= 5; return "망치 소리가 하루 종일 울렸다. 저녁에는 모두가 같은 모닥불 앞에 앉았다."; } }
      ] }
  ] },
  whole_cake: { place: "홀케이크 아일랜드 외해", art: "arcWholeCake", scenes: [
    { time: "다과회 날 · 외해", title: "깨진 웨딩 케이크",
      body: "홀케이크에서 열린 결혼식 다과회가 엉망이 됐다는 전보가 날아왔다. 얼마 뒤 섬 쪽 바다에서 무시무시한 굶주림의 비명이 들렸다. 케이크를 찾는 거대한 해적 여왕이 바다를 건너고 있었다.",
      choices: [
        { id: "flee", label: "돛을 올려 최대한 멀리 달아난다", needs: { skill: 50 }, risk: "기술 50 필요", failRisk: "물자 -20 · 건강 -15",
          personality: { caution: 7 }, apply: () => "수평선 너머까지 달렸다. 뒤에서 섬 하나가 통째로 흔들리는 소리가 났다.",
          fail: (life) => { life.supplies -= 20; life.health -= 15; return "거대한 파도에 배가 뒤집힐 뻔했다. 짐 절반을 바다에 잃었다."; } },
        { id: "cake", label: "배에 있는 단것을 전부 바다에 띄운다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { freedom: 6, empathy: 3 },
          apply: (life) => { life.supplies -= 10; return "과자 상자들이 파도를 타고 흘러갔다. 비명이 잠시 멎었다가 다른 쪽으로 멀어졌다."; } }
      ] }
  ] },
  wano: { place: "와노국 외해", art: "arcWano", scenes: [
    { time: "불의 축제 밤 · 외해", title: "귀신섬의 불길",
      body: "닫힌 나라 와노국의 앞바다에서 밤하늘이 붉게 물들었다. 귀신섬 쪽에서 거대한 불기둥과 용의 울음소리 같은 것이 들렸다. 폭포 아래 거친 물살에는 작은 배 몇 척이 휩쓸려 있었다.",
      choices: [
        { id: "rescue", label: "물살에 휩쓸린 배를 끌어 준다", needs: { skill: 45 }, risk: "기술 45 필요 · 지역의 신뢰 +20", failRisk: "건강 -15",
          personality: { empathy: 8, loyalty: 5 }, apply: (life) => { life.trust += 20; return "밧줄을 던져 작은 배 세 척을 끌어왔다. 새벽녘, 귀신섬 쪽의 불길이 잦아드는 것을 함께 지켜보았다."; },
          fail: (life) => { life.health -= 15; return "급류에 휘말려 배가 크게 흔들렸다. 휩쓸리던 배 하나는 다른 이들이 건졌다."; } },
        { id: "watch", label: "멀리서 불길을 지켜본다", risk: "기술 +5", personality: { caution: 6 }, apply: (life) => { life.skill += 5; return "새벽이 오자 불길이 잦아들었다. 바다의 판도가 바뀌었다는 것만은 분명했다."; } }
      ] }
  ] },
  egghead: { place: "에그헤드 외해", art: "arcEgghead", scenes: [
    { time: "방송 날 · 에그헤드 근해", title: "봉쇄선과 세계를 향한 목소리",
      body: "미래섬 에그헤드를 해군 군함이 겹겹이 에워쌌다. 그때 모든 전보벌레가 한꺼번에 울리며 한 과학자의 목소리가 전 세계로 퍼졌다. 봉쇄선 한쪽에서는 거인들의 배가 군함과 맞서고 있었다.",
      choices: [
        { id: "slip", label: "봉쇄선 사이로 빠져나간다", needs: { skill: 55 }, risk: "기술 55 필요", failRisk: "건강 -20",
          personality: { freedom: 6, caution: 4 }, apply: () => "포성이 거인의 배 쪽으로 쏠린 틈에 빠져나왔다. 방송의 마지막 말이 귓가에 남았다.",
          fail: (life) => { life.health -= 20; return "유탄 하나가 갑판을 스쳤다. 겨우 봉쇄선을 벗어났다."; } },
        { id: "listen", label: "닻을 내리고 방송을 끝까지 듣는다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "세계가 숨기던 이야기의 조각이었다. 무엇을 믿어야 할지 몰라 밤새 생각했다."; } }
      ] }
  ] },
  elbaf: { place: "엘바프", art: "arcElbaf", scenes: [
    { time: "도착한 날 · 엘바프 해안", title: "거인의 나라에 온 손님",
      body: "엘바프 해안에 밀짚모자 깃발을 단 배가 닿았다. 거인 전사들이 커다란 웃음으로 손님을 맞았고, 마을에서는 손님을 위한 잔치 준비가 시작됐다.",
      choices: [
        { id: "feast", label: "잔치 준비를 돕는다", risk: "친구와의 유대 +10", personality: { empathy: 5, freedom: 5 }, apply: (life) => { life.friendBond += 10; return "통나무만 한 고기를 굽는 데 하루가 걸렸다. 거인과 사람이 한 식탁에서 웃었다."; } },
        { id: "look", label: "멀리서 손님들을 구경한다", risk: "기술 +5", personality: { caution: 5 }, apply: (life) => { life.skill += 5; return "밀짚모자 소년이 거인들 틈에서 고기를 뜯는 모습이 보였다. 이 나라에서 무슨 일이 시작될지는 아직 아무도 몰랐다."; } }
      ] }
  ] }
};

const arcId = (beatId, index) => `canon_arc_${beatId}_${index}`;

// Returns the next arc scene for this milestone, a lure to sail there, or null to show the milestone itself.
export function arcScene(life, beat, age) {
  const arc = ARCS[beat.id];
  if (life.creationVersion < 8 || !arc) return null;
  const base = { age, act: 3, species: "all", yearly: true, urgent: true };
  if (life.location.includes(arc.place)) {
    const index = arc.scenes.findIndex((_, i) => !life.seen.includes(arcId(beat.id, i)));
    if (index < 0) return null;
    const scene = arc.scenes[index];
    const originalId = arcId(beat.id, index);
    const timeLabel = `${canonRelationshipChanged(life) ? "IF 세계선 · " : ""}${scene.time}`;
    const custodyScene = custodyArcScene(life, beat.id, index, age, scene.time, originalId);
    if (custodyScene) return custodyScene;
    const card = { ...base, id: originalId, art: arc.art, title: scene.title, timeLabel,
      body: takenText(life, `arc:${beat.id}:${index}`) || (typeof scene.body === "function" ? scene.body(life) : scene.body),
      ...(scene.choices ? { choices: scene.choices } : { after: scene.after, manual: true }) };
    return attachCanonContact(life, beat.id, index, age, card);
  }
  const lure = `canon_arc_${beat.id}_lure`;
  const route = routeFor(life);
  const reachable = route.some((place) => place.includes(arc.place)) || arc.place === "에그헤드 외해" && route.includes("엘바프");
  if (life.seen.includes(lure) || !life.leftHome || life.homebound || life.retired || !reachable
    || yearRoll(life.seed ^ 0x3c6ef372, beat.id.length * 31 + age) % 2) return null;
  return { ...base, id: lure, art: "deck", title: `${arc.place}에서 온 소문`, timeLabel: `${canonRelationshipChanged(life) ? "IF 세계선 · " : ""}같은 무렵 · ${life.location}`,
    body: `${arc.place}에서 큰일이 벌어지고 있다는 소문이 부두에 돌았다. 밀짚모자라는 이름도 섞여 있었다. 지금 출발하면 그 한가운데에 닿을 수 있었다.`,
    choices: [
      { id: "go", label: `${ro(arc.place)} 향한다`, cost: 10, risk: "물자 -10 · 사건에 휘말릴 수 있음", personality: { freedom: 6, ambition: 4 },
        apply: (state) => { state.supplies -= 10; moveTo(state, arc.place === "알라바스타" ? "알라바스타 · 나노하나" : arc.place === "모크 타운" ? "자야 · 모크 타운" : arc.place);
          return `${eun(state.birth.name)} 돛을 올렸다. ${arc.place}의 하늘이 점점 가까워졌다.`; } },
      { id: "stay", label: "소문만 듣고 지금 하던 일을 한다", risk: "신중함이 자람", personality: { caution: 5 },
        apply: () => "소문은 다음 신문에서 확인하기로 했다." }
    ] };
}

export const ARC_COUNT = Object.keys(ARCS).length;
export const ARC_SCENE_COUNT = Object.values(ARCS).reduce((sum, arc) => sum + arc.scenes.length, 0);
export const ARC_ART = [...new Set(Object.values(ARCS).map((arc) => arc.art))];
