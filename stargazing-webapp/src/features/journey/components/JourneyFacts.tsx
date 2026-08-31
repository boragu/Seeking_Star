import { Car, SealCheck, Tent, TrendDown } from "@phosphor-icons/react";
import { Metric } from "../../../components/ui/Metric";
import type { Destination } from "../../../domain/types";

export function JourneyFacts({ destination }: { destination: Destination }) {
  const facts = [
    { icon: TrendDown, label: "오늘의 여유", value: destination.calm === null ? "확인 중" : `${destination.calm}점` },
    { icon: Car, label: "출발지 거리", value: destination.distanceKm === null ? "위치 필요" : `${destination.distanceKm.toFixed(1)}km` },
    { icon: Tent, label: "가까운 캠핑장", value: `${destination.nearbyCampgrounds.length}곳` },
    { icon: SealCheck, label: "함께 볼 곳", value: `${destination.relatedPlaces.length}곳` },
  ];
  return <section className="grid grid-cols-4 divide-x divide-line border-y border-line max-md:grid-cols-2 max-md:divide-y">{facts.map((fact) => <Metric key={fact.label} {...fact} />)}</section>;
}
