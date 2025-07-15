import { useState } from "react";
import DifficultySelector from "./components/difficulty/DifficultySelector";
import type { GameSession, GameStatus } from "./types/api";
import GameBoard from "./components/board/GameBoard";
import "./App.css";

function App() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing" as const);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleGameEnd = (won: boolean, attempts: number) => {
    setGameStatus(won ? "won" : "lost");
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  return (
    <div className="header">
      <h1>Wordle</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!session ? (
        <DifficultySelector onStart={setSession} />
      ) : (
        <>
          <span className="difficulty">
            Dificultad: {session.difficulty.name}
          </span>

          <GameBoard
            wordLength={session.wordLength}
            sessionId={session.sessionId}
            onGameEnd={handleGameEnd}
          />
        </>
      )}
    </div>
  );
}

export default App;
