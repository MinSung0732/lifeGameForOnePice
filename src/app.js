import { ART, advance, createGame, getScene, replay, saveRecord } from "./game.js";
import { scenes } from "./story.js";

const STORAGE_KEY = "a-life-at-sea.lives.v1";
const ACT_NAMES = ["시작", "전개", "목표", "엔딩"];
const modeName = (mode) => mode === "original" ? "원작 모드" : "더 자유로운 모드";
const byId = (id) => document.getElementById(id);

let library = { version: 1, active: -1, lives: [] };
let life = null;
let timer = null;
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
  if (!life || life.finished || paused || document.hidden || byId("journal").open) return;
  const scene = getScene(life);
  if (scene.choices.length) return;
  const readingTime = Math.max(6500, Math.min(15000, scene.body.length * 70));
  timer = setTimeout(() => advanceLife(null), readingTime / speed);
}

function showSection(section) {
  byId("intro").hidden = section !== "intro";
  byId("game").hidden = section !== "game";
  byId("ending").hidden = section !== "ending";
  byId("journal-open").hidden = library.lives.length === 0;
}

function renderIntro() {
  stopTimer();
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

function skillName(value) {
  return value >= 3 ? "능숙" : value === 2 ? "숙련" : value === 1 ? "견습" : "아직 없음";
}

function supplyName(value) {
  return value >= 3 ? "여유" : value === 2 ? "준비됨" : value === 1 ? "빠듯함" : "부족";
}

function healthName(value) {
  return value >= 3 ? "괜찮음" : value === 2 ? "지침" : "위태로움";
}

function renderLifeStrip() {
  byId("life-name").textContent = `${life.birth.name} · ${life.birth.gender} · ${life.birth.species} · ${life.birth.home}`;
  byId("life-work").textContent = `${life.job} · ${life.affiliation}`;
  byId("life-role").textContent = life.role;
  byId("life-goal").textContent = life.goal;
  byId("life-skill").textContent = skillName(life.skill);
  byId("life-supplies").textContent = `${healthName(life.health)} · ${supplyName(life.supplies)}`;
}

function renderGame(focusTitle = false) {
  const scene = getScene(life);
  if (!scene) return renderEnding();
  showSection("game");
  byId("scene-location").textContent = `${life.location} · ${modeName(life.mode)} · ${life.birth.name}, ${scene.age}세`;
  byId("scene-chapter").textContent = `0${scene.act} ${ACT_NAMES[scene.act - 1]} / ${life.journal.length + 1}번째 장면`;
  byId("scene-title").textContent = scene.title;
  byId("scene-body").textContent = scene.body;
  byId("scene-image").src = scene.art.src;
  byId("scene-image").alt = scene.art.alt;
  byId("scene-caption").textContent = scene.art.alt;
  byId("scene-result").textContent = life.lastOutcome;
  byId("scene-result").hidden = !life.lastOutcome;
  renderLifeStrip();

  const choices = byId("choices");
  choices.replaceChildren();
  for (const choice of scene.choices) {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    const copy = document.createElement("span");
    const label = document.createElement("strong");
    label.textContent = choice.label;
    const risk = document.createElement("small");
    risk.textContent = choice.risk;
    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    copy.append(label, risk);
    button.append(copy, arrow);
    button.addEventListener("click", () => advanceLife(choice.id));
    choices.append(button);
  }
  byId("next").hidden = scene.choices.length > 0;
  byId("scene-hint").textContent = scene.choices.length
    ? "선택 장면에서는 시간이 흐르지 않습니다. 위험과 대가를 읽고 결정하세요."
    : paused ? "자동 진행을 멈췄습니다. 다음 장면을 직접 열 수 있습니다."
      : "관찰 장면은 자동으로 넘어갑니다. 원하면 다음 장면을 바로 열 수 있습니다.";
  if (focusTitle) {
    window.scrollTo(0, 0);
    byId("scene-title").focus({ preventScroll: true });
  }
  scheduleObservation();
}

function advanceLife(choiceId) {
  stopTimer();
  try {
    life = advance(life, choiceId);
    library.lives[library.active] = saveRecord(life);
    persist();
    if (life.finished) renderEnding();
    else renderGame(true);
  } catch (error) {
    byId("scene-hint").textContent = error.message;
  }
}

function renderEnding() {
  stopTimer();
  showSection("ending");
  const title = life.ending === "death" ? "돌아오지 못한 삶" : life.ending === "retire" ? "넘겨준 항구" : "아직 열린 바다";
  const art = life.ending === "death" ? ART.rescue : life.ending === "retire" ? ART.retirement : ART.harbor;
  byId("ending-title").textContent = `${life.birth.name}의 기록 · ${title}`;
  byId("ending-image").src = art.src;
  byId("ending-image").alt = art.alt;
  byId("ending-lead").textContent = life.ending === "death"
    ? "처음의 손실과 마지막 선택이 남긴 것을 사람들의 시선에서 기록합니다. 목표의 미래를 대신 완성하지 않습니다."
    : life.ending === "retire" ? "일을 다음 사람에게 넘겼습니다. 그 뒤의 바다는 그들이 결정합니다."
      : "현재까지의 삶을 한 장으로 닫습니다. 아직 일어나지 않은 원작의 미래는 쓰지 않습니다.";
  byId("ending-birth").textContent = `${life.birth.species} · ${life.birth.gender} · ${life.birth.home}`;
  byId("ending-mode").textContent = modeName(life.mode);
  byId("ending-work").textContent = `${life.job} · ${life.affiliation} · ${life.role}`;
  byId("ending-goal").textContent = `${life.goal} · ${life.ending === "death" ? "미완" : life.ending === "retire" ? "책임 승계" : "진행 중"}`;
  byId("ending-bonds").textContent = `준과의 기억 · 린과의 ${life.friendBond > 1 ? "지속된 인연" : "서로 다른 길"}${life.successor ? " · 후배에게 전한 일" : ""}`;
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
      title.textContent = `${entry.age}세 · ${entry.title}`;
      item.append(title);
      if (entry.choice) {
        const choice = document.createElement("p");
        choice.textContent = `선택: ${entry.choice}`;
        item.append(choice);
      }
      if (entry.result) {
        const result = document.createElement("small");
        result.textContent = entry.result;
        item.append(result);
      }
      const card = scenes.find((scene) => scene.id === entry.id);
      if (card?.canon) {
        const source = document.createElement("a");
        source.href = card.canon;
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
}

byId("start").addEventListener("click", () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  life = createGame(mode, seed);
  library.lives.push(saveRecord(life));
  library.active = library.lives.length - 1;
  persist();
  paused = false;
  byId("pause").setAttribute("aria-pressed", "false");
  byId("pause").textContent = "자동 진행 멈추기";
  renderGame(true);
  window.scrollTo(0, 0);
});

byId("resume").addEventListener("click", () => {
  life = replay(library.lives[library.active]);
  if (life.finished) renderEnding();
  else renderGame(true);
});

byId("next").addEventListener("click", () => advanceLife(null));
byId("speed").addEventListener("change", (event) => { speed = Number(event.target.value); scheduleObservation(); });
byId("pause").addEventListener("click", () => {
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
