import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "ホーム", icon: "🏠", end: true },
  { to: "/calendar", label: "カレンダー", icon: "🗓️", end: false },
  { to: "/post", label: "投稿する", icon: "➕", end: false },
  { to: "/continuous", label: "継続活動", icon: "🔁", end: false },
  { to: "/mypage", label: "マイページ", icon: "👤", end: false },
];

export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-paper/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? "text-orange-600" : "text-ink-soft"
              }`
            }
          >
            <span className={`text-lg ${tab.to === "/post" ? "-mt-0.5" : ""}`} aria-hidden>
              {tab.icon}
            </span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
