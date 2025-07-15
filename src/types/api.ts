import type { LetterStatus } from "./Attempt";

export interface CheckWordRequest {
  sessionId: string;
  word: string;
}

export interface CheckWordResponse {
  letter: string;
  solution: LetterStatus;
}

export interface ApiError {
  status: number;
  message: string;
}

export interface Difficulty {
  id: string;
  name: string;
}

export interface GameSession {
  sessionId: string;
  difficulty: Difficulty;
  wordLength: number;
}

export type GameStatus = "playing" | "won" | "lost";
