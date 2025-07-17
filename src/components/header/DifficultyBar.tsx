import type { Difficulty } from "../../types/api";
import "./DifficultyBar.css";

interface Props {
  difficulties: Difficulty[];
  selected: string;
}

const DifficultyBar = ({ difficulties, selected }: Props) => {
  return (
    <div className="difficulty-bar">
      <span className="label">Dificultad</span>
      {difficulties.map((d) => (
        <div
          key={d.id}
          className={`difficulty-block ${d.id === selected ? "active" : ""}`}
          title={d.name}
        ></div>
      ))}
    </div>
  );
};

export default DifficultyBar;
