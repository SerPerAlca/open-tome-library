import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bug, X, ChevronUp, ChevronDown } from "lucide-react";

interface DevToolsProps {
  currentSceneId: number | null;
  onJumpToScene: (sceneId: number) => void;
}

const DevTools = ({ currentSceneId, onJumpToScene }: DevToolsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sceneId, setSceneId] = useState("");

  // Keyboard shortcut to toggle visibility (press 'D' key)
  useEffect(() => {
    // Only add listener in development
    if (import.meta.env.PROD) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key.toLowerCase() === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleJump = useCallback(() => {
    const id = parseInt(sceneId, 10);
    if (!isNaN(id) && id > 0) {
      onJumpToScene(id);
      setSceneId("");
    }
  }, [sceneId, onJumpToScene]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJump();
    }
  }, [handleJump]);

  // Only render in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/85 backdrop-blur-sm text-white rounded-lg shadow-xl border border-white/20 overflow-hidden min-w-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/10 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold tracking-wide">DEV TOOLS</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(prev => !prev)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-3 space-y-3">
          {/* Current Scene Info */}
          <div className="text-xs text-white/60">
            Escena actual: <span className="text-green-400 font-mono">{currentSceneId ?? "—"}</span>
          </div>

          {/* Scene Jumper */}
          <div className="space-y-2">
            <label className="text-xs text-white/80 block">Saltar a escena:</label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                placeholder="ID"
                value={sceneId}
                onChange={(e) => setSceneId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-8 w-20 bg-white/10 border-white/20 text-white text-sm placeholder:text-white/40 focus:border-green-400"
              />
              <Button
                onClick={handleJump}
                disabled={!sceneId || isNaN(parseInt(sceneId, 10))}
                size="sm"
                className="h-8 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold"
              >
                SALTAR
              </Button>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="text-[10px] text-white/40 pt-1 border-t border-white/10">
            Pulsa <kbd className="px-1 py-0.5 bg-white/20 rounded text-white/60">D</kbd> para ocultar
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
