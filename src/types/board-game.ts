// Types for board game minigames

export interface BoardGameSpec {
  label: string;
  value: string;
  icon: string;
}

export interface BoardGamePhase {
  step: number;
  title: string;
  description: string;
  quote?: string;
  icon: string;
}

export interface BoardGameExample {
  case: string;
  result: string;
}

export interface BoardGameData {
  id: string;
  title: string;
  context: string;
  type?: string;
  specs: BoardGameSpec[];
  phases: BoardGamePhase[];
  examples?: BoardGameExample[];
  conclusion: string;
}
