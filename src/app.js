import { fruitFxKind, powerFxForChoice } from "./power-fx.js";
import { ART, PERSONALITY, PROFILE_OPTIONS, STATS, advance, collectMilestones, createGame, getScene, personalitySummary, replay, saveRecord } from "./game.js";
import { crewNews, crewVesselKind, eraStart, presentAge, stretched } from "./world.js";
import { peopleSummary } from "./people.js";
import { canonRelationshipLine, canonRelationshipSummary } from "./canon-relationships.js";
import { crewLine } from "./crew.js";
import { canonCount, canonStatus } from "./canon-events.js";
import { formatBounty } from "./bounty.js";
import { fateLegacy } from "./fates.js";
import { preCanonStatus } from "./canon-before.js";
import { createObservation, tickObservation } from "./observation.js";
import { scenes } from "./story.js";
import { diceResult, diceTick, initMusic, moodFor, setMood } from "./music.js";

const STORAGE_KEY = "a-life-at-sea.lives.v1";
const modeName = (mode) => mode === "original" ? "원작 모드" : "더 자유로운 모드";
const byId = (id) => document.getElementById(id);

let library = { version: 1, active: -1, lives: [] };
let life = null;
let timer = null;
let observation = null;
let speed = 1;
let paused = false;
let storageUnavailable = false;

function showStorageMessage(message) {
  const element = byId("storage-message");
  element.textContent = message;
  element.hidden = !message;
  const globalWarning = byId("save-warning");
  globalWarning.textContent = message;
  globalWarning.hidden = !message;
}

function safeReplay(record) {
  try {
    let state = replay(record);
    // Keep earlier choices intact, then adopt captain-led travel on the next action.
    if (record.creationVersion === 20 && record.crewFollowFrom === undefined && !state.finished) {
      record.crewFollowFrom = record.actions.length;
      state = replay(record);
    }
    return state;
  } catch {
    if (!record || record.version !== 1 || !Array.isArray(record.actions)) throw new Error("저장 기록 형식이 맞지 않습니다.");
    const rules = record.rules === undefined ? 1 : record.rules;
    let state = createGame(record.mode, record.seed, record.profile === undefined ? {} : record.profile, rules,
      record.creationVersion === undefined ? 1 : record.creationVersion);
    const validActions = [];
    for (const action of record.actions) {
      if (action !== null && typeof action !== "string") break;
      try {
        state = advance(state, action);
        validActions.push(action);
      } catch {
        break;
      }
    }
    record.actions = validActions;
    return state;
  }
}

function loadLibrary() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    storageUnavailable = true;
    showStorageMessage("브라우저 저장 공간에 접근할 수 없습니다. 이번 플레이는 브라우저를 닫으면 저장되지 않습니다.");
    return;
  }
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.lives) ||
      !Number.isInteger(saved.active) || saved.active < -1 || saved.active >= saved.lives.length) {
      throw new Error("저장 목록 형식이 맞지 않습니다.");
    }
    if (saved.active >= 0) {
      try {
        safeReplay(saved.lives[saved.active]);
      } catch {
        saved.active = -1;
      }
    }
    library = saved;
  } catch {
    library = { version: 1, active: -1, lives: [] };
  }
}

function persist() {
  if (storageUnavailable) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch {
    storageUnavailable = true;
    showStorageMessage("브라우저 저장 공간에 기록을 저장하지 못했습니다. 이번 플레이는 계속할 수 있지만 다시 열면 복원되지 않습니다.");
  }
}

function stopTimer() {
  if (timer !== null) clearTimeout(timer);
  timer = null;
}

function scheduleObservation() {
  stopTimer();
  if (!life || life.finished) return;
  const scene = getScene(life);
  if (!scene) return;
  const panel = byId("observation-timeline");
  panel.hidden = scene.choices.length > 0 || scene.manual;
  if (scene.choices.length || scene.manual) {
    observation = null;
    return;
  }
  const now = performance.now();
  if (!observation || observation.sceneId !== scene.id) observation = createObservation(scene, now);
  const running = !paused && !document.hidden && !byId("journal").open;
  observation = tickObservation(observation, now, speed, running);
  const percent = Math.round(observation.elapsed / observation.duration * 100);
  const seconds = Math.ceil((observation.duration - observation.elapsed) / (1000 * speed));
  byId("observation-fill").style.width = `${percent}%`;
  byId("observation-progress").setAttribute("aria-valuenow", String(percent));
  byId("observation-remaining").textContent = paused ? `일시정지 · ${seconds}초 남음` : `${seconds}초 남음 · ${speed}배속`;
  if (!running) return;
  if (observation.elapsed >= observation.duration) return advanceLife(null);
  timer = setTimeout(scheduleObservation, 100);
}

function showSection(section) {
  const shell = document.querySelector(".page-shell");
  shell.classList.toggle("intro-screen", section === "intro" || section === "birth");
  shell.classList.toggle("game-screen", section === "game");
  byId("intro").hidden = section !== "intro";
  byId("birth").hidden = section !== "birth";
  byId("game").hidden = section !== "game";
  byId("ending").hidden = section !== "ending";
  byId("journal-open").hidden = library.lives.length === 0;
}

function renderBirth() {
  stopTimer();
  observation = null;
  const scene = getScene(life);
  showSection("birth");
  setMood("calm");
  byId("birth-eyebrow").textContent = `출생 기록 · ${modeName(life.mode)}`;
  byId("birth-title").textContent = `${life.birth.home}에서 태어난 ${life.birth.name}`;
  byId("birth-image").src = scene.art.src;
  byId("birth-image").alt = scene.art.alt;
  byId("birth-lead").textContent = `${life.birth.means} 형편의 집안에서 ${life.birth.gender} ${life.birth.species}으로 태어났습니다. 루피가 바다로 나서는 해에 ${eraStart(life)}세가 되며, 원작 현재 시점까지는 ${presentAge(life)}년의 세월이 놓여 있습니다.`;
  byId("birth-name").textContent = `${life.birth.name} · ${life.birth.gender}`;
  byId("birth-species").textContent = life.birth.species;
  byId("birth-home").textContent = life.birth.home;
  byId("birth-means").textContent = `${life.birth.means} 형편`;
  byId("birth-mode").textContent = modeName(life.mode);
  byId("birth-era").textContent = `원작 현재 ${presentAge(life)}년 전 출생 (루피 출항 시 ${eraStart(life)}세)`;
  renderStats("birth-stats-grid", "birth-stat-note", true);
  renderPersonality("birth-personality-grid", "birth-personality-summary", true);
  byId("birth-title").focus();
}

function renderIntro() {
  stopTimer();
  observation = null;
  showSection("intro");
  setMood("calm");
  const hasActive = library.active >= 0;
  byId("resume").hidden = !hasActive;
  if (hasActive) {
    try {
      const savedLife = safeReplay(library.lives[library.active]);
      byId("resume").textContent = savedLife.finished ? "마지막 삶 돌아보기" : "기록 이어보기";
    } catch {
      byId("resume").hidden = true;
    }
  }
}

function renderLifeStrip() {
  byId("life-name").textContent = `${life.birth.name} · ${life.birth.gender} · ${life.birth.species} · ${life.birth.home}`;
  byId("life-work").textContent = `${life.job} · ${life.affiliation}${life.coalition ? " · 연합" : life.alliance ? " · 동맹" : ""}`;
  byId("life-role").textContent = life.role;
  byId("life-power").textContent = `${powerSummary()}${life.creationVersion >= 4 && life.bounty ? ` · 현상금 ${formatBounty(life.bounty)}` : ""}`;
  byId("life-goal").textContent = life.goal;
  renderReputation();
  byId("life-crew").textContent = byId("life-crew").title = crewLine(life);
  byId("life-relationships").textContent = byId("life-relationships").title = canonRelationshipLine(life);
}

function reputationDesc(rep) {
  if (rep >= 70) return "세계를 비추는 드높은 명성";
  if (rep >= 40) return "바다 사람들이 믿고 의지하는 영웅";
  if (rep >= 20) return "여러 섬에 알려진 신뢰의 이름";
  if (rep > 0) return "부두에 퍼지기 시작한 호평";
  if (rep === 0) return "바다에 이름을 알리기 전";
  if (rep > -20) return "선술집에서 수군대는 거친 소문";
  if (rep > -40) return "해군 검문선이 주시하는 경계 대상";
  if (rep > -70) return "마을 사람들이 문을 걸어 잠그는 흉명";
  return "바다 전체를 공포에 떨게 하는 대해적";
}

function renderReputation() {
  const card = byId("life-reputation");
  if (!card) return;
  const rep = life.reputation || 0;
  const isRenown = rep >= 0;
  card.dataset.state = isRenown ? "renown" : "infamy";
  const sunIcon = byId("reputation-sun-icon");
  const skullIcon = byId("reputation-skull-icon");
  if (sunIcon) sunIcon.hidden = !isRenown;
  if (skullIcon) skullIcon.hidden = isRenown;
  const kind = byId("reputation-kind");
  if (kind) kind.textContent = isRenown ? "명성" : "악명";
  const val = byId("reputation-val");
  if (val) val.textContent = isRenown ? `+${rep}` : `${Math.abs(rep)}`;

  const percent = Math.min(100, Math.max(0, Math.abs(rep)));
  const fillY = 32 - (32 * (percent / 100));
  const fillH = 32 * (percent / 100);
  if (isRenown) {
    const sunRect = byId("sun-gauge-rect");
    if (sunRect) {
      sunRect.setAttribute("y", fillY.toFixed(1));
      sunRect.setAttribute("height", fillH.toFixed(1));
    }
  } else {
    const skullRect = byId("skull-gauge-rect");
    if (skullRect) {
      skullRect.setAttribute("y", fillY.toFixed(1));
      skullRect.setAttribute("height", fillH.toFixed(1));
    }
  }

  const desc = byId("reputation-desc");
  if (desc) {
    let extra = "";
    if (life.creationVersion >= 20) {
      if (life.path === "marine" && (life.arrestCount || life.arrestBounty)) {
        extra = ` · 수감 ${life.arrestCount}명(${formatBounty(life.arrestBounty)})`;
      }
    }
    desc.textContent = `${reputationDesc(rep)}${extra}`;
  }
}

function powerSummary() {
  const haki = life.haki || { observation: 0, armament: 0, conqueror: 0 };
  const learned = [
    haki.observation && `견문색 ${haki.observation}`,
    haki.armament && `무장색 ${haki.armament}`,
    haki.conqueror && `패왕색 ${haki.conqueror}`
  ].filter(Boolean);
  return [life.devilFruit || "비능력자", ...learned].join(" · ");
}

// Moments worth keeping on the ending record: careers, promotions, powers, dangers, canon brushes and people.
const KEY_MOMENT = /^(life_recruit_|life_career$|life_.*_invitation_|life_crew_offer_|life_rank_|life_free_rank$|life_branch_aftermath$|life_fruit_(find|payment|practice)$|life_haki_|life_conqueror_sign$|life_danger_|life_meet_|life_people_(mate_meet|mate_crisis|rival_clash|ward_meet|ward_return)$|life_retire_choice$|life_isle_|life_fate_|canon_arc_.*_0$)/;
const POWER_MOMENT = /^(life_haki_training|life_haki_practice|life_conqueror_sign|life_fruit_find|life_fruit_payment|life_fruit_practice)$/;

function lastPower() {
  const entry = [...life.journal].reverse().find((item) => POWER_MOMENT.test(item.id) && item.choice
    && /견문색|무장색|기세|다스리|먹|연습|힘/.test(item.choice));
  return entry ? `${entry.choice.replace(/[을를]? ?(배운다|수련한다|연습한다|먹는다)$/, (_, verb) => ({ 배운다: " 습득", 수련한다: " 수련", 연습한다: " 연습", 먹는다: " 섭취" })[verb])} · ${entry.age}세` : "특별한 힘 없이 살았다";
}

function renderTimeline() {
  const list = byId("ending-timeline");
  list.replaceChildren();
  const moments = life.journal.filter((entry) => KEY_MOMENT.test(entry.id));
  const last = life.journal.at(-1);
  [...moments.slice(-11), ...(last && !moments.includes(last) ? [last] : [])].forEach((entry, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--i", String(index));
    const when = document.createElement("b");
    when.textContent = `${entry.age}세`;
    const what = document.createElement("span");
    what.textContent = entry.choice ? `${entry.title} — ${entry.choice}` : entry.title;
    item.append(when, what);
    list.append(item);
  });
}

function statLabel(stat) {
  if (stat.key === "bounty") return "현상금";
  if (stat.key === "reputation") return (life?.reputation || 0) >= 0 ? "명성" : "악명";
  if (stat.key.startsWith("personality.")) return PERSONALITY.find((entry) => entry.key === stat.key.slice(12))?.label || stat.key;
  if (stat.key === "bond") {
    if (!life.guardianName && life.creationVersion >= 3) return stat.label;
    return `${life.guardianName || "준"}${life.rules === 3 ? "와의" : "과의"} 유대`;
  }
  if (stat.key === "friendBond") {
    if (!life.friendName && life.creationVersion >= 3) return stat.label;
    const name = life.friendName || "린";
    const last = name.codePointAt(name.length - 1);
    const closed = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
    return `${name}${life.creationVersion >= 3 ? closed ? "과의" : "와의" : life.rules === 3 ? "와의" : "과의"} 유대`;
  }
  if (stat.key === "trust" && life.creationVersion >= 3) return `${life.location.split(" · ").at(-1)}의 신뢰`;
  return stat.label;
}

function describeChanges(changes) {
  return changes.map(({ key, delta }) => {
    const stat = STATS.find((entry) => entry.key === key) || { key };
    return `${statLabel(stat)} ${delta > 0 ? "+" : ""}${key === "bounty" ? formatBounty(Math.abs(delta)) : delta}`;
  }).join(" · ");
}

function appendMeter(grid, labelText, value, max, className, delta = 0) {
  const item = document.createElement("div");
  item.className = `stat ${className}`;
  const head = document.createElement("div");
  head.className = "stat-head";
  const label = document.createElement("span");
  label.textContent = labelText;
  if (delta) {
    const badge = document.createElement("em");
    badge.className = `stat-delta ${delta > 0 ? "up" : "down"}`;
    badge.textContent = `${delta > 0 ? "+" : ""}${delta}`;
    label.append(badge);
  }
  const number = document.createElement("strong");
  number.textContent = `${value} / ${max}`;
  head.append(label, number);
  const track = document.createElement("div");
  track.className = "stat-track";
  track.setAttribute("role", "meter");
  track.setAttribute("aria-label", labelText);
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(max));
  track.setAttribute("aria-valuenow", String(value));
  const fill = document.createElement("span");
  fill.style.width = `${value / max * 100}%`;
  track.append(fill);
  item.append(head, track);
  grid.append(item);
}

const changeOf = (key) => (life.lastChanges || []).find((change) => change.key === key)?.delta || 0;

// Choices show only their conditions; what a choice raises is revealed after it is made.
function conditionText(text) {
  return (text || "").split(" · ").filter((part) => !/[+-]\d[\d,]*( 베리)?$/.test(part) && !/자람$/.test(part)).join(" · ");
}

// The dice box hints at what a failure costs instead of printing the numbers.
function failHint(text) {
  return (text || "").split(" · ").map((part) => {
    const loss = part.match(/^(.+?) -(\d[\d,]*)$/);
    if (!loss) return /현상금/.test(part) ? "현상금이 오를 수 있음" : part;
    const [, label, amount] = loss;
    const heavy = Number(amount.replace(/,/g, "")) >= 30;
    if (label === "건강") return heavy ? "크게 다칠 수 있음" : "다칠 수 있음";
    if (label === "물자") return heavy ? "물자를 많이 잃을 수 있음" : "물자를 잃을 수 있음";
    if (label.includes("유대")) return "관계가 흔들릴 수 있음";
    if (label.includes("신뢰")) return "평판이 떨어질 수 있음";
    if (label === "기술") return "자신감을 잃을 수 있음";
    return "손해를 볼 수 있음";
  }).filter((part, index, all) => all.indexOf(part) === index).join(" · ");
}

function renderStats(gridId = "stats-grid", sourceId = "birth-stat-source", showBirthDelta = false) {
  const grid = byId(gridId);
  grid.replaceChildren();
  const birthStats = life.birthStats;
  const signed = (value) => `${value >= 0 ? "+" : ""}${value}`;
  byId(sourceId).textContent = birthStats
    ? `종족/개인차 · 기술 ${birthStats.species.skill}${signed(birthStats.individual.skill)}, 건강 ${birthStats.species.health}${signed(birthStats.individual.health)}`
    : "";
  for (const stat of STATS) {
    const max = life.rules === 3 ? stat.max : stat.key === "health" ? 3 : 5;
    const value = Math.max(0, Math.min(max, life[stat.key]));
    const delta = showBirthDelta ? birthStats?.individual[stat.key] || 0 : changeOf(stat.key);
    appendMeter(grid, statLabel(stat), value, max, `stat-${stat.key}`, delta);
  }
}

function renderPersonality(gridId = "personality-grid", summaryId = "personality-summary", showBirthDelta = false) {
  const grid = byId(gridId);
  grid.replaceChildren();
  for (const trait of PERSONALITY) {
    const delta = showBirthDelta ? life.birthStats?.personality[trait.key] || 0 : changeOf(`personality.${trait.key}`);
    appendMeter(grid, trait.label, life.personality[trait.key], 100, `trait-${trait.key}`, delta);
  }
  byId(summaryId).textContent = `성향 · ${personalitySummary(life.personality)}`;
}

function renderAgeTimeline(scene) {
  const age = scene.age;
  const current = presentAge(life);
  byId("timeline-age").textContent = scene.timeLabel ? `${age}세 · ${scene.timeLabel}` : `${age}세`;
  byId("timeline-end").textContent = age <= current ? `원작 현재: ${current}세` : `원작 현재 이후 ${age - current}년 · 이후 미공개`;
  byId("age-fill").style.width = `${Math.min(100, age / current * 100)}%`;
  byId("age-progress").setAttribute("aria-valuemax", String(current));
  byId("age-progress").setAttribute("aria-valuenow", String(Math.min(age, current)));
  byId("age-progress").setAttribute("aria-valuetext", age <= current
    ? `${age}세, 원작 현재까지 ${current - age}년` : `${age}세, 원작 현재 이후 ${age - current}년`);
}

let lastSceneKey = "";
let crewFxRaf = 0;

const CREW_PAL = {
  w: "#ffffff", c: "#f7ecd5", g: "#f0b938", r: "#d6382e", d: "#7a2018",
  k: "#1d272a", m: "#8c5832", b: "#5c361a", s: "#2e6f73", f: "#8ec5d1", o: "#f28c28"
};
const CREW_SPRITES = {
  hat: [
    "....gggg....",
    "..gggggggg..",
    ".gggggggggg.",
    ".rrrrrrrrrr.",
    "gggggggggggg"
  ],
  dinghy: [
    ".....gg.....",
    "....rrrr....",
    ".....kk.w...",
    "..mmmmmmmm..",
    "...bbbbbb..."
  ],
  merry: [
    ".....kk.....",
    "...wwwwww...",
    "...wwrrww...",
    "c..wwwwww...",
    "ccmmmmmmmm..",
    ".bbbbbbbbbb."
  ],
  sunny: [
    ".....kk.....",
    "...wwwwww...",
    ".g.wwrrww...",
    "gogwwwwww...",
    ".grrrrrrrr..",
    ".bbbbbbbbbb."
  ]
};

function drawCrewFx(now = 0) {
  const canvas = byId("crew-fx");
  if (!canvas || !life || life.rules !== 3 || byId("game").hidden) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const t = motionOn ? now * 0.0045 : 0;
  const kind = crewVesselKind(life, getScene(life)?.age ?? life.age);
  const sprite = CREW_SPRITES[kind];
  // Trailing wake dots on the left ("loading" trail connecting from the text)
  for (let i = 0; i < 3; i += 1) {
    const phase = (t * 1.4 - i * 0.33) % 1;
    const pulse = motionOn ? ((phase + 1) % 1) : 0.6;
    const dx = 2 + i * 4;
    const dy = 10 + Math.round(Math.sin(t * 1.8 + i * 1.3) * (motionOn ? 1 : 0));
    ctx.fillStyle = pulse < 0.45 ? CREW_PAL.w : CREW_PAL.f;
    ctx.fillRect(dx, dy, 2, 1);
  }
  // Scrolling pixel waves along the bottom
  for (let x = 13; x < w; x += 1) {
    const wave = Math.sin(x * 0.48 - t * 2.4);
    const wy = 11 + (wave > 0.35 ? 0 : 1);
    ctx.fillStyle = wave > 0.55 ? CREW_PAL.w : CREW_PAL.f;
    ctx.fillRect(x, wy, 1, 1);
    ctx.fillStyle = CREW_PAL.s;
    ctx.fillRect(x, wy + 1, 1, h - wy - 1);
  }
  // Bobbing pixel sprite (straw hat / dinghy / Going Merry / Thousand Sunny)
  const bob = motionOn ? (Math.sin(t * 2.1) > 0 ? -1 : 0) : 0;
  const sx = 19;
  const sy = (kind === "hat" ? 6 : 5) + bob;
  for (let r = 0; r < sprite.length; r += 1) {
    const row = sprite[r];
    for (let c = 0; c < row.length; c += 1) {
      const ch = row[c];
      if (ch !== ".") {
        ctx.fillStyle = CREW_PAL[ch];
        ctx.fillRect(sx + c, sy + r, 1, 1);
      }
    }
  }
  // Tiny sea spray sparkle at the bow when moving
  if (motionOn && ((now / 260) | 0) % 2 === 0) {
    ctx.fillStyle = CREW_PAL.w;
    ctx.fillRect(sx - 2, 10 + bob, 1, 1);
  }
}

function syncCrewFx() {
  if (crewFxRaf) {
    cancelAnimationFrame(crewFxRaf);
    crewFxRaf = 0;
  }
  if (!life || life.rules !== 3 || byId("game").hidden) return;
  if (!motionOn) {
    drawCrewFx(0);
    return;
  }
  const loop = (now) => {
    if (!life || life.rules !== 3 || byId("game").hidden || !motionOn) {
      crewFxRaf = 0;
      return;
    }
    drawCrewFx(now);
    crewFxRaf = requestAnimationFrame(loop);
  };
  crewFxRaf = requestAnimationFrame(loop);
}

function isCanonStory(scene) {
  if (!scene) return false;
  if (scene.canonDaily || (scene.id && scene.id.startsWith("life_canon_daily_"))) return false;
  if (/^life_(duty|danger|mishap|person|island|meet|travel|leave_home|free_rank|first_bounty|marine_invitation|crew_invite)/.test(scene.id)) return false;
  if (/^canon_/.test(scene.id) && !scene.id.startsWith("canon_strawhat_invite")) return true;
  if (/^life_old_/.test(scene.id)) return true;
  if (/^life_(roger|marineford|timeskip|new_era|fisher_tiger|tiger_liberation|tom|shanks)_news/.test(scene.id)) return true;
  if (/^species_[a-z0-9_-]+-(roger|war)/.test(scene.id)) return true;
  return false;
}

function sceneTone(scene) {
  const key = `${scene.id} ${scene.art?.src || ""}`;
  if (/drum|ice|snow/i.test(key)) return "snow";
  if (/marineford|merry|wano|punkhazard|fire/i.test(key)) return "fire";
  if (moodFor(scene) === "danger" || /storm|crisis|enemy|clash|raid|danger|enies|impel|thriller/i.test(key)) return "storm";
  if (isCanonStory(scene)) return "canon";
  return "calm";
}

function renderSceneAtmosphere(scene, arrivedPlace = "") {
  const tone = sceneTone(scene);
  const art = byId("scene-art");
  const fx = byId("scene-fx");
  const badge = byId("scene-badge");
  const sceneKey = `${life.journal.length}:${scene.id}`;
  art.dataset.tone = tone;
  if (sceneKey !== lastSceneKey) {
    lastSceneKey = sceneKey;
    const layout = byId("scene-layout");
    layout.classList.remove("scene-enter", "scene-shake");
    fx.replaceChildren();
    if (motionOn) {
      void layout.offsetWidth;
      layout.classList.add(tone === "storm" || tone === "fire" ? "scene-shake" : "scene-enter");
      const count = tone === "storm" ? 18 : tone === "snow" || tone === "fire" ? 14 : 10;
      for (let i = 0; i < count; i += 1) {
        const drop = document.createElement("span");
        drop.style.setProperty("--x", `${(i * 97 / count + (i % 3) * 7) % 100}%`);
        drop.style.setProperty("--d", `${(i * 0.37) % 3.2}s`);
        drop.style.setProperty("--t", `${tone === "storm" ? 0.65 + (i % 4) * 0.12 : 2.6 + (i % 5) * 0.45}s`);
        fx.append(drop);
      }
    }
  }
  const badgeText = arrivedPlace ? `새로운 기항지 · ${arrivedPlace}`
    : isCanonStory(scene) ? "원작의 물결"
    : tone === "storm" || tone === "fire" ? "격동의 순간" : "";
  badge.textContent = badgeText;
  badge.hidden = !badgeText;
}

let currentSceneImageSrc = "";
let sceneImageToken = 0;

function updateSceneImage(img, src, alt) {
  if (!img) return;
  const targetSrc = src || "";
  const targetAlt = alt || "";
  if (!currentSceneImageSrc) currentSceneImageSrc = img.getAttribute("src") || "";
  if (currentSceneImageSrc === targetSrc && img.getAttribute("src") === targetSrc) {
    img.alt = targetAlt;
    return;
  }
  if (typeof Image === "undefined") {
    img.src = targetSrc;
    img.alt = targetAlt;
    currentSceneImageSrc = targetSrc;
    return;
  }
  const token = ++sceneImageToken;
  const preloader = new Image();
  preloader.src = targetSrc;
  const apply = () => {
    if (token !== sceneImageToken) return;
    img.src = targetSrc;
    img.alt = targetAlt;
    currentSceneImageSrc = targetSrc;
  };
  if (typeof preloader.decode === "function") {
    preloader.decode().then(apply).catch(apply);
  } else if (preloader.complete) {
    apply();
  } else {
    preloader.onload = apply;
    preloader.onerror = apply;
  }
}

function renderGame(focusTitle = false, statsUpdated = false, arrivedPlace = "") {
  const scene = getScene(life);
  if (!scene) return renderEnding();
  showSection("game");
  setMood(moodFor(scene));
  renderSceneAtmosphere(scene, arrivedPlace);
  byId("game").classList.toggle("has-choices", scene.choices.length > 0 || scene.manual);
  byId("game").classList.toggle("many-choices", scene.choices.length >= 4);
  const passage = life.journal.length === 0 ? "태어난 해" : scene.age === life.age ? "같은 해" : `${scene.age - life.age}년 후`;
  byId("scene-location").textContent = `${life.location} · ${modeName(life.mode)} · ${life.birth.name}`;
  byId("scene-chapter").textContent = `${life.journal.length + 1}번째 장면 · ${scene.timeLabel || passage}`;
  byId("scene-title").textContent = scene.title;
  byId("scene-body").textContent = scene.body;
  updateSceneImage(byId("scene-image"), scene.art?.src || ART.deck.src, scene.art?.alt || "");
  byId("route-trail").textContent = (life.travelHistory || [life.birth.home]).join(" → ");
  byId("crew-line").hidden = life.rules !== 3;
  byId("crew-news").textContent = byId("crew-news").title = life.rules === 3
    ? life.creationVersion >= 4 && life.seen.includes("life_marineford_news")
      && (life.creationVersion >= 5 || life.canonStep < canonCount(life))
      ? canonStatus(life)
      : life.creationVersion >= 5 && !life.seen.includes("life_marineford_news")
        && scene.age >= eraStart(life)
        ? preCanonStatus(life) : crewNews(life, scene.age) : "";
  // Rule 16 says once, beside the canon line, that the canon calendar is stretched for this game.
  if (stretched(life) && scene.age >= eraStart(life)) byId("crew-news").textContent += " · 원작 시간은 게임에 맞춰 늘려 표시";
  syncCrewFx();
  if (!statsUpdated) {
    const changeText = describeChanges(life.lastChanges);
    byId("scene-result").textContent = [life.lastOutcome, changeText].filter(Boolean).join(" · ");
    byId("scene-result").hidden = !life.lastOutcome && !changeText;
    renderLifeStrip();
    renderStats();
    renderPersonality();
  }
  renderAgeTimeline(scene);

  const choices = byId("choices");
  choices.replaceChildren();
  for (const choice of scene.choices) {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.disabled = choice.disabled;
    const copy = document.createElement("span");
    const label = document.createElement("strong");
    label.textContent = choice.label;
    copy.className = "choice-copy";
    copy.append(label);
    const condition = conditionText(choice.condition ?? choice.risk);
    if (condition) {
      const risk = document.createElement("small");
      risk.textContent = condition;
      copy.append(risk);
    }
    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    button.append(copy);
    if (choice.dice) {
      const dice = document.createElement("span");
      dice.className = "choice-dice";
      const goal = document.createElement("b");
      goal.textContent = `주사위 ${choice.dice} 이상`;
      const rule = document.createElement("small");
      rule.textContent = choice.diceShort ? "조건 부족 · 1~100 굴림" : "조건 충족 · 1~100 굴림";
      const fail = document.createElement("small");
      fail.textContent = `실패하면 ${failHint(choice.failRisk)}`;
      dice.append(goal, rule, fail);
      button.append(dice);
    }
    button.append(arrow);
    button.addEventListener("click", () => choice.naming ? askCrewName(choice) : advanceLife(choice.id));
    choices.append(button);
  }
  if (scene.manual && !scene.choices.length) {
    const button = document.createElement("button");
    button.className = "choice canon-continue";
    button.type = "button";
    button.textContent = "다음 원작 장면 보기 ↗";
    button.addEventListener("click", () => advanceLife(null));
    choices.append(button);
  }
  byId("scene-hint").textContent = scene.choices.length
    ? "선택 장면에서는 시간이 흐르지 않습니다. 회색 선택지는 현재 조건이 부족합니다."
    : scene.manual ? "이 장면은 자동으로 넘어가지 않습니다. 내용을 읽은 뒤 직접 계속하세요."
    : paused ? "자동 진행을 멈췄습니다. 준비되면 다시 진행하세요."
      : "게이지가 끝나면 다음 장면으로 넘어갑니다.";
  if (focusTitle) {
    window.scrollTo(0, 0);
    byId("scene-title").focus({ preventScroll: true });
  }
  scheduleObservation();
}

// Founding a crew asks for its name in place; leaving it blank uses the captain's name.
function askCrewName(choice) {
  stopTimer();
  const form = document.createElement("form");
  form.className = "crew-name-form";
  const label = document.createElement("label");
  label.htmlFor = "crew-name";
  label.textContent = "새 해적단의 이름";
  const input = document.createElement("input");
  input.id = "crew-name";
  input.type = "text";
  input.maxLength = 12;
  input.autocomplete = "off";
  input.placeholder = `비워 두면 ${life.birth.name} 해적단`;
  const confirm = document.createElement("button");
  confirm.type = "submit";
  confirm.className = "text-button";
  confirm.textContent = "이 이름으로 출항";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "text-button";
  cancel.textContent = "다시 고르기";
  cancel.addEventListener("click", () => renderGame());
  form.append(label, input, confirm, cancel);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    advanceLife(input.value.trim() ? `${choice.id}:${input.value}` : choice.id);
  });
  byId("choices").replaceChildren(form);
  input.focus();
}

let playingChanges = false;
const MOTION_KEY = "one-sea-motion";
let motionOn = (() => {
  try { return { on: true, ...JSON.parse(localStorage.getItem(MOTION_KEY) || "{}") }.on !== false; }
  catch { return true; }
})();

function initMotion(toggle) {
  const show = () => {
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(motionOn));
    toggle.textContent = motionOn ? "애니메이션 끄기" : "애니메이션 켜기";
  };
  toggle?.addEventListener("click", () => {
    motionOn = !motionOn;
    try { localStorage.setItem(MOTION_KEY, JSON.stringify({ on: motionOn })); } catch {}
    show();
    syncCrewFx();
  });
  show();
}

// After a choice the screen dims and a card lists what changed. Each row then bursts into round particles
// in its meter's color that fly into that stat or trait; bounty particles go to the role line.
function changeTarget(key) {
  const target = key === "bounty" ? byId("life-power")
    : key === "reputation" ? byId("life-reputation")
    : document.querySelector(key.startsWith("personality.") ? `#personality-grid .trait-${key.slice(12)}` : `#stats-grid .stat-${key}`);
  // On phones the panels may be folded; particles then fly into the toggle instead.
  const fallback = byId("growth-toggle");
  return target && target.getClientRects().length ? target : fallback && fallback.getClientRects().length ? fallback : byId("scene-result");
}

function burst(row, target, delta) {
  if (!row || !target) return Promise.resolve();
  try {
    const from = row.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const color = getComputedStyle(target).getPropertyValue("--stat-color").trim() || (delta > 0 ? "#2f8f4e" : "#c0392b");
    const count = Math.min(14, 6 + Math.abs(delta) / 2);
    const flights = [];
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement("span");
      dot.className = "fx-particle";
      const size = 6 + Math.random() * 7;
      const x = from.left + Math.random() * from.width;
      const y = from.top + from.height / 2 + (Math.random() - 0.5) * from.height;
      Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px`, background: color, boxShadow: `0 0 10px ${color}` });
      document.body.append(dot);
      const dx = to.left + to.width * (0.2 + Math.random() * 0.6) - x;
      const dy = to.top + to.height / 2 - y;
      const spread = (Math.random() - 0.5) * 140;
      try {
        const flight = dot.animate([
          { transform: "translate(0, 0) scale(.4)", opacity: 0 },
          { transform: `translate(${spread * 0.6}px, ${-30 - Math.random() * 50}px) scale(1.15)`, opacity: 1, offset: 0.25 },
          { transform: `translate(${dx}px, ${dy}px) scale(.35)`, opacity: 0.9 }
        ], { duration: 720 + Math.random() * 260, delay: i * 28, easing: "cubic-bezier(.5, 0, .75, .35)", fill: "forwards" });
        if (flight?.finished && typeof flight.finished.then === "function") {
          flights.push(flight.finished.then(() => dot.remove()).catch(() => dot.remove()));
        } else if (flight) {
          flights.push(new Promise((resolve) => {
            flight.onfinish = () => { dot.remove(); resolve(); };
            flight.onerror = () => { dot.remove(); resolve(); };
          }));
        } else {
          dot.remove();
        }
      } catch {
        dot.remove();
      }
    }
    return Promise.all(flights).then(() => {
      try {
        target.classList.remove("fx-hit");
        void target.offsetWidth;
        target.classList.add("fx-hit");
      } catch {}
    }).catch(() => {});
  } catch {
    return Promise.resolve();
  }
}

// A dice check gets its own beat: the die tumbles through numbers, lands on the roll, then shows the verdict.
async function playDice({ roll, target, success, tier }, keepOverlay = false) {
  const kind = tier === "great" ? "great" : success ? "success" : "fail";
  diceResult(kind);
  if (!motionOn) return;
  let overlay = document.querySelector(".fx-overlay");
  const isExisting = Boolean(overlay);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "fx-overlay dice-overlay";
  } else {
    overlay.className = "fx-overlay dice-overlay show";
    overlay.replaceChildren();
  }
  const card = document.createElement("div");
  card.className = "fx-card dice-card";
  card.setAttribute("role", "status");
  const goal = document.createElement("p");
  goal.className = "fx-title";
  goal.textContent = `주사위 1~100 · ${target} 이상이면 성공`;
  const die = document.createElement("div");
  die.className = "dice-face rolling";
  die.textContent = "?";
  const verdict = document.createElement("p");
  verdict.className = "dice-verdict";
  card.append(goal, die, verdict);
  overlay.append(card);
  if (!isExisting) {
    document.body.append(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
  }
  let skip;
  const pause = (ms) => new Promise((resolve) => { const timer = setTimeout(resolve, ms); skip = () => { clearTimeout(timer); resolve(); }; });
  let skipped = false;
  overlay.addEventListener("click", () => { skipped = true; skip?.(); }, { once: true });
  // Flicker through random faces, slowing down like a die losing momentum.
  for (let delay = 45; delay < 230 && !skipped; delay *= 1.16) {
    die.textContent = String(1 + Math.floor(Math.random() * 100));
    diceTick();
    await pause(delay);
  }
  // Three verdicts look and feel different: a gold burst, a green pulse, or a red shake.
  die.classList.remove("rolling");
  die.classList.add(kind);
  die.textContent = String(roll);
  verdict.className = `dice-verdict ${kind}`;
  verdict.textContent = { great: "대성공!", success: "성공", fail: "실패" }[kind];
  card.classList.add(`verdict-${kind}`);
  if (kind === "great") {
    for (let index = 0; index < 18; index += 1) {
      const spark = document.createElement("span");
      spark.className = "dice-spark";
      const angle = (index / 18) * Math.PI * 2;
      spark.style.setProperty("--dx", `${Math.cos(angle) * (90 + (index % 3) * 30)}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * (90 + (index % 3) * 30)}px`);
      card.append(spark);
    }
  }
  skipped = false;
  await pause(kind === "great" ? 1600 : 1100);
  if (!keepOverlay) {
    overlay.classList.add("leaving");
    await pause(240);
    overlay.remove();
  } else {
    card.style.opacity = "0";
    card.style.transform = "scale(.86)";
    await pause(120);
    overlay.replaceChildren();
  }
}

async function playChanges(changes, outcome = "", chosenLabel = "", powerFx = null, keepOverlay = false) {
  const cleanOutcome = outcome.replace(/^주사위 \d+ \(\d+ 이상 성공\) · (?:대성공|성공|실패)\.\s*/, "").trim();
  if (!changes.length && !cleanOutcome) return false;
  if (!motionOn) {
    if (powerFx) diceResult(powerFx.kind.startsWith("fruit") ? "fruit" : "haki");
    const resultLine = byId("scene-result");
    const changeText = describeChanges(changes);
    resultLine.textContent = [life.lastOutcome, changeText].filter(Boolean).join(" · ");
    resultLine.hidden = !life.lastOutcome && !changeText;
    renderLifeStrip();
    renderStats();
    renderPersonality();
    return true;
  }
  const reduced = false;
  let overlay = document.querySelector(".fx-overlay");
  const isExisting = Boolean(overlay);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "fx-overlay";
  } else {
    overlay.className = "fx-overlay show";
    overlay.classList.remove("leaving", "bursting", "dice-overlay");
    overlay.replaceChildren();
  }
  const card = document.createElement("div");
  card.className = `fx-card${powerFx ? ` milestone-card milestone-${powerFx.kind.startsWith("fruit") ? "fruit" : powerFx.kind}` : ""}`;
  card.setAttribute("role", "status");
  if (powerFx && !reduced) {
    const vfx = document.createElement("canvas");
    vfx.className = "milestone-fx";
    vfx.width = 96;
    vfx.height = 44;
    card.append(vfx);
    playPixelFx(vfx, powerFx.kind);
  }
  const heading = document.createElement("p");
  heading.className = "fx-title";
  heading.textContent = powerFx ? `${powerFx.badge} · ${chosenLabel}` : chosenLabel ? `선택 결과 · ${chosenLabel}` : "이번 선택으로";
  card.append(heading);
  if (cleanOutcome) {
    const story = document.createElement("p");
    story.className = "fx-outcome";
    story.textContent = cleanOutcome;
    card.append(story);
  }
  const rows = [];
  if (changes.length) {
    const list = document.createElement("ul");
    for (const { key, delta } of changes) {
      const item = document.createElement("li");
      item.className = delta > 0 ? "up" : "down";
      const name = document.createElement("span");
      name.textContent = key === "bounty" ? "현상금" : statLabel(STATS.find((entry) => entry.key === key) || { key });
      const amount = document.createElement("strong");
      amount.textContent = key === "bounty" ? `${delta > 0 ? "+" : "-"}${formatBounty(Math.abs(delta))}` : `${delta > 0 ? "+" : ""}${delta}`;
      item.append(name, amount);
      list.append(item);
      rows.push({ item, key, delta });
    }
    card.append(list);
  }
  const hint = document.createElement("small");
  hint.className = "fx-hint";
  hint.textContent = "클릭하면 바로 넘어갑니다";
  card.append(hint);
  overlay.append(card);
  if (!isExisting) {
    document.body.append(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
  }
  if (powerFx) diceResult(powerFx.kind.startsWith("fruit") ? "fruit" : "haki");
  let skip;
  const pause = (ms) => new Promise((resolve) => { const timer = setTimeout(resolve, ms); skip = () => { clearTimeout(timer); resolve(); }; });
  overlay.addEventListener("click", () => skip?.(), { once: true });
  await pause(reduced ? 1000 : Math.min(3200, Math.max(1500, 1100 + cleanOutcome.length * 32)));
  let statsUpdated = false;
  if (!reduced) {
    const resultLine = byId("scene-result");
    const changeText = describeChanges(changes);
    resultLine.textContent = [life.lastOutcome, changeText].filter(Boolean).join(" · ");
    resultLine.hidden = !life.lastOutcome && !changeText;
    statsUpdated = true;
    const flights = rows.map(({ item, key, delta }) => { const target = changeTarget(key); return target ? burst(item, target, delta) : null; }).filter(Boolean);
    const cardFlight = flyCardTo(card, resultLine, 140);
    if (cardFlight) flights.push(cardFlight);
    overlay.classList.add("bursting");
    await Promise.race([Promise.all(flights), pause(1500)]);
    renderLifeStrip();
    renderStats();
    renderPersonality();
    for (const { key } of rows) changeTarget(key)?.classList.add("fx-hit");
  }
  if (!keepOverlay) {
    overlay.classList.add("leaving");
    await pause(reduced ? 0 : 260);
    overlay.remove();
  } else {
    card.style.opacity = "0";
    card.style.transform = "scale(.86)";
    await pause(120);
    overlay.replaceChildren();
  }
  document.querySelectorAll(".fx-particle").forEach((dot) => dot.remove());
  return statsUpdated;
}

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const FX_RAMP = {
  "haki-conqueror": ["#1a0508", "#5e0b15", "#b81d24", "#ff4d4d", "#ffffff"],
  "haki-armament": ["#121619", "#2b3238", "#586069", "#c9516c", "#ffffff"],
  "haki-observation": ["#072227", "#155263", "#35858b", "#4fbdba", "#ffffff"],
  "fruit-gomu": ["#2a1015", "#7a283b", "#d9596f", "#ff9fb0", "#ffffff"],
  "fruit-mera": ["#240704", "#7a1608", "#d94e1f", "#ff9e22", "#fff6c2"],
  "fruit-hana": ["#240b21", "#611f52", "#b84a8c", "#f58ec0", "#fff0f7"],
  "fruit-ope": ["#051929", "#0e4366", "#2388b8", "#6be2ff", "#ffffff"],
  "fruit-bara": ["#141229", "#3c2973", "#c93b5b", "#45c4d6", "#ffffff"],
  "fruit-yami": ["#050208", "#1a0933", "#3d1766", "#7a3eb8", "#dcd0ff"],
  "fruit-nagi": ["#0d171a", "#1f3a42", "#477682", "#8ec5d1", "#eef9fc"],
  "fruit-goro": ["#081c2e", "#134b70", "#29a1d6", "#ffe156", "#ffffff"],
  "fruit-hie": ["#061a2e", "#12426b", "#3282b8", "#9be8ff", "#ffffff"],
  "fruit-suna": ["#261908", "#5c3d14", "#9e6b24", "#d9a74a", "#fff1c7"],
  "fruit-pika": ["#2b2104", "#70560a", "#c99e18", "#ffdf4d", "#ffffff"],
  "fruit-moku": ["#171c21", "#37424d", "#6c7a89", "#b8c4d0", "#f5f8fa"],
  "fruit-yuki": ["#0c1f2e", "#244d6a", "#5c92b8", "#bce2ff", "#ffffff"],
  "fruit-gasu": ["#190826", "#421463", "#8329b8", "#d46bff", "#fbe8ff"],
  "fruit-gura": ["#0d1624", "#223b5e", "#4e7db8", "#a8d0ff", "#ffffff"],
  "fruit-ito": ["#240d1a", "#5c2244", "#a84880", "#f29ec8", "#ffffff"],
  "fruit-mochi": ["#261c14", "#614835", "#a68265", "#e6ccb2", "#fffaf5"],
  "fruit-doru": ["#24180b", "#593e22", "#9e7547", "#e8c589", "#fffdf7"],
  "fruit-ori": ["#042129", "#0b5563", "#18a4b8", "#5ef2d6", "#fff394"],
  fruit: ["#1a0933", "#3b185f", "#79458f", "#c060a1", "#fef2f4"],
  default: ["#1d3537", "#2e6f73", "#c8961e", "#f3c65f", "#ffffff"]
};

// Pixel-art VFX rendered with a 5-step palette ramp, 4x4 Bayer dithering, and a 2-frame hero flash (pixelfx method).
function playPixelFx(canvas, kind) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w >> 1;
  const cy = h >> 1;
  const ramp = FX_RAMP[kind] || FX_RAMP.default;
  const start = performance.now();
  const px = (x, y, step, alpha = 1) => {
    const ix = x | 0;
    const iy = y | 0;
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) return;
    if (alpha * 16 <= BAYER4[(iy & 3) * 4 + (ix & 3)]) return;
    ctx.fillStyle = ramp[Math.max(0, Math.min(4, step | 0))];
    ctx.fillRect(ix, iy, 1, 1);
  };
  const draw = (now) => {
    if (!canvas.isConnected) return;
    const p = ((now - start) % 1100) / 1100;
    const out = 1 - (1 - p) ** 4;
    ctx.clearRect(0, 0, w, h);
    const hero = p < 0.12 ? 4 : 3;
    const fade = 1 - p * 0.85;
    // Expanding or contracting shockwave ring
    const rad = kind === "fruit-yami" ? 26 - out * 22 : 4 + out * 22;
    for (let a = 0; a < 48; a += 1) {
      const ang = (a / 48) * Math.PI * 2;
      px(cx + Math.cos(ang) * rad * 1.4, cy + Math.sin(ang) * rad * 0.75, hero - 1, fade);
      px(cx + Math.cos(ang) * (rad * 1.4 - 1), cy + Math.sin(ang) * (rad * 0.75 - 1), 1, fade * 0.7);
    }
    if (kind === "haki-conqueror") {
      // Jagged black-red lightning bolts tearing outward
      for (let b = 0; b < 6; b += 1) {
        const base = (b / 6) * Math.PI * 2 + out * 0.3;
        const reach = 6 + out * 26;
        for (let r = 2; r < reach; r += 1) {
          const jag = ((r + b * 3) & 3) === 0 ? 2 : -1;
          const x = cx + Math.cos(base) * r * 1.4 + Math.sin(base) * jag;
          const y = cy + Math.sin(base) * r * 0.8 - Math.cos(base) * jag;
          px(x, y, r > reach - 4 ? 4 : hero, fade);
          px(x + 1, y, 2, fade * 0.8);
        }
      }
    } else if (kind === "haki-armament") {
      // Hardened metallic impact shield & radial steel sparks
      for (let y = -7; y <= 7; y += 1) {
        for (let x = -9; x <= 9; x += 1) {
          if (x * x + y * y * 1.4 <= 78) px(cx + x, cy + y, (x + y < -4) ? 4 : (x * x + y * y > 48 ? 3 : 1), fade);
        }
      }
      for (let b = 0; b < 8; b += 1) {
        const ang = (b / 8) * Math.PI * 2 + 0.35;
        const d = 10 + out * 18;
        px(cx + Math.cos(ang) * d * 1.3, cy + Math.sin(ang) * d * 0.8, 4, fade);
        px(cx + Math.cos(ang) * (d - 2) * 1.3, cy + Math.sin(ang) * (d - 2) * 0.8, 3, fade);
      }
    } else if (kind === "haki-observation") {
      // Radar pulse rings & future-sight crosshair lock
      const r2 = 2 + ((out * 28) % 24);
      for (let a = 0; a < 36; a += 1) {
        const ang = (a / 36) * Math.PI * 2;
        px(cx + Math.cos(ang) * r2 * 1.2, cy + Math.sin(ang) * r2 * 0.8, 3, fade);
      }
      for (let d = -16; d <= 16; d += 1) {
        if (Math.abs(d) > 3) { px(cx + d, cy, 4, fade); px(cx, cy + (d >> 1), 4, fade); }
      }
    } else if (kind === "fruit-gomu") {
      // Elastic stretching punch & snap-back impact rings
      const reach = p < 0.65 ? (p / 0.65) * 34 : (1 - (p - 0.65) / 0.35) * 34;
      const startX = cx - 22;
      for (let x = 0; x < reach; x += 1) {
        const wave = Math.sin(x * 0.4 - out * 8) * 1.5;
        px(startX + x, cy + wave, 3, fade);
        px(startX + x, cy + wave + 1, 2, fade);
      }
      const fx = startX + reach;
      for (let dy = -4; dy <= 4; dy += 1) {
        for (let dx = -4; dx <= 4; dx += 1) {
          if (dx * dx + dy * dy <= 18) px(fx + dx, cy + dy, dx > 1 ? 4 : 3, fade);
        }
      }
    } else if (kind === "fruit-mera") {
      // Blazing fire columns & swirling embers
      for (let i = 0; i < 36; i += 1) {
        const ang = i * 0.45 + out * 5.2;
        const dist = (i / 36) * 24;
        const fx = cx + Math.cos(ang) * dist * 1.3;
        const fy = cy + Math.sin(ang) * dist * 0.6 - ((p * 18 + i) % 14) + 5;
        px(fx, fy, i % 4 === 0 ? 4 : 3, fade);
        px(fx, fy + 1, 2, fade);
        px(fx, fy + 2, 1, fade * 0.8);
      }
    } else if (kind === "fruit-hana") {
      // Blooming 5-petal blossoms & swirling petal flurry
      for (let a = 0; a < 60; a += 1) {
        const ang = (a / 60) * Math.PI * 2 + out * 1.6;
        const petal = 6 + Math.abs(Math.cos(ang * 2.5)) * (8 + out * 12);
        px(cx + Math.cos(ang) * petal * 1.3, cy + Math.sin(ang) * petal * 0.8, a % 3 === 0 ? 4 : 3, fade);
        px(cx + Math.cos(ang) * (petal - 2) * 1.3, cy + Math.sin(ang) * (petal - 2) * 0.8, 2, fade);
      }
    } else if (kind === "fruit-ope") {
      // Expanding spherical ROOM grid & surgical slash lines
      const dome = Math.min(20, 6 + out * 18);
      for (let y = -dome; y <= dome; y += 4) {
        const span = Math.sqrt(Math.max(0, dome * dome - y * y)) * 1.4;
        for (let x = -span; x <= span; x += 2) px(cx + x, cy + y, 2, fade * 0.75);
      }
      for (let d = -26; d <= 26; d += 1) {
        px(cx + d, cy - (d >> 1), 4, fade);
        px(cx - d, cy - (d >> 1), 3, fade);
      }
    } else if (kind === "fruit-bara") {
      // Segmented floating slices splitting apart
      for (let s = -2; s <= 2; s += 1) {
        const shift = s * (4 + out * 8) * (s & 1 ? 1 : -1);
        const sy = cy + s * 4;
        for (let x = -9; x <= 9; x += 1) {
          px(cx + shift + x, sy, Math.abs(x) > 6 ? 4 : 3, fade);
          px(cx + shift + x, sy + 1, 2, fade);
        }
      }
    } else if (kind === "fruit-yami") {
      // Dark gravity black hole pulling particles inward
      for (let i = 0; i < 34; i += 1) {
        const ang = i * 0.55 - out * 4.8;
        const dist = (1 - out * 0.82) * (6 + (i % 7) * 3.5);
        px(cx + Math.cos(ang) * dist * 1.4, cy + Math.sin(ang) * dist * 0.8, i % 5 === 0 ? 4 : 2, fade);
        px(cx + Math.cos(ang) * dist * 1.4 + 1, cy + Math.sin(ang) * dist * 0.8, 0, 1);
      }
      for (let y = -4; y <= 4; y += 1) {
        for (let x = -5; x <= 5; x += 1) if (x * x + y * y <= 18) px(cx + x, cy + y, x * x + y * y > 10 ? 3 : 0, 1);
      }
    } else if (kind === "fruit-nagi") {
      // Soundproof dome damping outer waves into a flat silent line
      const amp = Math.max(0, (1 - out * 1.3) * 7);
      for (let x = -32; x <= 32; x += 1) {
        const y = Math.round(Math.sin(x * 0.35 + p * 10) * amp);
        px(cx + x, cy + y, Math.abs(y) <= 1 ? 4 : 3, fade);
      }
    } else if (kind === "fruit-goro") {
      // High-voltage lightning arcs & electric plasma ring
      for (let b = 0; b < 7; b += 1) {
        const ang = (b / 7) * Math.PI * 2 + p * 3;
        const reach = 8 + out * 26;
        for (let r = 2; r < reach; r += 1) {
          const zig = ((r + b * 5) & 3) === 0 ? 3 : -2;
          px(cx + Math.cos(ang) * r * 1.4 + zig, cy + Math.sin(ang) * r * 0.8 - (zig >> 1), r % 3 === 0 ? 4 : 3, fade);
        }
      }
    } else if (kind === "fruit-hie") {
      // Six-pointed ice crystal & freezing frost shards
      for (let b = 0; b < 6; b += 1) {
        const ang = (b / 6) * Math.PI * 2;
        const reach = 6 + out * 22;
        for (let r = 0; r < reach; r += 1) {
          const x = cx + Math.cos(ang) * r * 1.3;
          const y = cy + Math.sin(ang) * r * 0.85;
          px(x, y, r > reach - 4 ? 4 : 3, fade);
          if (r === 8 || r === 14) {
            px(x + Math.cos(ang + 1) * 3, y + Math.sin(ang + 1) * 2, 4, fade);
            px(x + Math.cos(ang - 1) * 3, y + Math.sin(ang - 1) * 2, 4, fade);
          }
        }
      }
    } else if (kind === "fruit-suna") {
      // Whirling desert sandstorm vortex
      for (let i = 0; i < 48; i += 1) {
        const ang = i * 0.38 + out * 7;
        const r = (i / 48) * (8 + out * 22);
        px(cx + Math.cos(ang) * r * 1.4, cy + Math.sin(ang) * r * 0.65 + (i % 3) - 1, i % 4 === 0 ? 4 : 3, fade);
      }
    } else if (kind === "fruit-pika") {
      // Eight-ray golden light flash & laser beams
      for (let b = 0; b < 8; b += 1) {
        const ang = (b / 8) * Math.PI * 2;
        const reach = (b & 1 ? 14 : 26) * (0.4 + out * 0.7);
        for (let r = 0; r < reach; r += 1) {
          px(cx + Math.cos(ang) * r * 1.4, cy + Math.sin(ang) * r * 0.85, r < 6 ? 4 : 3, fade);
        }
      }
    } else if (kind === "fruit-moku") {
      // Billowing white smoke puffs expanding outward
      for (let i = 0; i < 9; i += 1) {
        const ang = (i / 9) * Math.PI * 2 + out * 1.2;
        const px0 = cx + Math.cos(ang) * out * 20;
        const py0 = cy + Math.sin(ang) * out * 10 - out * 4;
        for (let dy = -3; dy <= 3; dy += 1) {
          for (let dx = -4; dx <= 4; dx += 1) if (dx * dx + dy * dy <= 14) px(px0 + dx, py0 + dy, dx + dy < 0 ? 4 : 2, fade);
        }
      }
    } else if (kind === "fruit-yuki") {
      // Swirling blizzard snowflakes
      for (let i = 0; i < 24; i += 1) {
        const sx = cx + Math.sin(i * 1.7 + out * 4) * (6 + (i % 6) * 5);
        const sy = cy + Math.cos(i * 1.3 + out * 3) * (3 + (i % 5) * 3);
        px(sx, sy, 4, fade); px(sx + 1, sy, 3, fade); px(sx - 1, sy, 3, fade); px(sx, sy + 1, 3, fade); px(sx, sy - 1, 3, fade);
      }
    } else if (kind === "fruit-gasu") {
      // Rising toxic violet gas bubbles & haze
      for (let i = 0; i < 16; i += 1) {
        const bx = cx + Math.sin(i * 2.1 + out * 3) * (4 + (i % 7) * 4);
        const by = cy + 10 - ((out * 24 + i * 3) % 24);
        for (let a = 0; a < 8; a += 1) px(bx + Math.cos(a * 0.8) * 3, by + Math.sin(a * 0.8) * 2, i & 1 ? 4 : 3, fade);
      }
    } else if (kind === "fruit-gura") {
      // Shattering air cracks radiating from impact fist
      for (let b = 0; b < 7; b += 1) {
        const ang = (b / 7) * Math.PI * 2 + 0.2;
        const reach = 8 + out * 26;
        for (let r = 3; r < reach; r += 1) {
          const kink = r > 11 ? ((b & 1 ? 1 : -1) * 3) : 0;
          px(cx + Math.cos(ang) * r * 1.4, cy + Math.sin(ang) * r * 0.8 + kink, 4, fade);
          px(cx + Math.cos(ang) * r * 1.4 + 1, cy + Math.sin(ang) * r * 0.8 + kink, 2, fade);
        }
      }
    } else if (kind === "fruit-ito") {
      // Razor-sharp crisscrossing strings slicing the frame
      for (let s = -3; s <= 3; s += 1) {
        const y0 = cy + s * 4;
        const span = Math.round(12 + out * 22);
        for (let x = -span; x <= span; x += 1) {
          px(cx + x, y0 + ((x * s) >> 3), Math.abs(x) > span - 4 ? 4 : 3, fade);
        }
      }
    } else if (kind === "fruit-mochi") {
      // Thick stretching mochi rings & heavy fist impact
      for (let r = 4; r <= 14; r += 5) {
        const radM = r + out * 10;
        for (let a = 0; a < 36; a += 1) {
          const ang = (a / 36) * Math.PI * 2;
          px(cx + Math.cos(ang) * radM * 1.3, cy + Math.sin(ang) * radM * 0.75, r === 4 ? 4 : 3, fade);
          px(cx + Math.cos(ang) * radM * 1.3, cy + Math.sin(ang) * radM * 0.75 + 1, 2, fade);
        }
      }
    } else if (kind === "fruit-doru") {
      // Hardening candle-wax wall & crown flame
      const wallW = Math.round(6 + out * 18);
      for (let x = -wallW; x <= wallW; x += 1) {
        const drip = (Math.abs(x * 3) % 5) - 2;
        for (let y = -7; y <= 6 + drip; y += 1) px(cx + x, cy + y, y < -4 ? 4 : 3, fade);
      }
      for (let y = -13; y <= -8; y += 1) px(cx, cy + y, 4, fade);
    } else if (kind === "fruit-ori") {
      // Spreading cyan-gold phoenix wings & regeneration sparks
      const span = 6 + out * 24;
      for (let x = 2; x < span; x += 1) {
        const wy = Math.round(-Math.sin((x / span) * Math.PI) * 11 + (x % 3));
        px(cx - x, cy + wy, x % 4 === 0 ? 4 : 3, fade);
        px(cx + x, cy + wy, x % 4 === 0 ? 4 : 3, fade);
        px(cx - x, cy + wy + 2, 2, fade);
        px(cx + x, cy + wy + 2, 2, fade);
      }
    } else if (kind === "fruit") {
      // Swirling pixel vortex & rising arcane orbs
      for (let i = 0; i < 28; i += 1) {
        const ang = i * 0.55 + out * 4.2;
        const dist = (i / 28) * 22 * (1 - p * 0.25);
        px(cx + Math.cos(ang) * dist * 1.4, cy + Math.sin(ang) * dist * 0.8, i % 3 === 0 ? 4 : 3, fade);
        px(cx + Math.cos(ang) * dist * 1.4, cy + Math.sin(ang) * dist * 0.8 + 1, 1, fade);
      }
    } else {
      // Crisp 4-point pixel stars & rising crest motes
      for (let i = 0; i < 8; i += 1) {
        const sx = cx + Math.cos(i * 0.8 + 0.3) * (8 + out * 24);
        const sy = cy + Math.sin(i * 1.1) * (4 + out * 12) - out * 6;
        const arm = p < 0.5 ? 2 : 1;
        for (let d = -arm; d <= arm; d += 1) { px(sx + d, sy, 4, fade); px(sx, sy + d, 4, fade); }
        px(sx + 1, sy + 1, 2, fade);
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

function flyCardTo(card, target, maxOffset = 140) {
  if (!card || !target || target.hidden || !target.getClientRects().length || typeof card.animate !== "function") return null;
  try {
    const from = card.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + Math.min(to.width / 2, maxOffset) - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const anim = card.animate([
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.85}px, ${dy * 0.85}px) scale(.16)`, opacity: 0.75, offset: 0.75 },
      { transform: `translate(${dx}px, ${dy}px) scale(.04)`, opacity: 0 }
    ], { duration: 620, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "forwards" });
    const finish = () => {
      try {
        diceResult("absorb");
        target.classList.remove("fx-hit");
        void target.offsetWidth;
        target.classList.add("fx-hit");
      } catch {}
    };
    if (anim?.finished && typeof anim.finished.then === "function") {
      return anim.finished.then(finish).catch(() => {});
    }
    return new Promise((resolve) => {
      if (anim) {
        anim.onfinish = () => { finish(); resolve(); };
        anim.onerror = () => resolve();
      } else resolve();
    });
  } catch {
    return null;
  }
}

async function playMilestones(milestones) {
  if (!milestones.length) return;
  renderLifeStrip();
  // Acquired powers must remain visible even when animation is disabled.
  const reduced = !motionOn;
  for (let idx = 0; idx < milestones.length; idx += 1) {
    const item = milestones[idx];
    let card;
    let bountyNode = null;
    if (item.kind === "bounty") {
      card = document.createElement("div");
      card.className = "wanted-poster milestone-card milestone-bounty";
      card.setAttribute("role", "status");
      const head = document.createElement("span");
      head.textContent = "WANTED";
      const name = document.createElement("strong");
      name.textContent = item.name;
      const doa = document.createElement("small");
      doa.textContent = "DEAD OR ALIVE";
      bountyNode = document.createElement("b");
      bountyNode.textContent = formatBounty(reduced ? item.to : item.from);
      card.append(head, name, doa, bountyNode);
    } else {
      card = document.createElement("div");
      card.className = `fx-card milestone-card milestone-${item.kind}`;
      card.setAttribute("role", "status");
      if (!reduced) {
        const vfx = document.createElement("canvas");
        vfx.className = "milestone-fx";
        vfx.width = 96;
        vfx.height = 44;
        card.append(vfx);
        playPixelFx(vfx, item.kind === "fruit" ? fruitFxKind(item.title) : item.kind);
      }
      const eyebrow = document.createElement("p");
      eyebrow.className = "fx-title";
      eyebrow.textContent = item.eyebrow;
      const title = document.createElement("strong");
      title.className = "milestone-title";
      title.textContent = item.title;
      const sub = document.createElement("p");
      sub.className = "milestone-sub";
      sub.textContent = item.sub;
      card.append(eyebrow, title, sub);
    }
    if (!reduced) {
      for (let i = 0; i < 16; i += 1) {
        const spark = document.createElement("span");
        spark.className = "dice-spark";
        const angle = (i / 16) * Math.PI * 2;
        spark.style.setProperty("--dx", `${Math.cos(angle) * (95 + (i % 3) * 28)}px`);
        spark.style.setProperty("--dy", `${Math.sin(angle) * (95 + (i % 3) * 28)}px`);
        card.append(spark);
      }
    }
    let overlay = document.querySelector(".fx-overlay");
    const isExisting = Boolean(overlay);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "fx-overlay";
    } else {
      overlay.className = "fx-overlay show";
      overlay.classList.remove("leaving", "bursting", "dice-overlay");
      overlay.replaceChildren();
    }
    overlay.append(card);
    if (!isExisting) {
      document.body.append(overlay);
      requestAnimationFrame(() => overlay.classList.add("show"));
    }
    diceResult(item.kind === "bounty" ? "bounty" : item.kind === "fruit" ? "fruit" : item.kind.startsWith("haki-") ? "haki" : "great");
    let skip;
    let skipped = false;
    const pause = (ms) => new Promise((resolve) => { const timer = setTimeout(resolve, ms); skip = () => { clearTimeout(timer); resolve(); }; });
    overlay.addEventListener("click", () => { skipped = true; skip?.(); }, { once: true });
    if (bountyNode && !reduced) {
      for (let step = 1; step <= 8 && !skipped; step += 1) {
        await pause(65);
        const current = Math.round(item.from + (item.to - item.from) * (step / 8));
        bountyNode.textContent = formatBounty(current);
        diceTick();
      }
      bountyNode.textContent = formatBounty(item.to);
    }
    skipped = false;
    await pause(reduced ? 900 : 1450);
    if (!reduced) {
      const flight = flyCardTo(card, byId(item.targetId), 90);
      overlay.classList.add("bursting");
      if (flight) await Promise.race([flight, pause(800)]);
    }
    const isLast = idx === milestones.length - 1;
    if (isLast) {
      overlay.classList.add("leaving");
      await pause(reduced ? 0 : 220);
      overlay.remove();
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(.86)";
      await pause(120);
      overlay.replaceChildren();
    }
  }
}

async function advanceLife(choiceId) {
  if (playingChanges) return;
  stopTimer();
  try {
    const before = life;
    const prevScene = getScene(life);
    const chose = choiceId !== null && prevScene.choices.length > 0;
    const chosenChoice = chose ? prevScene.choices.find((choice) => choice.id === String(choiceId).split(":")[0]) : null;
    const chosenLabel = chosenChoice?.label || "";
    const chosenRisk = chosenChoice?.risk || "";
    life = advance(life, choiceId);
    if (!devPreset && library.active >= 0) {
      library.lives[library.active] = saveRecord(life);
      persist();
    }
    const milestones = collectMilestones(before, life);
    let statsUpdated = false;
    if (chose || milestones.length) {
      playingChanges = true;
      const watchdog = setTimeout(() => { playingChanges = false; }, 4500);
      try {
        const powerFx = chose ? powerFxForChoice(life, choiceId, chosenLabel, life.lastOutcome, chosenRisk) : null;
        const cleanOutcome = (life.lastOutcome || "").replace(/^주사위 \d+ \(\d+ 이상 성공\) · (?:대성공|성공|실패)\.\s*/, "").trim();
        const hasChanges = Boolean(life.lastChanges?.length || cleanOutcome);
        const hasMilestones = Boolean(milestones.length);

        if (chose && life.lastDice) await playDice(life.lastDice, hasChanges || hasMilestones);
        if (chose && hasChanges) {
          try {
            statsUpdated = await playChanges(life.lastChanges, life.lastOutcome, chosenLabel, powerFx, hasMilestones);
          } catch (error) {
            console.error("선택 결과 연출 오류:", error);
          }
        }
        if (hasMilestones) await playMilestones(milestones);
      } catch (error) {
        // Keep progression alive and report an animation failure for diagnosis.
        console.error("성장 알림 연출 오류:", error);
      } finally {
        clearTimeout(watchdog);
        playingChanges = false;
        const leftover = document.querySelector(".fx-overlay");
        if (leftover) leftover.remove();
      }
    }
    if (life.finished) renderEnding();
    else renderGame(true, statsUpdated, before.location !== life.location ? life.location : "");
  } catch (error) {
    playingChanges = false;
    byId("scene-hint").textContent = error.message;
    try {
      renderGame(false);
    } catch {}
    scheduleObservation();
  }
}

function renderEnding() {
  stopTimer();
  observation = null;
  showSection("ending");
  setMood("ending");
  // Rule 7 also closes lives in prison, lost at sea, or alive at the original present.
  const closing = life.creationVersion >= 7 && { prison: "갇힌 채 멈춘 기록", missing: "돌아오지 않은 배", present: "원작의 현재에 닿은 삶" }[life.ending];
  const completeLife = life.rules === 3 && (life.ending === "death" || Boolean(closing));
  const title = closing || (completeLife ? life.deathCause === "어린 날의 해난 사고" ? "짧게 끝난 생애" : "한 생애의 끝"
    : life.ending === "death" ? "돌아오지 못한 삶" : life.ending === "retire" ? "넘겨준 자리" : "아직 열린 이야기");
  const speciesArt = { 어인: "fishman", 밍크족: "mink", "하늘섬 사람": "sky", 거인족: "giant" }[life.birth.species];
  const art = completeLife ? ART.legacy : speciesArt ? ART[life.ending === "death" ? `${speciesArt}Crisis` : speciesArt]
    : life.ending === "death" ? ART.rescue : life.ending === "retire" ? ART.retirement : ART.harbor;
  byId("ending-title").textContent = `${life.birth.name}의 기록 · ${title}`;
  byId("ending-image").src = art.src;
  byId("ending-image").alt = art.alt;
  byId("ending-lead").textContent = closing
    ? life.ending === "present"
      ? `${life.age}세, 원작이 그린 마지막 시간(${life.canonChapter}화)에 닿았습니다. 이 뒤의 바다는 아직 공개되지 않았습니다.`
      : `${life.age}세에 ${life.deathCause}. 그 뒤의 날들은 일지에 적히지 않았습니다.`
    : completeLife
    ? `${life.age}세에 ${life.deathCause}로 생을 마쳤습니다. 일지에는 선택한 길과 마지막 날까지 남은 사람이 기록되어 있습니다.`
    : life.ending === "death"
    ? "처음의 손실과 마지막 선택이 남긴 것을 사람들의 시선에서 기록합니다. 목표의 미래를 대신 완성하지 않습니다."
    : life.ending === "retire" ? "일을 다음 사람에게 넘겼습니다. 그 뒤의 길은 그들이 결정합니다."
      : "현재까지의 삶을 한 장으로 닫습니다. 아직 일어나지 않은 원작의 미래는 쓰지 않습니다.";
  byId("ending-poster").hidden = !(life.creationVersion >= 4 && life.bounty > 0);
  if (life.creationVersion >= 4 && life.bounty > 0) {
    byId("poster-name").textContent = life.birth.name;
    byId("poster-bounty").textContent = formatBounty(life.bounty);
  }
  byId("ending-birth").textContent = `${life.birth.species} · ${life.birth.gender} · ${life.birth.home}`;
  byId("ending-mode").textContent = modeName(life.mode);
  byId("ending-work").textContent = `${life.affiliation} · ${life.role}`;
  byId("ending-fruit").textContent = life.devilFruit ? `${life.devilFruit} · 숙련 ${life.fruitMastery}` : "비능력자";
  const haki = life.haki || {};
  byId("ending-haki").textContent = [haki.observation && `견문색 ${haki.observation}단계`, haki.armament && `무장색 ${haki.armament}단계`,
    haki.conqueror && `패왕색 ${haki.conqueror}단계`].filter(Boolean).join(" · ") || "익히지 못함";
  byId("ending-last-power").textContent = lastPower();
  const fates = fateLegacy(life);
  byId("ending-fates-row").hidden = !fates.length;
  byId("ending-fates").textContent = fates.join(" · ");
  renderTimeline();
  byId("ending-goal").textContent = completeLife ? life.goal : `${life.goal} · ${life.ending === "death" ? "미완" : life.ending === "retire" ? "책임 승계" : "진행 중"}`;
  byId("ending-personality").textContent = personalitySummary(life.personality);
  const route = (life.travelHistory || [life.birth.home]).filter((place, index, all) => place !== all[index - 1]);
  byId("ending-route").textContent = `${route.join(" → ")} (${new Set(route).size}곳)`;
  byId("ending-bonds").textContent = life.creationVersion >= 3
    ? [peopleSummary(life), canonRelationshipSummary(life)].filter(Boolean).join(" · ") || "곁에 남은 이름 없이 혼자 걸은 삶"
    : `옛 친구 ${life.friendName || "린"}(${life.friendBond > 1 ? "지속된 인연" : "서로 다른 길"})`;
  window.scrollTo(0, 0);
}

function openJournal() {
  stopTimer();
  const current = byId("journal-current");
  const past = byId("journal-past");
  const activeLife = life && byId("birth").hidden ? life : null;
  current.replaceChildren();
  past.replaceChildren();
  if (activeLife) {
    const heading = document.createElement("h3");
    heading.textContent = `${activeLife.birth.name}의 지나온 장면`;
    current.append(heading);
    const list = document.createElement("ol");
    for (const entry of activeLife.journal) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${entry.age}세 · ${entry.timeLabel ? `${entry.timeLabel} · ` : ""}${entry.title}`;
      item.append(title);
      if (entry.choice) {
        const choice = document.createElement("p");
        choice.textContent = `선택: ${entry.choice}`;
        item.append(choice);
      }
      if (entry.result) {
        const result = document.createElement("small");
        result.textContent = [entry.result, describeChanges(entry.changes || [])].filter(Boolean).join(" · ");
        item.append(result);
      }
      const card = scenes.find((scene) => scene.id === entry.id);
      const canon = entry.canon || card?.canon;
      if (canon) {
        const source = document.createElement("a");
        source.href = canon;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = "원작 근거";
        item.append(source);
      }
      list.append(item);
    }
    current.append(list);
  }
  if (library.lives.length > (activeLife ? 1 : 0)) {
    const heading = document.createElement("h3");
    heading.textContent = "다른 생애";
    past.append(heading);
    library.lives.forEach((record, index) => {
      if (activeLife && index === library.active) return;
      try {
        const pastLife = safeReplay(record);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "past-life";
        const label = document.createElement("span");
        label.textContent = `${pastLife.birth.name} · ${pastLife.birth.home} · ${modeName(pastLife.mode)}`;
        const status = document.createElement("span");
        status.textContent = pastLife.finished ? "완료" : `${pastLife.age}세 진행 중`;
        button.append(label, status);
        button.addEventListener("click", () => {
          library.active = index;
          life = pastLife;
          persist();
          byId("journal").close();
          if (life.finished) renderEnding();
          else renderGame(true);
        });
        past.append(button);
      } catch {
        const warning = document.createElement("p");
        warning.textContent = "읽을 수 없는 과거 기록이 있습니다. 기록은 삭제하지 않았습니다.";
        past.append(warning);
      }
    });
  }
  byId("journal").showModal();
  scheduleObservation();
}

function updateNameInput() {
  const custom = byId("profile-name-mode").value === "custom";
  byId("profile-name-input").hidden = !custom;
  byId("profile-name-input").disabled = !custom;
  if (custom) byId("profile-name-input").focus();
}

function updateHomeOptions() {
  const species = byId("profile-species").value;
  const select = byId("profile-home");
  select.replaceChildren(new Option(species === "random" ? "종족과 함께 무작위" : "무작위", "random"));
  if (species !== "random") {
    for (const home of PROFILE_OPTIONS.homes[species]) select.add(new Option(home, home));
  }
  select.disabled = species === "random";
  byId("home-hint").textContent = species === "random"
    ? "고향을 직접 고르려면 종족을 먼저 선택하세요."
    : `${species}의 고향에서 고르거나 무작위로 둘 수 있습니다.`;
}

function selectedProfile() {
  const profile = {};
  if (byId("profile-name-mode").value === "custom") profile.name = byId("profile-name-input").value;
  for (const key of ["gender", "species", "home", "means"]) {
    const value = byId(`profile-${key}`).value;
    if (value !== "random") profile[key] = value;
  }
  return profile;
}

byId("growth-toggle").addEventListener("click", () => {
  const open = byId("growth-toggle").getAttribute("aria-expanded") !== "true";
  byId("growth-toggle").setAttribute("aria-expanded", String(open));
  byId("growth-toggle").textContent = open ? "능력·성격 접기" : "능력·성격 펼치기";
  byId("growth-panels").classList.toggle("open", open);
});
byId("profile-name-mode").addEventListener("change", updateNameInput);
byId("profile-species").addEventListener("change", updateHomeOptions);
byId("all-random").addEventListener("click", () => {
  for (const key of ["name-mode", "gender", "species", "means"]) byId(`profile-${key}`).value = "random";
  byId("profile-name-input").value = "";
  updateNameInput();
  updateHomeOptions();
  byId("profile-error").hidden = true;
});

function rollBirth() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  try {
    life = createGame(mode, seed, selectedProfile());
    byId("profile-error").hidden = true;
  } catch (error) {
    byId("profile-error").textContent = error.message;
    byId("profile-error").hidden = false;
    return false;
  }
  renderBirth();
  window.scrollTo(0, 0);
  return true;
}

let devPreset = false;

byId("start").addEventListener("click", rollBirth);
byId("birth-reroll").addEventListener("click", () => { diceTick(); rollBirth(); });
byId("birth-back").addEventListener("click", () => { renderIntro(); window.scrollTo(0, 0); });
byId("birth-confirm").addEventListener("click", () => {
  devPreset = false;
  library.lives.push(saveRecord(life));
  library.active = library.lives.length - 1;
  persist();
  paused = false;
  observation = null;
  byId("pause").setAttribute("aria-pressed", "false");
  byId("pause").textContent = "자동 진행 멈추기";
  renderGame(true);
  window.scrollTo(0, 0);
});

byId("resume").addEventListener("click", () => {
  devPreset = false;
  try {
    life = safeReplay(library.lives[library.active]);
    persist();
    observation = null;
    if (life.finished) renderEnding();
    else renderGame(true);
  } catch {
    showStorageMessage("기록을 복원하지 못했습니다. 새 생애를 시작해 주세요.");
    byId("resume").hidden = true;
  }
});

byId("speed").addEventListener("change", (event) => { speed = Number(event.target.value); scheduleObservation(); });
byId("pause").addEventListener("click", () => {
  if (observation) observation = tickObservation(observation, performance.now(), speed, !paused && !document.hidden && !byId("journal").open);
  paused = !paused;
  byId("pause").setAttribute("aria-pressed", String(paused));
  byId("pause").textContent = paused ? "자동 진행 계속하기" : "자동 진행 멈추기";
  if (life && !life.finished) renderGame();
});
byId("journal-open").addEventListener("click", openJournal);
byId("ending-journal").addEventListener("click", openJournal);
byId("journal-close").addEventListener("click", () => byId("journal").close());
byId("journal").addEventListener("close", scheduleObservation);
byId("ending-new").addEventListener("click", () => { renderIntro(); window.scrollTo(0, 0); });
document.addEventListener("visibilitychange", scheduleObservation);

if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
  const bar = document.createElement("div");
  bar.className = "dev-patch-bar";
  bar.style.cssText = "display:flex;gap:6px;align-items:center;font-size:12px;margin-left:auto;";

  const label = document.createElement("span");
  label.style.cssText = "font-weight:700;color:var(--copper);white-space:nowrap;font-size:11px;";
  label.textContent = "패치 테스트:";

  const select = document.createElement("select");
  select.id = "dev-patch-select";
  select.style.cssText = "min-height:28px;padding:2px 8px;border:1px solid var(--line);background:var(--paper);color:var(--ink);font-size:12px;border-radius:2px;cursor:pointer;max-width:250px;";

  const jumpTo = (sceneId, seed, patch) => {
    devPreset = true;
    life = createGame("free", seed, { name: "테스트", species: "인간" });
    const index = scenes.findIndex((s) => s.id === sceneId);
    const card = scenes[index];
    Object.assign(life, {
      ...(index >= 0 ? { index, age: typeof card.age === "function" ? card.age(life) : card.age } : { index: scenes.length, age: 80 }),
      skill: 65,
      health: 80,
      supplies: 60,
      bond: 60,
      friendBond: 60,
      trust: 70,
      ...patch
    });
    observation = null;
    renderGame(true);
  };

  const PATCH_OPTIONS = [
    {
      group: "서사 모순 해결 및 지휘관 시점",
      items: [
        { label: "선장 명령과 결단 (사령실)", fn: () => jumpTo("life_orders", 3, { path: "pirate", job: "해적단 선장", affiliation: "독립 해적단", role: "선장", independent: true, skill: 70 }) },
        { label: "해군 장교 현장 판단 (지휘관)", fn: () => jumpTo("life_orders", 3, { path: "marine", job: "해군 장교", affiliation: "해군 G-5 지부", role: "소령", rankTier: 3, skill: 70 }) },
        { label: "28년 만의 라이벌 굴복 (사황 위압)", fn: () => jumpTo("life_rival_return", 3, { path: "pirate", job: "사황", affiliation: "독립 해적단", role: "사황", bounty: 3_500_000_000, rival: true, skill: 90 }) },
        { label: "비능력자(순수인간) 수련 선택지", fn: () => jumpTo("life_fruit_find", 3, { path: "pirate", job: "해적", affiliation: "독립 해적단", role: "선원", skill: 60 }) }
      ]
    },
    {
      group: "거물 영지 통치 및 IF 분기",
      items: [
        { label: "사황 영지와 깃발 선언", fn: () => jumpTo("life_emperor_decree", 3, { path: "pirate", job: "사황", affiliation: "독립 해적단", role: "사황", worldBranch: "emperor", bounty: 3_500_000_000, skill: 90 }) },
        { label: "해군 대장의 정의와 결단", fn: () => jumpTo("life_admiral_verdict", 3, { path: "marine", job: "해군 대장", affiliation: "해군 본부", role: "해군 대장", worldBranch: "admiral", rankTier: 5, skill: 90 }) },
        { label: "혁명군 군대장의 결단", fn: () => jumpTo("life_liberator_strike", 3, { path: "liberator", job: "혁명군 군대장", affiliation: "혁명군", role: "혁명군 군대장", worldBranch: "commander", skill: 90 }) },
        { label: "드레스로자 조기 사황 IF (5억 현상금)", fn: () => {
          devPreset = true;
          life = createGame("free", 3, { name: "테스트", species: "인간" });
          Object.assign(life, {
            index: 999,
            age: 45,
            preCanonStep: 99,
            canonStep: 5,
            path: "pirate",
            job: "해적단 선장",
            affiliation: "독립 해적단",
            role: "선장",
            independent: true,
            bounty: 600_000_000,
            skill: 80,
            health: 80,
            trust: 80
          });
          observation = null;
          renderGame(true);
        } }
      ]
    },
    {
      group: "잠든 시스템 연동 사건",
      items: [
        { label: "샤본디 제도 삽화 및 쿠마 사건", fn: () => jumpTo("canon_before_sabaody_scatter", 3, { path: "pirate", location: "샤본디 제도", leftHome: true }) },
        { label: "소꿉친구 부두 성인 재회", fn: () => jumpTo("life_friend_reunion", 3, { path: "pirate", job: "해적단 선장", affiliation: "독립 해적단", role: "선장", friendName: "타로", friendBond: 65, skill: 70 }) },
        { label: "해군 본부 수감 실적 특별 포상", fn: () => jumpTo("life_marine_commendation", 3, { path: "marine", job: "해군 장교", affiliation: "해군 본부", role: "대령", rankTier: 4, arrestCount: 3, skill: 75 }) },
        { label: "바다를 뒤흔든 악명 군함 대치", fn: () => jumpTo("life_infamy_standoff", 3, { path: "pirate", job: "해적단 선장", affiliation: "독립 해적단", role: "선장", reputation: -35, bounty: 250_000_000, skill: 75 }) },
        { label: "야망 70+ 거대 세력 패권 도전", fn: () => jumpTo("life_personality_ambition", 3, { path: "pirate", job: "해적단 선장", affiliation: "독립 해적단", role: "선장", bounty: 450_000_000, personality: { ambition: 75, freedom: 60, empathy: 40, loyalty: 50, caution: 30 }, skill: 80 }) },
        { label: "원작 모드 인물 관계망 (루피/조로 접점)", fn: () => {
          devPreset = true;
          life = createGame("original", 3, { name: "테스트", species: "인간" });
          Object.assign(life, {
            age: 42,
            path: "pirate",
            job: "해적",
            affiliation: "독립 해적단",
            role: "선원",
            people: {
              canonContacts: {
                luffy: { score: 35, meetings: 2 },
                zoro: { score: 20, meetings: 1 },
                ace: { score: 15, meetings: 1 }
              }
            }
          });
          observation = null;
          renderGame(true);
        } }
      ]
    },
    {
      group: "종합 결과 및 엔딩",
      items: [
        { label: "개편 종합 생애 일지 엔딩", fn: () => {
          devPreset = true;
          life = Object.assign(createGame("free", 3, { name: "테스트", species: "인간" }), {
            age: 62, careerStartAge: 19, path: "pirate", job: "사황", affiliation: "독립 해적단", role: "사황", worldBranch: "emperor",
            devilFruit: null, pureHuman: true, haki: { observation: 2, armament: 2, conqueror: 1 }, bounty: 3_500_000_000, reputation: 65,
            people: {
              mate: { name: "도윈", bond: 75, fate: "곁", together: true },
              canonContacts: { luffy: { score: 50, meetings: 3, lastOrder: 1 }, zoro: { score: 35, meetings: 2 } }
            },
            ending: "present", finished: true,
            journal: [
              { id: "life_career", age: 19, title: "처음 고른 소속", choice: "동료와 작은 해적단을 꾸린다" },
              { id: "life_fruit_find", age: 27, title: "물결에 밀려온 상자", choice: "열매를 사양하고 바다와 호흡하는 단련을 택한다" },
              { id: "life_orders", age: 30, title: "명령과 판단", choice: "선원들의 뜻을 따라 항로를 유지한다" },
              { id: "life_haki_training", age: 38, title: "기척을 읽는 수련", choice: "신체와 패기의 극한을 연마한다" },
              { id: "life_free_rank", age: 45, title: "와노국 이후의 새 자리", choice: "사황의 자리를 노린다" },
              { id: "life_emperor_decree", age: 50, title: "사황의 영역과 깃발", choice: "가맹하지 못한 섬들에게 깃발을 빌려주고 보호한다" },
              { id: "canon_arc_egghead_0", age: 62, title: "미래섬을 흔든 방송" }
            ]
          });
          renderEnding();
        } }
      ]
    }
  ];

  const actionsMap = new Map();
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "패치 테스트 선택...";
  select.append(defaultOption);

  PATCH_OPTIONS.forEach((grp, gIdx) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = grp.group;
    grp.items.forEach((item, iIdx) => {
      const key = `${gIdx}_${iIdx}`;
      actionsMap.set(key, item.fn);
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = item.label;
      optgroup.append(opt);
    });
    select.append(optgroup);
  });

  const executeCurrent = () => {
    const fn = actionsMap.get(select.value);
    if (fn) fn();
  };

  select.addEventListener("change", executeCurrent);

  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.className = "text-button";
  runBtn.textContent = "이동";
  runBtn.style.cssText = "min-height:28px;padding:2px 10px;border:1px solid var(--copper);color:var(--copper);background:transparent;cursor:pointer;font-weight:700;font-size:12px;";
  runBtn.addEventListener("click", executeCurrent);

  bar.append(label, select, runBtn);
  document.querySelector(".masthead").append(bar);
}

function preloadArt() {
  if (typeof Image === "undefined") return;
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 60));
  idle(() => {
    for (const art of Object.values(ART)) {
      if (art?.src) {
        const img = new Image();
        img.src = art.src;
        if (typeof img.decode === "function") img.decode().catch(() => {});
      }
    }
  });
}

loadLibrary();
initMotion(byId("motion-toggle"));
initMusic(byId("sound-toggle"), byId("sound-volume"));
renderIntro();
preloadArt();
