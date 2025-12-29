import { useState, useEffect, useCallback } from "react";
import { ChapterData, AdditionalContent } from "@/types/chapter";

// TODO: Replace with your actual API base URL
const API_BASE_URL = "/api";

interface UseChapterReturn {
  chapter: ChapterData | null;
  additionalContent: AdditionalContent[];
  isLoading: boolean;
  isLoadingAdditional: boolean;
  error: string | null;
  loadChapter: (chapterId: string) => Promise<void>;
  loadAdditionalContent: (endpoint: string) => Promise<void>;
}

export const useChapter = (initialChapterId?: string): UseChapterReturn => {
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [additionalContent, setAdditionalContent] = useState<AdditionalContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAdditional, setIsLoadingAdditional] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChapter = useCallback(async (chapterId: string) => {
    setIsLoading(true);
    setError(null);
    setAdditionalContent([]); // Reset additional content on new chapter

    try {
      // TODO: Implement your HTTP call here
      // Example:
      // const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}`);
      // if (!response.ok) throw new Error("Failed to load chapter");
      // const data = await response.json();
      // setChapter(data.chapter);

      // Mock data for development - REMOVE when implementing real API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const mockChapter: ChapterData = {
        id: chapterId,
        title: "Capítulo Primero",
        subtitle: "De los Antiguos Reinos",
        content: `En tiempos remotos, cuando las brumas del alba aún cubrían los valles
y las estrellas guiaban a los viajeros por senderos olvidados, existía
un reino de esplendor incomparable.

Las crónicas antiguas narran que sus torres se alzaban hacia los cielos,
construidas con la piedra dorada de las montañas del este. Sus habitantes,
sabios y valientes, guardaban secretos que el tiempo ha velado.

Los pergaminos que han llegado hasta nosotros, amarillentos por el paso
de los siglos, relatan hazañas de caballeros y doncellas, de dragones
y tesoros escondidos en las profundidades de la tierra.`,
        image: {
          src: "/manuscript-illustration.jpg", // Replace with actual image from API
          alt: "Ilustración medieval de un castillo",
          caption: "Lámina I: Vista del Castillo en la Colina",
        },
        clickableText: {
          label: "Descubrir más sobre los secretos del reino",
          endpoint: "/chapters/1/additional",
        },
      };

      setChapter(mockChapter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading chapter");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAdditionalContent = useCallback(async (endpoint: string) => {
    setIsLoadingAdditional(true);

    try {
      // TODO: Implement your HTTP call here
      // Example:
      // const response = await fetch(`${API_BASE_URL}${endpoint}`);
      // if (!response.ok) throw new Error("Failed to load additional content");
      // const data = await response.json();
      // setAdditionalContent((prev) => [...prev, data.additionalContent]);

      // Mock data for development - REMOVE when implementing real API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockAdditional: AdditionalContent = {
        text: `«Quien busca la verdad en las páginas del pasado,
hallará la luz que ilumina el porvenir.»

Así rezaba la inscripción grabada en las puertas del gran salón,
donde los sabios del reino se reunían para deliberar sobre los
asuntos de mayor importancia.`,
      };

      setAdditionalContent((prev) => [...prev, mockAdditional]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading additional content");
    } finally {
      setIsLoadingAdditional(false);
    }
  }, []);

  // Load initial chapter on mount
  useEffect(() => {
    if (initialChapterId) {
      loadChapter(initialChapterId);
    }
  }, [initialChapterId, loadChapter]);

  return {
    chapter,
    additionalContent,
    isLoading,
    isLoadingAdditional,
    error,
    loadChapter,
    loadAdditionalContent,
  };
};
