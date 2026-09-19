import { Bell, BellRinging, CheckCircle, Clock, Info, TrendDown, WarningCircle } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { Destination } from "../../../domain/types";
import { cn } from "../../../lib/cn";
import type { NotificationPermissionState } from "../notificationService";
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
  permission,
  requestPermission,
}: {
  destination: Destination | null;
  enabled: boolean;
  setEnabled: (value: boolean) => void | Promise<boolean | void>;
  timing: AlertTiming;
  setTiming: (value: AlertTiming) => void;
  permission: NotificationPermissionState;
  requestPermission: () => Promise<NotificationPermissionState>;
}) {
  const isGranted = permission === "granted";

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

      {/* 브라우저 알림 권한 유도 배너 */}
      {!isGranted && (
        <div className="mb-6 rounded-xl border border-amber-300/80 bg-amber-50/80 p-4 text-ink shadow-sm">
          {permission === "denied" ? (
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-red-100 text-red-600">
                <WarningCircle size={20} weight="bold" />
              </span>
              <div className="flex-1 text-[12px]">
                <strong className="block font-bold text-red-900">
                  브라우저 알림 권한이 차단되어 있습니다
                </strong>
                <p className="mt-1 text-[11px] leading-4 text-red-800/90">
                  실시간 알림을 받으시려면 <strong>브라우저 주소창 좌측의 설정/자물쇠 아이콘</strong>을 클릭하여 알림 권한을 <strong>[허용]</strong>으로 변경해 주세요.
                </p>
              </div>
            </div>
          ) : permission === "unsupported" ? (
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-600">
                <Info size={20} weight="bold" />
              </span>
              <div className="flex-1 text-[12px]">
                <strong className="block font-bold text-stone-900">
                  브라우저 알림 미지원 환경
                </strong>
                <p className="mt-1 text-[11px] leading-4 text-stone-600">
                  현재 사용 중인 브라우저 환경에서는 웹 알림을 지원하지 않습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-200/80 text-amber-900">
                  <BellRinging size={20} weight="bold" />
                </span>
                <div className="flex-1 text-[12px]">
                  <strong className="block font-bold text-amber-950">
                    브라우저 알림 권한을 먼저 허용해 주세요
                  </strong>
                  <p className="mt-1 text-[11px] leading-4 text-amber-900/90">
                    출발 전 관측지 혼잡도 변동 알림을 기기로 수신하려면 알림 권한 허용이 필요합니다.
                  </p>
                </div>
              </div>
              <Button
                className="w-full min-h-10 border-amber-700/30 bg-amber-600 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-amber-700"
                onClick={() => void requestPermission()}
                type="button"
              >
                <Bell size={16} weight="bold" /> 브라우저 알림 권한 허용하기
              </Button>
            </div>
          )}
        </div>
      )}

      {isGranted && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-teal/20 bg-teal/5 px-3.5 py-2 text-[11px] font-medium text-teal">
          <CheckCircle size={16} weight="fill" />
          <span>브라우저 알림 권한이 정상 허용되어 있습니다.</span>
        </div>
      )}

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
          onChange={(event) => void setEnabled(event.target.checked)}
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
