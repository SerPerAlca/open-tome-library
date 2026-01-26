import { motion } from "framer-motion";

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen = ({ onStart }: SplashScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Decorative Ornament */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gold text-5xl mb-8 opacity-80"
        >
          ⚜
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-6xl md:text-8xl text-gold mb-4 drop-shadow-lg tracking-wider"
        >
          ETERNUM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-body text-lg text-foreground/60 italic mb-16 max-w-md"
        >
          El Final de los Tiempos
        </motion.p>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="px-16 py-5 
                     bg-gradient-to-b from-gold via-gold to-amber-700
                     text-black font-display text-2xl tracking-widest
                     rounded-sm
                     shadow-[0_0_30px_rgba(212,175,55,0.4)]
                     hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]
                     transition-shadow duration-300
                     border border-amber-500/50"
        >
          EMPEZAR
        </motion.button>

        {/* Bottom Ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-gold text-3xl mt-12 opacity-60"
        >
          ❧
        </motion.div>
      </div>

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
        }}
      />
    </motion.div>
  );
};

export default SplashScreen;
