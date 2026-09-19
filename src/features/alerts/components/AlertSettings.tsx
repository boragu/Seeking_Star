import { Clock, TrendDown } from "@phosphor-icons/react";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { Destination } from "../../../domain/types";
import { cn } from "../../../lib/cn";
import type { AlertTiming } from "../useAlertPreferences";

const timingOptions: Array<{ value: AlertTiming; label: string }> = [{ value: "15", label: "15분 전" }, { value: "30", label: "30분 전" }, { value: "60", label: "1시간 전" }];

export function AlertSettings({ destination, enabled, setEnabled, timing, setTiming }: { destination: Destination | null; enabled: boolean; setEnabled: (value: boolean) => void; timing: AlertTiming; setTiming: (value: AlertTiming) => void }) {
  return <section className="border border-line bg-white/48 p-7 shadow-[0_20px_60px_rgba(68,49,29,.06)] max-md:p-5"><SectionHeading number="01" title="알림 조건" description={destination ? `${destination.name}의 출발 전 변화를 확인해요.` : "추천 장소를 먼저 선택해 주세요."} />
    <label className="grid min-h-[92px] cursor-pointer grid-cols-[44px_1fr_46px] items-center gap-3 border-y border-line"><span className="grid size-11 place-items-center rounded-full bg-teal/8 text-teal"><TrendDown size={22} /></span><span className="flex flex-col"><strong className="font-display text-[16px]">예상 혼잡도 변화</strong><small className="mt-1 text-[10px] leading-4 text-stone-500">출발 전 장소가 예상보다 붐비거나 한산해질 때</small></span><input className="peer sr-only" type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} disabled={!destination} /><i className="relative h-6 w-[44px] rounded-full bg-stone-400 transition after:absolute after:left-[3px] after:top-[3px] after:size-[18px] after:rounded-full after:bg-white after:transition peer-checked:bg-teal peer-checked:after:translate-x-5 peer-disabled:opacity-45" /></label>
    <div className="mt-6"><div className="mb-3 flex items-center gap-2 text-[12px] font-bold"><Clock className="text-teal" /> 출발 몇 분 전에 확인할까요?</div><div className="grid grid-cols-3 gap-2">{timingOptions.map((option) => <button className={cn("min-h-11 border text-[11px] font-bold transition", timing === option.value ? "border-teal bg-teal text-white" : "border-line bg-white/40 text-stone-600 hover:border-teal/45")} aria-pressed={timing === option.value} key={option.value} onClick={() => setTiming(option.value)} type="button">{option.label}</button>)}</div></div>
    <p className="mt-5 text-[10px] leading-5 text-stone-500">설정은 현재 기기에 저장돼요. 알림 권한이 꺼져 있으면 저장할 때 허용을 요청합니다.</p>
  </section>;
}
