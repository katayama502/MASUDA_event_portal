interface MarqueeProps {
  text: string;
  className?: string;
}

export function Marquee({ text, className = "" }: MarqueeProps) {
  const items = Array.from({ length: 8 });
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-6 whitespace-nowrap py-2.5">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-6">
            {items.map((_, i) => (
              <span key={i} className="flex items-center gap-6 font-display text-sm font-bold tracking-wide">
                {text}
                <span aria-hidden>☀️</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
