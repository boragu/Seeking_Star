import { ArrowSquareOut, MapPin, Sparkle } from "@phosphor-icons/react";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { NearbyPlace } from "../../../domain/types";

export function NearbyPlaceList({
  title,
  items,
  empty,
  loading = false,
}: {
  title: string;
  items: NearbyPlace[];
  empty: string;
  loading?: boolean;
}) {
  return (
    <section className="min-w-0 overflow-hidden border border-line bg-white/45 p-6 shadow-[0_16px_45px_rgba(68,49,29,.05)] max-sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[20px] font-bold">{title}</h2>
        {loading && (
          <span className="flex items-center gap-1 text-[11px] text-teal">
            <Sparkle size={12} className="animate-spin" />
            <span>조회 중…</span>
          </span>
        )}
      </div>
      <div className="mt-4 divide-y divide-line">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3 w-48" />
              <div className="flex items-center gap-1.5 pt-0.5">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>
          ))
        ) : items.length ? (
          items.map((place) => {
            // Split comma-separated category strings into individual tags
            const categories = place.category
              ? place.category
                  .split(/[,/·]+/)
                  .map((c) => c.trim())
                  .filter(Boolean)
              : [];
            // Show up to 2 primary category badges to keep UI tidy
            const primaryCategories = categories.slice(0, 2);

            const facilityList = place.facilities
              ? place.facilities
                  .split(/[,/·]+/)
                  .map((f) => f.trim())
                  .filter(Boolean)
                  .slice(0, 5)
              : [];
            const outLink = place.resveUrl || place.homepage;

            return (
              <article
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-3.5"
                key={place.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong className="min-w-0 max-w-full truncate font-display text-[15px] text-ink">
                      {place.name}
                    </strong>
                    {place.rank !== undefined && place.rank !== null && (
                      <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-950 shadow-xs">
                        <Sparkle size={11} weight="fill" className="text-amber-700 shrink-0" />
                        빅데이터 연계 {place.rank}위
                      </span>
                    )}
                    {primaryCategories.map((cat) => (
                      <span
                        key={cat}
                        className="max-w-[140px] truncate rounded border border-stone-200 bg-stone-100/80 px-1.5 py-0.5 text-[10px] font-medium text-stone-700"
                        title={cat}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{place.address || place.region || "위치 정보 확인 중"}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {facilityList.map((facility) => (
                      <span
                        key={facility}
                        className="max-w-[120px] truncate rounded bg-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-teal"
                        title={facility}
                      >
                        {facility}
                      </span>
                    ))}
                    {outLink && (
                      <a
                        href={outLink.startsWith("http") ? outLink : `http://${outLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-teal/20 bg-teal/5 px-2 py-0.5 text-[10px] font-semibold text-teal hover:bg-teal hover:text-white transition-colors"
                      >
                        <span>{place.resveUrl ? "예약하기" : "홈페이지"}</span>
                        <ArrowSquareOut size={11} />
                      </a>
                    )}
                  </div>
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
