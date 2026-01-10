import { useState, useCallback, useEffect } from "react";
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

  const rollDice = useCallback(() => {
    if (rolling) return;

    setRolling(true);
    setCanClose(false);

    // Generate random values
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;

    // After animation completes, show final values
    setTimeout(() => {
      setDice([die1, die2]);
      setRolling(false);
      setCanClose(true);
      console.log(`Resultado: [${die1}, ${die2}] - Total: ${die1 + die2}`);
    }, 1500);
  }, [rolling]);

  // Auto-roll when overlay opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let overlay appear first
      const timer = setTimeout(() => {
        rollDice();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Reset state when closed
      setCanClose(false);
      setRolling(false);
    }
  }, [isOpen, rollDice]);

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

        {/* Result display */}
        <div
          className={cn(
            "text-center transition-opacity duration-500",
            rolling ? "opacity-0" : "opacity-100"
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
