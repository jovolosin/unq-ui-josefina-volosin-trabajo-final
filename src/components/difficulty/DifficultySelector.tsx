import "./DifficultySelector.css";
import type { GameSession, Difficulty } from "../../types/api";
import { startGameSession } from "../../services/api";
import { useState } from "react";
import { translateDifficulties } from "../../utils/gameUtils";

interface Props {
  onStart: (session: GameSession) => void;
  difficulties: Difficulty[];
}

const DifficultySelector = ({ onStart, difficulties }: Props) => {
  const [error, setError] = useState("");

  const handleSelect = async (id: string) => {
    try {
      const session = await startGameSession(id);
      onStart(session);
    } catch {
      setError("No se pudo iniciar la partida");
    }
  };

  const diffs = translateDifficulties(difficulties);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <ul>
        {diffs.map((d) => (
          <li key={d.id}>
            <button onClick={() => handleSelect(d.id)}>{d.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DifficultySelector;
