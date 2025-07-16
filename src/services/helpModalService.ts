const KEY = "seenHowToPlay";

export const helpModalService = {
  hasSeenHelp(): boolean {
    return localStorage.getItem(KEY) === "true";
  },
  setSeen(): void {
    localStorage.setItem(KEY, "true");
  },
};
