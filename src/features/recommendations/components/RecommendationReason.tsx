import { CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import type { PlannerState } from "../../../domain/types";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { analyzeRecommendationReason } from "../../ai/aiStargazingService";

export function RecommendationReason({
  destination,
  planner,
}: {
  destination: RankedDestination;
  planner: PlannerState;
}) {
  const analysis = analyzeRecommendationReason(destination, planner);

  return (
    <div className="mt-4 border border-line bg-paper/60 p-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-teal" />
          <h3 className="font-display text-[14px] font-bold text-ink">
            {analysis.headline}
          </h3>
        </div>
        <span className="text-[10px] text-stone-500">빅데이터 분산 분석</span>
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-stone-600">
        {analysis.summary}
      </p>

      <div className="mt-3 space-y-2">
        {analysis.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[11px] leading-5 text-stone-700">
            <CheckCircle size={15} weight="fill" className="mt-1 shrink-0 text-teal" />
            <div>
              <strong className="font-semibold text-ink">{reason.title}: </strong>
              <span>{reason.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
