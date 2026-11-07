import { yearRoll } from "./world.js";
import { rosterFor } from "./canon-crews.js";
import { canonRelationshipEntries } from "./canon-relationships.js";

// Display-only roster of the people around the protagonist. It is derived from the life's
// seed, affiliation, rank and bounty, so it needs no saved state and old saves show it too.
// shortcut: members are named stand-ins, not characters with their own events; give them state when crew events are added.
const NAMES = ["카일", "미르", "토빈", "에런", "실라", "보르", "하딘", "벤", "테사", "마로", "케인", "리사",
  "도로", "유안", "시엘", "파코", "레노", "이사", "타로", "누미", "고든", "라일", "에피", "소냐"];
const PIRATE_ROLES = ["항해사", "요리사", "저격수", "선의", "조선공", "갑판장", "음악가"];
const CREW_TITLES = ["붉은 닻", "갈매기 이빨", "검은 파도", "황금 물고기", "바람 개", "늙은 고래"];

function pick(life, salt, list, taken = []) {
  const free = list.filter((item) => !taken.includes(item));
  return free[yearRoll(life.seed ^ salt, life.careerStartAge ?? 0) % free.length];
}

export function crewFor(life) {
  const mate = life.people?.mate;
  const members = [];
  const names = [];
  const add = (role, salt) => {
    const name = pick(life, salt, NAMES, [...names, mate?.name]);
    names.push(name);
    members.push({ name, role });
  };
  // Rule 31: an old companion is not necessarily aboard after changing careers.
  if (mate?.fate === "곁" && (life.creationVersion < 31
    || mate.together && mate.path === life.path && !life.retired && !life.homebound))
    members.push({ name: mate.name, role: mate.together ? "어릴 적 친구 · 동료" : "소꿉친구 · 동행 전" });
  if (!life.path) return members;
  if (life.homebound) { add("이웃", 0x11); add("작업 동료", 0x12); return members; }
  // Rule 15: a named crew or organization shows its canon people of the era instead of stand-ins.
  const canon = life.creationVersion >= 15 ? rosterFor(life, life.canonCrew === "밀짚모자 일당" ? 10 : 2 + Math.min(2, life.rankTier)) : [];
  if (canon.length && (life.canonCrew || life.affiliation === "혁명군")) {
    members.push(...canon.map((person) => ({ name: person.name, role: person.role })));
    if (life.canonCrew !== "밀짚모자 일당") add(life.path === "pirate" ? pick(life, 0x22, PIRATE_ROLES) : "현장 요원", 0x31);
    return members;
  }
  if (canon.length && life.path === "marine") members.push(...canon.map((person) => ({ name: person.name, role: person.role })));
  if (life.path === "pirate") {
    if (life.independent) {
      const size = life.bounty >= 100_000_000 ? 4 : life.bounty >= 10_000_000 ? 3 : 2;
      for (let i = 0; i < size; i += 1) add(pick(life, 0x20 + i, PIRATE_ROLES, members.map((m) => m.role)), 0x30 + i);
      // A famous captain gathers allied crews that sail under the same flag.
      const fleets = life.bounty >= 1_000_000_000 ? 3 : life.bounty >= 100_000_000 ? 1 : 0;
      for (let i = 0; i < fleets; i += 1) members.push({ name: `${pick(life, 0x40 + i, CREW_TITLES)} 해적단`, role: "산하 선단" });
    } else {
      if (!life.canonCrew) add("선장", 0x21);
      add(pick(life, 0x22, PIRATE_ROLES), 0x31);
      add(pick(life, 0x23, PIRATE_ROLES, members.map((m) => m.role)), 0x32);
    }
  } else if (life.path === "marine") {
    add(life.rankTier >= 4 ? "본부 사령" : "직속 상관", 0x51);
    for (let i = 0; i < Math.min(4, life.rankTier * 2); i += 1) add(i === 0 && life.rankTier >= 2 ? "부관" : "부하 수병", 0x52 + i);
    if (!life.rankTier) add("동기 수병", 0x5f);
  } else if (life.path === "liberator") {
    add("연락책", 0x61);
    for (let i = 0; i < Math.min(3, life.rankTier + (life.affiliation === "혁명군" ? 1 : 0)); i += 1) add("현장 요원", 0x62 + i);
  } else {
    add("작업반장", 0x71);
    add("견습 동료", 0x72);
  }
  return members;
}

export function crewLine(life) {
  const members = crewFor(life);
  return members.length ? members.map((member) => `${member.name}(${member.role})`).join(" · ") : "아직 혼자다";
}

export function relationshipGroups(life) {
  const mate = life.people?.mate;
  const bonds = [];
  const addBond = (name, role) => {
    if (name && !bonds.some((person) => person.name === name)) bonds.push({ name, role });
  };
  if (mate) {
    const stillAlong = mate.together && mate.fate === "곁"
      && (life.creationVersion < 31 || mate.path === life.path && !life.retired && !life.homebound);
    const status = mate.fate === "잃음" ? "소식이 끊김" : mate.fate === "다른 길" ? "서로 다른 길"
      : mate.fate === "적" ? "적대" : mate.fate === "화해" ? "화해"
        : stillAlong ? "동행 중"
          : life.creationVersion >= 31 && mate.together ? "한때 함께 일함"
            : life.creationVersion >= 31 && mate.path && life.path && mate.path !== life.path ? "서로 다른 길"
              : "동행 전";
    addBond(mate.name, `소꿉친구 · ${status}`);
  } else if (life.friendName && life.friendName !== "옛 친구") {
    addBond(life.friendName, "옛 친구");
  }
  if (life.people?.rival) addBond(life.people.rival.name, "라이벌");
  const ward = life.people?.ward;
  if (ward && (life.creationVersion < 31 || life.seen?.includes("life_people_ward_meet"))) {
    const role = life.creationVersion < 31 ? "제자 · 후계" : {
      "후계": "장부를 맡긴 후배", "자기 길": "다른 길을 택한 후배",
      "맡김": "다른 집에 맡긴 아이", "지나침": "한때 지나친 아이",
      "추적자": "다른 소속의 추적자", "원망": "갈등이 남은 인연",
      "용서": "사과를 받아 준 인연", "놓아줌": "길을 터 준 인연",
      "곁": "함께 일하던 후배"
    }[ward.fate] || "부두에서 맺은 인연";
    addBond(ward.name, role);
  }
  for (const contact of canonRelationshipEntries(life)) addBond(contact.name, contact.role);

  const crew = [];
  const factions = [];
  for (const member of crewFor(life)) {
    if (member.role === "산하 선단") {
      factions.push({ name: member.name, role: "산하 해적단" });
    } else if (member.name !== mate?.name || mate.together && mate.fate === "곁") {
      crew.push(member);
    }
  }
  return { bonds, crew, factions };
}

// Search the visible tab by person/organization name or relationship label.
export function filterRelationshipEntries(entries, query) {
  const term = String(query || "").trim().toLocaleLowerCase();
  return term ? entries.filter(({ name, role }) =>
    [name, role].some((value) => String(value || "").toLocaleLowerCase().includes(term))) : entries;
}
