import { useState } from "react";
import { Funnel, Sparkle, StarFour } from "@phosphor-icons/react";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { DestinationCard } from "./DestinationCard";

export function DestinationListView({
  items,
  selectedId,
  onSelect,
}: {
  items: RankedDestination[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "recommended" | "camping" | "accessible">("all");

  const filteredItems = items.filter((item) => {
    if (filter === "recommended") return (item.analysis.total ?? 0) >= 60;
    if (filter === "camping") return (item.nearbyCampgrounds?.length ?? 0) > 0;
    if (filter === "accessible") return Boolean(item.accessible);
    return true;
  });

  return (
    <section className="space-y-4">
      {/* 상단 통계 요약 및 필터 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/60 p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 font-display text-[16px] font-bold text-ink">
            <StarFour size={16} weight="fill" className="text-gold" />
            <span>맞춤 추천 관측지 ({filteredItems.length}개소)</span>
          </div>
          <p className="mt-0.5 text-[11px] text-stone-500">
            혼잡 분산도, 이동 소요시간, 인근 체류 인프라를 종합 분석한 추천 순위입니다.
          </p>
        </div>

        {/* 필터 탭 */}
        <div className="flex flex-wrap items-center gap-1 bg-paper/80 p-1 rounded-lg border border-line/60">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "all" ? "bg-teal text-white shadow-xs" : "text-stone-600 hover:text-ink"
            }`}
          >
            전체 ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("recommended")}
            className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "recommended" ? "bg-teal text-white shadow-xs" : "text-stone-600 hover:text-ink"
            }`}
          >
            추천 순위권
          </button>
          <button
            type="button"
            onClick={() => setFilter("camping")}
            className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "camping" ? "bg-teal text-white shadow-xs" : "text-stone-600 hover:text-ink"
            }`}
          >
            캠핑 연계
          </button>
          <button
            type="button"
            onClick={() => setFilter("accessible")}
            className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "accessible" ? "bg-teal text-white shadow-xs" : "text-stone-600 hover:text-ink"
            }`}
          >
            무장애 편의
          </button>
        </div>
      </div>

      {/* 카드 그리드: PC 2열 / 모바일 1열 */}
      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        {filteredItems.map((item, index) => (
          <DestinationCard
            key={item.id}
            destination={item}
            rank={index + 1}
            isSelected={item.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-xl border border-line bg-white/40 p-8 text-center text-stone-500">
          선택한 필터 조건에 해당하는 관측지가 없습니다.
        </div>
      )}
    </section>
  );
}
