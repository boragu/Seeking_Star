import { ArrowLeft, ArrowRight, ListBullets, MapPin } from "@phosphor-icons/react";
import type { Navigate } from "../../../app/navigation";
import { useApp } from "../../../app/AppContext";
import { Button } from "../../../components/ui/Button";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { DestinationAlternatives } from "../../recommendations/components/DestinationAlternatives";
import { DestinationFacts } from "../../recommendations/components/DestinationFacts";
import { DestinationMedia } from "../../recommendations/components/DestinationMedia";
import { ScoreBreakdown } from "../../recommendations/components/ScoreBreakdown";
import { AiJourneyBriefing } from "../../ai/components/AiJourneyBriefing";
import { CongestionForecast } from "../../recommendations/components/CongestionForecast";
import { DestinationRankNavigator } from "../../recommendations/components/DestinationRankNavigator";

export function DestinationSpotlight({
  destination,
  items,
  navigate,
  onSelect,
  onBackToList,
}: {
  destination: RankedDestination;
  items: RankedDestination[];
  navigate: Navigate;
  onSelect: (id: string) => void;
  onBackToList?: () => void;
}) {
  const { planner } = useApp();
  const rankIndex = items.findIndex((item) => item.id === destination.id);
  
  const isRecommended = rankIndex >= 0 && rankIndex < 5 && (destination.analysis.total ?? 0) >= 60;
  const rankLabel = isRecommended 
    ? `추천 ${rankIndex + 1}순위` 
    : `${rankIndex + 1}순위 (추천 보류)`;

  return (
    <section className="space-y-6">
      <div className="border border-line bg-white/52 p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] max-md:p-4">
        {/* 상단 순위 칩 내비게이터 (1위~5위 즉시 전환) */}
        <DestinationRankNavigator
          items={items}
          selectedId={destination.id}
          onSelect={onSelect}
          onBackToList={onBackToList}
        />

        <SectionHeading
          number={String(rankIndex + 1).padStart(2, "0")}
          title={rankLabel}
          description={`${destination.name}의 혼잡 분산도, 이동 거리, 인근 체류 인프라 종합 분석 결과`}
          tone={isRecommended ? "rust" : "teal"}
        />
        <div className="relative h-[290px] overflow-hidden bg-ink max-lg:h-[250px] max-sm:h-[210px] mt-4">
          <DestinationMedia destination={destination} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 text-cream">
            <div className="min-w-0">
              <h2 className="truncate font-display text-[clamp(26px,3vw,38px)] font-bold">{destination.name}</h2>
              <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-cream/70">
                <MapPin />
                {destination.address || destination.region || "위치 정보 확인 중"}
              </p>
            </div>
            <div className="grid size-[74px] shrink-0 place-items-center rounded-full border border-gold/55 bg-ink/75 text-center backdrop-blur">
              <strong className="font-display text-2xl text-gold-light">{destination.analysis.total ?? "—"}</strong>
              <small className="-mt-4 text-[9px] text-cream/60">종합 점수</small>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <DestinationFacts destination={destination} />
        </div>

        {/* 맞춤 여정 브리핑 (AI 실시간 분석 & 출발 타이밍 & 안심 포인트) */}
        <div className="mt-4">
          <AiJourneyBriefing destination={destination} planner={planner} />
        </div>

        {/* 시간대별 혼잡도 및 산간 병목 예측 차트 */}
        <div className="mt-4">
          <CongestionForecast destination={destination} dateString={planner.date} />
        </div>

        <div className="mt-4">
          <ScoreBreakdown destination={destination} />
        </div>

        {/* 데스크톱/태블릿 하단 액션 버튼 */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white/80 px-4 py-3 text-[13px] font-bold text-ink hover:bg-cream/40 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>추천 목록으로 돌아가기</span>
            </button>
          )}
          <Button
            className={`w-full ${onBackToList ? "sm:w-1/2" : ""}`}
            variant="primary"
            onClick={() => navigate("/map")}
          >
            별지도로 경로 확인하기 <ArrowRight />
          </Button>
        </div>
      </div>

      <DestinationAlternatives items={items} selectedId={destination.id} onSelect={onSelect} />

      {/* 모바일 하단 플로팅 캡슐 버튼 (목록 복귀 & 별지도 이동) */}
      <div className="fixed bottom-[calc(66px+14px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[60] md:hidden pointer-events-none w-max max-w-[calc(100vw-32px)] flex items-center gap-2">
        {onBackToList && (
          <button
            type="button"
            onClick={onBackToList}
            className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white/95 px-4 py-2.5 text-[12px] font-bold text-ink shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md transition duration-150 active:scale-95"
          >
            <ArrowLeft weight="bold" size={14} />
            <span>목록으로</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate("/map")}
          className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-rust px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_25px_rgba(185,95,49,0.45)] backdrop-blur-md transition duration-150 active:scale-95 hover:bg-[#a94f26]"
        >
          <span>별지도 보기</span>
          <ArrowRight weight="bold" size={14} />
        </button>
      </div>
    </section>
  );
}
