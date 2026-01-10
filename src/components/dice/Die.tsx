import { cn } from "@/lib/utils";

interface DieProps {
  value: number;
  rolling: boolean;
  delay?: number;
}

const Die = ({ value, rolling, delay = 0 }: DieProps) => {
  // Each face needs specific rotation to show the correct number
  const faceRotations: Record<number, string> = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(0deg) rotateY(-90deg)",
    3: "rotateX(-90deg) rotateY(0deg)",
    4: "rotateX(90deg) rotateY(0deg)",
    5: "rotateX(0deg) rotateY(90deg)",
    6: "rotateX(180deg) rotateY(0deg)",
  };

  // Dot patterns for each face
  const dotPatterns: Record<number, { top: string; left: string }[]> = {
    1: [{ top: "50%", left: "50%" }],
    2: [
      { top: "25%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    3: [
      { top: "25%", left: "25%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "75%" },
    ],
    4: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    5: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    6: [
      { top: "25%", left: "30%" },
      { top: "25%", left: "70%" },
      { top: "50%", left: "30%" },
      { top: "50%", left: "70%" },
      { top: "75%", left: "30%" },
      { top: "75%", left: "70%" },
    ],
  };

  const renderDots = (faceValue: number) => (
    <>
      {dotPatterns[faceValue].map((pos, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 rounded-full bg-burgundy shadow-inner"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );

  return (
    <div
      className="relative w-20 h-20"
      style={{
        perspective: "300px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className={cn(
          "absolute w-full h-full transition-transform",
          rolling ? "animate-dice-roll" : ""
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: rolling ? undefined : faceRotations[value],
          transitionDuration: rolling ? "0s" : "0.3s",
          animationDelay: rolling ? `${delay}ms` : undefined,
        }}
      >
        {/* Face 1 - Front */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(1)}
        </div>

        {/* Face 6 - Back */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(180deg) translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(6)}
        </div>

        {/* Face 2 - Right */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(90deg) translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(2)}
        </div>

        {/* Face 5 - Left */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(-90deg) translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(5)}
        </div>

        {/* Face 3 - Top */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateX(90deg) translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(3)}
        </div>

        {/* Face 4 - Bottom */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateX(-90deg) translateZ(40px)",
            background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
            boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderDots(4)}
        </div>
      </div>
    </div>
  );
};

export default Die;
