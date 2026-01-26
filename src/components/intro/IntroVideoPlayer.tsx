import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface IntroVideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

const IntroVideoPlayer = ({ videoUrl, onComplete }: IntroVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log("[IntroVideo] Video ready, attempting playback...");
      setIsLoading(false);
      video.play().catch((error) => {
        console.warn("[IntroVideo] Autoplay failed:", error);
        // Still allow watching, user can interact
      });
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      const error = videoEl.error;
      console.error("[IntroVideo] Error:", error?.code, error?.message);
      setHasError(true);
      // Skip to game after 2 seconds on error
      setTimeout(() => {
        onComplete();
      }, 2000);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  const handleEnded = () => {
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        onEnded={handleEnded}
      />

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-6" />
          <p className="font-display text-xl text-gold animate-pulse">
            Cargando introducción...
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <p className="font-display text-xl text-muted-foreground">
            Iniciando juego...
          </p>
        </div>
      )}

      {/* Skip Button - Always visible when video is playing */}
      {!isLoading && !hasError && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-4 py-2 
                     text-foreground/50 hover:text-foreground/80
                     font-body text-sm tracking-wide
                     transition-colors duration-300"
        >
          Saltar Intro
        </button>
      )}
    </motion.div>
  );
};

export default IntroVideoPlayer;
