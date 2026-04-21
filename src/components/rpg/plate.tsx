"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PlateTone = "gold" | "crimson" | "sage" | "ember" | "lapis";

const TONE_GRADIENTS: Record<PlateTone, string> = {
  gold: "linear-gradient(90deg, var(--gold-deep), var(--gold-bright))",
  crimson: "linear-gradient(90deg, #5a1414, var(--crimson-2))",
  sage: "linear-gradient(90deg, #354c28, var(--sage))",
  ember: "linear-gradient(90deg, #7a3818, var(--ember))",
  lapis: "linear-gradient(90deg, #18304b, var(--lapis))",
};

interface PlateProps {
  value: number;
  max: number;
  tone?: PlateTone;
  height?: number;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  labelClassName?: string;
  animate?: boolean;
  className?: string;
}

export function Plate({
  value,
  max,
  tone = "gold",
  height = 10,
  label,
  sublabel,
  labelClassName,
  animate = true,
  className,
}: PlateProps) {
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));

  return (
    <div className={className}>
      {(label || sublabel) && (
        <div className={cn("flex justify-between items-baseline text-[11px] mb-1 text-muted-foreground", labelClassName)}>
          {label && (
            <span className="uppercase-tracked" style={{ letterSpacing: ".16em" }}>
              {label}
            </span>
          )}
          {sublabel && <span className="font-mono-num text-[11px]">{sublabel}</span>}
        </div>
      )}
      <div className="plate" style={{ height }}>
        <motion.div
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "100%",
            background: TONE_GRADIENTS[tone],
            boxShadow: "inset 0 1px 0 rgba(255,240,200,.3)",
          }}
        />
      </div>
    </div>
  );
}
