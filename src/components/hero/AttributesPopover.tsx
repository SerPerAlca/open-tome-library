import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StatsPanel from "./StatsPanel";
import SkillTree from "./SkillTree";
import { BaseStats, SkillTreeNode } from "@/types/hero-api";

interface AttributesPopoverProps {
  stats: BaseStats;
  skillTree: SkillTreeNode[];
  children: ReactNode;
}

const AttributesPopover = ({ stats, skillTree, children }: AttributesPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        className="w-[600px] max-w-[90vw] p-0 border-2 border-gold/50 bg-transparent z-50"
        style={{ zIndex: 50 }}
      >
        <div className="paper-texture paper-aged rounded-sm overflow-hidden">
          {/* Header */}
          <div className="bg-spine/90 px-4 py-2 border-b border-gold/40">
            <h3 className="font-display text-xl text-gold text-center">
              ☙ Atributos y Progreso ❧
            </h3>
          </div>
          
          {/* Content */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left panel - Stats */}
            <div className="p-3 bg-background/30 rounded-sm border border-border/40">
              <StatsPanel stats={stats} />
            </div>
            
            {/* Right panel - Skill Tree */}
            <div className="p-3 bg-background/30 rounded-sm border border-border/40 min-h-[200px]">
              <SkillTree nodes={skillTree} />
            </div>
          </div>
          
          {/* Decorative footer */}
          <div className="text-center py-2 text-gold/60 text-sm font-body italic border-t border-border/30">
            Pasa el cursor por los nodos para ver detalles
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AttributesPopover;
