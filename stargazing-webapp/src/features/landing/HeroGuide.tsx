import { MoonStars, NavigationArrow, Tent } from "@phosphor-icons/react";

const guideItems = [
  { icon: MoonStars, label: "한적함", copy: "덜 붐비는 장소부터" },
  { icon: NavigationArrow, label: "이동", copy: "내 출발지에서 가까운 순서로" },
  { icon: Tent, label: "머무름", copy: "주변 캠핑장까지 한 번에" },
];

export function HeroGuide() {
  return <div className="mt-12 grid max-w-[690px] grid-cols-3 divide-x divide-cream/15 border-y border-cream/15 py-4 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y max-sm:py-0">{guideItems.map((item) => <div className="grid grid-cols-[30px_1fr] gap-x-2 px-5 first:pl-0 max-sm:px-0 max-sm:py-3" key={item.label}><item.icon className="row-span-2 self-center text-[#8ec0b2]" size={22} /><span className="text-[9px] font-bold tracking-[.08em] text-gold-light">{item.label}</span><small className="mt-0.5 text-[10px] text-cream/55">{item.copy}</small></div>)}</div>;
}
