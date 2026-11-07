// Rule 26: an ordinary Loguetown childhood choice returns through ports, work, and later memory.
export function loguetownFollowUp(life, age, base) {
  if (life.creationVersion < 26 || life.birth.species !== "인간"
    || life.birth.home !== "이스트 블루 · 로그 타운"
    || !["learn", "help"].includes(life.loguetownSignal)
    || !life.path || life.retired || life.ending) return null;
  // shortcut: remote relay is possible at ports, not at isolated sky/elephant/giant settlements; revisit with a communication route model.
  if (["스카이피아", "신세계 · 조", "엘바프"].some((place) => life.location.includes(place))) return null;

  const learned = life.loguetownSignal === "learn";
  const atHome = life.location === life.birth.home;
  const seen = life.seen || [];
  if (age >= 19 && !seen.includes("life_loguetown_signal_offer")) {
    return { ...base, id: "life_loguetown_signal_offer", urgent: true, art: "childChart",
      title: "오래된 신호가 다시 울리다",
      body: `${atHome ? "로그 타운의 중계소에" : "지금 머무는 기항지의 전보벌레에"} 고향 상선의 연락이 닿았다. ${learned
        ? "어릴 때 네가 정리한 신호표를 다시 써 달라는 부탁이었다."
        : "어릴 때 네 안내등을 따라왔던 선장이 이번에도 안전한 길을 찾고 있었다."} ${life.path === "marine"
        ? "해군 지부는 수배선과 상선을 구별할 근거를 원했다."
        : life.path === "pirate" ? "해군의 검문이 거세져 상선은 해적과 한편으로 보일까 걱정했다."
          : "항구 사람들은 해군 검문과 생업 사이에서 곤란해했다."}`,
      choices: [
        { id: "decode", when: () => learned, available: (state) => state.skill >= 30,
          label: "어린 날의 신호표를 다시 해독한다", risk: "기술 30 필요 · 신호 기록을 맡음",
          personality: { caution: 5, loyalty: 3 },
          apply: (state) => { state.skill += 5; state.loguetownYouth = "decoded"; state.loguetownYouthAge = age;
            return "잘못 옮겨 적힌 부호를 고쳤다. 상선은 출항 시간을 확인했고, 사본은 다음 항구에도 전해졌다."; } },
        { id: "guide", when: () => !learned, available: (state) => state.trust >= 35,
          label: "옛 선장의 연락망에 안내등 정보를 보낸다", risk: "지역의 신뢰 35 필요 · 연락망을 이어 감",
          personality: { empathy: 5, loyalty: 4 },
          apply: (state) => { state.friendBond += 5; state.loguetownYouth = "guided"; state.loguetownYouthAge = age;
            return "옛 선장은 전보 너머로 네 이름을 알아들었다. 안전한 항로 정보는 다른 상선에도 나누기로 했다."; } },
        { id: "report", when: (state) => state.path === "marine",
          label: "지부에 신호 혼선의 원인을 보고한다", risk: "지역의 신뢰 +5 · 지부 기록에 보고",
          personality: { caution: 4, loyalty: 5 },
          apply: (state) => { state.trust += 5; state.loguetownYouth = "reported"; state.loguetownYouthAge = age;
            return "수병이 네 기록을 정식 보고서에 첨부했다. 선장의 말과 군의 문서가 서로 다른 점도 남겼다."; } },
        { id: "warn", when: (state) => state.path === "pirate", cost: 5,
          label: "동료들과 상선에 검문 위험을 알린다", risk: "물자 -5 · 해군 검문에 연루될 수 있음",
          personality: { freedom: 5, loyalty: 4 },
          apply: (state) => { state.supplies -= 5; state.loguetownYouth = "warned"; state.loguetownYouthAge = age;
            return "동료와 보급품을 나누며 검문을 피할 시간을 알려 줬다. 선장은 해적의 말도 무조건 거짓은 아니라고 했다."; } },
        { id: "supply", when: (state) => state.path === "civilian" || state.path === "liberator", cost: 5,
          label: "중계소와 상선에 필요한 물자를 보낸다", risk: "물자 -5 · 지역의 신뢰 +5",
          personality: { empathy: 5, caution: 3 },
          apply: (state) => { state.supplies -= 5; state.trust += 5; state.loguetownYouth = "supplied"; state.loguetownYouthAge = age;
            return "상선은 급한 수리를 마치고 출항했다. 중계소는 연락이 끊기지 않도록 예비 먹이를 챙겼다."; } },
        { id: "decline", label: "지금 맡은 일을 우선하고 답장을 미룬다", risk: "현재 소속 유지 · 물자 +5",
          personality: { caution: 4 },
          apply: (state) => { state.supplies += 5; state.loguetownYouth = "declined"; state.loguetownYouthAge = age;
            return "급한 일부터 마쳤다. 회신하지 못한 고향의 전보가 일지 한쪽에 남았다."; } }
      ] };
  }

  if (seen.includes("life_loguetown_signal_offer")
    && age >= Math.max(28, (life.loguetownYouthAge ?? 19) + 5)
    && !seen.includes("life_loguetown_false_order")) {
    return { ...base, id: "life_loguetown_false_order", urgent: true, art: "harborBountyInspection",
      title: "두 장의 수배서와 한 통의 구조 신호",
      body: `${atHome ? "로그 타운 항구에서" : "기항지의 중계소에서"} 가짜 봉쇄 명령이 상선의 구조 신호와 뒤섞였다. ${learned
        ? "어린 시절 네가 정리한 부호와 대조하면 출처를 가릴 수 있을 듯했다."
        : "어린 시절 네가 도왔던 상선의 선장이 무고한 선원들이 잡힐까 걱정했다."} ${
          life.loguetownYouth === "declined" ? "지난번 답장을 미뤘기에 확인할 자료도 적었다."
            : "몇 해 전 네가 남긴 연락의 흔적이 아직 있었다."}`,
      choices: [
        { id: "unmask", when: () => learned, available: (state) => state.skill >= 40,
          label: "원본 부호와 수배서 번호를 대조한다", risk: "기술 40 필요 · 가짜 명령을 밝혀냄",
          personality: { caution: 6, empathy: 3 },
          apply: (state) => { state.skill += 5; state.trust += 10; state.loguetownCrisis = "exposed"; state.loguetownCrisisAge = age;
            return "발신 번호가 다른 수배서 한 장을 찾아냈다. 해군은 무고한 선원을 풀어 줬고, 진짜 구조 신호가 다시 전해졌다."; } },
        { id: "escort", when: () => !learned, cost: 10,
          label: "상선을 위한 안내등과 피난선을 마련한다", risk: "물자 -10 · 지역의 신뢰 +10",
          personality: { empathy: 6, loyalty: 5 },
          apply: (state) => { state.supplies -= 10; state.trust += 10; state.loguetownCrisis = "rescued"; state.loguetownCrisisAge = age;
            return "바다 쪽으로 안내등을 옮겨 승객들이 먼저 빠져나왔다. 검문의 옳고 그름은 해군에게 남기되 사람을 먼저 구했다."; } },
        { id: "audit", when: (state) => state.path === "marine",
          label: "지부에 검문 중단과 재조사를 요청한다", risk: "지역의 신뢰 +5 · 지부에 이의 기록",
          personality: { caution: 5, loyalty: 3 },
          apply: (state) => { state.trust += 5; state.loguetownCrisis = "reviewed"; state.loguetownCrisisAge = age;
            return "상관에게 발신 기록을 내밀었다. 잘못된 수배서는 회수됐고 검문은 확인 뒤에 재개됐다."; } },
        { id: "shelter", when: (state) => state.path === "pirate", cost: 10,
          label: "검문을 피해 민간선의 승객들을 대피시킨다", risk: "물자 -10 · 지역의 신뢰 +5 · 해군과 충돌 위험",
          personality: { freedom: 5, empathy: 5 },
          apply: (state) => { state.supplies -= 10; state.trust += 5; state.loguetownCrisis = "sheltered"; state.loguetownCrisisAge = age;
            return "동료들이 배를 가려 준 사이 승객들이 안전한 부두에 닿았다. 검문을 피해 빠졌지만 억울한 선원은 남겨 두지 않았다."; } },
        { id: "repair", when: (state) => state.path === "civilian" || state.path === "liberator", cost: 10,
          label: "파손된 중계소를 고쳐 구조 신호를 되살린다", risk: "물자 -10 · 지역의 신뢰 +10",
          personality: { empathy: 5, caution: 4 },
          apply: (state) => { state.supplies -= 10; state.trust += 10; state.loguetownCrisis = "restored"; state.loguetownCrisisAge = age;
            return "해군과 상선이 동시에 들을 수 있게 전보벌레의 접속을 고쳤다. 더 이상 가짜 명령이 진짜 구조 신호를 가리지 않았다."; } },
        { id: "withdraw", label: "수배서의 진위를 단정하지 않고 물러난다", risk: "현장 이탈 · 물자 +5",
          personality: { caution: 5 },
          apply: (state) => { state.supplies += 5; state.loguetownCrisis = "unresolved"; state.loguetownCrisisAge = age;
            return "섣불리 누군가를 고발하지 않았다. 구조는 다른 이들에게 맡겼지만 연락망에 남은 혼선은 오래 마음에 걸렸다."; } }
      ] };
  }

  if (seen.includes("life_loguetown_false_order")
    && age >= Math.max(38, (life.loguetownCrisisAge ?? 28) + 7)
    && !seen.includes("life_loguetown_last_signal")) {
    const helped = ["exposed", "rescued", "reviewed", "sheltered", "restored"].includes(life.loguetownCrisis);
    return { ...base, id: "life_loguetown_last_signal", urgent: true, art: "harborReunion",
      title: "고향의 마지막 연락",
      body: `${atHome ? "로그 타운의 오래된 중계소로" : "먼 항구에 놓인 전보벌레로"} 다시 소식이 전해졌다. ${learned
        ? "어릴 적 네가 적어 둔 신호표가 바랜 종이로 남아 있었다."
        : "어릴 적 너를 기억한 상선의 항해 일지가 남아 있었다."} ${helped
          ? "그 뒤에 도왔던 사람들은 새로운 선원에게 그날의 일을 가르치고 있었다."
          : "지난 혼선은 다른 이들이 수습했지만 몇 사람은 아직 그날을 묻고 있었다."}`,
      choices: [
        { id: "teach", label: "다음 세대에게 신호 읽는 법을 가르친다", risk: "기술 +5 · 친구와의 유대 +5",
          personality: { loyalty: 5, empathy: 4 },
          apply: (state) => { state.skill += 5; state.friendBond += 5; state.loguetownLegacy = "taught";
            return "누구든 위급한 목소리를 먼저 들을 수 있도록 배운 것을 나눴다. 네가 떠나도 항구에 그 방법은 남았다."; } },
        { id: "archive", cost: 10, label: "잘못된 수배서와 진짜 기록을 함께 보관한다", risk: "물자 -10 · 지역의 신뢰 +10",
          personality: { caution: 5, loyalty: 4 },
          apply: (state) => { state.supplies -= 10; state.trust += 10; state.loguetownLegacy = "archived";
            return "좋았던 일만 남기지 않고 실수와 그 뒤의 선택도 적었다. 다음 검문 때 같은 억울함이 생기지 않도록 했다."; } },
        { id: "release", label: "그 일을 마음에 남기고 자신의 항해를 이어 간다", risk: "앞선 삶을 기록 · 추가 능력치 변화 없음",
          personality: { freedom: 4 },
          apply: (state) => { state.loguetownLegacy = "released";
            return "전보벌레는 조용해졌다. 어린 날의 선택은 바다의 다른 사람들을 거쳐 이제 너의 기억 한쪽에 자리했다."; } }
      ] };
  }
  return null;
}
