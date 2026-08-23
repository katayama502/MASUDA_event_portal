import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { CategoryBadge } from "../components/CategoryBadge";
import { EmptyState } from "../components/EmptyState";
import { formatDateTimeRangeJp } from "../lib/dateUtils";
import type { EventStatus } from "../types";

const STATUS_LABEL: Record<EventStatus, { label: string; className: string }> = {
  pending: { label: "承認待ち", className: "bg-sun-300/60 text-orange-700" },
  published: { label: "掲載中", className: "bg-green-100 text-green-700" },
  rejected: { label: "差し戻し", className: "bg-red-100 text-red-700" },
  archived: { label: "お休み中", className: "bg-cream-deep text-ink-soft" },
};

export function OrganizerDashboardPage() {
  const { organizers, eventsByOrganizer, toggleArchived, deleteEvent } = useAppData();
  const [organizerId, setOrganizerId] = useState(organizers[0]?.id ?? "");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const myEvents = useMemo(
    () =>
      organizerId
        ? eventsByOrganizer(organizerId).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [],
    [organizerId, eventsByOrganizer]
  );

  const stats = useMemo(
    () => ({
      total: myEvents.length,
      published: myEvents.filter((e) => e.status === "published").length,
      pending: myEvents.filter((e) => e.status === "pending").length,
      views: myEvents.reduce((sum, e) => sum + e.viewCount, 0),
    }),
    [myEvents]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6">
      <p className="text-xs font-bold uppercase tracking-wide text-orange-500">Organizer</p>
      <h1 className="mt-1 font-display text-2xl font-black text-ink">主催者マイページ</h1>
      <p className="mt-2 text-sm text-ink-soft">
        投稿した活動の状況を確認できます。本プロトタイプでは、以下から主催者を選んで表示します（実際はログインで自動的に絞り込まれます）。
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={organizerId}
          onChange={(e) => setOrganizerId(e.target.value)}
          className="rounded-full border border-orange-100 bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-warm-sm outline-none focus:border-orange-400"
        >
          {organizers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <Link to="/post" className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600">
          ＋ 新しい活動を投稿
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="投稿数" value={stats.total} />
        <StatCard label="掲載中" value={stats.published} />
        <StatCard label="承認待ち" value={stats.pending} />
        <StatCard label="累計閲覧数" value={stats.views} />
      </div>

      <div className="mt-8">
        {myEvents.length === 0 ? (
          <EmptyState emoji="📮" title="まだ投稿がありません" description="「＋ 新しい活動を投稿」から最初の活動を登録してみましょう。" />
        ) : (
          <ul className="flex flex-col gap-3">
            {myEvents.map((event) => {
              const status = STATUS_LABEL[event.status];
              const favoriteEstimate = Math.max(0, Math.round(event.viewCount / 6));
              return (
                <li key={event.id} className="rounded-2xl bg-paper p-4 shadow-warm-sm ring-1 ring-orange-100/60">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                        <CategoryBadge category={event.category} />
                      </div>
                      <Link to={`/events/${event.id}`} className="mt-1.5 block font-display text-sm font-bold text-ink hover:text-orange-600">
                        {event.title}
                      </Link>
                      <p className="mt-1 text-xs text-ink-soft">
                        {formatDateTimeRangeJp(event.startDateTime, event.endDateTime)}
                        {event.recurrenceRule ? `（${event.recurrenceRule}）` : ""}
                      </p>
                      {event.status === "rejected" && event.moderationNote && (
                        <p className="mt-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
                          差し戻し理由: {event.moderationNote}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3 text-right text-xs text-ink-soft">
                      <div>
                        <p className="font-display text-base font-bold text-ink">{event.viewCount}</p>
                        <p>閲覧</p>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-ink">{favoriteEstimate}</p>
                        <p>お気に入り</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-orange-100 pt-3">
                    {event.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => toggleArchived(event.id)}
                        className="rounded-full border border-orange-200 px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-orange-50"
                      >
                        {event.status === "archived" ? "掲載を再開する" : "一時お休みにする"}
                      </button>
                    )}
                    {confirmDeleteId === event.id ? (
                      <>
                        <span className="self-center text-xs text-ink-soft">本当に削除しますか？</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteEvent(event.id);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600"
                        >
                          削除する
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-full border border-orange-200 px-3 py-1.5 text-xs font-bold text-ink-soft"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(event.id)}
                        className="rounded-full border border-orange-200 px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-orange-50"
                      >
                        削除する
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4 text-center">
      <p className="font-display text-2xl font-black text-orange-700">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-soft">{label}</p>
    </div>
  );
}
