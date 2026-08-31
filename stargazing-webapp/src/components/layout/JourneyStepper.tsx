import { Check } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

const steps = ["조건 입력", "위치 확인", "여정 확정"];

export function JourneyStepper({ current, dark = false }: { current: 1 | 2 | 3; dark?: boolean }) {
  return <ol className={cn("mx-auto flex w-full max-w-[760px] items-center justify-center", dark ? "text-cream/42" : "text-stone-400")} aria-label={`전체 3단계 중 ${current}단계`}>{steps.map((label, index) => { const step = (index + 1) as 1 | 2 | 3; const active = step === current; const done = step < current; return <li className="flex flex-1 items-center gap-2 text-[11px]" key={label}><span className={cn("grid size-7 shrink-0 place-items-center rounded-full border text-[10px] transition", active && "border-rust bg-rust text-white", done && "border-teal bg-teal text-white", !active && !done && (dark ? "border-cream/28" : "border-stone-400"))}>{done ? <Check /> : step}</span><strong className={cn("whitespace-nowrap max-md:hidden", active && (dark ? "text-cream" : "text-ink"), done && "text-teal")}>{label}</strong>{step < 3 && <i className={cn("mx-3 h-px flex-1", dark ? "bg-cream/15" : "bg-line")} />}</li>; })}</ol>;
}
