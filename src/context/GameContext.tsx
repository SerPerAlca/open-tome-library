import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GameState, Hero, Player, createInitialGameState, HEROES } from "@/types/game";

interface GameContextType {
  gameState: GameState | null;
  initializeGame: (playerNames: string[]) => void;
  selectHero: (heroId: string) => boolean; // Returns true if selection complete
  getCurrentPlayer: () => Player | null;
  getAvailableHeroes: () => Hero[];
  getAssignedHeroes: () => { player: Player; hero: Hero }[];
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const initializeGame = useCallback((playerNames: string[]) => {
    setGameState(createInitialGameState(playerNames));
  }, []);

  const selectHero = useCallback((heroId: string): boolean => {
    if (!gameState) return false;

    const { players, availableHeroes, currentPlayerIndex } = gameState;

    // Find and remove hero from available
    const heroIndex = availableHeroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return false;

    const newAvailableHeroes = availableHeroes.filter((h) => h.id !== heroId);

    // Assign hero to current player
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = {
      ...newPlayers[currentPlayerIndex],
      heroId,
    };

    const nextPlayerIndex = currentPlayerIndex + 1;
    const isComplete = nextPlayerIndex >= players.length;

    setGameState({
      players: newPlayers,
      availableHeroes: newAvailableHeroes,
      currentPlayerIndex: isComplete ? currentPlayerIndex : nextPlayerIndex,
      isSelectionComplete: isComplete,
    });

    return isComplete;
  }, [gameState]);

  const getCurrentPlayer = useCallback((): Player | null => {
    if (!gameState) return null;
    return gameState.players[gameState.currentPlayerIndex] || null;
  }, [gameState]);

  const getAvailableHeroes = useCallback((): Hero[] => {
    return gameState?.availableHeroes || [];
  }, [gameState]);

  const getAssignedHeroes = useCallback((): { player: Player; hero: Hero }[] => {
    if (!gameState) return [];

    return gameState.players
      .filter((p) => p.heroId)
      .map((player) => ({
        player,
        hero: HEROES.find((h) => h.id === player.heroId)!,
      }));
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
        getAvailableHeroes,
        getAssignedHeroes,
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
