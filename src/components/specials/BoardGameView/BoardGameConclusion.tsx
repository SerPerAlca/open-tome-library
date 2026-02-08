import { Trophy } from "lucide-react";

interface BoardGameConclusionProps {
  conclusion: string;
}

const BoardGameConclusion = ({ conclusion }: BoardGameConclusionProps) => {
  return (
    <div className="relative p-6 bg-gradient-to-br from-amber-200/60 to-amber-100/40 rounded-lg border-2 border-amber-700/40">
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 text-amber-700/40 text-lg">❧</div>
      <div className="absolute top-2 right-2 text-amber-700/40 text-lg transform scale-x-[-1]">❧</div>
      <div className="absolute bottom-2 left-2 text-amber-700/40 text-lg transform scale-y-[-1]">❧</div>
      <div className="absolute bottom-2 right-2 text-amber-700/40 text-lg transform scale-[-1]">❧</div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <Trophy className="w-6 h-6 text-amber-700" />
        <h3 className="font-display text-lg text-amber-900 font-bold uppercase tracking-wider">
          Condiciones de Victoria
        </h3>
        <Trophy className="w-6 h-6 text-amber-700" />
      </div>

      <p className="font-body text-center text-amber-800 text-lg leading-relaxed">
        {conclusion}
      </p>
    </div>
  );
};

export default BoardGameConclusion;
