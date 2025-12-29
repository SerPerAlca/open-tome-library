import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BookPageProps {
  children: ReactNode;
  side: "left" | "right";
  className?: string;
}

const BookPage = ({ children, side, className }: BookPageProps) => {
  return (
    <div className="relative flex h-full">
      {side === "left" && (
        <div className="book-spine-right w-[var(--spine-width)] h-full order-2 flex-shrink-0" />
      )}
      {side === "right" && (
        <div className="book-spine-left w-[var(--spine-width)] h-full order-first flex-shrink-0" />
      )}

      <div
        className={cn(
          "flex-1 paper-texture paper-aged relative",
          side === "left" ? "page-shadow-left order-1" : "page-shadow-right order-2",
          className
        )}
      >
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1",
            side === "left" ? "right-0" : "left-0"
          )}
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 8px,
              hsl(var(--border)) 8px,
              hsl(var(--border)) 9px
            )`,
          }}
        />

        <div className="relative z-10 h-full p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
