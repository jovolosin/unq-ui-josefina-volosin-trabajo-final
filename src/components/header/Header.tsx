import { FiHelpCircle } from "react-icons/fi";
import "./Header.css";

interface Props {
  difficulty?: string;
  onHelpClick: () => void;
}

const Header = ({ difficulty, onHelpClick }: Props) => {
  return (
    <header className="app-header">
      <div className="header-side left">
        {difficulty && (
          <span className="difficulty-pill">Dificultad: {difficulty}</span>
        )}
      </div>

      <div className="header-center">
        <h1 className="title">Wordle</h1>
      </div>

      <div className="header-side right">
        <button className="help-btn" onClick={onHelpClick} title="Cómo jugar">
          <FiHelpCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
