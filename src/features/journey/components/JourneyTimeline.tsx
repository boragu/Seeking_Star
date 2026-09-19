import { cn } from "../../../lib/cn";

export interface TimelineStop {
  time: string;
  title: string;
  detail: string;
  tag?: string;
  isHighlight?: boolean;
}

export function JourneyTimeline({ stops }: { stops: TimelineStop[] }) {
  const colCount = stops.length === 2 ? "grid-cols-2" : stops.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <section className={cn("relative my-8 grid gap-4 before:absolute before:left-[10%] before:right-[10%] before:top-[48px] before:h-px before:bg-[#7c8884]/40 max-md:my-6 max-md:grid-cols-1 max-md:before:left-[17px] max-md:before:right-auto max-md:before:top-5 max-md:before:h-[calc(100%-40px)] max-md:before:w-px", colCount)}>
      {stops.map((stop, index) => {
        const isDestination = stop.isHighlight ?? index === stops.length - 1;
        return (
          <article
            className="relative grid grid-rows-[30px_22px_auto] justify-items-center text-center max-md:mb-4 max-md:grid-cols-[36px_1fr] max-md:grid-rows-none max-md:justify-items-start max-md:text-left"
            key={`${stop.time}-${stop.title}-${index}`}
          >
            <time className={cn("font-display text-lg font-bold max-md:col-start-2", isDestination ? "text-rust" : "text-teal")}>
              {stop.time}
            </time>
            <i
              className={cn(
                "relative z-10 mt-3 size-4 rounded-full border-4 border-paper ring-1 max-md:col-start-1 max-md:row-start-1 max-md:mt-1",
                isDestination ? "bg-rust ring-rust shadow-sm" : "bg-teal ring-teal"
              )}
            />
            <div className="mt-3 max-md:col-start-2 max-md:mt-1">
              {stop.tag && (
                <span className="inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 mb-1 border border-stone-200">
                  {stop.tag}
                </span>
              )}
              <strong className="block font-display text-[15px] leading-tight text-ink">{stop.title}</strong>
              <p className="mt-1 text-[11px] leading-4 text-stone-500">{stop.detail}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
