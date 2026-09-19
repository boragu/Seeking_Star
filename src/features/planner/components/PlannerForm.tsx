import { useState } from "react";
import { ArrowRight, CalendarBlank, Car, CaretDown, Clock, Crosshair, Info, MapPin, SealCheck, UsersThree, Wheelchair } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import { Field, FieldFrame } from "../../../components/ui/Field";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { PlannerState } from "../../../domain/types";
import type { LocationFeedback } from "../../location/useDeviceLocation";
import { findHubCoordinates, getCurrentDateTime } from "../../../lib/currentContext";
import { cn } from "../../../lib/cn";

export function PlannerForm({
  planner,
  setPlanner,
  status,
  locationFeedback,
  requestCurrentLocation,
  reload,
}: {
  planner: PlannerState;
  setPlanner: React.Dispatch<React.SetStateAction<PlannerState>>;
  status: "idle" | "loading" | "success" | "error";
  locationFeedback: LocationFeedback;
  requestCurrentLocation: () => void;
  reload: () => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const update = <K extends keyof PlannerState,>(key: K, value: PlannerState[K]) =>
    setPlanner((state) => ({ ...state, [key]: value }));
  const updateDeparture = (departure: string) => {
    const hub = findHubCoordinates(departure);
    setPlanner((state) => ({
      ...state,
      departure,
      latitude: hub ? hub.latitude : (state.latitude ?? 37.5559),
      longitude: hub ? hub.longitude : (state.longitude ?? 126.9723),
      locationAccuracy: null,
      locationSource: "manual",
    }));
  };
  const useCurrentTime = () => setPlanner((state) => ({ ...state, ...getCurrentDateTime() }));
  const locationProblem = ["denied", "error", "unsupported"].includes(locationFeedback.status);

  const handleSubmit = () => {
    reload();
    setIsCollapsed(true);
  };

  return (
    <section className="sticky top-[96px] self-start border border-line bg-[rgba(255,253,247,.72)] p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] backdrop-blur-md max-md:static max-md:p-5">
      <div 
        className="flex items-center justify-between max-md:cursor-pointer" 
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setIsCollapsed(!isCollapsed);
          }
        }}
        title={isCollapsed ? "조건 설정 펼치기" : "조건 설정 접기"}
      >
        <SectionHeading number="01" title="조건 설정" description="출발지 및 일정 정보" />
        <button 
          className="text-stone-400 hover:text-stone-700 transition md:hidden" 
          aria-label={isCollapsed ? "조건 설정 펼치기" : "조건 설정 접기"}
          type="button"
        >
          <CaretDown className={cn("transition-transform duration-300", isCollapsed ? "" : "rotate-180")} size={24} />
        </button>
      </div>

      <div 
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out md:!max-h-none md:!opacity-100 md:!mt-4",
          isCollapsed ? "max-md:max-h-0 max-md:opacity-0 max-md:mt-0" : "max-md:max-h-[850px] max-md:opacity-100 max-md:mt-4"
        )}
      >
        <div className="space-y-4">
        <Field
          label="출발지"
          action={
            <button
              className="flex items-center gap-1 text-[11px] font-medium text-teal underline underline-offset-2 hover:opacity-80 transition disabled:opacity-40"
              onClick={requestCurrentLocation}
              disabled={locationFeedback.status === "loading"}
              type="button"
            >
              <Crosshair size={13} className={locationFeedback.status === "loading" ? "animate-spin text-teal" : ""} />
              <span>내 현재 위치로 설정</span>
            </button>
          }
          hint={
            <span className={cn("flex items-center gap-1.5", locationProblem ? "text-rust" : "text-teal")}>
              {locationFeedback.status === "success" ? <SealCheck weight="fill" /> : <Info />} {locationFeedback.message}
            </span>
          }
        >
          <FieldFrame icon={<MapPin />} invalid={locationProblem}>
            <input
              className="w-full min-w-0 bg-transparent text-[13px] outline-none"
              value={planner.departure}
              onChange={(event) => updateDeparture(event.target.value)}
              aria-label="출발지"
              placeholder="예: 서울역, 춘천, 원주, 강남"
            />
            <button
              className="grid size-8 shrink-0 place-items-center text-teal disabled:opacity-45 hover:bg-teal/10 rounded transition"
              aria-label="현재 위치 사용"
              onClick={requestCurrentLocation}
              disabled={locationFeedback.status === "loading"}
              type="button"
              title="내 현재 GPS 위치로 설정"
            >
              <Crosshair className={locationFeedback.status === "loading" ? "animate-spin" : undefined} />
            </button>
          </FieldFrame>
        </Field>
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <Field label="날짜">
            <FieldFrame icon={<CalendarBlank />}>
              <input
                className="w-full bg-transparent text-[13px] outline-none"
                type="date"
                value={planner.date}
                onChange={(event) => update("date", event.target.value)}
              />
            </FieldFrame>
          </Field>
          <Field
            label="출발 시간"
            action={
              <button
                className="text-[11px] font-medium text-teal underline underline-offset-2"
                onClick={useCurrentTime}
                type="button"
              >
                현재 시각
              </button>
            }
          >
            <FieldFrame icon={<Clock />}>
              <input
                className="w-full bg-transparent text-[13px] outline-none"
                type="time"
                value={planner.time}
                onChange={(event) => update("time", event.target.value)}
              />
            </FieldFrame>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <Field label="인원">
            <FieldFrame icon={<UsersThree />}>
              <select
                className="w-full appearance-none bg-transparent text-[13px] outline-none"
                value={planner.people}
                onChange={(event) => update("people", event.target.value as PlannerState["people"])}
              >
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명 이상</option>
              </select>
              <CaretDown />
            </FieldFrame>
          </Field>
          <Field label="이동 수단">
            <FieldFrame icon={<Car />}>
              <select
                className="w-full appearance-none bg-transparent text-[13px] outline-none"
                value={planner.transport}
                onChange={(event) => update("transport", event.target.value as PlannerState["transport"])}
              >
                <option value="car">자가용</option>
                <option value="rental">렌터카</option>
              </select>
              <CaretDown />
            </FieldFrame>
          </Field>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 border-y border-line py-2 text-[11px] text-stone-600">
          <input
            className="size-4 accent-teal"
            type="checkbox"
            checked={planner.accessibility}
            onChange={(event) => update("accessibility", event.target.checked)}
          />
          <Wheelchair size={18} className="text-teal" />
          <span>무장애 편의시설 보유 장소 우선 안내</span>
        </label>
        <Button className="w-full" variant="primary" onClick={handleSubmit} disabled={status === "loading"}>
          추천 장소 조회 <ArrowRight />
        </Button>
      </div>
      </div>
    </section>
  );
}
