import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { EventCard } from "../components/EventCard";
import { FilterBar } from "../components/FilterBar";
import { QuickRangeTabs } from "../components/QuickRangeTabs";
import { SectionHeading } from "../components/SectionHeading";
import { EmptyState } from "../components/EmptyState";
import { Marquee } from "../components/Marquee";
import { filterEvents } from "../lib/filterEvents";
import { isWithinQuickRange } from "../lib/dateUtils";
import type { Area, Category, QuickRange } from "../types";

export function TopPage() {
  const { events, organizers } = useAppData();
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

  const publishedEvents = useMemo(() => events.filter((e) => e.status === "published"), [events]);
  const stats = [
    { value: publishedEvents.length, label: "掲載中の活動" },
    { value: publishedEvents.filter((e) => e.type === "継続").length, label: "継続活動" },
    { value: organizers.length, label: "参加団体・店舗" },
    { value: 4, label: "対応エリア" },
  ];

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden bg-paper pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="relative mx-auto max-w-6xl px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-1.5 font-display text-xs font-bold text-white sm:text-sm">
            #ますだ日和
          </span>
          <h1 className="mt-4 max-w-xl font-display text-3xl font-black leading-tight text-obsidian sm:text-5xl">
            益田で「今日・今週末・これから」
            <br />
            なにがあるかは、ここでわかる。
          </h1>
          <p className="mt-4 max-w-lg text-sm text-ink-soft sm:text-base">
            大きな催しも、続いている小さな集まりも、同じ場所で見つかる。マルシェ・ワークショップ・親子イベント・継続活動まで、益田の「今」を一望できます。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/post"
              className="pop-pressable rounded-full bg-brand-500 px-5 py-2.5 font-display text-sm font-bold text-white shadow-pop"
            >
              ＋ 自分の活動を投稿する
            </Link>
            <Link
              to="/continuous"
              className="pop-pressable rounded-full bg-teal-500 px-5 py-2.5 font-display text-sm font-bold text-ink shadow-pop"
            >
              継続活動を見る
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-teal-500 text-ink">
        <Marquee text="#ますだ日和 ・ MASUDA HIYORI ・ 益田市地域活動ポータル" />
      </div>

      <div className="bg-salmon-100 py-8 text-ink">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-black text-brand-600 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-ink-soft sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8">
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
              <Link to="/continuous" className="text-sm font-bold text-brand-600 hover:underline">
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
    </div>
  );
}
