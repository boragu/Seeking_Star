import { ArrowClockwise, Warning } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/Button";

export function RecommendationState({ status, errorCode, message, onRetry }: { status: "loading" | "error" | "empty"; errorCode?: string; message?: string; onRetry: () => void }) {
  const servicePreparing = errorCode === "SERVICE_KEY_REQUIRED";
  const title = status === "loading" ? "오늘의 밤하늘을 살피고 있어요" : servicePreparing ? "추천 서비스를 준비하고 있어요" : status === "empty" ? "조건에 맞는 장소가 없어요" : "지금은 추천을 불러올 수 없어요";
  const description = servicePreparing ? "잠시 후 다시 이용해 주세요." : message ?? "조금 뒤 다시 시도해 주세요.";
  return <section className="grid min-h-[520px] place-items-center border border-line bg-white/48 p-8 text-center shadow-[0_20px_60px_rgba(68,49,29,.06)]"><div className="max-w-sm"><span className="mx-auto grid size-16 place-items-center rounded-full border border-teal/25 bg-teal/5 text-teal">{status === "loading" ? <ArrowClockwise className="animate-spin" size={27} /> : <Warning size={27} />}</span><h2 className="mt-6 font-display text-2xl font-bold">{title}</h2><p className="mt-2 text-[12px] leading-6 text-stone-500">{description}</p>{status !== "loading" && <Button className="mt-6" variant="secondary" onClick={onRetry}>다시 시도</Button>}</div></section>;
}
