import { moveTo, ro, routeFor, yearRoll } from "./world.js";

// Original (non-canon) people who return across one life. Only creation rule 3 uses them, so older saves replay unchanged.
const MATE_NAMES = ["도윈", "세라", "하닉", "비엔", "타샤", "에스카", "로웰", "안시"];
const RIVAL_NAMES = ["그레브", "카르논", "도르크", "제반", "무라크", "헤일", "브란트", "오스칼"];
const WARD_NAMES = ["피오", "누리", "솔", "레아", "티모", "아린"];
const PATH_NAMES = { pirate: "해적", marine: "해군", liberator: "해방 연락망", civilian: "민간 조합" };
const OTHER_PATH = { pirate: "marine", marine: "pirate", liberator: "marine", civilian: "pirate" };

const giant = (life) => life.birth.species === "거인족";
const span = (life, human, giantYears) => giant(life) ? giantYears : human;
const batchim = (word) => { const last = word.codePointAt(word.length - 1); return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0; };
const ig = (word) => `${word}${batchim(word) ? "이" : "가"}`;
const eun = (word) => `${word}${batchim(word) ? "은" : "는"}`;
const gwa = (word) => `${word}${batchim(word) ? "과" : "와"}`;
const eul = (word) => `${word}${batchim(word) ? "을" : "를"}`;
const pick = (list, life, salt) => list[yearRoll(life.seed ^ salt, 7) % list.length];
// Deterministic so a save replays to the same outcome; the player only sees the odds as a hint.
const lucky = (life, salt, percent) => yearRoll(life.seed ^ salt, life.age) % 100 < percent;
const opposed = (a, b) => (a === "pirate" && b === "marine") || (a === "marine" && b === "pirate");
const fightPower = (life) => life.skill / 2 + life.haki.armament * 12 + life.haki.observation * 8 + life.haki.conqueror * 15 + (life.devilFruit ? 8 : 0);

const BEATS = [
  {
    id: "life_people_mate_meet", when: (life, age) => !life.people.mate
      && age >= span(life, 8, 45) + (life.creationVersion >= 9 ? yearRoll(life.seed ^ 0x51d2, 1) % span(life, 6, 30) : 0) && age < span(life, 18, 105),
    scene: (life) => {
      const name = pick(MATE_NAMES, life, 0x11);
      const dream = pick(routeFor(life).slice(3).filter((place) => !life.birth.home.includes(place)), life, 0x12);
      return { art: "deck", title: "같은 부두의 또래", body: `${ig(name)} 같은 부두에서 일을 배우기 시작했다. 둘은 해가 질 때까지 밧줄을 감으며 언젠가 ${dream}까지 가 보자는 이야기를 했다.`, choices: [
        { id: "promise", label: "꼭 같이 가자고 약속한다", risk: "오래 남을 약속 · 친구와의 유대 +10", personality: { loyalty: 6, empathy: 3 },
          apply: (state) => { state.friendName = name; state.people.mate = { name, bond: 60, fate: "곁" }; state.people.promise = { place: dream, kind: "약속" }; state.friendBond += 10; return `${gwa(name)} 새끼손가락을 걸었다. ${dream}${batchim(dream) ? "이라는" : "라는"} 이름이 둘만의 암호가 됐다.`; } },
        { id: "race", label: "먼저 닿는 쪽이 이긴다고 한다", risk: "경쟁심이 생김 · 기술 +10", personality: { ambition: 6, freedom: 3 },
          apply: (state) => { state.friendName = name; state.people.mate = { name, bond: 45, fate: "곁" }; state.people.promise = { place: dream, kind: "내기" }; state.skill += 10; return `${eun(name)} 지지 않겠다며 웃었다. 그날부터 둘은 누가 더 빨리 매듭을 묶는지 겨뤘다.`; } }
      ] };
    }
  },
  {
    id: "life_people_mate_path", when: (life, age) => life.people.mate && life.path && age >= life.careerStartAge,
    scene: (life) => {
      const { name } = life.people.mate;
      const other = OTHER_PATH[life.path];
      return { art: "deck", title: "갈림길의 친구", body: `${life.affiliation}에 자리를 얻었다는 소식을 들은 ${ig(name)} 찾아왔다. ${name}에게도 ${PATH_NAMES[other]} 쪽의 제안이 와 있었다.`, choices: [
        { id: "invite", label: "같은 길로 가자고 설득한다", risk: "설득은 그동안의 유대에 달림 · 결과는 알 수 없음", personality: { loyalty: 5, ambition: 3 },
          apply: (state) => {
            const mate = state.people.mate;
            if (lucky(state, 0x21, mate.bond + (state.friendBond - 40) / 2)) { mate.together = true; mate.path = state.path; mate.bond += 10; return `${ig(name)} 한참 망설이다 짐을 챙겼다. 둘은 같은 깃발 아래에서 일하게 됐다.`; }
            mate.path = other; mate.fate = "다른 길"; mate.bond -= 10; return `${eun(name)} 고개를 저었다. 서운한 말을 남긴 채 ${PATH_NAMES[other]}의 배에 올랐다.`;
          } },
        { id: "bless", label: "각자의 길을 응원한다", risk: "서로 다른 소속 · 우정은 남음", personality: { empathy: 5, freedom: 4 },
          apply: (state) => { const mate = state.people.mate; mate.path = other; mate.fate = "다른 길"; mate.bond += 10; return `${gwa(name)} 서로의 첫 항해를 축하했다. 다음에 만날 때는 다른 옷을 입고 있을 터였다.`; } }
      ] };
    }
  },
  {
    id: "life_people_mate_crisis", when: (life, age) => ["곁", "다른 길"].includes(life.people.mate?.fate) && life.seen.includes("life_people_mate_path")
      && age >= span(life, 30, 165) && age >= life.careerStartAge + span(life, 7, 35),
    scene: (life) => {
      const mate = life.people.mate;
      const name = mate.name;
      if (mate.together) return { art: "lifeStorm", title: "돌아오지 않은 동료", body: `물자를 구하러 나간 ${ig(name)} 다른 선단에 붙잡혔다는 말이 들려왔다. 쪽지에는 몸값과 날짜만 적혀 있었다.`, choices: [
        { id: "raid", label: "직접 구하러 간다", needs: { health: 40 }, risk: "건강 40 필요 · 기술과 패기가 변수 · 실패하면 크게 다침", personality: { loyalty: 8, caution: -6 },
          apply: (state) => {
            if (lucky(state, 0x31, 25 + fightPower(state))) { state.people.mate.bond += 20; state.trust += 10; state.health -= 10; return `밤을 틈타 갑판에 올라 ${eul(name)} 데리고 나왔다. 상처는 남았지만 둘 다 살아 돌아왔다.`; }
            state.health -= 25; state.people.mate.bond += 10; return `잠입은 들켰다. 크게 다친 채 물러났고, 며칠 뒤 ${ig(name)} 스스로 탈출해 돌아왔다.`;
          } },
        { id: "ransom", label: "몸값을 마련해 낸다", cost: 30, risk: "물자 -30 · 확실하지만 비쌈", personality: { caution: 6, loyalty: 5 },
          apply: (state) => { state.supplies -= 30; state.people.mate.bond += 10; return `몸값을 건네자 ${ig(name)} 풀려났다. 텅 빈 창고를 보며 둘은 오래 말이 없었다.`; } },
        { id: "wait", label: "조직의 판단을 기다린다", risk: "기다리는 동안 무슨 일이 생길지 모름", personality: { caution: 7, loyalty: -6 },
          apply: (state) => {
            if (lucky(state, 0x32, 40)) { state.people.mate.bond -= 30; return `${ig(name)} 혼자 힘으로 빠져나왔다. 돌아와서는 기다리기만 한 이유를 묻지 않았다.`; }
            state.people.mate.fate = "잃음"; state.friendBond -= 20; return `조직의 배가 닿았을 때 그 선단은 이미 떠난 뒤였다. ${name}의 소식은 그 뒤로 끊겼다.`;
          } }
      ] };
      if (opposed(life.path, mate.path)) return { art: "lifeStorm", title: "맞은편 갑판의 얼굴", body: `검문 중 마주친 배에 ${ig(name)} 타고 있었다. ${PATH_NAMES[mate.path]}의 옷을 입은 오랜 친구는 ${eul(life.birth.name)} 알아보고도 먼저 입을 열지 않았다.`, choices: [
        { id: "release", label: "못 본 척 길을 터 준다", risk: "들키면 소속의 신뢰를 잃음", personality: { empathy: 6, loyalty: 4 },
          apply: (state) => {
            state.people.mate.bond += 20;
            if (lucky(state, 0x33, 55)) return `${name}의 배가 시야에서 사라질 때까지 아무도 묻지 않았다.`;
            state.trust -= 20; state.injustice = true; return `누군가 그 장면을 보고 보고서를 올렸다. ${state.affiliation}에서 의심하는 눈길이 늘었다.`;
          } },
        { id: "talk", label: "옛 약속을 꺼내 말을 건다", risk: "대답은 유대에 달림 · 결과는 알 수 없음", personality: { empathy: 5, freedom: 5 },
          apply: (state) => {
            const current = state.people.mate;
            if (lucky(state, 0x34, current.bond)) { current.fate = "곁"; current.together = true; current.path = state.path; state.friendBond += 10; return `${ig(name)} 그날 밤 소속을 버리고 넘어왔다. 오래 접어 둔 약속이 다시 펴졌다.`; }
            current.bond -= 10; return `${eun(name)} 짧게 웃고 고개를 돌렸다. 다음에 만나면 봐주지 않겠다는 말이 남았다.`;
          } },
        { id: "duty", label: "맡은 일대로 맞선다", risk: "옛 친구와 등을 돌림 · 지역의 신뢰 +10", personality: { loyalty: -4, ambition: 6 },
          apply: (state) => { state.people.mate.fate = "적"; state.people.mate.bond = 0; state.trust += 10; return `두 배는 서로에게 포를 겨눴다. ${eun(name)} 끝까지 이름을 부르지 않았다.`; } }
      ] };
      return { art: "workbench", title: "멀리서 온 부탁", body: `${name}에게서 편지가 왔다. 일하던 배가 부서져 다음 계절까지 버틸 물자가 모자란다는 내용이었다.`, choices: [
        { id: "send", label: "물자를 나눠 보낸다", cost: 20, risk: "물자 -20 · 친구와의 유대 +10", personality: { empathy: 7, loyalty: 5 },
          apply: (state) => { state.supplies -= 20; state.friendBond += 10; state.people.mate.bond += 20; return `짐을 실어 보낸 지 두 달 뒤, ${name}의 짧은 감사 편지가 왔다.`; } },
        { id: "reply", label: "안부만 적어 보낸다", risk: "유대가 식을 수 있음", personality: { caution: 5 },
          apply: (state) => { state.people.mate.bond -= 15; return `답장을 보냈지만 ${name}에게서는 한동안 소식이 없었다.`; } }
      ] };
    }
  },
  {
    id: "life_people_mate_reunion", when: (life, age) => life.people.mate && life.people.mate.fate !== "잃음" && life.seen.includes("life_people_mate_crisis") && age >= span(life, 58, 300),
    scene: (life) => {
      const mate = life.people.mate;
      const name = mate.name;
      const body = mate.fate === "적" ? `${ig(name)} 보낸 짧은 편지가 닿았다. 그날 바다에서 서로 등을 돌린 일을 아직 기억한다고 적혀 있었다.`
        : mate.together ? `${gwa(name)} 같은 배에서 보낸 세월이 길어졌다. 둘의 손등에는 같은 밧줄이 남긴 흉터가 있었다.`
          : `오랜만에 ${ig(name)} 항구에 들렀다. 서로 다른 깃발 아래서 늙어 간 얼굴이 한눈에 들어왔다.`;
      return { art: "deck", title: "늦은 저녁의 손님", body, choices: [
        { id: "reach", label: "먼저 손을 내민다", risk: "지난 일이 풀릴지는 알 수 없음", personality: { empathy: 6, loyalty: 5 },
          apply: (state) => {
            const current = state.people.mate;
            if (lucky(state, 0x41, current.fate === "적" ? 35 : current.bond + 20)) {
              if (current.fate === "적") current.fate = "화해";
              current.bond += 20; state.friendBond += 10; return `밤이 깊도록 이야기가 이어졌다. ${eun(name)} 오래 미뤄 둔 말을 꺼냈다.`;
            }
            return `대화는 날씨와 배 이야기에서 맴돌았다. ${eun(name)} 다음 물때에 맞춰 떠났다.`;
          } },
        { id: "bury", label: "지난 일은 묻어 둔다", risk: "현재 관계 유지 · 건강 +10", personality: { caution: 6 },
          apply: (state) => { state.health += 10; return "깊은 이야기는 하지 않았다. 대신 같은 식탁에서 천천히 밥을 먹었다."; } }
      ] };
    }
  },
  {
    id: "life_people_promise", when: (life, age) => life.people.promise && age >= span(life, 66, 330),
    scene: (life) => {
      const { place, kind } = life.people.promise;
      const name = life.people.mate.name;
      const lost = life.people.mate.fate === "잃음";
      if (life.travelHistory.includes(place)) return { art: "workbench", title: "지켜진 약속", body: `어릴 적 ${gwa(name)} ${kind === "약속" ? "약속한" : "내기한"} ${place}에 실제로 닿았던 날이 떠올랐다. ${life.people.mate.together ? "그날 곁에는 그 친구도 있었다." : lost ? "그 친구는 끝내 그곳을 보지 못했다." : "그 친구는 그때 다른 바다에 있었다."}`,
        after: (state) => { state.friendBond += 10; return kind === "약속" ? "약속의 반은 지킨 셈이었다." : "내기는 이긴 셈이었지만 자랑할 사람이 곁에 있어야 했다."; } };
      return { art: "deck", title: "가 보지 못한 바다", body: `어릴 적 ${gwa(name)} 말한 ${eul(place)} 아직 가 보지 못했다. ${lost ? "이제 그 이름을 함께 기억할 사람도 없었다." : "그 친구도 그 약속을 기억하고 있을지 궁금했다."}`, choices: [
        { id: "go", label: `늦게라도 ${ro(place)} 떠난다`, cost: 20, needs: { health: 30 }, risk: "물자 -20 · 건강 30 필요 · 몸에 무리가 감", personality: { freedom: 7, loyalty: 6 },
          apply: (state) => { state.supplies -= 20; state.health -= 10; moveTo(state, place); return `긴 항해 끝에 ${place}의 해안이 보였다. ${lost ? `${name}의 이름을 바다에 대고 불렀다.` : `${name}에게 보낼 편지 첫 줄을 그 자리에서 썼다.`}`; } },
        { id: "write", label: "약속을 기록으로 남긴다", risk: "떠나지 않음 · 후배가 읽을 수 있음", personality: { caution: 5 },
          apply: () => { return "일지 맨 뒤에 그 바다의 이름을 적었다. 누군가는 대신 가 줄지도 몰랐다."; } }
      ] };
    }
  },
  {
    id: "life_people_rival_name", when: (life) => life.rival && !life.people.rival,
    scene: (life) => {
      const name = pick(RIVAL_NAMES, life, 0x51);
      return { art: "lifeStorm", title: "기억해 둘 이름", body: `${eun(life.birth.name)} 척을 진 선단의 앞줄에 늘 같은 선원이 서 있다는 걸 알았다. 항구 사람들은 그 선원을 ${ro(name)} 불렀다.`,
        after: (state) => { state.people.rival = { name, heat: 1, fate: "적", since: state.age + 1 }; return `${name}의 이름이 일지에 처음 적혔다.`; } };
    }
  },
  {
    id: "life_people_rival_rise", when: (life, age) => life.people.rival?.fate === "적" && age >= life.people.rival.since + span(life, 6, 30),
    scene: (life) => {
      const { name } = life.people.rival;
      return { art: "deck", title: "커지는 선단", body: `${name}의 선단이 몇 척 더 늘었다는 소식이 들렸다. 지나는 항구마다 ${life.birth.name}의 행방을 묻고 다닌다는 말도 함께였다.`, choices: [
        { id: "prepare", label: "배와 동료를 단단히 준비한다", cost: 10, risk: "물자 -10 · 다음 충돌에 대비", personality: { caution: 6, loyalty: 3 },
          apply: (state) => { state.supplies -= 10; state.skill += 10; state.people.rival.ready = true; return "약한 판자를 갈고 신호 순서를 다시 맞췄다."; } },
        { id: "envoy", label: "중간 사람을 통해 화해를 청한다", risk: "답은 지역의 신뢰에 달림 · 결과는 알 수 없음", personality: { empathy: 6, caution: 4 },
          apply: (state) => {
            if (lucky(state, 0x52, 20 + state.trust / 3)) { state.people.rival.fate = "휴전"; state.rival = false; return `${eun(name)} 조건을 붙여 휴전을 받아들였다. 서로의 항로를 피하기로 했다.`; }
            state.people.rival.heat += 1; return "답 대신 찢긴 편지가 돌아왔다.";
          } },
        { id: "ignore", label: "신경 쓰지 않고 일을 이어 간다", risk: "물자 +10 · 원한은 그대로", personality: { freedom: 5, caution: -3 },
          apply: (state) => { state.supplies += 10; state.people.rival.heat += 1; return "소문은 소문일 뿐이라고 넘겼다."; } }
      ] };
    }
  },
  {
    id: "life_people_rival_clash", when: (life, age) => life.people.rival?.fate === "적" && life.seen.includes("life_people_rival_rise") && age >= life.people.rival.since + span(life, 15, 75),
    scene: (life) => {
      const { name } = life.people.rival;
      const odds = (state) => 15 + fightPower(state) + (state.people.rival.ready ? 15 : 0) - state.people.rival.heat * 5;
      return { art: "lifeStorm", title: "물러설 곳 없는 해협", body: `좁은 해협에서 ${name}의 배가 앞을 막았다. 이번에는 돌아갈 물길도 없었다. ${eun(name)} 오래된 셈을 끝내자고 외쳤다.`, choices: [
        { id: "fight", label: "동료와 함께 정면으로 맞선다", needs: { health: 30 }, risk: "건강 30 필요 · 기술·패기·준비가 변수 · 결과는 알 수 없음", personality: { ambition: 7, loyalty: 5 },
          apply: (state) => {
            if (lucky(state, 0x53, odds(state))) { state.people.rival.fate = "패배"; state.rival = false; state.trust += 10; state.health -= 10; return `${name}의 돛대가 꺾였다. 상대 선단은 깃발을 내리고 물러났다.`; }
            state.health -= 30; state.supplies -= 20; state.people.rival.heat += 1; return "배가 크게 부서졌다. 짙은 안개 덕분에 간신히 빠져나왔다.";
          } },
        { id: "duel", label: "일대일 승부를 청한다", needs: { health: 50 }, failRisk: "건강 -40", fail: (state) => { state.health -= 40; return "몸이 따라 주지 않았다. 승부는 시작하자마자 끝났다."; }, risk: "건강 50 필요 · 이기면 동료가 다치지 않음 · 지면 크게 다침", personality: { ambition: 8, empathy: 4 },
          apply: (state) => {
            if (lucky(state, 0x54, odds(state) + 5)) { state.people.rival.fate = "존중"; state.rival = false; state.trust += 10; return `승부가 끝나자 ${eun(name)} 무기를 거두고 고개를 숙였다. 원한은 다른 무엇으로 바뀌었다.`; }
            state.health -= 40; state.people.rival.heat += 1; return `${name}의 일격에 쓰러졌다. 동료들이 몸을 끌고 배로 돌아왔다.`;
          } },
        { id: "yield", label: "물자를 넘기고 길을 산다", cost: 30, risk: "물자 -30 · 지역의 신뢰 -10 · 싸움은 피함", personality: { caution: 8, ambition: -5 },
          apply: (state) => { state.supplies -= 30; state.trust -= 10; state.people.rival.heat = 0; return `${eun(name)} 짐을 받아 들고 비웃으며 길을 열었다.`; } }
      ] };
    }
  },
  {
    id: "life_people_rival_storm", when: (life, age) => life.people.rival && life.people.rival.fate !== "바다에 잠김" && life.seen.includes("life_people_rival_rise") && age >= span(life, 56, 285) && !life.homebound,
    scene: (life) => {
      const { name } = life.people.rival;
      return { art: "lifeStorm", title: "가라앉는 깃발", body: `폭풍이 지난 바다에 ${name}의 배가 반쯤 잠겨 있었다. 갑판 위에서 손을 흔드는 사람들 사이에 ${name}도 있었다.`, choices: [
        { id: "save", label: "밧줄을 던져 끌어올린다", cost: 10, risk: "물자 -10 · 거친 물살 · 결과는 알 수 없음", personality: { empathy: 9, loyalty: 3 },
          apply: (state) => {
            state.supplies -= 10;
            if (lucky(state, 0x55, 45 + state.skill / 2)) { state.people.rival.fate = "빚진 사람"; state.rival = false; state.trust += 10; return `젖은 손으로 밧줄을 붙잡은 ${eun(name)} 갑판에 올라와 한참 숨만 몰아쉬었다.`; }
            state.health -= 10; state.people.rival.fate = "바다에 잠김"; return "밧줄은 닿았지만 파도가 더 빨랐다. 배는 수면 아래로 사라졌다.";
          } },
        { id: "pass", label: "못 본 척 지나간다", risk: "아무도 모를 선택", personality: { empathy: -9, caution: 5 },
          apply: (state) => { state.people.rival.fate = "바다에 잠김"; return "뒤돌아보지 않았다. 그날 밤 꿈에서 손을 흔드는 사람들을 보았다."; } }
      ] };
    }
  },
  {
    id: "life_people_rival_debt", when: (life, age) => ["빚진 사람", "존중", "휴전"].includes(life.people.rival?.fate) && age >= span(life, 68, 335),
    scene: (life) => {
      const { name, fate } = life.people.rival;
      return { art: "workbench", title: "옛 적의 방문", body: fate === "빚진 사람"
        ? `${ig(name)} 약품과 식량을 실은 작은 배를 끌고 찾아왔다. 바다에서 진 빚은 바다의 방식으로 갚는다고 했다.`
        : `${ig(name)} 늙은 몸으로 항구에 내렸다. 한때 서로를 쫓던 둘은 이제 같은 날씨를 걱정했다.`,
        after: (state) => { if (fate === "빚진 사람") { state.supplies += 20; state.health += 10; } else state.friendBond += 10; return `${gwa(name)} 지난 항로를 놓고 밤늦게까지 이야기했다.`; } };
    }
  },
  {
    id: "life_people_ward_meet", when: (life, age) => !life.people.ward && life.path && age >= span(life, 27, 145) && age >= life.careerStartAge + 2,
    scene: (life) => {
      const name = pick(WARD_NAMES, life, 0x61);
      return { art: "deck", title: "짐 사이의 아이", body: `${life.location}의 부두에서 의지할 데 없는 아이 ${ig(name)} 짐 사이에 숨어 있었다. 배가 떠나면 아이를 돌볼 사람은 아무도 없어 보였다.`, choices: [
        { id: "take", label: "데려가 일을 가르친다", cost: 10, risk: "물자 -10 · 오래 책임질 사람이 생김", personality: { empathy: 8, loyalty: 5 },
          apply: (state) => { state.supplies -= 10; state.people.ward = { name, bond: 60, fate: "곁", since: state.age + 1 }; return `${eun(name)} 처음 며칠 아무 말도 하지 않다가, 어느 날 매듭 묶는 법을 물었다.`; } },
        { id: "shelter", label: "믿을 만한 집에 맡긴다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 5, caution: 5 },
          apply: (state) => { state.supplies -= 10; state.trust += 10; state.people.ward = { name, bond: 40, fate: "맡김", since: state.age + 1 }; return `항구의 오래된 집에 ${eul(name)} 맡기고 다음 계절의 물자를 남겼다.`; } },
        { id: "leave", label: "가던 길을 간다", risk: "아무 일도 일어나지 않을지 모름", personality: { empathy: -6, caution: 4 },
          apply: (state) => { state.people.ward = { name, bond: 0, fate: "지나침", since: state.age + 1 }; return "출항 시간을 지켰다. 부두의 작은 그림자는 금세 멀어졌다."; } }
      ] };
    }
  },
  {
    id: "life_people_ward_return", when: (life, age) => life.people.ward && age >= life.people.ward.since + span(life, 14, 60),
    scene: (life) => {
      const ward = life.people.ward;
      const name = ward.name;
      if (ward.bond === 0) return { art: "deck", title: "기억하는 얼굴", body: `항구의 젊은 일꾼이 ${eul(life.birth.name)} 알아보았다. 오래전 부두에서 지나친 아이, ${name}${batchim(name) ? "이었다" : "였다"}. 혼자 견딘 세월을 담담히 말했다.`, choices: [
        { id: "apologize", label: "그날의 일을 사과한다", risk: "용서받을지는 알 수 없음", personality: { empathy: 7, loyalty: 4 },
          apply: (state) => { if (lucky(state, 0x62, 50)) { state.people.ward.fate = "용서"; state.trust += 10; return `${eun(name)} 오래 말이 없다가, 다음 배의 일손이 필요하냐고 물었다.`; } state.people.ward.fate = "원망"; return `${eun(name)} 사과를 듣고도 등을 돌렸다.`; } },
        { id: "walk", label: "모른 척 지나간다", risk: "현재 관계 유지", personality: { caution: 5, empathy: -4 },
          apply: (state) => { state.people.ward.fate = "원망"; return "다시 한 번 그 아이를 지나쳤다."; } }
      ] };
      if (life.path === "pirate" && !life.retired && ward.bond < 60) return { art: "lifeStorm", title: "쫓는 쪽의 얼굴", body: `해군 함선의 갑판에 ${ig(name)} 서 있었다. 오래전 부두에서 맡겨 둔 아이가 이제 ${life.birth.name}의 배를 쫓는 장교가 되어 있었다.`, choices: [
        { id: "plead", label: "배를 세우고 말을 건다", risk: "옛정이 통할지는 알 수 없음", personality: { empathy: 6, caution: -3 },
          apply: (state) => { if (lucky(state, 0x63, state.people.ward.bond + 20)) { state.people.ward.fate = "놓아줌"; return `${eun(name)} 경례하듯 손을 들고 포를 거두게 했다. 보고서에는 놓쳤다고 적힐 것이었다.`; } state.people.ward.fate = "추적자"; state.health -= 20; return `${eun(name)} 망설이지 않았다. 포화를 뚫고 간신히 달아났다.`; } },
        { id: "flee", label: "전속력으로 달아난다", risk: "기술이 변수 · 실패하면 배가 상함", personality: { freedom: 6 },
          apply: (state) => { state.people.ward.fate = "추적자"; if (lucky(state, 0x64, 30 + state.skill / 2)) return "물길을 아는 쪽이 이겼다. 함선은 수평선 너머로 작아졌다."; state.supplies -= 20; return "돛 하나가 찢긴 채 겨우 빠져나왔다."; } }
      ] };
      return { art: "deck", title: "자라서 온 아이", body: `${ig(name)} 어른이 되어 찾아왔다. 배운 매듭을 아직 기억한다며 ${life.birth.name}의 곁에서 일하고 싶다고 했다.`, choices: [
        { id: "accept", label: "곁에 두고 모든 것을 가르친다", risk: "후계자가 생김 · 친구와의 유대 +10", personality: { loyalty: 6, empathy: 5 },
          apply: (state) => { state.people.ward.fate = "후계"; state.successor = true; state.friendBond += 10; return `${eun(name)} 그날부터 장부의 절반을 맡았다.`; } },
        { id: "own", label: "자기 길을 가라고 한다", risk: "지역의 신뢰 +10 · 각자의 바다", personality: { freedom: 6, empathy: 4 },
          apply: (state) => { state.people.ward.fate = "자기 길"; state.trust += 10; return `${eun(name)} 서운해하면서도 웃었다. 몇 해 뒤 다른 항구에서 좋은 선원이 됐다는 소식이 왔다.`; } }
      ] };
    }
  },
  {
    id: "life_people_branch_trial", when: (life, age) => life.worldBranch && age >= life.people.branchAge + 1,
    scene: (life) => {
      const kind = life.worldBranch;
      const text = {
        emperor: ["경계를 시험하는 배", "사황이라는 이름이 붙은 뒤 깃발 아래로 모이는 배가 늘었다. 다른 세력은 새 영역의 경계가 얼마나 단단한지 시험하려 들었다.", "맞서서 영역을 지킨다", "섬 몇 곳을 내주고 협상한다"],
        admiral: ["서명란이 빈 명령서", "대장에게 한 섬의 주민을 통째로 옮기고 흔적을 지우라는 명령서가 왔다. 이유는 적혀 있지 않았고 서명란은 비어 있었다.", "명령을 거부하고 이유를 묻는다", "명령을 따르되 주민을 먼저 피신시킨다"],
        commander: ["군대장의 첫 작전", "새 군대장에게 한 왕국의 탈출로를 여는 작전이 맡겨졌다. 실패하면 연락망 전체가 드러날 수 있었다.", "직접 선두에 선다", "작전을 미루고 연락망을 다시 다진다"]
      }[kind];
      return { art: "lifeStorm", title: text[0], body: text[1], choices: [
        { id: "bold", label: text[2], risk: "기술과 신뢰가 변수 · 결과는 알 수 없음", personality: { ambition: 6, loyalty: 5 },
          apply: (state) => {
            if (lucky(state, 0x71, 20 + state.skill / 3 + state.trust / 3)) { state.people.branchHeld = true; state.trust += 10; return "그 일로 새 세계선의 이름이 더 단단해졌다. 원작에서는 없었던 기록이 신문에 실렸다."; }
            state.people.branchHeld = false; state.health -= 20; state.trust -= 10; return "버텼지만 대가가 컸다. 새 자리를 의심하는 목소리가 커졌다.";
          } },
        { id: "careful", label: text[3], risk: "확실하지만 이름의 무게가 줄어듦 · 물자 -10", cost: 10, personality: { caution: 7, empathy: 4 },
          apply: (state) => { state.supplies -= 10; state.people.branchHeld = true; return "큰 소리를 내지 않고 일을 마쳤다. 따르는 사람들은 그 방식을 기억했다."; } }
      ] };
    }
  },
  {
    id: "life_people_branch_legacy", when: (life, age) => life.worldBranch && life.seen.includes("life_people_branch_trial") && age >= life.people.branchAge + span(life, 4, 15),
    scene: (life) => {
      const held = life.people.branchHeld;
      const seat = { emperor: "사황", admiral: "해군 대장", commander: "혁명군 군대장" }[life.worldBranch];
      return { art: "workbench", title: "달라진 세계선", body: held
        ? `${seat} ${life.birth.name}의 이름은 몇 해가 지나도 바다의 신문에서 사라지지 않았다. 원작과 다른 이 세계에서는 그 자리를 중심으로 항로가 다시 그려졌다.`
        : `${seat}의 자리는 생각보다 무거웠다. 이름은 남았지만 그 자리를 노리는 사람들의 움직임이 원작과는 다른 혼란을 낳았다.`,
        after: (state) => { state.trust += held ? 10 : 0; return "IF 세계선의 이후가 생애 일지에 남았다."; } };
    }
  }
];

export function personalBeat(life, age, base) {
  if (life.creationVersion < 3 || life.ending) return null;
  const beat = BEATS.find((entry) => !life.seen.includes(entry.id) && entry.when(life, age));
  return beat ? { ...base, id: beat.id, ...beat.scene(life) } : null;
}

const MATE_FATES = { 곁: "끝까지 곁에 있던 동료", "다른 길": "다른 깃발 아래의 친구", 적: "등을 돌린 옛 친구", 화해: "늦게 화해한 옛 친구", 잃음: "바다에서 잃은 동료" };
const RIVAL_FATES = { 적: "끝내 풀지 못한 원한", 휴전: "휴전한 맞수", 패배: "물리친 맞수", 존중: "승부를 인정한 맞수", "빚진 사람": "목숨을 구해 준 맞수", "바다에 잠김": "바다에 잠긴 맞수" };
const WARD_FATES = { 곁: "데려온 아이", 맡김: "맡겨 둔 아이", 지나침: "지나친 아이", 후계: "뒤를 이은 아이", "자기 길": "자기 길을 간 아이", 용서: "늦게 용서해 준 아이", 원망: "끝내 등을 돌린 아이", 놓아줌: "쫓다가 놓아준 아이", 추적자: "쫓는 쪽이 된 아이" };

export function peopleSummary(life) {
  const { mate, rival, ward } = life.people || {};
  return [mate && `${mate.name}: ${mate.together && mate.fate === "곁" ? "끝까지 같은 배를 탄 동료" : MATE_FATES[mate.fate]}`,
    rival && `${rival.name}: ${RIVAL_FATES[rival.fate]}`, ward && `${ward.name}: ${WARD_FATES[ward.fate]}`].filter(Boolean).join(" · ");
}
