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

/**
 * Componente principal de la aplicación.
 * Maneja el estado global del juego, la navegación entre pantallas y la coordinación de componentes.
 *
 * @component
 * @returns {JSX.Element} El componente raíz de la aplicación
 */
function App() {
  // ============================================================================
  // ESTADO DEL COMPONENTE
  // ============================================================================

  /**
   * Sesión activa del juego que contiene información sobre la partida en curso.
   * @type {GameSession | null}
   * @description null cuando no hay juego activo, GameSession cuando hay una partida en curso
   */
  const [session, setSession] = useState<GameSession | null>(null);

  /**
   * Estado actual del juego.
   * @type {GameStatus}
   * @description Puede ser "playing", "won", o "lost"
   */
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing" as const);

  /**
   * Mensaje de error actual para mostrar al usuario.
   * @type {string}
   * @description String vacío cuando no hay errores
   */
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Controla la visibilidad del modal de ayuda.
   * @type {boolean}
   * @description Se inicializa basado en si el usuario ya vio la ayuda previamente
   */
  const [showHelp, setShowHelp] = useState(
    () => !helpModalService.hasSeenHelp()
  );

  /**
   * Array con todas las dificultades disponibles del juego.
   * @type {Difficulty[]}
   * @description Se carga desde la API al montar el componente
   */
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  /**
   * Indica si se están cargando las dificultades desde la API.
   * @type {boolean}
   * @description true durante la carga inicial, false después
   */
  const [loadingDiffs, setLoadingDiffs] = useState(true);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Efecto para cargar las dificultades disponibles al montar el componente.
   * Maneja errores y actualiza el estado de carga.
   */
  useEffect(() => {
    fetchDifficulties()
      .then(setDifficulties)
      .catch(() => setErrorMessage("No se pudieron cargar las dificultades."))
      .finally(() => setLoadingDiffs(false));
  }, []);

  /**
   * Efecto para persistir que el usuario ya vio el modal de ayuda.
   * Se ejecuta cuando showHelp cambia a false.
   */
  useEffect(() => {
    if (!showHelp) {
      helpModalService.setSeen();
    }
  }, [showHelp]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Maneja el final del juego actualizando el estado correspondiente.
   * @param {boolean} won - true si el jugador ganó, false si perdió
   * @returns {void}
   */
  const handleGameEnd = (won: boolean): void => {
    setGameStatus(won ? "won" : "lost");
  };

  /**
   * Maneja errores mostrando un mensaje temporal al usuario.
   * @param {string} error - Mensaje de error a mostrar
   * @returns {void}
   */
  const handleError = (error: string): void => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  /**
   * Reinicia el juego limpiando la sesión y restableciendo el estado.
   * @returns {void}
   */
  const handleRestart = (): void => {
    setSession(null);
    setGameStatus("playing");
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  /**
   * Muestra pantalla de carga mientras se obtienen las dificultades.
   */
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
