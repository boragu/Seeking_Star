import { ArrowRight, BookmarkSimple, MapPin, Sparkle } from "@phosphor-icons/react";
import type { Navigate } from "../../../app/navigation";
import { Button } from "../../../components/ui/Button";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import type { RankedDestination } from "../../../lib/recommendationEngine";
import { DestinationAlternatives } from "../../recommendations/components/DestinationAlternatives";
import { DestinationFacts } from "../../recommendations/components/DestinationFacts";
import { DestinationMedia } from "../../recommendations/components/DestinationMedia";
import { ScoreBreakdown } from "../../recommendations/components/ScoreBreakdown";

export function DestinationSpotlight({ destination, items, navigate, onSelect }: { destination: RankedDestination; items: RankedDestination[]; navigate: Navigate; onSelect: (id: string) => void }) {
  return <section className="border border-line bg-white/52 p-6 shadow-[0_20px_60px_rgba(68,49,29,.07)] max-md:p-4"><SectionHeading number="02" title="오늘의 1순위" description="현재 조건에서 가장 균형이 좋은 장소예요." tone="rust" />
    <div className="relative h-[290px] overflow-hidden bg-ink max-lg:h-[250px] max-sm:h-[210px]"><DestinationMedia destination={destination} /><div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-transparent" /><div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 text-cream"><div className="min-w-0"><span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[.12em] text-gold-light"><Sparkle weight="fill" /> 별보러간다 추천</span><h2 className="truncate font-display text-[clamp(26px,3vw,38px)] font-bold">{destination.name}</h2><p className="mt-1 flex items-center gap-1 truncate text-[10px] text-cream/62"><MapPin />{destination.address || destination.region || "위치 정보 확인 중"}</p></div><div className="grid size-[74px] shrink-0 place-items-center rounded-full border border-gold/55 bg-ink/75 text-center backdrop-blur"><strong className="font-display text-2xl text-gold-light">{destination.analysis.total ?? "—"}</strong><small className="-mt-4 text-[8px] text-cream/48">추천점수</small></div></div></div>
    <div className="mt-4"><DestinationFacts destination={destination} /></div>
    <div className="mt-4"><ScoreBreakdown destination={destination} /></div>
    <DestinationAlternatives items={items} selectedId={destination.id} onSelect={onSelect} />
    <div className="mt-5 grid grid-cols-[1.4fr_1fr] gap-2.5 max-sm:grid-cols-1"><Button variant="primary" onClick={() => navigate("/map")}>지도에서 위치 확인 <ArrowRight /></Button><Button variant="secondary" onClick={() => { onSelect(destination.id); navigate("/trips"); }}><BookmarkSimple /> 이대로 여정 보기</Button></div>
  </section>;
}
