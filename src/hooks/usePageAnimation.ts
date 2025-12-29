import { useState, useCallback } from "react";

export type PageAnimationState = "idle" | "turning-forward" | "turning-backward";

interface UsePageAnimationReturn {
  animationState: PageAnimationState;
  isAnimating: boolean;
  turnPageForward: () => Promise<void>;
  turnPageBackward: () => Promise<void>;
}

const ANIMATION_DURATION = 600; // ms

export const usePageAnimation = (): UsePageAnimationReturn => {
  const [animationState, setAnimationState] = useState<PageAnimationState>("idle");

  const turnPageForward = useCallback(async (): Promise<void> => {
    if (animationState !== "idle") return;

    setAnimationState("turning-forward");

    return new Promise((resolve) => {
      setTimeout(() => {
        setAnimationState("idle");
        resolve();
      }, ANIMATION_DURATION);
    });
  }, [animationState]);

  const turnPageBackward = useCallback(async (): Promise<void> => {
    if (animationState !== "idle") return;

    setAnimationState("turning-backward");

    return new Promise((resolve) => {
      setTimeout(() => {
        setAnimationState("idle");
        resolve();
      }, ANIMATION_DURATION);
    });
  }, [animationState]);

  return {
    animationState,
    isAnimating: animationState !== "idle",
    turnPageForward,
    turnPageBackward,
  };
};
