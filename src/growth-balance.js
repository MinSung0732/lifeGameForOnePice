// A point in a specialized attribute should represent repeated training, not one lucky event.
// Rule 36 keeps fractional progress in replayed game state, not in the save-record format.
export const SPECIALIZATIONS = ["skill", "bond", "friendBond", "trust"];

export function growthEfficiency(score) {
  if (score < 60) return 1;
  if (score < 80) return 0.7;
  if (score < 90) return 0.4;
  if (score < 95) return 0.2;
  return score < 100 ? 0.1 : 0;
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
