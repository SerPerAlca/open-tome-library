import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import { useHeroesAPI } from "@/hooks/useHeroesAPI";
import { formatHeroName, toTitleCase, DEFAULT_SKILL_TREE } from "@/types/hero-api";
import HeroImage from "@/components/hero/HeroImage";
import AttributesPopover from "@/components/hero/AttributesPopover";
import WeaponIcons from "@/components/hero/WeaponIcons";

const HeroSelection = () => {
  const navigate = useNavigate();
  const { gameState, getCurrentPlayer, selectHero, getSelectedHeroCodes } = useGame();
  const { animationState, isAnimating, turnPageForward, turnPageBackward } = usePageAnimation();
  const { heroes, isLoading, error } = useHeroesAPI();

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isSelectAnimating, setIsSelectAnimating] = useState(false);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const currentPlayer = getCurrentPlayer();

  // Get selected hero codes from game state
  const selectedHeroCodes = useMemo(() => {
    return new Set(getSelectedHeroCodes());
  }, [getSelectedHeroCodes]);

  // Check if current hero is already selected
  const currentHero = heroes[currentHeroIndex];
  const isHeroSelected = currentHero ? selectedHeroCodes.has(currentHero.code) : false;

  // Redirect if no game state
  useEffect(() => {
    if (!gameState) {
      navigate("/configuracion");
    }
  }, [gameState, navigate]);

  const handlePrevHero = useCallback(async () => {
    if (isAnimating || heroes.length === 0) return;

    await turnPageBackward();
    setCurrentHeroIndex((prev) =>
      prev === 0 ? heroes.length - 1 : prev - 1
    );
  }, [isAnimating, heroes.length, turnPageBackward]);

  const handleNextHero = useCallback(async () => {
    if (isAnimating || heroes.length === 0) return;

    await turnPageForward();
    setCurrentHeroIndex((prev) =>
      prev === heroes.length - 1 ? 0 : prev + 1
    );
  }, [isAnimating, heroes.length, turnPageForward]);

  // Find next available hero index (not selected)
  const findNextAvailableHeroIndex = useCallback((fromIndex: number): number => {
    const updatedSelectedCodes = new Set([...selectedHeroCodes, currentHero?.code]);
    
    for (let i = 1; i <= heroes.length; i++) {
      const nextIndex = (fromIndex + i) % heroes.length;
      const nextHero = heroes[nextIndex];
      if (nextHero && !updatedSelectedCodes.has(nextHero.code)) {
        return nextIndex;
      }
    }
    return fromIndex; // Fallback to current if all selected
  }, [heroes, selectedHeroCodes, currentHero?.code]);

  const handleSelectHero = useCallback(async () => {
    if (!currentHero || isHeroSelected || isSelectAnimating || isAnimating) return;

    // Trigger ripple animation
    setIsSelectAnimating(true);
    
    // Wait for ripple animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const isComplete = selectHero(currentHero.code);
    setIsSelectAnimating(false);

    if (isComplete) {
      navigate("/seleccion-completa");
    } else {
      // Not complete - animate to next available hero for next player
      const nextAvailableIndex = findNextAvailableHeroIndex(currentHeroIndex);
      
      await turnPageForward();
      setCurrentHeroIndex(nextAvailableIndex);
    }
  }, [
    currentHero, 
    isHeroSelected, 
    isSelectAnimating, 
    isAnimating,
    selectHero, 
    navigate, 
    findNextAvailableHeroIndex, 
    currentHeroIndex, 
    turnPageForward
  ]);

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
  const heroTitleName = toTitleCase(currentHero.name);

  // Get skill tree (use default if not provided)
  const skillTree = currentHero.skillTree && currentHero.skillTree.length > 0
    ? currentHero.skillTree
    : DEFAULT_SKILL_TREE;

  // Parse description with line breaks
  const descriptionParagraphs = currentHero.description.split(/\\n\\n|\n\n/).filter(p => p.trim());

  // Calculate remaining players
  const remainingPlayers = gameState.players.length - gameState.currentPlayerIndex;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Main book container - scales with viewport */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 max-h-[90vh] 2xl:max-h-[92vh]">
        {/* Left page - Hero image */}
        <div className="lg:w-[45%] 2xl:w-[42%] flex-shrink-0 min-h-0">
          <AnimatedBookPage side="left" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {/* Hero image - scales with viewport height */}
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="relative w-full max-w-md 2xl:max-w-2xl mx-auto aspect-[3/4] h-[65vh] 2xl:h-[75vh] flex-shrink-0">
                  {/* Golden frame container */}
                  <div className="absolute inset-0 border-4 2xl:border-[6px] border-gold/40 rounded-sm shadow-lg overflow-hidden bg-secondary/50 flex flex-col">
                    {/* Image area - takes remaining space above name plate */}
                    <div className="flex-1 relative overflow-hidden">
                      <HeroImage name={currentHero.name} className="absolute inset-0" />
                    </div>
                    
                    {/* Hero name plate - fixed at bottom inside frame */}
                    <div className="relative z-20 bg-background/95 border-t border-gold/50 px-3 2xl:px-4 py-2 2xl:py-3 text-center flex-shrink-0">
                      <span className="font-display text-lg 2xl:text-2xl text-gold block">{heroTitleName}</span>
                      <span className="font-body text-sm 2xl:text-base text-muted-foreground block italic">
                        {currentHero.alias}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero counter */}
              <div className="text-center py-1 2xl:py-2 flex-shrink-0">
                <span className="font-display text-sm 2xl:text-base text-muted-foreground">
                  — {currentHeroIndex + 1} de {heroes.length} —
                </span>
              </div>
            </div>
          </AnimatedBookPage>
        </div>

        {/* Right page - Hero description */}
        <div className="lg:w-[55%] 2xl:w-[58%] flex-1 min-h-0">
          <AnimatedBookPage side="right" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col overflow-hidden">
              {/* Current player indicator */}
              <div className="mb-3 2xl:mb-5 text-center">
                <div className="inline-block bg-gold/20 border border-gold/40 px-4 2xl:px-6 py-1.5 2xl:py-2 rounded-sm">
                  <span className="font-display text-lg 2xl:text-2xl text-gold">
                    Turno de {currentPlayer.name}
                  </span>
                </div>
              </div>

              {/* Hero info */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Decorative header */}
                <div className="text-center mb-2 2xl:mb-4">
                  <div className="text-gold text-xl 2xl:text-2xl mb-1">☙</div>
                  <h2 className="font-display text-2xl md:text-3xl 2xl:text-4xl text-primary mb-1">
                    {heroTitleName}
                  </h2>
                  <p className="font-body text-base 2xl:text-lg text-muted-foreground italic">
                    {currentHero.alias}
                  </p>
                  
                  {/* Weapon mastery icons */}
                  {currentHero.weaponsTypes && currentHero.weaponsTypes.length > 0 && (
                    <WeaponIcons weapons={currentHero.weaponsTypes} />
                  )}
                  
                  <div className="divider-ornament mx-auto max-w-xs 2xl:max-w-sm mt-2 2xl:mt-3" />
                </div>

                {/* Description with line breaks - contained within book */}
                <div className="flex-1 flex flex-col items-start justify-start px-4 2xl:px-8 overflow-hidden min-h-0">
                  <div className="overflow-y-auto h-full w-full">
                    {descriptionParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`font-body text-lg 2xl:text-xl leading-relaxed 2xl:leading-loose text-foreground/90 text-justify mb-3 2xl:mb-4 ${
                          index === 0
                            ? "first-letter:text-4xl 2xl:first-letter:text-5xl first-letter:font-display first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:leading-none"
                            : ""
                        }`}
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Players remaining info */}
                <div className="text-center py-1 2xl:py-2 text-muted-foreground font-body text-sm 2xl:text-base italic">
                  {remainingPlayers} jugador{remainingPlayers !== 1 ? 'es' : ''} por elegir
                </div>
              </div>

              {/* Decorative footer */}
              <div className="text-center py-1 2xl:py-2">
                <div className="text-gold text-xl 2xl:text-2xl">❧</div>
              </div>
            </div>
          </AnimatedBookPage>
        </div>
      </main>

      {/* Action buttons area - compact */}
      <footer className="py-2 2xl:py-4 px-4 2xl:px-8 bg-secondary/90 border-t-2 border-gold/30">
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {/* 1. Héroe Anterior */}
          <button
            onClick={handlePrevHero}
            className="btn-vintage rounded-sm flex items-center gap-2"
          >
            <span>◂</span>
            <span>Héroe Anterior</span>
          </button>

          {/* 2. Seleccionar - with glow animation */}
          <button
            ref={selectButtonRef}
            onClick={handleSelectHero}
            disabled={isHeroSelected || isSelectAnimating}
            className={`btn-vintage rounded-sm flex items-center gap-2 relative overflow-hidden ${
              isHeroSelected 
                ? 'opacity-50 cursor-not-allowed' 
                : 'btn-select-cta'
            } ${isSelectAnimating ? 'btn-ripple-active' : ''}`}
          >
            <span>{isHeroSelected ? '✗' : '✓'}</span>
            <span>{isHeroSelected ? 'Ya Seleccionado' : 'Seleccionar'}</span>
          </button>

          {/* 3. Atributos y Progreso */}
          <AttributesPopover stats={currentHero.baseStats} skillTree={skillTree}>
            <button className="btn-vintage rounded-sm flex items-center gap-2 bg-gradient-to-b from-burgundy to-spine border-gold/60">
              <span>◈</span>
              <span>Atributos y Progreso</span>
            </button>
          </AttributesPopover>

          {/* 4. Héroe Siguiente */}
          <button
            onClick={handleNextHero}
            className="btn-vintage rounded-sm flex items-center gap-2"
          >
            <span>▸</span>
            <span>Héroe Siguiente</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HeroSelection;
