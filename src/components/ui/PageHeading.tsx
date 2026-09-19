import type { ReactNode } from "react";

export function PageHeading({ title, description, actions }: { title: ReactNode; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex items-end justify-between gap-6 border-b border-[#aab1ac] pb-5 max-md:mb-6 max-md:block">
      <div className="max-w-3xl">
        <h1 className="mb-2 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.16] tracking-[-0.04em]">{title}</h1>
        {description && <p className="max-w-2xl text-[13px] leading-6 text-stone-500">{description}</p>}
      </div>
      {actions && <div className="shrink-0 max-md:mt-4">{actions}</div>}
    </header>
  );
}
