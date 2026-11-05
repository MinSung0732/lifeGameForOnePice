import { ART, PERSONALITY, PROFILE_OPTIONS, STATS, advance, createGame, getScene, personalitySummary, replay, saveRecord } from "./game.js";
import { crewNews } from "./world.js";
import { peopleSummary } from "./people.js";
import { crewLine } from "./crew.js";
import { CANON_BEAT_COUNT, canonStatus } from "./canon-events.js";
import { formatBounty } from "./bounty.js";
import { preCanonStatus } from "./canon-before.js";
import { createObservation, tickObservation } from "./observation.js";
import { scenes } from "./story.js";

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

function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.lives) ||
      !Number.isInteger(saved.active) || saved.active < -1 || saved.active >= saved.lives.length) {
      throw new Error("저장 목록 형식이 맞지 않습니다.");
    }
    if (saved.active >= 0) replay(saved.lives[saved.active]);
    library = saved;
  } catch {
    storageUnavailable = true;
    showStorageMessage("기존 저장 기록을 읽을 수 없습니다. 기록을 보호하기 위해 이번 플레이는 브라우저를 닫으면 저장되지 않습니다.");
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
  shell.classList.toggle("intro-screen", section === "intro");
  shell.classList.toggle("game-screen", section === "game");
  byId("intro").hidden = section !== "intro";
  byId("game").hidden = section !== "game";
  byId("ending").hidden = section !== "ending";
  byId("journal-open").hidden = library.lives.length === 0;
}

function renderIntro() {
  stopTimer();
  observation = null;
  showSection("intro");
  const hasActive = library.active >= 0;
  byId("resume").hidden = !hasActive;
  if (hasActive) {
    try {
      const savedLife = replay(library.lives[library.active]);
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
  byId("life-crew").textContent = byId("life-crew").title = crewLine(life);
}

function powerSummary() {
  const haki = life.haki || { observation: 0, armament: 0, conqueror: 0 };
  const learned = [
    haki.observation && `견문색 ${haki.observation}`,
    haki.armament && `무장색 ${haki.armament}`,
    haki.conqueror && `패왕색 ${haki.conqueror}`
  ].filter(Boolean);
  return [life.devilFruit ? "열매 능력자" : "비능력자", ...learned].join(" · ");
}

function statLabel(stat) {
  if (stat.key === "bounty") return "현상금";
  if (stat.key.startsWith("personality.")) return PERSONALITY.find((entry) => entry.key === stat.key.slice(12))?.label || stat.key;
  if (stat.key === "bond") return `${life.guardianName || "준"}${life.rules === 3 ? "와의" : "과의"} 유대`;
  if (stat.key === "friendBond") {
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

function renderStats() {
  const grid = byId("stats-grid");
  grid.replaceChildren();
  const birthStats = life.birthStats;
  const signed = (value) => `${value >= 0 ? "+" : ""}${value}`;
  byId("birth-stat-source").textContent = birthStats
    ? `종족/개인차 · 기술 ${birthStats.species.skill}${signed(birthStats.individual.skill)}, 건강 ${birthStats.species.health}${signed(birthStats.individual.health)}`
    : "";
  for (const stat of STATS) {
    const max = life.rules === 3 ? stat.max : stat.key === "health" ? 3 : 5;
    const value = Math.max(0, Math.min(max, life[stat.key]));
    appendMeter(grid, statLabel(stat), value, max, `stat-${stat.key}`, changeOf(stat.key));
  }
}

function renderPersonality() {
  const grid = byId("personality-grid");
  grid.replaceChildren();
  for (const trait of PERSONALITY) appendMeter(grid, trait.label, life.personality[trait.key], 100, `trait-${trait.key}`, changeOf(`personality.${trait.key}`));
  byId("personality-summary").textContent = `성향 · ${personalitySummary(life.personality)}`;
}

function renderAgeTimeline(scene) {
  const age = scene.age;
  const current = life.birth.yearsBeforeCurrent;
  byId("timeline-age").textContent = scene.timeLabel ? `${age}세 · ${scene.timeLabel}` : `${age}세`;
  byId("timeline-end").textContent = age <= current ? `원작 현재: ${current}세` : `원작 현재 이후 ${age - current}년 · 이후 미공개`;
  byId("age-fill").style.width = `${Math.min(100, age / current * 100)}%`;
  byId("age-progress").setAttribute("aria-valuemax", String(current));
  byId("age-progress").setAttribute("aria-valuenow", String(Math.min(age, current)));
  byId("age-progress").setAttribute("aria-valuetext", age <= current
    ? `${age}세, 원작 현재까지 ${current - age}년` : `${age}세, 원작 현재 이후 ${age - current}년`);
}

function renderGame(focusTitle = false) {
  const scene = getScene(life);
  if (!scene) return renderEnding();
  showSection("game");
  byId("game").classList.toggle("has-choices", scene.choices.length > 0 || scene.manual);
  byId("game").classList.toggle("many-choices", scene.choices.length >= 4);
  const passage = life.journal.length === 0 ? "태어난 해" : scene.age === life.age ? "같은 해" : `${scene.age - life.age}년 후`;
  byId("scene-location").textContent = `${life.location} · ${modeName(life.mode)} · ${life.birth.name}`;
  byId("scene-chapter").textContent = `${life.journal.length + 1}번째 장면 · ${scene.timeLabel || passage}`;
  byId("scene-title").textContent = scene.title;
  byId("scene-body").textContent = scene.body;
  byId("scene-image").src = scene.art.src;
  byId("scene-image").alt = scene.art.alt;
  byId("route-trail").textContent = (life.travelHistory || [life.birth.home]).join(" → ");
  byId("crew-line").hidden = life.rules !== 3;
  byId("crew-news").textContent = byId("crew-news").title = life.rules === 3
    ? life.creationVersion >= 4 && life.seen.includes("life_marineford_news")
      && (life.creationVersion >= 5 || life.canonStep < CANON_BEAT_COUNT)
      ? canonStatus(life)
      : life.creationVersion >= 5 && !life.seen.includes("life_marineford_news")
        && scene.age >= life.birth.yearsBeforeCurrent - 2
        ? preCanonStatus(life) : crewNews(life, scene.age) : "";
  const changeText = describeChanges(life.lastChanges);
  byId("scene-result").textContent = [life.lastOutcome, changeText].filter(Boolean).join(" · ");
  byId("scene-result").hidden = !life.lastOutcome && !changeText;
  renderLifeStrip();
  renderStats();
  renderPersonality();
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
      rule.textContent = "조건 부족 · 1~100 굴림";
      const fail = document.createElement("small");
      fail.textContent = `실패 시 ${choice.failRisk}`;
      dice.append(goal, rule, fail);
      button.append(dice);
    }
    button.append(arrow);
    button.addEventListener("click", () => choice.naming ? askCrewName(choice) : advanceLife(choice.id));
    choices.append(button);
  }
  if (scene.manual) {
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

// After a choice the screen dims, a card lists what changed, then it flies into the stat panel.
async function playChanges(changes) {
  if (!changes.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const overlay = document.createElement("div");
  overlay.className = "fx-overlay";
  const card = document.createElement("div");
  card.className = "fx-card";
  card.setAttribute("role", "status");
  const heading = document.createElement("p");
  heading.className = "fx-title";
  heading.textContent = "이번 선택으로";
  const list = document.createElement("ul");
  for (const { key, delta } of changes) {
    const item = document.createElement("li");
    item.className = delta > 0 ? "up" : "down";
    const name = document.createElement("span");
    name.textContent = key === "bounty" ? "현상금" : statLabel(STATS.find((entry) => entry.key === key) || { key });
    const amount = document.createElement("strong");
    amount.textContent = key === "bounty" ? `${delta > 0 ? "+" : ""}${formatBounty(delta)}` : `${delta > 0 ? "+" : ""}${delta}`;
    item.append(name, amount);
    list.append(item);
  }
  card.append(heading, list);
  overlay.append(card);
  document.body.append(overlay);
  let skip;
  const pause = (ms) => new Promise((resolve) => { const timer = setTimeout(resolve, ms); skip = () => { clearTimeout(timer); resolve(); }; });
  overlay.addEventListener("click", () => skip?.());
  requestAnimationFrame(() => overlay.classList.add("show"));
  await pause(reduced ? 900 : 1300);
  const target = byId("stats-grid").getBoundingClientRect();
  const from = card.getBoundingClientRect();
  card.style.transform = `translate(${target.left + target.width / 2 - (from.left + from.width / 2)}px, ${target.top + target.height / 2 - (from.top + from.height / 2)}px) scale(0.12)`;
  overlay.classList.add("leaving");
  await pause(reduced ? 0 : 560);
  overlay.remove();
}

async function advanceLife(choiceId) {
  if (playingChanges) return;
  stopTimer();
  try {
    const chose = choiceId !== null && getScene(life).choices.length > 0;
    life = advance(life, choiceId);
    library.lives[library.active] = saveRecord(life);
    persist();
    if (chose) {
      playingChanges = true;
      try { await playChanges(life.lastChanges); } finally { playingChanges = false; }
    }
    if (life.finished) renderEnding();
    else renderGame(true);
  } catch (error) {
    byId("scene-hint").textContent = error.message;
    scheduleObservation();
  }
}

function renderEnding() {
  stopTimer();
  observation = null;
  showSection("ending");
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
  byId("ending-work").textContent = `${life.job} · ${life.affiliation} · ${life.role} · ${powerSummary()}`;
  byId("ending-goal").textContent = completeLife ? life.goal : `${life.goal} · ${life.ending === "death" ? "미완" : life.ending === "retire" ? "책임 승계" : "진행 중"}`;
  byId("ending-personality").textContent = personalitySummary(life.personality);
  const route = (life.travelHistory || [life.birth.home]).filter((place, index, all) => place !== all[index - 1]);
  byId("ending-route").textContent = `${route.join(" → ")} (${new Set(route).size}곳)`;
  byId("ending-bonds").textContent = completeLife && life.creationVersion >= 3
    ? [peopleSummary(life), life.successor && "후배에게 전한 일", life.people?.fruitOwner && `이 세계선의 ${life.people.fruitOwner.owner}는 ${life.people.fruitOwner.fruit}를 먹지 않았다`].filter(Boolean).join(" · ") || "곁에 남은 이름 없이 혼자 걸은 삶"
    : completeLife
    ? `양육자와의 기억 · 옛 친구와의 ${life.friendBond > 1 ? "지속된 인연" : "서로 다른 길"}${life.successor ? " · 후배에게 전한 일" : ""}`
    : `${life.guardianName || "준"}과의 기억 · ${life.friendName || "린"}과의 ${life.friendBond > 1 ? "지속된 인연" : "서로 다른 길"}${life.successor ? " · 후배에게 전한 일" : ""}`;
  window.scrollTo(0, 0);
}

function openJournal() {
  stopTimer();
  const current = byId("journal-current");
  const past = byId("journal-past");
  current.replaceChildren();
  past.replaceChildren();
  if (life) {
    const heading = document.createElement("h3");
    heading.textContent = `${life.birth.name}의 지나온 장면`;
    current.append(heading);
    const list = document.createElement("ol");
    for (const entry of life.journal) {
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
  if (library.lives.length > (life ? 1 : 0)) {
    const heading = document.createElement("h3");
    heading.textContent = "다른 생애";
    past.append(heading);
    library.lives.forEach((record, index) => {
      if (life && index === library.active) return;
      try {
        const pastLife = replay(record);
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

byId("profile-name-mode").addEventListener("change", updateNameInput);
byId("profile-species").addEventListener("change", updateHomeOptions);
byId("all-random").addEventListener("click", () => {
  for (const key of ["name-mode", "gender", "species", "means"]) byId(`profile-${key}`).value = "random";
  byId("profile-name-input").value = "";
  updateNameInput();
  updateHomeOptions();
  byId("profile-error").hidden = true;
});

byId("start").addEventListener("click", () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  try {
    life = createGame(mode, seed, selectedProfile());
    byId("profile-error").hidden = true;
  } catch (error) {
    byId("profile-error").textContent = error.message;
    byId("profile-error").hidden = false;
    return;
  }
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
  life = replay(library.lives[library.active]);
  observation = null;
  if (life.finished) renderEnding();
  else renderGame(true);
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

loadLibrary();
renderIntro();
