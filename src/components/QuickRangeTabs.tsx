import type { QuickRange } from "../types";

const TABS: { key: QuickRange; label: string }[] = [
  { key: "today", label: "今日" },
  { key: "weekend", label: "今週末" },
  { key: "week", label: "今週" },
  { key: "month", label: "今後1か月" },
];

export function QuickRangeTabs({
  value,
  onChange,
}: {
  value: QuickRange | null;
  onChange: (v: QuickRange | null) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(active ? null : tab.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active ? "bg-brand-500 text-white shadow-warm-sm" : "bg-white text-ink-soft shadow-warm-sm hover:bg-cream-deep"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
