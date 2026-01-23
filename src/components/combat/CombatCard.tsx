import { useState } from "react";
import { cn } from "@/lib/utils";
import { Enemy, Reward, Skill, EnemyStats, RewardStats } from "@/types/combat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sword, Shield, Heart, Zap, Wind, Footprints, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

const CORE_API_BASE_URL = "http://localhost:8082";

interface CombatCardProps {
  data: Enemy | Reward;
  type: "enemy" | "reward";
}

// Stat icon mapping for enemies
const enemyStatIcons: Record<keyof EnemyStats, { icon: React.ReactNode; label: string }> = {
  physicalAttack: { icon: <Sword className="w-3 h-3" />, label: "Ataque Físico" },
  magicAttack: { icon: <Sparkles className="w-3 h-3" />, label: "Ataque Mágico" },
  evasion: { icon: <Wind className="w-3 h-3" />, label: "Evasión" },
  mana: { icon: <Zap className="w-3 h-3" />, label: "Maná" },
  vitality: { icon: <Heart className="w-3 h-3" />, label: "Vitalidad" },
  physicalDefense: { icon: <Shield className="w-3 h-3" />, label: "Defensa Física" },
  magicDefense: { icon: <Shield className="w-3 h-3 text-purple-400" />, label: "Defensa Mágica" },
  movement: { icon: <Footprints className="w-3 h-3" />, label: "Movimiento" },
};

// Skill tooltip component
const SkillTooltip = ({ skill }: { skill: Skill }) => (
  <div className="p-2 max-w-xs">
    <p className="font-display font-bold text-amber-200">{skill.name}</p>
    <p className="text-sm text-gray-300 mt-1">{skill.description}</p>
    <p className="text-xs text-amber-400 mt-2">Usos: {skill.uses}</p>
  </div>
);

// Render enemy stats grid
const EnemyStatsGrid = ({ stats }: { stats: EnemyStats }) => (
  <div className="grid grid-cols-4 gap-1 text-xs">
    {(Object.entries(stats) as [keyof EnemyStats, number][]).map(([key, value]) => (
      <Tooltip key={key}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 bg-black/30 rounded px-1 py-0.5">
            {enemyStatIcons[key].icon}
            <span className="text-amber-100">{value}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{enemyStatIcons[key].label}: {value}</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
);

// Render reward stats dynamically - excludes specialCondition
const RewardStatsGrid = ({ stats }: { stats: RewardStats }) => {
  const validStats = Object.entries(stats).filter(
    ([key, value]) => value !== null && value !== undefined && key !== "specialCondition"
  );

  if (validStats.length === 0) return null;

  const statLabels: Record<string, string> = {
    weight: "Peso",
    unlockLevel: "Nivel",
    physicalAttack: "Ataque Físico",
    magicAttack: "Ataque Mágico",
    weaponType: "Tipo Arma",
    physicalDefense: "Def. Física",
    magicDefense: "Def. Mágica",
    armorType: "Tipo Armadura",
  };

  return (
    <div className="grid grid-cols-2 gap-1.5 text-sm">
      {validStats.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between bg-black/40 rounded px-2 py-1">
          <span className="text-gray-400">{statLabels[key] || key}:</span>
          <span className="text-amber-100 font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
};

// Special condition display
const SpecialConditionBadge = ({ condition }: { condition: string }) => (
  <div className="mt-3 p-2 bg-purple-900/40 border border-purple-500/50 rounded-lg">
    <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide mb-1">
      Condición Especial
    </p>
    <p className="text-sm text-purple-100">{condition}</p>
  </div>
);

const CombatCard = ({ data, type }: CombatCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const isEnemy = type === "enemy";
  const enemy = isEnemy ? (data as Enemy) : null;
  const reward = !isEnemy ? (data as Reward) : null;

  const imagePath = `${CORE_API_BASE_URL}${data.imagePath}`;
  const isBoss = enemy?.isBoss ?? false;
  const rarityColor = reward?.rarityColor ? `#${reward.rarityColor}` : undefined;

  // Calculate glow and background styles for rarity
  const rarityStyles = rarityColor
    ? {
        borderColor: rarityColor,
        boxShadow: `0 0 20px ${rarityColor}60, 0 0 40px ${rarityColor}30, inset 0 0 30px ${rarityColor}10`,
        background: `linear-gradient(to bottom, 
          ${rarityColor}15 0%, 
          rgba(17, 24, 39, 0.95) 30%, 
          rgba(17, 24, 39, 0.98) 100%)`,
      }
    : {};

  return (
    <div className="perspective-1000 w-80 h-[480px]">
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-xl overflow-hidden",
            "bg-gradient-to-b from-gray-800 to-gray-900",
            "border-4 shadow-2xl",
            isBoss
              ? "border-yellow-400 shadow-yellow-400/50 animate-pulse"
              : isEnemy
              ? "border-gray-600"
              : ""
          )}
          style={{
            backfaceVisibility: "hidden",
            ...(reward && rarityColor ? rarityStyles : {}),
          }}
        >
          {/* Header with name */}
          <div
            className={cn(
              "px-4 py-3 text-center",
              isBoss
                ? "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"
                : "bg-gradient-to-r from-gray-700 to-gray-600"
            )}
            style={{
              backgroundColor: !isEnemy && rarityColor ? rarityColor : undefined,
            }}
          >
            <h3
              className={cn(
                "font-display font-bold text-lg truncate",
                isBoss ? "text-gray-900" : "text-amber-100"
              )}
            >
              {data.name}
            </h3>
          </div>

          {/* EXP Badge (enemy only) - positioned bottom-left */}
          {isEnemy && enemy && (
            <div className="absolute bottom-3 left-3 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10">
              +{enemy.expPoints} EXP
            </div>
          )}

          {/* Quantity Badge (reward only) */}
          {!isEnemy && reward && reward.quantity > 1 && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10">
              x{reward.quantity}
            </div>
          )}

          {/* Image */}
          <div className="h-44 overflow-hidden bg-black/20">
            <img
              src={imagePath}
              alt={data.name}
              className="w-full h-full object-contain object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Stats Section */}
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {isEnemy && enemy && (
              <>
                <EnemyStatsGrid stats={enemy.stats} />

                {/* Skills indicator */}
                {enemy.skills.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-400">Habilidades:</span>
                    <div className="flex gap-1 flex-wrap">
                      {enemy.skills.map((skill, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div className="bg-purple-600/50 text-purple-200 text-sm px-2 py-1 rounded cursor-help">
                              {skill.name.length > 12 ? `${skill.name.substring(0, 12)}...` : skill.name}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 border-purple-500">
                            <SkillTooltip skill={skill} />
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!isEnemy && reward && (
              <div className="flex flex-col gap-2">
                {reward.stats && <RewardStatsGrid stats={reward.stats} />}
                {reward.stats?.specialCondition && (
                  <SpecialConditionBadge condition={reward.stats.specialCondition} />
                )}
              </div>
            )}
          </div>

          {/* Rarity name for rewards */}
          {!isEnemy && reward?.rarityName && (
            <div
              className="text-center py-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: rarityColor }}
            >
              {reward.rarityName}
            </div>
          )}

          {/* Flip button */}
          <button
            onClick={() => setIsFlipped(true)}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-amber-200 p-2 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Back Face */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-xl overflow-hidden",
            "bg-gradient-to-b from-gray-900 to-gray-800",
            "border-4 shadow-2xl",
            "rotate-y-180 p-5 flex flex-col"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: rarityColor || "#4b5563",
            ...(rarityColor && { boxShadow: `0 0 20px ${rarityColor}40` }),
          }}
        >
          <h3 className="font-display text-xl text-amber-200 mb-4">{data.name}</h3>
          <p className="text-base text-gray-300 flex-1 overflow-y-auto leading-relaxed">
            {data.description}
          </p>

          {/* Flip back button */}
          <button
            onClick={() => setIsFlipped(false)}
            className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/80 text-amber-200 p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CombatCard;
