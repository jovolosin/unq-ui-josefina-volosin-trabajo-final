import type { Difficulty } from "../../types/api";
import "./DifficultyBar.css";

interface Props {
  difficulties: Difficulty[];
  selected: string;
}

const DifficultyBar = ({ difficulties, selected }: Props) => {
  const selectedIndex = difficulties.findIndex((d) => d.id === selected);

  return (
    <div className="difficulty-bar">
      <span className="label">Dificultad</span>
      {difficulties.map((d, index) => (
        <div
          key={d.id}
          className={`difficulty-block ${
            index <= selectedIndex ? "active" : ""
          }`}
          title={d.name}
        ></div>
      ))}
    </div>
  );
};

export default DifficultyBar;
