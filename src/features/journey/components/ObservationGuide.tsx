import { Compass, Moon, ShieldCheck } from "@phosphor-icons/react";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";
import { generateObservationGuide } from "../../ai/aiStargazingService";
import { AiCameraGuideCard } from "../../ai/components/AiCameraGuideCard";

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
      <div className="flex items-center justify-between border-b border-line pb-3 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-[20px] font-bold">현장 관측 및 촬영 가이드</h2>
        </div>
        <span className="shrink-0 text-[11px] text-stone-500">천문력 및 실시간 관측 조건 기반</span>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-stone-600">
        {guide.summary}
      </p>

      {/* 천문 관측 방위 및 월령 조건 */}
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

      {/* AI 실시간 기기별 야간 천체 촬영 가이드 (스마트폰 / 카메라 탭 통합) */}
      <div className="mt-4">
        <AiCameraGuideCard destination={destination} planner={planner} />
      </div>

      {/* 인원 및 이동수단 맞춤 안내 */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] max-md:grid-cols-1">
        <div className="rounded bg-paper/60 p-3 border border-line/50">
          <strong className="block text-teal font-bold mb-1">
            👥 동행 인원 맞춤 조언 ({planner.people === "4" ? "4인 이상" : `${planner.people}인`})
          </strong>
          <p className="text-stone-700 leading-relaxed">{guide.peopleAdvice}</p>
        </div>
        <div className="rounded bg-paper/60 p-3 border border-line/50">
          <strong className="block text-amber-800 font-bold mb-1">
            🚗 {planner.transport === "rental" ? "렌터카 주행 가이드" : "자가용 주행 가이드"}
          </strong>
          <p className="text-stone-700 leading-relaxed">{guide.transportAdvice}</p>
        </div>
      </div>

      <div className="mt-4 rounded bg-paper/60 p-3 text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-stone-700">
          <ShieldCheck size={16} /> 현장 에티켓 및 안전 수칙
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
    </section>
  );
}

