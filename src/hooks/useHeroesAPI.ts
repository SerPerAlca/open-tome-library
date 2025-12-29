import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HeroAPIResponse, DEFAULT_SKILL_TREE } from "@/types/hero-api";

const API_URL = "http://localhost:8082/heroes";

interface UseHeroesAPIResult {
  heroes: HeroAPIResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useHeroesAPI = (): UseHeroesAPIResult => {
  const [heroes, setHeroes] = useState<HeroAPIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<HeroAPIResponse[]>(API_URL);
      
      // Ensure each hero has a skill tree (use default if not provided)
      const heroesWithSkillTree = response.data.map(hero => ({
        ...hero,
        skillTree: hero.skillTree && hero.skillTree.length > 0 
          ? hero.skillTree 
          : DEFAULT_SKILL_TREE
      }));
      
      setHeroes(heroesWithSkillTree);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.message
        : "Error desconocido al cargar los héroes";
      setError(errorMessage);
      console.error("Error fetching heroes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  return { heroes, isLoading, error, refetch: fetchHeroes };
};
