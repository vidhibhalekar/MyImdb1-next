let watchlist: any[] = [];
let listeners: Function[] = [];

// ======================
// ✅ CORE STATE
// ======================
export function getState() {
  return watchlist;
}

// ✅ REQUIRED FIX (was missing)
export function setState(newState: any[]) {
  watchlist = Array.isArray(newState) ? [...newState] : [];
  emit();
}

// ======================
// ✅ ACTIONS
// ======================
export function addToWatchlist(movie: any) {
  if (!watchlist.find((m) => m.id === movie.id)) {
    watchlist.push(movie);
    emit();
  }
}

export function removeFromWatchlist(id: string) {
  watchlist = watchlist.filter((m) => m.id !== id);
  emit();
}

// ======================
// ✅ SUBSCRIPTION SYSTEM
// ======================
function emit() {
  listeners.forEach((l) => l(watchlist));
}

export function subscribe(cb: Function) {
  listeners.push(cb);
  cb(watchlist);

  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

// ======================
// ✅ COMPATIBILITY LAYER
// ======================
export const getWatchlist = getState;
export const addItem = addToWatchlist;
export const removeItem = removeFromWatchlist;