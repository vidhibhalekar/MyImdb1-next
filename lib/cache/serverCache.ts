const memoryCache = new Map<string, any>();

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  console.log("🔍 CACHE CHECK:", key);

  if (memoryCache.has(key)) {
    console.log("⚡ CACHE HIT:", key);
    return memoryCache.get(key);
  }

  console.log("⬇️ CACHE MISS (fetching):", key);

  const data = await fetcher();

  memoryCache.set(key, data);

  console.log("💾 CACHE STORED:", key);

  return data;
}