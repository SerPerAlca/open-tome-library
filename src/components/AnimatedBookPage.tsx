import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { PageAnimationState } from "@/hooks/usePageAnimation";
import BookPage from "./BookPage";

interface AnimatedBookPageProps {
  children: ReactNode;
  side: "left" | "right";
  animationState: PageAnimationState;
  className?: string;
}

const AnimatedBookPage = ({
  children,
  side,
  animationState,
  className,
}: AnimatedBookPageProps) => {
  const getAnimationClasses = () => {
    // Right page animates for forward navigation
    if (side === "right" && animationState === "turning-forward") {
      return "animate-page-turn-forward";
    }
    // Left page animates for backward navigation
    if (side === "left" && animationState === "turning-backward") {
      return "animate-page-turn-backward-left";
    }
    return "";
  };

  // Both sides need perspective for their respective animations
  const needsPerspective = 
    (side === "right" && animationState === "turning-forward") ||
    (side === "left" && animationState === "turning-backward");

  return (
    <div
      className={cn(
        "relative h-full bg-paper",
        needsPerspective && "perspective-1000",
        className
      )}
      style={{
        perspective: needsPerspective ? "1500px" : undefined,
        transformStyle: "preserve-3d",
        backgroundColor: "hsl(42 45% 88%)", // --paper fallback
      }}
    >
      <div
        className={cn(
          "h-full transition-transform",
          getAnimationClasses()
        )}
        style={{
          transformOrigin: side === "right" ? "left center" : "right center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        <BookPage side={side} className="h-full">
          {children}
        </BookPage>
      </div>
    </div>
  );
};

export default AnimatedBookPage;
