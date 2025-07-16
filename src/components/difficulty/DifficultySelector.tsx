import { useEffect, useState } from "react";
import { fetchDifficulties, startGameSession } from "../../services/api";
import "./DifficultySelector.css";

import type { GameSession, Difficulty } from "../../types/api";

interface Props {
  onStart: (session: GameSession) => void;
}

const DifficultySelector = ({ onStart }: Props) => {
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDifficulties();
  }, []);

  const loadDifficulties = async () => {
    try {
      const data = await fetchDifficulties();
      setDifficulties(data);
    } catch (err) {
      setError(
        "No se pudieron cargar las dificultades. Vuelva a intentar mas tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id: string) => {
    try {
      const session = await startGameSession(id);
      onStart(session);
    } catch {
      setError("No se pudo iniciar la partida");
    }
  };

  if (loading) return <p>Cargando dificultades...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ul>
        {difficulties.map((d) => (
          <li key={d.id}>
            <button onClick={() => handleSelect(d.id)}>{d.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DifficultySelector;
