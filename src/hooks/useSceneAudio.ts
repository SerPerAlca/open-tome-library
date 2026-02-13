import { useEffect, useRef } from "react";

const AUDIO_BASE_URL = "http://localhost:8082/static/audio/chapter";

export const useSceneAudio = (chapterId?: number, sceneId?: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Stop and clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (!chapterId || !sceneId) return;

    const url = `${AUDIO_BASE_URL}/${chapterId}/scene${sceneId}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn(`[SceneAudio] Could not play audio for scene ${sceneId}:`, err.message);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [chapterId, sceneId]);
};
