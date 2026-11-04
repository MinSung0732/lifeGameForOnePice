// Island events adapted from what the original story has shown about each place and period.
// `from`/`to` are years before the original present (larger = earlier); the player's own part is this game's fiction.
const ISLAND_EVENTS = [
  { id: "reverse_mountain", place: "리버스 마운틴", title: "거꾸로 오르는 해류",
    body: "사방의 바다에서 온 물이 한 봉우리로 모여 하늘을 향해 흘렀다. 배는 물길을 타고 산을 올라야 했고, 키를 놓치면 벽에 부딪혔다.", choices: [
      { id: "steer", label: "직접 키를 잡고 물길을 탄다", needs: { skill: 30 }, risk: "기술 30 필요 · 성공하면 기술 +10", failRisk: "건강 -15 · 물자 -10", personality: { ambition: 6, caution: -4 },
        apply: (life) => { life.skill += 10; return "뱃머리가 정확히 물길 한가운데를 탔다. 정상에서 내려다본 바다는 처음 보는 색이었다."; },
        fail: (life) => { life.health -= 15; life.supplies -= 10; return "배가 벽을 긁고 올라갔다. 부서진 판자와 함께 상자 몇 개가 떨어져 나갔다."; } },
      { id: "follow", label: "앞선 배의 항적을 따라간다", risk: "안전한 대신 늦음 · 물자 -10", cost: 10, personality: { caution: 6 },
        apply: (life) => { life.supplies -= 10; return "앞선 배가 지난 자리를 따라 천천히 올랐다. 오래 걸린 만큼 식량도 줄었다."; } }
    ] },
  { id: "laboon", place: "쌍둥이 언덕", from: 50, title: "벽을 들이받는 고래",
    body: "산처럼 큰 고래 라분이 레드 라인에 머리를 부딪치며 울었다. 오래전 떠난 동료들을 기다린다는 이야기가 등대 근처에 전해졌다.", choices: [
      { id: "song", label: "뱃노래를 불러 고래를 달랜다", risk: "아무 일도 바뀌지 않을지 모름 · 배려심이 자람", personality: { empathy: 8 },
        apply: (life) => { life.friendBond += 10; return "노래가 끝날 때까지 라분은 벽을 치지 않았다. 동료들과 그 밤을 오래 이야기했다."; } },
      { id: "pass", label: "고래가 진정할 때를 기다려 지나간다", risk: "기술 +10", personality: { caution: 5 },
        apply: (life) => { life.skill += 10; return "고래의 움직임과 물결의 주기를 읽고 그 사이로 배를 몰았다."; } }
    ] },
  { id: "whiskey_peak", place: "위스키 피크", from: 6, to: 2, title: "환영 잔치의 밤",
    body: "마을 사람들이 해적이든 상인이든 가리지 않고 술과 음식을 내왔다. 너무 친절한 잔치가 이상하다고 속삭이는 선원도 있었다.", choices: [
      { id: "drink", label: "잔치를 즐기며 마신다", risk: "결과는 그날 밤에 달림", personality: { freedom: 6, caution: -5 },
        apply: (life) => { life.supplies -= 20; return "새벽에 눈을 뜨니 창고가 비어 있었다. 마을의 정체가 바로크 워크스의 현상금 사냥꾼이라는 걸 뒤늦게 알았다."; } },
      { id: "scout", label: "취한 척하며 마을을 살핀다", needs: { skill: 40 }, risk: "기술 40 필요 · 성공하면 기술 +10 · 지역의 신뢰 +10", failRisk: "건강 -15 · 물자 -20", personality: { caution: 7 },
        apply: (life) => { life.skill += 10; life.trust += 10; return "집집마다 현상수배서가 붙어 있었다. 동료들을 깨워 사냥꾼들이 움직이기 전에 출항했다."; },
        fail: (life) => { life.health -= 15; life.supplies -= 20; return "뒷골목에서 들켰다. 간신히 배로 도망쳤지만 짐 일부를 두고 왔다."; } },
      { id: "ship", label: "사양하고 배에서 잔다", risk: "안전 · 지역의 신뢰 -10", personality: { caution: 6, empathy: -3 },
        apply: (life) => { life.trust -= 10; return "무례하다는 말을 들었지만 밤새 배는 무사했다."; } }
    ] },
  { id: "little_garden", place: "리틀 가든", title: "공룡이 사는 숲",
    body: "섬의 숲은 오래전 시대에 멈춰 있었다. 거대한 짐승이 나무 사이를 지나갔고, 그 고기 하나면 몇 주 치 식량이 될 터였다.", choices: [
      { id: "hunt", label: "공룡 사냥에 나선다", needs: { skill: 35, health: 40 }, risk: "기술 35 · 건강 40 필요 · 성공하면 물자 +30", failRisk: "건강 -20", personality: { ambition: 7, caution: -5 },
        apply: (life) => { life.supplies += 30; return "커다란 고기를 끌고 돌아오자 동료들이 환호했다."; },
        fail: (life) => { life.health -= 20; return "꼬리에 맞아 나무 위로 날아갔다. 빈손으로 숲을 빠져나왔다."; } },
      { id: "gather", label: "열매와 물만 챙긴다", risk: "물자 +10", personality: { caution: 6 },
        apply: (life) => { life.supplies += 10; return "짐승의 발자국을 피해 열매와 물을 모았다."; } }
    ] },
  { id: "drum_doctors", place: "드럼섬", from: 15, to: 3, title: "의사가 사라진 나라",
    body: "드럼 왕국의 왕은 이름난 의사들을 성에 모아 두고 자기 사람에게만 치료를 허락했다. 마을에는 열이 내리지 않는 아이가 있었다.", choices: [
      { id: "climb", label: "산꼭대기의 의사를 찾아 업고 오른다", needs: { health: 50 }, risk: "건강 50 필요 · 성공하면 지역의 신뢰 +20", failRisk: "건강 -20", personality: { empathy: 9, caution: -5 },
        apply: (life) => { life.trust += 20; life.health -= 10; return "눈보라 속에서 성에 닿았다. 괴팍한 노의사는 투덜대면서도 아이를 받아 주었다."; },
        fail: (life) => { life.health -= 20; return "중턱에서 발을 헛디뎠다. 마을 사람들이 내려와 둘을 끌고 갔다."; } },
      { id: "medicine", label: "가진 약을 나눈다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 6 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "아이의 열은 조금 내렸다. 왕이 없는 곳에서 사람들은 서로를 돌봤다."; } },
      { id: "away", label: "왕의 눈에 띄지 않게 지나간다", risk: "지역의 신뢰 -10", personality: { caution: 7, empathy: -5 },
        apply: (life) => { life.trust -= 10; return "성의 깃발을 피해 조용히 출항했다."; } }
    ] },
  { id: "drum_sakura", place: "드럼섬", to: 2, title: "분홍빛 눈",
    body: "폭군이 쫓겨난 뒤 섬은 새 이름을 얻었다. 눈 덮인 산에 분홍빛 눈이 내렸던 밤의 이야기를 사람들이 자랑스럽게 들려줬다.",
    after: (life) => { life.health += 10; return "새 나라의 의사가 진찰을 해 주었다. 값은 받지 않았다."; } },
  { id: "alabasta_drought", place: "알라바스타 · 나노하나", from: 5, to: 2, title: "비가 끊긴 나라",
    body: "알라바스타에 몇 해째 비가 오지 않았다. 수도에만 비가 내린다는 소문과 함께 반란군이 늘었고, 항구의 물값은 날마다 올랐다.", choices: [
      { id: "share", label: "배의 물을 나눈다", cost: 20, risk: "물자 -20 · 지역의 신뢰 +20", personality: { empathy: 9 },
        apply: (life) => { life.supplies -= 20; life.trust += 20; return "물통을 내리자 줄이 골목 끝까지 이어졌다."; } },
      { id: "sell", label: "오른 값에 물을 판다", risk: "물자 +30 · 지역의 신뢰 -20", personality: { ambition: 7, empathy: -8 },
        apply: (life) => { life.supplies += 30; life.trust -= 20; return "창고는 찼다. 항구 사람들은 배의 깃발을 기억했다."; } },
      { id: "dig", label: "비가 끊긴 이유를 캐 본다", needs: { skill: 50 }, risk: "기술 50 필요 · 성공하면 기술 +10 · 지역의 신뢰 +10", failRisk: "건강 -15", personality: { caution: 4, loyalty: 5 },
        apply: (life) => { life.skill += 10; life.trust += 10; return "항구 창고에서 댄스 파우더라는 가루의 흔적을 찾았다. 누군가 일부러 비를 훔치고 있었다."; },
        fail: (life) => { life.health -= 15; return "창고를 뒤지다 낯선 무리에게 쫓겨났다. 그들은 모래 위에서 흔적을 지웠다."; } }
    ] },
  { id: "mock_town", place: "자야 · 모크 타운", title: "꿈을 비웃는 마을",
    body: "모크 타운의 술집에서 하늘에 섬이 있다는 이야기를 꺼내자 웃음이 터졌다. 이 마을에서는 큰 꿈을 말하는 사람이 가장 먼저 얻어맞았다.", choices: [
      { id: "fight", label: "비웃은 사람에게 주먹을 든다", needs: { skill: 40, health: 40 }, risk: "기술 40 · 건강 40 필요 · 성공하면 지역의 신뢰 +10", failRisk: "건강 -20", personality: { ambition: 6, caution: -6 },
        apply: (life) => { life.trust += 10; life.health -= 5; return "술집이 조용해졌다. 다음 날부터 아무도 그 이야기를 비웃지 않았다."; },
        fail: (life) => { life.health -= 20; return "몇 대 맞고 길바닥에 나앉았다. 웃음소리가 뒤따라왔다."; } },
      { id: "laugh", label: "같이 웃고 넘긴다", risk: "자유로움 -5 · 물자 변화 없음", personality: { caution: 5, freedom: -5 },
        apply: () => "웃음 속에 이야기를 묻었다. 그래도 하늘을 올려다보는 버릇은 남았다." },
      { id: "listen", label: "구석의 노인에게 하늘섬 이야기를 묻는다", risk: "기술 +10", personality: { freedom: 6 },
        apply: (life) => { life.skill += 10; return "노인은 거대한 해류와 구름 이야기를 했다. 아무도 믿지 않는 이야기를 받아 적었다."; } }
    ] },
  { id: "davy_back", place: "롱 링 롱 랜드", title: "데이비 백 파이트",
    body: "섬에 정박한 해적단이 오래된 해적 놀이로 승부를 걸어 왔다. 이긴 쪽이 진 쪽의 동료를 데려가는, 거절하기도 받기도 어려운 놀이였다.", choices: [
      { id: "accept", label: "승부를 받는다", needs: { skill: 45, health: 40 }, risk: "기술 45 · 건강 40 필요 · 이기면 물자 +20", failRisk: "동료와의 유대 -20", personality: { ambition: 7, loyalty: 5 },
        apply: (life) => { life.supplies += 20; life.friendBond += 10; return "마지막 경기에서 이겼다. 상대 선장은 분해하며 물자를 넘겼다."; },
        fail: (life) => { life.friendBond -= 20; return "졌다. 동료 하나가 상대의 깃발 아래로 넘어갔고, 그날 밤 갑판이 조용했다."; } },
      { id: "decline", label: "승부를 거절하고 떠난다", risk: "지역의 신뢰 -10 · 겁쟁이라는 소문", personality: { caution: 7 },
        apply: (life) => { life.trust -= 10; return "등 뒤로 야유가 쏟아졌지만 동료는 모두 배에 남았다."; } }
    ] },
  { id: "aqua_laguna", place: "워터 세븐", title: "아쿠아 라구나",
    body: "해마다 이맘때 워터 세븐에 큰 해일이 덮친다는 경고가 돌았다. 주민들은 높은 곳으로 짐을 옮겼고 조선소는 일을 멈췄다.", choices: [
      { id: "haul", label: "배를 높은 독으로 끌어 올린다", needs: { skill: 40 }, risk: "기술 40 필요 · 성공하면 기술 +10", failRisk: "물자 -20", personality: { caution: 5, ambition: 3 },
        apply: (life) => { life.skill += 10; return "해일이 지나간 뒤에도 배는 멀쩡했다. 조선공들이 매듭을 보고 고개를 끄덕였다."; },
        fail: (life) => { life.supplies -= 20; return "도르래가 끊겼다. 배는 물살에 부딪혀 선체 수리에 큰돈이 들었다."; } },
      { id: "help", label: "주민들의 대피를 돕는다", risk: "건강 -10 · 지역의 신뢰 +20", personality: { empathy: 8, loyalty: 4 },
        apply: (life) => { life.health -= 10; life.trust += 20; return "마지막 골목의 노인을 업고 계단을 올랐다. 해일은 발아래에서 부서졌다."; } },
      { id: "leave", label: "해일 전에 섬을 떠난다", cost: 10, risk: "물자 -10", personality: { caution: 7 },
        apply: (life) => { life.supplies -= 10; return "먼바다에서 섬을 덮치는 파도를 보았다."; } }
    ] },
  { id: "celestial_parade", place: "샤본디 제도", title: "천룡인의 행차",
    body: "길 위의 모두가 무릎을 꿇었다. 천룡인이 노예를 끌고 지나갔고, 앞을 막은 아이 하나가 그 걸음 앞에 얼어붙어 있었다.", choices: [
      { id: "kneel", label: "고개를 숙이고 지나가기를 기다린다", risk: "아무도 다치지 않을 수도 있음", personality: { caution: 8, empathy: -4 },
        apply: () => { return "행렬이 지나간 뒤에야 숨을 쉬었다. 아이가 어떻게 됐는지는 보지 못했다."; } },
      { id: "hide", label: "아이를 골목으로 낚아챈다", needs: { skill: 40, health: 40 }, risk: "기술 40 · 건강 40 필요 · 성공하면 지역의 신뢰 +20", failRisk: "건강 -25 · 지역의 신뢰 -10", personality: { empathy: 10, caution: -8 },
        apply: (life) => { life.trust += 20; life.injustice = true; return "행렬이 눈치채기 전에 아이를 골목 안으로 끌어당겼다. 군중이 조용히 길을 막아 주었다."; },
        fail: (life) => { life.health -= 25; life.trust -= 10; return "경호원의 눈에 띄었다. 간신히 군중 속으로 사라졌지만 몸에는 깊은 상처가 남았다."; } }
    ] },
  { id: "otohime_petition", place: "어인섬", from: 17, to: 10, title: "왕비의 서명 운동",
    body: "오토히메 왕비가 광장에서 서명을 모았다. 인간과 어인이 함께 지상에서 살 수 있도록 세계에 청하자는 것이었다. 비웃는 사람도 적지 않았다.", choices: [
      { id: "sign", label: "이름을 적는다", risk: "지역의 신뢰 +10 · 배려심이 자람", personality: { empathy: 8, loyalty: 4 },
        apply: (life) => { life.trust += 10; return "작은 종이에 이름을 적었다. 왕비는 한 사람 한 사람에게 고맙다고 했다."; } },
      { id: "doubt", label: "아직은 믿기 어렵다며 지켜본다", risk: "신중함이 자람", personality: { caution: 7 },
        apply: () => "광장을 떠나며 몇 번이고 뒤를 돌아보았다." }
    ] },
  { id: "fishman_wary", place: "어인섬", to: 9, title: "해저의 경계",
    body: "어인섬 거리에는 지상 사람을 경계하는 눈빛과 함께, 오래전 지상의 친구를 만들자고 했던 왕비의 이야기가 함께 남아 있었다.",
    after: (life) => { life.skill += 10; return "해류와 거품 코팅의 쓰임을 배웠다."; } },
  { id: "riku_dressrosa", place: "드레스로자", from: 60, to: 11, title: "가난하지만 다정한 나라",
    body: "드레스로자의 리쿠 왕가는 화려하지 않았다. 왕실의 곳간을 열어 백성의 빚을 갚아 준다는 이야기를 시장 사람들이 자랑처럼 했다.",
    after: (life) => { life.trust += 10; return "시장 사람들과 오래 이야기를 나눴다."; } },
  { id: "toys_dressrosa", place: "드레스로자", from: 10, to: 1, title: "말하는 장난감",
    body: "도플라밍고가 다스리는 드레스로자의 밤에 한쪽 다리의 장난감 병정이 말을 걸었다. 자기를 기억하는 사람이 섬에 아무도 없다고 했다.", choices: [
      { id: "remember", label: "장난감의 이름을 기억해 준다", risk: "배려심이 자람 · 친구와의 유대 +10", personality: { empathy: 9, loyalty: 4 },
        apply: (life) => { life.friendBond += 10; return "장난감은 사람이었던 시절의 이름을 몇 번이고 되풀이했다. 그 이름을 일지에 적었다."; } },
      { id: "colosseum", label: "콜로세움 경기에 나간다", needs: { skill: 60, health: 50 }, risk: "기술 60 · 건강 50 필요 · 이기면 물자 +30", failRisk: "건강 -30", personality: { ambition: 8 },
        apply: (life) => { life.supplies += 30; return "환호 속에서 상금을 받았다. 패배한 투사들이 어디로 끌려가는지는 끝내 알 수 없었다."; },
        fail: (life) => { life.health -= 30; return "모래 위에 쓰러졌다. 의식을 잃기 전 관중석에서 장난감들이 고개를 돌리는 것을 보았다."; } },
      { id: "leave", label: "이 나라에 오래 머물지 않는다", risk: "신중함이 자람", personality: { caution: 7 },
        apply: () => "화려한 거리를 빠르게 지나 출항했다." }
    ] },
  { id: "tontatta", place: "그린 비트", title: "사라지는 물건",
    body: "배에 둔 물건이 하나씩 사라졌다. 아주 작은 발자국이 숲 쪽으로 이어졌고, 섬 사람들은 톤타타족이라는 소인 이야기를 했다.", choices: [
      { id: "track", label: "작은 발자국을 따라간다", risk: "결과는 알 수 없음 · 기술 +10", personality: { freedom: 6, empathy: 4 },
        apply: (life) => { life.skill += 10; life.friendBond += 10; return "숲속에서 작은 사람들이 물건을 고쳐 쓰고 있었다. 화를 낼 수 없어 남은 연장도 주고 왔다."; } },
      { id: "tie", label: "물건을 단단히 묶어 둔다", risk: "물자 +10", personality: { caution: 6 },
        apply: (life) => { life.supplies += 10; return "다음 날 아침 매듭은 모두 풀려 있었지만 물건은 그대로였다."; } }
    ] },
  { id: "zou_climb", place: "조", title: "코끼리의 다리",
    body: "조는 바다를 걷는 거대한 코끼리 주네샤의 등 위에 있었다. 섬에 오르려면 끝없이 높은 다리를 타고 올라가야 했다.", choices: [
      { id: "climb", label: "직접 다리를 타고 오른다", needs: { health: 50 }, risk: "건강 50 필요 · 성공하면 지역의 신뢰 +10 · 기술 +10", failRisk: "건강 -20", personality: { ambition: 6, freedom: 5 },
        apply: (life) => { life.trust += 10; life.skill += 10; return "꼭대기에 오르자 밍크족이 가르추라는 인사로 맞아 주었다."; },
        fail: (life) => { life.health -= 20; return "중간에서 손을 놓쳤다. 밍크족 경비가 줄을 내려 끌어 올려 주었다."; } },
      { id: "guide", label: "밍크족의 안내를 기다린다", cost: 10, risk: "물자 -10 · 안전", personality: { caution: 6 },
        apply: (life) => { life.supplies -= 10; return "사흘을 기다린 끝에 안내인의 승강 바구니를 탔다."; } }
    ] },
  { id: "sphinx_home", place: "스핑크스 섬", from: 40, to: 3, title: "고향으로 오는 돈",
    body: "가난한 스핑크스 섬에 해마다 출처를 밝히지 않은 돈과 물자가 닿았다. 섬사람들은 그것이 흰 수염이 보낸 것이라고 믿었다.",
    after: (life) => { life.trust += 10; return "섬사람들은 바다 사람을 쉽게 미워하지 않았다."; } },
  { id: "sphinx_after", place: "스핑크스 섬", to: 2, title: "주인을 잃은 고향",
    body: "마린포드 전쟁 뒤 흰 수염의 고향에는 더 이상 돈이 오지 않았다. 남은 이들은 섬을 지키겠다는 옛 동료들의 이야기를 했다.", choices: [
      { id: "help", label: "물자를 나누고 일을 돕는다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +20", personality: { empathy: 8, loyalty: 6 },
        apply: (life) => { life.supplies -= 10; life.trust += 20; return "밭일을 돕고 지붕을 고쳤다. 섬사람들이 다음에도 오라고 했다."; } },
      { id: "pass", label: "짧게 들르고 떠난다", risk: "변화 없음", personality: { caution: 4 },
        apply: () => "섬 언덕의 무덤 쪽을 한 번 바라보고 출항했다." }
    ] },
  { id: "hachinosu", place: "하치노스 근해", title: "해적섬의 소문",
    body: "해골 모양의 바위섬 하치노스에는 법이 닿지 않았다. 근해를 지나는 배마다 그곳에서 누가 사람을 모으는지 이야기했다.", choices: [
      { id: "buy", label: "정보를 사들인다", cost: 20, risk: "물자 -20 · 기술 +10", personality: { ambition: 5, caution: 3 },
        apply: (life) => { life.supplies -= 20; life.skill += 10; return "어느 항로가 위험한지, 누가 누구와 손을 잡았는지를 알게 됐다."; } },
      { id: "avoid", label: "멀리 돌아간다", risk: "신중함이 자람", personality: { caution: 7 },
        apply: () => "섬의 그림자가 수평선에서 사라질 때까지 경계를 풀지 않았다." }
    ] },
  { id: "wano_closed", place: "와노국 외해", from: 20, to: 1, title: "닫힌 나라의 폭포",
    body: "와노국은 나라 밖 배를 들이지 않았다. 카이도가 나라를 차지한 뒤로는 폭포 아래에서 표류한 무사를 보았다는 이야기가 가끔 들렸다.", choices: [
      { id: "shelter", label: "표류한 무사를 숨겨 준다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { empathy: 8, loyalty: 5 },
        apply: (life) => { life.supplies -= 10; life.skill += 10; return "무사는 말없이 검 쓰는 법 몇 가지를 보여 주고, 다시 나라로 돌아가는 배를 찾아 떠났다."; } },
      { id: "pass", label: "닫힌 나라의 바다를 피해 간다", risk: "신중함이 자람", personality: { caution: 7 },
        apply: () => "폭포 소리가 멀어질 때까지 노를 저었다." }
    ] },
  { id: "totland_tribute", place: "홀케이크 아일랜드 외해", from: 60, to: 1, title: "과자 조공",
    body: "빅 맘의 함대가 다가와 이 바다를 지나려면 과자를 바치라고 했다. 빅 맘의 영역에서 약속을 어긴 섬의 이야기는 모두가 알았다.", choices: [
      { id: "pay", label: "과자와 물자를 바친다", cost: 20, risk: "물자 -20 · 안전", personality: { caution: 7 },
        apply: (life) => { life.supplies -= 20; return "함대는 상자를 받아 들고 길을 열었다."; } },
      { id: "refuse", label: "거절하고 빠져나간다", needs: { skill: 60, health: 50 }, risk: "기술 60 · 건강 50 필요 · 성공하면 지역의 신뢰 +10", failRisk: "건강 -25 · 물자 -20", personality: { freedom: 8, caution: -6 },
        apply: (life) => { life.trust += 10; return "포탄 사이로 해류를 타고 빠져나왔다. 그 이야기는 이웃 바다까지 퍼졌다."; },
        fail: (life) => { life.health -= 25; life.supplies -= 20; return "배가 붙잡혔다. 두 배의 과자를 바치고서야 풀려났다."; } }
    ] }
];

export function islandEvent(life, age, base) {
  if (life.creationVersion < 3 || life.ending) return null;
  const beforePresent = life.birth.yearsBeforeCurrent - age;
  const event = ISLAND_EVENTS.find((entry) => entry.place === life.location && !life.seen.includes(`life_isle_${entry.id}`)
    && (entry.from === undefined || beforePresent <= entry.from) && (entry.to === undefined || beforePresent >= entry.to));
  if (!event) return null;
  const { id, place, from, to, ...card } = event;
  return { ...base, id: `life_isle_${id}`, art: card.choices ? "deck" : "workbench", ...card };
}

export const islandPlaces = ISLAND_EVENTS.map((entry) => entry.place);
