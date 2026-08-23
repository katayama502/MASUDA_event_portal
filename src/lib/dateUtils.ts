import type { EventItem, QuickRange } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

const WEEKDAY_JP = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDateJp(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日(${WEEKDAY_JP[d.getDay()]})`;
}

export function formatDateShortJp(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAY_JP[d.getDay()]})`;
}

export function formatTimeJp(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function formatDateTimeRangeJp(startIso: string, endIso?: string): string {
  const datePart = formatDateJp(startIso);
  const startTime = formatTimeJp(startIso);
  if (!endIso) return `${datePart} ${startTime}〜`;
  const sameDay = startOfDay(new Date(startIso)).getTime() === startOfDay(new Date(endIso)).getTime();
  if (sameDay) {
    return `${datePart} ${startTime}〜${formatTimeJp(endIso)}`;
  }
  return `${datePart} ${startTime}〜${formatDateJp(endIso)} ${formatTimeJp(endIso)}`;
}

export function relativeDayLabel(iso: string, now: Date = new Date()): string | null {
  const target = startOfDay(new Date(iso)).getTime();
  const today = startOfDay(now).getTime();
  const diff = Math.round((target - today) / DAY_MS);
  if (diff === 0) return "本日";
  if (diff === 1) return "明日";
  if (diff > 1 && diff <= 6) return `${diff}日後`;
  return null;
}

/** イベント日時が指定のクイック範囲に含まれるか判定する */
export function isWithinQuickRange(event: EventItem, range: QuickRange, now: Date = new Date()): boolean {
  const start = new Date(event.startDateTime);
  const today = startOfDay(now);
  const dow = today.getDay(); // 0=日 ... 6=土

  if (range === "today") {
    return startOfDay(start).getTime() === today.getTime();
  }

  if (range === "weekend") {
    // 直近の土日（今日が土日ならそれも含む）
    const daysUntilSat = (6 - dow + 7) % 7;
    const sat = addDays(today, daysUntilSat);
    const sun = addDays(sat, 1);
    const t = startOfDay(start).getTime();
    return t === sat.getTime() || t === sun.getTime();
  }

  if (range === "week") {
    // 本日から今週日曜まで（今日を含む直近7日以内の今週分）
    const daysUntilSun = (7 - dow) % 7;
    const end = addDays(today, daysUntilSun === 0 ? 0 : daysUntilSun);
    const t = startOfDay(start).getTime();
    return t >= today.getTime() && t <= end.getTime();
  }

  // month: 今後1か月
  const end = addDays(today, 30);
  const t = startOfDay(start).getTime();
  return t >= today.getTime() && t <= end.getTime();
}

export function isUpcoming(event: EventItem, now: Date = new Date()): boolean {
  const end = event.endDateTime ? new Date(event.endDateTime) : new Date(event.startDateTime);
  return end.getTime() >= startOfDay(now).getTime();
}

const WEEKDAY_PATTERN = /毎週([月火水木金土日])/;
const MONTHLY_NTH_PATTERN = /毎月第([1-5１-５一二三四五])([月火水木金土日])/;

const KANJI_NUM: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5 };
const WEEKDAY_INDEX: Record<string, number> = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };

function parseOrdinal(token: string): number {
  if (KANJI_NUM[token]) return KANJI_NUM[token];
  const fullWidth = "１２３４５".indexOf(token);
  if (fullWidth >= 0) return fullWidth + 1;
  return parseInt(token, 10);
}

/** 「毎週土曜」「毎月第2土曜」等の簡易ルールから、指定範囲内の次回開催日をざっくり算出する */
export function nextOccurrencesFromRule(
  rule: string,
  fallbackIso: string,
  fromDate: Date,
  count: number
): Date[] {
  const results: Date[] = [];
  const from = startOfDay(fromDate);

  const weeklyMatch = rule.match(WEEKDAY_PATTERN);
  if (weeklyMatch) {
    const targetDow = WEEKDAY_INDEX[weeklyMatch[1]];
    const fallbackTime = new Date(fallbackIso);
    let cursor = new Date(from);
    while (cursor.getDay() !== targetDow) cursor = addDays(cursor, 1);
    for (let i = 0; i < count; i++) {
      const occ = addDays(cursor, i * 7);
      occ.setHours(fallbackTime.getHours(), fallbackTime.getMinutes(), 0, 0);
      results.push(occ);
    }
    return results;
  }

  const monthlyMatch = rule.match(MONTHLY_NTH_PATTERN);
  if (monthlyMatch) {
    const nth = parseOrdinal(monthlyMatch[1]);
    const targetDow = WEEKDAY_INDEX[monthlyMatch[2]];
    const fallbackTime = new Date(fallbackIso);
    let monthCursor = new Date(from.getFullYear(), from.getMonth(), 1);
    let guard = 0;
    while (results.length < count && guard < 24) {
      const occ = nthWeekdayOfMonth(monthCursor.getFullYear(), monthCursor.getMonth(), targetDow, nth);
      if (occ && occ.getTime() >= from.getTime()) {
        occ.setHours(fallbackTime.getHours(), fallbackTime.getMinutes(), 0, 0);
        results.push(occ);
      }
      monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
      guard++;
    }
    return results;
  }

  // パターン未対応の場合はfallback日時のみ返す
  results.push(new Date(fallbackIso));
  return results;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date | null {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  const candidate = new Date(year, month, day);
  if (candidate.getMonth() !== month) return null;
  return candidate;
}
