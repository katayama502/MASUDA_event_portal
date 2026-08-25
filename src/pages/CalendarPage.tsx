import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { SectionHeading } from "../components/SectionHeading";
import { EmptyState } from "../components/EmptyState";
import { CategoryBadge } from "../components/CategoryBadge";
import { buildMonthOccurrences, dateKey } from "../lib/calendarUtils";
import { formatTimeJp, startOfDay } from "../lib/dateUtils";

const WEEKDAY_JP = ["日", "月", "火", "水", "木", "金", "土"];

function buildGridDays(monthStart: Date): Date[] {
  const firstDow = monthStart.getDay();
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - firstDow);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

export function CalendarPage() {
  const { events } = useAppData();
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string>(dateKey(today));

  const monthStart = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const gridDays = useMemo(() => buildGridDays(monthStart), [monthStart]);

  const occurrenceMap = useMemo(() => {
    // グリッド全体（前後月の見切れ分含む）をカバーするため、少し広めの範囲で集計する
    const rangeStart = gridDays[0];
    const rangeEnd = gridDays[gridDays.length - 1];
    return buildMonthOccurrences(events, rangeStart, rangeEnd);
  }, [events, gridDays]);

  const selectedOccurrences = occurrenceMap.get(selectedKey) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:pt-10">
      <SectionHeading eyebrow="Calendar" title="月間カレンダー" />

      <div className="rounded-3xl bg-paper p-4 shadow-pop-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100"
            aria-label="前の月"
          >
            ‹
          </button>
          <p className="font-display text-lg font-black text-ink">
            {cursor.getFullYear()}年{cursor.getMonth() + 1}月
          </p>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100"
            aria-label="次の月"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-ink-soft">
          {WEEKDAY_JP.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {gridDays.map((day) => {
            const inMonth = day.getMonth() === monthStart.getMonth();
            const key = dateKey(day);
            const occ = occurrenceMap.get(key) ?? [];
            const isToday = key === dateKey(today);
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`flex min-h-16 flex-col items-center gap-1 rounded-xl border p-1.5 text-left transition-colors sm:min-h-20 ${
                  isSelected
                    ? "border-brand-400 bg-brand-50"
                    : "border-transparent hover:bg-brand-50/60"
                } ${!inMonth ? "opacity-40" : ""}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isToday ? "bg-brand-500 text-white" : "text-ink"
                  }`}
                >
                  {day.getDate()}
                </span>
                <div className="flex w-full flex-wrap justify-center gap-0.5">
                  {occ.slice(0, 3).map((o, i) => (
                    <span
                      key={`${o.event.id}-${i}`}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: o.event.imageColor }}
                    />
                  ))}
                  {occ.length > 3 && <span className="text-[9px] text-ink-soft">+{occ.length - 3}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <SectionHeading title={`${selectedKey.replace(/-/g, "/")} の活動`} />
        {selectedOccurrences.length === 0 ? (
          <EmptyState emoji="📭" title="この日に開催予定の活動はありません" />
        ) : (
          <ul className="flex flex-col gap-3">
            {selectedOccurrences
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((o, i) => (
                <li key={`${o.event.id}-${i}`}>
                  <Link
                    to={`/events/${o.event.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-paper p-3 shadow-pop-sm hover:shadow-pop"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ backgroundColor: o.event.imageColor }}
                    >
                      {o.event.imageEmoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-ink">{o.event.title}</p>
                      <p className="text-xs text-ink-soft">
                        {formatTimeJp(o.date.toISOString())}〜 ・ {o.event.locationName}
                      </p>
                    </div>
                    <CategoryBadge category={o.event.category} />
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
