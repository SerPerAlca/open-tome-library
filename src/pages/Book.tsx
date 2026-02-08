import { useCallback, useState } from "react";
import BookMenu from "@/components/BookMenu";
import ImageDisplay from "@/components/ImageDisplay";
import ActionButtons from "@/components/ActionButtons";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import SceneContent from "@/components/SceneContent";
import DiceOverlay from "@/components/dice/DiceOverlay";
import DevTools from "@/components/dev/DevTools";
import { useGameEngine } from "@/hooks/useGameEngine";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import { getSpecialSceneView } from "@/components/specials/SceneRegistry";

const menuItems = [
  { id: "chapter-1", label: "Capítulo I: El Inicio", icon: "§" },
  { id: "chapter-2", label: "Capítulo II: El Viaje", icon: "§" },
  { id: "chapter-3", label: "Capítulo III: El Encuentro", icon: "§" },
  { id: "chapter-4", label: "Capítulo IV: El Desenlace", icon: "§" },
];

const Book = () => {
  // ============================================
  // State & Hooks
  // ============================================
  const [showDice, setShowDice] = useState(false);

  const {
    currentScene,
    accumulatedText,
    currentChoices,
    isLoading,
    error,
    currentImageUrl,
    handleChoiceSelect,
    goToNextScene,
    canGoNext,
    jumpToScene,
    getNextScene,
    getSceneById,
    isSpecialSceneType,
    goToGameOver,
  } = useGameEngine(1);

  const { animationState, isAnimating, turnPageForward } = usePageAnimation();

  // ============================================
  // Navigation Handlers
  // ============================================
  const handleMenuSelect = useCallback((id: string) => {
    console.log("Menu selected:", id);
  }, []);

  // Smart navigation: only animate page turn for MAIN scenes
  const handleNextPage = useCallback(async () => {
    if (isAnimating || !canGoNext) return;
    
    const nextScene = getNextScene();
    
    // If next scene is a special type, skip page animation
    if (nextScene && isSpecialSceneType(nextScene.sceneType)) {
      goToNextScene();
      return;
    }
    
    // Standard MAIN scene: animate page turn
    await turnPageForward();
    goToNextScene();
  }, [isAnimating, canGoNext, turnPageForward, goToNextScene, getNextScene, isSpecialSceneType]);

  const handleCombatContinue = useCallback(() => {
    if (currentScene?.nextSceneId) {
      goToNextScene();
    }
  }, [currentScene, goToNextScene]);

  const handleSpecialSceneContinue = useCallback(() => {
    if (currentScene?.nextSceneId) {
      goToNextScene();
    }
  }, [currentScene, goToNextScene]);

  const handleGameOver = useCallback(() => {
    goToGameOver();
  }, [goToGameOver]);

  // ============================================
  // Action Handlers
  // ============================================
  const handleDiceRoll = useCallback(() => setShowDice(true), []);
  const handleIndex = useCallback(() => console.log("Navigate to index"), []);

  // ============================================
  // Scene View Resolution
  // ============================================
  const specialView = getSpecialSceneView(currentScene, {
    onCombatContinue: handleCombatContinue,
    onSpecialComplete: handleSpecialSceneContinue,
    onGameOver: handleGameOver,
  });

  // If there's a special view, render it with global overlays
  if (specialView) {
    return (
      <>
        {specialView}
        <DiceOverlay isOpen={showDice} onClose={() => setShowDice(false)} />
        <DevTools currentSceneId={currentScene?.id ?? null} onJumpToScene={jumpToScene} />
      </>
    );
  }

  // ============================================
  // Default Book Layout
  // ============================================
  const actionButtons = [
    { id: "dice", label: "Lanzar Dados", icon: "🎲", onClick: handleDiceRoll },
    { id: "index", label: "Índice General", icon: "☰", onClick: handleIndex },
    { id: "next", label: "Página Siguiente", icon: "▸", onClick: handleNextPage, disabled: !canGoNext },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <main className="flex-1 flex flex-col lg:flex-row bg-paper">
        {/* Left page */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0 bg-paper">
          <AnimatedBookPage side="left" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <BookMenu items={menuItems} onSelect={handleMenuSelect} />
              </div>

              <div className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <div className="font-body text-muted-foreground italic animate-pulse">
                    Cargando ilustración...
                  </div>
                ) : error ? (
                  <div className="font-body text-destructive italic">{error}</div>
                ) : currentImageUrl ? (
                  <ImageDisplay src={currentImageUrl} alt={`Escena ${currentScene?.id || ""}`} />
                ) : (
                  <div className="font-body text-muted-foreground italic">
                    Sin ilustración disponible
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <span className="font-display text-sm text-muted-foreground">
                  — {currentScene?.id || 1} —
                </span>
              </div>
            </div>
          </AnimatedBookPage>
        </div>

        {/* Right page */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0 bg-paper">
          <AnimatedBookPage side="right" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="font-body text-muted-foreground italic animate-pulse">
                    Cargando escena...
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="font-body text-destructive italic">{error}</div>
                </div>
              ) : currentScene ? (
              <SceneContent
                  scene={currentScene}
                  textParagraphs={accumulatedText}
                  choices={currentChoices}
                  onChoiceSelect={(choice) => {
                    // Smart choice handling: check if destination is special
                    const destinationScene = choice.obligatory 
                      ? getSceneById(choice.destinationSceneId)
                      : null;
                    
                    // For obligatory choices to special scenes, no animation needed
                    // The special scene component handles its own transition
                    handleChoiceSelect(choice);
                  }}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="font-body text-muted-foreground italic">
                    Selecciona un capítulo para comenzar
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <span className="font-display text-sm text-muted-foreground">
                  — {(currentScene?.id || 1) + 1} —
                </span>
              </div>
            </div>
          </AnimatedBookPage>
        </div>
      </main>

      <footer className="py-4 px-6 bg-secondary/90 border-t-2 border-gold/30">
        <ActionButtons buttons={actionButtons} />
      </footer>

      <DiceOverlay isOpen={showDice} onClose={() => setShowDice(false)} />
      <DevTools currentSceneId={currentScene?.id ?? null} onJumpToScene={jumpToScene} />
    </div>
  );
};

export default Book;
