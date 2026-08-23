import type { Category } from "../types";

interface CategoryStyle {
  icon: string;
  bg: string;
  text: string;
}

export const CATEGORY_STYLE: Record<Category, CategoryStyle> = {
  "マルシェ・マーケット": { icon: "🧺", bg: "bg-orange-100", text: "text-orange-700" },
  "ワークショップ・体験": { icon: "🎨", bg: "bg-sun-300/50", text: "text-orange-700" },
  "親子・子育て": { icon: "🧸", bg: "bg-sun-300/50", text: "text-orange-700" },
  "習い事・教室": { icon: "📚", bg: "bg-sky-100", text: "text-ink" },
  "地域活動・ボランティア": { icon: "🤝", bg: "bg-green-100", text: "text-green-700" },
  "スポーツ大会・体験": { icon: "🏃", bg: "bg-sky-100", text: "text-ink" },
  "その他": { icon: "✨", bg: "bg-cream-deep", text: "text-ink-soft" },
};
