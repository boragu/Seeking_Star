import { MapPin } from "@phosphor-icons/react";
import type { NearbyPlace } from "../../../domain/types";
import { cn } from "../../../lib/cn";

export function NearbyPlaceList({ eyebrow, title, items, empty, tone = "teal" }: { eyebrow: string; title: string; items: NearbyPlace[]; empty: string; tone?: "teal" | "rust" }) {
  return <section className="border border-line bg-white/45 p-6 shadow-[0_16px_45px_rgba(68,49,29,.05)] max-sm:p-5"><span className={cn("text-[10px] font-bold tracking-[.14em]", tone === "rust" ? "text-rust" : "text-teal")}>{eyebrow}</span><h2 className="mt-1 font-display text-[22px] font-bold">{title}</h2><div className="mt-4 divide-y divide-line">{items.length ? items.map((place) => <article className="group grid grid-cols-[1fr_auto] gap-4 py-4" key={place.id}><div className="min-w-0"><strong className="block truncate font-display text-[15px]">{place.name}</strong><p className="mt-1 flex items-center gap-1 truncate text-[10px] text-stone-500"><MapPin />{place.address || place.region || place.category || "위치 정보 확인 중"}</p></div>{place.distanceKm !== null && <span className="self-center text-[11px] font-bold text-teal">{place.distanceKm.toFixed(1)}km</span>}</article>) : <p className="py-8 text-[11px] text-stone-500">{empty}</p>}</div></section>;
}
