const MAX_BASE_STAT = 255;

export const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

export default function StatBar({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  const percent = Math.min((value / MAX_BASE_STAT) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-slate-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="w-9 shrink-0 text-right text-sm font-semibold tabular-nums">
        {value}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
