import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { CategoryBadge } from "../components/CategoryBadge";
import { FavoriteButton } from "../components/FavoriteButton";
import { EventCard } from "../components/EventCard";
import { SectionHeading } from "../components/SectionHeading";
import { formatDateTimeRangeJp } from "../lib/dateUtils";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getEvent, getOrganizer, eventsByOrganizer, events, registerView, addReport } = useAppData();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const event = id ? getEvent(id) : undefined;

  useEffect(() => {
    if (event) registerView(event.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  const organizer = event ? getOrganizer(event.organizerId) : undefined;

  const related = useMemo(() => {
    if (!event) return [];
    const sameOrganizer = eventsByOrganizer(event.organizerId).filter(
      (e) => e.id !== event.id && e.status === "published"
    );
    const sameCategory = events.filter(
      (e) => e.id !== event.id && e.status === "published" && e.category === event.category && e.organizerId !== event.organizerId
    );
    return [...sameOrganizer, ...sameCategory].slice(0, 3);
  }, [event, eventsByOrganizer, events]);

  if (!id) return <Navigate to="/" replace />;
  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-lg font-bold text-ink">この活動は見つかりませんでした</p>
        <Link to="/" className="mt-4 inline-block text-orange-600 hover:underline">
          トップに戻る
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function submitReport() {
    if (!reportReason.trim()) return;
    addReport(event!.id, reportReason.trim());
    setReportSent(true);
    setReportReason("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <Link to="/" className="text-sm font-medium text-ink-soft hover:text-orange-600">
        ← 一覧に戻る
      </Link>

      <div
        className="relative mt-4 flex h-56 items-center justify-center overflow-hidden rounded-3xl border-2 border-obsidian text-7xl shadow-pop sm:h-72"
        style={{ backgroundColor: event.imageColor }}
      >
        {event.imageUrl && !imgFailed ? (
          <img
            src={event.imageUrl}
            alt={event.imageAlt ?? event.title}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{event.imageEmoji}</span>
        )}
        <div className="absolute right-4 top-4">
          <FavoriteButton eventId={event.id} />
        </div>
        {event.type === "継続" && (
          <span className="absolute left-4 top-4 rounded-full border-2 border-obsidian bg-white px-3 py-1.5 text-sm font-bold text-obsidian">
            継続活動
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <CategoryBadge category={event.category} size="md" />
        <span className="text-sm text-ink-soft">{event.area}地区</span>
      </div>

      <h1 className="mt-3 font-display text-2xl font-black leading-snug text-ink sm:text-3xl">{event.title}</h1>

      <div className="mt-5 grid grid-cols-1 gap-3 rounded-3xl border-2 border-obsidian bg-orange-50 p-5 sm:grid-cols-2">
        <InfoRow icon="🗓️" label="日時" value={formatDateTimeRangeJp(event.startDateTime, event.endDateTime)} />
        {event.recurrenceRule && <InfoRow icon="🔁" label="開催頻度" value={event.recurrenceRule} />}
        <InfoRow icon="📍" label="場所" value={`${event.locationName}（${event.locationAddress}）`} />
        <InfoRow icon="🙋" label="対象" value={event.targetAudience} />
        <InfoRow icon="💰" label="参加費" value={event.fee} />
        {event.capacity && <InfoRow icon="👥" label="定員" value={`${event.capacity}名`} />}
        <InfoRow icon="📝" label="申込方法" value={event.applicationMethod} />
      </div>

      <div className="mt-6">
        <h2 className="font-display text-lg font-bold text-ink">活動について</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{event.description}</p>
      </div>

      {organizer && (
        <Link
          to={`/organizers/${organizer.id}`}
          className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-obsidian bg-paper p-4 shadow-pop-sm hover:shadow-pop"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: organizer.logoColor }}
          >
            {organizer.logoEmoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-display text-sm font-bold text-ink">
              {organizer.name}
              {organizer.verified && <span className="text-xs text-orange-500" title="運営確認済み">✔️</span>}
            </p>
            <p className="line-clamp-1 text-xs text-ink-soft">主催者ページを見る →</p>
          </div>
        </Link>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: event.title, url: shareUrl }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl);
            }
          }}
          className="rounded-full border-2 border-obsidian bg-obsidian px-4 py-2 text-sm font-bold text-white hover:bg-obsidian-soft"
        >
          🔗 シェアする
        </button>
        <button
          type="button"
          onClick={() => setReportOpen((v) => !v)}
          className="rounded-full border-2 border-obsidian px-4 py-2 text-sm font-medium text-ink-soft hover:bg-orange-50"
        >
          ⚠️ 情報の誤りを報告する
        </button>
      </div>

      {reportOpen && (
        <div className="mt-4 rounded-2xl border-2 border-obsidian bg-orange-50 p-4">
          {reportSent ? (
            <p className="text-sm font-bold text-obsidian">
              ご報告ありがとうございます。運営が内容を確認します。
            </p>
          ) : (
            <>
              <label className="text-sm font-bold text-ink" htmlFor="report-reason">
                どのような誤りがありましたか？
              </label>
              <textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-orange-200 bg-white p-3 text-sm outline-none focus:border-orange-400"
                placeholder="例: 開催時間が終了しているイベントが掲載されています"
              />
              <button
                type="button"
                onClick={submitReport}
                disabled={!reportReason.trim()}
                className="mt-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                この内容で報告する
              </button>
            </>
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10">
          <SectionHeading title="関連する活動" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <EventCard key={r.id} event={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold text-orange-600">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
