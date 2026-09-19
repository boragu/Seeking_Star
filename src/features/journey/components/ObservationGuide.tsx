import { useState } from "react";
import { Camera, Compass, Moon, ShieldCheck, SlidersHorizontal } from "@phosphor-icons/react";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";
import { generateObservationGuide } from "../../ai/aiStargazingService";

type CameraDeviceType = "iphone" | "galaxy" | "general" | "mirrorless";

const OPTICAL_PRESETS: Record<CameraDeviceType, {
  label: string;
  shutter: string;
  iso: string;
  aperture: string;
  focus: string;
  opticalRuleNote: string;
}> = {
  iphone: {
    label: "아이폰 Pro",
    shutter: "야간 모드 30초 (삼각대 거치 시 활성화)",
    iso: "자동 (RAW / ProRAW 최대 관용도)",
    aperture: "광각 메인 렌즈 (24mm 상당 f/1.78)",
    focus: "원거리 별빛 탭 후 노출 -0.7 고정",
    opticalRuleNote: "500 Rule 기준 24mm 렌즈 최대 노출 20초 이내 최적화",
  },
  galaxy: {
    label: "갤럭시 Ultra",
    shutter: "전문가(Pro) 모드 15~20초",
    iso: "ISO 800 ~ 1600",
    aperture: "메인 광각 (24mm 상당 f/1.7)",
    focus: "수동 포커스(MF) 0.8~0.9 (무한대 직전 피킹)",
    opticalRuleNote: "Expert RAW 천체 사진(Astrophoto) 모드 적극 권장",
  },
  general: {
    label: "일반 스마트폰",
    shutter: "야간 모드 최대 노출 (10~15초)",
    iso: "자동 / Pro 모드 지원 시 ISO 1600",
    aperture: "기본 1x 메인 카메라 (최대 개방)",
    focus: "가장 밝은 별/달빛 터치 후 고정",
    opticalRuleNote: "흔들림 방지를 위한 타이머(3초) 또는 음량버튼 촬영 필수",
  },
  mirrorless: {
    label: "미러리스/DSLR",
    shutter: "15~20초 (500 Rule: 500/24mm = 20.8초)",
    iso: "ISO 3200 ~ 6400",
    aperture: "f/2.8 이하 최대 개방",
    focus: "라이브뷰 10배 확대 수동 초점(MF)",
    opticalRuleNote: "점상(Point star) 촬영을 위해 500 Rule 상한선 준수",
  },
};

export function ObservationGuide({
  destination,
  planner,
  route,
}: {
  destination: Destination;
  planner: PlannerState;
  route: RouteEstimate | null;
}) {
  const [selectedDevice, setSelectedDevice] = useState<CameraDeviceType>("iphone");
  const guide = generateObservationGuide(destination, planner, route);
  const currentPreset = OPTICAL_PRESETS[selectedDevice];

  return (
    <section className="mt-6 border border-line bg-white/45 p-6 shadow-[0_16px_45px_rgba(68,49,29,.05)] max-sm:p-5">
      <div className="flex items-center justify-between border-b border-line pb-3 max-sm:flex-wrap max-sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-[20px] font-bold">현장 관측 및 광학 촬영 가이드</h2>
        </div>
        <span className="shrink-0 text-[11px] text-stone-500">천문력 & 500 Rule 광학 공식 기반</span>
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

      {/* 기종별 인터랙티브 광학 촬영 가이드 */}
      <div className="mt-5 rounded border border-line/80 bg-paper/80 p-4">
        <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2.5 max-sm:flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 text-[12px]">
            <Camera size={16} className="text-teal" />
            <span>기기별 맞춤 천문 촬영 프리셋 (500 Rule)</span>
          </div>
          
          {/* 기기 선택 탭 */}
          <div className="flex items-center gap-1 bg-white/70 p-0.5 rounded border border-line/60">
            {(Object.keys(OPTICAL_PRESETS) as CameraDeviceType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedDevice(type)}
                className={`px-2 py-1 text-[10px] font-bold rounded transition ${
                  selectedDevice === type
                    ? "bg-teal text-white shadow-xs"
                    : "text-stone-600 hover:text-ink"
                }`}
              >
                {OPTICAL_PRESETS[type].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] max-sm:grid-cols-1">
          <div className="space-y-1 rounded bg-white/70 p-2.5 border border-line/40">
            <span className="text-stone-500 font-medium">셔터 속도 & 노출</span>
            <p className="font-bold text-ink">{currentPreset.shutter}</p>
          </div>
          <div className="space-y-1 rounded bg-white/70 p-2.5 border border-line/40">
            <span className="text-stone-500 font-medium">감도(ISO) & 조리개</span>
            <p className="font-bold text-ink">{currentPreset.iso} · {currentPreset.aperture}</p>
          </div>
          <div className="space-y-1 rounded bg-white/70 p-2.5 border border-line/40">
            <span className="text-stone-500 font-medium">초점(Focus) & 노출 보정</span>
            <p className="font-bold text-ink">{currentPreset.focus}</p>
          </div>
          <div className="space-y-1 rounded bg-teal/5 p-2.5 border border-teal/20">
            <span className="text-teal font-bold flex items-center gap-1">
              <SlidersHorizontal size={13} /> 광학 공식(500 Rule) 팁
            </span>
            <p className="text-stone-700 font-medium">{currentPreset.opticalRuleNote}</p>
          </div>
        </div>
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

