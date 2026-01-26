import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./SplashScreen";
import IntroVideoPlayer from "./IntroVideoPlayer";
import Index from "@/pages/Index";

type GamePhase = "SPLASH" | "INTRO_VIDEO" | "GAME_START";

const INTRO_VIDEO_URL = "http://localhost:8082/static/video/intro-eternum.mp4";

const GameInitializer = () => {
  const [phase, setPhase] = useState<GamePhase>("SPLASH");

  const handleStartClick = useCallback(() => {
    setPhase("INTRO_VIDEO");
  }, []);

  const handleVideoComplete = useCallback(() => {
    setPhase("GAME_START");
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {phase === "SPLASH" && (
          <SplashScreen key="splash" onStart={handleStartClick} />
        )}

        {phase === "INTRO_VIDEO" && (
          <IntroVideoPlayer
            key="intro"
            videoUrl={INTRO_VIDEO_URL}
            onComplete={handleVideoComplete}
          />
        )}

        {phase === "GAME_START" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Index />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameInitializer;
