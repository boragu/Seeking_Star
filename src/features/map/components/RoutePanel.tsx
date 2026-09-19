import { ArrowLeft, ArrowRight, Car, Crosshair, MapPin, NavigationArrow, Tent, TrendDown } from "@phosphor-icons/react";
import type { Navigate } from "../../../app/navigation";
import { Button } from "../../../components/ui/Button";
import { Metric } from "../../../components/ui/Metric";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";
import { addMinutesToTime } from "../../../lib/currentContext";

export function RoutePanel({ navigate, planner, destination, route }: { navigate: Navigate; planner: PlannerState; destination: Destination; route: RouteEstimate | null }) {
  const arrival = route ? addMinutesToTime(planner.time, route.durationMinutes) : null;
  return <aside className="overflow-y-auto border-r border-cream/12 bg-[#091927] px-7 py-6 max-md:overflow-visible max-md:border-r-0 max-md:px-5">
    <button className="mb-7 flex min-h-8 items-center gap-2 text-[11px] text-cream/52 transition hover:text-cream" onClick={() => navigate("/planner")} type="button"><ArrowLeft /> 장소 다시 고르기</button>
    <span className="text-[10px] font-bold tracking-[.16em] text-gold-light">ROUTE CHECK</span>
    <h1 className="my-3 font-display text-[34px] font-bold leading-[1.18] tracking-[-.045em]">{planner.departure}에서<br /><em className="not-italic text-gold-light">{destination.name}</em>까지</h1>
    <p className="text-[11px] leading-5 text-cream/52">현재 위치와 관광지 좌표를 바탕으로 이동 부담을 먼저 확인해요.</p>

    <section className="my-6 border-y border-cream/14 py-5"><div className="mb-3 flex items-center gap-2 text-[#8ec0b2]"><NavigationArrow /><strong className="text-[11px]">예상 이동</strong></div>{route ? <><div className="flex items-end justify-between gap-4"><strong className="font-display text-[30px] text-cream">{route.duration}</strong>{arrival && <span className="pb-1 text-[11px] text-gold-light">{arrival} 도착 예상</span>}</div><p className="mt-2 flex items-center gap-2 text-[10px] text-cream/65"><Car /> {route.distance}</p><small className="mt-3 block text-[9px] leading-4 text-cream/38">{route.note}. 실제 도로·교통 상황에 따라 달라질 수 있어요.</small></> : <p className="text-[11px] leading-5 text-cream/58"><Crosshair className="mr-1 inline" />현재 위치를 허용하면 거리와 예상 시간을 계산해 드려요.</p>}</section>

    <div className="grid grid-cols-2 divide-x divide-cream/12 border-y border-cream/12"><Metric dark icon={TrendDown} label="오늘의 여유" value={destination.calm === null ? "확인 중" : `${destination.calm}점`} /><Metric dark icon={Tent} label="주변 캠핑장" value={`${destination.nearbyCampgrounds.length}곳`} /></div>
    <p className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-cream/48"><MapPin className="mt-0.5 shrink-0 text-[#8ec0b2]" />{destination.address || `${destination.latitude ?? "—"}, ${destination.longitude ?? "—"}`}</p>
    <Button className="mt-6 w-full" variant="night" onClick={() => navigate("/trips")}>이 장소로 여정 만들기 <ArrowRight /></Button>
  </aside>;
}
