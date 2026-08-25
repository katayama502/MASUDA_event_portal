import { AREAS, CATEGORIES } from "../types";
import type { Area, Category } from "../types";
import { CATEGORY_STYLE } from "../lib/categoryStyle";

interface FilterBarProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  category: Category | null;
  onCategoryChange: (v: Category | null) => void;
  area: Area | null;
  onAreaChange: (v: Area | null) => void;
}

export function FilterBar({
  keyword,
  onKeywordChange,
  category,
  onCategoryChange,
  area,
  onAreaChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">🔍</span>
        <input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="キーワードで探す（例: マルシェ、子ども、匹見）"
          className="w-full rounded-2xl bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-warm-sm outline-none placeholder:text-ink-soft/70 focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        <select
          value={area ?? ""}
          onChange={(e) => onAreaChange((e.target.value || null) as Area | null)}
          className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-warm-sm outline-none focus:ring-2 focus:ring-brand-300"
        >
          <option value="">全地区</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}地区
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
            category === null ? "bg-obsidian text-white" : "bg-white text-ink-soft hover:bg-cream-deep"
          }`}
        >
          すべて
        </button>
        {CATEGORIES.map((c) => {
          const style = CATEGORY_STYLE[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(active ? null : c)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-obsidian text-white" : `${style.bg} ${style.text} hover:bg-cream-deep`
              }`}
            >
              <span aria-hidden>{style.icon}</span> {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
