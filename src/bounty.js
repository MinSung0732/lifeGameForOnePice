import { isNewWorld, yearRoll } from "./world.js";

export function formatBounty(amount) {
  return `${Math.max(0, amount).toLocaleString("ko-KR")} 베리`;
}


// Routine rescues build a reputation gradually; an emperor-level act still has its own reward.
export function balancedPublicBounty(life) {
  const amount = life.bounty || 0;
  const base = amount < 10_000_000 ? 4_000_000
    : amount < 100_000_000 ? 8_000_000
      : amount < 300_000_000 ? 15_000_000
        : amount < 1_000_000_000 ? 20_000_000 : 5_000_000;
  const alreadyAttempted = (life.journal || []).filter((entry) =>
    entry.id.startsWith("life_bounty_act_") && entry.choice === "검문선 사이로 배를 빼낸다").length;
  const leadership = life.independent ? 1.15 : 1;
  const rep = life.reputation || 0;
  const notoriety = rep < 0 ? Math.min(1.2, 1 + Math.abs(rep) / 400)
    : Math.max(0.85, 1 - rep / 1000);
  const repeat = Math.max(0.5, 1 - alreadyAttempted * 0.15);
  return Math.min(30_000_000, Math.max(1_000_000,
    Math.round(base * leadership * notoriety * repeat / 1_000_000) * 1_000_000));
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
    return { ...base, id: `life_bounty_hunt_${age}`, urgent: true, art: "specialBountyPursuit", title,
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
  const [gap, odds] = life.creationVersion >= 11 ? [3, 3] : [5, 5];
  if (age < adult || age - (life.lastPublicActAge ?? -100) < gap || yearRoll(life.seed ^ 0x53c71a42, age) % odds !== 0) return null;
  if (life.journal.slice(-10).some((entry) => entry.title === "검문선 앞의 작은 배")) return null;
  const captain = life.creationVersion >= 11 && life.independent ? 1.5 : 1;
  const rep = life.reputation || 0;
  const repFactor = life.creationVersion >= 20
    ? rep < 0
      ? 1 + Math.min(1.5, (Math.abs(rep) / 100) * 1.5)
      : Math.max(0.6, 1 - (rep / 100) * 0.4)
    : 1;
  const increase = life.creationVersion >= 36 ? balancedPublicBounty(life)
    : Math.round(captain * (life.creationVersion >= 5
      ? life.bounty >= 100_000_000 ? 350_000_000 : life.bounty >= 10_000_000 ? life.creationVersion >= 11 ? 90_000_000 : 60_000_000 : life.creationVersion >= 11 ? 12_000_000 : 8_000_000
      : life.bounty >= 100_000_000 ? 250_000_000 : life.bounty >= 10_000_000 ? 25_000_000 : 5_000_000) * repFactor);
  return { ...base, id: `life_bounty_act_${age}`, urgent: true, art: (life) => life?.creationVersion >= 20 ? "harborBountyInspection" : "deck", title: "검문선 앞의 작은 배",
    body: "군함이 작은 배의 명단을 요구했다. 그 배에는 쫓기는 사람이 타고 있었다. 배의 주인은 도움을 청했지만 무엇 때문에 쫓기는지는 말하지 않았다.",
    choices: [
      { id: "intervene", label: "검문선 사이로 배를 빼낸다", bounty: increase,
        ...(life.creationVersion >= 36 ? { bountyOnFail: 1_000_000 } : {}),
        risk: life.creationVersion >= 36
          ? `기술 45가 항로 판단의 기준 · 성공 시 현상금 +${formatBounty(increase)} · 실패 시 목격 수배 +${formatBounty(1_000_000)}`
          : "기술 45가 항로 판단의 기준 · 수배 위험",
        needs: { skill: 45 }, failRisk: "건강 -15 · 수배 가능",
        personality: { empathy: 5, freedom: 7 },
        fail: (state) => { state.lastPublicActAge = age; state.health -= 15; if (state.creationVersion >= 20) state.reputation = (state.reputation || 0) - 10; return "검문선의 기척을 늦게 알아챘다. 동료들의 도움으로 배를 빼냈지만 이름이 기록됐다."; },
        apply: (state) => { state.lastPublicActAge = age; state.skill += 5; if (state.creationVersion >= 20) state.reputation = (state.reputation || 0) - 10; return "작은 배가 시야에서 사라졌다. 군함은 이쪽 배의 이름을 적었다."; } },
      { id: "witness", label: "먼저 쫓기는 이유를 확인한다", risk: "지역의 신뢰 +5 · 현상금 변화 없음",
        personality: { caution: 6, empathy: 3 }, apply: (state) => { state.lastPublicActAge = age; state.trust += 5; if (state.creationVersion >= 20) state.reputation = (state.reputation || 0) + 5; return "누구를 도와야 할지 알고 나서 항구의 다른 사람들과 방법을 찾았다."; } }
    ] };
}

export function marinePatrolScene(life, age, base) {
  if (life.creationVersion < 20 || life.path !== "marine" || life.homebound || life.ending) return null;
  const adult = life.birth.species === "거인족" ? 80 : 16;
  const gap = life.birth.species === "거인족" ? 15 : 4;
  if (age < adult || age - (life.lastMarinePatrolAge ?? -100) < gap || yearRoll(life.seed ^ 0x61a84f23, age) % 3 !== 0) return null;
  if (life.journal.slice(-10).some((entry) => entry.id.startsWith("life_marine_patrol_") || entry.title?.includes("초계 작전"))) return null;

  const inNW = isNewWorld(life.location);
  const pirateBounty = inNW
    ? 120_000_000 + (yearRoll(life.seed ^ 0x3f12, age) % 15) * 10_000_000
    : age >= (life.birth.species === "거인족" ? 110 : 22)
      ? 25_000_000 + (yearRoll(life.seed ^ 0x3f12, age) % 10) * 5_000_000
      : 5_000_000 + (yearRoll(life.seed ^ 0x3f12, age) % 6) * 2_000_000;

  const targetName = inNW ? "신세계 약탈 선단" : pirateBounty >= 30_000_000 ? "이름난 해적선" : "근해 해적선";
  const mark = (state) => { state.lastMarinePatrolAge = age; };

  return {
    ...base,
    id: `life_marine_patrol_${age}`,
    urgent: true,
    art: "deck",
    title: `${targetName} 발견과 초계 작전`,
    body: `관할 해역 순찰 중 수배서가 발부된 ${targetName}(현상금 ${formatBounty(pirateBounty)})을 발견했다. 군함의 포문을 열고 접근할지, 증원을 기다릴지 판단해야 했다.`,
    choices: [
      {
        id: "board_arrest",
        label: "군함을 이끌고 돌입해 선장을 직접 나포한다",
        needs: { skill: inNW ? 65 : pirateBounty >= 30_000_000 ? 50 : 35, health: 40 },
        risk: `기술 ${inNW ? 65 : pirateBounty >= 30_000_000 ? 50 : 35} · 건강 40 필요 · 해적 체포 및 명성 대폭 상승`,
        failRisk: "건강 -20 · 나포 실패",
        personality: { ambition: 6, loyalty: 7 },
        fail: (state) => {
          mark(state);
          state.health -= 20;
          return "해적선의 거센 저항에 부딪혀 부상자가 발생했다. 해적선은 안개 속으로 도주했다.";
        },
        apply: (state) => {
          mark(state);
          state.arrestCount = (state.arrestCount || 0) + 1;
          state.arrestBounty = (state.arrestBounty || 0) + pirateBounty;
          state.reputation = (state.reputation || 0) + 12;
          state.trust = (state.trust || 0) + 5;
          return `${formatBounty(pirateBounty)}의 현상범을 제압해 군함 영창에 수감했다. 본부에 체포 보고가 전해졌다.`;
        }
      },
      {
        id: "coordinate_flank",
        label: "안전하게 포위망을 형성하고 퇴로를 봉쇄한다",
        risk: "안전함 · 동료 함선과 합동 나포 실적 공유",
        personality: { caution: 7, loyalty: 5 },
        apply: (state) => {
          mark(state);
          const share = Math.round(pirateBounty * 0.6);
          state.arrestCount = (state.arrestCount || 0) + 1;
          state.arrestBounty = (state.arrestBounty || 0) + share;
          state.reputation = (state.reputation || 0) + 6;
          return `인근 함선들과 협력하여 해적선을 완벽히 포위 나포했다. ${formatBounty(share)} 상당의 수감 실적이 인정됐다.`;
        }
      },
      {
        id: "overlook_bribe",
        label: "밀수품 일부를 몰수하고 다른 항로로 선회한다",
        risk: "물자 +25 · 악명 증가 (감찰 위험)",
        personality: { caution: -5, ambition: -4 },
        apply: (state) => {
          mark(state);
          state.supplies += 25;
          state.reputation = (state.reputation || 0) - 15;
          return "해적선으로부터 물자를 넘겨받고 눈감아 주었다. 부두에 의혹 섞인 소문이 퍼졌다.";
        }
      }
    ]
  };
}
