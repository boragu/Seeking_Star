import { Car, SealCheck, Tent, TrendDown } from "@phosphor-icons/react";
import { Metric } from "../../../components/ui/Metric";
import type { RankedDestination } from "../../../lib/recommendationEngine";

const show = (value: number | string | null, suffix = "") => value === null || value === "" ? "확인 중" : `${value}${suffix}`;

export function DestinationFacts({ destination }: { destination: RankedDestination }) {
  const facts = [
    { icon: TrendDown, label: "오늘의 여유", value: show(destination.calm, "점") },
    { icon: Car, label: "출발지 거리", value: destination.distanceKm === null ? "위치 필요" : `${destination.distanceKm.toFixed(1)}km` },
    { icon: Tent, label: "20km 내 캠핑장", value: `${destination.nearbyCampgrounds.length}곳` },
    { icon: SealCheck, label: "집중률 기준일", value: show(destination.concentrationDate) },
  ];
  return <div className="grid grid-cols-4 divide-x divide-line border-y border-line max-lg:grid-cols-2 max-lg:divide-y">{facts.map((fact) => <Metric key={fact.label} {...fact} />)}</div>;
}
