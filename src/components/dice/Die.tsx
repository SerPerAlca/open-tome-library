import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DieProps {
  value: number;
  rolling: boolean;
  delay?: number;
}

const Die = ({ value, rolling, delay = 0 }: DieProps) => {
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Each face needs specific rotation to show the correct number
  const faceRotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90, y: 0 },
    5: { x: 0, y: 90 },
    6: { x: 180, y: 0 },
  };

  useEffect(() => {
    if (rolling) {
      // Start animation after delay
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
        
        // Calculate target rotation with extra spins for visual effect
        const targetFace = faceRotations[value];
        const extraSpinsX = (Math.floor(Math.random() * 3) + 4) * 360; // 4-6 full rotations
        const extraSpinsY = (Math.floor(Math.random() * 3) + 4) * 360;
        
        setCurrentRotation({
          x: targetFace.x + extraSpinsX,
          y: targetFace.y + extraSpinsY,
        });
      }, delay);

      return () => clearTimeout(startTimer);
    } else {
      // When not rolling, just show the face directly (for reset)
      setIsAnimating(false);
      const targetFace = faceRotations[value];
      // Normalize rotation to the base face angle
      setCurrentRotation({
        x: targetFace.x,
        y: targetFace.y,
      });
    }
  }, [rolling, value, delay]);

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

  const faceStyle = {
    background: "linear-gradient(145deg, #f5f0e1 0%, #e8dcc8 100%)",
    boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div
      className="relative w-20 h-20"
      style={{
        perspective: "300px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className="absolute w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`,
          transition: isAnimating ? "transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)" : "transform 0.3s ease-out",
        }}
      >
        {/* Face 1 - Front */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(1)}
        </div>

        {/* Face 6 - Back */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(180deg) translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(6)}
        </div>

        {/* Face 2 - Right */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(90deg) translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(2)}
        </div>

        {/* Face 5 - Left */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateY(-90deg) translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(5)}
        </div>

        {/* Face 3 - Top */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateX(90deg) translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(3)}
        </div>

        {/* Face 4 - Bottom */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{
            transform: "rotateX(-90deg) translateZ(40px)",
            ...faceStyle,
          }}
        >
          {renderDots(4)}
        </div>
      </div>
    </div>
  );
};

export default Die;
