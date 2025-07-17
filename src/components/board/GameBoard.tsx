import { useEffect, useMemo } from "react";
import { useKeyboardHandler } from "../../hooks/useKeyboardHandler";
import { useGameLogic } from "../../hooks/useGameLogic";
import { GameCell } from "./GameCell";
import "./GameBoard.css";
import ScreenKeyboard from "../keyboard/ScreenKeyboard";
import { getLetterStatuses } from "../../utils/gameUtils";
/**
 * Propiedades del componente GameBoard.
 * Define la configuración del tablero de juego y los callbacks para eventos.
 */
interface Props {
  wordLength: number;
  maxAttempts?: number;
  sessionId: string;
  onGameEnd?: (won: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Componente principal del tablero de juego Wordle.
 * Gestiona la interfaz de juego, incluyendo la grilla de letras y el teclado virtual.
 * Coordina la entrada del usuario, la lógica del juego y la visualización de resultados.
 *
 * @component
 * @param {Props} props - Propiedades del componente
 * @returns {JSX.Element} Tablero de juego con grilla y teclado
 */
const GameBoard = ({
  wordLength,
  maxAttempts = 6,
  sessionId,
  onGameEnd,
  onError,
}: Props) => {
  // ============================================================================
  // HOOKS Y ESTADO
  // ============================================================================

  /**
   * Hook personalizado que maneja toda la lógica del juego.
   * Proporciona estado de intentos, índice actual y funciones de manipulación.
   */
  const {
    attempts,
    currentIndex,
    addLetter,
    removeLetter,
    submitWord,
    initializeGame,
  } = useGameLogic(wordLength, maxAttempts, sessionId, onGameEnd, onError);

  /**
   * Calcula el estado de cada letra basado en todos los intentos realizados.
   * Se recalcula únicamente cuando cambian los intentos para optimizar rendimiento.
   *
   * @type {Record<string, LetterStatus>}
   * @description Mapa con el estado final de cada letra para el teclado virtual
   */
  const letterStatuses = useMemo(() => getLetterStatuses(attempts), [attempts]);

  /**
   * Hook personalizado que maneja eventos de teclado físico.
   * Conecta las teclas del teclado con las funciones de juego.
   */
  useKeyboardHandler({
    onAddLetter: addLetter,
    onRemoveLetter: removeLetter,
    onSubmitWord: submitWord,
    disabled: currentIndex >= maxAttempts,
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Inicializa el juego cuando cambian los parámetros principales.
   * Se ejecuta cuando wordLength, maxAttempts o initializeGame cambian.
   */
  useEffect(() => {
    initializeGame();
  }, [wordLength, maxAttempts, initializeGame]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Maneja las pulsaciones del teclado virtual.
   * Traduce las teclas especiales y delega a las funciones correspondientes.
   *
   * @param {string} key - Tecla presionada ("DEL", "ENTER", o letra)
   * @returns {void}
   */
  const handleKeyPress = (key: string): void => {
    if (key === "DEL") {
      removeLetter();
    } else if (key === "ENTER") {
      submitWord();
    } else {
      addLetter(key);
    }
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <div className="game-board">
      {attempts.map((attempt, rowIndex) => (
        <div key={rowIndex} className="game-row">
          {attempt.letters.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              letter={cell.letter}
              status={cell.status}
              isActive={rowIndex === currentIndex}
            />
          ))}
        </div>
      ))}

      <ScreenKeyboard
        onKeyPress={handleKeyPress}
        disabled={currentIndex >= maxAttempts}
        letterStatuses={letterStatuses}
      />
    </div>
  );
};

export default GameBoard;
