import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NavDrawer } from "./NavDrawer";

const NAV_LINKS = [
  { to: "/", label: "トップ" },
  { to: "/calendar", label: "カレンダー" },
  { to: "/continuous", label: "継続活動" },
  { to: "/guide", label: "使い方" },
  { to: "/about", label: "運営について" },
];

const DRAWER_EXTRA_LINKS = [
  { to: "/mypage", label: "主催者ページ（マイダッシュボード）" },
  { to: "/admin", label: "運営管理画面（デモ）" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-obsidian bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-obsidian bg-orange-500 text-lg text-white shadow-pop-sm">
            🌅
          </span>
          <span className="font-display text-lg font-black tracking-tight text-ink">
            ますだ日和
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
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
            className="pop-pressable hidden rounded-full border-2 border-obsidian bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-pop-sm sm:inline-block"
          >
            ＋ 活動を投稿する
          </Link>
          <Link
            to="/mypage"
            className="hidden rounded-full border-2 border-obsidian bg-white px-3.5 py-2 text-sm font-bold text-obsidian transition-colors hover:bg-cream-deep lg:inline-block"
          >
            主催者ページ
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-obsidian bg-obsidian text-cream lg:hidden"
            aria-label="メニューを開く"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <NavDrawer open={open} onClose={() => setOpen(false)} links={NAV_LINKS} extraLinks={DRAWER_EXTRA_LINKS} />
    </header>
  );
}
