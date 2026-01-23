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

// Render reward stats dynamically
const RewardStatsGrid = ({ stats }: { stats: RewardStats }) => {
  const validStats = Object.entries(stats).filter(
    ([_, value]) => value !== null && value !== undefined
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
    <div className="grid grid-cols-2 gap-1 text-xs">
      {validStats.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between bg-black/30 rounded px-2 py-0.5">
          <span className="text-gray-400">{statLabels[key] || key}:</span>
          <span className="text-amber-100">{value}</span>
        </div>
      ))}
    </div>
  );
};

const CombatCard = ({ data, type }: CombatCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const isEnemy = type === "enemy";
  const enemy = isEnemy ? (data as Enemy) : null;
  const reward = !isEnemy ? (data as Reward) : null;

  const imagePath = `${CORE_API_BASE_URL}${data.imagePath}`;
  const isBoss = enemy?.isBoss ?? false;
  const rarityColor = reward?.rarityColor ? `#${reward.rarityColor}` : undefined;

  return (
    <div className="perspective-1000 w-64 h-96">
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
            "border-2 shadow-xl",
            isBoss
              ? "border-yellow-400 shadow-yellow-400/50 animate-pulse"
              : "border-gray-600",
            !isEnemy && rarityColor && "border-2"
          )}
          style={{
            backfaceVisibility: "hidden",
            borderColor: !isEnemy && rarityColor ? rarityColor : undefined,
          }}
        >
          {/* Header with name */}
          <div
            className={cn(
              "px-3 py-2 text-center",
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
                "font-display font-bold text-sm truncate",
                isBoss ? "text-gray-900" : "text-amber-100"
              )}
            >
              {data.name}
            </h3>
          </div>

          {/* EXP Badge (enemy only) - positioned bottom-left */}
          {isEnemy && enemy && (
            <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
              +{enemy.expPoints} EXP
            </div>
          )}

          {/* Quantity Badge (reward only) */}
          {!isEnemy && reward && reward.quantity > 1 && (
            <div className="absolute top-1 right-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              x{reward.quantity}
            </div>
          )}

          {/* Image */}
          <div className="h-32 overflow-hidden bg-black/20">
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
          <div className="p-2 space-y-2 flex-1">
            {isEnemy && enemy && (
              <>
                <EnemyStatsGrid stats={enemy.stats} />

                {/* Skills indicator */}
                {enemy.skills.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Habilidades:</span>
                    <div className="flex gap-1">
                      {enemy.skills.map((skill, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div className="bg-purple-600/50 text-purple-200 text-xs px-2 py-0.5 rounded cursor-help">
                              {skill.name.substring(0, 8)}...
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

            {!isEnemy && reward && reward.stats && (
              <RewardStatsGrid stats={reward.stats} />
            )}
          </div>

          {/* Rarity name for rewards */}
          {!isEnemy && reward?.rarityName && (
            <div
              className="text-center py-1 text-xs font-bold"
              style={{ color: rarityColor }}
            >
              {reward.rarityName}
            </div>
          )}

          {/* Flip button */}
          <button
            onClick={() => setIsFlipped(true)}
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-amber-200 p-1 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Back Face */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-xl overflow-hidden",
            "bg-gradient-to-b from-gray-900 to-gray-800",
            "border-2 border-gray-600 shadow-xl",
            "rotate-y-180 p-4 flex flex-col"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="font-display text-lg text-amber-200 mb-3">{data.name}</h3>
          <p className="text-sm text-gray-300 flex-1 overflow-y-auto">
            {data.description}
          </p>

          {/* Flip back button */}
          <button
            onClick={() => setIsFlipped(false)}
            className="absolute bottom-2 left-2 bg-black/50 hover:bg-black/70 text-amber-200 p-1 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CombatCard;
