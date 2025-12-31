import { IconType } from "react-icons";
import {
  GiBroadsword,
  GiTwoHandedSword,
  GiPlainDagger,
  GiBattleAxe,
  GiThorHammer,
  GiFlangedMace,
  GiTrident,
  GiHighShot,
  GiWizardStaff,
  GiCrossedPistols,
  GiMusket,
} from "react-icons/gi";
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

const WEAPON_ICONS: Record<string, IconType> = {
  SWD: GiBroadsword,
  "2HS": GiTwoHandedSword,
  DGR: GiPlainDagger,
  AXE: GiBattleAxe,
  MCE: GiThorHammer,
  "2MC": GiFlangedMace,
  SPR: GiTrident,
  BOW: GiHighShot,
  STF: GiWizardStaff,
  HGN: GiCrossedPistols,
  LGN: GiMusket,
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
                    className="text-amber-600 drop-shadow-sm"
                    size={28}
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
