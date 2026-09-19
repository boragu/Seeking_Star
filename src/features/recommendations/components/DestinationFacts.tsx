import { Car, SealCheck, Tent, TrendDown } from "@phosphor-icons/react";
import { Metric } from "../../../components/ui/Metric";
import type { RankedDestination } from "../../../lib/recommendationEngine";

const show = (value: number | string | null, suffix = "", fallback = "한적 (비과밀)") =>
  value === null || value === "" ? fallback : `${value}${suffix}`;

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "실시간 예측";
  const cleaned = dateStr.replace(/[^0-9]/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}.${cleaned.slice(6, 8)}`;
  }
  return dateStr;
};

export function DestinationFacts({ destination }: { destination: RankedDestination }) {
  const facts = [
    { icon: TrendDown, label: "한적도 지수", value: show(destination.calm, "점", "한적 (비과밀)") },
    {
      icon: Car,
      label: "출발지 거리",
      value: destination.distanceKm === null ? "위치 필요" : `${destination.distanceKm.toFixed(1)}km`,
    },
    { icon: Tent, label: "인근 캠핑장(20km)", value: `${destination.nearbyCampgrounds.length}곳` },
    { icon: SealCheck, label: "데이터 기준일", value: formatDate(destination.concentrationDate) },
  ];
  return (
    <div className="grid grid-cols-4 divide-x divide-line border-y border-line max-lg:grid-cols-2 max-lg:divide-y">
      {facts.map((fact) => (
        <Metric key={fact.label} {...fact} />
      ))}
    </div>
  );
}
