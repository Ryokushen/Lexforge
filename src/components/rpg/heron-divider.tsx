import { cn } from "@/lib/utils";
import { HeronMark } from "./sigils";

interface HeronDividerProps {
  label?: string;
  className?: string;
}

export function HeronDivider({ label, className }: HeronDividerProps) {
  return (
    <div className={cn("heron-divider my-4", className)}>
      {label ? (
        <span className="uppercase-tracked text-[11px] text-gold-deep">{label}</span>
      ) : (
        <HeronMark size={16} />
      )}
    </div>
  );
}
