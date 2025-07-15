import { useEffect, useState } from "react";
import { useKeyboardHandler } from "../../hooks/useKeyboardHandler";
import { useGameLogic } from "../../hooks/useGameLogic";
import { GameCell } from "./GameCell";
import "./GameBoard.css";

interface Props {
  wordLength: number;
  maxAttempts?: number;
  sessionId: string;
  onGameEnd?: (won: boolean, attempts: number) => void;
}

const GameBoard = ({
  wordLength,
  maxAttempts = 6,
  sessionId,
  onGameEnd,
}: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    // Borra el mensaje después de 3 segundos
    setTimeout(() => setError(null), 3000);
  };

  const {
    attempts,
    currentIndex,
    addLetter,
    removeLetter,
    submitWord,
    initializeGame,
  } = useGameLogic(wordLength, maxAttempts, sessionId, onGameEnd, handleError);

  useKeyboardHandler({
    onAddLetter: addLetter,
    onRemoveLetter: removeLetter,
    onSubmitWord: submitWord,
    disabled: currentIndex >= maxAttempts,
  });

  useEffect(() => {
    initializeGame();
  }, [wordLength, maxAttempts, initializeGame]);

  return (
    <div className="game-board">
      {error && <div className="error-message">{error}</div>}

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
    </div>
  );
};

export default GameBoard;
