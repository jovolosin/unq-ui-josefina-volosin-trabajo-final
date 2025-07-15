import { useCallback, useState } from "react";
import { checkWord } from "../services/api";
import type { Attempt, LetterResult } from "../types/Attempt";
import type { ApiError } from "../types/api";

export function useGameLogic(
  wordLength: number,
  maxAttempts: number,
  sessionId: string,
  onGameEnd?: (won: boolean, totalTries: number) => void,
  onError?: (error: string) => void
) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Crea un array vacío de attempts. Cada intento tiene letras vacias con estado empty
  const createInitialAttempts = useCallback((): Attempt[] => {
    return Array.from({ length: maxAttempts }, () => ({
      letters: Array.from({ length: wordLength }, () => ({
        letter: "",
        status: "empty",
      })),
      submitted: false,
    }));
  }, [wordLength, maxAttempts]);

  const initializeGame = useCallback(() => {
    const emptyAttempts = createInitialAttempts();
    setAttempts(emptyAttempts);
    setCurrentIndex(0);
  }, [createInitialAttempts]);

  function updateAttempt(letters: LetterResult[]) {
    const updated = [...attempts];
    updated[currentIndex] = { ...updated[currentIndex], letters };
    setAttempts(updated);
  }

  function addLetter(letter: string) {
    if (isSubmitting || currentIndex >= maxAttempts) return;

    const letters = [...attempts[currentIndex].letters];
    const index = letters.findIndex((l) => l.letter === "");
    if (index === -1) return;

    letters[index] = { letter: letter.toUpperCase(), status: "empty" };
    updateAttempt(letters);
  }

  function removeLetter() {
    if (isSubmitting || currentIndex >= maxAttempts) return;

    const currentAttempt = attempts[currentIndex];
    if (!currentAttempt) return;

    const letters = [...currentAttempt.letters];

    const indexToClear = [...letters]
      .reverse()
      .findIndex((l) => l.letter !== "");

    if (indexToClear === -1) return;

    const actualIndex = wordLength - 1 - indexToClear;
    letters[actualIndex] = { letter: "", status: "empty" };

    updateAttempt(letters);
  }

  async function submitWord() {
    if (isSubmitting) return;
    if (currentIndex >= maxAttempts) return;

    const attempt = attempts[currentIndex];
    if (!attempt) {
      onError?.("No se encontró el intento actual.");
      return;
    }

    const hasEmptyLetters = attempt.letters.some((l) => l.letter === "");
    if (hasEmptyLetters) {
      onError?.("Completá todas las letras antes de enviar.");
      return;
    }

    const word = attempt.letters
      .map((l) => l.letter)
      .join("")
      .toLowerCase(); //la api verifica en minuscula

    setIsSubmitting(true);

    try {
      const result = await checkWord(sessionId, word);

      // Actualizar letras con los resultados de la API
      const updatedLetters = result.map((r) => ({
        letter: r.letter.toUpperCase(),
        status: r.solution,
      }));
      console.log(result);

      const updatedAttempts = [...attempts];
      updatedAttempts[currentIndex] = {
        letters: updatedLetters,
        submitted: true,
      };

      setAttempts(updatedAttempts);

      const won = updatedLetters.every((l) => l.status === "correct");
      const nextIndex = currentIndex + 1;
      const gameOver = won || nextIndex === maxAttempts;

      if (gameOver) {
        onGameEnd?.(won, nextIndex);
      } else {
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "message" in error
      ) {
        const apiError = error as ApiError;
        onError?.(apiError.message);
      } else {
        onError?.("Error al validar la palabra.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    attempts,
    currentIndex,
    addLetter,
    removeLetter,
    submitWord,
    initializeGame,
  };
}
