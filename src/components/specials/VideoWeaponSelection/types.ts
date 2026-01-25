// Types for VideoWeaponSelection module

export interface Weapon {
  weaponId: number;
  name: string;
  rarityColor: string;
  imagePath: string;
  weaponType: string;
  physicalAttack: number;
  weight: number;
  magicalAttack?: number;
  physicalDefense?: number;
  magicalDefense?: number;
  speed?: number;
  range?: number;
}

export interface PlayerSelection {
  playerName: string;
  weaponId: number | null;
}

export type SelectionPhase = "loading" | "selection" | "video" | "narrative";
