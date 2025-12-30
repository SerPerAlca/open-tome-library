import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GameState, Player, createInitialGameState } from "@/types/game";

interface GameContextType {
  gameState: GameState | null;
  initializeGame: (playerNames: string[]) => void;
  selectHero: (heroCode: string) => boolean;
  getCurrentPlayer: () => Player | null;
  getSelectedHeroCodes: () => string[];
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const initializeGame = useCallback((playerNames: string[]) => {
    setGameState(createInitialGameState(playerNames));
  }, []);

  const selectHero = useCallback((heroCode: string): boolean => {
    if (!gameState) return false;

    const { players, currentPlayerIndex, selectedHeroCodes } = gameState;

    // Check if hero is already selected
    if (selectedHeroCodes.includes(heroCode)) return false;

    // Assign hero to current player
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = {
      ...newPlayers[currentPlayerIndex],
      heroId: heroCode,
    };

    const newSelectedHeroCodes = [...selectedHeroCodes, heroCode];
    const nextPlayerIndex = currentPlayerIndex + 1;
    const isComplete = nextPlayerIndex >= players.length;

    setGameState({
      players: newPlayers,
      currentPlayerIndex: isComplete ? currentPlayerIndex : nextPlayerIndex,
      isSelectionComplete: isComplete,
      selectedHeroCodes: newSelectedHeroCodes,
    });

    return isComplete;
  }, [gameState]);

  const getCurrentPlayer = useCallback((): Player | null => {
    if (!gameState) return null;
    return gameState.players[gameState.currentPlayerIndex] || null;
  }, [gameState]);

  const getSelectedHeroCodes = useCallback((): string[] => {
    return gameState?.selectedHeroCodes || [];
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        initializeGame,
        selectHero,
        getCurrentPlayer,
        getSelectedHeroCodes,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
