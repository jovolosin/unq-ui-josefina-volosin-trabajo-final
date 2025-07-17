import "./GameResultModal.css";
interface Props {
  gameStatus: "won" | "lost";
  onRestart: () => void;
}

export const GameResultModal = ({ gameStatus, onRestart }: Props) => {
  const message = gameStatus === "won" ? "¡Ganaste!" : "Perdiste";
  const subtitle =
    gameStatus === "won"
      ? "¡Excelente trabajo!"
      : "¡Mejor suerte la próxima vez!";

  return (
    <div className="modal-overlay">
      <div className="modal modal-result">
        <div className={`result-icon ${gameStatus}`}>
          {gameStatus === "won" ? "🏆" : "😔"}
        </div>
        <h2>{message}</h2>
        <p className="subtitle">{subtitle}</p>
        <button className="restart-btn" onClick={onRestart}>
          Jugar otra vez
        </button>
      </div>
    </div>
  );
};
