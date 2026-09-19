import { Info, Sparkle } from "@phosphor-icons/react";
import type { RankedDestination, ScoreKey } from "../../../lib/recommendationEngine";

const scoreLabels: Record<ScoreKey, string> = { crowd: "한적함", sky: "관측 여건", parking: "주차", travel: "이동", accessibility: "접근성" };

export function ScoreBreakdown({ destination }: { destination: RankedDestination }) {
  const entries = Object.entries(destination.analysis.breakdown) as [ScoreKey, number][];
  if (destination.analysis.total === null) return <div className="border-y border-line py-4 text-[11px] leading-5 text-stone-500"><Info className="mr-1.5 inline text-teal" /> 추천 이유를 비교할 정보가 아직 충분하지 않아요.</div>;
  return <section className="border-y border-line py-4" aria-label="추천 점수 상세">
    <div className="mb-4 flex items-end justify-between"><span className="flex items-center gap-1.5 text-[11px] font-bold text-teal"><Sparkle weight="fill" /> 이 장소를 고른 이유</span><span className="text-[10px] text-stone-500">확인된 항목 기준</span></div>
    <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2">{entries.map(([key, value]) => <div key={key}><div className="mb-1.5 flex justify-between gap-2 text-[10px]"><span className="text-stone-500">{scoreLabels[key]}</span><strong>{value}</strong></div><div className="h-1 overflow-hidden bg-stone-300"><i className="block h-full bg-teal" style={{ width: `${value}%` }} /></div></div>)}</div>
  </section>;
}
