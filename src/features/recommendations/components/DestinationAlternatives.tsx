import { Check, MapPin } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import type { RankedDestination } from "../../../lib/recommendationEngine";

export function DestinationAlternatives({
  items,
  selectedId,
  onSelect,
}: {
  items: RankedDestination[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (items.length < 2) return null;
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[16px] font-bold">추천 후보 목록</h3>
        <span className="text-[11px] text-stone-500">총 {items.length}개소</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {items.slice(0, 6).map((item, index) => {
          const active = item.id === selectedId;
          return (
            <button
              className={cn(
                "group grid min-h-[74px] grid-cols-[30px_1fr_auto] items-center gap-2 border px-3 text-left transition",
                active
                  ? "border-teal bg-teal/8"
                  : "border-line bg-white/40 hover:border-teal/45 hover:bg-white/75"
              )}
              aria-pressed={active}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full font-display text-[11px]",
                  active ? "bg-teal text-white" : "border border-line text-stone-500"
                )}
              >
                {active ? <Check /> : index + 1}
              </span>
              <span className="min-w-0">
                <strong className="block truncate font-display text-[14px]">{item.name}</strong>
                <small className="mt-1 flex items-center gap-1 truncate text-[10px] text-stone-500">
                  <MapPin />
                  {item.region || item.address || "위치 정보 확인 중"}
                </small>
              </span>
              <span className="text-right">
                <strong className="block font-display text-[16px] text-rust">
                  {item.analysis.total ?? "—"}
                </strong>
                <small className="text-[9px] text-stone-500">종합점수</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
