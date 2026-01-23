import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCombat } from "@/hooks/useCombat";
import CombatCard from "./CombatCard";
import LoadingCards from "./LoadingCards";
import { Scene } from "@/types/game-engine";
import { Trophy, Swords } from "lucide-react";

interface CombatSceneProps {
  scene: Scene;
  onContinue: () => void;
}

// Random backgrounds for combat
const COMBAT_BACKGROUNDS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", // Dungeon
  "linear-gradient(135deg, #2d3436 0%, #636e72 50%, #2d3436 100%)", // Castle
  "linear-gradient(135deg, #1e3c28 0%, #2d5016 50%, #1e3c28 100%)", // Forest
  "linear-gradient(135deg, #3d1308 0%, #5c1a0b 50%, #3d1308 100%)", // Volcano
  "linear-gradient(135deg, #1a1a2e 0%, #4a1942 50%, #1a1a2e 100%)", // Dark magic
];

const CombatScene = ({ scene, onContinue }: CombatSceneProps) => {
  const { combatData, phase, isLoading, error, finishCombat } = useCombat(scene.id);

  const randomBackground = useMemo(() => {
    return COMBAT_BACKGROUNDS[Math.floor(Math.random() * COMBAT_BACKGROUNDS.length)];
  }, []);

  const handleFinishCombat = useCallback(() => {
    finishCombat();
  }, [finishCombat]);

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{ background: randomBackground }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center gap-8">
          <h2 className="font-display text-3xl text-amber-200 animate-pulse">
            Preparando combate...
          </h2>
          <LoadingCards count={3} />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center">
          <p className="font-display text-2xl text-red-400">{error}</p>
          <button
            onClick={handleContinue}
            className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Combat content */}
      {!isLoading && !error && combatData && (
        <div className="w-full max-w-6xl flex flex-col items-center gap-8 animate-fade-in">
          {/* Phase: Enemies */}
          {phase === "PHASE_ENEMIES" && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-red-400" />
                <h1 className="font-display text-4xl text-amber-100 drop-shadow-lg">
                  ¡COMBATE!
                </h1>
                <Swords className="w-8 h-8 text-red-400 scale-x-[-1]" />
              </div>

              {/* Location */}
              {scene.sceneLocation && (
                <p className="font-body text-lg text-gray-300 italic">
                  {scene.sceneLocation}
                </p>
              )}

              {/* Enemy cards */}
              <div className="flex flex-wrap justify-center gap-6">
                {combatData.enemies.map((enemy) => (
                  <CombatCard key={enemy.id} data={enemy} type="enemy" />
                ))}
              </div>

              {/* Finish combat button */}
              <button
                onClick={handleFinishCombat}
                className={cn(
                  "mt-6 px-8 py-4 rounded-xl font-display text-xl",
                  "bg-gradient-to-r from-red-600 via-red-500 to-red-600",
                  "hover:from-red-500 hover:via-red-400 hover:to-red-500",
                  "text-white shadow-lg shadow-red-900/50",
                  "border-2 border-red-400",
                  "transform hover:scale-105 transition-all duration-300",
                  "animate-pulse"
                )}
              >
                ⚔️ FINALIZAR COMBATE ⚔️
              </button>
            </>
          )}

          {/* Phase: Rewards */}
          {phase === "PHASE_REWARDS" && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h1 className="font-display text-4xl text-amber-100 drop-shadow-lg">
                  ¡VICTORIA!
                </h1>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>

              {/* Total EXP */}
              <div className="bg-purple-900/50 border-2 border-purple-400 rounded-xl px-8 py-4">
                <p className="font-display text-2xl text-purple-200">
                  EXPERIENCIA OBTENIDA:{" "}
                  <span className="text-yellow-400 font-bold">
                    +{combatData.expPointsTotal} EXP
                  </span>
                </p>
              </div>

              {/* Reward cards */}
              {combatData.rewards.length > 0 && (
                <>
                  <h2 className="font-display text-2xl text-amber-200 mt-4">
                    Recompensas
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
                    {combatData.rewards.map((reward) => (
                      <CombatCard
                        key={`${reward.productType}-${reward.productId}`}
                        data={reward}
                        type="reward"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Continue button */}
              <button
                onClick={handleContinue}
                className={cn(
                  "mt-6 px-8 py-4 rounded-xl font-display text-xl",
                  "bg-gradient-to-r from-green-600 via-green-500 to-green-600",
                  "hover:from-green-500 hover:via-green-400 hover:to-green-500",
                  "text-white shadow-lg shadow-green-900/50",
                  "border-2 border-green-400",
                  "transform hover:scale-105 transition-all duration-300"
                )}
              >
                ▸ CONTINUAR ▸
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CombatScene;
