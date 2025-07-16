import { useEffect, useState } from "react";
import "./App.css";
import type { GameSession, GameStatus } from "./types/api";
import DifficultySelector from "./components/difficulty/DifficultySelector";
import GameBoard from "./components/board/GameBoard";
import HowToPlayModal from "./components/modal/HowToPlayModal";
import Header from "./components/header/Header";
import { helpModalService } from "./services/helpModalService";

function App() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing" as const);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showHelp, setShowHelp] = useState(
    () => !helpModalService.hasSeenHelp()
  );

  useEffect(() => {
    if (!showHelp) {
      helpModalService.setSeen();
    }
  }, [showHelp]);

  const handleGameEnd = (won: boolean) => {
    setGameStatus(won ? "won" : "lost");
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleRestart = () => {
    setSession(null);
    setGameStatus("playing");
  };

  return (
    <div className="app-container">
      <Header
        difficulty={session?.difficulty.name}
        onHelpClick={() => setShowHelp(true)}
      />
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!session ? (
        <div className="intro-screen">
          <h2>Elegí una dificultad para empezar a jugar</h2>
          <DifficultySelector onStart={setSession} />
        </div>
      ) : (
        <main className="game-content">
          <GameBoard
            wordLength={session.wordLength}
            sessionId={session.sessionId}
            onGameEnd={handleGameEnd}
            onError={handleError}
          />

          {gameStatus !== "playing" && (
            <div className="game-result">
              {gameStatus === "won" ? "¡Ganaste! 🎉" : "Perdiste 😢"}
              <button className="restart-btn" onClick={handleRestart}>
                Jugar otra vez
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
