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
            className={`shrink-0 rounded-full border-2 border-obsidian px-4 py-2 text-sm font-bold transition-colors ${
              active ? "bg-orange-500 text-white" : "bg-white text-ink-soft hover:bg-cream-deep"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
