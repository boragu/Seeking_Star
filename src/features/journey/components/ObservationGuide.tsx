import { Camera, Compass, Eye, Moon, ShieldCheck } from "@phosphor-icons/react";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";
import { generateObservationGuide } from "../../ai/aiStargazingService";

export function ObservationGuide({
  destination,
  planner,
  route,
}: {
  destination: Destination;
  planner: PlannerState;
  route: RouteEstimate | null;
}) {
  const guide = generateObservationGuide(destination, planner, route);

  return (
    <section className="mt-6 border border-line bg-white/45 p-6 shadow-[0_16px_45px_rgba(68,49,29,.05)] max-sm:p-5">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h2 className="font-display text-[20px] font-bold">현장 관측 및 촬영 가이드</h2>
        <span className="text-[11px] text-stone-500">천문력·위치 좌표 기반 안내</span>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-stone-600">
        {guide.summary}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 border-y border-line py-4 max-md:grid-cols-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal">
            <Compass size={16} /> 관측 방위 및 주요 대상
          </div>
          <strong className="block font-display text-[15px]">{guide.targetConstellation}</strong>
          <small className="block text-[11px] text-stone-500">{guide.viewingDirection}</small>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
            <Moon size={16} /> 최적 시간 및 월령 여건
          </div>
          <strong className="block font-display text-[15px]">{guide.optimalTime}</strong>
          <small className="block text-[11px] text-stone-500">{guide.moonCondition}</small>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-4 max-md:grid-cols-1">
        <div className="rounded bg-paper/70 p-3 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-stone-700">
            <Camera size={16} /> 권장 사진·스마트폰 촬영 설정
          </div>
          <p className="mt-1.5 font-medium text-ink">{guide.cameraSetting}</p>
        </div>

        <div className="rounded bg-paper/70 p-3 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-stone-700">
            <ShieldCheck size={16} /> 현장 에티켓 및 안전
          </div>
          <ul className="mt-1.5 space-y-0.5 text-stone-600">
            {guide.fieldEtiquette.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="mt-1 size-1 shrink-0 rounded-full bg-stone-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
