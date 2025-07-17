/**
 * Estados posibles de una letra en el juego
 * @description Representa el resultado de evaluar una letra contra la solución
 */
export type LetterStatus =
  | "correct" // Letra correcta en posición correcta
  | "elsewhere" // Letra correcta en posición incorrecta
  | "absent" // Letra no está en la palabra
  | "empty"; // Posición sin letra asignada

/**
 * Resultado de evaluación de una letra individual
 * @description Combina el carácter con su estado de validación
 */
export interface LetterResult {
  letter: string;
  status: LetterStatus;
}

/**
 * Intento completo del jugador
 * @description Representa una fila completa de letras con su estado de envío
 */
export interface Attempt {
  letters: LetterResult[];
  submitted: boolean;
  isValid?: boolean;
}
