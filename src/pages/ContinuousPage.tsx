import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { EventCard } from "../components/EventCard";
import { SectionHeading } from "../components/SectionHeading";
import { EmptyState } from "../components/EmptyState";
import { AREAS } from "../types";
import type { Area } from "../types";

export function ContinuousPage() {
  const { events } = useAppData();
  const [area, setArea] = useState<Area | null>(null);

  const continuous = useMemo(() => {
    return events
      .filter((e) => e.status === "published" && e.type === "継続")
      .filter((e) => (area ? e.area === area : true))
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }, [events, area]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pt-10">
      <section className="mb-8 rounded-[2rem] bg-lime-300 px-6 py-8 text-ink shadow-pop sm:px-10 sm:py-10">
        <p className="font-display text-sm font-bold tracking-wide text-lime-700">Regular Activities</p>
        <h1 className="mt-2 font-display text-2xl font-black leading-tight text-ink sm:text-3xl">
          継続活動まとめ
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink/80 sm:text-base">
          毎週・毎月続いている習い事やサークル、子ども食堂、朝活などをまとめたコーナーです。単発イベントの陰に隠れがちな「地域の定番」に、ここで光を当てます。
        </p>
      </section>

      <SectionHeading
        title={`継続活動 ${continuous.length}件`}
        action={
          <select
            value={area ?? ""}
            onChange={(e) => setArea((e.target.value || null) as Area | null)}
            className="rounded-full bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-warm-sm outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">全地区</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}地区
              </option>
            ))}
          </select>
        }
      />

      {continuous.length === 0 ? (
        <EmptyState emoji="🔁" title="この地区の継続活動はまだありません" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {continuous.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
