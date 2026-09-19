import { Info } from "@phosphor-icons/react";
import type { RankedDestination, ScoreKey } from "../../../lib/recommendationEngine";

const scoreLabels: Record<ScoreKey, string> = {
  crowd: "혼잡 분산",
  travel: "이동 효율",
  camping: "캠핑 편의",
  sightseeing: "연관 관광",
  accessibility: "접근성",
  sky: "관측 여건",
  parking: "주차 편의",
};

export function ScoreBreakdown({ destination }: { destination: RankedDestination }) {
  const entries = Object.entries(destination.analysis.breakdown) as [ScoreKey, number][];
  if (destination.analysis.total === null) {
    return (
      <div className="border-y border-line py-4 text-[11px] leading-5 text-stone-500">
        <Info className="mr-1.5 inline text-teal" /> 점수 산출에 필요한 공공데이터 항목이 부족합니다.
      </div>
    );
  }
  return (
    <section className="border-y border-line py-4" aria-label="점수 산출 상세">
      <div className="mb-4 flex items-end justify-between">
        <span className="text-[12px] font-bold text-teal">항목별 지표 분석</span>
        <span className="text-[11px] text-stone-500">공공데이터 기준</span>
      </div>
      <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="mb-1.5 flex justify-between gap-2 text-[11px]">
              <span className="text-stone-500">{scoreLabels[key]}</span>
              <strong>{value}</strong>
            </div>
            <div className="h-1 overflow-hidden bg-stone-300">
              <i className="block h-full bg-teal" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
