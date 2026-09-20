export function validateScore(score: number, playedOn: string, existingDates: string[]): string | null {
  if (!playedOn) return "Date is required";
  const d = new Date(playedOn);
  if (isNaN(d.getTime())) return "Invalid date";
  if (d > new Date()) return "Date cannot be in the future";
  if (!Number.isFinite(score)) return "Score is required";
  if (score < 1) return "Score must be at least 1";
  if (score > 45) return "Score must be at most 45";
  if (existingDates.includes(playedOn)) return "A score for this date already exists. Edit it instead.";
  return null;
}

export function sortScoresNewest<T extends { played_on: string }>(scores: T[]): T[] {
  return [...scores].sort((a, b) => new Date(b.played_on).getTime() - new Date(a.played_on).getTime());
}

export function getOldestScoreId<T extends { id: string; played_on: string }>(scores: T[]): string | null {
  if (!scores.length) return null;
  const sorted = sortScoresNewest(scores);
  return sorted[sorted.length - 1].id;
}
