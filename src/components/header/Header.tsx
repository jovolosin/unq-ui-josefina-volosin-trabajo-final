import { FiArrowLeft, FiHelpCircle } from "react-icons/fi";
import "./Header.css";
import DifficultyBar from "./DifficultyBar";
import type { Difficulty } from "../../types/api";

interface Props {
  difficulty?: Difficulty;
  allDifficulties: Difficulty[];
  onHelpClick: () => void;
  onBack: () => void;
}
const Header = ({
  difficulty,
  allDifficulties,
  onHelpClick,
  onBack,
}: Props) => {
  return (
    <header className="app-header">
      <div className="header-side left">
        {difficulty && (
          <button
            className="btn"
            onClick={onBack}
            title="Volver a seleccionar dificultad"
          >
            <FiArrowLeft size={24} />
          </button>
        )}
        {difficulty && (
          <DifficultyBar
            difficulties={allDifficulties}
            selected={difficulty.id}
          />
        )}
      </div>

      <div className="header-center">
        <h1 className="title">Wordle</h1>
      </div>

      <div className="header-side right">
        <button className="btn" onClick={onHelpClick} title="Cómo jugar">
          <FiHelpCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
