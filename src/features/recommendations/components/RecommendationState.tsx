import { ArrowClockwise, Warning } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";

export function RecommendationState({
  status,
  errorCode,
  message,
  onRetry,
}: {
  status: "loading" | "error" | "empty";
  errorCode?: string;
  message?: string;
  onRetry: () => void;
}) {
  const servicePreparing = errorCode === "SERVICE_KEY_REQUIRED";
  const title =
    status === "loading"
      ? "별 관측지 데이터를 조회하고 있습니다"
      : servicePreparing
      ? "공공데이터 서비스 연계 준비 중"
      : status === "empty"
      ? "조건에 부합하는 장소가 없습니다"
      : "추천 데이터를 불러오지 못했습니다";
  const description = servicePreparing
    ? "공공데이터 인증키 설정 확인 후 다시 시도해 주세요."
    : message ?? "잠시 후 다시 시도해 주세요.";

  return (
    <section className="grid min-h-[520px] place-items-center border border-line bg-white/48 p-8 text-center shadow-[0_20px_60px_rgba(68,49,29,.06)]">
      <div className="max-w-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-teal/25 bg-teal/5 text-teal">
          {status === "loading" ? (
            <ArrowClockwise className="animate-spin" size={27} />
          ) : (
            <Warning size={27} />
          )}
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-[12px] leading-6 text-stone-500">{description}</p>
        {status !== "loading" && (
          <Button className="mt-6" variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        )}
      </div>
    </section>
  );
}
