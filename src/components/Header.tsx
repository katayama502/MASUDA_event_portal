import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "トップ" },
  { to: "/calendar", label: "カレンダー" },
  { to: "/continuous", label: "継続活動" },
  { to: "/guide", label: "使い方" },
  { to: "/about", label: "運営について" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-lg text-white shadow-warm-sm">
            🌅
          </span>
          <span className="font-display text-lg font-black tracking-tight text-ink">
            ますだ日和
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-orange-100 text-orange-700" : "text-ink-soft hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/post"
            className="hidden rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-warm-sm transition-colors hover:bg-orange-600 sm:inline-block"
          >
            ＋ 活動を投稿する
          </Link>
          <Link
            to="/mypage"
            className="hidden rounded-full border border-orange-200 px-3.5 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-50 md:inline-block"
          >
            主催者ページ
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-orange-100 md:hidden"
            aria-label="メニューを開く"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-orange-100 bg-cream px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                    isActive ? "bg-orange-100 text-orange-700" : "text-ink-soft"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/mypage"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft"
            >
              主催者ページ（マイダッシュボード）
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft"
            >
              運営管理画面（デモ）
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
