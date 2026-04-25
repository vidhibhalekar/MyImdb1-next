let watchlist: any[] = [];
let listeners: Function[] = [];

// ✅ CORE
export function getState() {
  return watchlist;
}

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

/* --------------------------------------------------
   ✅ ADD COMPATIBILITY LAYER (THIS FIXES YOUR ERRORS)
---------------------------------------------------*/

// OLD NAME SUPPORT (what your app is using)
export const getWatchlist = getState;

export const addItem = addToWatchlist;

export const removeItem = removeFromWatchlist;