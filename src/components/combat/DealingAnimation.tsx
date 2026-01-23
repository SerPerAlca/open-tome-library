import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DealingAnimationProps {
  cardCount: number;
  onComplete: () => void;
  duration?: number;
}

const DealingAnimation = ({ cardCount, onComplete, duration = 3000 }: DealingAnimationProps) => {
  const [phase, setPhase] = useState<"orbiting" | "converging" | "done">("orbiting");

  useEffect(() => {
    // Start converging at 2/3 of the duration
    const convergeTimer = setTimeout(() => {
      setPhase("converging");
    }, duration * 0.66);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, duration);

    return () => {
      clearTimeout(convergeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (phase === "done") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      {Array.from({ length: cardCount }).map((_, i) => {
        const angle = (i / cardCount) * 360;
        const orbitRadius = 200;
        const animationDelay = i * 100;

        return (
          <div
            key={i}
            className={cn(
              "absolute w-72 h-[420px] rounded-xl",
              "bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900",
              "border-4 border-amber-600",
              "shadow-2xl shadow-amber-900/70",
              "transition-all ease-out",
              phase === "orbiting" && "animate-orbit-card",
              phase === "converging" && "animate-converge-card"
            )}
            style={{
              animationDelay: `${animationDelay}ms`,
              "--orbit-angle": `${angle}deg`,
              "--orbit-radius": `${orbitRadius}px`,
              "--final-x": `${(i - (cardCount - 1) / 2) * 320}px`,
            } as React.CSSProperties}
          >
            {/* Card back decorative pattern */}
            <div className="w-full h-full rounded-lg p-4">
              <div className="w-full h-full border-4 border-amber-500/40 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-950/50 to-amber-900/50">
                <div className="relative">
                  {/* Outer ring */}
                  <div className="w-24 h-24 border-4 border-amber-500/50 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="absolute w-20 h-20 border-2 border-amber-400/30 rounded-full" />
                  </div>
                  {/* Inner glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-amber-500/40 rounded-full animate-pulse blur-sm" />
                  </div>
                  {/* Center symbol */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-400/60 text-3xl font-display">⚔</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealingAnimation;
