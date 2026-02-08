import { ComponentType } from "react";
import { Scene } from "@/types/game-engine";
import VideoWeaponSelection from "./VideoWeaponSelection";
import GameOverScene from "./GameOverScene";
import CombatScene from "@/components/combat/CombatScene";
import BoardGameView from "./BoardGameView";

// Props interface for special scene components
export interface SpecialSceneProps {
  scene: Scene;
  onComplete?: () => void;
}

// Props interface for board game scenes (has additional onGameOver prop)
export interface BoardGameSceneProps extends SpecialSceneProps {
  onGameOver?: () => void;
}

// Props interface for combat scene (has different prop name)
export interface CombatSceneProps {
  scene: Scene;
  onContinue?: () => void;
}

// Registry for resource-based special scenes (SPEC type)
export const RESOURCE_REGISTRY: Record<string, ComponentType<SpecialSceneProps>> = {
  VIDEO_WEAPON_SELECTION: VideoWeaponSelection,
  // Future resources can be added here:
  // PUZZLE_RUNES: RunePuzzle,
};

// Scene type constants
export const SCENE_TYPES = {
  END: "END",
  FIGHT: "FGHT",
  SPECIAL: "SPEC",
  TABLE: "TABL",
  MAIN: "MAIN",
} as const;

// System scene ID for game over
export const GAME_OVER_SCENE_ID = 9999;

// Determine which special view to render based on scene properties
export function getSpecialSceneView(
  scene: Scene | null,
  handlers: {
    onCombatContinue: () => void;
    onSpecialComplete: () => void;
    onGameOver: () => void;
  }
): React.ReactNode | null {
  if (!scene) return null;

  // Priority 1: System scenes (END or game over ID)
  if (scene.sceneType === SCENE_TYPES.END || scene.id === GAME_OVER_SCENE_ID) {
    return <GameOverScene scene={scene} />;
  }

  // Priority 2: Combat scenes
  if (scene.sceneType === SCENE_TYPES.FIGHT) {
    return <CombatScene scene={scene} onContinue={handlers.onCombatContinue} />;
  }

  // Priority 3: Board game / table scenes
  if (scene.sceneType === SCENE_TYPES.TABLE) {
    return (
      <BoardGameView 
        scene={scene} 
        onComplete={handlers.onSpecialComplete}
        onGameOver={handlers.onGameOver}
      />
    );
  }

  // Priority 4: Resource-based special scenes
  if (scene.sceneType === SCENE_TYPES.SPECIAL && scene.resource) {
    const SpecialComponent = RESOURCE_REGISTRY[scene.resource];
    if (SpecialComponent) {
      return <SpecialComponent scene={scene} onComplete={handlers.onSpecialComplete} />;
    }
  }

  // No special view needed - render default book layout
  return null;
}
