import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Scene, Choice, GameEngineState } from "@/types/game-engine";

const API_BASE_URL = "http://localhost:8081";
const SCENE_IMAGES_BASE_URL = "http://localhost:8081";

export const useGameEngine = (chapterId: number = 1) => {
  const [state, setState] = useState<GameEngineState>({
    scenes: [],
    currentScene: null,
    currentImageIndex: 0,
    accumulatedText: [],
    currentChoices: [],
    isLoading: true,
    error: null,
  });

  const imageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chapter scenes
  useEffect(() => {
    const loadChapter = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await axios.get<Scene[]>(
          `${API_BASE_URL}/books/scenes/chapters/${chapterId}`
        );

        const scenes = response.data;

        if (scenes.length > 0) {
          const firstScene = scenes[0];
          setState({
            scenes,
            currentScene: firstScene,
            currentImageIndex: 0,
            accumulatedText: [firstScene.sceneText],
            currentChoices: firstScene.choices || [],
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "No scenes found in this chapter",
          }));
        }
      } catch (error) {
        console.error("Error loading chapter:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Error loading chapter data",
        }));
      }
    };

    loadChapter();
  }, [chapterId]);

  // Handle image sequence with timeouts
  useEffect(() => {
    // Clear any existing timeout
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }

    const { currentScene, currentImageIndex } = state;
    if (!currentScene?.images?.length) return;

    // Sort images by sortOrder
    const sortedImages = [...currentScene.images].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    const currentImage = sortedImages[currentImageIndex];
    if (!currentImage) return;

    // If current image has a timeout and there are more images, set up the transition
    // IMPORTANT: timeOut in JSON is in SECONDS, setTimeout uses MILLISECONDS
    if (
      currentImage.timeOut &&
      currentImage.timeOut > 0 &&
      currentImageIndex < sortedImages.length - 1
    ) {
      const timeoutMs = currentImage.timeOut * 1000; // Convert seconds to milliseconds
      imageTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentImageIndex: prev.currentImageIndex + 1,
        }));
      }, timeoutMs);
    }

    return () => {
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }
    };
  }, [state.currentScene, state.currentImageIndex]);

  // Get current image URL
  const getCurrentImageUrl = useCallback((): string | null => {
    const { currentScene, currentImageIndex } = state;
    if (!currentScene?.images?.length) return null;

    const sortedImages = [...currentScene.images].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    const image = sortedImages[currentImageIndex];
    if (!image) return null;

    // Prepend base URL to relative path
    return `${SCENE_IMAGES_BASE_URL}${image.path}`;
  }, [state]);

  // Navigate to a specific scene by ID
  const navigateToScene = useCallback((sceneId: number) => {
    setState((prev) => {
      const targetScene = prev.scenes.find((s) => s.id === sceneId);
      if (!targetScene) {
        console.error(`Scene with ID ${sceneId} not found`);
        return prev;
      }

      return {
        ...prev,
        currentScene: targetScene,
        currentImageIndex: 0,
        accumulatedText: [targetScene.sceneText],
        currentChoices: targetScene.choices || [],
      };
    });
  }, []);

  // Jump to any scene by ID (for dev tools) - resets all temporary state
  const jumpToScene = useCallback((sceneId: number) => {
    // Clear any image timeouts
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }

    setState((prev) => {
      const targetScene = prev.scenes.find((s) => s.id === sceneId);
      if (!targetScene) {
        console.error(`[DevTools] Scene with ID ${sceneId} not found in loaded scenes`);
        return prev;
      }

      console.log(`[DevTools] Jumping to scene ${sceneId}`, targetScene);

      return {
        ...prev,
        currentScene: targetScene,
        currentImageIndex: 0,
        accumulatedText: [targetScene.sceneText],
        currentChoices: targetScene.choices || [],
      };
    });
  }, []);

  // Handle choice selection - returns destination scene type for animation decisions
  const handleChoiceSelect = useCallback((choice: Choice): { destinationType?: string } => {
    if (choice.obligatory) {
      // Obligatory choice: navigate to new scene
      navigateToScene(choice.destinationSceneId);
      // Return the destination type for the caller to decide on animation
      return { destinationType: choice.destinationType };
    } else {
      // Non-obligatory (conversation): append text and update choices
      setState((prev) => {
        const destinationScene = choice.destinationScene;
        if (!destinationScene) {
          console.error("No destination scene data for non-obligatory choice");
          return prev;
        }

        return {
          ...prev,
          accumulatedText: [...prev.accumulatedText, destinationScene.sceneText],
          currentChoices: destinationScene.choices || [],
        };
      });
      return {};
    }
  }, [navigateToScene]);

  // Navigate to next scene (linear navigation)
  const goToNextScene = useCallback(() => {
    const { currentScene, currentChoices } = state;

    // Only allow if there are no choices
    if (currentChoices.length > 0) {
      console.warn("Cannot navigate forward: scene has choices");
      return false;
    }

    if (!currentScene?.nextSceneId) {
      console.warn("No next scene available");
      return false;
    }

    navigateToScene(currentScene.nextSceneId);
    return true;
  }, [state, navigateToScene]);

  // Check if next page navigation is allowed
  // Only disable when there are choices - nextSceneId being null is handled in goToNextScene
  const canGoNext = useCallback((): boolean => {
    const { currentChoices } = state;
    return currentChoices.length === 0;
  }, [state]);

  // Get a scene by ID (useful for checking next scene type)
  const getSceneById = useCallback((sceneId: number): Scene | null => {
    return state.scenes.find((s) => s.id === sceneId) || null;
  }, [state.scenes]);

  // Get the next scene (based on currentScene.nextSceneId)
  const getNextScene = useCallback((): Scene | null => {
    if (!state.currentScene?.nextSceneId) return null;
    return getSceneById(state.currentScene.nextSceneId);
  }, [state.currentScene, getSceneById]);

  // Check if a scene type requires special transition (no page animation)
  const isSpecialSceneType = useCallback((sceneType?: string): boolean => {
    const specialTypes = ["FGHT", "SPEC", "GAME", "END", "TABL"];
    return sceneType ? specialTypes.includes(sceneType) : false;
  }, []);

  // Navigate directly to game over scene
  const goToGameOver = useCallback(() => {
    const GAME_OVER_SCENE_ID = 9999;
    navigateToScene(GAME_OVER_SCENE_ID);
  }, [navigateToScene]);

  return {
    // State
    currentScene: state.currentScene,
    accumulatedText: state.accumulatedText,
    currentChoices: state.currentChoices,
    isLoading: state.isLoading,
    error: state.error,
    currentImageUrl: getCurrentImageUrl(),

    // Actions
    handleChoiceSelect,
    goToNextScene,
    canGoNext: canGoNext(),
    navigateToScene,
    jumpToScene,
    goToGameOver,

    // Scene inspection
    getSceneById,
    getNextScene,
    isSpecialSceneType,
  };
};
