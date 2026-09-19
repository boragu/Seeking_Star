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
  isMobileSheet = false,
  requestCurrentLocation,
  locationFeedback,
}: {
  navigate: Navigate;
  planner: PlannerState;
  destination: Destination;
  route: RouteEstimate | null;
  isMobileSheet?: boolean;
  requestCurrentLocation?: () => void;
  locationFeedback?: { status: string; message: string };
}) {
  const arrival = route ? addMinutesToTime(planner.time, route.durationMinutes) : null;

  return (
    <aside
      className={
        isMobileSheet
          ? "w-full text-cream pb-2"
          : "overflow-y-auto border-r border-cream/12 bg-[#091927] px-7 py-6"
      }
    >
      {!isMobileSheet && (
        <button
          className="mb-6 flex min-h-8 items-center gap-2 text-[12px] text-cream/60 transition hover:text-cream"
          onClick={() => navigate("/planner")}
          type="button"
        >
          <ArrowLeft /> 관측지 목록으로
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <h1 className="my-2 font-display text-[26px] font-bold leading-[1.2] tracking-[-.03em] md:text-[30px]">
          {planner.departure}에서<br />
          <em className="not-italic text-gold-light">{destination.name}</em>까지
        </h1>
        {requestCurrentLocation && (
          <button
            type="button"
            onClick={requestCurrentLocation}
            className="mt-2 shrink-0 flex items-center gap-1 rounded-full border border-cream/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cream/80 hover:bg-white/10 hover:text-gold-light transition"
            title="현재 내 위치로 재계산"
          >
            <Crosshair size={14} className={locationFeedback?.status === "loading" ? "animate-spin text-teal" : ""} />
            <span>내 위치</span>
          </button>
        )}
      </div>

      <p className="text-[12px] leading-5 text-cream/65">
        출발지부터 목적지까지의 예상 이동 경로 및 거리 정보입니다.
      </p>

      <section className="my-5 border-y border-cream/14 py-4">
        <div className="mb-2.5 flex items-center justify-between text-[#8ec0b2]">
          <div className="flex items-center gap-1.5">
            <NavigationArrow />
            <strong className="text-[12px]">예상 이동 소요</strong>
          </div>
          {planner.locationSource === "device" && (
            <span className="text-[10px] text-teal-300">실시간 GPS 반영</span>
          )}
        </div>

        {route ? (
          <>
            <div className="flex items-end justify-between gap-4">
              <strong className="font-display text-[28px] text-cream md:text-[30px]">{route.duration}</strong>
              {arrival && <span className="pb-1 text-[12px] text-gold-light">{arrival} 도착 예상</span>}
            </div>
            <p className="mt-1.5 flex items-center gap-2 text-[11px] text-cream/70">
              <Car /> {route.distance}
            </p>
            <small className="mt-2.5 block text-[10px] leading-4 text-cream/45">
              {route.note} (실제 도로·교통 상황에 따라 차이가 발생할 수 있습니다)
            </small>
          </>
        ) : (
          <div className="rounded-lg bg-white/5 p-3.5 border border-cream/12">
            <p className="text-[11px] leading-relaxed text-cream/75 mb-2.5">
              출발 위치 좌표가 설정되지 않았습니다. 현재 계신 위치를 확인하여 정확한 이동 시간과 거리를 계산합니다.
            </p>
            {requestCurrentLocation && (
              <button
                type="button"
                onClick={requestCurrentLocation}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal py-2 text-[12px] font-bold text-white hover:bg-teal/80 transition"
              >
                <Crosshair size={16} /> 현재 위치로 시간·거리 계산하기
              </button>
            )}
          </div>
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

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-cream/55">
        <MapPin className="mt-0.5 shrink-0 text-[#8ec0b2]" />
        {destination.address || `${destination.latitude ?? "—"}, ${destination.longitude ?? "—"}`}
      </p>

      <Button className="mt-5 w-full" variant="night" onClick={() => navigate("/trips")}>
        여정 확인 및 저장 <ArrowRight />
      </Button>
    </aside>
  );
}
