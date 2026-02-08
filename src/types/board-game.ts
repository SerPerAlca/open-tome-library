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

export interface BoardGameData {
  id: string;
  title: string;
  context: string;
  specs: BoardGameSpec[];
  phases: BoardGamePhase[];
  conclusion: string;
}
