import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
}

interface BookMenuProps {
  items: MenuItem[];
  onSelect?: (id: string) => void;
  className?: string;
}

const BookMenu = ({ items, onSelect, className }: BookMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedItem(id);
    setIsOpen(false);
    onSelect?.(id);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 font-display text-sm",
          "bg-paper/80 border border-border rounded-sm",
          "text-ink hover:bg-paper transition-colors duration-200",
          "shadow-sm"
        )}
      >
        <span className="text-gold">☙</span>
        <span>Índice</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 w-48 z-50",
            "bg-paper border border-border rounded-sm shadow-lg",
            "animate-fade-in overflow-hidden"
          )}
        >
          <div className="px-4 py-2 border-b border-border bg-muted/30">
            <span className="font-display text-xs text-muted-foreground uppercase tracking-wider">
              Capítulos
            </span>
          </div>

          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={cn(
                  "menu-item w-full text-left flex items-center gap-2",
                  selectedItem === item.id && "bg-muted/50 text-burgundy"
                )}
              >
                {item.icon && <span>{item.icon}</span>}
                <span className="font-body">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="px-4 py-1 border-t border-border text-center">
            <span className="text-gold text-sm">❧</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookMenu;
