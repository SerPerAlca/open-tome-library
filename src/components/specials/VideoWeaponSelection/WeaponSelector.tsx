import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Weapon, PlayerSelection } from "./types";

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

  const handleConfirm = () => {
    if (selectedWeaponId === null) return;

    const newSelections = [...selections];
    newSelections[currentPlayerIndex] = {
      ...newSelections[currentPlayerIndex],
      weaponId: selectedWeaponId,
    };
    setSelections(newSelections);

    if (isLastPlayer) {
      // All players have selected
      onComplete(newSelections);
    } else {
      // Move to next player
      setCurrentPlayerIndex((prev) => prev + 1);
      setSelectedWeaponId(null);
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

      {/* Weapon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mb-8">
        {weapons.map((weapon) => {
          const isTaken = takenWeaponIds.includes(weapon.weaponId);
          const isSelected = selectedWeaponId === weapon.weaponId;
          const rarityHex = weapon.rarityColor.startsWith("#")
            ? weapon.rarityColor
            : `#${weapon.rarityColor}`;

          return (
            <Card
              key={weapon.weaponId}
              onClick={() => handleWeaponClick(weapon.weaponId)}
              className={`
                relative cursor-pointer transition-all duration-300 overflow-hidden
                border-2 bg-card/80 backdrop-blur
                ${isTaken ? "opacity-40 grayscale cursor-not-allowed" : ""}
                ${isSelected ? "scale-105 ring-4 ring-gold" : "hover:scale-102"}
              `}
              style={{
                borderColor: isSelected ? rarityHex : "transparent",
                boxShadow: isSelected
                  ? `0 0 30px ${rarityHex}60, 0 0 60px ${rarityHex}30`
                  : undefined,
              }}
            >
              {/* Taken Overlay */}
              {isTaken && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                  <span className="font-display text-lg text-white/80 rotate-[-15deg]">
                    TOMADA
                  </span>
                </div>
              )}

              {/* Weapon Image */}
              <div className="aspect-square relative bg-black/20">
                <img
                  src={`${WEAPON_BASE_URL}${weapon.imagePath}`}
                  alt={weapon.name}
                  className="w-full h-full object-contain object-center p-4"
                />
              </div>

              <CardContent className="p-4">
                {/* Weapon Name */}
                <h3
                  className="font-display text-lg text-center mb-2"
                  style={{ color: rarityHex }}
                >
                  {weapon.name}
                </h3>

                {/* Stats */}
                <div className="flex justify-center gap-4 text-sm font-body text-muted-foreground">
                  <span>⚔️ {weapon.physicalAttack}</span>
                  <span>⚖️ {weapon.weight}</span>
                </div>

                {/* Weapon Type */}
                <p className="text-center text-xs text-muted-foreground/60 mt-2 uppercase tracking-wider">
                  {weapon.weaponType}
                </p>
              </CardContent>
            </Card>
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
