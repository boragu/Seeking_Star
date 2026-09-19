import { MapPin } from "@phosphor-icons/react";
import type { NearbyPlace } from "../../../domain/types";

export function NearbyPlaceList({
  title,
  items,
  empty,
}: {
  title: string;
  items: NearbyPlace[];
  empty: string;
}) {
  return (
    <section className="border border-line bg-white/45 p-6 shadow-[0_16px_45px_rgba(68,49,29,.05)] max-sm:p-5">
      <h2 className="font-display text-[20px] font-bold">{title}</h2>
      <div className="mt-4 divide-y divide-line">
        {items.length ? (
          items.map((place) => {
            const facilityList = place.facilities
              ? place.facilities.split(",").map((f) => f.trim()).filter(Boolean).slice(0, 4)
              : [];

            return (
              <article className="group grid grid-cols-[1fr_auto] gap-4 py-3.5" key={place.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong className="truncate font-display text-[15px]">{place.name}</strong>
                    {place.category && (
                      <span className="shrink-0 rounded border border-stone-200 bg-stone-100/80 px-1.5 py-0.5 text-[10px] font-medium text-stone-700">
                        {place.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-stone-500">
                    <MapPin />
                    {place.address || place.region || "위치 정보 확인 중"}
                  </p>
                  {facilityList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {facilityList.map((facility) => (
                        <span
                          key={facility}
                          className="rounded bg-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-teal"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {place.distanceKm !== null && (
                  <span className="self-center text-[11px] font-bold text-teal">
                    {place.distanceKm.toFixed(1)}km
                  </span>
                )}
              </article>
            );
          })
        ) : (
          <p className="py-8 text-[12px] text-stone-500">{empty}</p>
        )}
      </div>
    </section>
  );
}
