import { useEffect, useState } from "react";
import { ArrowClockwise, CheckCircle, Clock, Sparkle, UserCheck, WarningCircle } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import { MarkdownText } from "../../../components/ui/MarkdownText";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { Destination, PlannerState } from "../../../domain/types";
import { generateAiJourneyBriefing, requestAiEnhancedGuide } from "../aiStargazingService";
import {
  getCachedAiBriefing,
  setCachedAiBriefing,
  invalidateCachedAiBriefing,
} from "../aiBriefingCache";

export function AiJourneyBriefing({
  destination,
  planner,
}: {
  destination: Destination;
  planner: PlannerState;
}) {
  const [llmText, setLlmText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // 로컬 보조 가이드 (출발 타이밍 및 팩트 포인트)
  const localBriefing = generateAiJourneyBriefing(destination, planner);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // 1. 로컬 캐시 우선 확인
    const cached = getCachedAiBriefing(destination, planner);
    if (cached) {
      setLlmText(cached);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // 2. 캐시 없으면 실시간 AI 호출
    setIsLoading(true);
    setHasError(false);
    setLlmText(null);

    requestAiEnhancedGuide(destination, planner, controller.signal)
      .then((content) => {
        if (!isMounted) return;
        if (content) {
          setLlmText(content);
          setCachedAiBriefing(destination, planner, content);
          setHasError(false);
        } else {
          setHasError(true);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [destination.id, planner.departure, planner.date, planner.people, planner.transport, planner.accessibility, refreshKey]);

  const handleRefresh = () => {
    invalidateCachedAiBriefing(destination, planner);
    setLlmText(null);
    setHasError(false);
    setRefreshKey((k) => k + 1);
  };

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
          <AiBadge label="AI 브리핑" variant="teal" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-teal disabled:opacity-50 transition cursor-pointer"
            title="AI 브리핑 다시 생성"
          >
            <ArrowClockwise size={13} className={isLoading ? "animate-spin text-teal" : ""} />
            <span>{isLoading ? "작성 중..." : "다시 생성"}</span>
          </button>
          <span className="shrink-0 text-[11px] text-stone-500">
            {planner.departure} 출발 · {planner.date || "선택일자"}
          </span>
        </div>
      </div>

      {/* 브리핑 본문: vLLM AI 실시간 생성 내용 (먹색 텍스트 & 편안한 행간) */}
      <div className="mt-3 min-h-[44px]">
        {isLoading ? (
          <div className="space-y-2.5 py-1">
            <div className="flex items-center gap-2 text-[11px] text-teal font-medium">
              <Sparkle size={14} className="text-teal animate-spin" />
              <span>AI 모델이 맞춤 여정 브리핑을 작성하고 있습니다…</span>
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-[92%] rounded" />
              <Skeleton className="h-3.5 w-[75%] rounded" />
            </div>
          </div>
        ) : hasError ? (
          <div className="flex items-center justify-between rounded border border-line/60 bg-white/50 p-2.5 text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <WarningCircle size={16} className="text-rust shrink-0" />
              <span>AI 서버 응답이 지연되었습니다.</span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="font-bold text-teal hover:underline cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MarkdownText
            content={llmText || ""}
            className="text-[12px] font-normal leading-relaxed text-ink"
          />
        )}
      </div>

      {/* 권장 출발 타이밍 가이드 */}
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
