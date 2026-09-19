import { CheckCircle, Clock, Sparkle, UserCheck } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import type { Destination, PlannerState } from "../../../domain/types";
import { generateAiJourneyBriefing } from "../aiStargazingService";

export function AiJourneyBriefing({
  destination,
  planner,
}: {
  destination: Destination;
  planner: PlannerState;
}) {
  const briefing = generateAiJourneyBriefing(destination, planner);

  return (
    <div className="mt-4 border border-line bg-gradient-to-br from-paper via-paper/80 to-teal/5 p-4 shadow-[0_8px_30px_rgba(68,49,29,.04)]">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkle size={18} weight="fill" className="text-teal" />
            <h3 className="font-display text-[14px] font-bold text-ink">
              초개인화 맞춤 여정 브리핑
            </h3>
          </div>
          <AiBadge label="AI 맞춤 브리핑" variant="teal" />
        </div>
        <span className="shrink-0 text-[10px] text-stone-500">
          {planner.departure} 출발 · {planner.date || "선택일자"} 기준
        </span>
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-stone-700">
        {briefing.personaSummary}
      </p>

      {/* 출발 타이밍 조언 뱃지 */}
      <div className="mt-3 flex items-start gap-2 rounded border border-gold/30 bg-gold/10 p-2.5 text-[11px] text-ink">
        <Clock size={16} weight="fill" className="mt-0.5 shrink-0 text-gold-dark dark:text-gold-light" />
        <div>
          <strong className="font-bold text-gold-dark dark:text-gold-light">골든 출발 타이밍 가이드:</strong>
          <span className="ml-1 text-stone-700 dark:text-stone-300">{briefing.departureTimingAdvice}</span>
        </div>
      </div>

      {/* 맞춤 분석 포인트 리스트 */}
      <div className="mt-3 space-y-1.5">
        {briefing.goldenKeyPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 rounded bg-white/60 p-2 text-[11px] leading-relaxed text-stone-700"
          >
            <CheckCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-teal" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* 배려 여행 / 무장애 옵션 알림 */}
      {planner.accessibility && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-teal">
          <UserCheck size={14} className="shrink-0" />
          <span>보행 약자 및 무장애 편의 시설 접근성 선호가 적용된 브리핑입니다.</span>
        </div>
      )}
    </div>
  );
}
