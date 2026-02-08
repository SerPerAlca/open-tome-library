import { useState, useEffect } from "react";
import { BoardGameData } from "@/types/board-game";
import { boardGamesLibrary } from "@/data/board-games";
import { SpecialSceneProps } from "../SceneRegistry";
import BoardGameHeader from "./BoardGameHeader";
import BoardGameSpecs from "./BoardGameSpecs";
import BoardGamePhases from "./BoardGamePhases";
import BoardGameConclusion from "./BoardGameConclusion";
import BoardGameActions from "./BoardGameActions";
import BoardGameExamples from "./BoardGameExamples";
import { Skeleton } from "@/components/ui/skeleton";

// Extended props to support game over navigation
interface BoardGameViewProps extends SpecialSceneProps {
  onGameOver?: () => void;
}

const BoardGameView = ({ scene, onComplete, onGameOver }: BoardGameViewProps) => {
  const [gameData, setGameData] = useState<BoardGameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load game data dynamically
  useEffect(() => {
    const loadGameData = async () => {
      if (!scene.resource) {
        setError("No se ha especificado un recurso de juego.");
        setIsLoading(false);
        return;
      }

      const loader = boardGamesLibrary[scene.resource];
      if (!loader) {
        setError(`Reglas no encontradas para: ${scene.resource}`);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const module = await loader();
        setGameData(module.default);
        setError(null);
      } catch (err) {
        console.error("Error loading board game data:", err);
        setError("Error al cargar las reglas del juego.");
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [scene.resource]);

  // Handle success - continue to next scene
  const handleSuccess = () => {
    onComplete?.();
  };

  // Handle failure - navigate to game over
  const handleGameOver = () => {
    onGameOver?.();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-[#F0E6D6] rounded-lg p-12 shadow-2xl border-8 border-double border-amber-700/60">
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 mx-auto bg-amber-200/50" />
            <Skeleton className="h-24 w-full bg-amber-200/50" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-16 w-32 bg-amber-200/50" />
              <Skeleton className="h-16 w-32 bg-amber-200/50" />
              <Skeleton className="h-16 w-32 bg-amber-200/50" />
            </div>
            <Skeleton className="h-40 w-full bg-amber-200/50" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-[#F0E6D6] rounded-lg p-12 shadow-2xl border-8 border-double border-amber-700/60 text-center">
          <h2 className="font-display text-2xl text-amber-900 mb-4">
            ⚠ Error
          </h2>
          <p className="font-body text-amber-800 italic mb-8">
            {error || "No se pudieron cargar las reglas del juego."}
          </p>
          <button
            onClick={handleSuccess}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-display"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
      <div 
        className="w-full max-w-4xl bg-[#F0E6D6] rounded-lg shadow-2xl overflow-hidden"
        style={{
          border: "8px double",
          borderColor: "rgba(180, 83, 9, 0.7)",
          boxShadow: "0 0 60px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(180, 83, 9, 0.1)"
        }}
      >
        <div className="p-8 md:p-12 space-y-8">
          {/* Header: Title, Type Badge & Context */}
          <BoardGameHeader title={gameData.title} context={gameData.context} type={gameData.type} />

          {/* Specs Grid */}
          <BoardGameSpecs specs={gameData.specs} />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
            <span className="text-amber-700 font-display text-lg">⚔</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
          </div>

          {/* Phases */}
          <BoardGamePhases phases={gameData.phases} />

          {/* Conclusion */}
          <BoardGameConclusion conclusion={gameData.conclusion} />

          {/* Examples Panel (Hover) */}
          {gameData.examples && gameData.examples.length > 0 && (
            <BoardGameExamples examples={gameData.examples} />
          )}

          {/* Action Buttons */}
          <BoardGameActions 
            onSuccess={handleSuccess} 
            onGameOver={handleGameOver} 
          />
        </div>
      </div>
    </div>
  );
};

export default BoardGameView;
