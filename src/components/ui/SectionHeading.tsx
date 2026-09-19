import { cn } from "../../lib/cn";

export function SectionHeading({
  number,
  title,
  description,
  tone = "teal",
}: {
  number?: string;
  title: string;
  description?: string;
  tone?: "teal" | "rust";
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      {number && (
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full border font-display text-xs font-bold",
            tone === "rust" ? "border-rust text-rust" : "border-teal text-teal"
          )}
        >
          {number}
        </span>
      )}
      <div>
        <h2 className="font-display text-[20px] font-bold leading-tight">{title}</h2>
        {description && <p className="mt-1 text-[11px] leading-5 text-stone-500">{description}</p>}
      </div>
    </div>
  );
}
