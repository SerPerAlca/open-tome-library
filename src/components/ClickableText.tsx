import { cn } from "@/lib/utils";

interface ClickableTextProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const ClickableText = ({ label, onClick, isLoading, className }: ClickableTextProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "inline-block text-burgundy hover:text-gold underline decoration-dotted",
        "underline-offset-4 transition-colors duration-200 cursor-pointer",
        "font-body italic disabled:opacity-50 disabled:cursor-wait",
        className
      )}
    >
      {isLoading ? "Cargando..." : label}
    </button>
  );
};

export default ClickableText;
