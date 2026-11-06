import { ROUTES_V20, isNewWorld } from "./world.js";

// The chart is a route diagram, not a geographic projection. Follow the game's network only.
const ROUTE_ALIASES = { "위대한 항로 · 알라바스타 나노하나": "알라바스타 · 나노하나" };

export function routeChartFor(life) {
  const history = life.travelHistory?.length ? life.travelHistory : [life.birth?.home].filter(Boolean);
  const current = life.location || history.at(-1) || "알 수 없는 해역";
  const previous = [...history].reverse().find((place) => place && place !== current) || null;
  const key = ROUTE_ALIASES[current] || current;
  const connections = life.creationVersion >= 20
    ? [...new Set((ROUTES_V20[key] || []).map((route) => route.dest).filter((place) => place !== current))].slice(0, 3)
    : [];

  let zone = "unknown";
  if (current.includes("블루") || /^(해무 항구|돌등대 항구|물결목 항구|풍차언덕 암초|남십자 환초|서풍 암초|북극성 모래섬)/.test(current)) zone = "blue";
  else if (/샤본디|어인섬/.test(current)) zone = "crossing";
  else if (isNewWorld(current)) zone = "new";
  else if (ROUTES_V20[key] || /위대한 항로|스카이피아|자야|알라바스타/.test(current)) zone = "paradise";

  return { current, previous, connections, zone };
}
