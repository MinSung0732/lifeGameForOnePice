import { yearRoll } from "./world.js";

export function formatBounty(amount) {
  return `${Math.max(0, amount).toLocaleString("ko-KR")} 베리`;
}

export function pursuerFor(amount) {
  if (amount >= 1_000_000_000) return { name: "대장급 추적 부대", skill: 85, damage: 35 };
  if (amount >= 100_000_000) return { name: "해군 중장이 이끄는 추적대", skill: 70, damage: 25 };
  if (amount >= 10_000_000) return { name: "현상금 사냥꾼", skill: 55, damage: 20 };
  return { name: "지부 해군", skill: 40, damage: 15 };
}

export function bountyScene(life, age, base) {
  if (life.creationVersion < 4) return null;
  if (life.bounty > 0 && age - life.lastHuntAge >= 4 && yearRoll(life.seed ^ 0x2a1c407b, age) % 4 === 0) {
    const pursuer = pursuerFor(life.bounty);
    const title = `${life.location}의 ${pursuer.name}`;
    if (life.journal.slice(-10).some((entry) => entry.title === title)) return null;
    const mark = (state) => { state.lastHuntAge = age; };
    return { ...base, id: `life_bounty_hunt_${age}`, urgent: true, art: "lifeStorm", title,
      body: `${formatBounty(life.bounty)}짜리 수배서를 든 ${pursuer.name}이 부두로 왔다. 배와 동료가 있는 자리에서 도망칠 길, 맞설 곳, 숨길 사람을 재빨리 골라야 했다.`,
      choices: [
        { id: "escape", label: "동료와 함께 뒷항로로 빠져나간다", risk: "물자 -10 또는 건강 -10 · 추적을 피할 수 있을지는 미지수",
          personality: { caution: 6, loyalty: 4 }, apply: (state) => { mark(state); if (state.supplies >= 10) state.supplies -= 10; else state.health -= 10; return "배를 돌려 포위가 닫히기 전에 항구를 벗어났다."; } },
        { id: "stand", label: "동료를 물리고 추적대와 맞선다", needs: { skill: pursuer.skill, health: 35 },
          risk: `기술 ${pursuer.skill} · 건강 35 필요 · 열매나 패기가 변수`, failRisk: `건강 -${pursuer.damage} · 체포 위험`,
          personality: { ambition: 6, loyalty: 5, caution: -5 },
          fail: (state) => { mark(state); state.health -= pursuer.damage; if (state.health <= 0) { state.ending = "death"; state.deathCause = "현상금 추적대와의 충돌"; return "포위망을 뚫지 못했다. 동료가 이름을 기억하며 살아남았다."; } return "상처를 입고 동료의 도움으로 겨우 항구 밖으로 빠져나왔다."; },
          apply: (state) => { mark(state); state.health -= Math.max(5, Math.floor(pursuer.damage / 2)); state.skill += 5; return "추적대의 길을 막는 동안 동료들이 배를 빼냈다. 뒤쫓는 배의 깃발은 아직 보였다."; } },
        { id: "power", label: "열매의 힘이나 패기로 추적을 끊는다", when: (state) => Boolean(state.devilFruit || state.haki.observation || state.haki.armament),
          available: (state) => state.fruitMastery >= 2 || state.haki.observation > 0 || state.haki.armament > 0,
          risk: "열매 숙련 2 또는 패기 필요 · 건강 -10", personality: { ambition: 5, freedom: 5 },
          apply: (state) => { mark(state); state.health -= 10; return "능력으로 순간의 틈을 만들었다. 누구도 추적이 완전히 끝났다고 믿지는 않았다."; } }
      ] };
  }
  if (!["pirate", "liberator"].includes(life.path) || life.homebound) return null;
  const adult = life.birth.species === "거인족" ? 80 : 16;
  if (age < adult || age - (life.lastPublicActAge ?? -100) < 5 || yearRoll(life.seed ^ 0x53c71a42, age) % 5 !== 0) return null;
  if (life.journal.slice(-10).some((entry) => entry.title === "검문선 앞의 작은 배")) return null;
  const increase = life.creationVersion >= 5
    ? life.bounty >= 100_000_000 ? 350_000_000 : life.bounty >= 10_000_000 ? 60_000_000 : 8_000_000
    : life.bounty >= 100_000_000 ? 250_000_000 : life.bounty >= 10_000_000 ? 25_000_000 : 5_000_000;
  return { ...base, id: `life_bounty_act_${age}`, urgent: true, art: "deck", title: "검문선 앞의 작은 배",
    body: "군함이 작은 배의 명단을 요구했다. 그 배에는 쫓기는 사람이 타고 있었다. 배의 주인은 도움을 청했지만 무엇 때문에 쫓기는지는 말하지 않았다.",
    choices: [
      { id: "intervene", label: "검문선 사이로 배를 빼낸다", bounty: increase,
        risk: "기술 45가 항로 판단의 기준 · 수배 위험", needs: { skill: 45 }, failRisk: "건강 -15 · 수배 가능",
        personality: { empathy: 5, freedom: 7 },
        fail: (state) => { state.lastPublicActAge = age; state.health -= 15; return "검문선의 기척을 늦게 알아챘다. 동료들의 도움으로 배를 빼냈지만 이름이 기록됐다."; },
        apply: (state) => { state.lastPublicActAge = age; state.skill += 5; return "작은 배가 시야에서 사라졌다. 군함은 이쪽 배의 이름을 적었다."; } },
      { id: "witness", label: "먼저 쫓기는 이유를 확인한다", risk: "지역의 신뢰 +5 · 현상금 변화 없음",
        personality: { caution: 6, empathy: 3 }, apply: (state) => { state.lastPublicActAge = age; state.trust += 5; return "누구를 도와야 할지 알고 나서 항구의 다른 사람들과 방법을 찾았다."; } }
    ] };
}
