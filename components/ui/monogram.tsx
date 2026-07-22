import { cn } from "@/lib/utils";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground",
        className
      )}
    >
      YM
    </span>
  );
}
