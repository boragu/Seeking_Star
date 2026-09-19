import { Clock, TrendDown } from "@phosphor-icons/react";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { Destination } from "../../../domain/types";
import { cn } from "../../../lib/cn";
import type { AlertTiming } from "../useAlertPreferences";

const timingOptions: Array<{ value: AlertTiming; label: string }> = [
  { value: "15", label: "15분 전" },
  { value: "30", label: "30분 전" },
  { value: "60", label: "1시간 전" },
];

export function AlertSettings({
  destination,
  enabled,
  setEnabled,
  timing,
  setTiming,
}: {
  destination: Destination | null;
  enabled: boolean;
  setEnabled: (value: boolean) => void | Promise<void>;
  timing: AlertTiming;
  setTiming: (value: AlertTiming) => void;
}) {
  return (
    <section className="border border-line bg-white/48 p-7 shadow-[0_20px_60px_rgba(68,49,29,.06)] max-md:p-5">
      <SectionHeading
        number="01"
        title="알림 설정"
        description={
          destination
            ? `${destination.name}의 혼잡도 변동 시 알림을 전송합니다.`
            : "관측지를 먼저 선택해 주세요."
        }
      />
      <label className="grid min-h-[92px] cursor-pointer grid-cols-[44px_1fr_46px] items-center gap-3 border-y border-line">
        <span className="grid size-11 place-items-center rounded-full bg-teal/8 text-teal">
          <TrendDown size={22} />
        </span>
        <span className="flex flex-col">
          <strong className="font-display text-[16px]">예상 혼잡도 변동 알림</strong>
          <small className="mt-1 text-[11px] leading-4 text-stone-500">
            출발 전 관측지 혼잡도가 급증하거나 완화될 때 안내
          </small>
        </span>
        <input
          className="peer sr-only"
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          disabled={!destination}
        />
        <i className="relative h-6 w-[44px] rounded-full bg-stone-400 transition after:absolute after:left-[3px] after:top-[3px] after:size-[18px] after:rounded-full after:bg-white after:transition peer-checked:bg-teal peer-checked:after:translate-x-5 peer-disabled:opacity-45" />
      </label>
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-bold">
          <Clock className="text-teal" /> 알림 발송 시점
        </div>
        <div className="grid grid-cols-3 gap-2">
          {timingOptions.map((option) => (
            <button
              className={cn(
                "min-h-11 border text-[11px] font-bold transition",
                timing === option.value
                  ? "border-teal bg-teal text-white"
                  : "border-line bg-white/40 text-stone-600 hover:border-teal/45"
              )}
              aria-pressed={timing === option.value}
              key={option.value}
              onClick={() => setTiming(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-5 text-[11px] leading-5 text-stone-500">
        설정은 변경 시 기기에 자동 저장되며, 알림 수신을 위해 브라우저 알림 권한 허용이 필요합니다.
      </p>
    </section>
  );
}
