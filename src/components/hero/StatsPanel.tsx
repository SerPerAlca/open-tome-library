import { BaseStats, STAT_LABELS, STAT_ICONS } from "@/types/hero-api";

interface StatsPanelProps {
  stats: BaseStats;
}

const MAX_STAT_VALUE = 5;

const DiamondIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    className={`inline-block ${filled ? "text-gold" : "text-muted"}`}
  >
    <path
      d="M6 0 L12 6 L6 12 L0 6 Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const StatRow = ({ label, value, icon }: { label: string; value: number; icon: string }) => {
  const diamonds = Array.from({ length: MAX_STAT_VALUE }, (_, i) => i < value);

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="text-gold text-sm">{icon}</span>
        <span className="font-body text-sm text-foreground/90">{label}</span>
      </div>
      <div className="flex gap-0.5">
        {diamonds.map((filled, i) => (
          <DiamondIcon key={i} filled={filled} />
        ))}
      </div>
    </div>
  );
};

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const statEntries = Object.entries(stats) as [keyof BaseStats, number][];

  return (
    <div className="space-y-1">
      <h4 className="font-display text-lg text-gold text-center mb-3 border-b border-gold/30 pb-2">
        ⚔ Atributos Base ⚔
      </h4>
      {statEntries.map(([key, value]) => (
        <StatRow
          key={key}
          label={STAT_LABELS[key]}
          value={value}
          icon={STAT_ICONS[key]}
        />
      ))}
    </div>
  );
};

export default StatsPanel;
