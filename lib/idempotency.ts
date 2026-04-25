import { redis } from "./redis";

const PREFIX = "idem:";

// check
export async function checkIdempotency(key: string) {
  if (!key) return null;

  const data = await redis.get(PREFIX + key);
  return data ? JSON.parse(data) : null;
}

// save (FIXED)
export async function saveIdempotency(key: string, value: any) {
  if (!key) return;

  await redis.set(
    PREFIX + key,
    JSON.stringify(value),
    60 * 60 * 24 // 👈 TTL as NUMBER (NOT object)
  );
}