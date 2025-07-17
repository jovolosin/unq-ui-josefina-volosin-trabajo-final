import type { LetterStatus } from "./Attempt";

/* Estructura de datos para solicitar validación de palabra */
export interface CheckWordRequest {
  sessionId: string;
  word: string;
}

/* Respuesta de validación para cada letra */
export interface CheckWordResponse {
  letter: string;
  solution: LetterStatus;
}

/* Estructura estandarizada de errores de la API */
export interface ApiError {
  status: number;
  message: string;
}

/* Configuración de dificultad del juego */
export interface Difficulty {
  id: string;
  name: string;
}

/* Sesión de juego inicializada */
export interface GameSession {
  sessionId: string;
  difficulty: Difficulty;
  wordLength: number;
}

/* Estados posibles del juego */
export type GameStatus = "playing" | "won" | "lost";
