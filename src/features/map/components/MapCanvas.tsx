import { ArrowSquareOut, Info, MapPin } from "@phosphor-icons/react";
import type { Destination } from "../../../domain/types";

export function MapCanvas({ destination, embedUrl }: { destination: Destination; embedUrl: string | null }) {
  return <section className="relative min-h-[440px] overflow-hidden bg-[#d8d2c4]">{embedUrl ? <iframe className="size-full min-h-[440px] border-0 grayscale-[.1] contrast-[.96]" src={embedUrl} title={`${destination.name} 지도 위치`} loading="eager" /> : <div className="grid size-full min-h-[440px] place-items-center bg-ink text-center text-cream/58"><div><MapPin className="mx-auto mb-3 text-gold" size={42} /><p className="font-display text-lg">지도 위치를 확인할 수 없어요.</p><small className="mt-2 block">장소 상세 주소는 여정에서 확인해 주세요.</small></div></div>}
    <div className="absolute left-4 top-4 max-w-[330px] border border-cream/18 bg-ink/92 p-3 text-[9px] shadow-xl backdrop-blur"><strong className="flex items-center gap-1.5 text-cream"><Info /> 위치 안내</strong><p className="mt-1 leading-4 text-cream/48">지도는 장소 위치를 확인하기 위한 참고용이에요. 출발 전 실제 도로 상황을 확인해 주세요.</p></div>
    {destination.latitude !== null && <a className="absolute bottom-4 right-4 flex min-h-11 items-center gap-2 bg-ink px-4 text-[10px] font-bold text-cream shadow-xl transition hover:bg-ink-soft" href={`https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=14/${destination.latitude}/${destination.longitude}`} target="_blank" rel="noreferrer">큰 지도에서 보기 <ArrowSquareOut /></a>}
  </section>;
}
