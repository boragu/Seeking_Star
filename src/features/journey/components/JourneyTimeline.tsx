import { cn } from "../../../lib/cn";

export interface TimelineStop { time: string; title: string; detail: string }

export function JourneyTimeline({ stops }: { stops: TimelineStop[] }) {
  return <section className="relative my-10 grid grid-cols-2 before:absolute before:left-[20%] before:right-[20%] before:top-[48px] before:h-px before:bg-[#7c8884] max-md:my-8 max-md:grid-cols-1 max-md:before:left-[17px] max-md:before:right-auto max-md:before:top-5 max-md:before:h-[calc(100%-40px)] max-md:before:w-px">{stops.map((stop, index) => <article className="relative grid grid-rows-[30px_22px_auto] justify-items-center text-center max-md:mb-6 max-md:grid-cols-[36px_1fr] max-md:grid-rows-none max-md:justify-items-start max-md:text-left" key={`${stop.time}-${stop.title}`}><time className={cn("font-display text-xl font-bold max-md:col-start-2", index ? "text-rust" : "text-teal")}>{stop.time}</time><i className={cn("relative z-10 mt-3 size-4 rounded-full border-4 border-paper ring-1 max-md:col-start-1 max-md:row-start-1 max-md:mt-1", index ? "bg-rust ring-rust" : "bg-teal ring-teal")} /><div className="mt-4 max-md:col-start-2 max-md:mt-1"><strong className="font-display text-[17px]">{stop.title}</strong><p className="mt-1 text-[10px] leading-5 text-stone-500">{stop.detail}</p></div></article>)}</section>;
}
