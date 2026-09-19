import { useEffect, useState } from "react";
import { TreeEvergreen } from "@phosphor-icons/react";
import { AiBadge } from "../../../components/ui/AiBadge";
import { MarkdownText } from "../../../components/ui/MarkdownText";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { Destination } from "../../../domain/types";
import { requestAiOvertourismStory } from "../aiStargazingService";
import {
  getCachedAiOvertourismStory,
  setCachedAiOvertourismStory,
} from "../aiBriefingCache";

export function AiOvertourismBanner({
  destination,
}: {
  destination: Destination;
}) {
  const [storyText, setStoryText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const cached = getCachedAiOvertourismStory(destination);
    if (cached) {
      setStoryText(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    requestAiOvertourismStory(destination, controller.signal)
      .then((content) => {
        if (!isMounted) return;
        if (content) {
          setStoryText(content);
          setCachedAiOvertourismStory(destination, content);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [destination.id]);

  if (!isLoading && !storyText) return null;

  return (
    <div className="rounded-lg border border-teal/30 bg-teal/[0.04] p-3 text-[11.5px] leading-relaxed">
      <div className="flex items-center gap-1.5 font-bold text-teal mb-1.5">
        <TreeEvergreen size={15} weight="fill" />
        <span>과밀 명소 대신 이곳을 추천하는 이유</span>
        <AiBadge label="AI 큐레이션" variant="teal" />
      </div>
      {isLoading ? (
        <div className="space-y-1.5 py-0.5">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
        </div>
      ) : (
        <MarkdownText
          content={storyText || ""}
          className="text-stone-700 font-normal leading-relaxed text-[11.5px]"
        />
      )}
    </div>
  );
}
