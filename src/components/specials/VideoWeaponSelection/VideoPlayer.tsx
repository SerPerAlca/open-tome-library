import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

const VideoPlayer = ({ videoUrl, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to play video when mounted
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Video autoplay was prevented:", error);
        // If autoplay fails, complete immediately
        onComplete();
      });
    }
  }, [onComplete]);

  const handleEnded = () => {
    onComplete();
  };

  const handleError = () => {
    console.error("Video failed to load");
    // Skip to next phase if video fails
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        onEnded={handleEnded}
        onError={handleError}
      >
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Skip Button (optional, for development) */}
      {import.meta.env.DEV && (
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
