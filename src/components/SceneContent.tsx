import { cn } from "@/lib/utils";
import { Choice, Scene } from "@/types/game-engine";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SceneContentProps {
  scene: Scene | null;
  textParagraphs: string[];
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  className?: string;
}

const SceneContent = ({
  scene,
  textParagraphs,
  choices,
  onChoiceSelect,
  className,
}: SceneContentProps) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Decorative Header */}
      {scene && (scene.chapterDescription || scene.sceneLocation) && (
        <header className="text-center mb-6">
          <div className="divider-ornament mb-4">
            <span className="text-gold">✦</span>
          </div>
          {scene.chapterDescription && (
            <h1 className="font-display text-2xl md:text-3xl text-ink mb-2">
              {scene.chapterDescription}
            </h1>
          )}
          {scene.sceneLocation && (
            <p className="font-display text-lg text-burgundy italic">
              {scene.sceneLocation}
            </p>
          )}
          <div className="divider-ornament mt-4">
            <span className="text-gold">✦</span>
          </div>
        </header>
      )}

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {/* Scene text paragraphs - increased font size */}
          {textParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "font-body text-lg md:text-xl text-foreground leading-relaxed",
                index === 0 && "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:text-gold first-letter:leading-none"
              )}
            >
              {paragraph}
            </p>
          ))}

          {/* Choices section */}
          {choices.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="font-display text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                ¿Qué deseas hacer?
              </p>
              <div className="space-y-2">
                {choices.map((choice) => (
                  <button
                    key={choice.choiceId}
                    onClick={() => onChoiceSelect(choice)}
                    className={cn(
                      "w-full text-left p-3 rounded-sm border transition-all duration-200",
                      "font-body text-sm",
                      "border-gold/30 bg-paper/50 hover:bg-gold/10 hover:border-gold/60",
                      "cursor-pointer"
                    )}
                  >
                    <span className="text-gold mr-2">▸</span>
                    {choice.choiceText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SceneContent;
