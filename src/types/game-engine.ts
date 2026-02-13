// Types for the game engine

export interface SceneImage {
  path: string;
  sortOrder: number;
  timeOut: number | null;
}

export interface DestinationScene {
  id: number;
  sceneText: string;
  choices?: Choice[];
}

export interface Choice {
  choiceId: number;
  choiceText: string;
  destinationSceneId: number;
  destinationType?: string;
  obligatory: boolean;
  destinationScene?: DestinationScene;
}

export interface Scene {
  id: number;
  nextSceneId?: number;
  sceneType?: string;
  chapterId?: number;
  sceneText: string;
  chapterDescription?: string;
  sceneLocation?: string;
  choices: Choice[];
  images: SceneImage[];
  // Special scene properties
  resource?: string;
}

export interface GameEngineState {
  scenes: Scene[];
  currentScene: Scene | null;
  currentImageIndex: number;
  accumulatedText: string[];
  currentChoices: Choice[];
  isLoading: boolean;
  error: string | null;
}
