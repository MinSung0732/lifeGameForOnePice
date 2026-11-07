// Rule 32: a chosen personal direction is separate from the automatic career goal.
export const PERSONAL_AIMS = {
  freedom: "스스로 길을 선택하는 자유",
  justice: "부당함 앞에서 사람을 지키는 일",
  bonds: "소중한 사람과 삶을 이어 가는 일",
  craft: "배운 기술을 삶에 쓰고 전하는 일"
};

export function personalAimLabel(aim) {
  return PERSONAL_AIMS[aim] || null;
}

export function personalAimScene(life, age, base) {
  if (life.creationVersion < 32 || !life.path || life.retired
    || life.seen.includes("life_personal_aim") || !life.seen.includes("life_first_station")
    || age < life.careerStartAge + 2) return null;
  return { ...base, id: "life_personal_aim", urgent: true, art: "workbenchReportLetters",
    title: "내가 바라던 삶의 모양",
    body: "첫 일터를 경험하고 나니 직업의 이름과 내가 바라는 삶은 꼭 같지 않았다. 무엇을 마음에 두고 살아갈지, 아직 결정하지 않아도 괜찮았다.",
    choices: [
      { id: "freedom", label: "어디서든 스스로 갈 길을 고르고 싶다", risk: "개인의 방향을 기록 · 소속 유지",
        apply: (state) => { state.personalAim = "freedom"; return "소속을 떠나겠다는 뜻은 아니었다. 선택할 자유를 기억해 두기로 했다."; } },
      { id: "justice", label: "부당한 일을 외면하지 않고 사람을 지키고 싶다", risk: "개인의 방향을 기록 · 소속 유지",
        apply: (state) => { state.personalAim = "justice"; return "정답을 모두 안다는 뜻은 아니었다. 지켜야 할 사람을 생각해 보기로 했다."; } },
      { id: "bonds", label: "곁의 사람과 관계를 이어 가고 싶다", risk: "개인의 방향을 기록 · 소속 유지",
        apply: (state) => { state.personalAim = "bonds"; return "모든 만남이 오래가지는 않더라도 서로의 몫을 기억하기로 했다."; } },
      { id: "craft", label: "기술을 배우고 필요한 곳에 쓰고 싶다", risk: "개인의 방향을 기록 · 소속 유지",
        apply: (state) => { state.personalAim = "craft"; return "어떤 직책에 있든 손에 익힌 일을 소중히 여기기로 했다."; } },
      { id: "undecided", label: "아직 하나의 꿈으로 정하지 않는다", risk: "특정 개인 목표 없음 · 현재 삶 유지",
        apply: (state) => { state.personalAim = null; return "마음이 바뀔 수도 있었다. 지금은 앞으로의 선택을 지켜보기로 했다."; } }
    ] };
}

export function personalAimRetirement(life, card) {
  if (life.creationVersion < 32) return card;
  const aim = life.seen.includes("life_personal_aim") && personalAimLabel(life.personalAim);
  return {
    ...card,
    body: aim
      ? "젊은 시절에는 '" + aim + "'을 바라며 살고 싶다고 골랐다. 그동안 했던 선택이 모두 그 뜻과 같지는 않았을 것이다. 남은 시간의 일과 책임을 어떻게 다룰지 정할 때가 왔다."
      : "어떤 삶을 원하는지 하나로 정하지 않은 채 지나온 시간도 있었다. 지금 맡은 직책을 내려놓거나 일을 계속할 수 있다. 아직 선택하지 않은 미래의 결과를 미리 적을 수는 없다.",
    choices: [...card.choices, ...(aim ? [
      { id: "reframe", label: "처음의 꿈을 다른 뜻으로 받아들이고 지금의 일을 이어 간다",
        risk: "직책 유지 · 기술 +3 · 목표의 의미를 다시 생각함",
        apply: (state) => { state.skill += 3; return "처음 정한 꿈을 반드시 같은 모양으로 이룰 필요는 없다고 기록했다. 남은 일은 계속 맡기로 했다."; } }
    ] : [])]
  };
}

export function personalAimSummary(life) {
  const journal = life.journal || [];
  const beginning = journal.find((entry) => entry.id === "life_personal_aim" && entry.choice);
  if (!beginning) return "스스로 정한 개인 목표의 기록은 남지 않았다.";
  const aim = personalAimLabel(life.personalAim);
  const opening = aim ? "처음 고른 방향: " + aim + "." : "처음에는 하나의 꿈을 정하지 않기로 했다.";
  // Quote only a consequential choice recorded after the original personal direction.
  const defining = [...journal].reverse().find((entry) => entry.age >= beginning.age
    && entry.choice && /^life_(path_(pirate|marine|liberator|civilian)_choice|people_ward_return|path_(marine|civilian)_after|free_rank)$/.test(entry.id));
  const later = defining ? " " + defining.title + "에서 한 선택: '" + defining.choice + "'." : "";
  const finalDecision = journal.find((entry) => entry.id === "life_retire_choice" && entry.choice);
  const late = finalDecision?.choice?.includes("처음의 꿈을 다른 뜻으로")
    ? " 노년에 처음의 꿈을 다른 뜻으로 받아들이기로 선택했다."
    : finalDecision ? " 노년에 선택한 일: '" + finalDecision.choice + "'." : "";
  return opening + later + late;
}
