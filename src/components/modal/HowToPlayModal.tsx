import "./HowToPlayModal.css";

interface Props {
  onClose: () => void;
}

const HowToPlayModal = ({ onClose }: Props) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cómo jugar</h2>
        <p>Tenés que adivinar la palabra secreta en 6 intentos.</p>
        <p>
          Cada intento debe ser una palabra válida en español. Después de
          enviarla, las letras se marcarán para darte pistas:
        </p>

        <div className="example-row">
          <div className="example-cell correct">V</div>
          <div className="example-cell">E</div>
          <div className="example-cell">N</div>
          <div className="example-cell">I</div>
          <div className="example-cell">R</div>
        </div>
        <p>
          <strong>Verde:</strong> la letra está en la posición correcta.
        </p>

        <div className="example-row">
          <div className="example-cell">P</div>
          <div className="example-cell elsewhere">A</div>
          <div className="example-cell">N</div>
          <div className="example-cell">E</div>
          <div className="example-cell">L</div>
        </div>
        <p>
          <strong>Amarillo:</strong> la letra está en la palabra pero en otra
          posición.
        </p>

        <div className="example-row">
          <div className="example-cell">C</div>
          <div className="example-cell">A</div>
          <div className="example-cell">S</div>
          <div className="example-cell absent">T</div>
          <div className="example-cell">A</div>
        </div>
        <p>
          <strong>Gris:</strong> la letra no está en la palabra.
        </p>

        <button className="modal-close-btn" onClick={onClose}>
          ¡A jugar!
        </button>
      </div>
    </div>
  );
};

export default HowToPlayModal;
