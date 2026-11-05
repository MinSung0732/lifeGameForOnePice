// Youth fates, set B: a bounty hunter's errand-runner, a first love under the lighthouse, a smuggler's ledger.
export default [
  {
    key: "hunter_partner", title: "현상금 사냥꾼의 조수",
    legacy: {
      default: "돈이 걸린 얼굴 뒤에도 사람이 있다는 것을, 술 냄새 나는 사냥꾼 곁에서 배웠다.",
      sold_miro: "한 번 받아 쥔 몫의 무게는 평생 주머니 속에서 줄어들지 않았다.",
      testified: "수배서보다 진실이 먼저라고 말한 그날의 목소리가 평생의 기준이 되었다.",
      miro_escaped: "밤배 하나를 밀어 준 손이, 훗날 누군가의 인생 전체를 밀어 주었다는 걸 알았다.",
      saved_hasker: "엉망인 어른도 버리지 않는 법을, 피투성이 골목에서 몸으로 익혔다.",
      dealt: "누구와도 거래할 수 있다는 자신감과, 그 대가를 잊지 못하는 밤이 함께 남았다."
    },
    chapters: [
      { step: 1, id: "hired", age: 14, art: "harbor", title: "수배서 한 장",
        body: "부두 술집 앞에 해스커라는 현상금 사냥꾼이 나타났다. 외투는 기워 입었고 칼집은 끈으로 묶여 있었지만, 벽에 붙인 수배서만은 새것이었다. 해스커는 섬 아이 하나를 골목 안내꾼으로 쓰겠다며 동전을 튕겼고, 그 동전이 {name}의 발치에 굴러왔다.",
        choices: [
          { id: "follow", label: "동전을 줍고 따라나선다", hint: "골목은 눈이 빠른 쪽 편이다",
            check: { stat: "skill", against: 40 }, personality: { freedom: 5, ambition: 3 }, mark: "followed",
            outcomes: {
              great: { text: "{name}은 수배서 속 얼굴이 사흘 전 장터에서 생선 대신 빵만 사 가던 사람이라는 걸 기억해 냈다. 해스커는 휘파람을 불며 처음으로 이름을 물었다.", effects: { skill: 6, supplies: 4 }, mark: "sharp_eye" },
              good: { text: "하루 종일 골목을 돌며 수배서를 붙였다. 다리는 퉁퉁 부었지만 해스커가 사 준 생선 꼬치는 지금껏 먹은 것 중 가장 짰고 가장 맛있었다.", effects: { skill: 3, supplies: 2 } },
              bad: { text: "바람에 날아간 수배서를 쫓다가 {name}은 생선 통에 머리부터 처박혔다. 해스커는 배를 잡고 웃더니 그래도 내일 또 오라고 했다.", effects: { health: -4, trust: -3 }, mark: "clumsy" }
            } },
          { id: "haggle", label: "몫부터 정하자고 따진다", hint: "어른과 셈하는 건 위험하다",
            check: { stat: "trust", against: 35 }, personality: { ambition: 6, caution: 2 }, mark: "followed",
            outcomes: {
              great: { text: "해스커는 어이없다는 얼굴로 술집 냅킨에 몫을 적고 서명까지 했다. 냅킨 계약서는 {name}의 베개 밑에서 몇 년이나 살아남았다.", effects: { supplies: 6, trust: 4 }, mark: "contract" },
              good: { text: "십분의 일이라는 말에 한참 실랑이를 벌였다. 결국 밥값은 해스커가 낸다는 조건으로 손을 잡았다.", effects: { supplies: 4 } },
              bad: { text: "너무 세게 나간 탓에 해스커는 다른 아이를 고용해 버렸다. 그 아이가 길을 잃고 울며 돌아온 다음에야 {name}에게 다시 차례가 왔다.", effects: { trust: -4, friendBond: -3 } }
            } },
          { id: "ask_home", label: "집에 가서 먼저 묻는다", hint: "어른의 말이 늘 지루하진 않다",
            check: { stat: "bond", against: 40 }, personality: { caution: 6, loyalty: 3 },
            outcomes: {
              great: { text: "양육자는 혀를 차면서도, 해스커가 예전에 섬의 아이를 해적선에서 꺼내 온 적이 있다는 이야기를 들려주었다. {name}은 조건 하나를 달고 일을 받았다. 해 지기 전 귀가.", effects: { bond: 6, trust: 3 }, mark: "followed" },
              good: { text: "허락은 반쯤만 받았다. 저녁마다 그날 본 것을 낱낱이 말하는 조건이었다.", effects: { bond: 3 }, mark: "followed" },
              bad: { text: "이야기를 꺼내자마자 집안이 뒤집혔다. 결국 {name}은 몰래 창문으로 빠져나가야 했고, 그 일로 한동안 집 안 공기가 서늘했다.", effects: { bond: -6 }, mark: "followed" }
            } }
        ] },

      { step: 2, id: "innocent", age: 16, art: "childInlet", requires: ["sharp_eye", "contract"], title: "동굴 속의 수배범",
        body: "{name}은 해스커보다 먼저 수배범 미로를 찾아냈다. 썰물 때만 드러나는 후미 동굴에서 미로는 떨리는 손으로 젖은 편지 한 통을 내밀었다. 귀족의 배에서 사라진 보석은 그 귀족이 직접 팔아 치웠고, 도둑 누명은 하인이던 미로에게 씌워졌다는 내용이었다.",
        choices: [
          { id: "hide", label: "미로를 동굴 깊숙이 숨긴다", hint: "물때를 아는 쪽이 이긴다",
            check: { stat: "skill", against: 45 }, personality: { empathy: 7, freedom: 3 }, mark: "spared",
            outcomes: {
              great: { text: "{name}은 물이 차오르면 입구가 잠기는 안쪽 굴로 미로를 옮기고, 해스커에게는 엉뚱한 섬 반대편을 가리켰다. 해스커는 하루를 허탕 치고도 눈치채지 못했다.", effects: { skill: 6, friendBond: 5 }, mark: "hid_miro" },
              good: { text: "숨기는 데는 성공했지만 밤마다 빵을 나르느라 {name}의 용돈이 바닥났다. 미로는 그 빵을 반씩 남겨 두었다가 돌려주곤 했다.", effects: { supplies: -3, friendBond: 6 }, mark: "hid_miro" },
              bad: { text: "물때를 잘못 읽었다. 둘은 목까지 차오른 바닷물 속에서 밤을 새웠고, 미로는 열병을 앓았다. 그래도 아무도 찾아오지 않았다.", effects: { health: -8, friendBond: 3 }, mark: "hid_miro" }
            } },
          { id: "tell", label: "편지를 들고 해스커에게 간다", hint: "그 어른을 믿어도 될까",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 6, empathy: 3 }, mark: "told_hasker",
            outcomes: {
              great: { text: "해스커는 편지를 세 번 읽고 술잔을 엎었다. 사냥꾼 생활 이십 년에 처음으로 수배서를 반으로 접었다며, {name}의 머리를 거칠게 헝클었다.", effects: { trust: 6, friendBond: 4 }, mark: "spared" },
              good: { text: "해스커는 한참 말이 없더니 생각할 시간을 달라고 했다. 그 밤 술집에서는 해스커의 노래가 유난히 길게 들렸다.", effects: { trust: 3 } },
              bad: { text: "해스커는 편지를 빼앗아 품에 넣고는 이건 어른 일이라고 잘라 말했다. 다음 날 미로가 숨은 동굴 앞에 해스커의 발자국이 찍혀 있었다.", effects: { trust: -5, friendBond: -4 }, mark: "captured" }
            } },
          { id: "sell", label: "미로의 위치를 해스커에게 넘긴다", hint: "주머니가 무거워진다",
            check: { stat: "supplies", against: 30 }, personality: { ambition: 8, empathy: -6 }, mark: "sold_miro",
            outcomes: {
              great: { text: "{name}은 편지를 몰래 챙긴 채 미로의 위치를 넘겼다. 몫은 두둑했고, 편지는 언젠가 쓸모가 있을 것 같아 서랍 깊숙이 넣었다.", effects: { supplies: 10 }, mark: "captured" },
              good: { text: "미로는 묶여 가면서도 원망하는 말 한마디 하지 않았다. 그게 더 아팠다. 몫으로 받은 금화는 쓸 때마다 이상하게 차가웠다.", effects: { supplies: 6, friendBond: -3 }, mark: "captured" },
              bad: { text: "미로가 끌려가며 {name}의 이름을 외쳤고, 장터 사람들이 그 소리를 다 들었다. 금화보다 수군거림이 오래 남았다.", effects: { supplies: 4, trust: -10 }, mark: "captured" }
            } }
        ] },
      { step: 2, id: "chase", age: 16, art: "childMarket", title: "장터 지붕 위의 추격",
        body: "장날 한복판에서 수배범 미로가 정체를 들켰다. 해스커가 고함을 지르며 뛰어들자 미로는 천막 지붕 위로 뛰어올랐고, 해스커는 {name}에게 반대편 골목을 막으라고 소리쳤다. 지붕 위에서 돌아본 미로의 얼굴은 도둑이라기보다 길 잃은 아이 같았다.",
        choices: [
          { id: "block", label: "골목 끝을 막아선다", hint: "몸으로 부딪치게 된다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 6, ambition: 3 }, mark: "captured",
            outcomes: {
              great: { text: "{name}은 빨랫줄을 잡아당겨 미로를 사과 수레 위로 떨어뜨렸다. 장터가 박수를 쳤고, 미로의 품에서 굴러 나온 편지 한 통은 아무도 보지 못하게 주워 넣었다.", effects: { skill: 5, trust: 5 }, mark: "kept_letter" },
              good: { text: "부딪친 순간 둘 다 생선 좌판 위로 나뒹굴었다. 미로는 잡혔고, {name}은 일주일 내내 비린내를 풍겼다.", effects: { trust: 3, health: -2, supplies: 4 } },
              bad: { text: "미로를 붙잡긴 했는데 하필 그 위로 해스커가 덮쳤다. 셋이 한데 엉켜 굴렀고 {name}의 팔목이 시큰하게 꺾였다.", effects: { health: -9 } }
            } },
          { id: "let_slip", label: "일부러 길을 비켜 준다", hint: "눈빛 하나면 충분하다",
            check: { stat: "skill", against: 40 }, personality: { empathy: 7, freedom: 4 }, mark: "spared",
            outcomes: {
              great: { text: "{name}은 넘어지는 척하며 미로에게 등대 쪽 샛길을 손짓했다. 해스커는 투덜대며 {name}을 일으켜 세웠고, 아무것도 눈치채지 못했다.", effects: { friendBond: 6, skill: 4 }, mark: "let_go" },
              good: { text: "미로는 빠져나갔지만 해스커의 눈썹이 한쪽만 올라갔다. 그날 밤 해스커는 아무 말 없이 {name}의 몫을 절반으로 깎았다.", effects: { friendBond: 4, supplies: -2 }, mark: "let_go" },
              bad: { text: "너무 티 나게 비켜선 탓에 해스커가 모든 걸 봤다. 미로는 도망쳤고, 해스커는 처음으로 {name}을 차가운 눈으로 바라보았다.", effects: { trust: -6, friendBond: -2 }, mark: "suspected" }
            } },
          { id: "shout", label: "멈추라고 크게 외친다", hint: "장터가 전부 돌아본다",
            check: { stat: "trust", against: 40 }, personality: { caution: 4, empathy: 4 },
            outcomes: {
              great: { text: "{name}의 외침에 장터 사람들이 둘 사이를 가로막았다. 숨을 고른 미로가 억울하다며 편지 한 장을 흔들었고, 해스커는 칼을 집어넣고 그 편지를 받아 들었다.", effects: { trust: 7, friendBond: 3 }, mark: "spared" },
              good: { text: "모두가 멈춘 틈에 미로는 사라졌다. 해스커는 혀를 찼지만 {name}에게 화를 내지는 않았다.", effects: { trust: 3 }, mark: "let_go" },
              bad: { text: "외침에 놀란 미로가 발을 헛디뎌 지붕에서 떨어졌다. 미로는 다리를 절며 끌려갔고, {name}은 그 소리를 오래 잊지 못했다.", effects: { trust: -3, friendBond: -6 }, mark: "captured" }
            } }
        ] },

      { step: 3, id: "payout", age: 18, art: "dangerPrison", requires: ["captured"], title: "피 묻은 몫",
        body: "미로가 넘겨지고 두 해가 지나서야 귀족은 몫을 치르겠다며 해스커와 {name}을 창고로 불렀다. 들어서자마자 귀족의 사병들이 문을 잠갔다. 귀족은 웃으며 증인은 적을수록 좋다고 했다. 해스커가 {name}을 등 뒤로 밀며 칼집 끈을 풀었고, 창고 구석 쇠창살 안에서 야윈 미로가 이쪽을 보고 있었다.",
        choices: [
          { id: "stand", label: "해스커 곁에서 버틴다", hint: "오래 맞게 될지도 모른다",
            check: { stat: "health", against: 50 }, personality: { loyalty: 8 }, mark: "stood_hasker",
            outcomes: {
              great: { text: "{name}은 등불을 걷어차 창고를 어둠으로 만들었다. 해스커가 그 틈에 사병들을 쓰러뜨렸고, 둘은 쇠창살을 부수어 미로까지 데리고 빠져나왔다.", effects: { health: 4, skill: 6, friendBond: 4 }, mark: "saved_hasker" },
              good: { text: "둘은 문을 부수고 빠져나왔다. 몫은 한 푼도 못 받았고 해스커는 이를 두 개 잃었지만, 부두에서 둘은 미친 듯이 웃었다.", effects: { health: -3, friendBond: 7 }, mark: "saved_hasker" },
              bad: { text: "{name}은 첫 주먹에 쓰러졌다. 깨어 보니 해스커가 업고 달리고 있었고, 미로는 여전히 창고 안에 있었다.", effects: { health: -12, friendBond: 3 } }
            } },
          { id: "testify", label: "해군 지부로 달려가 고발한다", hint: "누가 귀를 기울일까",
            check: { stat: "trust", against: 50 }, personality: { empathy: 6, caution: 3 }, mark: "testified",
            outcomes: {
              great: { text: "{name}은 창고 환기창으로 빠져나가 해군 지부 문을 두드렸다. 마침 순찰 중이던 원칙주의 중위가 창고를 덮쳤고, 미로의 누명은 그 자리에서 벗겨졌다.", effects: { trust: 10, friendBond: 4 }, mark: "miro_escaped" },
              good: { text: "해군은 늦게 왔지만 왔다. 귀족은 빠져나갔어도 미로는 풀려났고, 해스커는 멍투성이 얼굴로 늦었다고 투덜거렸다.", effects: { trust: 5, health: -2 } },
              bad: { text: "지부 당직은 귀족의 이름을 듣자마자 서류를 덮었다. {name}이 창고로 돌아왔을 때는 이미 모두 사라진 뒤였고, 피 묻은 동전 하나만 바닥에 남아 있었다.", effects: { trust: -6, friendBond: -5 } }
            } },
          { id: "grab", label: "몫을 낚아채고 달아난다", hint: "의리보다 빠른 발",
            check: { stat: "skill", against: 45 }, personality: { ambition: 7, loyalty: -6, caution: 3 }, mark: "took_cut",
            outcomes: {
              great: { text: "{name}은 금화 자루를 들고 창문으로 뛰어내렸다. 사병들이 쫓아오는 사이 해스커는 혼자 빠져나갔고, 뒤에서 해스커의 웃음인지 욕인지 모를 소리가 들렸다.", effects: { supplies: 12, friendBond: -4 } },
              good: { text: "자루를 반쯤 흘리며 도망쳤다. 남은 금화로는 집 지붕을 고쳤지만, 해스커는 그 뒤로 섬에 오지 않았다.", effects: { supplies: 7, friendBond: -3 } },
              bad: { text: "자루 끈이 창틀에 걸렸다. {name}은 거꾸로 매달린 채 금화를 비처럼 쏟았고, 사병들에게 실컷 두들겨 맞은 뒤 빈손으로 쫓겨났다.", effects: { health: -9, trust: -4 } }
            } }
        ] },
      { step: 3, id: "hooks", age: 18, art: "rescue", requires: ["spared", "hid_miro", "let_go"], title: "검은 갈고리단",
        body: "미로가 잡히지 않자 귀족은 더 질 나쁜 사냥꾼 패거리를 불렀다. 검은 갈고리단은 도착한 첫날 해스커를 골목에서 반쯤 죽여 놓고, 미로를 숨긴 놈을 찾는다며 집집마다 문을 걷어찼다. 해스커는 피를 흘리며 {name}에게 미로를 데리고 섬을 뜨라고 속삭였다.",
        choices: [
          { id: "boat", label: "미로를 밤배에 태운다", hint: "물때와 등불을 읽어야 한다",
            check: { stat: "skill", against: 50 }, personality: { empathy: 6, freedom: 5 }, mark: "miro_escaped",
            outcomes: {
              great: { text: "{name}은 등대 그림자를 따라 고깃배를 밀었다. 미로는 배 위에서 품에 지녀 온 편지를 {name}에게 건네며 언젠가 이걸 세상에 보여 달라고 했다. 갈고리단은 빈 부두에 대고 고함만 질렀다.", effects: { skill: 7, friendBond: 6 }, mark: "kept_letter" },
              good: { text: "배는 떠났지만 갈고리단의 화살 하나가 {name}의 어깨를 스쳤다. 상처는 남았고, 미로가 탄 배의 불빛은 수평선 너머로 무사히 사라졌다.", effects: { health: -4, friendBond: 8 } },
              bad: { text: "배는 떠났지만 {name}은 부두에서 붙잡혔다. 갈고리단은 밤새 미로의 행방을 물었고, {name}은 끝까지 엉뚱한 섬 이름만 댔다.", effects: { health: -12, trust: 4 } }
            } },
          { id: "rescue", label: "쓰러진 해스커부터 구한다", hint: "골목은 이미 포위됐다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 8, empathy: 3 }, mark: "saved_hasker",
            outcomes: {
              great: { text: "{name}은 해스커를 생선 수레에 눕히고 그물로 덮은 채 장터를 가로질렀다. 갈고리단이 비린내에 코를 막는 사이 진료소 뒷문이 열렸다.", effects: { friendBond: 8, trust: 4 } },
              good: { text: "해스커는 살았다. 진료소 침대에서 깨어난 해스커는 미로는 어떻게 됐냐고 먼저 물었고, {name}은 아직 모른다고 답할 수밖에 없었다.", effects: { friendBond: 5, supplies: -3 } },
              bad: { text: "둘 다 갈고리단에게 붙잡혔다. 해스커는 자기가 다 꾸민 일이라며 {name}을 감쌌고, 그 대가로 섬을 떠나는 배에 묶여 실려 갔다.", effects: { health: -8, friendBond: -4 } }
            } },
          { id: "deal", label: "갈고리단과 거래를 튼다", hint: "말은 칼보다 싸게 먹힌다",
            check: { stat: "supplies", against: 45 }, personality: { ambition: 6, caution: 5 }, mark: "dealt",
            outcomes: {
              great: { text: "{name}은 귀족이 갈고리단에게 줄 돈을 깎으려 한다는 소문을 지어내 흘렸다. 갈고리단은 귀족의 배를 털고 떠났고, 미로의 수배서는 그 혼란 속에 흐지부지됐다.", effects: { supplies: 6, trust: 5 }, mark: "miro_escaped" },
              good: { text: "모아 둔 돈을 몽땅 내주고 미로가 이미 섬을 떠났다는 거짓말을 샀다. 갈고리단은 침을 뱉고 떠났다.", effects: { supplies: -6, friendBond: 7 } },
              bad: { text: "갈고리단은 돈만 챙기고 약속을 뭉갰다. 미로는 결국 붙잡혔고, {name}은 그 배가 떠나는 걸 언덕 위에서 지켜보기만 했다.", effects: { supplies: -6, friendBond: -6 } }
            } }
        ] },
      { step: 3, id: "betrayal", age: 18, art: "lifeStorm", title: "팔려 간 이름",
        body: "해스커가 머뭇거리는 사이, 귀족 쪽에서 먼저 손을 썼다. 해스커가 빚 때문에 미로와 엮인 아이의 이름을 귀족에게 팔았다는 소문이 돌았고, 그날 밤부터 {name}의 집 앞에 낯선 사내들이 서성거렸다. 술집 구석의 해스커는 눈을 마주치지 않았다.",
        choices: [
          { id: "confront", label: "술집으로 가서 따진다", hint: "멱살을 잡을 수도 있다",
            check: { stat: "friendBond", against: 45 }, personality: { loyalty: 5, freedom: 4 },
            outcomes: {
              great: { text: "해스커는 술잔을 내려놓고 털어놓았다. 이름을 판 게 아니라 판 척해서 사내들을 섬에 묶어 둔 거였다. 그사이 해스커는 미로를 이미 다른 섬으로 빼돌려 놓았다.", effects: { friendBond: 8, trust: 4 }, mark: "forgave_hasker" },
              good: { text: "해스커는 사실이라고 했다. 대신 빚을 다 갚으면 그 사내들을 제 손으로 쫓아내겠다고 했고, 일주일 뒤 정말로 그렇게 했다.", effects: { friendBond: 3, health: -2 }, mark: "forgave_hasker" },
              bad: { text: "{name}의 주먹이 먼저 나갔다. 해스커는 맞고만 있다가 아무 말 없이 술집을 나섰고, 다음 날 아침 해스커의 배는 부두에서 사라져 있었다.", effects: { friendBond: -8, trust: -3 } }
            } },
          { id: "hide_home", label: "집에 틀어박혀 버틴다", hint: "집이 가장 단단한 성이다",
            check: { stat: "bond", against: 40 }, personality: { caution: 7, loyalty: 3 },
            outcomes: {
              great: { text: "양육자는 대문을 걸어 잠그고 동네 어른들을 불러 모았다. 사내들은 몽둥이를 든 할머니들에게 둘러싸여 사흘 만에 섬을 떠났다.", effects: { bond: 9, trust: 4 } },
              good: { text: "한 달을 집 안에서 보냈다. 지루함에 몸부림치던 {name}은 그동안 양육자에게 그물 깁는 법을 제대로 배웠다.", effects: { bond: 5, supplies: -2 } },
              bad: { text: "사내들이 창문에 돌을 던졌고, 양육자가 깨진 유리에 손을 다쳤다. {name}은 그 붕대를 볼 때마다 해스커의 이름을 씹었다.", effects: { bond: -4, health: -4, trust: -3 } }
            } },
          { id: "paper", label: "아는 것을 적어 신문사 새에게 맡긴다", hint: "세상에 퍼지면 되돌릴 수 없다",
            check: { stat: "trust", against: 50 }, personality: { empathy: 5, freedom: 5 }, mark: "testified",
            outcomes: {
              great: { text: "{name}은 아는 것을 모두 적어 신문 배달 새의 가방에 찔러 넣었다. 열흘 뒤 귀족의 이름이 신문 한 귀퉁이에 실렸고, 미로의 수배서는 벽에서 하나둘 떼어졌다.", effects: { trust: 10, friendBond: 3 }, mark: "miro_escaped" },
              good: { text: "기사는 아주 작게 실렸다. 그래도 사내들은 더 이상 대놓고 서성거리지 못했다.", effects: { trust: 5 } },
              bad: { text: "글은 엉뚱한 섬 신문에 실렸고, 그 섬의 생선 가게 주인이 누명을 썼다. {name}은 사과 편지를 쓰느라 한 철을 보냈다.", effects: { trust: -5, supplies: -3 } }
            } }
        ] },

      { step: 4, id: "letter", age: 27, art: "legacy", requires: ["miro_escaped"], title: "먼 섬에서 온 편지",
        body: "어디에 있든 편지는 결국 {name}을 찾아왔다. 봉투에는 미로의 서툰 글씨와 함께 작은 빵집 그림이 그려져 있었다. 누명을 벗은 미로는 먼 섬에서 빵을 굽고 있었고, 해마다 그날이 오면 가게 문을 닫고 섬 쪽 바다를 본다고 적었다.",
        choices: [
          { id: "reply", label: "긴 답장을 쓴다", hint: "말은 늦게라도 닿는다",
            check: { stat: "friendBond", against: 40 }, personality: { empathy: 6 },
            outcomes: {
              great: { text: "답장을 보낸 지 석 달 뒤, 미로의 빵 한 상자가 도착했다. 상자 바닥에는 해스커도 가끔 들른다는 쪽지가 깔려 있었다.", effects: { friendBond: 8, health: 3 } },
              good: { text: "답장은 짧아졌지만 진심이었다. 그 뒤로 해마다 한 번씩 편지가 오갔다.", effects: { friendBond: 5 } },
              bad: { text: "답장을 쓰다 말고 몇 번이나 찢었다. 결국 부치지 못한 편지만 서랍에 쌓였다.", effects: { friendBond: -3, bond: -2 } }
            } },
          { id: "visit", label: "언젠가 들르겠다고 다짐한다", hint: "바다는 넓고 길은 꼬인다",
            check: { stat: "supplies", against: 45 }, personality: { freedom: 6, loyalty: 3 },
            outcomes: {
              great: { text: "몇 해 뒤 정말로 그 섬에 닿았다. 미로는 반죽 묻은 손으로 {name}을 끌어안았고, 가게 안에는 낡은 수배서가 액자에 담겨 걸려 있었다.", effects: { friendBond: 10, trust: 3 } },
              good: { text: "섬에 닿지는 못했지만 그 섬에서 온 상인에게 빵집 소식을 들었다. 손님이 끊이지 않는다고 했다.", effects: { friendBond: 4 } },
              bad: { text: "그 섬으로 가는 항로가 폭풍으로 막혔다는 소식만 들려왔다. 다짐은 오래도록 다짐으로 남았다.", effects: { friendBond: -2, supplies: -3 } }
            } }
        ] },
      { step: 4, id: "old_cuffs", age: 29, art: "harbor", requires: ["saved_hasker", "forgave_hasker", "stood_hasker"], title: "낡은 수갑",
        body: "낯선 항구의 국숫집에서 누군가 {name}의 이름을 불렀다. 머리가 하얗게 센 해스커였다. 사냥은 그만두었다며 허리춤의 녹슨 수갑을 풀어 탁자에 올려놓았고, 마지막으로 하나만 부탁하겠다고 했다. 예전에 놓친 진짜 악당 하나가 이 항구에 있다는 것이었다.",
        choices: [
          { id: "help", label: "마지막 사냥을 돕는다", hint: "옛날 실력이 남아 있을까",
            check: { stat: "skill", against: 55 }, personality: { loyalty: 7, freedom: 3 },
            outcomes: {
              great: { text: "둘은 옛날처럼 골목을 나눠 맡았다. 악당은 생선 통에 처박힌 채 붙잡혔고, 해스커는 상금을 전부 항구 고아원에 던져 넣고 웃었다.", effects: { skill: 6, friendBond: 6, trust: 3 } },
              good: { text: "악당은 붙잡혔지만 해스커는 허리를 삐었다. {name}이 해스커를 업고 항구를 걸었고, 해스커는 내내 옛날엔 반대였다고 투덜거렸다.", effects: { friendBond: 5, health: -2 } },
              bad: { text: "악당은 놓쳤다. 대신 둘은 국숫집에서 밤새 옛날이야기를 했고, 해스커는 그걸로 됐다고 했다.", effects: { health: -5, friendBond: 2 } }
            } },
          { id: "decline", label: "수갑을 돌려주고 국수를 산다", hint: "다 지난 일이다",
            check: { stat: "friendBond", against: 40 }, personality: { caution: 6, empathy: 3 },
            outcomes: {
              great: { text: "해스커는 수갑을 바다에 던지며 홀가분하게 웃었다. 사실은 누군가 말려 주길 바랐다고 했다.", effects: { friendBond: 7, health: 3 } },
              good: { text: "해스커는 섭섭해했지만 국수 두 그릇을 비웠다. 헤어질 때 수갑은 {name}의 짐 속에 슬쩍 들어가 있었다.", effects: { friendBond: 4 } },
              bad: { text: "해스커는 혼자 사냥에 나섰다가 다쳐서 돌아왔다. {name}은 진료소 침대 곁에서 밤을 지새웠다.", effects: { friendBond: -2, supplies: -5 } }
            } }
        ] },
      { step: 4, id: "poster", age: 28, art: "fruit", title: "자란 얼굴의 수배서",
        body: "어느 항구 게시판에 낯익은 얼굴이 붙어 있었다. 수배서 속의 미로는 더 이상 겁먹은 하인이 아니었다. 해적이 되어 귀족들의 배만 노린다는 소문과 함께, 현상금은 그날의 몇 배로 불어나 있었다. 세상이 등을 돌린 사람이 어떻게 자라는지를 {name}은 그 얼굴에서 보았다.",
        choices: [
          { id: "tear", label: "수배서를 떼어 품에 넣는다", hint: "누군가 보고 있을지도",
            check: { stat: "trust", against: 40 }, personality: { empathy: 6, loyalty: 3 },
            outcomes: {
              great: { text: "그날 밤 숙소 문틈으로 쪽지 하나가 들어왔다. 그때 일은 원망하지 않는다, 그 섬에서 자기 얼굴을 기억해 준 건 너 하나뿐이었다는 미로의 글씨였다.", effects: { friendBond: 8, trust: 3 } },
              good: { text: "수배서는 오래 짐 속에 있었다. 볼 때마다 다음에는 다르게 하겠다고 다짐했다.", effects: { friendBond: 3, trust: 2 } },
              bad: { text: "게시판 관리인에게 들켜 벌금을 물었다. 수배서 한 장 값치고는 비쌌다.", effects: { supplies: -6, trust: -2 } }
            } },
          { id: "pass", label: "못 본 척 지나친다", hint: "과거는 과거로 둔다",
            check: { stat: "health", against: 40 }, personality: { caution: 6, freedom: 2 },
            outcomes: {
              great: { text: "지나친 줄 알았는데 발이 멈췄다. {name}은 항구 술집에서 미로가 노리는 귀족들의 이름을 들으며, 그 이름들이 하나도 억울하지 않다는 데 이상한 안도감을 느꼈다.", effects: { health: 4, trust: 4 } },
              good: { text: "그 얼굴은 며칠 동안 꿈에 나왔다. 그러다 조금씩 흐려졌다.", effects: { health: 2, friendBond: 1 } },
              bad: { text: "외면한 얼굴은 오히려 더 선명해졌다. 그해 내내 {name}은 그 눈빛에 쫓겼다.", effects: { health: -5, friendBond: -3 } }
            } }
        ] }
    ]
  },

  {
    key: "first_heart", title: "등대 아래의 약속",
    legacy: {
      default: "등대 불빛 아래서 한 사람을 오래 바라본 시간이, 마음이 무엇인지 처음 가르쳐 주었다.",
      noah_stayed: "누군가 나 때문에 꿈을 내려놓았다는 사실은 고마움과 빚이 반씩 섞인 채 평생 남았다.",
      parted_cold: "끝내 하지 못한 사과 한마디가, 이후의 모든 이별을 조금 더 조심스럽게 만들었다.",
      sailed_season: "한 철의 항해가 남긴 소금기는, 어디에 있어도 바다 쪽으로 몸을 돌리게 했다.",
      confessed: "부두 끝에서 소리 내어 말해 본 마음은, 다시는 마음을 숨기지 않게 했다.",
      gave_ticket: "모아 둔 전부를 남의 꿈에 건 적이 있다는 것이, 이상하게도 가장 큰 자랑이 되었다."
    },
    chapters: [
      { step: 1, id: "promise", age: 13, art: "childLantern", title: "등대 아래의 약속",
        body: "등대지기의 아이 노아는 늘 등대 난간에 앉아 나무로 배를 깎았다. 열여덟이 되면 진짜 배를 타고 수평선 너머로 가겠다고, 노아는 해 질 녘마다 {name}에게 말했다. 그날 노아가 깎던 배의 돛에는 아직 이름이 없었다.",
        choices: [
          { id: "together", label: "같이 떠나자고 말한다", hint: "말은 생각보다 무겁다",
            check: { stat: "friendBond", against: 40 }, personality: { freedom: 7, loyalty: 3 }, mark: "promised_go",
            outcomes: {
              great: { text: "노아는 한참 웃더니 칼끝으로 난간에 두 사람의 이름을 나란히 새겼다. 돛에도 같은 이름을 적었다. 그 밤 등대 불빛은 유난히 멀리까지 뻗었다.", effects: { friendBond: 9, bond: 2 }, mark: "carved" },
              good: { text: "노아는 진짜냐고 세 번 물었다. {name}이 세 번 고개를 끄덕이자, 노아는 손가락을 걸고 약속을 받아 냈다.", effects: { friendBond: 6 } },
              bad: { text: "말하는 도중 목소리가 갈라졌다. 노아는 난간에서 떨어질 듯 웃었고, {name}은 귀까지 빨개진 채 등대를 뛰어 내려갔다. 그래도 약속은 약속이었다.", effects: { friendBond: 2, health: -3, trust: -2 } }
            } },
          { id: "tease", label: "바다는 무섭다고 놀린다", hint: "농담은 가끔 칼이 된다",
            check: { stat: "trust", against: 35 }, personality: { caution: 6, freedom: -3 }, mark: "teased",
            outcomes: {
              great: { text: "노아는 지지 않고 바다왕류 흉내를 내며 {name}을 쫓아왔다. 둘은 언덕을 굴러 내려가 풀물 범벅이 될 때까지 웃었다.", effects: { friendBond: 7, health: 2 } },
              good: { text: "노아는 입을 삐죽였지만 다음 날 또 난간에서 손을 흔들었다.", effects: { friendBond: 3 } },
              bad: { text: "노아의 얼굴이 굳었다. 깎던 배를 주머니에 넣고 등대 안으로 들어간 뒤로, 노아는 한동안 꿈 이야기를 꺼내지 않았다.", effects: { friendBond: -6 }, mark: "parted_cold" }
            } },
          { id: "build", label: "모형 배를 같이 고친다", hint: "손이 먼저 말할 때가 있다",
            check: { stat: "skill", against: 40 }, personality: { empathy: 5, caution: 2 }, mark: "promised_go",
            outcomes: {
              great: { text: "{name}이 깎아 준 키는 꼭 맞았다. 모형 배는 등대 앞 물웅덩이를 곧게 건넜고, 노아는 이 배의 선장 자리를 {name}에게 주겠다고 했다.", effects: { skill: 5, friendBond: 6 }, mark: "carved" },
              good: { text: "돛대가 조금 기울었지만 배는 떴다. 노아는 기울어진 것도 멋이라고 우겼다.", effects: { skill: 3, friendBond: 3 } },
              bad: { text: "{name}의 칼질 한 번에 용골이 두 동강 났다. 노아는 울상을 지었다가, 반쪽짜리 배 두 척이 생겼다며 하나를 {name}에게 쥐여 주었다.", effects: { skill: -2, friendBond: 2, supplies: -2 } }
            } }
        ] },

      { step: 2, id: "sail_storm", age: 16, art: "storm", requires: ["carved"], title: "폭풍 속의 쪽배",
        body: "폭풍이 온다는 경보가 울린 저녁, 노아의 쪽배가 부두에서 사라졌다. 등대 난간에 쪽지 하나가 꽂혀 있었다. 폭풍을 이겨 내면 어른들도 보내 줄 거라는, 노아다운 무모한 글씨였다. 등대지기는 앓아누워 있었고 등불은 아직 켜지지 않았다.",
        choices: [
          { id: "lamp", label: "등대에 올라 불을 켠다", hint: "불빛이 길이 될 수 있다",
            check: { stat: "skill", against: 45 }, personality: { loyalty: 6, caution: 3 }, mark: "lit_lamp",
            outcomes: {
              great: { text: "{name}은 젖은 심지를 갈고 렌즈를 돌렸다. 불빛을 따라 노아의 쪽배가 돌아왔고, 그 뒤로 길 잃은 상선 한 척까지 따라 들어왔다. 상선의 선장은 등대에 대고 모자를 흔들었다.", effects: { skill: 6, trust: 6 }, mark: "hero_night" },
              good: { text: "불은 늦게 켜졌다. 노아는 암초에 배를 긁히고 겨우 돌아왔고, 둘은 젖은 채로 등대 계단에 앉아 이를 딱딱 부딪쳤다.", effects: { skill: 3, friendBond: 4 } },
              bad: { text: "등유를 엎질러 불길이 계단으로 번졌다. 불은 껐지만 노아는 어둠 속에서 혼자 돌아와야 했고, 팔에 길게 상처가 남았다.", effects: { health: -6, friendBond: -3 }, mark: "noah_hurt" }
            } },
          { id: "row", label: "다른 배를 끌고 쫓아간다", hint: "파도는 사정을 봐주지 않는다",
            check: { stat: "health", against: 50 }, personality: { freedom: 6, loyalty: 5 }, mark: "rowed_out",
            outcomes: {
              great: { text: "{name}은 뒤집힌 쪽배 곁에서 노아를 끌어올렸다. 둘은 서로 노를 하나씩 쥐고 파도를 넘어 돌아왔고, 부두 사람들은 그 밤을 오래 이야기했다.", effects: { health: 3, friendBond: 9 }, mark: "hero_night" },
              good: { text: "노아를 찾긴 했지만 배 두 척이 다 부서졌다. 둘은 바위섬에서 밤을 새우고 아침 고깃배에 실려 돌아왔다.", effects: { health: -3, friendBond: 7 } },
              bad: { text: "{name}의 배가 먼저 뒤집혔다. 결국 노아가 {name}을 건져 올렸고, 노아는 그 일로 다리를 다쳐 한 철을 절었다.", effects: { health: -9, friendBond: 2 }, mark: "noah_hurt" }
            } },
          { id: "adults", label: "부두 어른들을 깨운다", hint: "꾸중은 피할 수 없다",
            check: { stat: "trust", against: 40 }, personality: { caution: 7, empathy: 3 }, mark: "told_adults",
            outcomes: {
              great: { text: "{name}의 외침에 부두 전체가 횃불을 들었다. 어부들의 배가 노아를 무사히 데려왔고, 등대지기는 앓는 몸으로 {name}의 손을 오래 잡았다.", effects: { trust: 8, bond: 4 } },
              good: { text: "노아는 무사히 돌아왔지만 온 동네 앞에서 크게 혼났다. 노아는 {name}을 쳐다보지 않았다.", effects: { trust: 5, friendBond: -2 } },
              bad: { text: "어른들은 술에 취해 있었다. 겨우 배를 띄웠을 때 노아는 이미 혼자 돌아와 있었고, 일러바친 사람만 남았다.", effects: { trust: -3, friendBond: -6 } }
            } }
        ] },
      { step: 2, id: "dark_light", age: 16, art: "lifeStorm", title: "꺼진 등대",
        body: "그해 가장 큰 폭풍이 오던 밤, 등대 불이 꺼졌다. 등대지기는 사다리에서 떨어져 정신을 잃었고, 노아는 흠뻑 젖은 채 {name}의 집 문을 두드렸다. 먼바다에는 불빛을 찾아 헤매는 상선 한 척의 등이 깜빡이고 있었다.",
        choices: [
          { id: "climb", label: "노아와 등대 꼭대기로 오른다", hint: "바람이 몸을 밀어낸다",
            check: { stat: "health", against: 45 }, personality: { loyalty: 6, freedom: 3 }, mark: "lit_lamp",
            outcomes: {
              great: { text: "{name}이 바람막이를 붙잡고 노아가 심지에 불을 붙였다. 불빛이 돌자 상선이 방향을 틀었고, 다음 날 그 배의 선장이 등대까지 감사 인사를 왔다.", effects: { health: 2, friendBond: 8, trust: 4 }, mark: "hero_night" },
              good: { text: "불은 켜졌고 상선은 살았다. 둘은 렌즈 곁에 쪼그려 앉은 채 새벽을 맞았다. 노아가 {name}의 어깨에 기대 잠들었다.", effects: { friendBond: 6, health: -2 } },
              bad: { text: "돌풍에 {name}이 난간 밖으로 미끄러졌다. 노아가 손목을 붙잡아 끌어올렸지만, 그사이 노아의 손바닥이 쇠난간에 찢겼다.", effects: { health: -8, friendBond: 3 }, mark: "noah_hurt" }
            } },
          { id: "wake", label: "부두로 달려가 사람을 부른다", hint: "혼자보다 여럿이 낫다",
            check: { stat: "trust", against: 40 }, personality: { caution: 6, empathy: 3 }, mark: "told_adults",
            outcomes: {
              great: { text: "어부들이 횃불을 줄지어 들고 방파제에 섰다. 사람으로 만든 불빛을 보고 상선이 무사히 들어왔고, {home}의 부두는 그날부터 노아와 {name}을 다르게 불렀다.", effects: { trust: 9, friendBond: 3 } },
              good: { text: "사람들은 왔지만 늦었다. 상선은 암초를 스치고도 겨우 버텼다. 노아는 아버지 곁을 지키며 한숨도 자지 않았다.", effects: { trust: 4, friendBond: 2 } },
              bad: { text: "{name}이 부두를 돌아다니는 동안 노아 혼자 등대에 올랐다가 떨어질 뻔했다. 노아는 왜 같이 있어 주지 않았냐며 처음으로 울었다.", effects: { friendBond: -6, trust: 2 } }
            } },
          { id: "stay_by", label: "쓰러진 등대지기 곁을 지킨다", hint: "지금 필요한 건 손일지도",
            check: { stat: "bond", against: 40 }, personality: { empathy: 8 }, mark: "stayed_by",
            outcomes: {
              great: { text: "{name}은 집에서 배운 대로 머리를 받치고 상처를 눌렀다. 깨어난 등대지기가 노아를 등대로 보냈고, 불은 제때 켜졌다. 등대지기는 노아를 부탁한다고 중얼거렸다.", effects: { bond: 5, friendBond: 7 } },
              good: { text: "등대지기는 깨어났고 불은 늦게나마 켜졌다. 노아는 아무 말 없이 {name}의 손을 꽉 잡았다.", effects: { friendBond: 5 } },
              bad: { text: "아무리 불러도 등대지기는 깨지 않았다. 상선은 암초에 걸렸고, 다음 날 노아는 바다를 오래 노려보았다.", effects: { friendBond: -2, trust: -4, health: -2 } }
            } }
        ] },

      { step: 3, id: "grudge", age: 18, art: "harbor", requires: ["told_adults", "parted_cold"], title: "엇갈린 출항",
        body: "열여덟 살 되던 여름, 노아는 상선 견습 자리를 얻었다. 그런데 출항 전날 밤 부두에서 마주친 노아의 눈빛은 차가웠다. 노아는 지난 일들을 하나하나 꺼내며, 너는 한 번도 내 편이었던 적이 없다고 말했다.",
        choices: [
          { id: "sorry", label: "변명 없이 사과한다", hint: "자존심을 접어야 한다",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7, loyalty: 3 },
            outcomes: {
              great: { text: "{name}의 사과가 끝나기도 전에 노아가 먼저 울음을 터뜨렸다. 사실은 무서웠다고, 떠나기 전에 화라도 내지 않으면 발이 안 떨어질 것 같았다고 했다.", effects: { friendBond: 10 }, mark: "confessed" },
              good: { text: "노아는 고개를 끄덕였지만 웃지는 않았다. 그래도 다음 날 아침, 배 위에서 노아가 손을 흔들었다.", effects: { friendBond: 4 } },
              bad: { text: "말이 꼬였다. 사과는 어느새 다시 다툼이 되었고, 노아는 등을 돌려 배에 올랐다. 다음 날 배는 손짓 하나 없이 떠났다.", effects: { friendBond: -8 }, mark: "parted_cold" }
            } },
          { id: "ticket", label: "모은 돈을 노아에게 쥐여 준다", hint: "말 대신 줄 수 있는 것",
            check: { stat: "supplies", against: 40 }, personality: { empathy: 6, ambition: -3 }, mark: "gave_ticket",
            outcomes: {
              great: { text: "그 돈으로 노아는 견습이 아니라 정식 항해사 자리를 샀다. 노아는 돈주머니를 받아 들고 한참을 말이 없다가, 첫 항구에서 반드시 편지를 쓰겠다고 했다.", effects: { friendBond: 10, supplies: -6 } },
              good: { text: "노아는 받지 않겠다고 버텼다. 결국 반만 받았고, 나머지 반은 등대 난간 이름 밑에 묻어 두었다.", effects: { friendBond: 5, supplies: -3 } },
              bad: { text: "노아는 돈주머니를 바다에 던져 버렸다. 동정은 필요 없다는 말과 함께였다. {name}은 그날 밤 부두에서 혼자 동전을 건졌다.", effects: { supplies: -8, friendBond: -4 }, mark: "parted_cold" }
            } },
          { id: "silent", label: "아무 말 없이 보낸다", hint: "침묵도 대답이다",
            check: { stat: "health", against: 40 }, personality: { caution: 6, freedom: 3 }, mark: "let_go",
            outcomes: {
              great: { text: "출항하는 배를 따라 {name}은 등대까지 달렸다. 말 대신 등불을 세 번 깜빡였고, 멀어지는 갑판 위에서 작은 등불 하나가 세 번 대답했다.", effects: { friendBond: 7, health: 2 } },
              good: { text: "배는 떠났다. {name}은 그 뒤로도 해 질 녘이면 습관처럼 등대 쪽을 보았다.", effects: { health: 2, friendBond: -1 } },
              bad: { text: "말하지 않은 것들이 목에 걸렸다. 그해 겨울 {name}은 한 달을 앓았고, 열에 들뜬 밤마다 노아의 이름을 불렀다.", effects: { health: -8, bond: 2 }, mark: "parted_cold" }
            } }
        ] },
      { step: 3, id: "berth", age: 19, art: "deck", requires: ["hero_night", "lit_lamp", "rowed_out"], title: "선장의 제안",
        body: "폭풍의 밤 이야기를 전해 들은 상선 선장이 섬을 찾아왔다. 노아에게 항해사 견습 자리를 주겠다고 했고, 원한다면 한 자리가 더 있다며 {name}을 바라보았다. 노아는 아무 말 없이 {name}의 대답만 기다렸다.",
        choices: [
          { id: "season", label: "한 철 항해에 함께 오른다", hint: "돌아올 길을 남겨 둔다",
            check: { stat: "skill", against: 45 }, personality: { freedom: 7, loyalty: 4 }, mark: "sailed_season",
            outcomes: {
              great: { text: "한 철 동안 둘은 일곱 개의 섬을 돌았다. 돌아오는 날 노아는 남은 항해를 이어 갔고, {name}은 소금기 밴 손으로 노아가 그려 준 해도 한 장을 쥐고 내렸다.", effects: { skill: 7, friendBond: 7 } },
              good: { text: "{name}은 내내 뱃멀미에 시달렸다. 노아가 밤마다 등을 두드려 주었고, 그 한 철은 고단하고 반짝였다.", effects: { health: -3, friendBond: 8 } },
              bad: { text: "첫 항구에서 {name}은 술 취한 선원과 시비가 붙어 배에서 내려졌다. 노아는 갑판 끝에서 한참 손을 흔들었다.", effects: { health: -6, trust: -4, friendBond: 2 } }
            } },
          { id: "ask_stay", label: "노아에게 남아 달라고 한다", hint: "꿈과 사람 사이",
            check: { stat: "friendBond", against: 50 }, personality: { loyalty: 6, caution: 4, freedom: -4 }, mark: "asked_stay",
            outcomes: {
              great: { text: "노아는 오래 바다를 보다가 선장에게 고개를 저었다. 대신 등대를 물려받겠다고 했다. 그날부터 등불은 {name}이 어디에 있든 꺼지지 않는 약속이 되었다.", effects: { friendBond: 9, bond: 3 }, mark: "noah_stayed" },
              good: { text: "노아는 일 년만 미루겠다고 했다. 그 일 년은 길고 다정했지만, 둘 다 끝이 있다는 걸 알았다.", effects: { friendBond: 5 } },
              bad: { text: "노아는 이기적이라고 쏘아붙이고 그날로 배에 올랐다. 난간의 이름 하나가 칼로 긁혀 있었다.", effects: { friendBond: -9 }, mark: "parted_cold" }
            } },
          { id: "see_off", label: "등대에서 배웅하기로 한다", hint: "놓아주는 것도 사랑이다",
            check: { stat: "bond", against: 40 }, personality: { empathy: 6, caution: 3 }, mark: "let_go",
            outcomes: {
              great: { text: "출항하는 아침, {name}은 등불을 켜고 노아가 깎던 모형 배를 바다에 띄웠다. 돛에는 두 사람의 이름이 있었다. 노아는 갑판에서 그 배가 따라오는 걸 오래 보았다.", effects: { friendBond: 8, bond: 3 }, mark: "confessed" },
              good: { text: "배는 떠났고, {name}은 집으로 돌아가 양육자 앞에서 처음으로 소리 내어 울었다.", effects: { bond: 5, friendBond: 2 } },
              bad: { text: "늦잠을 잤다. 등대에 닿았을 때 배는 이미 수평선의 점이었고, {name}은 빈 바다에 대고 이름만 불렀다.", effects: { friendBond: -6, health: -2 } }
            } }
        ] },
      { step: 3, id: "quarrel", age: 18, art: "childLantern", title: "출항 전날의 다툼",
        body: "노아가 다음 달에 떠나는 상선을 탄다고 말했다. 상의도 없이 정했다는 데 {name}의 말이 날카로워졌고, 노아도 지지 않았다. 등대 아래서 둘은 처음으로 서로에게 상처 주는 말을 골라 던졌다. 바람이 심하게 불었다.",
        choices: [
          { id: "confess", label: "부두 끝까지 쫓아가 마음을 말한다", hint: "다시는 못 할 말일지도",
            check: { stat: "friendBond", against: 45 }, personality: { freedom: 5, empathy: 5 }, mark: "confessed",
            outcomes: {
              great: { text: "{name}의 말을 끝까지 들은 노아는, 그 말을 듣고 싶어서 일부러 싸움을 걸었다고 털어놓았다. 둘은 출항하는 날까지 매일 저녁 등대에서 만났다.", effects: { friendBond: 11 } },
              good: { text: "노아는 고맙다고만 했다. 그래도 떠나는 날 노아는 {name}에게 모형 배를 맡기고 갔다.", effects: { friendBond: 5 } },
              bad: { text: "말이 너무 늦었다. 노아는 이미 마음을 정했다며 고개를 저었고, {name}은 부두 끝에서 한참 바다만 보았다.", effects: { friendBond: -3, health: -4 } }
            } },
          { id: "beg", label: "떠나지 말라고 붙잡는다", hint: "붙잡힌 꿈은 어떻게 될까",
            check: { stat: "trust", against: 50 }, personality: { loyalty: 6, freedom: -5 }, mark: "asked_stay",
            outcomes: {
              great: { text: "노아는 떠나지 않았다. 대신 둘은 마을의 낡은 배를 고쳐 언젠가 함께 떠나자고 했다. 그 배는 아직도 {home}의 부두에 묶여 있다.", effects: { friendBond: 8, trust: 3 }, mark: "noah_stayed" },
              good: { text: "노아는 출항을 한 번 미뤘다. 미룬 출항은 다음 해 봄에 조용히 이루어졌다.", effects: { friendBond: 4 } },
              bad: { text: "붙잡는 손을 노아가 뿌리쳤다. 다음 달 배는 떠났고, 노아는 끝내 뒤돌아보지 않았다.", effects: { friendBond: -9 }, mark: "parted_cold" }
            } },
          { id: "pride", label: "잘 가라고 쏘아붙인다", hint: "속은 다르지만",
            check: { stat: "health", against: 40 }, personality: { freedom: 5, caution: 2 }, mark: "parted_cold",
            outcomes: {
              great: { text: "출항 날 아침, 문 앞에 노아의 모형 배가 놓여 있었다. 돛에 서툰 글씨로 돌아올게라고 적혀 있었다.", effects: { friendBond: 6, health: 2 } },
              good: { text: "배는 떠났다. {name}은 그날 일부러 바다와 반대쪽 언덕에서 하루를 보냈다.", effects: { health: 2, friendBond: -2 } },
              bad: { text: "쏘아붙인 말이 노아의 마지막 기억이 되었다. {name}은 그해 내내 자다가도 그 말을 되뇌었다.", effects: { friendBond: -7, health: -3 } }
            } }
        ] },

      { step: 4, id: "keeper", age: 26, art: "childLantern", requires: ["noah_stayed"], title: "등대지기의 편지",
        body: "{home}에서 편지가 왔다. 노아는 이제 등대지기였다. 매일 밤 불을 켤 때마다 {name}이 있는 쪽 바다를 한 번 더 비춘다고 적었다. 편지 끝에는 한 줄이 덧붙어 있었다. 가끔은 그때 떠났으면 어땠을까 생각한다고.",
        choices: [
          { id: "honest", label: "미안하다고 솔직하게 답한다", hint: "늦은 말도 말이다",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7 },
            outcomes: {
              great: { text: "답장을 받은 노아는 등대를 동생에게 맡기고 한 철 항해를 떠났다. 첫 항구에서 보낸 편지에는 바다가 생각보다 더 넓다고, 고맙다고 적혀 있었다.", effects: { friendBond: 10 } },
              good: { text: "노아는 이제 괜찮다고 답했다. 그 괜찮다는 말이 진심이라는 걸, 글씨의 기울기로 알 수 있었다.", effects: { friendBond: 5 } },
              bad: { text: "답장이 너무 무거웠다. 노아의 다음 편지는 짧아졌고, 그다음은 오지 않았다.", effects: { friendBond: -5, health: -2 } }
            } },
          { id: "lighthouse", label: "등대를 보러 돌아가겠다고 쓴다", hint: "약속은 또 하나의 짐이다",
            check: { stat: "supplies", against: 45 }, personality: { loyalty: 6, freedom: -2 },
            outcomes: {
              great: { text: "몇 해 뒤 {name}이 등대 계단을 올랐을 때, 난간에 새겨진 두 사람의 이름은 누군가 해마다 다시 새겨 둔 듯 선명했다. 둘은 밤새 불빛을 함께 돌렸다.", effects: { friendBond: 9, bond: 3 } },
              good: { text: "돌아가지는 못했지만, 그 약속 하나가 거친 바다에서 {name}을 여러 번 버티게 했다.", effects: { health: 3, friendBond: 2 } },
              bad: { text: "약속은 지켜지지 않았다. 노아는 원망하지 않았지만, {name}이 스스로를 원망했다.", effects: { friendBond: -4, health: -3 } }
            } }
        ] },
      { step: 4, id: "crossed", age: 27, art: "harbor", requires: ["parted_cold"], title: "엇갈린 항구",
        body: "어느 항구의 선술집에서 익숙한 웃음소리가 들렸다. 돌아보니 노아였다. 햇볕에 그을린 항해사의 얼굴로, 노아는 동료들 사이에서 해도를 펼치고 있었다. 눈이 마주친 순간 둘 다 마지막으로 헤어지던 날을 떠올렸다.",
        choices: [
          { id: "apologize", label: "먼저 다가가 사과한다", hint: "세월이 칼날을 무디게 했을까",
            check: { stat: "friendBond", against: 45 }, personality: { empathy: 7, loyalty: 3 },
            outcomes: {
              great: { text: "노아는 사과를 다 듣기도 전에 술잔을 하나 더 시켰다. 그날 밤 둘은 서로의 항로를 해도에 겹쳐 그리며 그동안 얼마나 가까이 스쳐 지나갔는지 세었다.", effects: { friendBond: 11 } },
              good: { text: "어색한 인사와 어색한 술 한 잔. 그래도 헤어질 때 노아가 다음 항구 이름을 알려 주었다.", effects: { friendBond: 5 } },
              bad: { text: "노아의 동료들이 끼어들며 분위기가 꼬였다. 사과는 말이 되지 못했고, 다음 날 노아의 배는 이미 떠나 있었다.", effects: { friendBond: -4, trust: -2 } }
            } },
          { id: "walk_past", label: "모른 척 지나친다", hint: "지나간 일은 지나간 대로",
            check: { stat: "health", against: 40 }, personality: { caution: 6 },
            outcomes: {
              great: { text: "문을 나서려는 {name}의 등 뒤로 노아가 등대 불빛처럼 탁자 위 등잔을 손으로 세 번 가렸다 열었다. {name}도 문간에서 등불을 세 번 들어 보였다. 그것으로 충분했다.", effects: { friendBond: 6, health: 3 } },
              good: { text: "둘은 끝내 말을 섞지 않았다. 다만 그 항구를 떠나는 날 바다가 유난히 잔잔했다.", effects: { health: 2 } },
              bad: { text: "지나치고 나서야 후회가 밀려왔다. 다시 선술집에 돌아갔을 때 노아의 자리는 비어 있었다.", effects: { friendBond: -5, health: -2 } }
            } }
        ] },
      { step: 4, id: "bottle", age: 25, art: "childInlet", title: "병 속의 편지",
        body: "어디서 흘러왔는지 모를 편지가 {name}에게 닿았다. 노아의 글씨였다. 아무도 이름을 붙이지 않은 섬을 그린 스케치와 말린 꽃 한 송이가 들어 있었고, 이 섬에 두 사람의 이름을 붙였다는 짧은 문장이 적혀 있었다.",
        choices: [
          { id: "write_back", label: "아는 항구마다 답장을 맡긴다", hint: "바다는 편지를 잃기도 한다",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 6, empathy: 3 },
            outcomes: {
              great: { text: "답장 하나가 기적처럼 노아에게 닿았다. 그 뒤로 둘은 항구 우체부들 사이에서 유명한 편지 친구가 되었다.", effects: { friendBond: 9, trust: 2 } },
              good: { text: "답장이 닿았는지는 알 수 없었다. 그래도 쓰는 동안만큼은 {name}도 그 섬에 서 있었다.", effects: { friendBond: 4 } },
              bad: { text: "맡긴 편지들이 하나둘 반송되어 돌아왔다. 받는 이가 머무는 곳을 아무도 몰랐다.", effects: { friendBond: -3, supplies: -3 } }
            } },
          { id: "keep_flower", label: "말린 꽃을 품에 지닌다", hint: "부적이 될지도 모른다",
            check: { stat: "health", against: 40 }, personality: { caution: 4, empathy: 4 },
            outcomes: {
              great: { text: "그 꽃은 거친 날마다 {name}을 붙들었다. 언젠가 이름 붙은 섬에 닿으면, 그때 직접 돌려주겠다고 다짐했다.", effects: { health: 5, friendBond: 4 } },
              good: { text: "꽃잎은 조금씩 바스러졌지만, 바다 냄새 사이로 그 향만은 오래 남았다.", effects: { health: 2, friendBond: 2 } },
              bad: { text: "폭우 속에서 꽃은 흔적도 없이 사라졌다. {name}은 빈 손바닥을 한참 보았다.", effects: { health: -2, friendBond: -3 } }
            } }
        ] }
    ]
  },

  {
    key: "smuggler_ledger", title: "밀수선의 장부",
    legacy: {
      default: "한밤의 부두에서 상자를 나르던 손은, 정직한 무게와 수상한 무게를 구별하게 되었다.",
      exposed: "섬 전체가 외면하던 장부를 펼쳐 보인 그날부터, 불의 앞에서 입을 다무는 법을 잊었다.",
      blackmailed: "남의 약점으로 산 평화가 얼마나 비싼지, 이자까지 쳐서 갚으며 배웠다.",
      burned: "불길 속에 사라진 장부처럼, 끝내 말하지 않은 진실 하나가 평생 가슴에 그을음을 남겼다.",
      ran: "도망친 밤의 파도 소리는, 어디에 있어도 등 뒤를 한 번씩 돌아보게 했다.",
      joined_ring: "어른들의 더러운 셈법을 일찍 배운 대가로, 쉽게 놀라지 않는 사람이 되었다."
    },
    chapters: [
      { step: 1, id: "night_job", age: 15, art: "workbench", title: "밤의 짐꾼",
        body: "{home}의 부두에서 퀼 영감이 밤일할 아이를 구했다. 해가 진 뒤 이름 없는 배에서 상자를 내리기만 하면 낮 품삯의 세 배를 준다고 했다. 사흘째 되던 밤, {name}의 손에서 상자 하나가 미끄러져 깨졌고, 그 안에서 해군 도장이 찍힌 화약통과 금화 몇 닢이 굴러 나왔다.",
        choices: [
          { id: "peek", label: "깨진 상자 안을 살핀다", hint: "보면 모르던 때로 못 간다",
            check: { stat: "skill", against: 40 }, personality: { freedom: 5, empathy: 3 }, mark: "peeked",
            outcomes: {
              great: { text: "{name}은 상자의 이중 바닥을 알아챘다. 그 아래 기름종이에 싸인 얇은 장부가 있었다. 첫 장에 섬 징세관 브로반의 서명이 또렷했다.", effects: { skill: 7, supplies: 3 }, mark: "found_ledger" },
              good: { text: "화약통마다 해군 지부 도장이 찍혀 있었다. 누가 왜 해군 화약을 밤에 몰래 옮기는지, {name}은 그날 밤 잠을 이루지 못했다.", effects: { skill: 4 } },
              bad: { text: "들여다보는 순간 퀼 영감의 손이 {name}의 뒷덜미를 잡았다. 그 주의 품삯은 깨진 상자값으로 날아갔고, 영감의 눈길이 자꾸 따라붙었다.", effects: { supplies: -5, trust: -3 }, mark: "watched" }
            } },
          { id: "quiet", label: "못 본 척 짐만 나른다", hint: "입이 무거우면 대접받는다",
            check: { stat: "health", against: 40 }, personality: { caution: 7, ambition: 2 },
            outcomes: {
              great: { text: "{name}이 아무것도 묻지 않고 깨진 상자를 정리하자, 퀼 영감은 다음 날부터 창고 사무실 열쇠를 맡겼다. 사무실 서랍 하나만은 절대 열지 말라는 말과 함께였다.", effects: { supplies: 6, trust: 3 }, mark: "trusted_hand" },
              good: { text: "품삯은 꼬박꼬박 나왔다. 대신 그 화약통의 도장은 밤마다 꿈에 나왔다.", effects: { supplies: 4 } },
              bad: { text: "무거운 상자를 혼자 나르다 허리를 삐끗했다. {name}은 사흘을 누워 지냈고, 양육자는 무슨 일을 하길래 이러냐고 캐물었다.", effects: { health: -6, bond: -3 } }
            } },
          { id: "pocket", label: "흩어진 금화를 슬쩍 줍는다", hint: "주머니는 가볍고 배는 고프다",
            check: { stat: "supplies", against: 35 }, personality: { ambition: 7, caution: -3 },
            outcomes: {
              great: { text: "금화를 줍다가 그 사이에 끼어 있던 쪽지도 함께 집었다. 다음 거래 날짜와 레녹스 대위라는 이름이 적혀 있었다. 해군 지부의 그 대위였다.", effects: { supplies: 8, skill: 2 }, mark: "found_ledger" },
              good: { text: "금화 두 닢이 {name}의 신발 속으로 들어갔다. 그날 저녁 식탁에는 오랜만에 고기가 올랐다.", effects: { supplies: 5, bond: 1 } },
              bad: { text: "신발 속 금화가 걸음마다 짤랑거렸다. 퀼 영감은 웃지도 않고 {name}의 신발을 털었고, 그날부터 감시가 붙었다.", effects: { trust: -6, supplies: -2 }, mark: "watched" }
            } }
        ] },

      { step: 2, id: "names", age: 17, art: "childChart", requires: ["found_ledger", "trusted_hand"], title: "장부의 이름들",
        body: "{name}은 마침내 그 장부를 펼쳤다. 징세관 브로반, 해군 지부의 레녹스 대위, 그리고 장터 조합장의 이름까지. 섬 사람들이 낸 세금으로 산 해군 화약이 해적에게 팔리고, 그 돈이 다시 그들의 주머니로 흘러드는 셈이 꼼꼼히 적혀 있었다. 문밖에서 발소리가 들렸다.",
        choices: [
          { id: "copy", label: "중요한 장만 베껴 쓴다", hint: "손이 빨라야 한다",
            check: { stat: "skill", against: 50 }, personality: { caution: 6, empathy: 3 }, mark: "copied",
            outcomes: {
              great: { text: "{name}은 발소리가 문고리에 닿기 직전 마지막 줄을 베꼈다. 장부는 원래 자리에, 사본은 신발 깔창 밑에. 들어온 퀼 영감은 아무것도 눈치채지 못했다.", effects: { skill: 7, trust: 3 } },
              good: { text: "절반쯤 베꼈을 때 등잔이 꺼졌다. 남은 장은 기억에 의지해 적어야 했다.", effects: { skill: 4 } },
              bad: { text: "잉크병이 엎어져 장부 한 귀퉁이에 얼룩이 졌다. 다음 날 퀼 영감이 그 얼룩을 오래 들여다보았다.", effects: { skill: 2, trust: -6 }, mark: "suspected" }
            } },
          { id: "steal", label: "장부째 품에 넣는다", hint: "사라지면 누가 찾을까",
            check: { stat: "health", against: 50 }, personality: { freedom: 6, ambition: 4 }, mark: "stole_ledger",
            outcomes: {
              great: { text: "{name}은 장부 대신 비슷한 두께의 낡은 출납부를 끼워 넣고 창으로 빠져나갔다. 바꿔치기가 들통난 건 보름이나 지난 뒤였다.", effects: { skill: 5, supplies: 4 } },
              good: { text: "장부를 품고 지붕을 타 넘다가 무릎이 깨졌다. 그래도 장부는 무사히 집 아궁이 뒤에 숨겼다.", effects: { health: -3, skill: 3 } },
              bad: { text: "창문을 넘다 퀼 영감의 개에게 바짓가랑이를 물렸다. 장부는 지켰지만 개가 물고 간 천 조각에는 {name}의 집 냄새가 배어 있었다.", effects: { health: -7 }, mark: "suspected" }
            } },
          { id: "put_back", label: "제자리에 두고 잊는다", hint: "모르는 게 약일지도",
            check: { stat: "bond", against: 40 }, personality: { caution: 8, freedom: -3 }, mark: "put_back",
            outcomes: {
              great: { text: "장부를 덮자 손이 떨렸다. {name}은 그 길로 집에 가서 양육자에게 일을 그만두겠다고 했고, 양육자는 이유를 묻지 않고 국을 데웠다.", effects: { bond: 7, health: 2 } },
              good: { text: "아무 일 없었던 것처럼 일을 계속했다. 다만 이름들이 장터에서 웃는 걸 볼 때마다 속이 뒤틀렸다.", effects: { supplies: 4, health: -1 } },
              bad: { text: "잊으려 할수록 이름들은 선명해졌다. {name}은 밤마다 장부를 다시 펼치는 꿈을 꾸었다.", effects: { health: -6 } }
            } }
        ] },
      { step: 2, id: "warehouse", age: 17, art: "dangerPrison", title: "창고의 불빛",
        body: "어느 밤 창고 안쪽에서 등불이 새어 나왔다. 퀼 영감이 해군 제복 차림의 사내에게 두툼한 장부를 건네고 있었다. 레녹스 대위였다. 그 순간 천장에 앉아 있던 갈매기 떼가 한꺼번에 날아올랐고, 소동 속에 장부가 상자 더미 사이로 떨어졌다. {name}의 발치였다.",
        choices: [
          { id: "grab", label: "장부를 집어 들고 뛴다", hint: "발이 빠르면 산다",
            check: { stat: "health", against: 50 }, personality: { freedom: 7, ambition: 3 }, mark: "stole_ledger",
            outcomes: {
              great: { text: "{name}은 갈매기 떼 속으로 몸을 숙여 빠져나갔다. 레녹스는 갈매기 똥을 뒤집어쓴 채 허공에 칼을 휘둘렀고, 누가 가져갔는지 끝내 보지 못했다.", effects: { health: 3, skill: 6 } },
              good: { text: "장부는 챙겼지만 뛰다가 그물에 걸려 넘어졌다. 등 뒤에서 누구냐는 외침이 들렸고, {name}은 대답 대신 바다로 뛰어들었다.", effects: { health: -4, skill: 4 } },
              bad: { text: "장부를 쥐는 순간 등불이 {name}의 얼굴을 비췄다. 달아나긴 했지만, 레녹스는 그 얼굴을 기억했다.", effects: { health: -5, trust: -4 }, mark: "suspected" }
            } },
          { id: "tail", label: "레녹스의 뒤를 밟는다", hint: "더 큰 그림이 있을지도",
            check: { stat: "skill", against: 45 }, personality: { caution: 6, ambition: 3 }, mark: "copied",
            outcomes: {
              great: { text: "레녹스는 해군 지부가 아니라 징세관 브로반의 집으로 갔다. {name}은 담장 너머로 둘이 나누는 셈을 모조리 외워 종이에 옮겼다.", effects: { skill: 7, trust: 2 } },
              good: { text: "골목 두 개를 따라가다 놓쳤다. 그래도 레녹스가 브로반의 집 쪽으로 꺾어 드는 것까지는 보았다.", effects: { skill: 3 } },
              bad: { text: "레녹스가 갑자기 돌아섰다. {name}은 생선 통 뒤에 숨었지만, 레녹스는 통을 걷어차고 지나가며 다음엔 못 본 척 안 한다고 중얼거렸다.", effects: { health: -4, trust: -3 }, mark: "suspected" }
            } },
          { id: "tell_quill", label: "장부를 퀼 영감에게 돌려준다", hint: "영감에게도 사정이 있을까",
            check: { stat: "trust", against: 40 }, personality: { loyalty: 7, caution: 3 }, mark: "told_quill",
            outcomes: {
              great: { text: "퀼 영감은 장부를 받아 들고 한참 {name}을 보았다. 그러더니 처음으로 속을 털어놓았다. 영감도 빚 때문에 붙잡혀 있다고, 언젠가 이 장부가 영감의 목줄을 끊어 줄 거라고.", effects: { trust: 6, friendBond: 4 } },
              good: { text: "영감은 고맙다는 말 대신 품삯을 두 배로 쳐주었다. 입막음 값이라는 걸 {name}도 알았다.", effects: { supplies: 6 } },
              bad: { text: "장부를 건네는 걸 레녹스가 보았다. 그날부터 레녹스는 {name}을 알아보았다.", effects: { trust: -5, supplies: 2 }, mark: "suspected" }
            } }
        ] },

      { step: 3, id: "hunted", age: 19, art: "lifeStorm", requires: ["suspected", "watched"], title: "추적자들",
        body: "어느 새벽 레녹스의 부하들이 {name}의 집 문을 걷어찼다. 밀수품을 찾는다는 명목이었지만, 그들이 뒤지는 건 아궁이 뒤와 마루 밑이었다. 양육자가 문간을 막아선 사이 {name}은 뒷창문 너머로 후미의 고깃배와 해군 지부의 불빛을 번갈아 보았다.",
        choices: [
          { id: "run", label: "후미의 고깃배로 도망친다", hint: "돌아올 수 있을까",
            check: { stat: "health", against: 50 }, personality: { freedom: 8, caution: 3 }, mark: "ran",
            outcomes: {
              great: { text: "늙은 어부가 아무것도 묻지 않고 그물 밑에 {name}을 숨겼다. 이웃 섬에 닿은 {name}은 그동안 보고 들은 것을 적어 그 섬 신문사에 맡겼고, 몇 주 뒤 {home}에 해군 감찰선이 들어왔다.", effects: { health: 3, trust: 6 }, mark: "exposed" },
              good: { text: "배는 떠났고 {name}은 살았다. 다만 한 철 동안 집에 돌아가지 못했고, 양육자의 편지는 늘 괜찮다는 말로 끝났다.", effects: { bond: -3, health: 2, skill: 3 } },
              bad: { text: "고깃배까지 가는 길에 미끄러져 바위에 부딪혔다. 피투성이로 배에 기어올랐을 때 품에 지닌 것은 모두 바닷물에 젖어 있었다.", effects: { health: -10, supplies: -3 } }
            } },
          { id: "quill_help", label: "퀼 영감에게 도움을 청한다", hint: "적의 적은 친구일까",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 5, empathy: 4 }, mark: "quill_saved",
            outcomes: {
              great: { text: "퀼 영감은 레녹스의 부하들에게 밀수품은 여기 다 있다며 창고 문을 열어 주었다. 그 대신 자신이 모든 죄를 뒤집어썼다. 끌려가며 영감은 {name}에게 끝까지 살아남으라고 눈짓했다.", effects: { trust: 7, friendBond: 4 } },
              good: { text: "영감은 {name}을 창고 지하에 열흘 숨겨 주었다. 대가로 그 열흘 동안 상자 밑창을 새로 짜야 했다.", effects: { skill: 4, supplies: -2 } },
              bad: { text: "영감은 이미 레녹스에게 겁을 먹고 있었다. 문을 열어 주지 않았고, {name}은 빗속 골목에서 밤을 새웠다.", effects: { health: -7, friendBond: -3 } }
            } },
          { id: "stand", label: "해군 지부 앞에서 소리친다", hint: "모두가 듣게 된다",
            check: { stat: "trust", against: 55 }, personality: { empathy: 5, freedom: 4, caution: -6 }, mark: "exposed",
            outcomes: {
              great: { text: "{name}의 외침에 장터 사람들이 몰려들었다. 마침 보급차 들른 다른 섬 해군 함선의 장교가 그 소리를 들었고, 레녹스는 그날 오후 제 부하들 앞에서 견장을 뜯겼다.", effects: { trust: 12, health: -2 } },
              good: { text: "사람들은 들었지만 아무도 움직이지 않았다. 그래도 그날 이후 레녹스의 부하들은 {name}의 집 앞에서 서성이지 못했다.", effects: { trust: 5, health: -2 } },
              bad: { text: "{name}은 지부 창고에 사흘 갇혔다. 풀려난 날, 장터 사람들은 눈을 피했고 양육자는 말없이 {name}의 상처를 닦았다.", effects: { health: -10, bond: 3 } }
            } }
        ] },
      { step: 3, id: "holding", age: 19, art: "childFestival", requires: ["stole_ledger", "copied"], title: "장부를 쥔 손",
        body: "등불 축제가 다가오던 무렵, {name}의 손에는 섬을 뒤집을 수 있는 종이가 있었다. 축제 날이면 징세관과 레녹스 대위가 장터 단상에 나란히 선다. 아궁이 앞에 앉은 {name}은 장부를 펼쳤다 덮었다를 몇 번이고 되풀이했다.",
        choices: [
          { id: "expose", label: "축제 단상에서 장부를 낭독한다", hint: "되돌릴 수 없는 길",
            check: { stat: "trust", against: 50 }, personality: { empathy: 6, freedom: 5, caution: -4 }, mark: "exposed",
            outcomes: {
              great: { text: "{name}이 첫 이름을 읽자 장터가 얼어붙었다. 셋째 이름에서 누군가 생선을 던졌고, 다섯째 이름에서 브로반이 단상 뒤로 도망쳤다. 레녹스는 섬 사람들에게 둘러싸인 채 칼을 뽑지도 못했다.", effects: { trust: 12, friendBond: 3 } },
              good: { text: "낭독은 끝까지 했다. 브로반은 쫓겨났지만 레녹스는 소리 소문 없이 섬을 떠났다. 장터 사람들은 {name}에게 술을 샀고, 몇몇은 그날부터 인사를 받지 않았다.", effects: { trust: 6, friendBond: -1 } },
              bad: { text: "단상에 오르기도 전에 레녹스의 부하들이 {name}을 끌어내렸다. 장부는 빼앗겼지만, 군중 속 누군가가 그 장면을 똑똑히 보았다.", effects: { health: -8, trust: 2 }, mark: "suspected" }
            } },
          { id: "blackmail", label: "브로반에게 쪽지를 보낸다", hint: "약점은 돈이 된다",
            check: { stat: "supplies", against: 45 }, personality: { ambition: 8, empathy: -4 }, mark: "blackmailed",
            outcomes: {
              great: { text: "브로반은 사색이 되어 돈을 보냈고, {name}은 그 돈 절반을 장터 과부들에게 익명으로 돌렸다. 그해 섬의 세금이 이유 없이 내려갔다.", effects: { supplies: 8, trust: 4 } },
              good: { text: "돈은 들어왔다. 대신 브로반은 매번 다음 쪽지를 기다리는 사람의 얼굴로 {name}을 보았다.", effects: { supplies: 7, health: -2 } },
              bad: { text: "브로반은 돈 대신 레녹스를 보냈다. {name}은 장부를 지키느라 골목에서 실컷 얻어맞았고, 그 뒤로 둘은 서로의 목줄을 쥔 채 살아야 했다.", effects: { health: -9, supplies: 2 }, mark: "suspected" }
            } },
          { id: "burn", label: "장부를 아궁이에 넣는다", hint: "불은 많은 걸 끝낸다",
            check: { stat: "bond", against: 40 }, personality: { caution: 8, empathy: 2 }, mark: "burned",
            outcomes: {
              great: { text: "불길이 이름들을 삼키는 걸 양육자와 함께 보았다. 양육자는 {name}을 끌어안으며 너 하나 지키는 게 먼저라고 했다. 이상하게도 그 말이 장부보다 무거웠다.", effects: { bond: 9, health: 2 } },
              good: { text: "장부는 재가 되었다. {name}은 마지막 장만 찢어 품에 숨겼다. 언젠가를 위해서였다.", effects: { bond: 3, health: 2 } },
              bad: { text: "타다 만 장부 조각이 굴뚝을 타고 날아가 장터 한복판에 떨어졌다. 브로반의 서명이 반쯤 그을린 채로. 섬은 한동안 그 종잇조각 이야기로 들끓었다.", effects: { trust: -3, health: -4 }, mark: "suspected" }
            } }
        ] },
      { step: 3, id: "offer", age: 18, art: "harbor", title: "퀼 영감의 제안",
        body: "퀼 영감이 {name}을 창고로 불렀다. 네가 뭘 봤는지 다 안다고, 그러니 이제 장부를 직접 맡으라고 했다. 이 섬은 세금이 무거워 밀수 곡식 없이는 겨울을 못 넘긴다고, 위에서 떼어 가는 몫만 빼면 우리도 나쁜 놈들은 아니라고, 영감은 쓴웃음을 지었다.",
        choices: [
          { id: "quit", label: "거절하고 일을 그만둔다", hint: "깨끗한 손은 가난하다",
            check: { stat: "bond", against: 40 }, personality: { empathy: 5, caution: 5 }, mark: "quit",
            outcomes: {
              great: { text: "{name}은 고개를 저었고, 퀼 영감은 의외로 웃었다. 너 같은 애가 하나쯤 있어야 한다며 마지막 품삯에 곡식 한 자루를 얹어 주었다.", effects: { bond: 5, supplies: 4, trust: 3 } },
              good: { text: "일을 그만두자 살림이 빠듯해졌다. 그래도 밤에 잠은 잘 잤다.", effects: { supplies: -3, health: 4, bond: 3 } },
              bad: { text: "영감은 입을 다물라는 뜻으로 {name}의 집 앞에 깨진 상자 하나를 놓고 갔다. 그 뒤로 {name}은 부두 쪽 길을 피해 다녔다.", effects: { trust: -4, health: -4 } }
            } },
          { id: "join", label: "장부를 맡는다", hint: "어른들의 셈법을 배운다",
            check: { stat: "skill", against: 45 }, personality: { ambition: 8, loyalty: 3 }, mark: "joined_ring",
            outcomes: {
              great: { text: "{name}은 장부를 맡자마자 위로 떼어 가던 몫을 몰래 줄이고 그만큼을 곡식으로 바꿔 섬에 풀었다. 브로반은 숫자가 맞지 않는다고 고개를 갸웃했지만 끝내 이유를 찾지 못했다.", effects: { supplies: 7, trust: 6 } },
              good: { text: "주머니는 두둑해졌다. 동시에 {name}의 이름도 장부 맨 끝에 조그맣게 적혔다.", effects: { supplies: 8, trust: -2 } },
              bad: { text: "첫 장부 정리에서 숫자를 틀렸다. 레녹스는 그 실수를 빌미로 {name}의 몫을 몽땅 빼앗고, 그것도 장부에 적어 두었다.", effects: { supplies: -6, trust: -4 } }
            } },
          { id: "seize", label: "장부를 빼앗아 해군 감찰에 넘긴다", hint: "영감까지 다치게 된다",
            check: { stat: "trust", against: 55 }, personality: { empathy: 4, freedom: 5, loyalty: -4 }, mark: "exposed",
            outcomes: {
              great: { text: "{name}은 장부를 감찰관에게 넘기며 퀼 영감은 협조자였다고 증언했다. 브로반과 레녹스는 끌려갔고, 영감은 벌금만 물고 부두에 남았다.", effects: { trust: 11, friendBond: 2 } },
              good: { text: "감찰은 이루어졌지만 퀼 영감도 함께 끌려갔다. 영감은 원망하지 않는다는 쪽지를 남겼다.", effects: { trust: 6, friendBond: -3 } },
              bad: { text: "감찰관이라는 사내는 레녹스의 친구였다. 장부는 사라졌고, 퀼 영감의 창고에 불이 났다.", effects: { trust: -6, supplies: -5 }, mark: "suspected" }
            } }
        ] },

      { step: 4, id: "after_fall", age: 28, art: "legacy", requires: ["exposed"], title: "견장을 뜯긴 사내",
        body: "{name}이 어디에 있든 소문은 바닷바람을 타고 왔다. 그 장부 사건 이후 {home}의 세금은 절반으로 줄었고, 장터 아이들은 장부 놀이를 한다고 했다. 그리고 견장을 뜯긴 레녹스가 해적이 되어 그 시절의 이름들을 하나씩 찾아다닌다는 소문도 함께였다.",
        choices: [
          { id: "warn", label: "고향에 경고 편지를 보낸다", hint: "멀리서도 지킬 수 있을까",
            check: { stat: "trust", against: 45 }, personality: { loyalty: 7, caution: 3 },
            outcomes: {
              great: { text: "편지를 받은 장터 사람들이 부두에 망을 세웠다. 몇 달 뒤 레녹스의 배가 나타났을 때 섬은 이미 등불을 끄고 기다리고 있었고, 배는 그대로 뱃머리를 돌렸다.", effects: { trust: 8, bond: 4 } },
              good: { text: "편지는 닿았다. 양육자는 걱정 말라며 대문에 빗장 하나를 더 달았다고 답했다.", effects: { bond: 4, trust: 2 } },
              bad: { text: "편지가 늦었다. 레녹스는 퀼 영감의 창고를 불태우고 떠났다. 영감은 무사했지만 {name}은 한동안 잠을 설쳤다.", effects: { health: -5, trust: -2 } }
            } },
          { id: "face", label: "레녹스를 직접 찾아 나선다", hint: "과거는 쫓아오기 전에 쫓는다",
            check: { stat: "skill", against: 55 }, personality: { freedom: 6, ambition: 4, caution: -4 },
            outcomes: {
              great: { text: "어느 항구 뒷골목에서 마주친 레녹스는 생각보다 늙어 있었다. {name}이 장부 마지막 장을 내밀자, 레녹스는 한참 웃다가 그걸로 됐다며 술값을 놓고 떠났다.", effects: { skill: 5, health: 3, trust: 4 } },
              good: { text: "레녹스의 배를 찾았지만 이미 다른 해적에게 털린 뒤였다. 빈 배 갑판에 낡은 장부 한 권만 굴러다녔다.", effects: { skill: 3, supplies: 2 } },
              bad: { text: "찾아간 곳은 함정이었다. {name}은 간신히 빠져나왔지만, 그 밤의 칼자국은 오래 남았다.", effects: { health: -10 } }
            } }
        ] },
      { step: 4, id: "bill", age: 30, art: "dangerPrison", requires: ["blackmailed", "joined_ring"], title: "돌아온 청구서",
        body: "어느 날 {name}에게 봉투 하나가 도착했다. 안에는 그 장부의 한 장이 들어 있었다. 맨 아래 조그맣게 적힌 이름은 {name}의 것이었다. 보낸 이의 이름은 없었고, 다음 달 같은 날까지 금화를 준비하라는 쪽지만 있었다.",
        choices: [
          { id: "pay", label: "조용히 돈을 보낸다", hint: "한 번으로 끝날까",
            check: { stat: "supplies", against: 50 }, personality: { caution: 7, ambition: -2 },
            outcomes: {
              great: { text: "돈을 보내자 답장이 왔다. 퀼 영감의 글씨였다. 시험해 봤다고, 이 돈은 섬 아이들 겨울옷이 될 거라고, 그리고 장부는 이제 정말로 태웠다고.", effects: { supplies: -4, trust: 6, friendBond: 4 } },
              good: { text: "청구서는 다시 오지 않았다. 그래도 {name}은 해마다 그 날짜가 되면 우편함을 살폈다.", effects: { supplies: -6, health: 2 } },
              bad: { text: "다음 달에도, 그다음 달에도 봉투가 왔다. 남의 목줄을 쥐었던 손에 이제 목줄이 걸려 있었다.", effects: { supplies: -10, health: -4 } }
            } },
          { id: "confront", label: "봉투의 출처를 추적한다", hint: "우체부는 많은 걸 안다",
            check: { stat: "skill", against: 50 }, personality: { freedom: 6, ambition: 3 },
            outcomes: {
              great: { text: "봉투를 거슬러 올라가 보니 브로반이었다. 몰락한 징세관은 낡은 여관 방에서 그 장 한 장만 붙들고 살고 있었다. {name}은 그 종이를 사들여 그 자리에서 태웠고, 둘 다 이상하게 홀가분해했다.", effects: { skill: 5, health: 4, trust: 3 } },
              good: { text: "출처는 끝내 몰랐다. 대신 장부의 그 장을 손에 넣었고, 이제 그 종이는 {name}의 것이 되었다.", effects: { skill: 3, supplies: -2 } },
              bad: { text: "추적은 소문이 되었고, 소문은 {name}의 옛 이름까지 끌어냈다. 한동안 어디를 가든 수군거림이 따라왔다.", effects: { trust: -8, health: -2 } }
            } }
        ] },
      { step: 4, id: "ash_note", age: 27, art: "harbor", title: "재 속의 쪽지",
        body: "낯선 항구에서 {home} 출신이라는 늙은 짐꾼을 만났다. 퀼 영감이 지난겨울 세상을 떠났다고 했다. 영감이 남긴 상자 하나가 {name}에게 가야 한다며, 짐꾼은 몇 년째 그것을 들고 항구를 떠돌았다고 했다. 상자 이중 바닥 아래 기름종이 꾸러미가 있었다.",
        choices: [
          { id: "open", label: "꾸러미를 풀어 본다", hint: "옛 셈이 아직 남았을까",
            check: { stat: "trust", against: 45 }, personality: { freedom: 5, empathy: 4 },
            outcomes: {
              great: { text: "꾸러미 안에는 영감이 몇십 년 몰래 적어 온 진짜 장부와, 이건 네가 정하라는 쪽지가 있었다. {name}은 그 장부를 섬의 새 조합에 보냈고, 그해 {home}에 처음으로 공정한 세금표가 붙었다.", effects: { trust: 10, bond: 3 } },
              good: { text: "안에는 열다섯 살의 {name}에게 처음 건넸던 것과 똑같은 품삯 봉투 하나와 고맙다는 한 줄이 들어 있었다.", effects: { friendBond: 4, supplies: 3 } },
              bad: { text: "꾸러미는 바닷물에 젖어 글자가 다 번져 있었다. 영감이 남기려던 말은 끝내 알 수 없었다.", effects: { health: -3, friendBond: -3 } }
            } },
          { id: "sea", label: "열지 않고 바다에 띄운다", hint: "어떤 셈은 덮어 둔다",
            check: { stat: "health", against: 40 }, personality: { caution: 6, empathy: 3 },
            outcomes: {
              great: { text: "{name}은 짐꾼과 함께 상자를 띄우고 영감을 위해 술 한 잔을 바다에 부었다. 짐꾼은 영감이 늘 {name} 이야기를 했다며 웃었다.", effects: { health: 4, friendBond: 5 } },
              good: { text: "상자는 파도에 실려 멀어졌다. 열지 않은 것이 옳았는지는 끝내 알 수 없었다.", effects: { health: 2 } },
              bad: { text: "상자는 가라앉지 않고 계속 부두로 밀려 돌아왔다. 세 번째로 돌아왔을 때 {name}은 웃음을 터뜨렸고, 결국 뚜껑을 열지도 버리지도 못한 채 짐에 실었다.", effects: { health: -2, supplies: -3 } }
            } }
        ] }
    ]
  }
];
