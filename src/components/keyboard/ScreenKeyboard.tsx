import type { LetterStatus } from "../../types/Attempt";
import "./ScreenKeyboard.css";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
];

interface Props {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  letterStatuses?: Record<string, LetterStatus>;
}

const ScreenKeyboard = ({
  onKeyPress,
  disabled,
  letterStatuses = {},
}: Props) => {
  const handleClick = (key: string) => {
    if (!disabled) onKeyPress(key);
  };

  return (
    <div className="keyboard">
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key key-${letterStatuses[key] ?? ""}`}
              onClick={() => handleClick(key)}
            >
              {key === "DEL" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScreenKeyboard;
