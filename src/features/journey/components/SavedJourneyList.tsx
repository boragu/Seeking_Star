import { ArrowRight, CalendarBlank, Car, Clock, MapPin, Sparkle, Tent, Trash } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { SavedJourneyItem } from "../../../domain/types";
import { formatDateInputKorean } from "../../../lib/currentContext";

export function SavedJourneyList({
  items,
  selectedId,
  onSelect,
  onRemove,
  onExplore,
}: {
  items: SavedJourneyItem[];
  selectedId: string | null;
  onSelect: (destinationId: string) => void;
  onRemove: (destinationId: string) => void;
  onExplore: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="보관된 별빛 여정이 없습니다"
          description="마음에 드는 관측지를 여정 탭에서 '여정 저장' 버튼을 눌러 보관함에 담아보세요. 언제든 다시 꺼내볼 수 있습니다."
          action={
            <Button onClick={onExplore}>
              추천 관측지 탐색 <ArrowRight />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <p className="text-[13px] text-stone-600">
          총 <strong className="font-display text-teal font-bold">{items.length}개</strong>의 여정이 보관되어 있습니다.
        </p>
        <span className="text-[11px] text-stone-400">카드를 누르면 상세 일정으로 전환됩니다.</span>
      </div>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {items.map((item) => {
          const isCurrentActive = item.destinationId === selectedId;
          const calmText = item.calm !== null ? `${item.calm}점` : "여유 (비과밀)";

          return (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between overflow-hidden border p-5 transition shadow-sm ${
                isCurrentActive
                  ? "border-teal bg-teal/[0.04] ring-1 ring-teal"
                  : "border-line bg-white/60 hover:border-teal/50 hover:bg-white/90"
              }`}
            >
              <div>
                {/* 상단 뱃지 및 삭제 버튼 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
                      <Sparkle size={12} weight="fill" /> 한적도 {calmText}
                    </span>
                    {isCurrentActive && (
                      <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-ink">
                        현재 활성 여정
                      </span>
                    )}
                  </div>
                  <button
                    className="rounded p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.destinationId);
                    }}
                    title="보관함에서 삭제"
                    type="button"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                {/* 관측지명 및 위치 */}
                <h3 className="mt-3 font-display text-[18px] font-bold tracking-tight text-ink group-hover:text-teal transition">
                  {item.destinationName}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin size={13} className="text-[#8ec0b2]" />
                  {item.destinationAddress || item.destinationRegion}
                </p>

                {/* 저장된 일정 및 조건 요약 */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-y border-line/60 py-3 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarBlank size={14} className="text-teal" />
                    <span>{formatDateInputKorean(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-teal" />
                    <span>{item.departureName} {item.departureTime} 출발</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Car size={14} className="text-stone-400" />
                    <span>
                      {item.distanceKm ? `${item.distanceKm.toFixed(1)}km` : "거리 미계산"}
                      {item.travelMinutesEstimate ? ` (약 ${item.travelMinutesEstimate}분)` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tent size={14} className="text-stone-400" />
                    <span>캠핑장 {item.campgroundCount}곳 연계</span>
                  </div>
                </div>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="mt-4 pt-2">
                <Button
                  className="w-full h-10 text-[12px]"
                  variant={isCurrentActive ? "primary" : "secondary"}
                  onClick={() => onSelect(item.destinationId)}
                >
                  {isCurrentActive ? "현재 여정 상세 보기" : "이 여정 불러오기"}
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
