export function createObservation(scene, now) {
  const duration = Math.max(10000, Math.min(22000, scene.body.length * 110));
  return { sceneId: scene.id, duration, elapsed: 0, lastTick: now, running: true };
}

export function tickObservation(clock, now, speed, running) {
  if (!Number.isFinite(now) || now < clock.lastTick || ![0.5, 0.75, 1, 2, 4].includes(speed)) {
    throw new Error("관찰 시간 설정이 잘못됐습니다.");
  }
  return {
    ...clock,
    elapsed: Math.min(clock.duration, clock.elapsed + (running && clock.running ? (now - clock.lastTick) * speed : 0)),
    lastTick: now,
    running
  };
}
