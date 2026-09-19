import { Sparkle, StarFour } from "@phosphor-icons/react";
import { Skeleton } from "../../../components/ui/Skeleton";

export function DestinationListViewSkeleton() {
  return (
    <section className="space-y-4" aria-busy="true" aria-label="추천 관측지 로딩 중">
      {/* 상단 통계 요약 및 로딩 안내 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/60 p-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <StarFour size={16} weight="fill" className="text-gold animate-spin" />
            <Skeleton className="h-5 w-44" />
          </div>
          <Skeleton className="h-3 w-64" />
        </div>

        <div className="flex items-center gap-1.5 bg-paper/80 p-1 rounded-lg border border-line/60">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-18" />
        </div>
      </div>

      {/* 카드 스켈레톤 그리드: PC 2열 / 모바일 1열 */}
      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-line/70 bg-white/60 p-4 shadow-xs"
          >
            <div>
              {/* 상단 랭킹 뱃지 & 종합 점수 */}
              <div className="flex items-center justify-between gap-2 border-b border-line/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton rounded="full" className="size-6" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>

              {/* 장소명 & 주소 */}
              <div className="mt-3 space-y-1.5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>

              {/* 핵심 지표 칩 그리드 */}
              <div className="mt-3.5 grid grid-cols-2 gap-1.5">
                <Skeleton className="h-7 w-full rounded" />
                <Skeleton className="h-7 w-full rounded" />
              </div>

              {/* 부가 태그 */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>
            </div>

            {/* 하단 상세 보기 버튼 */}
            <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-2.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton rounded="full" className="size-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
