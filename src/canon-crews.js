// Rule 15: named crews and organizations show their canon people when the era fits, and a named crew
// only takes a life in after some earlier contact with its people.
import { yearRoll } from "./world.js";
import { rollTier } from "./fates.js";

// from/to are years before the original present, inclusive. Roles are what the protagonist would see.
const P = (name, role, from, to = 0) => ({ name, role, from, to });
export const ROSTERS = {
  "로저 해적단": [P("골 D. 로저", "선장", 30, 25), P("실버즈 레일리", "부선장", 30, 25), P("스코퍼 가반", "간부", 30, 25),
    P("코즈키 오뎅", "객원 선원", 27, 25), P("크로커스", "선의", 29, 25), P("샹크스", "견습 선원", 30, 25), P("버기", "견습 선원", 30, 25)],
  "흰 수염 해적단": [P("에드워드 뉴게이트", "선장", 60, 2), P("마르코", "1번대 대장", 40, 2), P("포트거스 D. 에이스", "2번대 대장", 4, 2),
    P("죠즈", "3번대 대장", 30, 2), P("비스타", "5번대 대장", 35, 2), P("이조", "16번대 대장", 22, 2), P("마셜 D. 티치", "2번대 대원", 26, 3)],
  "빅 맘 해적단": [P("샬롯 링링", "선장", 60, 0), P("샬롯 페로스페로", "장남", 40, 0), P("샬롯 카타쿠리", "스위트 3장성", 28, 0),
    P("샬롯 스무디", "스위트 3장성", 25, 0), P("샬롯 크래커", "스위트 3장성", 22, 0), P("슈트로이젠", "요리장", 60, 0)],
  "백수 해적단": [P("카이도", "총독", 30, 1), P("킹", "대간부", 25, 1), P("퀸", "대간부", 25, 1), P("잭", "대간부", 12, 1)],
  "붉은 머리 해적단": [P("샹크스", "선장", 20, 0), P("벤 베크만", "부선장", 20, 0), P("라키 루", "간부", 20, 0), P("야솝", "저격수", 13, 0)],
  "태양 해적단": [P("피셔 타이거", "선장", 15, 12), P("징베", "간부", 15, 12), P("아론", "간부", 15, 12), P("아라딘", "선의", 15, 12)],
  "밀짚모자 일당": [P("몽키 D. 루피", "선장", 2, 0), P("롤로노아 조로", "전투원", 2, 0), P("나미", "항해사", 2, 0), P("우솝", "저격수", 2, 0),
    P("상디", "요리사", 2, 0), P("토니토니 쵸파", "선의", 2, 0), P("니코 로빈", "고고학자", 2, 0), P("프랑키", "조선공", 2, 0),
    P("브룩", "음악가", 2, 0), P("징베", "조타수", 1, 0)],
  해군: [P("콩", "해군 원수", 60, 23), P("센고쿠", "해군 원수", 22, 3), P("사카즈키", "해군 원수", 2, 0),
    P("몽키 D. 가프", "본부 중장", 60, 0), P("츠루", "본부 중장", 60, 0), P("쿠잔", "해군 대장", 25, 3), P("볼사리노", "해군 대장", 25, 0),
    P("잇쇼", "해군 대장", 2, 0), P("스모커", "본부 대령", 8, 0)],
  혁명군: [P("몽키 D. 드래곤", "총사령관", 22, 0), P("사보", "참모총장", 10, 0), P("바솔로뮤 쿠마", "간부", 22, 3),
    P("코알라", "어인 공수도 사범", 10, 0), P("벨로 베티", "동군 군대장", 6, 0), P("린드버그", "남군 군대장", 6, 0)]
};

const PAIRS = { 이: ["이", "가"], 은: ["은", "는"], 과: ["과", "와"] };
function withParticle(name, particle) {
  const last = name.codePointAt(name.length - 1);
  const batchim = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
  return name + PAIRS[particle][batchim ? 0 : 1];
}

const before = (life, age = life.age) => life.birth.yearsBeforeCurrent - age;
const inEra = (life, person) => before(life) <= person.from && before(life) >= person.to;

// Canon names around the protagonist, top of the organization first; empty when the era has none.
export function rosterFor(life, size) {
  const list = ROSTERS[life.canonCrew || life.affiliation] || (life.path === "marine" ? ROSTERS.해군 : null);
  if (!list) return [];
  const present = list.filter((person) => inEra(life, person));
  // A low-ranked marine only knows the fleet admiral and one famous name by reputation.
  if (life.path === "marine" && !life.canonCrew) return present.slice(0, life.rankTier >= 4 ? 3 : life.rankTier >= 2 ? 2 : 1);
  return present.slice(0, size);
}

// Contacts from rule 13's canon meetings count as a tie to the crew they belong to.
const CONTACT_CREW = { ace: "흰 수염 해적단", bigMom: "빅 맘 해적단", jinbe: "태양 해적단" };
const STRAW_HATS = ["luffy", "zoro", "usopp", "sanji", "chopper", "robin", "franky", "brook", "jinbe"];

export function crewTie(life, crew) {
  const contacts = life.people?.canonContacts || {};
  if (crew === "밀짚모자 일당") return STRAW_HATS.reduce((sum, key) => sum + Math.max(0, contacts[key]?.score || 0), 0) >= 30 ? 1 : 0;
  const met = Object.entries(CONTACT_CREW).some(([key, name]) => name === crew && (contacts[key]?.score || 0) > 0);
  return (life.people?.crewTies?.[crew] || 0) + (met ? 1 : 0);
}

const CONTACT_PLACES = ["기항지의 술집", "보급항의 부두", "폭풍을 피한 만", "물물교환 장터", "수리 중인 조선소 옆"];

const CONTACT_CHOICES = [
  { id: "crew_help", label: "그들의 짐 싣는 일을 거든다", hint: "손이 모자라 보인다", check: { stat: "trust", against: 40 },
    personality: { empathy: 5, loyalty: 3 }, tie: { great: 2, good: 1, bad: 0 },
    outcomes: {
      great: { text: "{member}이 지켜보다가 이름을 물었다. 다음에 바다에서 만나면 한 잔 사겠다는 말과 함께 배의 표식을 알려 주었다.", effects: { trust: 8, supplies: 6 } },
      good: { text: "짐을 다 싣고 나자 {member}이 짧게 고개를 끄덕였다. 큰 말은 없었지만 얼굴은 기억된 듯했다.", effects: { trust: 4 } },
      bad: { text: "무거운 상자를 놓쳐 갑판에 술통이 굴렀다. 선원들의 웃음 속에서 {member}은 이름도 묻지 않고 돌아섰다.", effects: { health: -5, trust: -4 } }
    } },
  { id: "crew_drink", label: "술자리에 끼어 바다 이야기를 나눈다", hint: "주머니 사정이 문제", check: { stat: "supplies", against: 45 },
    personality: { freedom: 6, ambition: 3 }, tie: { great: 2, good: 1, bad: 0 },
    outcomes: {
      great: { text: "{member}과 밤새 잔을 비우며 항로 이야기를 나눴다. 새벽에 {crew}의 선원들이 이름을 부르며 어깨를 쳤다.", effects: { friendBond: 8, skill: 6 } },
      good: { text: "몇 잔이 오가는 동안 {crew}의 무용담을 들었다. 계산은 비쌌지만 그 이름들이 조금 가까워졌다.", effects: { supplies: -6, skill: 4 } },
      bad: { text: "취해서 큰소리를 치다가 의자째 넘어졌다. 다음 날 아침 남은 것은 두통과 빈 주머니뿐이었다.", effects: { supplies: -12, health: -4 } }
    } },
  { id: "crew_spar", label: "솜씨를 보여 달라는 도발에 응한다", hint: "크게 얻거나 크게 다친다", check: { stat: "skill", against: 60 },
    personality: { ambition: 8, caution: -5 }, tie: { great: 3, good: 1, bad: -1 },
    outcomes: {
      great: { text: "버티고 또 버텼다. 끝내 쓰러졌지만 {member}은 웃으며 손을 내밀었다. {crew}에 쓸 만한 녀석이 있다는 말이 돌았다.", effects: { skill: 12, trust: 8, health: -6 } },
      good: { text: "몇 합 만에 바닥에 나뒹굴었다. 그래도 끝까지 눈을 피하지 않은 것을 {member}은 기억해 두었다.", effects: { skill: 6, health: -8 } },
      bad: { text: "한 방에 정신을 잃었다. 깨어났을 때 {crew}의 배는 이미 떠났고, 갈비뼈가 한동안 욱신거렸다.", effects: { health: -18, trust: -4 } }
    } }
];

// A chance meeting with a canon crew of the era, before that crew can make an offer.
export function crewContactScene(life, age, base, open) {
  if (life.creationVersion < 15 || !life.leftHome || life.path === "marine") return null;
  const crew = open.find((name) => !crewTie(life, name) && ROSTERS[name] && !life.seen.includes(`life_crew_contact_${name}`));
  if (!crew || yearRoll(life.seed ^ 0x4c7e2a19, age) % 4) return null;
  const people = ROSTERS[crew].filter((person) => inEra({ ...life, age }, person) && person.role !== "선장");
  const member = people[yearRoll(life.seed ^ 0x19a3, age) % people.length] || ROSTERS[crew][0];
  const place = CONTACT_PLACES[yearRoll(life.seed ^ 0x77b1, age) % CONTACT_PLACES.length];
  const fill = (text) => text.replace(/\{member\}([이은과])/g, (_, particle) => withParticle(member.name, particle))
    .replaceAll("{member}", member.name).replaceAll("{crew}", crew);
  return { ...base, id: `life_crew_contact_${crew}`, urgent: true, art: "mishapFeast", title: `${crew}의 깃발`,
    body: `${place}에 ${crew}의 배가 들어왔다. ${member.role} ${withParticle(member.name, "이")} 선원들과 함께 내렸다. 그 이름을 모르는 사람은 이 바다에 없었다.`,
    choices: CONTACT_CHOICES.map((choice) => ({ id: choice.id, label: choice.label, personality: choice.personality,
      risk: `${choice.hint} · ${{ trust: "지역의 신뢰", supplies: "물자", skill: "기술" }[choice.check.stat]}에 따라 결과가 갈림`,
      apply: (state) => {
        const { tier, text } = rollTier(state, `${crew}:${choice.id}`, choice);
        state.people.crewTies = { ...state.people.crewTies, [crew]: (state.people.crewTies?.[crew] || 0) + choice.tie[tier] };
        return fill(text);
      } })) };
}
