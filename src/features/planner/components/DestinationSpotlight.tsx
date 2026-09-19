import { ArrowRight, MapPin } from "@phosphor-icons/react";
import type { Navigate } from "../../../app/navigation";
import { useApp } from "../../../app/AppContext";
import { Button } from "../../../components/ui/Button";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { DestinationAlternatives } from "../../recommendations/components/DestinationAlternatives";
import { DestinationFacts } from "../../recommendations/components/DestinationFacts";
import { DestinationMedia } from "../../recommendations/components/DestinationMedia";
import { RecommendationReason } from "../../recommendations/components/RecommendationReason";
import { ScoreBreakdown } from "../../recommendations/components/ScoreBreakdown";

export function DestinationSpotlight({
  destination,
  items,
  navigate,
  onSelect,
}: {
  destination: RankedDestination;
  items: RankedDestination[];
  navigate: Navigate;
  onSelect: (id: string) => void;
}) {
  const { planner } = useApp();

  return (
    <section className="border border-line bg-white/52 p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] max-md:p-4">
      <SectionHeading
        number="02"
        title="추천 1순위 관측지"
        description="혼잡도, 이동 거리, 기상 여건 종합 분석 결과"
        tone="rust"
      />
      <div className="relative h-[290px] overflow-hidden bg-ink max-lg:h-[250px] max-sm:h-[210px]">
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
      
      {/* 분산 및 추천 사유 분석 */}
      <RecommendationReason destination={destination} planner={planner} />

      <div className="mt-4">
        <ScoreBreakdown destination={destination} />
      </div>
      <DestinationAlternatives items={items} selectedId={destination.id} onSelect={onSelect} />
      <div className="mt-5 max-sm:grid-cols-1">
        <Button className="w-full" variant="primary" onClick={() => navigate("/map")}>
          지도 경로 확인 <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
