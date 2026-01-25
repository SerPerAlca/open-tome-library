import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

const VideoPlayer = ({ videoUrl, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState<"loading" | "playing" | "error" | "waiting">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log("[VideoPlayer] Video can play, attempting autoplay...");
      setPlaybackState("waiting");
      
      video.play()
        .then(() => {
          console.log("[VideoPlayer] Autoplay successful");
          setPlaybackState("playing");
        })
        .catch((error) => {
          console.warn("[VideoPlayer] Autoplay blocked:", error.name, error.message);
          setPlaybackState("waiting");
        });
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      const error = videoEl.error;
      
      let message = "Error desconocido al cargar el video";
      
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            message = "La reproducción fue cancelada";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            message = "Error de red al cargar el video";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            message = "Error al decodificar el video (codec no soportado)";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            message = "Formato de video no soportado o archivo no encontrado (404)";
            break;
        }
        console.error("[VideoPlayer] Error:", error.code, error.message, message);
      }
      
      setErrorMessage(message);
      setPlaybackState("error");
    };

    const handleLoadStart = () => {
      console.log("[VideoPlayer] Loading started for:", videoUrl);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
    };
  }, [videoUrl]);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play()
      .then(() => {
        console.log("[VideoPlayer] Manual play successful");
        setPlaybackState("playing");
      })
      .catch((error) => {
        console.error("[VideoPlayer] Manual play failed:", error);
        setErrorMessage("No se pudo reproducir el video");
        setPlaybackState("error");
      });
  };

  const handleEnded = () => {
    console.log("[VideoPlayer] Video ended");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        playsInline
        preload="auto"
        onEnded={handleEnded}
      >
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Loading State */}
      {playbackState === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-6" />
          <p className="font-display text-xl text-gold animate-pulse">
            Cargando cinemática...
          </p>
        </div>
      )}

      {/* Waiting for User Interaction */}
      {playbackState === "waiting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-6">
          <p className="font-display text-2xl text-gold">
            Cinemática lista
          </p>
          <Button
            onClick={handleManualPlay}
            className="px-8 py-6 text-lg font-display uppercase tracking-wider bg-gold hover:bg-gold/90 text-black gap-3"
          >
            <Play className="w-6 h-6" />
            Reproducir Video
          </Button>
          <Button
            onClick={onComplete}
            variant="ghost"
            className="text-muted-foreground hover:text-white gap-2"
          >
            <SkipForward className="w-4 h-4" />
            Saltar Cinemática
          </Button>
        </div>
      )}

      {/* Error State */}
      {playbackState === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-6 p-8">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <p className="font-display text-2xl text-destructive text-center">
            Error de Video
          </p>
          <p className="font-body text-muted-foreground text-center max-w-md">
            {errorMessage}
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => {
                setPlaybackState("loading");
                setErrorMessage("");
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              variant="outline"
              className="gap-2"
            >
              Reintentar
            </Button>
            <Button
              onClick={onComplete}
              className="bg-gold hover:bg-gold/90 text-black gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Continuar sin Video
            </Button>
          </div>
        </div>
      )}

      {/* Skip Button (DEV + playing state) */}
      {import.meta.env.DEV && playbackState === "playing" && (
        <button
          onClick={onComplete}
          className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 
                     text-white font-body text-sm rounded transition-colors"
        >
          [DEV] Saltar Video
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
