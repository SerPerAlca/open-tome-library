import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import ActionButtons from "@/components/ActionButtons";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import { useHeroesAPI } from "@/hooks/useHeroesAPI";
import { formatHeroName, toTitleCase, DEFAULT_SKILL_TREE } from "@/types/hero-api";
import HeroImage from "@/components/hero/HeroImage";
import AttributesPopover from "@/components/hero/AttributesPopover";

const HeroSelection = () => {
  const navigate = useNavigate();
  const { gameState, getCurrentPlayer, selectHero } = useGame();
  const { animationState, isAnimating, turnPageForward, turnPageBackward } = usePageAnimation();
  const { heroes, isLoading, error } = useHeroesAPI();

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const currentPlayer = getCurrentPlayer();

  // Get selected hero codes from game state
  const selectedHeroCodes = useMemo(() => {
    if (!gameState) return new Set<string>();
    return new Set(
      gameState.players
        .filter(p => p.heroId)
        .map(p => p.heroId!)
    );
  }, [gameState]);

  // Filter available heroes (not yet selected)
  const availableHeroes = useMemo(() => {
    return heroes.filter(hero => !selectedHeroCodes.has(hero.code));
  }, [heroes, selectedHeroCodes]);

  const currentHero = availableHeroes[currentHeroIndex];

  // Redirect if no game state
  useEffect(() => {
    if (!gameState) {
      navigate("/configuracion");
    }
  }, [gameState, navigate]);

  // Reset hero index when available heroes change
  useEffect(() => {
    if (currentHeroIndex >= availableHeroes.length && availableHeroes.length > 0) {
      setCurrentHeroIndex(0);
    }
  }, [availableHeroes.length, currentHeroIndex]);

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

    const isComplete = selectHero(currentHero.code);

    if (isComplete) {
      navigate("/seleccion-completa");
    }
  }, [currentHero, selectHero, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-gold text-4xl mb-4 animate-pulse">☙</div>
          <p className="font-display text-xl text-primary">Cargando héroes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-6 paper-texture paper-aged rounded-sm border border-destructive/50">
          <div className="text-destructive text-4xl mb-4">⚠</div>
          <h2 className="font-display text-xl text-destructive mb-2">Error de Conexión</h2>
          <p className="font-body text-foreground/80 mb-4">{error}</p>
          <p className="font-body text-sm text-muted-foreground">
            Asegúrate de que la API está ejecutándose en http://localhost:8082
          </p>
        </div>
      </div>
    );
  }

  if (!gameState || !currentPlayer || !currentHero) {
    return null;
  }

  // Format the hero display name
  const heroDisplayName = formatHeroName(currentHero.name, currentHero.alias);
  const heroTitleName = toTitleCase(currentHero.name);

  // Get skill tree (use default if not provided)
  const skillTree = currentHero.skillTree && currentHero.skillTree.length > 0
    ? currentHero.skillTree
    : DEFAULT_SKILL_TREE;

  const actionButtons = [
    { id: "prev", label: "Héroe Anterior", icon: "◂", onClick: handlePrevHero },
    { id: "select", label: "Seleccionar", icon: "✓", onClick: handleSelectHero },
    { id: "next", label: "Héroe Siguiente", icon: "▸", onClick: handleNextHero },
  ];

  // Parse description with line breaks
  const descriptionParagraphs = currentHero.description.split(/\\n\\n|\n\n/).filter(p => p.trim());

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
                    <HeroImage name={currentHero.name} />
                  </div>

                  {/* Hero name plate */}
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 border border-gold/50 p-3 text-center">
                    <span className="font-display text-lg text-gold">{heroTitleName}</span>
                    <span className="font-body text-sm text-muted-foreground block italic">
                      {currentHero.alias}
                    </span>
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
                  <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">
                    {heroTitleName}
                  </h2>
                  <p className="font-body text-lg text-muted-foreground italic mb-2">
                    {currentHero.alias}
                  </p>
                  <div className="divider-ornament mx-auto max-w-xs" />
                </div>

                {/* Description with line breaks */}
                <div className="flex-1 flex flex-col items-start justify-start px-4 overflow-y-auto">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`font-body text-base leading-relaxed text-foreground/90 text-justify mb-4 ${
                        index === 0
                          ? "first-letter:text-4xl first-letter:font-display first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:leading-none"
                          : ""
                      }`}
                    >
                      {paragraph.trim()}
                    </p>
                  ))}
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
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {actionButtons.map((button) => (
            <button
              key={button.id}
              onClick={button.onClick}
              className="btn-vintage rounded-sm flex items-center gap-2"
            >
              {button.icon && <span>{button.icon}</span>}
              <span>{button.label}</span>
            </button>
          ))}
          
          {/* Attributes Popover Button */}
          <AttributesPopover stats={currentHero.baseStats} skillTree={skillTree}>
            <button className="btn-vintage rounded-sm flex items-center gap-2 bg-gradient-to-b from-burgundy to-spine border-gold/60">
              <span>◈</span>
              <span>Atributos y Progreso</span>
            </button>
          </AttributesPopover>
        </div>
      </footer>
    </div>
  );
};

export default HeroSelection;
