import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Scene } from "@/types/game-engine";
import { Weapon, PlayerSelection, SelectionPhase } from "./types";
import WeaponSelector from "./WeaponSelector";
import VideoPlayer from "./VideoPlayer";
import NarrativeScreen from "./NarrativeScreen";

interface VideoWeaponSelectionProps {
  scene: Scene;
  onComplete: () => void;
}

const WEAPONS_API_URL = "http://localhost:8082/weapons/starting";
const VIDEO_URL = "http://localhost:8082/static/video/chapter1/weapon_selection.mp4";

// Mock player names - in a real scenario, these would come from game context
const MOCK_PLAYERS = ["Darius", "Zornak"];

// Preload video component - hidden but starts buffering
const VideoPreloader = ({ url }: { url: string }) => (
  <video
    src={url}
    preload="auto"
    muted
    style={{ display: "none" }}
    aria-hidden="true"
  />
);

const VideoWeaponSelection = ({ scene, onComplete }: VideoWeaponSelectionProps) => {
  const [phase, setPhase] = useState<SelectionPhase>("loading");
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playerSelections, setPlayerSelections] = useState<PlayerSelection[]>([]);

  // Load weapons on mount
  useEffect(() => {
    const loadWeapons = async () => {
      try {
        const response = await axios.get<Weapon[]>(WEAPONS_API_URL);
        setWeapons(response.data);
        setPhase("selection");
      } catch (err) {
        console.error("Error loading weapons:", err);
        setError("Error al cargar las armas. Saltando escena...");
        // Skip to completion after error
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    };

    loadWeapons();
  }, [onComplete]);

  // Handle selection completion
  const handleSelectionComplete = useCallback((selections: PlayerSelection[]) => {
    setPlayerSelections(selections);
    console.log("Weapon selections:", selections);
    setPhase("video");
  }, []);

  // Handle video completion
  const handleVideoComplete = useCallback(() => {
    setPhase("narrative");
  }, []);

  // Handle narrative completion
  const handleNarrativeComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Loading Phase
  if (phase === "loading") {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-6" />
        <p className="font-display text-xl text-gold animate-pulse">
          Preparando el arsenal...
        </p>
        {error && (
          <p className="mt-4 font-body text-destructive">{error}</p>
        )}
      </div>
    );
  }

  // Selection Phase
  if (phase === "selection") {
    return (
      <>
        {/* Preload video while user selects weapons */}
        <VideoPreloader url={VIDEO_URL} />
        <WeaponSelector
          weapons={weapons}
          players={MOCK_PLAYERS}
          onComplete={handleSelectionComplete}
        />
      </>
    );
  }

  // Video Phase
  if (phase === "video") {
    return (
      <VideoPlayer
        videoUrl={VIDEO_URL}
        onComplete={handleVideoComplete}
      />
    );
  }

  // Narrative Phase
  if (phase === "narrative") {
    return (
      <NarrativeScreen
        text={scene.sceneText}
        duration={5000}
        onComplete={handleNarrativeComplete}
      />
    );
  }

  return null;
};

export default VideoWeaponSelection;
