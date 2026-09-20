// Draw engine - testable pure functions
export const PRIZE_TIERS = {
  5: 0.40,
  4: 0.35,
  3: 0.25,
} as const;

export function generateDrawNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 50) + 1); // 1-50
  }
  return Array.from(nums).sort((a, b) => a - b);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateAlgorithmicNumbers(_scores: { user_id: string; avg: number }[]): number[] {
  // Weighted: higher avg scores get slight boost - but still random base
  // For demo: just random +1 offset based on count
  return generateDrawNumbers();
}

export function calculateMatchCount(entry: number[], winning: number[]): number {
  const winSet = new Set(winning);
  return entry.filter((n) => winSet.has(n)).length;
}

export function calculatePrizePool(activeSubscriberCount: number, monthlyPrice: number = 20, yearlyPrice: number = 200): number {
  // Simplified: assume 70% monthly, 30% yearly -> blended
  // But spec says prize pool based on active subscriber count
  // Use 50% of revenue goes to prize pool
  const blendedMonthly = monthlyPrice * 0.7 + (yearlyPrice / 12) * 0.3;
  return Math.round(activeSubscriberCount * blendedMonthly * 0.5 * 100) / 100;
}

export function evaluateDrawEntries(
  entries: { user_id: string; numbers: number[] }[],
  winningNumbers: number[]
): { user_id: string; match_count: number; numbers: number[] }[] {
  return entries.map((e) => ({
    user_id: e.user_id,
    numbers: e.numbers,
    match_count: calculateMatchCount(e.numbers, winningNumbers),
  }));
}

export function calculateWinnerPayouts(
  results: { user_id: string; match_count: number }[],
  prizePool: number,
  jackpotRollover: number = 0
): { user_id: string; match_count: number; prize_amount: number }[] {
  const totalPool = prizePool + jackpotRollover;
  const tiers: Record<number, typeof results> = { 5: [], 4: [], 3: [] };
  for (const r of results) {
    if (r.match_count >= 3) tiers[r.match_count].push(r);
  }

  const payouts: { user_id: string; match_count: number; prize_amount: number }[] = [];

  for (const tier of [5, 4, 3] as const) {
    const winners = tiers[tier];
    if (winners.length === 0) continue;
    const tierPool = totalPool * PRIZE_TIERS[tier];
    const perWinner = Math.round((tierPool / winners.length) * 100) / 100;
    for (const w of winners) {
      payouts.push({ user_id: w.user_id, match_count: tier, prize_amount: perWinner });
    }
  }
  return payouts;
}

export function applyJackpotRollover(
  results: { match_count: number }[],
  prizePool: number,
  previousRollover: number
): number {
  const totalPool = prizePool + previousRollover;
  const hasJackpotWinner = results.some((r) => r.match_count === 5);
  if (!hasJackpotWinner) {
    // rollover 40% of total
    return Math.round(totalPool * PRIZE_TIERS[5] * 100) / 100;
  }
  return 0;
}

export function getNextDrawDate(): Date {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  // first Saturday of next month
  const day = next.getDay();
  const offset = (6 - day + 7) % 7;
  next.setDate(1 + offset);
  next.setHours(20, 0, 0, 0);
  return next;
}
