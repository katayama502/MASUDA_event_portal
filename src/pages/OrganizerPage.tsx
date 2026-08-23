import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { EventCard } from "../components/EventCard";
import { EmptyState } from "../components/EmptyState";
import { SectionHeading } from "../components/SectionHeading";

const SNS_LABEL: Record<string, string> = {
  instagram: "Instagram",
  x: "X (Twitter)",
  facebook: "Facebook",
  line: "LINE",
  website: "Webサイト",
};

export function OrganizerPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrganizer, eventsByOrganizer } = useAppData();

  if (!id) return <Navigate to="/" replace />;
  const organizer = getOrganizer(id);

  if (!organizer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-lg font-bold text-ink">主催者ページが見つかりませんでした</p>
        <Link to="/" className="mt-4 inline-block text-orange-600 hover:underline">
          トップに戻る
        </Link>
      </div>
    );
  }

  const published = eventsByOrganizer(organizer.id).filter((e) => e.status === "published");
  const continuous = published.filter((e) => e.type === "継続");
  const oneTime = published.filter((e) => e.type === "単発");
  const snsEntries = Object.entries(organizer.snsLinks).filter(([, v]) => Boolean(v));

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6">
      <section className="rounded-[2rem] bg-paper p-6 shadow-warm-sm ring-1 ring-orange-100/60 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl shadow-warm-sm"
            style={{ backgroundColor: organizer.logoColor }}
          >
            {organizer.logoEmoji}
          </span>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl font-black text-ink">
              {organizer.name}
              {organizer.verified && (
                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                  ✔️ 運営確認済み
                </span>
              )}
            </h1>
            {organizer.description && <p className="mt-2 max-w-xl text-sm text-ink-soft">{organizer.description}</p>}
          </div>
        </div>

        {(snsEntries.length > 0 || (organizer.contactPublic && organizer.contactEmail)) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {snsEntries.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full bg-orange-50 px-3.5 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
              >
                {SNS_LABEL[key] ?? key}
              </a>
            ))}
            {organizer.contactPublic && organizer.contactEmail && (
              <a
                href={`mailto:${organizer.contactEmail}`}
                className="rounded-full bg-orange-50 px-3.5 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
              >
                ✉️ お問い合わせ
              </a>
            )}
          </div>
        )}
      </section>

      {continuous.length > 0 && (
        <div className="mt-10">
          <SectionHeading eyebrow="Regular" title="継続活動" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {continuous.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <SectionHeading eyebrow="Events" title="単発の活動" />
        {oneTime.length === 0 ? (
          <EmptyState emoji="🗒️" title="現在掲載中の単発イベントはありません" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {oneTime.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
