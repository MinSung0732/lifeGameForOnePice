// Adult fates, set A: the working years, each fate bound to a career path (or open to all), with high-risk, high-return choices.
export default [
  {
    key: "mutiny_night", captain: true, title: "선상 반란의 밤", paths: ["pirate"],
    legacy: {
      default: "배 위의 충성은 깃발이 아니라 빵 한 조각에서 시작된다는 것을, 반란의 밤이 가르쳐 주었다.",
      brog_loyal: "사슬을 풀어 준 손은 평생 가장 단단한 등 뒤를 얻었다.",
      marooned_brog: "무인도에 남겨 둔 한 사람의 그림자가 오래도록 수평선에 걸려 있었다.",
      crew_vote_won: "바다왕류 사이를 뚫고 나간 그날 이후, 선원들은 다시는 표결을 입에 올리지 않았다.",
      brog_taken: "미끼가 되어 떠난 갑판장의 빈자리는 끝내 누구로도 채워지지 않았다.",
      crew_halved: "반쪽이 된 배로도 바다는 건널 수 있었지만, 밤마다 갑판이 너무 넓게 느껴졌다.",
      parted_fair: "공정하게 나눠 보낸 등은 훗날 다른 깃발 아래서 손을 흔들어 주었다."
    },
    chapters: [
      { step: 1, id: "whisper", age: 27, art: "deck", title: "갑판 아래의 속삭임",
        body: "식량이 바닥난 지 보름째, {name}의 배 갑판 아래에서 수상한 속삭임이 돌았다. 갑판장 브로그가 선원 절반을 모아 배의 주인을 바꾸자고 한다는 것이었다. 밤 당번을 서던 막내 선원이 떨리는 손으로 그 사실을 일러 주었고, 선실 밖에서는 칼 가는 소리가 들렸다.",
        choices: [
          { id: "storm_in", label: "칼을 들고 회합 자리에 뛰어든다", hint: "한 번에 끝내거나 끝장난다",
            check: { stat: "health", against: 65 }, personality: { ambition: 6, freedom: 3 }, mark: "faced",
            outcomes: {
              great: { text: "{name}은 등불을 걷어차고 어둠 속에서 브로그의 칼을 쳐냈다. 모두가 보는 앞에서 무릎 꿇은 갑판장을 내려다보자, 반란에 가담했던 선원들이 먼저 무기를 내려놓았다.", effects: { trust: 10, skill: 8 }, mark: "crushed" },
              good: { text: "반란은 꺾였지만 옆구리에 칼자국 하나가 남았다. 선원들은 {name}의 붕대를 보며 수군거렸고, 그 수군거림에는 두려움과 존경이 반씩 섞여 있었다.", effects: { trust: 6, health: -2 }, mark: "crushed" },
              bad: { text: "회합 자리는 함정이었다. 어둠 속에서 몽둥이가 날아들었고, {name}은 피투성이가 된 채 난간에 매달려 겨우 목숨을 건졌다. 그날 밤 배의 절반이 등을 돌렸다.", effects: { health: -12, trust: -6 }, mark: "bloodied" }
            } },
          { id: "open_stores", label: "숨겨 둔 비상 식량을 풀어 버린다", hint: "배는 채워도 금고가 빈다",
            check: { stat: "supplies", against: 30 }, personality: { empathy: 5, caution: 4 }, mark: "fed_crew",
            outcomes: {
              great: { text: "{name}은 선장실 바닥 아래 숨겨 둔 술통과 절인 고기를 갑판에 굴려 냈다. 배부른 선원들은 칼 대신 노래를 꺼냈고, 브로그는 머쓱하게 웃으며 잔을 들었다.", effects: { trust: 8, friendBond: 7, supplies: 2 } },
              good: { text: "배는 채웠지만 금고는 텅 비었다. 반란의 말은 잦아들었어도, 다음 항구까지 버틸 일이 걱정이었다.", effects: { trust: 5, supplies: -1 } },
              bad: { text: "선원들은 식량을 먹어 치우고도 겁먹은 선장이 내놓은 뇌물이라 수군거렸다. 브로그는 그 공을 제 것으로 돌렸다.", effects: { supplies: -8, trust: -6 }, mark: "weak_look" }
            } },
          { id: "talk_brog", label: "브로그를 홀로 불러 술잔을 나눈다", hint: "속내를 듣는 데는 값이 든다",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 5, empathy: 4 }, mark: "heard_out",
            outcomes: {
              great: { text: "술이 세 순배 돌자 브로그가 울음을 터뜨렸다. 고향 섬에 앓아누운 딸이 있다고 했다. {name}이 그 섬으로 항로를 틀겠다고 약속하자, 반란은 그 자리에서 끝났다.", effects: { friendBond: 10, trust: 7 }, mark: "brog_secret" },
              good: { text: "브로그는 속내를 다 털어놓지 않았다. 그래도 칼은 당분간 칼집에 두겠다고 했다.", effects: { friendBond: 4, trust: 2 } },
              bad: { text: "술잔에 무언가 타져 있었다. 눈을 떴을 때 {name}은 선실 기둥에 묶여 있었고, 막내 선원이 밧줄을 끊어 주지 않았다면 다음 날 아침을 보지 못했을 것이다.", effects: { health: -8, trust: -7 }, mark: "bloodied" }
            } }
        ] },

      { step: 2, id: "chains", age: 31, art: "dangerPrison", requires: ["crushed"], title: "쇠사슬과 판결",
        body: "반란은 하룻밤 만에 꺾였고 브로그는 화물창 기둥에 쇠사슬로 묶였다. 선원들은 {name}의 판결을 기다리며 숨을 죽였다. 해적의 법대로라면 판자 끝으로 걷게 해야 했지만, 브로그는 이 배에서 가장 오래 키를 잡아 온 사람이었다.",
        choices: [
          { id: "pardon", label: "모두 앞에서 사슬을 풀어 준다", hint: "관용은 칼보다 위험하다",
            check: { stat: "trust", against: 60 }, personality: { empathy: 6, loyalty: 4 }, mark: "pardoned",
            outcomes: {
              great: { text: "사슬이 갑판에 떨어지는 소리가 울렸다. 브로그는 한참 바닥을 내려다보다가 {name}의 발치에 이마를 댔다. 그날부터 배에서 가장 먼저 일어나는 사람은 늘 브로그였다.", effects: { trust: 10, friendBond: 8 }, mark: "brog_loyal" },
              good: { text: "브로그는 고개를 숙였지만 선원 몇은 너무 무르다고 혀를 찼다. 관용의 값은 한동안 뒷말로 치렀다.", effects: { friendBond: 5, trust: -1 } },
              bad: { text: "그날 밤 브로그는 금고 상자를 안고 작은 보트로 사라졌다. 풀어 준 사슬은 아침 햇살 아래 텅 빈 채 흔들렸다.", effects: { supplies: -12, trust: -6 }, mark: "brog_fled" }
            } },
          { id: "maroon", label: "물 한 통과 함께 무인도에 내려놓는다", hint: "해적의 오래된 방식이다",
            check: { stat: "skill", against: 35 }, personality: { caution: 5, ambition: 3 }, mark: "marooned_brog",
            outcomes: {
              great: { text: "법은 지켜졌고 피는 흐르지 않았다. 선원들은 {name}의 판결이 엄하면서도 공정했다고 입을 모았다.", effects: { trust: 8, skill: 7 } },
              good: { text: "섬에 남은 브로그는 끝까지 뒤돌아보지 않았다. 배는 조용해졌지만, 키를 잡을 손이 하나 줄었다.", effects: { trust: 4, friendBond: -1 } },
              bad: { text: "브로그를 따르던 선원들이 몰래 섬에 남는 쪽을 택했다. 배는 하룻밤 사이에 일손의 삼분의 일을 잃었다.", effects: { friendBond: -7, trust: -5 } }
            } }
        ] },
      { step: 2, id: "vote", age: 31, art: "storm", title: "폭풍 앞의 표결",
        body: "반란의 불씨는 완전히 꺼지지 않았다. 바다왕류가 들끓는 해역을 앞두고 브로그는 항로를 선원 표결로 정하자고 외쳤다. 돌아가자는 쪽이 많았다. 그러나 그 해역 너머에는 배를 살릴 보급항이 있었고, 돌아가는 길에는 해군 함대가 진을 치고 있었다.",
        choices: [
          { id: "push_through", label: "표결을 무시하고 바다왕류 해역으로 꺾는다", hint: "살아서 나가면 전설이 된다",
            check: { stat: "skill", against: 70 }, personality: { freedom: 7, ambition: 5 }, mark: "defied_vote",
            outcomes: {
              great: { text: "{name}은 잠든 바다왕류의 등줄기 사이로 배를 미끄러뜨렸다. 보급항에 닿았을 때 선원들은 아무 말 없이 {name}의 이름을 연호했다.", effects: { trust: 12, supplies: 10 }, mark: "crew_vote_won" },
              good: { text: "해역은 빠져나왔지만 꼬리 한 번에 돛대가 부러졌다. 보급항에서 번 돈은 수리비로 고스란히 나갔다.", effects: { supplies: 4, health: -1, trust: 3 } },
              bad: { text: "바다왕류가 깨어났다. 배는 간신히 살아남았지만 선원 몇이 파도 속으로 사라졌고, 남은 이들의 눈빛은 차갑게 식었다.", effects: { health: -10, trust: -8 }, mark: "lost_men" }
            } },
          { id: "accept_vote", label: "표결을 따르고 함대를 피해 돌아간다", hint: "모두의 뜻이면 원망도 나뉜다",
            check: { stat: "trust", against: 30 }, personality: { loyalty: 5, caution: 5 }, mark: "kept_vote",
            outcomes: {
              great: { text: "돌아가는 길에 표류하던 포경선을 만나 식량을 나누어 받았다. 선원들은 {name}이 자기들 말을 들어 준 선장이라고 술잔을 들었다.", effects: { friendBond: 8, supplies: 7 } },
              good: { text: "먼 길을 돌아 겨우 항구에 닿았다. 배고픈 항해였지만 아무도 죽지 않았다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "피하려던 해군 함대가 하필 그 길목에 있었다. 포탄 세례를 받으며 도망치는 동안 화물 절반을 바다에 던져야 했다.", effects: { supplies: -7, health: -5 }, mark: "lost_men" }
            } }
        ] },

      { step: 3, id: "ambush", age: 37, art: "deck", requires: ["brog_loyal", "crew_vote_won", "brog_secret"], title: "안개 속의 포위망",
        body: "해군 함선 세 척이 안개 속에서 {name}의 배를 에워쌌다. 전보벌레로 항복을 권하는 목소리 사이로, 브로그가 조용히 다가와 작은 배를 몰고 미끼가 되겠다고 했다. 한때 반란을 꾀하던 그 손이 이제는 배 전체를 대신 짊어지겠다며 떨리고 있었다.",
        choices: [
          { id: "send_brog", label: "브로그를 미끼로 보내고 포위를 뚫는다", hint: "누군가는 돌아오지 못한다",
            check: { stat: "trust", against: 35 }, personality: { ambition: 5, caution: 3 }, mark: "sent_brog",
            outcomes: {
              great: { text: "브로그의 작은 배는 함대를 엉뚱한 쪽으로 끌고 갔다가 안개 속에서 감쪽같이 사라졌다. 사흘 뒤 약속한 섬에서 브로그는 젖은 담배를 물고 손을 흔들었다.", effects: { trust: 8, supplies: 7 }, mark: "brog_saved" },
              good: { text: "포위는 뚫었다. 그러나 멀리서 작은 배가 해군 함선에 끌려가는 것이 보였다. 아무도 그 일을 입에 올리지 않았다.", effects: { supplies: 5, friendBond: -2 }, mark: "brog_taken" },
              bad: { text: "미끼는 통하지 않았다. 함대는 두 배를 모두 쫓았고, {name}의 배는 포탄 구멍투성이로 빠져나왔으며 브로그는 돌아오지 않았다.", effects: { health: -6, friendBond: -8 }, mark: "brog_taken" }
            } },
          { id: "ram_flag", label: "기함을 향해 정면으로 돌격한다", hint: "포탄보다 빠르면 산다",
            check: { stat: "skill", against: 70 }, personality: { freedom: 6, loyalty: 5 }, mark: "rammed",
            outcomes: {
              great: { text: "{name}의 배는 포탄 사이를 뚫고 기함 옆구리에 들이받았다. 선원들이 기함에 올라 해도와 금고를 털어 오는 동안, 나머지 두 척은 안개 속에서 서로를 쏘아 댔다.", effects: { skill: 10, supplies: 12 }, mark: "brog_saved" },
              good: { text: "기함을 들이받고 빠져나오는 데는 성공했다. 뱃머리가 박살 났지만 브로그는 옆에서 미친 듯이 웃었다.", effects: { skill: 4, health: -2, trust: 4 }, mark: "brog_saved" },
              bad: { text: "기함의 포가 먼저 불을 뿜었다. 갑판이 반으로 갈라졌고, 연기가 걷혔을 때 브로그는 해군 함선 위에 묶여 있었다.", effects: { health: -14, supplies: -6 }, mark: "brog_taken" }
            } }
        ] },
      { step: 3, id: "split", age: 36, art: "harbor", title: "갈라진 깃발",
        body: "어느 항구에서 반란의 밤에 브로그 편을 들었던 선원들이 끝내 배를 떠나겠다고 선언했다. 앞장선 것은 젊은 포수 탈라였다. 자기들 몫의 보물과 범선 하나를 달라는 요구였다. 그대로 보내면 배는 반쪽이 되고, 막으면 항구 한복판에서 피를 보게 될 터였다.",
        choices: [
          { id: "duel", label: "탈라에게 결투를 청한다", hint: "이기면 모두가 남는다",
            check: { stat: "health", against: 60 }, personality: { ambition: 6, freedom: 4 }, mark: "dueled",
            outcomes: {
              great: { text: "{name}은 탈라의 칼을 세 번 받아 내고 네 번째에 쳐냈다. 탈라는 바닥에 주저앉아 웃더니, 이런 선장이면 따라가도 되겠다며 손을 내밀었다.", effects: { trust: 12, friendBond: 8 }, mark: "crew_whole" },
              good: { text: "결투는 비겼다. 둘 다 피를 흘렸지만 탈라는 한 번만 더 믿어 보겠다며 배에 남았다.", effects: { trust: 5, health: -2 }, mark: "crew_whole" },
              bad: { text: "탈라의 칼끝이 {name}의 어깨를 꿰뚫었다. 쓰러진 선장을 넘어 선원 절반이 범선으로 옮겨 탔다.", effects: { health: -12, trust: -6 }, mark: "crew_halved" }
            } },
          { id: "let_go", label: "몫을 셈해 주고 떠나보낸다", hint: "떠나는 등도 언젠가 돌아온다",
            check: { stat: "supplies", against: 30 }, personality: { empathy: 6, caution: 4 }, mark: "parted_fair",
            outcomes: {
              great: { text: "{name}은 장부를 펴고 한 푼도 틀리지 않게 몫을 나눴다. 탈라는 출항하며 깃발을 세 번 흔들었고, 어느 바다에서든 부르면 오겠다고 했다.", effects: { friendBond: 9, trust: 6 } },
              good: { text: "몫은 나눴지만 배는 텅 빈 듯했다. 남은 선원들은 묵묵히 두 사람 몫의 일을 했다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "떠나는 무리는 정해진 몫보다 훨씬 많은 화물을 몰래 싣고 갔다. 장부를 다시 셈했을 때는 이미 수평선 너머였다.", effects: { supplies: -9, trust: -4 }, mark: "crew_halved" }
            } }
        ] },

      { step: 4, id: "old_bosun", age: 55, art: "legacy", requires: ["brog_saved", "crew_whole"], title: "늙은 갑판장의 노래",
        body: "오래전 반란의 밤을 함께 넘긴 선원들이 {name}의 생일에 맞춰 한 항구로 모여들었다. 다들 머리가 세고 허리가 굽었지만, 술잔이 돌자 그 밤의 이야기가 끝없이 쏟아졌다. 누군가 마지막으로 한 번 더 다 같이 바다에 나가 보자고 말했다.",
        choices: [
          { id: "feast", label: "모두를 불러 마지막 잔치를 연다", hint: "주머니는 가벼워진다",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 5, loyalty: 5 },
            outcomes: {
              great: { text: "잔치는 사흘 밤낮 이어졌다. 늙은 선원들은 바닥에 누워 별을 보며 옛 뱃노래를 불렀고, {name}은 그 노래가 평생 들은 것 중 가장 좋았다고 생각했다.", effects: { friendBond: 10, health: 6 } },
              good: { text: "잔치는 즐거웠지만 계산서는 무거웠다. 그래도 아무도 그 돈을 아까워하지 않았다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "술값을 노린 건달들이 잔치판을 덮쳤다. 늙은 해적들은 옛날처럼 싸웠지만, 몸이 옛날 같지 않았다.", effects: { supplies: -8, health: -4 } }
            } },
          { id: "one_more", label: "한 번 더 다 함께 출항하자고 한다", hint: "늙은 뼈가 버텨 줄까",
            check: { stat: "health", against: 65 }, personality: { freedom: 7, ambition: 3 },
            outcomes: {
              great: { text: "늙은 선원들은 낡은 배를 몰고 젊은 날 놓쳤던 보물섬에 닿았다. 상자 안의 금화보다, 갑판 위에서 다 같이 웃던 저녁이 더 반짝였다.", effects: { friendBond: 10, supplies: 10 } },
              good: { text: "항해는 짧았다. 사흘째에 모두 뱃멀미를 했지만, 돌아오는 길 내내 웃음이 끊이지 않았다.", effects: { friendBond: 6, health: -2 } },
              bad: { text: "늙은 몸에 폭풍은 가혹했다. {name}은 앓아누운 채 항구로 돌아왔고, 동료 하나는 끝내 돌아오지 못했다.", effects: { health: -12, friendBond: -5 } }
            } }
        ] },
      { step: 4, id: "knife", age: 52, art: "harbor", title: "녹슨 단검",
        body: "항구 선술집 탁자 위에 녹슨 단검 하나가 꽂혔다. 반란의 밤에 누군가 떨어뜨린 칼이었다. 칼을 꽂은 젊은이는 그날 이후 {name}의 배를 떠난 선원의 자식이라고 했다. 아버지가 어떻게 살다 갔는지 말해 줄 테니, 대신 그 밤의 진실을 듣고 싶다고 했다.",
        choices: [
          { id: "truth", label: "그 밤의 일을 숨김없이 털어놓는다", hint: "진실은 칼보다 깊이 박힌다",
            check: { stat: "trust", against: 55 }, personality: { empathy: 6, loyalty: 3 },
            outcomes: {
              great: { text: "이야기를 다 들은 젊은이는 단검을 뽑아 {name}에게 건넸다. 아버지도 그 밤을 후회했다고, 죽기 전에 선장에게 미안하다는 말을 전해 달라 했다고 털어놓았다.", effects: { trust: 10, friendBond: 8 } },
              good: { text: "젊은이는 고개를 끄덕였지만 단검은 다시 챙겨 갔다. 용서인지 유예인지 알 수 없었다.", effects: { friendBond: 4, trust: 1 } },
              bad: { text: "진실은 젊은이가 기대한 것과 달랐다. 술집 뒷골목에서 단검이 다시 빛났고, {name}은 소매를 붉게 적신 채 숙소로 돌아왔다.", effects: { trust: -8, health: -6 } }
            } },
          { id: "pay", label: "술값을 내고 조용히 일어선다", hint: "모든 빚을 말로 갚을 순 없다",
            check: { stat: "supplies", against: 25 }, personality: { caution: 6 },
            outcomes: {
              great: { text: "젊은이는 문 앞까지 따라 나와 {name}의 배에 태워 달라고 했다. 아버지가 끝내 돌아가지 못한 배를 대신 타 보고 싶다는 것이었다.", effects: { friendBond: 8, trust: 7 } },
              good: { text: "술값은 비쌌지만, 그 밤 이후로 반란의 밤 꿈은 조금씩 조용해졌다.", effects: { supplies: -2, health: 5 } },
              bad: { text: "등 뒤에서 비웃음이 쏟아졌다. 늙은 선장이 도망친다는 소문은 다음 날 아침 항구 전체로 퍼졌다.", effects: { supplies: -6, health: -6 } }
            } }
        ] }
    ]
  },

  {
    key: "buried_haul", captain: true, title: "묻어 둔 보물", paths: ["pirate"],
    legacy: {
      default: "보물은 땅에 묻을 수 있어도 의심은 묻을 수 없다는 것을, 세 조각 난 지도가 가르쳐 주었다.",
      yuren_lied: "가장 그럴듯한 고백이 가장 날카로운 거짓말일 수 있다는 걸 평생 잊지 않았다.",
      magda_exposed: "국자를 든 배신자를 찾아낸 뒤로, 누구의 웃음도 그대로 믿지 않게 되었다.",
      legend_haul: "그 보물 이야기는 노래가 되어 바다를 떠돌았고, 노래 속의 이름은 늙지 않았다.",
      lost_haul: "파헤쳐진 구덩이 앞에서 깨달았다. 진짜 잃은 것은 금화가 아니라 서로의 등이었다는 것을.",
      hunted: "대령의 원한은 수배서의 금액이 되어 평생 뒤를 따라다녔다.",
      refused_deal: "해군과 손잡지 않은 해적이라는 이름이, 금화보다 오래 바다 위에 남았다."
    },
    chapters: [
      { step: 1, id: "map", age: 29, art: "deck", title: "세 장의 지도 조각",
        body: "{name}의 선단이 몇 해 동안 모은 금은 무인도 야자수 아래 묻혔다. 지도는 세 조각으로 찢어 {name}과 항해사 유렌, 요리사 마그다가 하나씩 나눠 가졌다. 그런데 출항 이틀째 밤, 유렌이 몰래 작은 보트를 내리는 소리가 들렸다.",
        choices: [
          { id: "chase", label: "보트를 쫓아 밤바다로 뛰어든다", hint: "물살은 사람을 가리지 않는다",
            check: { stat: "health", against: 60 }, personality: { ambition: 5, freedom: 4 }, mark: "chased_yuren",
            outcomes: {
              great: { text: "{name}은 차가운 바다를 헤엄쳐 보트 가장자리를 붙잡았다. 끌어올려진 유렌은 도망친 게 아니라 보물섬 근처에 해군이 있다는 걸 확인하러 가던 길이었다고 털어놓았다.", effects: { trust: 10, supplies: 10 }, mark: "yuren_truth" },
              good: { text: "보트는 붙잡았지만 {name}은 바닷물을 잔뜩 마시고 앓았다. 유렌은 할 말이 있다며 입을 다물었다.", effects: { trust: 4, health: -1 }, mark: "yuren_truth" },
              bad: { text: "어둠 속 암초가 {name}의 다리를 찢었다. 피를 흘리며 배로 돌아왔을 때 보트는 이미 수평선 너머로 사라진 뒤였다.", effects: { health: -12, supplies: -5 }, mark: "yuren_gone" }
            } },
          { id: "signal", label: "선원을 깨워 배 전체에 경보를 울린다", hint: "소란은 누구 편일까",
            check: { stat: "trust", against: 35 }, personality: { caution: 6, loyalty: 3 }, mark: "alarm",
            outcomes: {
              great: { text: "선원들이 횃불을 들고 난간에 늘어섰다. 유렌은 보트에 발을 걸친 채 붙잡혔고, 품에서 지도 조각이 떨어졌다.", effects: { trust: 8, friendBond: 7 }, mark: "yuren_caught" },
              good: { text: "유렌은 붙잡혔지만 소란 통에 선원 하나가 바다에 빠졌다. 건져 올리느라 밤을 새웠다.", effects: { trust: 4, friendBond: -1 }, mark: "yuren_caught" },
              bad: { text: "횃불이 엉키는 사이 유렌은 빠져나갔고, 엉뚱하게도 마그다가 공범으로 몰렸다. 배 위의 공기가 칼날처럼 갈라졌다.", effects: { friendBond: -7, trust: -5 }, mark: "yuren_gone" }
            } },
          { id: "let_him", label: "모른 척 보트가 떠나게 둔다", hint: "망원경 하나면 충분할지도",
            check: { stat: "skill", against: 50 }, personality: { freedom: 5, caution: 3 }, mark: "watched",
            outcomes: {
              great: { text: "{name}은 망원경으로 보트를 끝까지 지켜보았다. 유렌이 닿은 곳은 해군 초소였고, 그곳에서 마그다의 국자 문양이 새겨진 편지가 오가는 것까지 보였다.", effects: { skill: 9, supplies: 8 }, mark: "yuren_truth" },
              good: { text: "보트가 어디로 갔는지만 겨우 알아냈다. 나머지는 짐작으로 채워야 했다.", effects: { skill: 4, supplies: 1 }, mark: "yuren_gone" },
              bad: { text: "보트는 안개 속으로 사라졌고, 다음 날 아침 {name}의 지도 조각까지 함께 사라져 있었다.", effects: { supplies: -9, trust: -6 }, mark: "yuren_gone" }
            } }
        ] },

      { step: 2, id: "confession", age: 33, art: "deck", requires: ["yuren_truth", "yuren_caught"], title: "배신자의 사정",
        body: "갑판에 무릎을 꿇은 유렌이 털어놓았다. 보물섬 근처에 해군 초소가 생겼고, 마그다가 그 사실을 알면서도 숨긴 채 해군과 거래하고 있다는 것이었다. 마그다는 국자를 든 채 웃기만 했다. 두 사람 중 하나는 분명 거짓말을 하고 있었다.",
        choices: [
          { id: "trust_yuren", label: "유렌의 말을 믿고 마그다를 가둔다", hint: "틀리면 돌이킬 수 없다",
            check: { stat: "skill", against: 60 }, personality: { ambition: 4, loyalty: 4 }, mark: "sided_yuren",
            outcomes: {
              great: { text: "마그다의 주방 찬장 밑에서 해군의 전보벌레가 나왔다. 선원들은 말을 잃었고, {name}의 판단은 그날로 배의 법이 되었다.", effects: { trust: 12, supplies: 8 }, mark: "magda_exposed" },
              good: { text: "증거는 나왔지만 마그다는 끝까지 억울하다고 했다. 선원 몇은 그 말을 반쯤 믿었다.", effects: { trust: 4, friendBond: -1 }, mark: "magda_exposed" },
              bad: { text: "마그다를 가둔 다음 날, 유렌이 지도 두 조각을 들고 사라졌다. 거짓말을 한 쪽은 처음부터 유렌이었다.", effects: { friendBond: -10, trust: -8 }, mark: "yuren_lied" }
            } },
          { id: "test_both", label: "두 사람에게 각기 다른 거짓 좌표를 흘린다", hint: "시간은 걸려도 확실하다",
            check: { stat: "skill", against: 35 }, personality: { caution: 7 }, mark: "tested",
            outcomes: {
              great: { text: "해군 함선이 나타난 곳은 마그다에게만 알려 준 좌표였다. {name}은 피 한 방울 흘리지 않고 배신자를 가려냈다.", effects: { skill: 8, trust: 7 }, mark: "magda_exposed" },
              good: { text: "좌표 두 곳 모두 조용했다. 확실한 건 없었지만, 두 사람 모두 조심하게 되었다.", effects: { skill: 4, supplies: -1 } },
              bad: { text: "기다리는 사이 마그다와 유렌이 손을 잡고 함께 달아났다. 둘 다 거짓말쟁이였다.", effects: { supplies: -7, friendBond: -5 }, mark: "yuren_lied" }
            } }
        ] },
      { step: 2, id: "island", age: 33, art: "childInlet", title: "파헤쳐진 모래",
        body: "보물섬에 닿았을 때 야자수 아래 모래는 이미 반쯤 파헤쳐져 있었다. 구덩이 바닥에는 상자 하나가 남아 있었고, 섬 반대편 해변에서는 낯선 배 한 척이 닻을 올리고 있었다. 마그다가 조용히 {name}의 소매를 잡아끌며 저 배 갑판에 유렌이 서 있다고 속삭였다.",
        choices: [
          { id: "pursue", label: "남은 상자를 버려두고 낯선 배를 쫓는다", hint: "전부 아니면 전무다",
            check: { stat: "skill", against: 65 }, personality: { ambition: 7, freedom: 3 }, mark: "pursued",
            outcomes: {
              great: { text: "{name}의 배는 암초 사이 지름길로 낯선 배의 앞을 가로막았다. 보물 상자는 하나도 빠짐없이 돌아왔고, 유렌은 돛대에 묶여 고개를 들지 못했다.", effects: { supplies: 15, trust: 7 }, mark: "recovered" },
              good: { text: "추격 끝에 상자 몇 개는 되찾았다. 나머지는 유렌과 함께 안개 속으로 사라졌다.", effects: { supplies: 5, health: -2 } },
              bad: { text: "낯선 배는 해군의 호위를 받고 있었다. 포격에 쫓겨 돌아왔을 때 섬에 두고 온 상자마저 사라져 있었다.", effects: { health: -10, supplies: -8 }, mark: "lost_haul" }
            } },
          { id: "take_box", label: "남은 상자 하나라도 챙겨 철수한다", hint: "손에 쥔 새 한 마리",
            check: { stat: "supplies", against: 30 }, personality: { caution: 7 }, mark: "took_box",
            outcomes: {
              great: { text: "남은 상자는 작았지만 그 안에는 보석만 따로 모아 둔 주머니가 있었다. 선원들은 그걸로도 한 해를 넉넉히 먹고 마셨다.", effects: { supplies: 10, friendBond: 5 } },
              good: { text: "상자 하나로는 모두의 몫이 되지 않았다. 그래도 빈손보다는 나았다.", effects: { supplies: 4, trust: -1 } },
              bad: { text: "상자 안에는 돌멩이와 해군의 신호탄이 들어 있었다. 신호탄이 터지는 순간 모래밭은 함정이 되었다.", effects: { health: -6, supplies: -6 }, mark: "lost_haul" }
            } }
        ] },

      { step: 3, id: "marine_deal", age: 38, art: "dangerPrison", requires: ["magda_exposed", "recovered"], title: "해군과의 밀약",
        body: "배신자가 남긴 전보벌레가 어느 밤 울었다. 수화기 너머의 해군 대령은 이제 {name}과 직접 거래하고 싶다고 했다. 보물의 절반과 다른 해적단의 은신처를 넘기면, {name}의 수배서를 서랍 속에 묻어 두겠다는 제안이었다.",
        choices: [
          { id: "fake_deal", label: "응하는 척하고 대령의 함선을 털어 버린다", hint: "해군을 속이면 끝이 없다",
            check: { stat: "skill", against: 70 }, personality: { freedom: 6, ambition: 6 }, mark: "robbed_colonel",
            outcomes: {
              great: { text: "약속 장소에 나타난 대령의 함선은 빈 상자만 실은 {name}의 미끼배를 붙잡느라 정신이 없었다. 그 사이 {name}은 함선의 금고를 통째로 들고 나왔다.", effects: { supplies: 14, trust: 10 }, mark: "legend_haul" },
              good: { text: "금고 일부를 털고 빠져나왔지만 쫓기는 동안 배 곳곳이 부서졌다.", effects: { supplies: 6, health: -2 } },
              bad: { text: "대령은 처음부터 속을 생각이 없었다. 포위망 속에서 {name}은 간신히 탈출했고, 수배서의 금액은 두 배로 뛰었다.", effects: { health: -12, trust: -8 }, mark: "hunted" }
            } },
          { id: "hang_up", label: "수화기를 내려놓고 전보벌레를 바다에 던진다", hint: "거래하지 않는 것도 선택이다",
            check: { stat: "trust", against: 30 }, personality: { caution: 5, loyalty: 5 }, mark: "refused_deal",
            outcomes: {
              great: { text: "그 이야기가 퍼지자 이웃 해적단들이 {name}에게 술을 보내왔다. 동료를 팔지 않는 선장이라는 이름은 금화보다 빨리 퍼졌다.", effects: { trust: 9, friendBond: 6 } },
              good: { text: "바다는 조용해졌다. 대령에게서는 더 이상 연락이 없었다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "모욕당한 대령은 집요하게 {name}의 보급항을 하나씩 막았다. 그 해 겨울은 길고 배고팠다.", effects: { supplies: -6, health: -6 }, mark: "hunted" }
            } }
        ] },
      { step: 3, id: "last_share", age: 37, art: "harbor", title: "마지막 분배",
        body: "남은 보물을 나누는 날, 선원들의 눈빛이 금화보다 날카로웠다. 누군가는 몫이 적다고 했고, 누군가는 배신자의 몫까지 나눠야 한다고 했다. 마그다가 국자로 탁자를 두드리며 이럴 바엔 전부 바다에 돌려주자고 외쳤다. 모두의 시선이 {name}에게 쏠렸다.",
        choices: [
          { id: "equal", label: "내 몫까지 털어 똑같이 나눈다", hint: "선장의 주머니가 빈다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 6, loyalty: 5 }, mark: "shared_equal",
            outcomes: {
              great: { text: "{name}이 자기 몫을 탁자 한가운데 쏟자 소란이 뚝 그쳤다. 그날 이후 선원들은 몫을 셈하지 않고 일했다.", effects: { friendBond: 10, trust: 6 } },
              good: { text: "모두 똑같이 받았지만 선장의 몫이 없다는 걸 걱정하는 사람은 몇 없었다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "똑같이 나눠도 불만은 사라지지 않았다. 선장이 체면치레를 한다는 뒷말만 남았다.", effects: { supplies: -8, trust: -4 } }
            } },
          { id: "gamble", label: "보물 전부를 걸고 주사위 한 판으로 정한다", hint: "해적다운 방식이다",
            check: { stat: "trust", against: 65 }, personality: { freedom: 8, ambition: 3 }, mark: "diced",
            outcomes: {
              great: { text: "주사위가 굴러가는 동안 배 전체가 숨을 멈췄다. 결과가 나오자 모두가 웃음을 터뜨렸고, 이긴 쪽이 진 쪽에게 술을 사는 전통이 그날 생겼다.", effects: { supplies: 12, friendBond: 10 }, mark: "legend_haul" },
              good: { text: "주사위는 공평했다. 아무도 크게 웃지 않았지만 크게 울지도 않았다.", effects: { supplies: 3, friendBond: 2 } },
              bad: { text: "주사위에 납이 박혀 있었다는 게 밝혀졌다. 누가 박았는지 모른 채 칼부림이 났고, 보물 절반이 바다에 쏟아졌다.", effects: { supplies: -12, friendBond: -6 }, mark: "lost_haul" }
            } }
        ] },

      { step: 4, id: "song", age: 58, art: "legacy", requires: ["legend_haul", "shared_equal"], title: "술집의 보물 노래",
        body: "오래된 항구 술집에서 처음 듣는 뱃노래가 흘러나왔다. 노랫말 속에는 지도 세 조각과 배신자와 국자를 든 요리사, 그리고 {name}의 이름이 들어 있었다. 젊은 해적들이 노래 속 보물섬을 찾겠다며 지도를 그려 달라고 졸랐다.",
        choices: [
          { id: "draw_map", label: "진짜 지도를 그려 준다", hint: "지도는 주인을 가리지 않는다",
            check: { stat: "skill", against: 55 }, personality: { freedom: 5, empathy: 4 },
            outcomes: {
              great: { text: "젊은 해적들은 그 섬에서 {name}이 미처 못 찾은 상자 하나를 파냈다. 몇 해 뒤 그들은 금화 한 주머니와 함께 새 노래 한 소절을 보내왔다.", effects: { trust: 10, friendBond: 8 } },
              good: { text: "젊은이들은 빈손으로 돌아왔지만 즐거운 모험이었다며 술을 샀다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "지도를 든 젊은이들은 해군에게 붙잡혔고, 지도 귀퉁이의 서명 때문에 {name}의 이름까지 수배서에 다시 올랐다.", effects: { trust: -8, health: -6 } }
            } },
          { id: "laugh", label: "노래는 노래일 뿐이라며 웃어넘긴다", hint: "전설은 전설로 둔다",
            check: { stat: "health", against: 30 }, personality: { caution: 6 },
            outcomes: {
              great: { text: "{name}은 노래를 한 곡 더 청하고 박자에 맞춰 탁자를 두드렸다. 노래 속의 자신이 실제보다 훨씬 멋있다는 게 마음에 들었다.", effects: { health: 8, friendBond: 7 } },
              good: { text: "젊은이들은 실망한 얼굴이었지만 술잔만은 깨끗이 비우고 돌아갔다.", effects: { health: 3, friendBond: 1 } },
              bad: { text: "젊은이들은 직접 찾겠다며 무작정 배를 띄웠다. 그 배가 돌아오지 않았다는 소식은 오래도록 {name}을 괴롭혔다.", effects: { health: -6, friendBond: -6 } }
            } }
        ] },
      { step: 4, id: "empty_pit", age: 54, art: "childInlet", title: "빈 구덩이",
        body: "세월이 흐른 뒤 {name}은 혼자 그 무인도를 다시 찾았다. 야자수는 쓰러져 있었고 구덩이는 모래에 묻혀 흔적만 남았다. 그런데 쓰러진 둥치에 누군가 칼로 새긴 글씨가 있었다. 유렌의 필체였고, 진짜 보물은 다른 곳에 옮겨 두었다는 내용이었다.",
        choices: [
          { id: "dig", label: "글씨가 가리키는 곳을 끝까지 파 본다", hint: "늙은 허리로 삽질이라니",
            check: { stat: "health", against: 60 }, personality: { ambition: 6, freedom: 3 },
            outcomes: {
              great: { text: "사흘을 판 끝에 삽 끝이 상자에 부딪혔다. 금화 위에는 유렌의 쪽지가 있었다. 결국 다 같이 나눌 날을 기다렸다고.", effects: { supplies: 15, health: 5 } },
              good: { text: "상자는 반쯤 썩어 있었지만 진흙 속에서 금화 몇 닢은 건져 올렸다.", effects: { supplies: 4, health: -1 } },
              bad: { text: "땡볕 아래 구덩이를 파다 쓰러졌다. 지나가던 어선이 아니었다면 그 섬에 뼈를 묻었을 것이다.", effects: { health: -12, supplies: -5 } }
            } },
          { id: "leave", label: "둥치에 답글을 새기고 떠난다", hint: "언젠가 누군가 읽겠지",
            check: { stat: "friendBond", against: 30 }, personality: { empathy: 6, caution: 3 },
            outcomes: {
              great: { text: "몇 해 뒤 낯선 항구로 편지가 왔다. 둥치의 답글을 읽었다는, 늙은 유렌의 글씨였다. 둘은 그 해 겨울 같은 술집에서 처음으로 웃으며 마주 앉았다.", effects: { friendBond: 9, health: 6 } },
              good: { text: "서툰 칼끝으로 답글을 새기고 나니 마음 한구석이 가벼워졌다.", effects: { friendBond: 4 } },
              bad: { text: "칼을 쥔 손이 자꾸 떨렸다. 결국 한 글자도 새기지 못하고 돌아섰고, 그 섬은 꿈속에서 계속 {name}을 불렀다.", effects: { friendBond: -6, health: -6 } }
            } }
        ] }
    ]
  },

  {
    key: "buster_order", title: "불태우라는 명령", paths: ["marine"],
    legacy: {
      default: "정의라는 글자가 등에 새겨져 있어도, 그 무게를 지는 건 결국 자기 손이라는 걸 알았다.",
      village_saved: "명령서 한 장보다 마을 하나가 무겁다고 믿은 그날이 평생의 기준이 되었다.",
      burned: "그날의 연기는 평생 옷깃에서 빠지지 않았다.",
      island_stood: "버스터콜 앞에 함선을 세웠던 해병이라는 이름이 바다 위에 오래 남았다.",
      truth_out: "고쳐 쓰지 않은 보고서 한 장이, 별 몇 개보다 오래 해군 안에 남았다.",
      rewrote: "고쳐 쓴 보고서 위에 달린 별은 끝내 제 것처럼 느껴지지 않았다.",
      exiled: "변방 기지의 바람은 차가웠지만, 그 바람 속에서도 고개를 숙인 적은 없었다."
    },
    chapters: [
      { step: 1, id: "order", age: 30, art: "harbor", title: "해적을 숨긴 마을",
        body: "상부의 명령서가 {name}의 손에 떨어졌다. 해적단을 숨겨 준 어촌 하나를 본보기로 불태우라는 내용이었다. 마을 사람들은 해적을 숨긴 게 아니라 다친 선원을 치료해 주었을 뿐이라고 했다. 부하들은 명령서와 {name}의 얼굴을 번갈아 보며 기다렸다.",
        choices: [
          { id: "refuse", label: "명령서를 찢고 출동을 거부한다", hint: "제복을 걸고 하는 일이다",
            check: { stat: "trust", against: 65 }, personality: { empathy: 8, freedom: 4 }, mark: "refused",
            outcomes: {
              great: { text: "찢어진 명령서를 본 부하들이 하나둘 모자를 벗었다. 마을 사람들의 탄원서가 본부로 날아갔고, 명령은 끝내 철회되었다.", effects: { trust: 12, friendBond: 8 }, mark: "village_saved" },
              good: { text: "명령은 보류되었고 마을은 살아남았다. 대신 {name}의 봉급은 반으로 깎였다.", effects: { trust: 5, supplies: -2 }, mark: "village_saved" },
              bad: { text: "{name}은 그 자리에서 직위를 정지당하고 영창에 갇혔다. 다른 부대가 출동했고, 창살 너머로 먼 연기가 보였다.", effects: { supplies: -10, trust: -8 }, mark: "disciplined" }
            } },
          { id: "evacuate", label: "출동하되 밤새 주민을 몰래 대피시킨다", hint: "들키면 둘 다 잃는다",
            check: { stat: "skill", against: 55 }, personality: { empathy: 6, caution: 4 }, mark: "evacuated",
            outcomes: {
              great: { text: "새벽이 오기 전 마지막 어선이 마을을 떠났다. {name}의 부대는 텅 빈 오두막에 불을 놓았고, 보고서에는 마을이 불탔다는 한 줄만 적혔다.", effects: { skill: 10, trust: 9 }, mark: "village_saved" },
              good: { text: "주민들은 빠져나갔지만 가축과 그물은 모두 불탔다. 살아남은 사람들은 {name}을 원망하면서도 고마워했다.", effects: { trust: 5, health: -1 }, mark: "village_saved" },
              bad: { text: "대피 도중 감찰관에게 들켰다. 혼란 속에 불이 먼저 번졌고, 마을의 절반이 연기 속에 사라졌다.", effects: { health: -10, trust: -6 }, mark: "half_burned" }
            } },
          { id: "obey", label: "명령대로 불을 놓는다", hint: "명령은 명령이다",
            check: { stat: "supplies", against: 30 }, personality: { loyalty: 6, ambition: 4 }, mark: "burned",
            outcomes: {
              great: { text: "임무는 깔끔하게 끝났다. 본부는 {name}의 충성을 칭찬하며 포상금을 내렸고, 그 돈은 오래 서랍 속에 손대지 않은 채 남았다.", effects: { supplies: 10, skill: 5 } },
              good: { text: "불은 빨리 꺼졌고 다친 사람은 없었다. 그래도 잿더미를 바라보는 주민들의 눈을 피할 수는 없었다.", effects: { supplies: 5, trust: -2 } },
              bad: { text: "불길 속에서 아이 울음소리가 들렸다. {name}은 직접 뛰어들어 아이를 안고 나왔지만, 주민들의 저주는 불보다 뜨거웠다.", effects: { trust: -8, health: -5 } }
            } }
        ] },

      { step: 2, id: "inquiry", age: 34, art: "dangerPrison", requires: ["village_saved"], title: "군법 회의",
        body: "마을이 무사하다는 소식은 결국 본부에 닿았다. {name}은 군법 회의에 불려 나갔고, 명령을 내린 준장이 증인석에서 차갑게 웃었다. 마을 촌장이 증언하러 먼 바다를 건너왔다는 소문이 돌았지만, 회의실 문 밖은 준장의 부관들이 지키고 있었다.",
        choices: [
          { id: "fight_case", label: "준장의 명령서 원본을 증거로 내민다", hint: "상관을 법정에 세우는 일이다",
            check: { stat: "trust", against: 65 }, personality: { loyalty: 4, freedom: 6 }, mark: "exposed_commodore",
            outcomes: {
              great: { text: "명령서의 서명을 본 재판관들이 술렁였다. 부관들을 뚫고 들어온 촌장의 증언이 이어지자, 준장은 그 자리에서 견장을 떼였다.", effects: { trust: 12, skill: 8 } },
              good: { text: "준장은 경고만 받았지만 {name}은 무죄가 되었다. 복도에서 마주친 준장의 눈빛이 오래 등에 남았다.", effects: { trust: 5, supplies: -1 } },
              bad: { text: "명령서 원본은 회의 직전 사라져 있었다. 증거 없는 고발은 모함이 되었고, {name}의 계급장이 하나 떨어졌다.", effects: { trust: -10, supplies: -8 }, mark: "demoted" }
            } },
          { id: "plead", label: "조용히 책임을 지고 감봉을 받아들인다", hint: "물러서는 것도 지키는 길이다",
            check: { stat: "friendBond", against: 30 }, personality: { caution: 6, loyalty: 4 }, mark: "took_blame",
            outcomes: {
              great: { text: "감봉 소식을 들은 부하들이 몰래 월급을 조금씩 모아 왔다. {name}은 그 봉투를 받고 한참 동안 말을 잇지 못했다.", effects: { friendBond: 9, trust: 6 } },
              good: { text: "감봉은 일 년 동안 이어졌다. 빠듯했지만 부대는 흩어지지 않았다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "책임을 지겠다던 말은 그대로 강등이 되어 돌아왔다. 준장은 웃으며 {name}의 어깨를 두드렸다.", effects: { supplies: -7, trust: -5 }, mark: "demoted" }
            } }
        ] },
      { step: 2, id: "ashes", age: 34, art: "lifeStorm", title: "잿더미 앞의 해적",
        body: "불탄 마을 언저리에서 해적 한 무리가 {name}의 부대를 기다리고 있었다. 마을이 숨겨 주었던 바로 그 해적단이었다. 선두에 선 선장 베로크는 잿더미에서 건진 아이 하나를 등에 업고 있었다. 복수하러 온 것인지 거래하러 온 것인지 알 수 없었다.",
        choices: [
          { id: "fight", label: "부하들을 이끌고 정면으로 맞선다", hint: "피를 볼 각오가 필요하다",
            check: { stat: "health", against: 65 }, personality: { ambition: 6, loyalty: 4 }, mark: "fought_ivar",
            outcomes: {
              great: { text: "{name}은 선두에서 베로크와 칼을 맞댔고, 해 질 무렵 베로크는 스스로 칼을 내려놓았다. 업혀 있던 아이는 {name}의 부대가 맡아 보육원으로 보냈다.", effects: { skill: 10, trust: 10 }, mark: "captured_captain" },
              good: { text: "해적들은 물러갔지만 부하 몇이 다쳤다. 잿더미 위에 피가 더해졌을 뿐이었다.", effects: { trust: 5, health: -2 } },
              bad: { text: "베로크의 칼은 분노로 무거웠다. {name}은 쓰러졌고 부하들이 들것에 실어 날랐다. 해적들은 아이를 업은 채 유유히 떠났다.", effects: { health: -12, friendBond: -6 } }
            } },
          { id: "parley", label: "무기를 내려놓고 홀로 걸어 나간다", hint: "칼보다 말이 먼저다",
            check: { stat: "trust", against: 40 }, personality: { empathy: 7, caution: 2 }, mark: "parleyed",
            outcomes: {
              great: { text: "베로크는 {name}이 빈손으로 다가오자 아이를 내려놓았다. 둘은 잿더미 위에 앉아 이 마을을 다시 세울 방법을 이야기했다. 해병과 해적이 함께 기둥을 세우는 기묘한 봄이 왔다.", effects: { trust: 8, friendBond: 8 }, mark: "pact" },
              good: { text: "베로크는 아무 말 없이 돌아섰다. 싸움은 없었지만 화해도 없었다.", effects: { friendBond: 4, trust: -1 } },
              bad: { text: "다가가는 {name}에게 돌멩이가 날아들었다. 이마가 찢어졌고, 해적들은 비웃으며 떠났다.", effects: { health: -7, trust: -5 } }
            } }
        ] },

      { step: 3, id: "buster_call", age: 39, art: "storm", requires: ["exposed_commodore", "pact", "captured_captain"], title: "버스터콜",
        body: "원한을 품은 준장이 마침내 버스터콜을 요청했다. 목표는 해적이 드나든다는 섬 하나였고, 그 섬에는 {name}이 예전에 지켜 낸 사람들이 옮겨 와 살고 있었다. 군함 여러 척이 수평선에 늘어섰고, {name}의 함선은 그 대열의 맨 끝에 배치되었다.",
        choices: [
          { id: "shield", label: "함선을 섬과 함대 사이에 세운다", hint: "해군에게 포를 겨누는 일이다",
            check: { stat: "health", against: 75 }, personality: { empathy: 8, loyalty: 4 }, mark: "shielded",
            outcomes: {
              great: { text: "{name}의 함선이 대열을 벗어나 섬 앞을 가로막자, 뒤따르던 함선 두 척이 같은 쪽으로 키를 돌렸다. 포격 명령은 끝내 내려지지 않았고, 준장은 본부로 소환되었다.", effects: { trust: 14, friendBond: 10 }, mark: "island_stood" },
              good: { text: "포격은 멈췄지만 {name}의 함선은 아군의 경고 사격에 돛을 잃었다. 섬 사람들이 밤새 돛을 기워 주었다.", effects: { trust: 6, health: -3 }, mark: "island_stood" },
              bad: { text: "함대는 멈추지 않았다. 포탄이 {name}의 함선을 꿰뚫었고, 부하들을 구명보트에 태우고 나서야 {name}은 바다로 뛰어들었다.", effects: { health: -15, supplies: -5 }, mark: "ship_lost" }
            } },
          { id: "evac_ships", label: "포격 전에 피난선을 몰래 띄운다", hint: "시간과의 싸움이다",
            check: { stat: "skill", against: 40 }, personality: { caution: 6, empathy: 5 }, mark: "ferried",
            outcomes: {
              great: { text: "{name}은 보급선으로 위장한 함선에 주민을 태워 대열 뒤편으로 빠져나왔다. 섬은 불탔지만, 사람은 하나도 남아 있지 않았다.", effects: { trust: 9, skill: 6 }, mark: "island_stood" },
              good: { text: "대부분은 빠져나왔지만 늙은 어부 몇은 섬을 떠나지 않겠다고 버텼다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "피난선이 포격 범위 안에서 발각되었다. 배는 살아남았지만 {name}은 명령 위반으로 지휘권을 잃었다.", effects: { supplies: -6, trust: -6 } }
            } }
        ] },
      { step: 3, id: "promotion", age: 38, art: "harbor", title: "승진의 조건",
        body: "본부에서 {name}에게 승진 제안이 내려왔다. 조건은 단 하나, 예전 마을 사건에 관한 보고서를 고쳐 쓰는 것이었다. 고쳐 쓰면 준장의 허물은 사라지고 {name}의 부하들도 함께 진급한다. 거절하면 변방 기지로 쫓겨날 것이 뻔했다.",
        choices: [
          { id: "rewrite", label: "보고서를 고쳐 쓰고 별을 단다", hint: "부하들의 앞날이 걸렸다",
            check: { stat: "supplies", against: 35 }, personality: { ambition: 7, caution: 3 }, mark: "rewrote",
            outcomes: {
              great: { text: "새 계급장과 함께 부하들도 모두 진급했다. 축하연에서 {name}은 잔을 많이 들었지만 한 번도 취하지 않았다.", effects: { supplies: 10, skill: 5 } },
              good: { text: "별은 달았지만 어깨 위의 그 무게가 생각보다 훨씬 무거웠다.", effects: { supplies: 5, trust: -2 } },
              bad: { text: "고쳐 쓴 보고서가 오히려 다른 조사에서 들통났다. 준장은 빠져나갔고 거짓 서명의 책임은 {name}에게 돌아왔다.", effects: { trust: -8, health: -4 } }
            } },
          { id: "leak", label: "원본 보고서를 신문사에 흘린다", hint: "해군 전체를 적으로 돌린다",
            check: { stat: "trust", against: 70 }, personality: { freedom: 8, empathy: 3 }, mark: "leaked",
            outcomes: {
              great: { text: "신문 일면에 원본 보고서가 실렸다. 바다 곳곳에서 해병들이 편지를 보내왔고, 본부는 준장을 해임할 수밖에 없었다.", effects: { trust: 14, friendBond: 8 }, mark: "truth_out" },
              good: { text: "기사는 작게 실렸고 금방 묻혔다. 그래도 읽은 사람은 있었다.", effects: { trust: 5, supplies: -2 }, mark: "truth_out" },
              bad: { text: "기사가 나가기도 전에 출처가 들통났다. {name}은 변방의 작은 기지로 쫓겨났고, 부하들은 뿔뿔이 흩어졌다.", effects: { supplies: -10, trust: -8 }, mark: "exiled" }
            } }
        ] },

      { step: 4, id: "festival", age: 56, art: "childFestival", requires: ["island_stood", "village_saved"], title: "불 대신 등불",
        body: "은퇴를 앞둔 해, {name}에게 초대장이 한 장 날아왔다. 오래전 불태워질 뻔했던 사람들이 해마다 여는 등불 축제였다. 그들은 그날 밤을 불 대신 등불을 켠 밤이라 부른다고 했다. 촌장은 축제의 첫 등불을 {name}에게 맡기고 싶다고 적었다.",
        choices: [
          { id: "go", label: "제복을 벗고 축제에 간다", hint: "먼 길이다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 6 },
            outcomes: {
              great: { text: "{name}이 첫 등불을 띄우자 바다 위로 수백 개의 등불이 뒤따랐다. 그날 구했던 아이 하나가 어른이 되어 {name}의 손을 꼭 잡았다.", effects: { friendBond: 10, health: 6 } },
              good: { text: "축제는 소박했지만 따뜻했다. 오래 묵은 무언가가 조금 풀렸다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "폭풍으로 배가 늦어져 축제가 끝난 뒤에야 닿았다. 꺼진 등불만 물가에 떠밀려 와 있었다.", effects: { health: -6, friendBond: -6 } }
            } },
          { id: "speech", label: "등불 앞에서 그날의 진실을 연설한다", hint: "해군이 듣고 있을지도",
            check: { stat: "trust", against: 60 }, personality: { freedom: 5, loyalty: 4 },
            outcomes: {
              great: { text: "연설은 신문에 실렸고, 젊은 해병들 사이에서 불 대신 등불이라는 말이 구호처럼 퍼졌다.", effects: { trust: 12, friendBond: 8 } },
              good: { text: "박수는 컸지만 해군 본부는 조용했다. 그래도 할 말은 했다.", effects: { trust: 5 } },
              bad: { text: "연설 다음 날 본부에서 소환장이 왔다. 은퇴는 명예 대신 징계로 끝났다.", effects: { trust: -8, health: -6 } }
            } }
        ] },
      { step: 4, id: "smoke", age: 52, art: "lifeStorm", title: "꿈속의 연기",
        body: "나이가 들수록 {name}은 연기 냄새에 잠을 깼다. 어느 날 젊은 해병 하나가 찾아와, 불탄 마을 출신이라며 해군에 들어온 이유를 들려주겠다고 했다. 원망을 쏟으러 온 것인지 배움을 얻으러 온 것인지, 젊은 해병의 눈빛만으로는 알 수 없었다.",
        choices: [
          { id: "listen", label: "밤새 젊은 해병의 이야기를 듣는다", hint: "들어야 할 말이 있다",
            check: { stat: "friendBond", against: 30 }, personality: { empathy: 7 },
            outcomes: {
              great: { text: "젊은 해병은 그날 불길 속에서 자기를 안고 나온 해병을 찾아 해군에 들어왔다고 했다. 새벽녘, 둘은 말없이 같은 창밖을 보았다.", effects: { friendBond: 9, health: 6 } },
              good: { text: "이야기는 길고 아팠다. 그래도 {name}은 한 마디도 끊지 않고 끝까지 들었다.", effects: { friendBond: 4, health: -1 } },
              bad: { text: "젊은 해병은 이야기를 마치고 차갑게 경례한 뒤 떠났다. 그날 밤 연기 냄새는 더 짙어졌다.", effects: { health: -7, friendBond: -5 } }
            } },
          { id: "mentor", label: "자기 부대로 데려와 직접 가르친다", hint: "같은 실수를 막을 수 있을까",
            check: { stat: "skill", against: 60 }, personality: { loyalty: 6, ambition: 3 },
            outcomes: {
              great: { text: "젊은 해병은 빠르게 자랐다. 몇 해 뒤 비슷한 명령서를 받았을 때, 젊은 해병은 망설임 없이 그것을 찢었다.", effects: { skill: 10, trust: 10 } },
              good: { text: "가르치는 일은 고됐지만, 젊은 해병이 자라는 걸 보는 보람이 있었다.", effects: { skill: 4, health: -1 } },
              bad: { text: "젊은 해병은 {name}의 약점을 상부에 보고하기 위해 들어온 것이었다. 오래된 사건이 다시 들춰졌다.", effects: { trust: -9, health: -7 } }
            } }
        ] }
    ]
  },

  {
    key: "traitor_officer", title: "항로를 판 상관", paths: ["marine"],
    legacy: {
      default: "같은 제복을 입은 사람의 등도 언제나 같은 쪽을 향하지는 않는다는 걸 배웠다.",
      caught_both: "상관과 해적을 한 그물로 건져 올린 그날, 해군 안의 공기가 조금 맑아졌다.",
      held_base: "끝까지 버틴 기지의 깃발은 평생 마음속에서 내려가지 않았다.",
      base_fell: "무너진 기지의 잔해 속에서, 혼자 옳은 것과 모두를 지키는 것은 다르다는 걸 알았다.",
      kalber_free: "놓쳐 버린 배신자의 웃음이 오랫동안 바다 어딘가에서 들려오는 듯했다.",
      jailed: "누명의 감방에서 보낸 밤들은, 남의 억울함을 먼저 묻는 사람으로 만들었다.",
      witness: "폭풍 속에서 건져 올린 해적 하나가 진실의 마지막 조각이 되었다."
    },
    chapters: [
      { step: 1, id: "envelope", age: 28, art: "childChart", title: "붉은 잉크의 항로표",
        body: "호송 함대가 연달아 해적에게 털렸다. 항로를 아는 사람은 몇 되지 않았고, {name}은 상관인 칼베르 중령의 책상에서 해적 깃발이 그려진 봉투를 발견했다. 봉투 안의 항로표에는 다음 호송선의 출항일이 붉은 잉크로 적혀 있었다.",
        choices: [
          { id: "copy", label: "항로표를 몰래 베껴 증거로 남긴다", hint: "조용하지만 느리다",
            check: { stat: "skill", against: 40 }, personality: { caution: 6, loyalty: 3 }, mark: "copied",
            outcomes: {
              great: { text: "{name}은 잉크 번짐까지 똑같이 베껴 낸 뒤 봉투를 제자리에 두었다. 중령은 아무것도 눈치채지 못했다.", effects: { skill: 8, trust: 7 }, mark: "evidence" },
              good: { text: "급하게 베끼느라 글씨가 엉망이었지만 날짜와 좌표는 남았다.", effects: { skill: 4, health: -1 }, mark: "evidence" },
              bad: { text: "당번병이 문을 열고 들어왔다. 둘러댄 말은 어설펐고, 그날부터 중령의 눈길이 {name}을 따라다녔다.", effects: { trust: -7, health: -5 }, mark: "watched" }
            } },
          { id: "confront", label: "그 자리에서 중령을 추궁한다", hint: "계급장이 날아갈 수 있다",
            check: { stat: "trust", against: 65 }, personality: { freedom: 6, loyalty: 3 }, mark: "confronted",
            outcomes: {
              great: { text: "봉투를 내미는 {name}의 손이 흔들리지 않자 중령의 얼굴이 무너졌다. 중령은 빚 때문이었다며, 진짜 배후를 넘길 테니 목숨만 살려 달라고 했다.", effects: { trust: 12, skill: 8 }, mark: "kalber_cracked" },
              good: { text: "중령은 끝까지 모른다고 잡아뗐다. 그러나 다음 호송선의 출항일은 조용히 바뀌었다.", effects: { trust: 4, health: -1 }, mark: "watched" },
              bad: { text: "중령은 크게 웃더니 헌병을 불렀다. 해적의 봉투를 손에 쥐고 서 있는 것은 {name}의 손이었다.", effects: { trust: -10, supplies: -8 }, mark: "framed" }
            } },
          { id: "switch", label: "항로표의 날짜를 몰래 바꿔 둔다", hint: "해적을 함정에 빠뜨린다",
            check: { stat: "skill", against: 60 }, personality: { freedom: 5, ambition: 5 }, mark: "switched",
            outcomes: {
              great: { text: "해적들은 바뀐 날짜에 맞춰 나타났다가 매복해 있던 {name}의 함선에 그대로 걸렸다. 붙잡힌 해적의 품에서 중령의 친필 편지가 나왔다.", effects: { skill: 10, supplies: 10 }, mark: "evidence" },
              good: { text: "호송선은 무사했다. 해적은 나타나지 않았고, 증거도 남지 않았다.", effects: { skill: 4, supplies: 1 } },
              bad: { text: "바꾼 날짜는 들통났고, 원래 날짜의 호송선이 털렸다. 중령은 {name}의 실수라며 보고서를 올렸다.", effects: { health: -8, trust: -8 }, mark: "watched" }
            } }
        ] },

      { step: 2, id: "bait", age: 32, art: "deck", requires: ["evidence", "kalber_cracked"], title: "미끼 호송선",
        body: "{name}은 증거를 쥐고 함정을 짰다. 빈 화물을 실은 호송선을 미끼로 띄우고, 중령이 아는 항로 끝에서 해적을 기다리는 것이었다. 그러나 출항 직전 중령이 미끼선의 지휘를 직접 맡겠다고 나섰다. 함정 속에 또 다른 함정이 숨어 있는 듯했다.",
        choices: [
          { id: "board_bait", label: "미끼선에 몸소 올라 중령 곁을 지킨다", hint: "적과 한배를 탄다",
            check: { stat: "health", against: 65 }, personality: { loyalty: 5, ambition: 5 }, mark: "on_bait",
            outcomes: {
              great: { text: "해적선이 다가오자 중령이 몰래 신호등을 켰다. {name}은 그 손목을 붙잡아 꺾었고, 신호를 기다리던 해적들은 매복한 함대에 고스란히 포위되었다.", effects: { skill: 10, trust: 12 }, mark: "caught_both" },
              good: { text: "해적은 잡았지만 중령은 혼란을 틈타 몸을 숨겼다. 사흘 뒤 창고 구석에서 찾아냈다.", effects: { trust: 5, health: -2 }, mark: "caught_both" },
              bad: { text: "중령의 칼이 {name}의 등을 노렸다. 바다에 떨어진 {name}이 건져 올려졌을 때, 중령은 해적선에 올라탄 뒤였다.", effects: { health: -14, supplies: -4 }, mark: "kalber_free" }
            } },
          { id: "stay_back", label: "본대에 남아 망원경으로 지켜본다", hint: "멀리서 보면 덜 다친다",
            check: { stat: "skill", against: 35 }, personality: { caution: 7 }, mark: "watched_far",
            outcomes: {
              great: { text: "망원경 속에서 중령이 신호등을 켜는 장면이 똑똑히 보였다. 증인은 함대 전체였다.", effects: { skill: 8, trust: 7 }, mark: "caught_both" },
              good: { text: "해적은 잡았지만 중령이 신호를 보냈는지는 확실하지 않았다.", effects: { skill: 4, trust: -1 } },
              bad: { text: "안개가 망원경을 가렸다. 미끼선은 해적과 함께 사라졌고 중령도 돌아오지 않았다.", effects: { trust: -7, supplies: -5 }, mark: "kalber_free" }
            } }
        ] },
      { step: 2, id: "framed", age: 32, art: "dangerPrison", title: "누명의 감방",
        body: "어느 날 아침 {name}의 사물함에서 해적의 금화 자루가 나왔다. 누가 넣었는지는 뻔했지만 증명할 방법이 없었다. 감방에 갇힌 첫날 밤, 열쇠 꾸러미를 쥔 늙은 간수 오스벨이 {name}에게 낮게 속삭였다. 오늘 밤 순찰이 한 번 빈다고.",
        choices: [
          { id: "escape", label: "빈 순찰 시간에 빠져나가 증거를 찾는다", hint: "잡히면 진짜 죄인이 된다",
            check: { stat: "health", against: 70 }, personality: { freedom: 8, ambition: 3 }, mark: "broke_out",
            outcomes: {
              great: { text: "{name}은 어둠 속에서 중령의 집무실 금고를 열고 해적과의 거래 장부를 꺼냈다. 동이 트기 전 감방으로 돌아와, 아침 점호에서 장부를 내밀었다.", effects: { trust: 12, skill: 10 }, mark: "caught_both" },
              good: { text: "장부 한 장만 겨우 찢어 왔다. 재판은 길어졌지만 판이 뒤집힐 기미가 보였다.", effects: { skill: 4, health: -1 } },
              bad: { text: "복도 끝에서 헌병과 마주쳤다. 탈옥 미수가 죄목에 더해졌고, 오스벨은 그 일로 쫓겨났다.", effects: { health: -12, trust: -8 }, mark: "jailed" }
            } },
          { id: "wait_trial", label: "남아서 정식 재판을 기다린다", hint: "법은 느리지만 남는다",
            check: { stat: "trust", against: 35 }, personality: { caution: 6, loyalty: 4 }, mark: "waited",
            outcomes: {
              great: { text: "재판 날 {name}의 부하들이 줄지어 증인석에 섰다. 금화 자루가 놓인 날 밤 중령이 사물함 근처에 있었다는 증언이 쏟아졌다.", effects: { trust: 9, friendBond: 6 } },
              good: { text: "무죄 판결은 받았지만, 중령은 아무 벌도 받지 않고 자리를 지켰다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "재판은 반년을 끌었다. 판결은 유죄였고, {name}은 감방에서 한 계절을 더 보냈다.", effects: { supplies: -7, health: -5 }, mark: "jailed" }
            } }
        ] },

      { step: 3, id: "warlord", age: 37, art: "dangerSeaKing", requires: ["caught_both"], title: "중령의 진짜 주인",
        body: "체포된 중령은 입을 열지 않다가 마지막에 한 이름을 흘렸다. 항로를 사 간 것은 신세계의 해적 군벌 드라세크였다. 드라세크의 함대가 중령을 되찾으러 기지로 오고 있다는 전보벌레가 울렸고, 기지의 병력은 절반이 휴가 중이었다.",
        choices: [
          { id: "hold_base", label: "남은 병력으로 기지를 사수한다", hint: "버티면 영웅, 무너지면 끝",
            check: { stat: "health", against: 70 }, personality: { loyalty: 7, ambition: 3 }, mark: "hold",
            outcomes: {
              great: { text: "{name}은 포대를 해안 절벽으로 옮기고 사흘 밤낮을 버텼다. 지원 함대가 수평선에 나타났을 때, 드라세크의 깃발은 이미 물러가고 있었다.", effects: { trust: 14, skill: 8 }, mark: "held_base" },
              good: { text: "기지는 지켰지만 부두와 창고가 불탔다. 중령은 여전히 감방 안에 있었다.", effects: { trust: 5, health: -2 }, mark: "held_base" },
              bad: { text: "드라세크의 포격에 기지 성벽이 무너졌다. 중령은 해적들에게 업혀 나갔고, {name}은 잔해 아래에서 이틀 만에 구조되었다.", effects: { health: -14, supplies: -6 }, mark: "base_fell" }
            } },
          { id: "move_prisoner", label: "중령을 데리고 밤배로 본부까지 달린다", hint: "작은 배는 들키지 않는다",
            check: { stat: "skill", against: 40 }, personality: { caution: 6, freedom: 3 }, mark: "ran",
            outcomes: {
              great: { text: "드라세크의 함대가 텅 빈 감방을 부수는 동안, {name}의 밤배는 이미 본부 항구에 닿아 있었다. 중령은 본부 법정에서 모든 것을 털어놓았다.", effects: { skill: 9, trust: 7 }, mark: "delivered" },
              good: { text: "본부에 닿긴 했지만 추격을 뿌리치느라 배가 거의 부서졌다.", effects: { skill: 4, health: -1 }, mark: "delivered" },
              bad: { text: "안개 속에서 중령이 밧줄을 풀고 바다로 뛰어들었다. 아침이 되자 드라세크의 배가 중령을 건져 가는 것이 보였다.", effects: { trust: -7, health: -5 }, mark: "kalber_free" }
            } }
        ] },
      { step: 3, id: "reckoning", age: 36, art: "storm", title: "폭풍 속의 연락책",
        body: "중령은 끝내 벌을 받지 않았다. 대신 {name}을 떼어 내려고 폭풍철 순찰을 맡겼다. 거친 파도 한가운데서 {name}의 함선은 침몰 중인 해적선 하나를 만났다. 갑판에서 손을 흔드는 해적들 사이에, 중령과 거래하던 바로 그 연락책이 보였다.",
        choices: [
          { id: "rescue", label: "해적들을 구조해 연락책을 증인으로 삼는다", hint: "폭풍 속 구조는 목숨을 건다",
            check: { stat: "trust", against: 60 }, personality: { empathy: 6, ambition: 4 }, mark: "rescued",
            outcomes: {
              great: { text: "{name}은 밧줄을 몸에 감고 직접 해적선으로 건너갔다. 구조된 연락책은 은혜를 갚겠다며 중령과의 거래를 하나도 빠짐없이 털어놓았다.", effects: { trust: 12, skill: 8 }, mark: "witness" },
              good: { text: "연락책은 구했지만, 겁에 질린 입을 열기까지 꼬박 한 달이 걸렸다.", effects: { trust: 4, supplies: -1 }, mark: "witness" },
              bad: { text: "구조된 해적들이 갑판 위에서 칼을 뽑았다. 반란을 진압하는 동안 함선은 폭풍에 크게 상했다.", effects: { health: -12, supplies: -6 } }
            } },
          { id: "let_sink", label: "폭풍을 핑계로 지나친다", hint: "모두를 구할 수는 없다",
            check: { stat: "health", against: 30 }, personality: { caution: 7 },
            outcomes: {
              great: { text: "함선은 폭풍을 무사히 빠져나왔다. 기지로 돌아오자 중령이 다른 사건으로 조사받고 있다는 소식이 기다리고 있었다.", effects: { health: 8, supplies: 7 } },
              good: { text: "부하들은 무사했다. 그러나 해적선이 가라앉던 모습은 오래 눈에 남았다.", effects: { health: 4, trust: -1 } },
              bad: { text: "부하 하나가 명령을 어기고 구명줄을 던지다 바다에 휩쓸렸다. 끝내 찾지 못했다.", effects: { trust: -7, health: -5 } }
            } }
        ] },

      { step: 4, id: "medal", age: 53, art: "legacy", requires: ["held_base", "delivered", "witness"], title: "녹슨 훈장",
        body: "오래전 그 사건으로 받은 훈장은 서랍 속에서 녹슬어 갔다. 어느 날 감옥에서 늙어 버린 칼베르가 편지를 보내왔다. 죽기 전에 {name}에게 꼭 털어놓을 이야기가 있다며 면회를 청했다. 해군 안에 아직 항로를 파는 자가 남아 있다는 한 줄이 덧붙어 있었다.",
        choices: [
          { id: "visit", label: "감옥으로 가서 마지막 이야기를 듣는다", hint: "늙은 배신자의 말을 믿을까",
            check: { stat: "trust", against: 55 }, personality: { loyalty: 5, freedom: 4 },
            outcomes: {
              great: { text: "칼베르가 남긴 이름 하나로 해군 안의 오래된 고리가 끊어졌다. 칼베르는 그 소식을 듣지 못하고 눈을 감았지만, 마지막 얼굴은 편안했다고 했다.", effects: { trust: 12, skill: 8 } },
              good: { text: "칼베르의 이야기는 반쯤 헛소리였지만, 반쯤은 진실이었다.", effects: { trust: 4, health: -1 } },
              bad: { text: "칼베르가 흘린 이름은 함정이었다. 엉뚱한 사람을 고발한 {name}은 은퇴를 앞두고 망신을 당했다.", effects: { trust: -8, health: -6 } }
            } },
          { id: "burn_letter", label: "편지를 태우고 은퇴를 준비한다", hint: "다 지난 일이다",
            check: { stat: "health", against: 30 }, personality: { caution: 6 },
            outcomes: {
              great: { text: "편지가 타는 것을 보며 {name}은 오래 묵은 짐을 내려놓았다. 은퇴 후의 첫 아침은 바람이 맑았다.", effects: { health: 9, friendBond: 6 } },
              good: { text: "편지는 재가 되었지만 마지막 한 줄만은 머릿속에 오래 남았다.", effects: { health: 4 } },
              bad: { text: "몇 해 뒤 또 다른 호송선이 털렸다는 기사를 읽었다. 그 편지를 태운 손이 오래 저렸다.", effects: { health: -6, trust: -6 } }
            } }
        ] },
      { step: 4, id: "same_desk", age: 50, art: "childChart", title: "같은 책상",
        body: "세월이 흘러 {name}이 앉게 된 자리는 공교롭게도 칼베르가 쓰던 바로 그 책상이었다. 첫날 서랍 밑판 아래에서 해적 깃발이 그려진 봉투가 또 하나 나왔다. 봉투 겉면에는 지금 {name}의 부하 하나의 필체가 적혀 있었다.",
        choices: [
          { id: "trap", label: "모른 척하고 함정을 놓는다", hint: "부하를 시험하는 일이다",
            check: { stat: "skill", against: 60 }, personality: { ambition: 5, caution: 3 },
            outcomes: {
              great: { text: "함정에 걸려든 것은 부하가 아니라 그 필체를 흉내 낸 본부의 첩자였다. 부하의 누명도 벗기고 첩자도 잡았다.", effects: { skill: 10, trust: 10 } },
              good: { text: "부하는 걸려들었다. 슬픈 일이었지만 해야 할 일이었다.", effects: { skill: 4, friendBond: -1 } },
              bad: { text: "함정은 새어 나갔고 부하는 모욕감에 부대를 떠났다. 봉투의 진짜 주인은 끝내 밝혀지지 않았다.", effects: { trust: -9, friendBond: -7 } }
            } },
          { id: "talk", label: "부하를 불러 조용히 사정을 묻는다", hint: "칼베르와는 다르게 해 본다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 7 },
            outcomes: {
              great: { text: "부하는 해적에게 가족을 붙잡혀 협박당하고 있었다. {name}은 그날 밤 직접 함선을 몰아 부하의 가족을 구해 왔다.", effects: { friendBond: 9, trust: 6 } },
              good: { text: "부하는 울면서 모든 걸 털어놓았다. 벌은 피할 수 없었지만 가벼워졌다.", effects: { friendBond: 4, trust: -1 } },
              bad: { text: "부하는 고개를 끄덕이며 사과했고, 다음 날 그 항로의 호송선이 털렸다. 온정은 이번에도 배신당했다.", effects: { friendBond: -7, trust: -5 } }
            } }
        ] }
    ]
  },

  {
    key: "slave_auction", title: "경매장의 밤", paths: ["liberator"],
    legacy: {
      default: "목에 걸린 번호표를 끊는 일은 칼보다 손이 먼저 떨린다는 것을, 경매장의 밤에 배웠다.",
      freed_all: "단 한 사람도 무대에 세우지 않은 그 밤은, 평생 꺼내 보는 가장 밝은 기억이 되었다.",
      failed_raid: "실패한 습격의 밤은 다음 사슬을 끊을 때마다 손을 더 단단하게 만들었다.",
      free_island: "이름 없는 섬에 세운 마을은 끝내 누구의 지도에도 노예의 섬으로 적히지 않았다.",
      hidden_net: "흩어진 사람들은 바다 곳곳에서 서로의 등불이 되어 주었다.",
      house_fell: "무너진 경매장 터에는 몇 해 뒤 들꽃이 피었다는 소식이 들려왔다.",
      ledger_out: "세상에 뿌려진 장부 한 권이 칼 백 자루보다 많은 귀족을 떨게 했다.",
      lost_rea: "구하지 못한 동료의 이름은 다른 누군가를 구할 때마다 입속에서 맴돌았다.",
      scattered: "흩어진 사람들을 다시 모으지 못한 일은, 늙어서도 가장 무거운 짐으로 남았다."
    },
    chapters: [
      { step: 1, id: "auction", age: 30, art: "dangerPrison", title: "번호표를 단 사람들",
        body: "천룡인이 드나드는 인간 경매장에서 이번 계절 가장 큰 경매가 열린다는 정보가 들어왔다. 무대 뒤 우리에는 어인 아이들과 거인족 노동자, 그리고 {home} 말투를 쓰는 어부 하나가 갇혀 있었다. 경매장 경비는 해군 정예 호위가 맡는다고 했다.",
        choices: [
          { id: "storm", label: "경매가 한창일 때 정면으로 쳐들어간다", hint: "모두를 구하거나 모두를 잃는다",
            check: { stat: "health", against: 70 }, personality: { freedom: 8, empathy: 4 }, mark: "stormed",
            outcomes: {
              great: { text: "{name}이 무대 위 경매 망치를 부숴 버리자 객석의 귀족들이 비명을 지르며 흩어졌다. 그 혼란 속에서 동료들이 우리를 모두 열었고, 번호표가 무대 위에 눈처럼 흩날렸다.", effects: { trust: 14, friendBond: 8 }, mark: "freed_all" },
              good: { text: "우리 몇 개는 열었지만 호위가 몰려와 나머지는 두고 물러나야 했다. 등 뒤에서 남겨진 사람들의 울음이 들렸다.", effects: { trust: 5, health: -2 }, mark: "freed_some" },
              bad: { text: "호위들은 처음부터 습격을 기다리고 있었다. {name}은 해루석 그물에 휘감겨 쓰러졌고, 동료들이 목숨을 걸고 끌어낸 뒤에야 겨우 빠져나왔다.", effects: { health: -14, trust: -5 }, mark: "failed_raid" }
            } },
          { id: "bribe", label: "경비 하나를 매수해 뒷문 열쇠를 얻는다", hint: "돈은 문을 연다, 대개는",
            check: { stat: "supplies", against: 40 }, personality: { caution: 6, ambition: 2 }, mark: "bribed",
            outcomes: {
              great: { text: "경비는 돈 자루를 밀어내며 열쇠만 받아 가라고 했다. 자기 누이도 이 무대에 섰었다는 것이었다. 그 밤 뒷문으로 빠져나간 사람들 사이에 경비도 섞여 있었다.", effects: { trust: 8, friendBond: 7 }, mark: "freed_some" },
              good: { text: "열쇠는 받았지만 우리 하나만 맞았다. 그래도 그 우리 안의 사람들은 모두 빠져나왔다.", effects: { trust: 5, supplies: -2 }, mark: "freed_some" },
              bad: { text: "경비는 돈을 챙기고 곧장 상관에게 고해바쳤다. 뒷문 앞에서 기다린 것은 열쇠가 아니라 총구였다.", effects: { supplies: -8, health: -5 }, mark: "failed_raid" }
            } },
          { id: "disguise", label: "가짜 귀족으로 위장해 경매에 참가한다", hint: "들키면 무대에 서게 된다",
            check: { stat: "skill", against: 60 }, personality: { ambition: 5, caution: 3 }, mark: "disguised",
            outcomes: {
              great: { text: "{name}은 거만한 말투로 모든 번호를 한꺼번에 사들였다. 지불한 어음은 전부 위조였고, 경매장 주인이 그걸 알아챘을 때 배는 이미 먼바다에 있었다.", effects: { supplies: 10, trust: 10 }, mark: "freed_all" },
              good: { text: "몇 사람은 사들였지만 돈이 모자랐다. 나머지 번호가 다른 귀족에게 팔려 가는 걸 웃는 얼굴로 지켜봐야 했다.", effects: { trust: 5, supplies: -2 }, mark: "freed_some" },
              bad: { text: "말투 하나가 어긋났다. 정체가 들통나는 순간 {name}은 객석을 뛰어넘어 도망쳤고, 들고 온 자금은 고스란히 경매장에 남았다.", effects: { supplies: -10, trust: -7 }, mark: "failed_raid" }
            } }
        ] },

      { step: 2, id: "pursuit", age: 33, art: "storm", requires: ["freed_all", "freed_some"], title: "추격하는 군함",
        body: "풀려난 사람들을 실은 배는 무겁고 느렸다. 뒤로는 천룡인의 명령을 받은 군함이 따라붙었고, 앞으로는 폭풍이 벽처럼 서 있었다. 거인족 노동자 브론이 노를 잡겠다며 일어섰고, 어인 아이들은 바닷속으로 길을 안내하겠다고 했다.",
        choices: [
          { id: "storm_wall", label: "폭풍 속으로 뱃머리를 들이민다", hint: "군함도 폭풍은 무섭다",
            check: { stat: "skill", against: 70 }, personality: { freedom: 7, loyalty: 3 }, mark: "into_storm",
            outcomes: {
              great: { text: "{name}이 키를 잡고 브론이 노를 젓자 배는 폭풍의 눈을 뚫고 나갔다. 군함은 폭풍 앞에서 뱃머리를 돌렸고, 새벽빛 속에 이름 없는 섬 하나가 떠올랐다.", effects: { trust: 12, friendBond: 10 }, mark: "reached_haven" },
              good: { text: "폭풍은 빠져나왔지만 짐 대부분을 바다에 던져야 했다. 그래도 사람은 모두 살아 있었다.", effects: { friendBond: 5, health: -2 }, mark: "reached_haven" },
              bad: { text: "파도가 배를 두 동강 냈다. 어인 아이들이 사람들을 하나하나 건져 올렸지만, 배와 식량은 모두 바다에 잠겼다.", effects: { health: -12, supplies: -8 }, mark: "lost_ship" }
            } },
          { id: "split_up", label: "어인 아이들을 먼저 바닷속으로 보낸다", hint: "흩어지면 덜 잡힌다",
            check: { stat: "friendBond", against: 35 }, personality: { caution: 5, empathy: 5 }, mark: "split",
            outcomes: {
              great: { text: "어인 아이들은 물속으로 사라졌다가 이웃 섬 어인 마을의 배를 이끌고 돌아왔다. 군함이 따라잡았을 때 {name}의 배는 이미 텅 비어 있었다.", effects: { friendBond: 9, trust: 6 }, mark: "reached_haven" },
              good: { text: "아이들은 무사히 빠져나갔고, 남은 배는 추격을 따돌리느라 먼 길을 돌았다.", effects: { friendBond: 4, supplies: -1 }, mark: "reached_haven" },
              bad: { text: "물속에 해군의 그물이 쳐져 있었다. 아이 둘이 붙잡혔고, {name}은 배 위에서 그 모습을 지켜볼 수밖에 없었다.", effects: { friendBond: -7, health: -5 }, mark: "lost_ship" }
            } }
        ] },
      { step: 2, id: "cell", age: 33, art: "dangerPrison", title: "우리 안의 신호",
        body: "실패의 대가는 컸다. 동료 몇이 붙잡혔고, 경매장은 경비를 늘린 채 다음 경매를 준비했다. 붙잡힌 동료 중 하나인 레아가 우리 안에서 벽을 두드려 신호를 보내왔다. 경매장 지하 배수로가 바다로 이어져 있다는 신호였다.",
        choices: [
          { id: "sewer", label: "지하 배수로로 홀로 숨어든다", hint: "들어가면 돌아올 길이 없다",
            check: { stat: "health", against: 65 }, personality: { loyalty: 7, freedom: 3 }, mark: "sewer",
            outcomes: {
              great: { text: "{name}은 썩은 물에 가슴까지 잠긴 채 배수로를 기어 레아의 우리 아래에 닿았다. 쇠창살이 뽑히자 레아는 옆 우리 사람들까지 모조리 깨워 함께 빠져나왔다.", effects: { friendBond: 12, trust: 8 }, mark: "rescued_rea" },
              good: { text: "레아만 겨우 데리고 나왔다. 배수로를 빠져나오며 둘 다 열병에 걸렸다.", effects: { friendBond: 5, health: -2 }, mark: "rescued_rea" },
              bad: { text: "배수로 중간에 물이 차올랐다. {name}은 숨이 끊어지기 직전 바다로 떠밀려 나왔고, 레아의 신호는 그날 이후 다시 들리지 않았다.", effects: { health: -13, friendBond: -5 }, mark: "lost_rea" }
            } },
          { id: "outside", label: "바깥에서 폭동을 일으켜 시선을 끈다", hint: "사람들이 움직여 줄까",
            check: { stat: "trust", against: 40 }, personality: { empathy: 5, caution: 3 }, mark: "riot",
            outcomes: {
              great: { text: "항구의 짐꾼과 어부들이 {name}의 외침에 응해 경매장 앞을 메웠다. 경비가 정문에 몰린 사이, 레아는 배수로로 빠져나와 해변에서 손을 흔들었다.", effects: { trust: 9, friendBond: 7 }, mark: "rescued_rea" },
              good: { text: "폭동은 작았지만 경비 몇을 끌어내기에는 충분했다. 레아는 다친 채로 빠져나왔다.", effects: { trust: 4, supplies: -1 }, mark: "rescued_rea" },
              bad: { text: "아무도 따라 나서지 않았다. 혼자 외치던 {name}은 경비에게 쫓겨 달아났고, 레아는 다음 날 다른 섬으로 팔려 갔다.", effects: { trust: -7, supplies: -6 }, mark: "lost_rea" }
            } }
        ] },

      { step: 3, id: "haven", age: 38, art: "harbor", requires: ["reached_haven", "rescued_rea"], title: "자유의 섬",
        body: "풀려난 사람들은 이름 없는 섬에 마을을 세웠다. 그러나 섬의 위치가 새어 나갔고, 천룡인의 현상금이 섬 전체에 걸렸다. 마을 회의에서 젊은 사람들은 맞서 싸우자고 했고, 늙은 사람들은 다시 흩어지자고 했다. 모두가 {name}의 말을 기다렸다.",
        choices: [
          { id: "fortify", label: "섬을 요새로 만들어 맞선다", hint: "지키면 고향이 생긴다",
            check: { stat: "skill", against: 70 }, personality: { loyalty: 6, freedom: 5 }, mark: "fortified",
            outcomes: {
              great: { text: "{name}의 설계대로 절벽에 포대를 세우고 암초 사이에 함정을 놓았다. 처음 온 사냥꾼 함대가 암초에 걸려 물러간 뒤, 그 섬은 바다 사람들 사이에서 건드리면 안 되는 섬이 되었다.", effects: { trust: 14, supplies: 10 }, mark: "free_island" },
              good: { text: "섬은 지켰지만 첫 싸움에서 집 여러 채가 불탔다. 사람들은 다시 기둥을 세웠다.", effects: { trust: 5, supplies: -2 }, mark: "free_island" },
              bad: { text: "요새는 완성되기 전에 공격받았다. 사람들은 다시 배에 올라야 했고, {name}은 부서진 성벽 아래서 피를 흘렸다.", effects: { health: -12, trust: -8 }, mark: "scattered" }
            } },
          { id: "disperse", label: "사람들을 여러 섬으로 나눠 숨긴다", hint: "모이지 않으면 잡히지 않는다",
            check: { stat: "trust", against: 35 }, personality: { caution: 7, empathy: 4 }, mark: "dispersed",
            outcomes: {
              great: { text: "{name}은 바다 곳곳의 믿을 만한 항구에 사람들을 나눠 보냈다. 서로를 잇는 비밀 신호가 생겼고, 그 신호망은 훗날 수많은 사람을 더 구해 냈다.", effects: { trust: 8, friendBond: 8 }, mark: "hidden_net" },
              good: { text: "흩어진 사람들은 안전했지만 마을은 사라졌다. 섬에는 빈집만 남았다.", effects: { trust: 4, friendBond: -1 }, mark: "hidden_net" },
              bad: { text: "흩어진 배 하나가 사냥꾼에게 붙잡혔고, 그 배에서 나온 지도로 다른 사람들까지 쫓기기 시작했다.", effects: { friendBond: -7, trust: -5 }, mark: "scattered" }
            } }
        ] },
      { step: 3, id: "again", age: 37, art: "dangerPrison", title: "다시 열린 경매장",
        body: "몇 해 뒤 같은 경매장이 다시 문을 열었다. 이번 목록 맨 위에는 {name}의 현상금이 적힌 수배서가 붙어 있었다. 사냥꾼들이 경매장 주변을 에워쌌고, 경매장 주인인 귀족 발테르는 {name}이 반드시 다시 올 거라고 장담했다.",
        choices: [
          { id: "burn_house", label: "경매장 자체를 무너뜨린다", hint: "함정인 줄 알고 들어간다",
            check: { stat: "health", against: 70 }, personality: { freedom: 8, ambition: 4 }, mark: "raided_again",
            outcomes: {
              great: { text: "{name}은 함정을 거꾸로 이용했다. 사냥꾼들이 정문에 몰린 사이 지하 기둥에 화약을 놓았고, 우리를 모두 연 뒤 경매장은 발테르의 눈앞에서 주저앉았다.", effects: { trust: 15, friendBond: 7 }, mark: "house_fell" },
              good: { text: "경매장 한쪽 벽만 무너뜨렸다. 그래도 그날 경매는 열리지 못했다.", effects: { trust: 5, health: -2 }, mark: "house_fell" },
              bad: { text: "발테르의 함정은 {name}의 생각보다 깊었다. 동료들이 줄줄이 붙잡혔고, {name}은 혼자 피투성이로 바다에 뛰어들었다.", effects: { health: -14, trust: -6 }, mark: "scattered" }
            } },
          { id: "expose", label: "경매 장부를 빼돌려 세상에 뿌린다", hint: "칼 없이 싸우는 법이다",
            check: { stat: "skill", against: 40 }, personality: { caution: 5, empathy: 5 }, mark: "stole_ledger",
            outcomes: {
              great: { text: "장부에는 노예를 사 간 귀족들의 이름이 빼곡했다. 신문사로 보낸 사본이 바다 곳곳에 뿌려지자, 몇몇 왕국에서 귀족들이 줄줄이 자리에서 쫓겨났다.", effects: { trust: 10, skill: 6 }, mark: "ledger_out" },
              good: { text: "장부 일부만 실렸다. 그래도 발테르의 이름은 지울 수 없게 되었다.", effects: { trust: 4, supplies: -1 }, mark: "ledger_out" },
              bad: { text: "빼돌린 장부는 가짜였다. 발테르가 미리 바꿔 둔 것이었고, 장부를 믿은 신문사만 망신을 당했다.", effects: { supplies: -7, health: -5 } }
            } }
        ] },

      { step: 4, id: "bell", age: 55, art: "childFestival", requires: ["free_island", "hidden_net", "house_fell"], title: "번호 없는 아이들",
        body: "오래전 우리에서 꺼낸 아이들이 어른이 되어 {name}을 찾아왔다. 누구는 선장이 되었고 누구는 의사가 되었다. 그들은 목에 걸었던 번호표를 녹여 만든 종 하나를 내밀며, 이제 그 종을 어디에 걸지 {name}이 정해 달라고 했다.",
        choices: [
          { id: "square", label: "옛 경매장 터에 종을 건다", hint: "귀족들이 가만있을까",
            check: { stat: "trust", against: 55 }, personality: { freedom: 6, empathy: 3 },
            outcomes: {
              great: { text: "종이 처음 울린 날 그 섬의 노예 상인들이 하나둘 짐을 쌌다. 종소리는 해마다 같은 날 같은 시각에 울렸고, 그때마다 항구 전체가 잠시 말을 멈췄다.", effects: { trust: 12, friendBond: 8 } },
              good: { text: "종은 걸렸지만 귀족들의 항의로 울리는 날이 정해졌다. 그래도 종은 울렸다.", effects: { trust: 4, health: -1 } },
              bad: { text: "종을 건 다음 날 귀족의 사병들이 종을 끌어내렸다. 그 자리에 있던 {name}은 체포되어 한 철을 감옥에서 보냈다.", effects: { trust: -8, health: -6 } }
            } },
          { id: "keep", label: "종을 품에 안고 조용히 간직한다", hint: "기억은 드러내지 않아도 된다",
            check: { stat: "friendBond", against: 30 }, personality: { empathy: 6, caution: 3 },
            outcomes: {
              great: { text: "{name}은 종을 집 앞 처마에 걸었다. 바람이 불 때마다 울리는 소리에 이웃 아이들이 모여들었고, 그 아이들은 종의 내력을 노래로 지어 불렀다.", effects: { friendBond: 9, health: 6 } },
              good: { text: "종은 서랍 속에서 조용히 빛났다. 가끔 꺼내 닦을 때마다 아이들의 얼굴이 떠올랐다.", effects: { friendBond: 4 } },
              bad: { text: "아이들은 종을 숨기는 것이 부끄러운 일이냐며 서운해했다. 그들은 종을 도로 가지고 돌아갔다.", effects: { friendBond: -6, health: -6 } }
            } }
        ] },
      { step: 4, id: "number", age: 50, art: "legacy", title: "남은 번호표",
        body: "{name}의 서랍에는 끝내 구하지 못한 사람의 번호표 하나가 남아 있었다. 어느 날 낯선 상인이 그 번호를 보고 얼굴빛이 변했다. 그 번호를 달았던 사람이 먼 섬 귀족의 저택에서 아직 살아 있다는 것이었다.",
        choices: [
          { id: "go_now", label: "늙은 몸을 이끌고 당장 그 섬으로 간다", hint: "이번에는 늦지 않으리라",
            check: { stat: "health", against: 65 }, personality: { loyalty: 7, freedom: 4 },
            outcomes: {
              great: { text: "{name}은 저택 담을 넘어 마구간 구석의 노인을 찾아냈다. 노인은 번호표를 보자마자 울음을 터뜨렸고, 둘은 새벽 배로 함께 그 섬을 떠났다.", effects: { friendBond: 12, trust: 8 } },
              good: { text: "노인을 데리고 나왔지만 추격 속에 {name}의 다리가 상했다. 그래도 둘 다 살아 있었다.", effects: { friendBond: 5, health: -2 } },
              bad: { text: "저택의 사병에게 붙잡혀 매질을 당했다. 노인은 끝내 만나지 못했고, 상인의 말이 사실이었는지도 알 수 없었다.", effects: { health: -13, supplies: -5 } }
            } },
          { id: "send_word", label: "젊은 동료들에게 정보를 넘긴다", hint: "이제는 다음 세대의 일이다",
            check: { stat: "trust", against: 35 }, personality: { caution: 6, empathy: 3 },
            outcomes: {
              great: { text: "젊은 동료들은 한 달 만에 그 사람을 구해 왔다. {name}은 번호표를 돌려주며 처음으로 서랍을 비웠다.", effects: { trust: 9, friendBond: 6 } },
              good: { text: "구출은 늦어졌지만 성공했다는 소식이 편지로 왔다. 번호표는 그제야 불 속에 들어갔다.", effects: { trust: 4 } },
              bad: { text: "정보가 새어 나가 구출은 실패했다. 젊은 동료 하나가 다쳤다는 소식에 {name}은 오래 잠들지 못했다.", effects: { trust: -6, friendBond: -6 } }
            } }
        ] }
    ]
  },

  {
    key: "ship_commission", title: "검은 의뢰", paths: ["civilian"],
    legacy: {
      default: "손으로 만든 것은 손을 떠나는 순간 남의 것이 된다는 걸, 검은 의뢰가 가르쳐 주었다.",
      masterwork: "바다왕류 해역을 뚫은 배를 지은 손이라는 이름은 평생 작업장 문패보다 앞서 다녔다.",
      refused_clean: "금화 상자를 돌려보낸 그날의 손이, 작업장의 이름을 가장 깨끗하게 지켰다.",
      hid_flaw: "용골 속에 숨긴 비밀 하나가 평생 밤마다 파도 소리처럼 귀를 두드렸다.",
      ordus_friend: "두려운 이름의 손님이 결국 가장 오래된 친구가 되었다.",
      fleet_built: "바다 위 어딘가에 아직도 같은 대패 자국을 가진 배들이 떠다닌다.",
      called_marines: "전보벌레 한 통의 무게는, 작업장의 망치 소리보다 오래 마음속에 울렸다.",
      workshop_raided: "부서진 작업장 앞에서 다시 망치를 든 날, 진짜 장인이 무엇인지 알았다."
    },
    chapters: [
      { step: 1, id: "client", age: 26, art: "workbench", title: "검은 외투의 손님",
        body: "{name}의 작업장에 검은 외투를 입은 손님이 찾아왔다. 솜씨가 좋다는 소문을 듣고 왔다며, 바다왕류 해역을 정면으로 뚫을 배를 석 달 안에 지어 달라고 금화 상자를 내려놓았다. 손님의 이름은 오르두스. 바다 위에서 그 이름을 들으면 상선들이 돛을 내린다는 소문이 있었다.",
        choices: [
          { id: "accept", label: "금화를 받고 최고의 배를 약속한다", hint: "평생의 걸작이거나 망신이다",
            check: { stat: "skill", against: 65 }, personality: { ambition: 8, freedom: 2 }, mark: "accepted",
            outcomes: {
              great: { text: "{name}은 석 달 동안 잠을 거의 자지 않았다. 완성된 배의 용골은 바다왕류의 등뼈처럼 휘어 있었고, 오르두스는 말없이 금화 상자 하나를 더 내려놓았다.", effects: { supplies: 15, skill: 8 }, mark: "masterwork" },
              good: { text: "배는 기한 안에 완성되었지만 {name}의 손가락 두 개에 붕대가 감겼다. 오르두스는 만족한 듯 고개를 끄덕였다.", effects: { supplies: 6, health: -2 }, mark: "built" },
              bad: { text: "시험 진수 날 배가 기울었다. 오르두스는 아무 말 없이 금화 상자를 도로 가져갔고, 그 침묵이 고함보다 무서웠다.", effects: { health: -10, supplies: -8 }, mark: "botched" }
            } },
          { id: "refuse", label: "정중히 거절하고 금화를 돌려보낸다", hint: "두려운 손님의 체면을 건드린다",
            check: { stat: "trust", against: 35 }, personality: { caution: 7, empathy: 2 }, mark: "refused",
            outcomes: {
              great: { text: "오르두스는 잠시 {name}을 바라보다 웃었다. 이 바다에서 자기 금화를 거절한 장인은 처음이라고 했다. 그 소문이 퍼지자 정직한 선주들의 주문이 밀려들었다.", effects: { trust: 9, supplies: 6 }, mark: "refused_clean" },
              good: { text: "오르두스는 말없이 돌아갔다. 한동안 작업장 앞을 지나가는 낯선 그림자가 늘었다.", effects: { trust: 4, supplies: -1 }, mark: "refused_clean" },
              bad: { text: "그날 밤 작업장 뒤편 목재 창고에 불이 났다. 범인은 찾지 못했지만, 아무도 찾을 필요를 느끼지 못했다.", effects: { supplies: -8, health: -5 }, mark: "shed_burned" }
            } },
          { id: "flaw", label: "받아들이되 용골에 몰래 약점을 숨긴다", hint: "해적선이라면 언젠가 부서지도록",
            check: { stat: "skill", against: 55 }, personality: { freedom: 5, caution: 4 }, mark: "hid_flaw",
            outcomes: {
              great: { text: "{name}은 특정한 각도로 파도를 맞을 때만 갈라지는 이음새 하나를 숨겼다. 오르두스의 목수도 그것을 찾지 못했고, 금화는 고스란히 {name}의 금고에 들어갔다.", effects: { supplies: 12, skill: 6 }, mark: "built" },
              good: { text: "약점은 숨겼지만 매일 밤 그 이음새가 마음에 걸렸다. 금화는 받았다.", effects: { supplies: 5, health: -1 }, mark: "built" },
              bad: { text: "오르두스의 늙은 목수가 용골을 두드려 보더니 고개를 저었다. {name}은 금화 대신 부러진 손목을 얻었다.", effects: { health: -10, trust: -6 }, mark: "botched" }
            } }
        ] },

      { step: 2, id: "launch", age: 30, art: "repaired", requires: ["masterwork", "built"], title: "진수식 날",
        body: "배는 완성되었다. 진수식 날 오르두스는 시험 항해를 하자며 {name}을 갑판으로 불렀다. 항구를 벗어나자 오르두스는 이 배로 무엇을 할지 털어놓았다. 해군 호송선에 실린 동생을 빼내겠다는 것이었다. 동생의 죄는 천룡인의 노예를 풀어 준 것이었다.",
        choices: [
          { id: "help_sail", label: "키를 잡고 배의 진짜 성능을 보여 준다", hint: "만든 사람만 아는 속도가 있다",
            check: { stat: "skill", against: 70 }, personality: { freedom: 7, loyalty: 3 }, mark: "sailed_ordus",
            outcomes: {
              great: { text: "{name}이 돛을 조이자 배는 바람보다 빨리 달렸다. 호송선은 따라잡히고도 무엇이 지나갔는지 몰랐고, 오르두스의 동생은 그 밤 형의 품에서 울었다.", effects: { skill: 12, friendBond: 10 }, mark: "ordus_friend" },
              good: { text: "동생은 구했지만 호송선의 망원경에 {name}의 얼굴이 잡혔을지도 몰랐다. 한동안 해군 지부 앞을 피해 다녔다.", effects: { skill: 5, trust: -2 }, mark: "ordus_friend" },
              bad: { text: "호송선의 포탄이 갑판을 스쳤다. {name}은 파편에 맞아 쓰러졌고, 항구로 돌아왔을 때는 이미 공범으로 수배 명단에 올라 있었다.", effects: { health: -12, trust: -8 }, mark: "marked_accomplice" }
            } },
          { id: "jump_off", label: "구명보트를 내려 홀로 돌아간다", hint: "남의 싸움에 끼지 않는다",
            check: { stat: "health", against: 35 }, personality: { caution: 7 }, mark: "left_ship",
            outcomes: {
              great: { text: "오르두스는 고개를 끄덕이며 보트를 내려 주었다. 장인은 장인의 자리에 있어야 한다는 말과 함께 금화 주머니 하나를 던져 주었다.", effects: { health: 7, trust: 8 } },
              good: { text: "보트는 밤새 노를 저어야 항구에 닿았다. 손바닥이 다 벗겨졌다.", effects: { health: 4, supplies: -1 } },
              bad: { text: "보트가 암초에 걸려 뒤집혔다. 해변으로 기어 나왔을 때는 연장 가방도 금화도 모두 바다에 잃은 뒤였다.", effects: { health: -7, supplies: -5 } }
            } }
        ] },
      { step: 2, id: "visitor", age: 30, art: "harbor", title: "두 번째 방문",
        body: "몇 해가 지나 오르두스가 다시 {name}을 찾아왔다. 외투에는 소금기와 피가 엉겨 있었고, 뒤따라온 배는 반쯤 부서져 있었다. 지난번 배는 바다왕류 앞에서 두 동강이 났다고 했다. 이번에는 금화 대신 낡은 칼 한 자루를 탁자에 내려놓았다.",
        choices: [
          { id: "repair", label: "부서진 배를 밤새 고쳐 준다", hint: "칼의 뜻은 묻지 않는다",
            check: { stat: "skill", against: 60 }, personality: { empathy: 6, ambition: 3 }, mark: "repaired_ordus",
            outcomes: {
              great: { text: "{name}은 동이 트기 전에 배를 다시 띄울 수 있게 만들었다. 오르두스는 칼을 탁자에 두고 떠나며, 이 칼을 보여 주면 이 바다 어디서든 길을 열어 줄 거라고 했다.", effects: { skill: 10, supplies: 10 }, mark: "ordus_friend" },
              good: { text: "배는 겨우 떠날 수 있을 만큼만 고쳤다. 오르두스는 칼을 도로 집어 들고 고맙다는 말만 남겼다.", effects: { skill: 4, health: -1 } },
              bad: { text: "수리 도중 돛대가 쓰러져 {name}의 어깨를 짓눌렀다. 오르두스는 반쯤 고친 배를 몰고 떠났다.", effects: { health: -10, supplies: -7 } }
            } },
          { id: "call_marines", label: "몰래 해군에 전보벌레를 건다", hint: "두려운 손님을 끝낼 기회다",
            check: { stat: "trust", against: 40 }, personality: { caution: 6, loyalty: 2 }, mark: "called_marines",
            outcomes: {
              great: { text: "해군은 새벽에 항구를 봉쇄했다. 오르두스가 끌려가는 동안 {name}은 작업장 안에서 숨을 죽였고, 며칠 뒤 해군으로부터 포상금이 도착했다.", effects: { trust: 10, supplies: 6 } },
              good: { text: "해군이 왔을 때 오르두스는 이미 떠나고 없었다. 그래도 해군 지부는 {name}을 협조자로 기억했다.", effects: { trust: 4, friendBond: -1 } },
              bad: { text: "해군은 늦었고, 오르두스는 떠나기 전 작업장 문에 칼을 꽂아 두었다. 누가 전보벌레를 걸었는지 알고 있다는 뜻이었다.", effects: { health: -7, trust: -6 }, mark: "ordus_enemy" }
            } }
        ] },

      { step: 3, id: "fleet", age: 35, art: "workbench", requires: ["ordus_friend"], title: "함대를 지어라",
        body: "오르두스의 이름은 이제 바다 위에서 전설이 되었다. 어느 날 오르두스의 부하가 설계도 한 묶음을 들고 왔다. 배 열 척을 지어 달라는 의뢰였다. 같은 날 해군 장교 하나도 작업장을 찾아와, 오르두스의 배를 지은 자를 찾고 있다고 넌지시 말했다.",
        choices: [
          { id: "build_fleet", label: "해군의 눈을 피해 함대를 짓는다", hint: "평생 번 것보다 큰 판이다",
            check: { stat: "skill", against: 75 }, personality: { ambition: 8, freedom: 4 }, mark: "fleet_job",
            outcomes: {
              great: { text: "{name}은 배를 열 군데 섬의 작업장에 나눠 맡기고 용골만 직접 짰다. 해군 장교는 끝내 아무것도 찾지 못했고, 열 척의 배는 같은 날 서로 다른 항구에서 바다로 나갔다.", effects: { supplies: 15, skill: 10 }, mark: "fleet_built" },
              good: { text: "배는 다섯 척만 완성했다. 나머지 설계도는 불태워야 했지만 대가는 넉넉했다.", effects: { supplies: 5, trust: -2 }, mark: "fleet_built" },
              bad: { text: "해군이 작업장을 덮쳤다. 반쯤 완성된 용골들이 압수되었고, {name}은 이웃들의 눈앞에서 수갑을 찼다.", effects: { trust: -10, health: -10 }, mark: "workshop_raided" }
            } },
          { id: "one_ship", label: "설계도를 돌려주고 배 한 척만 짓는다", hint: "욕심을 덜어야 오래 간다",
            check: { stat: "trust", against: 35 }, personality: { caution: 6, loyalty: 4 }, mark: "one_ship",
            outcomes: {
              great: { text: "오르두스는 그 결정을 존중했다. 한 척뿐인 배는 오르두스 함대의 기함이 되었고, {name}의 작업장은 해군의 의심에서도 비켜 갔다.", effects: { supplies: 8, trust: 7 } },
              good: { text: "부하는 투덜대며 설계도를 챙겨 갔다. 한 척 값은 받았다.", effects: { supplies: 4, trust: -1 } },
              bad: { text: "해군 장교는 그 한 척만으로도 냄새를 맡았다. 작업장에는 한동안 감시가 붙었고 손님이 끊겼다.", effects: { trust: -6, supplies: -6 } }
            } }
        ] },
      { step: 3, id: "night_guest", age: 34, art: "storm", title: "폭풍의 밤의 손님",
        body: "폭풍이 몰아치던 밤 작업장 문이 부서질 듯 울렸다. 오르두스가 아니라 오르두스의 배에 탔던 선원들이었다. 오르두스는 해군에게 붙잡혔고, 선원들은 배를 숨길 곳이 필요하다고 했다. 작업장 뒤 비밀 선거는 {name}의 가족조차 모르는 곳이었다.",
        choices: [
          { id: "hide_ship", label: "비밀 선거에 배를 숨겨 준다", hint: "들키면 작업장이 끝난다",
            check: { stat: "trust", against: 60 }, personality: { empathy: 7, freedom: 3 }, mark: "hid_crew",
            outcomes: {
              great: { text: "해군 수색대는 선거 입구 바로 앞에서 발길을 돌렸다. 한 달 뒤 선원들은 수리한 배를 몰고 떠나며, 작업장 앞에 고래기름 통을 산더미처럼 쌓아 두었다.", effects: { friendBond: 12, supplies: 8 } },
              good: { text: "배는 숨겼지만 이웃들이 수상한 기색을 눈치챘다. 한동안 장터에서 인사를 받지 못했다.", effects: { friendBond: 5, trust: -2 } },
              bad: { text: "누군가 밀고했다. 해군이 선거를 부수고 배를 끌어냈고, 작업장 간판에는 해적 협력자라는 낙인이 찍혔다.", effects: { trust: -10, supplies: -8 }, mark: "workshop_raided" }
            } },
          { id: "close_door", label: "문을 걸어 잠그고 등불을 끈다", hint: "모르는 척이 가장 안전하다",
            check: { stat: "health", against: 30 }, personality: { caution: 8 },
            outcomes: {
              great: { text: "선원들은 다른 곳으로 떠났고, 다음 날 해군이 작업장에 들렀을 때 {name}은 정말로 아무것도 몰랐다. 장교는 고개를 끄덕이며 새 순찰선 주문을 남기고 갔다.", effects: { health: 8, trust: 7 } },
              good: { text: "문 너머의 목소리는 한참 뒤에야 멀어졌다. 그 밤 내내 잠을 이루지 못했다.", effects: { health: 4, friendBond: -1 } },
              bad: { text: "선원들은 문을 부수고 들어와 선거를 차지했다. 해군이 들이닥쳤을 때 {name}은 공범과 피해자 사이 어딘가에 서 있었다.", effects: { health: -7, supplies: -6 }, mark: "workshop_raided" }
            } }
        ] },

      { step: 4, id: "keel", age: 58, art: "legacy", requires: ["fleet_built", "hid_crew", "ordus_friend"], title: "용골에 새긴 이름",
        body: "늙은 {name}의 작업장 앞 바다에 낯익은 배 한 척이 들어왔다. 오래전 {name}이 손본 바로 그 배였다. 선장은 오르두스의 손녀라고 했다. 배는 상처투성이였지만 용골은 여전히 곧았고, 손녀는 이 배를 마지막으로 한 번 고쳐 달라고 청했다.",
        choices: [
          { id: "rebuild", label: "남은 힘을 다해 배를 새로 짜 맞춘다", hint: "늙은 손으로 마지막 걸작을",
            check: { stat: "health", against: 65 }, personality: { loyalty: 6, ambition: 3 },
            outcomes: {
              great: { text: "석 달 뒤 배는 처음 진수하던 날보다 더 곧게 떠올랐다. 손녀는 용골 안쪽에 {name}의 이름을 새겨 넣었고, 배는 그 이름을 품고 다시 먼바다로 나갔다.", effects: { skill: 10, friendBond: 10 } },
              good: { text: "배는 다시 떴지만 {name}은 그 뒤로 한동안 허리를 펴지 못했다.", effects: { skill: 4, health: -1 } },
              bad: { text: "작업 도중 쓰러졌다. 배는 다른 장인의 손에 마무리되었고, {name}은 병상에서 망치 소리만 들었다.", effects: { health: -13, supplies: -5 } }
            } },
          { id: "teach", label: "손녀에게 직접 고치는 법을 가르친다", hint: "기술은 손에서 손으로 간다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 6, caution: 2 },
            outcomes: {
              great: { text: "손녀는 서툴렀지만 끈질겼다. 마지막 이음새를 스스로 맞춘 날, 손녀는 {name}을 스승이라 부르며 고개를 숙였다.", effects: { friendBond: 9, trust: 6 } },
              good: { text: "가르치는 내내 잔소리가 늘었지만 배는 무사히 고쳐졌다.", effects: { friendBond: 4 } },
              bad: { text: "손녀는 성미가 급해 배울 생각이 없었다. 반쯤 고친 배를 몰고 떠나며 다시는 오지 않겠다고 했다.", effects: { friendBond: -6, health: -6 } }
            } }
        ] },
      { step: 4, id: "wreck", age: 52, art: "repaired", title: "떠밀려 온 잔해",
        body: "어느 아침 {name}의 작업장 앞 해변에 검게 칠한 판자 하나가 떠밀려 왔다. 판자에는 {name}이 젊은 날 쓰던 대패 자국이 그대로 남아 있었다. 그 배가 어디서 어떻게 부서졌는지, 누가 타고 있었는지 아는 사람은 아무도 없었다.",
        choices: [
          { id: "trace", label: "해류를 거슬러 난파 지점을 찾는다", hint: "바다는 답을 숨긴다",
            check: { stat: "skill", against: 60 }, personality: { freedom: 6, ambition: 3 },
            outcomes: {
              great: { text: "{name}은 해류표를 펴고 사흘을 거슬러 올라가 작은 섬에 닿았다. 난파한 선원들이 거기서 구조를 기다리고 있었고, 그들은 그 배 덕분에 살았다며 {name}을 끌어안았다.", effects: { skill: 10, supplies: 10 } },
              good: { text: "난파 지점은 찾았지만 남은 것은 부서진 돛대 하나뿐이었다.", effects: { skill: 4, health: -1 } },
              bad: { text: "폭풍에 휘말려 {name}의 작은 배마저 부서질 뻔했다. 간신히 돌아온 해변에는 판자가 하나 더 떠밀려 와 있었다.", effects: { health: -10, supplies: -6 } }
            } },
          { id: "mount", label: "판자를 작업장 문 위에 걸어 둔다", hint: "모든 배는 결국 돌아온다",
            check: { stat: "trust", against: 30 }, personality: { caution: 5, empathy: 4 },
            outcomes: {
              great: { text: "판자를 본 항구 사람들이 저마다 그 배에 얽힌 이야기를 들려주었다. 하나같이 그 배가 누군가를 살렸다는 이야기였다.", effects: { trust: 9, friendBond: 6 } },
              good: { text: "판자는 작업장 문 위에서 조용히 바래 갔다. 가끔 손님들이 그 내력을 물었다.", effects: { trust: 4 } },
              bad: { text: "판자를 알아본 해군 장교가 작업장을 뒤지기 시작했다. 오래된 의뢰가 다시 들춰졌다.", effects: { trust: -6, health: -6 } }
            } }
        ] }
    ]
  },

  {
    key: "lost_child", title: "맡겨진 아이",
    legacy: {
      default: "잠깐 맡아 달라는 말 한마디가 인생 한 자락을 통째로 바꾸어 놓을 수 있다는 것을 알았다.",
      raised_pio: "남의 아이를 제 아이처럼 키운 세월이, 가장 서툴고 가장 따뜻한 날들로 남았다.",
      orphanage: "보육원 문 앞에서 돌아선 등은, 오래도록 아이의 눈길을 등 뒤에 달고 다녔다.",
      pio_taken: "지키지 못한 창가의 얼굴은 평생 꿈속 같은 자리에 서 있었다.",
      pio_chose: "스스로 고르게 해 준 그 하루가, 피오의 인생에서 가장 큰 선물이었다고 들었다.",
      pio_noble: "되찾은 가문의 이름보다, 피오가 편지 끝에 적은 집이라는 한 단어가 더 무거웠다.",
      pio_left: "떠나보낸 아이의 빈 침대를 오래도록 치우지 못했다.",
      brought_back: "먼 섬까지 쫓아가 데려온 아이는, 평생 그 바다 이야기를 자랑으로 삼았다.",
      pio_angry: "털어놓은 진실이 상처가 되었어도, 숨긴 거짓보다는 나았다고 끝내 믿었다."
    },
    chapters: [
      { step: 1, id: "left", age: 27, art: "harbor", title: "부두에 남은 아이",
        body: "비 오는 밤, 낯선 여행자가 {name}에게 아이 하나를 맡기며 내일 아침 데리러 오겠다고 했다. 아침이 지나고 한 달이 지나도 여행자는 돌아오지 않았다. 아이의 이름은 피오였고, 목에는 어느 귀족 가문의 문장이 새겨진 은반지가 걸려 있었다.",
        choices: [
          { id: "raise", label: "피오를 직접 키우기로 한다", hint: "삶이 통째로 바뀐다",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 8, loyalty: 3 }, mark: "raised_pio",
            outcomes: {
              great: { text: "{name}의 집에 작은 침대가 하나 늘었다. 피오는 금세 웃음을 되찾았고, 서툰 손으로 끓인 첫 죽을 맛있다며 두 그릇이나 비웠다.", effects: { friendBond: 12, health: 5 } },
              good: { text: "아이 하나가 늘자 살림이 빠듯해졌다. 그래도 밤마다 들리는 작은 숨소리가 좋았다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "피오는 밤마다 열이 올랐다. 약값에 일을 몇 번이나 놓쳤고, {name}도 끝내 함께 앓아누웠다.", effects: { supplies: -9, health: -5 } }
            } },
          { id: "search", label: "반지를 단서로 여행자를 찾아 나선다", hint: "바다는 넓고 단서는 작다",
            check: { stat: "skill", against: 60 }, personality: { ambition: 4, freedom: 5 }, mark: "searched",
            outcomes: {
              great: { text: "{name}은 반지의 문장을 항구 문서 보관소의 오래된 기록과 맞춰 보았다. 그 문장은 몇 해 전 몰락한 가문의 것이었고, 남은 핏줄을 노리는 자들이 있다는 기록까지 찾아냈다.", effects: { skill: 8, trust: 10 }, mark: "knew_crest" },
              good: { text: "여행자는 찾지 못했지만 문장의 주인은 알아냈다. 몰락한 귀족 가문이었다.", effects: { skill: 4, supplies: -1 }, mark: "knew_crest" },
              bad: { text: "단서를 쫓아 낯선 섬을 헤매다 노상강도를 만났다. 반지만은 지켰지만 돈과 일자리를 모두 잃었다.", effects: { health: -10, supplies: -6 } }
            } },
          { id: "orphanage", label: "항구 보육원에 맡긴다", hint: "아이에게도 나에게도 안전한 길",
            check: { stat: "trust", against: 30 }, personality: { caution: 7 }, mark: "orphanage",
            outcomes: {
              great: { text: "보육원장은 {name}이 주말마다 찾아온다는 조건으로 피오를 받아 주었다. 피오는 주말마다 문 앞에서 {name}을 기다리는 아이가 되었다.", effects: { trust: 8, friendBond: 7 } },
              good: { text: "피오는 보육원에서 잘 지낸다고 했다. 찾아갈 때마다 조금씩 낯을 가렸다.", effects: { trust: 4, friendBond: -1 } },
              bad: { text: "보육원 문 앞에서 피오가 {name}의 옷자락을 놓지 않았다. 억지로 떼어 내고 돌아선 그날, 항구 사람들의 눈길이 차가웠다.", effects: { friendBond: -7, trust: -5 } }
            } }
        ] },

      { step: 2, id: "crest", age: 31, art: "dangerPrison", requires: ["knew_crest"], title: "은반지의 문장",
        body: "반지의 문장은 몇 해 전 몰락한 귀족 가문의 것이었다. 가문을 무너뜨린 자들이 남은 핏줄을 찾고 있다는 소문이 돌았고, 어느 날 {name}의 집 앞에 낯선 무리 둘이 서성였다. 피오는 영문도 모른 채 창가에서 그들을 보고 있었다.",
        choices: [
          { id: "face_them", label: "문을 열고 나가 정면으로 상대한다", hint: "물러서면 다시 온다",
            check: { stat: "health", against: 65 }, personality: { loyalty: 7, freedom: 3 }, mark: "faced_hunters",
            outcomes: {
              great: { text: "{name}은 몽둥이 하나로 골목 끝까지 그들을 몰아냈다. 이웃들이 창문을 열고 박수를 쳤고, 그날 이후 동네 사람 모두가 피오를 지켜보는 눈이 되었다.", effects: { trust: 10, friendBond: 10 }, mark: "pio_safe" },
              good: { text: "쫓아내긴 했지만 {name}의 갈비뼈에 금이 갔다. 피오는 밤새 곁에서 찬 수건을 갈아 주었다.", effects: { friendBond: 5, health: -2 }, mark: "pio_safe" },
              bad: { text: "{name}이 쓰러진 사이 그들이 집 안으로 들어갔다. 깨어났을 때 창가는 비어 있었고, 은반지만 바닥에 떨어져 있었다.", effects: { health: -13, friendBond: -5 }, mark: "pio_taken" }
            } },
          { id: "flee", label: "피오를 데리고 밤배로 섬을 떠난다", hint: "모든 것을 두고 간다",
            check: { stat: "skill", against: 35 }, personality: { caution: 7, empathy: 3 }, mark: "fled_pio",
            outcomes: {
              great: { text: "{name}은 화물선 선창에 피오를 숨겨 멀리 떨어진 섬으로 건너갔다. 새 이름과 새 집, 그리고 아무도 문장을 모르는 동네가 둘을 기다리고 있었다.", effects: { friendBond: 9, skill: 6 }, mark: "pio_safe" },
              good: { text: "새 섬에서 다시 시작하는 일은 고됐다. 그래도 창가에 서성이는 그림자는 없었다.", effects: { friendBond: 4, supplies: -1 }, mark: "pio_safe" },
              bad: { text: "급하게 떠나느라 가진 것 대부분을 두고 왔다. 새 섬에서의 첫해는 굶주림의 계절이었다.", effects: { supplies: -7, health: -5 } }
            } }
        ] },
      { step: 2, id: "growing", age: 31, art: "childFestival", title: "자라는 아이",
        body: "피오는 무럭무럭 자랐다. 바다를 보면 누군가를 기다리듯 오래 서 있었고, 어느 날 {name}에게 정말 데리러 올 사람이 있었던 거냐고 물었다. 그 무렵 항구에 피오와 꼭 닮은 눈을 가진 여행자가 나타났다는 소문이 돌았다.",
        choices: [
          { id: "tell_truth", label: "아는 것을 전부 털어놓는다", hint: "아이가 감당할 수 있을까",
            check: { stat: "trust", against: 55 }, personality: { empathy: 6, loyalty: 4 }, mark: "told_pio",
            outcomes: {
              great: { text: "피오는 끝까지 듣고 오래 울었다. 그리고 눈물을 닦고 나서 {name}의 손을 잡으며, 그래도 기다려 준 사람이 있어서 다행이라고 했다.", effects: { friendBond: 12, trust: 6 }, mark: "pio_trust" },
              good: { text: "피오는 말없이 고개를 끄덕였다. 그날 밤 은반지를 오래 만지작거렸다.", effects: { friendBond: 4, health: -1 } },
              bad: { text: "피오는 왜 이제야 말하냐며 문을 박차고 나갔다. 사흘 뒤 돌아왔지만, 눈빛 한구석에 금이 가 있었다.", effects: { friendBond: -10, health: -5 }, mark: "pio_angry" }
            } },
          { id: "find_traveler", label: "소문 속 여행자를 먼저 찾아간다", hint: "아이 몰래 움직인다",
            check: { stat: "skill", against: 40 }, personality: { caution: 5, ambition: 3 }, mark: "met_traveler",
            outcomes: {
              great: { text: "여행자는 낡은 여관 구석에 있었다. 피오를 지키려고 추격자를 멀리 끌고 다녔다며, 곧 데리러 가겠다고 했다. {name}은 그 말을 피오에게 조심스레 전했다.", effects: { friendBond: 8, trust: 8 }, mark: "pio_trust" },
              good: { text: "여행자는 이미 떠난 뒤였다. 여관 주인에게 남긴 짧은 쪽지 한 장만 받아 왔다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "소문은 사기꾼의 미끼였다. 돈을 뜯기고 돌아온 {name}을 보며 피오는 무슨 일이냐고 캐물었다.", effects: { trust: -6, supplies: -6 }, mark: "pio_angry" }
            } }
        ] },

      { step: 3, id: "return", age: 36, art: "harbor", requires: ["pio_safe", "pio_trust"], title: "돌아온 여행자",
        body: "오랜 세월이 지나서야 그 여행자가 돌아왔다. 머리는 하얗게 셌고 한쪽 다리를 절었다. 여행자는 이제 피오를 데려가 가문의 이름을 되찾게 하겠다고 했다. 다 자란 피오는 아무 말 없이 {name}의 소매를 붙잡고 있었다.",
        choices: [
          { id: "let_choose", label: "피오에게 스스로 고르게 한다", hint: "어떤 답이든 받아들여야 한다",
            check: { stat: "friendBond", against: 55 }, personality: { empathy: 7, freedom: 4 }, mark: "let_choose",
            outcomes: {
              great: { text: "피오는 여행자의 손도 {name}의 손도 놓지 않았다. 가문의 이름은 되찾되 이 집에서 살겠다고 했고, 여행자는 그 말에 처음으로 웃었다.", effects: { friendBond: 14, trust: 6 }, mark: "pio_chose" },
              good: { text: "피오는 오래 고민한 끝에 한 계절만 여행자를 따라가 보겠다고 했다. 떠나는 배 위에서 피오는 끝까지 손을 흔들었다.", effects: { friendBond: 5, health: -2 }, mark: "pio_chose" },
              bad: { text: "피오는 고르지 못하고 울기만 했다. 결국 여행자가 피오를 데려갔고, 피오는 돌아보지 않았다.", effects: { friendBond: -10, health: -6 }, mark: "pio_left" }
            } },
          { id: "send_away", label: "피오의 미래를 위해 등을 떠민다", hint: "놓아주는 것도 사랑이다",
            check: { stat: "trust", against: 30 }, personality: { caution: 5, loyalty: 5 }, mark: "sent_pio",
            outcomes: {
              great: { text: "피오는 가문의 이름을 되찾았다. 이듬해 날아온 편지에는 새 문장 아래 작은 글씨로 {name}의 이름이 함께 새겨져 있었다.", effects: { trust: 9, friendBond: 6 }, mark: "pio_noble" },
              good: { text: "피오는 떠났다. 편지는 가끔 왔고, 해가 갈수록 조금씩 짧아졌다.", effects: { trust: 4, friendBond: -1 }, mark: "pio_left" },
              bad: { text: "피오는 버림받았다고 생각했다. 마지막 인사도 없이 배에 올랐고, 그 뒤로 소식이 끊겼다.", effects: { friendBond: -7, health: -5 }, mark: "pio_left" }
            } }
        ] },
      { step: 3, id: "taken", age: 35, art: "storm", title: "사라진 아이",
        body: "어느 날 피오가 사라졌다. 부둣가에 남은 것은 은반지 하나와 끌려간 발자국뿐이었다. 항구 사람들은 몰락한 가문의 원수들이 먼 섬으로 배를 몰았다고 수군거렸다. 그 섬은 지도에도 제대로 나오지 않는 곳이었다.",
        choices: [
          { id: "chase_sea", label: "모든 것을 걸고 그 섬으로 배를 띄운다", hint: "돌아올 수 있을지 모른다",
            check: { stat: "health", against: 70 }, personality: { loyalty: 8, freedom: 3 }, mark: "chased",
            outcomes: {
              great: { text: "{name}은 폭풍을 뚫고 지도에 없는 섬에 닿았다. 원수들의 저택 지하에서 피오를 찾아냈고, 피오는 반드시 올 줄 알았다며 {name}에게 매달렸다.", effects: { friendBond: 14, trust: 8 }, mark: "brought_back" },
              good: { text: "피오는 데려왔지만 {name}의 한쪽 귀는 그 섬의 겨울바람에 잃었다.", effects: { friendBond: 5, health: -2 }, mark: "brought_back" },
              bad: { text: "섬에 닿기도 전에 배가 부서졌다. 표류 끝에 구조되었을 때 {name}은 몸도 재산도 모두 바다에 잃은 뒤였다.", effects: { health: -14, supplies: -6 } }
            } },
          { id: "hire", label: "모은 돈을 털어 현상금 사냥꾼을 고용한다", hint: "돈으로 사는 용기도 있다",
            check: { stat: "supplies", against: 40 }, personality: { caution: 6, ambition: 2 }, mark: "hired",
            outcomes: {
              great: { text: "늙은 사냥꾼은 한 달 만에 피오를 데려왔다. 돈은 절반만 받겠다며, 자기도 오래전 맡겨진 아이였다고 했다.", effects: { friendBond: 8, trust: 7 }, mark: "brought_back" },
              good: { text: "사냥꾼은 피오의 행방만 알아 왔다. 살아 있다는 것만으로도 숨이 쉬어졌다.", effects: { friendBond: 4, supplies: -1 } },
              bad: { text: "사냥꾼은 선금을 받고 사라졌다. 남은 것은 텅 빈 금고와 더 깊어진 밤뿐이었다.", effects: { supplies: -8, trust: -5 } }
            } }
        ] },

      { step: 4, id: "grown", age: 54, art: "legacy", requires: ["pio_chose", "pio_noble", "brought_back"], title: "어른이 된 피오",
        body: "어른이 된 피오가 {name}을 찾아왔다. 품에 안긴 갓난아이를 내밀며, 오래전 {name}이 자기에게 그랬던 것처럼 이 아이를 한 번 안아 주고 이름을 지어 달라고 했다. 피오의 손가락에는 낡은 은반지가 여전히 끼워져 있었다.",
        choices: [
          { id: "name_baby", label: "오래 고민한 이름을 지어 준다", hint: "한 사람의 평생이 걸린 일",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 7 },
            outcomes: {
              great: { text: "{name}은 사흘 밤을 고민해 바다와 집을 함께 뜻하는 이름을 지었다. 피오는 그 이름을 듣고 아기처럼 울었다.", effects: { friendBond: 10, health: 6 } },
              good: { text: "이름은 조금 투박했지만 피오는 그게 더 마음에 든다며 웃었다.", effects: { friendBond: 4, health: -1 } },
              bad: { text: "고민 끝에 지은 이름이 피오의 원수 가문 이름과 겹쳤다. 피오는 웃어넘겼지만 분위기는 한동안 어색했다.", effects: { friendBond: -6, health: -6 } }
            } },
          { id: "live_near", label: "피오의 마을로 아예 이사한다", hint: "늙어서 짐을 싸는 일이다",
            check: { stat: "supplies", against: 60 }, personality: { loyalty: 6, freedom: 3 },
            outcomes: {
              great: { text: "{name}은 피오의 집 옆에 작은 집을 얻었다. 손주는 걸음마를 떼자마자 담을 넘어 {name}의 부엌으로 달려왔다.", effects: { friendBond: 12, health: 8 } },
              good: { text: "이사는 고됐지만 저녁마다 같은 식탁에 앉는 날이 늘었다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "낯선 마을에서 늙은 몸은 자주 탈이 났다. 피오의 짐이 되는 것 같아 마음이 무거웠다.", effects: { supplies: -10, health: -6 } }
            } }
        ] },
      { step: 4, id: "ring", age: 50, art: "legacy", title: "남겨진 반지",
        body: "피오의 은반지 이야기는 해가 갈수록 빛이 바랬다. 피오가 어디서 어떻게 사는지 아는 사람은 없었다. 그러던 어느 봄, 낯선 젊은이가 {name}의 집 문을 두드리며 은반지를 아는 사람을 찾는다고 했다. 젊은이의 눈매는 피오를 닮아 있었다.",
        choices: [
          { id: "give_story", label: "피오의 이야기를 처음부터 들려준다", hint: "상대가 누군지 아직 모른다",
            check: { stat: "trust", against: 55 }, personality: { empathy: 6, freedom: 3 },
            outcomes: {
              great: { text: "젊은이는 피오의 자식이었다. 피오가 평생 이 집 이야기를 했다며, {name}을 피오가 사는 섬으로 데려가겠다고 했다.", effects: { friendBond: 12, trust: 6 } },
              good: { text: "젊은이는 피오의 먼 친척이었다. 피오가 잘 지낸다는 소식만으로도 충분했다.", effects: { friendBond: 4, trust: -1 } },
              bad: { text: "젊은이는 몰락한 가문의 원수가 보낸 자였다. 이야기를 다 들은 뒤 사라졌고, 얼마 뒤 피오가 숨어 살던 섬에 불이 났다는 소문이 들렸다.", effects: { trust: -8, health: -6 } }
            } },
          { id: "ask_first", label: "먼저 젊은이의 사연부터 묻는다", hint: "조심해서 나쁠 것 없다",
            check: { stat: "skill", against: 30 }, personality: { caution: 7 },
            outcomes: {
              great: { text: "젊은이의 이야기 속 작은 버릇 하나가 피오와 똑같았다. {name}은 그제야 문을 활짝 열고 젊은이를 안으로 들였다.", effects: { friendBond: 8, trust: 7 } },
              good: { text: "사연은 반쯤 그럴듯했다. 아는 이야기도 반쯤만 털어놓고 돌려보냈다.", effects: { friendBond: 4 } },
              bad: { text: "의심하는 말투에 젊은이는 상처받은 얼굴로 돌아섰다. 나중에야 피오의 자식이었다는 것을 알았다.", effects: { friendBond: -6, health: -6 } }
            } }
        ] }
    ]
  },

  {
    key: "old_rival_debt", title: "돌아온 빚",
    legacy: {
      default: "젊은 날 가볍게 던진 속임수가 평생 이자를 붙여 돌아온다는 것을 배웠다.",
      apologized: "무릎 꿇은 그날의 부끄러움이, 평생 가장 떳떳한 기억 중 하나가 되었다.",
      won_rematch: "같은 판에서 두 번 이긴 사람이라는 이름은 자랑이자 저주였다.",
      humiliated: "모두의 앞에서 당한 망신은, 남을 망신 주지 않는 사람으로 만들었다.",
      partners: "원수와 손잡은 세월이 친구와 보낸 세월보다 길어졌다.",
      turned_tables: "되받아친 손은 이겼지만, 이긴 뒤의 밤은 생각보다 조용하지 않았다.",
      ruined: "모든 것을 잃은 바닥에서 처음으로 세르반이 느꼈을 추위를 알았다.",
      debt_cleared: "마침내 지워진 빚 장부는, 둘 사이에 남은 마지막 다리를 불태우는 대신 이어 주었다.",
      debt_heir: "갚겠다고 약속한 빚은 끝내 다 갚지 못했지만, 약속만은 끝까지 지켰다."
    },
    chapters: [
      { step: 1, id: "arrival", age: 33, art: "harbor", title: "잊은 줄 알았던 얼굴",
        body: "항구에 거대한 배 한 척이 들어왔고, 선주는 {name}을 지목해 불렀다. 세르반, 젊은 날 {name}이 내기 판에서 속여 빈털터리로 만들었던 사람이었다. 이제 세르반은 이 바다 무역로의 절반을 쥔 거물이 되어 있었고, 옛 빚을 이자까지 쳐서 받겠다고 했다.",
        choices: [
          { id: "apologize", label: "무릎을 꿇고 진심으로 사과한다", hint: "자존심은 값이 싸다",
            check: { stat: "trust", against: 40 }, personality: { empathy: 7, caution: 3 }, mark: "apologized",
            outcomes: {
              great: { text: "{name}이 부두 바닥에 무릎을 꿇자 세르반의 얼굴이 굳었다. 한참 뒤 세르반은 손을 내밀어 {name}을 일으켜 세우며, 이런 사과를 기다리느라 너무 오래 걸렸다고 했다.", effects: { trust: 8, friendBond: 8 }, mark: "sevan_soft" },
              good: { text: "세르반은 사과를 받았지만 빚은 그대로라고 했다. 그래도 목소리는 조금 누그러졌다.", effects: { trust: 4, health: -1 } },
              bad: { text: "세르반은 무릎 꿇은 {name}을 내려다보며 크게 웃었다. 그 장면은 그림으로 그려져 항구 게시판에 나붙었다.", effects: { trust: -8, health: -4 }, mark: "humiliated" }
            } },
          { id: "rematch", label: "같은 내기를 한 판 더 하자고 한다", hint: "이번엔 속임수 없이",
            check: { stat: "skill", against: 70 }, personality: { ambition: 7, freedom: 4 }, mark: "rematch",
            outcomes: {
              great: { text: "{name}은 정정당당하게 이겼다. 세르반은 패를 내려놓고 오래 웃더니, 그때도 이렇게 졌다면 원망하지 않았을 거라며 빚 장부를 반으로 찢었다.", effects: { supplies: 15, trust: 8 }, mark: "won_rematch" },
              good: { text: "판은 비겼다. 세르반은 투덜대면서도 이자만은 지워 주겠다고 했다.", effects: { supplies: 4, health: -1 } },
              bad: { text: "이번에는 {name}이 빈털터리가 되었다. 세르반은 빚 장부에 새로운 줄을 하나 더 적어 넣었다.", effects: { supplies: -12, health: -6 }, mark: "owe_more" }
            } },
          { id: "pay", label: "가진 재산을 털어 빚을 갚는다", hint: "깨끗하지만 가난해진다",
            check: { stat: "supplies", against: 50 }, personality: { loyalty: 5, caution: 4 }, mark: "paid",
            outcomes: {
              great: { text: "{name}이 금고를 통째로 내밀자 세르반은 절반만 집어 들었다. 나머지는 사람을 보는 값으로 치겠다며, 언제 한번 같이 일해 보자고 했다.", effects: { supplies: 6, trust: 10 }, mark: "sevan_soft" },
              good: { text: "빚은 갚았지만 살림은 바닥이 났다. 세르반은 고개만 끄덕이고 떠났다.", effects: { trust: 5, supplies: -2 } },
              bad: { text: "세르반은 금고를 받고도 이자가 모자란다고 했다. {name}에게 남은 것은 빈 금고와 새 빚 장부였다.", effects: { supplies: -14, health: -3 }, mark: "owe_more" }
            } }
        ] },

      { step: 2, id: "offer", age: 37, art: "deck", requires: ["sevan_soft", "won_rematch"], title: "세르반의 제안",
        body: "세르반은 의외의 제안을 들고 왔다. 자기 무역로를 노리는 자들이 있는데, 그 뒤에 썩은 해군 장교와 해적 군벌이 함께 얽혀 있다는 것이었다. 세르반은 옛 빚을 지우는 대신 {name}에게 그 연결 고리를 끊어 달라고 했다. 실패하면 둘 다 바다에서 사라질 터였다.",
        choices: [
          { id: "take_on", label: "의뢰를 받아 연결 고리를 직접 추적한다", hint: "칼끝 위를 걷는 일이다",
            check: { stat: "skill", against: 65 }, personality: { ambition: 6, freedom: 4 }, mark: "took_job",
            outcomes: {
              great: { text: "{name}은 세 항구의 장부를 맞춰 보고 장교와 군벌이 주고받은 밀약서를 찾아냈다. 세르반은 그 밀약서를 보더니, 이제부터 우리는 동업자라고 선언했다.", effects: { trust: 12, supplies: 10 }, mark: "partners" },
              good: { text: "고리 하나는 끊었지만 나머지는 숨어 버렸다. 세르반은 절반의 빚만 지워 주었다.", effects: { trust: 4, health: -1 } },
              bad: { text: "추적은 들통났다. 군벌의 부하들이 {name}을 골목에서 덮쳤고, 세르반의 무역선 하나가 그 주에 불탔다.", effects: { health: -12, trust: -6 }, mark: "sevan_lost" }
            } },
          { id: "advise", label: "정보만 건네고 한발 물러선다", hint: "아는 만큼만 돕는다",
            check: { stat: "trust", against: 35 }, personality: { caution: 7 }, mark: "advised",
            outcomes: {
              great: { text: "{name}이 건넨 소문 한 줄로 세르반은 고리를 스스로 끊어 냈다. 세르반은 빚을 지우고 수익의 일부까지 나눠 주었다.", effects: { trust: 8, supplies: 7 }, mark: "partners" },
              good: { text: "세르반은 고맙다면서도 실망한 기색이었다. 빚은 조금 줄었다.", effects: { trust: 4, supplies: -1 } },
              bad: { text: "건넨 정보가 틀렸다. 세르반의 배가 엉뚱한 항구에서 습격당했고, 그 원망은 고스란히 {name}에게 돌아왔다.", effects: { trust: -7, supplies: -5 } }
            } }
        ] },
      { step: 2, id: "squeeze", age: 37, art: "lifeStorm", title: "조여 오는 손",
        body: "세르반의 복수는 조용하고 집요했다. {name}과 거래하던 상인들이 하나둘 등을 돌렸고, {home}에 사는 가족에게까지 빚 독촉장이 날아들었다. 세르반의 하인이 찾아와, 공개적으로 잘못을 고백하는 문서에 서명하면 모든 것을 멈추겠다고 전했다.",
        choices: [
          { id: "sign", label: "고백 문서에 서명한다", hint: "이름에 흠이 남는다",
            check: { stat: "trust", against: 35 }, personality: { caution: 5, empathy: 5 }, mark: "signed",
            outcomes: {
              great: { text: "고백 문서가 게시판에 붙자 항구 사람들은 의외로 {name}을 다시 보았다. 잘못을 인정하는 사람은 드물다며, 떠났던 상인들이 하나둘 돌아왔다.", effects: { trust: 8, friendBond: 7 }, mark: "signed_peace" },
              good: { text: "독촉은 멈췄다. 이름에 남은 흠은 오래 지워지지 않았다.", effects: { friendBond: 4, trust: -1 }, mark: "signed_peace" },
              bad: { text: "서명한 문서는 세르반의 손에서 더 부풀려졌다. 고백은 조롱거리가 되었고 독촉도 멈추지 않았다.", effects: { trust: -8, supplies: -5 } }
            } },
          { id: "counter", label: "세르반의 약점을 캐내 맞불을 놓는다", hint: "이기면 판이 뒤집힌다",
            check: { stat: "skill", against: 70 }, personality: { ambition: 8, freedom: 3 }, mark: "countered",
            outcomes: {
              great: { text: "{name}은 세르반이 해적 군벌과 몰래 거래해 온 장부를 손에 넣었다. 그 장부 한 권으로 판은 뒤집혔고, 이번에는 세르반이 {name}을 찾아와 협상을 청했다.", effects: { supplies: 14, trust: 8 }, mark: "turned_tables" },
              good: { text: "약점 하나를 잡아 독촉을 멈추게 했다. 휴전이었지 평화는 아니었다.", effects: { supplies: 4, health: -1 }, mark: "turned_tables" },
              bad: { text: "맞불은 거꾸로 번졌다. 세르반은 거꾸로 {name}을 고소했고, 작은 가게와 집이 모두 경매에 넘어갔다.", effects: { supplies: -12, trust: -8 }, mark: "ruined" }
            } }
        ] },

      { step: 3, id: "storm_meet", age: 42, art: "storm", requires: ["partners", "turned_tables"], title: "폭풍 속의 담판",
        body: "결국 모든 실이 한 곳으로 모였다. 세르반의 배와 {name}이 탄 배, 그리고 이름 모를 검은 배가 폭풍 한가운데서 마주 섰다. 검은 배의 주인은 세르반의 무역로를 노리던 자이자, 오래전 {name}에게 내기 판의 속임수를 가르쳐 준 사람이었다.",
        choices: [
          { id: "board_black", label: "검은 배에 홀로 건너간다", hint: "옛 스승과의 마지막 판",
            check: { stat: "health", against: 70 }, personality: { freedom: 6, loyalty: 5 }, mark: "boarded",
            outcomes: {
              great: { text: "{name}은 옛 스승과 마주 앉아 마지막 내기를 했다. 이번에는 스승의 속임수를 모두 꿰뚫어 보았고, 검은 배는 깃발을 내렸다. 세르반은 갑판 너머에서 모든 것을 지켜보았다.", effects: { trust: 14, friendBond: 10 }, mark: "debt_cleared" },
              good: { text: "판은 이겼지만 스승의 칼에 손등이 베였다. 검은 배는 폭풍 속으로 물러갔다.", effects: { trust: 5, health: -2 }, mark: "debt_cleared" },
              bad: { text: "스승은 판을 시작하기도 전에 {name}을 바다로 밀어 떨어뜨렸다. 세르반의 선원들이 건져 올렸을 때 검은 배는 이미 세르반의 배에 불을 지른 뒤였다.", effects: { health: -15, supplies: -5 }, mark: "sevan_lost" }
            } },
          { id: "signal_sevan", label: "세르반과 신호를 맞춰 협공한다", hint: "원수를 믿어야 한다",
            check: { stat: "friendBond", against: 40 }, personality: { loyalty: 6, caution: 4 }, mark: "joined",
            outcomes: {
              great: { text: "세르반의 배가 왼쪽을, {name}의 배가 오른쪽을 막자 검은 배는 갈 곳을 잃었다. 폭풍이 걷힌 뒤, 두 사람은 같은 갑판에 서서 처음으로 함께 웃었다.", effects: { friendBond: 9, trust: 7 }, mark: "debt_cleared" },
              good: { text: "신호가 조금 엇갈렸지만 검은 배는 물러갔다. 둘은 서로의 탓을 하며 투덜거렸다.", effects: { friendBond: 4, health: -1 } },
              bad: { text: "세르반은 신호를 보내지 않았다. 아니면 폭풍이 삼켰을지도 몰랐다. {name}의 배만 홀로 검은 배와 부딪혔다.", effects: { friendBond: -7, health: -6 } }
            } }
        ] },
      { step: 3, id: "deathbed", age: 41, art: "childClinic", title: "병상의 세르반",
        body: "세르반이 쓰러졌다는 소식이 날아들었다. 진료소 침대 위의 세르반은 앙상하게 말라 있었고, 머리맡에는 {name}에게 받을 빚을 적은 장부가 놓여 있었다. 세르반은 장부를 가리키며, 이걸 어떻게 할지는 이제 {name}이 정하라고 했다.",
        choices: [
          { id: "burn_book", label: "장부를 함께 태우자고 한다", hint: "빚도 원한도 재가 된다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 7 }, mark: "burned_book",
            outcomes: {
              great: { text: "장부가 타는 것을 보며 세르반은 오래 묵은 숨을 내쉬었다. 그 뒤로 세르반은 기적처럼 기운을 차렸고, 둘은 매주 진료소 앞에서 내기 없는 장기를 두었다.", effects: { friendBond: 10, health: 5 }, mark: "debt_cleared" },
              good: { text: "장부는 탔지만 세르반은 끝내 한마디도 하지 않았다. 그래도 손은 놓지 않았다.", effects: { friendBond: 4, health: -1 }, mark: "debt_cleared" },
              bad: { text: "세르반은 장부를 품에 끌어안았다. 그 빚이 자기가 살아온 이유라고 했다. 둘 다 아무 말도 하지 못했다.", effects: { friendBond: -7, health: -5 } }
            } },
          { id: "honor", label: "남은 빚을 끝까지 갚겠다고 약속한다", hint: "평생을 거는 약속이다",
            check: { stat: "supplies", against: 65 }, personality: { loyalty: 8, ambition: 2 }, mark: "honored",
            outcomes: {
              great: { text: "{name}은 그 자리에서 첫 몫을 내밀었다. 세르반은 금화를 보지도 않고 {name}의 얼굴만 보았다. 그거면 됐다며 장부의 맨 끝 줄에 다 갚았다고 적었다.", effects: { trust: 12, friendBond: 8 }, mark: "debt_cleared" },
              good: { text: "약속은 했지만 갚는 길은 멀었다. 세르반은 그래도 만족한 듯 눈을 감았다.", effects: { trust: 5, supplies: -2 }, mark: "debt_heir" },
              bad: { text: "약속을 지키려 무리하게 벌인 장사가 망했다. 빚은 오히려 늘었고, 세르반은 그 소식을 듣지 못한 채 숨을 거두었다.", effects: { supplies: -13, health: -5 }, mark: "debt_heir" }
            } }
        ] },

      { step: 4, id: "harbor_will", age: 60, art: "legacy", requires: ["debt_cleared"], title: "두 사람의 항구",
        body: "세르반이 세상을 떠난 뒤 유언장이 공개되었다. 무역로의 작은 항구 하나가 {name}의 이름으로 남겨져 있었다. 유언장 끝에는 빚은 받을 만큼 받았다는 한 줄과, 그 항구를 내기 판 없는 곳으로 만들어 달라는 부탁이 적혀 있었다.",
        choices: [
          { id: "govern", label: "항구를 직접 맡아 다스린다", hint: "늙어서 짊어지는 큰 짐",
            check: { stat: "trust", against: 60 }, personality: { loyalty: 5, ambition: 4 },
            outcomes: {
              great: { text: "{name}은 항구의 도박장을 모두 닫고 그 자리에 시장을 열었다. 몇 해 만에 항구는 바다에서 가장 정직한 장터라는 이름을 얻었다.", effects: { trust: 12, supplies: 10 } },
              good: { text: "도박장은 줄었지만 뒷골목으로 숨었을 뿐이었다. 그래도 항구는 조금씩 나아졌다.", effects: { trust: 4, health: -1 } },
              bad: { text: "도박장 주인들이 들고일어났다. 늙은 {name}은 항구 관리소에 갇힌 채 사흘을 버텨야 했다.", effects: { trust: -8, health: -8 } }
            } },
          { id: "give_away", label: "항구를 주민들에게 돌려준다", hint: "내 것이 아닌 걸 안다",
            check: { stat: "friendBond", against: 30 }, personality: { empathy: 7, freedom: 3 },
            outcomes: {
              great: { text: "주민들은 항구 입구에 두 사람의 이름을 나란히 새긴 돌을 세웠다. {name}은 그 돌 앞을 지날 때마다 세르반에게 인사하듯 모자를 들었다.", effects: { friendBond: 9, trust: 6 } },
              good: { text: "주민들은 고마워하며 항구를 나눠 맡았다. 다툼도 있었지만 내기 판은 없었다.", effects: { friendBond: 4 } },
              bad: { text: "주민들 사이에 다툼이 벌어졌고, 결국 항구는 다른 상인 손에 헐값에 넘어갔다.", effects: { trust: -6, supplies: -6 } }
            } }
        ] },
      { step: 4, id: "heir", age: 55, art: "harbor", title: "빚의 상속자",
        body: "세월이 흘러 세르반의 딸이 {name}을 찾아왔다. 아버지가 남긴 장부를 펼치며, 이 빚을 끝낼지 이어 갈지는 오늘 대화에 달렸다고 했다. 딸의 눈은 젊은 날의 세르반처럼 차갑고 또렷했다.",
        choices: [
          { id: "tell_all", label: "젊은 날의 속임수를 처음부터 털어놓는다", hint: "딸이 아버지를 다시 보게 된다",
            check: { stat: "trust", against: 55 }, personality: { empathy: 6, loyalty: 4 },
            outcomes: {
              great: { text: "이야기를 다 들은 딸은 장부를 덮었다. 아버지가 평생 쫓은 건 돈이 아니라 이 이야기였을 거라며, 장부를 {name}에게 건네고 떠났다.", effects: { trust: 12, friendBond: 8 } },
              good: { text: "딸은 고개를 끄덕였지만 장부는 그대로 가져갔다. 다음에 다시 오겠다고 했다.", effects: { trust: 4, friendBond: -1 } },
              bad: { text: "진실을 들은 딸은 더 차가워졌다. 아버지를 망가뜨린 사람이 이렇게 편히 늙었냐며, 장부의 빚을 법정으로 가져갔다.", effects: { trust: -8, supplies: -7 } }
            } },
          { id: "one_bet", label: "마지막 내기 한 판으로 끝내자고 한다", hint: "모든 것이 시작된 방식으로",
            check: { stat: "skill", against: 65 }, personality: { freedom: 7, ambition: 4 },
            outcomes: {
              great: { text: "{name}은 정정당당하게 이겼고, 딸은 패를 내려놓으며 처음으로 웃었다. 아버지가 왜 평생 이 사람 이야기만 했는지 알 것 같다고 했다.", effects: { supplies: 14, trust: 6 } },
              good: { text: "판은 비겼다. 딸은 빚을 반으로 줄이고 다음 판을 기약했다.", effects: { supplies: 4, health: -1 } },
              bad: { text: "딸은 아버지보다 한 수 위였다. {name}은 남은 재산을 모두 잃고, 젊은 날 세르반이 느꼈을 추위를 그제야 알았다.", effects: { supplies: -13, trust: -6 } }
            } }
        ] }
    ]
  },
];
