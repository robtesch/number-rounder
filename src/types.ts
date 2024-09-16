export interface Settings {
  timeLimit: number;
  roundingOptions: number[];
  showCountdown: boolean;
  showScore: boolean;
}

export interface CurrentQuestion {
  number: number;
  roundTo: number;
  roundToLabel: string;
}

export interface RoundingOption {
  label: string;
  value: number;
}

export interface GameResult {
  date: string;
  correctCount: number;
  questionCount: number;
  settings: Settings;
  duration: number;
}
