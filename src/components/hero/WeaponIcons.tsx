import { 
  Sword, 
  Swords, 
  Scissors, 
  Axe, 
  Gavel, 
  Hammer, 
  ArrowUpRight, 
  Target, 
  Wand2, 
  Crosshair, 
  Zap,
  LucideIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface WeaponType {
  code: string;
  description: string;
}

const WEAPON_ICONS: Record<string, LucideIcon> = {
  SWD: Sword,
  "2HS": Swords,
  DGR: Scissors,
  AXE: Axe,
  MCE: Gavel,
  "2MC": Hammer,
  SPR: ArrowUpRight,
  BOW: Target,
  STF: Wand2,
  HGN: Crosshair,
  LGN: Zap,
};

interface WeaponIconsProps {
  weapons: WeaponType[];
}

const WeaponIcons = ({ weapons }: WeaponIconsProps) => {
  if (!weapons || weapons.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-center gap-3 mt-1">
        {weapons.map((weapon) => {
          const IconComponent = WEAPON_ICONS[weapon.code];
          
          if (!IconComponent) {
            console.warn(`No icon found for weapon code: ${weapon.code}`);
            return null;
          }

          return (
            <Tooltip key={weapon.code}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <IconComponent 
                    className="w-5 h-5 text-amber-600 drop-shadow-sm" 
                    strokeWidth={1.5}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-background/95 border-gold/50 text-foreground"
              >
                <span className="font-body text-sm">{weapon.description}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default WeaponIcons;
