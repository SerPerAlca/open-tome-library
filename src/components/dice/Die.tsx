import { useEffect, useRef, useState } from "react";

interface DieProps {
  value: number;
  rolling: boolean;
  delay?: number;
}

const Die = ({ value, rolling, delay = 0 }: DieProps) => {
  // Track accumulated rotation to make spins continuous
  const accumulatedRotation = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");
  const [useTransition, setUseTransition] = useState(false);

  // Base rotations to show each face (matching the cube's HTML structure)
  // Face positions: 1=front, 6=back(Y180), 2=right(Y90), 5=left(Y-90), 3=top(X90), 4=bottom(X-90)
  // To SHOW a face, we rotate the cube in the OPPOSITE direction
  const faceRotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },       // Front face - no rotation needed
    2: { x: 0, y: -90 },     // Right face - rotate Y left
    3: { x: -90, y: 0 },     // Top face - rotate X down
    4: { x: 90, y: 0 },      // Bottom face - rotate X up
    5: { x: 0, y: 90 },      // Left face - rotate Y right
    6: { x: 0, y: 180 },     // Back face - rotate Y 180 (NOT X!)
  };

  useEffect(() => {
    if (rolling) {
      const timer = setTimeout(() => {
        // Enable transition for smooth animation
        setUseTransition(true);

        // Get target face rotation
        const target = faceRotations[value];
        
        // Add random full spins (5-8 rotations) to current accumulated position
        const spinsX = (Math.floor(Math.random() * 4) + 5) * 360;
        const spinsY = (Math.floor(Math.random() * 4) + 5) * 360;
        
        // Calculate new absolute rotation
        // Find the next valid rotation that lands on the target face
        const newX = accumulatedRotation.current.x + spinsX + target.x - (accumulatedRotation.current.x % 360);
        const newY = accumulatedRotation.current.y + spinsY + target.y - (accumulatedRotation.current.y % 360);
        
        // Update accumulated rotation
        accumulatedRotation.current = { x: newX, y: newY };
        
        // Apply the transform
        setTransform(`rotateX(${newX}deg) rotateY(${newY}deg)`);
      }, delay);

      return () => clearTimeout(timer);
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
          transform,
          transition: useTransition ? "transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
        }}
      >
        {/* Face 1 - Front */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "translateZ(40px)", ...faceStyle }}
        >
          {renderDots(1)}
        </div>

        {/* Face 6 - Back */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "rotateY(180deg) translateZ(40px)", ...faceStyle }}
        >
          {renderDots(6)}
        </div>

        {/* Face 2 - Right */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "rotateY(90deg) translateZ(40px)", ...faceStyle }}
        >
          {renderDots(2)}
        </div>

        {/* Face 5 - Left */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "rotateY(-90deg) translateZ(40px)", ...faceStyle }}
        >
          {renderDots(5)}
        </div>

        {/* Face 3 - Top */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "rotateX(90deg) translateZ(40px)", ...faceStyle }}
        >
          {renderDots(3)}
        </div>

        {/* Face 4 - Bottom */}
        <div
          className="absolute w-full h-full rounded-lg border-2 border-amber-800/30 shadow-lg"
          style={{ transform: "rotateX(-90deg) translateZ(40px)", ...faceStyle }}
        >
          {renderDots(4)}
        </div>
      </div>
    </div>
  );
};

export default Die;
