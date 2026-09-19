import { MoonStars, NavigationArrow, Tent } from "@phosphor-icons/react";

const guideItems = [
  { icon: MoonStars, label: "혼잡 분산", copy: "혼잡도가 낮은 관측지 우선 안내" },
  { icon: NavigationArrow, label: "이동 경로", copy: "출발지 기준 거리 및 소요 시간" },
  { icon: Tent, label: "체류 연계", copy: "인근 등록 야영장·캠핑장 정보" },
];

export function HeroGuide() {
  return (
    <div className="mt-12 grid max-w-[690px] grid-cols-3 divide-x divide-cream/15 border-y border-cream/15 py-4 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y max-sm:py-0">
      {guideItems.map((item) => (
        <div className="grid grid-cols-[30px_1fr] gap-x-2.5 px-5 first:pl-0 max-sm:px-0 max-sm:py-3" key={item.label}>
          <item.icon className="row-span-2 self-center text-[#8ec0b2]" size={22} />
          <span className="text-[12px] font-bold text-gold-light">{item.label}</span>
          <small className="mt-0.5 text-[11px] text-cream/60">{item.copy}</small>
        </div>
      ))}
    </div>
  );
}
