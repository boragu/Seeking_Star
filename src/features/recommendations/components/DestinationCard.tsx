import { ArrowRight, Car, MapPin, Sparkle, Tent, TrendDown, Wheelchair } from "@phosphor-icons/react";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { cn } from "../../../lib/cn";

export function DestinationCard({
  destination,
  rank,
  isSelected,
  onSelect,
}: {
  destination: RankedDestination;
  rank: number;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}) {
  const isTopRank = rank <= 3;
  const isRecommended = (destination.analysis.total ?? 0) >= 60;
  const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
  const campCount = destination.nearbyCampgrounds?.length ?? 0;
  const travelMins = destination.travelMinutesEstimate;

  return (
    <article
      onClick={() => onSelect(destination.id)}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 cursor-pointer text-left bg-white/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
        isSelected
          ? "border-teal ring-2 ring-teal/30 bg-teal/[0.03]"
          : "border-line/70 hover:border-teal/50"
      )}
    >
      <div>
        {/* 상단 랭킹 뱃지 & 종합 점수 */}
        <div className="flex items-center justify-between gap-2 border-b border-line/40 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[11px] font-display font-bold",
                isTopRank
                  ? "bg-rust text-white shadow-xs"
                  : isRecommended
                  ? "bg-teal text-white"
                  : "bg-stone-200 text-stone-600"
              )}
            >
              {rank}
            </span>
            <span
              className={cn(
                "text-[11px] font-bold",
                isTopRank ? "text-rust" : isRecommended ? "text-teal" : "text-stone-500"
              )}
            >
              {isRecommended ? `추천 ${rank}순위` : `${rank}순위 (보류)`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-500 font-medium">종합</span>
            <strong
              className={cn(
                "font-display text-[17px] font-bold leading-none",
                isRecommended ? "text-rust" : "text-stone-400"
              )}
            >
              {destination.analysis.total ?? "—"}
            </strong>
            <span className="text-[10px] text-stone-400">점</span>
          </div>
        </div>

        {/* 장소명 & 주소 */}
        <div className="mt-3">
          <h3 className="font-display text-[17px] font-bold text-ink group-hover:text-teal transition-colors truncate">
            {destination.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500 truncate">
            <MapPin size={13} className="shrink-0 text-stone-400" />
            <span className="truncate">{destination.address || destination.region || "위치 정보"}</span>
          </p>
        </div>

        {/* 핵심 지표 칩 그리드 */}
        <div className="mt-3.5 grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1 rounded bg-paper/80 px-2 py-1 text-stone-700">
            <TrendDown size={14} className="text-teal shrink-0" />
            <span className="text-[10px] text-stone-500">한적도</span>
            <strong className="ml-auto font-bold text-ink">{calmScore}점</strong>
          </div>
          <div className="flex items-center gap-1 rounded bg-paper/80 px-2 py-1 text-stone-700">
            <Car size={14} className="text-amber-700 shrink-0" />
            <span className="text-[10px] text-stone-500">소요</span>
            <strong className="ml-auto font-bold text-ink">{travelMins ? `${travelMins}분` : "—"}</strong>
          </div>
        </div>

        {/* 부가 태그 (캠핑장, 무장애) */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {campCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-teal">
              <Tent size={12} />
              인근 캠핑장 {campCount}곳
            </span>
          )}
          {destination.accessible && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-100/70 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
              <Wheelchair size={12} />
              무장애 편의
            </span>
          )}
        </div>
      </div>

      {/* 하단 상세 보기 버튼 */}
      <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-2.5 text-[11px] font-bold text-teal group-hover:text-rust transition-colors">
        <span>상세 분석 및 코스 보기</span>
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  );
}
