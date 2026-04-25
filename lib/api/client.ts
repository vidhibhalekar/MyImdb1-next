import { recordFailure, recordSuccess, circuitOpen } from "./circuitBreaker";

export async function safeFetch(url: string) {
  if (circuitOpen()) {
    throw new Error("Circuit open - using fallback");
  }

  let retries = 0;

  while (retries < 3) {
    try {
      const res = await fetch(url, {
        headers: {
          "If-None-Match": "", // ETag support placeholder
        },
        cache: "force-cache",
      });

      if (!res.ok) throw new Error("Request failed");

      recordSuccess();
      return res.json();
    } catch (err) {
      retries++;
      recordFailure();

      const delay = Math.min(1000 * 2 ** retries + Math.random() * 200, 5000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error("Max retries reached");
}