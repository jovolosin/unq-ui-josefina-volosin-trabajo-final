/* Clave única para identificar el estado en localStorage */
const KEY = "seenHowToPlay";

/**
 * Servicio para gestionar el estado de visualización de instrucciones
 *
 * @description
 * Maneja la persistencia del estado de si el usuario ya vio las instrucciones
 * del juego. Utiliza localStorage para mantener esta información entre sesiones,
 * mejorando la experiencia de usuario al evitar mostrar instrucciones repetidas.
 */
export const helpModalService = {
  /**
   * Verifica si el usuario ya vio las instrucciones
   *
   * @returns true si el usuario ya vio las instrucciones, false en caso contrario
   */
  hasSeenHelp(): boolean {
    return localStorage.getItem(KEY) === "true";
  },

  /**
   * Marca que el usuario ya vio las instrucciones
   *
   * @description
   * Persiste en localStorage que el usuario ya visualizó las instrucciones,
   * evitando que se muestren automáticamente en futuras visitas.
   *
   * @sideEffects
   * Modifica localStorage permanentemente hasta que el usuario limpie
   * los datos del navegador o se ejecute en modo incógnito.
   */
  setSeen(): void {
    localStorage.setItem(KEY, "true");
  },
};
