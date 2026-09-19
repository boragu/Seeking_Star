import { useEffect, useState } from "react";
import { ArrowClockwise, Camera, DeviceMobile, Sparkle, WarningCircle } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import { MarkdownText } from "../../../components/ui/MarkdownText";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { Destination, PlannerState } from "../../../domain/types";
import { requestAiAstrophotographyGuide } from "../aiStargazingService";
import {
  getCachedAiPhotoGuide,
  setCachedAiPhotoGuide,
  invalidateCachedAiPhotoGuide,
} from "../aiBriefingCache";

export function AiCameraGuideCard({
  destination,
  planner,
}: {
  destination: Destination;
  planner: PlannerState;
}) {
  const [deviceType, setDeviceType] = useState<"smartphone" | "camera">("smartphone");
  const [guideText, setGuideText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // 1. 캐시 조회
    const cached = getCachedAiPhotoGuide(destination, planner, deviceType);
    if (cached) {
      setGuideText(cached);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // 2. AI 실시간 호출
    setIsLoading(true);
    setHasError(false);
    setGuideText(null);

    requestAiAstrophotographyGuide(destination, planner, deviceType, controller.signal)
      .then((content) => {
        if (!isMounted) return;
        if (content) {
          setGuideText(content);
          setCachedAiPhotoGuide(destination, planner, deviceType, content);
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
  }, [destination.id, planner.date, deviceType, refreshKey]);

  const handleRefresh = () => {
    invalidateCachedAiPhotoGuide(destination, planner, deviceType);
    setGuideText(null);
    setHasError(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="rounded-lg border border-line bg-paper/60 p-4">
      {/* 헤더: 타이틀 + 탭 전환 버튼 + 새로고침 */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Camera size={18} weight="fill" className="text-teal" />
            <h4 className="font-display text-[13px] font-bold text-ink">
              AI 야간 밤하늘 촬영 가이드
            </h4>
          </div>
          <AiBadge label="AI 가이드" variant="teal" />
        </div>

        <div className="flex items-center gap-2">
          {/* 기기 선택 탭 */}
          <div className="flex rounded bg-white/70 p-0.5 border border-line/60">
            <button
              type="button"
              onClick={() => setDeviceType("smartphone")}
              className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                deviceType === "smartphone"
                  ? "bg-teal text-white shadow-xs"
                  : "text-stone-600 hover:text-ink"
              }`}
            >
              <DeviceMobile size={13} />
              스마트폰
            </button>
            <button
              type="button"
              onClick={() => setDeviceType("camera")}
              className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                deviceType === "camera"
                  ? "bg-teal text-white shadow-xs"
                  : "text-stone-600 hover:text-ink"
              }`}
            >
              <Camera size={13} />
              카메라/DSLR
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 text-stone-500 hover:text-teal disabled:opacity-50 transition cursor-pointer"
            title="촬영 가이드 다시 생성"
          >
            <ArrowClockwise size={14} className={isLoading ? "animate-spin text-teal" : ""} />
          </button>
        </div>
      </div>

      {/* 가이드 본문 */}
      <div className="mt-3 min-h-[50px]">
        {isLoading ? (
          <div className="space-y-2.5 py-1">
            <div className="flex items-center gap-2 text-[11px] text-teal font-medium">
              <Sparkle size={14} className="text-teal animate-spin" />
              <span>월령 및 광공해 조건을 분석하여 {deviceType === "smartphone" ? "스마트폰" : "카메라"} 최적 촬영값을 계산 중입니다…</span>
            </div>
            <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
          </div>
        ) : hasError ? (
          <div className="flex items-center justify-between rounded border border-line/60 bg-white/50 p-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <WarningCircle size={15} className="text-rust shrink-0" />
              <span>촬영 가이드 생성 중 일시적인 지연이 발생했습니다.</span>
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
            content={guideText || ""}
            className="text-[11.5px] font-normal leading-relaxed text-ink"
          />
        )}
      </div>
    </div>
  );
}
