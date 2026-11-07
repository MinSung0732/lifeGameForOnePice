// Rule 27: fictional local returns for two existing, canon-grounded direct encounters.
const PEOPLE = {
  kureha: { name: "닥터 쿠레하", place: "드럼섬", earliest: 30, art: "arcDrum",
    canon: "https://one-piece.com/character/Dr_Kureha/index.html" },
  crocus: { name: "크로커스", place: "쌍둥이 언덕", earliest: 24, art: "arcTwinCape",
    canon: "https://one-piece.com/character/Crocus/index.html" }
};

function recordMeeting(state, key, delta, choice, age, legacy) {
  state.people ||= {};
  state.people.canonContacts ||= {};
  const record = state.people.canonContacts[key] ||= { score: 0, meetings: 0, captureAttempts: 0 };
  record.score = Math.max(-100, Math.min(100, record.score + delta));
  record.meetings += 1;
  record.lastAge = age;
  record.lastPlace = state.location;
  record.lastOrder = (state.actions?.length || 0) + 1;
  record.lastChoice = choice;
  if (legacy) record.legacy = legacy;
  return record;
}

export function enrichDirectEncounter(life, card, key) {
  if (life.creationVersion < 27 || !Object.hasOwn(PEOPLE, key)) return card;
  const deltas = key === "kureha" ? { treat: 12, listen: 4 } : { ask: 12, go: -4 };
  const role = life.path === "marine" ? "해군 제복이 특별한 호의를 보장하지는 않았다."
    : life.path === "pirate" ? "해적이라는 신분을 감추지 않자 상대의 눈빛도 신중해졌다."
      : "먼저 자신의 일을 설명한 뒤에야 대화를 시작할 수 있었다.";
  return { ...card, art: PEOPLE[key].art, body: card.body + " " + role, choices: [
    ...card.choices.map((choice) => ({ ...choice,
      risk: choice.risk + " · 인연 " + (deltas[choice.id] > 0 ? "+" : "") + deltas[choice.id],
      apply: (state) => {
        const result = choice.apply(state);
        recordMeeting(state, key, deltas[choice.id], choice.id, state.age);
        return result + (key === "kureha" ? " 쿠레하는 다음에는 준비를 더 꼼꼼히 하라고 일렀다."
          : " 크로커스는 등대의 항로 기록을 다시 펼쳐 보였다.");
      } })),
    { id: "disagree", label: key === "kureha" ? "진료 순서를 두고 쿠레하와 다툰다"
      : "기록보다 출항이 먼저라며 크로커스에게 따진다",
      risk: "인연 -18 · 의견 충돌", personality: { ambition: 4, caution: -3 },
      apply: (state) => {
        recordMeeting(state, key, -18, "disagree", state.age);
        return key === "kureha"
          ? "쿠레하는 환자보다 말이 앞섰다며 대화를 끝냈다. 너는 진료소 밖에서 자신의 판단을 다시 생각했다."
          : "크로커스는 억지로 붙잡지 않았다. 너는 그의 조언을 듣지 않고 등대 밖으로 발길을 돌렸다.";
      } }
  ] };
}

export function directEncounterFollowUp(life, age, base, before) {
  if (life.creationVersion < 27 || !life.path || life.retired || life.ending) return null;
  for (const key of ["kureha", "crocus"]) {
    const person = PEOPLE[key];
    const entry = life.people?.canonContacts?.[key];
    const id = "life_encounter_return_" + key;
    if (life.location !== person.place || !entry?.meetings || !life.seen.includes("life_meet_" + key)
      || life.seen.includes(id) || age - (entry.lastAge ?? age) < 3
      || age - (life.people?.lastBondAge ?? -100) < 3 || before > person.earliest || before < 0) continue;
    const trusted = entry.score >= 10;
    const scene = key === "kureha"
      ? "드럼섬 치료실에서 쿠레하와 다시 만났다. 진료를 기다리는 선원들이 복도에 모여 있었다. 약과 깨끗한 물을 나눌 사람부터 필요했다."
      : "쌍둥이 언덕의 등대에 다시 닻을 내렸다. 크로커스는 기록지침을 거꾸로 든 젊은 선원들과 언쟁 중이었다. 준비 없는 항해는 아직 끝나지 않은 문제였다.";
    const memory = trusted ? "그는 지난번에 맡았던 일을 기억했지만, 이번 문제는 네가 풀어야 한다고 했다."
      : "지난번의 무례가 아직 남아 있었다. 아무 설명도 없이 그의 도움을 기대할 수는 없었다.";
    const role = life.path === "marine" ? "해군의 명령보다 안전을 먼저 확인해야 했다."
      : life.path === "pirate" ? "함께 온 해적 동료들도 자기 몫을 해야 했다."
        : "섬 주민과 여행자 사이에서 네가 할 일을 정해야 했다.";
    const choices = [
      { id: "cooperate", when: () => trusted, available: (state) => state.skill >= 35, cost: 5,
        label: key === "kureha" ? "환자 순서를 정리하고 약을 나른다" : "기록지침과 항해 기록을 대조한다",
        risk: "기술 35·물자 5 필요 · 기술 +5 · 인연 +8", personality: { caution: 5, empathy: 4 },
        apply: (state) => {
          state.supplies -= 5; state.skill += 5;
          recordMeeting(state, key, 8, "cooperate", age, "협력"); state.people.lastBondAge = age;
          return key === "kureha" ? "쿠레하는 약의 순서만 짚어 주었다. 환자들을 돌본 것은 너와 동료들의 손이었다."
            : "크로커스가 틀린 표식을 짚었다. 네가 고친 해도를 배에 가져가 다음 항해에 쓰기로 했다.";
        } },
      { id: "apologize", when: () => !trusted, cost: 5, label: "지난번의 무례를 인정하고 다시 배울 기회를 청한다",
        risk: "물자 -5 · 인연 +15", personality: { empathy: 5, caution: 3 },
        apply: (state) => {
          state.supplies -= 5; recordMeeting(state, key, 15, "apologize", age, "화해"); state.people.lastBondAge = age;
          return key === "kureha" ? "쿠레하는 사과를 서둘러 받아 주지 않았다. 먼저 물을 가져오라는 말에 너는 일을 시작했다."
            : "크로커스는 변명을 듣지 않았다. 너는 틀린 지도를 다시 그려 오기로 했다.";
        } },
      { id: "duty", when: (state) => state.path === "marine", label: "섬의 안전 정보를 지부 기록에 남긴다",
        risk: "지역의 신뢰 +5 · 인연 -4", personality: { loyalty: 4, caution: 5 },
        apply: (state) => {
          state.trust += 5; recordMeeting(state, key, -4, "duty", age, "공무"); state.people.lastBondAge = age;
          return "주민에게 필요한 사실만 보고서에 적었다. 상대는 자신의 말을 군의 명령으로 바꾸지 말라고 당부했다.";
        } },
      { id: "crew", when: (state) => state.path === "pirate", label: "동료와 함께 스스로 해결할 방법을 찾는다",
        risk: "친구와의 유대 +6 · 인연 변화 없음", personality: { loyalty: 5, freedom: 3 },
        apply: (state) => {
          state.friendBond += 6; recordMeeting(state, key, 0, "crew", age, "자립"); state.people.lastBondAge = age;
          return "유명한 사람의 손을 빌리지 않고 동료와 역할을 나누었다. 배의 문제는 우리가 직접 책임졌다.";
        } },
      { id: "neighbors", when: (state) => state.path === "civilian" || state.path === "liberator",
        label: "섬 주민과 배의 일손을 연결한다", risk: "지역의 신뢰 +6 · 인연 +2",
        personality: { empathy: 6, loyalty: 3 },
        apply: (state) => {
          state.trust += 6; recordMeeting(state, key, 2, "neighbors", age, "연대"); state.people.lastBondAge = age;
          return "주민과 선원들의 일을 나누어 맡겼다. 누구의 도움을 기다리지 않아도 작은 문제가 풀렸다.";
        } },
      { id: "part", label: "서로의 판단을 존중하고 각자의 길로 간다", risk: "인연 -8 · 추가 보상 없음",
        personality: { freedom: 4, caution: 3 },
        apply: (state) => {
          recordMeeting(state, key, -8, "part", age, "각자의 길"); state.people.lastBondAge = age;
          return "더는 말을 잇지 않았다. 만남의 흔적을 일지에 남기고 자기 항로를 택했다.";
        } }
    ];
    return { ...base, id, urgent: true, art: person.art, canon: person.canon,
      title: person.name + "와 다시 마주한 날",
      body: scene + " " + memory + " " + role,
      choices: choices.filter((choice) => !choice.when || choice.when(life)) };
  }
  return null;
}
