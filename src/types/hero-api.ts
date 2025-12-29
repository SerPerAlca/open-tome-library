// Hero API Response Types
export interface SkillTreeNode {
  id: string;
  label: string;
  tooltip: string;
  x: number;
  y: number;
  connections: string[];
}

export interface BaseStats {
  physicalAttack: number;
  magicAttack: number;
  evasion: number;
  mana: number;
  vitality: number;
  physicalDefense: number;
  magicDefense: number;
  movement: number;
}

export interface HeroAPIResponse {
  code: string;
  name: string;
  alias: string;
  description: string;
  portraitImageUrl: string | null;
  specieDescription: string;
  baseStats: BaseStats;
  skillTree?: SkillTreeNode[];
}

// Default skill tree for testing when API doesn't provide one
export const DEFAULT_SKILL_TREE: SkillTreeNode[] = [
  { id: "1", label: "Inicio", tooltip: "Nodo inicial de rastreo", x: 50, y: 50, connections: ["2", "3"] },
  { id: "2", label: "Puntería", tooltip: "+1 Daño Físico", x: 150, y: 20, connections: [] },
  { id: "3", label: "Vínculo Animal", tooltip: "Desbloquea compañero lobo", x: 150, y: 80, connections: [] }
];

// Stat labels in Spanish
export const STAT_LABELS: Record<keyof BaseStats, string> = {
  physicalAttack: "Ataque Físico",
  magicAttack: "Ataque Mágico",
  evasion: "Evasión",
  mana: "Maná",
  vitality: "Vitalidad",
  physicalDefense: "Defensa Física",
  magicDefense: "Defensa Mágica",
  movement: "Movimiento"
};

// Stat icons
export const STAT_ICONS: Record<keyof BaseStats, string> = {
  physicalAttack: "⚔",
  magicAttack: "✦",
  evasion: "↯",
  mana: "◈",
  vitality: "♥",
  physicalDefense: "🛡",
  magicDefense: "✧",
  movement: "➤"
};

// Convert API hero to local hero format
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatHeroName = (name: string, alias: string): string => {
  return `${toTitleCase(name)}, ${alias}`;
};
