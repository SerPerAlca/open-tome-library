import { useState } from "react";

interface HeroImageProps {
  name: string;
  className?: string;
}

const HeroImage = ({ name, className = "" }: HeroImageProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Build the image path: Y:\ETERNUM\APLICACION\static\image\[NAME].avif
  // For web access, we use a relative path assuming the static folder is served
  const imagePath = `http://localhost:8082/static/image/${name.toUpperCase()}.avif`;
  
  // Get first letter for fallback
  const initial = name.charAt(0).toUpperCase();
  
  // Generate a deterministic gradient based on the name
  const getGradientColors = (str: string) => {
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hash * 2) % 360;
    return [`hsl(${hue1}, 40%, 25%)`, `hsl(${hue2}, 35%, 35%)`];
  };
  
  const [color1, color2] = getGradientColors(name);

  if (imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
        style={{
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
        }}
      >
        <span className="font-display text-8xl text-gold/70 drop-shadow-lg">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={imagePath}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
      {/* Fallback behind image in case of partial load */}
      <div
        className="absolute inset-0 -z-10 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
        }}
      >
        <span className="font-display text-8xl text-gold/70 drop-shadow-lg">
          {initial}
        </span>
      </div>
    </div>
  );
};

export default HeroImage;
