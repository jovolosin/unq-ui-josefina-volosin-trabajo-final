import type { Difficulty } from "../types/api";
import type { Attempt, LetterStatus } from "../types/Attempt";

export const getLetterStatuses = (
  attempts: Attempt[]
): Record<string, LetterStatus> => {
  const statusMap: Record<string, LetterStatus> = {};

  for (const attempt of attempts) {
    for (const { letter, status } of attempt.letters) {
      const upper = letter.toUpperCase();

      if (
        !statusMap[upper] ||
        status === "correct" ||
        (status === "elsewhere" && statusMap[upper] === "absent")
      ) {
        statusMap[upper] = status;
      }
    }
  }

  return statusMap;
};

export const translateDifficulties = (
  difficulties: Difficulty[]
): Difficulty[] => {
  const translations: Record<string, string> = {
    Easy: "Fácil",
    Medium: "Intermedio",
    Hard: "Difícil",
    Expert: "Experto",
  };

  return difficulties.map((diff) => ({
    ...diff,
    name: translations[diff.name] ?? diff.name,
  }));
};
