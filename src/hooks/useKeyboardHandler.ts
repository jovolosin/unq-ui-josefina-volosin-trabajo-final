import { useEffect } from "react";

interface UseKeyboardHandlerProps {
  onAddLetter: (letter: string) => void;
  onRemoveLetter: () => void;
  onSubmitWord: () => void;
  disabled?: boolean;
}

export const useKeyboardHandler = ({
  onAddLetter,
  onRemoveLetter,
  onSubmitWord,
  disabled = false,
}: UseKeyboardHandlerProps) => {
  useEffect(() => {
    if (disabled) return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (key === "BACKSPACE") {
        e.preventDefault();
        onRemoveLetter();
      } else if (key === "ENTER") {
        e.preventDefault();
        onSubmitWord();
      } else if (/^[A-ZÑ]$/.test(key)) {
        e.preventDefault();
        onAddLetter(key);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onAddLetter, onRemoveLetter, onSubmitWord, disabled]);
};
