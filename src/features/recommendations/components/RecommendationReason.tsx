import { CheckCircle, Info, ShieldCheck } from "@phosphor-icons/react";
import type { PlannerState } from "../../../domain/types";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { analyzeRecommendationReason } from "../../ai/aiStargazingService";

export function RecommendationReason({
  destination,
  planner,
  rankIndex = 0,
}: {
  destination: RankedDestination;
  planner: PlannerState;
  rankIndex?: number;
}) {
  const analysis = analyzeRecommendationReason(destination, planner, rankIndex);

  return (
    <div className="mt-4 border border-line bg-paper/60 p-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck size={18} className="shrink-0 text-teal" />
            <h3 className="font-display text-[14px] font-bold text-ink">
              {analysis.headline}
            </h3>
          </div>
        </div>
        <span className="shrink-0 text-[11px] text-stone-500">과밀 분산 & 안심 여정</span>
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-stone-600">
        {analysis.summary}
      </p>

      <div className="mt-3.5 space-y-2">
        {analysis.reasons.map((reason, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 rounded border border-line/50 bg-white/50 p-2.5 text-[11px] leading-relaxed text-stone-700"
          >
            <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-teal" />
            <div>
              <strong className="font-bold text-ink">{reason.title}</strong>
              <p className="mt-0.5 text-stone-600">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500">
        <Info size={13} className="text-teal" />
        <span>대표 과밀지의 좁은 산간 병목과 불법 차박을 피하고, 안전하게 체류할 수 있는 대체 관측지를 선정한 결과입니다.</span>
      </div>
    </div>
  );
}


