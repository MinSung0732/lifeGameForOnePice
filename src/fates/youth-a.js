// Youth fates A: a wandering swordsman's debt, a sea king's grudge, a circus that hides cages.
export default [
  {
    key: "drifter_blade", title: "떠돌이 검객의 셈",
    legacy: {
      default: "떠돌이 검객이 남긴 외상값처럼, {name}은 셈이 맞지 않는 세상에서도 갚을 것은 갚는 사람이 되었다.",
      first_form: "등대 밑에서 배운 첫 자세는 {name}의 몸에 끝내 지워지지 않는 버릇으로 남았다.",
      sold_out: "검객을 판 동전의 무게는 오래도록 {name}의 주머니 속에서 덜컥거렸다.",
      blamed: "의심받던 젖은 부두의 아침 이후로 {name}은 누가 무엇을 했는지 끝까지 확인하는 사람이 되었다.",
      witnessed_win: "언덕의 결투에서 끝까지 눈을 떼지 않은 날부터 {name}은 겁이 나도 똑바로 보는 법을 알았다.",
      tore_ledger: "부풀린 장부를 찢던 날, {name}은 칼보다 셈이 사람을 살릴 때도 있다는 것을 배웠다.",
      got_scabbard: "검객이 남긴 빈 칼집은 {name}에게 칼보다 먼저 배짱을 물려주었다.",
      knew_story: "검객의 진짜 사연을 들은 뒤로 {name}은 빚진 사람을 함부로 비웃지 않았다.",
      last_spar: "마지막 한 판에서 넘어지는 법을 배운 {name}은 그 뒤로 몇 번을 넘어져도 다시 일어났다."
    },
    chapters: [
      { step: 1, id: "arrival", age: 14, art: "harbor", title: "외상 술값",
        body: "장마가 끝난 날, 낡은 칼 한 자루를 찬 떠돌이 검객이 {home}의 부두 주점에 눌러앉았다. 카즈라라는 이름의 사내는 사흘째 외상으로 술을 마시고 등대 밑에서 잤다. 주인은 혀를 찼지만 아무도 감히 칼집에 손을 대지 못했다.",
        choices: [
          { id: "ask", label: "검을 가르쳐 달라고 조른다", hint: "귀찮아할 것이 뻔하다",
            check: { stat: "skill", against: 40 }, personality: { ambition: 6, freedom: 2 }, mark: "pupil",
            outcomes: {
              great: { text: "카즈라는 귀찮다며 빗자루를 던졌는데, 받아 든 {name}의 자세를 보고 눈썹을 치켜올렸다. 그날 밤 등대 밑에서 첫 번째 자세를 배웠다.", effects: { skill: 10, friendBond: 2 }, mark: "first_form" },
              good: { text: "외상값부터 갚으면 생각해 보겠다는 대답이 돌아왔다. {name}은 한 달 내내 주점 설거지를 하고서야 막대기 쥐는 법 하나를 얻었다.", effects: { skill: 5, supplies: -2 } },
              bad: { text: "칼집 끝이 이마를 톡 쳤을 뿐인데 {name}은 부두 끝까지 굴러갔다. 구경하던 어부들이 한참을 웃었고, 이마의 혹은 열흘 동안 가라앉지 않았다.", effects: { health: -6, trust: -2 } }
            } },
          { id: "pay", label: "외상 술값을 대신 갚아 준다", hint: "모아 둔 돈이 줄어든다",
            check: { stat: "supplies", against: 45 }, personality: { empathy: 5, loyalty: 3 }, mark: "paid",
            outcomes: {
              great: { text: "주인은 어린 손님의 배짱이 기특하다며 값을 반으로 깎아 주었다. 카즈라는 한참 동전을 내려다보다가 이 빚은 꼭 갚겠다고 낮게 말했다.", effects: { supplies: -3, trust: 6, friendBond: 6 }, mark: "owed_favor" },
              good: { text: "모아 둔 돈이 몽땅 술값으로 사라졌다. 카즈라는 고맙다는 말 대신 {name}의 머리를 한 번 쓰다듬고 휘청휘청 등대로 돌아갔다.", effects: { supplies: -6, friendBond: 6, trust: 3 } },
              bad: { text: "계산대에서 꺼낸 장부에는 술값보다 훨씬 무서운 이름이 적혀 있었다. 근해의 고리대금 해적, 외눈 마그로였다. 주인은 그 장부를 본 이상 입을 다물라고 했다.", effects: { supplies: -8, health: -2 }, mark: "saw_ledger" }
            } },
          { id: "report", label: "마을 어른들에게 알린다", hint: "칼 찬 사람은 위험하다",
            check: { stat: "trust", against: 40 }, personality: { caution: 6, loyalty: 2 }, mark: "wary",
            outcomes: {
              great: { text: "어른들은 카즈라를 쫓아내는 대신 무너진 방파제를 쌓게 했다. 검객은 투덜대면서도 돌을 날랐고, 마을 사람들은 {name}이 일찍 알린 덕이라고 했다.", effects: { trust: 10, skill: 2 } },
              good: { text: "어른들은 검객을 불러 경고했다. 카즈라는 순순히 고개를 숙였지만, 돌아서며 {name}에게 고자질쟁이라고 입 모양으로 말했다.", effects: { trust: 5, friendBond: -2 } },
              bad: { text: "어른들은 괜한 걱정이라며 {name}을 돌려보냈다. 그 이야기는 주점까지 퍼졌고, 카즈라는 {name}이 지나갈 때마다 칼집을 일부러 덜컥거렸다.", effects: { trust: -4, friendBond: -3 } }
            } }
        ] },

      { step: 2, id: "drill", age: 16, art: "deck", title: "새벽 수련", requires: ["pupil", "owed_favor", "first_form"],
        body: "두 해 동안 카즈라는 새벽마다 언덕 위에서 {name}에게 칼 대신 막대를 휘두르게 했다. 어느 새벽, 마그로의 수금꾼들이 언덕을 올라왔다. 이자에 이자가 붙어 검객의 빚은 배 한 척 값이 되어 있었다.",
        choices: [
          { id: "stand", label: "막대를 쥐고 검객 곁에 선다", hint: "배운 것을 시험할 때",
            check: { stat: "skill", against: 50 }, personality: { loyalty: 6, ambition: 3 }, mark: "stood_by",
            outcomes: {
              great: { text: "{name}의 막대가 맨 앞 수금꾼의 손목을 정확히 때렸고 녹슨 칼이 풀숲으로 날아갔다. 카즈라는 웃음을 참지 못했고, 수금꾼들은 다음에 보자며 물러갔다.", effects: { skill: 10, friendBond: 4 }, mark: "proven" },
              good: { text: "둘이 등을 맞대고 버텨 수금꾼들을 쫓아냈다. 대신 {name}에게는 오래 남을 멍이, 카즈라의 옷자락에는 칼자국이 남았다.", effects: { skill: 5, health: -3, friendBond: 4 } },
              bad: { text: "{name}은 첫 휘두름에 붙잡혀 칼끝 앞에 섰다. 카즈라는 아무 말 없이 자기 칼을 땅에 내려놓았고, 수금꾼들은 그 칼을 이자 대신 가져갔다.", effects: { health: -6, friendBond: -4 }, mark: "lost_sword" }
            } },
          { id: "hide", label: "등대 창고에 검객을 숨긴다", hint: "마을이 입을 맞춰야 한다",
            check: { stat: "trust", against: 45 }, personality: { caution: 4, empathy: 4 }, mark: "hid_him",
            outcomes: {
              great: { text: "수금꾼들이 집집마다 물었지만 {home} 사람들은 하나같이 칼 찬 사람은 본 적도 없다고 했다. 생선 장수 할멈은 오히려 수금꾼들에게 상한 생선을 비싸게 팔아 치웠다.", effects: { trust: 8, friendBond: 4 } },
              good: { text: "창고 문 앞에서 수금꾼들은 발길을 돌렸다. 하지만 숨긴 일을 알게 된 집 어른은 한동안 {name}과 말을 섞지 않았다.", effects: { trust: 3, bond: -4, friendBond: 5 } },
              bad: { text: "수금꾼 하나가 창고 틈으로 새어 나오는 술 냄새를 맡았다. 카즈라는 뒷창으로 빠져나갔지만 화가 난 수금꾼들은 창고에 불을 질렀다.", effects: { supplies: -8, trust: -5 }, mark: "burned" }
            } }
        ] },
      { step: 2, id: "offer", age: 16, art: "harbor", title: "쥐수염의 제안", requires: ["saw_ledger", "wary"],
        body: "마그로의 부하 쥐수염이 {home}에 와서 부두 아이들에게 동전을 뿌렸다. 칼 찬 술꾼이 어디서 자는지 말해 주면 한 달 치 품삯을 주겠다고 했다. 쥐수염의 눈길은 유난히 오래 {name}에게 머물렀다.",
        choices: [
          { id: "sell", label: "검객의 거처를 알려 준다", hint: "돈은 돈이다",
            check: { stat: "supplies", against: 40 }, personality: { ambition: 5, caution: 3 }, mark: "sold_out",
            outcomes: {
              great: { text: "{name}이 등대를 가리켰을 때 카즈라는 이미 떠난 뒤였다. 빈자리에는 그 돈으로 밥이나 든든히 먹으라는 쪽지가 놓여 있었다.", effects: { supplies: 10, friendBond: -2 } },
              good: { text: "약속한 동전은 받았다. 그날 밤 등대 쪽에서 오래 소란이 일었고, 다음 날 아침 모래밭에는 카즈라의 칼집만 남아 있었다.", effects: { supplies: 6, trust: -3 } },
              bad: { text: "쥐수염은 거처를 듣자마자 동전 주머니를 도로 챙겼다. 입이 가벼운 녀석은 언젠가 쓸모가 있다며 {name}의 이름을 수첩에 적어 갔다.", effects: { supplies: -2, trust: -6, health: -2 }, mark: "in_notebook" }
            } },
          { id: "lie", label: "돈만 받고 엉뚱한 곳을 일러 준다", hint: "들키면 큰일이다",
            check: { stat: "skill", against: 45 }, personality: { freedom: 6, ambition: 2 }, mark: "double",
            outcomes: {
              great: { text: "{name}이 일러 준 곳은 썰물 때만 드러나는 갯바위였다. 수금꾼들이 밤새 갯벌에 빠져 허우적대는 동안 {home} 사람들은 창문 너머로 배를 잡고 웃었다.", effects: { supplies: 8, trust: 6 }, mark: "fooled_magro" },
              good: { text: "수금꾼들은 허탕을 치고 돌아갔다. 돈은 손에 남았지만 쥐수염이 떠나며 {name}의 얼굴을 한참 들여다본 것이 마음에 걸렸다.", effects: { supplies: 5, health: -1 }, mark: "in_notebook" },
              bad: { text: "거짓말은 반나절 만에 들통났다. 수금꾼들은 {name}을 부두 기둥에 거꾸로 매달아 놓고 갔고, 어부들이 내려 줄 때까지 갈매기들이 쪼아 댔다.", effects: { health: -8, trust: -2 } }
            } },
          { id: "warn", label: "검객에게 달려가 알린다", hint: "빚쟁이의 원한을 산다",
            check: { stat: "friendBond", against: 40 }, personality: { loyalty: 6, empathy: 3 }, mark: "warned",
            outcomes: {
              great: { text: "카즈라는 오히려 수금꾼들이 오는 길목에 그물을 쳐 두었다. 그물에 걸린 수금꾼들은 다음 배로 쫓겨났고, 검객은 처음으로 {name}에게 술 대신 차를 따라 주었다.", effects: { friendBond: 10, skill: 3 } },
              good: { text: "카즈라는 고맙다며 그날 밤 거처를 옮겼다. 쥐수염은 누가 입을 놀렸는지 알아내려고 한동안 부두를 맴돌았다.", effects: { friendBond: 6, trust: -2 } },
              bad: { text: "급히 달려가던 {name}의 뒤를 쥐수염이 조용히 밟았다. 결국 길을 안내한 꼴이 되었고, 카즈라는 원망 어린 눈으로 {name}을 돌아보며 끌려갔다.", effects: { friendBond: -8, health: -2 }, mark: "led_them" }
            } }
        ] },
      { step: 2, id: "raid", age: 16, art: "harbor", title: "엎어진 주점",
        body: "마그로의 수금꾼들이 {home}의 부두 주점을 뒤집어엎었다. 칼 찬 술꾼을 내놓을 때까지 매일 밤 한 집씩 부수겠다고 했다. 카즈라는 그날따라 어디에도 보이지 않았다.",
        choices: [
          { id: "decoy", label: "검객 흉내를 내며 꾀어낸다", hint: "발이 빨라야 산다",
            check: { stat: "health", against: 45 }, personality: { freedom: 5, ambition: 3 }, mark: "decoy",
            outcomes: {
              great: { text: "낡은 망토에 빗자루를 칼처럼 찬 {name}은 골목을 휘저으며 수금꾼들을 언덕 너머 늪까지 끌고 갔다. 진흙투성이가 되어 돌아온 수금꾼들 앞에는 카즈라가 칼을 뽑고 서 있었다.", effects: { health: -2, friendBond: 8, trust: 6 } },
              good: { text: "수금꾼들을 마을 밖으로 꾀어내는 데는 성공했다. 붙잡혀 빗자루 칼이 부러지고 정강이를 걷어차였지만 그날 밤 부서진 집은 없었다.", effects: { health: -5, trust: 6, friendBond: 3 } },
              bad: { text: "망토 끝이 그물에 걸려 {name}은 골목 한가운데서 고꾸라졌다. 수금꾼들은 가짜 검객을 앞세우고 온 마을을 돌며 진짜를 불러냈다.", effects: { health: -8, trust: -3 } }
            } },
          { id: "bell", label: "친구들과 종을 울려 마을을 깨운다", hint: "혼자서는 못 막는다",
            check: { stat: "friendBond", against: 40 }, personality: { loyalty: 5, empathy: 3 }, mark: "rang_bell",
            outcomes: {
              great: { text: "등대 종이 울리자 어부들이 작살과 노를 들고 쏟아져 나왔다. 수금꾼들은 수에 밀려 배로 달아났고, 친구들은 {name}을 어깨에 메고 부두를 돌았다.", effects: { trust: 8, friendBond: 6 } },
              good: { text: "종소리에 사람들이 모여 수금꾼들은 물러갔다. 다만 주점 주인은 수리비 장부를 {name}의 집으로 보냈다.", effects: { trust: 5, supplies: -3, friendBond: 3 } },
              bad: { text: "종을 너무 세게 친 나머지 줄이 끊어져 종이 통째로 떨어졌다. 사람들은 해적의 습격인 줄 알고 산으로 피했고, 수금꾼들은 텅 빈 마을을 마음껏 뒤졌다.", effects: { trust: -6, supplies: -4 } }
            } },
          { id: "watch", label: "숨어서 수금꾼들을 지켜본다", hint: "보는 것도 힘이 된다",
            check: { stat: "skill", against: 35 }, personality: { caution: 6 }, mark: "watched",
            outcomes: {
              great: { text: "{name}은 수금꾼들이 흘린 말에서 마그로의 장부가 엉터리라는 것을 알아챘다. 원금은 오래전에 다 갚았고, 남은 것은 부풀린 이자뿐이었다.", effects: { skill: 6, trust: 3 }, mark: "knew_fake" },
              good: { text: "수금꾼들의 배 이름과 떠나는 물때를 외워 두었다. 언젠가 쓸모가 있을 것 같았다.", effects: { skill: 4, friendBond: -1 } },
              bad: { text: "숨어 있던 생선 상자 위에 수금꾼 하나가 털썩 앉았다. 비린내 속에서 버틴 {name}은 사흘 동안 동네 고양이들에게 쫓겨 다녔다.", effects: { health: -3, friendBond: -3 } }
            } }
        ] },

      { step: 3, id: "betrayal", age: 19, art: "storm", title: "폭풍 밤의 금고", requires: ["sold_out", "lost_sword", "burned", "led_them", "in_notebook"],
        body: "폭풍이 오던 밤, {name}은 카즈라가 마그로의 배로 향하는 것을 보았다. 검객의 손에는 {home} 어부 조합의 금고가 들려 있었다. 마을 돈으로 빚을 갚고 자유를 사려는 것이었다.",
        choices: [
          { id: "block", label: "부두 끝에서 앞을 막아선다", hint: "상대는 검객이다",
            check: { stat: "skill", against: 55 }, personality: { loyalty: 5, ambition: 3 }, mark: "blocked",
            outcomes: {
              great: { text: "{name}이 물러서지 않고 한 발 내디디자 카즈라의 칼끝이 허공에서 멈췄다. 검객은 금고를 내려놓고 오래 웃었다. 제법 컸다는 한마디만 남기고 맨손으로 폭풍 속에 떠났다.", effects: { skill: 8, trust: 8 }, mark: "returned_chest" },
              good: { text: "부딪친 끝에 금고 반쪽을 되찾았다. 나머지를 안고 떠나는 카즈라의 뒷모습은 미안하다고 말하는 것 같았지만 {name}은 끝까지 손을 흔들지 않았다.", effects: { trust: 6, health: -3 } },
              bad: { text: "칼집이 바람처럼 {name}의 옆구리를 쳤다. 정신을 차렸을 때 마그로의 배는 이미 수평선 너머였고, 마을 사람들은 젖은 부두에 쓰러진 {name}을 먼저 의심했다.", effects: { health: -10, trust: -4 }, mark: "blamed" }
            } },
          { id: "wake", label: "마을 어른들을 깨운다", hint: "시간이 없다",
            check: { stat: "trust", against: 45 }, personality: { caution: 5, loyalty: 3 }, mark: "woke_town",
            outcomes: {
              great: { text: "횃불이 부두를 메웠고 마그로의 배는 닻을 올리지 못했다. 카즈라는 금고를 바다에 던지는 시늉을 하다 말고 순순히 내려놓았다. 어부들은 검객을 다음 배로 내보냈다.", effects: { trust: 10, supplies: 3 } },
              good: { text: "어른들이 달려왔을 때 배는 떠나고 있었다. 금고는 잃었지만 누가 끝까지 마을 편에 섰는지는 모두가 보았다.", effects: { trust: 6, supplies: -2 } },
              bad: { text: "어른들은 폭풍에 겁먹은 아이의 헛소리라며 문을 닫았다. 다음 날 금고가 빈 것을 알고서야 모두 {name}을 바라보았다. 왜 혼자라도 막지 않았느냐는 눈빛이었다.", effects: { trust: -8, bond: -3 }, mark: "blamed" }
            } },
          { id: "listen", label: "검객의 사정을 끝까지 듣는다", hint: "용서와 어리석음 사이",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7, freedom: 2 }, mark: "listened",
            outcomes: {
              great: { text: "카즈라는 금고를 넘기는 척하고 마그로의 장부를 훔쳐 올 생각이었다고 털어놓았다. {name}은 그 계획에 꾀 하나를 더했고, 새벽녘 바다 위에서 마그로의 장부가 불타올랐다.", effects: { friendBond: 8, trust: 6 }, mark: "tore_ledger" },
              good: { text: "검객이 꺼낸 사연은 반쯤 거짓처럼 들렸다. 그래도 {name}은 금고의 절반만 가져가라고 했고, 카즈라는 그 약속을 지켰다.", effects: { friendBond: 6, trust: -2 } },
              bad: { text: "사연을 듣는 사이 배는 닻을 올렸다. 검객의 이야기는 처음부터 시간을 벌기 위한 것이었고, {name}의 손에는 빈 술병 하나만 남았다.", effects: { friendBond: -8, trust: -4 }, mark: "fooled_by_him" }
            } }
        ] },
      { step: 3, id: "duel", age: 19, art: "lifeStorm", title: "언덕의 결투", requires: ["proven", "stood_by", "warned", "decoy", "rang_bell", "fooled_magro", "knew_fake"],
        body: "외눈 마그로가 직접 {home}에 배를 댔다. 빚을 칼로 셈하자는 말에 카즈라는 해 뜨는 언덕에서 받겠다고 답했다. 검객은 {name}에게 입회인이 되어 달라고 부탁했다.",
        choices: [
          { id: "second", label: "입회인으로 곁을 지킨다", hint: "눈을 떼지 말 것",
            check: { stat: "skill", against: 55 }, personality: { loyalty: 6, caution: 2 }, mark: "witnessed",
            outcomes: {
              great: { text: "결투 직전 {name}은 마그로의 소매 속에 숨긴 총을 보았다. 외침과 함께 카즈라의 칼이 먼저 움직였고 총은 두 동강 나 언덕 아래로 굴러갔다. 마그로는 장부를 찢고 배로 돌아갔다.", effects: { skill: 6, friendBond: 6, trust: 4 }, mark: "witnessed_win" },
              good: { text: "칼과 칼이 세 번 부딪치고 마그로가 무릎을 꿇었다. 카즈라도 어깨를 깊이 베였고, {name}은 바닷물로 상처를 씻어 주며 빚이 끝났다는 말을 들었다.", effects: { friendBond: 6, health: -2 } },
              bad: { text: "결투는 순식간에 끝났다. 쓰러진 쪽은 카즈라였다. 마그로는 목숨만은 셈에 넣지 않겠다며 떠났고, {name}은 피투성이 검객을 업고 언덕을 내려왔다.", effects: { health: -6, friendBond: 2, supplies: -4 }, mark: "carried" }
            } },
          { id: "pay_off", label: "마을 돈을 모아 빚을 갚자고 한다", hint: "피 대신 돈으로",
            check: { stat: "supplies", against: 50 }, personality: { empathy: 4, caution: 4 }, mark: "paid_off",
            outcomes: {
              great: { text: "모은 돈을 세던 {name}은 마그로의 장부에서 같은 이자가 세 번 붙은 것을 찾아냈다. 구경꾼들 앞에서 셈이 틀린 것이 드러나자 마그로는 체면 때문에 장부를 찢고 돌아갔다.", effects: { supplies: -2, trust: 10, skill: 4 }, mark: "tore_ledger" },
              good: { text: "집집마다 모은 돈으로 빚은 끝났다. 카즈라는 한동안 그 집들의 지붕을 고치고 그물을 기워 셈을 갚았다.", effects: { supplies: -6, trust: 8, friendBond: 3 } },
              bad: { text: "마그로는 돈 자루를 받고도 칼을 거두지 않았다. 이건 이자일 뿐이라는 말과 함께 결투는 그대로 열렸고, 마을의 돈만 바다 건너로 사라졌다.", effects: { supplies: -10, trust: -4 } }
            } },
          { id: "draw", label: "대신 칼을 뽑고 나선다", hint: "무모함도 셈이 된다",
            check: { stat: "health", against: 55 }, personality: { ambition: 6, freedom: 3 }, mark: "drew_blade",
            outcomes: {
              great: { text: "떨리는 칼끝을 내민 {name}을 보고 마그로는 배꼽을 잡고 웃었다. 이런 배짱을 키운 사내라면 빚을 탕감해 줄 만하다며 장부를 바다에 던졌다. 카즈라는 그날 칼집을 {name}에게 남겼다.", effects: { skill: 6, health: 2, friendBond: 6 }, mark: "got_scabbard" },
              good: { text: "칼이 단 한 번 스쳤다. {name}에게 가는 흉터가 남았고, 그사이 카즈라가 마그로의 칼을 쳐 냈다. 검객은 다시는 그런 짓 하지 말라며 오래 꾸짖었다.", effects: { skill: 5, health: -4, friendBond: 4 } },
              bad: { text: "마그로의 칼등이 {name}의 칼을 날려 버렸다. 바닥에 넘어진 {name}을 감싸느라 카즈라는 결투 내내 등을 내주었고, 결국 무릎을 꿇었다.", effects: { health: -10, friendBond: -2 }, mark: "carried" }
            } }
        ] },
      { step: 3, id: "farewell", age: 19, art: "harbor", title: "등대의 작별",
        body: "마그로의 배가 근해에 나타났다는 소문이 돌던 아침, 카즈라는 짐을 꾸렸다. 더 머물면 {home}까지 셈에 끌려든다는 것이었다. 등대 아래에서 검객은 {name}을 기다리고 있었다.",
        choices: [
          { id: "spar", label: "마지막으로 한 판 붙자고 한다", hint: "이길 생각은 접는 게 좋다",
            check: { stat: "skill", against: 45 }, personality: { ambition: 5, loyalty: 2 }, mark: "last_spar",
            outcomes: {
              great: { text: "{name}의 막대가 처음으로 카즈라의 소매를 스쳤다. 검객은 소매의 실밥을 한참 보더니 그걸로 셈은 끝났다며 웃었다.", effects: { skill: 10, friendBond: 4 } },
              good: { text: "열 번을 넘어지고 열한 번째에 겨우 버텼다. 카즈라는 흙투성이가 된 {name}을 일으켜 세우며 넘어지는 법은 다 배웠다고 했다.", effects: { skill: 5, health: -2, friendBond: 3 } },
              bad: { text: "시작하자마자 {name}은 등대 밑 물웅덩이에 처박혔다. 검객은 손을 내밀다 말고 너무 웃은 나머지 배가 떠날 시간을 놓칠 뻔했다.", effects: { health: -5, friendBond: 1 } }
            } },
          { id: "gift", label: "도시락과 해도를 챙겨 준다", hint: "빈손으로 보낼 수는 없다",
            check: { stat: "supplies", against: 35 }, personality: { empathy: 6 }, mark: "gave_map",
            outcomes: {
              great: { text: "{name}이 건넨 해도에는 마그로의 배가 다니지 않는 물길이 표시되어 있었다. 카즈라는 해도를 품에 넣고 한 번도 하지 않던 인사를 깊게 했다.", effects: { supplies: -2, friendBond: 10, trust: 2 } },
              good: { text: "도시락은 무사히 건넸지만 해도는 낡아 반쯤 틀린 것이었다. 카즈라는 길을 잃으면 그것도 여행이라며 받아 갔다.", effects: { supplies: -4, friendBond: 7 } },
              bad: { text: "서두르다 도시락을 통째로 바다에 빠뜨렸다. 갈매기 떼가 몰려든 사이 배는 떠났고, 카즈라는 빈손을 흔드는 {name}에게 소리 내어 웃어 주었다.", effects: { supplies: -6, friendBond: -1 } }
            } },
          { id: "ask_why", label: "빚의 진짜 사연을 묻는다", hint: "검객은 말을 아낀다",
            check: { stat: "friendBond", against: 40 }, personality: { empathy: 5, caution: 2 }, mark: "knew_story",
            outcomes: {
              great: { text: "카즈라는 오래전 마그로의 배에서 아이들을 빼내려고 빚을 졌다고 했다. 그 빚을 다 갚을 때까지 한곳에 머물 수 없다는 말에 {name}은 처음으로 어른의 무게를 알았다.", effects: { friendBond: 10, bond: 2 } },
              good: { text: "검객은 반만 이야기했다. 나머지는 다음에 만나면 하겠다는 약속만 남기고 배에 올랐다.", effects: { friendBond: 5 } },
              bad: { text: "사연을 묻자 카즈라는 입을 꾹 다물었다. 작별 인사도 없이 배에 오른 검객의 등은 생각보다 작아 보였다.", effects: { friendBond: -5, bond: -2 } }
            } }
        ] },

      { step: 4, id: "old_tab", age: 27, art: "harbor", title: "어느 항구의 외상", requires: ["witnessed_win", "tore_ledger", "got_scabbard", "returned_chest", "last_spar", "knew_story", "proven"],
        body: "세월이 흐른 뒤 낯선 항구의 주점에서 {name}은 익숙한 칼집 소리를 들었다. 머리가 희끗해진 카즈라가 구석에서 외상 장부에 이름을 적고 있었다. 검객은 {name}을 알아보고 잔을 들어 올렸다.",
        choices: [
          { id: "pay_tab", label: "이번에도 외상값을 치러 준다", hint: "오래된 농담",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 5, loyalty: 3 },
            outcomes: {
              great: { text: "주인이 장부를 넘기자 {name}의 몫으로 미리 치러 둔 술값이 적혀 있었다. 검객이 만날 날을 위해 오래전부터 맡겨 둔 돈이었다. 둘은 서로 술을 사겠다며 새벽까지 다퉜다.", effects: { supplies: 6, friendBond: 8 } },
              good: { text: "만만치 않은 술값을 치르자 카즈라는 이것으로 둘의 셈은 비겼다며 웃었다.", effects: { supplies: -4, friendBond: 8 } },
              bad: { text: "지갑을 연 순간 {name}의 주머니도 텅 비어 있었다. 둘은 나란히 주점 설거지를 하며 옛날이야기를 했다.", effects: { supplies: -5, health: -2, friendBond: 2 } }
            } },
          { id: "spar_again", label: "다시 한 판 겨루자고 한다", hint: "세월은 누구 편일까",
            check: { stat: "skill", against: 55 }, personality: { ambition: 5, freedom: 3 },
            outcomes: {
              great: { text: "부두에서 맞붙은 끝에 칼집과 칼집이 동시에 멈췄다. 카즈라는 숨을 고르며 이제야 셈이 맞았다고 했다. 구경하던 뱃사람들이 박수를 쳤다.", effects: { skill: 10, trust: 3 } },
              good: { text: "카즈라는 여전히 빨랐다. 그래도 {name}은 이번에는 끝까지 쓰러지지 않고 버텼다.", effects: { skill: 5, health: -2, friendBond: 2 } },
              bad: { text: "세월은 검객의 편이었다. 생선 상자 더미 위에 대자로 뻗은 {name}을 내려다보며 카즈라는 아직 멀었다고 했다.", effects: { health: -6, trust: -2 } }
            } }
        ] },
      { step: 4, id: "debt_name", age: 27, art: "legacy", title: "장부에 적힌 이름", requires: ["blamed", "fooled_by_him", "in_notebook", "led_them", "sold_out", "lost_sword", "burned", "carried"],
        body: "어느 날 {name}에게 전보벌레로 연락이 왔다. 외눈 마그로의 옛 장부를 사들였다는 상인이 그 속에 {name}의 이름이 적혀 있다고 했다. 옆 칸에는 카즈라의 이름과 낯선 항구의 이름이 함께 있었다.",
        choices: [
          { id: "trace", label: "장부를 사서 직접 확인한다", hint: "옛 셈을 꺼낸다",
            check: { stat: "supplies", against: 45 }, personality: { loyalty: 4, caution: 3 },
            outcomes: {
              great: { text: "장부 마지막 장에는 남은 빚은 모두 이 몸이 진다는 카즈라의 서툰 글씨가 있었다. 그 아래 {name}의 이름에는 굵은 줄이 그어져 있었다.", effects: { supplies: -3, friendBond: 8, trust: 4 } },
              good: { text: "장부 값은 비쌌지만 이름 옆에는 갚음이라는 두 글자가 있었다. 누가 갚았는지는 적혀 있지 않았다.", effects: { supplies: -4, friendBond: 5, trust: 2 } },
              bad: { text: "상인은 돈만 받고 사라졌다. 장부는 처음부터 없었고, {name}은 옛 이름 하나로 사기를 당했다는 사실에 웃지도 울지도 못했다.", effects: { supplies: -10, trust: -2 } }
            } },
          { id: "ignore", label: "지난 일이라며 연락을 끊는다", hint: "과거에 발목 잡히지 않는다",
            check: { stat: "trust", against: 35 }, personality: { freedom: 6, caution: 2 },
            outcomes: {
              great: { text: "연락을 끊고 나서야 마음이 가벼워졌다. 며칠 뒤 같은 상인이 사기꾼으로 붙잡혔다는 소식이 들렸다.", effects: { trust: 6, health: 3 } },
              good: { text: "그 이름은 한동안 꿈에 나왔다. 그래도 {name}은 오늘의 일에 마음을 붙였다.", effects: { health: 4, friendBond: -1 } },
              bad: { text: "몇 달 뒤 낯선 사람들이 옛 빚을 내놓으라며 {name}을 찾아왔다. 겨우 돌려보냈지만 끊어 낸 줄 알았던 과거가 발목을 잡은 셈이었다.", effects: { supplies: -6, health: -4 } }
            } },
          { id: "find_him", label: "카즈라가 있다는 항구로 전보를 친다", hint: "답이 올지 모른다",
            check: { stat: "friendBond", against: 40 }, personality: { empathy: 5, loyalty: 4 },
            outcomes: {
              great: { text: "답신은 사흘 만에 왔다. 그때는 미안했다, 이제 빚은 없다, 다음 술은 이 몸이 산다. 짧은 문장 세 개에 {name}은 오래 묵은 무언가가 풀리는 것을 느꼈다.", effects: { friendBond: 10, bond: 2 } },
              good: { text: "답은 오지 않았다. 대신 몇 달 뒤 이름 없는 소포로 낡은 칼집 장식 하나가 도착했다.", effects: { friendBond: 5 } },
              bad: { text: "전보를 받은 쪽은 카즈라가 아니라 그 항구의 해군 지부였다. 옛 빚쟁이를 찾는 수상한 연락으로 오해받아 {name}은 한참 동안 사정을 설명해야 했다.", effects: { trust: -5, supplies: -3 } }
            } }
        ] },
      { step: 4, id: "rumor", age: 27, art: "legacy", title: "막대를 든 아이들",
        body: "떠돌이 검객이 떠난 지 여러 해, 어디에 있든 {name}에게 소문 하나가 닿았다. 먼 바다의 항구마다 술값 대신 아이들에게 막대 휘두르는 법을 가르치는 늙은 검객이 있다는 이야기였다.",
        choices: [
          { id: "toast", label: "웃으며 술 한 잔을 올린다", hint: "그거면 충분하다",
            check: { stat: "bond", against: 30 }, personality: { empathy: 4, freedom: 3 },
            outcomes: {
              great: { text: "그날 밤 {name}은 낯선 아이 하나에게 막대 쥐는 법을 가르쳤다. 등대 밑에서 보았던 첫 자세 그대로였다.", effects: { skill: 4, friendBond: 6, trust: 3 } },
              good: { text: "잔을 비우며 등대 밑의 새벽을 떠올렸다. 잊은 줄 알았던 발 디딤이 아직 몸에 남아 있었다.", effects: { skill: 3, friendBond: 2 } },
              bad: { text: "괜히 감상에 젖어 과음한 {name}은 다음 날 하루를 통째로 날렸다. 검객의 나쁜 버릇까지 닮은 모양이었다.", effects: { health: -5, supplies: -2 } }
            } },
          { id: "seek", label: "소문의 항구를 찾아간다", hint: "엇갈릴 수도 있다",
            check: { stat: "supplies", against: 45 }, personality: { loyalty: 5, freedom: 2 },
            outcomes: {
              great: { text: "항구에 닿았을 때 검객은 하루 전에 떠난 뒤였다. 주점 벽에는 {name}의 이름 아래 외상 없음이라는 글씨가 새겨져 있었다.", effects: { friendBond: 8, trust: 3, supplies: -2 } },
              good: { text: "검객은 없었지만 막대를 든 아이들이 있었다. 아이들의 자세는 {name}이 배운 것과 똑같았다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "엉뚱한 항구에 닿아 뱃삯만 날렸다. 소문은 원래 그런 법이었다.", effects: { supplies: -8, health: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "sea_king_grudge", title: "바다왕류의 영역",
    legacy: {
      default: "바다왕류에게 배를 잃던 봄을 지나며 {name}은 바다가 누구의 것도 아니라는 것을 배웠다.",
      freed_pup: "어린 바다왕류를 풀어 준 밤 이후로 {name}은 갇힌 것을 보면 그냥 지나치지 못했다.",
      returned_pup: "어미 바다왕류와 눈을 마주쳤던 {name}은 괴물이라는 말을 쉽게 입에 올리지 않게 되었다.",
      pup_lost: "새끼를 잃은 어미의 울음소리는 오래도록 {name}의 밤바다를 따라다녔다.",
      drove_off: "작살 한 자루로 앞바다를 지켜 낸 {name}은 두려움 앞에서 먼저 움직이는 사람이 되었다.",
      cut_line: "사냥 줄을 끊던 날의 선택은 {name}에게 남들이 다 옳다고 할 때 멈춰 서는 용기를 남겼다.",
      saved_mio: "물에 빠진 친구를 건진 손으로 {name}은 그 뒤로도 많은 사람을 붙잡았다.",
      song: "하몬의 뱃노래는 {name}이 어디에 있든 바다를 건널 때마다 저절로 흘러나왔다."
    },
    chapters: [
      { step: 1, id: "lost_boat", age: 13, art: "dangerSeaKing", title: "돌아오지 않은 배",
        body: "그해 봄 {home} 앞바다에서 배가 셋이나 가라앉았다. 마지막은 {name}에게 매듭을 가르쳐 주던 늙은 어부 하몬의 배였다. 부두에 떠밀려 온 것은 거대한 이빨 자국이 난 뱃전 한 조각뿐이었다.",
        choices: [
          { id: "search", label: "조각배를 띄워 수색에 나선다", hint: "바다는 아직 성나 있다",
            check: { stat: "health", against: 40 }, personality: { loyalty: 5, freedom: 3 }, mark: "searched",
            outcomes: {
              great: { text: "부서진 배 사이에서 {name}은 하몬의 모자를 건져 올렸다. 이빨 자국 틈에는 부러진 쇠작살 촉 하나가 박혀 있었다. 바다왕류의 이빨 사이에 끼어 있던 것 같았다. 누군가 먼저 바다왕류를 찔렀던 것이다.", effects: { health: -2, trust: 6, skill: 4 }, mark: "found_hook" },
              good: { text: "해 질 녘까지 노를 저어 하몬의 그물 조각을 찾아냈다. 손바닥은 다 까졌지만 장례에 올릴 것이 생겼다.", effects: { health: -3, trust: 6, friendBond: 2 } },
              bad: { text: "검은 그림자가 조각배 밑을 지나갔다. 물결 한 번에 배가 뒤집혔고, 소용돌이에 휩쓸려 한참을 떠밀려 다니던 {name}은 다른 어부의 그물에 걸려서야 돌아왔다.", effects: { health: -10, bond: -2 }, mark: "saw_shadow" }
            } },
          { id: "mio", label: "남겨진 손주 미오 곁을 지킨다", hint: "울음을 멈출 수 있을까",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 7 }, mark: "with_mio",
            outcomes: {
              great: { text: "밤새 곁에 앉아 있자 미오가 입을 열었다. 할아버지가 요즘 바다왕류가 울고 다닌다고, 무언가를 잃어버린 소리라고 했다는 것이다.", effects: { friendBond: 10, bond: 2 }, mark: "heard_cry" },
              good: { text: "미오는 말없이 {name}의 소매를 붙잡고 잠들었다. 다음 날부터 둘은 하몬의 빈 그물을 함께 손질했다.", effects: { friendBond: 7, supplies: -2 } },
              bad: { text: "미오는 {name}을 밀쳐 냈다. 마을 사람들이 바다왕류를 그냥 두어서 할아버지가 죽었다며, 언젠가 직접 그 괴물을 잡겠다고 했다.", effects: { friendBond: -5, trust: -2 }, mark: "mio_vow" }
            } },
          { id: "chart", label: "가라앉은 자리를 해도에 그린다", hint: "바다에도 규칙이 있다",
            check: { stat: "skill", against: 40 }, personality: { caution: 5, ambition: 2 }, mark: "charted",
            outcomes: {
              great: { text: "점을 찍어 보니 배들이 가라앉은 자리는 북쪽 암초를 둥글게 감싸고 있었다. 바다왕류는 아무 데나 덤비는 것이 아니라 무언가를 지키고 있었다.", effects: { skill: 10, trust: 2 }, mark: "saw_pattern" },
              good: { text: "조합 사무실 벽에 붙인 해도 덕분에 어부들은 위험한 물길을 피하기 시작했다.", effects: { skill: 4, trust: 4 } },
              bad: { text: "급히 그린 해도는 엉터리였다. 그 해도를 믿고 나간 배 하나가 바다왕류와 마주쳐 겨우 돌아왔고, 조합장은 해도를 찢어 버렸다.", effects: { trust: -8, skill: 1 } }
            } }
        ] },

      { step: 2, id: "poachers", age: 15, art: "childInlet", title: "후미의 그물 우리", requires: ["found_hook", "saw_pattern", "heard_cry"],
        body: "북쪽 암초 뒤 후미에 낯선 배 한 척이 숨어 있었다. 갈고리 베른이라는 밀렵꾼 무리가 거대한 그물 우리에 바다왕류 새끼를 가둬 두고 있었다. 비싸게 팔린다는 이빨이 다 자라기를 기다리는 중이었다.",
        choices: [
          { id: "cut_net", label: "밤에 몰래 그물을 끊는다", hint: "들키면 바다에 던져진다",
            check: { stat: "skill", against: 50 }, personality: { empathy: 5, freedom: 4 }, mark: "cut_net",
            outcomes: {
              great: { text: "{name}은 썰물 때 드러나는 바위를 밟고 우리 밑으로 들어가 굵은 밧줄을 끊었다. 새끼는 소리 없이 빠져나갔고, 밀렵꾼들은 아침에 빈 그물을 보고 서로 탓하며 주먹다짐을 벌였다.", effects: { skill: 8, friendBond: 4 }, mark: "freed_pup" },
              good: { text: "그물 한쪽은 끊었지만 새끼는 겁에 질려 나오지 않았다. {name}은 끊긴 자리를 해초로 감춰 두고 다음 기회를 노렸다.", effects: { skill: 5, health: -1 } },
              bad: { text: "칼질 소리에 경비가 깼다. {name}은 작살 자루에 맞아 후미 밖으로 내던져졌고, 밀렵꾼들은 우리를 더 깊은 곳으로 옮겼다.", effects: { health: -10, supplies: -2 }, mark: "spotted" }
            } },
          { id: "tell", label: "조합 어른들에게 알린다", hint: "믿어 줄지 모른다",
            check: { stat: "trust", against: 45 }, personality: { caution: 4, loyalty: 4 }, mark: "told_town",
            outcomes: {
              great: { text: "조합장은 {name}의 이야기를 듣고 북쪽 암초 쪽 해도를 오래 들여다보았다. 다음 날 어부들이 배를 몰고 후미 입구를 막아섰고, 밀렵꾼들은 꼼짝없이 갇혔다.", effects: { trust: 10, bond: 2 } },
              good: { text: "어른들은 반신반의하며 후미를 지켜보기로 했다. 밀렵꾼들은 눈치를 채고 경비를 두 배로 늘렸다.", effects: { trust: 5 } },
              bad: { text: "밀렵꾼이 먼저 조합장을 찾아가 술과 돈을 건넸다. 어른들은 아이가 괜한 소란을 피운다며 {name}에게 후미 근처에 얼씬도 말라고 했다.", effects: { trust: -6, bond: -3 }, mark: "bribed_elder" }
            } },
          { id: "bargain", label: "생선 장수인 척 밀렵꾼에게 다가간다", hint: "말솜씨가 무기다",
            check: { stat: "supplies", against: 40 }, personality: { ambition: 5, caution: 2 }, mark: "bargained",
            outcomes: {
              great: { text: "생선 대 주는 아이로 위장한 {name}은 베른이 언제 떠나는지, 어디로 이빨을 팔러 가는지 다 알아냈다. 덤으로 생선값까지 두둑이 받았다.", effects: { supplies: 8, skill: 4 }, mark: "knew_route" },
              good: { text: "베른은 생선을 사 갔지만 입은 무거웠다. 그래도 배 안에 다른 새끼가 하나 더 있다는 것은 알아냈다.", effects: { supplies: 4, skill: 2 } },
              bad: { text: "베른은 {name}의 속셈을 단번에 꿰뚫었다. 생선은 공짜로 빼앗겼고, 한 번만 더 오면 미끼로 쓰겠다는 말을 들었다.", effects: { supplies: -6, health: -4 } }
            } }
        ] },
      { step: 2, id: "hunt_party", age: 15, art: "workbench", title: "작살을 가는 밤", requires: ["searched", "mio_vow", "saw_shadow", "with_mio"],
        body: "{home}의 어부들이 바다왕류 사냥대를 꾸렸다. 대장간에서는 밤새 작살을 갈았고, 미오는 할아버지의 낡은 작살을 꺼내 들었다. 사냥대는 열흘 뒤 대조기에 나가기로 했다.",
        choices: [
          { id: "join", label: "사냥대에 이름을 올린다", hint: "복수인지 용기인지",
            check: { stat: "health", against: 45 }, personality: { ambition: 5, loyalty: 4 }, mark: "hunter",
            outcomes: {
              great: { text: "{name}은 노 젓는 훈련에서 어른들을 앞질렀다. 조합장은 {name}에게 뱃머리 작살꾼 바로 뒷자리를 맡겼다.", effects: { health: 4, trust: 6, skill: 3 } },
              good: { text: "사냥대 막내가 되어 매일 밧줄을 날랐다. 손이 터지고 온몸이 쑤셨다.", effects: { health: -2, trust: 5, skill: 3 } },
              bad: { text: "훈련 첫날 작살 줄에 발이 감겨 부두 밑으로 끌려 들어갔다. 사냥대는 {name}을 노 대신 물 퍼내는 자리로 보냈다.", effects: { health: -7, trust: -3 } }
            } },
          { id: "trap", label: "미끼 통으로 덫을 만든다", hint: "힘보다 꾀",
            check: { stat: "skill", against: 45 }, personality: { caution: 5, ambition: 3 }, mark: "trap",
            outcomes: {
              great: { text: "상한 장어를 채운 통에 기름 먹인 밧줄을 엮자 사냥대 어른들도 감탄했다. 시험 삼아 띄운 통 주위로 거대한 지느러미가 맴돌다 사라졌다.", effects: { skill: 10, trust: 3 }, mark: "bait_ready" },
              good: { text: "미끼 통은 그럭저럭 쓸 만했다. 다만 냄새 때문에 동네 고양이들이 열흘 내내 {name}의 집 앞에서 울었다.", effects: { skill: 6, friendBond: -1 } },
              bad: { text: "미끼 통이 너무 일찍 터져 부두 전체가 상한 장어 냄새로 뒤덮였다. 사냥대는 출항을 사흘 미뤘고, 모두 {name}을 원망했다.", effects: { trust: -6, supplies: -4 } }
            } },
          { id: "doubt", label: "사냥을 그만두자고 설득한다", hint: "아무도 듣지 않을지 모른다",
            check: { stat: "trust", against: 45 }, personality: { empathy: 6, caution: 3 }, mark: "doubter",
            outcomes: {
              great: { text: "{name}은 가라앉은 배들이 모두 북쪽 암초 근처였다는 것을 짚었다. 조합장은 사냥을 미루고 암초부터 살피기로 했고, 미오는 이를 악물면서도 고개를 끄덕였다.", effects: { trust: 8, friendBond: 3 }, mark: "reef_check" },
              good: { text: "몇몇 어른은 고개를 끄덕였지만 사냥대는 그대로 꾸려졌다. 미오는 {name}을 겁쟁이라고 불렀다.", effects: { trust: 6, friendBond: -2 } },
              bad: { text: "말을 꺼내자마자 부두가 술렁였다. 바다왕류 편을 드는 녀석이라는 소리와 함께 {name}의 집 앞에는 생선 대가리가 던져졌다.", effects: { trust: -8, bond: -2 } }
            } }
        ] },
      { step: 2, id: "closed_sea", age: 15, art: "childMarket", title: "닫힌 바다",
        body: "바다왕류가 무서워 {home}의 배들은 부두에 묶였다. 장터의 생선 좌판이 하나둘 비었고, 하몬의 빈자리는 누구도 채우지 못했다. 사람들은 굶주림과 바다 사이에서 날마다 한숨을 쉬었다.",
        choices: [
          { id: "inlet", label: "좁은 후미 물길로 고기를 잡는다", hint: "좁은 물길은 안전할까",
            check: { stat: "skill", against: 45 }, personality: { freedom: 5, ambition: 3 }, mark: "inlet_run",
            outcomes: {
              great: { text: "{name}은 바다왕류가 들어올 수 없는 좁은 후미 물길을 찾아냈다. 작은 그물로도 장터 좌판 하나를 채울 만큼 고기가 올라왔다.", effects: { supplies: 8, trust: 6 } },
              good: { text: "고기는 조금 잡혔다. 바위에 긁힌 배 바닥을 고치느라 번 돈이 반으로 줄었다.", effects: { supplies: 4, trust: 2 } },
              bad: { text: "좁은 물길이 썰물에 말라 {name}의 배가 갯벌에 처박혔다. 밀물이 들 때까지 반나절을 게들과 함께 보냈다.", effects: { supplies: -5, health: -3 } }
            } },
          { id: "soup", label: "장터에 국 솥을 건다", hint: "모두의 부엌",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 6, loyalty: 3 }, mark: "soup",
            outcomes: {
              great: { text: "집집마다 남은 감자 하나, 말린 생선 한 마리를 모으자 장터 한가운데 큰 솥이 끓었다. 그 솥은 바다가 열릴 때까지 꺼지지 않았다.", effects: { trust: 10, supplies: -2 } },
              good: { text: "솥은 사흘을 버텼다. 바닥을 긁던 날 아이들이 {name}에게 다음 솥은 언제냐고 물었다.", effects: { trust: 6, supplies: -3 } },
              bad: { text: "솥이 기울어 국이 장터 바닥에 쏟아졌다. 미끄러진 사람들이 줄줄이 넘어졌고, 어떤 할멈은 지팡이로 {name}의 엉덩이를 때렸다.", effects: { supplies: -6, trust: -3 } }
            } },
          { id: "lantern", label: "등대에서 밤 망을 본다", hint: "잠을 줄여야 한다",
            check: { stat: "health", against: 40 }, personality: { caution: 5, loyalty: 4 }, mark: "lantern",
            outcomes: {
              great: { text: "여러 밤을 지켜본 끝에 {name}은 바다왕류가 보름달 밤마다 북쪽 암초로 돌아간다는 것을 알았다. 그 물때를 피하자 배들이 하나둘 다시 나갈 수 있었다.", effects: { skill: 6, trust: 6 }, mark: "reef_check" },
              good: { text: "등대 불빛 덕에 밤배 하나가 그림자를 피해 돌아왔다. 대신 {name}은 낮마다 꾸벅꾸벅 졸았다.", effects: { trust: 5, health: -2, skill: 1 } },
              bad: { text: "망을 보다 잠든 사이 등대 불이 꺼졌다. 그날 밤 들어오던 배가 암초에 걸렸고, 사람은 살았지만 배는 잃었다.", effects: { trust: -8, health: -2 } }
            } }
        ] },

      { step: 3, id: "mother", age: 18, art: "dangerSeaKing", title: "어미의 바다", requires: ["freed_pup", "knew_route", "told_town", "cut_net", "bargained", "reef_check"],
        body: "북쪽 암초 뒤에 숨어 있던 밀렵꾼 갈고리 베른의 배가 붙잡아 둔 새끼를 싣고 몰래 닻을 올리던 밤, {home} 앞바다가 끓어올랐다. 하몬의 배를 삼킨 바로 그 바다왕류였다. 어미는 새끼의 울음을 따라 부두 바로 앞까지 들어와 있었다.",
        choices: [
          { id: "return", label: "조각배로 새끼 우리를 끌어낸다", hint: "어미 앞으로 가야 한다",
            check: { stat: "health", against: 55 }, personality: { empathy: 6, freedom: 3 }, mark: "returned_pup",
            outcomes: {
              great: { text: "{name}은 베른의 배 꼬리에 매달린 우리를 끊어 조각배에 묶고 어미 쪽으로 저었다. 거대한 눈이 {name}을 한참 내려다보더니 새끼를 품고 깊은 바다로 가라앉았다. 베른의 배만 소용돌이에 휘말렸다.", effects: { health: -2, trust: 8, friendBond: 4 } },
              good: { text: "우리를 풀어 주는 데는 성공했지만 어미가 일으킨 물결에 조각배가 박살 났다. {name}은 부서진 노를 붙들고 밤새 떠 있다가 아침에 건져졌다.", effects: { health: -6, trust: 8, friendBond: 3 } },
              bad: { text: "어미는 다가오는 조각배를 적으로 여겼다. 꼬리 한 번에 {name}은 부두까지 날아갔고, 새끼는 베른의 배와 함께 수평선으로 사라졌다.", effects: { health: -12, trust: -2 }, mark: "pup_lost" }
            } },
          { id: "sabotage", label: "베른의 배 키를 망가뜨린다", hint: "도망치지 못하게",
            check: { stat: "skill", against: 50 }, personality: { ambition: 4, loyalty: 3 }, mark: "sabotaged",
            outcomes: {
              great: { text: "{name}이 키 줄을 끊어 놓자 베른의 배는 제자리에서 빙글빙글 돌았다. 어부들이 밧줄을 던져 새끼를 풀어 주었고, 베른 일당은 순찰선이 올 때까지 돛대에 묶여 있었다.", effects: { skill: 8, trust: 6 }, mark: "freed_pup" },
              good: { text: "키는 망가뜨렸지만 베른의 부하에게 들켜 칼에 베였다. 배는 멈췄고 새끼는 풀려났다.", effects: { skill: 4, health: -5, trust: 6 } },
              bad: { text: "키 줄 대신 닻줄을 끊는 바람에 배가 오히려 빨리 떠나 버렸다. 어미의 울음소리가 밤새 {home}의 창문을 흔들었다.", effects: { trust: -6, health: -2 }, mark: "pup_lost" }
            } },
          { id: "clear", label: "종을 울려 부두를 비운다", hint: "사람이 먼저다",
            check: { stat: "trust", against: 45 }, personality: { caution: 6, loyalty: 3 }, mark: "cleared",
            outcomes: {
              great: { text: "종소리에 맞춰 어부들이 배를 빼고 사람들을 언덕으로 올렸다. 어미가 베른의 배를 뒤집는 동안 {home}에서는 아무도 다치지 않았다.", effects: { trust: 10, bond: 3 } },
              good: { text: "사람들은 피했지만 부두 절반이 물결에 쓸려 나갔다. 다들 살아 있다는 것만으로 충분했다.", effects: { trust: 6, supplies: -3 } },
              bad: { text: "종소리에 놀란 사람들이 오히려 부두로 몰려 나왔다. 물결이 부두를 덮쳤고, 여럿이 다쳤다.", effects: { trust: -8, health: -4 } }
            } }
        ] },
      { step: 3, id: "hunt_day", age: 18, art: "storm", title: "대조기의 사냥", requires: ["hunter", "bait_ready", "trap", "mio_vow"],
        body: "대조기의 아침, 사냥대 배 다섯 척이 {home}의 부두를 떠났다. 미끼 통 냄새를 따라 수면 아래에서 검은 지느러미가 솟았다. 가까이서 본 바다왕류의 옆구리에는 오래된 쇠작살이 녹슨 채 박혀 있었다.",
        choices: [
          { id: "strike", label: "뱃머리에서 작살을 던진다", hint: "하몬의 원수다",
            check: { stat: "skill", against: 55 }, personality: { ambition: 6, loyalty: 3 }, mark: "struck",
            outcomes: {
              great: { text: "{name}의 작살이 녹슨 작살 바로 옆에 꽂혔다. 바다왕류는 울부짖으며 먼바다로 달아났고, 그해 {home} 앞바다에서는 다시 배가 가라앉지 않았다.", effects: { skill: 8, trust: 8 }, mark: "drove_off" },
              good: { text: "작살은 지느러미를 스쳤다. 성난 바다왕류가 배 한 척을 부수고 달아났지만 사냥대는 모두 살아 돌아왔다.", effects: { skill: 5, trust: 3, health: -2 } },
              bad: { text: "작살 줄이 손목에 감겨 {name}은 바다왕류와 함께 물속으로 끌려 들어갔다. 미오가 줄을 끊어 주지 않았다면 그날이 마지막이었다.", effects: { health: -12, friendBond: 3 }, mark: "mio_saved_me" }
            } },
          { id: "cut", label: "녹슨 작살을 보고 줄을 끊는다", hint: "괴물에게도 사연이 있다",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7, freedom: 2 }, mark: "cut_line",
            outcomes: {
              great: { text: "{name}은 사냥대 줄을 끊고 미오에게 녹슨 작살을 가리켰다. 미오는 한참 떨다가 할아버지의 작살을 바다에 던졌다. 바다왕류는 둘의 배 옆을 천천히 지나 사라졌다.", effects: { friendBond: 10, trust: 2 } },
              good: { text: "줄을 끊자 사냥은 엉망이 되었다. 어른들은 화를 냈지만 바다왕류는 더 덤비지 않고 돌아갔다.", effects: { friendBond: 4, trust: -2, health: 2 } },
              bad: { text: "줄이 끊기며 튕겨 나간 미끼 통이 미오의 배를 덮쳤다. 미오는 다쳤고, 사냥대는 {name}을 배신자라 불렀다.", effects: { friendBond: -8, trust: -6 }, mark: "mio_hurt" }
            } },
          { id: "save", label: "물에 빠진 미오를 건진다", hint: "사냥보다 사람",
            check: { stat: "health", against: 50 }, personality: { loyalty: 6, empathy: 3 }, mark: "saved_mio",
            outcomes: {
              great: { text: "뒤집힌 배에서 떨어진 미오를 {name}이 붙잡아 올렸다. 그 순간 바다왕류가 바로 옆을 스쳤지만 둘을 해치지 않았다. 미오는 그날 처음으로 소리 내어 울었다.", effects: { friendBond: 12, health: -2 } },
              good: { text: "미오를 건졌지만 {name}은 부서진 뱃전에 깊게 베였다. 사냥은 실패했고 둘은 살았다.", effects: { friendBond: 8, health: -5 } },
              bad: { text: "뛰어든 {name}은 성난 물살에 휘말려 방향을 잃었다. 결국 미오가 {name}을 끌고 헤엄쳐 나왔고, 그 이야기는 부두에서 오래도록 놀림거리가 되었다.", effects: { health: -6, trust: -3, friendBond: 2 }, mark: "mio_saved_me" }
            } }
        ] },
      { step: 3, id: "lure", age: 18, art: "childLantern", title: "바깥 해류로",
        body: "{home} 사람들은 바다왕류를 죽이지도 쫓지도 못한 채 지쳐 갔다. 등대지기 노인은 바깥 해류까지 꾀어내면 다시는 돌아오지 않을 거라고 했다. 누군가는 그 먼 물길로 미끼를 끌고 나가야 했다.",
        choices: [
          { id: "row", label: "미끼 배를 직접 젓는다", hint: "돌아올 길이 멀다",
            check: { stat: "health", against: 55 }, personality: { loyalty: 4, freedom: 5 }, mark: "lured",
            outcomes: {
              great: { text: "{name}은 미끼 통을 매단 조각배로 밤새 노를 저었다. 바깥 해류에 닿자 바다왕류는 미끼를 물고 큰 물살을 따라 멀어졌다. 돌아오는 길 내내 등대 불빛이 {name}을 불렀다.", effects: { health: -2, trust: 10, skill: 3 } },
              good: { text: "바다왕류는 꾀어냈지만 조각배는 해류에 휩쓸렸다. 이틀 뒤 이웃 섬 어부가 탈진한 {name}을 건져 돌려보냈다.", effects: { health: -6, trust: 10 } },
              bad: { text: "바다왕류는 미끼보다 조각배를 더 좋아했다. 배는 산산조각 났고, {name}은 미끼 통에 매달린 채 떠다니다 겨우 구조되었다.", effects: { health: -12, supplies: -3 } }
            } },
          { id: "raft", label: "등불 뗏목을 흘려보낸다", hint: "불빛을 따라올까",
            check: { stat: "skill", against: 45 }, personality: { caution: 5, empathy: 2 }, mark: "lantern_raft",
            outcomes: {
              great: { text: "등불을 단 뗏목들이 해류를 타고 줄지어 흘러갔다. 바다왕류는 불빛을 쫓아 천천히 멀어졌고, {home} 사람들은 언덕에서 그 긴 불빛 행렬을 오래 지켜보았다.", effects: { skill: 6, trust: 8 } },
              good: { text: "뗏목 절반은 가라앉았지만 나머지가 바다왕류를 꾀어냈다. 등잔 기름을 다 써 버려 그해 겨울밤이 길었다.", effects: { trust: 6, supplies: -3 } },
              bad: { text: "뗏목들이 바람에 밀려 도로 부두로 들어왔다. 바다왕류도 따라 들어와 부두 끝 창고를 통째로 부쉈다.", effects: { trust: -6, supplies: -6 } }
            } },
          { id: "song", label: "하몬이 부르던 뱃노래를 부른다", hint: "엉뚱하지만 진심",
            check: { stat: "bond", against: 40 }, personality: { empathy: 6, freedom: 3 }, mark: "song",
            outcomes: {
              great: { text: "미오와 나란히 뱃머리에 서서 하몬의 노래를 불렀다. 바다왕류는 그 노래를 아는 듯 한 번 낮게 울고는 스스로 바깥 해류로 나갔다. 아무도 이유를 설명하지 못했다.", effects: { friendBond: 8, bond: 4, trust: 4 } },
              good: { text: "노래가 통했는지 물때가 바뀌었는지 바다왕류는 멀어졌다. 미오는 할아버지 노래를 처음으로 끝까지 불렀다.", effects: { friendBond: 6 } },
              bad: { text: "{name}의 노래는 음이 하나도 맞지 않았다. 바다왕류는 귀찮다는 듯 꼬리로 물을 끼얹고 사라졌고, 흠뻑 젖은 두 사람은 감기에 걸렸다.", effects: { health: -5, friendBond: 1 } }
            } }
        ] },

      { step: 4, id: "escort", age: 29, art: "dangerSeaKing", title: "흉터 난 지느러미", requires: ["returned_pup", "freed_pup", "cut_line", "song", "cleared", "lured", "lantern_raft"],
        body: "먼 바다를 오가는 뱃사람들 사이에 이상한 소문이 돌았다. {home} 근해에서 지느러미에 흉터가 난 바다왕류가 새끼와 함께 배 곁을 따라 헤엄치며, 밀렵선만 골라 뒤집는다는 이야기였다.",
        choices: [
          { id: "hear", label: "소문을 끝까지 듣고 술을 산다", hint: "옛이야기를 보탠다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 5, freedom: 2 },
            outcomes: {
              great: { text: "{name}이 하몬과 미오의 이야기를 보태자 주점 안이 조용해졌다. 그 이야기는 {home}의 바다 수호신 전설이 되어 항구마다 퍼졌다.", effects: { trust: 8, friendBond: 4 } },
              good: { text: "술값은 꽤 나왔지만 오래된 이야기가 돌아온 것 같아 마음이 따뜻했다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "{name}이 그 바다왕류와 눈을 마주친 적이 있다고 하자 아무도 믿지 않았다. 허풍쟁이라는 별명만 하나 얻었다.", effects: { trust: -5, supplies: -2 } }
            } },
          { id: "write_mio", label: "미오에게 편지를 쓴다", hint: "답장이 올까",
            check: { stat: "bond", against: 35 }, personality: { loyalty: 5, empathy: 3 },
            outcomes: {
              great: { text: "미오의 답장에는 하몬의 모자를 등대에 걸었다는 소식과, 보름달마다 앞바다에 지느러미 두 개가 떠오른다는 이야기가 적혀 있었다.", effects: { friendBond: 10, bond: 3 } },
              good: { text: "답장은 짧았다. 바다는 열렸고, 다들 잘 지낸다는 것이었다.", effects: { friendBond: 5 } },
              bad: { text: "편지는 주소를 잘못 적어 엉뚱한 섬으로 갔다. 몇 달 뒤 모르는 사람에게서 미오가 누구냐는 답장이 왔다.", effects: { friendBond: -3, supplies: -2 } }
            } }
        ] },
      { step: 4, id: "tooth", age: 29, art: "childMarket", title: "경매장의 이빨", requires: ["struck", "drove_off", "pup_lost", "hunter", "mio_hurt", "bribed_elder"],
        body: "어느 항구 경매장에 바다왕류의 이빨 하나가 올라왔다. 출처는 {home} 근해, 판 사람은 갈고리 베른의 옛 부하라고 했다. 이빨 뿌리에는 오래된 녹슨 작살 자국이 나 있었다.",
        choices: [
          { id: "buy", label: "값을 불러 이빨을 사들인다", hint: "비싸다",
            check: { stat: "supplies", against: 50 }, personality: { loyalty: 5, empathy: 3 },
            outcomes: {
              great: { text: "경매가 끝난 뒤 {name}은 이빨을 {home}의 앞바다로 돌려보냈다. 그날 밤 낯선 지느러미 하나가 우편선 곁을 한참 따라오다 사라졌다고 했다.", effects: { supplies: -4, trust: 6, friendBond: 6 } },
              good: { text: "가진 돈을 거의 털어 이빨을 샀다. 무거운 짐이 하나 늘었지만 마음은 가벼웠다.", effects: { supplies: -6, friendBond: 4, trust: 5 } },
              bad: { text: "값이 너무 올라 손을 놓았다. 이빨은 천룡인의 장식품으로 팔려 갔다는 소문이 들렸다.", effects: { supplies: -2, trust: -2, friendBond: -3 } }
            } },
          { id: "track", label: "판매자를 뒤쫓는다", hint: "베른의 꼬리를 밟는다",
            check: { stat: "skill", against: 50 }, personality: { ambition: 5, freedom: 3 },
            outcomes: {
              great: { text: "판매자를 따라간 골목 끝 창고에는 잡혀 온 바다 생물 우리가 가득했다. {name}이 수문을 열어 두자 그날 밤 항구의 물이 한참 동안 출렁였다.", effects: { skill: 6, trust: 8 } },
              good: { text: "판매자는 놓쳤지만 베른 일당의 다음 행선지를 알아냈다. {name}은 그 소식을 전보벌레로 퍼뜨렸다.", effects: { skill: 4, trust: 3 } },
              bad: { text: "골목에서 매복에 걸렸다. 지갑을 털리고 갈고리 자국 같은 흉터를 하나 얻었다.", effects: { health: -8, supplies: -4 } }
            } }
        ] },
      { step: 4, id: "mio_note", age: 29, art: "legacy", title: "미오의 편지",
        body: "어디에 있든 {name}에게 {home}의 편지가 한 통 닿았다. 미오의 서툰 글씨였다. 바다는 다시 열렸고, 하몬의 빈자리에서 이제 미오가 그물을 던진다고 했다. 끝에는 언제 한 번 같이 배를 타자는 말이 있었다.",
        choices: [
          { id: "reply", label: "답장과 함께 그물을 부친다", hint: "멀리서라도",
            check: { stat: "supplies", against: 35 }, personality: { loyalty: 5, empathy: 4 },
            outcomes: {
              great: { text: "{name}이 보낸 그물은 하몬이 가르쳐 준 매듭으로 엮여 있었다. 미오는 그 그물로 첫 만선을 했다며 말린 생선 한 상자를 보내왔다.", effects: { supplies: 4, friendBond: 8 } },
              good: { text: "그물은 무사히 닿았다. 미오는 고맙다는 말 대신 매듭이 엉성하다고 적어 보냈다.", effects: { friendBond: 5, supplies: -2 } },
              bad: { text: "보낸 그물이 우편선과 함께 폭풍에 실종됐다. 미오에게서 그물은 어디 있느냐는 편지만 두 번 더 왔다.", effects: { supplies: -5, friendBond: -2 } }
            } },
          { id: "visit", label: "짬을 내어 고향 바다에 들른다", hint: "길이 멀다",
            check: { stat: "health", against: 40 }, personality: { loyalty: 4, freedom: 3 },
            outcomes: {
              great: { text: "{name}과 미오는 하몬의 배를 본떠 만든 작은 배를 띄웠다. 앞바다는 조용했고, 둘은 해 질 녘까지 아무 말 없이 그물을 걷었다.", effects: { friendBond: 10, bond: 3 } },
              good: { text: "잠깐 들른 고향은 낯설면서도 그대로였다. 미오와 하루 그물을 걷고 다시 길을 나섰다.", effects: { friendBond: 5, bond: 2, health: -2 } },
              bad: { text: "배편이 엇갈려 한 달을 허비했다. 겨우 닿았을 때 미오는 먼 바다로 고기잡이를 떠난 뒤였다.", effects: { supplies: -6, health: -2 } }
            } }
        ] }
    ]
  },

  {
    key: "circus_cage", title: "곡예단의 짐마차",
    legacy: {
      default: "축제 철마다 들려오던 쇠사슬 소리는 {name}에게 웃음 뒤편을 살피는 눈을 남겼다.",
      all_free: "빈 우리와 쇠사슬만 남은 짐마차를 본 그날부터 {name}은 불가능해 보이는 일 앞에서도 먼저 손을 뻗었다.",
      freed_nuk: "또래 아이의 손을 잡고 달리던 밤은 {name}에게 약속이 얼마나 무거운지를 가르쳤다.",
      sailed_away: "떠나 버린 배를 바라보던 새벽은 {name}의 마음에 다시는 늦지 않겠다는 다짐으로 남았다.",
      caught: "붙잡혀 끌려 나오던 밤의 분함은 {name}을 쉽게 포기하지 않는 사람으로 만들었다.",
      fernand_fled: "달아난 단장의 웃음을 기억하는 {name}은 끝난 일도 끝까지 확인하는 버릇이 생겼다.",
      file_worked: "창살 사이로 던진 줄칼 하나가 {name}에게 작은 도움도 누군가의 탈출이 될 수 있다는 믿음을 남겼다.",
      remembered: "그날 그려 둔 배와 깃발의 그림은 {name}이 어디에 있든 품에서 떠나지 않았다."
    },
    chapters: [
      { step: 1, id: "circus", age: 14, art: "childFestival", title: "별가루 곡예단",
        body: "축제 철마다 들르는 별가루 곡예단의 배가 올해도 {home}에 닿자 장터가 들썩였다. 불 먹는 광대와 외줄 타는 곡예사가 온 마을의 넋을 빼놓았다. 하지만 천막 뒤편 짐마차에서는 밤마다 쇠사슬 끄는 소리가 났다.",
        choices: [
          { id: "sneak", label: "공연 대신 천막 뒤로 숨어든다", hint: "들키면 곤란하다",
            check: { stat: "skill", against: 40 }, personality: { freedom: 5, ambition: 2 }, mark: "sneaked",
            outcomes: {
              great: { text: "{name}은 짐마차 밑으로 기어 들어가 쇠창살 너머의 눈과 마주쳤다. 비슷한 또래의 아이였다. 누크라는 이름을 속삭인 아이는 단장이 오기 전에 가라고 손짓했다.", effects: { skill: 4, friendBond: 6 }, mark: "met_nuk" },
              good: { text: "창살 달린 짐마차를 보았지만 경비견에게 쫓겨 달아났다. 옷자락이 찢어졌고, 본 것이 무엇인지 확신이 서지 않았다.", effects: { skill: 4, health: -1, friendBond: 2 } },
              bad: { text: "차력사에게 뒷덜미를 잡혀 공연장으로 끌려 나왔다. 단장 페르낭은 웃으며 {name}을 칼 던지기 표적판에 세웠고 온 마을이 박수를 쳤다. 칼은 다 빗나갔지만 사흘 동안 잠을 설쳤다.", effects: { health: -5, trust: -2 }, mark: "seen_by_fernand" }
            } },
          { id: "work", label: "곡예단 일꾼으로 일당을 받는다", hint: "안에서 보면 다르다",
            check: { stat: "health", against: 40 }, personality: { ambition: 4, caution: 3 }, mark: "hired",
            outcomes: {
              great: { text: "천막 기둥을 누구보다 빨리 세운 {name}을 광대 피에트가 눈여겨보았다. 쉬는 시간에 피에트는 짐마차 쪽은 절대 보지 말라고, 보게 되면 꼭 기억하라고 이상한 말을 했다.", effects: { supplies: 6, friendBond: 4 }, mark: "clown_ally" },
              good: { text: "일당은 짰고 일은 고됐다. 그래도 곡예단 사람들이 먹는 밥보다 짐마차로 가는 밥이 훨씬 적다는 것은 눈에 들어왔다.", effects: { supplies: 4, health: -1, skill: 1 } },
              bad: { text: "천막 기둥을 잘못 받쳐 공연 도중 천막 한쪽이 무너졌다. 관객들은 그것도 연출인 줄 알고 환호했지만 단장은 {name}의 일당을 몽땅 깎았다.", effects: { supplies: -4, health: -3 }, mark: "seen_by_fernand" }
            } },
          { id: "tell", label: "어른들에게 짐마차 소문을 전한다", hint: "증거는 없다",
            check: { stat: "trust", against: 40 }, personality: { caution: 5, loyalty: 3 }, mark: "rumor",
            outcomes: {
              great: { text: "항구지기는 {name}의 말을 흘려듣지 않았다. 곡예단 배의 짐 목록을 몰래 들여다본 항구지기의 얼굴이 하얗게 질렸다.", effects: { trust: 8, bond: 2 }, mark: "manifest" },
              good: { text: "어른들은 곡예단이 원래 수상한 법이라며 웃었지만, 짐마차 근처에 아이들을 보내지 않기로는 했다.", effects: { trust: 4, bond: 1 } },
              bad: { text: "단장은 소문의 출처를 금세 알아냈다. 어른들에게 공짜 표를 나눠 주며 상냥하게 웃자, 어른들은 오히려 손님을 모함하지 말라고 {name}을 꾸짖었다.", effects: { trust: -6, bond: -3 }, mark: "seen_by_fernand" }
            } }
        ] },

      { step: 2, id: "cage_talk", age: 15, art: "childLantern", title: "창살 너머의 이야기", requires: ["met_nuk", "clown_ally"],
        body: "다음 해 축제에도 곡예단은 돌아왔다. 짐마차 창살 너머에는 누크라는 또래 아이가 갇혀 있었고, 밤마다 {name}은 창살 곁에 앉아 이야기를 나눴다. 누크는 곡예단이 다음 해 항해 끝에 아이들을 인간 경매장에 넘긴다고 했다.",
        choices: [
          { id: "key", label: "단장의 열쇠를 훔친다", hint: "손이 빨라야 한다",
            check: { stat: "skill", against: 50 }, personality: { freedom: 5, ambition: 3 }, mark: "key",
            outcomes: {
              great: { text: "{name}은 술 취한 단장의 허리춤에서 열쇠 꾸러미를 빼내 진흙에 본을 떴다. 열쇠는 아침이 오기 전에 제자리로 돌아갔고 아무도 눈치채지 못했다.", effects: { skill: 10 }, mark: "key_copy" },
              good: { text: "열쇠는 손에 넣었지만 단장이 잃어버린 것을 알아채고 곡예단 전체를 뒤졌다. {name}은 열쇠를 장터 우물 속에 숨겨야 했다.", effects: { skill: 6, health: -1 } },
              bad: { text: "열쇠 꾸러미가 짤랑거리는 바람에 단장이 눈을 떴다. 도둑이라는 고함에 {name}은 장터 한복판에서 붙잡혀 곡예단 잡일로 벌을 받았다.", effects: { health: -4, trust: -6 }, mark: "seen_by_fernand" }
            } },
          { id: "feed", label: "먹을 것과 쪽지를 몰래 넣어 준다", hint: "작지만 오래 간다",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 7, loyalty: 2 }, mark: "fed",
            outcomes: {
              great: { text: "{name}이 넣어 준 빵 속에는 쪽지가 숨어 있었다. 쪽지는 우리에서 우리로 건너갔고, 갇힌 아이들은 처음으로 서로의 이름을 알게 되었다.", effects: { supplies: -3, friendBond: 10 }, mark: "names_known" },
              good: { text: "빵은 무사히 건넸다. 누크는 반을 떼어 옆 우리의 더 어린 아이에게 넘겼다.", effects: { supplies: -3, friendBond: 7 } },
              bad: { text: "빵 냄새를 맡은 경비견이 짖어 댔다. 짐마차 경비는 두 배가 되었고 누크는 사흘 동안 굶었다.", effects: { supplies: -3, friendBond: -6 } }
            } },
          { id: "promise", label: "반드시 꺼내 주겠다고 약속한다", hint: "약속은 무겁다",
            check: { stat: "friendBond", against: 40 }, personality: { loyalty: 7 }, mark: "promised",
            outcomes: {
              great: { text: "{name}이 새끼손가락을 창살 사이로 내밀자 누크도 손가락을 걸었다. 그 약속을 엿들은 피에트가 어둠 속에서 조용히 고개를 끄덕였다.", effects: { friendBond: 10, trust: 2 }, mark: "clown_in" },
              good: { text: "누크는 믿지 않는 눈치였지만 손가락을 걸었다. 그 약속이 {name}의 잠을 오래 빼앗았다.", effects: { friendBond: 6, health: -2 } },
              bad: { text: "누크는 고개를 돌렸다. 전에도 그런 약속을 한 아이들이 있었고, 다들 다음 해에는 오지 않았다고 했다.", effects: { friendBond: -5, bond: -1 } }
            } }
        ] },
      { step: 2, id: "manifest", age: 15, art: "childChart", title: "짐 목록의 무게", requires: ["manifest", "rumor", "hired"],
        body: "다음 해 축제에 곡예단이 다시 왔을 때, {name}은 항구지기 서랍에서 곡예단의 짐 목록을 보았다. 짐승이라고 적힌 칸의 무게가 하나같이 아이 하나의 무게와 같았다. 항구지기는 단장에게서 받은 돈 봉투를 말없이 서랍에 넣었다.",
        choices: [
          { id: "confront", label: "항구지기에게 따져 묻는다", hint: "어른의 부끄러움",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 4, empathy: 4 }, mark: "pressed_master",
            outcomes: {
              great: { text: "{name}의 말을 끝까지 들은 항구지기는 봉투를 바다에 던졌다. 곡예단 배가 떠나지 못하도록 출항 허가를 미루겠다고 약속했다.", effects: { trust: 10 }, mark: "harbor_held" },
              good: { text: "항구지기는 얼굴을 붉히며 돈을 돌려주겠다고 했다. 하지만 출항을 막을 힘은 없다고 했다.", effects: { trust: 5, bond: 1 } },
              bad: { text: "항구지기는 {name}을 도둑으로 몰아 내쫓았다. 다음 날 단장이 {name}의 집 앞을 지나가며 모자를 벗어 인사했다.", effects: { trust: -6, bond: -3 }, mark: "seen_by_fernand" }
            } },
          { id: "send", label: "짐 목록을 베껴 전보벌레로 알린다", hint: "누가 받을지 모른다",
            check: { stat: "skill", against: 45 }, personality: { caution: 4, freedom: 4 }, mark: "sent_word",
            outcomes: {
              great: { text: "{name}은 짐 목록을 한 자도 틀리지 않고 베껴 이웃 섬 신문사로 알렸다. 며칠 뒤 근해 순찰선 하나가 곡예단의 항로를 묻는 연락을 보내왔다.", effects: { skill: 6, trust: 6 }, mark: "word_reached" },
              good: { text: "전보는 갔지만 답은 없었다. 그래도 베낀 목록은 {name}의 서랍 깊숙이 남았다.", effects: { skill: 4, trust: 1 } },
              bad: { text: "전보벌레가 엉뚱한 곳으로 이어졌다. 받은 쪽은 하필 곡예단의 거래처였고, 수화기 너머에서 낮은 웃음소리가 들렸다.", effects: { trust: -5, health: -3 }, mark: "seen_by_fernand" }
            } },
          { id: "inside", label: "짐꾼으로 들어가 일정을 알아낸다", hint: "단장의 눈이 매섭다",
            check: { stat: "health", against: 45 }, personality: { ambition: 4, caution: 3 }, mark: "inside",
            outcomes: {
              great: { text: "짐을 나르며 {name}은 곡예단이 마지막 공연 다음 날 새벽에 떠난다는 것을 알아냈다. 우리마다 번호 대신 이름표가 붙어 있었고, 가장 구석 우리에는 누크라는 이름이 있었다.", effects: { skill: 4, supplies: 4, friendBond: 4 }, mark: "met_nuk" },
              good: { text: "일정은 알아냈지만 무거운 우리를 나르다 몸살이 나서 사흘을 앓았다.", effects: { supplies: 3, health: -2, skill: 3 } },
              bad: { text: "단장은 처음부터 {name}을 알아보았다. 일부러 엉뚱한 일정을 흘려 듣게 했고, {name}은 그 거짓말을 굳게 믿었다.", effects: { trust: -4, health: -3 }, mark: "false_date" }
            } }
        ] },
      { step: 2, id: "show_night", age: 15, art: "childFestival", title: "외줄 위의 아이",
        body: "다음 해 축제의 마지막 공연에서 외줄을 탄 것은 {name}의 또래쯤 되는 아이였다. 박수가 쏟아질수록 아이의 발목에 걸린 가는 쇠고리가 반짝였다. 공연이 끝나자 아이는 곧장 짐마차로 끌려갔다.",
        choices: [
          { id: "talk", label: "공연이 끝난 뒤 말을 건다", hint: "경비가 있다",
            check: { stat: "friendBond", against: 40 }, personality: { empathy: 6, loyalty: 2 }, mark: "met_late",
            outcomes: {
              great: { text: "{name}이 건넨 꽃 한 송이 아래에는 쪽지가 있었다. 누크라는 이름의 아이는 쪽지를 재빨리 숨기고 처음으로 웃었다.", effects: { friendBond: 10 }, mark: "met_nuk" },
              good: { text: "몇 마디밖에 나누지 못했다. 그래도 누크라는 이름은 알아냈다.", effects: { friendBond: 5 } },
              bad: { text: "말을 걸자마자 경비가 누크를 끌고 갔다. 그날 밤 짐마차에서 채찍 소리가 들렸고, {name}은 귀를 막고 밤을 새웠다.", effects: { friendBond: -4, health: -3 } }
            } },
          { id: "follow", label: "짐마차를 뒤쫓는다", hint: "어둠 속으로",
            check: { stat: "skill", against: 45 }, personality: { freedom: 5, caution: -2 }, mark: "followed",
            outcomes: {
              great: { text: "짐마차는 장터가 아니라 북쪽 후미의 낡은 창고로 향했다. 창고 안에는 우리가 열 개도 넘었다. {name}은 창고 뒷문의 빗장이 썩어 있다는 것까지 보아 두었다.", effects: { skill: 8, trust: 2 }, mark: "rotten_bolt" },
              good: { text: "짐마차가 후미의 창고로 들어가는 것은 보았다. 그 이상 다가가지는 못했다.", effects: { skill: 5 } },
              bad: { text: "어둠 속에서 돌부리에 걸려 비탈을 굴렀다. 짐마차 등불은 멀어지고 {name}은 가시덤불 속에서 아침을 맞았다.", effects: { health: -6, supplies: -2 } }
            } },
          { id: "home", label: "집 어른에게 털어놓는다", hint: "혼자 지기엔 무겁다",
            check: { stat: "bond", against: 40 }, personality: { caution: 5, loyalty: 3 }, mark: "told_home",
            outcomes: {
              great: { text: "집 어른은 {name}의 말을 끝까지 듣고 오래된 전보벌레를 꺼냈다. 젊은 시절 알던 사람들이 아직 바다 위에 있다는 것이었다.", effects: { bond: 10, trust: 2 }, mark: "word_reached" },
              good: { text: "집 어른은 위험하니 끼어들지 말라고 하면서도, 그날부터 밤마다 등불을 들고 장터를 한 바퀴씩 돌았다.", effects: { bond: 6, trust: 1 } },
              bad: { text: "집 어른은 {name}을 방에 가두다시피 했다. 곡예단이 떠나는 날까지 {name}은 창문으로 천막 꼭대기만 바라보았다.", effects: { bond: -4, friendBond: -4 }, mark: "kept_home" }
            } }
        ] },

      { step: 3, id: "breakout", age: 17, art: "dangerPrison", title: "축제의 밤 탈출", requires: ["key_copy", "names_known", "clown_in", "met_nuk", "rotten_bolt", "key", "fed", "promised"],
        body: "곡예단이 마지막으로 들른 축제의 밤, 단장은 새벽에 떠날 채비를 마쳤다. 우리마다 아이들이 숨을 죽였고, 가장 구석 우리의 아이 누크는 창살 너머에서 {name}을 기다렸다. 장터에서는 불꽃놀이가 시작되려 하고 있었다.",
        choices: [
          { id: "open_all", label: "모든 우리를 한꺼번에 연다", hint: "한 명도 남기지 않는다",
            check: { stat: "skill", against: 55 }, personality: { loyalty: 5, empathy: 5 }, mark: "freed_all",
            outcomes: {
              great: { text: "불꽃이 하늘을 가르는 순간 {name}은 우리를 하나씩 열었다. 아이들은 미리 정한 대로 손을 잡고 등대 언덕으로 달렸고, 단장이 돌아왔을 때 짐마차에는 빈 우리와 쇠사슬만 남아 있었다.", effects: { trust: 8, friendBond: 8, skill: 2 }, mark: "all_free" },
              good: { text: "우리 대부분을 열었지만 마지막 하나에서 열쇠가 부러졌다. 그 우리에 남은 아이의 얼굴을 {name}은 오래 잊지 못했다.", effects: { friendBond: 5, trust: 4, health: -2 }, mark: "one_left" },
              bad: { text: "첫 우리를 열기도 전에 경비견들이 몰려왔다. {name}은 개에게 물려 끌려 나왔고 짐마차의 자물쇠는 모두 바뀌었다.", effects: { health: -12, trust: -2 }, mark: "caught" }
            } },
          { id: "nuk_first", label: "누크부터 데리고 달아난다", hint: "한 사람이라도 확실히",
            check: { stat: "health", against: 45 }, personality: { loyalty: 7 }, mark: "freed_nuk",
            outcomes: {
              great: { text: "{name}은 누크의 손을 잡고 등대 뒤 비탈길을 달렸다. 누크는 달아나면서도 경비가 바뀌는 때를 정확히 알려 주었고, 둘은 그 틈으로 돌아가 남은 아이들까지 데리고 나왔다.", effects: { friendBond: 10, trust: 6, health: -2 }, mark: "all_free" },
              good: { text: "누크는 빼냈다. 숨을 헐떡이며 돌아본 짐마차 쪽에서 남은 아이들의 울음소리가 들렸다.", effects: { friendBond: 8, health: -3, trust: -1 }, mark: "others_left" },
              bad: { text: "누크와 함께 달리다 둘 다 붙잡혔다. 단장은 {name}을 놓아주는 대신 누크를 더 깊은 우리에 가두었다.", effects: { health: -6, friendBond: -6 }, mark: "caught" }
            } },
          { id: "fireworks", label: "불꽃놀이 상자로 소동을 일으킨다", hint: "마을이 함께 움직일까",
            check: { stat: "trust", against: 45 }, personality: { freedom: 6, ambition: 2 }, mark: "fireworks",
            outcomes: {
              great: { text: "{name}이 터뜨린 불꽃이 곡예단 천막 위에서 꽃처럼 번지자 마을 사람들이 물 양동이를 들고 몰려왔다. 그 소란 속에서 누군가 짐마차 문을 열었고, 갇혀 있던 아이들이 사람들 사이로 흩어졌다.", effects: { trust: 8, friendBond: 6 }, mark: "all_free" },
              good: { text: "소동은 일어났지만 천막 하나를 태웠다. 그 틈에 아이 몇은 달아났고, {name}은 천막 값을 물어 주느라 일 년을 일했다.", effects: { supplies: -6, trust: 4, friendBond: 6 }, mark: "others_left" },
              bad: { text: "불꽃 상자가 엉뚱하게 장터 쪽으로 터졌다. 사람들은 비명을 지르며 흩어졌고, 그 혼란을 틈타 곡예단은 예정보다 일찍 배를 띄웠다.", effects: { trust: -8, health: -4 }, mark: "sailed_away" }
            } }
        ] },
      { step: 3, id: "exposure", age: 17, art: "childFestival", title: "막이 오른 진실", requires: ["harbor_held", "word_reached", "pressed_master", "sent_word", "told_home", "inside"],
        body: "곡예단의 마지막 공연 날, 장터에는 {home} 사람들이 빼곡히 모였다. {name}의 품에는 그동안 모은 증거가 있었다. 단장 페르낭이 무대에 올라 오늘 밤 특별한 볼거리가 있다고 외쳤다.",
        choices: [
          { id: "curtain", label: "무대 뒤 천막을 끊어 떨어뜨린다", hint: "모두가 보게 한다",
            check: { stat: "health", against: 50 }, personality: { freedom: 6, ambition: 3 }, mark: "unveiled",
            outcomes: {
              great: { text: "{name}이 밧줄을 끊자 무대 뒤 천막이 통째로 내려앉았다. 조명 아래 드러난 것은 쇠창살 짐마차였다. 사람들이 하나둘 창살로 다가가 문을 뜯었고, 단장의 웃음이 처음으로 굳었다.", effects: { trust: 10, friendBond: 4 }, mark: "all_free" },
              good: { text: "천막은 반만 떨어졌지만 그것으로 충분했다. 단장은 공연을 멈추고 혼자 배로 달아났고, 남은 짐마차는 마을 사람들이 열었다.", effects: { trust: 6, health: -2, friendBond: 2 }, mark: "fernand_fled" },
              bad: { text: "밧줄에 매달린 채 {name}이 무대 한가운데로 날아들었다. 관객들은 최고의 묘기라며 박수를 쳤고, 단장은 그 틈에 짐마차를 배로 옮겼다.", effects: { health: -6, trust: -4 }, mark: "sailed_away" }
            } },
          { id: "proof", label: "증거를 들고 무대에 오른다", hint: "목소리가 떨릴 것이다",
            check: { stat: "trust", against: 50 }, personality: { loyalty: 5, empathy: 4 }, mark: "proof",
            outcomes: {
              great: { text: "{name}이 모은 증거를 하나씩 내보이자 웃음소리가 하나씩 꺼졌다. 마지막 증거가 나왔을 때 항구지기가 무대에 올라 출항 허가를 찢었다. 단장 일당은 그 자리에서 묶였다.", effects: { trust: 12, bond: 2 }, mark: "all_free" },
              good: { text: "사람들은 반신반의했지만 짐마차를 열어 보자는 데는 동의했다. 아이들은 풀려났고, 그사이 단장은 몰래 빠져나갔다.", effects: { trust: 5, friendBond: 2 }, mark: "fernand_fled" },
              bad: { text: "단장은 {name}의 증거를 웃음거리로 만들었다. 아이가 꾸민 이야기에 박수를 쳐 달라는 말에 관객들은 정말로 박수를 쳤다.", effects: { trust: -8, friendBond: -3 }, mark: "sailed_away" }
            } },
          { id: "chain", label: "곡예단 배를 부두에 묶어 버린다", hint: "도망만은 막는다",
            check: { stat: "skill", against: 45 }, personality: { caution: 5, loyalty: 3 }, mark: "chained",
            outcomes: {
              great: { text: "{name}은 곡예단 배의 닻줄을 부두 쇠기둥에 겹겹이 매듭지어 묶었다. 공연이 들통나 달아나려던 단장의 배는 한 뼘도 움직이지 못했다.", effects: { skill: 8, trust: 6 }, mark: "all_free" },
              good: { text: "배는 묶었지만 단장은 작은 보트로 혼자 달아났다. 짐마차와 아이들은 부두에 남았다.", effects: { skill: 3, trust: 4 }, mark: "fernand_fled" },
              bad: { text: "매듭이 서툴러 배가 출항하며 부두 쇠기둥까지 뽑아 갔다. 단장은 배 꼬리에서 {name}에게 손을 흔들었다.", effects: { trust: -6, supplies: -4 }, mark: "sailed_away" }
            } }
        ] },
      { step: 3, id: "departure", age: 17, art: "harbor", title: "새벽의 출항",
        body: "곡예단이 떠나는 새벽, 짐마차들이 하나씩 배에 실렸다. {name}에게 남은 것은 짐마차 틈으로 본 아이의 눈빛뿐이었다. 이번에 배가 떠나면 그 아이는 다시는 축제에 돌아오지 않을 것이었다.",
        choices: [
          { id: "stowaway", label: "짐마차에 몰래 올라탄다", hint: "돌아올 길은 없다",
            check: { stat: "health", against: 50 }, personality: { freedom: 7, loyalty: 2 }, mark: "stowaway",
            outcomes: {
              great: { text: "짐마차에 숨어 배에 오른 {name}은 다음 항구에 닿기 전날 밤, 우리 문을 모두 열고 아이들과 구명보트를 내렸다. 사흘을 표류한 끝에 이웃 섬 어부들이 그 보트를 찾아냈다.", effects: { health: -4, friendBond: 10, trust: 6 }, mark: "all_free" },
              good: { text: "배에 오르는 데는 성공했지만 곧 들켰다. 단장은 {name}을 다음 섬에 내려놓았고, {name}은 누크라는 이름 하나만 알아낸 채 몇 달 만에 집으로 돌아왔다.", effects: { health: -4, friendBond: 5, bond: 2 } },
              bad: { text: "짐마차 바닥이 내려앉아 {name}은 부두로 굴러떨어졌다. 배는 떠났고, 바다에 빠진 {name}을 건진 것은 아침 고기잡이배였다.", effects: { health: -8, bond: -3 }, mark: "sailed_away" }
            } },
          { id: "rope", label: "창살 사이로 줄칼을 던져 준다", hint: "던질 기회는 한 번",
            check: { stat: "skill", against: 40 }, personality: { empathy: 5, freedom: 3 }, mark: "rope",
            outcomes: {
              great: { text: "줄칼은 정확히 창살 사이로 들어갔다. 몇 달 뒤 먼 항구에서 곡예단 짐마차가 텅 빈 채 발견되었다는 소문이 {home}까지 들려왔다.", effects: { friendBond: 8, skill: 4 }, mark: "file_worked" },
              good: { text: "줄칼은 들어갔지만 그 뒤의 일은 알 수 없었다. {name}은 해마다 축제 철이면 소식을 기다리며 바다를 보았다.", effects: { friendBond: 4, skill: 2 } },
              bad: { text: "줄칼이 창살에 맞고 튕겨 경비의 발치에 떨어졌다. 단장은 줄칼을 주워 기념품이라며 {name}에게 던져 돌려주었다.", effects: { friendBond: -4, trust: -3 }, mark: "sailed_away" }
            } },
          { id: "remember", label: "배 이름과 단장의 얼굴을 새겨 둔다", hint: "지금은 힘이 없다",
            check: { stat: "skill", against: 35 }, personality: { caution: 6, ambition: 2 }, mark: "remembered",
            outcomes: {
              great: { text: "{name}은 배 이름과 깃발 무늬, 단장의 버릇까지 그림으로 그려 두었다. 그 그림은 해마다 축제에 오는 곡예단들과 맞춰 보는 장부가 되었다.", effects: { skill: 8, trust: 2 } },
              good: { text: "배는 떠났다. 그날의 무력감은 {name}의 마음 깊이 단단한 돌처럼 남았다.", effects: { skill: 3, bond: 2 } },
              bad: { text: "떠나는 배를 바라만 본 일은 오래도록 {name}을 괴롭혔다. 축제 철이면 밤마다 쇠사슬 소리를 꿈에서 들었다.", effects: { health: -5, friendBond: -3 } }
            } }
        ] },

      { step: 4, id: "nuk_meet", age: 26, art: "harbor", title: "낯선 항구의 곡예사", requires: ["all_free", "freed_nuk", "file_worked"],
        body: "세월이 흐른 뒤 어느 항구의 장터에서 {name}은 외줄 위의 곡예사를 보았다. 발목에 쇠고리 대신 붉은 끈을 맨 곡예사가 줄 위에서 {name}을 알아보고 공중제비를 돌았다. 어린 날 짐마차에 갇혀 있던 아이, 누크였다.",
        choices: [
          { id: "cheer", label: "앞자리에서 가장 크게 박수 친다", hint: "그날 밤의 빚",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 5, loyalty: 3 },
            outcomes: {
              great: { text: "공연이 끝나자 누크는 무대 위로 {name}을 불러 세웠다. 이 사람이 없었다면 이 줄 위에 서지 못했을 거라는 말에 장터가 박수로 떠나갈 듯했다.", effects: { friendBond: 10, trust: 4 } },
              good: { text: "공연 뒤 둘은 장터 구석에서 국수를 나눠 먹었다. 누크는 그날 우리를 나온 아이들이 지금 어디서 무엇을 하는지 하나하나 들려주었다.", effects: { friendBond: 6 } },
              bad: { text: "너무 크게 박수 치다 앞사람의 모자를 쳐 날려 버렸다. 시비가 붙어 공연이 끝날 때까지 장터 경비에게 붙들려 있었다.", effects: { health: -3, trust: -3 } }
            } },
          { id: "news", label: "페르낭의 소식을 묻는다", hint: "끝나지 않은 일",
            check: { stat: "skill", against: 40 }, personality: { loyalty: 4, caution: 3 },
            outcomes: {
              great: { text: "누크는 단장이 이름을 바꾸어 다른 바다에서 같은 짓을 한다고 했다. 둘이 그 곡예단의 항로를 아는 사람들에게 모두 알리자, 몇 달 뒤 그 배가 붙잡혔다는 소식이 왔다.", effects: { trust: 8, skill: 4 } },
              good: { text: "단장의 소식은 끊긴 지 오래라고 했다. 대신 누크는 혹시 모를 날을 위해 단장의 얼굴을 그린 그림을 {name}에게 건넸다.", effects: { skill: 3, friendBond: 3 } },
              bad: { text: "그 이름을 꺼내자 누크의 얼굴이 굳었다. 아직은 듣고 싶지 않다는 말에 {name}은 남은 술잔만 만지작거렸다.", effects: { friendBond: -4, bond: -1 } }
            } }
        ] },
      { step: 4, id: "new_name", age: 26, art: "childFestival", title: "이름을 바꾼 곡예단", requires: ["sailed_away", "caught", "fernand_fled", "remembered", "others_left", "one_left"],
        body: "어느 항구에 무지갯빛 곡예단의 포스터가 붙었다. 이름은 달랐지만 포스터 구석의 단장은 틀림없이 페르낭이었다. 바로 옆에는 사흘 뒤 순찰선이 입항한다는 공고가 나란히 붙어 있었다.",
        choices: [
          { id: "evidence", label: "순찰선이 오기 전에 증거를 모은다", hint: "이번에는 놓치지 않는다",
            check: { stat: "skill", against: 50 }, personality: { loyalty: 5, caution: 3 },
            outcomes: {
              great: { text: "{name}은 천막 뒤 짐마차의 위치와 경비가 바뀌는 때까지 적어 두었다. 순찰선이 들어오던 날 증거 꾸러미가 먼저 닿았고, 페르낭은 무대 위에서 그대로 묶였다.", effects: { trust: 10, skill: 4 } },
              good: { text: "증거는 모았지만 단장은 낌새를 채고 하루 먼저 떠났다. 그래도 짐마차 두 대가 항구에 남겨졌고, 그 안의 아이들은 집으로 돌아갔다.", effects: { trust: 5, skill: 2 } },
              bad: { text: "증거를 모으던 중 단장과 정면으로 마주쳤다. 페르낭은 {name}을 알아보고 오래된 축제 이야기를 하며 웃었다. 그날 밤 묵던 여관에 불이 났다.", effects: { health: -8, supplies: -5 } }
            } },
          { id: "face", label: "공연장에 들어가 단장 앞에 선다", hint: "오래 기다린 대면",
            check: { stat: "health", against: 45 }, personality: { ambition: 5, freedom: 4 },
            outcomes: {
              great: { text: "{name}이 객석에서 일어나 짐마차 이야기를 하자 단장의 손에서 확성 전보벌레가 떨어졌다. 관객들이 천막 뒤로 몰려갔고 곡예단은 그날로 끝났다.", effects: { trust: 8, friendBond: 4 } },
              good: { text: "단장은 {name}을 미친 사람으로 몰았지만 관객 몇은 의심을 품고 천막 뒤를 살피러 갔다. 그 의심이 다음 항구까지 곡예단을 따라갔다.", effects: { trust: 5, health: -1 } },
              bad: { text: "차력사 둘에게 들려 공연장 밖 진흙탕에 던져졌다. 관객들은 그것도 공연의 일부인 줄 알았다.", effects: { health: -8, trust: -3 } }
            } }
        ] },
      { step: 4, id: "thanks", age: 26, art: "legacy", title: "축제 철의 편지",
        body: "어디에 있든 축제 철이면 {name}은 곡예단 포스터 앞에서 걸음을 멈췄다. 그해에는 {home}의 옛집을 거쳐 온 편지가 한 통 닿았다. 낯선 항구의 소인 아래, 짐마차에 갇혀 있던 아이라며 누크라는 서명과 함께 짧은 감사 인사가 적혀 있었다.",
        choices: [
          { id: "reply", label: "답장을 쓴다", hint: "할 말이 너무 많다",
            check: { stat: "friendBond", against: 35 }, personality: { empathy: 5, loyalty: 3 },
            outcomes: {
              great: { text: "답장은 몇 번이나 고쳐 쓴 끝에 한 줄이 되었다. 살아 있어 줘서 고맙다는 말이었다. 이듬해 누크는 {home}의 축제에 직접 와서 외줄을 탔다.", effects: { friendBond: 10, trust: 2 } },
              good: { text: "답장을 보냈지만 누크가 머무는 곳은 자주 바뀌었다. 편지는 몇 달을 돌아 겨우 닿았다고 했다.", effects: { friendBond: 5 } },
              bad: { text: "어떻게 써야 할지 몰라 편지를 서랍에 넣어 두었다. 서랍은 해마다 축제 철이면 조금 더 무거워졌다.", effects: { friendBond: -4, bond: -1 } }
            } },
          { id: "stage", label: "머무는 곳에 작은 무대를 연다", hint: "이번엔 자유로운 곡예",
            check: { stat: "supplies", against: 40 }, personality: { freedom: 5, empathy: 3 },
            outcomes: {
              great: { text: "{name}이 연 작은 무대에는 갈 곳 없던 떠돌이 재주꾼들이 모였다. 창살도 쇠사슬도 없는 무대에서 아이들이 마음껏 웃었다.", effects: { trust: 8, supplies: -2, friendBond: 4 } },
              good: { text: "무대는 작았고 돈은 남지 않았다. 그래도 그해 가장 큰 웃음은 그곳에서 나왔다.", effects: { trust: 5, supplies: -2 } },
              bad: { text: "준비한 천막이 첫날 바람에 날아갔다. 구경꾼들은 그것이 날아가는 묘기인 줄 알고 박수를 쳤다.", effects: { supplies: -6, trust: -1 } }
            } }
        ] }
    ]
  }
];
