import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import ActionButtons from "@/components/ActionButtons";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import { Hero } from "@/types/game";

const HeroSelection = () => {
  const navigate = useNavigate();
  const { gameState, getCurrentPlayer, getAvailableHeroes, selectHero } = useGame();
  const { animationState, isAnimating, turnPageForward, turnPageBackward } = usePageAnimation();

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const availableHeroes = getAvailableHeroes();
  const currentPlayer = getCurrentPlayer();

  // Redirect if no game state
  useEffect(() => {
    if (!gameState) {
      navigate("/configuracion");
    }
  }, [gameState, navigate]);

  // Reset hero index when available heroes change
  useEffect(() => {
    setCurrentHeroIndex(0);
  }, [availableHeroes.length]);

  const currentHero: Hero | undefined = availableHeroes[currentHeroIndex];

  const handlePrevHero = useCallback(async () => {
    if (isAnimating || availableHeroes.length === 0) return;

    await turnPageBackward();
    setCurrentHeroIndex((prev) =>
      prev === 0 ? availableHeroes.length - 1 : prev - 1
    );
  }, [isAnimating, availableHeroes.length, turnPageBackward]);

  const handleNextHero = useCallback(async () => {
    if (isAnimating || availableHeroes.length === 0) return;

    await turnPageForward();
    setCurrentHeroIndex((prev) =>
      prev === availableHeroes.length - 1 ? 0 : prev + 1
    );
  }, [isAnimating, availableHeroes.length, turnPageForward]);

  const handleSelectHero = useCallback(() => {
    if (!currentHero) return;

    const isComplete = selectHero(currentHero.id);

    if (isComplete) {
      navigate("/seleccion-completa");
    }
    // If not complete, component re-renders with next player
  }, [currentHero, selectHero, navigate]);

  if (!gameState || !currentPlayer || !currentHero) {
    return null;
  }

  const actionButtons = [
    { id: "prev", label: "Héroe Anterior", icon: "◂", onClick: handlePrevHero },
    { id: "select", label: "Seleccionar", icon: "✓", onClick: handleSelectHero },
    { id: "next", label: "Héroe Siguiente", icon: "▸", onClick: handleNextHero },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main book container */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left page - Hero image */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
          <AnimatedBookPage side="left" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {/* Hero image - full page */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-md mx-auto">
                  <div className="absolute inset-0 border-4 border-gold/40 rounded-sm shadow-lg overflow-hidden">
                    <img
                      src={currentHero.image}
                      alt={currentHero.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback gradient if image fails
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {/* Fallback display */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary flex items-center justify-center">
                      <span className="font-display text-6xl text-gold/60">
                        {currentHero.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Hero name plate */}
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 border border-gold/50 p-3 text-center">
                    <span className="font-display text-xl text-gold">{currentHero.name}</span>
                  </div>
                </div>
              </div>

              {/* Hero counter */}
              <div className="text-center pb-2">
                <span className="font-display text-sm text-muted-foreground">
                  — {currentHeroIndex + 1} de {availableHeroes.length} —
                </span>
              </div>
            </div>
          </AnimatedBookPage>
        </div>

        {/* Right page - Hero description */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
          <AnimatedBookPage side="right" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {/* Current player indicator */}
              <div className="mb-6 text-center">
                <div className="inline-block bg-gold/20 border border-gold/40 px-4 py-2 rounded-sm">
                  <span className="font-display text-lg text-gold">
                    Turno de {currentPlayer.name}
                  </span>
                </div>
              </div>

              {/* Hero info */}
              <div className="flex-1 flex flex-col">
                {/* Decorative header */}
                <div className="text-center mb-4">
                  <div className="text-gold text-2xl mb-2">☙</div>
                  <h2 className="font-display text-3xl md:text-4xl text-primary mb-2">
                    {currentHero.name}
                  </h2>
                  <div className="divider-ornament mx-auto max-w-xs" />
                </div>

                {/* Description */}
                <div className="flex-1 flex items-start justify-center px-4">
                  <p className="font-body text-lg leading-relaxed text-foreground/90 text-justify max-w-prose first-letter:text-4xl first-letter:font-display first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                    {currentHero.description}
                  </p>
                </div>

                {/* Players remaining info */}
                <div className="text-center mt-4 text-muted-foreground font-body text-sm italic">
                  {gameState.players.length - gameState.currentPlayerIndex} jugadores por elegir
                </div>
              </div>

              {/* Decorative footer */}
              <div className="text-center mt-4">
                <div className="text-gold text-2xl">❧</div>
              </div>
            </div>
          </AnimatedBookPage>
        </div>
      </main>

      {/* Action buttons area */}
      <footer className="py-4 px-6 bg-secondary/90 border-t-2 border-gold/30">
        <ActionButtons buttons={actionButtons} />
      </footer>
    </div>
  );
};

export default HeroSelection;
