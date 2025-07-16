import { useEffect, useMemo } from "react";
import { useKeyboardHandler } from "../../hooks/useKeyboardHandler";
import { useGameLogic } from "../../hooks/useGameLogic";
import { GameCell } from "./GameCell";
import "./GameBoard.css";
import ScreenKeyboard from "../keyboard/ScreenKeyboard";
import { getLetterStatuses } from "../../utils/gameUtils";

interface Props {
  wordLength: number;
  maxAttempts?: number;
  sessionId: string;
  onGameEnd?: (won: boolean) => void;
  onError?: (error: string) => void;
}

const GameBoard = ({
  wordLength,
  maxAttempts = 6,
  sessionId,
  onGameEnd,
  onError,
}: Props) => {
  const {
    attempts,
    currentIndex,
    addLetter,
    removeLetter,
    submitWord,
    initializeGame,
  } = useGameLogic(wordLength, maxAttempts, sessionId, onGameEnd, onError);

  const letterStatuses = useMemo(() => getLetterStatuses(attempts), [attempts]);

  useKeyboardHandler({
    onAddLetter: addLetter,
    onRemoveLetter: removeLetter,
    onSubmitWord: submitWord,
    disabled: currentIndex >= maxAttempts,
  });

  useEffect(() => {
    initializeGame();
  }, [wordLength, maxAttempts, initializeGame]);

  const handleKeyPress = (key: string) => {
    if (key === "DEL") {
      removeLetter();
    } else if (key === "ENTER") {
      submitWord();
    } else {
      addLetter(key);
    }
  };

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
