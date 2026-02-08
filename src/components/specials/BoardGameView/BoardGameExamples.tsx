import { BookOpen } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BoardGameExample } from "@/types/board-game";

interface BoardGameExamplesProps {
  examples: BoardGameExample[];
}

const BoardGameExamples = ({ examples }: BoardGameExamplesProps) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="flex justify-center">
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                       bg-amber-100/80 hover:bg-amber-200/80
                       border border-amber-600/40 hover:border-amber-600/60
                       text-amber-800 font-display text-sm
                       transition-all duration-200 cursor-pointer
                       shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            📖 Ver Situaciones de Juego
          </button>
        </HoverCardTrigger>
        
        <HoverCardContent 
          className="w-96 max-h-80 overflow-y-auto p-0 z-[100]"
          sideOffset={8}
          align="center"
        >
          <div className="bg-[#F5EBD8] border-2 border-amber-700/40 rounded-lg shadow-xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-amber-700/30 bg-amber-100/50">
              <h4 className="font-display text-amber-900 font-semibold text-center">
                Situaciones de Ejemplo
              </h4>
            </div>
            
            {/* Examples List */}
            <div className="p-4 space-y-4">
              {examples.map((example, index) => (
                <div 
                  key={index}
                  className="space-y-2 pb-3 border-b border-amber-600/20 last:border-0 last:pb-0"
                >
                  {/* Case - the situation */}
                  <p className="font-body text-sm text-amber-700/80 italic leading-relaxed">
                    {example.case}
                  </p>
                  
                  {/* Result - the outcome */}
                  <p className="font-body text-sm text-amber-900 font-semibold leading-relaxed">
                    → {example.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default BoardGameExamples;
