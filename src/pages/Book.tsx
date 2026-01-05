import { useCallback } from "react";
import BookMenu from "@/components/BookMenu";
import ImageDisplay from "@/components/ImageDisplay";
import ActionButtons from "@/components/ActionButtons";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import SceneContent from "@/components/SceneContent";
import { useGameEngine } from "@/hooks/useGameEngine";
import { usePageAnimation } from "@/hooks/usePageAnimation";

const menuItems = [
  { id: "chapter-1", label: "Capítulo I: El Inicio", icon: "§" },
  { id: "chapter-2", label: "Capítulo II: El Viaje", icon: "§" },
  { id: "chapter-3", label: "Capítulo III: El Encuentro", icon: "§" },
  { id: "chapter-4", label: "Capítulo IV: El Desenlace", icon: "§" },
];

const Book = () => {
  // Game engine hook
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
  } = useGameEngine(1);

  // Page animation hook
  const { animationState, isAnimating, turnPageForward, turnPageBackward } = usePageAnimation();

  const handleMenuSelect = useCallback((id: string) => {
    // TODO: Implement chapter navigation via menu
    console.log("Menu selected:", id);
  }, []);

  const handleNextPage = useCallback(async () => {
    if (isAnimating || !canGoNext) return;

    await turnPageForward();
    goToNextScene();
  }, [isAnimating, canGoNext, turnPageForward, goToNextScene]);

  const handlePrevPage = useCallback(async () => {
    if (isAnimating) return;

    await turnPageBackward();
    // TODO: Implement previous scene navigation
  }, [isAnimating, turnPageBackward]);

  const handleIndex = useCallback(() => {
    // TODO: Implement index navigation
    console.log("Navigate to index");
  }, []);

  const actionButtons = [
    { id: "prev", label: "Página Anterior", icon: "◂", onClick: handlePrevPage },
    { id: "index", label: "Índice General", icon: "☰", onClick: handleIndex },
    { id: "next", label: "Página Siguiente", icon: "▸", onClick: handleNextPage, disabled: !canGoNext },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main book container */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left page */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
          <AnimatedBookPage side="left" animationState={animationState} className="h-full">
            <div className="h-full flex flex-col">
              {/* Menu - positioned discretely at the top */}
              <div className="mb-6">
                <BookMenu
                  items={menuItems}
                  onSelect={handleMenuSelect}
                />
              </div>

              {/* Main content - Image display */}
              <div className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <div className="font-body text-muted-foreground italic animate-pulse">
                    Cargando ilustración...
                  </div>
                ) : error ? (
                  <div className="font-body text-destructive italic">
                    {error}
                  </div>
                ) : currentImageUrl ? (
                  <ImageDisplay
                    src={currentImageUrl}
                    alt={`Escena ${currentScene?.id || ""}`}
                  />
                ) : (
                  <div className="font-body text-muted-foreground italic">
                    Sin ilustración disponible
                  </div>
                )}
              </div>

              {/* Page number */}
              <div className="text-center mt-4">
                <span className="font-display text-sm text-muted-foreground">
                  — {currentScene?.id || 1} —
                </span>
              </div>
            </div>
          </AnimatedBookPage>
        </div>

        {/* Right page */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0">
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
                  <div className="font-body text-destructive italic">
                    {error}
                  </div>
                </div>
              ) : currentScene ? (
                <SceneContent
                  scene={currentScene}
                  textParagraphs={accumulatedText}
                  choices={currentChoices}
                  onChoiceSelect={handleChoiceSelect}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="font-body text-muted-foreground italic">
                    Selecciona un capítulo para comenzar
                  </div>
                </div>
              )}

              {/* Page number */}
              <div className="text-center mt-4">
                <span className="font-display text-sm text-muted-foreground">
                  — {(currentScene?.id || 1) + 1} —
                </span>
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

export default Book;
