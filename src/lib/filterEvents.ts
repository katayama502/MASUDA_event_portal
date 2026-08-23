import type { Area, Category, EventItem, EventType, QuickRange } from "../types";
import { isUpcoming, isWithinQuickRange } from "./dateUtils";

export interface EventFilters {
  keyword?: string;
  category?: Category | null;
  area?: Area | null;
  quickRange?: QuickRange | null;
  type?: EventType | null;
}

export function filterEvents(events: EventItem[], filters: EventFilters, now: Date = new Date()): EventItem[] {
  const keyword = filters.keyword?.trim().toLowerCase();

  return events
    .filter((e) => e.status === "published")
    .filter((e) => isUpcoming(e, now))
    .filter((e) => (filters.category ? e.category === filters.category : true))
    .filter((e) => (filters.area ? e.area === filters.area : true))
    .filter((e) => (filters.type ? e.type === filters.type : true))
    .filter((e) => (filters.quickRange ? isWithinQuickRange(e, filters.quickRange, now) : true))
    .filter((e) => {
      if (!keyword) return true;
      const haystack = `${e.title} ${e.description} ${e.locationName} ${e.area} ${e.category}`.toLowerCase();
      return haystack.includes(keyword);
    })
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
}
