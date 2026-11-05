// Quiet sea ambience made live with Web Audio: waves, distant gulls, and an original shanty-style tune.
// No audio files ship with the game; nothing plays until the player turns it on.
const STORE_KEY = "one-sea-sound";

// Each mood keeps the same voices and changes key, scale, pace and weather.
const MOODS = {
  calm: { tonic: 293.66, scale: [0, 2, 4, 5, 7, 9, 11], eighth: 0.24, waves: 0.22, cutoff: 900, gulls: true },
  danger: { tonic: 220, scale: [0, 2, 3, 5, 7, 8, 10], eighth: 0.2, waves: 0.42, cutoff: 520, gulls: false },
  canon: { tonic: 293.66, scale: [0, 2, 4, 5, 7, 9, 11], eighth: 0.21, waves: 0.2, cutoff: 900, gulls: true, drum: true },
  ending: { tonic: 196, scale: [0, 2, 4, 5, 7, 9, 11], eighth: 0.34, waves: 0.16, cutoff: 760, gulls: true }
};

// Original 6/8 phrases as [scale degree, eighths]; null is a rest. Degrees past 6 climb an octave.
const PHRASES = [
  [[0, 2], [2, 1], [4, 2], [4, 1], [5, 2], [4, 1], [2, 2], [1, 1], [0, 3], [null, 3]],
  [[4, 2], [5, 1], [7, 2], [5, 1], [4, 2], [2, 1], [4, 3], [null, 3]],
  [[2, 1], [3, 1], [4, 1], [5, 2], [4, 1], [3, 2], [2, 1], [1, 2], [-1, 1], [0, 3], [null, 3]],
  [[7, 2], [6, 1], [5, 2], [4, 1], [2, 2], [4, 1], [1, 3], [0, 3], [null, 3]]
];

export function moodFor(scene) {
  if (!scene) return "ending";
  if (/danger|mishap|storm|sea_king|sudden_end|capture|custody|marineford/.test(scene.id)) return "danger";
  if (scene.canon || /^canon_|^life_canon_/.test(scene.id)) return "canon";
  return "calm";
}

// Frequency of a scale degree; negative and high degrees wrap into lower and higher octaves.
export function degreeHz(mood, degree) {
  const { tonic, scale } = MOODS[mood];
  const octave = Math.floor(degree / scale.length);
  const step = scale[((degree % scale.length) + scale.length) % scale.length];
  return tonic * 2 ** (octave + step / 12);
}

let ctx = null;
let master = null;
let waveGain = null;
let waveFilter = null;
let mood = "calm";
let timers = [];
const settings = load();

function load() {
  try { return { on: false, volume: 0.5, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; }
  catch { return { on: false, volume: 0.5 }; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch { /* private mode keeps it for this visit */ }
}

function startWaves() {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < length; i += 1) {
    brown = (brown + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = brown * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  waveFilter = ctx.createBiquadFilter();
  waveFilter.type = "lowpass";
  waveGain = ctx.createGain();
  // A slow swell makes the noise rise and fall like waves reaching the shore.
  const swell = ctx.createOscillator();
  const swellDepth = ctx.createGain();
  swell.frequency.value = 0.09;
  swellDepth.gain.value = 0.12;
  swell.connect(swellDepth).connect(waveGain.gain);
  noise.connect(waveFilter).connect(waveGain).connect(master);
  noise.start();
  swell.start();
}

function note(hz, start, length, level) {
  const out = ctx.createGain();
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 1500;
  // Two reeds a few cents apart give the accordion its beating sound.
  for (const cents of [-7, 7]) {
    const reed = ctx.createOscillator();
    reed.type = "sawtooth";
    reed.frequency.value = hz;
    reed.detune.value = cents;
    reed.connect(tone);
    reed.start(start);
    reed.stop(start + length + 0.3);
  }
  out.gain.setValueAtTime(0, start);
  out.gain.linearRampToValueAtTime(level, start + 0.05);
  out.gain.setValueAtTime(level, start + length * 0.75);
  out.gain.linearRampToValueAtTime(0, start + length + 0.25);
  tone.connect(out).connect(master);
}

function drum(start) {
  const out = ctx.createGain();
  const skin = ctx.createOscillator();
  skin.frequency.setValueAtTime(110, start);
  skin.frequency.exponentialRampToValueAtTime(45, start + 0.25);
  out.gain.setValueAtTime(0.18, start);
  out.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
  skin.connect(out).connect(master);
  skin.start(start);
  skin.stop(start + 0.4);
}

function gull() {
  const start = ctx.currentTime;
  for (const offset of [0, 0.32]) {
    const out = ctx.createGain();
    const cry = ctx.createOscillator();
    cry.frequency.setValueAtTime(1500, start + offset);
    cry.frequency.exponentialRampToValueAtTime(950, start + offset + 0.25);
    out.gain.setValueAtTime(0, start + offset);
    out.gain.linearRampToValueAtTime(0.012, start + offset + 0.04);
    out.gain.exponentialRampToValueAtTime(0.0005, start + offset + 0.28);
    cry.connect(out).connect(master);
    cry.start(start + offset);
    cry.stop(start + offset + 0.3);
  }
}

function playPhrase() {
  const plan = MOODS[mood];
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  let at = ctx.currentTime + 0.1;
  let beat = 0;
  for (const [degree, eighths] of phrase) {
    const length = eighths * plan.eighth;
    if (degree !== null) note(degreeHz(mood, degree), at, length * 0.9, 0.035);
    if (plan.drum && beat % 3 === 0) drum(at);
    at += length;
    beat += eighths;
  }
  // A soft low drone under the phrase keeps the key.
  note(degreeHz(mood, -7), ctx.currentTime + 0.1, at - ctx.currentTime, 0.012);
  return at - ctx.currentTime;
}

// Runs fn after `delay` seconds, then again after however many seconds fn returns.
function loop(fn, delay) {
  const id = setTimeout(() => { if (settings.on) loop(fn, fn()); }, delay * 1000);
  timers.push(id);
}

function applyMood() {
  if (!ctx) return;
  const plan = MOODS[mood];
  waveGain.gain.setTargetAtTime(plan.waves, ctx.currentTime, 1.5);
  waveFilter.frequency.setTargetAtTime(plan.cutoff, ctx.currentTime, 1.5);
}

function start() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.connect(ctx.destination);
    startWaves();
  }
  ctx.resume();
  master.gain.setTargetAtTime(settings.volume, ctx.currentTime, 0.4);
  applyMood();
  timers.forEach(clearTimeout);
  timers = [];
  // Melody returns every 8–20 seconds after a phrase ends; gulls call now and then in fair weather.
  loop(() => playPhrase() + 8 + Math.random() * 12, 2);
  loop(() => { if (MOODS[mood].gulls && Math.random() < 0.6) gull(); return 9 + Math.random() * 14; }, 5);
}

function stop() {
  timers.forEach(clearTimeout);
  timers = [];
  if (ctx) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => { if (!settings.on) ctx.suspend(); }, 1200);
  }
}

export function setMood(next) {
  if (next === mood) return;
  mood = next;
  applyMood();
}

// Wires the masthead toggle and volume slider. Browsers block sound before a click, so a saved "on"
// waits for the first click or key press on the page.
export function initMusic(toggle, volume) {
  const show = () => {
    toggle.setAttribute("aria-pressed", String(settings.on));
    toggle.textContent = settings.on ? "♪ 배경음 끄기" : "♪ 배경음 켜기";
    volume.hidden = !settings.on;
  };
  volume.value = settings.volume;
  toggle.addEventListener("click", () => {
    settings.on = !settings.on;
    save();
    settings.on ? start() : stop();
    show();
  });
  volume.addEventListener("input", () => {
    settings.volume = Number(volume.value);
    save();
    if (ctx && settings.on) master.gain.setTargetAtTime(settings.volume, ctx.currentTime, 0.1);
  });
  if (settings.on) {
    const wake = (event) => { if (event.target !== toggle && settings.on) start(); };
    document.addEventListener("pointerdown", wake, { once: true });
    document.addEventListener("keydown", wake, { once: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !settings.on) return;
    document.hidden ? ctx.suspend() : ctx.resume();
  });
  show();
}
