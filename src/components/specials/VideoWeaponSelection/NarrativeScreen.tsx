import { useEffect, useState } from "react";

interface NarrativeScreenProps {
  text: string;
  duration?: number;
  onComplete: () => void;
}

const NarrativeScreen = ({
  text,
  duration = 7500,
  onComplete,
}: NarrativeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-complete after duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-8 md:p-16">
      <div
        className={`
          max-w-4xl text-center transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <p className="font-body text-xl md:text-2xl lg:text-3xl text-white leading-relaxed italic">
          "{text}"
        </p>

        {/* Progress indicator */}
        <div className="mt-12 flex justify-center">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full"
              style={{
                animation: `progress-fill ${duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default NarrativeScreen;
