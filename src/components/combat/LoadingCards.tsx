import { cn } from "@/lib/utils";

interface LoadingCardsProps {
  count?: number;
}

const LoadingCards = ({ count = 3 }: LoadingCardsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-48 h-72 rounded-xl",
            "bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900",
            "border-2 border-amber-600",
            "shadow-xl shadow-amber-900/50",
            "animate-card-float"
          )}
          style={{
            animationDelay: `${i * 150}ms`,
          }}
        >
          {/* Card back pattern */}
          <div className="w-full h-full rounded-xl p-3">
            <div className="w-full h-full border-2 border-amber-500/50 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-amber-500/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-amber-500/30 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingCards;
