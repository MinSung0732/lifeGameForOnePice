import { ERA_WAR, eraStart, presentAge, storyBefore, stretched, canonCrew, openCanonCrews, encounterAt, encounterScene, moveTo, routeFor, sailToNextPort, followsCaptain, standing, travelScene, yearRoll } from "./world.js";
import { personalBeat } from "./people.js";
import { adventureScene, withTrait } from "./adventures.js";
import { fruitSynergy } from "./power-choices.js";
import { takenText } from "./canon-timeline.js";
import { oldEraScene } from "./canon-old-era.js";
import { islandEvent } from "./islands.js";
import { fruitFor } from "./fruits.js";
import { bountyScene, formatBounty, marinePatrolScene } from "./bounty.js";
import { fateScene } from "./fates.js";
import { canonIfAfter } from "./canon-events.js";
import { crewContactScene } from "./canon-crews.js";
import { canonBondScene } from "./canon-bonds.js";
import { directEncounterFollowUp } from "./canon-encounter-followups.js";
import { RECRUIT_VARIANTS } from "./recruit-variants.js";
import { childhoodArt, childhoodQuiet } from "./childhood.js";
import { loguetownFollowUp } from "./loguetown-followups.js";
import { giantAdultDecisions, giantGrowingDecisions, giantGrowingYears, giantHomeYears, giantLaterYears, giantWorkingYears } from "./giant-years.js";

// A species describes where a life begins. Work and allegiance are chosen later.
const giant = (life) => life.birth.species === "거인족";
const at = (ordinary, giantAge) => (life) => giant(life) ? giantAge : ordinary;
const isAlive = (life) => !life.ending;
// Before any career (rule 9 can leave the path open past 19) the everyday text reads like ordinary work.
const byPath = (life, pirate, marine, liberator, civilian) => ({ pirate, marine, liberator, civilian })[life.path] ?? civilian;
const canLeadRescue = (life) => life.skill >= 40 && life.health >= 40 && life.supplies >= (life.devilFruit ? 40 : 20);
const fruitForCard = (life, ordinary, giantAge) => fruitFor(life.creationVersion >= 4
  ? { ...life, age: at(ordinary, giantAge)(life) } : life);

function eatFruit(life, ordinary, giantAge) {
  if (life.creationVersion >= 3) {
    const fruit = fruitForCard(life, ordinary, giantAge);
    if (!fruit) throw new Error("이 시기에 얻을 수 있는 열매가 없습니다.");
    life.devilFruit = `${fruit.name}(${fruit.type})`;
    life.fruitMastery = 1;
    if (fruit.owner) life.people.fruitOwner = { owner: fruit.owner, fruit: fruit.name };
    return `한 입 베어 문 뒤 ${fruit.power} 물에 몸을 담그자 힘이 빠지는 것도 곧 알게 됐다.${fruit.owner
      ? ` 원작에서 ${fruit.owner}의 것이 될 열매였다. 이 세계선의 ${fruit.owner}는 이 힘을 얻지 못한다.` : ""}`;
  }
  life.devilFruit = "이름 없는 초인계";
  life.fruitMastery = 1;
  return "한 입 베어 문 뒤 손끝에서 매듭이 저절로 조여졌다. 물에 몸을 담그자 힘이 빠지는 것도 곧 알게 됐다.";
}

const journeys = {
  인간: "가까운 항구를 오가는 배에서 선원과 선주를 먼저 알게 됐다.",
  어인: "해류를 따라 이동한 뒤, 지상 항로에서는 코팅 선박과 동행을 구했다.",
  밍크족: "움직이는 조에서 내려올 때 길을 아는 동행과 배를 구했다.",
  "하늘섬 사람": "아래 바다로 내려가는 안전한 길을 찾고, 항구에서 배를 갈아탔다.",
  거인족: "몸집에 맞는 큰 배와 넉넉한 식량을 마련한 뒤에야 섬 밖으로 나섰다."
};

export function setCareer(life, path) {
  const firstCareer = !life.path;
  const previous = { path: life.path, tier: life.independent ? RANK_ROLES.pirate.length : life.rankTier };
  life.path = path;
  const career = {
    pirate: ["선원", "독립 해적단", "견습 선원", "자유로운 항로"],
    marine: ["해군", "해군", "수병", "바다의 사람을 지키기"],
    liberator: ["구호 전달원", "독립 해방망", "연락원", "억압받는 사람의 탈출로"],
    civilian: ["선박 일꾼", "민간 조합", "견습 일꾼", "돌아올 수 있는 일터"]
  }[path];
  [life.job, life.affiliation, life.role, life.goal] = career;
  if (life.creationVersion === 1 || firstCareer) life.skill += 10;
  if (life.creationVersion >= 2) {
    life.canonCrew = null;
    life.independent = false;
    life.rankTier = 0;
    life.careerStartAge = life.age + 1;
  }
  // Rule 15: a move keeps part of the old standing: about half the relative rank, two thirds within the same path.
  if (life.creationVersion >= 15 && !firstCareer && previous.tier > 0) {
    const share = previous.tier / RANK_ROLES[previous.path].length * (previous.path === path ? 0.67 : 0.5);
    const tier = Math.min(RANK_ROLES[path].length, Math.round(share * RANK_ROLES[path].length));
    if (tier > 0) { life.rankTier = tier; life.role = RANK_ROLES[path][tier - 1]; life.carriedRank = life.role; }
  }
}

// The player's own crew takes the name typed at character creation, or the captain's name.
function ownCrew(life, named) {
  if (life.creationVersion < 3) return "자신이 꾸린 해적단";
  const typed = named || life.profile.crew;
  return typed ? typed.endsWith("해적단") ? typed : `${typed} 해적단` : `${life.birth.name} 해적단`;
}

function joinCanonCrew(life, crew) {
  setCareer(life, "pirate");
  life.affiliation = crew;
  life.canonCrew = crew;
}

const canonCrewChoice = (id, record, after, firstCareer = false, fixed = null) => ({ id, label: (life) => `${fixed || canonCrew(life)}의 말단 선원이 된다`,
  when: (life) => life.creationVersion >= 3 && Boolean(fixed || canonCrew(life)), needs: { skill: 35, health: 50 },
  risk: "기술 35 · 건강 50 필요 · 이름난 선장 아래에서 갑판 청소부터", failRisk: firstCareer ? "건강 -15 · 작은 해적단으로 감" : "건강 -15 · 지원 실패",
  personality: { ambition: 8, freedom: 6 },
  fail: (life) => {
    const crew = fixed || canonCrew(life);
    life.health -= 15; record?.(life);
    // A first career must still start somewhere, or the rest of the life has no path.
    if (firstCareer) { setCareer(life, "pirate"); return `${crew}의 갑판장은 고개를 저었다. 대신 항구의 작은 해적단에 견습 자리를 얻었다.`; }
    return `${crew}의 갑판장은 한 번 훑어보고 고개를 저었다.`;
  },
  apply: (life) => { const crew = fixed || canonCrew(life); joinCanonCrew(life, crew); record?.(life); after?.(life); return `${crew}의 깃발 아래에서 가장 낮은 자리부터 일을 시작했다. 이름난 선장의 얼굴은 멀리서만 보였다.`; } });

function depart(life) {
  if (life.leftHome && !life.homebound) return;
  life.leftHome = true;
  life.homebound = false;
  life.routeIndex = 0;
  moveTo(life, routeFor(life)[0]);
}

const origin = [
  { species: "인간", art: "deck", title: "해안의 첫날", body: (life) => `${life.birth.home}에서 ${life.birth.name}이 태어났다. 양육자의 손에는 바닷일로 생긴 굳은살이 있었다. 작은 배 한 척이 집의 살림을 떠받쳤다.` },
  { species: "어인", art: "fishman", title: "해류 아래의 첫날", body: (life) => `${life.birth.home}에서 ${life.birth.name}이 태어났다. 물길을 드나드는 이웃들이 집을 돌봤다. 지상의 바다는 아직 이야기로만 들려왔다.` },
  { species: "밍크족", art: "mink", title: "조의 첫날", body: (life) => `${life.birth.home}에서 ${life.birth.name}이 태어났다. 조의 길은 거대한 코끼리와 함께 움직였다. 바깥으로 나가는 배는 좀처럼 같은 자리에 닿지 않았다.` },
  { species: "하늘섬 사람", art: "sky", title: "구름 위의 첫날", body: (life) => `${life.birth.home}에서 ${life.birth.name}이 태어났다. 구름길을 살피는 이웃들이 양육자를 도왔다. 아래 바다로 가는 길은 집에서 보이지 않았다.` },
  { species: "거인족", art: "giant", title: "엘바프의 첫날", body: (life) => `${life.birth.home}에서 ${life.birth.name}이 태어났다. 큰 배가 드나드는 해안에서 아이 하나가 자라는 데도 긴 세월이 들었다. 이웃들은 돌아온 배를 함께 맞았다.` }
].map((card) => ({ ...card, id: `life_birth_${card.species}`, act: 1, age: 0,
  after: (life) => { life.guardianName = "양육자"; life.friendName = "옛 친구"; return "한 사람의 삶이 시작됐다."; } }));

const scenes = [
  { id: "life_home", age: at(4, 20), art: (life) => ({ 인간: "deck", 어인: "fishman", 밍크족: "mink", "하늘섬 사람": "sky", 거인족: "giant" })[life.birth.species], title: "집의 소리", body: (life) => `${life.birth.home}의 하루에는 일하는 소리와 돌아오는 발걸음이 있었다. ${life.birth.name}은 아직 어느 길을 택할지 알 수 없었다. 곁의 어른들은 먹을 것과 잠자리를 먼저 걱정했다.` },
  { id: "life_friend", age: at(7, 40), art: "deck", title: "오래 남은 이름", body: "또래 친구와 처음으로 비밀을 나눴다. 둘은 먼 곳을 꿈꾸기도 했지만, 당장은 서로의 집으로 돌아가는 길을 익히는 편이 중요했다.", after: (life) => { life.friendBond += 10; return "친구와의 약속이 생겼다."; } },
  { id: "life_first_skill", age: at(9, 52), art: (life) => life?.creationVersion >= 20 ? "workbenchSkillTraining" : "workbench", title: "손에 익힌 일", body: "마을에 손이 모자란 날이 왔다. 어른들은 위험한 일을 맡기지 않았고, 아이들이 할 수 있는 작은 몫을 나눠 주었다.", choices: [
    { id: "learn", label: "매듭과 도구를 배운다", risk: "기술 +10 · 물가 사고에 대비", personality: { caution: 5, ambition: 3 }, apply: (life) => { life.skill += 10; return "밧줄과 도구를 다루는 순서를 익혔다."; } },
    { id: "carry", label: "물자를 옮기며 사람을 돕는다", risk: "물자 +10 · 지역의 신뢰 +10", personality: { empathy: 7, loyalty: 5 }, apply: (life) => { life.supplies += 10; life.trust += 10; return "얼굴을 익힌 사람들이 다음 일에도 손을 내밀었다."; } }
  ] },
  { id: "life_child_crisis", age: at(11, 60), art: (life) => life?.creationVersion >= 20 ? "smallBoatDistress" : "lifeStorm", title: "범람한 길목", body: "거친 물이 마을의 통로를 덮쳤다. 어른들은 아이들에게 물러서라고 외쳤다. 한 배의 밧줄이 풀렸지만, 물살은 가까이 갈수록 거셌다.", choices: [
    { id: "wait", label: "어른들의 구조를 돕는다", risk: "물가 밖에서 밧줄을 건넴 · 양육자와의 유대 +10", personality: { caution: 7, loyalty: 5 }, apply: (life) => { life.bond += 10; return "마른 밧줄을 건네고 뒤에서 기다렸다. 배는 어른들의 손으로 돌아왔다."; } },
    { id: "rush", label: "직접 밧줄을 붙잡는다", risk: "기술 30이 매듭을 다룰 기준 · 물살이 거셈", personality: { ambition: 8, caution: -8 }, apply: (life) => {
      if (life.skill < 30) {
        const danger = Math.min(40, Math.max(5, (30 - life.skill) * 2 + Math.max(0, 70 - life.health)));
        if (life.creationVersion === 1 || yearRoll(life.seed, life.age + 1) % 100 < danger) {
          life.ending = "death"; life.deathCause = "어린 날의 해난 사고";
          return "밧줄은 손에서 미끄러졌다. 구조를 기다리던 이들은 끝내 돌아오지 못한 이름을 불렀다.";
        }
        life.health -= 20; life.trust -= 5;
        return "밧줄을 놓친 뒤 어른의 손에 끌려 나왔다. 배는 다른 이들이 붙잡았고 몸에는 상처가 남았다.";
      }
      life.health -= 10; life.trust += 10; return "매듭을 걸어 배를 붙잡았다. 물살에 다쳤지만 마을로 돌아왔다.";
    } }
  ] },
  { id: "life_after_storm", age: at(11, 60), art: (life) => life?.creationVersion >= 20 ? "workbenchAftermath" : "workbench", title: "그날의 새벽", body: (life) => `${life.birth.name}은 다친 곳과 부서진 물건을 보며 그날을 오래 기억했다. 마을은 통로를 고치고 새 밧줄을 걸었다. 세월이 흘러도 물살 소리만은 쉽게 잊히지 않았다.` },
  { id: "life_school", age: at(14, 78), art: "deck", title: "배운 것과 모르는 것", body: "일을 배우는 자리가 조금 넓어졌다. 바다의 날씨, 배의 장부, 사람을 다루는 법은 서로 다른 재주였다. 곁의 어른들도 모든 답을 알지는 못했다." },
  { id: "life_training", age: at(16, 95), art: (life) => life?.creationVersion >= 20 ? "workbenchSkillTraining" : "workbench", title: "첫 수련", body: "작은 실수 하나가 다른 사람의 일을 늘렸다. 고쳐 볼 기회가 다시 왔을 때 무엇을 연습할지 정해야 했다.", choices: [
    { id: "practice", label: "어려운 기술을 다시 연습한다", cost: 10, risk: "기술 +10 · 물자 -10", personality: { ambition: 5, caution: 4 }, apply: (life) => { life.skill += 10; life.supplies -= 10; return "손이 느려도 같은 작업을 끝까지 되풀이했다."; } },
    { id: "earn", label: "쉬운 일감을 더 맡는다", risk: "물자 +10 · 건강 -10", personality: { ambition: 7, caution: -4 }, apply: (life) => { life.supplies += 10; life.health -= 10; return "일감은 늘었고 살림은 나아졌지만 몸에는 피로가 남았다."; } },
    { id: "help", label: "동료와 함께 방법을 배운다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", personality: { empathy: 5, loyalty: 6 }, apply: (life) => { life.friendBond += 10; life.trust += 10; return "서로의 서툰 일을 덜어 주는 방법을 배웠다."; } }
  ] },
  { id: "life_departure_rumor", age: at(18, 108), art: "deck", title: "항구에 온 소문", body: (life) => life.leftHome
    ? "새 기항지에는 해적선과 해군 배, 짐을 실은 상선이 드나들었다. 먼저 탄 배 밖에도 다른 일이 있다는 걸 알게 됐다."
    : "해적선, 해군 배, 짐을 실은 상선이 서로 다른 날에 드나들었다. 어디에 타든 일과 명령, 위험이 함께 따라온다는 이야기가 들렸다." },
  { id: "life_career", age: at(19, 112), when: (life) => life.creationVersion === 1 || !life.path, art: "deck", title: "처음 고른 소속", body: (life) => `${life.birth.name}에게도 일할 자리가 생겼다. 항구에는 저마다 다른 깃발을 단 배가 들어왔다. 어느 길을 택하든 배와 동행, 배울 시간이 필요했다.`, choices: [
    { id: "pirate", label: "해적단의 선원이 된다", risk: "기술 +10 · 자유로운 항로 · 추적 위험", personality: { freedom: 10, ambition: 6 }, apply: (life) => { setCareer(life, "pirate"); return "독립 해적단에 자리를 얻었다. 선장도 동료도 아직 낯설었다."; } },
    { id: "captain", label: "동료와 작은 해적단을 꾸린다", when: (life) => life.creationVersion >= 2,
      available: (life) => life.skill >= 30 && life.supplies >= 40 && life.friendBond >= 40,
      risk: "기술 30 · 물자 40 · 친구와의 유대 40 필요 · 출항 물자 -20", personality: { freedom: 9, ambition: 8, loyalty: 5 },
      naming: true, apply: (life, named) => { setCareer(life, "pirate"); life.independent = true; life.rankTier = 3; life.job = "해적단 선장"; life.affiliation = ownCrew(life, named); life.role = "선장"; life.supplies -= 20; return "작은 배에 동료의 몫을 싣고 선장으로 첫 항해를 준비했다."; } },
    canonCrewChoice("canon_crew", null, null, true),
    { id: "marine", label: "해군에 지원한다", risk: "기술 +10 · 수병부터 시작", personality: { loyalty: 7, caution: 5 }, apply: (life) => { setCareer(life, "marine"); return "해군의 시험과 교육을 거쳐 수병 명부에 이름을 올렸다."; } },
    { id: "liberator", label: "사람을 빼내는 연락망에 합류한다", risk: "기술 +10 · 비공식 해방 활동", personality: { empathy: 8, freedom: 6 }, apply: (life) => { setCareer(life, "liberator"); return "억압받는 이들을 돕는 작은 독립 연락망에서 일을 시작했다."; } },
    { id: "civilian", label: "민간 배와 조합에서 일한다", risk: "기술 +10 · 지역의 신뢰 +10", personality: { caution: 5, loyalty: 5 }, apply: (life) => { setCareer(life, "civilian"); life.trust += 10; return "민간 선박 조합에서 견습 일꾼으로 일하게 됐다."; } },
    { id: "home", label: "고향의 일을 이어 간다", when: (life) => life.creationVersion >= 2, risk: "기술 +10 · 마을에 남음", personality: { loyalty: 5, caution: 4 }, apply: (life) => {
      setCareer(life, "civilian"); life.homebound = true; life.job = "마을 일꾼"; life.affiliation = "고향 마을"; life.role = "마을 일꾼"; life.goal = "익숙한 삶터를 지키기";
      return "떠나는 배를 배웅하고 마을의 일손으로 남았다. 삶은 그곳에서도 계속됐다.";
    } }
  ] },
  { id: "life_leave_home", age: at(19, 112), when: (life) => life.creationVersion === 1 || !life.leftHome && !life.homebound,
    art: (life) => life?.creationVersion >= 20 ? "harborDeparture" : "deck", title: "섬 밖으로", body: (life) => `${journeys[life.birth.species]} ${life.birth.name}은 출발하는 날을 양육자에게 알렸다. 바다에 나간 뒤에도 고향의 이름은 쉽게 지워지지 않았다.`,
    after: (life) => { depart(life); return `${life.location}에 첫 기항했다.`; } },
  { id: "life_first_station", age: at(21, 122), art: (life) => life?.creationVersion >= 20 ? (life.homebound ? "workbench" : "deckBusyDay") : "deck", title: "일의 첫해", body: (life) => life.homebound
    ? "고향에서 시장과 작업장을 오가며 할 일을 익혔다. 멀리 떠나는 사람만 바쁜 것은 아니었다."
    : byPath(life,
    "갑판에서는 누가 어느 돛을 맡는지부터 외웠다. 자유는 일을 나누는 약속 없이는 오래가지 못했다.",
    "해군 기지에서 순찰과 보고를 배웠다. 계급은 복장의 장식보다 책임의 순서를 뜻했다.",
    "연락망의 작은 문서를 안전한 집까지 옮겼다. 도울 사람의 이름은 장부에 남기지 않았다.",
    "수리장과 부두를 오가며 맡은 배의 상태를 기록했다. 말끔한 갑판 뒤에도 할 일은 많았다."), after: (life) => { life.skill += 10; return "견습 일을 한 해 마쳤다."; } },
  { id: "life_first_pay", age: at(23, 130), art: "workbench", title: "손에 남은 것", body: "몇 해의 노동 끝에 처음으로 자기 몫의 물자를 모았다. 집에 보내거나 다음 항해에 쓸 수 있었다.", choices: [
    { id: "home", label: "고향에 보낸다", risk: "양육자와의 유대 +10 · 지역의 신뢰 +10", apply: (life) => { life.bond += 10; life.trust += 10; return "고향에서 답장이 왔다. 오래 비웠어도 돌아갈 자리가 남아 있었다."; } },
    { id: "gear", label: "도구와 항해 준비에 쓴다", cost: 10, risk: "기술 +10 · 물자 -10", apply: (life) => { life.skill += 10; life.supplies -= 10; return "좋은 도구가 다음 일의 실패를 줄여 주었다."; } },
    { id: "save", label: "비상 물자로 남긴다", risk: "물자 +10", apply: (life) => { life.supplies += 10; return "예비 식량과 약품을 따로 묶어 두었다."; } }
  ] },
  { id: "life_enemy", age: at(24, 135), art: (life) => life?.creationVersion >= 20 ? "harborStandoff" : "lifeStorm", title: "부두에서 맞선 배", body: "기항지에 먼저 닿은 무장 선단이 약한 배의 물자를 가로막았다. 한 선원이 길을 터 달라며 다가왔다. 무기를 드는 순간부터 다른 배들도 싸움에 휘말릴 수 있었다.", choices: [
    { id: "fight", label: "앞에 나서서 길을 연다", available: (life) => life.skill >= 30 && life.health >= 30, needs: { skill: 30, health: 30 },
      bounty: (life) => life.path === "pirate" ? 3_000_000 : 0,
      risk: "기술 30 · 건강 30 필요 · 기술 60 또는 무장색이 전투의 변수",
      personality: { ambition: 7, caution: -6, loyalty: 5 }, apply: (life) => {
        life.rival = true;
        if (life.skill < 60 && !life.haki.armament) { life.health -= 20; return "첫 충돌에서 밀렸다. 동료들이 길을 막아 준 사이 배로 물러났다."; }
        life.health -= 10; life.trust += 10; return "동료들과 힘을 모아 길을 열었다. 상대 선단은 이름을 기억하고 물러났다.";
      } },
    { id: "negotiate", label: "물자 일부를 내고 배를 통과시킨다", available: (life) => life.supplies >= 10,
      risk: "물자 10 필요 · 상대의 요구를 받아들임", personality: { empathy: 5, caution: 6 }, apply: (life) => { life.supplies -= 10; return "급한 싸움은 피했다. 빼앗긴 물자는 다음 항해에서 메워야 했다."; } },
    { id: "withdraw", label: "다른 배와 함께 우회로를 찾는다", risk: "기술 +10 · 상대가 깃발을 봄", personality: { caution: 7, loyalty: 5 }, apply: (life) => { life.skill += 10; life.rival = true; return "무장 선단을 피했지만 서로의 깃발을 기억하게 됐다."; } }
  ] },
  { id: "life_enemy_after", age: at(24, 135), art: "workbench", title: "남은 눈길", when: (life) => life.rival, body: (life) => `${life.birth.name}의 배가 떠난 뒤에도 그 선단의 사람들이 항구에 남아 있었다. 다시 마주치면 오늘의 일을 모른 척할 수 없었다.` },
  { id: "life_orders", age: at(25, 140),
    art: (life) => life?.creationVersion >= 20 && (life.independent || life.role === "선장" || (life.rankTier && life.rankTier >= 2)) ? "deckCommand" : "deck",
    title: "명령과 판단",
    body: (life) => {
      if (life.homebound) return "마을의 일감은 큰 집부터 돌아갔다. 그러나 비를 맞은 작은 집이 더 급해 보였다.";
      if (life.creationVersion >= 20) {
        if (life.independent || life.role === "선장") return "동료 선원들이 이익이 적은 구조 요청이라며 그냥 지나치자고 건의했다. 키를 쥔 선장으로서 결단을 내려야 했다.";
        if (life.path === "marine" && (life.rankTier >= 3 || ["소령", "중좌", "대령", "준장", "소장", "중장", "대장"].includes(life.role))) return "본부의 순찰 지침과 눈앞 작은 조난선의 구조 요청이 엇갈렸다. 함선 지휘관으로서 현장 판단을 내려야 했다.";
      }
      return byPath(life,
        "선장은 이익이 적은 구조 요청을 지나치려 했다. 갑판에는 동의하지 않는 사람이 있었다.",
        "상관은 규정대로만 움직이라고 했다. 그러나 작은 배의 구조 요청은 기다릴 시간이 없어 보였다.",
        "연락망은 한 사람보다 문서 꾸러미를 먼저 옮기라고 했다. 현장의 목소리는 달랐다.",
        "조합은 계약된 배부터 수리하라고 했다. 손상된 작은 배에는 돈도 시간이 없었다.");
    },
    choices: [
      { id: "obey",
        label: (life) => {
          if (life.creationVersion >= 20) {
            if (life.independent || life.role === "선장") return "선원들의 뜻을 따라 항로를 유지한다";
            if (life.path === "marine" && (life.rankTier >= 3 || ["소령", "중좌", "대령", "준장", "소장", "중장", "대장"].includes(life.role))) return "본부 지침대로 관할 초계 구역을 지킨다";
          }
          return "맡은 순서를 지킨다";
        },
        risk: "물자 +10 · 지역의 신뢰 -10", personality: { caution: 6, empathy: -4 },
        apply: (life) => {
          life.supplies += 10; life.trust -= 10;
          if (life.creationVersion >= 20) {
            if (life.independent || life.role === "선장") return "선원들은 안도했지만 바다로 사라지는 구조 신호가 선장의 마음에 남았다.";
            if (life.path === "marine" && life.rankTier >= 3) return "초계 일정은 맞췄지만 침몰하는 배를 뒤로한 상관의 기록이 남았다.";
          }
          return "일은 제때 끝났지만 도움을 기다린 사람의 얼굴이 남았다.";
        }
      },
      { id: "help",
        label: (life) => {
          if (life.creationVersion >= 20) {
            if (life.independent || life.role === "선장") return "선장의 책임으로 키를 돌려 구조에 나선다";
            if (life.path === "marine" && (life.rankTier >= 3 || ["소령", "중좌", "대령", "준장", "소장", "중장", "대장"].includes(life.role))) return "지휘관 재량으로 항로를 틀어 조난선을 구한다";
          }
          return "현장의 사람을 먼저 돕는다";
        },
        cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 8, loyalty: 4 },
        apply: (life) => {
          life.supplies -= 10; life.trust += 10; life.injustice = true;
          if (life.creationVersion >= 20) {
            if (life.independent || life.role === "선장") return "배를 돌려 조난자를 구해냈다. 선원들도 선장의 결단을 묵묵히 따랐다.";
            if (life.path === "marine" && life.rankTier >= 3) return "조난선을 구조했다. 본부에서는 임의 작전 변경이라며 경고장을 보냈다.";
          }
          return "도움을 받은 이가 돌아왔다. 조직에서는 독단이었다고 꾸짖었다.";
        }
      }
    ]
  },
  { id: "life_repercussion", age: at(25, 140),
    art: (life) => life?.creationVersion >= 20 && (life.independent || life.role === "선장") ? "deckCommand" : "deck",
    title: "뒤따른 말",
    body: (life) => {
      if (life.creationVersion >= 20 && (life.independent || life.role === "선장")) {
        return life.trust >= 40
          ? "선원들과 기항지 사람들이 선장의 결단을 신뢰하기 시작했다. 그 신뢰가 거친 바다에서 배를 하나로 묶어 주었다."
          : "결정에 대한 뒷말이 선내와 부두에 돌았다. 한 번의 판단이 선장으로서의 무게로 남았다.";
      }
      return life.trust >= 40
        ? "기항지의 사람들이 이름을 기억했다. 그 신뢰가 명령을 대신해 주지는 않았지만 다음 일을 함께 시작할 사람이 늘었다."
        : "기항지의 사람들은 쉽게 마음을 열지 않았다. 한 번의 결정이 오래 남을 수 있다는 사실을 배웠다.";
    }
  },
  { id: "life_fruit_find", age: at(27, 149), art: "specialFruitChest", title: "물결에 밀려온 상자", when: (life) => life.seed % 3 === 0
    && (life.creationVersion < 4 || fruitForCard(life, 27, 149)), body: (life) => life.creationVersion >= 4
    ? `떠밀려 온 상자에 악마의 열매가 있었다. 동행한 수집가는 ${fruitForCard(life, 27, 149).name}일 가능성을 말했다. ${fruitForCard(life, 27, 149).formerOwner ? "이전 능력자가 죽은 뒤 다시 나타났을 가능성이 있다." : "아직 능력자가 알려지기 전의 시기다."} 먹으면 바다에서 힘을 잃는다는 점만은 분명했다.`
    : life.creationVersion >= 3
    ? `떠밀려 온 상자에 소용돌이 무늬의 열매가 하나 있었다. ${fruitFor(life).owner ? "낡은 도감 한쪽에서 비슷한 그림을 찾았지만 누가 먹었다는 기록은 없었다." : "도감에서 이름을 찾을 수 없었다. 어딘가에서 사용자가 죽고 새로 맺힌 열매일지도 몰랐다."} 먹으면 힘을 얻는 대신 바다에서는 몸을 가누기 어렵다는 말을 들었다.`
    : "떠밀려 온 상자에 기묘한 무늬의 열매가 하나 있었다. 도감에서 이름을 찾을 수 없었다. 먹으면 힘을 얻을지 몰라도 바다에서는 몸을 가누기 어렵다는 말을 들었다.", choices: [
    { id: "eat", label: (life) => life.creationVersion >= 4 ? "확신 없이 열매를 먹는다" : "정체를 모른 채 먹는다", risk: "새 힘을 얻을 수 있음 · 물에 잠기면 힘이 빠짐", personality: { ambition: 7, caution: -7 }, apply: (life) => eatFruit(life, 27, 149) },
    { id: "sell", label: "열매를 넘기고 항해 자금을 받는다", risk: "물자 +20 · 비능력자로 남음", personality: { caution: 6 }, apply: (life) => { life.supplies += 20; return "물자를 챙겨 배로 돌아왔다. 열매가 누구의 손에 갔는지는 듣지 못했다."; } },
    { id: "leave", label: (life) => life.creationVersion >= 20 ? "열매를 사양하고 바다와 호흡하는 단련을 택한다" : "손대지 않고 발견 사실을 알린다",
      risk: (life) => life.creationVersion >= 20 ? "기술 +15 · 건강 +10 · 비능력자로 남음" : "지역의 신뢰 +10 · 비능력자로 남음",
      personality: { empathy: 5, caution: 5 },
      apply: (life) => {
        if (life.creationVersion >= 20) { life.skill += 15; life.health += 10; life.pureHuman = true; return "열매의 유혹을 뿌리치고 바다를 자유롭게 헤엄칠 수 있는 신체와 도구의 단련을 택했다."; }
        life.trust += 10; return "항구 사람들에게 상자의 위치를 알려 주고 지나왔다.";
      } }
  ] },
  { id: "life_setback", age: at(28, 155), art: "lifeStorm", title: "실수한 항해", body: "항해 기록과 실제 물길이 어긋났다. 짐 일부가 젖고 다른 배의 일정도 밀렸다. 책임을 피하기 어려웠다.", choices: [
    { id: "admit", label: "실수를 밝히고 다시 조사한다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10 · 기술 +10", personality: { loyalty: 7, caution: 5 }, apply: (life) => { life.supplies -= 10; life.trust += 10; life.skill += 10; return "손해를 메우는 데 오래 걸렸지만 같은 실수를 피할 기록이 남았다."; } },
    { id: "hide", label: "흔적을 덮고 떠난다", risk: "물자 유지 · 지역의 신뢰 -10", personality: { loyalty: -8, caution: -4 }, apply: (life) => {
      life.trust -= 10;
      if (life.creationVersion >= 20 && life.leftHome && !life.homebound) {
        if (followsCaptain(life) && life.canonCrew === "밀짚모자 일당") return "숨긴 실수는 동료들 사이로 퍼졌다. 다음 항해를 앞두고 신뢰가 흔들렸다.";
        const nextPlace = sailToNextPort(life);
        return `다음 항구 ${nextPlace}에서 소문이 먼저 도착했다. 변명은 신뢰를 되돌리지 못했다.`;
      }
      return "다음 항구에서 소문이 먼저 도착했다. 변명은 신뢰를 되돌리지 못했다.";
    } }
  ] },
  { id: "life_fruit_payment", age: at(29, 163), art: "fruit", title: "항해의 대가", when: (life) => life.seed % 3 === 1 && !life.devilFruit && (life.creationVersion === 1 || !life.homebound)
    && (life.creationVersion < 4 || fruitForCard(life, 29, 163)), body: (life) => life.creationVersion >= 4
    ? `먼 항로의 일을 마친 대가로 상인이 열매 하나와 물자 꾸러미를 내놓았다. 동행한 수집가는 도감의 그림을 펴고 ${fruitForCard(life, 29, 163).name}일 가능성이 높다고 말했다. 누가 먹게 될지는 아직 몰랐다.`
    : life.creationVersion >= 3
    ? `먼 항로의 일을 마친 대가로 상인이 열매 하나와 물자 꾸러미를 내놓았다. 동행한 수집가는 도감을 뒤적이다 ${fruitFor(life).type}의 ${fruitFor(life).name}${fruitFor(life).owner ? "일 거라고 했다." : "인 것 같지만 기록에 없는 새 열매라고 했다."}`
    : "먼 항로의 일을 마친 대가로 상인이 열매 하나와 물자 꾸러미를 내놓았다. 동행한 수집가는 열매가 작은 매듭을 조이는 초인계라고 알려 주었지만, 정확한 이름은 찾지 못했다.", choices: [
    { id: "eat", label: "열매를 받아 먹는다", risk: (life) => `${life.creationVersion >= 3 ? fruitForCard(life, 29, 163).type : "매듭을 조이는"} 힘 · 물에 잠기면 힘이 빠짐`, personality: { ambition: 6, caution: -4 }, apply: (life) => eatFruit(life, 29, 163) },
    { id: "supplies", label: (life) => life.creationVersion >= 20 ? "물자 꾸러미를 받고 비능력자의 길을 걷는다" : "물자 꾸러미를 받는다",
      risk: (life) => life.creationVersion >= 20 ? "물자 +20 · 기술 +10 · 비능력자로 남음" : "물자 +20 · 비능력자로 남음",
      personality: { caution: 5 },
      apply: (life) => {
        life.supplies += 20;
        if (life.creationVersion >= 20) { life.skill += 10; life.pureHuman = true; return "열매 대신 물자를 챙겼다. 어떤 파도에도 헤엄쳐 살아남을 수 있는 맨몸의 기술을 다졌다."; }
        return "운반할 물자와 식량을 챙겼다. 손에 익힌 기술로 다음 항해를 준비했다.";
      } }
  ] },
  { id: "life_mentor", age: at(30, 170), art: "workbench", title: "오래 일한 사람", body: "오래 일한 선배가 젖은 장부를 펴 놓고 실패한 날을 다시 짚었다. 능숙함은 한 번의 대담한 행동보다 그 뒤의 수습에 있었다." },
  { id: "life_change_path", age: at(32, 182), when: (life) => life.creationVersion === 1, art: "deck", title: "길을 고쳐 잡을 때", body: (life) => `${life.birth.name}은 지금까지의 일을 바탕으로 다른 소속을 택할 수도 있었다. 새 조직에 가면 직책은 다시 낮아지고, 지나온 평판은 남는다.`, choices: [
    { id: "stay", label: "지금의 일을 이어 간다", risk: "현재 소속 유지 · 기술 +10", apply: (life) => { life.skill += 10; return "익숙한 동료들과 다음 일을 다시 정했다."; } },
    { id: "pirate", label: "해적단으로 옮긴다", when: (life) => life.path !== "pirate", risk: "새 소속 · 견습부터 다시 시작", apply: (life) => { setCareer(life, "pirate"); return "이전 직책을 내려놓고 새 해적단의 갑판을 닦기 시작했다."; } },
    { id: "marine", label: "해군에 새로 지원한다", when: (life) => life.path !== "marine", available: (life) => life.path !== "pirate" || life.trust >= 60, risk: "해적 경력은 지역의 신뢰 60 필요 · 수병부터 시작", apply: (life) => { setCareer(life, "marine"); return "기항지의 증언과 심사를 거쳐 다시 수병으로 시작했다."; } },
    { id: "liberator", label: "독립 해방망으로 옮긴다", when: (life) => life.path !== "liberator", risk: "새 소속 · 연락원부터 다시 시작", apply: (life) => { setCareer(life, "liberator"); return "비공식 연락망의 가장 작은 일부터 다시 배웠다."; } },
    { id: "civilian", label: "민간 조합으로 옮긴다", when: (life) => life.path !== "civilian", risk: "새 소속 · 견습부터 다시 시작", apply: (life) => { setCareer(life, "civilian"); return "무기를 내려놓고 민간 배의 일을 다시 배웠다."; } }
  ] },
  { id: "life_fruit_practice", age: at(33, 185), art: (life) => life?.creationVersion >= 20 ? "workbenchFruitPractice" : "workbench", title: "손끝의 새 일", when: (life) => Boolean(life.devilFruit), body: (life) => life.creationVersion >= 3
    ? `${life.devilFruit}의 힘은 아직 뜻대로 움직이지 않았다. 비가 오면 물길도 피해야 했다. 힘을 여러 번 연습할지, 안전한 도구부터 더 마련할지 정해야 했다.`
    : "손끝의 힘은 아직 뜻대로 움직이지 않았다. 비가 오면 물길도 피해야 했다. 같은 매듭을 여러 번 연습할지, 안전한 도구부터 더 마련할지 정해야 했다.", choices: [
    { id: "practice", label: "마른 작업장에서 힘을 연습한다", risk: "기술 40이 안정된 연습의 기준 · 과로 주의", apply: (life) => {
      if (life.skill < 40) { life.health -= 10; return "힘을 억지로 쓰다가 지쳤다. 도구를 다루는 순서부터 다시 배워야 했다."; }
      life.fruitMastery = 2; return life.creationVersion >= 3 ? "힘을 원하는 만큼만 꺼내고 거두는 법을 익혔다." : "마른 밧줄을 끊지 않고 단단히 묶는 법을 익혔다.";
    } },
    { id: "prepare", label: "물가에서 쓸 안전 장비를 마련한다", risk: "물자 +10 · 열매 숙련 유지", apply: (life) => { life.supplies += 10; return "동료와 구조 밧줄을 다시 점검했다. 물에 빠졌을 때 손을 잡아 줄 사람도 정했다."; } }
  ] },
  { id: "life_new_routine", age: at(34, 190), art: (life) => life?.creationVersion >= 20 ? (life.homebound ? "workbench" : "deckBusyDay") : "deck", title: "새 일상의 무게", body: (life) => life.homebound
    ? "고향의 일은 계절마다 달랐다. 떠나는 배를 배웅하고 돌아온 사람의 이야기를 들으며 손에 익은 일을 이어 갔다."
    : byPath(life,
    "항해는 항구마다 달랐지만 배 안의 일은 반복됐다. 작은 고장을 제때 고치는 사람이 동료의 잠을 지켰다.",
    "순찰표와 당직이 삶의 리듬이 됐다. 지키는 사람에게도 지켜야 할 휴식이 필요했다.",
    "탈출로는 지도에 그리지 않았다. 낯선 집의 문이 열리기까지 오래 기다려야 했다.",
    "배가 돌아오는 날마다 수리 목록이 새로 생겼다. 일의 끝은 다음 배의 출항이었다."), after: (life) => { life.skill += 10; return "맡은 일에 익숙해졌다."; } },
  { id: "life_alliance_offer", age: at(35, 195), when: (life) => life.creationVersion === 1 || !life.homebound, art: (life) => life?.creationVersion >= 20 ? "workbenchNegotiation" : "deck", title: "같은 항로의 약속", body: "자주 마주친 독립 선단이 함께 항해하자고 제안했다. 약속을 지키면 위기 때 서로 물자를 나눌 수 있었다. 그러나 상대가 숨긴 화물도 있었다.", choices: [
    { id: "join", label: "동행과 상호 구조를 약속한다", available: (life) => life.trust >= 40, risk: "지역의 신뢰 40 필요 · 서로의 화물은 여전히 미확인", personality: { loyalty: 9, empathy: 6 }, apply: (life) => { life.alliance = true; life.trust += 10; return "서로의 배가 위기 때 신호를 알아볼 수 있도록 약속했다."; } },
    { id: "decline", label: "각자의 항로를 지킨다", risk: "기술 +10 · 공동 신호는 만들지 않음", personality: { freedom: 8, caution: 5 }, apply: (life) => { life.skill += 10; return "항로 기록을 나누되 배의 지휘는 각자 맡았다."; } },
    { id: "betray", label: "상대의 화물을 빼돌린다", risk: "물자 +20 · 지역의 신뢰 -20 · 추적 가능성", personality: { ambition: 10, loyalty: -12, empathy: -8 }, apply: (life) => { life.supplies += 20; life.trust -= 20; life.rival = true; life.betrayed = true; return "화물은 손에 넣었다. 다음 기항지에는 배신당한 선단의 사람이 먼저 기다리고 있었다."; } }
  ] },
  { id: "life_alliance_after", age: at(35, 195), art: (life) => life?.creationVersion >= 20 ? "workbenchReportLetters" : "workbench", title: "약속 뒤의 하루", when: (life) => life.alliance || life.betrayed,
    body: (life) => life.betrayed ? "상대 선단은 물자를 잃은 사람의 이름을 적었다. 거래가 끝나도 원한은 쉽게 끝나지 않았다." : "동맹의 배가 같은 깃발을 달지는 않았다. 서로 다른 일을 하면서도 위급할 때 부를 신호를 정했다." },
  { id: "life_mission", age: at(36, 198), art: (life) => life?.creationVersion >= 20 ? "stormSeaRescue" : "lifeStorm", title: "밤의 신호", body: "폭우 속에서 작은 배의 불빛이 사라졌다. 구하러 가려면 기술과 식량, 버틸 체력이 필요했다.", choices: [
    { id: "lead", label: "직접 구조선을 이끈다", risk: (life) =>
      `기술 40 · 물자 ${life.devilFruit ? 40 : 20} · 건강 40이 준비 기준${life.devilFruit ? " · 물에 빠지면 힘이 빠짐" : ""}`, apply: (life) => {
      if (!canLeadRescue(life)) { life.health -= 10; return "출항을 시도했지만 배를 제어하지 못했다. 다른 구조대가 일을 넘겨받았다."; }
      life.supplies -= life.devilFruit ? 20 : 10; life.health -= 10; life.trust += 10; life.rescued += 1; return "불빛이 다시 보였고 작은 배가 항구로 돌아왔다.";
    } },
    { id: "signal", label: "해안에서 신호와 물자를 맡는다", cost: 10, risk: "물자 10 필요 · 해안에서 구조를 지원", apply: (life) => { life.supplies -= 10; life.friendBond += 10; return "구조선이 돌아올 길을 밝혀 두었다."; } }
  ] },
  { id: "life_mission_after", age: at(36, 198), art: (life) => life?.creationVersion >= 20 ? "harborRelief" : "workbench", title: "구조 다음 날", body: (life) => life.rescued ? "구조된 이들의 가족이 항구에 모였다. 고마움은 오래 남았고, 다친 몸에는 회복할 시간이 필요했다." : "다른 구조대의 배가 돌아왔다. 혼자 해내지 못한 일에도 맡은 몫이 있었다." },
  { id: "life_haki_training", age: at(38, 206), art: (life) => life?.creationVersion >= 20 ? "workbenchHakiTraining" : "workbench", title: "기척을 읽는 수련", body: "노련한 항해사가 사람의 기척을 듣는 법과 몸을 단단히 지키는 법을 보여 주었다. 오래 집중하고 몸을 단련해야 닿을 수 있는 힘이었다.", choices: [
    { id: "observation", label: "견문색의 기초를 배운다", available: (life) => life.skill >= 40, needs: { skill: 40 }, risk: "기술 40 필요 · 견문색 1단계", apply: (life) => {
      if (life.skill < 40 && life.creationVersion < 3) return "서두르는 동안 작은 기척을 놓쳤다. 먼저 맡은 일을 차분히 익혀야 했다.";
      life.haki.observation = 1; return "눈을 감아도 동료가 어느 쪽에 있는지 느낄 수 있었다.";
    } },
    { id: "armament", label: "무장색의 기초를 배운다", available: (life) => life.skill >= 40 && life.health >= 40, needs: { skill: 40, health: 40 }, risk: "기술 40 · 건강 40 필요 · 무장색 1단계", apply: (life) => {
      if ((life.skill < 40 || life.health < 40) && life.creationVersion < 3) return "몸이 버티지 못해 수련을 멈췄다. 무리한 훈련은 다음으로 미뤘다.";
      life.haki.armament = 1; return "한순간 손을 단단히 지키는 감각을 익혔다.";
    } },
    { id: "craft", label: (life) => life.creationVersion >= 20 && !life.devilFruit ? "비능력자 고유의 체술과 달인의 도구술을 연마한다" : "기존 기술을 더 다듬는다",
      risk: (life) => life.creationVersion >= 20 && !life.devilFruit ? "기술 +20 · 건강 +10 · 바다의 제약 없음" : "기술 +10 · 패기는 배우지 않음",
      apply: (life) => {
        life.skill += (life.creationVersion >= 20 && !life.devilFruit ? 20 : 10);
        if (life.creationVersion >= 20 && !life.devilFruit) life.health += 10;
        return "특별한 힘 없이도 배와 사람을 지킬 수 있도록 도구를 손에 익혔다.";
      } }
  ] },
  { id: "life_companion", age: at(40, 216), art: (life) => life?.creationVersion >= 20 ? "harborReunion" : "deck", title: "곁에 둔 사람", body: (life) => life.homebound
    ? "함께 지낸 사람이 일터 밖에서도 시간을 낼 수 있겠느냐고 물었다. 익숙한 마을에서도 일은 가까운 사람의 시간을 가져갔다."
    : "함께 지낸 사람이 다음 항구에도 동행할지 물었다. 일이 가까운 사람의 시간을 계속 가져가고 있었다.", choices: [
    { id: "share", label: "함께 지낼 시간을 마련한다", cost: 10, risk: "친구와의 유대 +10 · 물자 -10", apply: (life) => { life.friendBond += 10; life.supplies -= 10; return "일정을 바꾸어 함께 보낼 저녁을 남겼다."; } },
    { id: "work", label: "당장의 일을 우선한다", risk: "물자 +10 · 친구와의 유대 -10", apply: (life) => { life.supplies += 10; life.friendBond -= 10; return "일은 늘었지만 돌아왔을 때 빈자리가 더 크게 보였다."; } }
  ] },
  { id: "life_distance", age: at(40, 216), art: (life) => life?.creationVersion >= 20 ? "deckNightWatch" : "deck", title: "그날의 편지", body: (life) => life.friendBond >= 40 ? "그날 저녁 먼 항구에서 편지가 왔다. 서로 다른 일을 하면서도 안부를 물을 사람은 남아 있었다." : "그날 저녁 답장하지 못한 편지가 남았다. 다시 말을 걸고 싶어도 지난 시간을 한 번에 되돌릴 수는 없었다." },
  { id: "life_haki_practice", age: at(42, 226), art: (life) => life?.creationVersion >= 20 ? "workbenchHakiTraining" : "deck", title: "수련을 이어 가는 날", body: "배움은 한 번의 깨달음으로 끝나지 않았다. 기척을 살피는 일과 몸을 지키는 일, 오래 써 온 기술 중 무엇을 더 익힐지 골랐다.", choices: [
    { id: "observation", label: "견문색을 수련한다", available: (life) => life.skill >= 60, needs: { skill: 60 }, risk: "기술 60 필요 · 견문색 +1", apply: (life) => {
      if (life.skill < 60 && life.creationVersion < 3) return "집중이 오래가지 않았다. 일과 수련의 기초를 더 다져야 했다.";
      life.haki.observation = Math.min(2, life.haki.observation + 1); return "바람소리 사이에서 동료의 발소리를 가려 냈다.";
    } },
    { id: "armament", label: "무장색을 수련한다", available: (life) => life.skill >= 60 && life.health >= 40, needs: { skill: 60, health: 40 }, risk: "기술 60 · 건강 40 필요 · 무장색 +1", apply: (life) => {
      if ((life.skill < 60 || life.health < 40) && life.creationVersion < 3) return "힘을 붙이기 전에 몸을 돌봐야 했다. 수련은 다음으로 미뤘다.";
      life.haki.armament = Math.min(2, life.haki.armament + 1); return "도구를 잡은 손에 힘을 고르게 모을 수 있었다.";
    } },
    { id: "craft", label: "익숙한 도구와 항해술을 연마한다", risk: "기술 +10 · 비능력자도 선택 가능", apply: (life) => { life.skill += 10; return "도구의 마모와 물길의 변화를 더 빨리 알아봤다."; } }
  ] },
  { id: "life_friendly_port", age: at(43, 231), when: (life) => life.creationVersion === 1 || !life.homebound, art: "workbench", title: "먼저 건넨 손", body: "새 기항지의 사람들은 낯선 배에 쉽게 창고를 열지 않았다. 작은 배의 고장을 함께 고치자 서로의 이름을 묻기 시작했다.", choices: [
    { id: "help", label: "수리를 도우며 천천히 친해진다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 8, loyalty: 5 }, apply: (life) => { life.supplies -= 10; life.trust += 10; return "작업이 끝나자 항구 사람들이 다음 물때를 알려 주었다."; } },
    { id: "trade", label: "필요한 거래만 마치고 떠난다", risk: "물자 +10 · 관계 변화 없음", personality: { caution: 6, freedom: 4 }, apply: (life) => {
      life.supplies += 10;
      if (life.creationVersion >= 20 && life.leftHome && !life.homebound) {
        if (followsCaptain(life) && life.canonCrew === "밀짚모자 일당") return "거래를 끝내고 동료들의 배로 돌아왔다. 다음 기항지는 선장의 결정을 따른다.";
        const nextPlace = sailToNextPort(life);
        return `서로의 장부를 맞추고 조용히 출항해 ${nextPlace}에 닻을 내렸다.`;
      }
      return "서로의 장부를 맞추고 조용히 출항했다.";
    } }
  ] },
  { id: "life_route", age: at(44, 235), when: (life) => life.creationVersion === 1 || !life.homebound, art: (life) => life?.creationVersion >= 20 ? "harborDeparture" : "deck", title: "새 항로", body: "새 항로의 지도를 얻었다. 익숙한 곳에 남거나 어려운 길을 시험할 수 있었다.", choices: [
    { id: "new", label: "새 항로를 조사한다", cost: (life) => life.skill < 60 ? 10 : 0, risk: "기술 60이 기록 해독의 기준 · 물자 투입 가능", apply: (life) => { if (life.skill < 60) { life.supplies -= 10; return "길을 잘못 읽어 물자를 잃었다. 다음에는 더 많은 기록이 필요했다."; } life.skill += 10; life.trust += 10; return "위험한 구간을 기록해 다른 배에도 전했다."; } },
    { id: "known", label: "익숙한 길을 지킨다", risk: "물자 +10 · 새 물길은 확인하지 않음", apply: (life) => { life.supplies += 10; return "익숙한 길에도 돌봐야 할 사람이 있었다."; } }
  ] },
  { id: "life_power_trial", age: at(45, 240), art: "lifeStorm", title: "갑판 아래의 소리", body: "정박한 배 아래에서 무너지는 소리가 났다. 갇힌 일꾼을 찾으려면 급히 움직여야 했다. 한 사람의 힘만으로 끝낼 일은 아니었다.", choices: [
    { id: "observe", label: "견문색으로 위치를 찾는다", when: (life) => life.haki.observation > 0, risk: "견문색 사용 · 지역의 신뢰 +10", apply: (life) => { life.trust += 10; return "작은 숨소리가 들리는 쪽을 짚어 동료들에게 알렸다. 일꾼을 꺼낼 길이 열렸다."; } },
    { id: "armor", label: "무장색으로 무너지는 판자를 버틴다", when: (life) => life.haki.armament > 0, risk: "무장색 사용 · 건강 -10 · 지역의 신뢰 +10", apply: (life) => { life.health -= 10; life.trust += 10; return "버티는 동안 동료들이 일꾼을 꺼냈다. 몸에 피로가 남았다."; } },
    { id: "fruit", label: (life) => life.creationVersion >= 3 ? "열매의 힘으로 무너지는 판자를 붙잡는다" : "열매의 힘으로 매듭을 조인다", when: (life) => Boolean(life.devilFruit), risk: (life) => {
      const syn = life.creationVersion >= 20 ? fruitSynergy(life.devilFruit, "mishap_ship_leak") : null;
      return syn?.tier === "good" ? `열매 상성 유리 (${syn.tag}) · 열매 숙련 2 또는 물자 40`
        : syn?.tier === "bad" ? `열매 상성 불리 (${syn.tag}) · 선창 내부 역효과 위험`
        : "열매 숙련 2 또는 물자 40이 버팀의 기준 · 매듭이 풀릴 수 있음";
    }, apply: (life) => {
      const syn = life.creationVersion >= 20 ? fruitSynergy(life.devilFruit, "mishap_ship_leak") : null;
      if (syn?.tier === "bad") { life.health -= 12; life.supplies -= 8; return `좁은 선창에서 능력을 펼치다 역효과가 터졌다. ${syn.note}`; }
      if (life.fruitMastery < 2 && life.supplies < 40 && syn?.tier !== "good") { life.health -= 10; return "밧줄이 급히 풀렸다. 동료들이 대신 판자를 받치며 일꾼을 꺼냈다."; }
      life.trust += 10; return life.creationVersion >= 3 ? `열매의 힘이 판자를 붙잡았다. 동료들이 그 아래에서 일꾼을 꺼냈다.${syn?.tier === "good" ? ` ${syn.note}` : ""}` : "조여진 밧줄이 판자를 붙잡았다. 동료들이 그 아래에서 일꾼을 꺼냈다.";
    } },
    { id: "team", label: "동료와 도구를 모아 구조한다", cost: 10, risk: "물자 10 필요 · 기술 40이 지지대 설치의 기준", apply: (life) => {
      life.supplies -= 10;
      if (life.skill < 40) return "도구를 모았지만 지지대를 바로 세우지 못했다. 다른 작업반이 구조를 마쳤다.";
      life.trust += 10; return "동료들과 지지대를 세웠다. 갇힌 일꾼은 그 틈으로 빠져나왔다.";
    } },
    { id: "call", label: "다른 작업반을 불러 함께 기다린다", risk: "현장에 남아 구조를 기다림 · 신중함 +5", personality: { caution: 5, empathy: 3 }, apply: () => "다른 작업반이 버팀목을 세워 갇힌 일꾼을 꺼냈다." }
  ] },
  { id: "life_rank_offer", age: at(46, 244), when: (life) => life.creationVersion === 1, art: (life) => life?.creationVersion >= 20 ? "workbenchNegotiation" : "workbench", title: "맡을 사람의 수", body: "조직에서 더 많은 사람을 맡아 달라는 제안이 왔다. 직책은 이름뿐인 보상이 아니었다.", choices: [
    { id: "accept", label: "책임을 맡는다", available: (life) => life.skill >= 60 && life.trust >= 40, risk: "기술 60 · 신뢰 40 필요 · 승진", apply: (life) => {
      if (life.skill < 60 || life.trust < 40) return "아직 함께 일할 사람의 신뢰를 얻지 못해 제안은 보류됐다.";
      life.role = byPath(life, "부선장", "상사", "현장 책임자", "수리반장"); life.supplies += 10; return `더 많은 일을 맡아 ${life.role}(으)로 불렸다.`;
    } },
    { id: "decline", label: "기술을 더 익힌다", risk: "기술 +10 · 현재 직책 유지", apply: (life) => { life.skill += 10; return "당장은 사람보다 일을 더 배우기로 했다."; } }
  ] },
  { id: "life_rival", age: at(48, 251), art: "lifeStorm", title: "다른 판단", body: (life) => life.homebound
    ? "가까운 동료가 마을의 일감을 나누는 방식에 반대했다. 같은 사람을 돕고 싶어도 먼저 할 일은 달랐다."
    : "가까운 동료가 항로와 사람을 배치하는 방식에 반대했다. 같은 목표를 말해도 따르는 순서는 달랐다.", choices: [
    { id: "listen", label: "반대 이유를 끝까지 듣는다", risk: "친구와의 유대 +10 · 지역의 신뢰 +10", apply: (life) => { life.friendBond += 10; life.trust += 10; return "의견을 나누는 데 하루가 걸렸지만 함께 떠날 방법을 찾았다."; } },
    { id: "order", label: "자기 판단대로 밀어붙인다", risk: "물자 +10 · 친구와의 유대 -10", apply: (life) => { life.supplies += 10; life.friendBond -= 10; return "일은 빨리 끝났다. 동료는 다음 항해에서 다른 배를 탔다."; } }
  ] },
  { id: "life_command", age: at(51, 258), art: (life) => life?.creationVersion >= 20 ? "deckCommand" : "deck", title: "책임의 크기", body: (life) => `${life.birth.name}의 판단을 기다리는 사람이 늘었다. ${life.affiliation}에서 보낸 세월은 숙련을 쌓았지만, 모든 결정이 옳았던 것은 아니었다.` },
  { id: "life_rival_return", age: at(52, 260), art: (life) => life?.creationVersion >= 20 ? "deckTenseStandoff" : "lifeStorm", title: "다시 만난 선단", when: (life) => life.rival,
    body: (life) => {
      if (life.creationVersion >= 20) {
        if (["사황", "해군 대장", "해군 원수"].includes(life.role) || (life.bounty || 0) >= 500_000_000) {
          return "오래전 부두에서 마주쳤던 선단과 28년 만에 마주쳤다. 상대도 백전노장의 함대로 성장해 있었지만, 이제 바다의 거물이 된 깃발을 보고 함포를 거두며 극도로 긴장했다.";
        }
        return "오래전 부두에서 마주친 무장 선단이 28년의 세월을 지나 다시 나타났다. 백발이 성성해진 상대도 모진 풍파에 지쳐 있었다. 뒤로 돌거나, 말을 걸거나, 먼저 길을 막을 수 있었다.";
      }
      return "오래전 부두에서 마주친 무장 선단이 다시 나타났다. 이번에는 상대도 사람을 잃고 지쳐 있었다. 뒤로 돌거나, 말을 걸거나, 먼저 길을 막을 수 있었다.";
    },
    choices: [
      { id: "truce", label: "서로의 피해를 말하고 휴전을 청한다", available: (life) => life.trust >= 40, risk: "지역의 신뢰 40 필요 · 상대의 대답은 아직 모름", personality: { empathy: 9, loyalty: 5 }, apply: (life) => { life.rival = false; life.trust += 10; return "이름을 지우지는 못했지만 다음 항로에서 서로를 먼저 공격하지 않기로 했다."; } },
      { id: "fight",
        label: (life) => life.creationVersion >= 20 && (["사황", "해군 대장"].includes(life.role) || (life.bounty || 0) >= 500_000_000) ? "위압적인 기세로 상대 선단을 굴복시킨다" : "동료를 앞세워 맞선다",
        available: (life) => life.skill >= 50 && life.health >= 30, needs: { skill: 50, health: 30 },
        bounty: (life) => life.path === "pirate" ? 8_000_000 : 0,
        risk: "기술 50 · 건강 30 필요 · 기술 70 또는 무장색이 전투의 변수",
        personality: { ambition: 7, caution: -6 }, apply: (life) => {
          if (life.creationVersion >= 20 && (["사황", "해군 대장"].includes(life.role) || (life.bounty || 0) >= 500_000_000)) {
            life.trust += 10; life.rival = false; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) + 15;
            return "압도적인 위압감 앞에 상대 선단은 무기를 거두고 고개를 숙였다. 28년에 걸친 악연이 마침내 정리됐다.";
          }
          if (life.skill < 70 && !life.haki.armament) { life.health -= 20; return "상대의 배가 더 빨랐다. 동료를 잃지 않으려 물러났다."; }
          life.health -= 10; life.trust += 10; life.rival = false; return "두 배가 충돌하기 전에 상대가 항로를 비켰다. 더 쫓지는 않았다.";
        } },
      { id: "avoid", label: "다른 항로로 돌아간다", cost: 10, risk: "물자 10 필요 · 우회 중 상대를 놓칠 수 있음", personality: { caution: 8 }, apply: (life) => { life.supplies -= 10; return "멀리 돌아가며 맞부딪치지 않았다. 다음에는 또 판단해야 했다."; } },
      { id: "wait", label: "동료를 지키며 상대가 지나가길 기다린다", risk: "건강 -10 · 밤새 경계", personality: { caution: 5, loyalty: 4 }, apply: (life) => { life.health -= 10; return "밤새 경계를 섰고 상대의 배가 물러난 뒤에야 움직였다."; } }
    ] },
  { id: "life_second_rank", age: at(54, 263), when: (life) => life.creationVersion === 1, art: "deck", title: "두 번째 직책", body: "오래 맡은 일과 남겨 온 기록이 평가받았다. 충분한 기술과 신뢰가 있다면 더 큰 직책을 맡을 수 있었다.", choices: [
    { id: "seek", label: "승진 심사를 받는다", available: (life) => life.skill >= 80 && life.trust >= 60, risk: "기술 80 · 신뢰 60 필요 · 승진", apply: (life) => {
      if (life.skill < 80 || life.trust < 60) { life.trust -= 10; return "기록이 부족해 승진하지 못했다. 부족한 일은 분명해졌다."; }
      life.role = byPath(life, "선장", "소령", "지역 연락 책임자", "조합 책임자"); life.supplies += 10; return `${life.role}(으)로 불리며 더 넓은 일을 맡았다.`;
    } },
    { id: "stay", label: "현장에서 계속 일한다", risk: "기술 +10 · 현재 직책 유지", apply: (life) => { life.skill += 10; return "직책보다 익숙한 현장에 남았다."; } }
  ] },
  { id: "life_conqueror_sign", age: at(55, 264), art: "lifeStorm", title: "말보다 먼저 온 기세", when: (life) => (life.seed % 37 === 0 || life.creationVersion >= 11 && (life.seed % 9 === 0 || life.personality.ambition >= 72)) && life.trust >= (life.creationVersion >= 11 ? 50 : 60), body: "거친 충돌을 멈추려는 순간, 주위의 사람들이 한 걸음 물러났다. 곁에 있던 노련한 이는 드문 패왕색의 기질이 깨어난 것 같다고 말했다. 다루지 못하면 동료도 놀랄 수 있었다.", choices: [
    { id: "train", label: "동료와 거리를 두고 다스리는 법을 배운다", risk: "패왕색 1단계 · 건강 -10", apply: (life) => { life.haki.conqueror = 1; life.health -= 10; return "힘을 쏟는 대신 멈추는 법부터 배웠다. 동료들이 다시 가까이 다가왔다."; } },
    { id: "hold", label: "우선 일터와 사람을 진정시킨다", risk: "지역의 신뢰 +10 · 패왕색은 잠재", apply: (life) => { life.trust += 10; return "낯선 힘을 앞세우지 않았다. 동료들이 다친 사람이 없는지부터 살폈다."; } }
  ] },
  { id: "life_charter", age: at(57, 265), art: (life) => life?.creationVersion >= 20 ? "workbenchReportLetters" : "workbench", title: "남길 기준", body: "후배가 일을 배우러 왔다. 서류보다 몸에 익은 판단을 어떻게 건넬지 고민해야 했다.", choices: [
    { id: "teach", label: "실패한 기록까지 가르친다", risk: "지역의 신뢰 +10 · 인수인계에 시간 사용", apply: (life) => { life.trust += 10; life.successor = true; return "후배는 성공담보다 실패를 고친 과정을 오래 기억했다."; } },
    { id: "solo", label: "당분간 혼자 맡는다", risk: "물자 +10 · 인수인계 미룸", apply: (life) => { life.supplies += 10; return "당장의 일은 빨랐다. 뒤따를 사람은 아직 구하지 못했다."; } }
  ] },
  { id: "life_alliance_council", age: at(59, 268), art: (life) => life?.creationVersion >= 20 ? "deckTenseStandoff" : "deck", title: "함께 움직일 배들", when: (life) => life.alliance, body: "동맹을 맺은 선단들이 한 항구에 모였다. 공동 구조 항로를 만들자는 제안이 나왔고, 누가 물자를 더 낼지도 정해야 했다.", choices: [
    { id: "coalition", label: "공동 항로 연합을 만든다", available: (life) => life.trust >= 70 && life.supplies >= 20,
      risk: "지역의 신뢰 70 · 물자 20 필요 · 선단별 지휘권은 별도", personality: { loyalty: 10, empathy: 7 }, apply: (life) => { life.coalition = true; life.supplies -= 20; life.trust += 10; return "각 배의 지휘권을 남겨 둔 채 공동 구조 항로와 연락망을 만들었다."; } },
    { id: "support", label: "작은 배의 물자를 먼저 보탠다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 8, loyalty: 7 }, apply: (life) => { life.supplies -= 10; life.trust += 10; return "연합은 아직 아니어도 다음 위기 때 부를 이름이 늘었다."; } },
    { id: "break", label: "자기 배의 보급을 우선한다", risk: "물자 +10 · 지역의 신뢰 -20 · 공동 신호 포기", personality: { loyalty: -12, empathy: -8, freedom: 7 }, apply: (life) => { life.alliance = false; life.coalition = false; life.rival = true; life.trust -= 20; life.supplies += 10; return "물자는 남았고 신호에 답할 배는 줄었다. 깨진 약속이 항구마다 전해졌다."; } }
  ] },
  { id: "life_era_pressure", age: at(64, 272), art: "lifeStorm", title: "더 거친 바다", body: (life) => life.homebound
    ? "마을에도 낯선 소식과 부족한 물자가 닿았다. 배를 타지 않아도 집과 이웃을 위한 보급 계획은 필요했다."
    : "항로의 검문과 약탈이 함께 늘었다. 어느 편의 배에 탔든 보급과 대피 계획을 먼저 세워야 했다.", choices: [
    { id: "prepare", label: "대피와 보급을 준비한다", cost: 10, risk: "물자 -10 · 건강 +10", apply: (life) => { life.supplies -= 10; life.health += 10; return "쓸 일이 없기를 바라던 장비가 한 번은 사람을 살렸다."; } },
    { id: "press", label: "속도를 내어 먼저 건넌다", risk: "물자 +10 · 건강 -10", apply: (life) => { life.supplies += 10; life.health -= 10; return "먼저 건넜지만 피로가 오래 남았다."; } }
  ] },
  { id: "life_homecoming", age: at(67, 276), when: (life) => life.creationVersion === 1 || life.leftHome && !life.homebound, art: (life) => ({ 인간: "deck", 어인: "fishman", 밍크족: "mink", "하늘섬 사람": "sky", 거인족: "giant" })[life.birth.species], title: "고향의 다른 얼굴", body: (life) => `${life.birth.home}에 돌아왔을 때 아는 길도 조금 달라져 있었다. ${life.birth.name}을 기억하는 사람과 새로 온 사람이 한곳에서 일했다.`, after: (life) => { moveTo(life, life.birth.home); return "고향에 잠시 머물렀다."; } },
  { id: "life_old_friend", age: at(69, 278), art: (life) => life?.creationVersion >= 20 ? "harborReunion" : "deck", title: "오래된 친구", body: (life) => life.friendBond >= 40 ? "옛 친구와 다시 마주 앉았다. 서로의 선택을 모두 이해하지는 못해도, 물어볼 이야기가 남아 있었다." : "옛 친구의 소식은 다른 사람을 통해 들었다. 멀어진 시간은 서로의 삶에 실제로 있었다." },
  { id: "life_late_work", age: at(71, 280), art: "workbench", title: "몸에 남은 노동", body: "손에 익은 일은 여전히 해낼 수 있었다. 회복에는 전보다 긴 시간이 필요해졌고, 맡을 일을 고르는 방식도 달라져야 했다.", choices: [
    { id: "share", label: "일을 후배와 나눈다", risk: "건강 +10 · 업무를 나눔", apply: (life) => { life.health += 10; life.successor = true; return "혼자 붙들던 일을 나누자 몸과 일정에 여유가 생겼다."; } },
    { id: "hold", label: "계속 앞에서 일한다", risk: "물자 +10 · 건강 -10", apply: (life) => { life.supplies += 10; life.health -= 10; return "일은 끝냈다. 쉬는 날에도 몸의 통증은 가시지 않았다."; } }
  ] },
  { id: "life_retire_choice", age: at(74, 282), art: "workbench", title: "자리에서 물러날 때", body: "지금 맡은 직책을 내려놓아도 삶은 끝나지 않았다. 남은 시간을 어디에 쓸지 결정할 수 있었다.", choices: [
    { id: "retire", label: "직책을 넘기고 물러난다", risk: "은퇴 · 건강 +10 · 후계자에게 일 인계", apply: (life) => { life.retired = true; life.role = "은퇴"; life.health += 10; life.successor = true; return "직책과 기록을 다음 사람에게 넘겼다. 아침은 전보다 조용해졌다."; } },
    { id: "continue", label: "일의 규모를 줄여 이어 간다", risk: "일 지속 · 물자 +10 · 건강 -10", apply: (life) => { life.supplies += 10; life.health -= 10; return "큰 명령에서는 물러났지만 현장의 작은 일은 맡았다."; } }
  ] },
  { id: "life_last_student", age: at(78, 284), art: "workbench", title: "다음 사람의 손", body: (life) => life.successor ? "후배가 이제 혼자 결정을 내렸다. 같은 일을 해도 다른 방법을 고르는 모습을 보며 세월이 흘렀음을 알았다." : "일을 잇겠다는 사람이 늦게 찾아왔다. 다 전해 주기에는 시간이 부족했지만 기록을 함께 읽을 수는 있었다." },
  { id: "life_memory", age: at(80, 286), art: "deck", title: "기억에 남은 항구", body: (life) => `${life.birth.name}은 여러 기항지의 이름보다 그곳에서 함께 버틴 사람을 먼저 떠올렸다. 잃은 일과 얻은 일이 한쪽으로만 정리되지는 않았다.` },
  { id: "life_den_den_mushi", age: at(31, 178), when: (life) => life.creationVersion >= 5,
    art: "workbench", title: "전보벌레의 긴급 회의", body: (life) => `전보벌레가 ${life.birth.name}의 얼굴을 빤히 보더니 느닷없이 옆 배 선장의 목소리로 저녁을 사겠다고 외쳤다. 옆 배의 선원들은 벌써 그 말을 들었다. 소문이 굳기 전에 무슨 통화였는지 알아낼 수 있을까?`, choices: [
      { id: "feast", label: "그냥 함께 먹으며 사정을 묻는다", cost: 10, risk: "물자 10 필요 · 친구와의 유대 +10", personality: { empathy: 5, freedom: 4 },
        apply: (life) => { life.supplies -= 10; life.friendBond += 10; return "식탁에 오른 음식보다 전보벌레가 누구 목소리를 흉내 냈는지가 더 오래 화제가 됐다."; } },
      { id: "trace", label: "전보벌레의 발신지를 확인한다", needs: { skill: 45 }, risk: "기술 45가 단서의 기준 · 실패하면 물자 손실", failRisk: "물자 -10", personality: { caution: 5 },
        fail: (life) => { life.supplies -= 10; return "발신지를 찾으려다 잘못된 통화료만 냈다. 저녁 약속은 여전히 남았다."; },
        apply: (life) => { life.trust += 10; return "다른 배의 선원이 잘못 건 번호였다. 소동의 주인을 찾아내자 두 배가 웃으며 헤어졌다."; } },
      { id: "ignore", label: "벨을 끄고 맡은 일부터 끝낸다", risk: "물자 +5 · 소문은 저절로 가라앉음", personality: { caution: 5 },
        apply: (life) => { life.supplies += 5; return "한참 뒤 전보벌레가 스스로 잠잠해졌다. 옆 배에서는 아직 저녁 메뉴를 정하고 있었다."; } }
    ] },
  { id: "life_sea_king", age: at(49, 250), when: (life) => life.creationVersion >= 5 && life.leftHome && !life.homebound && !life.retired,
    art: "lifeStorm", title: "배보다 큰 그림자", body: "기록지침의 바늘을 읽던 사이 배 아래로 해왕류의 그림자가 지나갔다. 선원 하나가 '돛을 접자'고 외쳤고, 다른 하나는 이미 식량 꾸러미를 들고 있었다. 배가 흔들리기 전에 결정을 내려야 했다.", choices: [
      { id: "retreat", label: "돛을 접고 먼 물길로 빠진다", cost: 10, risk: "물자 10 필요 · 건강 -5", personality: { caution: 7, loyalty: 3 },
        apply: (life) => { life.supplies -= 10; life.health -= 5; return "한참 돌아갔지만 배와 사람은 함께 다음 섬에 닿았다."; } },
      { id: "drift", label: "배의 짐을 버리고 선원들과 파도에 몸을 맡긴다", risk: "건강 -15 · 남은 물자 손실", personality: { caution: 5, loyalty: 5 },
        apply: (life) => { life.health = Math.max(1, life.health - 15); life.supplies = 0; return "배는 크게 망가졌지만 선원들은 서로를 붙잡고 다음 해안에 닿았다."; } },
      { id: "stand", label: "갑판을 지키며 정면에서 길을 튼다", needs: { skill: 70, health: 40 },
        risk: "기술 70 · 건강 40이 버팀의 기준 · 큰 부상 위험", failRisk: "건강 -45 · 항해 중단 위험",
        personality: { ambition: 7, loyalty: 6, caution: -7 },
        fail: (life) => { life.health -= 45; life.supplies -= 20;
          if (life.health <= 0) { life.ending = "death"; life.deathCause = "해왕류와의 충돌"; return "배는 빠져나왔지만 갑판에 남았던 이름 하나는 돌아오지 못했다."; }
          return "해왕류를 지나쳤지만 갑판이 부서졌다. 다음 기항지에서는 치료와 수리가 먼저였다."; },
        apply: (life) => { life.health -= 15; life.skill += 5; life.trust += 10; return "밧줄이 손에서 뜨거워질 때까지 버틴 끝에 배가 그림자 밖으로 벗어났다."; } },
      { id: "haki", label: "패기로 움직임을 읽고 틈을 찾는다", when: (life) => life.haki.observation > 0 || life.haki.armament > 0,
        risk: "견문색 또는 무장색 사용 · 건강 -10", personality: { caution: 5, freedom: 4 },
        apply: (life) => { life.health -= 10; life.skill += 5; return "파도가 뒤집히는 한순간을 읽었다. 동료들이 그 틈에 배를 밀어냈다."; } },
      { id: "fruit", label: "열매의 힘으로 빠져나갈 틈을 만든다", when: (life) => Boolean(life.devilFruit),
        risk: "열매 사용 · 물에 빠지면 도움을 받아야 함", personality: { ambition: 5, freedom: 5 },
        apply: (life) => { life.health -= 10; life.friendBond += 5; return "낯선 힘에 해왕류의 시선이 잠시 옮겨갔다. 동료들이 배를 빼내고 손을 내밀었다."; } }
    ] },
  { id: "life_friend_reunion", age: 35, art: "harborReunion", title: "노을빛 부두의 재회", when: () => false,
    body: (life) => `낯선 기항지의 부두에서 익숙한 목소리가 들렸다. 어린 시절 고향에서 함께 바다를 바라보던 소꿉친구 ${life.friendName || "친구"}였다! 세월이 흘러 어엿한 바다의 일꾼으로 마주 선 두 사람은 등불 아래 마주 앉았다.`,
    choices: [
      { id: "celebrate", label: "함께 술잔을 기울이며 옛 추억을 나눈다", risk: "친구와의 유대 +15 · 지역의 신뢰 +10 · 건강 +5", personality: { empathy: 6, freedom: 4 },
        apply: (state) => { state.friendBond += 15; state.trust += 10; state.health += 5; return `${state.friendName || "친구"}와 밤새 고향 이야기를 나눴다. 각자의 바다를 걷고 있어도 마음만은 그때로 돌아갔다.`; } },
      { id: "support", label: "서로의 항해 물자를 나누고 행운을 빈다", risk: "물자 +20 · 친구와의 유대 +10", personality: { loyalty: 6, caution: 4 },
        apply: (state) => { state.supplies += 20; state.friendBond += 10; return `${state.friendName || "친구"}가 건넨 보급품을 싣고 다시 출항을 준비했다. 먼바다에서도 서로를 잊지 않기로 했다.`; } }
    ] },
  { id: "life_personality_ambition", age: 38, art: "deckCommand", title: "정점을 향한 야망", when: () => false,
    body: "가슴속에서 타오르는 거대한 야망이 더 이상 작은 배에 안주할 수 없게 만들었다. 칠무해나 거대 세력의 영토에 맞서 자신만의 패권을 증명할 기회가 눈앞에 다가왔다.",
    choices: [
      { id: "challenge", label: "거대 세력의 정박지에 깃발을 꽂고 정면 승부한다", needs: { skill: 65, health: 50 }, risk: "기술 65 · 건강 50 필요 · 성공 시 현상금 대폭 상승", failRisk: "건강 -25",
        personality: { ambition: 9, caution: -5 },
        apply: (state) => { if (state.path === "pirate") state.bounty += 50_000_000; state.reputation = (state.reputation || 0) + 20; state.trust += 10; return "거대 세력의 방어선을 뚫고 깃발을 세웠다. 바다 전체에 거대한 야망의 이름이 울려 퍼졌다."; },
        fail: (state) => { state.health -= 25; return "거센 반격에 물러섰지만 가슴속의 야망은 꺾이지 않았다."; } },
      { id: "scheme", label: "수면 아래에서 세력을 규합해 기반을 다진다", risk: "물자 +30 · 지역의 신뢰 +15", personality: { ambition: 7, caution: 5 },
        apply: (state) => { state.supplies += 30; state.trust += 15; return "치밀한 포섭으로 여러 선단을 영향력 아래 두었다. 조용한 거물이 되어가고 있었다."; } }
    ] },
  { id: "life_personality_empathy", age: 38, art: "harborRelief", title: "기항지에 퍼진 은혜", when: () => false,
    body: "지나온 항구마다 베푼 온정과 구호의 손길이 마침내 거대한 보답으로 돌아왔다. 폭풍과 해군의 추격 속에서도 여러 섬의 주민들이 비밀리에 배를 숨겨주고 식량을 날라주었다.",
    choices: [
      { id: "network", label: "민간 구호와 비상 대피 연락망을 완성한다", risk: "지역의 신뢰 +25 · 건강 +15 · 물자 +20", personality: { empathy: 9, loyalty: 6 },
        apply: (state) => { state.trust += 25; state.health += 15; state.supplies += 20; return "바다 곳곳에 위기 때 쉴 수 있는 피난처가 마련됐다. 선행은 가장 단단한 방패가 되었다."; } }
    ] },
  { id: "life_personality_loyalty", age: 38, art: "deckTenseStandoff", title: "목숨을 건 동료들의 맹세", when: () => false,
    body: "절체절명의 암초 지대에서 적함에 포위당했을 때, 동료들이 한 치의 망설임도 없이 앞을 가로막아섰다. 서로를 위해 목숨을 던질 수 있는 유대감이 갑판을 가득 채웠다.",
    choices: [
      { id: "stand_together", label: "동료들과 어깨를 맞대고 포위망을 돌파한다", risk: "친구와의 유대 +20 · 지역의 신뢰 +15 · 건강 +10", personality: { loyalty: 9, empathy: 5 },
        apply: (state) => { state.friendBond += 20; state.trust += 15; state.health += 10; return "완벽한 호흡으로 포위망을 찢고 빠져나왔다. 배의 깃발 아래 선원들은 영원한 형제가 되었다."; } }
    ] },
  { id: "life_personality_caution", age: 38, art: "workbenchReportLetters", title: "그림자 속의 음모 간파", when: () => false,
    body: "항해 장부와 기항지 첩보 속에서 어색한 필적과 암살자의 독 냄새를 미리 알아챘다. 세계정부의 암살반이 쳐놓은 함정이 발동하기도 전에 판세를 뒤집을 기회였다.",
    choices: [
      { id: "counter", label: "함정을 역이용해 추적자들을 고립시킨다", risk: "기술 +15 · 물자 +25 · 평판 상승", personality: { caution: 8, loyalty: 4 },
        apply: (state) => { state.skill += 15; state.supplies += 25; state.reputation = (state.reputation || 0) + 10; return "추적자들은 자신들이 판 함정에 빠졌다. 귀중한 첩보와 군수 물자를 획득했다."; } }
    ] },
  { id: "life_personality_freedom", age: 38, art: "harborDeparture", title: "해도 밖 미지의 하늘과 바다", when: () => false,
    body: "정부와 해군이 그어놓은 해도에 얽매이지 않고 바람의 냄새만을 따라 항해한 끝에, 전설로만 내려오던 숨겨진 해저 동굴과 하늘섬으로 통하는 상승 해류를 발견했다!",
    choices: [
      { id: "explore", label: "지도에 없는 미지의 해역으로 키를 꺾는다", risk: "기술 +20 · 물자 +30 · 자유로운 영혼", personality: { freedom: 10, ambition: 5 },
        apply: (state) => { state.skill += 20; state.supplies += 30; return "아무도 발 딛지 않은 환상의 섬에서 풍요로운 보급과 고대의 유적을 마주했다."; } }
    ] },
  { id: "life_marine_commendation", age: 40, art: "workbenchReportLetters", title: "본부 수감 실적 특별 포상", when: () => false,
    body: "수많은 흉악 해적을 체포해 임펠 다운으로 호송한 혁혁한 공로가 인정되어, 해군 본부 원수로부터 특별 포상과 훈장이 수여됐다.",
    choices: [
      { id: "accept", label: "포상을 수락하고 함대 보급을 확충한다", risk: "물자 +30 · 지역의 신뢰 +20 · 명성 상승", personality: { loyalty: 6, ambition: 5 },
        apply: (state) => { state.supplies += 30; state.trust += 20; state.reputation = (state.reputation || 0) + 15; return "본부의 전폭적인 지원으로 최신형 함포와 보급선을 지원받았다."; } }
    ] },
  { id: "life_infamy_standoff", age: 40, art: "harborBountyInspection", title: "바다를 뒤흔든 악명", when: () => false,
    body: "세계정부가 특급 위험 인물로 지정하며 파견한 정예 군함들이 항구를 봉쇄했다. 자비 없는 악명 앞에 부두 전체가 얼어붙었다.",
    choices: [
      { id: "breakout", label: "악명에 걸맞은 무력으로 포위망을 분쇄한다", needs: { skill: 65, health: 50 }, risk: "기술 65 · 건강 50 필요 · 성공 시 현상금 대폭 상승", failRisk: "건강 -30",
        personality: { ambition: 8, freedom: 6 },
        apply: (state) => { state.bounty += 60_000_000; state.reputation = (state.reputation || 0) - 15; return "군함의 방어선을 일격에 격파하고 포위망을 뚫었다. 바다는 공포에 떨었다."; },
        fail: (state) => { state.health -= 30; return "함포 사격을 뚫고 간신히 탈출했다. 상처는 깊었지만 악명은 더욱 치솟았다."; } }
    ] },
  { id: "life_emperor_decree", age: 50, art: "deckCommand", title: "사황의 영역과 깃발", when: () => false,
    body: (life) => `신세계에 펄럭이는 ${life.birth.name}의 해적 깃발 아래 여러 섬과 산하 해적단이 모였다. 다른 사황과의 해역 경계, 영역 주민 보호, 쳐들어오는 최악의 세대 루키들을 어떻게 다룰지 결단을 내려야 했다.`,
    choices: [
      { id: "protect", label: "가맹하지 못한 섬들에게 깃발을 빌려주고 보호한다", risk: "지역의 신뢰 +20 · 물자 -10 · 명성 상승", personality: { empathy: 8, loyalty: 6 },
        apply: (state) => { state.trust += 20; state.supplies -= 10; state.reputation = (state.reputation || 0) + 15; return "사황의 깃발 아래 주민들은 평화를 얻었다. 바다 곳곳에서 신뢰의 목소리가 모였다."; } },
      { id: "dominate", label: "신세계 해상 요충지를 장악해 통행세를 거둔다", risk: "물자 +30 · 현상금 5억 상승 · 악명 상승", personality: { ambition: 9, caution: -5 },
        apply: (state) => { state.supplies += 30; state.bounty += 500_000_000; state.reputation = (state.reputation || 0) - 10; return "철저한 패권 장악으로 막대한 군수 물자를 확보했다. 신세계의 긴장감이 높아졌다."; } },
      { id: "clash", label: "영해를 침범한 적대 사황 간부 선단을 직접 격퇴한다", needs: { skill: 75, health: 60 }, risk: "기술 75 · 건강 60 필요 · 성공 시 현상금 3억 상승", failRisk: "건강 -25",
        personality: { ambition: 8, loyalty: 5 },
        apply: (state) => { state.skill += 10; state.health -= 10; state.bounty += 300_000_000; state.reputation = (state.reputation || 0) + 10; return "선두에 서서 적대 세력을 일격에 바다로 밀어냈다. 사황의 위엄을 확고히 각인시켰다."; },
        fail: (state) => { state.health -= 25; return "치열한 교전 끝에 상대를 몰아냈지만 깊은 상처가 남았다."; } }
    ] },
  { id: "life_admiral_verdict", age: 50, art: "deckCommand", title: "대장의 정의와 결단", when: () => false,
    body: (life) => `해군 대장의 정의 코트를 걸친 ${life.birth.name}의 집무실로 중대한 전보가 들어왔다. 천룡인의 불합리한 출격 명령과 관할 해역 민간인 피난 작전의 우선순위를 정해야 했다.`,
    choices: [
      { id: "protect_civilians", label: "천룡인의 호위를 미루고 민간인 피난선부터 호송한다", risk: "지역의 신뢰 +25 · 명성 상승 · 본부의 질책", personality: { empathy: 9, loyalty: 4 },
        apply: (state) => { state.trust += 25; state.reputation = (state.reputation || 0) + 20; state.injustice = true; return "민간인 수천 명을 무사히 구출했다. 천룡인은 분노했지만 바다의 사람들은 대장의 정의를 칭송했다."; } },
      { id: "iron_justice", label: "해군 본부의 군사 작전을 최우선으로 위험 분자를 섬멸한다", needs: { skill: 70, health: 50 }, risk: "기술 70 · 건강 50 필요 · 수감 실적 상승", failRisk: "건강 -20",
        personality: { loyalty: 8, ambition: 6 },
        apply: (state) => { state.skill += 10; state.supplies += 15; state.arrestCount = (state.arrestCount || 0) + 2; state.reputation = (state.reputation || 0) + 10; return "흉악 해적 선단을 궤멸시키고 주동자를 임펠 다운으로 호송했다."; },
        fail: (state) => { state.health -= 20; return "격렬한 저항에 부딪혀 일부를 놓쳤다. 함선 정비에 시간이 걸렸다."; } }
    ] },
  { id: "life_liberator_strike", age: 50, art: "workbenchNegotiation", title: "혁명군 군대장의 결단", when: () => false,
    body: "세계정부 가맹국의 폭정에 맞선 민중 봉기가 일어났다. 천룡인에게 바칠 천상금 수송선을 가로막고 혁명 세력을 전면 지원할 시기가 왔다.",
    choices: [
      { id: "intercept", label: "천룡인의 수송선을 급습해 물자를 해방군에 나눈다", risk: "물자 +35 · 지역의 신뢰 +20 · 명성 상승", personality: { freedom: 8, empathy: 7 },
        apply: (state) => { state.supplies += 35; state.trust += 20; state.reputation = (state.reputation || 0) + 15; return "천상금을 빼앗아 굶주린 백성들에게 곡식과 약품을 배급했다. 해방의 함성이 울렸다."; } },
      { id: "liberate", label: "억압받는 주민들을 훈련시키고 자치 방위군을 결성한다", risk: "기술 +10 · 지역의 신뢰 +25 · 유대 상승", personality: { loyalty: 8, empathy: 6 },
        apply: (state) => { state.skill += 10; state.trust += 25; state.friendBond += 15; return "주민들 스스로 나라를 지킬 수 있는 힘을 길러주었다. 혁명의 불씨가 뿌리내렸다."; } }
    ] }
];

export const lifeScenes = [...origin, ...scenes.map((card) => ({ act: card.age === 0 ? 1 : 2, species: "all", ...card }))]
  .map((card) => {
    const condition = card.when;
    return { ...card, when: (life) => isAlive(life) && (!condition || condition(life)) };
  });

// Independent personal incidents can arrive in different years in rule 4.
export const FLEX_IDS = new Set(["life_first_pay", "life_friendly_port", "life_route", "life_rival",
  "life_command", "life_charter", "life_era_pressure", "life_old_friend", "life_late_work"]);
export const FLEX_IDS_V5 = new Set([...FLEX_IDS, "life_school", "life_training", "life_setback", "life_mentor",
  "life_fruit_practice", "life_new_routine", "life_haki_training", "life_haki_practice", "life_power_trial",
  "life_rival_return", "life_conqueror_sign", "life_alliance_council", "life_homecoming",
  "life_last_student", "life_memory", "life_den_den_mushi", "life_sea_king"]);

function flexibleIncident(life, age) {
  if (life.creationVersion < 4 || !life.path) return null;
  const eligible = life.creationVersion >= 9 ? new Set([...FLEX_IDS_V5, ...V9_FLEX]) : life.creationVersion >= 5 ? FLEX_IDS_V5 : FLEX_IDS;
  const options = scenes.filter((card) => {
    if (!eligible.has(card.id) || life.seen.includes(card.id) || card.when && !card.when(life)) return false;
    if (life.creationVersion >= 11 && V11_DEFERRED.has(card.id)) return false;
    if (life.creationVersion >= 6 && (card.id === "life_school" || card.id === "life_training")) return false;
    if (life.creationVersion >= 5 && card.id === "life_haki_practice" && !life.haki.observation && !life.haki.armament) return false;
    const center = life.creationVersion >= 11 && card.id === "life_conqueror_sign" ? giant(life) ? 160 : 32
      : typeof card.age === "function" ? card.age(life) : card.age;
    const window = life.creationVersion >= 5 && center < (giant(life) ? 112 : 19) ? giant(life) ? 12 : 3
      : life.creationVersion >= 9 ? giant(life) ? 36 : 11 : giant(life) ? 24 : 7;
    return age >= center - window && age <= center + window;
  });
  if (!options.length || yearRoll(life.seed ^ 0x4ecb7f1a, age) % (life.creationVersion >= 9 ? 2 : 3) !== 0) return null;
  const chosen = options[yearRoll(life.seed ^ 0x93f4a26d, age) % options.length];
  return { ...chosen, age, act: 2, species: "all", yearly: true, urgent: true };
}

const growingYears = [
  ["작은 수리", "양육자가 낡은 도구를 고쳤다. 고치는 동안 쓸 수 없는 물건은 다른 손으로 빌려야 했다."],
  ["돌아온 배", "예정보다 늦은 배가 돌아왔다. 기다린 사람들은 화를 내기 전에 다친 곳부터 살폈다."],
  ["새로 온 이웃", "낯선 가족이 집을 구했다. 마을의 길을 알려 주는 일은 아이들에게도 맡길 수 있었다."],
  ["첫 장부", "양육자가 하루의 지출을 적었다. 숫자는 적어도 다음 날의 밥을 바꾸었다."],
  ["끊어진 밧줄", "부두의 밧줄 하나가 낡아 끊어졌다. 사람들은 다시 묶기 전에 어디서 닳았는지 보았다."],
  ["긴 비", "비가 여러 날 이어져 일손이 줄었다. 집마다 마른 물건을 나누어 썼다."],
  ["먼 곳의 말", "지나가는 선원이 다른 바다의 이름을 들려줬다. 그곳에 가는 길은 이야기보다 훨씬 길었다."],
  ["다친 손", "함께 일하던 이가 손을 다쳤다. 한 사람이 빠지면 남은 사람의 하루도 달라졌다."],
  ["길의 표식", "어른들이 흐려진 표식을 다시 그렸다. 돌아오는 길을 아는 일은 떠나는 일만큼 중요했다."],
  ["빈 그릇", "고기가 적게 잡힌 계절이었다. 이웃끼리 먹을 것을 나누며 다음 출항을 기다렸다."],
  ["다른 배의 아이", "기항한 배에서 또래를 만났다. 서로 쓰는 말은 달라도 놀 수 있는 시간은 짧았다."],
  ["바람의 방향", "해가 지기 전에 바람이 바뀌었다. 어른들은 출항을 늦추고 밧줄을 더했다."],
  ["작은 약속", "친구와 다음 쉬는 날에 만나기로 했다. 일이 생겨 약속을 지키는 일이 생각보다 어려웠다."],
  ["남겨 둔 도구", "돌아오지 않은 일꾼의 도구가 작업장에 남았다. 누구도 바로 그 자리를 차지하지 않았다."],
  ["처음 본 지도", "낡은 지도에는 잘못 그려진 물길도 있었다. 여러 사람의 기억을 맞춰야 길이 보였다."],
  ["물때를 기다리며", "서두른 배는 얕은 물에서 움직이지 못했다. 기다림에도 기술이 필요하다는 말을 들었다."],
  ["조용한 밤", "그날 밤에는 배가 돌아오지 않았다. 사람들은 불빛을 끄지 않고 바다를 살폈다."],
  ["먼 편지", "오래 떠난 사람이 보낸 편지가 도착했다. 몇 줄의 안부가 집의 분위기를 바꾸었다."],
  ["옮겨진 짐", "물자 창고가 비좁아졌다. 작은 짐을 제대로 옮기는 일에도 순서가 있었다."],
  ["다시 맑은 날", "흐린 날이 지나자 젖은 도구를 말렸다. 평범한 아침을 맞는 데에도 여러 손이 들었다."]
];

const workingYears = [
  ["새 기항지", (life) => `${life.job}의 일로 낯선 기항지에 닿았다. 배에서 내린 뒤에는 이곳의 규칙을 먼저 들어야 했다.`],
  ["마른 식량", "예상보다 항해가 길어져 식량을 다시 나눴다. 남은 양을 솔직히 세는 편이 다툼을 줄였다."],
  ["찢어진 돛", "돛의 작은 찢김을 발견했다. 큰 바람이 오기 전에 손보지 않으면 모두의 일정이 밀렸다."],
  ["밤 당직", "한밤의 당직은 사건 없이 끝났다. 아무 일도 일어나지 않도록 살피는 사람이 있었다."],
  ["다른 주장", (life) => byPath(life, "선원 둘이 다음 항로를 놓고 다퉜다. 선장의 말도 날씨를 바꾸지는 못했다.", "기지의 보고서와 현장의 말이 달랐다. 확인할 사람을 다시 보냈다.", "연락처를 넘길 순서를 두고 의견이 갈렸다. 한 사람의 안전이 달려 있었다.", "수리 순서를 두고 선주들이 다퉜다. 먼저 떠나야 할 배를 직접 살폈다.")],
  ["쌓인 편지", "집에서 온 편지가 여러 장 쌓였다. 답장을 쓰는 일이 다음 항해만큼 중요하게 느껴졌다."],
  ["작은 병", "동료가 앓아누웠다. 남은 사람들은 일을 나누고 치료할 곳을 찾았다."],
  ["바뀐 물길", "평소 지나던 물길에 모래가 쌓였다. 오래된 지도를 고집하지 않고 표식을 새로 달았다."],
  ["장부의 빈칸", "물자 장부의 빈칸이 발견됐다. 누군가 훔쳤다고 단정하기 전에 숫자를 다시 맞췄다."],
  ["돌아온 손님", "오래전 도움을 받았던 사람이 다시 찾아왔다. 기억한 일과 잊은 일이 서로 달랐다."],
  ["묵은 상처", "오래전 다친 곳이 비 오는 날마다 아팠다. 몸을 숨기지 않고 일의 속도를 바꿨다."],
  ["항구의 소문", "큰 배에 관한 소문이 먼저 도착했다. 사실을 확인하기 전에는 결정을 미뤘다."],
  ["후배의 실수", "새로 온 일꾼이 같은 매듭을 두 번 잘못 걸었다. 꾸짖기보다 왜 풀렸는지 함께 보았다."],
  ["먼바다의 불빛", "밤바다에 낯선 불빛이 보였다. 아침이 오기 전에는 어느 편의 배인지 알 수 없었다."],
  ["비어 있는 자리", "함께 일하던 사람이 다른 배로 떠났다. 빈자리를 메우는 동안 남은 사람의 몫이 늘었다."],
  ["쉬어 가는 날", "날씨가 출항을 막았다. 평소 미뤄 두었던 장비를 손보고 몸을 쉬게 했다."],
  ["새로운 계약", (life) => `${life.affiliation}의 새 일이 들어왔다. 약속한 보수와 실제 필요한 물자를 다시 따져 보았다.`],
  ["작은 잔치", "무사히 돌아온 배를 위해 음식을 나눴다. 걱정했던 날을 이야기할 때야 웃음이 나왔다."],
  ["늦은 보고", "한 기항지의 소식이 뒤늦게 닿았다. 그 사이 다른 사람들이 이미 결정을 내렸을 수도 있었다."],
  ["멈춘 작업", "잘못된 재료가 들어와 일을 멈췄다. 서두르지 않은 덕에 더 큰 손실은 피했다."],
  ["갈라진 의견", "동료의 판단에 동의하지 않았지만 같은 배를 지켜야 했다. 서로 할 수 있는 일을 다시 나눴다."],
  ["낡은 표지", "항로의 오래된 표식을 갈아 끼웠다. 처음 보는 배도 길을 읽을 수 있도록 남겼다."],
  ["남겨진 몫", "돌아오지 못한 일꾼의 가족에게 물자를 건넸다. 한 번의 방문으로 슬픔이 끝나지는 않았다."],
  ["다음 출항", "출항 전날에는 준비물을 두 번 셌다. 지난번에 잃은 것을 떠올리는 사람도 있었다."]
];

const homeYears = [
  ["장날의 자리", "마을 장터에 새 좌판이 들어왔다. 자리를 나누는 일에도 오래된 약속이 있었다."],
  ["지붕을 고친 날", "비가 새는 집에 일손이 모였다. 한 집의 수리는 이웃의 하루도 바꾸었다."],
  ["돌아온 이웃", "먼 곳에 나갔던 이가 돌아왔다. 새로 배운 말보다 집 앞의 변화를 먼저 물었다."],
  ["마른 우물", "물길이 얕아지자 집마다 쓰는 양을 적었다. 먼저 필요한 곳을 정하기가 쉽지 않았다."],
  ["아이들의 길", "아이들이 다니는 길의 난간을 고쳤다. 위험을 줄이는 일은 이름을 남기지 않았다."],
  ["다른 계절", "올해의 바람은 평소와 달랐다. 익숙한 일을 하던 사람들도 계획을 다시 세웠다."],
  ["먼 배의 편지", "항구에 들른 배가 옛 친구의 편지를 전했다. 답장에는 마을의 작은 소식이 담겼다."],
  ["새 일꾼", "처음 온 일꾼은 도구를 다르게 썼다. 서로의 방법을 보고 난 뒤에야 일을 나눌 수 있었다."],
  ["바뀐 장부", "마을의 공동 장부에서 숫자가 맞지 않았다. 누군가를 탓하기 전에 지난 계절을 다시 셌다."],
  ["흐린 저녁", "불빛을 일찍 켠 집이 있었다. 무슨 일이 생겼는지 살피러 가는 이웃도 있었다."],
  ["작은 치료", "일하다 손을 다친 사람이 쉬는 동안 다른 이들이 그의 몫을 조금씩 맡았다."],
  ["고요한 축제", "오랜만에 모두가 같은 식탁에 앉았다. 떠난 사람의 자리도 이야기 속에 남아 있었다."],
  ["남겨 둔 씨앗", "다음 계절을 위해 일부 물자를 쓰지 않고 남겼다. 지금 필요한 사람을 외면하는 일도 아니어야 했다."],
  ["낯선 손님", "지나가던 여행자가 하루 머물렀다. 다른 섬의 소식은 들었지만 떠날 이유가 되지는 않았다."],
  ["한밤의 비", "밤새 내린 비가 작업장 바닥까지 흘렀다. 아침에는 젖은 도구부터 말렸다."],
  ["새로 그은 선", "공동 일터의 자리를 다시 나눴다. 오래 써 온 사람과 처음 온 사람의 말이 달랐다."]
];

const laterYears = [
  ["낡은 도구", "손에 익은 도구를 고쳐 썼다. 새것보다 무거웠지만 어느 부분이 약한지 알고 있었다."],
  ["다른 사람의 결정", "후배가 다른 방법을 택했다. 틀렸다고 말하기 전에 결과를 기다렸다."],
  ["늦은 아침", "일찍 일어나지 않은 아침이었다. 바깥에서는 여전히 배를 묶는 소리가 들렸다."],
  ["옛 항로", "지도에 오래전에 지났던 길을 표시했다. 그때의 사람들은 지금 다른 곳에 있었다."],
  ["짧은 방문", "예전 동료가 잠시 들렀다. 최근의 일보다 젊은 날의 실수가 먼저 화제가 됐다."],
  ["돌아오는 편지", "안부를 묻는 편지가 왔다. 먼 곳에 남아 있는 사람이 있다는 사실을 다시 알았다."],
  ["덜어 낸 짐", "혼자 들던 물자를 둘이 옮겼다. 일을 나누는 방식이 예전과 달라졌다."],
  ["작업장의 새 소리", "새 일꾼들이 익숙하지 않은 도구를 들여왔다. 배를 지키려는 이유는 같았다."],
  ["바다를 보는 시간", "한동안 항구를 바라보았다. 출항하는 배의 목적을 모두 알 필요는 없었다."],
  ["적어 둔 이름", "장부 한쪽에서 오래전 동료의 이름을 찾았다. 함께 끝낸 일이 그 아래에 적혀 있었다."],
  ["조용한 진료", "몸의 통증을 숨기지 않고 치료할 곳을 찾았다. 쉬는 시간을 미리 정했다."],
  ["돌려준 물건", "빌려 두었던 물건을 원래 주인에게 돌려줬다. 물건에는 함께 보낸 시간이 남아 있었다."],
  ["후배의 출항", "후배가 처음으로 스스로 항로를 정했다. 그 배가 보이지 않을 때까지 기다렸다."],
  ["긴 그림자", "해가 낮아지자 계류장의 그림자가 길어졌다. 그날 해야 할 일은 많지 않았다."],
  ["남은 식탁", "가까운 사람들과 천천히 식사했다. 바쁜 날에는 끝까지 듣지 못했던 이야기가 나왔다."],
  ["새 나침반", "낡은 나침반을 새 일꾼에게 보여 줬다. 바늘 하나만으로 항해할 수 없다는 말도 함께 전했다."]
];

const homeLaterYears = [
  ["익숙한 창가", "창밖으로 같은 길을 지나는 사람들의 얼굴이 바뀌었다. 먼저 인사하는 습관은 남았다."],
  ["손에 남은 일", "예전처럼 빨리 끝내지는 못해도 어디부터 고칠지는 알고 있었다."],
  ["다음 세대의 장부", "후배가 공동 장부를 고쳤다. 오래된 숫자를 설명하며 서로 다른 계절을 떠올렸다."],
  ["느린 장날", "장터까지 걷는 시간이 길어졌다. 가까운 사람이 함께 걸으며 새 소식을 들려줬다."],
  ["저녁의 이름", "함께 일하던 사람의 이름을 떠올렸다. 마을의 길에는 그들이 남긴 손길이 있었다."],
  ["새 지붕", "옛집의 지붕을 젊은 일꾼들이 다시 얹었다. 본인은 그늘에서 필요한 도구를 건넸다."],
  ["남은 자리", "떠난 배가 보이지 않아도 마을의 하루는 이어졌다. 누군가는 돌아왔고 누군가는 편지만 보냈다."],
  ["오래된 약속", "어릴 적 친구와 했던 약속을 꺼냈다. 지킨 일과 지키지 못한 일을 함께 웃으며 셌다."],
  ["새로운 이웃", "빈집에 새 가족이 들어왔다. 알려 줄 길이 아직 많다는 사실을 알았다."],
  ["덜어 낸 일", "한 사람이 하던 일을 여러 손이 나눴다. 오래 버티는 법도 남겨 줄 수 있었다."],
  ["마지막 수리", "고장난 물건을 고치다 손을 멈췄다. 후배가 뒤를 이어 마무리했다."],
  ["평범한 아침", "창문을 열자 늘 듣던 일터의 소리가 났다. 특별한 사건이 없어도 하루는 채워졌다."]
];

const annualDecisions = [
  { title: "망가진 장비", body: "갑작스러운 고장으로 일 준비가 멈췄다. 손을 대기 전에 상태를 살필 시간이 필요했다.", choices: [
    { id: "repair", label: "직접 고친다", cost: (life) => life.skill < 40 ? 10 : 0, risk: "기술 40이 수리의 기준 · 재료가 더 들 수 있음", personality: { ambition: 5, caution: -3 }, apply: (life) => { if (life.skill < 40) { life.supplies -= 10; return "서둘러 고친 곳이 다시 풀렸다. 재료를 새로 구해야 했다."; } life.skill += 10; return "고장난 부분을 고치고 원인을 장부에 적었다."; } },
    { id: "ask", label: "숙련자와 함께 살핀다", cost: 10, risk: "지역의 신뢰 +10 · 물자 -10", personality: { caution: 5, empathy: 3 }, apply: (life) => { life.trust += 10; life.supplies -= 10; return "함께 고치며 다음에도 쓸 방법을 배웠다."; } },
    { id: "delay", label: "일정을 미루고 장비를 빌린다", risk: "물자 변화 없음 · 일정 지연", personality: { caution: 4 }, apply: () => "이웃 작업장의 장비를 빌려 임시로 고장을 막았다." }
  ] },
  { title: "늦게 도착한 배", body: "약속한 배가 늦었다. 기다리는 사람들에게 먼저 알릴지, 확인하러 갈지 결정해야 했다.", choices: [
    { id: "tell", label: "기다리는 사람에게 상황을 알린다", risk: "지역의 신뢰 +10", personality: { empathy: 5, loyalty: 4 }, apply: (life) => { life.trust += 10; return "걱정은 사라지지 않았지만 서로 다른 소문은 줄었다."; } },
    { id: "seek", label: "배의 항로를 먼저 확인한다", cost: 10, risk: "물자 -10 · 기술 +10", personality: { ambition: 4, caution: 3 }, apply: (life) => { life.supplies -= 10; life.skill += 10; return "배가 지나간 물길을 찾아냈다. 돌아가서 기다리던 사람에게 알렸다."; } }
  ] },
  { title: "친구의 부탁", body: "오래 알고 지낸 사람이 일이 끝난 뒤 잠시 함께해 달라고 했다. 다음 출항 준비도 남아 있었다.", choices: [
    { id: "visit", label: "친구 곁에 머문다", cost: 10, risk: "친구와의 유대 +10 · 물자 -10", personality: { empathy: 5, loyalty: 5 }, apply: (life) => { life.friendBond += 10; life.supplies -= 10; return "작은 이야기를 오래 들었다. 그날의 일은 다음 날로 미뤘다."; } },
    { id: "work", label: "일을 마치고 편지를 보낸다", risk: "물자 +10 · 친구와의 유대 -10", personality: { ambition: 4, freedom: 3 }, apply: (life) => { life.supplies += 10; life.friendBond -= 10; return "일은 끝났지만 편지로는 전하지 못한 말이 남았다."; } }
  ] },
  { title: "몸의 신호", body: "몸이 평소보다 무거웠다. 쉬어야 한다는 말을 들었지만 맡은 일도 있었다.", choices: [
    { id: "rest", label: "며칠 쉬며 치료받는다", cost: 10, risk: "건강 +10 · 물자 -10", personality: { caution: 5 }, apply: (life) => { life.health += 10; life.supplies -= 10; return "일을 나누고 쉰 뒤 다시 걸을 수 있었다."; } },
    { id: "push", label: "오늘의 일을 끝낸다", risk: "물자 +10 · 건강 -10", personality: { ambition: 5, caution: -4 }, apply: (life) => { life.supplies += 10; life.health -= 10; return "일은 끝났다. 쉬어야 할 날이 뒤로 밀렸다."; } }
  ] },
  { title: "서로 다른 증언", body: "항구에서 같은 사건을 두고 다른 말이 나왔다. 누구의 말도 바로 확인할 수 없었다.", choices: [
    { id: "check", label: "현장을 다시 확인한다", risk: "기술 +10 · 지역의 신뢰 +10", personality: { caution: 5, loyalty: 3 }, apply: (life) => { life.skill += 10; life.trust += 10; return "흔적을 다시 보니 처음 들은 이야기와 달랐다."; } },
    { id: "leave", label: "판단을 미루고 떠난다", risk: "물자 +10 · 지역의 신뢰 -10", personality: { freedom: 4, loyalty: -4 }, apply: (life) => {
      life.supplies += 10; life.trust -= 10;
      if (life.creationVersion >= 20 && life.leftHome && !life.homebound) {
        if (followsCaptain(life) && life.canonCrew === "밀짚모자 일당") return "급한 일은 끝냈지만 항구에는 의문이 남았다. 동료들과 배로 돌아와 출항 준비를 도왔다.";
        const nextPlace = sailToNextPort(life);
        return `급한 일은 끝냈지만 항구에는 의문이 남았다. 배는 서둘러 ${nextPlace}로 향했다.`;
      }
      return "급한 일은 끝냈지만 항구에는 의문이 남았다.";
    } }
  ] },
  { title: "새로 온 일꾼", body: "낯선 사람이 같은 일을 배우러 왔다. 당장 손이 필요한 날이었다.", choices: [
    { id: "teach", label: "일의 순서를 가르친다", risk: "지역의 신뢰 +10 · 후계자와의 인연", personality: { empathy: 5, loyalty: 5 }, apply: (life) => { life.trust += 10; life.successor = true; return "시간은 더 걸렸지만 다음 작업부터 손이 맞았다."; } },
    { id: "assign", label: "쉬운 일부터 맡긴다", risk: "물자 +10 · 교육은 다음으로", personality: { ambition: 4, caution: 3 }, apply: (life) => { life.supplies += 10; return "그날의 일은 마쳤다. 어려운 일은 아직 알려 주지 못했다."; } }
  ] }
];

const RANK_ROLES = {
  pirate: ["선원", "간부", "부선장"],
  marine: ["상사", "소위", "소령", "대령", "중장"],
  liberator: ["현장 연락원", "지역 연락 책임자", "작전 책임자"],
  civilian: ["숙련 일꾼", "수리반장", "조합 책임자"]
};

function careerOpportunity(life, age, base) {
  if (life.creationVersion < 2 || !life.path || life.retired) return null;
  const yearsFromCareer = age - life.careerStartAge;
  const tenureNeeded = giant(life) ? 35 : 10;
  const offerGap = giant(life) ? 50 : 18;
  const opportunities = [];
  if (life.path !== "liberator" && yearsFromCareer >= tenureNeeded && (life.injustice || life.rescued > 0 || life.trust >= 70)
    && storyBefore(life, age) <= 22 && storyBefore(life, age) >= 0
    && age - life.lastRevolutionOfferAge >= offerGap) {
    opportunities.push({ ...base, id: `life_revolution_invitation_${age}`, urgent: true, art: "workbench", title: "멀리서 온 연락원",
      body: life.injustice
        ? "그날 사람을 먼저 도운 일로 기존 조직과 사이가 벌어졌다. 혁명군의 지역 연락원이 찾아와 다른 곳에서도 비슷한 사람을 돕고 있다고 말했다."
        : "여러 항구에서 사람을 도운 기록이 연락망에 전해졌다. 혁명군의 지역 연락원이 찾아와 새로운 일을 제안했다.", choices: [
        { id: "stay", label: "지금 맡은 사람들 곁에 남는다", risk: "현재 소속 유지 · 그날의 일은 기록에 남음",
          apply: (state) => { state.lastRevolutionOfferAge = age; return "제안을 접고 지금의 일을 이어 갔다."; } },
        { id: "join", label: "혁명군의 지역 연락망에 들어간다", available: (state) => state.trust >= (state.path === "pirate" ? 60 : 40),
          risk: `지역의 신뢰 ${life.path === "pirate" ? 60 : 40} 필요 · 새 조직에서는 연락원부터`,
          personality: { empathy: 7, freedom: 6 }, apply: (state) => { setCareer(state, "liberator"); state.affiliation = "혁명군"; state.lastRevolutionOfferAge = age; depart(state); return "지나온 일을 안고 지역 연락원으로 새 일을 시작했다."; } }
      ] });
  }
  if (life.path === "pirate" && !life.independent && yearsFromCareer >= 3 && life.skill >= 35
    && life.friendBond >= 40 && age - life.lastCrewOfferAge >= (giant(life) ? 50 : 18)
    // Rule 14 replaced the scenes that made rivals and rescues, so rule 19 lets a crew that trusts you ask without them.
    && (life.rival || life.alliance || life.rescued > 0 || life.creationVersion >= 19)) {
    opportunities.push({ ...base, id: `life_crew_offer_${age}`, urgent: true, art: "deck", title: "한 척의 배를 맡을 때",
      body: "함께 항해한 사람들이 자기들만의 배를 꾸려 보자고 물었다. 지금의 선장을 떠나면 항로와 식량, 동료의 몫을 직접 책임져야 했다.", choices: [
        { id: "remain", label: "지금의 해적단에 남는다", risk: "현재 직책 유지 · 기술 +10", personality: { loyalty: 5 },
          apply: (state) => { state.lastCrewOfferAge = age; state.skill += 10; return "익숙한 배에서 하던 일을 이어 갔다."; } },
        { id: "found", label: "동료들과 독립 해적단을 만든다", available: (state) => state.skill >= 40 && state.supplies >= 30 && state.friendBond >= 40,
          risk: "기술 40 · 물자 30 · 친구와의 유대 40 필요 · 출항 물자 -20", personality: { ambition: 8, freedom: 7, loyalty: 4 },
          naming: true, apply: (state, named) => { state.independent = true; state.rankTier = 3; state.job = "해적단 선장"; state.affiliation = ownCrew(state, named); state.role = "선장"; state.supplies -= 20; state.lastCrewOfferAge = age; return "동료와 배의 장부를 함께 만들고 선장으로 항로를 정했다."; } }
      ] });
  }
  if (life.path !== "marine" && yearsFromCareer >= tenureNeeded && life.trust >= 50
    && (life.rescued > 0 || life.trust >= 70 || life.homebound && life.bond >= 50)
    && age - life.lastMarineOfferAge >= offerGap) {
    opportunities.push({ ...base, id: `life_marine_invitation_${age}`, urgent: true, art: "specialMarineDeck", title: "해군 지부의 제안",
      body: "지역 해군 지부가 구조와 항로 기록을 살피고 입대 의사를 물었다. 지금의 일과 동료를 떠난다면 수병부터 다시 시작해야 했다.", choices: [
        { id: "remain", label: "지금의 일을 이어 간다", risk: "현재 소속 유지 · 기술 +10", personality: { loyalty: 5 },
          apply: (state) => { state.lastMarineOfferAge = age; state.skill += 10; return "제안서를 접고 원래 맡은 자리로 돌아왔다."; } },
        { id: "enlist", label: "심사를 받고 해군에 지원한다", available: (state) => state.trust >= (state.path === "pirate" ? 70 : 50),
          risk: `지역의 신뢰 ${life.path === "pirate" ? 70 : 50} 필요 · 수병부터 시작`, personality: { loyalty: 7, caution: 4 },
          apply: (state) => { setCareer(state, "marine"); state.lastMarineOfferAge = age; depart(state); return "기존 경력을 밝히고 심사를 거쳐 수병 명부에 올랐다."; } }
      ] });
  }
  if ((!life.independent || life.path !== "pirate") && yearsFromCareer >= tenureNeeded
    && age - life.lastPirateOfferAge >= offerGap
    && (life.rival || life.alliance || life.travelHistory.length >= 2 || life.homebound && life.supplies >= 50 && life.skill >= 35)) {
    opportunities.push({ ...base, id: `life_pirate_invitation_${age}`, urgent: true, art: "deck", title: "다른 해적단의 빈자리",
      body: "기항지의 작은 해적단이 일손을 구했다. 이미 다른 배를 탔더라도 옮길 수 있지만, 새 선장 아래서는 지난 직책을 그대로 받을 수 없었다.", choices: [
        { id: "remain", label: "지금의 소속과 일을 지킨다", risk: "현재 소속 유지 · 항로 정보만 들음",
          apply: (state) => { state.lastPirateOfferAge = age; return "그들의 배가 떠나는 모습을 보고 자기 자리로 돌아왔다."; } },
        { id: "join", label: "그 해적단의 견습 선원이 된다", available: (state) => state.skill >= 35 && state.health >= 35, needs: { skill: 35, health: 35 }, failRisk: "건강 -15 · 현재 소속 유지", fail: (state) => { state.health -= 15; state.lastPirateOfferAge = age; return "입단 시험 삼아 붙은 싸움에서 졌다. 그 해적단은 웃으며 떠났다."; },
          risk: "기술 35 · 건강 35 필요 · 새 선장 아래에서 견습부터", personality: { freedom: 8, ambition: 5 },
          apply: (state) => { setCareer(state, "pirate"); state.affiliation = "기항지에서 만난 해적단"; state.lastPirateOfferAge = age; depart(state); return "새 선장의 배에 올라 견습 일부터 다시 맡았다."; } },
        canonCrewChoice("canon_crew", (state) => { state.lastPirateOfferAge = age; }, depart)
      ] });
  }
  if (life.path !== "civilian" && yearsFromCareer >= tenureNeeded && life.trust >= 40
    && (life.health < 50 || life.friendBond >= 60) && age - life.lastCivilianOfferAge >= (giant(life) ? 50 : 20)) {
    opportunities.push({ ...base, id: `life_civilian_invitation_${age}`, urgent: true, art: "workbench", title: "육지의 일자리",
      body: "기항지의 작업장이 오래 머물 사람을 찾았다. 배에서 쌓은 경험을 고칠 일과 사람을 돌보는 일에 쓸 수도 있었다.", choices: [
        { id: "remain", label: "지금의 배와 동료 곁에 남는다", risk: "현재 소속 유지", apply: (state) => { state.lastCivilianOfferAge = age; return "육지의 제안은 마음에 두고 다시 배에 올랐다."; } },
        { id: "work", label: "기항지의 민간 일터로 옮긴다", risk: "기항지의 견습 일꾼부터", personality: { caution: 5 },
          apply: (state) => { setCareer(state, "civilian"); state.lastCivilianOfferAge = age; return "배에서 내린 뒤 기항지의 일터에서 다시 배웠다."; } },
        { id: "home", label: "고향으로 돌아가 마을 일을 맡는다", available: (state) => state.supplies >= 10,
          risk: "물자 10 필요 · 고향에서 다시 시작", personality: { loyalty: 6, caution: 5 }, apply: (state) => {
            setCareer(state, "civilian"); state.supplies -= 10; state.homebound = true; state.job = "마을 일꾼"; state.affiliation = "고향 마을";
            state.role = "마을 일꾼"; state.goal = "익숙한 삶터를 지키기"; moveTo(state, state.birth.home);
            state.lastCivilianOfferAge = age; return "고향으로 돌아와 오래 비운 일터의 일을 다시 배웠다.";
          } }
      ] });
  }
  return opportunities.length ? opportunities[yearRoll(life.seed, age) % opportunities.length] : null;
}

function rankRequirementsV20(life, tier) {
  const path = life.path;
  if (path === "marine") {
    // ["상사", "소위", "소령", "대령", "중장"]
    const reqs = [
      { skill: 35, rep: 5, arrests: 1, bounty: 3_000_000 },
      { skill: 45, rep: 15, arrests: 2, bounty: 15_000_000 },
      { skill: 55, rep: 25, arrests: 3, bounty: 40_000_000 },
      { skill: 62, rep: 40, arrests: 4, bounty: 80_000_000 },
      { skill: 68, rep: 60, arrests: 5, bounty: 200_000_000 }
    ];
    const r = reqs[tier] || reqs[reqs.length - 1];
    const rep = life.reputation || 0;
    const met = rep >= 0 && life.skill >= r.skill && rep >= r.rep
      && (life.arrestCount || 0) >= r.arrests && (life.arrestBounty || 0) >= r.bounty;
    return {
      met,
      risk: `기술 ${r.skill} · 명성 ${r.rep} · 수감 ${r.arrests}명(${formatBounty(r.bounty)}) 필요`,
      onAccept: (state) => {
        state.reputation = (state.reputation || 0) + 10;
        return `동료와 사령부가 ${state.birth.name}의 해적 토벌 실적과 군공을 인정하여 ${state.role}으로 진급시켰다.`;
      }
    };
  }

  if (path === "pirate") {
    // ["선원", "간부", "부선장"]
    const reqs = [
      { skill: 35, bounty: 0, infamy: 0, chivalry: 0 },
      { skill: 50, bounty: 25_000_000, infamy: 10, chivalry: 20 },
      { skill: 65, bounty: 80_000_000, infamy: 25, chivalry: 45 }
    ];
    const r = reqs[tier] || reqs[reqs.length - 1];
    const rep = life.reputation || 0;
    const repMet = tier === 0 || rep <= -r.infamy || rep >= r.chivalry;
    const met = life.skill >= r.skill && (life.bounty || 0) >= r.bounty && repMet;
    const risk = tier === 0
      ? `기술 ${r.skill} 필요`
      : `기술 ${r.skill} · 현상금 ${formatBounty(r.bounty)} · 악명 ${r.infamy}(또는 명성 ${r.chivalry}) 필요`;
    return {
      met,
      risk,
      onAccept: (state) => {
        if ((state.reputation || 0) < 0) state.reputation = (state.reputation || 0) - 10;
        else state.reputation = (state.reputation || 0) + 10;
        return `선장과 선원들이 ${state.birth.name}의 이름과 실력을 인정하여 ${state.role}의 자리를 맡겼다.`;
      }
    };
  }

  if (path === "liberator") {
    // ["현장 연락원", "지역 연락 책임자", "작전 책임자"]
    const reqs = [
      { skill: 35, rep: 5, trust: 35 },
      { skill: 50, rep: 20, trust: 45 },
      { skill: 65, rep: 40, trust: 55 }
    ];
    const r = reqs[tier] || reqs[reqs.length - 1];
    const rep = life.reputation || 0;
    const met = life.skill >= r.skill && rep >= r.rep && standing(life) >= r.trust;
    return {
      met,
      risk: `기술 ${r.skill} · 명성 ${r.rep} · 신뢰 ${r.trust} 필요`,
      onAccept: (state) => {
        state.reputation = (state.reputation || 0) + 10;
        return `혁명군 연락망이 ${state.birth.name}의 신망과 공헌을 인정하여 ${state.role}의 임무를 맡겼다.`;
      }
    };
  }

  // civilian: ["숙련 일꾼", "수리반장", "조합 책임자"]
  const reqs = [
    { skill: 35, rep: 0, trust: 35 },
    { skill: 50, rep: 10, trust: 45 },
    { skill: 65, rep: 20, trust: 55 }
  ];
  const r = reqs[tier] || reqs[reqs.length - 1];
  const rep = life.reputation || 0;
  const met = life.skill >= r.skill && rep >= r.rep && standing(life) >= r.trust;
  return {
    met,
    risk: `기술 ${r.skill} · 명성 ${r.rep} · 신뢰 ${r.trust} 필요`,
    onAccept: (state) => {
      state.reputation = (state.reputation || 0) + 5;
      return `조합의 장인들이 ${state.birth.name}의 솜씨와 신용을 높이 사 ${state.role}의 직책을 맡겼다.`;
    }
  };
}

export function rankOpportunity(life, age, base) {
  if (life.creationVersion < 2 || !life.path || life.homebound || life.independent || life.retired) return null;
  const tier = life.rankTier;
  // Rule 3 offers the next rank sooner after an accepted promotion; a declined offer waits the old interval.
  const rankGap = life.creationVersion >= 3 && !life.rankDeclined && life.lastRankOfferAge >= life.careerStartAge ? giant(life) ? 12 : 6 : giant(life) ? 20 : 12;
  // In original mode a canon crew's officer seats are taken by canon characters, so the player stays a deckhand.
  if (life.canonCrew && life.mode === "original" && tier >= 1) return null;
  if (life.canonCrew === "밀짚모자 일당") return null;
  if (tier >= RANK_ROLES[life.path].length || age - life.careerStartAge < 3 || age - life.lastRankOfferAge < rankGap) return null;

  if (life.creationVersion >= 20) {
    const v20 = rankRequirementsV20(life, tier);
    if (!v20.met) return null;
    const nextRole = RANK_ROLES[life.path][tier];
    if (life.journal.slice(-10).some((entry) => entry.title === `${nextRole}의 제안`)) return null;
    return { ...base, id: `life_rank_${tier + 1}_${age}`, urgent: true, art: "workbench", title: `${nextRole}의 제안`,
      body: `${life.affiliation}에서 ${life.birth.name}이 남긴 일과 평판을 살폈다. 더 높은 책임을 맡을 자리가 비었지만 받아들일지는 본인이 정해야 했다.`, choices: [
        { id: "remain", label: "지금의 직책에서 더 배운다", risk: "현재 직책 유지 · 기술 +10", personality: { caution: 4 },
          apply: (state) => { state.lastRankOfferAge = age; state.rankDeclined = true; state.skill += 10; return "제안을 미루고 현장에서 맡은 일을 계속했다."; } },
        { id: "accept", label: `${nextRole}의 책임을 맡는다`, risk: v20.risk,
          personality: { ambition: 5, loyalty: 4 }, apply: (state) => {
            state.rankTier += 1; state.role = nextRole; state.lastRankOfferAge = age; state.rankDeclined = false;
            return v20.onAccept(state);
          } }
      ] };
  }

  const requirements = life.creationVersion >= 11
    ? [{ skill: 35, trust: 35 }, { skill: 45, trust: 42 }, { skill: 55, trust: 48 }, { skill: 62, trust: 54 }, { skill: 68, trust: 60 }]
    : [{ skill: 45, trust: 40 }, { skill: 65, trust: 50 }, { skill: 80, trust: 60 }, { skill: 85, trust: 70 }, { skill: 90, trust: 80 }];
  if (life.skill < requirements[tier].skill || standing(life) < requirements[tier].trust
    || life.creationVersion < 11 && !life.seen.includes("life_orders")) return null;
  const nextRole = RANK_ROLES[life.path][tier];
  if (life.creationVersion >= 11 && life.journal.slice(-10).some((entry) => entry.title === `${nextRole}의 제안`)) return null;
  return { ...base, id: `life_rank_${tier + 1}_${age}`, urgent: true, art: "workbench", title: `${nextRole}의 제안`,
    body: `${life.affiliation}에서 ${life.birth.name}이 남긴 일과 동료의 평판을 살폈다. 더 많은 사람을 맡을 자리가 비었지만 받아들일지는 본인이 정해야 했다.`, choices: [
      { id: "remain", label: "지금의 직책에서 더 배운다", risk: "현재 직책 유지 · 기술 +10", personality: { caution: 4 },
        apply: (state) => { state.lastRankOfferAge = age; state.rankDeclined = true; state.skill += 10; return "제안을 미루고 현장에서 맡은 일을 계속했다."; } },
      { id: "accept", label: `${nextRole}의 책임을 맡는다`, risk: `기술 ${requirements[tier].skill} · ${life.creationVersion >= 3 ? "평판" : "지역의 신뢰"} ${requirements[tier].trust} 필요`,
        personality: { ambition: 5, loyalty: 4 }, apply: (state) => { state.rankTier += 1; state.role = nextRole; state.lastRankOfferAge = age; state.rankDeclined = false; return `동료들이 ${state.birth.name}에게 ${nextRole}의 일을 맡겼다.`; } }
    ] };
}

function lastYear(life, age) {
  if (life.creationVersion === 1) {
    if (age >= life.birth.yearsBeforeCurrent) return true;
    if (giant(life) ? age < 220 : age < 55) return false;
    const risk = giant(life) ? Math.floor((age - 219) * 0.8 + (60 - life.health) * 0.6)
      : Math.floor((age - 54) + (60 - life.health) * 0.5);
    return yearRoll(life.seed, age) % 1000 < Math.max(0, risk);
  }
  const firstRiskAge = giant(life) ? 240 : 55;
  if (age < firstRiskAge) return false;
  const yearsAtRisk = age - firstRiskAge + 1;
  const risk = Math.floor(yearsAtRisk ** 2 * (giant(life) ? 0.025 : 0.14) + Math.max(0, 60 - life.health) * 0.8);
  return yearRoll(life.seed, age) % 1000 < Math.min(1000, risk);
}

// Rule 10: a small chance each year that a life ends early, so endings spread from infancy to old age.
// Rates are per thousand a year; giants live on a slower clock.
function suddenEnd(life, age, base) {
  if (life.creationVersion < 10 || age < 2) return null;
  const scale = giant(life) ? 5 : 1;
  const years = age / scale;
  // Old, worn-out bodies are left to the natural end; sudden accidents stay rare at any age in rule 11.
  const adult = life.creationVersion >= 11 ? 1 + (life.health < 35 ? 2 : 0) : 3 + (life.health < 35 ? 8 : 0);
  const rate = (years <= 5 ? 6 : years <= 15 ? 2 : adult) / (giant(life) ? 3 : 1);
  if (yearRoll(life.seed ^ 0x77a1c3e9, age) % 1000 >= rate) return null;
  const name = life.birth.name;
  const end = years <= 5
    ? { title: "돌림병이 돈 겨울", cause: "어린 날의 돌림병",
      body: `${name}이 태어나고 몇 해 지나지 않아 마을에 돌림병이 돌았다. 양육자가 밤새 곁을 지키며 젖은 천을 갈아 주었지만, 작은 몸은 그 겨울을 넘기지 못했다.` }
    : years <= 15 ? { title: "돌아오지 않은 물놀이", cause: "어린 날의 사고",
      body: `여름 오후, 친구들과 바위 끝에서 뛰어들던 ${name}이 다시 떠오르지 않았다. 어른들이 해가 질 때까지 물가를 찾아다녔다.` }
      : life.leftHome && !life.homebound ? { title: "예고 없는 풍랑", cause: "항해 중 사고",
        body: `맑던 바다가 한순간에 뒤집혔다. 돛을 묶으러 갑판에 나섰던 ${name}의 모습이 파도 사이로 사라졌다. 동료들은 밤새 이름을 불렀다.` }
        : { title: "무너진 작업장", cause: "작업 중 사고",
          body: `오래된 작업장의 들보가 소리 없이 내려앉았다. 그 아래에서 일하던 ${name}을 이웃들이 꺼냈을 때는 이미 늦었다.` };
  return { ...base, id: "life_sudden_end", urgent: true, art: years <= 15 ? "legacy" : "lifeStorm", title: end.title, body: end.body,
    after: (state) => { state.ending = "death"; state.deathCause = end.cause; return "남은 사람들이 짧았던 날들을 오래 이야기했다."; } };
}

function lastDay(life) {
  if (life.retired) return { title: "조용히 놓은 노", cause: "노년의 쇠약",
    body: `${life.birth.name}은 오래전에 맡은 일을 다음 사람에게 넘겼다. 마지막 아침에는 익숙한 목소리와 항구의 소리를 들으며 눈을 감았다.` };
  if (life.health < 35) return { title: "몸에 남은 바다", cause: "누적된 부상과 병",
    body: `${life.birth.name}의 몸에는 지난 위험들이 남아 있었다. 치료를 받으며 버텼지만 이번에는 곁의 사람들에게 마지막 인사를 남겨야 했다.` };
  if (life.leftHome && !life.homebound) return { title: "마지막 기항", cause: "항해 중 급병",
    body: `${life.birth.name}의 배가 다음 섬을 앞두고 멈췄다. 동료들이 물과 약을 구해 왔지만, 마지막으로 들은 것은 갑판을 스치는 파도 소리였다.` };
  return { title: "고향의 마지막 밤", cause: "오래된 지병",
    body: `${life.birth.name}이 살던 곳에서는 평소처럼 하루가 저물었다. 오랫동안 곁을 지킨 사람들이 모여 함께 보낸 시간을 이야기했다.` };
}

export function marinefordNews(life) {
  const age = stretched(life) ? Math.max(life.age, eraStart(life) + ERA_WAR) : life.birth.yearsBeforeCurrent - 2;
  return { id: "life_marineford_news", age, act: age < (giant(life) ? 112 : 19) ? 1 : 2,
    species: "all", yearly: true, urgent: true, art: "workbench",
    title: life.creationVersion >= 4 && life.people?.fruitOwner ? "IF 세계선 · 마린포드" : "마린포드 전쟁의 신문",
    canon: "https://one-piece.com/story/marineford/index.html",
    body: life.creationVersion >= 4 && life.people?.fruitOwner
      ? takenText(life, "marineford") || "마린포드에서 에이스와 흰 수염이 쓰러지고 샹크스가 전쟁을 멈췄다는 신문이 닿았다. 열매의 주인이 달라진 이 세계선에서도 바다의 큰 흐름은 크게 바뀌지 않았다."
      : "마린포드 전쟁에서 에이스와 흰 수염이 목숨을 잃고, 샹크스가 싸움을 멈추게 했다는 신문이 닿았다. 전장에 없던 사람은 그곳을 봤다고 말할 수 없었다." };
}


// Rule 9: a path is offered one situation at a time, drawn from personality and what the life has done,
// instead of a single menu of every organization. Scenes once tied to one age are drawn by age range,
// and each keeps its follow-up right behind it.
export const V9_DEFERRED = new Set(["life_departure_rumor", "life_career", "life_leave_home", "life_first_station",
  "life_enemy", "life_enemy_after", "life_orders", "life_repercussion", "life_alliance_offer", "life_alliance_after",
  "life_mission", "life_mission_after", "life_companion", "life_distance"]);
const V9_FLEX = new Set(["life_enemy", "life_orders", "life_alliance_offer", "life_mission", "life_companion"]);
const FOLLOW_UPS = [["life_enemy", "life_enemy_after"], ["life_orders", "life_repercussion"],
  ["life_alliance_offer", "life_alliance_after"], ["life_mission", "life_mission_after"], ["life_companion", "life_distance"]];
const cardById = (id) => scenes.find((entry) => entry.id === id);
const asYearly = (card, age) => ({ ...card, age, act: 2, species: "all", yearly: true, urgent: true });
const eunName = (word) => { const last = word.codePointAt(word.length - 1); return `${word}${last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0 ? "은" : "는"}`; };

function followUp(life) {
  for (const [parent, child] of FOLLOW_UPS) {
    if (!life.seen.includes(parent) || life.seen.includes(child)) continue;
    const card = cardById(child);
    if (!card.when || card.when(life)) return asYearly(card, life.age);
  }
  return null;
}

// What the people around remember about this life: its most recent notable choice.
function memoryOf(life) {
  const entry = [...life.journal].reverse().find((item) => item.choice && item.age >= 5 && !/^life_years?_/.test(item.id));
  return entry ? `${entry.age}세 때 '${entry.title}'의 일` : "부두에서 묵묵히 일하던 모습";
}

const LEANINGS = {
  pirate: (life) => life.personality.freedom + life.personality.ambition / 2 + (life.rival ? 15 : 0),
  marine: (life) => life.personality.loyalty + life.personality.caution / 2 + (life.trust >= 50 ? 10 : 0),
  liberator: (life) => life.personality.empathy + life.personality.freedom / 2 + (life.injustice ? 20 : 0),
  civilian: (life) => life.personality.caution + life.personality.empathy / 2 + (life.bond >= 55 ? 10 : 0)
};

function offerFor(path, life, age, base) {
  const memory = memoryOf(life);
  const name = life.birth.name;
  const decline = (label, text) => ({ id: "decline", label, risk: "다음 기회를 기다림", personality: { caution: 3 },
    apply: (state) => { state.recruitDeclined = [...(state.recruitDeclined || []), path]; return text; } });
  const offers = {
    pirate: { title: "기항한 해적선의 선장", art: "deck",
      body: `낡은 해적선이 부두에 닿았다. 선장은 ${memory}을 들었다며 ${eunName(name)} 갑판 일을 해 볼 생각이 없느냐고 물었다. 배는 사흘 뒤 떠날 예정이었다.`,
      choices: [
        { id: "board", label: "해적선의 견습 선원이 된다", needs: { skill: 20 }, risk: "기술 20 필요 · 견습부터 시작", failRisk: "물자 -10",
          personality: { freedom: 8, ambition: 6 }, fail: (state) => { state.supplies -= 10; state.recruitDeclined = [...(state.recruitDeclined || []), path]; return "짐을 나르다 실수를 연발했다. 선장은 웃으며 다음에 보자고 했다."; },
          apply: (state) => { setCareer(state, "pirate"); depart(state); return "양육자에게 편지를 남기고 해적선의 가장 작은 일부터 맡았다."; } },
        canonCrewChoice("canon_crew", null, depart, true),
        { id: "captain", label: "친구와 우리만의 배를 띄운다", when: (state) => (Boolean(state.people?.mate) || state.creationVersion >= 19 && state.friendBond >= 50)
          && state.personality.ambition >= 55,
          available: (state) => state.skill >= 30 && state.supplies >= 40 && state.friendBond >= 40,
          risk: "기술 30 · 물자 40 · 친구와의 유대 40 필요", personality: { freedom: 9, ambition: 8, loyalty: 5 }, naming: true,
          apply: (state, named) => { setCareer(state, "pirate"); state.independent = true; state.rankTier = 3; state.job = "해적단 선장"; state.affiliation = ownCrew(state, named); state.role = "선장"; state.supplies -= 20; depart(state); return "선장의 배를 따라가는 대신, 친구와 고친 작은 배에 우리만의 깃발을 달았다."; } },
        decline("아직은 아니라며 배를 배웅한다", "해적선이 수평선 너머로 사라질 때까지 부두에 서 있었다.")
      ] },
    marine: { title: "지부 해군의 권유", art: "deck",
      body: `해군 지부의 하사관이 마을을 돌며 견습 수병을 찾았다. ${memory}을 전해 들었다며 ${name}에게 시험을 한번 보라고 권했다.`,
      choices: [
        { id: "enlist", label: "견습 수병 시험을 본다", needs: { skill: 20, health: 55 }, risk: "기술 20 · 건강 55 필요 · 수병 교육부터", failRisk: "건강 -10",
          personality: { loyalty: 6, caution: 4 }, fail: (state) => { state.health -= 10; state.recruitDeclined = [...(state.recruitDeclined || []), path]; return "체력 시험 도중 쓰러졌다. 하사관은 몸부터 만들고 오라고 했다."; },
          apply: (state) => { setCareer(state, "marine"); depart(state); return "해군 지부의 교육을 받으며 청소와 기록부터 익혔다."; } },
        decline("정중히 사양한다", "하사관은 언제든 마음이 바뀌면 지부로 오라며 명함 대신 해군 모자를 두고 갔다.")
      ] },
    liberator: { title: "문틈의 접힌 쪽지", art: "workbench",
      body: `누군가 문틈으로 쪽지를 밀어 넣었다. 억압받는 사람들을 몰래 빼내는 연락망이 손을 찾는다는 내용이었다. 끝에는 ${memory}을 알고 있다는 한 줄이 적혀 있었다.`,
      choices: [
        { id: "join", label: "적힌 장소로 나간다", available: (state) => state.trust >= 35, risk: "지역의 신뢰 35 필요 · 연락 일부터", personality: { empathy: 7, freedom: 5 },
          apply: (state) => { setCareer(state, "liberator"); if (storyBefore(state) <= 22) state.affiliation = "혁명군"; depart(state); return "위험한 이름은 묻지 않고 편지와 식량을 옮기는 일부터 배웠다."; } },
        decline("쪽지를 태워 버린다", "불꽃이 꺼진 뒤에도 그 한 줄이 한동안 머릿속에 남았다.")
      ] },
    civilian: { title: "조선소 장인의 제안", art: "workbench",
      body: `이웃 섬 조선소의 장인이 일손을 구하러 왔다. ${memory}을 듣고는 손이 야무지겠다며 견습 자리를 내밀었다. 고향에 남아 마을 일을 맡아 달라는 어른들의 말도 있었다.`,
      choices: [
        { id: "apprentice", label: "조선소의 견습 일꾼이 된다", risk: "견습부터 시작", personality: { caution: 5, ambition: 4 },
          apply: (state) => { setCareer(state, "civilian"); state.trust += 10; return "장인의 망치 소리를 따라 나무를 다듬는 일부터 배웠다."; } },
        { id: "home", label: "고향에 남아 마을 일을 맡는다", risk: "마을에 남음", personality: { loyalty: 5, caution: 4 },
          apply: (state) => { setCareer(state, "civilian"); state.homebound = true; state.job = "마을 일꾼"; state.affiliation = "고향 마을"; state.role = "마을 일꾼"; state.goal = "익숙한 삶터를 지키기"; return "떠나는 배를 배웅하고 마을의 일손으로 남았다. 삶은 그곳에서도 계속됐다."; } },
        decline("조금 더 생각해 보겠다고 한다", "장인은 웃으며 다음 계절에 다시 들르겠다고 했다.")
      ] }
  };
  const offer = offers[path];
  // Rule 15 tells the same offer through one of several situations, so lives stop meeting the same captain.
  const told = life.creationVersion >= 15 ? [offer, ...RECRUIT_VARIANTS[path]][yearRoll(life.seed ^ 0x5151e0a3, age) % (RECRUIT_VARIANTS[path].length + 1)] : offer;
  const body = told.body.replaceAll("{memory}", memory).replaceAll("{name}", name);
  return { ...base, id: `life_recruit_${path}_${age}`, urgent: true, art: told.art || offer.art, title: told.title, body, choices: offer.choices };
}

// Rule 11: late-life scenes follow age and health, so lives that end in their fifties still see them.
const LATE_LIFE = ["life_homecoming", "life_old_friend", "life_late_work", "life_last_student", "life_memory"];
export const V11_DEFERRED = new Set(["life_retire_choice", ...LATE_LIFE]);
export const V14_REPLACED = new Set(["life_friend", "life_child_crisis", "life_after_storm"]);

function lateLife(life, age, base) {
  if (life.creationVersion < 11 || !life.path) return null;
  const [old, settled] = giant(life) ? [240, 290] : [52, 66];
  if (age < old) return null;
  if (!life.retired && !life.seen.includes("life_retire_choice") && (life.health < 55 || age >= settled)) return asYearly(cardById("life_retire_choice"), age);
  if (yearRoll(life.seed ^ 0x3311a7c5, age) % 3) return null;
  const next = LATE_LIFE.find((id) => { const card = cardById(id); return !life.seen.includes(id) && (!card.when || card.when(life)); });
  return next ? asYearly(cardById(next), age) : null;
}

function careerStart(life, age, base) {
  if (life.creationVersion < 9) return null;
  if (life.path) {
    if (!life.leftHome && !life.homebound && !life.seen.includes("life_leave_home")) return asYearly(cardById("life_leave_home"), life.age);
    if (!life.seen.includes("life_first_station") && age >= life.careerStartAge + 1) return asYearly(cardById("life_first_station"), age);
    return null;
  }
  const [from, last] = giant(life) ? [76, 118] : [13, 22];
  // Nobody took the earlier chances: the old fork arrives as a last resort.
  if (age >= last) return asYearly(cardById("life_career"), age);
  if (age < from || yearRoll(life.seed ^ 0x6b43a9b5, age) % 2) return null;
  const open = Object.keys(LEANINGS).filter((path) => !(life.recruitDeclined || []).includes(path));
  if (!open.length) return null;
  const weights = open.map((path) => Math.max(1, LEANINGS[path](life) - 30) ** 2);
  let roll = yearRoll(life.seed ^ 0x2f9e17c3, age) % weights.reduce((sum, w) => sum + w, 0);
  const path = open.find((_, index) => (roll -= weights[index]) < 0) || open[0];
  return offerFor(path, life, age, base);
}

function systemEventScene(life, age, base) {
  if (life.creationVersion < 20 || life.retired) return null;

  // 1. IF governance scenes (Emperor / Admiral / Commander)
  if (life.worldBranch === "emperor" && !life.seen.includes("life_emperor_decree")) {
    return {
      ...base, id: "life_emperor_decree", urgent: true, art: "deckCommand", title: "사황의 영역과 깃발",
      body: `신세계에 펄럭이는 ${life.birth.name}의 해적 깃발 아래 여러 섬과 산하 해적단이 모였다. 다른 사황과의 해역 경계, 영역 주민 보호, 쳐들어오는 최악의 세대 루키들을 어떻게 다룰지 결단을 내려야 했다.`,
      choices: [
        { id: "protect", label: "가맹하지 못한 섬들에게 깃발을 빌려주고 보호한다", risk: "지역의 신뢰 +20 · 물자 -10 · 명성 상승", personality: { empathy: 8, loyalty: 6 },
          apply: (state) => { state.trust += 20; state.supplies -= 10; state.reputation = (state.reputation || 0) + 15; return "사황의 깃발 아래 주민들은 평화를 얻었다. 바다 곳곳에서 신뢰의 목소리가 모였다."; } },
        { id: "dominate", label: "신세계 해상 요충지를 장악해 통행세를 거둔다", risk: "물자 +30 · 현상금 5억 상승 · 악명 상승", personality: { ambition: 9, caution: -5 },
          apply: (state) => { state.supplies += 30; state.bounty += 500_000_000; state.reputation = (state.reputation || 0) - 10; return "철저한 패권 장악으로 막대한 군수 물자를 확보했다. 신세계의 긴장감이 높아졌다."; } },
        { id: "clash", label: "영해를 침범한 적대 사황 간부 선단을 직접 격퇴한다", needs: { skill: 75, health: 60 }, risk: "기술 75 · 건강 60 필요 · 성공 시 현상금 3억 상승", failRisk: "건강 -25",
          personality: { ambition: 8, loyalty: 5 },
          apply: (state) => { state.skill += 10; state.health -= 10; state.bounty += 300_000_000; state.reputation = (state.reputation || 0) + 10; return "선두에 서서 적대 세력을 일격에 바다로 밀어냈다. 사황의 위엄을 확고히 각인시켰다."; },
          fail: (state) => { state.health -= 25; return "치열한 교전 끝에 상대를 몰아냈지만 깊은 상처가 남았다."; } }
      ]
    };
  }
  if (life.worldBranch === "admiral" && !life.seen.includes("life_admiral_verdict")) {
    return {
      ...base, id: "life_admiral_verdict", urgent: true, art: "deckCommand", title: "대장의 정의와 결단",
      body: `해군 대장의 정의 코트를 걸친 ${life.birth.name}의 집무실로 중대한 전보가 들어왔다. 천룡인의 불합리한 출격 명령과 관할 해역 민간인 피난 작전의 우선순위를 정해야 했다.`,
      choices: [
        { id: "protect_civilians", label: "천룡인의 호위를 미루고 민간인 피난선부터 호송한다", risk: "지역의 신뢰 +25 · 명성 상승 · 본부의 질책", personality: { empathy: 9, loyalty: 4 },
          apply: (state) => { state.trust += 25; state.reputation = (state.reputation || 0) + 20; state.injustice = true; return "민간인 수천 명을 무사히 구출했다. 천룡인은 분노했지만 바다의 사람들은 대장의 정의를 칭송했다."; } },
        { id: "iron_justice", label: "해군 본부의 군사 작전을 최우선으로 위험 분자를 섬멸한다", needs: { skill: 70, health: 50 }, risk: "기술 70 · 건강 50 필요 · 수감 실적 상승", failRisk: "건강 -20",
          personality: { loyalty: 8, ambition: 6 },
          apply: (state) => { state.skill += 10; state.supplies += 15; state.arrestCount = (state.arrestCount || 0) + 2; state.reputation = (state.reputation || 0) + 10; return "흉악 해적 선단을 궤멸시키고 주동자를 임펠 다운으로 호송했다."; },
          fail: (state) => { state.health -= 20; return "격렬한 저항에 부딪혀 일부를 놓쳤다. 함선 정비에 시간이 걸렸다."; } }
      ]
    };
  }
  if (life.worldBranch === "commander" && !life.seen.includes("life_liberator_strike")) {
    return {
      ...base, id: "life_liberator_strike", urgent: true, art: "workbenchNegotiation", title: "혁명군 군대장의 결단",
      body: "세계정부 가맹국의 폭정에 맞선 민중 봉기가 일어났다. 천룡인에게 바칠 천상금 수송선을 가로막고 혁명 세력을 전면 지원할 시기가 왔다.",
      choices: [
        { id: "intercept", label: "천룡인의 수송선을 급습해 물자를 해방군에 나눈다", risk: "물자 +35 · 지역의 신뢰 +20 · 명성 상승", personality: { freedom: 8, empathy: 7 },
          apply: (state) => { state.supplies += 35; state.trust += 20; state.reputation = (state.reputation || 0) + 15; return "천상금을 빼앗아 굶주린 백성들에게 곡식과 약품을 배급했다. 해방의 함성이 울렸다."; } },
        { id: "liberate", label: "억압받는 주민들을 훈련시키고 자치 방위군을 결성한다", risk: "기술 +10 · 지역의 신뢰 +25 · 유대 상승", personality: { loyalty: 8, empathy: 6 },
          apply: (state) => { state.skill += 10; state.trust += 25; state.friendBond += 15; return "주민들 스스로 나라를 지킬 수 있는 힘을 길러주었다. 혁명의 불씨가 뿌리내렸다."; } }
      ]
    };
  }

  // 2. Childhood friend adult reunion
  if (life.friendName && !life.homebound && age >= 30 && !life.seen.includes("life_friend_reunion") && (age % 4 === 0 || life.friendBond >= 55)) {
    return {
      ...base, id: "life_friend_reunion", urgent: true, art: "harborReunion", title: "노을빛 부두의 재회",
      body: `낯선 기항지의 부두에서 익숙한 목소리가 들렸다. 어린 시절 고향에서 함께 바다를 바라보던 소꿉친구 ${life.friendName}이었다! 세월이 흘러 어엿한 바다의 일꾼으로 마주 선 두 사람은 등불 아래 마주 앉았다.`,
      choices: [
        { id: "celebrate", label: "함께 술잔을 기울이며 옛 추억을 나눈다", risk: "친구와의 유대 +15 · 지역의 신뢰 +10 · 건강 +5", personality: { empathy: 6, freedom: 4 },
          apply: (state) => { state.friendBond += 15; state.trust += 10; state.health += 5; return `${state.friendName}과 밤새 고향 이야기를 나눴다. 각자의 바다를 걷고 있어도 마음만은 그때로 돌아갔다.`; } },
        { id: "support", label: "서로의 항해 물자를 나누고 행운을 빈다", risk: "물자 +20 · 친구와의 유대 +10", personality: { loyalty: 6, caution: 4 },
          apply: (state) => { state.supplies += 20; state.friendBond += 10; return `${state.friendName}이 건넨 보급품을 싣고 다시 출항을 준비했다. 먼바다에서도 서로를 잊지 않기로 했다.`; } }
      ]
    };
  }

  // 3. High personality (70+) events
  if ((life.personality?.ambition || 0) >= 70 && age >= 35 && !life.seen.includes("life_personality_ambition")) {
    return {
      ...base, id: "life_personality_ambition", urgent: true, art: "deckCommand", title: "정점을 향한 야망",
      body: "가슴속에서 타오르는 거대한 야망이 더 이상 작은 배에 안주할 수 없게 만들었다. 칠무해나 거대 세력의 영토에 맞서 자신만의 패권을 증명할 기회가 눈앞에 다가왔다.",
      choices: [
        { id: "challenge", label: "거대 세력의 정박지에 깃발을 꽂고 정면 승부한다", needs: { skill: 65, health: 50 }, risk: "기술 65 · 건강 50 필요 · 성공 시 현상금 대폭 상승", failRisk: "건강 -25",
          personality: { ambition: 9, caution: -5 },
          apply: (state) => { if (state.path === "pirate") state.bounty += 50_000_000; state.reputation = (state.reputation || 0) + 20; state.trust += 10; return "거대 세력의 방어선을 뚫고 깃발을 세웠다. 바다 전체에 거대한 야망의 이름이 울려 퍼졌다."; },
          fail: (state) => { state.health -= 25; return "거센 반격에 물러섰지만 가슴속의 야망은 꺾이지 않았다."; } },
        { id: "scheme", label: "수면 아래에서 세력을 규합해 기반을 다진다", risk: "물자 +30 · 지역의 신뢰 +15", personality: { ambition: 7, caution: 5 },
          apply: (state) => { state.supplies += 30; state.trust += 15; return "치밀한 포섭으로 여러 선단을 영향력 아래 두었다. 조용한 거물이 되어가고 있었다."; } }
      ]
    };
  }
  if ((life.personality?.empathy || 0) >= 70 && age >= 35 && !life.seen.includes("life_personality_empathy")) {
    return {
      ...base, id: "life_personality_empathy", urgent: true, art: "harborRelief", title: "기항지에 퍼진 은혜",
      body: "지나온 항구마다 베푼 온정과 구호의 손길이 마침내 거대한 보답으로 돌아왔다. 폭풍과 해군의 추격 속에서도 여러 섬의 주민들이 비밀리에 배를 숨겨주고 식량을 날라주었다.",
      choices: [
        { id: "network", label: "민간 구호와 비상 대피 연락망을 완성한다", risk: "지역의 신뢰 +25 · 건강 +15 · 물자 +20", personality: { empathy: 9, loyalty: 6 },
          apply: (state) => { state.trust += 25; state.health += 15; state.supplies += 20; return "바다 곳곳에 위기 때 쉴 수 있는 피난처가 마련됐다. 선행은 가장 단단한 방패가 되었다."; } }
      ]
    };
  }
  if ((life.personality?.loyalty || 0) >= 70 && age >= 35 && !life.seen.includes("life_personality_loyalty")) {
    return {
      ...base, id: "life_personality_loyalty", urgent: true, art: "deckTenseStandoff", title: "목숨을 건 동료들의 맹세",
      body: "절체절명의 암초 지대에서 적함에 포위당했을 때, 동료들이 한 치의 망설임도 없이 앞을 가로막아섰다. 서로를 위해 목숨을 던질 수 있는 유대감이 갑판을 가득 채웠다.",
      choices: [
        { id: "stand_together", label: "동료들과 어깨를 맞대고 포위망을 돌파한다", risk: "친구와의 유대 +20 · 지역의 신뢰 +15 · 건강 +10", personality: { loyalty: 9, empathy: 5 },
          apply: (state) => { state.friendBond += 20; state.trust += 15; state.health += 10; return "완벽한 호흡으로 포위망을 찢고 빠져나왔다. 배의 깃발 아래 선원들은 영원한 형제가 되었다."; } }
      ]
    };
  }
  if ((life.personality?.caution || 0) >= 70 && age >= 35 && !life.seen.includes("life_personality_caution")) {
    return {
      ...base, id: "life_personality_caution", urgent: true, art: "workbenchReportLetters", title: "그림자 속의 음모 간파",
      body: "항해 장부와 기항지 첩보 속에서 어색한 필적과 암살자의 독 냄새를 미리 알아챘다. 세계정부의 암살반이 쳐놓은 함정이 발동하기도 전에 판세를 뒤집을 기회였다.",
      choices: [
        { id: "counter", label: "함정을 역이용해 추적자들을 고립시킨다", risk: "기술 +15 · 물자 +25 · 평판 상승", personality: { caution: 8, loyalty: 4 },
          apply: (state) => { state.skill += 15; state.supplies += 25; state.reputation = (state.reputation || 0) + 10; return "추적자들은 자신들이 판 함정에 빠졌다. 귀중한 첩보와 군수 물자를 획득했다."; } }
      ]
    };
  }
  if ((life.personality?.freedom || 0) >= 70 && age >= 35 && !life.seen.includes("life_personality_freedom")) {
    return {
      ...base, id: "life_personality_freedom", urgent: true, art: "harborDeparture", title: "해도 밖 미지의 하늘과 바다",
      body: "정부와 해군이 그어놓은 해도에 얽매이지 않고 바람의 냄새만을 따라 항해한 끝에, 전설로만 내려오던 숨겨진 해저 동굴과 하늘섬으로 통하는 상승 해류를 발견했다!",
      choices: [
        { id: "explore", label: "지도에 없는 미지의 해역으로 키를 꺾는다", risk: "기술 +20 · 물자 +30 · 자유로운 영혼", personality: { freedom: 10, ambition: 5 },
          apply: (state) => { state.skill += 20; state.supplies += 30; return "아무도 발 딛지 않은 환상의 섬에서 풍요로운 보급과 고대의 유적을 마주했다."; } }
      ]
    };
  }

  // 4. Reputation & arrest feedback
  if (life.path === "marine" && (life.arrestCount || 0) >= 2 && !life.seen.includes("life_marine_commendation")) {
    return {
      ...base, id: "life_marine_commendation", urgent: true, art: "workbenchReportLetters", title: "본부 수감 실적 특별 포상",
      body: "수많은 흉악 해적을 체포해 임펠 다운으로 호송한 혁혁한 공로가 인정되어, 해군 본부 원수로부터 특별 포상과 훈장이 수여됐다.",
      choices: [
        { id: "accept", label: "포상을 수락하고 함대 보급을 확충한다", risk: "물자 +30 · 지역의 신뢰 +20 · 명성 상승", personality: { loyalty: 6, ambition: 5 },
          apply: (state) => { state.supplies += 30; state.trust += 20; state.reputation = (state.reputation || 0) + 15; return "본부의 전폭적인 지원으로 최신형 함포와 보급선을 지원받았다."; } }
      ]
    };
  }
  if (life.path === "pirate" && (life.reputation || 0) <= -25 && !life.seen.includes("life_infamy_standoff")) {
    return {
      ...base, id: "life_infamy_standoff", urgent: true, art: "harborBountyInspection", title: "바다를 뒤흔든 악명",
      body: "세계정부가 특급 위험 인물로 지정하며 파견한 정예 군함들이 항구를 봉쇄했다. 자비 없는 악명 앞에 부두 전체가 얼어붙었다.",
      choices: [
        { id: "breakout", label: "악명에 걸맞은 무력으로 포위망을 분쇄한다", needs: { skill: 65, health: 50 }, risk: "기술 65 · 건강 50 필요 · 성공 시 현상금 대폭 상승", failRisk: "건강 -30",
          personality: { ambition: 8, freedom: 6 },
          apply: (state) => { state.bounty += 60_000_000; state.reputation = (state.reputation || 0) - 15; return "군함의 방어선을 일격에 격파하고 포위망을 뚫었다. 바다는 공포에 떨었다."; },
          fail: (state) => { state.health -= 30; return "함포 사격을 뚫고 간신히 탈출했다. 상처는 깊었지만 악명은 더욱 치솟았다."; } }
      ]
    };
  }

  return null;
}

function sceneForAge(life) {
  const age = life.age + 1;
  const base = { id: `life_year_${age}`, age, act: age < (giant(life) ? 112 : 19) ? 1 : 2, species: "all", yearly: true };
  if (life.creationVersion >= 2 && life.creationVersion < 9 && age === (giant(life) ? 78 : 14)) return {
    ...base, id: "life_early_departure", urgent: true, art: "deck", title: "일손을 찾는 배",
    body: "고향에 여러 깃발의 배가 들렀다. 어린 일손을 받아 주겠다는 곳도 있었지만, 어느 배든 집 밖의 일을 먼저 배워야 했다.", choices: [
      { id: "stay", label: "고향에서 배움을 이어 간다", risk: "기술 +10 · 출항은 다음으로", personality: { caution: 5 },
        apply: (state) => { state.skill += 10; return "배가 떠난 뒤에도 고향에서 할 일은 남아 있었다."; } },
      { id: "board", label: "해적선의 견습 일손으로 오른다", available: (state) => state.skill >= 20 && state.supplies >= 20, needs: { skill: 20, supplies: 20 }, failRisk: "물자 -10 · 고향에 남음", fail: (state) => { state.supplies -= 10; return "선장은 짐 나르는 솜씨를 보더니 다음에 오라고 했다. 배는 떠났다."; },
        risk: "기술 20 · 물자 20 필요 · 견습부터 시작", personality: { freedom: 8, ambition: 6 },
        apply: (state) => { setCareer(state, "pirate"); depart(state); return "양육자에게 편지를 남기고 해적선의 가장 작은 일부터 맡았다."; } },
      { id: "marine", label: "해군 지부의 견습 교육을 받는다", available: (state) => state.skill >= 20 && state.health >= 55, needs: { skill: 20, health: 55 }, failRisk: "건강 -10 · 고향에 남음", fail: (state) => { state.health -= 10; return "체력 시험 도중 쓰러졌다. 교관은 몸부터 만들고 다시 오라고 했다."; },
        risk: "기술 20 · 건강 55 필요 · 수병 교육부터", personality: { loyalty: 6, caution: 4 },
        apply: (state) => { setCareer(state, "marine"); depart(state); return "해군 지부의 교육을 받으며 청소와 기록부터 익혔다."; } },
      { id: "liberator", label: "구호 연락망의 어린 심부름꾼이 된다", available: (state) => state.trust >= 40,
        risk: "지역의 신뢰 40 필요 · 연락 업무부터", personality: { empathy: 7, freedom: 5 },
        apply: (state) => { setCareer(state, "liberator"); if (storyBefore(state, age) <= 22) state.affiliation = "혁명군"; depart(state); return "위험한 이름은 듣지 않고 편지와 식량을 옮기는 일부터 배웠다."; } }
    ] };
  // Rule 3 opens the IF to mid-rank careers and the revolutionary army, so the free mode's "what if" is actually reachable.
  const ifReady = life.creationVersion === 1 ? true : life.creationVersion === 2
    ? life.path === "pirate" ? life.independent && life.role === "선장" : life.rankTier >= 5
    : standing(life) >= (life.creationVersion >= 11 ? 45 : 50) && (life.path === "pirate" ? life.independent || life.rankTier >= 2 : life.rankTier >= (life.path === "marine" ? 3 : 2));
  const ifCanonStepOk = life.creationVersion >= 20
    ? (life.canonStep >= canonIfAfter(life) || (life.canonStep >= 5 && (standing(life) >= 55 || (life.bounty || 0) >= 500_000_000 || (life.rankTier || 0) >= 4 || (life.path === "liberator" && (life.trust || 0) >= 60))))
    : life.canonStep >= canonIfAfter(life);
  const ifStepDue = stretched(life)
    ? ifCanonStepOk && !life.seen.includes("life_free_rank")
    : age === life.birth.yearsBeforeCurrent - 1 || life.creationVersion >= 4 && age === life.birth.yearsBeforeCurrent;
  if (ifStepDue
    && life.mode === "free" && !life.retired
    && (life.creationVersion >= 3 ? ["pirate", "marine", "liberator"] : ["pirate", "marine"]).includes(life.path) && ifReady) {
    if (life.path === "liberator") return { ...base, id: "life_free_rank", urgent: true, art: "workbench", title: "비어 있는 군대장 자리",
      canon: "https://one-piece.com/anime/65681/index.html",
      body: (state) => `${state.birth.name}이 이어 온 탈출로와 연락망이 혁명군 지휘부의 눈에 띄었다. 이 선택은 원작과 다른 세계선을 연다. 새 군대장의 자리에 나설지는 아직 정해지지 않았다.`,
      choices: [
        { id: "attempt", label: "새 군대장의 자리를 맡는다", available: (state) => state.skill >= 70 && state.trust >= 60 && state.health >= 30,
          needs: { skill: 70, health: 30 }, failRisk: "건강 -20 · 지역의 신뢰 -20", fail: (state) => { state.health -= 20; state.trust -= 20; return "첫 작전에서 연락망 일부가 드러났다. 지휘부는 자리를 다른 사람에게 맡겼다."; },
          risk: "기술 70 · 신뢰 60 · 건강 30 필요", personality: { ambition: 8, empathy: 5 },
          apply: (state) => { state.role = "혁명군 군대장"; state.worldBranch = "commander"; state.pendingBranch = true; state.people.branchAge = age; state.trust += 10;
            return `${state.birth.name}이 혁명군의 새 군대장으로 이름을 올리는 IF가 열렸다.`; } },
        { id: "decline", label: "현장의 연락망에 남는다", risk: "기존 직책 유지 · 지역의 신뢰 +10",
          personality: { loyalty: 6, caution: 4 }, apply: (state) => { state.trust += 10; return "지휘부의 자리 대신 손이 닿는 사람들 곁에 남았다."; } }
      ] };
    const pirate = life.path === "pirate";
    const need = life.creationVersion >= 11 ? { skill: 58, trust: 50, health: 30 } : life.creationVersion === 3 ? { skill: 70, trust: 60, health: 30 } : { skill: 80, trust: 80, health: 40 };
    return { ...base, id: "life_free_rank", urgent: true, art: "deck", title: pirate ? "와노국 이후의 새 자리" : "전쟁 뒤 바뀐 지휘부",
      canon: pirate ? "https://one-piece.com/story/land_of_wano/index.html" : "https://one-piece.com/character/Aramaki/index.html",
      body: (state) => `${state.birth.name}이 쌓아 온 경력과 동료의 신뢰가 세계의 재편과 맞물렸다. 이 선택은 원작과 다른 세계선을 연다. 그 자리에 나설지는 아직 정해지지 않았다.`,
      choices: [
        { id: "attempt", label: pirate ? "사황의 자리를 노린다" : "대장의 자리를 노린다",
          available: (state) => state.skill >= need.skill && state.trust >= need.trust && state.health >= need.health,
          ...(life.creationVersion === 3 || life.creationVersion >= 11 ? { needs: { skill: need.skill, health: need.health }, failRisk: "건강 -20 · 지역의 신뢰 -20", fail: (state) => { state.health -= 20; state.trust -= 20; return "자리를 노린 시도는 실패로 끝났다. 세상은 원작대로 흘렀고, 무리한 이름만 소문으로 남았다."; } } : {}),
          risk: `기술 ${need.skill} · 신뢰 ${need.trust} · 건강 ${need.health} 필요`, personality: { ambition: 10, loyalty: 5 },
          apply: (state) => { state.role = pirate ? "사황" : "해군 대장"; state.worldBranch = pirate ? "emperor" : "admiral"; state.pendingBranch = true; state.people.branchAge = age; state.trust += 10;
            if (pirate && state.creationVersion >= 4) state.bounty = Math.max(state.bounty, 3_000_000_000);
            return pirate
              ? (state.creationVersion >= 20 && state.canonStep < 8 ? `${state.birth.name}의 세력이 사황의 한 축으로 인정받는 IF가 열렸다.` : `${state.birth.name}의 세력이 버기 대신 사황으로 인정받는 IF가 열렸다.`)
              : (state.creationVersion >= 20 && state.canonStep < 8 ? `${state.birth.name}이 새로운 해군 대장으로 임명되는 IF가 열렸다.` : `${state.birth.name}이 아라마키 대신 해군 대장으로 임명되는 IF가 열렸다.`); } },
        { id: "decline", label: "지금 맡은 사람들을 지킨다", risk: "기존 직책 유지 · 지역의 신뢰 +10",
          personality: { loyalty: 6, caution: 4 }, apply: (state) => { state.trust += 10; return "더 큰 이름을 얻는 대신 곁의 사람들과 남았다."; } }
      ] };
  }
  // Rule 7 closes every surviving life at the original present instead of running into unpublished years.
  if (life.creationVersion >= 7 && age > presentAge(life)) return { ...base, id: "life_present_end", age: presentAge(life),
    urgent: true, art: "legacy", title: "원작이 멈춘 자리",
    body: (state) => `엘바프에 닿은 밀짚모자 일당의 소식이 바다의 마지막 신문이었다. ${state.birth.name}의 기록도 여기서 펜을 놓는다. 이 뒤의 바다는 아직 아무도 그리지 않았다.`,
    after: (state) => { state.ending = "present"; state.deathCause = "원작의 현재에 닿음"; return "원작이 그린 마지막 시간까지 살아 낸 기록이 남았다."; } };
  const sudden = suddenEnd(life, age, base);
  if (sudden) return sudden;
  if (lastYear(life, age)) {
    if (life.creationVersion >= 5) {
      const day = lastDay(life);
      return { ...base, id: "life_last_year", urgent: true, art: "legacy", title: day.title, body: day.body,
        after: (state) => { state.ending = "death"; state.deathCause = day.cause; return "남은 사람들이 생애 일지를 모아 한 사람의 항로를 기록했다."; } };
    }
    return { ...base, id: "life_last_year", urgent: true, art: "legacy", title: "마지막 날",
      body: (state) => `${state.birth.name}의 몸에 오래된 병과 피로가 겹쳤다. 가까운 사람들이 곁을 지켰고, 창밖에서는 평소처럼 바다가 움직였다.`,
      after: (state) => { state.ending = "death"; state.deathCause = "오래된 병과 쇠약"; return "숨이 잦아든 뒤, 남은 사람들은 삶의 기록을 모았다."; } };
  }
  if (age === life.birth.yearsBeforeCurrent - 24) return { ...base, id: "life_roger_news", urgent: true, art: "deck", title: "로저의 처형 소식", canon: "https://one-piece.com/character/Gold_Roger/index.html", body: "로저가 처형됐다는 소식이 먼 항구에서 전해졌다. 그 자리에 있지 않았던 사람들은 신문과 선원의 말로 들었다. 바다로 나서는 배가 늘었다." };
  if (age === life.birth.yearsBeforeCurrent - 22) return { ...base, id: "life_revolution_choice", urgent: true, art: "workbench", title: "혁명군의 이름", canon: "https://one-piece.com/anime/65681/index.html", body: "오하라 사건 이후, 먼 항구에서 혁명군이라는 이름이 들려왔다. 누가 조직을 세웠는지까지는 알려지지 않았다. 독립적으로 사람을 돕던 이들에게 새로운 연락망이 생길 수 있었다.", choices: [
    { id: "join", label: "혁명군의 지역 임무에 합류한다", when: (state) => state.creationVersion === 1 || state.path === "liberator" || state.injustice,
      available: (state) => state.path === "liberator" || state.trust >= 70,
      risk: "해방 활동 경력 또는 지역의 신뢰 70 필요", personality: { empathy: 8, freedom: 7 }, apply: (state) => { if (state.path !== "liberator") setCareer(state, "liberator"); state.affiliation = "혁명군"; state.role = "연락원"; state.trust += 10; if (state.creationVersion >= 2) depart(state); return "오래 쌓은 지역 연락망을 바탕으로 혁명군의 일을 맡았다."; } },
    { id: "independent", label: "지금의 소속과 일을 이어 간다", risk: "현재 소속 유지 · 물자 +10", personality: { caution: 5 }, apply: (state) => { state.supplies += 10; return "새 조직의 소식을 들었지만 지금 맡은 사람들 곁에 남았다."; } }
  ] };
  if (age === life.birth.yearsBeforeCurrent - 15) return { ...base, id: "life_tiger_liberation_news", urgent: true, art: "deck", title: "해방의 소식", canon: "https://one-piece.com/comics/o63/index.html",
    body: "피셔 타이거가 마리조아의 노예들을 풀어 주었다는 소식이 신문과 선원의 입을 타고 왔다. 누군가는 환호했고, 누군가는 뒤따를 추적을 걱정했다.", choices: [
      { id: "support", label: "탈출한 사람을 도울 연락처를 찾는다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 8, freedom: 5 }, apply: (state) => { state.supplies -= 10; state.trust += 10; return "멀리서 온 사람에게 쉴 곳과 다음 배의 시간을 알려 주었다."; } },
      { id: "observe", label: "신문을 보관하고 다음 소식을 기다린다", risk: "기술 +10", personality: { caution: 5 }, apply: (state) => { state.skill += 10; return "확인되지 않은 소문은 덧붙이지 않고, 날짜와 장소를 적어 두었다."; } }
    ] };
  if (age === life.birth.yearsBeforeCurrent - 12) return { ...base, id: "life_fisher_tiger_news", urgent: true, art: "deck", title: "태양 해적단의 소식", canon: "https://one-piece.com/character/Fisher_Tiger/index.html", body: "신문에는 태양 해적단을 이끌던 피셔 타이거가 숨졌다는 소식이 실렸다. 항구에서는 그의 삶을 두고 서로 다른 말을 했다.", choices: [
    { id: "listen", label: "그를 알던 사람의 이야기를 듣는다", risk: "지역의 신뢰 +10", personality: { empathy: 8 }, apply: (state) => { state.trust += 10; return "누군가의 이름을 신문 한 줄로만 남기지 않기로 했다."; } },
    { id: "pass", label: "당장의 항해를 준비한다", risk: "물자 +10", personality: { caution: 5 }, apply: (state) => { state.supplies += 10; return "신문을 접고 다음 배의 물자를 셌다."; } }
  ] };
  if (age === life.birth.yearsBeforeCurrent - 10) return { ...base, id: "life_tom_news", urgent: true, art: "workbench", title: "워터 세븐에서 온 부고", canon: "https://one-piece.com/vivre/revision/index.html",
    body: "워터 세븐에서 온 배가 조선공 톰의 처형 소식을 전했다. 그가 만든 배와 해상열차는 남았지만, 작업장의 사람들은 이제 다른 길을 찾아야 했다." };
  if (age === life.birth.yearsBeforeCurrent - 6 && (life.mode === "original" || life.role !== "사황")) return { ...base, id: "life_shanks_news", urgent: true, art: "deck", title: "붉은 머리의 새 호칭", canon: "https://one-piece.com/vivre/revision/index.html", body: (state) => `바다의 신문은 샹크스를 사황이라고 불렀다. ${state.birth.name}이 만난 적 없는 사람의 이름도 항로의 분위기를 바꾸었다.` };
  // Rule 18: the decades before Roger's execution have their own canon news after the fixed-year news above; a small child does not take it in.
  const oldEra = age >= (giant(life) ? 35 : 6) ? oldEraScene(life, age, base) : null;
  if (oldEra) return oldEra;
  if (!stretched(life) && age === life.birth.yearsBeforeCurrent - 2) return marinefordNews(life);
  // Rule 3 fills the two years from the war to the original present (the Elbaf arc), which older rules left empty.
  if (life.creationVersion === 3 && age === life.birth.yearsBeforeCurrent - 1) return { ...base, id: "life_timeskip_news", urgent: true, art: "deck", title: "전쟁 뒤의 신문",
    body: "마린포드 전쟁 뒤 해군 원수가 바뀌고, 검은 수염이 새로운 사황으로 불리기 시작했다. 밀짚모자 일당의 이름은 한동안 신문에서 사라졌다." };
  if (life.creationVersion === 3 && age === life.birth.yearsBeforeCurrent && life.location !== "엘바프") return { ...base, id: "life_new_era_news", urgent: true, art: "deck", title: "새 시대의 신문",
    canon: "https://one-piece.com/story/land_of_wano/index.html",
    body: "2년 만에 다시 모인 밀짚모자 일당의 소식이 연달아 실렸다. 드레스로자의 도플라밍고, 와노국의 카이도와 빅 맘이 차례로 쓰러졌고 루피는 새 사황으로 불렸다. 에그헤드 사건 뒤 일당은 엘바프로 향했다." };

  const fate = fateScene(life, age, base);
  if (fate) return fate;
  const start = careerStart(life, age, base);
  if (start) return start;
  const oldSignal = loguetownFollowUp(life, age, base);
  if (oldSignal) return oldSignal;
  const follow = life.creationVersion >= 9 ? followUp(life) : null;
  if (follow) return follow;
  const late = lateLife(life, age, base);
  if (late) return late;
  // Rule 11 checks promotions before the busy event generators, which otherwise took every year's slot.
  const promotion = life.creationVersion >= 11 ? rankOpportunity(life, age, base) : null;
  if (promotion) return promotion;
  // Rule 19 does the same for career offers (own crew, switching sides), each still limited by its own gap in years.
  const offered = life.creationVersion >= 19 ? careerOpportunity(life, age, base) : null;
  if (offered) return offered;
  // Rule 27: return to a known person only on the same island and in a confirmed era.
  const returning = directEncounterFollowUp(life, age, base, storyBefore(life, age));
  if (returning) return returning;
  // Rule 20: a canon boss or a canon friend who has grown close gets a scene of their own.
  const bond = canonBondScene(life, age, base);
  if (bond) return bond;
  const wanted = bountyScene(life, age, base);
  if (wanted) return wanted;
  const patrol = marinePatrolScene(life, age, base);
  if (patrol) return patrol;
  const systemStory = life.creationVersion >= 20 ? systemEventScene(life, age, base) : null;
  if (systemStory) return systemStory;
  const adventure = adventureScene(life, age, base);
  if (adventure) return adventure;

  const flexible = flexibleIncident(life, age);
  if (flexible) return flexible;

  const encounter = life.creationVersion >= 2 ? encounterAt({ ...life, age }) : null;
  if (encounter) return { ...encounterScene({ ...life, age, pendingEncounter: encounter }), urgent: true };
  // Rule 15: a crew whose people took a real liking (tie 2+) sends its own invitation.
  const invited = life.creationVersion >= 15 && life.leftHome && life.path !== "marine" && !life.canonCrew
    && openCanonCrews(life, age).find((crew) => (life.people.crewTies?.[crew] || 0) >= 2 && !life.seen.includes(`life_crew_invite_${crew}`));
  if (invited) return { ...base, id: `life_crew_invite_${invited}`, urgent: true, art: "deck", title: `${invited}의 부름`,
    body: `${invited}의 배에서 온 선원이 ${life.birth.name}을 찾아왔다. 지난번 일을 기억하는 사람이 있다며, 갑판에 빈자리가 하나 있다고 했다. 배는 다음 물때에 떠날 예정이었다.`,
    choices: [canonCrewChoice("canon_crew", null, depart, !life.path, invited),
      { id: "decline", label: "지금의 길을 지킨다", risk: "제안을 거절함 · 인연은 남음", personality: { loyalty: 5, caution: 3 },
        apply: () => `${invited}의 선원은 아쉽다는 듯 어깨를 으쓱하고 돌아갔다.` }] };
  const contact = crewContactScene(life, age, base, openCanonCrews(life, age));
  if (contact) return contact;
  const isle = islandEvent(life, age, base);
  if (isle) return isle;
  const beat = personalBeat(life, age, base);
  if (beat) return beat;
  // Rule 3 lives start nearer the canon era, so voyages begin sooner and come more often to reach its islands in time.
  const [voyageFrom, voyageEvery] = life.creationVersion >= 3 ? giant(life) ? [116, 4] : [21, 2] : giant(life) ? [140, 10] : [24, 3];
  if (life.leftHome && !life.homebound && age >= voyageFrom && age % voyageEvery === 0) return travelScene(life, age);
  const career = careerOpportunity(life, age, base);
  if (career) return career;
  const rank = rankOpportunity(life, age, base);
  if (rank) return rank;

  const phase = giant(life) ? age < 112 ? "growing" : age < 282 ? "working" : "later"
    : age < 19 ? "growing" : age < 74 ? "working" : "later";
  const cadence = phase === "growing" && giant(life) ? 8 : 7;
  if (age % cadence === 0) {
    // Only new-rule giants get the larger pool, so older saves replay the same choice ids.
    const pool = life.creationVersion >= 2 && giant(life)
      ? [...(phase === "growing" ? giantGrowingDecisions : giantAdultDecisions), ...annualDecisions] : annualDecisions;
    const decision = pool[(Math.floor(age / cadence) + life.seed) % pool.length];
    return { ...base, art: phase === "later" ? "workbench" : "deck", title: decision.title, body: decision.body, choices: withTrait(life, decision.choices) };
  }
  const shared = phase === "growing" ? life.creationVersion >= 6 ? childhoodQuiet : growingYears : life.homebound
    ? phase === "working" ? homeYears : homeLaterYears
    : phase === "working" ? workingYears : laterYears;
  // Giant lives span centuries of quiet years, so they draw from a larger giant-only pool first.
  const pool = giant(life) ? [...(phase === "growing" ? giantGrowingYears : phase === "later" ? giantLaterYears
    : life.homebound ? giantHomeYears : giantWorkingYears), ...shared,
  ...(life.creationVersion >= 6 && phase === "growing" ? shared : [])] : shared;
  let index = life.creationVersion >= 6 && phase === "growing"
    ? yearRoll(life.seed ^ 0x18d72a63, age) % pool.length : (age + life.seed) % pool.length;
  // Folded years put fewer scenes between pool repeats, so rule 3 skips a title shown in the last ten scenes.
  const recent = life.creationVersion >= 3 ? life.journal.slice(-10).map((entry) => entry.title) : [];
  for (let tries = 0; tries < pool.length && recent.includes(pool[index][0]); tries += 1) index = (index + 1) % pool.length;
  const [title, body, art] = pool[index];
  return { ...base, art: art ? childhoodArt(life, art) : life.creationVersion >= 6 && giant(life) && phase === "growing" ? "giant"
    : phase === "later" ? "workbench" : "deck", title, body, quiet: true };
}

// Rule 3 folds a run of quiet years into one scene; it never skips past lastQuietAge (the next authored card).
export function yearlyScene(life, lastQuietAge = Infinity) {
  const scene = sceneForAge(life);
  if (life.creationVersion < 3 || !scene.quiet) return scene;
  const limit = Math.min(lastQuietAge, scene.age + (giant(life) ? 12 : 3));
  let end = scene.age;
  while (end < limit && sceneForAge({ ...life, age: end }).quiet) end += 1;
  if (end === scene.age) return scene;
  const years = end - scene.age + 1;
  return { ...scene, id: `life_years_${scene.age}_${end}`, age: end,
    body: (state) => `${years}년이 큰일 없이 흘렀다. ${typeof scene.body === "function" ? scene.body(state) : scene.body}` };
}

export function branchScene(life) {
  const kind = life.worldBranch;
  return { id: "life_branch_aftermath", age: life.age, act: 4, species: "all", yearly: true,
    art: kind === "emperor" ? "specialEmperorToast" : "workbench", title: { emperor: "새로운 사황의 항로", admiral: "새 대장의 첫 명령", commander: "다섯 번째 깃발" }[kind],
    body: {
      emperor: `${life.birth.name}의 이름이 실린 신문이 항구에 닿았다. 동맹은 앞으로의 항로와 물자를 다시 묻고, 버기가 있었을 자리의 이야기는 여기서부터 달라졌다.`,
      admiral: `${life.birth.name}의 임명 소식이 부하들의 손에 전해졌다. 아라마키가 맡았을 원작의 임무는 이제 같은 방식으로 흘러갈 수 없었다.`,
      commander: `혁명군의 네 군대장 곁에 ${life.birth.name}의 이름이 하나 더 올랐다. 원작에 없던 군대가 움직이면서 몇몇 왕국의 이야기는 다른 방향으로 흘렀다.`
    }[kind],
    after: (state) => { state.pendingBranch = false; return "처음 열린 IF 세계선의 결과가 생애 일지에 남았다."; } };
}
