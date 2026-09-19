import { Check, MapPin } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import type { RankedDestination } from "../../../lib/recommendationEngine";

import { BottomSheet } from "../../../components/ui/BottomSheet";
import { useState } from "react";

export function DestinationAlternatives({
  items,
  selectedId,
  onSelect,
}: {
  items: RankedDestination[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (items.length < 2) return null;

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsSheetOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderItem = (item: RankedDestination, index: number, isDark = false) => {
    const active = item.id === selectedId;
    const isLowRank = index >= 5 || (item.analysis.total !== null && item.analysis.total < 60);
    
    if (isDark) {
      return (
        <button
          className={cn(
            "group grid min-h-[74px] grid-cols-[30px_1fr_auto] items-center gap-2 rounded border px-3 text-left transition",
            active
              ? "border-teal bg-teal/20 text-white"
              : isLowRank
              ? "border-white/10 bg-white/[0.03] opacity-60 hover:opacity-100 hover:border-white/20 hover:bg-white/[0.08]"
              : "border-white/15 bg-white/[0.06] hover:border-gold/40 hover:bg-white/[0.12]"
          )}
          aria-pressed={active}
          key={item.id}
          onClick={() => handleSelect(item.id)}
          type="button"
        >
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full font-display text-[11px]",
              active 
                ? "bg-teal text-white" 
                : isLowRank 
                ? "border border-white/15 text-cream/40 bg-white/5"
                : "border border-white/25 text-cream/80 bg-white/10"
            )}
          >
            {active ? <Check /> : index + 1}
          </span>
          <span className="min-w-0">
            <strong className={cn("block truncate font-display text-[14px]", isLowRank && !active ? "text-cream/70" : "text-cream")}>
              {item.name}
            </strong>
            <small className="mt-1 flex items-center gap-1 truncate text-[11px] text-cream/60">
              <MapPin />
              {item.region || item.address || "위치 정보 확인 중"}
            </small>
          </span>
          <span className="text-right">
            <strong className={cn("block font-display text-[16px]", isLowRank && !active ? "text-cream/40" : "text-gold-light")}>
              {item.analysis.total ?? "—"}
            </strong>
            <small className="text-[10px] text-cream/50">종합점수</small>
          </span>
        </button>
      );
    }

    return (
      <button
        className={cn(
          "group grid min-h-[74px] grid-cols-[30px_1fr_auto] items-center gap-2 border px-3 text-left transition",
          active
            ? "border-teal bg-teal/8"
            : isLowRank
            ? "border-line/50 bg-white/20 opacity-70 hover:opacity-100 hover:border-line hover:bg-white/50"
            : "border-line bg-white/40 hover:border-teal/45 hover:bg-white/75"
        )}
        aria-pressed={active}
        key={item.id}
        onClick={() => handleSelect(item.id)}
        type="button"
      >
        <span
          className={cn(
            "grid size-7 place-items-center rounded-full font-display text-[11px]",
            active 
              ? "bg-teal text-white" 
              : isLowRank 
              ? "border border-line/50 text-stone-400 bg-stone-50"
              : "border border-line text-stone-500"
          )}
        >
          {active ? <Check /> : index + 1}
        </span>
        <span className="min-w-0">
          <strong className={cn("block truncate font-display text-[14px]", isLowRank && !active ? "text-stone-500" : "")}>{item.name}</strong>
          <small className="mt-1 flex items-center gap-1 truncate text-[10px] text-stone-500">
            <MapPin />
            {item.region || item.address || "위치 정보 확인 중"}
          </small>
        </span>
        <span className="text-right">
          <strong className={cn("block font-display text-[16px]", isLowRank && !active ? "text-stone-400" : "text-rust")}>
            {item.analysis.total ?? "—"}
          </strong>
          <small className="text-[9px] text-stone-500">종합점수</small>
        </span>
      </button>
    );
  };

  const visibleItems = items.slice(0, 5);
  const hiddenCount = items.length - 5;

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[16px] font-bold">추천 후보 목록</h3>
        <span className="text-[11px] text-stone-500">총 {items.length}개소</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {visibleItems.map((item, index) => renderItem(item, index, false))}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setIsSheetOpen(true)}
          className="mt-3 w-full rounded border border-line bg-white/50 py-2.5 text-[12px] text-stone-600 transition hover:bg-white/80"
          type="button"
        >
          추천 순위 외 {hiddenCount}개 관측지 더보기
        </button>
      )}

      {isSheetOpen && (
        <BottomSheet snapPoints={[0.8]} defaultSnap={0} onSnapChange={() => {}}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[18px] font-bold text-white">모든 추천 후보지</h3>
            <button
              onClick={() => setIsSheetOpen(false)}
              className="text-[12px] text-cream/70 hover:text-white underline"
            >
              닫기
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {items.map((item, index) => renderItem(item, index, true))}
          </div>
        </BottomSheet>
      )}
    </section>
  );
}
