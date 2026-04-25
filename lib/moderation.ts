const banned = ["badword", "spam", "hate"];

export function moderate(text: string) {
  return {
    flagged: banned.some((w) => text.toLowerCase().includes(w)),
    reason: "profanity_check",
  };
}