import { speciesScenes } from "./species-story.js";
import { lifeScenes } from "./life-story.js";

export const CANON_CHAPTER = 1197;

const home = (life) => life.birth.home;
// shortcut: one harbor illustration covers several ages and places; add scene-specific art as routes expand.
const artForTrade = (life) => life.trade === "repair" ? "repaired" : "harbor";
const ageAtEnd = 66;
const canSail = (life) => life.skill >= 2 && life.supplies >= 1 && life.health >= 2;

const legacyScenes = [
  {
    id: "birth", act: 1, age: 0, art: "birth", title: "바다 곁에서 태어나다",
    body: (life) => `동쪽 바다의 ${home(life)}에서 네가 태어났다. 조산사가 포대기를 고쳐 감는 동안 양육자 준은 따뜻한 물을 가져왔다. 집에는 작은 배 한 척과 가족이 쓰던 나침반이 있었다. 아직 네가 고를 수 있는 것은 아무것도 없었다.`
  },
  {
    id: "home", act: 1, age: 3, art: "birth", title: "부두의 하루",
    body: (life) => `${home(life)}의 아침은 그물 말리는 냄새로 시작됐다. 준은 배를 돌보고, 너는 다른 어른들의 손을 거쳐 자랐다. 집 형편이 ${life.birth.means} 편이라도 그날 물고기가 잡힐지는 누구도 정하지 못했다.`
  },
  {
    id: "guardian", act: 1, age: 5, art: "birth", title: "준의 손",
    body: "준은 항구의 낡은 밧줄도 그냥 버리지 않았다. 끊어진 곳을 묶고 다시 살폈다. 너는 그 사람이 돌아올 때마다 같은 나침반을 탁자 위에 놓는다는 것을 기억했다. 그것은 집으로 가는 방향을 알려 주는 물건이었다."
  },
  {
    id: "friend", act: 1, age: 7, art: "birth", title: "린을 만나다",
    body: "네 또래인 린은 물때를 읽는 데 빠르고 말보다 행동이 먼저였다. 둘은 항구 끝에 앉아 돌아오는 배를 셌다. 어느 날 린은 바다 밖을 보고 싶다고 말했고, 너는 아직 이 부두 밖을 생각해 본 적이 없었다."
  },
  {
    id: "compass", act: 1, age: 8, art: "birth", title: "바늘이 가리킨 곳",
    body: "준은 나침반을 손에 쥐여 주며 바늘만 믿고 항해하지 말라고 했다. 바람과 사람의 말을 함께 살펴야 한다는 뜻이었다. 너는 그 말을 다 이해하지 못했지만, 나침반 뚜껑의 흠집은 또렷이 외웠다."
  },
  {
    id: "weather", act: 1, age: 10, art: "birth", title: "바뀌는 바람",
    body: "이른 저녁부터 바람이 항구의 종을 건드렸다. 어른들은 배를 더 단단히 묶고 창문을 닫았다. 너는 준을 따라 밧줄을 운반했지만, 어느 배를 먼저 지킬지는 어른들이 결정했다. 린의 집에도 불이 늦게까지 켜져 있었다."
  },
  {
    id: "storm", act: 1, age: 10, art: "storm", title: "그 밤의 파도",
    body: "밤새 파도가 부두를 넘었다. 너는 문 안에서 밧줄이 끊어지는 소리를 들었다. 밖으로 뛰어나가려 할 때 준이 어깨를 붙잡았다. 새벽이 올 때까지 너는 배를 지키지도, 폭풍을 멈추지도 못했다."
  },
  {
    id: "wreck", act: 1, age: 11, art: "storm", title: "배가 돌아오지 않았다",
    body: "폭풍 다음 날, 가족의 작은 배가 부두 아래에 걸려 있었다. 양육자는 가족의 나침반을 쥔 채 오래 말을 잇지 못했다. 집의 수입도 끊겼다. 네가 앞으로 무엇을 할지 제안할 수 있게 될 때까지, 손댈 수 없는 일부터 받아들여야 했다."
  },
  {
    id: "first_choice", act: 1, age: 11, art: "storm", title: "처음 고르는 길",
    body: "부서진 배는 아직 물에 띄울 수 없다. 준은 다음 일을 정할 시간이 필요하다고 말했다. 네가 할 수 있는 작은 행동을 제안할 차례다. 어떤 길도 어젯밤의 폭풍을 없애지는 못한다.",
    choices: [
      { id: "repair", label: "배를 고칠 방법을 찾는다", risk: "시간이 걸림 · 수리의 첫걸음", apply: (life) => { life.trade = "repair"; life.skill += 1; life.bond += 1; return "준과 함께 수리할 사람을 찾기로 했다. 배를 보는 눈이 달라졌다."; } },
      { id: "crew", label: "다른 배의 일을 알아본다", risk: "당장 수입 · 집에 있는 시간 감소", apply: (life) => { life.trade = "crew"; life.supplies += 1; return "다른 선주가 네 이름을 기억했다. 집에 가져갈 일감도 생겼다."; } },
      { id: "travel", label: "항구를 떠날 길을 찾는다", risk: "위험 높음 · 준과 떨어질 수 있음", apply: (life) => { life.trade = "travel"; life.bond -= 1; life.leftHome = true; return "떠날 배와 동행을 찾기 시작했다. 준과는 한동안 말을 고르기 어려웠다."; } }
    ]
  },
  {
    id: "response", act: 1, age: 12, art: "storm", title: "선택의 첫 여파",
    body: (life) => life.trade === "repair"
      ? "준은 네가 구해 온 장인의 이름을 종이에 적었다. 돈과 시간이 부족해 바로 배를 고치지는 못하지만, 부탁할 사람 하나가 생겼다. 린은 낡은 못을 모아 두겠다고 했다."
      : life.trade === "crew"
        ? "다른 배에서 바닥을 닦고 그물을 걷는 일을 시작했다. 가족 배는 그대로 남아 있지만, 집에는 다시 식사가 올라왔다. 린은 네가 부두에서 가장 늦게 돌아오는 날이 많아졌다고 말했다."
        : "준은 준비도 없이 떠나는 일을 막았다. 너는 배삯과 동행, 돌아올 길을 알아보는 데 먼저 몇 해를 썼다. 린은 네가 정말 떠나면 나침반을 잃어버리지 말라고 했다."
  },
  {
    id: "friend_choice", act: 1, age: 13, art: "storm", title: "린에게 말할까",
    body: "린은 네가 그날 밤부터 부두 끝을 피한다는 걸 알아챘다. 폭풍 이야기를 다시 꺼내는 일이 싫었지만, 함께 일할 사람이 필요할지도 모른다. 관계를 남길지 혼자 견딜지 고를 수 있다.",
    choices: [
      { id: "talk", label: "린에게 계획을 털어놓는다", risk: "함께할 사람을 얻을 수 있음", apply: (life) => { life.friendBond += 1; return "린은 네 말을 끝까지 들었다. 둘 사이에 다시 함께할 약속이 남았다."; } },
      { id: "alone", label: "이번 일은 혼자 해본다", risk: "도움이 늦어질 수 있음", apply: (life) => { life.independent = true; return "린은 더 묻지 않았다. 네가 혼자 해결한 첫 일이 일지에 남았다."; } }
    ]
  },
  {
    id: "youth", act: 1, age: 15, art: "harbor", title: "어린 날의 끝",
    body: (life) => `${home(life)}는 여전히 같은 곳에 있지만, 너를 아는 사람들의 기대는 달라졌다. 부서진 배와 나침반, 준과 린은 다음 삶에도 따라온다. 어떤 일을 배우든 첫 폭풍의 기억이 그 선택의 이유가 되었다.`
  },
  {
    id: "apprentice", act: 2, age: 17, art: "storm", title: "장인의 문턱",
    when: (life) => life.trade === "repair",
    body: "배를 고치는 장인은 첫날부터 톱을 맡기지 않았다. 너는 젖은 널빤지를 말리고 도구를 닦았다. 손이 익기 전에는 작은 틈도 큰 파도에서 벌어진다는 것을 배웠다. 준의 배는 아직 부두 아래에 있다.",
    after: (life) => { life.job = "선박 수리 견습"; return "견습 일을 시작했다. 배울 기술과 맡을 책임이 생겼다."; }
  },
  {
    id: "crew_work", act: 2, age: 17, art: "harbor", title: "다른 배의 갑판",
    when: (life) => life.trade === "crew",
    body: "새벽마다 다른 선주의 배를 탔다. 네가 처음 배운 것은 돛보다 사람의 순서였다. 누가 돌아오지 않으면 그 가족에게 소식을 전해야 했다. 집에 돈을 가져다줄 수 있었지만, 준과 보내는 저녁은 줄었다.",
    after: (life) => { life.job = "선원"; life.skill += 1; return "정식 선원으로 일하게 됐다. 항로와 동료의 이름을 익혔다."; }
  },
  {
    id: "road_work", act: 2, age: 17, art: "harbor", title: "떠나기 전에 필요한 것",
    when: (life) => life.trade === "travel",
    body: "한 번에 먼바다로 갈 배는 없었다. 너는 가까운 항구를 오가는 운반선의 일부터 배웠다. 여정에는 물자와 동행이 필요했고, 돌아올 편지도 남겨야 했다. 첫 출항은 상상보다 작고 구체적이었다.",
    after: (life) => { life.job = "항구 운반원"; life.location = "근처 항구"; life.supplies += 1; life.skill += 1; return "가까운 항구의 일자리를 얻었다. 떠날 길에 필요한 돈을 모으기 시작했다."; }
  },
  {
    id: "mentor", act: 2, age: 18, art: "harbor", title: "일을 알려 준 사람",
    body: (life) => life.trade === "repair"
      ? "장인은 부러진 판자를 잘라 버리기 전에 어디까지 살릴 수 있는지 물었다. 너는 답을 몰라 하루를 더 살폈다. 느리게 배운 기술이 나중에는 다른 배의 목숨을 지킬 수도 있다는 말을 들었다."
      : "한 선주가 바람보다 먼저 사람의 피로를 보라고 했다. 일꾼이 지치면 좋은 배도 돌아오지 못한다. 너는 항구의 일자리와 배삯, 맡은 사람의 이름을 함께 기록하기 시작했다."
  },
  {
    id: "first_wage", act: 2, age: 19, art: "harbor", title: "처음 손에 남은 돈",
    body: "몇 해를 일하고서야 네 몫의 돈이 손에 남았다. 집의 빈자리를 메울 수도 있고, 다음 일을 위한 도구를 살 수도 있다. 어느 쪽도 한 번에 모든 문제를 해결하지는 못한다.",
    choices: [
      { id: "home", label: "집에 보탠다", risk: "준과의 관계 · 개인 도구는 나중에", apply: (life) => { life.bond += 1; life.supplies += 1; return "준이 오랜만에 집의 장부를 덮었다. 당장의 생활이 조금 나아졌다."; } },
      { id: "tools", label: "일할 도구를 산다", risk: "당장 쓸 생활 자원 감소", apply: (life) => { life.skill += 1; life.supplies = Math.max(0, life.supplies - 1); return "손에 맞는 도구를 샀다. 다음 배에서는 전보다 어려운 일을 맡을 수 있다."; } }
    ]
  },
  {
    id: "setback", act: 2, age: 20, art: "storm", title: "실패한 하루",
    body: (life) => life.trade === "repair"
      ? "수리한 배 한 척에서 물이 샜다. 큰 사고는 막았지만 네가 맡은 이음새를 다시 뜯어야 했다. 장인은 실수를 숨기지 말라고 했다. 빠른 칭찬보다 다시 살필 시간이 필요했다."
      : "네가 맡은 물자 한 꾸러미가 제때 도착하지 않았다. 바다가 거칠었지만 변명으로 해결될 일은 아니었다. 함께 일하는 사람들과 순서를 다시 정하고, 늦어진 이유를 가족에게 알렸다."
  },
  {
    id: "join", act: 2, age: 21, art: "harbor", title: "항구 조합의 제안",
    body: "항구의 일꾼들이 서로의 배와 가족을 도우려고 조합을 만들었다. 함께 들어가면 일감과 물자를 나눌 수 있지만, 다른 사람의 손실도 외면하기 어렵다. 혼자 일할 길도 여전히 있다.",
    choices: [
      { id: "cooperative", label: "항구 조합에 들어간다", risk: "공동 물자 · 공동 책임", apply: (life) => { life.affiliation = "항구 조합"; life.role = "조합원"; life.trust += 1; return "조합원이 됐다. 다른 사람의 배와 안전도 네 일이 되었다."; } },
      { id: "independent", label: "혼자 일한다", risk: "자유 · 보급과 위험을 직접 감당", apply: (life) => { life.affiliation = "무소속"; life.role = "독립 일꾼"; life.supplies += 1; return "스스로 일감을 골랐다. 필요한 물자도 직접 구해야 한다."; } }
    ]
  },
  {
    id: "join_result", act: 2, age: 22, art: "harbor", title: "첫 책임",
    body: (life) => life.affiliation === "항구 조합"
      ? "조합은 네게 작은 배의 보수와 물자 장부를 맡겼다. 일을 나누니 빨라졌지만, 어제 몰랐던 사람의 사정도 들어야 했다. 직책은 이름보다 먼저 책임으로 다가왔다."
      : "일을 혼자 맡자 손에 남는 몫이 늘었다. 대신 바쁜 날에는 도움을 구할 사람이 바로 곁에 없었다. 너는 린에게 필요한 때 서로를 부를 수 있는지 물어보려 했다."
  },
  {
    id: "practice", act: 2, age: 23, art: (life) => artForTrade(life), title: "이제 할 수 있는 일",
    body: (life) => life.trade === "repair"
      ? "가족의 배가 다시 물을 가른다. 널빤지와 돛을 고치는 동안 너는 항구에 돌아오지 못한 다른 배도 보았다. 기술은 준의 배 한 척을 살렸지만, 다음에는 누구를 위해 쓸지 정해야 한다."
      : "준의 배는 다른 장인의 손을 거쳐 다시 물에 떴다. 네가 배운 일은 수리가 아니었지만, 그동안 가져온 일감과 물자가 수리에 보탬이 됐다. 배의 주인이 다시 항구를 떠나는 모습을 지켜봤다.",
    after: (life) => { life.skill += 1; life.job = life.trade === "repair" ? "선박 장인" : life.trade === "crew" ? "항로 일꾼" : "운반선 항해사"; return `일이 쌓여 ${life.job}으로 불리기 시작했다.`; }
  },
  {
    id: "friend_departure", act: 2, age: 25, art: "harbor", title: "린의 다른 길",
    body: "린은 다른 항구의 일자리를 제안받았다. 어릴 때 함께 배를 세던 사람도 자기 삶을 고른다. 너는 보내는 말 하나가 훗날 돌아올 길이 될 수 있다는 것을 알았다.",
    choices: [
      { id: "support", label: "린의 출항을 돕는다", risk: "당장 쓸 물자 감소", apply: (life) => { life.friendBond += 1; life.supplies = Math.max(0, life.supplies - 1); return "린은 네가 건넨 물자보다 출항을 함께 지켜본 시간을 오래 기억했다."; } },
      { id: "ask_stay", label: "곁에 남아 달라고 한다", risk: "관계가 멀어질 수 있음", apply: (life) => { life.friendBond -= 1; return "린은 떠났다. 남아 달라는 말은 두 사람 사이에 한동안 남았다."; } }
    ]
  },
  {
    id: "guardian_health", act: 2, age: 29, art: "harbor", title: "준이 쉬는 날",
    body: "준은 전보다 늦게 부두에 나왔다. 오래 일한 어깨가 아프다고 했다. 네가 항구에 있든 가까운 바다를 돌든, 돌보는 일에는 시간과 물자가 든다. 아무도 대신 살아 줄 수 없는 하루였다.",
    choices: [
      { id: "stay", label: "일을 줄이고 준 곁에 머문다", risk: (life) => life.rules === 2 && life.supplies < 1 ? "필요: 물자 1 · 현재 부족하여 시도하면 실패" : "물자 -1 · 준과의 유대 +1", apply: (life) => { if (life.rules === 2 && life.supplies < 1) return "물자가 없어 일을 줄이지 못했다. 준과의 약속을 다음으로 미뤘다."; life.bond += 1; life.supplies = Math.max(0, life.supplies - 1); return "준과 함께 집에 머물렀다. 그가 건네지 못한 옛 이야기를 들었다."; } },
      { id: "work", label: "일을 이어 치료비를 모은다", risk: "함께할 시간 감소", apply: (life) => { life.supplies += 1; life.bond -= 1; return "치료비를 모았다. 준과 마주 앉을 시간은 더 짧아졌다."; } }
    ]
  },
  {
    id: "adult", act: 2, age: 32, art: "harbor", title: "스스로 맡은 자리",
    body: (life) => `${home(life)}로 돌아온 뒤 사람들은 이제 네게 일을 묻는다. ${life.affiliation === "항구 조합" ? "조합의 장부와 배를 함께 살피는 일" : "혼자 고른 일감과 물자를 책임지는 일"}이 하루를 채웠다. 부서진 배를 보던 아이의 선택은 다른 사람의 생계에도 닿기 시작했다.`,
    after: (life) => { life.location = home(life); return "고향 항구에서 다시 일하기 시작했다."; }
  },
  {
    id: "roger_news", act: 3, age: 42, art: "harbor", title: "멀리서 온 신문",
    canon: "https://one-piece.com/character/Gold_Roger/index.html",
    body: "항구에 도착한 신문은 로저의 처형과 바다로 나서는 사람들의 소식을 전했다. 너는 그 자리에 있지 않았고, 모든 이야기를 알 수도 없었다. 다만 새 배가 늘자 이곳에서 돌아올 길을 준비해야 한다고 느꼈다."
  },
  {
    id: "goal", act: 3, age: 43, art: "harbor", title: "앞으로 지킬 것",
    body: "어릴 때 잃었던 배는 돌아왔거나 다른 사람의 손으로 바다에 떠 있다. 하지만 항구에는 여전히 돌아오지 못하는 사람이 있다. 지금부터 오랫동안 붙들 개인 목표를 정할 수 있다.",
    choices: [
      { id: "haven", label: "돌아올 수 있는 항구를 만든다", risk: "기반 · 긴 시간과 물자가 필요", apply: (life) => { life.goal = "돌아올 수 있는 항구"; return "항구의 길과 배를 오래 돌보겠다고 정했다."; } },
      { id: "protect", label: "사람을 먼저 지킨다", risk: "보호 · 때로 자신의 안전을 걸어야 함", apply: (life) => { life.goal = "곁의 사람을 지키기"; return "배보다 사람의 이름을 먼저 기억하겠다고 정했다."; } },
      { id: "freedom", label: "스스로 항로를 정한다", risk: "자유 · 안정된 자리에서 멀어질 수 있음", apply: (life) => { life.goal = "자신의 항로"; return "다른 사람이 정한 길만 따르지 않겠다고 정했다."; } }
    ]
  },
  {
    id: "responsibility", act: 3, age: 46, art: "harbor", title: "직책의 무게",
    body: (life) => life.affiliation === "항구 조합"
      ? "조합은 네가 물자와 사람을 함께 살핀 시간을 기억했다. 배를 고치는 기술만큼, 일을 거절해야 할 때를 아는 것도 중요해졌다. 새 직책은 쓸 수 있는 물자와 지켜야 할 사람을 함께 늘렸다."
      : "혼자 일해 온 너에게도 사람들은 긴급한 일을 맡기기 시작했다. 조합의 직책은 없지만, 약속한 일을 끝내고 도움을 구할 사람을 알아두는 책임은 생겼다. 자유와 고립의 경계가 가깝다.",
    after: (life) => { if (life.affiliation === "항구 조합") life.role = life.skill >= 2 ? "현장 책임자" : "숙련 조합원"; return life.affiliation === "항구 조합" ? `${life.role}가 됐다. 물자와 사람을 결정할 권한이 늘었다.` : "독립 일꾼으로서 항구의 신뢰를 얻었다."; }
  },
  {
    id: "apprentice_offer", act: 3, age: 50, art: "harbor", title: "배우러 온 사람",
    body: "한 젊은 일꾼이 네 일을 보고 배우고 싶다고 했다. 가르치면 지금 네 몫의 시간과 물자가 줄지만, 언젠가 네가 없을 때 항구에 남을 손이 생긴다. 거절해도 그 사람은 다른 길을 찾을 것이다.",
    choices: [
      { id: "teach", label: "시간을 내어 가르친다", risk: (life) => life.rules === 2 && life.supplies < 1 ? "필요: 물자 1 · 현재 부족하여 시도하면 실패" : "물자 -1 · 후계 관계의 시작", apply: (life) => { if (life.rules === 2 && life.supplies < 1) return "도구와 시간을 마련하지 못해 가르치는 일을 시작하지 못했다."; life.successor = true; life.apprenticeBond += 1; life.supplies = Math.max(0, life.supplies - 1); return "후배가 생겼다. 네가 한 일을 다른 사람이 다시 해볼 수 있게 되었다."; } },
      { id: "decline", label: "지금은 혼자 일한다", risk: "당장의 일은 빨라짐 · 후계자 없음", apply: (life) => { life.supplies += 1; return "일은 빠르게 끝냈지만, 네가 쉬는 날 대신할 사람은 아직 없다."; } }
    ]
  },
  {
    id: "merchant", act: 3, age: 54, art: "harbor", title: "큰 계약",
    body: "먼 항구의 상인이 조합과 너의 일을 한꺼번에 사겠다고 제안했다. 돈은 필요하다. 하지만 그 계약을 따르면 작은 구조선보다 상인의 배를 먼저 고쳐야 할 수 있다.",
    choices: [
      { id: "accept", label: "계약을 받아 물자를 모은다", risk: (life) => life.rules === 2 && life.trust < 2 ? "필요: 지역 신뢰 2 · 현재 부족하여 계약 실패" : "물자 +2 · 지역 신뢰 -1", apply: (life) => { if (life.rules === 2 && life.trust < 2) return "상인은 네게 큰 계약을 맡기지 않았다. 다음 일을 위해 신뢰를 쌓아야 한다."; life.supplies += 2; life.trust -= 1; return "작업장에 물자가 쌓였다. 기다리는 작은 배도 늘었다."; } },
      { id: "refuse", label: "항구의 작은 배부터 돌본다", risk: "물자 부족 · 지역 신뢰 증가", apply: (life) => { life.trust += 1; return "큰돈은 놓쳤다. 항구 사람들은 네가 어떤 배를 먼저 보는지 알게 되었다."; } }
    ]
  },
  {
    id: "old_compass", act: 3, age: 59, art: "harbor", title: "나침반의 흠집",
    body: "준은 더는 매일 부두에 나오지 않는다. 낡은 나침반의 흠집을 만지며 네게 처음 하던 말을 다시 꺼냈다. 바늘만 보지 말고 사람의 말도 들으라는 말이었다. 네 목표가 무엇이든 그 조언은 아직 쓸 곳이 있다."
  },
  {
    id: "marineford_news", act: 3, age: 64, art: "harbor", title: "전쟁이 닿은 항구",
    canon: "https://one-piece.com/story/marineford/index.html",
    body: "마린포드 전쟁의 소식은 신문과 전보벌레를 거쳐 항구에 왔다. 너는 전장을 보지 못했다. 그 뒤 항로를 바꾼 상선들이 이곳에 들렀다. 돛감과 식량을 찾는 배가 늘자, 먼 바다의 사건이 너의 일터에도 닿았다."
  },
  {
    id: "ration", act: 3, age: 64, art: "harbor", title: "모자란 물자",
    body: "항로를 바꿔 온 배에 돛감과 약이 필요하다. 항구에도 여유가 없다. 누군가는 배를, 누군가는 사람의 몸을 돌봐야 한다. 네가 낼 수 있는 도움을 정할 차례다.",
    choices: [
      { id: "share", label: "비축 물자를 나눈다", risk: (life) => life.supplies < 1 ? "필요: 물자 1 · 현재 부족하여 나눌 수 없음" : "물자 -1 · 지역 신뢰 +1", when: (life) => life.rules === 2 || life.supplies > 0, apply: (life) => { if (life.rules === 2 && life.supplies < 1) return "나눌 비축 물자가 없어 다른 방법을 찾아야 했다."; life.supplies -= 1; life.trust += 1; return "돛감과 음식을 나눴다. 다음 위기에 쓸 몫은 줄었다."; } },
      { id: "labor", label: "일손과 기술을 보탠다", risk: "몸을 쉬게 할 시간이 줄어듦", apply: (life) => { life.trust += 1; life.health = Math.max(1, life.health - 1); return "배를 고치고 사람을 옮겼다. 항구의 일을 함께 나눴다."; } }
    ]
  },
  {
    id: "storm_return", act: 3, age: 65, art: "rescue", title: "다시 거칠어진 바다",
    body: "또 다른 폭풍이 항구에 다가왔다. 바깥에 작은 배 한 척이 남았다는 소식이 왔다. 너는 첫 폭풍 때 밖으로 나가지 못했던 아이를 기억한다. 이번에는 선택할 수 있지만, 선택할 수 있다는 말이 안전하다는 뜻은 아니다."
  },
  {
    id: "rescue", act: 3, age: 65, art: "rescue", title: "구조의 밤",
    body: "파도 앞에 나설 배와 밧줄이 있다. 직접 바다로 나가거나, 뭍에서 안전한 길을 만들거나, 이번 위험에서 물러설 수 있다. 가진 기술과 물자는 결과를 바꾼다.",
    choices: [
      {
        id: "sail", label: "직접 구조선을 이끈다",
        risk: (life) => `${canSail(life) ? "구조 가능 · 건강 -1" : "조건 부족 · 출항 시 사망"} (필요 기술 2·건강 2·물자 1 / 현재 ${life.skill}·${life.health}·${life.supplies})`,
        apply: (life) => {
          if (!canSail(life)) {
            life.ending = "death";
            return "배는 사람을 태워 돌려보냈지만, 너는 폭풍 속에서 돌아오지 못했다.";
          }
          life.rescued += 1;
          life.trust += 1;
          life.health -= 1;
          return "배와 사람을 함께 돌려보냈다. 긴 밤의 대가로 몸에 상처가 남았다.";
        }
      },
      { id: "shore", label: "뭍에서 밧줄과 불빛을 맡는다", risk: "구조가 늦어질 수 있음 · 생존 위험 낮음", apply: (life) => { life.trust += 1; life.rescued += 1; return "항구 사람들과 신호를 맞췄다. 배가 돌아올 길을 밝혔다."; } },
      { id: "withdraw", label: "이번에는 물러선다", risk: "몸은 지킴 · 항구의 신뢰 감소", apply: (life) => { life.trust -= 1; return "너는 무사했다. 바다에 남은 사람의 소식은 오래 기다려야 했다."; } }
    ]
  },
  {
    id: "rescue_after", act: 3, age: 65, art: "harbor", title: "바다가 잠잠해진 뒤",
    when: (life) => !life.ending,
    body: (life) => life.rescued
      ? "구조된 사람들은 이름을 묻기보다 따뜻한 물을 찾았다. 너는 그들을 도운 항구 사람들의 손을 보았다. 혼자 위대한 사람이 되는 일보다, 누군가 돌아올 자리를 남기는 일이 오래간다."
      : "폭풍이 지나가고도 기다리는 사람은 있었다. 네가 물러난 선택은 살아남는 방법이었지만, 그 뒤에 남은 관계를 없애 주지는 않는다. 항구의 다음 일은 여전히 누군가 해야 한다."
  },
  {
    id: "retire_choice", act: 3, age: ageAtEnd, art: "harbor", title: "다음 사람의 자리",
    when: (life) => !life.ending,
    body: (life) => life.successor || life.affiliation === "항구 조합"
      ? "이제 네가 없어도 항구의 일을 맡을 사람이 있다. 물러나면 매일의 결정권과 책임을 그 사람들에게 넘긴다. 남아서 현재의 바다를 더 지켜볼 수도 있다."
      : "항구의 일이 모두 너에게만 매달려 있다. 지금 물러나려면 먼저 일을 넘길 사람이나 조직을 찾아야 한다. 당장은 일을 이어가며 다음 결정을 남길 수 있다.",
    choices: [
      { id: "retire", label: "일을 넘기고 은퇴한다", risk: "직책과 매일의 책임을 내려놓음", when: (life) => life.successor || life.affiliation === "항구 조합", apply: (life) => { life.ending = "retire"; life.role = "은퇴"; return "일과 나침반을 다음 사람에게 넘겼다. 네 삶을 돌아볼 시간이 왔다."; } },
      { id: "continue", label: "한동안 일을 이어간다", risk: "현재 시점에서 생애를 정리", apply: (life) => { life.continued = true; return "한 시대의 끝까지 일터에 남기로 했다."; } }
    ]
  },
  {
    id: "present_choice", act: 3, age: ageAtEnd, art: "harbor", title: "아직 열린 바다",
    when: (life) => !life.ending,
    body: "원작에서 확인된 현재의 시대에 닿았다. 너에게도 후일이 있을 수 있지만, 아직 일어나지 않은 원작의 사건을 미리 쓰지는 않는다. 지금 이 항구에 남길 결정을 하나 고른다.",
    choices: [
      { id: "delegate", label: "다음 배를 후배에게 맡긴다", risk: "신뢰를 건네고 기다림", apply: (life) => { life.successor = true; life.apprenticeBond += 1; life.ending = "present"; return "다음 항로를 후배에게 맡겼다. 네가 지켜볼 일은 아직 남았다."; } },
      { id: "lead", label: "다음 배의 항로를 직접 정한다", risk: "책임을 계속 짊어짐", apply: (life) => { life.ending = "present"; return "아직 네 손으로 결정할 일이 남았다. 그 뒤의 바다는 적지 않는다."; } }
    ]
  },
  {
    id: "death_event", act: 4, age: 65, art: "rescue", title: "돌아오지 않은 밤", when: (life) => life.ending === "death",
    body: "위험은 선택 전에 알려져 있었다. 구조선은 항구에 닿았지만 너는 돌아오지 못했다. 남은 사람들은 한동안 네 이름을 크게 부르지 못했다. 이 결말은 점수나 벌이 아니라 네가 감수한 위험의 결과다."
  },
  {
    id: "death_origin", act: 4, age: 65, art: "storm", title: "처음의 배", when: (life) => life.ending === "death",
    body: "남은 사람들은 첫 폭풍에 잃은 배와 그 뒤 네가 고른 일을 떠올렸다. 가족의 나침반은 다시 집에 돌아왔다. 그 물건이 이번에는 바다로 나갈 사람보다 기다리는 사람 곁에 남았다."
  },
  {
    id: "death_goal", act: 4, age: 65, art: "harbor", title: "끝내지 못한 목표", when: (life) => life.ending === "death",
    body: (life) => `${life.goal}이라는 목표는 여기서 완성됐다고 단정할 수 없다. 네가 남긴 배와 일터, 도움받은 사람은 실제로 남아 있다. 후배가 있다면 그 사람이 이어갈 수 있지만, 미래의 성공을 대신 적지는 않는다.`
  },
  {
    id: "death_trace", act: 4, age: 65, art: "harbor", title: "남은 사람들의 기록", when: (life) => life.ending === "death",
    body: (life) => `${home(life)}에는 네 일을 기억하는 사람이 있다. ${life.affiliation === "항구 조합" ? "조합은 네 몫의 책임을 다시 나눴다." : "함께 일하던 사람들은 비어 있는 자리를 메울 방법을 찾았다."} 네 삶은 그 사람들의 다음 선택에서만 이어진다.`
  },
  {
    id: "retire_event", act: 4, age: ageAtEnd, art: "retirement", title: "나침반을 건네는 날", when: (life) => life.ending === "retire",
    body: (life) => `${home(life)}에서 맡아 온 일을 다음 사람에게 넘겼다. 네가 수리했던 배든, 네가 길을 찾아 주었던 배든 다시 바다로 나간다. 가족의 나침반도 더는 혼자 간직할 물건이 아니었다.`
  },
  {
    id: "retire_origin", act: 4, age: ageAtEnd, art: "harbor", title: "첫 폭풍의 대답", when: (life) => life.ending === "retire",
    body: "첫 폭풍은 되돌릴 수 없었다. 그 뒤의 삶은 배를 고치거나, 다른 배에서 일하거나, 떠난 길을 다시 찾는 방식으로 계속됐다. 너는 그날의 손실이 모든 날을 결정하지는 않았다고 말할 수 있다."
  },
  {
    id: "retire_goal", act: 4, age: ageAtEnd, art: "harbor", title: "목표의 현재 상태", when: (life) => life.ending === "retire",
    body: (life) => `${life.goal}이라는 목표는 네가 해 온 일만큼 이루어졌다. ${life.rescued ? "돌아온 배가 있었고," : "기다리는 배도 있었고,"} 아직 도울 사람이 남아 있다. 은퇴는 항구의 미래를 완성했다고 선언하는 자리가 아니라 책임을 넘기는 선택이다.`
  },
  {
    id: "retire_trace", act: 4, age: ageAtEnd, art: "harbor", title: "다음 손", when: (life) => life.ending === "retire",
    body: (life) => life.successor
      ? "후배는 네가 하던 일을 같은 방식으로만 하지 않을 것이다. 나침반의 흠집은 그대로지만, 그 사람이 정할 항로는 아직 없다. 네가 남긴 것은 답보다 일할 자리와 믿음이다."
      : "조합 사람들은 네가 맡았던 일을 나누었다. 한 사람이 모두 대신하지 않아도 항구의 아침은 시작된다. 네가 남긴 것은 직책보다 일을 나누는 방법이었다."
  },
  {
    id: "present_event", act: 4, age: ageAtEnd, art: "harbor", title: "지금의 항구", when: (life) => life.ending === "present",
    body: "이 시대의 끝에 도착했지만 너의 삶이 멈춘 것은 아니다. 지금 확인할 수 있는 항구와 사람들만 기록한다. 내일의 원작 사건을 앞질러 적거나 네 성공을 미리 정하지 않는다."
  },
  {
    id: "present_origin", act: 4, age: ageAtEnd, art: "storm", title: "지나온 폭풍", when: (life) => life.ending === "present",
    body: "첫 폭풍에 부서진 배는 다시 떠났거나 다른 배의 길을 열었다. 준과 린에게 했던 말도 그때의 그대로 있지 않다. 네가 고른 것은 잃은 날이 아니라 그 뒤에 한 일들이었다."
  },
  {
    id: "present_goal", act: 4, age: ageAtEnd, art: "harbor", title: "아직 이어지는 목표", when: (life) => life.ending === "present",
    body: (life) => `${life.goal}이라는 목표의 지금 모습을 본다. 네가 지켜 온 사람과 일터가 있고, 풀지 못한 일도 있다. 어느 쪽이든 이 시대의 기록으로 남기고 아직 오지 않은 결과는 말하지 않는다.`
  },
  {
    id: "present_trace", act: 4, age: ageAtEnd, art: "harbor", title: "여기서 남기는 한 장", when: (life) => life.ending === "present",
    body: (life) => `${home(life)}의 다음 배는 아직 준비 중이다. ${life.successor ? "후배가 항로를 살피고" : "네가 항로를 살피고"}, 다른 사람들은 자기 몫의 일을 한다. 이 항구를 만든 삶의 이야기는 여기서 한 장을 닫는다.`
  },
  ...speciesScenes
];

export const scenes = [
  ...legacyScenes.map((card) => ({ ...card, rules: [1, 2] })),
  ...lifeScenes.map((card) => ({ ...card, rules: [3] }))
];
