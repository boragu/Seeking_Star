import { useRef } from "react";
import { ArrowLeft, CaretLeft, CaretRight, ListBullets } from "@phosphor-icons/react";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { cn } from "../../../lib/cn";

export function DestinationRankNavigator({
  items,
  selectedId,
  onSelect,
  onBackToList,
  className,
}: {
  items: RankedDestination[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBackToList?: () => void;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = items.findIndex((item) => item.id === selectedId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1].id);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2.5 rounded-xl border border-line bg-white/75 p-3 shadow-xs", className)}>
      {/* 상단 액션 바: 목록으로 가기 & 이전/다음 네비게이션 */}
      <div className="flex items-center justify-between gap-2 border-b border-line/40 pb-2">
        <button
          type="button"
          onClick={onBackToList}
          className="flex items-center gap-1.5 rounded-lg border border-teal/30 bg-teal/5 px-3 py-1.5 text-[12px] font-bold text-teal hover:bg-teal hover:text-white transition active:scale-95"
          title="추천 후보 전체 목록으로 돌아가기"
        >
          <ArrowLeft size={14} weight="bold" />
          <ListBullets size={15} />
          <span>추천 목록으로 돌아가기 ({items.length}개소)</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="grid size-7 place-items-center rounded border border-line bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="이전 순위 장소 보기"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <span className="text-[11px] font-bold text-stone-500 px-1">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= items.length - 1}
            className="grid size-7 place-items-center rounded border border-line bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="다음 순위 장소 보기"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* 가로 스크롤 랭킹 칩 네비게이터 바 */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none"
      >
        {items.map((item, index) => {
          const isActive = item.id === selectedId;
          const isTop = index < 3;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-all",
                isActive
                  ? "border-teal bg-teal text-white shadow-xs font-bold ring-2 ring-teal/20"
                  : isTop
                  ? "border-amber-300/80 bg-amber-50/60 text-stone-700 hover:bg-amber-100/60"
                  : "border-line bg-white/60 text-stone-600 hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full text-[9px] font-bold",
                  isActive
                    ? "bg-white text-teal"
                    : isTop
                    ? "bg-rust text-white"
                    : "bg-stone-200 text-stone-600"
                )}
              >
                {index + 1}
              </span>
              <span className="truncate max-w-[120px]">{item.name}</span>
              <span className={cn("text-[10px]", isActive ? "text-white/80" : "text-stone-400 font-bold")}>
                {item.analysis.total ?? "—"}점
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
