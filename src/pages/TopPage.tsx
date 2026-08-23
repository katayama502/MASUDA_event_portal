import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { EventCard } from "../components/EventCard";
import { FilterBar } from "../components/FilterBar";
import { QuickRangeTabs } from "../components/QuickRangeTabs";
import { SectionHeading } from "../components/SectionHeading";
import { EmptyState } from "../components/EmptyState";
import { filterEvents } from "../lib/filterEvents";
import { isWithinQuickRange } from "../lib/dateUtils";
import type { Area, Category, QuickRange } from "../types";

export function TopPage() {
  const { events } = useAppData();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [range, setRange] = useState<QuickRange | null>(null);

  const filtered = useMemo(
    () => filterEvents(events, { keyword, category, area, quickRange: range }),
    [events, keyword, category, area, range]
  );

  const featured = useMemo(
    () => events.filter((e) => e.status === "published" && e.featured).slice(0, 6),
    [events]
  );

  const continuousThisWeek = useMemo(
    () =>
      events
        .filter((e) => e.status === "published" && e.type === "継続")
        .filter((e) => isWithinQuickRange(e, "week"))
        .slice(0, 6),
    [events]
  );

  const isFiltering = keyword.trim() !== "" || category !== null || area !== null || range !== null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pt-10">
      <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-500 to-sun-500 px-6 py-10 text-white shadow-warm sm:px-10 sm:py-14">
        <p className="font-display text-sm font-bold tracking-wide text-orange-50">益田市地域活動ポータル</p>
        <h1 className="mt-2 max-w-xl font-display text-2xl font-black leading-tight sm:text-4xl">
          益田で「今日・今週末・これから」
          <br />
          なにがあるかは、ここでわかる。
        </h1>
        <p className="mt-3 max-w-lg text-sm text-orange-50 sm:text-base">
          大きな催しも、続いている小さな集まりも、同じ場所で見つかる。マルシェ・ワークショップ・親子イベント・継続活動まで、益田の「今」を一望できます。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/post"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange-600 shadow-warm-sm transition-transform hover:-translate-y-0.5"
          >
            ＋ 自分の活動を投稿する
          </Link>
          <Link
            to="/continuous"
            className="rounded-full border border-white/70 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            継続活動を見る
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mb-10">
          <SectionHeading eyebrow="Pick up" title="運営イチオシの活動" />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {featured.map((event) => (
              <div key={event.id} className="w-64 shrink-0 snap-start sm:w-72">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}

      {continuousThisWeek.length > 0 && (
        <section className="mb-10">
          <SectionHeading
            eyebrow="Regular"
            title="今週の定例活動"
            action={
              <Link to="/continuous" className="text-sm font-bold text-orange-600 hover:underline">
                すべて見る →
              </Link>
            }
          />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {continuousThisWeek.map((event) => (
              <div key={event.id} className="w-64 shrink-0 snap-start sm:w-72">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeading eyebrow="Browse" title="活動をさがす" />
        <div className="flex flex-col gap-4">
          <FilterBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            category={category}
            onCategoryChange={setCategory}
            area={area}
            onAreaChange={setArea}
          />
          <QuickRangeTabs value={range} onChange={setRange} />
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <EmptyState
              emoji="🔎"
              title="条件に合う活動が見つかりませんでした"
              description={isFiltering ? "絞り込み条件を変えてみてください。" : "現在掲載中の活動がありません。"}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
