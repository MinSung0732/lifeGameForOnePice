// Rule 28: four career-specific choices and two remembered consequences; no new event engine.
function noteDuty(state, path, choice, age) {
  state.people.affiliationChapters ||= {};
  state.people.affiliationChapters[path] = { choice, age, place: state.location, affiliation: state.affiliation };
}
function coherentDuty(life) {
  const name = life.affiliation || "";
  if (life.path === "marine") return name.includes("해군");
  if (name.includes("해군")) return false;
  if (life.path !== "pirate" && /해적단|해적 선단/.test(name)) return false;
  if (life.path === "pirate" && /민간 조합|해방망|혁명군|고향 마을/.test(name)) return false;
  if (life.path === "civilian" && /해방망|혁명군/.test(name)) return false;
  return true;
}
export function affiliationChapter(life, age, base, before) {
  if (life.creationVersion < 28 || !life.path || life.ending || life.retired) return null;
  const previous = life.people?.affiliationChapters || {};
  // shortcut: letters do not reach isolated locations until navigation includes a postal-route model.
  const hasMail = !["스카이피아", "엘바프", "하치노스", "아마존 릴리 외해"].some((place) => life.location?.includes(place));
  if (hasMail && previous.marine && life.seen.includes("life_path_marine_choice")
    && !life.seen.includes("life_path_marine_after") && age >= previous.marine.age + 3) {
    const old = previous.marine.choice;
    const stillMarine = life.path === "marine" && coherentDuty(life);
    const start = stillMarine ? "해군 지부에서 오래된 검문의 후속 기록을 보냈다." : "기항한 상선이 과거 해군 지부의 공개 정정 소식을 전해 주었다.";
    const trace = old === "obey" ? "명령에 따라 억류됐던 선원들이 잘못된 수배서의 정정을 요구하고 있었다."
      : old === "inspect" ? "네가 찾아낸 수배서 번호의 오류가 다른 지부의 명단에서도 발견됐다."
        : "승객을 대피시킨 이유와 상관이 남긴 경고장이 장부에 함께 적혀 있었다.";
    const choices = [
      { id: "correct", when: () => stillMarine && old === "obey", cost: 5,
        label: "이전 억류 기록을 정정한다", risk: "물자 -5 · 지역 신뢰 +8 · 조직 평판 -4",
        personality: { empathy: 5 }, apply: (s) => { s.supplies -= 5; s.trust += 8; s.reputation = (s.reputation || 0) - 4;
          s.people.affiliationChapters.marine.after = "correct"; return "선원들의 기록을 바로잡았지만 네 이름에도 책임이 돌아왔다."; } },
      { id: "share", when: () => stillMarine && old === "inspect", cost: 5,
        label: "수배서 대조법을 후배 수병에게 전한다", risk: "물자 -5 · 기술 +5 · 지역 신뢰 +5",
        personality: { caution: 5 }, apply: (s) => { s.supplies -= 5; s.skill += 5; s.trust += 5;
          s.people.affiliationChapters.marine.after = "share"; return "후배가 수배서를 다시 확인하는 법을 배웠다. 작은 기록이 같은 실수를 막았다."; } },
      { id: "testify", when: () => stillMarine && old === "evacuate",
        label: "구조 증언과 경고장을 함께 제출한다", risk: "지역 신뢰 +8 · 조직 평판 -5",
        personality: { loyalty: 5 }, apply: (s) => { s.trust += 8; s.reputation = (s.reputation || 0) - 5;
          s.people.affiliationChapters.marine.after = "testify"; return "경고가 사라지지는 않았지만 부하들에게 그날의 이유가 전해졌다."; } },
      { id: "reply", when: () => !stillMarine, cost: 5,
        label: "현재 일터에서 사실관계를 전한다", risk: "물자 -5 · 지역 신뢰 +5",
        personality: { empathy: 4 }, apply: (s) => { s.supplies -= 5; s.trust += 5;
          s.people.affiliationChapters.marine.after = "reply"; return "이제 해군의 명령을 받지 않지만 아는 사실을 전했다. 그 뒤의 판단은 지부의 몫이다."; } },
      { id: "close", label: "지금 맡은 일을 우선한다", risk: "기술 +3 · 과거 판단은 남음",
        personality: { caution: 4 }, apply: (s) => { s.skill += 3; s.people.affiliationChapters.marine.after = "close";
          return "과거를 없던 일로 만들 수는 없었다. 같은 일이 생기면 어떻게 할지 적어 두었다."; } }
    ];
    return { ...base, id: "life_path_marine_after", urgent: true, art: "workbenchReportLetters",
      title: "늦게 도착한 지부의 장부",
      body: start + " " + trace + " 지금 소속이 달라도 그날의 선택은 네 인생에서 사라지지 않았다.",
      choices: choices.filter((c) => !c.when || c.when(life)) };
  }
  if (hasMail && previous.civilian && life.seen.includes("life_path_civilian_choice")
    && !life.seen.includes("life_path_civilian_after") && age >= previous.civilian.age + 3) {
    const old = previous.civilian.choice;
    const stillCivilian = life.path === "civilian" && coherentDuty(life);
    const prefix = stillCivilian && life.location === previous.civilian.place
      ? "옛 작업장의 후배가 항구 장부를 들고 찾아왔다."
      : "기항한 상선이 옛 작업장 후배의 편지를 가져왔다.";
    const memory = old === "rebuild" ? "네가 보수한 부두에 새 배가 늘었지만 일손이 모자랐다."
      : old === "contract" ? "큰 계약은 끝났지만 아직 고치지 못한 어선이 남았다."
        : "네가 조사한 새 항로에 배가 늘면서 위험한 물때도 드러났다.";
    const choices = [
      { id: "teach", when: () => stillCivilian && old === "rebuild",
        label: "후배에게 수리 장부를 맡긴다", risk: "친구 유대 +8 · 기술 +3",
        personality: { loyalty: 5 }, apply: (s) => { s.friendBond += 8; s.skill += 3;
          s.people.affiliationChapters.civilian.after = "teach";
          return "후배가 스스로 수리할 곳을 찾았다. 이제 일터에는 네가 없어도 배를 고칠 사람이 있었다."; } },
      { id: "send", cost: 10, label: "현 일터에서 자재와 조언을 보내 준다",
        risk: "물자 -10 · 지역 신뢰 +8", personality: { empathy: 6 },
        apply: (s) => { s.supplies -= 10; s.trust += 8; s.people.affiliationChapters.civilian.after = "send";
          return "멀리서 자재를 보탰다. 답장에는 그 물건으로 고친 배의 이름이 적혔다."; } },
      { id: "chart", when: () => old === "explore", label: "새 항로의 위험한 물때도 적어 보낸다",
        risk: "기술 +5 · 항해 기록 보완", personality: { caution: 6 },
        apply: (s) => { s.skill += 5; s.people.affiliationChapters.civilian.after = "chart";
          return "빠른 길만이 아니라 멈춰야 할 때도 적었다. 항해 여부는 이제 다른 선원들이 판단할 수 있다."; } },
      { id: "stay", label: "답장을 남기고 지금의 일을 이어 간다",
        risk: "물자 +3 · 현재 소속 유지", personality: { freedom: 4 },
        apply: (s) => { s.supplies += 3; s.people.affiliationChapters.civilian.after = "stay";
          return "지난 일터를 떠났어도 그 시절을 부정하지 않았다. 새로운 일에 다시 손을 댔다."; } }
    ];
    return { ...base, id: "life_path_civilian_after", urgent: true, art: "workbenchNegotiation",
      title: "돌아온 일터의 편지",
      body: prefix + " " + memory + " 후배들은 자기 방식으로 그날의 선택을 이어 가고 있었다.",
      choices: choices.filter((c) => !c.when || c.when(life)) };
  }
  if (!coherentDuty(life) || !Number.isFinite(life.careerStartAge)
    || age < Math.max(life.birth.species === "거인족" ? 120 : 24, life.careerStartAge + 3)) return null;
  const path = life.path, id = "life_path_" + path + "_choice";
  if (life.seen.includes(id)) return null;
  if (path === "pirate" && life.leftHome && !life.homebound) return {
    ...base, id, urgent: true, art: "deckTenseStandoff", title: "노획물보다 늦은 구조 신호",
    body: "노획한 물자를 싣고 떠나려는 순간 작은 상선이 구조 신호를 보냈다. 선장은 수익 없는 구출은 피하자고 했지만 동료는 부상자를 보며 망설였다. 네가 선장이든 선원이든 판단의 대가는 배 전체가 나누게 된다.",
    choices: [
      { id: "profit", label: "노획물을 지키고 정한 항로로 간다", risk: "물자 +12 · 동료 유대 -6 · 지역 신뢰 -5",
        personality: { ambition: 5 }, apply: (s) => { s.supplies += 12; s.friendBond -= 6; s.trust -= 5;
          noteDuty(s, path, "profit", age); return "물자는 지켰지만 구조 신호를 본 동료는 다음 당직에도 말이 없었다."; } },
      { id: "negotiate", cost: 5, label: "동료와 구조 범위를 의논해 신호를 보낸다",
        risk: "물자 -5 · 기술 +5 · 동료 유대 +3", personality: { caution: 5 },
        apply: (s) => { s.supplies -= 5; s.skill += 5; s.friendBond += 3; noteDuty(s, path, "negotiate", age);
          return "구조 신호를 이웃 배에도 전했다. 모든 사람을 도울 수 없다는 사실은 마음에 남았다."; } },
      { id: "rescue", cost: 12, label: "전리품을 내려놓고 부상자부터 구조한다",
        risk: "물자 -12 · 동료 유대 +7 · 지역 신뢰 +6", personality: { empathy: 7 },
        apply: (s) => { s.supplies -= 12; s.friendBond += 7; s.trust += 6; noteDuty(s, path, "rescue", age);
          return "부상자는 살았지만 전리품 일부를 잃었다. 돌아가는 배에서 동료들과 그 결정을 다시 이야기했다."; } }
    ] };
  if (path === "marine" && !life.homebound) return {
    ...base, id, urgent: true, art: "workbenchReportLetters", title: "번호가 다른 수배서",
    body: "해군 지부는 수배서와 이름이 비슷한 상선을 억류하라고 명령했다. 선장은 화물 장부를 내밀며 승객을 먼저 내려 달라고 부탁했다. 빨리 끝내면 포상을 받을 수 있지만 수배서가 잘못되었을 가능성도 있었다.",
    choices: [
      { id: "obey", label: "상관의 지시대로 선원들을 우선 억류한다",
        risk: "물자 +8 · 지역 신뢰 -8 · 조직 평판 +3", personality: { loyalty: 6 },
        apply: (s) => { s.supplies += 8; s.trust -= 8; s.reputation = (s.reputation || 0) + 3;
          noteDuty(s, path, "obey", age); return "보고서는 끝났지만 상선의 가족들이 항구에 남았다. 사정을 듣지 않았다는 비판도 나왔다."; } },
      { id: "inspect", cost: 5, label: "수배서 번호와 선적 장부를 직접 대조한다",
        risk: "물자 -5 · 기술 +5 · 조직 평판 -3", personality: { caution: 7 },
        apply: (s) => { s.supplies -= 5; s.skill += 5; s.reputation = (s.reputation || 0) - 3;
          noteDuty(s, path, "inspect", age); return "수배서 숫자가 맞지 않았다. 조사가 늦어졌다는 질책을 받았지만 억울한 체포는 막았다."; } },
      { id: "evacuate", cost: 12, label: "승객을 내리고 억류 명령을 다시 확인한다",
        risk: "물자 -12 · 지역 신뢰 +10 · 조직 평판 -6", personality: { empathy: 7 },
        apply: (s) => { s.supplies -= 12; s.trust += 10; s.reputation = (s.reputation || 0) - 6;
          noteDuty(s, path, "evacuate", age); return "승객들은 안전하게 내렸지만 지휘 계통을 어겼다는 경고장이 남았다. 부하들도 이유를 알았다."; } }
    ] };
  if (path === "liberator") {
    const group = life.affiliation === "혁명군" && before <= 22
      ? "혁명군의 현장 연락소" : "지역의 독립 구호 연락망";
    return { ...base, id, urgent: true, art: "workbenchNegotiation", title: "불빛을 끌 수 없는 은신처",
      body: group + "에 피난을 기다리는 가족이 도착했다. 임무 편지는 아직 전달되지 않았고 이동 경로가 드러나면 다른 은신처도 위험해진다. 동료들은 작전을 지키자고 했지만 주민들은 문을 열어 달라고 부탁했다.",
      choices: [
        { id: "secret", label: "연락책을 숨기고 계획부터 완수한다",
          risk: "물자 +8 · 지역 신뢰 -8 · 연락망 유지", personality: { caution: 6 },
          apply: (s) => { s.supplies += 8; s.trust -= 8; noteDuty(s, path, "secret", age);
            return "연락책은 무사했지만 가족들은 밤을 밖에서 보내야 했다."; } },
        { id: "consult", label: "주민과 위험을 공유해 탈출 순서를 정한다",
          risk: "기술 +5 · 지역 신뢰 +4 · 준비 지연", personality: { empathy: 5 },
          apply: (s) => { s.skill += 5; s.trust += 4; noteDuty(s, path, "consult", age);
            return "주민들은 직접 탈출 순서를 골랐다. 준비는 늦어졌지만 모두가 그 결정에 참여했다."; } },
        { id: "evacuate", cost: 12, label: "작전을 미루고 피난 가족부터 내보낸다",
          risk: "물자 -12 · 지역 신뢰 +9 · 연락망 노출 위험", personality: { freedom: 5 },
          apply: (s) => { s.supplies -= 12; s.trust += 9; s.reputation = (s.reputation || 0) - 3;
            noteDuty(s, path, "evacuate", age); return "가족들은 떠났지만 연락망 한 곳이 알려졌다. 동료들은 새 은신처를 찾아야 했다."; } }
    ] };
  }
  if (path === "civilian") return {
    ...base, id, urgent: true, art: "workbench", title: "수리할 배와 돌아갈 일터",
    body: (life.homebound ? "고향" : "기항지") + "의 부두가 폭풍에 무너졌다. 돈을 낸 상선부터 고치면 일터를 지킬 수 있지만 작은 어선은 출항하지 못한다. 새 항로를 찾으면 수입이 늘 수도 있으나 위험한 물때를 확인할 사람이 필요했다.",
    choices: [
      { id: "contract", label: "계약한 큰 상선부터 수리한다",
        risk: "물자 +12 · 지역 신뢰 -7", personality: { caution: 5 },
        apply: (s) => { s.supplies += 12; s.trust -= 7; noteDuty(s, path, "contract", age);
          return "임금은 지켰지만 작은 어선의 선주들은 다음 물때까지 기다려야 했다."; } },
      { id: "rebuild", cost: 10, label: "작은 어선과 공동 부두부터 보수한다",
        risk: "물자 -10 · 지역 신뢰 +8 · 친구 유대 +5", personality: { loyalty: 5 },
        apply: (s) => { s.supplies -= 10; s.trust += 8; s.friendBond += 5; noteDuty(s, path, "rebuild", age);
          return "수익은 줄었지만 어선들이 다시 출항했다. 후배는 고친 널빤지를 오래 기억했다."; } },
      { id: "explore", label: "위험을 기록하며 우회 항로를 조사한다",
        risk: "기술 +8 · 건강 -6 · 항로 정보 확보", personality: { freedom: 6 },
        apply: (s) => { s.skill += 8; s.health -= 6; noteDuty(s, path, "explore", age);
          return "새 물길을 찾았지만 다리에 상처가 남았다. 아직 안전한 항로라고 단정할 수는 없었다."; } }
    ] };
  return null;
}
