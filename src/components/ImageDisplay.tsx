import { cn } from "@/lib/utils";

interface ImageDisplayProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

const ImageDisplay = ({ src, alt, caption, className }: ImageDisplayProps) => {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="ornament-border p-3 bg-paper/50 shadow-md">
        <div className="relative overflow-hidden border border-border">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto max-h-[50vh] object-contain"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 60%, hsl(var(--paper-dark) / 0.3) 100%)`,
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </div>

      {caption && (
        <figcaption className="mt-4 text-center">
          <p className="font-body text-sm italic text-muted-foreground">
            {caption}
          </p>
          <div className="divider-ornament mt-2 max-w-[200px] mx-auto">
            <span className="text-gold text-xs">✦</span>
          </div>
        </figcaption>
      )}
    </figure>
  );
};

export default ImageDisplay;
