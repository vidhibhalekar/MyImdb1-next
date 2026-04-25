export function wilson(up: number, down: number) {
    const n = up + down;
    if (n === 0) return 0;
  
    const z = 1.96;
    const phat = up / n;
  
    return (
      (phat +
        (z * z) / (2 * n) -
        z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) /
      (1 + (z * z) / n)
    );
  }
  