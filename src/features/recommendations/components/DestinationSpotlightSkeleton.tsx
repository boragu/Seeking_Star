import { Skeleton } from "../../../components/ui/Skeleton";

export function DestinationSpotlightSkeleton() {
  return (
    <section className="space-y-6" aria-busy="true" aria-label="관측지 상세 분석 로딩 중">
      <div className="border border-line bg-white/52 p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] max-md:p-4">
        {/* 상단 순위 칩 내비게이터 스켈레톤 */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-line/60 pb-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* 타이틀 및 헤딩 스켈레톤 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-36" />
          </div>
          <Skeleton className="h-3.5 w-64" />
        </div>

        {/* 상단 메인 미디어 이미지 영역 스켈레톤 */}
        <div className="relative h-[290px] overflow-hidden rounded bg-ink/50 max-lg:h-[250px] max-sm:h-[210px] mt-4">
          <Skeleton variant="night" className="size-full" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5">
            <div className="space-y-2">
              <Skeleton variant="night" className="h-8 w-48" />
              <Skeleton variant="night" className="h-4 w-32" />
            </div>
            <Skeleton variant="night" rounded="full" className="size-[74px] shrink-0" />
          </div>
        </div>

        {/* 핵심 팩트 지표 스켈레톤 */}
        <div className="mt-4 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>

        {/* 과밀 분산 추천 이유 배너 스켈레톤 */}
        <div className="mt-4 rounded-lg border border-teal/20 bg-teal/[0.03] p-3 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        {/* 맞춤 여정 브리핑 스켈레톤 */}
        <div className="mt-4 border border-line bg-paper/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2 py-1">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>

        {/* 시간대별 혼잡도 차트 스켈레톤 */}
        <div className="mt-4 rounded-xl border border-line/70 bg-white/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* 지표 브레이크다운 스켈레톤 */}
        <div className="mt-4 rounded-xl border border-line/70 bg-white/70 p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>

        {/* 하단 액션 버튼 스켈레톤 */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Skeleton className="h-12 w-full sm:w-1/2 rounded-lg" />
          <Skeleton className="h-12 w-full sm:w-1/2 rounded-lg" />
        </div>
      </div>

      {/* 하단 추천 후보 목록 스켈레톤 */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between border border-line bg-white/40 p-3 rounded">
              <div className="flex items-center gap-2">
                <Skeleton rounded="full" className="size-7" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-4 w-10 ml-auto" />
                <Skeleton className="h-2.5 w-12 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
