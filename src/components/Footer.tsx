import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 bg-cream-deep pb-24 pt-10 text-ink md:pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
                🌅
              </span>
              <span className="font-display text-lg font-black text-ink">ますだ日和</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-ink-soft">
              益田の「今日・今週末・これから」を、大きな催しも続く小さな集まりも同じ場所で見つけられる地域活動ポータルです。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
            <div>
              <p className="font-display text-sm font-bold text-brand-600">使う</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li><Link to="/" className="hover:text-ink">今日・今週末の活動</Link></li>
                <li><Link to="/calendar" className="hover:text-ink">カレンダー</Link></li>
                <li><Link to="/continuous" className="hover:text-ink">継続活動まとめ</Link></li>
                <li><Link to="/guide" className="hover:text-ink">使い方ガイド</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-brand-600">発信する</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li><Link to="/post" className="hover:text-ink">活動を投稿する</Link></li>
                <li><Link to="/mypage" className="hover:text-ink">主催者マイページ</Link></li>
                <li><Link to="/about" className="hover:text-ink">運営について</Link></li>
                <li><Link to="/admin" className="hover:text-ink">運営管理画面（デモ）</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-soft/70">
          © 2026 ますだ日和運営事務局（本サイトはプロトタイプです。実際のイベント情報ではありません）
        </p>
      </div>
    </footer>
  );
}
