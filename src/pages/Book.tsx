import { useState, useCallback } from "react";
import BookMenu from "@/components/BookMenu";
import ImageDisplay from "@/components/ImageDisplay";
import ActionButtons from "@/components/ActionButtons";
import AnimatedBookPage from "@/components/AnimatedBookPage";
import ChapterContent from "@/components/ChapterContent";
import { useChapter } from "@/hooks/useChapter";
import { usePageAnimation } from "@/hooks/usePageAnimation";
import manuscriptIllustration from "@/assets/manuscript-illustration.jpg";

const menuItems = [
  { id: "chapter-1", label: "Capítulo I: El Inicio", icon: "§" },
  { id: "chapter-2", label: "Capítulo II: El Viaje", icon: "§" },
  { id: "chapter-3", label: "Capítulo III: El Encuentro", icon: "§" },
  { id: "chapter-4", label: "Capítulo IV: El Desenlace", icon: "§" },
];

const Book = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching hook
  const {
    chapter,
    additionalContent,
    isLoading,
    isLoadingAdditional,
    loadChapter,
    loadAdditionalContent,
  } = useChapter("chapter-1");

  // Page animation hook
  const { animationState, isAnimating, turnPageForward, turnPageBackward } = usePageAnimation();

  const handleMenuSelect = useCallback((id: string) => {
    loadChapter(id);
  }, [loadChapter]);

  const handleClickableText = useCallback((endpoint: string) => {
    loadAdditionalContent(endpoint);
  }, [loadAdditionalContent]);

  const handleNextPage = useCallback(async () => {
    if (isAnimating) return;

    await turnPageForward();
    setCurrentPage((prev) => prev + 2);

    // TODO: Load next chapter content after animation
    // loadChapter(`chapter-${Math.ceil((currentPage + 2) / 2)}`);
  }, [isAnimating, turnPageForward]);

  const handlePrevPage = useCallback(async () => {
    if (isAnimating || currentPage <= 1) return;

    await turnPageBackward();
    setCurrentPage((prev) => Math.max(1, prev - 2));

    // TODO: Load previous chapter content after animation
  }, [isAnimating, currentPage, turnPageBackward]);

  const handleIndex = useCallback(() => {
    // TODO: Implement index navigation
    console.log("Navigate to index");
  }, []);

  const actionButtons = [
    { id: "prev", label: "Página Anterior", icon: "◂", onClick: handlePrevPage },
    { id: "index", label: "Índice General", icon: "☰", onClick: handleIndex },
    { id: "next", label: "Página Siguiente", icon: "▸", onClick: handleNextPage },
  ];

  // Use chapter image or fallback to default
  const currentImage = chapter?.image || {
    src: manuscriptIllustration,
    alt: "Ilustración medieval de un castillo",
    caption: "Lámina I: Vista del Castillo en la Colina",
  };

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
                ) : (
                  <ImageDisplay
                    src={currentImage.src}
                    alt={currentImage.alt}
                    caption={currentImage.caption}
                  />
                )}
              </div>

              {/* Page number */}
              <div className="text-center mt-4">
                <span className="font-display text-sm text-muted-foreground">— {currentPage} —</span>
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
                    Cargando capítulo...
                  </div>
                </div>
              ) : chapter ? (
                <ChapterContent
                  chapter={chapter}
                  additionalContent={additionalContent}
                  onClickableTextClick={handleClickableText}
                  isLoadingAdditional={isLoadingAdditional}
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
                <span className="font-display text-sm text-muted-foreground">— {currentPage + 1} —</span>
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
