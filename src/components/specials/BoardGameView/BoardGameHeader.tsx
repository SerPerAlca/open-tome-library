import { Dices, Lightbulb, Zap } from "lucide-react";

interface BoardGameHeaderProps {
  title: string;
  context: string;
  type?: string;
}

// Dynamic icon based on game type keywords
const getTypeIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("suerte")) return <Dices className="w-4 h-4" />;
  if (lowerType.includes("ingenio")) return <Lightbulb className="w-4 h-4" />;
  if (lowerType.includes("habilidad")) return <Zap className="w-4 h-4" />;
  return <Dices className="w-4 h-4" />;
};

const BoardGameHeader = ({ title, context, type }: BoardGameHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      {/* Decorative top ornament */}
      <div className="flex justify-center mb-2">
        <span className="text-amber-700/60 text-2xl">❧ ❧ ❧</span>
      </div>

      {/* Title with Type Badge */}
      <div className="space-y-3">
        <h1 className="font-display text-3xl md:text-4xl text-amber-900 font-bold tracking-wide">
          {title}
        </h1>
        
        {/* Type Badge */}
        {type && (
          <div className="flex justify-center">
            <span 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-display
                         bg-gradient-to-r from-amber-100 to-amber-50 
                         border-2 border-amber-600/50 text-amber-800
                         shadow-sm"
            >
              {getTypeIcon(type)}
              {type}
            </span>
          </div>
        )}
      </div>

      {/* Context */}
      <p className="font-body text-lg md:text-xl text-amber-800 italic leading-relaxed max-w-3xl mx-auto">
        {context}
      </p>

      {/* Decorative bottom ornament */}
      <div className="flex justify-center mt-2">
        <span className="text-amber-700/60 text-lg">✦ ✦ ✦</span>
      </div>
    </div>
  );
};

export default BoardGameHeader;
