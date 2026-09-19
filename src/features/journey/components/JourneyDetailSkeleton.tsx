import { Sparkle } from "@phosphor-icons/react";
import { Skeleton } from "../../../components/ui/Skeleton";
import { NearbyPlaceList } from "./NearbyPlaceList";

export function JourneyDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="여정 상세 정보 로딩 중">
      {/* 상단 헤딩 스켈레톤 */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-64" />
          <span className="flex items-center gap-1 text-[11px] text-teal font-medium">
            <Sparkle size={13} className="animate-spin" />
            <span>여정 데이터 분석 중…</span>
          </span>
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      {/* AI 브리핑 카드 스켈레톤 */}
      <div className="rounded-lg border border-line bg-paper/60 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 py-1">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-[90%] rounded" />
          <Skeleton className="h-3.5 w-[70%] rounded" />
        </div>
      </div>

      {/* 코스 선택 바 스켈레톤 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white/40 p-3">
        <Skeleton className="h-5 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-24 rounded" />
          <Skeleton className="h-7 w-28 rounded" />
        </div>
      </div>

      {/* 타임라인 스켈레톤 */}
      <div className="border border-line bg-white/45 p-6 shadow-xs space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-3 pl-4 border-l-2 border-line/50">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </div>

      {/* 여정 팩트 스켈레톤 */}
      <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* 인근 캠핑장 & 주변 연관 관광지 스켈레톤 */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <NearbyPlaceList
          title="인근 캠핑장 (20km)"
          items={[]}
          empty=""
          loading={true}
        />
        <NearbyPlaceList
          title="주변 연관 관광지"
          items={[]}
          empty=""
          loading={true}
        />
      </div>

      {/* 관측 가이드 스켈레톤 */}
      <div className="border border-line bg-white/45 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-12 w-full rounded" />
        <div className="grid grid-cols-2 gap-4 border-y border-line py-4 max-md:grid-cols-1">
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
