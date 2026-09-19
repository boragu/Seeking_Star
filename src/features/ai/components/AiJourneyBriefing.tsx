import { useEffect, useState } from "react";
import { ArrowClockwise, CheckCircle, Clock, Sparkle, UserCheck } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import type { Destination, PlannerState } from "../../../domain/types";
import { generateAiJourneyBriefing, requestAiEnhancedGuide } from "../aiStargazingService";

export function AiJourneyBriefing({
  destination,
  planner,
}: {
  destination: Destination;
  planner: PlannerState;
}) {
  const [llmText, setLlmText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // 로컬 룰 기반 브리핑 (즉시 렌더링 및 Fallback)
  const localBriefing = generateAiJourneyBriefing(destination, planner);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    setIsLoading(true);
    requestAiEnhancedGuide(destination, planner, controller.signal)
      .then((content) => {
        if (isMounted) {
          setLlmText(content);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLlmText(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [destination.id, planner.departure, planner.date, planner.people, planner.transport, planner.accessibility, refreshKey]);

  return (
    <div className="mt-4 border border-line bg-gradient-to-br from-paper via-paper/80 to-teal/5 p-4 shadow-[0_8px_30px_rgba(68,49,29,.04)]">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkle size={18} weight="fill" className="text-teal" />
            <h3 className="font-display text-[14px] font-bold text-ink">
              맞춤 여정 브리핑
            </h3>
          </div>
          {llmText ? (
            <AiBadge label="AI 브리핑" variant="gold" />
          ) : isLoading ? (
            <AiBadge label="AI 생성 중..." variant="teal" />
          ) : (
            <AiBadge label="AI 브리핑" variant="teal" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-600 hover:text-teal disabled:opacity-50 transition cursor-pointer"
            title="AI 브리핑 다시 생성"
          >
            <ArrowClockwise size={12} className={isLoading ? "animate-spin text-teal" : ""} />
            <span>{isLoading ? "생성 중" : "다시 생성"}</span>
          </button>
          <span className="shrink-0 text-[10px] text-stone-500">
            {planner.departure} 출발 · {planner.date || "선택일자"} 기준
          </span>
        </div>
      </div>

      {/* 브리핑 본문: vLLM 응답 또는 로컬 템플릿 */}
      <div className="mt-3 min-h-[40px]">
        {isLoading && !llmText ? (
          <div className="space-y-1.5 py-1 animate-pulse">
            <div className="h-3 w-4/5 rounded bg-teal/20" />
            <div className="h-3 w-full rounded bg-stone-200" />
            <div className="h-3 w-2/3 rounded bg-stone-200" />
          </div>
        ) : (
          <p className="text-[12px] leading-relaxed font-medium text-stone-800 dark:text-stone-200">
            {llmText || localBriefing.personaSummary}
          </p>
        )}
      </div>

      {/* 출발 타이밍 조언 뱃지 (가독성 높은 대비 스타일) */}
      <div className="mt-3.5 flex items-start gap-2.5 rounded-md border border-teal/40 bg-teal/10 dark:bg-teal/900/30 p-3 text-[11px]">
        <Clock size={16} weight="fill" className="mt-0.5 shrink-0 text-teal-800 dark:text-teal-300" />
        <div className="leading-relaxed">
          <strong className="font-extrabold text-teal-900 dark:text-teal-200">권장 출발 타이밍:</strong>
          <span className="ml-1.5 font-medium text-stone-900 dark:text-stone-100">{localBriefing.departureTimingAdvice}</span>
        </div>
      </div>

      {/* 맞춤 분석 포인트 리스트 */}
      <div className="mt-3 space-y-1.5">
        {localBriefing.goldenKeyPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 rounded bg-white/70 dark:bg-stone-800/60 p-2.5 text-[11px] leading-relaxed text-stone-800 dark:text-stone-200 border border-line/40"
          >
            <CheckCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-teal" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* 배려 여행 / 무장애 옵션 알림 */}
      {planner.accessibility && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-teal">
          <UserCheck size={14} className="shrink-0" />
          <span>보행 약자 및 무장애 편의 시설 접근성 선호가 적용된 브리핑입니다.</span>
        </div>
      )}
    </div>
  );
}
