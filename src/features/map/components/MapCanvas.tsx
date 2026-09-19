import { ArrowSquareOut, Info, MapPin } from "@phosphor-icons/react";
import type { Destination } from "../../../domain/types";

export function MapCanvas({
  destination,
  embedUrl,
}: {
  destination: Destination;
  embedUrl: string | null;
}) {
  return (
    <section className="relative min-h-[440px] overflow-hidden bg-[#d8d2c4] max-md:absolute max-md:inset-0 max-md:z-0">
      {embedUrl ? (
        <iframe
          className="size-full min-h-[440px] border-0 grayscale-[.1] contrast-[.96] max-md:h-full"
          src={embedUrl}
          title={`${destination.name} 지도 위치`}
          loading="eager"
        />
      ) : (
        <div className="grid size-full min-h-[440px] place-items-center bg-ink text-center text-cream/60">
          <div>
            <MapPin className="mx-auto mb-3 text-gold" size={42} />
            <p className="font-display text-lg">지도 위치 정보를 불러올 수 없습니다.</p>
            <small className="mt-2 block text-[11px]">상세 주소는 여정 탭에서 확인해 주세요.</small>
          </div>
        </div>
      )}
      <div className="absolute left-4 top-4 max-w-[330px] border border-cream/18 bg-ink/92 p-3 text-[10px] shadow-xl backdrop-blur">
        <strong className="flex items-center gap-1.5 text-cream">
          <Info /> 위치 안내
        </strong>
        <p className="mt-1 leading-4 text-cream/60">
          본 지도는 공공데이터 좌표 기반 참고용이며, 출발 전 실제 내비게이션 경로를 확인해 주세요.
        </p>
      </div>
      {destination.latitude !== null && (
        <a
          className="absolute bottom-4 right-4 flex min-h-9 items-center gap-2 bg-ink/90 backdrop-blur px-3 text-[11px] font-bold text-cream shadow-xl transition hover:bg-ink-soft max-md:bottom-auto max-md:top-4 max-md:right-4 border border-cream/20"
          href={`https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=14/${destination.latitude}/${destination.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          큰 지도 보기 <ArrowSquareOut />
        </a>
      )}
    </section>
  );
}
