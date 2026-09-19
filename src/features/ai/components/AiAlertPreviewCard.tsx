import { useEffect, useState } from "react";
import { BellRinging, Sparkle, WarningCircle } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import { MarkdownText } from "../../../components/ui/MarkdownText";
import type { Destination, PlannerState } from "../../../domain/types";
import { requestAiAlertMessage } from "../aiStargazingService";
import {
  getCachedAiAlertMessage,
  setCachedAiAlertMessage,
} from "../aiBriefingCache";

export function AiAlertPreviewCard({
  destination,
  planner,
}: {
  destination: Destination | null;
  planner: PlannerState;
}) {
  const [alertText, setAlertText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!destination) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const cached = getCachedAiAlertMessage(destination, planner);
    if (cached) {
      setAlertText(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    requestAiAlertMessage(destination, planner, controller.signal)
      .then((content) => {
        if (!isMounted) return;
        if (content) {
          setAlertText(content);
          setCachedAiAlertMessage(destination, planner, content);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [destination?.id, planner.departure, planner.date, planner.time]);

  if (!destination) return null;

  return (
    <div className="rounded-lg border border-line bg-paper/70 p-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
        <div className="flex items-center gap-2">
          <BellRinging size={16} weight="fill" className="text-teal" />
          <h4 className="font-display text-[13px] font-bold text-ink">
            AI 맞춤 출발 알림 미리보기
          </h4>
        </div>
        <AiBadge label="AI 알림" variant="teal" />
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-1.5 animate-pulse py-1">
            <div className="flex items-center gap-2 text-[11px] text-stone-600">
              <Sparkle size={13} className="text-teal animate-spin" />
              <span>실시간 천문 골든타임 기반 맞춤 알림 메시지를 작성 중입니다...</span>
            </div>
            <div className="h-3 w-4/5 rounded bg-line/60" />
          </div>
        ) : alertText ? (
          <div className="rounded border border-teal/25 bg-white/80 p-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal mb-1">
              <span>🔔 [별보러간다] 골든타임 출발 알림</span>
            </div>
            <MarkdownText
              content={alertText}
              className="text-[12px] font-medium leading-relaxed text-ink"
            />
          </div>
        ) : (
          <p className="text-[11px] text-stone-500">
            {planner.departure} 출발 · {destination.name} 관측 골든타임에 맞춰 알림이 전송됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
