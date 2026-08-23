import { Link } from "react-router-dom";
import type { EventItem } from "../types";
import { CategoryBadge } from "./CategoryBadge";
import { FavoriteButton } from "./FavoriteButton";
import { formatDateTimeRangeJp, relativeDayLabel } from "../lib/dateUtils";
import { useAppData } from "../context/AppDataContext";

export function EventCard({ event }: { event: EventItem }) {
  const { getOrganizer } = useAppData();
  const organizer = getOrganizer(event.organizerId);
  const relLabel = relativeDayLabel(event.startDateTime);

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-paper shadow-warm-sm ring-1 ring-orange-100/60 transition-all hover:-translate-y-0.5 hover:shadow-warm"
    >
      <div
        className="relative flex h-32 items-center justify-center text-5xl"
        style={{ backgroundColor: event.imageColor }}
      >
        <span aria-hidden>{event.imageEmoji}</span>
        <div className="absolute right-3 top-3">
          <FavoriteButton eventId={event.id} />
        </div>
        {event.type === "継続" && (
          <span className="absolute left-3 top-3 rounded-full bg-green-600/90 px-2.5 py-1 text-xs font-bold text-white">
            継続活動
          </span>
        )}
        {relLabel && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white">
            {relLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={event.category} />
          <span className="text-xs text-ink-soft">{event.area}地区</span>
        </div>
        <h3 className="font-display text-base font-bold leading-snug text-ink group-hover:text-orange-600">
          {event.title}
        </h3>
        <p className="text-sm font-medium text-orange-700">
          {event.type === "継続" && event.recurrenceRule ? `${event.recurrenceRule} ・ ` : ""}
          {formatDateTimeRangeJp(event.startDateTime, event.endDateTime)}
        </p>
        <p className="line-clamp-1 text-sm text-ink-soft">📍 {event.locationName}</p>
        {organizer && <p className="mt-auto line-clamp-1 pt-1 text-xs text-ink-soft">主催: {organizer.name}</p>}
      </div>
    </Link>
  );
}
