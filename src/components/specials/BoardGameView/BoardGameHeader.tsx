interface BoardGameHeaderProps {
  title: string;
  context: string;
}

const BoardGameHeader = ({ title, context }: BoardGameHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      {/* Decorative top ornament */}
      <div className="flex justify-center mb-2">
        <span className="text-amber-700/60 text-2xl">❧ ❧ ❧</span>
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl text-amber-900 font-bold tracking-wide">
        {title}
      </h1>

      {/* Context */}
      <p className="font-body text-lg md:text-xl text-amber-800 italic leading-relaxed max-w-3xl mx-auto">
        {context}
      </p>

      {/* Decorative bottom ornament */}
      <div className="flex justify-center mt-2">
        <span className="text-amber-700/60 text-lg">✦ ✦ ✦</span>
      </div>
    </div>
  );
};

export default BoardGameHeader;
