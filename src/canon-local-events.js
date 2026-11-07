// New local canon encounters for rule 23. Older saves retain their authored arc lists.
const intervene = (beat, label, result, later) => ({
  id: "change_" + beat, label, when: (life) => life.mode === "free",
  cost: 8, risk: "더 자유로운 모드 · 물자 8 필요 · 이후 원작 사건에도 흔적이 남음",
  personality: { empathy: 5, freedom: 4, caution: -2 },
  apply: (life) => {
    life.supplies -= 8;
    life.trust += 8;
    life.reputation += 3;
    life.people ||= {};
    life.people.canonRipples ||= {};
    life.people.canonRipples[beat] = later;
    return result;
  }
});

export const LOCAL_ARCS_V23 = {
  departure: { place: "이스트 블루 · 푸샤 마을", art: "arcFoosha", scenes: [
    { time: "출항의 아침 · 푸샤 항구", title: "밀짚모자를 쓴 소년의 작은 배",
      body: "루피가 고향 사람들에게 인사를 건네며 혼자 배를 밀었다. 항구의 작은 소동 가운데 소년과 눈이 마주쳤다.",
      choices: [
        { id: "wish", label: "루피에게 무사히 돌아오라고 인사한다", risk: "친구와의 유대 +3",
          apply: (s) => { s.friendBond += 3; return "루피는 환하게 웃으며 먼바다를 손가락으로 가리켰다."; } },
        intervene("departure", "루피에게 해군의 검문 항로를 미리 알려 준다",
          "루피는 알려 준 암초 사이로 배를 틀었다. 그 정보를 알게 된 해군도 소년이 지나간 항로를 추적했다.",
          "당신이 알려 준 우회 항로의 이야기가 해군 기지에도 전해져, 첫 동료를 찾는 루피의 행적에 새로운 경계가 붙었다.")
      ] }
  ] },
  coby: { place: "이스트 블루 · 푸샤 마을", art: "arcFoosha", scenes: [
    { time: "출항 뒤 · 항구의 뒷길", title: "코비가 남긴 결심",
      body: "루피와 동행한 코비가 해군이 되고 싶다고 말한 이야기가 항구에 전해졌다. 루피가 돌아오기 전에 주민들이 소년에게 보낼 물자를 모으고 있었다.",
      choices: [
        { id: "gather", label: "코비에게 보낼 물자를 챙겨 준다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "주민들은 소년이 자신의 길을 찾아가기를 빌었다."; } },
        intervene("coby", "코비가 해군이 되겠다는 결심을 담은 편지를 전달한다",
          "당신의 연락이 코비의 결심을 해군 기지에 더 일찍 알렸다.",
          "셸즈 타운의 해군은 코비의 사연을 미리 들었고, 밀짚모자를 쓴 소년에 관한 질문도 늘어났다.")
      ] }
  ] },
  zoro: { place: "셸즈 타운", art: "arcShellsTown", scenes: [
    { time: "그날 오전 · 해군 기지", title: "기둥에 묶인 검객",
      body: "조로가 기지 안뜰의 기둥에 묶여 있었다. 루피는 주변의 경비병을 피해 들어왔고, 당신을 발견하자 검객이 어디 있는지 물었다.",
      choices: [
        { id: "guide", label: "루피에게 기지 안뜰의 길을 알려 준다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "루피가 곧장 기둥 쪽으로 뛰었다. 조로는 그가 들고 온 검을 바라봤다."; } },
        intervene("zoro", "조로의 검을 몰래 빼내 루피에게 직접 건넨다",
          "검을 건네는 순간 경보가 울렸다. 조로는 당신의 얼굴을 기억했고 기지는 당신을 수상한 협력자로 지목했다.",
          "셸즈 타운의 추적 명단에 당신의 인상착의가 남아, 다음 항구에서도 검문이 강화됐다.")
      ] },
    { time: "같은 날 · 기지 밖 골목", title: "모건이 쓰러진 뒤",
      body: "모건 대령이 패배한 뒤 해군 기지와 거리가 어수선했다. 조로가 새로 찾은 검집을 고쳐 매고 있었다.",
      choices: [
        { id: "speak", label: "조로에게 검이 괜찮은지 묻는다", risk: "친구와의 유대 +3",
          apply: (s) => { s.friendBond += 3; return "조로는 짧게 고개를 끄덕였다. 이제 막 새 배에 오를 생각이었다."; } },
        { id: "wounded", label: "다친 해병을 피신시킨다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "혼란 속에서도 부상자를 옮기자 사람들이 길을 비켰다."; } }
      ] }
  ] },
  buggy: { place: "오렌지 마을", art: "arcOrangeTown", scenes: [
    { time: "그날 · 무너진 마을 광장", title: "버기의 대포 앞",
      body: "버기 해적단이 마을을 가로막았다. 루피와 나미는 대포가 향하는 골목으로 달려가고 있었다. 버기는 떠나가는 주민을 붙잡으라 외쳤다.",
      choices: [
        { id: "hide", label: "나미에게 피난할 골목을 알려 준다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "나미는 손짓으로 답하고 좁은 골목으로 몸을 숨겼다."; } },
        intervene("buggy", "버기의 대포 방향을 돌려 루피에게 기회를 만든다",
          "루피가 곧장 뛰어들었고, 버기 해적단은 당신까지 공범으로 몰았다.",
          "버기의 잔당이 당신의 배를 찾고 있다는 소문이 다음 항구에 퍼졌다.")
      ] },
    { time: "버기가 물러난 뒤 · 시장", title: "피난민과 수배서",
      body: "거리가 조용해진 뒤 루피는 떠날 준비를 했다. 나미가 지도와 장부를 확인하며 가게 주인을 돕고 있었다.",
      choices: [
        { id: "offer", label: "나미에게 안전한 물길을 설명한다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "나미는 당신의 설명을 꼼꼼히 적고 계산이 맞는지 확인했다."; } },
        { id: "restore", label: "다친 상인의 물건을 다시 진열한다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "상인은 마음을 놓고 문을 다시 열었다."; } }
      ] }
  ] },
  usopp: { place: "시럽 마을", art: "arcSyrup", scenes: [
    { time: "그날 새벽 · 해변", title: "거짓말이 아니었던 해적",
      body: "우솝이 해안으로 달려 나와 누군가 해적들이 정말 온다고 외쳤다. 숲길에서 루피 일행의 발소리가 들렸다.",
      choices: [
        { id: "listen", label: "우솝의 경고를 듣고 주민에게 알린다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "많은 사람은 믿지 않았지만 몇몇 주민은 문을 걸었다."; } },
        intervene("usopp", "우솝과 함께 해적의 상륙 지점을 먼저 막는다",
          "우솝은 뜻밖의 지원군을 얻었다. 밀려오는 해적을 막는 동안 당신도 공격자의 눈에 띄었다.",
          "우솝은 당신을 믿을 만한 사람으로 기억했고, 다음 항해의 보급 연락망에 당신의 이름을 남겼다.")
      ] },
    { time: "이튿날 · 저택 앞", title: "메리호의 마지막 점검",
      body: "카야가 고잉 메리호를 건네기로 했다. 우솝이 고향을 떠나기 전 선체에 남은 흠집을 살피고 있었다.",
      choices: [
        { id: "repair", label: "우솝과 함께 선체의 매듭을 보강한다", risk: "기술 +5",
          apply: (s) => { s.skill += 5; return "우솝은 당신이 묶은 매듭을 자랑스럽게 가리켰다."; } },
        { id: "farewell", label: "카야와 함께 배를 배웅한다", risk: "친구와의 유대 +4",
          apply: (s) => { s.friendBond += 4; return "카야는 배가 수평선에 닿을 때까지 손을 흔들었다."; } }
      ] }
  ] },
  baratie: { place: "바라티에", art: "arcBaratie", scenes: [
    { time: "낮 · 해상 레스토랑", title: "배고픈 손님과 요리사",
      body: "상디가 식당 밖에서 굶주린 남자에게 음식을 내주었다. 루피는 그 광경을 보고 상디를 자기 배에 태우고 싶다고 말했다.",
      choices: [
        { id: "serve", label: "상디와 함께 식탁을 정리한다", risk: "친구와의 유대 +4",
          apply: (s) => { s.friendBond += 4; return "상디는 손님에게 음식이 먼저라며 접시를 건넸다."; } },
        intervene("baratie", "크리크 함대의 접근을 미리 알려 식당 배를 방어한다",
          "상디와 루피가 주민들을 대피시킬 시간을 벌었지만, 크리크의 감시병에게 당신의 얼굴이 알려졌다.",
          "크리크의 패잔병이 남긴 기록 때문에 다음 항로에서 당신이 밀짚모자의 협력자라는 소문이 돌았다.")
      ] },
    { time: "미호크가 떠난 뒤 · 갑판", title: "부러진 검을 쥔 조로",
      body: "조로는 패배한 몸으로도 세계 최고의 검객이 되겠다고 외쳤다. 루피는 그 약속을 묵묵히 들었다.",
      choices: [
        { id: "bandage", label: "상처를 감쌀 붕대를 건넨다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "조로는 말없이 붕대를 받았고 다시 검을 내려다봤다."; } },
        { id: "quiet", label: "조로의 결의를 방해하지 않는다", risk: "신중함 +4",
          personality: { caution: 4 }, apply: () => "당신은 두 사람 사이에 흐르는 약속의 무게를 느꼈다." }
      ] }
  ] },
  arlong: { place: "아론 파크", art: "arcArlongPark", scenes: [
    { time: "그날 · 코코야시 마을", title: "나미의 밀짚모자",
      body: "나미가 루피에게 도와 달라고 말했다. 루피는 자신의 밀짚모자를 그녀에게 맡기고 아론 파크로 향했다.",
      choices: [
        { id: "comfort", label: "나미에게 물과 붕대를 가져다준다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "나미는 잠시 고개를 들고 고맙다고 말했다."; } },
        intervene("arlong", "아론이 모은 세금 장부를 빼내 주민들에게 공개한다",
          "해방을 앞둔 주민들이 증거를 손에 넣었다. 아론 일당의 남은 세력이 당신의 배를 위협하기 시작했다.",
          "아론 파크에서 발견된 장부가 해군에도 전해져, 다음 항구의 수배서와 검문 내용이 달라졌다.")
      ] },
    { time: "승리 뒤 · 마을의 잔치", title: "해방된 거리의 항해사",
      body: "아론의 지배가 끝나자 마을에 노래가 퍼졌다. 나미는 마지막으로 집을 바라본 뒤 루피 일당의 배에 올랐다.",
      choices: [
        { id: "cheer", label: "주민과 함께 나미를 배웅한다", risk: "친구와의 유대 +4",
          apply: (s) => { s.friendBond += 4; return "나미는 해방된 고향을 뒤로하고 새로운 바다를 바라봤다."; } },
        { id: "repair", label: "부서진 집의 지붕을 함께 수리한다", risk: "기술 +5",
          apply: (s) => { s.skill += 5; return "마을은 떠나는 사람과 남는 사람의 손으로 다시 자리를 잡기 시작했다."; } }
      ] }
  ] },
  skypiea_trial: { place: "스카이피아", art: "arcSkypiea", scenes: [
    { time: "신의 섬 진입 전 · 구름다리", title: "와이퍼가 지키는 길",
      body: "와이퍼가 샨디아 전사들과 구름다리를 막았다. 그때 루피 일행도 길을 찾아 뛰어왔다. 전사들은 누구 편인지 물었다.",
      choices: [
        { id: "talk", label: "와이퍼에게 무고한 주민을 피신시키겠다고 말한다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "와이퍼는 경계를 풀지 않았지만 민간인을 지나가게 했다."; } },
        intervene("skypiea_trial", "샨디아와 루피에게 신관의 함정 지도를 직접 건넨다",
          "지도 덕분에 전사들은 먼저 움직였다. 에넬의 신관은 누가 신의 영역을 넘나드는지 추적하기 시작했다.",
          "상층 구름길에 당신이 남긴 지도가 돌아다니고, 샨디아 전사들이 먼저 움직여 신관들의 계획이 흔들렸다.")
      ] },
    { time: "같은 날 · 신의 섬", title: "에넬의 번개 앞",
      body: "에넬이 번개로 섬을 뒤흔들었다. 숲이 갈라진 사이 루피의 고무 몸이 번개를 막아 내자 모두가 숨을 멈췄다.",
      choices: [
        { id: "retreat", label: "루피의 뒤에서 다친 사람을 구한다", risk: "건강 -4 · 지역의 신뢰 +6",
          apply: (s) => { s.health -= 4; s.trust += 6; return "루피가 에넬을 막는 동안 당신은 쓰러진 사람을 끌어냈다."; } },
        { id: "watch", label: "에넬의 번개를 피해 대피로를 찾는다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "황금빛 번개가 사라지는 길을 따라 구름 밖으로 나왔다."; } }
      ] }
  ] },
  skypiea_bell: { place: "스카이피아", art: "arcSkypiea", scenes: [
    { time: "황금 종이 울린 날 · 구름바다", title: "루피가 남긴 소리",
      body: "루피가 에넬을 물리친 뒤 황금 종이 울렸다. 구름길에서 루피는 당신에게 함께 종소리를 들었느냐고 물었다.",
      choices: [
        { id: "reply", label: "종소리가 청해에도 닿았다고 답한다", risk: "친구와의 유대 +5",
          apply: (s) => { s.friendBond += 5; return "루피는 기뻐하며 크리켓에게도 들렸으면 좋겠다고 말했다."; } },
        intervene("skypiea_bell", "주민들의 연락 배를 이끌어 종소리의 기록을 청해에 전한다",
          "당신이 기록한 신호와 종소리는 아래 바다의 항해자들에게 예상보다 빨리 닿았다.",
          "크리켓에게 닿은 기록에 당신의 이름도 실려, 청해의 항해자들이 하늘섬의 진실을 더 빨리 알게 됐다.")
      ] }
  ] },
  enies_lobby: { place: "에니에스 로비", art: "arcEniesLobby", scenes: [
    { time: "버스터 콜 직전 · 사법의 탑", title: "로빈의 선택",
      body: "로빈이 살고 싶다고 외치자 루피 일행이 사법의 탑으로 달려갔다. 경비병들이 좁은 통로를 막았고 로빈과 당신이 눈을 마주쳤다.",
      choices: [
        { id: "clear", label: "로빈이 도망갈 수 있는 좁은 계단을 알려 준다", risk: "기술 +5",
          apply: (s) => { s.skill += 5; return "로빈은 당신에게 짧게 고개를 끄덕이고 동료들 쪽으로 뛰었다."; } },
        intervene("enies_lobby", "CP9의 비밀 수송명단을 빼내 로빈에게 직접 건넨다",
          "로빈은 명단을 확인한 뒤 동료들과 탈출을 준비했다. 정부는 누가 명단을 유출했는지 찾기 시작했다.",
          "세계정부가 잃어버린 수송명단을 추적하며, 당신의 배에도 비밀 검문 명령을 내렸다.")
      ] },
    { time: "버스터 콜 · 불타는 해안", title: "조로와 피난선",
      body: "군함의 포격이 터지는 가운데 조로가 다친 사람을 피하라고 외쳤다. 밀짚모자 일당의 탈출선이 좁은 수로를 지나고 있었다.",
      choices: [
        { id: "evacuate", label: "조로의 신호를 따라 피난선을 움직인다", risk: "지역의 신뢰 +6",
          apply: (s) => { s.trust += 6; return "조로의 칼끝이 가리키는 틈으로 작은 배가 지나갔다."; } },
        { id: "hold", label: "아직 남은 사람에게 경고한다", risk: "건강 -4 · 지역의 신뢰 +5",
          apply: (s) => { s.health -= 4; s.trust += 5; return "폭음 때문에 목소리는 잘 들리지 않았지만 몇몇이 신호를 알아차렸다."; } }
      ] }
  ] },
  thriller_shadows: { place: "스릴러 바크", art: "arcThrillerBark", scenes: [
    { time: "안개 속 · 숲의 공연장", title: "브룩의 오래된 약속",
      body: "브룩이 바이올린을 내려놓고 그림자를 빼앗겼다고 말했다. 루피는 브룩이 음악가라며 함께 가자고 외쳤다.",
      choices: [
        { id: "comfort", label: "브룩에게 라분의 이야기를 더 듣는다", risk: "친구와의 유대 +5",
          apply: (s) => { s.friendBond += 5; return "브룩은 오래된 동료들의 노래를 떠올렸다."; } },
        intervene("thriller_shadows", "브룩과 함께 그림자를 잃은 사람들의 대피로를 개척한다",
          "모리아의 부하들이 당신을 쫓기 시작했지만 그림자를 잃은 사람들은 안전한 곳으로 모였다.",
          "밤을 살아남은 사람들이 모리아의 지배가 끝난 뒤 당신을 찾아와, 새로운 정보와 피난로를 알려 줬다.")
      ] },
    { time: "그날 밤 · 거대한 성", title: "모리아가 드리운 그림자",
      body: "모리아의 웃음과 거대한 좀비의 발소리가 성을 울렸다. 루피 일당이 진입하고 당신은 모리아의 부하와 마주쳤다.",
      choices: [
        { id: "retreat", label: "모리아의 부하를 피해 주민을 밖으로 이끈다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "그림자가 사라지기 전에 주민들은 가까스로 빛이 들지 않는 곳으로 이동했다."; } },
        { id: "observe", label: "모리아의 그림자 능력을 멀리서 관찰한다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "능력이 무엇을 빼앗는지 확인한 뒤 사람들에게 주의를 줬다."; } }
      ] }
  ] },
  thriller_aftermath: { place: "스릴러 바크", art: "arcThrillerBark", scenes: [
    { time: "모리아가 쓰러진 뒤 · 외딴 부두", title: "조로가 지켜 낸 침묵",
      body: "쿠마가 떠난 뒤 조로가 피투성이가 된 채 서 있었다. 상디가 다가가기 전 당신은 조로의 곁에 잠시 멈춰 섰다.",
      choices: [
        { id: "bandage", label: "조로에게 아무것도 묻지 않고 붕대를 건넨다", risk: "친구와의 유대 +5",
          apply: (s) => { s.friendBond += 5; return "조로는 붕대를 받으며 아무 일도 없었다고 말했다."; } },
        intervene("thriller_aftermath", "부상당한 조로를 위해 비밀 치료 물자를 조달한다",
          "조로는 도움을 거절하지 않았다. 그를 도운 기록이 다음 기항지에서 밀짚모자 일당에게 전달됐다.",
          "샤본디 근해에서 조로가 살아남은 일을 아는 이들이 당신의 배를 알아보고, 수리할 물자를 내주겠다고 했다.")
      ] }
  ] },
  amazon_lily: { place: "아마존 릴리 외해", art: "arcAmazonLily", scenes: [
    { time: "루피가 도착한 날 · 캄 벨트 바깥", title: "여인섬의 경고",
      body: "해안 경비정을 이끌던 보아 핸콕이 낯선 배에 더 다가오지 말라고 경고했다. 당신은 여인섬에 상륙할 수 없었지만 경비정에서 대화를 나눌 기회를 얻었다.",
      choices: [
        { id: "respect", label: "핸콕에게 섬의 규칙을 존중하겠다고 약속한다", risk: "지역의 신뢰 +5",
          apply: (s) => { s.trust += 5; return "핸콕은 경계를 풀지는 않았지만 선을 넘지 않는 배를 보내줬다."; } },
        intervene("amazon_lily", "해왕류 경보를 여인섬 경비정에 전달해 항로를 연다",
          "핸콕의 경비정은 해왕류를 피해 이동했다. 그러나 섬으로 향하는 외부 배가 있다는 소문이 해군에도 전해졌다.",
          "임펠 다운으로 향하는 해상 감시선이 당신이 알려 준 캄 벨트 항로를 조사하기 시작했다.")
      ] },
    { time: "루피가 떠나던 날 · 멀리 보이는 군함", title: "여인섬을 떠난 밀짚모자",
      body: "루피가 에이스를 찾으려 함선에 올랐다. 멀리서 당신의 배를 발견하고 잠시 손을 흔들었다. 여인섬의 금지된 해안에는 끝내 발을 들이지 않았다.",
      choices: [
        { id: "signal", label: "루피에게 위험한 해류를 손짓으로 알려 준다", risk: "기술 +4",
          apply: (s) => { s.skill += 4; return "루피는 크게 손을 흔들고 앞을 향해 달려갔다."; } },
        { id: "wait", label: "감시선을 피해 안전한 바다로 물러난다", risk: "신중함 +4",
          personality: { caution: 4 }, apply: () => "여인섬 근해의 잔잔한 물결만 오래 기억에 남았다." }
      ] }
  ] }
};

const NEXT_BEAT = {
  departure: "coby", coby: "zoro", zoro: "buggy", buggy: "usopp",
  usopp: "baratie", baratie: "arlong", arlong: "loguetown",
  skypiea_trial: "upper_yard", skypiea_bell: "davy",
  enies_lobby: "buster_call", thriller_shadows: "thriller_aftermath",
  thriller_aftermath: "supernovas", amazon_lily: "impel_down"
};

// One authored follow-up per intervention; the canonical outcome still depends on game mode.
export function localCanonRipple(life, beatId) {
  if (life.creationVersion < 23 || life.mode !== "free") return null;
  const source = Object.keys(NEXT_BEAT).find((key) => NEXT_BEAT[key] === beatId
    && life.people?.canonRipples?.[key]);
  if (!source) return null;
  return { source, body: life.people.canonRipples[source] };
}
