import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import ActionButtons from "@/components/ActionButtons";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import { useHeroesAPI } from "@/hooks/useHeroesAPI";
import { toTitleCase } from "@/types/hero-api";

const SelectionComplete = () => {
  const navigate = useNavigate();
  const { gameState, getSelectedHeroCodes } = useGame();
  const { animationState, isAnimating, turnPageForward } = usePageAnimation();
  const { heroes } = useHeroesAPI();

  // Build assigned heroes from gameState and API data
  const assignedHeroes = useMemo(() => {
    if (!gameState || heroes.length === 0) return [];
    
    return gameState.players
      .filter(p => p.heroId)
      .map(player => {
        const hero = heroes.find(h => h.code === player.heroId);
        return {
          player,
          hero: hero ? { 
            name: toTitleCase(hero.name), 
            alias: hero.alias,
            code: hero.code 
          } : { name: player.heroId || 'Desconocido', alias: '', code: '' }
        };
      });
  }, [gameState, heroes]);

  // Redirect if no game state or selection not complete
  useEffect(() => {
    if (!gameState || !gameState.isSelectionComplete) {
      navigate("/configuracion");
    }
  }, [gameState, navigate]);

  const handleNextPage = async () => {
    if (isAnimating) return;

    await turnPageForward();
    navigate("/capitulo");
  };

  if (!gameState) {
    return null;
  }

  const actionButtons = [
    { id: "next", label: "Comenzar Aventura", icon: "▸", onClick: handleNextPage },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main book container */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left page - Party summary */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
          <AnimatedBookPage side="left" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-gold text-2xl mb-2">☙</div>
                <h2 className="font-display text-2xl md:text-3xl text-primary mb-2">
                  La Compañía de Héroes
                </h2>
                <div className="divider-ornament mx-auto max-w-xs" />
              </div>

              {/* Hero list */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4">
                  {assignedHeroes.map(({ player, hero }) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-4 p-3 bg-secondary/30 border border-gold/20 rounded-sm"
                    >
                      {/* Mini hero portrait */}
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-gold/40 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-b from-primary/20 to-secondary flex items-center justify-center">
                          <span className="font-display text-xl text-gold/60">
                            {hero.name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Player and hero info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-gold truncate">{player.name}</p>
                        <p className="font-body text-sm text-muted-foreground italic truncate">
                          {hero.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <div className="text-gold text-2xl">❧</div>
              </div>
            </div>
          </AnimatedBookPage>
        </div>

        {/* Right page - Adventure awaits message */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
          <AnimatedBookPage side="right" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              {/* Decorative frame */}
              <div className="ornament-border p-8 max-w-sm">
                <div className="text-gold text-4xl mb-6">⚔</div>

                <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
                  El Mundo de Eternum Aguarda
                </h1>

                <p className="font-body text-lg text-foreground/80 italic leading-relaxed mb-6">
                  Los héroes han sido elegidos. El destino de las tierras olvidadas
                  descansa ahora en vuestras manos. Que la fortuna os acompañe
                  en este viaje épico.
                </p>

                <div className="divider-ornament mx-auto max-w-xs mb-4" />

               {/*  <p className="font-body text-sm text-muted-foreground">
                  Pasad la página para comenzar el Capítulo I
                </p> */}
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

export default SelectionComplete;
