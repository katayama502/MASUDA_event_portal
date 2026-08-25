import { useAppData } from "../context/AppDataContext";

export function FavoriteButton({ eventId, className = "" }: { eventId: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useAppData();
  const active = isFavorite(eventId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(eventId);
      }}
      aria-pressed={active}
      aria-label={active ? "お気に入りから外す" : "お気に入りに追加する"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg shadow-warm-sm transition-all active:scale-90 ${
        active ? "bg-brand-500 text-white" : "bg-white text-brand-500"
      } ${className}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
