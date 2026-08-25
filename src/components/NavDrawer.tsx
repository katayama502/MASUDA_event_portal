import { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";

interface NavLinkItem {
  to: string;
  label: string;
}

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLinkItem[];
  extraLinks?: NavLinkItem[];
}

/** 引き出し（ヒキダシ）のように右からスライドして開くモバイル用ナビゲーション */
function DrawerIcon() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M2 7L6.5 1.5H21.5L26 7V17.5C26 18.6 25.1 19.5 24 19.5H4C2.9 19.5 2 18.6 2 17.5V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M2 7H26" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="13" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function NavDrawer({ open, onClose, links, extraLinks = [] }: NavDrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // ヘッダーのbackdrop-blur（backdrop-filter）がfixed要素の包含ブロックを作ってしまい、
  // ドロワーがヘッダーの高さに閉じ込められるのを避けるため、bodyポータルで描画する。
  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="メニューを閉じる"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-obsidian/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className="animate-drawer-in absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream text-ink shadow-2xl"
      >
        <div className="flex items-center justify-between bg-teal-500 px-5 py-5 text-ink">
          <span className="flex items-center gap-2 font-display text-sm font-bold tracking-wide">
            <DrawerIcon />
            メニュー
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 hover:bg-white/70"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 font-display text-base font-bold transition-colors ${
                  isActive ? "bg-brand-500 text-white" : "text-ink hover:bg-cream-deep"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {extraLinks.length > 0 && (
            <div className="mt-3 flex flex-col gap-1 border-t border-ink/10 pt-3">
              {extraLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cream-deep"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-ink/10 px-5 py-4 text-xs text-ink-soft">
          ますだ日和 ・ 益田市地域活動ポータル
        </div>
      </div>
    </div>,
    document.body
  );
}
