// 창작 마을과 인물은 각 종족의 원작 환경 안에만 놓는다. 원작의 확정된 인물·직책은 사용하지 않는다.
const paths = [
  {
    id: "fishman", species: "어인", art: "fishman", crisisArt: "fishmanCrisis",
    source: "https://one-piece.com/story/fishman_island/index.html",
    guardian: "마루", friend: "소이", group: "해류 작업 모임",
    skillJob: "해류 길잡이", supplyJob: "산호 물자 운반원",
    birth: (home) => `${home}에서 네가 태어났다. 양육자 마루는 집으로 이어지는 물길을 살피고, 친구 소이의 가족은 물자를 날랐다. 바깥 바다의 사정은 아직 네게 닿지 않았다.`,
    childhood: "너는 어른을 따라 물속 통로의 방향과 급한 흐름을 구별하는 법을 배웠다. 가까운 이웃도 밀려드는 해류는 고를 수 없었다. 소이와 함께 바깥에서 돌아오는 운반선을 세었다.",
    problem: "갑작스러운 해류가 오래 쓰던 통로의 표식을 떼어 냈다. 물자가 돌아올 길이 흐려졌지만 어린 네게는 결정권이 없었다. 마루와 이웃들이 먼저 통로를 막고 사람을 불렀다.",
    first: "이제 작은 일을 맡을 나이가 됐다. 사라진 표식을 다시 찾으려면 흐름을 배우거나, 당장 필요한 물자를 모아야 한다.",
    learn: "마루에게 해류를 읽는 법을 배우기 시작했다. 빠른 길보다 돌아올 길을 먼저 살폈다.",
    gather: "소이와 필요한 물자를 옮겼다. 길을 직접 찾지는 못했지만 사람들이 움직일 여유를 만들었다.",
    training: "해류 작업은 물속에서만 빠르게 움직이는 일이 아니었다. 뒤따를 사람의 속도를 보고 쉬는 지점을 남겨야 했다. 몇 해의 반복 끝에 네게 작은 구간을 맡겼다.",
    rogerNews: "코팅한 배가 가져온 신문에서 로저의 처형과 새로 바다에 나서는 사람들의 소식을 읽었다. 너는 그 현장에 없었다. 바깥 항로가 붐비면 이 통로를 찾는 배도 늘 수 있다고 생각했다.",
    goal: "너를 키운 물길에 이제 다른 사람의 생계도 걸려 있다. 오래 붙들 목표를 정한다.",
    goalA: "사람이 돌아오는 물길", goalB: "스스로 고른 바깥길",
    challenge: "낡은 해류 표식이 다시 흔들린다. 직접 들어가 고칠 수 있지만 기술과 물자가 있어야 한다. 기다리며 준비할 수도 있다.",
    success: "표식을 다시 묶고 안전한 흐름을 표시했다. 사람들이 너의 판단을 믿기 시작했다.",
    failure: "흐름을 잘못 읽어 되돌아왔다. 다친 몸을 쉬게 해야 했고 표식은 다른 사람이 맡았다.",
    prepare: "도구를 챙기고 다른 길잡이에게 배웠다. 당장 표식은 고치지 못했지만 다음 판단은 나아졌다.",
    warNews: "마린포드 전쟁의 소식은 배와 신문을 거쳐 어인섬까지 왔다. 네가 본 것은 전장이 아니라 통로를 물어 오는 낯선 선원들이었다. 그들에게 줄 수 있는 것은 확인한 길뿐이었다.",
    crisis: "거친 해류가 다시 운반선을 통로 밖으로 밀어낸다. 직접 헤엄쳐 길을 열거나 뭍의 신호를 맞출 수 있다. 물러나도 다른 이들이 일을 이어갈 것이다.",
    rescueSuccess: "선원과 운반선을 통로 안으로 이끌었다. 너도 다쳤지만 모두 돌아왔다.",
    rescueDeath: "너는 선원을 밀어 안전한 물길로 보냈지만, 거센 흐름에서 돌아오지 못했다.",
    safe: "소이와 이웃들에게 신호를 나눴다. 늦었지만 운반선은 길을 찾아 들어왔다.",
    aftermath: "통로를 지나온 사람들은 오래 말을 아꼈다. 네가 고른 방법과 남은 물자가 다음 운반선을 준비하는 기준이 됐다.",
    retire: "해류 표식의 기록과 맡은 구간을 다음 길잡이에게 넘겼다. 그 사람이 어떤 길을 택할지는 아직 모른다.",
    present: "여전히 물길을 살피고 있다. 네 시대가 여기까지 왔지만 다음 운반선의 결과를 미리 쓰지 않는다."
  },
  {
    id: "mink", species: "밍크족", art: "mink", crisisArt: "minkCrisis",
    source: "https://one-piece.com/story/zou/index.html",
    guardian: "토리", friend: "루", group: "숲길 일손 모임",
    skillJob: "숲길 길잡이", supplyJob: "마을 물자 담당",
    birth: (home) => `${home}에서 네가 태어났다. 그곳은 바다를 걸어 다니는 거대한 코끼리의 등 위였다. 양육자 토리와 이웃들은 흔들리는 땅 위에서 길을 고쳐 썼다. 네가 태어난 날 섬이 어디를 지나고 있었는지는 아무도 정확히 몰랐다.`,
    childhood: "친구 루와 나무 사이를 뛰어다녔다. 조는 한곳에 머무는 섬이 아니었다. 새로운 배가 오거나 떠나는 일은 드물고, 숲길의 상태가 하루의 생활을 바꾸었다.",
    problem: "비가 길게 내리자 마을의 오래된 나무다리가 흔들렸다. 너는 사람을 부르러 달렸지만, 다리를 건널지 막을지는 어른들이 정했다. 이웃들은 다른 길을 찾아 돌아왔다.",
    first: "사람들이 다시 다리를 쓰기 전에 할 일이 있다. 길의 구조를 배우거나 필요한 밧줄과 식량을 모을 수 있다.",
    learn: "토리에게 나무와 밧줄을 살피는 법을 배웠다. 흔들림의 원인을 말로 설명하기까지 시간이 걸렸다.",
    gather: "루와 함께 밧줄과 식량을 날랐다. 다리를 고치지는 못했지만 돌아가는 사람들을 도왔다.",
    training: "움직이는 섬의 길은 어제 그린 지도만으로 알 수 없었다. 나무의 상태를 살피고 늦게 걷는 사람을 기다리는 일을 반복했다. 마을은 네게 작은 길목을 맡겼다.",
    rogerNews: "오랜만에 찾아온 상인이 로저의 처형과 바다로 나서는 사람들의 신문을 전했다. 너는 그곳에 없었고 조의 위치를 세상에 설명할 수도 없었다. 소식은 섬의 길보다 늦게 움직였다.",
    goal: "마을의 길은 누군가 혼자 정할 수 없다. 그래도 네가 오래 지키고 싶은 방향을 고른다.",
    goalA: "누구나 돌아오는 숲길", goalB: "섬 밖을 이해하는 길",
    challenge: "오래된 다리의 이음새가 다시 벌어졌다. 직접 고치려면 손에 익은 기술과 밧줄이 필요하다. 준비가 모자라면 되돌아와야 한다.",
    success: "다리를 고치고 사람들에게 안전한 순서를 알렸다. 이웃의 신뢰가 늘었다.",
    failure: "다리 위에서 발을 헛디뎠다. 무사히 돌아왔지만 몸을 쉬어야 했고 수리는 다른 사람이 맡았다.",
    prepare: "밧줄과 공구를 모아 이웃에게 다시 배웠다. 이번 수리는 놓쳤지만 다음 일을 할 힘이 생겼다.",
    warNews: "찾아온 배에서 마린포드 전쟁의 소식을 들었다. 조는 계속 움직이고 있었다. 멀리서 정해진 승패보다 지금 도착한 사람에게 먹을 것과 잠자리를 주는 일이 가까웠다.",
    crisis: "비바람에 숲길 일부가 무너지고 늦게 돌아오는 이웃이 남았다. 직접 들어가거나 사람을 모아 다른 길을 밝힐 수 있다.",
    rescueSuccess: "너는 이웃을 붙잡고 안전한 나무 사이로 나왔다. 다친 뒤에는 한동안 쉬어야 했다.",
    rescueDeath: "이웃은 돌아왔지만 너는 무너지는 길목에서 빠져나오지 못했다.",
    safe: "루와 함께 밧줄과 불빛을 나눴다. 돌아오는 사람들은 느리지만 안전한 길을 찾았다.",
    aftermath: "길이 다시 열려도 비를 잊지는 못했다. 네가 만든 표식은 다음에 길을 맡을 사람에게 남았다.",
    retire: "맡아 온 길과 기록을 다음 길잡이에게 넘겼다. 섬은 계속 걸어가고, 그 사람은 다른 길을 그릴 것이다.",
    present: "조는 여전히 움직인다. 네가 알고 있는 길은 오늘의 길뿐이다. 아직 오지 않은 원작의 사건을 앞서 말하지 않는다."
  },
  {
    id: "sky", species: "하늘섬 사람", art: "sky", crisisArt: "skyCrisis",
    source: "https://one-piece.com/story/skypiea/index.html",
    guardian: "라모", friend: "세이", group: "구름길 일손 모임",
    skillJob: "구름길 수리공", supplyJob: "구름 배 운반원",
    birth: (home) => `${home}에서 네가 태어났다. 양육자 라모는 구름길을 살폈고, 친구 세이의 가족은 작은 배로 물자를 옮겼다. 아래 바다의 일은 아직 먼 이야기였다.`,
    childhood: "구름 바다를 가르는 길은 익숙해 보여도 바람이 바뀌면 위험했다. 너와 세이는 정해진 표식 안에서만 놀았다. 가끔 아래 바다에서 왔다는 여행자의 말을 들었지만 모두 믿지는 않았다.",
    problem: "갑자기 몰아친 바람이 마을의 작은 구름길을 흐트러뜨렸다. 너는 반대편 사람들을 보았지만 건너갈 수 없었다. 라모와 일꾼들이 먼저 길을 막고 돌아갈 곳을 찾았다.",
    first: "구름길을 다시 쓰려면 표식을 살피거나 운반할 물자를 모아야 한다. 네가 할 수 있는 일을 고른다.",
    learn: "라모에게 바람과 표식을 읽는 법을 배웠다. 보이는 길이 늘 안전한 것은 아니라는 말을 기억했다.",
    gather: "세이와 함께 물자를 모아 우회하는 사람들에게 건넸다. 길은 다른 일꾼이 고쳤다.",
    training: "작은 구름 배와 표식을 살피는 일을 오래 반복했다. 네가 맡은 곳에서는 먼저 온 사람이 아니라 마지막으로 건너는 사람까지 확인해야 했다.",
    rogerNews: "아래 바다에서 올라온 여행자가 로저의 처형을 적은 신문을 보여 줬다. 너는 그 현장에 없었다. 그 사건을 계기로 아래 바다로 나설 사람은 늘었지만 이곳으로 오는 길은 여전히 드물었다.",
    goal: "구름길의 끝을 어디에 둘지는 네가 혼자 정할 수 없다. 그러나 어떤 사람을 위해 일할지는 고를 수 있다.",
    goalA: "돌아올 구름길", goalB: "아래 바다와 잇는 길",
    challenge: "오래된 표식이 바람에 밀려났다. 직접 손보려면 길을 읽는 기술과 물자가 필요하다. 준비 없이 나서면 다칠 수 있다.",
    success: "표식을 다시 놓고 건너는 순서를 정했다. 사람들은 그 판단을 믿었다.",
    failure: "바람을 잘못 읽어 되돌아왔다. 다친 몸을 쉬는 동안 다른 일꾼이 표식을 맡았다.",
    prepare: "도구를 챙겨 바람을 다시 살폈다. 오늘의 수리는 놓쳤지만 다음 길에서는 실수를 줄일 수 있다.",
    warNews: "뒤늦게 올라온 상인이 마린포드 전쟁의 신문을 가져왔다. 아래 바다의 전장을 네 눈으로 본 것은 아니다. 너는 이곳에서 내려갈 사람과 돌아올 사람의 길을 다시 살폈다.",
    crisis: "거친 바람이 구름 배를 길 밖으로 밀었다. 직접 배를 몰아 다가가거나, 이곳에서 표식과 불빛을 맞출 수 있다.",
    rescueSuccess: "배를 길 안으로 이끌었다. 너는 다쳤지만 함께 돌아왔다.",
    rescueDeath: "구름 배는 돌아왔지만 너는 거친 바람 속에서 돌아오지 못했다.",
    safe: "세이와 함께 표식을 밝히고 줄을 연결했다. 돌아온 배는 늦었지만 안전한 길을 찾았다.",
    aftermath: "다음 날에는 바람이 잠잠했다. 네가 남긴 표식은 누가 뒤따를지 알 수 없는 길에 서 있었다.",
    retire: "구름길의 기록을 다음 일꾼에게 건넸다. 아래 바다로 가는 길도, 남는 길도 그 사람이 고를 것이다.",
    present: "오늘의 구름길은 열려 있다. 아직 오지 않은 아래 바다와 이곳의 사건을 미리 정하지 않는다."
  },
  {
    id: "giant", species: "거인족", art: "giant", crisisArt: "giantCrisis",
    source: "https://one-piece.com/story/elbaph/index.html",
    guardian: "바르", friend: "오르", group: "연안 일손 모임",
    skillJob: "연안 배목수 견습", supplyJob: "해안 물자 견습",
    birth: (home) => `${home}에서 네가 태어났다. 양육자 바르와 이웃들은 큰 배가 닿는 자리를 돌봤다. 훗날 확인된 학교나 왕국의 사건을 이 시절의 네 기억에 넣지는 않는다.`,
    childhood: "친구 오르와 해안에서 커다란 밧줄을 옮겼다. 인간이라면 금세 자랐을 세월도 너에게는 긴 유년기의 일부였다. 항구의 어른들은 멀리 나가는 배와 돌아오는 배를 함께 살폈다.",
    problem: "파도가 연안의 큰 배를 밀어 올려 계류 말뚝이 부러졌다. 어린 너는 밧줄을 옮기는 일밖에 못했다. 어느 배를 먼저 지킬지는 바르와 다른 어른들이 정했다.",
    first: "배가 다시 오기 전에 큰 밧줄과 목재가 필요하다. 손에 익을 기술을 배우거나 물자를 모으는 일을 고른다.",
    learn: "바르에게 거인 배의 널빤지와 계류법을 배웠다. 큰 물건이라고 실수가 작아지지는 않았다.",
    gather: "오르와 함께 목재와 밧줄을 옮겼다. 배를 직접 고치지는 못했지만 일할 자리를 마련했다.",
    training: "이곳의 긴 수련에서 너는 여전히 견습이었다. 어른들은 작은 틈을 놓치면 큰 배도 바다에서 갈라진다고 했다. 네 몫의 작업대가 생겼다.",
    rogerNews: "멀리 항해한 이가 로저의 처형 소식을 전했다. 너는 그 자리에 없었다. 새로운 항해가 늘어난다는 말에 연안의 일감도 달라질 수 있음을 알았다.",
    goal: "긴 삶의 초입에서 무엇을 지킬지 정한다. 지금의 목표가 영원한 답이 될 필요는 없다.",
    goalA: "돌아올 큰 배의 자리", goalB: "스스로 배우는 항로",
    challenge: "오래된 계류 말뚝이 흔들린다. 직접 다시 묶으려면 기술과 물자가 필요하다. 서두르면 다칠 수도 있다.",
    success: "말뚝과 밧줄을 다시 묶었다. 아직 견습이지만 어른들은 네 일을 믿기 시작했다.",
    failure: "밧줄을 잘못 걸어 뒤로 물러났다. 몸을 쉬는 사이 어른이 수리를 끝냈다.",
    prepare: "새 밧줄과 도구를 챙겨 다시 배웠다. 지금은 맡지 못해도 다음 배를 볼 눈이 달라졌다.",
    warNews: "마린포드 전쟁의 소식은 항해한 사람의 신문을 통해 해안 마을에 닿았다. 너는 그 전장을 본 적 없다. 지금은 돌아올 배에 필요한 밧줄과 자리를 살피는 편이 정확한 일이었다.",
    crisis: "거친 파도가 큰 배를 계류장 밖으로 끌어낸다. 직접 물에 들어가 붙잡거나 해안에서 모두의 밧줄을 맞출 수 있다. 너는 아직 긴 삶의 초입에 있다.",
    rescueSuccess: "배를 안전한 계류장으로 끌어왔다. 다친 뒤에도 배울 일은 많이 남았다.",
    rescueDeath: "배는 돌아왔지만 너는 거친 파도에서 돌아오지 못했다. 긴 삶이 될 수 있었던 날들이 여기서 멈췄다.",
    safe: "오르와 일꾼들에게 밧줄을 나눠 줬다. 배는 느리게 돌아왔고 아무도 홀로 버티지 않았다.",
    aftermath: "해안에는 다시 배가 닿았다. 네 기술은 아직 완성되지 않았고, 다음 배에서 배울 자리가 남아 있다.",
    retire: "", // 거인은 66세에 은퇴 경로를 열지 않는다.
    present: "이 시대에 닿았지만 너는 여전히 젊은 견습이다. 앞으로의 긴 삶을 현재의 원작이 대신 말하지 않는다."
  }
];

function cardsFor(path) {
  const art = path.art;
  const prefix = path.id;
  const canLead = (life) => life.skill >= 2 && life.health >= 2 && life.supplies >= 1;
  return [
    {
      id: `${prefix}-birth`, species: path.species, act: 1, age: 0, art, title: `${path.species}으로 태어나다`,
      canon: path.source, body: (life) => path.birth(life.birth.home),
      after: (life) => { life.guardianName = path.guardian; life.friendName = path.friend; return "태어난 곳과 곁에 있던 사람들의 이름이 삶의 첫 기록이 됐다."; }
    },
    { id: `${prefix}-childhood`, species: path.species, act: 1, age: 8, art, title: "고향에서 자라는 날", body: path.childhood },
    { id: `${prefix}-problem`, species: path.species, act: 1, age: 12, art: path.crisisArt, title: "고를 수 없던 사건", body: path.problem },
    {
      id: `${prefix}-first`, species: path.species, act: 1, age: 13, art: path.crisisArt, title: "첫 번째 내 몫", body: path.first,
      choices: [
        { id: "learn", label: "기술을 배운다", risk: "기술 +1 · 양육자와의 유대 +1", apply: (life) => { life.trade = path.skillJob; life.skill += 1; life.bond += 1; return path.learn; } },
        { id: "gather", label: "물자를 모은다", risk: "물자 +1 · 친구와의 유대 +1", apply: (life) => { life.trade = path.supplyJob; life.supplies += 1; life.friendBond += 1; return path.gather; } }
      ]
    },
    { id: `${prefix}-response`, species: path.species, act: 1, age: 16, art, title: "선택 뒤의 시간", body: (life) => life.trade === path.skillJob
      ? `${path.guardian}와 배운 일을 혼자 다시 해보는 날이 늘었다. 서두르면 같은 실수를 반복했다. 이제 ${path.skillJob}의 견습으로 불린다.`
      : `${path.friend}와 물자를 옮기며 다른 일꾼들의 이름을 익혔다. 길을 직접 고치지는 못했지만 ${path.supplyJob}의 일을 맡기 시작했다.` },
    {
      id: `${prefix}-training`, species: path.species, act: 2, age: 21, art, title: "배우며 맡는 일", body: path.training,
      after: (life) => { life.job = life.trade; life.skill += 1; return `${life.job}으로 불리기 시작했다. 기술이 한 단계 자랐다.`; }
    },
    {
      id: `${prefix}-group`, species: path.species, act: 2, age: 30, art, title: "함께 일할 자리", body: `${path.group}이 일손을 모으고 있다. 함께 들어가면 도움과 책임을 나누고, 혼자 일하면 물자를 직접 챙겨야 한다.`,
      choices: [
        { id: "join", label: "모임에 들어간다", risk: "지역 신뢰 +1 · 공동 책임", apply: (life) => { life.affiliation = path.group; life.role = "구성원"; life.trust += 1; return `${path.group}에 들어갔다. 다른 사람의 일도 살피게 됐다.`; } },
        { id: "alone", label: "혼자 일을 맡는다", risk: "물자 +1 · 지원은 줄어듦", apply: (life) => { life.role = "독립 일꾼"; life.supplies += 1; return "스스로 일을 골랐다. 필요한 물자도 직접 구해야 한다."; } }
      ]
    },
    { id: `${prefix}-roger`, species: path.species, act: 3, age: 42, art, title: "멀리서 온 신문", canon: "https://one-piece.com/character/Gold_Roger/index.html", body: path.rogerNews },
    {
      id: `${prefix}-goal`, species: path.species, act: 3, age: 43, art, title: "오래 붙들 목표", body: path.goal,
      choices: [
        { id: "home", label: path.goalA, risk: "고향을 위한 긴 일", apply: (life) => { life.goal = path.goalA; life.bond += 1; return `${path.goalA}을 목표로 삼았다.`; } },
        { id: "route", label: path.goalB, risk: "새 길을 위한 긴 일", apply: (life) => { life.goal = path.goalB; life.friendBond += 1; return `${path.goalB}을 목표로 삼았다.`; } }
      ]
    },
    {
      id: `${prefix}-test`, species: path.species, act: 3, age: 54, art: path.crisisArt, title: "기술을 시험하는 날", body: path.challenge,
      choices: [
        {
          id: "attempt", label: "직접 맡아 본다",
          risk: (life) => life.skill >= 2 && life.supplies >= 1 ? "필요: 기술 2·물자 1 · 현재 충족" : "필요: 기술 2·물자 1 · 현재 부족하면 실패·건강 -1",
          apply: (life) => { if (life.skill < 2 || life.supplies < 1) { life.health -= 1; return path.failure; } life.supplies -= 1; life.trust += 1; return path.success; }
        },
        { id: "prepare", label: "준비하며 다시 배운다", risk: (life) => life.supplies > 0 ? "물자 -1 · 기술 +1" : "물자 부족 · 기술을 올릴 수 없음", apply: (life) => { if (life.supplies < 1) return "도구를 마련하지 못했다. 다른 이의 작업을 지켜보며 다음 기회를 기다렸다."; life.supplies -= 1; life.skill += 1; return path.prepare; } }
      ]
    },
    { id: `${prefix}-war`, species: path.species, act: 3, age: 64, art, title: "전쟁이 멀리서 닿다", canon: "https://one-piece.com/story/marineford/index.html", body: path.warNews },
    { id: `${prefix}-crisis`, species: path.species, act: 3, age: 65, art: path.crisisArt, title: "다시 닥친 위기", body: path.crisis },
    {
      id: `${prefix}-rescue`, species: path.species, act: 3, age: 65, art: path.crisisArt, title: "이번에는 고를 수 있다", body: "지금 가진 기술과 물자, 몸 상태를 확인한다. 직접 위험 속에 들어가거나 사람을 모아 안전한 길을 만들 수 있다. 물러서는 선택도 네 몫이다.",
      choices: [
        {
          id: "lead", label: "직접 구조에 나선다",
          risk: (life) => `${canLead(life) ? "구조 가능 · 건강 -1" : "조건 부족 · 나서면 사망"} (필요 기술 2·건강 2·물자 1 / 현재 ${life.skill}·${life.health}·${life.supplies})`,
          apply: (life) => { if (!canLead(life)) { life.ending = "death"; return path.rescueDeath; } life.health -= 1; life.trust += 1; life.rescued += 1; return path.rescueSuccess; }
        },
        { id: "organize", label: "사람과 신호를 모은다", risk: "안전한 길 · 지역 신뢰 +1", apply: (life) => { life.trust += 1; life.rescued += 1; return path.safe; } },
        { id: "withdraw", label: "위험에서 물러선다", risk: "건강 유지 · 지역 신뢰 -1", apply: (life) => { life.trust -= 1; return "너는 무사했다. 다른 사람들의 소식을 기다리는 시간이 길어졌다."; } }
      ]
    },
    { id: `${prefix}-after`, species: path.species, act: 3, age: 65, art, title: "위기 뒤의 하루", when: (life) => !life.ending, body: path.aftermath },
    {
      id: `${prefix}-handoff`, species: path.species, act: 3, age: 66, art, title: path.species === "거인족" ? "아직 배울 시간" : "다음 사람의 자리", when: (life) => !life.ending,
      body: path.species === "거인족" ? "66세인 너는 아직 긴 삶의 앞부분을 배우고 있다. 현재 시점까지 무엇을 맡을지 고른다." : "일을 넘길 사람이 있으면 책임에서 물러날 수 있다. 그렇지 않으면 현재의 자리에서 삶을 정리한다.",
      choices: [
        { id: "retire", label: "일을 넘기고 은퇴한다", risk: "모임에 들어간 경우 가능", when: (life) => path.species !== "거인족" && life.affiliation !== "무소속", apply: (life) => { life.ending = "retire"; life.role = "은퇴"; return path.retire; } },
        { id: "continue", label: "지금의 삶을 기록한다", risk: "현재 시점에서 마무리", apply: (life) => { life.ending = "present"; return path.present; } }
      ]
    },
    { id: `${prefix}-death`, species: path.species, act: 4, age: 65, art: path.crisisArt, title: "돌아오지 못한 삶", when: (life) => life.ending === "death", body: (life) => `${path.rescueDeath} ${life.goal}이라는 목표는 완성됐다고 말할 수 없다. 남은 사람들은 다음 일을 스스로 정해야 한다.` },
    { id: `${prefix}-death-trace`, species: path.species, act: 4, age: 65, art, title: "남은 사람의 기록", when: (life) => life.ending === "death", body: `${path.guardian}와 ${path.friend}는 네가 맡았던 일과 도움받은 사람을 기억한다. 그들의 다음 선택을 네 삶의 확정된 성공으로 대신 쓰지 않는다.` },
    { id: `${prefix}-retire`, species: path.species, act: 4, age: 66, art, title: "넘겨준 자리", when: (life) => life.ending === "retire", body: (life) => `${path.retire} ${life.goal}을 위해 한 일만큼 남았다. 다음 결과는 일을 넘겨받은 사람의 몫이다.` },
    { id: `${prefix}-retire-trace`, species: path.species, act: 4, age: 66, art, title: "다음 손", when: (life) => life.ending === "retire", body: `${path.group} 사람들은 한 사람이 맡던 일을 나누었다. 떠나는 자리를 빈칸으로만 두지 않는 방법을 배웠다.` },
    { id: `${prefix}-present`, species: path.species, act: 4, age: 66, art, title: "여기서 닫는 한 장", when: (life) => life.ending === "present", body: (life) => `${path.present} ${life.goal}이라는 목표에는 아직 풀지 못한 일이 남아 있다.` },
    { id: `${prefix}-present-trace`, species: path.species, act: 4, age: 66, art, title: "아직 열린 이야기", when: (life) => life.ending === "present", body: (life) => `${life.birth.home}의 다음 날은 아직 오지 않았다. ${path.guardian}와 ${path.friend}를 비롯한 이들은 각자의 일을 이어간다.` }
  ];
}

export const speciesScenes = paths.flatMap(cardsFor);
