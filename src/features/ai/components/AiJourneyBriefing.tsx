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
    <div className="mt-4 border border-line bg-paper/60 p-4">
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
            className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-teal disabled:opacity-50 transition cursor-pointer"
            title="AI 브리핑 다시 생성"
          >
            <ArrowClockwise size={13} className={isLoading ? "animate-spin text-teal" : ""} />
            <span>{isLoading ? "생성 중" : "다시 생성"}</span>
          </button>
          <span className="shrink-0 text-[11px] text-stone-500">
            {planner.departure} 출발 · {planner.date || "선택일자"}
          </span>
        </div>
      </div>

      {/* 브리핑 본문: vLLM 응답 또는 로컬 템플릿 */}
      <div className="mt-2.5 min-h-[36px]">
        {isLoading && !llmText ? (
          <div className="space-y-1.5 py-1 animate-pulse">
            <div className="h-3 w-4/5 rounded bg-line/60" />
            <div className="h-3 w-full rounded bg-line/40" />
            <div className="h-3 w-2/3 rounded bg-line/40" />
          </div>
        ) : (
          <p className="text-[11px] leading-relaxed text-stone-700">
            {llmText || localBriefing.personaSummary}
          </p>
        )}
      </div>

      {/* 권장 출발 타이밍 가이드 (프로젝트 테마 bg-white/60 + text-ink) */}
      <div className="mt-3 flex items-start gap-2.5 rounded border border-line/60 bg-white/60 p-2.5 text-[11px] leading-relaxed text-stone-700">
        <Clock size={16} weight="fill" className="mt-0.5 shrink-0 text-rust" />
        <div>
          <strong className="font-bold text-ink">권장 출발 타이밍:</strong>
          <span className="ml-1 text-stone-600">{localBriefing.departureTimingAdvice}</span>
        </div>
      </div>

      {/* 맞춤 분석 포인트 리스트 */}
      <div className="mt-2 space-y-1.5">
        {localBriefing.goldenKeyPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 rounded border border-line/50 bg-white/50 p-2.5 text-[11px] leading-relaxed text-stone-700"
          >
            <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-teal" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* 배려 여행 / 무장애 옵션 알림 */}
      {planner.accessibility && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500">
          <UserCheck size={13} className="text-teal shrink-0" />
          <span>보행 약자 및 무장애 편의 시설 접근성 선호가 적용된 브리핑입니다.</span>
        </div>
      )}
    </div>
  );
}
