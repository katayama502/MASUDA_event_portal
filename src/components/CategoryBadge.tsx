import type { Category } from "../types";
import { CATEGORY_STYLE } from "../lib/categoryStyle";

export function CategoryBadge({ category, size = "sm" }: { category: Category; size?: "sm" | "md" }) {
  const style = CATEGORY_STYLE[category];
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${style.bg} ${style.text} ${pad}`}>
      <span aria-hidden>{style.icon}</span>
      {category}
    </span>
  );
}
