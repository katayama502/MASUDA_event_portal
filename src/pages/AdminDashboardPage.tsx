import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { CategoryBadge } from "../components/CategoryBadge";
import { EmptyState } from "../components/EmptyState";
import { formatDateTimeRangeJp } from "../lib/dateUtils";

type Tab = "pending" | "published" | "pickup" | "reports";

const TABS: { key: Tab; label: string }[] = [
  { key: "pending", label: "承認待ち" },
  { key: "published", label: "掲載中" },
  { key: "pickup", label: "ピックアップ設定" },
  { key: "reports", label: "通報一覧" },
];

export function AdminDashboardPage() {
  const { events, organizers, reports, getOrganizer, approveEvent, rejectEvent, toggleFeatured, resolveReport } =
    useAppData();
  const [tab, setTab] = useState<Tab>("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const pending = useMemo(
    () => events.filter((e) => e.status === "pending").sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [events]
  );
  const published = useMemo(() => events.filter((e) => e.status === "published"), [events]);
  const openReports = useMemo(() => reports.filter((r) => r.status === "open"), [reports]);
  const resolvedReports = useMemo(() => reports.filter((r) => r.status === "resolved"), [reports]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6">
      <div className="rounded-2xl border-2 border-obsidian bg-obsidian px-5 py-4 text-white shadow-pop">
        <p className="text-xs font-bold uppercase tracking-wide text-orange-500">Admin (デモ)</p>
        <h1 className="mt-0.5 font-display text-xl">運営管理画面</h1>
        <p className="mt-1 text-xs text-white/70">
          本来はadminロールのみアクセスできる非公開画面です。本プロトタイプでは動作確認のため誰でも閲覧できます。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="承認待ち" value={pending.length} accent="border-2 border-obsidian bg-orange-100 text-orange-700" />
        <StatPill label="掲載中" value={published.length} accent="border-2 border-obsidian bg-white text-obsidian" />
        <StatPill label="主催者数" value={organizers.length} accent="border-2 border-obsidian bg-white text-obsidian" />
        <StatPill label="未対応の通報" value={openReports.length} accent="border-2 border-obsidian bg-red-500 text-white" />
      </div>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto border-b border-orange-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-bold transition-colors ${
              tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
            {t.key === "pending" && pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] text-white">{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "pending" &&
          (pending.length === 0 ? (
            <EmptyState emoji="✅" title="承認待ちの投稿はありません" />
          ) : (
            <ul className="flex flex-col gap-3">
              {pending.map((event) => {
                const organizer = getOrganizer(event.organizerId);
                return (
                  <li key={event.id} className="rounded-2xl bg-paper p-4 border-2 border-obsidian shadow-pop-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge category={event.category} />
                          <span className="text-xs text-ink-soft">{event.area}地区・{event.type}</span>
                        </div>
                        <Link to={`/events/${event.id}`} className="mt-1.5 block font-display text-sm font-bold text-ink hover:text-orange-600">
                          {event.title}
                        </Link>
                        <p className="mt-1 text-xs text-ink-soft">
                          {formatDateTimeRangeJp(event.startDateTime, event.endDateTime)}
                        </p>
                        <p className="mt-1 text-xs text-ink-soft">主催者: {organizer?.name ?? "不明"}</p>
                      </div>
                    </div>

                    {rejectingId === event.id ? (
                      <div className="mt-3 rounded-xl bg-red-50 p-3">
                        <label className="text-xs font-bold text-red-700">差し戻し理由（主催者に表示されます）</label>
                        <textarea
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                          rows={2}
                          className="mt-1.5 w-full rounded-lg border border-red-200 bg-white p-2 text-sm outline-none focus:border-red-400"
                          placeholder="例: 開催場所の詳細住所を追記してください"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              rejectEvent(event.id, rejectNote.trim() || "内容をご確認のうえ再度ご投稿ください。");
                              setRejectingId(null);
                              setRejectNote("");
                            }}
                            className="rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-600"
                          >
                            差し戻す
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingId(null)}
                            className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-700"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => approveEvent(event.id)}
                          className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                        >
                          承認して公開
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingId(event.id)}
                          className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                        >
                          差し戻す
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}

        {tab === "published" &&
          (published.length === 0 ? (
            <EmptyState emoji="🗂️" title="掲載中の投稿はまだありません" />
          ) : (
            <ul className="flex flex-col gap-2">
              {published.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3 border-2 border-obsidian shadow-pop-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <CategoryBadge category={event.category} />
                    <Link to={`/events/${event.id}`} className="truncate text-sm font-bold text-ink hover:text-orange-600">
                      {event.title}
                    </Link>
                    <span className="shrink-0 text-xs text-ink-soft">{event.area}地区</span>
                  </div>
                  <span className="shrink-0 text-xs text-ink-soft">閲覧 {event.viewCount}</span>
                </li>
              ))}
            </ul>
          ))}

        {tab === "pickup" && (
          <div>
            <p className="mb-3 text-sm text-ink-soft">
              トップページの「運営イチオシの活動」に表示する投稿を手動で設定できます。
            </p>
            <ul className="flex flex-col gap-2">
              {published.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3 border-2 border-obsidian shadow-pop-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <CategoryBadge category={event.category} />
                    <span className="truncate text-sm font-bold text-ink">{event.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(event.id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      event.featured ? "bg-sun-500 text-white" : "border border-orange-200 text-ink-soft hover:bg-orange-50"
                    }`}
                  >
                    {event.featured ? "★ ピックアップ中" : "☆ ピックアップにする"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "reports" && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-bold text-ink">未対応 ({openReports.length})</p>
              {openReports.length === 0 ? (
                <p className="text-sm text-ink-soft">未対応の通報はありません。</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {openReports.map((r) => {
                    const event = events.find((e) => e.id === r.eventId);
                    return (
                      <li key={r.id} className="rounded-xl bg-red-50 p-3">
                        <p className="text-sm font-bold text-ink">{event?.title ?? "（削除済みの投稿）"}</p>
                        <p className="mt-1 text-sm text-ink-soft">{r.reason}</p>
                        <button
                          type="button"
                          onClick={() => resolveReport(r.id)}
                          className="mt-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white hover:bg-ink/90"
                        >
                          対応済みにする
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {resolvedReports.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-bold text-ink-soft">対応済み ({resolvedReports.length})</p>
                <ul className="flex flex-col gap-2">
                  {resolvedReports.map((r) => {
                    const event = events.find((e) => e.id === r.eventId);
                    return (
                      <li key={r.id} className="rounded-xl bg-cream-deep p-3 opacity-70">
                        <p className="text-sm font-bold text-ink">{event?.title ?? "（削除済みの投稿）"}</p>
                        <p className="mt-1 text-sm text-ink-soft">{r.reason}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${accent}`}>
      <p className="font-display text-2xl font-black">{value}</p>
      <p className="mt-0.5 text-xs font-medium">{label}</p>
    </div>
  );
}
