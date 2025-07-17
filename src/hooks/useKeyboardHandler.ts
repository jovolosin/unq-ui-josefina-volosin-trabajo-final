import { useEffect } from "react";

/** Props para el hook de manejo de teclado */
interface UseKeyboardHandlerProps {
  onAddLetter: (letter: string) => void;
  onRemoveLetter: () => void;
  onSubmitWord: () => void;
  disabled?: boolean;
}

/**
 * Hook para manejar entrada de teclado físico en el juego
 *
 * @description
 * Captura eventos de teclado globales y los convierte en acciones del juego.
 * Maneja letras (A-Z, Ñ), Backspace para borrar y Enter para enviar.
 * Previene el comportamiento por defecto del navegador.
 *
 * @param props - Configuración de callbacks y estado
 * @param props.onAddLetter - Callback para agregar letra (recibe letra en mayúscula)
 * @param props.onRemoveLetter - Callback para eliminar última letra
 * @param props.onSubmitWord - Callback para enviar palabra actual
 * @param props.disabled - Si true, ignora todos los eventos de teclado
 *
 * @sideEffects
 * - Agrega event listener global a window
 * - Previene comportamiento por defecto de teclas capturadas
 * - Limpia event listener al desmontarse
 *
 * @constraints
 * - Solo acepta letras A-Z y Ñ (español)
 * - Convierte automáticamente a mayúsculas
 * - Se desactiva completamente con disabled=true
 */
export const useKeyboardHandler = ({
  onAddLetter,
  onRemoveLetter,
  onSubmitWord,
  disabled = false,
}: UseKeyboardHandlerProps) => {
  useEffect(() => {
    if (disabled) return;

    /**
     * Maneja eventos de teclado y ejecuta acciones correspondientes
     * @param e - Evento de teclado capturado
     */
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
