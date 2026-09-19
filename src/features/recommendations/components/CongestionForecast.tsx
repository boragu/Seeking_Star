import { Clock, Info, ShieldCheck, Warning } from "@phosphor-icons/react";
import type { Destination } from "../../../domain/types";
import { calculateCongestionForecast } from "../../../lib/congestionForecast";

export function CongestionForecast({
  destination,
  dateString,
}: {
  destination: Destination;
  dateString?: string;
}) {
  const forecast = calculateCongestionForecast(destination, dateString);

  return (
    <div className="mt-4 border border-line bg-paper/60 p-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-2.5 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex items-center gap-1.5">
          <Clock size={18} className="text-teal" />
          <h3 className="font-display text-[14px] font-bold text-ink">
            시간대별 혼잡도 & 진입로 병목 예측
          </h3>
        </div>
        <span className="shrink-0 text-[11px] text-stone-500">
          요일·시간대별 가중치 예측 모델
        </span>
      </div>

      {/* 골든 타임 안내 */}
      <div className="mt-3 flex items-start gap-2.5 rounded border border-line/60 bg-white/60 p-2.5 text-[11px] leading-relaxed text-stone-700">
        <ShieldCheck size={16} weight="fill" className="mt-0.5 shrink-0 text-teal" />
        <div>
          <strong className="font-bold text-ink">권장 분산 진입 시간(골든타임): {forecast.goldenTime}</strong>
          <p className="mt-0.5 text-stone-600">{forecast.goldenTimeReason}</p>
        </div>
      </div>

      {/* 시간대별 혼잡 차트 */}
      <div className="mt-3.5 grid grid-cols-6 gap-2 max-sm:grid-cols-3 max-sm:gap-y-3">
        {forecast.forecasts.map((item) => {
          const isHigh = item.level === "혼잡" || item.level === "매우혼잡";
          const barColor =
            item.level === "매우혼잡"
              ? "bg-rust"
              : item.level === "혼잡"
              ? "bg-gold"
              : item.level === "보통"
              ? "bg-teal/70"
              : "bg-teal";

          return (
            <div
              key={item.timeLabel}
              className="flex flex-col items-center rounded border border-line/50 bg-white/50 p-2 text-center"
            >
              <span className="text-[11px] font-medium text-stone-600">{item.timeLabel}</span>
              
              <div className="my-2 h-14 w-3.5 overflow-hidden rounded-full bg-stone-200 flex flex-col justify-end">
                <div
                  className={`w-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ height: `${item.congestionScore}%` }}
                />
              </div>

              <div className="flex items-center gap-0.5">
                {item.bottleneckRisk && (
                  <span title="산간 병목 주의" className="inline-flex">
                    <Warning size={12} weight="fill" className="text-rust" />
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold ${
                    isHigh ? "text-rust" : "text-ink"
                  }`}
                >
                  {item.level}
                </span>
              </div>
              <span className="mt-0.5 text-[9px] text-stone-500">{item.congestionScore}%</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500">
        <Info size={13} className="shrink-0 text-teal" />
        <span>관광 집중률 데이터에 주말 피크 계수 및 산간 1차선 병목 민감도를 반영한 시간대별 시계열 예측치입니다.</span>
      </div>
    </div>
  );
}
