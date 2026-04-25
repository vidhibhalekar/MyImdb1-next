const map = new Map<string, number>();

export function checkRate(userId: string) {
  const last = map.get(userId) || 0;

  if (Date.now() - last < 1000) return false;

  map.set(userId, Date.now());
  return true;
}