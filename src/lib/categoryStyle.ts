import type { Category } from "../types";

interface CategoryStyle {
  icon: string;
  bg: string;
  text: string;
}

// 「#ヒキダシ」に倣い、カテゴリごとの背景色は使わず黒枠＋白地に統一。
// 見分けはアイコンのみで行う（色に頼らないシンプルな線画スタイル）。
export const CATEGORY_STYLE: Record<Category, CategoryStyle> = {
  "マルシェ・マーケット": { icon: "🧺", bg: "bg-white", text: "text-obsidian" },
  "ワークショップ・体験": { icon: "🎨", bg: "bg-white", text: "text-obsidian" },
  "親子・子育て": { icon: "🧸", bg: "bg-white", text: "text-obsidian" },
  "習い事・教室": { icon: "📚", bg: "bg-white", text: "text-obsidian" },
  "地域活動・ボランティア": { icon: "🤝", bg: "bg-white", text: "text-obsidian" },
  "スポーツ大会・体験": { icon: "🏃", bg: "bg-white", text: "text-obsidian" },
  "その他": { icon: "✨", bg: "bg-white", text: "text-obsidian" },
};
