import { ArrowLeft, ArrowRight, Car, Crosshair, MapPin, NavigationArrow, Tent, TrendDown } from "@phosphor-icons/react";
import type { Navigate } from "../../../app/navigation";
import { Button } from "../../../components/ui/Button";
import { Metric } from "../../../components/ui/Metric";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";
import { addMinutesToTime } from "../../../lib/currentContext";

export function RoutePanel({
  navigate,
  planner,
  destination,
  route,
}: {
  navigate: Navigate;
  planner: PlannerState;
  destination: Destination;
  route: RouteEstimate | null;
}) {
  const arrival = route ? addMinutesToTime(planner.time, route.durationMinutes) : null;
  return (
    <aside className="overflow-y-auto border-r border-cream/12 bg-[#091927] px-7 py-6 max-md:absolute max-md:inset-x-0 max-md:bottom-0 max-md:z-10 max-md:max-h-[55vh] max-md:rounded-t-2xl max-md:border-t max-md:border-cream/15 max-md:px-5 max-md:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="hidden max-md:mb-3 max-md:flex max-md:justify-center">
        <div className="h-1.5 w-10 rounded-full bg-cream/20" />
      </div>
      <button
        className="mb-6 flex min-h-8 items-center gap-2 text-[12px] text-cream/60 transition hover:text-cream max-md:mb-4"
        onClick={() => navigate("/planner")}
        type="button"
      >
        <ArrowLeft /> 관측지 목록으로
      </button>
      <h1 className="my-3 font-display text-[30px] font-bold leading-[1.2] tracking-[-.03em]">
        {planner.departure}에서<br />
        <em className="not-italic text-gold-light">{destination.name}</em>까지
      </h1>
      <p className="text-[12px] leading-5 text-cream/65">
        출발지부터 목적지까지의 예상 이동 경로 및 거리 정보입니다.
      </p>

      <section className="my-6 border-y border-cream/14 py-5">
        <div className="mb-3 flex items-center gap-2 text-[#8ec0b2]">
          <NavigationArrow />
          <strong className="text-[12px]">예상 이동 소요</strong>
        </div>
        {route ? (
          <>
            <div className="flex items-end justify-between gap-4">
              <strong className="font-display text-[30px] text-cream">{route.duration}</strong>
              {arrival && <span className="pb-1 text-[12px] text-gold-light">{arrival} 도착 예상</span>}
            </div>
            <p className="mt-2 flex items-center gap-2 text-[11px] text-cream/70">
              <Car /> {route.distance}
            </p>
            <small className="mt-3 block text-[10px] leading-4 text-cream/45">
              {route.note} (실제 도로·교통 상황에 따라 차이가 발생할 수 있습니다)
            </small>
          </>
        ) : (
          <p className="text-[11px] leading-5 text-cream/58">
            <Crosshair className="mr-1 inline" />
            현재 위치를 설정하시면 거리와 예상 소요 시간이 계산됩니다.
          </p>
        )}
      </section>

      <div className="grid grid-cols-2 divide-x divide-cream/12 border-y border-cream/12">
        <Metric
          dark
          icon={TrendDown}
          label="한적도 지수"
          value={destination.calm === null ? "확인 중" : `${destination.calm}점`}
        />
        <Metric
          dark
          icon={Tent}
          label="주변 캠핑장"
          value={`${destination.nearbyCampgrounds.length}곳`}
        />
      </div>
      <p className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-cream/55">
        <MapPin className="mt-0.5 shrink-0 text-[#8ec0b2]" />
        {destination.address || `${destination.latitude ?? "—"}, ${destination.longitude ?? "—"}`}
      </p>
      <Button className="mt-6 w-full" variant="night" onClick={() => navigate("/trips")}>
        여정 확인 및 저장 <ArrowRight />
      </Button>
    </aside>
  );
}
