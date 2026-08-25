import type { Category } from "../types";

interface CategoryStyle {
  icon: string;
  bg: string;
  text: string;
}

// 「#ヒキダシ」の実サイトにある2種の淡い色ブロック（サーモンピンク／オリーブ）と
// ミント・ブランドブルーを合わせたパステル4色を、カテゴリごとに割り当てる。
export const CATEGORY_STYLE: Record<Category, CategoryStyle> = {
  "マルシェ・マーケット": { icon: "🧺", bg: "bg-salmon-100", text: "text-ink" },
  "ワークショップ・体験": { icon: "🎨", bg: "bg-lime-100", text: "text-ink" },
  "親子・子育て": { icon: "🧸", bg: "bg-brand-100", text: "text-ink" },
  "習い事・教室": { icon: "📚", bg: "bg-teal-100", text: "text-ink" },
  "地域活動・ボランティア": { icon: "🤝", bg: "bg-lime-100", text: "text-ink" },
  "スポーツ大会・体験": { icon: "🏃", bg: "bg-teal-100", text: "text-ink" },
  "その他": { icon: "✨", bg: "bg-salmon-100", text: "text-ink" },
};
