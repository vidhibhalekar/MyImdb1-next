export function getChannel() {
  if (typeof window === "undefined") return null;

  if (!("BroadcastChannel" in window)) return null;

  return new BroadcastChannel("watchlist-sync");
}