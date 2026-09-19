import { ArrowClockwise, Compass, Warning } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";

export function RecommendationState({
  status,
  errorCode,
  message,
  onRetry,
}: {
  status: "idle" | "loading" | "error" | "empty";
  errorCode?: string;
  message?: string;
  onRetry: () => void;
}) {
  const servicePreparing = errorCode === "SERVICE_KEY_REQUIRED";
  const title =
    status === "idle"
      ? "원하시는 조건으로 별 관측지를 찾아보세요"
      : status === "loading"
      ? "별 관측지 데이터를 조회하고 있습니다"
      : servicePreparing
      ? "공공데이터 서비스 연계 준비 중"
      : status === "empty"
      ? "조건에 부합하는 장소가 없습니다"
      : "추천 데이터를 불러오지 못했습니다";

  const description =
    status === "idle"
      ? "출발지와 관측 일정을 확인하신 후, [추천 장소 조회] 버튼을 누르면 혼잡도와 관측 여건을 분석하여 최적의 장소를 안내합니다."
      : status === "loading"
      ? "한국관광공사 TourAPI 및 야간 혼잡도 데이터를 종합 분석하고 있습니다..."
      : servicePreparing
      ? "공공데이터 인증키 설정 확인 후 다시 시도해 주세요."
      : message ?? "잠시 후 다시 시도해 주세요.";

  return (
    <section className="grid min-h-[520px] place-items-center border border-line bg-white/48 p-8 text-center shadow-[0_20px_60px_rgba(68,49,29,.06)]">
      <div className="max-w-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-teal/25 bg-teal/5 text-teal">
          {status === "idle" ? (
            <Compass size={28} />
          ) : status === "loading" ? (
            <ArrowClockwise className="animate-spin" size={27} />
          ) : (
            <Warning size={27} />
          )}
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-[12px] leading-6 text-stone-500">{description}</p>
        {status === "idle" && (
          <Button className="mt-6" variant="primary" onClick={onRetry}>
            추천 장소 조회
          </Button>
        )}
        {status === "error" && (
          <Button className="mt-6" variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        )}
        {status === "empty" && (
          <Button className="mt-6" variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        )}
      </div>
    </section>
  );
}
