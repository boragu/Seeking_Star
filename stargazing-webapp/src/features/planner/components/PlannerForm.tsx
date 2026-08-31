import { ArrowRight, CalendarBlank, Car, CaretDown, Clock, Crosshair, Info, MapPin, SealCheck, UsersThree, Wheelchair } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import { Field, FieldFrame } from "../../../components/ui/Field";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { PlannerState } from "../../../domain/types";
import type { LocationFeedback } from "../../location/useDeviceLocation";
import { getCurrentDateTime } from "../../../lib/currentContext";
import { cn } from "../../../lib/cn";

export function PlannerForm({ planner, setPlanner, status, locationFeedback, requestCurrentLocation, reload }: { planner: PlannerState; setPlanner: React.Dispatch<React.SetStateAction<PlannerState>>; status: "idle" | "loading" | "success" | "error"; locationFeedback: LocationFeedback; requestCurrentLocation: () => void; reload: () => void }) {
  const update = <K extends keyof PlannerState,>(key: K, value: PlannerState[K]) => setPlanner((state) => ({ ...state, [key]: value }));
  const updateDeparture = (departure: string) => setPlanner((state) => ({ ...state, departure, latitude: null, longitude: null, locationAccuracy: null, locationSource: "manual" }));
  const useCurrentTime = () => setPlanner((state) => ({ ...state, ...getCurrentDateTime() }));
  const locationProblem = ["denied", "error", "unsupported"].includes(locationFeedback.status);

  return <section className="sticky top-[96px] self-start border border-line bg-[rgba(255,253,247,.72)] p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] backdrop-blur-md max-md:static max-md:p-5"><SectionHeading number="01" title="여행 조건" description="오늘의 출발 조건에 맞춰 장소를 다시 골라요." />
    <div className="space-y-4">
      <Field label="출발지" hint={<span className={cn("flex items-center gap-1.5", locationProblem ? "text-rust" : "text-teal")}>{locationFeedback.status === "success" ? <SealCheck weight="fill" /> : <Info />} {locationFeedback.message}</span>}><FieldFrame icon={<MapPin />} invalid={locationProblem}><input className="w-full min-w-0 bg-transparent text-[13px] outline-none" value={planner.departure} onChange={(event) => updateDeparture(event.target.value)} aria-label="출발지" /><button className="grid size-8 shrink-0 place-items-center text-teal disabled:opacity-45" aria-label="현재 위치 사용" onClick={requestCurrentLocation} disabled={locationFeedback.status === "loading"} type="button"><Crosshair className={locationFeedback.status === "loading" ? "animate-spin" : undefined} /></button></FieldFrame></Field>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1"><Field label="날짜"><FieldFrame icon={<CalendarBlank />}><input className="w-full bg-transparent text-[13px] outline-none" type="date" value={planner.date} onChange={(event) => update("date", event.target.value)} /></FieldFrame></Field><Field label="출발 시간" action={<button className="text-[10px] font-medium text-teal underline underline-offset-2" onClick={useCurrentTime} type="button">지금으로</button>}><FieldFrame icon={<Clock />}><input className="w-full bg-transparent text-[13px] outline-none" type="time" value={planner.time} onChange={(event) => update("time", event.target.value)} /></FieldFrame></Field></div>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1"><Field label="인원"><FieldFrame icon={<UsersThree />}><select className="w-full appearance-none bg-transparent text-[13px] outline-none" value={planner.people} onChange={(event) => update("people", event.target.value as PlannerState["people"])}><option value="1">1명</option><option value="2">2명</option><option value="3">3명</option><option value="4">4명 이상</option></select><CaretDown /></FieldFrame></Field><Field label="이동 수단"><FieldFrame icon={<Car />}><select className="w-full appearance-none bg-transparent text-[13px] outline-none" value={planner.transport} onChange={(event) => update("transport", event.target.value as PlannerState["transport"])}><option value="car">자가용</option><option value="rental">렌터카</option></select><CaretDown /></FieldFrame></Field></div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 border-y border-line py-2 text-[11px] text-stone-600"><input className="size-4 accent-teal" type="checkbox" checked={planner.accessibility} onChange={(event) => update("accessibility", event.target.checked)} /><Wheelchair size={18} className="text-teal" /><span>무장애 정보가 있는 장소를 우선할게요.</span></label>
      <Button className="w-full" variant="primary" onClick={reload} disabled={status === "loading"}>장소 다시 찾기 <ArrowRight /></Button>
    </div>
  </section>;
}
