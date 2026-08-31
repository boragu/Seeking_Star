import { SealCheck } from "@phosphor-icons/react";
import type { ApiSource } from "../../../api/contracts";

export function SourceNote({ sources, generatedAt }: { sources: ApiSource[]; generatedAt: string }) {
  const available = sources.filter((source) => source.status !== "error");
  const partial = sources.some((source) => source.status !== "live");
  return <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[10px] text-stone-500"><span className="flex items-center gap-1.5"><SealCheck className="text-teal" weight="fill" /> {available.map((source) => source.label).join(" · ") || "한국관광공사"}</span><span>{partial ? "일부 정보는 잠시 표시되지 않을 수 있어요." : `${new Date(generatedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 기준`}</span></div>;
}
