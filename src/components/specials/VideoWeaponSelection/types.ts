// Types for VideoWeaponSelection module

export interface Weapon {
  weaponId: number;
  name: string;
  description?: string;
  rarityCode?: string;
  rarityName?: string;
  rarityColor: string;
  imagePath: string;
  weaponType: string;
  physicalAttack: number;
  magicAttack?: number;
  weight: number;
  unlockLevel?: number;
  specialCondition?: string | null;
  // Legacy fields for backwards compatibility
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
