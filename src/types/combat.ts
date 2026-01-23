// Types for combat system

export interface Skill {
  name: string;
  description: string;
  uses: number;
}

export interface EnemyStats {
  physicalAttack: number;
  magicAttack: number;
  evasion: number;
  mana: number;
  vitality: number;
  physicalDefense: number;
  magicDefense: number;
  movement: number;
}

export interface Enemy {
  id: number;
  name: string;
  description: string;
  isBoss: boolean;
  expPoints: number;
  imagePath: string;
  stats: EnemyStats;
  skills: Skill[];
}

export interface RewardStats {
  weight?: number | null;
  unlockLevel?: number | null;
  specialCondition?: string | null;
  physicalAttack?: number | null;
  magicAttack?: number | null;
  weaponType?: string | null;
  physicalDefense?: number | null;
  magicDefense?: number | null;
  armorType?: string | null;
}

export interface Reward {
  productId: number;
  productType: string;
  quantity: number;
  name: string;
  description: string;
  rarityCode: string | null;
  rarityName: string | null;
  rarityColor: string | null;
  imagePath: string;
  stats: RewardStats | null;
}

export interface CombatData {
  enemies: Enemy[];
  expPointsTotal: number;
  rewards: Reward[];
}

export type CombatPhase = "PHASE_ENEMIES" | "PHASE_REWARDS";
