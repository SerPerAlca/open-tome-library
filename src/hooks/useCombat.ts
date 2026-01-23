import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CombatData, CombatPhase } from "@/types/combat";

const CORE_API_BASE_URL = "http://localhost:8082";

export const useCombat = (sceneId: number) => {
  const [combatData, setCombatData] = useState<CombatData | null>(null);
  const [phase, setPhase] = useState<CombatPhase>("PHASE_ENEMIES");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch combat data
  useEffect(() => {
    const loadCombatData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<CombatData>(
          `${CORE_API_BASE_URL}/combats/scenes/${sceneId}`
        );
        setCombatData(response.data);
      } catch (err) {
        console.error("Error loading combat data:", err);
        setError("Error al cargar los datos del combate");
      } finally {
        setIsLoading(false);
      }
    };

    loadCombatData();
  }, [sceneId]);

  const finishCombat = useCallback(() => {
    setPhase("PHASE_REWARDS");
  }, []);

  const resetCombat = useCallback(() => {
    setPhase("PHASE_ENEMIES");
  }, []);

  return {
    combatData,
    phase,
    isLoading,
    error,
    finishCombat,
    resetCombat,
  };
};

export { CORE_API_BASE_URL };
