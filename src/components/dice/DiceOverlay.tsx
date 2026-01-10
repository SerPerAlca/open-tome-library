import { useState, useCallback, useEffect, useRef } from "react";
import Die from "./Die";
import { cn } from "@/lib/utils";

interface DiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiceOverlay = ({ isOpen, onClose }: DiceOverlayProps) => {
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const hasRolledRef = useRef(false);

  const rollDice = useCallback(() => {
    if (rolling) return;

    setRolling(true);
    setCanClose(false);
    setShowResult(false);

    // Generate random values immediately
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    
    // Set dice values immediately so animation targets correct faces
    setDice([die1, die2]);

    // Animation duration is 2s, then wait 1s more for dramatic pause
    // Total: 3 seconds before showing result text
    setTimeout(() => {
      setRolling(false);
      setShowResult(true);
      setCanClose(true);
      console.log(`Resultado: [${die1}, ${die2}] - Total: ${die1 + die2}`);
    }, 3000); // 2s animation + 1s pause
  }, [rolling]);

  // Auto-roll ONCE when overlay opens
  useEffect(() => {
    if (isOpen && !hasRolledRef.current) {
      hasRolledRef.current = true;
      // Small delay to let overlay appear first
      const timer = setTimeout(() => {
        rollDice();
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Reset ref when overlay closes
    if (!isOpen) {
      hasRolledRef.current = false;
      setCanClose(false);
      setRolling(false);
      setShowResult(false);
    }
  }, [isOpen]); // Remove rollDice from dependencies

  const handleBackdropClick = () => {
    if (canClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const total = dice[0] + dice[1];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-black/60 backdrop-blur-sm",
        "animate-in fade-in duration-300"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className="flex flex-col items-center gap-8 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dice container */}
        <div className="flex items-center gap-8">
          <Die value={dice[0]} rolling={rolling} delay={0} />
          <Die value={dice[1]} rolling={rolling} delay={100} />
        </div>

        {/* Result display - appears 1s after dice stop */}
        <div
          className={cn(
            "text-center transition-opacity duration-500",
            showResult ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="font-display text-2xl text-amber-100 drop-shadow-lg">
            {dice[0]} + {dice[1]} = <span className="text-gold text-3xl font-bold">{total}</span>
          </p>
          {canClose && (
            <p className="font-body text-sm text-amber-200/70 mt-4 animate-pulse">
              Haz clic para cerrar
            </p>
          )}
        </div>

        {/* Roll again button */}
        {canClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              rollDice();
            }}
            className="btn-vintage px-6 py-2 text-sm"
          >
            🎲 Lanzar de nuevo
          </button>
        )}
      </div>
    </div>
  );
};

export default DiceOverlay;
