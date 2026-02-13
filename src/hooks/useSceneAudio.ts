import { useEffect, useRef } from "react";

const AUDIO_BASE_URL = "http://localhost:8082/static/audio/chapter";

export const useSceneAudio = (chapterId?: number, sceneId?: number) => {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const dialogueRef = useRef<HTMLAudioElement | null>(null);
  const currentChapterRef = useRef<number | null>(null);

  // Ambient music — changes only when chapterId changes
  useEffect(() => {
    if (!chapterId) return;

    // Skip if same chapter is already playing
    if (currentChapterRef.current === chapterId && ambientRef.current) return;

    // Stop previous ambient
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current.src = "";
      ambientRef.current = null;
    }

    currentChapterRef.current = chapterId;
    const url = `${AUDIO_BASE_URL}/${chapterId}/musica_ambiente.mp3`;
    const music = new Audio(url);
    music.loop = true;
    ambientRef.current = music;

    music.play().catch((err) => {
      console.warn(`[SceneAudio] Ambient music not available for chapter ${chapterId}:`, err.message);
    });

    return () => {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.src = "";
        ambientRef.current = null;
      }
      currentChapterRef.current = null;
    };
  }, [chapterId]);

  // Dialogue voice — changes every scene
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.pause();
      dialogueRef.current.src = "";
      dialogueRef.current = null;
    }

    if (!chapterId || !sceneId) return;

    const url = `${AUDIO_BASE_URL}/${chapterId}/scene${sceneId}.mp3`;
    const voice = new Audio(url);
    dialogueRef.current = voice;

    voice.play().catch((err) => {
      console.warn(`[SceneAudio] Dialogue not available for scene ${sceneId}:`, err.message);
    });

    return () => {
      if (dialogueRef.current) {
        dialogueRef.current.pause();
        dialogueRef.current.src = "";
        dialogueRef.current = null;
      }
    };
  }, [chapterId, sceneId]);
};
