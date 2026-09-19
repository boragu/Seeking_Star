import { StarFour } from "@phosphor-icons/react";
import type { Destination } from "../../../domain/types";

export function DestinationMedia({ destination, className = "" }: { destination: Destination; className?: string }) {
  if (destination.imageUrl) return <img className={`size-full object-cover ${className}`} src={destination.imageUrl} alt={`${destination.name} 전경`} />;
  return <div className={`grid size-full place-items-center bg-[radial-gradient(circle_at_72%_18%,#294a61_0,#0b1c2a_48%,#06121e_100%)] text-cream/65 ${className}`}><span className="grid justify-items-center gap-2 px-5 text-center text-[11px]"><StarFour size={40} weight="thin" /> 등록된 현장 이미지가 없어요</span></div>;
}
