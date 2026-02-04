import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Scene } from "@/types/game-engine";

const VIDEO_URL = "http://localhost:8082/static/video/game_over.mp4";
const REDIRECT_TIMEOUT_MS = 10000;

interface GameOverSceneProps {
  scene: Scene;
}

const GameOverScene = ({ scene }: GameOverSceneProps) => {
  const navigate = useNavigate();
  const { resetGame } = useGame();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Handle redirect with cleanup
  const handleRedirect = () => {
    if (hasRedirected) return;
    setHasRedirected(true);
    
    // Reset game state before navigating
    resetGame();
    navigate("/");
  };

  useEffect(() => {
    // Set up fallback timeout (10 seconds)
    const timeoutId = setTimeout(() => {
      handleRedirect();
    }, REDIRECT_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle video end event (more precise than timeout)
  const handleVideoEnded = () => {
    handleRedirect();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
      />
      
      {/* Optional: Skip button for accessibility */}
      <button
        onClick={handleRedirect}
        className="absolute bottom-8 right-8 px-4 py-2 bg-black/50 border border-gold/30 text-gold font-display text-sm hover:bg-black/70 transition-colors rounded"
      >
        Saltar
      </button>
    </div>
  );
};

export default GameOverScene;
