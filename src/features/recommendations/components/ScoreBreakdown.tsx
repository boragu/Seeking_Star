import { Info } from "@phosphor-icons/react";
import type { RankedDestination, ScoreKey } from "../../../lib/recommendationEngine";

interface MetricSlot {
  key: ScoreKey;
  label: string;
}

const DEFAULT_METRIC_SLOTS: MetricSlot[] = [
  { key: "crowd", label: "혼잡 분산" },
  { key: "travel", label: "이동 효율" },
  { key: "camping", label: "캠핑 편의" },
  { key: "sightseeing", label: "연관 관광" },
  { key: "sky", label: "관측 여건" },
];

export function ScoreBreakdown({ destination }: { destination: RankedDestination }) {
  if (destination.analysis.total === null) {
    return (
      <div className="border-y border-line py-4 text-[11px] leading-5 text-stone-500">
        <Info className="mr-1.5 inline text-teal" /> 점수 산출에 필요한 공공데이터 항목이 부족합니다.
      </div>
    );
  }

  const slots: MetricSlot[] = destination.analysis.breakdown.accessibility !== undefined
    ? [
        ...DEFAULT_METRIC_SLOTS.slice(0, 4),
        { key: "accessibility", label: "접근성" },
        DEFAULT_METRIC_SLOTS[4],
      ]
    : DEFAULT_METRIC_SLOTS;

  return (
    <section className="border-y border-line py-4" aria-label="점수 산출 상세">
      <div className="mb-4 flex items-center justify-between gap-2 max-sm:flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-bold text-teal whitespace-nowrap">항목별 지표 분석</span>
        </div>
        <span className="shrink-0 text-[11px] text-stone-500 whitespace-nowrap">공공데이터 기준 가중치 산출</span>
      </div>
      <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
        {slots.map(({ key, label }) => {
          const value = destination.analysis.breakdown[key];
          const hasValue = value !== undefined && value !== null;

          return (
            <div key={key}>
              <div className="mb-1.5 flex justify-between gap-2 text-[11px]">
                <span className={hasValue ? "text-stone-600 dark:text-stone-300" : "text-stone-400 dark:text-stone-600"}>
                  {label}
                </span>
                {hasValue ? (
                  <strong>{value}</strong>
                ) : (
                  <span className="text-stone-400 dark:text-stone-600 font-medium" title="공공데이터 미제공 또는 결측">-</span>
                )}
              </div>
              <div className="h-1 overflow-hidden bg-stone-200 dark:bg-stone-800 rounded-full">
                <i
                  className={`block h-full transition-all duration-300 ${hasValue ? "bg-teal" : "bg-transparent"}`}
                  style={{ width: hasValue ? `${value}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

