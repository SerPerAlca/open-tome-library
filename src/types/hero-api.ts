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
  { id: "1", label: "Inicio", tooltip: "Nodo inicial de rastreo", x: 100, y: 390, connections: ["2", "3"] },
  { id: "2", label: "+1 Ataque Físico", tooltip: "+1 Daño Físico", x: 50, y: 340, connections: ["5", "7"] },
  { id: "3", label: "+1 Evasión", tooltip: "+1 Evasión", x: 150, y: 340, connections: ["4", "7"] },
  { id: "4", label: "Llamada del Roble", tooltip: "Desbloquea compañero lobo", x: 180, y: 290, connections: ["8"] },
  { id: "5", label: "+1 Vitalidad", tooltip: "+1 Vitalidad", x: 20, y: 290, connections: ["6"] },
  { id: "6", label: "Doble Flecha", tooltip: "Dispara dos flechas", x: 10, y: 230, connections: ["9"] },
  { id: "7", label: "+1 Defensa", tooltip: "+1 Defensa", x: 100, y: 290, connections: ["9"] },
  { id: "8", label: "+1 Evasión", tooltip: "+1 Evasión", x: 190, y: 230, connections: ["9"] },
  { id: "9", label: "+1 Maná", tooltip: "+1 maná", x: 100, y: 230, connections: ["10"] },
  { id: "10", label: "Disparo Solar", tooltip: "Dispara al cielo cegando a los enemigos", x: 100, y: 170, connections: ["11"] },
  { id: "11", label: "+1 Defensa Mágica", tooltip: "+1 Defensa Mágica", x: 100, y: 110, connections: ["12"] },
  { id: "12", label: "+1 Maná", tooltip: "+1 Maná", x: 100, y: 50, connections: ["13"] },
  { id: "13", label: "Lluvia de Flechas", tooltip: "Dispara hasta 4 flechas a la vez", x: 100, y: -10, connections: [] },
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
