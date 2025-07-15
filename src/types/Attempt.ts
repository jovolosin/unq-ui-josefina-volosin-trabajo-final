export type LetterStatus = "correct" | "elsewhere" | "absent" | "empty";

export interface LetterResult {
  letter: string;
  status: LetterStatus;
}

export interface Attempt {
  letters: LetterResult[];
  submitted: boolean;
  isValid?: boolean;
}
