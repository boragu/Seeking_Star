import { StarFour } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, action, dark = false }: { title: string; description?: string; action: ReactNode; dark?: boolean }) {
  return <main id="main-content" className="grid min-h-[calc(100vh-76px)] place-items-center px-6 py-16 text-center"><div className="max-w-md"><span className="mx-auto grid size-16 place-items-center rounded-full border border-gold/45 text-gold"><StarFour size={30} weight="thin" /></span><h1 className="mt-6 font-display text-3xl font-bold">{title}</h1>{description && <p className={dark ? "mt-2 text-sm leading-6 text-cream/55" : "mt-2 text-sm leading-6 text-stone-500"}>{description}</p>}<div className="mt-6 flex justify-center">{action}</div></div></main>;
}
