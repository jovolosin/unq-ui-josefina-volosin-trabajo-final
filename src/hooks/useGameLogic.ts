import { useCallback, useState } from "react";
import { checkWord } from "../services/api";
import type { Attempt, LetterResult } from "../types/Attempt";
import type { ApiError } from "../types/api";

/**
 * Hook personalizado para manejar la lógica completa del juego Wordle
 *
 * @description
 * Este hook encapsula toda la lógica del juego, incluyendo:
 * - Gestión de intentos y letras
 * - Validación de palabras a través de la API
 * - Control del flujo del juego (victoria/derrota)
 * - Manejo de errores
 *
 * @param wordLength - Longitud de la palabra objetivo (depende de la dificultad)
 * @param maxAttempts - Número máximo de intentos permitidos (típicamente 6)
 * @param sessionId - ID único de la sesión del juego para la API
 * @param onGameEnd - Callback ejecutado cuando el juego termina (victoria o derrota)
 * @param onError - Callback para manejar errores (palabra inválida, problemas de API, etc.)
 *
 * @returns Objeto con el estado del juego y las operaciones disponibles
 */
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

  /**
   * Crea la estructura inicial de intentos vacíos
   *
   * @description
   * Genera un array de `maxAttempts` intentos, cada uno con `wordLength` letras vacías.
   * Cada letra tiene estado "empty" inicialmente.
   *
   * @returns Array de intentos inicializados con letras vacías
   */
  const createInitialAttempts = useCallback((): Attempt[] => {
    return Array.from({ length: maxAttempts }, () => ({
      letters: Array.from({ length: wordLength }, () => ({
        letter: "",
        status: "empty",
      })),
      submitted: false,
    }));
  }, [wordLength, maxAttempts]);

  /**
   * Inicializa/reinicia el juego
   *
   * @description
   * Resetea el estado del juego a su estado inicial:
   * - Crea intentos vacíos
   * - Resetea el índice actual a 0
   * - Limpia el estado de envío
   *
   * @usage Llamar al inicio del juego o al reiniciar
   */
  const initializeGame = useCallback(() => {
    const emptyAttempts = createInitialAttempts();
    setAttempts(emptyAttempts);
    setCurrentIndex(0);
  }, [createInitialAttempts]);

  /**
   * Actualiza las letras del intento actual
   *
   * @description
   * Función interna que actualiza el estado de un intento específico.
   * Mantiene la inmutabilidad del estado.
   *
   * @param letters - Array de letras con su estado actualizado
   *
   * @internal No debe ser llamada directamente desde componentes
   */
  function updateAttempt(letters: LetterResult[]) {
    const updated = [...attempts];
    updated[currentIndex] = { ...updated[currentIndex], letters };
    setAttempts(updated);
  }

  /**
   * Agrega una letra al intento actual
   *
   * @description
   * Busca la primera posición vacía en el intento actual y coloca la letra.
   * La letra se convierte automáticamente a mayúscula.
   *
   * @param letter - Letra a agregar (se convierte a mayúscula automáticamente)
   *
   * @constraints
   * - No funciona si el juego está enviando una palabra
   * - No funciona si se han agotado los intentos
   * - No funciona si el intento actual está completo
   */
  function addLetter(letter: string) {
    if (isSubmitting || currentIndex >= maxAttempts) return;

    const letters = [...attempts[currentIndex].letters];
    const index = letters.findIndex((l) => l.letter === "");
    if (index === -1) return;

    letters[index] = { letter: letter.toUpperCase(), status: "empty" };
    updateAttempt(letters);
  }

  /**
   * Elimina la última letra del intento actual
   *
   * @description
   * Busca la última letra ingresada (de derecha a izquierda) y la elimina,
   * dejando esa posición vacía.
   *
   * @constraints
   * - No funciona si el juego está enviando una palabra
   * - No funciona si se han agotado los intentos
   * - No funciona si el intento actual está vacío
   */
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

  /**
   * Envía la palabra actual para validación
   *
   * @description
   * Función asíncrona que:
   * 1. Valida que la palabra esté completa
   * 2. Envía la palabra a la API para verificación
   * 3. Actualiza el estado de las letras según la respuesta
   * 4. Determina si el juego terminó (victoria o derrota)
   * 5. Avanza al siguiente intento si el juego continúa
   *
   * @async
   * @throws {ApiError} Si la API devuelve un error (palabra inválida, problema de conexión, etc.)
   *
   * @constraints
   * - Solo funciona si el intento actual está completo
   * - No funciona si ya se está enviando una palabra
   * - No funciona si se han agotado los intentos
   *
   * @sideEffects
   * - Actualiza el estado `isSubmitting` durante la operación
   * - Puede llamar a `onGameEnd` si el juego termina
   * - Puede llamar a `onError` si hay errores
   */
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
      .toLowerCase(); //La api verifica en minuscula

    setIsSubmitting(true);

    try {
      const result = await checkWord(sessionId, word);

      // Actualiza letras con los resultados de la API
      const updatedLetters = result.map((r) => ({
        letter: r.letter.toUpperCase(),
        status: r.solution,
      }));

      // Marca el intento como enviado
      const updatedAttempts = [...attempts];
      updatedAttempts[currentIndex] = {
        letters: updatedLetters,
        submitted: true,
      };

      setAttempts(updatedAttempts);

      // Verifica si el jugador ganó
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
