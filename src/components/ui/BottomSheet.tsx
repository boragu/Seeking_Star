import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface BottomSheetProps {
  children: ReactNode;
  snapPoints?: number[]; // fractions of viewport height, e.g. [0.28, 0.65, 0.9]
  defaultSnap?: number; // index of default snap point
  onSnapChange?: (snapIndex: number) => void;
}

export function BottomSheet({
  children,
  snapPoints = [0.28, 0.65, 0.92],
  defaultSnap = 0,
  onSnapChange,
}: BottomSheetProps) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnap);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const currentSnapFraction = snapPoints[currentSnapIndex] ?? 0.3;
  const currentHeightPx = typeof window !== "undefined" ? window.innerHeight * currentSnapFraction : 220;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    currentY.current = clientY;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    currentY.current = clientY;
    const deltaY = clientY - startY.current;
    // deltaY > 0 means dragging down, deltaY < 0 means dragging up
    setDragOffset(deltaY);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaY = currentY.current - startY.current;
    setDragOffset(0);

    const threshold = 40;
    if (deltaY < -threshold) {
      // Dragged UP -> expand
      const nextIndex = Math.min(snapPoints.length - 1, currentSnapIndex + 1);
      setCurrentSnapIndex(nextIndex);
      onSnapChange?.(nextIndex);
    } else if (deltaY > threshold) {
      // Dragged DOWN -> collapse
      const nextIndex = Math.max(0, currentSnapIndex - 1);
      setCurrentSnapIndex(nextIndex);
      onSnapChange?.(nextIndex);
    }
  }, [isDragging, currentSnapIndex, snapPoints.length, onSnapChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("mousemove", handleTouchMove);
      window.addEventListener("mouseup", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousemove", handleTouchMove);
      window.removeEventListener("mouseup", handleTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const toggleSnap = () => {
    const nextIndex = currentSnapIndex === 0 ? 1 : currentSnapIndex === 1 ? 2 : 0;
    setCurrentSnapIndex(nextIndex);
    onSnapChange?.(nextIndex);
  };

  const calculatedHeight = Math.max(160, currentHeightPx - (isDragging ? dragOffset : 0));

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 bottom-[66px] z-50 flex flex-col rounded-t-[22px] border-t border-cream/20 bg-[#091927] text-cream shadow-[0_-15px_45px_rgba(0,0,0,0.65)]"
      style={{
        height: `${calculatedHeight}px`,
        transition: isDragging ? "none" : "height 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* 드래그 핸들 영역 */}
      <div
        className="flex flex-col items-center justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing select-none shrink-0"
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
        onClick={toggleSnap}
      >
        <div className="h-1.5 w-12 rounded-full bg-cream/35 hover:bg-cream/55 transition" />
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-cream/50">
          {currentSnapIndex === 0 ? (
            <>
              <span>상세 경로 보기</span> <CaretUp size={12} />
            </>
          ) : (
            <>
              <span>지도 넓게 보기</span> <CaretDown size={12} />
            </>
          )}
        </div>
      </div>

      {/* 내부 콘텐츠 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {children}
      </div>
    </div>
  );
}
