import { Eye, Dices, Zap, Sword, Shield, Move, type LucideIcon } from "lucide-react";
import { BoardGamePhase } from "@/types/board-game";

// Icon mapping for phases
const phaseIconMap: Record<string, LucideIcon> = {
  Eye: Eye,
  Dices: Dices,
  Zap: Zap,
  Sword: Sword,
  Shield: Shield,
  Move: Move,
};

interface BoardGamePhasesProps {
  phases: BoardGamePhase[];
}

const BoardGamePhases = ({ phases }: BoardGamePhasesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-amber-900 font-bold text-center uppercase tracking-wider">
        Flujo de Juego
      </h2>

      <div className="space-y-4">
        {phases.map((phase) => {
          const IconComponent = phaseIconMap[phase.icon];

          return (
            <div
              key={phase.step}
              className="flex gap-4 items-start p-4 bg-amber-50/50 rounded-lg border-l-4 border-amber-600"
            >
              {/* Step number circle */}
              <div className="flex-shrink-0 w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-display font-bold text-lg shadow-md">
                {phase.step}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-amber-700" />
                  )}
                  <h3 className="font-display text-lg text-amber-900 font-bold">
                    {phase.title}
                  </h3>
                </div>

                <p className="font-body text-amber-800 leading-relaxed">
                  {phase.description}
                </p>

                {/* Quote block if exists */}
                {phase.quote && (
                  <blockquote className="mt-3 pl-4 border-l-2 border-amber-400 italic text-amber-700 font-body">
                    "{phase.quote}"
                  </blockquote>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardGamePhases;
