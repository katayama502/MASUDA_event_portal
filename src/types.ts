export const CATEGORIES = [
  "マルシェ・マーケット",
  "ワークショップ・体験",
  "親子・子育て",
  "習い事・教室",
  "地域活動・ボランティア",
  "スポーツ大会・体験",
  "その他",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const AREAS = ["益田", "匹見", "美都", "北仙道"] as const;

export type Area = (typeof AREAS)[number];

export type EventType = "単発" | "継続";

export type EventStatus = "pending" | "published" | "rejected" | "archived";

export interface SnsLinks {
  instagram?: string;
  x?: string;
  facebook?: string;
  line?: string;
  website?: string;
}

export interface Organizer {
  id: string;
  name: string;
  description: string;
  contactEmail?: string;
  contactPublic: boolean;
  snsLinks: SnsLinks;
  logoEmoji: string;
  logoColor: string;
  verified: boolean;
  createdAt: string;
}

export interface EventItem {
  id: string;
  organizerId: string;
  title: string;
  category: Category;
  type: EventType;
  description: string;
  recurrenceRule?: string;
  startDateTime: string;
  endDateTime?: string;
  area: Area;
  locationName: string;
  locationAddress: string;
  targetAudience: string;
  fee: string;
  capacity?: number;
  applicationMethod: string;
  imageEmoji: string;
  imageColor: string;
  imageUrl?: string;
  imageAlt?: string;
  status: EventStatus;
  featured: boolean;
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface ReportItem {
  id: string;
  eventId: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

export type QuickRange = "today" | "weekend" | "week" | "month";
