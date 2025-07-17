import type { Difficulty } from "../types/api";
import type { Attempt, LetterStatus } from "../types/Attempt";

/**
 * Módulo de utilidades para el procesamiento de datos del juego Wordle.
 */

/**
 * Calcula el estado final de cada letra basado en todos los intentos realizados, con el objetivo de
 * mostrar este estado en el teclado en pantalla de la aplicación.
 * Prioriza los estados más informativos: correct > elsewhere > absent.
 *
 * @param {Attempt[]} attempts - Array de intentos realizados por el jugador
 * @returns {Record<string, LetterStatus>} Mapa con el estado de cada letra (clave en mayúsculas)
 *
 * @description
 * - Las letras se normalizan a mayúsculas para consistencia
 * - Si una letra aparece con diferentes estados, se mantiene el más específico
 * - Jerarquía de prioridad: "correct" > "elsewhere" > "absent"
 */
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

/**
 * Traduce los nombres de dificultad del inglés al español.
 * Mantiene la estructura original del objeto pero con nombres localizados.
 *
 * @param {Difficulty[]} difficulties - Array de dificultades en inglés
 * @returns {Difficulty[]} Array de dificultades con nombres traducidos
 *
 * @description
 * - Preserva todas las propiedades del objeto original
 * - Solo modifica la propiedad 'name' con la traducción correspondiente
 * - Si no existe traducción, mantiene el nombre original
 */
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
