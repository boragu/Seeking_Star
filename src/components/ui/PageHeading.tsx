import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: ReactNode; description: string; actions?: ReactNode }) {
  return <header className="mb-8 flex items-end justify-between gap-6 border-b border-[#aab1ac] pb-5 max-md:mb-6 max-md:block">
    <div className="max-w-3xl"><span className="text-[11px] font-bold tracking-[.16em] text-teal">{eyebrow}</span><h1 className="my-2 font-display text-[clamp(32px,4vw,50px)] font-bold leading-[1.16] tracking-[-0.055em]">{title}</h1><p className="max-w-2xl text-[13px] leading-6 text-stone-500">{description}</p></div>
    {actions && <div className="shrink-0 max-md:mt-4">{actions}</div>}
  </header>;
}
