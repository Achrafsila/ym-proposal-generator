import { cn } from "@/lib/utils";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-accent-soft to-accent text-sm font-semibold text-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_18px_-6px_rgba(212,175,106,0.6)]",
        className
      )}
    >
      YM
    </span>
  );
}
