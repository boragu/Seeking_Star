import { Bell, Check, Clock, PaperPlaneTilt, SealCheck, WarningCircle } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import type { Destination } from "../../../domain/types";
import type { NotificationPermissionState } from "../notificationService";
import type { AlertTiming } from "../useAlertPreferences";

function permissionLabel(permission: NotificationPermissionState) {
  if (permission === "granted") return { text: "알림 권한 허용됨", color: "text-[#8ec0b2]" };
  if (permission === "denied") return { text: "브라우저에서 알림 차단됨", color: "text-red-300" };
  if (permission === "unsupported") return { text: "이 브라우저에서 알림 미지원", color: "text-stone-400" };
  return { text: "저장 시 권한 요청", color: "text-gold-light" };
}

export function AlertPreview({
  destination,
  timing,
  permission,
  saved,
  testSent,
  save,
  triggerTestAlert,
}: {
  destination: Destination | null;
  timing: AlertTiming;
  permission: NotificationPermissionState;
  saved: boolean;
  testSent: boolean;
  save: () => Promise<void>;
  triggerTestAlert: () => Promise<boolean>;
}) {
  const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
  const permInfo = permissionLabel(permission);

  return (
    <aside className="alert-preview relative overflow-hidden p-7 text-cream shadow-[0_24px_70px_rgba(6,18,30,.22)] max-md:p-5">
      <div className="absolute -right-12 -top-12 size-40 rounded-full border border-gold/12" />
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold">알림 수신 미리보기</h2>
      </div>

      <div className="my-6 rounded-2xl border border-cream/18 bg-white/8 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <span className="grid size-9 place-items-center rounded-xl bg-gold text-ink">
            <Bell weight="fill" />
          </span>
          <small className="text-[10px] text-cream/60">별보러간다 알림</small>
        </div>
        <strong className="font-display text-[17px]">
          {destination ? destination.name : "관측지 미선택"}
        </strong>
        <p className="mt-2 text-[11px] leading-5 text-cream/70">
          {destination?.concentrationRate !== null && destination?.concentrationRate !== undefined
            ? `현재 기준 예상 혼잡도는 ${destination.concentrationRate}입니다. 출발 전 변동 발생 시 알림이 전송됩니다.`
            : "출발 전 혼잡도 변동 시 알림이 전송됩니다."}
        </p>
      </div>

      <div className="space-y-3 border-y border-cream/12 py-4 text-[11px] text-cream/70">
        <p className="flex items-center gap-2">
          <Clock className="text-[#8ec0b2]" /> 발송 시점: 출발 {timingLabel} 전
        </p>
        <p className="flex items-center gap-2">
          {permission === "denied" ? (
            <WarningCircle className="text-red-400" />
          ) : (
            <SealCheck className={permInfo.color} />
          )}
          <span className={permInfo.color}>{permInfo.text}</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button className="w-full" variant="night" onClick={() => void save()} disabled={!destination}>
          {saved ? (
            <>
              <Check weight="bold" /> 알림 저장 완료
            </>
          ) : (
            <>알림 저장하기</>
          )}
        </Button>

        <Button
          className="w-full border-cream/20 bg-white/5 text-cream hover:bg-white/10"
          variant="ghost"
          onClick={() => void triggerTestAlert()}
          disabled={!destination}
        >
          {testSent ? (
            <>
              <Check className="text-teal-light" weight="bold" /> 테스트 알림 발송됨
            </>
          ) : (
            <>
              <PaperPlaneTilt weight="bold" /> 테스트 알림 발송
            </>
          )}
        </Button>
      </div>

      {permission === "denied" && (
        <p className="mt-3 text-[11px] leading-4 text-red-300/85">
          * 브라우저 설정에서 알림 권한이 차단되어 있습니다. 주소창 설정에서 알림을 허용으로 변경해 주세요.
        </p>
      )}
    </aside>
  );
}
