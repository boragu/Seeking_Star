import { Bell, Check, Clock, SealCheck } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import type { Destination } from "../../../domain/types";
import type { AlertTiming } from "../useAlertPreferences";

function permissionLabel(permission: NotificationPermission | "unsupported") {
  if (permission === "granted") return "알림 허용됨";
  if (permission === "denied") return "알림 차단됨";
  if (permission === "unsupported") return "이 기기에서 지원 안 됨";
  return "저장할 때 권한 확인";
}

export function AlertPreview({ destination, timing, permission, saved, save }: { destination: Destination | null; timing: AlertTiming; permission: NotificationPermission | "unsupported"; saved: boolean; save: () => Promise<void> }) {
  const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
  return <aside className="alert-preview relative overflow-hidden p-7 text-cream shadow-[0_24px_70px_rgba(6,18,30,.22)] max-md:p-5"><div className="absolute -right-12 -top-12 size-40 rounded-full border border-gold/12" /><span className="text-[10px] font-bold tracking-[.16em] text-gold-light">NOTIFICATION PREVIEW</span><h2 className="mt-2 font-display text-2xl font-bold">출발 전, 한 번 더 살펴볼게요.</h2>
    <div className="my-6 rounded-2xl border border-cream/18 bg-white/8 p-5 backdrop-blur"><div className="mb-4 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-gold text-ink"><Bell weight="fill" /></span><small className="text-[9px] text-cream/48">별보러간다 · 지금</small></div><strong className="font-display text-[17px]">{destination ? destination.name : "선택한 장소가 없어요"}</strong><p className="mt-2 text-[10px] leading-5 text-cream/62">{destination?.concentrationRate !== null && destination?.concentrationRate !== undefined ? `현재 예상 혼잡도는 ${destination.concentrationRate}예요. 출발 전에 달라지면 알려드릴게요.` : "혼잡도 정보가 확인되면 출발 전에 다시 알려드릴게요."}</p></div>
    <div className="space-y-3 border-y border-cream/12 py-4 text-[10px] text-cream/58"><p className="flex items-center gap-2"><Clock className="text-[#8ec0b2]" /> 확인 시점 · 출발 {timingLabel} 전</p><p className="flex items-center gap-2"><SealCheck className="text-[#8ec0b2]" /> {permissionLabel(permission)}</p></div>
    <Button className="mt-6 w-full" variant="night" onClick={() => void save()} disabled={!destination}>{saved ? <><Check /> 알림 저장됨</> : <>알림 저장하기</>}</Button>
  </aside>;
}
