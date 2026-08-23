import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { EventItem, EventStatus, Organizer, ReportItem } from "../types";
import { events as seedEvents, organizers as seedOrganizers, reports as seedReports } from "../data/mockData";
import { loadJson, saveJson } from "../lib/storage";

interface NewEventInput {
  title: string;
  category: EventItem["category"];
  type: EventItem["type"];
  description: string;
  recurrenceRule?: string;
  startDateTime: string;
  endDateTime?: string;
  area: EventItem["area"];
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
  organizerId?: string;
  newOrganizerName?: string;
  newOrganizerContact?: string;
}

interface AppDataValue {
  events: EventItem[];
  organizers: Organizer[];
  reports: ReportItem[];
  favorites: string[];
  getOrganizer: (id: string) => Organizer | undefined;
  getEvent: (id: string) => EventItem | undefined;
  eventsByOrganizer: (organizerId: string) => EventItem[];
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  submitEvent: (input: NewEventInput) => EventItem;
  approveEvent: (eventId: string) => void;
  rejectEvent: (eventId: string, note: string) => void;
  toggleFeatured: (eventId: string) => void;
  toggleArchived: (eventId: string) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  deleteEvent: (eventId: string) => void;
  registerView: (eventId: string) => void;
  addReport: (eventId: string, reason: string) => void;
  resolveReport: (reportId: string) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// モックデータの形（写真フィールドの追加など）が変わるたびに末尾のバージョンを上げ、
// 古いlocalStorageのキャッシュが新しいシードデータを覆い隠さないようにする。
const DATA_VERSION = "v2";

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(() => loadJson(`events:${DATA_VERSION}`, seedEvents));
  const [organizers, setOrganizers] = useState<Organizer[]>(() =>
    loadJson(`organizers:${DATA_VERSION}`, seedOrganizers)
  );
  const [reports, setReports] = useState<ReportItem[]>(() => loadJson(`reports:${DATA_VERSION}`, seedReports));
  const [favorites, setFavorites] = useState<string[]>(() => loadJson("favorites", [] as string[]));

  useEffect(() => saveJson(`events:${DATA_VERSION}`, events), [events]);
  useEffect(() => saveJson(`organizers:${DATA_VERSION}`, organizers), [organizers]);
  useEffect(() => saveJson(`reports:${DATA_VERSION}`, reports), [reports]);
  useEffect(() => saveJson("favorites", favorites), [favorites]);

  const getOrganizer = useCallback(
    (id: string) => organizers.find((o) => o.id === id),
    [organizers]
  );

  const getEvent = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  const eventsByOrganizer = useCallback(
    (organizerId: string) => events.filter((e) => e.organizerId === organizerId),
    [events]
  );

  const isFavorite = useCallback((eventId: string) => favorites.includes(eventId), [favorites]);

  const toggleFavorite = useCallback((eventId: string) => {
    setFavorites((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  }, []);

  const submitEvent = useCallback((input: NewEventInput): EventItem => {
    let organizerId = input.organizerId;
    if (!organizerId && input.newOrganizerName) {
      const newOrganizer: Organizer = {
        id: makeId("org"),
        name: input.newOrganizerName,
        description: "",
        contactEmail: input.newOrganizerContact,
        contactPublic: false,
        snsLinks: {},
        logoEmoji: "🙂",
        logoColor: "var(--color-orange-100)",
        verified: false,
        createdAt: new Date().toISOString(),
      };
      setOrganizers((prev) => [...prev, newOrganizer]);
      organizerId = newOrganizer.id;
    }

    const now = new Date().toISOString();
    const newEvent: EventItem = {
      id: makeId("evt"),
      organizerId: organizerId ?? "org-unknown",
      title: input.title,
      category: input.category,
      type: input.type,
      description: input.description,
      recurrenceRule: input.type === "継続" ? input.recurrenceRule : undefined,
      startDateTime: input.startDateTime,
      endDateTime: input.endDateTime,
      area: input.area,
      locationName: input.locationName,
      locationAddress: input.locationAddress,
      targetAudience: input.targetAudience,
      fee: input.fee,
      capacity: input.capacity,
      applicationMethod: input.applicationMethod,
      imageEmoji: input.imageEmoji || "📌",
      imageColor: input.imageColor || "var(--color-orange-100)",
      imageUrl: input.imageUrl?.trim() || undefined,
      imageAlt: input.imageAlt?.trim() || undefined,
      status: "pending",
      featured: false,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
    };

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: EventStatus) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status, updatedAt: new Date().toISOString() } : e))
    );
  }, []);

  const approveEvent = useCallback(
    (eventId: string) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, status: "published", moderationNote: undefined, updatedAt: new Date().toISOString() }
            : e
        )
      );
    },
    []
  );

  const rejectEvent = useCallback((eventId: string, note: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, status: "rejected", moderationNote: note, updatedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const toggleFeatured = useCallback((eventId: string) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, featured: !e.featured } : e)));
  }, []);

  const toggleArchived = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, status: e.status === "archived" ? "published" : "archived", updatedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

  const registerView = useCallback((eventId: string) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, viewCount: e.viewCount + 1 } : e)));
  }, []);

  const addReport = useCallback((eventId: string, reason: string) => {
    const report: ReportItem = {
      id: makeId("rep"),
      eventId,
      reason,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [report, ...prev]);
  }, []);

  const resolveReport = useCallback((reportId: string) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r)));
  }, []);

  const value = useMemo<AppDataValue>(
    () => ({
      events,
      organizers,
      reports,
      favorites,
      getOrganizer,
      getEvent,
      eventsByOrganizer,
      toggleFavorite,
      isFavorite,
      submitEvent,
      approveEvent,
      rejectEvent,
      toggleFeatured,
      toggleArchived,
      updateEventStatus,
      deleteEvent,
      registerView,
      addReport,
      resolveReport,
    }),
    [
      events,
      organizers,
      reports,
      favorites,
      getOrganizer,
      getEvent,
      eventsByOrganizer,
      toggleFavorite,
      isFavorite,
      submitEvent,
      approveEvent,
      rejectEvent,
      toggleFeatured,
      toggleArchived,
      updateEventStatus,
      deleteEvent,
      registerView,
      addReport,
      resolveReport,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
