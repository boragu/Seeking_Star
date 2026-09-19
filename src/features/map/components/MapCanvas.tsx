import { ArrowSquareOut, Compass, Crosshair, MapPin, NavigationArrow, StarFour } from "@phosphor-icons/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Destination, PlannerState, RouteEstimate } from "../../../domain/types";

export function MapCanvas({
  destination,
  planner,
  route,
}: {
  destination: Destination;
  planner: PlannerState;
  route: RouteEstimate | null;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const hasOrigin = planner.latitude !== null && planner.longitude !== null;
  const hasDest = destination.latitude !== null && destination.longitude !== null;

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // 기존 지도 인스턴스가 있으면 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current.stop();
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = destination.latitude ?? planner.latitude ?? 37.5559;
    const defaultLng = destination.longitude ?? planner.longitude ?? 126.9723;

    // 지도 생성
    const map = L.map(container, {
      center: [defaultLat, defaultLng],
      zoom: 11,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // 타일 레이어 추가 (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const boundsPoints: L.LatLngExpression[] = [];

    // 1. 내 위치 (출발지) 마커
    if (hasOrigin) {
      const originLat = planner.latitude!;
      const originLng = planner.longitude!;
      boundsPoints.push([originLat, originLng]);

      const originIcon = L.divIcon({
        className: "custom-origin-pin",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #2f6b64; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1.5px solid white; margin-bottom: 2px;">
              📍 내 출발지 (${planner.departure})
            </div>
            <div style="width: 16px; height: 16px; background: #2f6b64; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(47,107,100,0.8);"></div>
          </div>
        `,
        iconSize: [120, 42],
        iconAnchor: [60, 42],
      });

      L.marker([originLat, originLng], { icon: originIcon })
        .addTo(map)
        .bindPopup(`<b>출발지: ${planner.departure}</b><br>현재 설정된 출발 위치입니다.`);
    }

    // 2. 관측지 (목적지) 마커
    if (hasDest) {
      const destLat = destination.latitude!;
      const destLng = destination.longitude!;
      boundsPoints.push([destLat, destLng]);

      const destIcon = L.divIcon({
        className: "custom-dest-pin",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #0b1c2a; color: #f0cf8b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 1.5px solid #d9a64f; margin-bottom: 2px;">
              ⭐ ${destination.name}
            </div>
            <div style="width: 20px; height: 20px; background: #d9a64f; border: 3px solid #0b1c2a; border-radius: 50%; box-shadow: 0 0 12px rgba(217,166,79,0.9);"></div>
          </div>
        `,
        iconSize: [140, 46],
        iconAnchor: [70, 46],
      });

      const destMarker = L.marker([destLat, destLng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>⭐ ${destination.name}</b><br>${destination.address || destination.region || "위치 정보"}`);

      try {
        destMarker.openPopup();
      } catch {
        // Safe popup opening
      }
    }

    // 3. 출발지 ~ 목적지 연결 점선 경로
    if (hasOrigin && hasDest) {
      const polyline = L.polyline(
        [
          [planner.latitude!, planner.longitude!],
          [destination.latitude!, destination.longitude!],
        ],
        {
          color: "#2f6b64",
          weight: 4,
          dashArray: "7, 9",
          opacity: 0.85,
        }
      ).addTo(map);

      if (route) {
        polyline.bindTooltip(`예상 소요: ${route.duration} (${route.distance})`, {
          sticky: true,
          className: "route-tooltip",
        });
      }
    }

    // 4. 화면에 맞게 자동 줌/패닝 (Fit Bounds) - 초기 로드는 비동기 애니메이션 없이 즉시 설정
    if (boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [60, 60],
        maxZoom: 13,
        animate: false,
      });
    } else if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 12, { animate: false });
    }

    // ResizeObserver로 반응형 레이아웃 변경 시 지도 리사이즈 동기화
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.stop();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [destination, planner, hasOrigin, hasDest, route]);

  const fitAll = () => {
    if (!mapInstanceRef.current || !hasOrigin || !hasDest) return;
    mapInstanceRef.current.fitBounds(
      L.latLngBounds([
        [planner.latitude!, planner.longitude!],
        [destination.latitude!, destination.longitude!],
      ]),
      { padding: [60, 60] }
    );
  };

  const focusOrigin = () => {
    if (!mapInstanceRef.current || !hasOrigin) return;
    mapInstanceRef.current.flyTo([planner.latitude!, planner.longitude!], 14, { duration: 0.8 });
  };

  const focusDest = () => {
    if (!mapInstanceRef.current || !hasDest) return;
    mapInstanceRef.current.flyTo([destination.latitude!, destination.longitude!], 14, { duration: 0.8 });
  };

  return (
    <section className="relative size-full min-h-[440px] overflow-hidden bg-[#e5e0d8]">
      {/* 리플릿 인터랙티브 맵 컨테이너 */}
      <div ref={mapContainerRef} className="size-full z-0" />

      {/* 좌측 상단 위치/경로 요약 오버레이 */}
      <div className="absolute left-4 top-4 z-10 max-w-[320px] rounded-xl border border-cream/20 bg-ink/90 p-3 text-[11px] text-cream shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-gold-light font-bold">
          <NavigationArrow size={14} className="text-[#8ec0b2]" />
          <span>이동 경로 지도 안내</span>
        </div>
        <div className="mt-2 space-y-1 text-[11px] leading-tight">
          <div className="flex items-center gap-1 text-cream/85">
            <span className="text-teal-300">📍 출발:</span> {planner.departure}
          </div>
          <div className="flex items-center gap-1 text-gold-light">
            <span>⭐ 도착:</span> {destination.name}
          </div>
          {route && (
            <div className="mt-1 text-[10px] text-cream/60">
              거리: {route.distance} · 예상 소요: {route.duration}
            </div>
          )}
        </div>
      </div>

      {/* 우측 상단 빠른 시점 전환 컨트롤 버튼 */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1.5">
        {hasOrigin && hasDest && (
          <button
            type="button"
            onClick={fitAll}
            className="flex items-center gap-1.5 rounded-lg border border-cream/20 bg-ink/90 px-3 py-1.5 text-[11px] font-medium text-cream shadow-lg backdrop-blur hover:bg-ink hover:text-gold-light transition"
            title="전체 경로 한눈에 보기"
          >
            <Compass size={14} /> 전체 경로
          </button>
        )}
        {hasOrigin && (
          <button
            type="button"
            onClick={focusOrigin}
            className="flex items-center gap-1.5 rounded-lg border border-cream/20 bg-ink/90 px-3 py-1.5 text-[11px] font-medium text-cream shadow-lg backdrop-blur hover:bg-ink hover:text-teal-300 transition"
            title="내 출발 위치로 이동"
          >
            <Crosshair size={14} /> 내 위치
          </button>
        )}
        {hasDest && (
          <button
            type="button"
            onClick={focusDest}
            className="flex items-center gap-1.5 rounded-lg border border-cream/20 bg-ink/90 px-3 py-1.5 text-[11px] font-medium text-cream shadow-lg backdrop-blur hover:bg-ink hover:text-gold transition"
            title="목적지 관측지로 이동"
          >
            <StarFour size={14} /> 관측지
          </button>
        )}
      </div>
    </section>
  );
}
