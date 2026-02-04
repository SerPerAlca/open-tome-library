import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Scene } from "@/types/game-engine";
import { cn } from "@/lib/utils";

const VIDEO_URL = "http://localhost:8082/static/video/game_over.mp4";
const MESSAGE_DELAY_MS = 10000;

interface GameOverSceneProps {
  scene: Scene;
}

const GameOverScene = ({ scene }: GameOverSceneProps) => {
  const navigate = useNavigate();
  const { resetGame } = useGame();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showEndMessage, setShowEndMessage] = useState(false);

  useEffect(() => {
    // Show end message after 10 seconds
    const timeoutId = setTimeout(() => {
      setShowEndMessage(true);
      // Pause video when message appears
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, MESSAGE_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle video end - show message if not already shown
  const handleVideoEnded = () => {
    if (!showEndMessage) {
      setShowEndMessage(true);
    }
  };

  // Handle restart button click
  const handleRestart = () => {
    resetGame();
    navigate("/");
  };

  // Handle skip button - show message immediately
  const handleSkip = () => {
    setShowEndMessage(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        playsInline
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-1000",
          showEndMessage && "blur-sm brightness-50"
        )}
        onEnded={handleVideoEnded}
      />
      
      {/* End message card with fade-in animation */}
      {showEndMessage && (
        <div 
          className="relative z-10 animate-fade-in"
          style={{ animationDuration: "1.5s" }}
        >
          <div className="bg-[#F0E6D6] border-4 border-amber-800/60 rounded-lg shadow-2xl p-8 md:p-12 max-w-lg mx-4 text-center">
            {/* Decorative top border */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
            
            {/* Main message */}
            <h2 className="font-display text-2xl md:text-3xl text-amber-900 mb-6 leading-relaxed">
              Vuestra aventura en <span className="text-amber-700 font-bold">ETERNUM</span> ha terminado.
            </h2>
            
            <p className="font-display text-lg md:text-xl text-amber-800 mb-8">
              ¿Queréis volver a intentarlo?
            </p>
            
            {/* Restart button */}
            <button
              onClick={handleRestart}
              className="btn-vintage text-lg md:text-xl px-8 py-3 rounded-sm"
            >
              ⚔ Volver a empezar ⚔
            </button>
            
            {/* Decorative bottom border */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          </div>
        </div>
      )}
      
      {/* Skip button - only visible before message appears */}
      {!showEndMessage && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-4 py-2 bg-black/50 border border-gold/30 text-gold font-display text-sm hover:bg-black/70 transition-colors rounded"
        >
          Saltar
        </button>
      )}
    </div>
  );
};

export default GameOverScene;
