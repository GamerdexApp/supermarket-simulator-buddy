const editDistance = (a: string, b: string): number => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return row[b.length];
};

/** The known path a mistyped one most likely meant, or null when none is close. */
export const closestPath = (
  typed: string,
  known: string[],
  maxDistance = 3,
): string | null => {
  const normalized = typed.toLowerCase().replace(/\/+$/, "");
  let best: { path: string; distance: number } | null = null;
  for (const path of known) {
    const distance = editDistance(normalized, path);
    if (distance <= maxDistance && (!best || distance < best.distance)) {
      best = { path, distance };
    }
  }
  return best?.path ?? null;
};
