import { Bell, ListChecks, MapTrifold, StarFour, type Icon } from "@phosphor-icons/react";
import type { AppPath } from "../../app/navigation";

export interface NavigationItem {
  path: Exclude<AppPath, "/">;
  label: string;
  shortLabel: string;
  icon: Icon;
}

export const navigationItems: NavigationItem[] = [
  { path: "/planner", label: "오늘의 별", shortLabel: "추천", icon: StarFour },
  { path: "/map", label: "별지도", shortLabel: "지도", icon: MapTrifold },
  { path: "/trips", label: "내 여정", shortLabel: "여정", icon: ListChecks },
  { path: "/alerts", label: "알림 설정", shortLabel: "알림 설정", icon: Bell },
];
