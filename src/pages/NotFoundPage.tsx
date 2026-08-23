import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl">🍂</span>
      <h1 className="mt-4 font-display text-xl font-black text-ink">ページが見つかりませんでした</h1>
      <p className="mt-2 text-sm text-ink-soft">お探しのページは移動または削除された可能性があります。</p>
      <Link to="/" className="mt-6 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600">
        トップへ戻る
      </Link>
    </div>
  );
}
