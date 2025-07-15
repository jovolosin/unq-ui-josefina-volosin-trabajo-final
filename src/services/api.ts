import axios from "axios";
import type {
  ApiError,
  CheckWordRequest,
  CheckWordResponse,
  Difficulty,
  GameSession,
} from "../types/api";

const URL = "https://word-api-hmlg.vercel.app/api";

export const fetchDifficulties = async (): Promise<Difficulty[]> => {
  const { data } = await axios.get(`${URL}/difficulties`);
  return data;
};

export const startGameSession = async (
  difficultyId: string
): Promise<GameSession> => {
  const { data } = await axios.get(`${URL}/difficulties/${difficultyId}`);
  return {
    ...data,
    wordLength: data.wordLenght,
  };
};

export const checkWord = async (
  sessionId: string,
  word: string
): Promise<CheckWordResponse[]> => {
  try {
    const response = await axios.post<CheckWordResponse[]>(`${URL}/checkWord`, {
      sessionId,
      word,
    } as CheckWordRequest);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: getErrorMessage(error.response.status),
      };
      throw apiError;
    }

    throw new Error("Error de conexión");
  }
};

const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "La palabra no existe en el diccionario";
    case 404:
      return "Sesión no encontrada";
    default:
      return "Error inesperado";
  }
};
