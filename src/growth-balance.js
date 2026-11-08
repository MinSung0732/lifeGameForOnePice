// A point in a specialized attribute should represent repeated training, not one lucky event.
// Rule 36 keeps fractional progress in replayed game state, not in the save-record format.
export const SPECIALIZATIONS = ["skill", "bond", "friendBond", "trust"];

export function growthEfficiency(score) {
  if (score >= 100) return 0;
  // Rule 35 already slowed growth by remaining potential. Keep that curve;
  // the first rule-36 audit showed replacing it with flat rates inflated maxed stats.
  const oldRate = Math.max(0.2, (100 - score) / 70);
  const specialization = score < 60 ? 1 : score < 80 ? 0.85
    : score < 90 ? 0.65 : score < 95 ? 0.4 : 0.3;
  return Math.round(oldRate * specialization * 10000) / 10000;
}

export function applyBalancedGrowth(before, after) {
  for (const key of SPECIALIZATIONS) {
    const gain = after[key] - before[key];
    if (gain <= 0) continue;
    const carried = before.growthCarry[key] || 0;
    // Two-decimal precision makes a save replay exactly deterministic.
    const earned = Math.round((gain * growthEfficiency(before[key]) + carried) * 100) / 100;
    const actual = Math.min(Math.max(0, 100 - before[key]), Math.floor(earned + 1e-9));
    after[key] = before[key] + actual;
    after.growthCarry[key] = after[key] >= 100 ? 0 : Math.round((earned - actual) * 100) / 100;
  }
}
