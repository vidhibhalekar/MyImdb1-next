let failures = 0;
let lastFailTime = 0;

const THRESHOLD = 5;
const RESET_TIME = 30_000;

export function circuitOpen() {
  if (failures < THRESHOLD) return false;
  return Date.now() - lastFailTime < RESET_TIME;
}

export function recordSuccess() {
  failures = 0;
}

export function recordFailure() {
  failures++;
  lastFailTime = Date.now();
}