import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const INTRO_VIDEO_URL = "http://localhost:8082/static/video/intro-eternum.mp4";

const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setShowIntro(true);
  };

  const handleVideoEnd = () => {
    navigate("/configuracion");
  };

  const handleVideoError = () => {
    // If video fails to load, navigate immediately
    navigate("/configuracion");
  };

  const handleSkip = () => {
    navigate("/configuracion");
  };

  const handleCanPlay = () => {
    setIsVideoLoading(false);
    videoRef.current?.play().catch(() => {
      // If autoplay fails, user can still watch or skip
    });
  };

  const handleRules = () => {
    console.log("Reglas - por implementar");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - Medieval fantasy landscape */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cover-background.jpg')`,
          filter: "brightness(0.7)",
        }}
      />

      {/* Fallback gradient if image not loaded */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-secondary/60 to-background/90" />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 100%)",
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title frame */}
        <div className="text-center mb-12">
          {/* Decorative top ornament */}
          <div className="text-gold text-4xl mb-4 opacity-80">❧</div>

          {/* Main title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gold mb-4 drop-shadow-lg tracking-wide">
            Eternum
          </h1>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-gold/90 mb-6 drop-shadow-md tracking-widest">
            El Final de los Tiempos
          </h2>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-foreground/80 italic max-w-md mx-auto">
            Un viaje épico a través de tierras de sangre y magia
          </p>

          {/* Decorative bottom ornament */}
          <div className="text-gold text-4xl mt-4 opacity-80">❧</div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-6">
          {/* Main start button */}
          <button
            onClick={handleStart}
            className="btn-vintage px-12 py-4 text-xl md:text-2xl font-display tracking-wider
                       transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl"
          >
            ⚔ Empezar ⚔
          </button>
        </div>
      </div>

      {/* Footer with rules button */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 px-4 z-10">
        <div className="flex justify-center">
          <button
            onClick={handleRules}
            className="font-body text-foreground/60 hover:text-gold transition-colors duration-300
                       underline underline-offset-4 decoration-gold/40 hover:decoration-gold"
          >
            Reglas del Juego
          </button>
        </div>
      </footer>

      {/* Video Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={INTRO_VIDEO_URL}
              className="w-full h-full object-cover"
              playsInline
              preload="auto"
              onCanPlay={handleCanPlay}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
            />

            {/* Loading State */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-6" />
                <p className="font-display text-xl text-gold animate-pulse">
                  Cargando introducción...
                </p>
              </div>
            )}

            {/* Skip Button */}
            {!isVideoLoading && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
