import { Flag, Heart, ShieldAlert, Target, Clock, Users, type LucideIcon } from "lucide-react";
import { BoardGameSpec } from "@/types/board-game";

// Icon mapping for specs
const iconMap: Record<string, LucideIcon> = {
  Flag: Flag,
  Heart: Heart,
  ShieldAlert: ShieldAlert,
  Target: Target,
  Clock: Clock,
  Users: Users,
};

interface BoardGameSpecsProps {
  specs: BoardGameSpec[];
}

const BoardGameSpecs = ({ specs }: BoardGameSpecsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {specs.map((spec, index) => {
        const IconComponent = iconMap[spec.icon];
        
        return (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-amber-100/50 rounded-lg border border-amber-700/30"
          >
            {IconComponent && (
              <IconComponent className="w-8 h-8 text-amber-700 mb-2" />
            )}
            <span className="font-display text-sm text-amber-900 font-bold uppercase tracking-wide">
              {spec.label}
            </span>
            <span className="font-body text-lg text-amber-800 text-center">
              {spec.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BoardGameSpecs;
