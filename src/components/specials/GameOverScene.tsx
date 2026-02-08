import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Scene } from "@/types/game-engine";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GameOverSceneProps {
  scene: Scene;
}

const GameOverScene = ({ scene }: GameOverSceneProps) => {
  const navigate = useNavigate();
  const { resetGame } = useGame();
  
  // Animation phases
  const [phase, setPhase] = useState<"fadeIn" | "showText" | "showCard">("fadeIn");

  useEffect(() => {
    // Phase 1: Fade to black (3 seconds)
    const textTimer = setTimeout(() => {
      setPhase("showText");
    }, 3000);

    // Phase 2: Show card after text appears (add 4 more seconds for text animation)
    const cardTimer = setTimeout(() => {
      setPhase("showCard");
    }, 7000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleRestart = () => {
    resetGame();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Fade to black background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 bg-black"
      />

      {/* Animated smoke/mist layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Smoke layer 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 4, delay: 1 }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 30%, rgba(180, 180, 180, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 70%, rgba(150, 150, 150, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 50% 100%, rgba(100, 100, 100, 0.2) 0%, transparent 70%)
            `,
          }}
        >
          <motion.div
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -15, 10, -5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full"
            style={{
              background: "inherit",
            }}
          />
        </motion.div>

        {/* Smoke layer 2 - slower, different pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 5, delay: 2 }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              x: [-20, 20, -10, 15, -20],
              y: [10, -10, 20, -15, 10],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 60% 40%, rgba(200, 200, 200, 0.2) 0%, transparent 55%),
                radial-gradient(ellipse 50% 60% at 30% 60%, rgba(170, 170, 170, 0.15) 0%, transparent 50%)
              `,
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{ 
              opacity: [0, 0.4, 0.2, 0],
              y: -100,
              x: `+=${(Math.random() - 0.5) * 200}`,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-1 h-1 rounded-full bg-gray-400/30"
            style={{
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Death text with smoke fade effect */}
      <AnimatePresence>
        {(phase === "showText" || phase === "showCard") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Main death text */}
            <motion.h1
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-gold tracking-widest"
              style={{
                textShadow: "0 0 40px rgba(212, 175, 55, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)",
              }}
            >
              Habéis Muerto.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(15px)" }}
              animate={{ opacity: 0.7, filter: "blur(0px)" }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              className="font-display text-xl md:text-2xl lg:text-3xl text-[#d4c4a8] mt-6 tracking-[0.3em]"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
              }}
            >
              FIN DEL JUEGO
            </motion.p>
          </div>
        )}
      </AnimatePresence>

      {/* Retry card */}
      <AnimatePresence>
        {phase === "showCard" && (
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-end justify-center pb-20 md:pb-32"
          >
            <div className="bg-[#F0E6D6] border-4 border-amber-800/60 rounded-lg shadow-2xl p-6 md:p-8 max-w-md mx-4 text-center relative">
              {/* Decorative top border */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
              
              <p className="font-display text-lg md:text-xl text-amber-800 mb-6">
                ¿Queréis volver a intentarlo?
              </p>
              
              <button
                onClick={handleRestart}
                className="btn-vintage text-base md:text-lg px-6 py-2.5 rounded-sm"
              >
                ⚔ Volver a empezar ⚔
              </button>
              
              {/* Decorative bottom border */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameOverScene;
