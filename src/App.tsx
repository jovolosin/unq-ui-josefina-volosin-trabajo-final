import { useEffect, useState } from "react";
import "./App.css";
import type { Difficulty, GameSession, GameStatus } from "./types/api";
import DifficultySelector from "./components/difficulty/DifficultySelector";
import GameBoard from "./components/board/GameBoard";
import HowToPlayModal from "./components/modal/HowToPlayModal";
import Header from "./components/header/Header";
import { helpModalService } from "./services/helpModalService";
import { fetchDifficulties } from "./services/api";
import { GameResultModal } from "./components/modal/GameResultModal";

function App() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing" as const);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showHelp, setShowHelp] = useState(
    () => !helpModalService.hasSeenHelp()
  );
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loadingDiffs, setLoadingDiffs] = useState(true);

  useEffect(() => {
    fetchDifficulties()
      .then(setDifficulties)
      .catch(() => setErrorMessage("No se pudieron cargar las dificultades."))
      .finally(() => setLoadingDiffs(false));
  }, []);

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

  if (loadingDiffs) return <p className="loading">Cargando...</p>;

  return (
    <div className="app-container">
      <Header
        difficulty={session?.difficulty}
        allDifficulties={difficulties}
        onHelpClick={() => setShowHelp(true)}
        onBack={handleRestart}
      />
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!session ? (
        <div className="intro-screen">
          <h2>Elegí una dificultad para empezar a jugar</h2>
          <DifficultySelector
            difficulties={difficulties}
            onStart={setSession}
          />
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
            <GameResultModal
              gameStatus={gameStatus}
              onRestart={handleRestart}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;
