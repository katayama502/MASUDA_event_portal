import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-orange-500">{eyebrow}</p>}
        <h2 className="font-display text-xl font-black text-ink sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
