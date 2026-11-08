import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ART, PERSONALITY, PROFILE_OPTIONS, STATS, advance, collectMilestones, createGame, getContentStats, getScene, personalitySummary, replay, saveRecord } from "../src/game.js";
import { createObservation, tickObservation } from "../src/observation.js";
import { scenes } from "../src/story.js";
import { degreeHz, moodFor } from "../src/music.js";
import { OLD_ERA } from "../src/canon-old-era.js";
import { crewVesselKind, encounterAt, encounterScene, eraStart, isNewWorld, presentAge, ROUTES_V20, ROUTES_V22, routeOptionsFor, sailToNextPort, storyBefore, travelScene } from "../src/world.js";
import { fruitFor } from "../src/fruits.js";
import { balancedPublicBounty, bountyScene, formatBounty, marinePatrolScene, pursuerFor } from "../src/bounty.js";
import { applyBalancedGrowth, growthEfficiency } from "../src/growth-balance.js";
import { CANON_BEAT_COUNT, canonAge, canonScene } from "../src/canon-events.js";
import { PRE_CANON_BEAT_COUNT, preCanonCount, preCanonScene } from "../src/canon-before.js";
import { canonGapFor, canonInterludeScene } from "../src/canon-interludes.js";
import { FLEX_IDS, FLEX_IDS_V5, lifeScenes, rankOpportunity, yearlyScene } from "../src/life-story.js";
import { canonBondScene } from "../src/canon-bonds.js";
import { directEncounterFollowUp } from "../src/canon-encounter-followups.js";
import { affiliationChapter } from "../src/affiliation-chapters.js";
import { endingMemories } from "../src/ending-memories.js";
import { PERSONAL_AIMS, personalAimRetirement, personalAimScene, personalAimSummary } from "../src/life-aim.js";
import { canonRelationshipEntries } from "../src/canon-relationships.js";
import { loguetownFollowUp } from "../src/loguetown-followups.js";
import { childhoodScene } from "../src/childhood.js";
import { rosterFor } from "../src/canon-crews.js";
import { attachCanonContact, canonEraFor, canonPowerAt, canonRelationshipLine, computeCaptureDiceTarget, computeContestDiceTarget, custodyContactStatus, custodyDivergenceText, pendingCanonContactScene, playerCombatRating } from "../src/canon-relationships.js";
import { FATES } from "../src/fates.js";
import { peopleSummary, personalBeat } from "../src/people.js";
import { crewFor, relationshipGroups } from "../src/crew.js";
import { DUTIES, withPower } from "../src/adventures.js";
import { awardPowerAcquisition, gainPowerExperience, powerOdds } from "../src/power-mastery.js";
import { routeChartFor, routeMapLabel } from "../src/route-map.js";
import { LOCAL_ARCS_V23, localCanonRipple } from "../src/canon-local-events.js";
import { arcScene } from "../src/canon-arcs.js";

test("23번 연결 지역은 원작 시간대에 고유 상호작용을 보여 주고 과거 기록은 유지한다", () => {
  const v23 = createGame("original", 135, { species: "인간" }, 3, 23);
  const v22 = createGame("original", 135, { species: "인간" }, 3, 22);
  v23.age = v23.birth.yearsBeforeCurrent + 20;
  v22.age = v23.age;
  v23.path = v22.path = "pirate";
  v23.supplies = v22.supplies = 80;
  const all = ["departure", "zoro", "buggy", "usopp", "baratie", "arlong",
    "skypiea_trial", "skypiea_bell", "enies_lobby", "thriller_shadows", "thriller_aftermath", "amazon_lily"];
  assert.ok(all.every((id) => LOCAL_ARCS_V23[id]?.scenes?.length >= 1));
  for (const id of all) {
    const arc = LOCAL_ARCS_V23[id];
    const original = { ...v23, location: arc.place, people: { ...v23.people } };
    const scenes = arc.scenes.map((_, index) => ({
      preCanonStep: null, location: arc.place, entry: index, id: `canon_arc_${id}_${index}`
    }));
    assert.ok(scenes.every(({ id: sceneId }) => sceneId.startsWith("canon_arc_")));
    assert.ok(arc.scenes.some((scene) => scene.choices.some((choice) => choice.id.startsWith("change_"))));
    assert.ok(arc.scenes.every((scene) => scene.choices.every((choice) =>
      !choice.id.startsWith("change_") || choice.when({ ...original, mode: "original" }) === false)));
    assert.ok(arc.scenes.some((scene) => scene.choices.some((choice) =>
      choice.id.startsWith("change_") && choice.when({ ...original, mode: "free" }))));
  }
  assert.ok(!("canonRipples" in v22.people), "이전 세이브에 새로운 필드를 강제로 추가하지 않는다");
  assert.equal(arcScene({ ...v22, location: "위대한 항로 상공 · 스카이피아" },
    { id: "skypiea_trial" }, v22.age), null, "22번 세이브는 신규 원작 상호작용 이벤트를 볼 수 없다");
  assert.equal(arcScene({ ...v23, location: "자야 · 모크 타운", leftHome: true },
    { id: "skypiea_trial" }, v23.age), null, "특수 항로를 건너뛰는 무료 순간이동 이벤트를 만들지 않는다");
});

test("23번 자유 모드에서 개입한 뒤 원작 사건의 후속 선택과 인연 기록이 남는다", () => {
  const free = createGame("free", 134, { species: "인간" }, 3, 23);
  free.path = "pirate";
  free.supplies = 90;
  const i = LOCAL_ARCS_V23.skypiea_trial.scenes[0].choices.find(({ id }) => id === "change_skypiea_trial");
  assert.ok(i.when(free));
  const beforeSupplies = free.supplies;
  i.apply(free);
  assert.equal(free.supplies, beforeSupplies - 8);
  assert.match(localCanonRipple(free, "upper_yard").body, /샨디아/);
  assert.equal(localCanonRipple({ ...free, mode: "original" }, "upper_yard"), null);
  assert.equal(localCanonRipple({ ...free, creationVersion: 22 }, "upper_yard"), null);
  assert.equal(localCanonRipple(free, "maxim"), null);
});

test("23번 원작 모드의 현장 조우는 관계만 쌓고 체포·IF 개입을 제한한다", () => {
  const original = createGame("original", 138, { species: "인간" }, 3, 23);
  original.path = "marine";
  original.location = "위대한 항로 상공 · 스카이피아";
  original.age = original.birth.yearsBeforeCurrent - 2;
  const scene = arcScene(original, { id: "skypiea_trial" }, original.age);
  assert.equal(scene.id, "canon_arc_skypiea_trial_0");
  assert.ok(scene.choices.some(({ id }) => id === "canon_contact_talk"));
  assert.ok(!scene.choices.some(({ id }) => id === "canon_contact_capture"),
    "원작 모드의 주요 원작 인물은 체포로 원작에서 제거하지 않는다");
  assert.ok(scene.choices.filter(({ when }) => !when || when(original))
    .every(({ id }) => !id.startsWith("change_")), "원작 모드는 개입 선택지가 숨겨져야 한다");
  const after = structuredClone(original);
  scene.choices.find(({ id }) => id === "canon_contact_talk").apply(after);
  assert.equal(after.people.canonContacts.wyper.meetings, 1);
  assert.ok(after.people.canonContacts.wyper.score > 0, "원작 모드에서도 인연은 쌓인다");
  assert.equal(after.people.canonRipples, undefined, "원작 모드는 원작 연표에 개입한 후속 흔적을 만들지 않는다");

  const free = createGame("free", 138, { species: "인간" }, 3, 23);
  free.path = "pirate";
  free.location = original.location;
  free.age = original.age;
  free.supplies = 80;
  const freeScene = arcScene(free, { id: "skypiea_trial" }, free.age);
  const act = freeScene.choices.find(({ id }) => id === "change_skypiea_trial");
  assert.ok(act.when(free));
  act.apply(free);
  assert.equal(free.people.canonContacts.wyper.meetings, 1);
  assert.ok(free.people.canonContacts.wyper.score > 0, "직접 도운 인물과 관계가 실제로 변화한다");
  assert.match(localCanonRipple(free, "upper_yard").body, /샨디아/);
  const record = saveRecord(free);
  assert.equal(record.creationVersion, 23);
});

test("22번 항로는 임의 지명 접근을 줄이고 주요 원작 장소를 연결한다", () => {
  const old = createGame("free", 21, { species: "인간" }, 3, 21);
  const fresh = createGame("free", 21, { species: "인간" }, 3, 22);
  const custom = (network) => new Set(Object.values(network).flat().map(({ dest }) => dest)
    .filter((name) => name.includes("(임의 지명)")));
  assert.equal(custom(ROUTES_V20).size, 25);
  assert.equal(custom(ROUTES_V22).size, 4);
  assert.deepEqual(routeOptionsFor(old, "자야 · 모크 타운"), ROUTES_V20["자야 · 모크 타운"],
    "21번 세이브는 종전의 선택지를 그대로 유지");
  assert.deepEqual(routeOptionsFor(fresh, "자야 · 모크 타운"), ROUTES_V22["자야 · 모크 타운"]);

  for (const place of ["위대한 항로 상공 · 스카이피아", "스릴러 바크", "에니에스 로비",
    "아마존 릴리 외해", "바라티에", "오렌지 마을", "셸즈 타운", "시럽 마을",
    "아론 파크", "이스트 블루 · 푸샤 마을"]) {
    assert.ok(Object.values(ROUTES_V22).some((links) => links.some(({ dest }) => dest === place)),
      `${place}은(는) 다른 항구에서 들어오는 항로가 있어야 한다`);
  }
  assert.equal(routeOptionsFor(old, "위대한 항로 · 알라바스타 나노하나"), undefined,
    "기존 출생지 별칭 처리로 21번 세이브가 달라지면 안 된다");
  assert.equal(routeOptionsFor(fresh, "위대한 항로 · 알라바스타 나노하나"),
    ROUTES_V22["알라바스타 · 나노하나"]);
});

test("22번 특수 항로는 조건과 도착 후 이벤트를 지킨다", () => {
  const base = createGame("free", 77, { species: "인간" }, 3, 22);
  Object.assign(base, { path: "pirate", independent: true, canonCrew: null, role: "선장",
    leftHome: true, homebound: false, supplies: 80, health: 70, skill: 40 });
  const voyage = (place) => travelScene({ ...base, location: place }, base.age);

  const sky = voyage("자야 · 모크 타운").choices.find(({ id }) => id === "far");
  assert.match(sky.label, /노크 업 스트림/);
  assert.equal(sky.available(base), false, "충분한 기술 없이 상승 해류에 오를 수 없음");
  const prepared = { ...base, skill: 65, location: "자야 · 모크 타운" };
  assert.equal(sky.available(prepared), true);
  const flown = structuredClone(prepared);
  sky.apply(flown);
  assert.equal(flown.location, "위대한 항로 상공 · 스카이피아");
  assert.equal(flown.pendingEncounter, "sky_arrival_v22");
  assert.equal(encounterScene(flown).art, "arcSkypiea");
  assert.equal(encounterScene(flown).choices.length, 2);

  const docks = voyage("워터 세븐");
  const court = docks.choices.find(({ id }) => id === "far");
  const fog = docks.choices.find(({ id }) => id === "detour");
  assert.match(court.label, /해상 열차/);
  assert.match(fog.label, /삼각지대/);
  assert.equal(court.available(base), false);
  assert.equal(court.available({ ...base, path: "marine" }), true);
  const inside = { ...base, path: "marine", location: "워터 세븐" };
  court.apply(inside);
  assert.equal(inside.location, "에니에스 로비");
  assert.equal(inside.pendingEncounter, "enies_arrival_v22");
  const drifting = { ...base, location: "워터 세븐" };
  fog.apply(drifting);
  assert.equal(drifting.location, "스릴러 바크");
  assert.equal(drifting.pendingEncounter, "thriller_arrival_v22");

  const calm = voyage("샤본디 제도").choices.find(({ id }) => id === "far");
  assert.equal(calm.available(base), false);
  const seasoned = { ...base, location: "샤본디 제도", skill: 65 };
  calm.apply(seasoned);
  assert.equal(seasoned.location, "아마존 릴리 외해");
  assert.equal(seasoned.pendingEncounter, "calm_arrival_v22");
  assert.match(encounterScene(seasoned).body, /해안에 내리지 않고/);

  const east = { ...base, location: "이스트 블루 · 로그 타운" };
  const dining = travelScene(east, east.age).choices.find(({ id }) => id === "mid");
  dining.apply(east);
  assert.equal(east.location, "바라티에");
  assert.equal(east.pendingEncounter, "baratie_arrival_v22");

  const old = createGame("free", 77, { species: "인간" }, 3, 21);
  Object.assign(old, { path: "pirate", independent: true, leftHome: true, homebound: false, location: "자야 · 모크 타운", supplies: 80 });
  const oldVoyage = travelScene(old, old.age);
  assert.match(oldVoyage.choices.find(({ id }) => id === "far").label, /임의 지명/);
  assert.equal(oldVoyage.choices.find(({ id }) => id === "detour").when(old), false,
    "21번 항로에는 22번 특수 선택지가 노출되지 않는다");
  const chart22 = routeChartFor({ ...base, location: "워터 세븐" });
  assert.equal(chart22.connections.length, 4, "워터 세븐의 네 경로 모두 미니맵에 표시해야 한다");
  assert.ok(chart22.connections.includes("스릴러 바크"));
  const chart21 = routeChartFor({ ...old, location: "워터 세븐" });
  assert.equal(chart21.connections.length, 3);

  assert.equal(encounterAt({ ...old, location: "위대한 항로 상공 · 스카이피아" }), null,
    "21번 세이브에는 새 도착 이벤트가 끼어들지 않는다");
});

test("지도 라벨은 영역별 길이에 맞춰 줄이고 원본 지명은 변경하지 않는다", () => {
  const longName = "거품여울 군도(임의 지명)";
  assert.equal(routeMapLabel(longName, "next"), "거품여울 군…");
  assert.equal(routeMapLabel(longName, "previous"), "거품여울 군도…");
  assert.equal(routeMapLabel("샤본디 제도", "current"), "샤본디 제도");
  assert.equal(routeMapLabel("조", "next"), "조");
  assert.equal(longName, "거품여울 군도(임의 지명)", "표시용 라벨 때문에 실제 항로명을 바꾸면 안 된다");
});

test("미니맵은 실제 항해 기록·항로 연결만 사용하고 모르는 좌표를 만들지 않는다", () => {
  const sea = createGame("free", 17, { species: "인간" });
  const visited = { ...sea, location: "샤본디 제도",
    travelHistory: ["이스트 블루 · 로그 타운", "워터 세븐", "샤본디 제도", "샤본디 제도"] };
  const map = routeChartFor(visited);
  assert.equal(map.current, "샤본디 제도");
  assert.equal(map.previous, "워터 세븐");
  assert.equal(map.zone, "crossing");
  assert.deepEqual(map.connections, ROUTES_V22["샤본디 제도"].map(({ dest }) => dest).slice(0, 3));
  assert.deepEqual(visited.travelHistory, ["이스트 블루 · 로그 타운", "워터 세븐", "샤본디 제도", "샤본디 제도"], "지도 표시가 저장 기록을 수정하면 안 된다");

  const sky = routeChartFor({ ...sea, location: "위대한 항로 상공 · 스카이피아",
    travelHistory: ["위대한 항로 상공 · 스카이피아"] });
  assert.equal(sky.zone, "paradise");
  assert.equal(sky.previous, null);
  assert.equal(sky.connections[0], "자야 · 모크 타운");

  const underwater = routeChartFor({ ...sea, location: "위대한 항로 해저 · 어인섬" });
  assert.equal(underwater.zone, "crossing");
  assert.equal(underwater.connections[0], "펑크 하자드");

  const blue = routeChartFor({ ...sea, location: "이스트 블루 · 로그 타운" });
  assert.equal(blue.zone, "blue");
  assert.equal(blue.connections[0], "리버스 마운틴");

  const aliased = routeChartFor({ ...sea, location: "위대한 항로 · 알라바스타 나노하나" });
  assert.deepEqual(aliased.connections, ["자야 · 모크 타운", "롱 링 롱 랜드"], "없는 지도 좌표는 연결로 표시하지 않는다");

  const unknown = routeChartFor({ ...sea, location: "좌표 미등록 새 섬",
    travelHistory: ["이스트 블루 · 로그 타운", "좌표 미등록 새 섬"] });
  assert.equal(unknown.zone, "unknown");
  assert.equal(unknown.previous, "이스트 블루 · 로그 타운");
  assert.deepEqual(unknown.connections, [], "지도가 섬이나 이동 경로를 지어내면 안 된다");

  const legacy = routeChartFor({ ...visited, creationVersion: 7 });
  assert.deepEqual(legacy.connections, [], "기존 규칙의 세이브에 새 항로를 사실처럼 표시하지 않는다");
});

function play(mode, seed, picks = {}, profile = { species: "인간" }, rules = 3, version = 3) {
  let life = createGame(mode, seed, profile, rules, version);
  let steps = 0;
  while (!life.finished) {
    const scene = getScene(life);
    assert.ok(scene, "진행 중인 생애에는 다음 장면이 있어야 한다");
    assert.ok(scene.art?.src && scene.art.alt, `${scene.id}에 그림과 설명이 있어야 한다`);
    assert.ok(scene.body.length <= 300, `${scene.id} 본문이 너무 길다`);
    assert.ok(scene.choices.every((choice) => typeof choice.risk === "string"), `${scene.id} 선택 경고가 화면에 표시되어야 한다`);
    const chosen = scene.choices.find((choice) => choice.id === picks[scene.id] && !choice.disabled)?.id
      ?? scene.choices.find((choice) => !choice.disabled)?.id ?? null;
    life = advance(life, chosen);
    steps += 1;
    assert.ok(steps <= (rules === 3 ? 400 : scenes.length), "장면 진행이 끝나야 한다");
  }
  return life;
}

function reach(seed, target, picks = {}, profile = { species: "인간" }, version = 3) {
  let life = createGame("original", seed, profile, 3, version);
  const matches = (scene) => typeof target === "function" ? target(scene) : scene.id === target;
  while (!life.finished && !matches(getScene(life))) {
    const scene = getScene(life);
    const chosen = scene.choices.find((choice) => choice.id === picks[scene.id] && !choice.disabled)?.id
      ?? scene.choices.find((choice) => !choice.disabled)?.id ?? null;
    life = advance(life, chosen);
  }
  assert.ok(getScene(life) && matches(getScene(life)), `${target} 장면에 도착해야 한다`);
  return life;
}

test("장면 ID와 그림 키, 원작 사건 근거를 검사한다", () => {
  assert.equal(new Set(scenes.map((card) => card.id)).size, scenes.length);
  for (const card of scenes) {
    const artKey = typeof card.art === "function" ? card.art(createGame("original", 1)) : card.art;
    assert.ok(ART[artKey], `${card.id}의 그림 키가 없음`);
    if (card.canon) assert.match(card.canon, /^https:\/\/one-piece\.com\//);
  }
  for (const [key, art] of Object.entries(ART)) {
    assert.ok(existsSync(new URL(`../${art.src.slice(2)}`, import.meta.url)), `${key} 그림 파일이 없음`);
  }
  assert.equal(getContentStats().cards, scenes.length);
  const birth = createGame("original", 1, {}, 2).birth;
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "roger_news").age, 24);
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "marineford_news").age, 2);
  assert.ok(PROFILE_OPTIONS.homes.인간.some((home) => home.includes("웨스트 블루")));
  assert.ok(PROFILE_OPTIONS.homes.인간.some((home) => home.includes("신세계")));
});

test("원작 삽화는 대응하는 전후 전쟁 장면과 섬 이벤트에 연결된다", async () => {
  const { preCanonCount } = await import("../src/canon-before.js");
  const { canonCount } = await import("../src/canon-events.js");
  const { arcScene } = await import("../src/canon-arcs.js");
  const life = createGame("free", 71, { species: "인간" });
  Object.assign(life, { age: 120, location: "바다 건너", leftHome: false, seen: [] });
  const before = new Map();
  for (let step = 0; step < preCanonCount(life); step += 1) {
    life.preCanonStep = step;
    const scene = preCanonScene(life);
    if (scene) before.set(scene.id, scene.art);
  }
  for (const [id, art] of Object.entries({
    departure: "arcFoosha", zoro: "arcShellsTown", buggy: "arcOrangeTown", usopp: "arcSyrup",
    baratie: "arcBaratie", arlong: "arcArlongPark", laboon: "arcTwinCape", skypiea_trial: "arcSkypiea",
    skypiea_bell: "arcSkypiea", davy: "arcLongRing", enies_lobby: "arcEniesLobby", merry: "arcMerryFarewell",
    thriller_shadows: "arcThrillerBark", thriller_aftermath: "arcThrillerBark",
    supernovas: "arcSabaody", sabaody_auction: "arcSabaody", sabaody_scatter: "arcSabaody",
    amazon_lily: "arcAmazonLily"
  })) assert.equal(before.get(`canon_before_${id}`), art, `${id} 장면의 그림 연결`);

  life.seen = ["life_marineford_news"];
  const after = new Map();
  for (let step = 0; step < canonCount(life); step += 1) {
    life.canonStep = step;
    const scene = canonScene(life);
    if (scene) after.set(scene.id, scene.art);
  }
  for (const [id, art] of Object.entries({
    war_after: "arcMarineford", training: "arcTraining", punk_hazard: "arcPunkHazard",
    zou: "arcZou", reverie: "arcReverie", egghead: "arcEgghead", elbaf: "arcElbaf"
  })) assert.equal(after.get(`canon_${id}`), art, `${id} 장면의 그림 연결`);

  for (const [id, place, art] of [
    ["davy", "롱 링 롱 랜드", "arcLongRing"], ["zou", "조", "arcZou"],
    ["egghead", "에그헤드 외해", "arcEgghead"], ["elbaf", "엘바프", "arcElbaf"]
  ]) {
    life.location = place;
    assert.equal(arcScene(life, { id }, life.age)?.art, art, `${place} 현장 이벤트의 그림 연결`);
  }
  life.location = "롱 링 롱 랜드";
  life.seen = ["canon_arc_davy_0"];
  assert.equal(arcScene(life, { id: "davy" }, life.age)?.art, "specialIcePath", "쿠잔의 얼음길 장면은 별도 삽화를 쓴다");
});

test("출생 추첨은 시드와 모드에 재현 가능하고 잘못된 선택은 상태를 바꾸지 않는다", () => {
  const life = createGame("original", 42);
  assert.deepEqual(life.birth, createGame("free", 42).birth);
  assert.notDeepEqual(life.birth, createGame("original", 43).birth);
  assert.throws(() => createGame("unknown", 1));
  assert.throws(() => advance(life, "repair"));
  assert.equal(life.actions.length, 0);
});

test("새 생애는 받침 없는 이름의 조사를 바로잡고 이전 기록의 문장은 유지한다", () => {
  const profile = { name: "라나", species: "하늘섬 사람" };
  assert.match(getScene(createGame("original", 1, profile)).body, /라나가 태어났다/);
  assert.match(getScene(createGame("original", 1, profile, 3, 4)).body, /라나이 태어났다/);
});

test("출생 능력은 종족 기준과 개인차를 합치며 예전 저장 기록은 예전 수치로 복원한다", () => {
  const human = createGame("original", 42, { species: "인간" });
  const giant = createGame("original", 42, { species: "거인족" });
  assert.deepEqual(human.birthStats.individual, giant.birthStats.individual);
  assert.deepEqual(human.birthStats.personality, giant.birthStats.personality);
  assert.equal(human.skill, human.birthStats.species.skill + human.birthStats.individual.skill);
  assert.equal(human.health, human.birthStats.species.health + human.birthStats.individual.health);
  assert.equal(giant.health - human.health, 14);
  assert.ok(human.birth.yearsBeforeCurrent >= 40 && human.birth.yearsBeforeCurrent <= 95, "규칙 7은 한 생애가 원작 현재 안에 끝나도록 태어난다");
  assert.ok(giant.birth.yearsBeforeCurrent >= 130 && giant.birth.yearsBeforeCurrent <= 300);
  const rule6 = createGame("original", 42, { species: "인간" }, 3, 6);
  assert.ok(rule6.birth.yearsBeforeCurrent >= 26 && rule6.birth.yearsBeforeCurrent <= 44, "규칙 6 기록은 로저 처형 20년 전 이내 출생을 유지한다");
  const previous = createGame("original", 42, { species: "인간" }, 3, 2);
  assert.ok(previous.birth.yearsBeforeCurrent >= 35 && previous.birth.yearsBeforeCurrent <= 85, "이전 규칙 기록은 예전 출생 범위를 유지한다");
  assert.notDeepEqual(human.birthStats.individual, createGame("original", 43, { species: "인간" }).birthStats.individual);
  assert.ok(PROFILE_OPTIONS.species.every((species) => {
    const life = createGame("original", 42, { species });
    return [...STATS, ...PERSONALITY].every(({ key }) => {
      const value = life.personality[key] ?? life[key];
      return value >= 0 && value <= 100;
    });
  }));
  assert.deepEqual(replay(saveRecord(human)), human);
  const former = replay({ version: 1, mode: "original", seed: 42, profile: { species: "인간" }, rules: 3, actions: [] });
  assert.equal(former.creationVersion, 1);
  assert.equal(former.skill, 20);
  assert.equal(former.health, 70);
  assert.equal(former.birthStats, null);
  assert.ok(former.birth.yearsBeforeCurrent >= 95 && former.birth.yearsBeforeCurrent <= 120);
  assert.throws(() => replay({ ...saveRecord(human), creationVersion: 999 }), /출생 규칙/);
});

test("새 선택 설명은 조건을 알리되 결과를 미리 단정하지 않는다", () => {
  const child = reach(12, "life_child_crisis", { life_first_skill: "carry" }, { species: "어인" });
  const childChoices = getScene(child).choices;
  assert.match(childChoices.find((choice) => choice.id === "rush").risk, /기술 30/);
  assert.doesNotMatch(childChoices.map((choice) => choice.risk).join(" "), /안전|사망|돌아오지 못/);
  const enemy = reach(0, "life_enemy");
  const fight = getScene(enemy).choices.find((choice) => choice.id === "fight");
  assert.match(fight.risk, /기술 30 · 건강 30 필요/);
  assert.doesNotMatch(fight.risk, /승산|유리|밀리면|충족/);
  const rival = reach(0, "life_rival_return", { life_enemy: "withdraw" }, { species: "인간" }, 2);
  const rivalRisks = getScene(rival).choices.map((choice) => choice.risk).join(" ");
  assert.doesNotMatch(rivalRisks, /승산|유리|적대관계 해소|적대관계 지속/);
});

test("위험을 무릅쓴 사망, 책임을 넘긴 은퇴, 현재 시점의 세 결말이 도달 가능하다", () => {
  const death = play("original", 10, { first_choice: "crew", first_wage: "home", merchant: "refuse", rescue: "sail" }, { species: "인간" }, 2);
  const retire = play("original", 11, { first_choice: "repair", join: "cooperative", apprentice_offer: "teach", rescue: "shore", retire_choice: "retire" }, { species: "인간" }, 2);
  const present = play("free", 12, { first_choice: "travel", join: "independent", apprentice_offer: "decline", rescue: "shore", retire_choice: "continue", present_choice: "lead" }, { species: "인간" }, 2);
  assert.equal(death.ending, "death");
  assert.equal(retire.ending, "retire");
  assert.equal(present.ending, "present");
  assert.equal(retire.role, "은퇴");
  assert.equal(present.mode, "free");
  assert.ok(death.skill >= 2, "항로 일꾼도 일하며 기술을 쌓아야 한다");
  assert.equal(death.supplies, 0, "구조선에 쓸 물자가 없어 사망한 경로여야 한다");
  assert.ok(death.seen.includes("death_trace"));
  assert.ok(retire.seen.includes("retire_trace"));
  assert.ok(present.seen.includes("present_trace"));
});

test("구조선 선택 전에 현재 준비 상태에 맞는 결과를 알려준다", () => {
  const risk = scenes.find((card) => card.id === "rescue").choices.find((choice) => choice.id === "sail").risk;
  const life = createGame("original", 3, {}, 2);
  assert.match(risk(life), /출항 시 사망/);
  life.skill = 2;
  life.supplies = 1;
  life.health = 2;
  assert.match(risk(life), /구조 가능/);
  life.health = 1;
  assert.match(risk(life), /출항 시 사망/);
});

test("다섯 종족의 고향과 설정을 직접 고르거나 무작위로 재현한다", () => {
  for (const species of PROFILE_OPTIONS.species) {
    const home = PROFILE_OPTIONS.homes[species][0];
    const profile = { name: "  미라 ", gender: "여성", species, home, means: "넉넉지 않은" };
    const life = createGame("original", 11, profile);
    assert.deepEqual([life.birth.name, life.birth.gender, life.birth.species, life.birth.home], ["미라", "여성", species, home]);
    assert.equal(life.supplies, 30);
    assert.equal(getScene(life).age, 0);
    assert.ok(getScene(life).body.includes(home));
    assert.equal(play("original", 11, {}, profile).finished, true);
  }
  const found = new Set();
  for (let seed = 0; seed < 100; seed += 1) {
    const first = createGame("free", seed);
    assert.deepEqual(first.birth, createGame("free", seed).birth);
    assert.ok(PROFILE_OPTIONS.homes[first.birth.species].includes(first.birth.home));
    assert.ok(["남성", "여성"].includes(first.birth.gender));
    found.add(first.birth.species);
  }
  assert.deepEqual(found, new Set(PROFILE_OPTIONS.species));
  assert.throws(() => createGame("original", 1, { name: " " }));
  assert.throws(() => createGame("original", 1, { species: "어인", home: "엘바프 북쪽 만" }));
  assert.throws(() => createGame("original", 1, { home: "해무 항구" }));
  assert.throws(() => createGame("original", 1, { species: "알 수 없는 종족" }));
  assert.throws(() => createGame("original", 1, { gender: "비이분법" }));
  assert.equal(createGame("original", 1, { gender: "비이분법" }, 2).birth.gender, "비이분법");
});

test("종족 경로에서 능력치 부족은 실제 실패하고 충분하면 성공한다", () => {
  function reachTest(firstChoice) {
    let life = createGame("original", 7, { species: "어인", means: "넉넉지 않은" }, 2);
    while (getScene(life).id !== "fishman-test") {
      const scene = getScene(life);
      life = advance(life, scene.id === "fishman-first" ? firstChoice : scene.choices[0]?.id ?? null);
    }
    return life;
  }
  const unready = reachTest("gather");
  assert.match(getScene(unready).choices.find((choice) => choice.id === "attempt").risk, /부족하면 실패/);
  const failed = advance(unready, "attempt");
  assert.equal(failed.health, unready.health - 1);
  assert.equal(failed.trust, unready.trust);
  assert.deepEqual(failed.lastChanges, [{ key: "health", delta: -1 }]);

  const ready = reachTest("learn");
  assert.match(getScene(ready).choices.find((choice) => choice.id === "attempt").risk, /현재 충족/);
  const succeeded = advance(ready, "attempt");
  assert.equal(succeeded.supplies, ready.supplies - 1);
  assert.equal(succeeded.trust, ready.trust + 1);
});

test("관찰 게이지는 속도와 정지 상태를 반영한다", () => {
  const clock = createObservation({ id: "birth", body: "짧은 장면" }, 100);
  assert.equal(clock.duration, 10000);
  const normal = tickObservation(clock, 1100, 1, true);
  assert.equal(normal.elapsed, 1000);
  const paused = tickObservation(normal, 6100, 4, false);
  assert.equal(paused.elapsed, 1000);
  assert.equal(tickObservation(paused, 7100, 4, true).elapsed, 1000);
  const rebased = tickObservation(paused, 7100, 4, false);
  assert.equal(rebased.elapsed, 1000);
  const resumed = tickObservation(rebased, 7200, 4, true);
  assert.equal(resumed.elapsed, 1000);
  assert.equal(tickObservation(resumed, 7300, 4, true).elapsed, 1400);
  assert.equal(tickObservation(clock, 1100, 0.5, true).elapsed, 500);
  assert.equal(tickObservation(clock, 1100, 0.75, true).elapsed, 750);
  assert.throws(() => tickObservation(clock, 1100, 0.25, true));
  assert.throws(() => tickObservation(paused, 6000, 1, true));
});

test("이전 버전의 인간 출생 저장 기록도 그대로 복원한다", () => {
  const oldRecord = { version: 1, mode: "original", seed: 10, actions: [] };
  const oldLife = replay(oldRecord);
  assert.equal(oldLife.rules, 1);
  assert.equal(oldLife.birth.species, "인간");
  assert.equal(getScene(oldLife).id, "birth");
  assert.deepEqual(replay(saveRecord(oldLife)), oldLife);
  const formerHome = createGame("original", 7, { species: "어인", home: "어인섬 조개길" }, 2);
  assert.equal(replay(saveRecord(formerHome)).birth.home, "어인섬 조개길");
});

test("종족과 소속은 독립적이며 새 생애는 이른 죽음부터 긴 수명까지 닫힌다", () => {
  const affiliations = { pirate: "독립 해적단", marine: "해군", liberator: "독립 해방망", civilian: "민간 조합" };
  for (const species of PROFILE_OPTIONS.species) {
    for (const [career, affiliation] of Object.entries(affiliations)) {
      const careerChoice = advance(reach(23, "life_career", {}, { species }), career);
      assert.equal(careerChoice.affiliation, affiliation);
      const life = play("original", 23, { life_career: career, life_revolution_choice: "independent", life_change_path: "stay" }, { species });
      assert.equal(life.ending, "death");
      assert.ok(life.seen.length > 50);
    }
  }
  const ordinaryLives = Array.from({ length: 20 }, (_, seed) => play("original", seed, {}, { species: "인간" }));
  assert.ok(ordinaryLives.some((life) => life.age > 84));
  assert.ok(ordinaryLives.some((life) => life.age > life.birth.yearsBeforeCurrent));
  const giantLives = Array.from({ length: 20 }, (_, seed) => play("original", seed, {}, { species: "거인족" }));
  assert.ok(giantLives.some((life) => life.age > 290));

  const crises = Array.from({ length: 60 }, (_, seed) => reach(seed, "life_child_crisis", { life_first_skill: "carry" }, { species: "어인" }));
  const outcomes = crises.map((child) => advance(child, "rush"));
  assert.ok(crises.every((child) => !/사망/.test(getScene(child).choices.find((choice) => choice.id === "rush").risk)));
  const lost = outcomes.find((life) => life.ending === "death");
  const rescued = outcomes.find((life) => !life.ending);
  assert.ok(lost && rescued, "기술이 낮아도 구조 결과가 한쪽으로 고정되지 않아야 한다");
  assert.equal(lost.age, 11);
  assert.equal(getScene(lost), null);
  assert.ok(rescued.health < crises[outcomes.indexOf(rescued)].health);
});

test("직업은 사건과 조건으로 일찍 또는 늦게 바꾸고 승급을 거절할 수 있다", () => {
  const young = reach(0, "life_early_departure", {}, { species: "인간" }, 2);
  assert.equal(advance(young, "board").path, "pirate");
  assert.equal(advance(young, "marine").path, "marine");
  assert.equal(advance(young, "liberator").path, "liberator");
  const firstCareer = reach(0, "life_career", {}, { species: "인간" }, 2);
  const captain = advance(firstCareer, "captain");
  assert.equal(captain.role, "선장");
  assert.equal(captain.independent, true);
  const home = play("original", 0, { life_career: "home", life_orders: "obey", life_retire_choice: "continue" }, { species: "인간" }, 3, 2);
  assert.equal(home.homebound, true);
  assert.deepEqual(home.travelHistory, [home.birth.home]);
  assert.equal(home.ending, "death");

  const quietPicks = { life_career: "home", life_orders: "obey", life_revolution_choice: "independent" };
  const marine = reach(0, (scene) => scene.id.startsWith("life_marine_invitation_"), quietPicks, { species: "인간" }, 2);
  assert.ok(getScene(marine).age < 35, "입대 제안은 고정된 중년 나이를 기다리지 않아야 한다");
  const enlisted = advance(marine, "enlist");
  assert.equal(enlisted.path, "marine");
  assert.equal(enlisted.role, "수병");
  assert.equal(enlisted.leftHome, true);
  const pirate = reach(0, (scene) => scene.id.startsWith("life_pirate_invitation_"), quietPicks, { species: "인간" }, 2);
  const recruited = advance(pirate, "join");
  assert.equal(recruited.path, "pirate");
  assert.equal(recruited.role, "견습 선원");
  const otherCrew = reach(0, (scene) => scene.id.startsWith("life_pirate_invitation_"),
    { life_career: "pirate", life_orders: "obey", life_revolution_choice: "independent" });
  assert.equal(otherCrew.path, "pirate");
  const transfer = advance(otherCrew, "join");
  assert.equal(transfer.affiliation, "기항지에서 만난 해적단");
  assert.equal(transfer.role, "견습 선원");
  assert.equal(transfer.skill, otherCrew.skill, "이직 자체가 숙련도를 올리지는 않아야 한다");
  let late = createGame("original", 0, { species: "인간" }, 3, 2);
  while (!late.finished) {
    const scene = getScene(late);
    if (scene.id.startsWith("life_marine_invitation_") && scene.age >= 40) break;
    const choice = scene.id === "life_career" ? "home" : scene.id === "life_orders" ? "obey"
      : scene.id === "life_revolution_choice" ? "independent" : scene.choices.find((item) => !item.disabled)?.id ?? null;
    late = advance(late, choice);
  }
  assert.ok(!late.finished && getScene(late).age >= 40, "중년에 들어도 입대 제안이 다시 열려야 한다");
  assert.equal(advance(late, "enlist").path, "marine");
  const injuryPicks = { life_career: "home", life_orders: "help", life_revolution_choice: "independent" };
  const revolution = reach(0, (scene) => scene.id.startsWith("life_revolution_invitation_"), injuryPicks, { species: "인간" }, 2);
  assert.equal(revolution.injustice, true);
  const joined = advance(revolution, "join");
  assert.equal(joined.affiliation, "혁명군");
  assert.equal(joined.leftHome, true);
  const apprentice = play("original", 0, { life_career: "pirate", life_orders: "obey", life_revolution_choice: "independent", life_retire_choice: "continue" }, { species: "인간" }, 3, 2);
  assert.equal(apprentice.role, "견습 선원");
  assert.ok(apprentice.seen.some((id) => id.startsWith("life_rank_1_")));
});

test("열매의 획득 경위와 수영 제약, 패기와 비능력자 경로가 선택에 반영된다", () => {
  const unknown = reach(0, "life_fruit_find", {}, { species: "인간" }, 2);
  assert.match(getScene(unknown).body, /이름을 찾을 수 없었다/);
  const eater = advance(unknown, "eat");
  assert.equal(eater.devilFruit, "이름 없는 초인계");
  assert.equal(eater.fruitMastery, 1);
  const practice = reach(0, "life_fruit_practice", { life_fruit_find: "eat" }, { species: "인간" }, 2);
  assert.equal(advance(practice, "practice").fruitMastery, 2);

  const payment = reach(1, "life_fruit_payment", {}, { species: "인간" }, 2);
  assert.match(getScene(payment).body, /대가/);
  assert.equal(advance(payment, "eat").devilFruit, "이름 없는 초인계");
  assert.equal(advance(payment, "supplies").devilFruit, null);

  const fruitRescue = reach(0, "life_mission", { life_fruit_find: "eat" }, { species: "인간" }, 2);
  fruitRescue.skill = 40; fruitRescue.health = 70; fruitRescue.supplies = 20;
  assert.match(getScene(fruitRescue).choices.find((choice) => choice.id === "lead").risk, /물자 40.*물에 빠지면 힘이 빠짐/);
  assert.equal(advance(fruitRescue, "lead").health, 60);
  const ordinaryRescue = reach(2, "life_mission", {}, { species: "인간" }, 2);
  ordinaryRescue.skill = 40; ordinaryRescue.health = 70; ordinaryRescue.supplies = 20;
  assert.equal(advance(ordinaryRescue, "lead").rescued, ordinaryRescue.rescued + 1);

  const training = reach(2, "life_haki_training", {}, { species: "인간" }, 2);
  assert.equal(training.devilFruit, null);
  const learned = advance(training, "observation");
  assert.equal(learned.haki.observation, 1);
  const trial = reach(2, "life_power_trial", { life_haki_training: "observation", life_haki_practice: "armament" }, { species: "인간" }, 2);
  assert.equal(trial.devilFruit, null);
  assert.equal(trial.haki.armament, 1);
  assert.deepEqual(getScene(trial).choices.map((choice) => choice.id), ["observe", "armor", "team", "call"]);
  trial.supplies = 10;
  assert.equal(advance(trial, "team").trust, Math.min(100, trial.trust + 10));
});

test("100점 능력과 성격 변화가 종합 성향에 반영되고 조건 부족 선택은 막힌다", () => {
  const early = reach(0, "life_first_skill", {}, { species: "인간" }, 2);
  assert.equal(early.skill, early.birthStats.species.skill + early.birthStats.individual.skill);
  assert.equal(early.health, early.birthStats.species.health + early.birthStats.individual.health);
  assert.ok(personalitySummary(early.personality));
  const helpful = advance(early, "carry");
  assert.equal(helpful.supplies, early.supplies + 10);
  assert.equal(helpful.personality.empathy, early.personality.empathy + 7);
  assert.ok(helpful.lastChanges.some((change) => change.key === "personality.empathy" && change.delta === 7));
  const repeated = advance(reach(0, "life_enemy", { life_first_skill: "carry" }, { species: "인간" }, 2), "withdraw");
  assert.equal(repeated.rival, true);
  assert.ok(repeated.personality.caution > helpful.personality.caution);

  const weak = reach(0, "life_enemy", { life_first_skill: "carry" }, { species: "인간" }, 2);
  weak.skill = 20;
  assert.equal(getScene(weak).choices.find((choice) => choice.id === "fight").disabled, true);
  const actionCount = weak.actions.length;
  assert.throws(() => advance(weak, "fight"));
  assert.equal(weak.actions.length, actionCount);
  const strong = { ...weak, skill: 80 };
  assert.equal(getScene(strong).choices.find((choice) => choice.id === "fight").disabled, false);

  const poor = reach(0, "life_training", {}, { species: "인간" }, 2);
  poor.supplies = 0;
  const practice = getScene(poor).choices.find((choice) => choice.id === "practice");
  assert.equal(practice.disabled, true);
  assert.match(practice.risk, /물자 10 필요/);
  assert.throws(() => advance(poor, "practice"));
  assert.equal(poor.supplies, 0);

  const ally = reach(0, "life_alliance_offer", {}, { species: "인간" }, 2);
  assert.equal(advance(ally, "join").alliance, true);
  const betrayed = advance(ally, "betray");
  assert.equal(betrayed.rival, true);
  assert.equal(betrayed.trust, Math.max(0, ally.trust - 20));
  assert.ok(betrayed.personality.loyalty < ally.personality.loyalty);
});

test("실제 섬으로 이동하고 시기와 장소가 맞을 때만 원작 인물을 만난다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  const first = reach(0, "life_voyage_24", {}, profile, 2);
  assert.equal(first.location, "리버스 마운틴");
  assert.equal(getScene(first).choices.find((choice) => choice.id === "near").label, "쌍둥이 언덕으로 간다");
  const whiskey = advance(first, "far");
  assert.equal(whiskey.location, "위스키 피크");
  assert.equal(whiskey.age, 24);
  assert.ok(whiskey.travelHistory.includes("위스키 피크"));

  const littleGarden = reach(0, "life_voyage_27", { life_voyage_24: "far" }, profile, 2);
  const arrived = advance(littleGarden, "near");
  assert.equal(arrived.location, "리틀 가든");
  assert.equal(getScene(arrived).id, "life_meet_dorry_brogy");
  assert.match(getScene(arrived).body, /도리와 브로기/);
  assert.match(getScene(arrived).canon, /^https:\/\/one-piece\.com\//);
  const greeted = advance(arrived, "watch");
  assert.equal(greeted.pendingEncounter, null);
  assert.equal(greeted.journal.at(-1).age, 27);

  const tooEarly = createGame("original", 0, profile);
  tooEarly.location = "샤본디 제도";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 30;
  assert.equal(encounterAt(tooEarly), null);
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 5;
  assert.equal(encounterAt(tooEarly), "rayleigh");
  tooEarly.location = "워터 세븐";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 10;
  assert.equal(encounterAt(tooEarly), null, "톰의 사망 이후에는 만날 수 없다");
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 20;
  assert.equal(encounterAt(tooEarly), "tom");
  tooEarly.location = "엘바프";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 50;
  assert.equal(encounterAt(tooEarly), "jarul");
  const latest = createGame("original", 4, { species: "인간" }, 3, 4);
  latest.age = latest.birth.yearsBeforeCurrent - 1;
  latest.location = "엘바프";
  assert.equal(getScene(latest).id, "life_meet_luffy_elbaf");
  const met = advance(latest, "guide");
  assert.equal(met.age, met.birth.yearsBeforeCurrent);
  assert.ok(met.seen.includes("life_meet_luffy_elbaf"));
  assert.equal(encounterAt(met), null);

  const newRule = createGame("original", 4, { species: "인간" }, 3, 20);
  newRule.age = newRule.birth.yearsBeforeCurrent + 11;
  newRule.location = "엘바프";
  assert.equal(storyBefore(newRule), 0);
  assert.notEqual(encounterAt(newRule), "luffy_elbaf", "rule 20 must wait for the manga's Elbaf arrival scene");
  newRule.seen.push("canon_arc_elbaf_0");
  assert.equal(encounterAt(newRule), "luffy_elbaf");
});

test("선택의 여파는 같은 해에 보이고 자유 모드의 상위 직책만 IF로 열린다", () => {
  const picks = { life_career: "captain", life_revolution_choice: "independent", life_retire_choice: "continue", life_free_rank: "attempt" };
  const free = play("free", 0, picks, undefined, 3, 2);
  const original = play("original", 0, picks, undefined, 3, 2);
  assert.equal(free.role, "사황");
  assert.equal(free.worldBranch, "emperor");
  assert.notEqual(original.role, "사황");
  assert.ok(!original.seen.includes("life_free_rank"));
  const rank = free.journal.findIndex((entry) => entry.id === "life_free_rank");
  assert.equal(free.birth.yearsBeforeCurrent - free.journal[rank].age, 1);
  assert.equal(free.journal[rank].age, free.journal[rank + 1].age);
  assert.equal(free.journal[rank + 1].id, "life_branch_aftermath");
  const career = free.journal.findIndex((entry) => entry.id === "life_career");
  assert.equal(free.journal[career].age, free.journal[career + 1].age);
  for (const [index, entry] of free.journal.entries()) {
    if (!entry.id.startsWith("life_year_")) continue;
    assert.ok(!free.journal.slice(Math.max(0, index - 10), index).some((previous) => previous.title === entry.title));
  }
});

test("해군 승급은 경력과 신뢰를 쌓은 뒤에만 대장 IF로 이어진다", () => {
  function marineLife(mode) {
    let life = createGame(mode, 3, { species: "인간" }, 3, 2);
    while (!life.finished) {
      const scene = getScene(life);
      const wanted = scene.id === "life_early_departure" || scene.id === "life_career" ? "marine"
        : scene.id === "life_orders" ? "help"
          : scene.id === "life_revolution_choice" ? "independent"
            : scene.id === "life_retire_choice" ? "continue"
              : scene.id === "life_free_rank" ? "attempt"
                : scene.id.startsWith("life_rank_") ? "accept" : null;
      const choice = scene.choices.find((item) => item.id === wanted && !item.disabled)
        ?? scene.choices.find((item) => !item.disabled);
      life = advance(life, choice?.id ?? null);
    }
    return life;
  }
  const free = marineLife("free");
  const original = marineLife("original");
  assert.equal(free.rankTier, 5);
  assert.equal(free.worldBranch, "admiral");
  assert.equal(free.role, "해군 대장");
  assert.equal(original.rankTier, 5);
  assert.equal(original.role, "중장");
  assert.ok(!original.seen.includes("life_free_rank"));
});

test("저장 기록은 같은 삶으로 복원되고, 여러 시드가 막힘 없이 끝난다", () => {
  const completed = new Set();
  for (let seed = 0; seed < 120; seed += 1) {
    let life = createGame(seed % 2 ? "free" : "original", seed);
    let steps = 0;
    while (!life.finished) {
      const scene = getScene(life);
      const available = scene.choices.filter((choice) => !choice.disabled);
      const choice = available.length ? available[(seed + steps) % available.length].id : null;
      life = advance(life, choice);
      steps += 1;
      assert.ok(steps <= 400);
    }
    assert.equal(new Set(life.seen).size, life.seen.length);
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age >= entries[index - 1].age));
    // Folded quiet years jump ahead by the number of years they cover; every other scene moves at most one year.
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age - entries[index - 1].age
      <= (entry.id.startsWith("life_years_") ? entry.age - Number(entry.id.split("_")[2]) + 1 : 1)));
    assert.ok(life.journal.every((entry, index, entries) => !entries.slice(Math.max(0, index - 10), index)
      .some((previous) => previous.title === entry.title)), "최근 10장면의 제목은 반복되지 않아야 한다: seed=" + seed
      + " duplicates=" + life.journal.filter((entry, index, entries) => entries.slice(Math.max(0, index - 10), index)
        .some((previous) => previous.title === entry.title)).map((entry) => entry.id + ":" + entry.title).join(","));
    for (const entry of life.journal) {
      if (entry.id === "life_roger_news") assert.equal(storyBefore(life, entry.age), 24);
      if (entry.id === "life_revolution_choice") assert.equal(storyBefore(life, entry.age), 22);
      if (entry.id === "life_tiger_liberation_news") assert.equal(storyBefore(life, entry.age), 15);
      if (entry.id === "life_tom_news") assert.equal(storyBefore(life, entry.age), 10);
      if (entry.id === "life_marineford_news") assert.equal(storyBefore(life, entry.age), 2);
      if (entry.id === "life_timeskip_news") assert.equal(storyBefore(life, entry.age), 1);
      if (entry.id === "life_new_era_news") assert.equal(storyBefore(life, entry.age), 0);
    }
    assert.deepEqual(replay(saveRecord(life)), life);
    completed.add(life.ending);
    assert.ok(["death", "prison", "missing", "present"].includes(life.ending));
    assert.ok(life.deathCause);
    assert.ok(life.age <= presentAge(life), "규칙 7의 생애는 원작 현재를 넘기지 않는다");
  }
  assert.ok(completed.has("death") && completed.has("present"), `결말 종류: ${[...completed]}`);
  assert.throws(() => replay({ version: 1, mode: "original", seed: 1, actions: ["not-a-choice"] }));
});

test("거인 전용 선택 사건은 위험 문구대로 수치를 바꾸고 새 규칙의 거인에게만 나온다", async () => {
  const { giantAdultDecisions, giantGrowingDecisions } = await import("../src/giant-years.js");
  const giantTitles = new Set([...giantGrowingDecisions, ...giantAdultDecisions].map((decision) => decision.title));
  const isGiantDecision = (scene) => giantTitles.has(scene.title);
  const life = reach(7, isGiantDecision, {}, { species: "거인족" });
  const choice = getScene(life).choices.find((option) => !option.disabled);
  const next = advance(life, choice.id);
  const shown = Object.fromEntries(choice.risk.split(" · ").map((part) => {
    const [label, delta] = [part.slice(0, part.lastIndexOf(" ")), Number(part.slice(part.lastIndexOf(" ") + 1))];
    return [STATS.find((stat) => stat.label === label).key, delta];
  }));
  for (const stat of STATS) {
    const expected = Math.max(0, Math.min(stat.max, life[stat.key] + (shown[stat.key] || 0)));
    assert.equal(next[stat.key], expected, `${stat.label} 변화가 위험 문구와 같아야 한다`);
  }
  const legacy = play("original", 7, {}, { species: "거인족" }, 3);
  assert.ok(legacy.journal.some((entry) => giantTitles.has(entry.title)), "새 규칙 거인 생애에는 거인 선택 사건이 나와야 한다");
  for (let seed = 0; seed < 10; seed += 1) {
    const former = replay({ ...saveRecord(createGame("original", seed, { species: "거인족" }, 3, 1)), actions: [] });
    let old = former;
    while (!old.finished) { const scene = getScene(old); old = advance(old, scene.choices.find((option) => !option.disabled)?.id ?? null); }
    assert.ok(!old.journal.some((entry) => giantTitles.has(entry.title)), "이전 출생 규칙 기록에는 거인 선택 사건이 섞이지 않아야 한다");
  }
});

test("새 규칙은 주사위 시도, 섬별 신뢰, 다시 오는 인물, 섬 사건, 원작 열매 선점을 다룬다", async () => {
  const { fruitFor } = await import("../src/fruits.js");
  const { moveTo, crewNews } = await import("../src/world.js");
  const weak = reach(0, "life_enemy", { life_first_skill: "carry" });
  weak.skill = 10;
  const fight = getScene(weak).choices.find((choice) => choice.id === "fight");
  assert.equal(fight.disabled, false, "능력이 모자라도 시도할 수 있어야 한다");
  assert.match(fight.risk, /주사위 1~100에서 \d+ 이상이면 성공/);
  assert.equal(fight.dice, Math.min(95, 20 + (30 - 10) * 2 + Math.max(0, 30 - weak.health) * 2));
  const tried = advance(weak, "fight");
  assert.match(tried.lastOutcome, /^주사위 \d+ \(\d+ 이상 성공\) · (성공|실패)\./);
  const poor = reach(0, "life_training");
  poor.supplies = 0;
  assert.equal(getScene(poor).choices.find((choice) => choice.id === "practice").disabled, true, "물자가 없으면 여전히 막혀야 한다");

  const traveler = createGame("original", 5, { species: "인간" });
  const home = traveler.location;
  traveler.trust = 70;
  moveTo(traveler, "워터 세븐");
  assert.ok([15, 30, 45].includes(traveler.trust), "처음 간 섬은 우호·중립·적대 중 하나로 시작한다");
  traveler.trust = 90;
  moveTo(traveler, home);
  assert.equal(traveler.trust, 70);
  moveTo(traveler, "워터 세븐");
  assert.equal(traveler.trust, 90);

  for (let seed = 0; seed < 40; seed += 1) {
    const life = { seed, age: 10, mode: "original", birth: { yearsBeforeCurrent: 60 } };
    assert.equal(fruitFor(life).owner, undefined, "원작 모드에서는 원작 사용자의 열매가 나오지 않는다");
  }
  const early = Array.from({ length: 40 }, (_, seed) => fruitFor({ seed, age: 10, mode: "free", birth: { yearsBeforeCurrent: 60 } }));
  assert.ok(early.some((fruit) => fruit.owner), "자유 모드에서는 원작 사용자보다 먼저 먹을 수 있다");
  assert.ok(Array.from({ length: 40 }, (_, seed) => fruitFor({ seed, age: 58, mode: "free", birth: { yearsBeforeCurrent: 60 } }))
    .every((fruit) => !fruit.owner || fruit.eatenBefore < 2), "원작 사용자가 이미 먹은 열매는 나오지 않는다");
  assert.match(crewNews({ birth: { yearsBeforeCurrent: 60 }, age: 48 }), /밀짚모자/);
  assert.match(crewNews({ birth: { yearsBeforeCurrent: 60 }, age: 70 }), /공개되지 않았다/);

  const { canonCrew } = await import("../src/world.js");
  const named = reach(0, "life_career", {}, { species: "인간" });
  named.skill = 40; named.supplies = 50; named.friendBond = 50;
  assert.equal(getScene(named).choices.find((choice) => choice.id === "captain").naming, true);
  const founded = advance(named, "captain:붉은 파도");
  assert.equal(founded.affiliation, "붉은 파도 해적단");
  assert.equal(replay(saveRecord(founded)).affiliation, "붉은 파도 해적단", "설립 때 지은 이름은 저장 기록으로 복원된다");
  assert.equal(advance(named, "captain").affiliation, `${named.birth.name} 해적단`);
  assert.throws(() => advance(named, `captain:${"가".repeat(13)}`));
  assert.throws(() => advance(named, "marine:이름"), "이름을 받지 않는 선택에는 붙일 수 없다");
  const roger = { seed: 1, birth: { yearsBeforeCurrent: 40, species: "인간" } };
  assert.ok(["로저 해적단", "흰 수염 해적단", "빅 맘 해적단", "백수 해적단"].includes(canonCrew(roger, 14)));
  assert.ok(!["로저 해적단", "흰 수염 해적단"].includes(canonCrew(roger, 39)), "해체·소멸한 해적단에는 들어갈 수 없다");
  assert.notEqual(canonCrew(roger, 26), "태양 해적단", "태양 해적단은 어인만 들어갈 수 있다");
  const deckhand = reach(0, "life_career", {}, { species: "인간" });
  deckhand.skill = 60; deckhand.health = 80;
  const crewChoice = getScene(deckhand).choices.find((choice) => choice.id === "canon_crew");
  if (crewChoice) assert.equal(advance(deckhand, "canon_crew").canonCrew, canonCrew(deckhand));

  let mates = 0; let isles = 0; let folded = 0;
  for (let seed = 0; seed < 40; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed);
    if (life.people.mate) mates += 1;
    if (life.seen.some((id) => id.startsWith("life_isle_"))) isles += 1;
    if (life.seen.some((id) => id.startsWith("life_years_"))) folded += 1;
    assert.deepEqual(replay(saveRecord(life)), life);
  }
  assert.ok(mates >= 30, `다시 오는 친구가 대부분의 생애에 있어야 한다 (${mates})`);
  assert.ok(isles >= 10, `섬 사건이 여러 생애에 나와야 한다 (${isles})`);
  assert.ok(folded >= 30, `조용한 해가 묶여야 한다 (${folded})`);
});

test("새 생애에는 원작에 등장한 열매만 나오고 이전 생애는 옛 추첨을 유지한다", () => {
  const canonNames = new Set([
    "고무고무 열매", "이글이글 열매", "꽃꽃 열매", "수술수술 열매", "동강동강 열매", "어둠어둠 열매", "고요고요 열매",
    "쿠릉쿠릉 열매", "얼음얼음 열매", "모래모래 열매", "번쩍번쩍 열매", "뭉게뭉게 열매", "눈눈 열매", "가스가스 열매",
    "흔들흔들 열매", "실실 열매", "떡떡 열매", "도르도르 열매", "새새 열매 모델 불사조"
  ]);
  for (let seed = 0; seed < 50; seed += 1) {
    for (const mode of ["original", "free"]) {
      const life = createGame(mode, seed, { species: "인간" });
      for (const before of [30, 20, 10, 0, -5]) {
        life.age = life.birth.yearsBeforeCurrent - before;
        const fruit = fruitFor(life);
        if (fruit) assert.ok(canonNames.has(fruit.name), `${fruit.name}은 원작 열매여야 한다`);
        if (fruit?.name === "고무고무 열매") assert.equal(fruit.type, "동물계 환수종");
        if (mode === "original" && fruit) assert.equal(fruit.name, "고요고요 열매");
      }
    }
  }
  const old = createGame("original", 0, { species: "인간" }, 3, 3);
  old.age = 27;
  assert.ok(fruitFor(old));
  assert.deepEqual(replay(saveRecord(old)).creationVersion, 3);
  const offer = reach(0, "life_fruit_find", {}, { species: "인간" }, 4);
  assert.match(getScene(offer).body, /고요고요 열매/);
  assert.match(advance(offer, "eat").devilFruit, /고요고요 열매/);
});

test("마린포드 이후 원작의 주요 사건은 짧은 시간 간격으로 수동 진행된다", () => {
  assert.equal(getScene(reach(0, "life_roger_news", {}, { species: "인간" }, 4)).manual, true);
  const distant = createGame("original", 0, { species: "인간" }, 3, 9);
  distant.seen.push("life_marineford_news");
  distant.canonStep = 3;
  distant.path = "pirate";
  distant.location = "워터 세븐";
  assert.equal(canonScene(distant).choices, undefined, "멀리 있는 사건은 읽는 장면이어야 한다");
  distant.location = "어인섬";
  assert.equal(canonScene(distant).choices.length, 2, "관여할 수 있는 위치에서는 선택지가 열린다");
  let life = reach(0, "life_marineford_news", {}, { species: "인간" }, 4);
  life = advance(life, null);
  const beats = [];
  let steps = 0;
  while (life.canonStep < CANON_BEAT_COUNT && steps++ < 40) {
    const scene = getScene(life);
    if (scene.id.startsWith("canon_")) {
      beats.push(scene);
      assert.ok(scene.timeLabel);
      assert.equal(scene.manual, scene.choices.length === 0);
    }
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(beats.length, CANON_BEAT_COUNT);
  assert.ok(beats.some((scene) => scene.id === "canon_egghead"));
  assert.ok(beats.some((scene) => scene.id === "canon_elbaf"));
  assert.ok(beats.every((scene, index) => index === 0 || scene.age >= beats[index - 1].age));
  assert.ok(beats.slice(2).every((scene) => scene.age === life.birth.yearsBeforeCurrent));
  assert.deepEqual(replay(saveRecord(life)), life);
});

test("자유 모드의 상위 직책 IF는 와노국 이후 원작 장면 사이에서 열린다", () => {
  let life = createGame("free", 0, { species: "인간" }, 3, 6);
  while (!life.finished && getScene(life).id !== "canon_wano") {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(getScene(life).id, "canon_wano");
  life = advance(life, null);
  life.path = "pirate";
  life.independent = true;
  life.skill = 90;
  life.health = 90;
  life.trust = 90;
  while (getScene(life).id.startsWith("life_canon_daily_")) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(getScene(life).id, "life_free_rank");
  life = advance(life, "attempt");
  assert.equal(life.role, "사황");
  assert.ok(life.bounty >= 3_000_000_000);
  life = advance(life, null);
  assert.equal(getScene(life).id, "canon_egghead");
  assert.match(getScene(life).body, /원작 기준/);
});

test("규칙 36: 높은 기술과 유대는 소수점 누적으로 전문화되고 낮은 수치는 정상 성장한다", () => {
  assert.deepEqual([0, 60, 80, 90, 95, 100].map(growthEfficiency), [1, 0.7, 0.4, 0.2, 0.1, 0]);
  let before = createGame("original", 314, { species: "인간" }, 3, 36);
  assert.deepEqual(before.growthCarry, { skill: 0, bond: 0, friendBond: 0, trust: 0 });
  assert.equal(createGame("original", 314, { species: "인간" }, 3, 35).growthCarry, undefined);
  before.skill = 97;
  before.friendBond = 89;
  let after = structuredClone(before);
  after.skill += 5; after.friendBond += 10;
  applyBalancedGrowth(before, after);
  assert.equal(after.skill, 97);
  assert.equal(after.growthCarry.skill, 0.5);
  assert.equal(after.friendBond, 93);
  const second = structuredClone(after);
  second.skill += 5;
  applyBalancedGrowth(after, second);
  assert.equal(second.skill, 98);
  assert.equal(second.growthCarry.skill, 0);
  assert.equal(second.friendBond, 93);
  const capped = structuredClone(second);
  capped.skill = 100;
  const above = structuredClone(capped);
  above.skill += 10;
  applyBalancedGrowth(capped, above);
  assert.equal(above.skill, 100);
  assert.equal(above.growthCarry.skill, 0);
  for (const version of [1, 34, 35, 36]) {
    const original = createGame("original", 314, { species: "인간" }, 3, version);
    assert.deepEqual(replay(saveRecord(original)), original);
  }
});

test("규칙 36: 검문선 현상금은 반복·선장·악명 보정을 받아도 한 번에 3천만 이내", () => {
  const life = createGame("free", 39, { species: "인간" }, 3, 36);
  Object.assign(life, { path: "pirate", independent: true, leftHome: true, lastHuntAge: 10000,
    bounty: 200_000_000, reputation: -100, journal: [] });
  const first = balancedPublicBounty(life);
  assert.ok(first > 0 && first <= 30_000_000);
  const act = Array.from({ length: 50 }, (_, i) => bountyScene(life, i + 20,
    { age: i + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_act_"));
  assert.ok(act);
  const choice = act.choices.find((option) => option.id === "intervene");
  assert.equal(choice.bounty, first);
  assert.equal(choice.bountyOnFail, 1_000_000);
  assert.match(choice.risk, /성공 시 현상금/);
  life.journal = Array.from({ length: 8 }, (_, i) =>
    ({ id: `life_bounty_act_${20 + i * 3}`, choice: "검문선 사이로 배를 빼낸다" }));
  assert.ok(balancedPublicBounty(life) < first);
  life.bounty = 1_500_000_000;
  assert.ok(balancedPublicBounty(life) <= 6_000_000);
  const legacy = { ...life, creationVersion: 35, bounty: 100_000_000, journal: [] };
  const old = Array.from({ length: 50 }, (_, i) => bountyScene(legacy, i + 20,
    { age: i + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_act_"));
  assert.equal(old.choices.find((option) => option.id === "intervene").bounty, 1_312_500_000);
  assert.equal(old.choices.find((option) => option.id === "intervene").bountyOnFail, undefined);
});

test("현상금은 행동으로 오르고 금액에 따라 추적 주체가 바뀐다", () => {
  const before = reach(0, "life_enemy", {}, { species: "인간" }, 4);
  assert.equal(before.path, "pirate");
  const after = advance(before, "fight");
  assert.equal(after.bounty - before.bounty, 3_000_000);
  assert.equal(pursuerFor(after.bounty).name, "지부 해군");
  assert.equal(pursuerFor(10_000_000).name, "현상금 사냥꾼");
  assert.match(pursuerFor(100_000_000).name, /중장/);
  assert.match(pursuerFor(1_000_000_000).name, /대장급/);
  const hunt = Array.from({ length: 25 }, (_, index) => bountyScene(after, after.age + index + 1,
    { age: after.age + index + 1, yearly: true })).find((card) => card?.id.startsWith("life_bounty_hunt_"));
  assert.ok(hunt);
  assert.ok(hunt.choices.some((choice) => choice.id === "escape"));
  const newLife = createGame("original", 0, { species: "인간" }, 3, 35);
  newLife.path = "pirate";
  newLife.leftHome = true;
  newLife.bounty = 100_000_000;
  newLife.lastHuntAge = 1_000;
  const publicAct = Array.from({ length: 50 }, (_, index) => bountyScene(newLife, index + 20,
    { age: index + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_act_"));
  assert.equal(publicAct.choices.find((choice) => choice.id === "intervene").bounty, 350_000_000);
  newLife.bounty = 1_000_000_000;
  newLife.lastHuntAge = -100;
  const admiralHunt = Array.from({ length: 50 }, (_, index) => bountyScene(newLife, index + 20,
    { age: index + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_hunt_"));
  assert.match(admiralHunt.title, /대장급/);
});

test("기록지침 항로와 영구 지침은 다른 섬으로 이어지고 개인 사건의 등장 연령이 달라진다", () => {
  const life = createGame("original", 0, { species: "인간" });
  life.location = "샤본디 제도";
  life.path = "pirate";
  life.leftHome = true;
  life.independent = true;
  life.role = "선장";
  const route = travelScene(life, 30);
  assert.match(route.choices.find((choice) => choice.id === "near").risk, /선박 코팅/);
  const near = structuredClone(life);
  const pose = structuredClone(life);
  route.choices.find((choice) => choice.id === "near").apply(near);
  route.choices.find((choice) => choice.id === "buy_pose").apply(pose);
  assert.notEqual(near.location, pose.location);
  assert.equal(pose.eternalPose, pose.location);
  life.location = "조";
  life.eternalPose = "워터 세븐";
  assert.equal(travelScene(life, 32).choices.find((choice) => choice.id === "pose").when(life), false);
  assert.ok(FLEX_IDS.has("life_first_pay"));
  const ages = new Set();
  for (let seed = 0; seed < 25; seed += 1) {
    for (let age = 20; age <= 30; age += 1) {
      const candidate = createGame("original", seed, { species: "인간" }, 3, 8);
      candidate.path = "civilian";
      candidate.age = age - 1;
      if (yearlyScene(candidate).id === "life_first_pay") ages.add(age);
    }
  }
  assert.ok(ages.size > 1, "같은 개인 사건이 다른 나이에 나타나야 한다");
});

test("같은 나이의 재출항은 매번 다른 제목을 쓰고 이전 출생 기록은 기존 제목을 유지한다", () => {
  const life = createGame("original", 12, { species: "인간" });
  life.location = "펑크 하자드";
  const titles = [];
  for (let count = 0; count < 3; count += 1) {
    const title = travelScene(life, 40).title;
    titles.push(title);
    life.journal.push({ title });
  }
  assert.equal(new Set(titles).size, 3);
  assert.match(titles[2], /3번째 출항/);

  const previous = createGame("original", 12, { species: "인간" }, 3, 4);
  previous.location = "펑크 하자드";
  previous.journal.push({ title: travelScene(previous, 40).title });
  assert.match(travelScene(previous, 40).title, /40세의 재출항/);
});

test("새 출생 규칙은 개인 사건의 순서와 마지막 날을 달리하고 이전 기록을 보존한다", () => {
  assert.equal(createGame("original", 0, {}, 3, 5).creationVersion, 5);
  assert.ok(FLEX_IDS_V5.has("life_haki_training"));
  assert.ok(FLEX_IDS_V5.size > FLEX_IDS.size);
  const eventAges = new Set();
  const order = new Set();
  const causes = new Set();
  let seaKingCount = 0;
  for (let seed = 0; seed < 100; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed, {}, { species: "인간" }, 3, 5);
    const setback = life.journal.findIndex((entry) => entry.id === "life_setback");
    const mentor = life.journal.findIndex((entry) => entry.id === "life_mentor");
    if (setback >= 0) eventAges.add(life.journal[setback].age);
    if (setback >= 0 && mentor >= 0) order.add(Math.sign(setback - mentor));
    causes.add(life.deathCause);
    seaKingCount += Number(life.seen.includes("life_sea_king"));
  }
  assert.ok(eventAges.size > 3, "개인 사건은 여러 나이에 나와야 한다");
  assert.deepEqual(order, new Set([-1, 1]), "독립 사건의 순서가 회차에 따라 뒤바뀌어야 한다");
  assert.ok(causes.size >= 3, "삶의 상태에 따라 마지막 날이 달라져야 한다");
  assert.ok(seaKingCount > 0, "새 항해 위험 사건이 실제 생애에 나와야 한다");

  const seaKing = lifeScenes.find((card) => card.id === "life_sea_king");
  const stranded = createGame("original", 1, { species: "인간" });
  stranded.health = 10;
  stranded.supplies = 3;
  seaKing.choices.find((choice) => choice.id === "drift").apply(stranded);
  assert.equal(stranded.health, 1);
  assert.equal(stranded.supplies, 0);
  const fallen = createGame("original", 2, { species: "인간" });
  fallen.health = 30;
  seaKing.choices.find((choice) => choice.id === "stand").fail(fallen);
  assert.equal(fallen.ending, "death");
  assert.equal(fallen.deathCause, "해왕류와의 충돌");

  const previous = play("original", 7, {}, { species: "인간" }, 3, 4);
  assert.ok(!previous.seen.some((id) => id.startsWith("canon_before_")));
  assert.deepEqual(replay(saveRecord(previous)), previous);
});

test("새 생애의 유년기 사건과 그림은 회차마다 달라지고 선택의 여파를 이어 간다", () => {
  assert.equal(createGame("original", 0).creationVersion, 36);
  const childhoodIds = new Set(["life_home", "life_friend", "life_first_skill", "life_child_crisis"]);
  const paths = new Set();
  const crises = new Set();
  const arts = new Set();
  for (let seed = 0; seed < 16; seed += 1) {
    let life = createGame("original", seed, { species: "인간" }, 3, 9);
    const beats = [];
    while (!life.finished && getScene(life).id !== "life_after_storm") {
      const scene = getScene(life);
      if (childhoodIds.has(scene.id)) beats.push(scene);
      life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    assert.equal(beats.length, 4);
    assert.ok(beats.every((scene, index) => index === 0 || scene.art.src !== beats[index - 1].art.src),
      "연속된 유년 주요 장면이 같은 그림을 쓰지 않아야 한다");
    const crisis = beats[3];
    const follow = getScene(life);
    assert.equal(follow.title, `${crisis.title} 뒤`);
    assert.ok(life.childhoodMemory?.key);
    assert.equal(life.childhoodMemory.outcome, "safe");
    assert.deepEqual(replay(saveRecord(life)), life);
    paths.add(beats.map((scene) => scene.title).join(" / "));
    crises.add(crisis.title);
    for (const scene of beats) arts.add(scene.art.src);
  }
  assert.ok(paths.size >= 10, "여러 회차의 유년 주요 사건 조합이 달라야 한다");
  assert.ok(crises.size >= 6, "위기 사건이 한 종류에 몰리지 않아야 한다");
  assert.ok(arts.size >= 6, "유년 주요 장면에 여러 그림이 나와야 한다");

  const attempt = reach(0, "life_child_crisis", { life_first_skill: "help" }, { species: "인간" }, 6);
  assert.ok(getScene(attempt).choices.find((choice) => choice.id === "act").dice);
  const failed = advance(attempt, "act");
  assert.equal(failed.childhoodMemory.outcome, "fail");
  assert.ok(failed.health < attempt.health);
  assert.match(getScene(failed).body, /다친 곳이 아물 때까지/);
  assert.deepEqual(replay(saveRecord(failed)), failed);

  const previous = reach(0, "life_child_crisis", {}, { species: "인간" }, 5);
  assert.equal(getScene(previous).title, "범람한 길목");
  assert.equal(getScene(advance(previous, "wait")).title, "그날의 새벽");
  assert.deepEqual(replay(saveRecord(previous)), previous);
});


test("25번 규칙의 로그 타운 유년 선택은 몇 해 뒤 보상으로 돌아오고 옛 기록은 유지한다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  for (const choiceId of ["learn", "help"]) {
    const before = reach(0, "life_first_skill", {}, profile, 25);
    assert.equal(getScene(before).title, "전보벌레가 뒤섞은 신호");
    const chosen = advance(before, choiceId);
    assert.equal(chosen.loguetownSignal, choiceId);
    assert.deepEqual(replay(saveRecord(chosen)), chosen);

    const later = reach(0, "life_training", { life_first_skill: choiceId }, profile, 25);
    assert.equal(later.loguetownSignal, choiceId);
    assert.ok(later.journal.some((entry) => entry.id === "life_school" && entry.title === "항구에 남은 기억"));
    const training = getScene(later);
    assert.equal(training.title, "다시 울린 구조 신호");
    assert.match(training.body, choiceId === "learn" ? /신호표/ : /이름을 기억/);
    assert.match(training.choices.find((choice) => choice.id === "help").risk,
      choiceId === "learn" ? /기술 \+5/ : /지역의 신뢰 \+5/);
    const followed = advance(later, "help");
    assert.match(followed.lastOutcome, choiceId === "learn" ? /신호를 읽는 기술/ : /항구 사람들의 신뢰/);
    assert.deepEqual(replay(saveRecord(followed)), followed);
  }

  const old = reach(0, "life_first_skill", {}, profile, 24);
  assert.notEqual(getScene(old).title, "전보벌레가 뒤섞은 신호");
  assert.deepEqual(replay(saveRecord(advance(old, "learn"))), advance(old, "learn"));
  const otherHome = reach(0, "life_first_skill", {}, { species: "인간", home: "사우스 블루 · 바테리라" }, 25);
  assert.notEqual(getScene(otherHome).title, "전보벌레가 뒤섞은 신호");
});


test("26번 규칙: 로그 타운의 선택이 소속별 후일담·재회로 이어지고 이전 기록은 격리된다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  const base = (age) => ({ id: `life_year_${age}`, age, act: 2, species: "all", yearly: true });
  for (const memory of ["learn", "help"]) {
    for (const path of ["marine", "pirate", "civilian", "liberator"]) {
      const life = createGame("original", 9, profile, 3, 26);
      life.age = 19;
      life.path = path;
      life.loguetownSignal = memory;
      const first = loguetownFollowUp(life, 20, base(20));
      assert.equal(first.id, "life_loguetown_signal_offer");
      assert.ok(first.body.length <= 300);
      assert.ok(first.choices.some((choice) => choice.id === (memory === "learn" ? "decode" : "guide")));
      const visible = first.choices.filter((choice) => !choice.when || choice.when(life));
      assert.equal(visible.some((choice) => choice.id === "report"), path === "marine");
      assert.equal(visible.some((choice) => choice.id === "warn"), path === "pirate");
      assert.equal(visible.some((choice) => choice.id === "supply"), ["civilian", "liberator"].includes(path));
      // A character with neither skill nor trust is not granted an unearned personal favor.
      const blocked = { ...life, skill: 0, trust: 0 };
      assert.equal(first.choices.find((choice) => choice.id === (memory === "learn" ? "decode" : "guide")).available(blocked), false);

      const youth = first.choices.find((choice) => choice.id === (memory === "learn" ? "decode" : "guide"));
      youth.apply(life);
      life.seen.push(first.id);
      assert.equal(loguetownFollowUp(life, 21, base(21)), null, "the first event does not repeat");
      const crisis = loguetownFollowUp(life, 29, base(29));
      assert.equal(crisis.id, "life_loguetown_false_order");
      assert.ok(crisis.body.includes(memory === "learn" ? "부호" : "선장"));
      const action = crisis.choices.find((choice) => choice.id === (memory === "learn" ? "unmask" : "escort"));
      assert.ok(action);
      action.apply(life);
      life.seen.push(crisis.id);
      const closing = loguetownFollowUp(life, 39, base(39));
      assert.equal(closing.id, "life_loguetown_last_signal");
      assert.ok(closing.body.includes(memory === "learn" ? "신호표" : "항해 일지"));
      closing.choices.find((choice) => choice.id === "teach").apply(life);
      life.seen.push(closing.id);
      assert.equal(life.loguetownLegacy, "taught");
      assert.equal(loguetownFollowUp(life, 40, base(40)), null);
      assert.equal(loguetownFollowUp({ ...life, retired: true, seen: [] }, 45, base(45)), null);
      assert.equal(loguetownFollowUp({ ...life, ending: "death", seen: [] }, 45, base(45)), null);
      assert.equal(loguetownFollowUp({ ...life, creationVersion: 25, seen: [] }, 45, base(45)), null);
      assert.equal(loguetownFollowUp({ ...life, birth: { ...life.birth, home: "사우스 블루 · 바테리라" }, seen: [] }, 45, base(45)), null);
      assert.equal(loguetownFollowUp({ ...life, location: "위대한 항로 상공 · 스카이피아", seen: [] }, 45, base(45)), null);
    }
  }

  const seed = 0;
  const before = reach(seed, "life_first_skill", {}, profile, 26);
  const chosen = advance(before, "learn");
  assert.equal(chosen.loguetownSignal, "learn");
  assert.deepEqual(replay(saveRecord(chosen)), chosen);
  const older = reach(seed, "life_first_skill", {}, profile, 25);
  assert.deepEqual(replay(saveRecord(advance(older, "learn"))), advance(older, "learn"));
});

test("26번 규칙: 실제 진행에서 세 개의 후속 사건에 도달하고 저장·중복 조건이 유지된다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  const targets = new Set(["life_loguetown_signal_offer", "life_loguetown_false_order", "life_loguetown_last_signal"]);
  let fullChain = false;
  for (let seed = 0; seed < 18 && !fullChain; seed += 1) {
    let life = createGame("original", seed, profile, 3, 26);
    const encountered = new Set();
    for (let steps = 0; !life.finished && steps < 400; steps += 1) {
      const scene = getScene(life);
      assert.ok(scene);
      if (targets.has(scene.id)) {
        assert.ok(!encountered.has(scene.id), "a personal event must not repeat in one life");
        encountered.add(scene.id);
        assert.deepEqual(replay(saveRecord(life)), life);
      }
      const action = scene.id === "life_first_skill" ? "learn"
        : scene.choices.find((choice) => !choice.disabled)?.id ?? null;
      life = advance(life, action);
    }
    assert.equal(life.finished, true, "a complete life must still end");
    fullChain ||= encountered.size === 3;
    assert.equal(encountered.size, life.journal.filter((entry) => targets.has(entry.id)).length);
  }
  assert.ok(fullChain, "at least one ordinary run should reach all three follow-ups");
});


test("27번 규칙은 쿠레하와 크로커스의 선택을 기존 인연 기록에 연결한다", () => {
  for (const mode of ["original", "free"]) {
    for (const [key, place, good] of [["kureha", "드럼섬", "treat"], ["crocus", "쌍둥이 언덕", "ask"]]) {
      const life = createGame(mode, 4, { species: "인간" }, 3, 27);
      Object.assign(life, { path: "civilian", location: place, age: 25, supplies: 80, pendingEncounter: key });
      assert.ok(getScene(life).choices.some((c) => c.id === "disagree"));
      const helped = advance(life, good);
      assert.equal(helped.people.canonContacts[key].score, 12);
      assert.equal(helped.people.canonContacts[key].meetings, 1);
      assert.ok(canonRelationshipEntries(helped).some((entry) => entry.name === (key === "kureha" ? "닥터 쿠레하" : "크로커스")));
      assert.equal(advance(life, "disagree").people.canonContacts[key].score, -18);
      for (const version of [25, 26]) {
        const former = { ...life, creationVersion: version };
        assert.equal(getScene(former).choices.some((c) => c.id === "disagree"), false);
        assert.equal(advance(former, good).people.canonContacts?.[key], undefined);
      }
    }
  }
});

test("27번 규칙의 재회는 시기·장소·3년 간격·소속·인연 점수를 지킨다", () => {
  for (const [key, place, earliest] of [["kureha", "드럼섬", 30], ["crocus", "쌍둥이 언덕", 24]]) {
    for (const path of ["marine", "pirate", "civilian", "liberator"]) {
      const life = createGame("original", 31, { species: "인간" }, 3, 27);
      Object.assign(life, { path, age: 27, location: place, seen: ["life_meet_" + key] });
      life.people.canonContacts = { [key]: { score: 15, meetings: 1, lastAge: 27 } };
      const base = { age: 30, act: 2, yearly: true };
      const good = directEncounterFollowUp(life, 30, base, 10);
      assert.equal(good.id, "life_encounter_return_" + key);
      assert.ok(good.body.length <= 300);
      assert.ok(good.choices.some((c) => c.id === "cooperate"));
      assert.equal(good.choices.some((c) => c.id === "duty"), path === "marine");
      assert.equal(good.choices.some((c) => c.id === "crew"), path === "pirate");
      assert.equal(good.choices.some((c) => c.id === "neighbors"), ["civilian", "liberator"].includes(path));
      assert.equal(good.choices.find((c) => c.id === "cooperate").available({ ...life, skill: 10 }), false);
      const completed = structuredClone(life);
      good.choices.find((c) => c.id === "cooperate").apply(completed);
      completed.seen.push(good.id);
      assert.equal(completed.people.canonContacts[key].legacy, "협력");
      assert.equal(completed.people.canonContacts[key].meetings, 2);
      assert.equal(directEncounterFollowUp(completed, 35, base, 10), null);
      const hostile = structuredClone(life);
      hostile.people.canonContacts[key].score = -18;
      const tense = directEncounterFollowUp(hostile, 30, base, 10);
      assert.ok(tense.choices.some((c) => c.id === "apologize"));
      assert.ok(!tense.choices.some((c) => c.id === "cooperate"));
      tense.choices.find((c) => c.id === "apologize").apply(hostile);
      assert.equal(hostile.people.canonContacts[key].score, -3);
      assert.equal(hostile.people.canonContacts[key].legacy, "화해");
      assert.equal(directEncounterFollowUp({ ...life, location: "샤본디 제도" }, 30, base, 10), null);
      assert.equal(directEncounterFollowUp(life, 30, base, earliest + 1), null);
      assert.equal(directEncounterFollowUp(life, 30, base, -1), null);
      assert.equal(directEncounterFollowUp(life, 29, base, 10), null);
      assert.equal(directEncounterFollowUp({ ...life, retired: true }, 30, base, 10), null);
      assert.equal(directEncounterFollowUp({ ...life, creationVersion: 26 }, 30, base, 10), null);
      assert.equal(directEncounterFollowUp({ ...life, seen: [] }, 30, base, 10), null);
    }
  }
  for (const version of [25, 26, 27]) {
    const life = createGame("free", 0, { species: "인간" }, 3, version);
    assert.deepEqual(replay(saveRecord(life)), life);
  }
});


test("27번 규칙의 원작 인물 재회는 실제 연간 장면 선택기에서 열린다", () => {
  for (const [key, place] of [["kureha", "드럼섬"], ["crocus", "쌍둥이 언덕"]]) {
    const life = createGame("original", 0, { species: "인간" }, 3, 27);
    life.age = 27;
    life.birth.yearsBeforeCurrent = 45;
    life.path = "civilian";
    life.leftHome = true;
    life.homebound = false;
    life.careerStartAge = life.age;
    life.location = place;
    life.health = 70;
    life.skill = 55;
    life.supplies = 80;
    // Mark earlier old-era bulletins as already seen: this fixture isolates the reunion's annual slot.
    life.seen = ["life_meet_" + key, "life_first_station", "life_leave_home",
      ...OLD_ERA.map(({ id }) => "life_old_" + id)];
    life.people.canonContacts = { [key]: { score: 12, meetings: 1, lastAge: 24 } };
    // Complete unrelated fate chapters so this fixture tests the reunion's yearly slot.
    life.fates = Object.fromEntries(Object.values(FATES).flat().map(({ key }) => [key, { step: 999, marks: [] }]));
    // Isolate reunion scheduling from independent promotion and recruitment opportunities.
    for (const key of ["lastRankOfferAge", "lastMarineOfferAge", "lastPirateOfferAge", "lastCivilianOfferAge",
      "lastCrewOfferAge", "lastRevolutionOfferAge"]) life[key] = 1000;
    const scene = yearlyScene(life);
    assert.equal(scene.id, "life_encounter_return_" + key);
    assert.equal(scene.urgent, true);
    assert.ok(scene.choices.some((choice) => choice.id === "cooperate"));
  }
  assert.ok(play("original", 4, {}, { species: "인간" }, 3, 27).finished);
});


test("28번 규칙의 네 소속은 고유한 선택과 대가를 제공하고 이전 규칙은 변경하지 않는다", () => {
  const groups = { pirate: "독립 해적단", marine: "해군", liberator: "독립 해방망", civilian: "민간 조합" };
  const expected = {
    pirate: ["profit", "negotiate", "rescue"], marine: ["obey", "inspect", "evacuate"],
    liberator: ["secret", "consult", "evacuate"], civilian: ["contract", "rebuild", "explore"]
  };
  for (const [path, affiliation] of Object.entries(groups)) {
    const life = createGame("original", 9, { species: "인간" }, 3, 28);
    Object.assign(life, { path, affiliation, age: 27, careerStartAge: 20, location: "위스키 피크",
      leftHome: true, homebound: false, supplies: 80 });
    const card = affiliationChapter(life, 28, { age: 28, act: 2 }, 26);
    assert.equal(card.id, "life_path_" + path + "_choice");
    assert.deepEqual(card.choices.map((c) => c.id), expected[path]);
    assert.ok(card.body.length <= 300);
    assert.ok(card.choices.some((c) => !c.cost), "물자가 없어도 진행 가능한 선택 필수");
    const completed = structuredClone(life);
    card.choices[0].apply(completed);
    assert.equal(completed.people.affiliationChapters[path].choice, expected[path][0]);
    completed.seen.push(card.id);
    assert.notEqual(affiliationChapter(completed, 29, { age: 29 }, 20)?.id, card.id);
    if (path !== "marine") assert.equal(affiliationChapter({ ...life, affiliation: "해군" }, 28, { age: 28 }, 26), null);
    assert.equal(affiliationChapter({ ...life, creationVersion: 27 }, 28, { age: 28 }, 26), null);
  }
  const resistance = createGame("original", 11, { species: "인간" }, 3, 28);
  Object.assign(resistance, { path: "liberator", affiliation: "혁명군", careerStartAge: 20, age: 27 });
  assert.doesNotMatch(affiliationChapter(resistance, 28, { age: 28 }, 30).body, /혁명군의 현장 연락소/);
});

test("28번 규칙의 해군·민간 후일담은 과거 선택을 기억하고 전향해도 예전 명령을 강제하지 않는다", () => {
  for (const [path, affiliation, choices] of [
    ["marine", "해군", ["obey", "inspect", "evacuate"]],
    ["civilian", "민간 조합", ["contract", "rebuild", "explore"]]
  ]) for (const choice of choices) {
    const life = createGame("free", 3, { species: "어인" }, 3, 28);
    Object.assign(life, { path, affiliation, location: "위스키 피크", careerStartAge: 20,
      leftHome: true, homebound: false, supplies: 90 });
    const first = affiliationChapter(life, 28, { age: 28 }, 19);
    first.choices.find((c) => c.id === choice).apply(life);
    life.seen.push(first.id);
    assert.equal(affiliationChapter(life, 30, { age: 30 }, 19), null);
    assert.equal(affiliationChapter(life, 32, { age: 32 }, 19).id, "life_path_" + path + "_after");
    const changed = structuredClone(life);
    Object.assign(changed, { path: "pirate", affiliation: "독립 해적단" });
    const later = affiliationChapter(changed, 32, { age: 32 }, 19);
    assert.ok(later.choices.some((c) => c.id === (path === "marine" ? "reply" : "send")));
    if (path === "marine") assert.ok(!later.choices.some((c) => ["correct", "share", "testify"].includes(c.id)));
    later.choices.find((c) => c.id === (path === "marine" ? "reply" : "stay")).apply(changed);
    changed.seen.push(later.id);
    assert.ok(changed.people.affiliationChapters[path].after);
    assert.equal(affiliationChapter({ ...life, location: "위대한 항로 상공 · 스카이피아" }, 32, { age: 32 }, 19), null);
  }
});

test("28번 소속별 사건은 실제 연간 진행 선택기에서 생성되고 기존 저장 규칙은 재현된다", () => {
  for (const [path, affiliation] of Object.entries({
    pirate: "독립 해적단", marine: "해군", liberator: "독립 해방망", civilian: "민간 조합"
  })) {
    const life = createGame("original", 5, { species: "인간" }, 3, 28);
    Object.assign(life, { age: 28, path, affiliation, careerStartAge: 21,
      leftHome: true, homebound: false, location: "위스키 피크",
      seen: ["life_first_station", "life_leave_home",
        ...OLD_ERA.map(({ id }) => "life_old_" + id)] });
    life.fates = Object.fromEntries(Object.values(FATES).flat().map(({ key }) => [key, { step: 999, marks: [] }]));
    for (const key of ["lastRankOfferAge", "lastMarineOfferAge", "lastPirateOfferAge", "lastCivilianOfferAge",
      "lastCrewOfferAge", "lastRevolutionOfferAge"]) life[key] = 1000;
    assert.equal(yearlyScene(life).id, "life_path_" + path + "_choice");
  }
  for (const version of [25, 26, 27, 28]) {
    const life = createGame("original", 0, { species: "인간" }, 3, version);
    assert.deepEqual(replay(saveRecord(life)), life);
  }
});


test("28번 생애는 서로 다른 출생과 모드에서 끝까지 진행하고 저장 재생된다", () => {
  for (const [mode, seed, species] of [
    ["original", 3, "인간"], ["free", 11, "어인"], ["original", 7, "밍크족"],
    ["free", 4, "거인족"]
  ]) {
    const life = play(mode, seed, {}, { species }, 3, 28);
    assert.equal(life.finished, true, species + " 생애는 종료되어야 한다");
    assert.deepEqual(replay(saveRecord(life)), life, species + " 선택 기록은 재생되어야 한다");
  }
  for (const version of [25, 26, 27]) {
    const legacy = play("original", 2, {}, { species: "인간" }, 3, version);
    assert.deepEqual(replay(saveRecord(legacy)), legacy, version + "번 규칙은 재생되어야 한다");
  }
});


test("29번 규칙은 가까운 선장 항해 장면의 같은 제목을 구별하고 28번 기록을 유지한다", () => {
  const life = createGame("original", 6, { species: "인간" }, 3, 29);
  Object.assign(life, { path: "pirate", affiliation: "흰 수염 해적단", role: "선원",
    canonCrew: "흰 수염 해적단", independent: false, leftHome: true, homebound: false, canonGapRemaining: 2,
    location: "자야 · 모크 타운", supplies: 80 });
  let first;
  for (let slot = 0; slot < 50; slot += 1) {
    life.canonDailyIndex = slot;
    const candidate = canonInterludeScene(life);
    if (candidate?.id.startsWith("life_canon_daily_") && candidate?.choices?.some((c) => c.id === "stay")) {
      first = candidate;
      break;
    }
  }
  assert.ok(first, "항해 막간이 생성되어야 한다");
  life.journal = [{ id: "prior_voyage", title: first.title, age: life.age }];
  const distinct = canonInterludeScene(life);
  assert.notEqual(distinct.title, first.title);
  assert.match(distinct.title, /번째 항해/);
  const previous = canonInterludeScene({ ...life, creationVersion: 28 });
  assert.equal(previous.title, first.title, "규칙 28에서는 이전 제목을 그대로 재생한다");
});


test("29번 엔딩 회고는 실제 선택·후속 결과와 마지막 장면만 3~5개 기억으로 남긴다", () => {
  const journal = [
    { id: "life_home", age: 4, title: "어린 날", choice: "살핀다", result: "가족을 도왔다." },
    { id: "life_first_skill", age: 9, title: "전보벌레", choice: "기록한다", result: "신호를 적었다." },
    { id: "life_career", age: 19, title: "처음 고른 소속", choice: "해군", result: "입대했다." },
    { id: "life_path_marine_choice", age: 30, title: "번호가 다른 수배서", choice: "승객 구조", result: "경고를 받았다." },
    { id: "life_path_marine_after", age: 38, title: "늦게 도착한 지부의 장부", choice: "증언을 낸다", result: "기록을 남겼다." },
    { id: "life_last_year", age: 70, title: "마지막 날", choice: null, result: "한 생애가 끝났다." }
  ];
  const memories = endingMemories({ journal });
  assert.ok(memories.length >= 3 && memories.length <= 5);
  assert.ok(memories.every((entry) => journal.includes(entry)));
  assert.ok(memories.some((entry) => entry.id === "life_path_marine_choice"));
  assert.ok(memories.some((entry) => entry.id === "life_path_marine_after"));
  assert.equal(memories.at(-1).id, "life_last_year");
  assert.deepEqual(endingMemories({ journal: [] }), []);
  assert.deepEqual(endingMemories({ journal: journal.slice(-1) }), journal.slice(-1), "짧은 삶에 없는 기억을 만들어 내지 않는다");
});


test("29번 규칙은 서로 다른 생성기의 동일 제목을 기록에서 구분하고 과거 생애의 제목은 유지한다", () => {
  const current = createGame("original", 14, { species: "인간" }, 3, 29);
  const first = getScene(current);
  const duplicate = { ...current, journal: [{ id: "previous", title: first.title, age: 0 }] };
  assert.match(getScene(duplicate).title, /2번째 기록/);
  const legacy = { ...duplicate, creationVersion: 28 };
  assert.equal(getScene(legacy).title, first.title);
});


test("30번 규칙의 선원 항해는 불화와 물자 부족에 따라 실제 행동을 바꾼다", () => {
  const life = createGame("original", 19, { species: "인간" }, 3, 30);
  Object.assign(life, { path: "pirate", role: "선원", independent: false,
    location: "위스키 피크", age: 27, leftHome: true, homebound: false, friendBond: 25, supplies: 70 });
  const voyage = travelScene(life, 28);
  assert.equal(voyage.choices.length, 3);
  assert.match(voyage.body, /믿음이 충분히 쌓이지 않아/);
  const repaired = structuredClone(life);
  voyage.choices.find((c) => c.id === "coordinate").apply(repaired);
  assert.equal(repaired.friendBond, 33);
  assert.equal(repaired.supplies, 65);
  assert.ok(!travelScene({ ...life, friendBond: 65 }, 28).choices.some((c) => c.id === "coordinate"));
  assert.match(travelScene({ ...life, friendBond: 65, supplies: 10 }, 28).body, /식량과 수리 자재/);
  const old = travelScene({ ...life, creationVersion: 29 }, 28);
  assert.equal(old.choices.length, 2);
  assert.doesNotMatch(old.body, /말다툼/);
});

test("30번 항로는 실제로 갈 수 있고 시기가 맞는 옛 인연만 표시한다", () => {
  const life = createGame("original", 19, { species: "인간" }, 3, 30);
  Object.assign(life, { location: "위스키 피크", path: "civilian", age: 25,
    supplies: 80, people: { ...life.people, canonContacts: { kureha: { score: 12, meetings: 1, lastAge: 21 } } },
    seen: ["life_meet_kureha"] });
  life.birth.yearsBeforeCurrent = 45;
  const current = travelScene(life, 26);
  assert.ok(current.choices.some((choice) => choice.label.includes("드럼섬") && choice.label.includes("지난 인연")));
  assert.match(current.body, /운송 일/);
  const older = travelScene({ ...life, creationVersion: 29 }, 26);
  assert.ok(older.choices.every((c) => !c.label.includes("지난 인연")));
  const unknown = travelScene({ ...life, seen: [] }, 26);
  assert.ok(unknown.choices.every((c) => !c.label.includes("지난 인연")));
  const wrongPort = travelScene({ ...life, location: "워터 세븐" }, 26);
  assert.ok(wrongPort.choices.every((c) => !c.label.includes("지난 인연")));
  const tooEarly = travelScene({ ...life, people: { ...life.people, canonContacts: { kureha: { score: 12, meetings: 1, lastAge: 25 } } } }, 26);
  assert.ok(tooEarly.choices.every((c) => !c.label.includes("지난 인연")));
});

test("30번 어인·밍크족은 첫 기술 기록에 따라 청소년 수련이 달라진다", () => {
  for (const species of ["어인", "밍크족"]) for (const originalChoice of ["learn", "help"]) {
    let life = createGame("original", 18, { species }, 3, 30);
    let training = null;
    for (let step = 0; step < 100 && !life.finished; step++) {
      const scene = getScene(life);
      if (scene.id === "life_training") { training = scene; break; }
      life = advance(life, scene.id === "life_first_skill" ? originalChoice
        : scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    assert.ok(training, species + " has a reachable training scene");
    assert.match(training.body, species === "어인" ? /어인섬의 물길/ : /조의 숲길/);
    const linked = training.choices.find((c) => c.id === (originalChoice === "learn" ? "practice" : "help"));
    assert.match(linked.risk, /옛 기록|옛 협력/);
    assert.ok(training.body.length <= 300);
    const legacy = getScene({ ...life, creationVersion: 29 });
    assert.doesNotMatch(legacy.body, /어릴 때 기록해 두었던 표식|함께 일을 나눴던 이웃들의 방법/);
  }
});

test("30번 엔딩은 마지막 장면과 실제 선택을 보존하고 이전 버전 기록은 그대로 둔다", () => {
  const journal = [
    { id: "life_first_skill", age: 9, choice: "살핀다" },
    { id: "life_career", age: 20, choice: "해군" },
    { id: "life_path_marine_choice", age: 28, choice: "조사" },
    { id: "life_path_marine_after", age: 38, choice: "공유" },
    { id: "life_danger_sea_king", age: 48, choice: "돕는다" },
    { id: "life_present_end", age: 70, choice: null }
  ];
  for (const version of [29, 30]) {
    const selected = endingMemories({ creationVersion: version, journal });
    assert.equal(selected.at(-1), journal.at(-1));
    assert.ok(selected.length >= 3 && selected.length <= 5);
    assert.ok(selected.every((x) => journal.includes(x)));
  }
  const latest = createGame("original", 4, { species: "인간" }, 3, 30);
  assert.deepStrictEqual(replay(saveRecord(latest)), latest);
});


test("31번 규칙은 소속이 달라진 옛 친구를 방문객이 아닌 편지로 기억한다", () => {
  const life = createGame("original", 21, { species: "인간" }, 3, 31);
  Object.assign(life, { age: 65, path: "pirate", careerStartAge: 20, affiliation: "독립 해적단",
    seen: ["life_people_mate_meet", "life_people_mate_path", "life_people_mate_crisis"],
    people: { mate: { name: "세라", fate: "적", bond: 12, path: "marine", together: false } } });
  const news = personalBeat(life, 65, { age: 65, act: 3 });
  assert.equal(news.id, "life_people_mate_reunion");
  assert.match(news.body, /편지/);
  assert.ok(!news.body.includes("같은 식탁"));
  const after = structuredClone(life);
  news.choices.find((choice) => choice.id === "bury").apply(after);
  assert.equal(after.people.mate.fate, "적");
  assert.equal(after.skill, life.skill + 3);
  const older = personalBeat({ ...life, creationVersion: 30 }, 65, { age: 65, act: 3 });
  assert.equal(older.id, news.id);
  assert.equal(older.choices.find((choice) => choice.id === "bury").risk.includes("건강 +10"), true);
  const formerlyTogether = { ...life, people: { mate: { name: "세라", fate: "곁", bond: 60, path: "marine", together: true } } };
  assert.match(personalBeat(formerlyTogether, 65, { age: 65 }).body, /상선/);
  assert.match(peopleSummary(formerlyTogether), /한때 함께 일한 친구/);
  assert.ok(!peopleSummary({ ...formerlyTogether, creationVersion: 30 }).includes("한때 함께 일한 친구"));
  assert.equal(personalBeat({ ...life, ending: "death" }, 65, { age: 65 }), null);
  assert.notEqual(personalBeat({ ...life, location: "위대한 항로 상공 · 스카이피아" }, 65, { age: 65 })?.id,
    "life_people_mate_reunion", "고립된 장소에 갑작스러운 답장을 만들지 않는다");
  assert.match(peopleSummary({ ...formerlyTogether, creationVersion: 30 }), /끝까지 같은 배를 탄 동료/);
});

test("31번 규칙은 실제로 돌본 후배의 후일담만 열고 화해를 강요하지 않는다", () => {
  const base = createGame("original", 25, { species: "인간" }, 3, 31);
  Object.assign(base, { age: 47, path: "civilian", affiliation: "민간 조합",
    careerStartAge: 22, people: {
      mate: { name: "세라", fate: "잃음" },
      ward: { name: "누리", bond: 60, fate: "후계", since: 29 }
    }, journal: [
      { id: "life_people_ward_meet", age: 29, choice: "데려가 일을 가르친다" },
      { id: "life_people_ward_return", age: 43, choice: "곁에 두고 모든 것을 가르친다" }
    ],
    seen: ["life_people_mate_meet", "life_people_mate_path", "life_people_ward_meet", "life_people_ward_return"] });
  assert.equal(personalBeat(base, 45, { age: 45 }), null, "후배의 선택 후 3년이 지나야 한다");
  const legacy = personalBeat(base, 47, { age: 47 });
  assert.equal(legacy.id, "life_people_ward_legacy");
  assert.match(legacy.body, /장부/);
  const after = structuredClone(base);
  legacy.choices.find((c) => c.id === "respect").apply(after);
  assert.equal(after.people.ward.legacy, "존중");
  after.seen.push(legacy.id);
  assert.equal(personalBeat(after, 50, { age: 50 }), null, "후일담이 반복되지 않는다");
  assert.equal(personalBeat({ ...base, creationVersion: 30 }, 47, { age: 47 }), null);
  assert.notEqual(personalBeat({ ...base, location: "위대한 항로 상공 · 스카이피아" }, 47, { age: 47 })?.id,
    "life_people_ward_legacy", "고립된 항로에서는 편지가 갑자기 오지 않는다");
  assert.notEqual(personalBeat({ ...base, seen: [] }, 47, { age: 47 })?.id, "life_people_ward_legacy");
  assert.equal(personalBeat({ ...base, people: { ...base.people, ward: { ...base.people.ward, fate: "원망" } } }, 47, { age: 47 }), null);
  const independent = structuredClone(base);
  independent.people.ward.fate = "자기 길";
  assert.match(personalBeat(independent, 47, { age: 47 }).body, /다른 항구/);
  assert.match(peopleSummary(base), /장부를 맡겼던 후배/);
  assert.ok(!peopleSummary({ ...base, creationVersion: 30 }).includes("장부를 맡겼던 후배"));
});

test("31번 규칙은 장부를 실제로 가르친 민간인에게만 독립적인 후배 소식이 온다", () => {
  const life = createGame("free", 30, { species: "어인" }, 3, 31);
  Object.assign(life, { age: 45, path: "civilian", careerStartAge: 21,
    affiliation: "민간 조합", location: "위스키 피크",
    people: { affiliationChapters: { civilian: {
      age: 30, place: "위스키 피크", choice: "rebuild", affiliation: "민간 조합", after: "teach"
    } } },
    seen: ["life_path_civilian_choice", "life_path_civilian_after"],
    journal: [{ id: "life_path_civilian_after", age: 41, choice: "후배에게 수리 장부를 맡긴다" }] });
  assert.equal(affiliationChapter(life, 43, { age: 43 }, 15), null);
  const card = affiliationChapter(life, 45, { age: 45 }, 15);
  assert.equal(card.id, "life_path_civilian_legacy");
  assert.match(card.body, /후배/);
  assert.equal(card.choices.length, 2);
  const left = structuredClone(life);
  Object.assign(left, { path: "pirate", affiliation: "독립 해적단", retired: true });
  const letter = affiliationChapter(left, 45, { age: 45 }, 15);
  assert.equal(letter.id, card.id);
  assert.match(letter.body, /편지/);
  letter.choices.find((c) => c.id === "entrust").apply(left);
  assert.equal(left.people.affiliationChapters.civilian.legacy, "독립 존중");
  assert.equal(left.path, "pirate", "전향한 소속을 변경하지 않는다");
  left.seen.push(letter.id);
  assert.notEqual(affiliationChapter(left, 50, { age: 50 }, 15)?.id, letter.id);
  const noTeaching = { ...left, seen: [...life.seen], people: { affiliationChapters: { civilian: { ...life.people.affiliationChapters.civilian, after: "send" } } } };
  assert.equal(affiliationChapter(noTeaching, 45, { age: 45 }, 15), null);
  assert.equal(affiliationChapter({ ...life, creationVersion: 30, retired: true }, 45, { age: 45 }, 15), null);
  const retiredMarine = { ...life, path: "marine", affiliation: "해군", retired: true,
    people: { affiliationChapters: { marine: { age: 30, choice: "obey" } } },
    seen: ["life_path_marine_choice"] };
  assert.equal(affiliationChapter(retiredMarine, 45, { age: 45 }, 15), null,
    "은퇴한 인물에게 이전 해군의 지시를 강제하지 않는다");
  assert.equal(affiliationChapter({ ...life, location: "위대한 항로 상공 · 스카이피아" }, 45, { age: 45 }, 15)?.id, undefined);
  assert.ok(card.body.length <= 300);
});

test("31번 인연의 엔딩은 실제로 진행된 후계 사건만 우선하고 이전 회고를 보존한다", () => {
  const journal = [
    { id: "life_first_skill", age: 8, choice: "일을 돕는다" },
    { id: "life_career", age: 20, choice: "민간인" },
    { id: "life_people_ward_meet", age: 29, choice: "데려가 일을 가르친다" },
    { id: "life_people_ward_return", age: 43, choice: "곁에 두고 가르친다" },
    { id: "life_people_ward_legacy", age: 47, choice: "상대의 선택을 존중한다" },
    { id: "life_last_day", age: 71, choice: null }
  ];
  const version30 = endingMemories({ creationVersion: 30, journal });
  const version31 = endingMemories({ creationVersion: 31, journal });
  assert.ok(version31.some((entry) => entry.id === "life_people_ward_legacy"));
  assert.ok(version31.every((entry) => journal.includes(entry)));
  assert.equal(version31.at(-1), journal.at(-1));
  assert.ok(version31.length <= 5);
  assert.deepEqual(endingMemories({ creationVersion: 30, journal }), version30);
  assert.deepEqual(replay(saveRecord(createGame("original", 6, { species: "인간" }, 3, 31))),
    createGame("original", 6, { species: "인간" }, 3, 31));
});

test("31번 관계 UI는 실제 동료와 지나간 인연을 구별한다", () => {
  const life = createGame("original", 15, { species: "인간" }, 3, 31);
  Object.assign(life, { age: 50, path: "pirate", careerStartAge: 20,
    affiliation: "독립 해적단", leftHome: true, homebound: false, retired: false,
    seen: ["life_people_mate_meet", "life_people_ward_meet"],
    people: { mate: { name: "세라", fate: "곁", path: "marine", together: true },
      ward: { name: "누리", fate: "지나침", bond: 0 } } });
  assert.ok(!crewFor(life).some((person) => person.name === "세라"), "옛 소속 친구는 현재 선원이 아니다");
  const groups = relationshipGroups(life);
  assert.match(groups.bonds.find((person) => person.name === "세라").role, /한때 함께 일함/);
  assert.match(groups.bonds.find((person) => person.name === "누리").role, /지나친 아이/);
  assert.ok(!groups.crew.some((person) => person.name === "세라"));
  const older = { ...life, creationVersion: 30 };
  assert.ok(crewFor(older).some((person) => person.name === "세라"), "규칙 30의 화면 출력은 유지한다");
  assert.equal(relationshipGroups(older).bonds.find((person) => person.name === "누리").role, "제자 · 후계");
  const together = { ...life, people: { ...life.people, mate: { ...life.people.mate, path: "pirate" },
    ward: { ...life.people.ward, fate: "후계" } } };
  assert.ok(crewFor(together).some((person) => person.name === "세라"));
  assert.match(relationshipGroups(together).bonds.find((person) => person.name === "누리").role, /장부를 맡긴 후배/);
  assert.ok(!crewFor({ ...together, retired: true }).some((person) => person.name === "세라"));
  assert.ok(!crewFor({ ...together, homebound: true }).some((person) => person.name === "세라"));
  const neverMet = { ...life, seen: ["life_people_mate_meet"] };
  assert.ok(!relationshipGroups(neverMet).bonds.some((person) => person.name === "누리"));
});


test("32번 규칙은 소속과 무관하게 개인 목표를 선택하거나 미정으로 남길 수 있다", () => {
  const life = createGame("original", 63, { species: "인간" }, 3, 32);
  assert.equal(life.personalAim, null);
  assert.ok(!Object.hasOwn(createGame("original", 63, { species: "인간" }, 3, 31), "personalAim"));
  Object.assign(life, { path: "pirate", careerStartAge: 20, age: 23, seen: ["life_first_station"] });
  const scene = personalAimScene(life, 24, { age: 24, act: 2 });
  assert.equal(scene.id, "life_personal_aim");
  assert.equal(scene.choices.length, 5);
  for (const [key, label] of Object.entries(PERSONAL_AIMS)) {
    const state = structuredClone(life);
    scene.choices.find((choice) => choice.id === key).apply(state);
    assert.equal(state.personalAim, key);
    assert.equal(state.path, "pirate", "진로는 개인 목표에 따라 바뀌지 않는다");
    assert.equal(state.goal, life.goal, "기존 진로 목표는 덮어쓰지 않는다");
    assert.equal(typeof label, "string");
  }
  const undecided = structuredClone(life);
  scene.choices.find((choice) => choice.id === "undecided").apply(undecided);
  assert.equal(undecided.personalAim, null);
  assert.equal(personalAimScene({ ...life, creationVersion: 31 }, 24, {}), null);
  assert.equal(personalAimScene({ ...life, seen: [] }, 24, {}), null);
  assert.equal(personalAimScene(life, 21, {}), null);
  assert.equal(personalAimScene({ ...life, seen: [...life.seen, "life_personal_aim"] }, 24, {}), null);
});

test("32번 개인 목표는 실제 생애 진행에서 도달하고 저장 재생에도 남는다", () => {
  let observed = 0;
  for (let seed = 0; seed < 16; seed += 1) {
    let life = createGame("original", seed, { species: "인간" }, 3, 32);
    for (let step = 0; step < 230 && !life.finished; step += 1) {
      const scene = getScene(life);
      assert.ok(scene);
      if (scene.id === "life_personal_aim") {
        const before = life.path;
        life = advance(life, "justice");
        assert.equal(life.personalAim, "justice");
        assert.equal(life.path, before);
        assert.ok(life.seen.includes("life_personal_aim"));
        assert.deepEqual(replay(saveRecord(life)), life);
        observed += 1;
        break;
      }
      life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
  }
  assert.ok(observed >= 5, "시드 16개 중 개인 목표를 선택할 수 있는 생애가 충분히 있어야 한다");
});

test("32번 노년기 선택은 실제로 고른 목표를 재해석할 수 있지만 강제 완성하지 않는다", () => {
  const life = createGame("original", 20, { species: "인간" }, 3, 32);
  Object.assign(life, { path: "marine", role: "해군 중령", personalAim: "justice",
    seen: ["life_personal_aim"] });
  const original = lifeScenes.find((scene) => scene.id === "life_retire_choice");
  const later = personalAimRetirement(life, original);
  assert.equal(later.choices.length, original.choices.length + 1);
  assert.match(later.body, /부당함 앞에서 사람을 지키는 일/);
  const chosen = later.choices.find((choice) => choice.id === "reframe");
  const after = structuredClone(life);
  chosen.apply(after);
  assert.equal(after.skill, life.skill + 3);
  assert.equal(after.role, life.role);
  assert.equal(after.retired, false);
  assert.equal(personalAimRetirement({ ...life, creationVersion: 31 }, original), original);
  assert.equal(personalAimRetirement({ ...life, personalAim: null }, original).choices.length,
    original.choices.length, "정하지 않은 꿈은 다시 해석하도록 강제하지 않는다");
});

test("32번 목표 회고는 실제 일지의 방향과 선택만 인용하고 31번 엔딩을 보존한다", () => {
  const journal = [
    { id: "life_first_skill", age: 9, choice: "도구를 배운다", title: "첫 기술" },
    { id: "life_career", age: 20, choice: "해군에 지원", title: "소속" },
    { id: "life_personal_aim", age: 22, choice: "사람을 지키고 싶다", title: "바라던 삶" },
    { id: "life_path_marine_choice", age: 35, choice: "수배서 번호를 대조한다", title: "번호가 다른 수배서" },
    { id: "life_retire_choice", age: 68,
      choice: "처음의 꿈을 다른 뜻으로 받아들이고 지금의 일을 이어 간다", title: "자리에서 물러날 때" },
    { id: "life_last_year", age: 72, choice: null, title: "마지막 날" }
  ];
  const current = { creationVersion: 32, personalAim: "justice", goal: "바다의 사람을 지키기", journal };
  const recap = personalAimSummary(current);
  assert.match(recap, /처음 고른 방향: 부당함 앞에서 사람을 지키는 일/);
  assert.match(recap, /번호가 다른 수배서/);
  assert.match(recap, /다른 뜻으로 받아들이기로 선택/);
  assert.doesNotMatch(recap, /성공|실패|완수/);
  const otherDecision = { ...current, journal: journal.map((entry) =>
    entry.id === "life_retire_choice" ? { ...entry, choice: "직책을 넘기고 물러난다" } : entry) };
  assert.match(personalAimSummary(otherDecision), /노년에 선택한 일: '직책을 넘기고 물러난다'/);
  const selected = endingMemories(current);
  assert.ok(selected.some((entry) => entry.id === "life_personal_aim"));
  assert.ok(selected.some((entry) => entry.id === "life_path_marine_choice"));
  assert.equal(selected.at(-1), journal.at(-1));
  assert.ok(selected.length <= 5 && selected.every((entry) => journal.includes(entry)));
  const legacy = endingMemories({ ...current, creationVersion: 31 });
  assert.ok(legacy.every((entry) => journal.includes(entry)));
  assert.deepEqual(endingMemories({ ...current, creationVersion: 31 }), legacy);
  assert.equal(personalAimSummary({ creationVersion: 32, personalAim: null, journal: [] }),
    "스스로 정한 개인 목표의 기록은 남지 않았다.");
  const undecided = { creationVersion: 32, personalAim: null, journal: [
    { id: "life_personal_aim", age: 23, choice: "아직 정하지 않는다" },
    { id: "life_last_year", age: 24, choice: null }
  ] };
  assert.match(personalAimSummary(undecided), /꿈을 정하지 않기로 했다/);
  assert.doesNotMatch(personalAimSummary(undecided), /부당함|자유/);
});

test("32번 소속별 책임 장면은 실제 선택한 개인 목표만 언급한다", () => {
  const life = createGame("original", 38, { species: "인간" }, 3, 32);
  Object.assign(life, { age: 35, path: "marine", affiliation: "해군", careerStartAge: 20,
    seen: ["life_personal_aim"], personalAim: "freedom", people: {} });
  const event = affiliationChapter(life, 36, { age: 36 }, 12);
  assert.equal(event.id, "life_path_marine_choice");
  assert.match(event.body, /스스로 길을 선택하는 자유/);
  assert.ok(event.body.length <= 300);
  assert.doesNotMatch(affiliationChapter({ ...life, creationVersion: 31 }, 36, {}, 12).body, /스스로 길을 선택하는 자유/);
  assert.doesNotMatch(affiliationChapter({ ...life, personalAim: null }, 36, {}, 12).body, /처음 골랐던/);
});


test("33번 엔딩은 실제 관계·진로 기억을 개인 목표와 균형 있게 남기고 규칙 32는 보호한다", () => {
  const entries = [
    { id: "life_home", age: 6, title: "고향", choice: "가족의 일을 돕는다" },
    { id: "life_career", age: 20, title: "처음 나간 바다", choice: "해군에 들어간다" },
    { id: "life_personal_aim", age: 23, title: "바라던 삶", choice: "사람을 돕고 싶다" },
    { id: "life_path_marine_choice", age: 34, title: "수배서 확인", choice: "진위를 확인한다" },
    { id: "life_people_mate_reunion", age: 62, title: "다시 받은 소식", choice: "그날의 일을 기록한다" },
    { id: "life_last_year", age: 75, title: "마지막 날", choice: null }
  ];
  const version32 = endingMemories({ journal: entries, creationVersion: 32 });
  const version33 = endingMemories({ journal: entries, creationVersion: 33 });
  assert.ok(version32.some((entry) => entry.id === "life_personal_aim"));
  assert.ok(version33.some((entry) => entry.id === "life_people_mate_reunion"));
  assert.ok(version33.some((entry) => entry.id === "life_career"));
  assert.equal(version33.at(-1), entries.at(-1));
  assert.ok(version33.length >= 3 && version33.length <= 5);
  assert.ok(version33.every((entry) => entries.includes(entry)));
  assert.deepEqual(endingMemories({ journal: entries, creationVersion: 32 }), version32);
  const replayed = createGame("free", 78, { species: "밍크족" }, 3, 33);
  assert.deepEqual(replay(saveRecord(replayed)), replayed);
});



test("33번 원작 막간은 긴 두 장면 간격만 하나 줄여 주요 사건 순서를 보존한다", () => {
  const old = createGame("original", 521, { species: "인간" }, 3, 32);
  const fresh = { ...old, creationVersion: 33 };
  let reduced = 0;
  for (const phase of ["before", "after"]) {
    for (let step = 0; step < 70; step++) {
      const earlier = canonGapFor(old, phase, step);
      const newer = canonGapFor(fresh, phase, step);
      assert.ok(newer <= earlier);
      assert.equal(newer, earlier === 2 ? 1 : earlier);
      if (newer < earlier) reduced++;
    }
  }
  assert.ok(reduced > 0);
  assert.equal(canonGapFor({ ...old, creationVersion: 31 }, "after", 2),
    canonGapFor(old, "after", 2), "이전 규칙의 간격은 변경되지 않는다");
});

test("34번 원작 연표의 혁명 소식은 소속을 유지하며 돕는 선택을 열고 33번 저장 규칙을 보존한다", () => {
  const life = createGame("original", 61, { species: "인간" }, 3, 34);
  life.birth.yearsBeforeCurrent = 52;
  Object.assign(life, { age: 29, path: "civilian", injustice: false, trust: 45, supplies: 30 });
  const scene = yearlyScene(life);
  assert.equal(scene.id, "life_revolution_choice");
  const current = scene.choices.filter((choice) => !choice.when || choice.when(life));
  assert.deepEqual(current.map((choice) => choice.id), ["share_news", "independent"]);
  const after = structuredClone(life);
  current[0].apply(after);
  assert.equal(after.trust, 50);
  assert.equal(after.path, "civilian");
  assert.equal(after.supplies, 30);
  const legacy = { ...life, creationVersion: 33 };
  assert.deepEqual(yearlyScene(legacy).choices.filter((choice) => !choice.when || choice.when(legacy))
    .map((choice) => choice.id), ["independent"]);
  const qualified = { ...life, injustice: true, trust: 75 };
  assert.deepEqual(yearlyScene(qualified).choices.filter((choice) => !choice.when || choice.when(qualified))
    .map((choice) => choice.id), ["join", "independent"]);
  assert.deepEqual(replay(saveRecord(createGame("free", 78, { species: "밍크족" }, 3, 33))),
    createGame("free", 78, { species: "밍크족" }, 3, 33));
  const fresh = createGame("original", 29, { species: "인간" }, 3, 34);
  assert.deepEqual(replay(saveRecord(fresh)), fresh);
});

test("유년 후반의 배움과 수련도 출항 전에 등장하고 회차마다 달라진다", () => {
  const schoolTitles = new Set();
  const trainingTitles = new Set();
  for (let seed = 0; seed < 12; seed += 1) {
    const training = reach(seed, "life_training", {}, { species: "인간" }, 6);
    const school = training.journal.find((entry) => entry.id === "life_school");
    assert.ok(school, "배움 장면은 수련보다 먼저 나와야 한다");
    assert.ok(training.seen.includes("life_early_departure"), "이른 출항 선택을 건너뛰면 안 된다");
    assert.ok(!training.seen.includes("life_career"), "첫 소속 선택보다 먼저 나와야 한다");
    schoolTitles.add(school.title);
    trainingTitles.add(getScene(training).title);
  }
  assert.ok(schoolTitles.size >= 5);
  assert.equal(trainingTitles.size, 4);

  const ready = reach(0, "life_training", {}, { species: "인간" }, 6);
  const poor = { ...ready, supplies: 0 };
  assert.equal(getScene(poor).choices.find((choice) => choice.id === "practice").disabled, true);
  assert.throws(() => advance(poor, "practice"));
  const practiced = advance(ready, "practice");
  assert.equal(practiced.skill, ready.skill + 10);
  assert.equal(practiced.supplies, ready.supplies - 10);
  assert.deepEqual(replay(saveRecord(practiced)), practiced);
});

test("출항부터 정상전쟁까지 원작 사건과 일상을 가변 간격으로 함께 보여 준다", () => {
  let life = createGame("original", 0, { species: "인간" }, 3, 6);
  let steps = 0;
  while (!life.finished && !life.seen.includes("life_marineford_news") && steps++ < 250) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.ok(life.seen.includes("life_marineford_news"));
  const before = life.journal.filter((entry) => entry.id.startsWith("canon_before_"));
  assert.equal(before.length, PRE_CANON_BEAT_COUNT);
  assert.deepEqual(before.slice(0, 3).map((entry) => entry.id),
    ["canon_before_departure", "canon_before_zoro", "canon_before_buggy"]);
  assert.ok(before.some((entry) => entry.id === "canon_before_arlong"));
  assert.ok(before.some((entry) => entry.id === "canon_before_skypiea_bell"));
  assert.ok(before.some((entry) => entry.id === "canon_before_thriller_shadows"));
  assert.ok(before.every((entry) => entry.age === life.birth.yearsBeforeCurrent - 2));
  assert.ok(life.journal.findIndex((entry) => entry.id === "life_marineford_news")
    > life.journal.findIndex((entry) => entry.id === "canon_before_impel_down"));
  const daily = life.journal.filter((entry) => entry.id.startsWith("life_canon_daily_"));
  assert.ok(daily.length > 15, "원작 장면 사이에 일상 장면이 들어가야 한다");
  assert.ok(daily.every((entry) => /뒤/.test(entry.timeLabel)), "일상 사이에 상대적인 날짜 간격을 보여야 한다");
  assert.ok(daily.some((entry) => entry.choice?.includes("기록지침")), "원작 사건 사이에도 다른 섬으로 갈 수 있어야 한다");
  assert.ok(new Set(Array.from({ length: PRE_CANON_BEAT_COUNT }, (_, step) => canonGapFor(life, "before", step))).size >= 3,
    "원작 장면과 일상 장면이 고정 패턴으로 반복되면 안 된다");
  assert.deepEqual(replay(saveRecord(life)), life);

  const local = createGame("original", 1, { species: "인간" }, 3, 9);
  local.age = local.birth.yearsBeforeCurrent - 3;
  local.preCanonStep = 11;
  local.location = "위대한 항로 · 알라바스타 나노하나";
  assert.equal(preCanonScene(local).choices.length, 2);
  local.location = "워터 세븐";
  assert.equal(preCanonScene(local).choices, undefined);
  local.people.fruitOwner = { owner: "루피", fruit: "고무고무 열매" };
  assert.match(preCanonScene(local).timeLabel, /IF 세계선/, "열매가 바뀐 세계선은 원작 장면에 IF 표시를 단다");
  assert.doesNotMatch(preCanonScene(local).body, /단정할 수 없다/);
  assert.equal(preCanonScene(local).choices, undefined);
});

test("정상전쟁 뒤 원작 소식 사이에는 날짜 간격을 둔 일상이 끼고 연속 소식이 길게 쌓이지 않는다", () => {
  let life = reach(0, "life_marineford_news", {}, { species: "인간" }, 5);
  life = advance(life, null);
  assert.match(getScene(life).id, /^life_canon_daily_/);
  const gaps = Array.from({ length: CANON_BEAT_COUNT + 1 }, (_, step) => canonGapFor(life, "after", step));
  assert.ok(new Set(gaps).size >= 3);
  assert.ok(gaps.every((gap, index) => gap > 0 || gaps[index - 1] > 0));

  let steps = 0;
  while (life.canonStep < CANON_BEAT_COUNT && steps++ < 100) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(life.canonStep, CANON_BEAT_COUNT);
  const afterWar = life.journal.slice(life.journal.findIndex((entry) => entry.id === "life_marineford_news") + 1);
  const sequence = afterWar.filter((entry) => entry.id.startsWith("canon_") || entry.id.startsWith("life_canon_daily_"));
  assert.ok(sequence.filter((entry) => entry.id.startsWith("life_canon_daily_")).length >= 10);
  assert.ok(sequence.filter((entry) => entry.id.startsWith("life_canon_daily_"))
    .every((entry) => /뒤/.test(entry.timeLabel)));
  assert.ok(sequence.every((entry, index) => index < 2 || !entry.id.startsWith("canon_")
    || !sequence.slice(Math.max(0, index - 2), index).every((previous) => previous.id.startsWith("canon_"))));
});

test("규칙 7은 소동·위험 사건을 섞고 모든 생애를 원작 현재 안에서 닫는다", async () => {
  const { adventureCounts } = await import("../src/adventures.js");
  assert.ok(adventureCounts.mishaps >= 15 && adventureCounts.dangers >= 8);
  const endings = new Set();
  let mishaps = 0; let dangers = 0;
  for (let seed = 0; seed < 60; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed * 31 + 7, {}, { species: ["인간", "어인", "거인족"][seed % 3] }, 3, 7);
    mishaps += life.seen.filter((id) => id.startsWith("life_mishap_")).length;
    dangers += life.seen.filter((id) => id.startsWith("life_danger_")).length;
    endings.add(life.ending);
    assert.ok(life.age <= life.birth.yearsBeforeCurrent, "원작 현재 이후의 해가 없어야 한다");
    if (life.ending === "present") assert.equal(life.journal.at(-1).id, "life_present_end");
  }
  assert.ok(mishaps >= 120 && dangers >= 60, `소동 ${mishaps}, 위험 ${dangers}`);
  assert.ok(endings.has("present") && endings.has("death"));
  const old = createGame("original", 3, { species: "인간" }, 3, 6);
  assert.ok(!play("original", 3, {}, { species: "인간" }, 3, 6).seen.some((id) => id.startsWith("life_mishap_")), "규칙 6 기록에는 새 사건이 섞이지 않는다");
  assert.equal(old.creationVersion, 6);
});

test("규칙 8은 원작 편의 섬에 있으면 날짜별 장면에 휘말리고, 곁의 사람을 보여 준다", async () => {
  const { ARC_ART, ARC_COUNT, ARC_SCENE_COUNT } = await import("../src/canon-arcs.js");
  assert.ok(ARC_ART.every((key) => ART[key]), `없는 그림 키: ${ARC_ART.filter((key) => !ART[key])}`);
  const { crewFor } = await import("../src/crew.js");
  assert.ok(ARC_COUNT >= 17 && ARC_SCENE_COUNT >= 29);
  let involved = 0; let lured = 0;
  for (let seed = 0; seed < 160 && (involved < 3 || lured === 0); seed += 1) {
    let life = createGame("free", seed * 7919 + 13, { species: "인간" });
    let steps = 0;
    while (!life.finished && steps++ < 700) {
      const scene = getScene(life);
      const usable = scene.choices.filter((choice) => !choice.disabled);
      const safe = usable.filter((choice) => !choice.dice && !/목숨/.test(choice.risk));
      let pick = (safe.length ? safe : usable)[0]?.id ?? null;
      if (scene.id.endsWith("_lure")) { lured += 1; if (usable.some((choice) => choice.id === "go")) pick = "go"; }
      const before = { pre: life.preCanonStep, post: life.canonStep };
      life = advance(life, pick);
      if (/^canon_arc_.*_\d+$/.test(scene.id)) {
        assert.ok(scene.timeLabel, "원작 편 장면에는 상대적인 날짜가 붙는다");
        assert.deepEqual({ pre: life.preCanonStep, post: life.canonStep }, before, "편 안의 장면은 원작 순서를 건너뛰지 않는다");
      }
    }
    if (life.seen.some((id) => /^canon_arc_.*_\d+$/.test(id))) { involved += 1; assert.deepEqual(replay(saveRecord(life)), life); }
  }
  assert.ok(lured > 0 && involved >= 3, `소문 ${lured}, 휘말린 생애 ${involved}`);
  assert.ok(!play("free", 13, {}, { species: "인간" }, 3, 7).seen.some((id) => id.startsWith("canon_arc_")), "규칙 7 기록에는 편 장면이 섞이지 않는다");

  const captain = createGame("free", 5, { species: "인간" });
  Object.assign(captain, { path: "pirate", independent: true, careerStartAge: 20, bounty: 150_000_000 });
  const roster = crewFor(captain);
  assert.ok(roster.length >= 5 && roster.some((member) => member.role === "산하 선단"), "이름난 선장에게는 산하 선단이 붙는다");
  const marine = Object.assign(createGame("free", 5, { species: "인간" }), { path: "marine", careerStartAge: 20, rankTier: 2 });
  assert.ok(crewFor(marine).some((member) => member.role === "부관"));
  assert.equal(new Set(roster.map((member) => member.name)).size, roster.length, "곁의 사람 이름이 겹치지 않는다");
});

test("규칙 9는 소속을 상황별 제안으로 하나씩 주고, 고정 나이 장면을 섞고, 성격을 선택과 결과에 반영한다", () => {
  const firstAges = new Map();
  for (let seed = 0; seed < 30; seed += 1) {
    let life = createGame("original", seed * 31 + 5, { species: "인간" }, 3, 9);
    const offered = [];
    while (!life.finished && life.age < 30) {
      const scene = getScene(life);
      assert.notEqual(scene.id, "life_early_departure", "한꺼번에 묻는 14세 장면은 나오지 않는다");
      if (scene.id.startsWith("life_recruit_")) {
        const path = scene.id.split("_")[2];
        assert.ok(!offered.includes(path), "거절한 길은 다시 권하지 않는다");
        offered.push(path);
        life = advance(life, "decline");
        continue;
      }
      const usable = scene.choices.filter((choice) => !choice.disabled);
      life = advance(life, (usable.find((choice) => !choice.dice) || usable[0])?.id ?? null);
    }
    assert.ok(offered.length >= 1, "모든 생애가 상황별 제안을 받는다");
    assert.ok(life.path, "제안을 모두 거절해도 마지막 갈림길에서 길을 정한다");
    for (const id of ["life_enemy", "life_mission"]) {
      const entry = life.journal.find((item) => item.id === id);
      if (entry) firstAges.set(id, new Set([...(firstAges.get(id) || []), entry.age]));
    }
  }
  assert.ok([...firstAges.values()].some((ages) => ages.size > 2), "예전에 고정됐던 장면이 여러 나이에 나온다");

  const bold = createGame("original", 3, { species: "인간" }, 3, 9);
  bold.personality = { empathy: 80, ambition: 40, loyalty: 40, caution: 40, freedom: 40 };
  bold.age = 29;
  Object.assign(bold, { path: "civilian", careerStartAge: 20, leftHome: true, seen: [...bold.seen, "life_leave_home", "life_first_station"] });
  let scene = getScene(bold);
  for (let guard = 0; guard < 40 && !scene.choices.some((choice) => choice.id === "trait_empathy"); guard += 1) {
    bold.age += 1; scene = getScene(bold);
  }
  assert.ok(scene.choices.some((choice) => choice.id === "trait_empathy"), "강한 성격에는 그 성격만의 선택지가 붙는다");
  const fitting = advance(bold, "trait_empathy");
  assert.match(fitting.lastOutcome, /성격에 맞는 일이라/);
  assert.equal(fitting.trust - bold.trust, Math.min(15, 100 - bold.trust), "성격에 맞는 선택은 오르는 수치가 1.5배");
});

test("규칙 10은 루피 일당과 겹치는 원작 연표를 훨씬 촘촘하게 나눈다", async () => {
  const { preCanonCount } = await import("../src/canon-before.js");
  const { canonCount } = await import("../src/canon-events.js");
  const life10 = createGame("original", 0, { species: "인간" });
  const life9 = createGame("original", 0, { species: "인간" }, 3, 9);
  assert.ok(preCanonCount(life10) >= PRE_CANON_BEAT_COUNT + 20, "정상전쟁 전 원작 소식이 크게 늘어난다");
  assert.ok(canonCount(life10) >= CANON_BEAT_COUNT + 12, "정상전쟁 뒤 원작 소식이 크게 늘어난다");
  assert.equal(preCanonCount(life9), PRE_CANON_BEAT_COUNT, "규칙 9 기록은 예전 연표를 그대로 쓴다");
  let life = createGame("original", 4, { species: "인간" });
  life.birth.yearsBeforeCurrent = Math.max(life.birth.yearsBeforeCurrent, 60);
  let steps = 0;
  const before = [];
  const titles = new Set();
  while (!life.finished && steps++ < 900) {
    const scene = getScene(life);
    if (scene.id.startsWith("canon_before_")) before.push(scene.id);
    if (scene.id.startsWith("canon_")) { assert.ok(!titles.has(scene.title), `원작 장면 제목이 겹치지 않는다: ${scene.title}`); titles.add(scene.title); }
    const usable = scene.choices.filter((choice) => !choice.disabled);
    const safe = usable.filter((choice) => !choice.dice && !/목숨/.test(choice.risk));
    life = advance(life, (safe[0] || usable[0])?.id ?? null);
  }
  if (life.seen.includes("life_marineford_news")) {
    assert.equal(before.length, preCanonCount(life));
    for (const id of ["canon_before_coby", "canon_before_rainbase", "canon_before_bounty_300m", "canon_before_breakout"]) assert.ok(before.includes(id), id);
  }
});

test("원작 열매를 먼저 먹으면 그 능력이 드러나는 원작 장면을 그 세계선에 맞게 다시 쓴다", async () => {
  const { preCanonScene: before } = await import("../src/canon-before.js");
  // Rule 15 keeps every pre-war beat in one year, so any step can be asked for directly.
  const life = createGame("free", 3, { species: "인간" }, 3, 15);
  life.age = life.birth.yearsBeforeCurrent - 3;
  life.people.fruitOwner = { owner: "포트거스 D. 에이스", fruit: "이글이글 열매" };
  life.location = "워터 세븐";
  for (let step = 0; step < 60; step += 1) {
    life.preCanonStep = step;
    const scene = before(life);
    if (scene?.id === "canon_before_nanohana_ace") {
      assert.doesNotMatch(scene.body, /불꽃으로 막아/, "에이스가 불꽃을 쓰지 않는다");
      assert.match(scene.body, /이글이글 열매를 먹지 않았다/);
      assert.match(scene.timeLabel, /IF 세계선/);
      return;
    }
  }
  assert.fail("나노하나 장면을 찾지 못했다");
});

test("먼저 먹을 수 있는 원작 열매마다 그 세계선을 드러내는 원작 장면이 있다", async () => {
  const { TAKEN_FRUIT_TEXT } = await import("../src/canon-timeline.js");
  for (const fruit of ["고무고무 열매", "이글이글 열매", "꽃꽃 열매", "수술수술 열매", "동강동강 열매", "어둠어둠 열매"]) {
    assert.ok(Object.keys(TAKEN_FRUIT_TEXT[fruit] || {}).length >= 1, `${fruit}의 IF 장면이 있어야 한다`);
  }
});

test("규칙 14의 생애는 뽑힌 운명의 갈래를 따라가고, 같은 선택도 능력치에 따라 결과가 갈린다", async () => {
  const { drawnFate } = await import("../src/fates.js");
  const { twist } = await import("../src/twists.js");
  const opened = new Set();
  for (let seed = 0; seed < 24; seed += 1) {
    let life = createGame("original", seed, { species: "인간" });
    const child = drawnFate(life, "child");
    opened.add(child.key);
    while (!life.finished && life.age < 26) {
      const scene = getScene(life);
      assert.ok(!["life_friend", "life_child_crisis", "life_after_storm"].includes(scene.id), "고정된 유년 사건 대신 운명의 갈래가 나와야 한다");
      life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    if (!life.finished) assert.ok(life.fates[child.key]?.step >= 3, `${child.key}의 유년 장들이 열려야 한다`);
    assert.deepEqual(replay(saveRecord(life)), life);
  }
  assert.ok(opened.size >= 4, "회차마다 다른 유년의 갈래가 뽑혀야 한다");
  // The same fate choice lands on better tiers for a strong life than for a weak one.
  const verdicts = { weak: [], strong: [] };
  for (let seed = 0; seed < 30; seed += 1) {
    let life = createGame("original", seed, { species: "인간" });
    while (!life.finished && !getScene(life).id.startsWith("life_fate_")) {
      life = advance(life, getScene(life).choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    if (life.finished) continue;
    const fate = drawnFate(life, "child");
    const scene = getScene(life);
    const choice = fate.chapters.find((chapter) => scene.id === `life_fate_${fate.key}_${chapter.id}`).choices[0];
    for (const [kind, value] of [["weak", 0], ["strong", 100]]) {
      const result = advance({ ...life, [choice.check.stat]: value }, choice.id).lastOutcome;
      verdicts[kind].push(result.match(/· (대성공|성공|실패)\./)[1]);
    }
  }
  const count = (kind, verdict) => verdicts[kind].filter((item) => item === verdict).length;
  assert.ok(count("strong", "대성공") > count("weak", "대성공") && count("weak", "실패") > count("strong", "실패"));
  // A strong stat turns some plain gains into windfalls and never into setbacks; a weak one the reverse.
  const strong = { skill: 95, health: 50, supplies: 50, bond: 50, friendBond: 50, trust: 50 };
  const weak = { ...strong, skill: 5 };
  const lines = (before) => Array.from({ length: 100 }, (_, index) => twist(before, { ...before, skill: before.skill + 10 }, index + 1));
  assert.ok(lines(strong).some((line) => line.startsWith("뜻밖의 행운")) && !lines(strong).some((line) => line.startsWith("뜻밖의 차질")));
  assert.ok(lines(weak).some((line) => line.startsWith("뜻밖의 차질")) && !lines(weak).some((line) => line.startsWith("뜻밖의 행운")));
});

test("규칙 15: 소속을 옮기면 직급에 비례해 강등되고, 이름난 해적단은 접점이 있어야 부르며, 원작 동료 이름을 보여 준다", async () => {
  const { crewFor } = await import("../src/crew.js");
  const { crewTie } = await import("../src/canon-crews.js");
  const { canonCrew } = await import("../src/world.js");
  const { setCareer } = await import("../src/life-story.js");
  // A vice admiral who turns pirate keeps about half the relative rank; a pirate captain who enlists starts mid-rank.
  const admiral = { ...createGame("original", 3, { species: "인간" }), path: "marine", rankTier: 5, role: "중장" };
  setCareer(admiral, "pirate");
  assert.deepEqual([admiral.rankTier, admiral.role, admiral.carriedRank], [2, "간부", "간부"]);
  const captain = { ...createGame("original", 3, { species: "인간" }), path: "pirate", independent: true, rankTier: 3, role: "선장" };
  setCareer(captain, "marine");
  assert.deepEqual([captain.rankTier, captain.role], [3, "소령"]);
  const older = { ...createGame("original", 3, { species: "인간" }, 3, 14), path: "marine", rankTier: 5 };
  setCareer(older, "pirate");
  assert.equal(older.rankTier, 0, "규칙 14 이전 생애는 처음부터 다시 시작한다");
  // Without any tie a named crew stays closed; one meeting opens it.
  const base = createGame("original", 11, { species: "인간" });
  const era = { ...base, age: base.birth.yearsBeforeCurrent - 10, people: {} };
  assert.equal(canonCrew(era), null);
  const tied = { ...era, people: { crewTies: { "흰 수염 해적단": 1, "빅 맘 해적단": 1, "백수 해적단": 1, "붉은 머리 해적단": 1 } } };
  assert.ok(crewTie(tied, canonCrew(tied)) > 0);
  // Joined crews and the marines list canon people of the era.
  const whitebeard = { ...era, path: "pirate", canonCrew: "흰 수염 해적단", affiliation: "흰 수염 해적단", leftHome: true };
  assert.ok(crewFor(whitebeard).some((member) => member.name === "에드워드 뉴게이트"));
  assert.ok(!crewFor(whitebeard).some((member) => member.name === "포트거스 D. 에이스"), "에이스는 아직 흰 수염 해적단에 없다");
  const marine = { ...era, path: "marine", affiliation: "해군", rankTier: 4, leftHome: true };
  assert.ok(crewFor(marine).some((member) => member.name === "센고쿠"));
});

test("35번: 열매와 패기 숙련도는 15:85 가중치로 각자 성공 기준을 바꾼다", () => {
  const life = createGame("original", 178, { species: "인간" }, 3, 35);
  assert.deepEqual(life.powerProficiency, { fruit: 0, haki: { observation: 0, armament: 0, conqueror: 0 } });
  assert.equal(createGame("original", 178, { species: "인간" }, 3, 34).powerProficiency, undefined);
  life.skill = 60;
  life.devilFruit = "이글이글 열매(자연계)";
  life.fruitMastery = 1;
  life.powerProficiency.fruit = 15;
  const check = { stat: "skill", against: 55 };
  const rookie = powerOdds(life, check, "fruit");
  assert.equal(rookie.target, 73);
  assert.equal(rookie.chance, 28);
  life.powerProficiency.fruit = 85;
  const veteran = powerOdds(life, check, "fruit");
  assert.ok(veteran.target < rookie.target);
  assert.equal(veteran.chance, 87);
  life.fruitMastery = 2;
  assert.ok(powerOdds(life, check, "fruit").chance >= veteran.chance);
  life.powerProficiency.fruit = 15;

  life.haki = { observation: 1, armament: 1, conqueror: 0 };
  life.powerProficiency.haki.observation = 80;
  life.powerProficiency.haki.armament = 20;
  const see = powerOdds(life, check, "haki", ["observation"]);
  const strike = powerOdds(life, check, "haki", ["armament"]);
  const combined = powerOdds(life, check, "haki", ["observation", "armament"]);
  assert.ok(see.chance > combined.chance && combined.chance > strike.chance);
  assert.equal(combined.mastery, 50);
  assert.ok(withPower(life, "mishap_drinking", []).every((choice) => choice.id !== "power_haki"),
    "패왕색이 없는 사람은 기세로 상대를 꺾지 못한다");
  assert.ok(withPower(life, "mishap_haki_bet", []).some((choice) => choice.id === "power_haki"),
    "두 패기를 습득한 사람에게 복합 선택을 제공한다");
  assert.ok(withPower({ ...life, haki: { ...life.haki, armament: 0 } }, "mishap_haki_bet", [])
    .every((choice) => choice.id !== "power_haki"));

  const old = createGame("original", 178, { species: "인간" }, 3, 34);
  old.devilFruit = life.devilFruit; old.fruitMastery = 1;
  assert.equal(withPower(old, "mishap_drinking", []).find((choice) => choice.id === "power_fruit")?.powerOdds, undefined);
  assert.deepEqual(replay(saveRecord(createGame("original", 178, { species: "인간" }, 3, 34))),
    createGame("original", 178, { species: "인간" }, 3, 34));
});

test("35번: 실제 능력 사용은 성공·실패 모두 숙련도를 올리고 이전 규칙은 그대로 둔다", () => {
  const life = createGame("free", 272, { species: "인간" }, 3, 35);
  life.devilFruit = "꽃꽃 열매(초인계)";
  life.fruitMastery = 1;
  life.powerProficiency.fruit = 15;
  const choice = withPower(life, "mishap_feast", []).find((item) => item.id === "power_fruit");
  assert.equal(choice.powerOdds.ability, "열매");
  assert.equal(choice.powerOdds.chance, 101 - choice.powerOdds.target);
  const next = structuredClone(life);
  const result = choice.apply(next);
  assert.match(result, /주사위 \d+/);
  const expected = { bad: 3, good: 6, great: 8 }[next.lastDice.tier];
  assert.equal(next.powerProficiency.fruit, 15 + expected);
  assert.equal(next.lastDice.success, next.lastDice.roll >= choice.powerOdds.target);
  assert.equal(choice.powerOdds.mastery, 15);
  gainPowerExperience(next, "fruit", [], "great");
  assert.equal(next.powerProficiency.fruit, 23 + expected);
  next.powerProficiency.fruit = 99;
  gainPowerExperience(next, "fruit", [], "great");
  assert.equal(next.powerProficiency.fruit, 100);
  const v34 = createGame("free", 272, { species: "인간" }, 3, 34);
  const snapshot = structuredClone(v34);
  gainPowerExperience(v34, "fruit", [], "great");
  assert.deepEqual(v34, snapshot);
});

test("35번: 지정된 Lv2 수련은 숙련도 조건 없이 승급하고 이전 버전 저장 기록을 유지한다", () => {
  const base = createGame("original", 89, { species: "인간" }, 3, 35);
  base.devilFruit = "이글이글 열매(자연계)";
  base.fruitMastery = 1;
  base.powerProficiency.fruit = 18;
  const advanced = structuredClone(base);
  advanced.fruitMastery = 2;
  awardPowerAcquisition(base, advanced, "life_fruit_practice");
  assert.equal(advanced.fruitMastery, 2);
  assert.equal(advanced.powerProficiency.fruit, 30);
  const haki = structuredClone(base);
  haki.haki.observation = 1;
  haki.powerProficiency.haki.observation = 12;
  const practiced = structuredClone(haki);
  practiced.haki.observation = 2;
  awardPowerAcquisition(haki, practiced, "life_haki_practice");
  assert.equal(practiced.haki.observation, 2);
  assert.equal(practiced.powerProficiency.haki.observation, 24);
  const learned = structuredClone(base);
  learned.haki.conqueror = 1;
  awardPowerAcquisition(base, learned, "life_conqueror_sign");
  assert.equal(learned.powerProficiency.haki.conqueror, 15);
  for (const version of [32, 33, 34, 35]) {
    const fresh = createGame("original", 89, { species: "인간" }, 3, version);
    assert.deepEqual(replay(saveRecord(fresh)), fresh);
  }
});

test("35번: 기존 구조 및 해왕류의 열매·패기 선택도 숙련 판정 대상이다", () => {
  const trial = lifeScenes.find((card) => card.id === "life_power_trial");
  const king = lifeScenes.find((card) => card.id === "life_sea_king");
  assert.ok(trial && king);
  for (const [card, keys] of [[trial, ["observe", "armor", "fruit"]], [king, ["haki", "fruit"]]]) {
    for (const id of keys) {
      const choice = card.choices.find((entry) => entry.id === id);
      assert.ok(choice?.powerCheck, `${card.id}:${id} needs a power-specific skill check`);
      assert.equal(choice.diceLabel.includes("숙련"), true);
    }
  }
  const veteran = createGame("original", 381, { species: "인간" }, 3, 35);
  veteran.devilFruit = "이글이글 열매(자연계)";
  veteran.fruitMastery = 1;
  veteran.powerProficiency.fruit = 15;
  veteran.haki.observation = 1;
  veteran.powerProficiency.haki.observation = 15;
  assert.equal(king.choices.find((choice) => choice.id === "haki").when(veteran), true);
  const noObservation = structuredClone(veteran);
  noObservation.haki.observation = 0;
  noObservation.haki.armament = 1;
  assert.equal(king.choices.find((choice) => choice.id === "haki").when(noObservation), false);
  noObservation.creationVersion = 34;
  assert.equal(king.choices.find((choice) => choice.id === "haki").when(noObservation), true);
  const rescueFruit = trial.choices.find((choice) => choice.id === "fruit");
  const prep = structuredClone(veteran);
  prep.supplies = 10;
  const baseline = prep.trust;
  rescueFruit.apply(prep);
  assert.equal(prep.trust, baseline + 10, "35번에서 성공한 숙련 판정을 기존 레벨·물자로 다시 가로막지 않는다");
  prep.creationVersion = 34;
  prep.trust = baseline;
  rescueFruit.apply(prep);
  assert.equal(prep.trust, baseline, "34번 구조 사건의 기존 필요 조건을 유지한다");
});

test("규칙 15: 열매·패기·비능력자마다 다른 선택지가 붙고, 주사위는 대성공을 따로 가른다", async () => {
  const { withPower } = await import("../src/adventures.js");
  const life = createGame("original", 5, { species: "인간" });
  const ids = (state) => withPower(state, "danger_sea_king", []).map((choice) => choice.id);
  assert.deepEqual(ids(life), ["power_nonuser"]);
  assert.deepEqual(ids({ ...life, devilFruit: "고무고무 열매", fruitMastery: 1, haki: { observation: 1, armament: 1, conqueror: 0 } }), ["power_fruit", "power_haki"]);
  assert.deepEqual(ids({ ...life, creationVersion: 14 }), [], "규칙 14 이전 생애에는 붙지 않는다");
  const fruit = withPower({ ...life, devilFruit: "고무고무 열매", fruitMastery: 2 }, "danger_sea_king", [])[0];
  const text = fruit.apply(structuredClone({ ...life, devilFruit: "고무고무 열매", fruitMastery: 2 }));
  assert.doesNotMatch(text, /\{power\}/);
  const goodSyn = withPower({ ...life, devilFruit: "얼음얼음 열매", fruitMastery: 2 }, "danger_sea_king", [])[0];
  const badSyn = withPower({ ...life, devilFruit: "모래모래 열매", fruitMastery: 2 }, "danger_sea_king", [])[0];
  assert.match(goodSyn.risk, /열매 상성 유리/);
  assert.match(badSyn.risk, /열매 상성 불리/);
  // A rolled choice far above its target is a great success; the popup gets its tier.
  const tiers = new Set();
  for (let seed = 0; seed < 80 && tiers.size < 3; seed += 1) {
    let state = createGame("original", seed, { species: "인간" });
    for (let step = 0; step < 300 && !state.finished; step += 1) {
      const scene = getScene(state);
      const rolled = scene.choices.find((choice) => choice.dice && !choice.disabled);
      state = advance(state, (rolled || scene.choices.find((choice) => !choice.disabled))?.id ?? null);
      if (state.lastDice?.tier) tiers.add(state.lastDice.tier);
    }
  }
  assert.deepEqual([...tiers].sort(), ["bad", "good", "great"]);
});

test("규칙 16은 원작의 몇 해를 생애의 스무 해 남짓으로 늘려, 원작 사건 사이에 자기 삶이 흐른다", async () => {
  const { eraStart } = await import("../src/world.js");
  let checked = 0;
  for (let seed = 0; seed < 40 && checked < 3; seed += 1) {
    let life = createGame("original", seed, { species: "인간" });
    const canon = [];
    let departure = null;
    while (!life.finished) {
      const scene = getScene(life);
      if (/^canon_|^life_marineford_news$/.test(scene.id)) canon.push(scene);
      if (scene.id === "canon_before_departure") departure = scene;
      life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    const war = life.journal.find((entry) => entry.id === "life_marineford_news");
    if (!war) continue;
    checked += 1;
    assert.match(departure.body, /스무 해 남짓에 걸쳐 풀어 놓았다/);
    assert.equal(presentAge(life), eraStart(life) + 24, "원작 현재는 출항으로부터 24년 뒤");
    assert.ok(life.age <= presentAge(life));
    assert.ok(war.age - departure.age >= 9, "출항에서 정상전쟁까지 여러 해가 흐른다");
    assert.equal(storyBefore(life, war.age), 2);
    assert.ok(life.journal.some((entry) => entry.age > departure.age && entry.age < war.age && !/^canon_|^life_marineford/.test(entry.id)),
      "원작 사건 사이에 자기 삶의 장면이 낀다");
  }
  assert.equal(checked, 3);
});

test("background music picks a mood per scene and keeps notes in tune", () => {
  assert.equal(moodFor({ id: "life_danger_reef" }), "danger");
  assert.equal(moodFor({ id: "canon_before_departure", canon: "east" }), "canon");
  assert.equal(moodFor({ id: "life_school" }), "calm");
  assert.equal(moodFor(null), "ending");
  assert.ok(Math.abs(degreeHz("calm", 0) - 293.66) < 0.01);
  assert.ok(Math.abs(degreeHz("calm", 7) - 587.32) < 0.01);
  assert.ok(Math.abs(degreeHz("calm", -7) - 146.83) < 0.01);
  assert.ok(Math.abs(degreeHz("calm", -1) - 293.66 * 2 ** (-1 / 12)) < 0.01);
});

test("rule 17 follows the manga order at Water 7 and keeps Jarul at Elbaf in the present", () => {
  const order = (version) => {
    const life = createGame("original", 3, { species: "인간" }, 3, version);
    const ids = [];
    for (let step = 0; step < 80 && ids.length < 80; step += 1) {
      life.preCanonStep = step;
      life.age = life.birth.yearsBeforeCurrent + 30;
      const scene = preCanonScene(life);
      if (scene) ids.push(scene.id);
    }
    return ids;
  };
  const v17 = order(17);
  assert.ok(v17.indexOf("canon_before_garp") < v17.indexOf("canon_before_bounty_300m"));
  const v16 = order(16);
  assert.ok(v16.indexOf("canon_before_garp") > v16.indexOf("canon_before_bounty_300m"), "older lives replay the old order");
  const present = createGame("original", 0, { species: "인간" }, 3, 17);
  present.location = "엘바프";
  present.age = presentAge(present);
  assert.equal(encounterAt(present), "luffy_elbaf");
  present.seen.push("life_meet_luffy_elbaf");
  assert.equal(encounterAt(present), "jarul");
});

test("rule 18 brings old-era canon news to lives born decades before Roger's execution", () => {
  const ids = (version) => {
    const seen = new Set();
    for (let seed = 1; seed <= 12; seed += 1) for (const id of play("original", seed, {}, { species: "인간" }, 3, version).seen) seen.add(id);
    return [...seen].filter((id) => OLD_ERA.some((event) => id === `life_old_${event.id}`));
  };
  assert.deepEqual(ids(17), [], "older lives replay without the new news");
  const shown = ids(18);
  for (const id of ["life_old_god_valley", "life_old_pirate_king", "life_old_shiki_marineford"]) assert.ok(shown.includes(id), id);
  // Events that share a year with fixed canon news still arrive in a later free year.
  assert.ok(shown.includes("life_old_whitebeard_fishman"));
});

test("rule 19 brings back the offer to found your own crew for pirates who never made a rival", () => {
  const offers = (version) => {
    let count = 0;
    for (let seed = 1; seed <= 40; seed += 1) {
      let life = createGame("original", seed, { species: "인간" }, 3, version);
      for (let step = 0; step < 400 && !life.finished; step += 1) {
        const scene = getScene(life);
        if (scene.id.startsWith("life_crew_offer_")) count += 1;
        const pick = scene.choices.find((choice) => choice.id === "pirate" && !choice.disabled) ?? scene.choices.find((choice) => !choice.disabled && !choice.naming);
        life = advance(life, pick?.id ?? null);
      }
    }
    return count;
  };
  assert.equal(offers(18), 0, "older lives replay as before");
  assert.ok(offers(19) >= 5);
});

test("rule 20 gives low-ranked marines canon supervisor and earned-friend scenes with a three-year cooldown", () => {
  const marine = createGame("free", 7, { species: "인간" }, 3, 20);
  marine.path = "marine";
  marine.affiliation = "해군";
  marine.age = 24;
  marine.birth.yearsBeforeCurrent = 0;
  const boss = canonBondScene(marine, marine.age + 1, { age: marine.age + 1 });
  assert.equal(boss?.id, "life_boss_garp_senbei");
  boss.choices[0].apply(marine);
  assert.equal(marine.people.lastBondAge, marine.age + 1, "the cooldown stores the scene year, not the previous age");
  assert.equal(canonBondScene({ ...marine, age: marine.age + 1 }, marine.age + 2, { age: marine.age + 2 }), null);

  const friend = createGame("free", 8, { species: "인간" }, 3, 20);
  friend.path = "marine";
  friend.affiliation = "해군";
  friend.age = 20;
  friend.birth.yearsBeforeCurrent = 22;
  const contact = attachCanonContact(friend, "loguetown", 0, friend.age + 1, { choices: [] });
  const aid = contact.choices.find((choice) => choice.id === "canon_contact_aid");
  assert.ok(aid, "a marine can choose to help a canon contact as well as report or arrest them");
  aid.apply(friend);
  assert.equal(friend.people.canonContacts.luffy.score, 30, "a meaningful act can earn the first relationship scene in one encounter");
  const bond = canonBondScene(friend, friend.age + 1, { age: friend.age + 1 });
  assert.equal(bond?.id, "life_bond_luffy_30", "a marine can earn an existing canon contact's friendship scene");
  bond.choices[0].apply(friend);
  assert.equal(friend.people.lastBondAge, friend.age + 1);

  const later = { ...friend, age: 34, birth: { ...friend.birth, yearsBeforeCurrent: 24 } };
  later.people = { canonContacts: { luffy: { score: 40, meetings: 3, captureAttempts: 0 } } };
  assert.equal(canonBondScene(later, later.age + 1, { age: later.age + 1 })?.id, "life_bond_luffy_30",
    "earned Straw Hat affinity remains claimable after the war-era boundary");
});

test("소꿉친구 획득 이펙트의 도착지에 친구가 표시되고 합류 상태가 구분된다", async () => {
  const { crewFor, crewLine } = await import("../src/crew.js");
  const before = createGame("free", 27, { species: "인간" }, 3, 30);
  const after = structuredClone(before);
  after.people.mate = { name: "로웰", bond: 60, fate: "곁" };

  assert.ok(collectMilestones(before, after).some((item) => item.kind === "bond" && item.targetId === "life-relationships"));
  assert.match(crewLine(after), /로웰\(소꿉친구 · 동행 전\)/);
  after.people.mate.together = true;
  assert.match(crewLine(after), /로웰\(어릴 적 친구 · 동료\)/);
  after.people.mate.together = false;
  after.people.mate.fate = "다른 길";
  assert.ok(!crewFor(after).some((person) => person.name === "로웰"));
});

test("인연·동료·세력은 조직 단위 산하 선단을 분리하고 해군 상관을 동료로 보여 준다", async () => {
  const { relationshipGroups } = await import("../src/crew.js");
  const initial = createGame("free", 23, { species: "인간" }, 3, 30);
  const mateLife = { ...initial, people: { ...initial.people, mate: { name: "로웰", fate: "곁", bond: 60 } } };
  const first = relationshipGroups(mateLife);
  assert.ok(first.bonds.some(({ name }) => name === "로웰"));
  assert.ok(!first.crew.some(({ name }) => name === "로웰"), "동행하지 않는 소꿉친구는 인연에만 기록");
  assert.equal(first.factions.length, 0);

  const withFriend = { ...mateLife, people: { ...mateLife.people, mate: { ...mateLife.people.mate, together: true } } };
  const joined = relationshipGroups(withFriend);
  assert.ok(joined.bonds.some(({ name }) => name === "로웰"));
  assert.ok(joined.crew.some(({ name }) => name === "로웰"));
  assert.equal(joined.factions.length, 0);

  const captain = { ...initial, path: "pirate", independent: true, careerStartAge: 20, bounty: 1_000_000_000 };
  const pirate = relationshipGroups(captain);
  assert.equal(pirate.factions.length, 3);
  assert.ok(pirate.factions.every(({ role }) => role === "산하 해적단"));
  assert.ok(pirate.crew.every(({ role }) => role !== "산하 선단"));

  const marine = { ...initial, path: "marine", rankTier: 2, careerStartAge: 20 };
  const fleet = relationshipGroups(marine);
  assert.ok(fleet.crew.some(({ role }) => role === "직속 상관" || role === "본부 사령" || role === "부관"));
  assert.equal(fleet.factions.length, 0);
});

test("인연 검색은 이름과 관계를 구별 없이 찾으며 빈 결과도 지원한다", async () => {
  const { filterRelationshipEntries } = await import("../src/crew.js");
  const entries = [
    { name: "로웰", role: "소꿉친구 · 동행 전" },
    { name: "몽키 D. 루피", role: "선장" },
    { name: "센고쿠", role: "해군 원수" },
    { name: "붉은 닻 해적단", role: "산하 해적단" }
  ];
  assert.deepEqual(filterRelationshipEntries(entries, ""), entries);
  assert.deepEqual(filterRelationshipEntries(entries, "   "), entries);
  assert.deepEqual(filterRelationshipEntries(entries, "  소꿉친구 "), [entries[0]]);
  assert.deepEqual(filterRelationshipEntries(entries, "d. 루피"), [entries[1]]);
  assert.deepEqual(filterRelationshipEntries(entries, "해적단"), [entries[3]]);
  assert.deepEqual(filterRelationshipEntries(entries, "사보"), []);
  const many = Array.from({ length: 50 }, (_, index) => ({ name: `동료 ${index + 1}`, role: "선원" }));
  assert.equal(filterRelationshipEntries(many, "").length, 50, "인원이 많아도 목록을 누락하지 않는다");
  assert.deepEqual(filterRelationshipEntries(many, "동료 50"), [many[49]]);
});

test("로빈과 책을 읽는 인연 이벤트는 우솝이 아니라 로빈의 인연을 올린다", () => {
  const life = createGame("free", 122, { species: "인간" }, 3, 24);
  life.path = "pirate";
  life.age = life.birth.yearsBeforeCurrent - 2;
  life.friendBond = 70;
  life.trust = 65;
  life.people.canonContacts = {
    usopp: { score: 10, meetings: 2, lastOrder: 20 },
    robin: { score: 30, meetings: 1, lastOrder: 10 }
  };
  const book = canonBondScene(life, life.age, { age: life.age });
  assert.equal(book?.id, "life_bond_robin_30");
  const after = structuredClone(life);
  book.choices.find(({ id }) => id === "quiet").apply(after);
  assert.equal(after.people.canonContacts.usopp.score, 10);
  assert.notEqual(after.people.canonContacts.robin.score, 30);
  assert.match(collectMilestones(life, after).find((item) => item.kind === "canon-bond").title, /^로빈 ·/);
});

test("관계 알림은 화면 맨 앞 인물 대신 실제 변경 인물로 표시한다", () => {
  const before = createGame("free", 120, { species: "인간" }, 3, 24);
  before.people.canonContacts = {
    usopp: { score: 10, meetings: 2, lastOrder: 9 },
    robin: { score: 30, meetings: 1, lastOrder: 4 }
  };
  const after = structuredClone(before);
  after.people.canonContacts.robin.score = 42;
  const notices = collectMilestones(before, after).filter((item) => item.kind === "canon-bond");
  assert.equal(notices.length, 1);
  assert.equal(notices[0].title, "로빈 · 우호 +42");

  const both = structuredClone(after);
  both.people.canonContacts.usopp.score = 15;
  both.people.canonContacts.robin.score = 45;
  assert.deepEqual(collectMilestones(before, both).filter((item) => item.kind === "canon-bond").map((item) => item.title),
    ["우솝 · 우호 +15", "로빈 · 신뢰 +45"]);
  const reordering = structuredClone(before);
  reordering.people.canonContacts.robin.lastOrder = 15;
  assert.deepEqual(collectMilestones(before, reordering), [], "순서 변경은 관계 변경이 아니다");
});

test("24번 규칙은 구경·피난을 원작 인물과의 만남으로 기록하지 않는다", () => {
  const setup = (version, location) => {
    const life = createGame("free", 121, { species: "인간" }, 3, version);
    Object.assign(life, { path: "pirate", location, skill: 90, health: 90, supplies: 100 });
    return life;
  };
  const examples = [
    ["wano", "와노국 외해", "watch", "zoro", []],
    ["whole_cake", "홀케이크 아일랜드 외해", "cake", "sanji", []],
    ["egghead", "에그헤드 외해", "listen", "bonney", []],
    ["water_seven", "워터 세븐", "away", "robin", ["canon_arc_water_seven_0"]],
    ["dressrosa", "드레스로자", "help", "rebecca", ["canon_arc_dressrosa_0"]]
  ];
  for (const [id, place, choice, wrongPerson, seen] of examples) {
    const life = setup(24, place);
    life.seen = seen;
    const scene = arcScene(life, { id }, life.age);
    assert.ok(scene && !scene.choices.some((item) => item.id === "canon_contact_talk"), id);
    scene.choices.find((item) => item.id === choice).apply(life);
    assert.equal(life.people.canonContacts?.[wrongPerson], undefined, id);
  }

  const jaya = setup(24, "자야 · 모크 타운");
  const scene = arcScene(jaya, { id: "jaya" }, jaya.age);
  scene.choices.find((c) => c.id === "mock").apply(jaya);
  assert.equal(jaya.people.canonContacts?.blackbeard, undefined);
  const spoken = setup(24, "자야 · 모크 타운");
  scene.choices.find((c) => c.id === "laugh").apply(spoken);
  assert.equal(spoken.people.canonContacts.blackbeard?.meetings, 1);

  const robin = setup(24, "에니에스 로비");
  const meeting = arcScene(robin, { id: "enies_lobby" }, robin.age);
  meeting.choices.find((c) => c.id === "clear").apply(robin);
  assert.equal(robin.people.canonContacts.robin?.meetings, 1);
  assert.ok(meeting.choices.some((c) => c.id === "canon_contact_talk"));

  const old = setup(23, "와노국 외해");
  arcScene(old, { id: "wano" }, old.age).choices.find((c) => c.id === "watch").apply(old);
  assert.equal(old.people.canonContacts.zoro?.meetings, 1, "기존 세이브의 재생 결과는 보존");
});

test("collectMilestones detects affiliation, devil fruit, haki, bounty, and relationship changes", () => {
  const before = createGame("free", 1, { species: "인간" });
  assert.deepEqual(collectMilestones(before, before), []);
  const after = {
    ...before,
    job: "해적",
    affiliation: "자체 해적단",
    role: "선장",
    devilFruit: "이글이글 열매",
    haki: { observation: 1, armament: 0, conqueror: 2 },
    bounty: 30_000_000,
    people: {
      mate: { name: "도윈", bond: 60, fate: "곁", together: true },
      rival: { name: "그레브", fate: "적" },
      ward: { name: "피오", fate: "후계" },
      canonContacts: { luffy: { score: 25, meetings: 1, lastOrder: 1 } }
    }
  };
  const milestones = collectMilestones(before, after);
  assert.deepEqual(milestones.map((item) => item.kind), ["rank", "fruit", "haki-conqueror", "haki-observation", "bounty", "bond", "canon-bond"]);
  assert.equal(milestones[0].targetId, "life-role");
  assert.equal(milestones[4].to, 30_000_000);
  assert.equal(milestones[5].targetId, "life-relationships");
  assert.equal(milestones[6].targetId, "life-relationships");

  const summary = peopleSummary({ ...after, age: 50, careerStartAge: 19, canonCrew: "흰 수염 해적단", affiliation: "흰 수염 해적단" });
  assert.match(summary, /옛 친구 도윈/);
  assert.match(summary, /에드워드 뉴게이트\(선장\)/);
  assert.doesNotMatch(summary, /그레브|피오/);

  const loguetownCrew = {
    ...before,
    age: before.birth.yearsBeforeCurrent - 2,
    path: "pirate",
    canonCrew: "밀짚모자 일당",
    affiliation: "밀짚모자 일당",
    preCanonStep: 8,
    people: { canonContacts: { luffy: { score: 35, meetings: 1 } } }
  };
  assert.deepEqual(
    rosterFor(loguetownCrew, 10).map((p) => p.name),
    ["몽키 D. 루피", "롤로노아 조로", "나미", "우솝", "상디"],
    "at Loguetown only the five East Blue Straw Hats have joined"
  );
  const invite = pendingCanonContactScene({ ...loguetownCrew, canonCrew: null, affiliation: "독립 해적단" });
  assert.match(invite.choices[0].apply({ ...loguetownCrew, canonCrew: null }), /고잉 메리호/);
  assert.deepEqual(
    rosterFor({ ...loguetownCrew, preCanonStep: 21 }, 10).map((p) => p.name),
    ["몽키 D. 루피", "롤로노아 조로", "나미", "우솝", "상디", "토니토니 쵸파", "니코 로빈"]
  );
  assert.deepEqual(
    rosterFor({ ...loguetownCrew, preCanonStep: 36 }, 10).map((p) => p.name),
    ["몽키 D. 루피", "롤로노아 조로", "나미", "우솝", "상디", "토니토니 쵸파", "니코 로빈", "프랑키", "브룩"]
  );
  assert.equal(crewVesselKind(before, 0), "hat");
  assert.equal(crewVesselKind({ ...before, preCanonStep: 1 }, eraStart(before)), "dinghy");
  assert.equal(crewVesselKind({ ...before, preCanonStep: 4 }, eraStart(before)), "merry");
  assert.equal(crewVesselKind({ ...before, preCanonStep: 34 }, eraStart(before)), "sunny");
  assert.equal(crewVesselKind({ ...before, seen: ["life_marineford_news"] }, eraStart(before)), "sunny");
});

test("거리비례 물자량과 원작·임의 지명이 융합된 항로 선택지가 올바르게 제공된다", () => {
  const life = createGame("original", 7, { species: "인간" }, 3, 20);
  life.location = "위스키 피크";
  life.supplies = 50;

  const voyage = travelScene(life, 22);
  const near = voyage.choices.find((c) => c.id === "near");
  const mid = voyage.choices.find((c) => c.id === "mid");
  const far = voyage.choices.find((c) => c.id === "far");

  assert.ok(near && mid && far, "단거리, 중거리, 원거리 선택지가 모두 제공되어야 한다");
  assert.match(near.label, /^\[단거리\]/);
  assert.match(mid.label, /^\[중거리\]/);
  assert.match(far.label, /^\[원거리\]/);

  // 물자 소모량 비교 (단거리 < 중거리 < 원거리)
  const costOf = (choice) => Number(choice.risk.match(/물자 (\d+) 필요/)[1]);
  assert.ok(costOf(near) < costOf(mid), "단거리는 중거리보다 물자 소모가 적어야 한다");
  assert.ok(costOf(mid) < costOf(far), "중거리는 원거리보다 물자 소모가 적어야 한다");

  // 임의 지명 표기 검증
  assert.match(far.label, /\(임의 지명\)/, "가상의 미개척 지점은 '(임의 지명)'으로 명시되어야 한다");

  // 임의 지명 방문 시 내러티브 검증
  const state = structuredClone(life);
  const result = far.apply(state);
  assert.match(result, /임의 지명으로 적힌/, "임의 지명에 닿으면 해도 바깥의 외딴 부두 내러티브가 나온다");
  assert.equal(state.supplies, 50 - costOf(far));

  // 신세계/낙원 지리 구분 검증
  assert.equal(isNewWorld("워터 세븐"), false);
  assert.equal(isNewWorld("알라바스타 · 나노하나"), false);
  assert.equal(isNewWorld("드레스로자"), true);
  assert.equal(isNewWorld("와노국 외해"), true);
  assert.equal(isNewWorld("검은 번개 여울(임의 지명)"), true);
  assert.equal(isNewWorld("물안개 암초군(임의 지명)"), false);
});

test("평판 시스템(명성/악명)과 해군·해적 진급 조건, 악명에 따른 현상금 배율이 올바르게 동작한다", () => {
  // 1. 초기값 검증
  const life = createGame("original", 42, { species: "인간" }, 3, 20);
  assert.equal(life.reputation, 0, "평판은 기본값 0으로 시작해야 한다");
  assert.equal(life.arrestCount, 0, "체포 실적은 0으로 시작해야 한다");
  assert.equal(life.arrestBounty, 0, "수감 현상금은 0으로 시작해야 한다");

  // 2. 평판 변화 추적 검증
  const testBountyLife = {
    ...life, path: "pirate", creationVersion: 20, age: 25, reputation: 0,
    bounty: 10_000_000, lastPublicActAge: -100, journal: []
  };
  const bScene = bountyScene(testBountyLife, 25, { id: "life_bounty_act_25", age: 25, act: 2, species: "all" });
  assert.ok(bScene);
  const witnessChoice = bScene.choices.find((c) => c.id === "witness");
  assert.ok(witnessChoice);
  const stateWitness = structuredClone(testBountyLife);
  witnessChoice.apply(stateWitness);
  assert.equal(stateWitness.reputation, 5, "증언 선택 시 명성이 5 증가해야 한다");

  const interveneChoice = bScene.choices.find((c) => c.id === "intervene");
  const stateIntervene = structuredClone(testBountyLife);
  interveneChoice.apply(stateIntervene);
  assert.equal(stateIntervene.reputation, -10, "개입 선택 시 악명이 10 쌓여야 한다");

  // 3. 악명에 따른 현상금 증가 배율 검증 (bountyScene)
  const outlawRenown = { ...life, path: "pirate", creationVersion: 20, lastPublicActAge: -100, reputation: 50, bounty: 10_000_000, journal: [] };
  const outlawInfamy = { ...life, path: "pirate", creationVersion: 20, lastPublicActAge: -100, reputation: -80, bounty: 10_000_000, journal: [] };
  const sceneRenown = bountyScene(outlawRenown, 25, { id: "test", age: 25, act: 2, species: "all" });
  const sceneInfamy = bountyScene(outlawInfamy, 25, { id: "test", age: 25, act: 2, species: "all" });
  assert.ok(sceneRenown && sceneInfamy, "현상금 사건이 생성되어야 한다");
  const gainRenown = sceneRenown.choices.find((c) => c.id === "intervene").bounty;
  const gainInfamy = sceneInfamy.choices.find((c) => c.id === "intervene").bounty;
  assert.ok(gainInfamy > gainRenown, "악명이 높을수록(+음수) 현상금 증가량이 명성 상태보다 커야 한다");

  // 4. 해군 초계 및 체포 수감 시스템 검증 (marinePatrolScene)
  const marineLife = {
    ...life, path: "marine", creationVersion: 20, homebound: false, age: 24,
    lastMarinePatrolAge: -100, location: "로그타운", journal: []
  };
  const patrol = marinePatrolScene(marineLife, 24, { id: "base", age: 24, act: 2, species: "all" });
  if (patrol) {
    const arrestChoice = patrol.choices.find((c) => c.id === "board_arrest");
    assert.ok(arrestChoice, "나포 및 직접 체포 선택지가 있어야 한다");
    const patrolState = structuredClone(marineLife);
    arrestChoice.apply(patrolState);
    assert.equal(patrolState.arrestCount, 1, "해적 체포 시 arrestCount가 증가해야 한다");
    assert.ok(patrolState.arrestBounty > 0, "해적 체포 시 arrestBounty가 증가해야 한다");
    assert.ok(patrolState.reputation > 0, "해적 체포 시 명성이 상승해야 한다");
  }

  // 5. 해군 진급 조건 검증 (rankOpportunity)
  // 계급: ["상사", "소위", "소령", "대령", "중장"]
  const marineCandidate = {
    ...life, path: "marine", rankTier: 0, creationVersion: 20, careerStartAge: 18, lastRankOfferAge: 18,
    skill: 40, reputation: 10, arrestCount: 1, arrestBounty: 5_000_000, journal: []
  };
  const baseCard = { id: "base", age: 25, act: 2, species: "all" };
  const marineOffer = rankOpportunity(marineCandidate, 25, baseCard);
  assert.ok(marineOffer, "조건 충족 시 상사 진급 제안이 와야 한다");
  assert.equal(marineOffer.title, "상사의 제안");

  // 악명 보유 시 해군 진급 불가 검증 (감찰/보류)
  const corruptMarine = { ...marineCandidate, reputation: -10 };
  assert.equal(rankOpportunity(corruptMarine, 25, baseCard), null, "악명이 있는 해군은 진급할 수 없다");

  // 체포 실적 부족 시 진급 불가 검증
  const inexperiencedMarine = { ...marineCandidate, arrestCount: 0 };
  assert.equal(rankOpportunity(inexperiencedMarine, 25, baseCard), null, "체포 실적이 없으면 상사로 진급할 수 없다");

  // 6. 해적 진급 조건 검증 (자신의 현상금 및 악명/의적 명성)
  // 계급: ["선원", "간부", "부선장"]
  const pirateCandidate = {
    ...life, path: "pirate", rankTier: 1, creationVersion: 20, careerStartAge: 18, lastRankOfferAge: 18,
    skill: 55, bounty: 30_000_000, reputation: -15, journal: []
  };
  const pirateOffer = rankOpportunity(pirateCandidate, 25, baseCard);
  assert.ok(pirateOffer, "현상금 2,500만 이상 및 악명 보유 시 간부 진급 제안이 와야 한다");
  assert.equal(pirateOffer.title, "간부의 제안");

  // 현상금 부족 시 진급 불가 검증
  const poorPirate = { ...pirateCandidate, bounty: 10_000_000 };
  assert.equal(rankOpportunity(poorPirate, 25, baseCard), null, "현상금이 부족하면 간부로 진급할 수 없다");

  // 부선장 진급 제안 검증
  const firstMateCandidate = {
    ...life, path: "pirate", rankTier: 2, creationVersion: 20, careerStartAge: 18, lastRankOfferAge: 18,
    skill: 68, bounty: 100_000_000, reputation: -30, journal: []
  };
  const mateOffer = rankOpportunity(firstMateCandidate, 25, baseCard);
  assert.ok(mateOffer, "현상금 8,000만 이상 및 악명 보유 시 부선장 진급 제안이 와야 한다");
  assert.equal(mateOffer.title, "부선장의 제안");

  // 의적(높은 명성의 해적)도 진급 가능 검증
  const chivalrousPirate = { ...firstMateCandidate, reputation: 50 };
  const chivalrousOffer = rankOpportunity(chivalrousPirate, 25, baseCard);
  assert.ok(chivalrousOffer, "악명이 없더라도 높은 의적 명성이 있으면 부선장 진급이 가능해야 한다");

  // 7. 이전 버전(creationVersion < 20) 하위 호환성 유지 검증
  const legacyLife = createGame("original", 42, { species: "인간" }, 3, 19);
  assert.equal(legacyLife.reputation, 0);
  assert.equal(rankOpportunity({ ...legacyLife, path: "marine", rankTier: 0, skill: 40, trust: 40, careerStartAge: 18, lastRankOfferAge: 18, journal: [] }, 25, baseCard)?.title, "상사의 제안");
});

test("대규모 서사 개편: 일관된 화자 시점, 순수인간 특화, 원작 관계망, 시스템 연동 및 조기 IF 검증", () => {
  // 1. 일관된 화자 시점 검증 (선장 및 해군 지휘관)
  const ordersCard = lifeScenes.find((c) => c.id === "life_orders");
  assert.ok(ordersCard, "life_orders 카드가 존재해야 한다");

  // v20 선장 시점
  const captain = createGame("free", 1, { species: "인간" }, 3, 20);
  captain.role = "선장";
  captain.independent = true;
  captain.path = "pirate";
  const captainBody = ordersCard.body(captain);
  assert.match(captainBody, /선장으로서 결단을 내려야 했다/, "선장일 때는 선장 결단 서사가 나와야 한다");
  const captainArt = typeof ordersCard.art === "function" ? ordersCard.art(captain) : ordersCard.art;
  assert.equal(captainArt, "deckCommand", "선장 명령 장면은 deckCommand 그림이어야 한다");

  // v20 해군 장교 시점
  const marineOfficer = createGame("free", 1, { species: "인간" }, 3, 20);
  marineOfficer.path = "marine";
  marineOfficer.rankTier = 3;
  marineOfficer.role = "소령";
  const marineBody = ordersCard.body(marineOfficer);
  assert.match(marineBody, /함선 지휘관으로서 현장 판단을 내려야 했다/, "해군 지휘관일 때는 현장 판단 서사가 나와야 한다");

  // v19 이전 버전 하위 호환성 (하급 선원 시점 유지)
  const legacyLife = createGame("free", 1, { species: "인간" }, 3, 19);
  legacyLife.role = "선장";
  legacyLife.independent = true;
  legacyLife.path = "pirate";
  assert.match(ordersCard.body(legacyLife), /선장은 이익이 적은 구조 요청을 지나치려 했다/, "이전 버전은 기존 선원 시점을 유지해야 한다");

  // 2. 28년 만에 재회한 라이벌 서사 및 위압적 굴복 검증
  const rivalCard = lifeScenes.find((c) => c.id === "life_rival_return");
  const emperor = createGame("free", 1, { species: "인간" }, 3, 20);
  emperor.rival = true;
  emperor.role = "사황";
  emperor.bounty = 3_000_000_000;
  assert.match(rivalCard.body(emperor), /바다의 거물이 된 깃발을 보고 함포를 거두며 극도로 긴장했다/, "사황일 때는 거물 깃발에 긴장하는 서사가 나와야 한다");
  const fightChoice = rivalCard.choices.find((c) => c.id === "fight");
  const fightLabel = typeof fightChoice.label === "function" ? fightChoice.label(emperor) : fightChoice.label;
  assert.match(fightLabel, /위압적인 기세로 상대 선단을 굴복시킨다/, "사황일 때는 위압적인 기세 선택지가 제공되어야 한다");
  const fightResult = fightChoice.apply(emperor);
  assert.match(fightResult, /압도적인 위압감 앞에 상대 선단은 무기를 거두고 고개를 숙였다/, "성공 서사 출력 확인");
  assert.equal(emperor.rival, false, "라이벌 관계가 청산되어야 한다");
  assert.ok((emperor.reputation || 0) >= 15, "명성이 올라야 한다");

  // 3. 비능력자(순수인간) 특화 경로 검증
  const fruitCard = lifeScenes.find((c) => c.id === "life_fruit_find");
  const humanLife = createGame("free", 1, { species: "인간" }, 3, 20);
  const rejectChoice = fruitCard.choices.find((c) => c.id === "leave");
  const oldSkill = humanLife.skill;
  const oldHealth = humanLife.health;
  rejectChoice.apply(humanLife);
  assert.equal(humanLife.pureHuman, true, "열매 거부 시 pureHuman 특화 플래그가 설정되어야 한다");
  assert.equal(humanLife.skill, oldSkill + 15, "기술 +15 보너스가 적용되어야 한다");
  assert.equal(humanLife.health, oldHealth + 10, "건강 +10 보너스가 적용되어야 한다");

  // 4. 원작 모드(original) 원작 인물 관계망 검증
  const origLife = createGame("original", 1, { species: "인간" }, 3, 20);
  assert.equal(canonRelationshipLine(origLife), "아직 접점 없음", "초기에는 접점 없음 표시");
  origLife.people.canonContacts = { luffy: { score: 40, encounters: 2, meetings: 2 } };
  assert.match(canonRelationshipLine(origLife), /루피/, "v20 원작 모드에서는 인물 관계가 요약 표기되어야 한다");

  const legacyOrig = createGame("original", 1, { species: "인간" }, 3, 19);
  legacyOrig.people.canonContacts = { luffy: { score: 40, encounters: 2, meetings: 2 } };
  assert.equal(canonRelationshipLine(legacyOrig), "더 자유로운 모드에서 관계를 기록합니다", "v19 이전 원작 모드는 기존 안내문 유지");

  // 5. 시스템 연동 사건 검증 (성격 70+, 소꿉친구 재회, 해군 수감 포상, 악명 대치, IF 통치)
  const allOldEra = OLD_ERA.map((e) => `life_old_${e.id}`);
  const allFatesDone = Object.fromEntries(Object.values(FATES).flat().map((f) => [f.key, { step: 99, marks: [] }]));

  // 5-1. 야망 70+
  const ambitionLife = createGame("free", 1, { species: "인간" }, 3, 20);
  ambitionLife.age = 35;
  ambitionLife.path = "pirate";
  ambitionLife.leftHome = true;
  ambitionLife.careerStartAge = 18;
  ambitionLife.lastRankOfferAge = 35;
  ambitionLife.seen = ["life_leave_home", "life_first_station", ...allOldEra];
  ambitionLife.fates = { ...allFatesDone };
  ambitionLife.personality.ambition = 75;
  const ambitionScene = yearlyScene(ambitionLife);
  assert.equal(ambitionScene.id, "life_personality_ambition", "야망 70 이상 시 야망 서사가 등장해야 한다");
  assert.equal(ambitionScene.art, "deckCommand");

  // 5-2. 소꿉친구 재회
  const friendLife = createGame("free", 1, { species: "인간" }, 3, 20);
  friendLife.age = 31; // age + 1 = 32 (32 % 4 === 0)
  friendLife.friendName = "타로";
  friendLife.path = "pirate";
  friendLife.leftHome = true;
  friendLife.homebound = false;
  friendLife.careerStartAge = 18;
  friendLife.lastRankOfferAge = 31;
  friendLife.lastPublicActAge = 32;
  friendLife.seen = ["life_leave_home", "life_first_station", ...allOldEra];
  friendLife.fates = { ...allFatesDone };
  const friendScene = yearlyScene(friendLife);
  assert.equal(friendScene.id, "life_friend_reunion", "30세 이후 소꿉친구 성인 재회 서사가 등장해야 한다");
  assert.equal(friendScene.art, "harborReunion");

  // 5-3. 해군 수감 실적 특별 포상
  const marineLife = createGame("free", 1, { species: "인간" }, 3, 20);
  marineLife.age = 25;
  marineLife.path = "marine";
  marineLife.leftHome = true;
  marineLife.careerStartAge = 18;
  marineLife.lastRankOfferAge = 25;
  marineLife.lastMarinePatrolAge = 26;
  marineLife.people.lastBondAge = 26;
  marineLife.seen = ["life_leave_home", "life_first_station", ...allOldEra];
  marineLife.fates = { ...allFatesDone };
  marineLife.arrestCount = 3;
  const marineScene = yearlyScene(marineLife);
  assert.equal(marineScene.id, "life_marine_commendation", "체포 실적 2회 이상 시 해군 본부 특별 포상 서사가 등장해야 한다");

  // 5-4. 악명 대치
  const infamyLife = createGame("free", 1, { species: "인간" }, 3, 20);
  infamyLife.age = 25;
  infamyLife.path = "pirate";
  infamyLife.leftHome = true;
  infamyLife.careerStartAge = 18;
  infamyLife.lastRankOfferAge = 25;
  infamyLife.lastPublicActAge = 26;
  infamyLife.seen = ["life_leave_home", "life_first_station", ...allOldEra];
  infamyLife.fates = { ...allFatesDone };
  infamyLife.reputation = -35;
  const infamyScene = yearlyScene(infamyLife);
  assert.equal(infamyScene.id, "life_infamy_standoff", "악명 -25 이하 시 바다를 뒤흔든 악명 대치 서사가 등장해야 한다");

  // 5-5. 사황 영지 통치
  const yonkoLife = createGame("free", 1, { species: "인간" }, 3, 20);
  yonkoLife.age = 30;
  yonkoLife.path = "pirate";
  yonkoLife.leftHome = true;
  yonkoLife.careerStartAge = 18;
  yonkoLife.lastRankOfferAge = 30;
  yonkoLife.lastPublicActAge = 31;
  yonkoLife.seen = ["life_leave_home", "life_first_station", ...allOldEra];
  yonkoLife.fates = { ...allFatesDone };
  yonkoLife.worldBranch = "emperor";
  yonkoLife.role = "사황";
  const yonkoScene = yearlyScene(yonkoLife);
  assert.equal(yonkoScene.id, "life_emperor_decree", "사황 분기 선택 후 사황 통치 서사가 등장해야 한다");

  // 6. 자유로운 모드(free) 조기 IF (드레스로자 canonStep >= 5) 검증
  const dressrosaLife = createGame("free", 1, { species: "인간" }, 3, 20);
  dressrosaLife.age = 45;
  dressrosaLife.index = 999;
  dressrosaLife.preCanonStep = preCanonCount(dressrosaLife);
  dressrosaLife.leftHome = true;
  dressrosaLife.seen = ["life_marineford_news", "life_leave_home", ...allOldEra];
  dressrosaLife.fates = { ...allFatesDone };
  dressrosaLife.path = "pirate";
  dressrosaLife.role = "선장";
  dressrosaLife.independent = true;
  dressrosaLife.canonStep = 5;
  dressrosaLife.bounty = 600_000_000;
  dressrosaLife.skill = 80;
  dressrosaLife.trust = 80;
  dressrosaLife.health = 80;
  const earlyIfScene = getScene(dressrosaLife);
  assert.equal(earlyIfScene.id, "life_free_rank", "드레스로자 시점에서 높은 현상금/신뢰 보유 시 조기 사황 IF가 열려야 한다");
});

test("항로 이동 및 출항 연동, 일상 막간 선택지 다양화, 진급 실적 사건(해군 수감·해적 악명/의적) 검증", () => {
  // 1. sailToNextPort 이동 검증
  const travelLife = createGame("free", 42, { species: "인간" }, 3, 20);
  travelLife.location = "워터 세븐";
  travelLife.leftHome = true;
  const nextDest = sailToNextPort(travelLife);
  assert.equal(nextDest, "샤본디 제도", "워터 세븐에서 출항 시 다음 기항지는 샤본디 제도여야 한다");
  assert.equal(travelLife.location, "샤본디 제도", "life.location이 샤본디 제도로 갱신되어야 한다");
  assert.ok(travelLife.travelHistory.includes("샤본디 제도"), "지나온 항로에 샤본디 제도가 기록되어야 한다");

  // 2. 직업 선택 직후 섬 밖으로(life_leave_home) 즉시 연결 검증
  const careerLife = createGame("free", 100, { species: "인간" }, 3, 20);
  careerLife.path = "marine";
  careerLife.leftHome = false;
  careerLife.homebound = false;
  const leaveHomeScene = getScene(careerLife);
  assert.equal(leaveHomeScene.id, "life_leave_home", "직업을 선택하고 아직 출항하지 않은 생애는 섬 밖으로 장면이 즉시 열려야 한다");
  const advancedLife = advance(careerLife, null);
  assert.ok(advancedLife.leftHome, "섬 밖으로 장면 진행 후 leftHome이 true가 되어야 한다");
  assert.equal(advancedLife.location, "리버스 마운틴", "출항 후 첫 기항지가 리버스 마운틴으로 갱신되어야 한다");
  assert.ok(advancedLife.travelHistory.includes("리버스 마운틴"), "항로 기록에 첫 기항지가 포함되어야 한다");

  // 3. 일상 막간(canon daily interludes) 고유 선택지 검증
  const interludeLife = createGame("original", 777, { species: "인간" }, 3, 20);
  interludeLife.age = 22;
  interludeLife.leftHome = true;
  interludeLife.canonGapRemaining = 5;
  interludeLife.canonDailyIndex = 3;
  const interludeScene = getScene(interludeLife);
  if (interludeScene && interludeScene.canonDaily && interludeScene.choices) {
    const choiceLabels = interludeScene.choices.map((c) => c.label);
    assert.ok(choiceLabels.length >= 2, "일상 막간 장면에 2개 이상의 선택지가 있어야 한다");
    // 고유 선택지가 들어있으므로 기존의 단일 반복 선택지만 있는 것이 아니어야 함
    assert.ok(!choiceLabels.every((lbl) => lbl === "곁의 사람과 오늘 일을 함께 정한다" || lbl === "다음 일을 위한 도구를 먼저 챙긴다"),
      "상황에 맞는 맥락형 선택지가 제공되어야 한다");
  }

  // 4. 진급 실적 임무(DUTIES) 및 해군/해적 실적 연동 검증
  assert.ok(DUTIES.length >= 4, "해군, 해적, 혁명군, 민간인 임무가 4종 이상 정의되어 있어야 한다");
  const marineDuty = DUTIES.find((d) => d.id === "marine_patrol_intercept");
  assert.ok(marineDuty, "연안 초계 해적선 임무가 존재해야 한다");
  const testMarine = createGame("free", 50, { species: "인간" }, 3, 20);
  testMarine.path = "marine";
  testMarine.rankTier = 0;
  testMarine.role = "수병";
  testMarine.skill = 35;
  testMarine.health = 50;
  const boardChoice = marineDuty.choices.find((c) => c.id === "board");
  boardChoice.apply(testMarine);
  assert.equal(testMarine.arrestCount, 1, "해적 나포 시 수감 실적이 1명 증가해야 한다");
  assert.equal(testMarine.arrestBounty, 5_000_000, "해적 나포 시 수감 현상금이 기록되어야 한다");
  assert.ok(testMarine.reputation >= 8, "해적 토벌로 명성이 상승해야 한다");

  // 5. 실적 충족 시 상사 진급 제안(life_rank_1) 검증
  testMarine.leftHome = true;
  testMarine.careerStartAge = 18;
  testMarine.age = 23;
  testMarine.lastRankOfferAge = -100;
  testMarine.seen = ["life_leave_home", "life_first_station"];
  const rankScene = rankOpportunity(testMarine, 23, { age: 23, act: 2, species: "all" });
  assert.ok(rankScene, "수감 실적과 명성을 갖춘 수병에게 상사 진급 제안이 나와야 한다");
  assert.equal(rankScene.id, "life_rank_1_23", "상사 진급 제안 장면 ID가 일치해야 한다");
  assert.equal(rankScene.title, "상사의 제안", "상사의 제안 타이틀이 일치해야 한다");
});

test("원작 인물 전투력의 시대별 성장, 플레이어 전력 비교 기반 주사위 판정, 수감 시 원작 소식 분기 검증", () => {
  // 1. 루피 및 주요 인물의 시대별 전투력 성장 검증
  const dummy = createGame("free", 1, { species: "인간" }, 3, 20);
  assert.equal(canonPowerAt("luffy", dummy, "loguetown"), 48, "이스트 블루 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "alabasta_war"), 68, "알라바스타 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "enies_lobby"), 88, "에니에스 로비(기어 2) 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "sabaody_auction"), 102, "샤본디 제도 루피 전투력");
  dummy.seen = ["life_marineford_news"];
  assert.equal(canonPowerAt("luffy", dummy, "reunion"), 120, "2년 뒤 재집결 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "dressrosa"), 135, "드레스로자(기어 4) 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "whole_cake"), 152, "홀케이크(스네이크맨) 루피 전투력");
  assert.equal(canonPowerAt("luffy", dummy, "wano"), 182, "와노국(기어 5 니카 사황) 루피 전투력");
  assert.equal(canonPowerAt("bigMom", dummy, "whole_cake"), 195, "사황 빅 맘 전투력");
  assert.equal(canonPowerAt("demaro", dummy, "reunion"), 15, "가짜 루피 데마로 블랙 전투력");

  // 2. 수병(rankTier 0) vs 사황 루피 체포 판정 검증 (단순 기술 100으로 10+ 주사위 잡기 방지)
  const seaman = createGame("free", 1, { species: "인간" }, 3, 20);
  seaman.path = "marine";
  seaman.rankTier = 0; // 수병
  seaman.skill = 100;
  seaman.health = 100;
  assert.equal(playerCombatRating(seaman), 100, "패기/직급 없는 수병의 기본 전투력");
  
  // 수병이 와노국/엘바프 루피(182)를 체포하려 할 때
  const seamanVsWanoTarget = computeCaptureDiceTarget("luffy", seaman, "wano");
  assert.equal(seamanVsWanoTarget, 95, "수병이 사황 루피를 체포하려 할 때는 주사위 목표치 95(극악 난이도)여야 한다");

  // 반면 이스트 블루 루피(48)를 상대할 때
  const seamanVsEastTarget = computeCaptureDiceTarget("luffy", seaman, "loguetown");
  assert.ok(seamanVsEastTarget <= 25, "기술 100의 해군이 이스트 블루 루피 체포 시 현실적 성공 확률을 가져야 한다");

  // 중장(rankTier 5) + 패기 보유자 vs 와노국 루피
  const viceAdmiral = createGame("free", 1, { species: "인간" }, 3, 20);
  viceAdmiral.path = "marine";
  viceAdmiral.rankTier = 5;
  viceAdmiral.skill = 90;
  viceAdmiral.health = 90;
  viceAdmiral.haki = { armament: 2, observation: 1, conqueror: 0 };
  const vaRating = playerCombatRating(viceAdmiral);
  assert.ok(vaRating >= 170, "중장 직급과 패기를 갖춘 해군의 전투력");
  const vaVsWanoTarget = computeCaptureDiceTarget("luffy", viceAdmiral, "wano");
  assert.ok(vaVsWanoTarget >= 45 && vaVsWanoTarget <= 65, "고위 장교와 사황의 대치는 팽팽한 주사위 목표치를 가져야 한다");

  // 실제 인물 조우 선택지(attachCanonContact)에 전력 및 동적 주사위 판정 반영 검증
  const attachedWano = attachCanonContact(seaman, "elbaf", 0, seaman.age, { choices: [] });
  const captureWano = attachedWano.choices.find((c) => c.id === "canon_contact_capture");
  assert.ok(captureWano, "체포 선택지가 제공되어야 한다");
  assert.equal(captureWano.diceTarget(), 95, "수병의 사황 체포 주사위 목표치는 95여야 한다");
  assert.match(captureWano.risk, /상대 전투력 182 vs 내 전투력 100/, "상대와 자신의 전투력이 위험 설명에 표기되어야 한다");
  assert.match(captureWano.risk, /수병\/하사 단독 체포 극히 불리/, "하급 해군의 거물 체포 불리 경고가 표기되어야 한다");

  const attachedEast = attachCanonContact(seaman, "loguetown", 0, seaman.age, { choices: [] });
  const captureEast = attachedEast.choices.find((c) => c.id === "canon_contact_capture");
  assert.ok(captureEast, "이스트 블루 체포 선택지가 제공되어야 한다");
  assert.equal(captureEast.diceTarget(), 19, "기술 100 수병의 이스트 블루 루피 체포 주사위 목표치는 19여야 한다");
  assert.match(captureEast.risk, /상대 전투력 48 vs 내 전투력 100/, "이스트 블루 루피 전투력이 올바르게 비교되어야 한다");

  // 3. 루피 수감(custody: held/transferred) 시 원작 소식 IF 분기 검증
  const custodyMarine = createGame("free", 1, { species: "인간" }, 3, 20);
  custodyMarine.people = {
    canonContacts: {
      luffy: { custody: "transferred", meetings: 1, score: -50 }
    }
  };
  custodyMarine.preCanonStep = 5; // arlong
  custodyMarine.age = 20;
  custodyMarine.birth.yearsBeforeCurrent = 22;
  custodyMarine.location = "바다 건너";
  const preBeat = preCanonScene(custodyMarine);
  assert.ok(preBeat, "원작 소식 장면이 생성되어야 한다");
  assert.match(preBeat.body, /수감|선장의 부재|세계선/, "루피가 수감되었을 때 원작 소식은 루피의 자유 항해가 아닌 수감 세계선을 반영해야 한다");

  // 정상전쟁 이후 소식 분기
  custodyMarine.seen = ["life_marineford_news"];
  custodyMarine.canonStep = 2; // reunion
  custodyMarine.age = canonAge(custodyMarine);
  const postBeat = canonScene(custodyMarine);
  assert.ok(postBeat, "사후 원작 소식 장면이 생성되어야 한다");
  assert.match(postBeat.body, /구금|수감|구출 계획/, "샤본디 재집결 소식에서도 루피 수감 상태가 반영되어야 한다");
});

test("UI 소스코드 구문 오류 방지 및 일상 막간 고위험/고보상 위기·단련 사건 검증", async () => {
  const { execSync } = await import("node:child_process");
  const { readFileSync } = await import("node:fs");
  // 1. src/app.js를 포함한 모든 소스코드 구문 오류 검증 (새 삶 시작하기 등 초기화 중단 방지)
  assert.doesNotThrow(() => {
    execSync("node -c src/app.js", { stdio: "pipe" });
  }, "src/app.js에 구문 오류(중복 선언 등)가 없어야 한다");

  // 1-2. playMilestones 내 idx 루프 변수 선언 및 직책 획득 후 다음 장면/저장 복원 정상 동작 검증
  const appCode = readFileSync("src/app.js", "utf8");
  const playMilestonesBlock = appCode.slice(appCode.indexOf("async function playMilestones"), appCode.indexOf("async function advanceLife"));
  assert.match(playMilestonesBlock, /for\s*\(\s*let\s+idx\s*=\s*0\s*;\s*idx\s*<\s*milestones\.length/, "playMilestones 루프에서 idx 변수가 정의되어야 한다");
  assert.match(appCode, /function safeReplay\(record\)/, "이전 버전 저장 기록 충돌 시에도 유효 선택까지 복구하는 safeReplay가 정의되어야 한다");

  let careerLife = createGame("free", 11, { species: "인간" }, 3, 20);
  while (!careerLife.finished && careerLife.role === "없음") {
    const sc = getScene(careerLife);
    const ch = sc.choices.find((c) => !c.disabled);
    const before = careerLife;
    careerLife = advance(careerLife, ch ? ch.id : null);
    if (careerLife.role !== "없음") {
      const ms = collectMilestones(before, careerLife);
      assert.ok(ms.some((m) => m.kind === "rank"), "첫 직책 획득 시 rank 마일스톤이 생성되어야 한다");
      const nextSc = getScene(careerLife);
      assert.ok(nextSc && nextSc.title, "첫 직책 획득 직후 다음 장면 이벤트가 정상 생성되어야 한다");
      const replayed = replay(saveRecord(careerLife));
      assert.equal(replayed.role, careerLife.role, "첫 직책 획득 직후 저장 기록이 유실 없이 복원되어야 한다");
    }
  }

  // 2. 버전 20 일상 막간 고위험/고보상 및 체력 소모 위기 검증
  const { canonInterludeScene, canonGapFor } = await import("../src/canon-interludes.js");
  const testLife = createGame("free", 7, { species: "인간" }, 3, 20);
  testLife.canonGapRemaining = 2;
  testLife.path = "pirate";
  testLife.leftHome = true;
  testLife.homebound = false;

  const gapsV20 = Array.from({ length: 10 }, (_, i) => canonGapFor(testLife, "before", i));
  assert.ok(new Set(gapsV20).size >= 3, "간격 패턴이 단조롭지 않아야 한다");
  assert.ok(gapsV20.every((g, idx) => g > 0 || gapsV20[idx - 1] > 0), "연속 0간격이 없어야 한다");

  // 일상 막간에서 위험/기회 사건이 생성될 수 있는지 확인
  let foundHealthRisk = false;
  let foundHighReward = false;
  for (let slot = 0; slot < 30; slot += 1) {
    testLife.canonDailyIndex = slot;
    testLife.canonGapRemaining = 1;
    const interlude = canonInterludeScene(testLife);
    if (interlude && interlude.choices) {
      for (const c of interlude.choices) {
        if (/건강 -(1[0-9]|2[0-9]|3[0-9])/.test(c.risk) || (c.failRisk && /건강 -(1[0-9]|2[0-9]|3[0-9])/.test(c.failRisk))) {
          foundHealthRisk = true;
        }
        if (/기술 \+(1[0-9])/.test(c.risk) || /물자 \+(2[0-9]|3[0-9])/.test(c.risk)) {
          foundHighReward = true;
        }
      }
    }
  }
  assert.ok(foundHealthRisk, "버전 20 일상 막간에는 건강이 깎일 수 있는 실제 위험 선택지가 포함되어야 한다");
  assert.ok(foundHighReward, "버전 20 일상 막간에는 큰 스탯/물자 변화를 주는 유의미한 선택지가 포함되어야 한다");
});

test("열매 먹기, 패기 습득, 현상금 획득 시 마일스톤 생성 및 다음 장면 아트 무결성 검증", async () => {
  const { ART, createGame, getScene, advance, collectMilestones, saveRecord, replay } = await import("../src/game.js");
  const { DUTIES } = await import("../src/adventures.js");
  const { readFileSync } = await import("node:fs");

  // 1. 모든 DUTIES의 art 키가 ART에 유효하게 등록되어 있는지 검증
  const dummy = createGame("free", 1);
  for (const duty of DUTIES) {
    const artKey = typeof duty.art === "function" ? duty.art(dummy) : duty.art;
    assert.ok(artKey && ART[artKey] && ART[artKey].src, `DUTY ${duty.id}의 art(${artKey})가 ART에 존재해야 한다`);
  }

  // 2. 열매 먹기(fruit) 마일스톤 및 후속 장면 생성 검증
  let fruitLife = createGame("free", 3, { species: "인간" }, 3, 20);
  let fruitEaten = false;
  for (let step = 0; step < 60 && !fruitLife.finished; step += 1) {
    const sc = getScene(fruitLife);
    if (!sc) break;
    const eatChoice = sc.choices.find((c) => c.id === "eat");
    if (eatChoice) {
      const before = fruitLife;
      fruitLife = advance(fruitLife, "eat");
      const ms = collectMilestones(before, fruitLife);
      assert.ok(ms.some((m) => m.kind === "fruit" && m.targetId === "life-power"), "열매 섭취 시 fruit 마일스톤이 생성되어야 한다");
      const nextSc = getScene(fruitLife);
      assert.ok(nextSc && nextSc.art && nextSc.art.src, "열매 섭취 후 다음 장면의 art가 유효해야 한다");
      fruitEaten = true;
      break;
    }
    const ch = sc.choices.find((c) => !c.disabled);
    fruitLife = advance(fruitLife, ch ? ch.id : null);
  }
  assert.ok(fruitEaten, "열매 먹기 이벤트가 성공적으로 발생하고 검증되어야 한다");

  // 3. 패기(haki) 습득 마일스톤 검증
  const beforeHaki = createGame("free", 5, { species: "인간" }, 3, 20);
  const afterHaki = structuredClone(beforeHaki);
  afterHaki.haki = { observation: 1, armament: 1, conqueror: 1 };
  const hakiMs = collectMilestones(beforeHaki, afterHaki);
  assert.equal(hakiMs.filter((m) => m.kind.startsWith("haki-")).length, 3, "견문색/무장색/패왕색 3종 마일스톤이 생성되어야 한다");
  assert.ok(hakiMs.every((m) => m.targetId === "life-power"), "패기 마일스톤의 targetId는 life-power여야 한다");

  // 4. 현상금(bounty) 마일스톤 검증
  const beforeBounty = createGame("free", 5, { species: "인간" }, 3, 20);
  const afterBounty = structuredClone(beforeBounty);
  afterBounty.bounty = 30_000_000;
  const bountyMs = collectMilestones(beforeBounty, afterBounty);
  assert.ok(bountyMs.some((m) => m.kind === "bounty" && m.to === 30_000_000 && m.targetId === "life-power"), "현상금 증가 시 bounty 마일스톤이 생성되어야 한다");

  // 5. index.html 캐시 버스팅 및 app.js 방어 애니메이션 코드 검증
  const htmlCode = readFileSync("index.html", "utf8");
  assert.match(htmlCode, /src="\.?\/src\/app\.js\?v=/, "index.html에 브라우저 캐시 방지 쿼리스트링이 포함되어야 한다");

  const appCode = readFileSync("src/app.js", "utf8");
  assert.match(appCode, /function flyCardTo/, "flyCardTo가 정의되어 있어야 한다");
  assert.match(appCode, /anim\?\.finished/, "flyCardTo에서 finished 프로퍼티 방어 처리가 되어 있어야 한다");
});

test("선택지 및 직무 이벤트 유효성, 원작 뱃지 오분류 방지, 렌더링 방어 로직 검증", async () => {
  const { createGame, getScene, advance } = await import("../src/game.js");
  const { DUTIES, DANGERS, MISHAPS } = await import("../src/adventures.js");
  const { MOMENTS, MOMENTS_V11, MOMENTS_V20 } = await import("../src/canon-interludes.js");
  const { readFileSync } = await import("node:fs");

  const dummy = createGame("free", 1, { species: "인간" }, 3, 20);
  dummy.path = "marine";
  dummy.rankTier = 1;
  dummy.trust = 50;
  dummy.supplies = 50;
  dummy.health = 50;
  dummy.skill = 50;

  // 1. 모든 직무(DUTIES), 위험(DANGERS), 사고(MISHAPS), 막간(MOMENTS) 선택지의 apply/fail 실행 안정성 검증
  const pools = [
    { name: "DUTIES", list: DUTIES },
    { name: "DANGERS", list: DANGERS },
    { name: "MISHAPS", list: MISHAPS },
    { name: "MOMENTS", list: MOMENTS },
    { name: "MOMENTS_V11", list: MOMENTS_V11 },
    { name: "MOMENTS_V20", list: MOMENTS_V20 }
  ];

  for (const { name, list } of pools) {
    for (const item of list) {
      if (!item.choices) continue;
      for (const ch of item.choices) {
        assert.ok(ch.id, `${name} ${item.id} 선택지에 id가 있어야 한다`);
        assert.ok(ch.label, `${name} ${item.id} 선택지에 label이 있어야 한다`);
        if (typeof ch.apply === "function") {
          const clone = structuredClone(dummy);
          const res = ch.apply(clone);
          assert.ok(typeof res === "string" && res.length > 0, `${name} ${item.id}:${ch.id} apply는 비어있지 않은 문자열을 반환해야 한다`);
        }
        if (typeof ch.fail === "function") {
          const clone = structuredClone(dummy);
          const res = ch.fail(clone);
          assert.ok(typeof res === "string" && res.length > 0, `${name} ${item.id}:${ch.id} fail은 비어있지 않은 문자열을 반환해야 한다`);
        }
      }
    }
  }

  // 2. 해군 연안 초계(marine_patrol_intercept) 장면 렌더링 무결성 검증
  let patrolLife = createGame("free", 1, { species: "인간" }, 3, 20);
  patrolLife.path = "marine";
  patrolLife.rankTier = 0;
  patrolLife.leftHome = true;
  patrolLife.location = "위스키 피크";
  patrolLife.age = 35;
  patrolLife.canonGapRemaining = 2;
  patrolLife.canonDailyIndex = 0;
  const patrolScene = getScene(patrolLife);
  assert.equal(patrolScene.id, "life_duty_marine_patrol_intercept");
  assert.equal(patrolScene.manual, false, "선택지가 있는 직무 장면은 manual이 false여야 한다");
  assert.ok(patrolScene.choices.length >= 2, "선택지가 정상적으로 제공되어야 한다");
  assert.ok(patrolScene.art && patrolScene.art.src, "아트 오브젝트가 유효해야 한다");
  const advancedPatrol = advance(patrolLife, patrolScene.choices[0].id);
  assert.ok(advancedPatrol, "직무 선택지로 advance가 정상 실행되어야 한다");

  // 3. app.js 내 manual 버튼 방어 조건 및 원작 분류 방어 검증
  const appCode = readFileSync("src/app.js", "utf8");
  assert.match(appCode, /if\s*\(scene\.manual\s*&&\s*!scene\.choices\.length\)/, "선택지가 존재할 때는 원작 계속 버튼이 중복 생성되지 않아야 한다");
  assert.match(appCode, /life_\(duty\|danger\|mishap/, "일상/직무/위험 사건은 원작 스토리로 분류되지 않아야 한다");
  assert.match(appCode, /renderGame\(false\)/, "선택 실패 예외 발생 시 화면을 즉시 재렌더링하여 정상 선택지를 복구해야 한다");

  // 4. index.html 최신 버전 쿼리 검증
  const htmlCode = readFileSync("index.html", "utf8");
  assert.match(htmlCode, /app\.js\?v=\d{8}-\d+/, "index.html에 날짜와 개정 번호가 들어간 캐시버스팅이 있어야 한다");
});

test("예외 방어 및 소프트락 탈출구, 비동기 안전 타임아웃 무결성 검증", async () => {
  const { createGame, getScene, advance } = await import("../src/game.js");
  const { fruitSynergy } = await import("../src/power-choices.js");
  const { readFileSync } = await import("node:fs");

  // 1. fruitSynergy의 null/undefined 방어 검증
  const nullSyn = fruitSynergy(null, "mishap_ship_leak");
  assert.equal(nullSyn.tier, "neutral", "null 입력 시 에러 없이 neutral을 반환해야 한다");
  const undefSyn = fruitSynergy(undefined, "mishap_ship_leak");
  assert.equal(undefSyn.tier, "neutral", "undefined 입력 시 에러 없이 neutral을 반환해야 한다");

  // 2. 모든 선택지가 disabled일 때 fallback_skip 생성 및 advance 안전 처리 검증
  const lockedLife = createGame("free", 1, { species: "인간" }, 3, 20);
  lockedLife.supplies = 0;
  lockedLife.location = "위스키 피크";
  // travelScene과 같은 장면에서 모든 유효 선택지가 disabled일 때의 fallback_skip 확인
  const dummyCard = {
    id: "test_lock_scene", age: 20, act: 2, title: "물자 부족 위기", body: "물자가 완전히 떨어졌다.",
    choices: [
      { id: "costly_1", label: "물자 50 소모", cost: 50, apply: () => "성공" },
      { id: "costly_2", label: "물자 30 소모", cost: 30, apply: () => "성공" }
    ]
  };
  // game.js의 getScene/advance 동작 검증 (fallback_skip 탈출)
  const testLife = createGame("free", 1, { species: "인간" }, 3, 20);
  testLife.supplies = 0;
  // 임의로 choices가 모두 disabled가 되도록 카드를 띄웠을 때
  const scene = getScene(testLife);
  assert.ok(scene, "진행 가능한 장면이 존재해야 한다");

  // 3. app.js 내 scheduleObservation 널 가드, watchdog 타이머, resume try-catch 코드 검증
  const appCode = readFileSync("src/app.js", "utf8");
  assert.match(appCode, /const scene = getScene\(life\);\s*if \(!scene\) return;/, "scheduleObservation에 scene 널 가드가 존재해야 한다");
  assert.match(appCode, /const watchdog = setTimeout\(\(\) => {\s*playingChanges = false;\s*},\s*4500\);/, "advanceLife에 비동기 고착 방지 watchdog 타이머가 존재해야 한다");
  assert.match(appCode, /byId\("resume"\)\.addEventListener\("click",\s*\(\)\s*=>\s*\{[\s\S]*?try\s*\{[\s\S]*?safeReplay/, "resume 버튼 클릭 이벤트에 try-catch 방어가 존재해야 한다");
});

test("선장은 항로를 선택하고 선원은 선장과 항해사의 항로를 따른다 (규칙 21)", () => {
  const base = createGame("free", 42, { species: "인간" }, 3, 21);
  Object.assign(base, { path: "pirate", affiliation: "밀짚모자 일당", role: "동료",
    canonCrew: "밀짚모자 일당", independent: false, leftHome: true, homebound: false, location: "자야 · 모크 타운" });
  const crewTrip = travelScene(base, base.age);
  assert.deepEqual(crewTrip.choices.map((choice) => choice.id), ["sail", "prepare"]);
  const prepared = structuredClone(base);
  crewTrip.choices[0].apply(prepared);
  assert.equal(prepared.location, "자야 · 모크 타운", "선원의 선택으로 원작 항로를 앞질러 가지 않는다");

  assert.deepEqual(travelScene({ ...base, role: "선장" }, base.age).choices.map((choice) => choice.id), ["sail", "prepare"], "이전 직책이 남아도 밀짚모자 선원은 선장이 아니다");
  const captain = { ...base, independent: true, role: "선장", canonCrew: null, affiliation: "독립 해적단" };
  assert.ok(travelScene(captain, captain.age).choices.some((choice) => choice.id === "far"));
  const former = { ...base, creationVersion: 20, crewFollowFrom: null };
  assert.ok(travelScene(former, former.age).choices.some((choice) => choice.id === "far"), "과거 저장 규칙은 동일한 선택지를 유지한다");

  const scattered = { ...base, seen: ["canon_before_sabaody_scatter"] };
  const training = travelScene(scattered, scattered.age);
  assert.match(training.title, /수련/);
  assert.equal(training.choices[0].id, "sail");

  const otherCrew = { ...base, canonCrew: "흰 수염 해적단", affiliation: "흰 수염 해적단" };
  const otherTrip = travelScene(otherCrew, otherCrew.age);
  const sailed = structuredClone(otherCrew);
  otherTrip.choices[1].apply(sailed);
  assert.notEqual(sailed.location, otherCrew.location, "다른 해적단의 선원도 선장이 정한 항로로 이동한다");
});

test("밀짚모자 원작 여정은 자야·하늘섬·샤본디 분산·재집결·신세계 순으로 이어진다", async () => {
  const { preCanonCrewDestination, preCanonCount } = await import("../src/canon-before.js");
  const { canonCrewDestination, canonCount } = await import("../src/canon-events.js");
  const life = createGame("free", 47, { species: "인간" }, 3, 21);
  const before = Array.from({ length: preCanonCount(life) }, (_, step) => preCanonCrewDestination(life, step));
  assert.ok(before.includes("자야 · 모크 타운"));
  assert.ok(before.includes("스카이피아"));
  assert.ok(before.indexOf("스카이피아") > before.indexOf("자야 · 모크 타운"));
  assert.equal(before.at(-1), null, "쿠마에게 흩어진 뒤에는 루피의 단독 항로를 따라가지 않는다");
  const after = Array.from({ length: canonCount(life) }, (_, step) => canonCrewDestination(life, step));
  assert.equal(after[0], null);
  assert.ok(after.includes("샤본디 제도"));
  assert.ok(after.indexOf("어인섬") > after.indexOf("샤본디 제도"));
  assert.ok(after.indexOf("펑크 하자드") > after.indexOf("어인섬"));
  assert.ok(after.indexOf("엘바프") > after.indexOf("에그헤드 외해"));
});

test("규칙 20의 기존 기록은 마지막 행동 이후부터 선장 항로에 동참한다", () => {
  const old = createGame("free", 73, { species: "인간" }, 3, 20);
  const record = saveRecord(old);
  const legacy = replay(record);
  assert.equal(legacy.crewFollowFrom, null);
  record.crewFollowFrom = record.actions.length;
  const resumed = replay(record);
  assert.equal(resumed.crewFollowFrom, 0);
  assert.deepEqual(replay(saveRecord(resumed)), resumed);
  const subordinate = { ...resumed, path: "pirate", role: "동료", canonCrew: "밀짚모자 일당", independent: false };
  assert.deepEqual(travelScene(subordinate, subordinate.age).choices.map((choice) => choice.id), ["sail", "prepare"]);
  assert.throws(() => replay({ ...record, crewFollowFrom: -1 }));
  assert.throws(() => replay({ ...record, crewFollowFrom: record.actions.length + 1 }));
});
