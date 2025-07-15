import { type LetterResult } from "../../types/Attempt";
import "./GameCell.css";

interface GameCellProps {
  letter: string;
  status: LetterResult["status"];
  isActive?: boolean;
}

export const GameCell = ({
  letter,
  status,
  isActive = false,
}: GameCellProps) => {
  const cellClasses = [
    "game-cell",
    `game-cell--${status}`,
    isActive && letter && "game-cell--active",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cellClasses}>{letter}</div>;
};
