import axios from "axios";
import type {
  ApiError,
  CheckWordRequest,
  CheckWordResponse,
  Difficulty,
  GameSession,
} from "../types/api";

/** URL base de la API del juego Wordle */
const URL = "https://word-api-hmlg.vercel.app/api";

/**
 * Obtiene todas las dificultades disponibles
 *
 * @description
 * Consulta la API para obtener la lista completa de dificultades configuradas,
 * incluyendo información como ID, nombre, longitud de palabra y número de intentos.
 *
 * @returns Promise con array de dificultades disponibles
 * @throws Error si falla la conexión con la API
 */
export const fetchDifficulties = async (): Promise<Difficulty[]> => {
  const { data } = await axios.get(`${URL}/difficulties`);
  return data;
};

/**
 * Inicia una nueva sesión de juego
 *
 * @description
 * Crea una nueva sesión de juego para la dificultad especificada.
 * La API selecciona aleatoriamente una palabra según la dificultad elegida.
 *
 * @param difficultyId - ID único de la dificultad seleccionada
 * @returns Promise con los datos de la sesión iniciada
 * @throws Error si la dificultad no existe o falla la conexión
 *
 * @note Corrige automáticamente el typo "wordLenght" → "wordLength" de la API
 */
export const startGameSession = async (
  difficultyId: string
): Promise<GameSession> => {
  const { data } = await axios.get(`${URL}/difficulties/${difficultyId}`);
  return {
    ...data,
    wordLength: data.wordLenght, // Corrección del typo en la API
  };
};

/**
 * Valida una palabra contra la solución del juego
 *
 * @description
 * Envía una palabra para validación contra la palabra objetivo de la sesión.
 * Retorna el estado de cada letra: correcta, presente o ausente.
 *
 * @param sessionId - ID único de la sesión de juego activa
 * @param word - Palabra a validar (debe tener la longitud correcta)
 * @returns Promise con el resultado de cada letra
 *
 * @throws {ApiError} Errores específicos de la API:
 * - 400: Palabra no existe en el diccionario
 * - 404: Sesión no encontrada o expirada
 * - Otros: Error inesperado del servidor
 *
 * @throws {Error} Error de conexión si no se puede contactar la API
 */
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

/**
 * Convierte códigos de estado HTTP en mensajes de error comprensibles
 *
 * @description
 * Función interna que mapea los códigos de estado de la API a mensajes
 * de error específicos y comprensibles para el usuario.
 *
 * @param status - Código de estado HTTP de la respuesta de error
 * @returns Mensaje de error localizado y descriptivo
 *
 * @internal No debe ser llamada directamente desde otros módulos
 */
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
