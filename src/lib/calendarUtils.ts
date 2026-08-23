import type { EventItem } from "../types";
import { nextOccurrencesFromRule, startOfDay } from "./dateUtils";

export interface CalendarOccurrence {
  event: EventItem;
  date: Date;
}

/** 指定した月（monthStart〜monthEndの範囲）に該当する開催回（単発＋継続の展開）を日付ごとにまとめる */
export function buildMonthOccurrences(
  events: EventItem[],
  monthStart: Date,
  monthEnd: Date
): Map<string, CalendarOccurrence[]> {
  const map = new Map<string, CalendarOccurrence[]>();

  const add = (event: EventItem, date: Date) => {
    const key = dateKey(date);
    const list = map.get(key) ?? [];
    list.push({ event, date });
    map.set(key, list);
  };

  for (const event of events) {
    if (event.status !== "published") continue;

    if (event.type === "単発") {
      const d = new Date(event.startDateTime);
      if (d >= monthStart && d <= monthEnd) add(event, d);
      continue;
    }

    if (event.recurrenceRule) {
      const occurrences = nextOccurrencesFromRule(event.recurrenceRule, event.startDateTime, monthStart, 10);
      for (const occ of occurrences) {
        if (occ >= monthStart && occ <= monthEnd) add(event, occ);
      }
    } else {
      const d = new Date(event.startDateTime);
      if (d >= monthStart && d <= monthEnd) add(event, d);
    }
  }

  return map;
}

export function dateKey(d: Date): string {
  const c = startOfDay(d);
  return `${c.getFullYear()}-${c.getMonth() + 1}-${c.getDate()}`;
}
