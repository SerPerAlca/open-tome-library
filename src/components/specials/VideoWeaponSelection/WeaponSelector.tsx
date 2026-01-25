import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Weapon, PlayerSelection } from "./types";
import { Sword, Scale, ChevronRight } from "lucide-react";

interface WeaponSelectorProps {
  weapons: Weapon[];
  players: string[];
  onComplete: (selections: PlayerSelection[]) => void;
}

const WEAPON_BASE_URL = "http://localhost:8082";

const WeaponSelector = ({ weapons, players, onComplete }: WeaponSelectorProps) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selections, setSelections] = useState<PlayerSelection[]>(
    players.map((name) => ({ playerName: name, weaponId: null }))
  );
  const [selectedWeaponId, setSelectedWeaponId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const currentPlayer = players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === players.length - 1;

  // Get weapon IDs that have already been selected
  const takenWeaponIds = selections
    .filter((s) => s.weaponId !== null)
    .map((s) => s.weaponId);

  const handleWeaponClick = (weaponId: number) => {
    if (takenWeaponIds.includes(weaponId)) return;
    setSelectedWeaponId(weaponId);
  };

  const handleFlip = (e: React.MouseEvent, weaponId: number) => {
    e.stopPropagation();
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weaponId)) {
        newSet.delete(weaponId);
      } else {
        newSet.add(weaponId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    if (selectedWeaponId === null) return;

    const newSelections = [...selections];
    newSelections[currentPlayerIndex] = {
      ...newSelections[currentPlayerIndex],
      weaponId: selectedWeaponId,
    };
    setSelections(newSelections);

    if (isLastPlayer) {
      onComplete(newSelections);
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
      setSelectedWeaponId(null);
      setFlippedCards(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-8">
      {/* Player Turn Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-lg text-gold/60 uppercase tracking-widest mb-2">
          Selección de Armas
        </h2>
        <h1 className="font-display text-4xl md:text-5xl text-gold animate-breathe">
          Turno de: {currentPlayer}
        </h1>
        <p className="mt-4 font-body text-muted-foreground">
          Elige tu arma sabiamente. No podrás cambiarla después.
        </p>
      </div>

      {/* Weapon Grid - CombatCard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mb-8">
        {weapons.map((weapon) => {
          const isTaken = takenWeaponIds.includes(weapon.weaponId);
          const isSelected = selectedWeaponId === weapon.weaponId;
          const isFlipped = flippedCards.has(weapon.weaponId);
          const rarityHex = weapon.rarityColor.startsWith("#")
            ? weapon.rarityColor
            : `#${weapon.rarityColor}`;

          // Rarity-based styles matching CombatCard
          const rarityStyles = {
            borderColor: rarityHex,
            boxShadow: isSelected 
              ? `0 0 30px ${rarityHex}80, 0 0 60px ${rarityHex}40, 0 0 90px ${rarityHex}20`
              : `0 0 20px ${rarityHex}60, 0 0 40px ${rarityHex}30, inset 0 0 30px ${rarityHex}10`,
            background: `linear-gradient(to bottom, 
              ${rarityHex}15 0%, 
              rgba(17, 24, 39, 0.95) 30%, 
              rgba(17, 24, 39, 0.98) 100%)`,
          };

          return (
            <div 
              key={weapon.weaponId} 
              className="perspective-1000 w-80 h-[480px]"
            >
              <div
                onClick={() => !isTaken && handleWeaponClick(weapon.weaponId)}
                className={`
                  relative w-full h-full transition-transform duration-500 cursor-pointer
                  ${isFlipped ? "rotate-y-180" : ""}
                  ${isTaken ? "pointer-events-none" : ""}
                `}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Face */}
                <div
                  className={`
                    absolute inset-0 backface-hidden rounded-xl overflow-hidden
                    border-4 shadow-2xl transition-all duration-300
                    ${isTaken ? "opacity-40 grayscale" : ""}
                    ${isSelected ? "scale-105 ring-4 ring-gold" : "hover:scale-[1.02]"}
                  `}
                  style={{
                    backfaceVisibility: "hidden",
                    ...rarityStyles,
                  }}
                >
                  {/* Taken Overlay */}
                  {isTaken && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                      <span className="font-display text-2xl text-white/80 rotate-[-15deg] border-2 border-white/40 px-4 py-2">
                        TOMADA
                      </span>
                    </div>
                  )}

                  {/* Header with name */}
                  <div
                    className="px-4 py-3 text-center"
                    style={{ backgroundColor: rarityHex }}
                  >
                    <h3 className="font-display font-bold text-lg text-gray-900 truncate">
                      {weapon.name}
                    </h3>
                  </div>

                  {/* Weapon Image */}
                  <div className="h-52 overflow-hidden bg-black/20 flex items-center justify-center">
                    <img
                      src={`${WEAPON_BASE_URL}${weapon.imagePath}`}
                      alt={weapon.name}
                      className="w-full h-full object-contain object-center p-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Stats Section */}
                  <div className="p-4 space-y-4">
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Sword className="w-4 h-4" />
                          Ataque:
                        </span>
                        <span className="text-amber-100 font-bold text-lg">{weapon.physicalAttack}</span>
                      </div>
                      <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Peso:
                        </span>
                        <span className="text-amber-100 font-bold text-lg">{weapon.weight}</span>
                      </div>
                    </div>

                    {/* Weapon Type */}
                    <div className="text-center">
                      <span 
                        className="inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider"
                        style={{ 
                          backgroundColor: `${rarityHex}30`,
                          color: rarityHex 
                        }}
                      >
                        {weapon.weaponType}
                      </span>
                    </div>

                    {/* Additional Stats if available */}
                    {(weapon.magicalAttack || weapon.speed || weapon.range) && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {weapon.magicalAttack && (
                          <div className="bg-black/30 rounded px-2 py-1 text-center">
                            <span className="text-purple-400">✨ {weapon.magicalAttack}</span>
                          </div>
                        )}
                        {weapon.speed && (
                          <div className="bg-black/30 rounded px-2 py-1 text-center">
                            <span className="text-blue-400">⚡ {weapon.speed}</span>
                          </div>
                        )}
                        {weapon.range && (
                          <div className="bg-black/30 rounded px-2 py-1 text-center">
                            <span className="text-green-400">🎯 {weapon.range}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded-full">
                      ✓ SELECCIONADA
                    </div>
                  )}

                  {/* Flip button */}
                  <button
                    onClick={(e) => handleFlip(e, weapon.weaponId)}
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-amber-200 p-2 rounded-full transition-colors z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Back Face - Description */}
                <div
                  className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-4 shadow-2xl rotate-y-180 p-5 flex flex-col"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderColor: rarityHex,
                    boxShadow: `0 0 20px ${rarityHex}40`,
                    background: `linear-gradient(to bottom, rgba(17, 24, 39, 0.98), rgba(17, 24, 39, 0.95))`,
                  }}
                >
                  <h3 className="font-display text-xl mb-4" style={{ color: rarityHex }}>
                    {weapon.name}
                  </h3>
                  <p className="text-base text-gray-300 flex-1 overflow-y-auto leading-relaxed">
                    Un arma de tipo {weapon.weaponType.toLowerCase()} con {weapon.physicalAttack} puntos de ataque físico. 
                    {weapon.magicalAttack && ` También posee ${weapon.magicalAttack} de ataque mágico.`}
                    {weapon.weight <= 5 ? " Su ligereza permite ataques rápidos." : weapon.weight >= 10 ? " Su peso considerable requiere fuerza para manejarla." : " Un peso equilibrado para cualquier combatiente."}
                  </p>

                  {/* Flip back button */}
                  <button
                    onClick={(e) => handleFlip(e, weapon.weaponId)}
                    className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/80 text-amber-200 p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={selectedWeaponId === null}
        className={`
          px-12 py-6 text-xl font-display uppercase tracking-wider
          bg-gold hover:bg-gold/90 text-black
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          ${selectedWeaponId !== null ? "animate-breathe" : ""}
        `}
      >
        {isLastPlayer ? "Confirmar y Continuar" : "Confirmar Selección"}
      </Button>
    </div>
  );
};

export default WeaponSelector;
