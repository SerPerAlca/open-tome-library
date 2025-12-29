import { ChapterData, AdditionalContent } from "@/types/chapter";
import ClickableText from "./ClickableText";

interface ChapterContentProps {
  chapter: ChapterData;
  additionalContent: AdditionalContent[];
  onClickableTextClick: (endpoint: string) => void;
  isLoadingAdditional: boolean;
}

const ChapterContent = ({
  chapter,
  additionalContent,
  onClickableTextClick,
  isLoadingAdditional,
}: ChapterContentProps) => {
  const paragraphs = chapter.content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="h-full flex flex-col">
      <header className="text-center mb-6">
        <div className="divider-ornament mb-4">
          <span className="text-gold">✦</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-2">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="font-display text-lg text-burgundy italic">
            {chapter.subtitle}
          </p>
        )}
        <div className="divider-ornament mt-4">
          <span className="text-gold">✦</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="font-body text-base md:text-lg leading-relaxed text-ink space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "first-letter:text-5xl first-letter:font-display first-letter:text-burgundy first-letter:float-left first-letter:mr-2 first-letter:mt-1"
                  : ""
              }
            >
              {paragraph}
            </p>
          ))}

          {additionalContent.map((content, index) => (
            <div key={`additional-${index}`} className="mt-4 pt-4 border-t border-border/30">
              {content.text.split("\n\n").map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className={pIndex === 0 ? "text-muted-foreground italic text-sm" : "mt-4"}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {chapter.clickableText && (
            <div className="mt-6 text-center">
              <ClickableText
                label={chapter.clickableText.label}
                onClick={() => onClickableTextClick(chapter.clickableText!.endpoint)}
                isLoading={isLoadingAdditional}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;
