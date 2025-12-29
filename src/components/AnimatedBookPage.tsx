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
    if (side === "right") {
      switch (animationState) {
        case "turning-forward":
          return "animate-page-turn-forward";
        case "turning-backward":
          return "animate-page-turn-backward-reverse";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div
      className={cn(
        "relative h-full",
        side === "right" && "perspective-1000",
        className
      )}
      style={{
        perspective: side === "right" ? "1500px" : undefined,
        transformStyle: "preserve-3d",
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
