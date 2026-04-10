"use client";

import { motion } from "framer-motion";
import { Brain, Eye, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RPGStats } from "@/lib/types";

const STAT_CONFIG = [
  { key: "recall" as const, label: "Recall", desc: "Word retrieval", icon: Target, color: "text-blue-400", bg: "bg-blue-500", bgLight: "bg-blue-500/10", gradient: "from-blue-500/8 to-transparent", glow: "shadow-blue-500/20" },
  { key: "retention" as const, label: "Retention", desc: "Long-term memory", icon: Brain, color: "text-purple-400", bg: "bg-purple-500", bgLight: "bg-purple-500/10", gradient: "from-purple-500/8 to-transparent", glow: "shadow-purple-500/20" },
  { key: "perception" as const, label: "Perception", desc: "Processing speed", icon: Eye, color: "text-amber-400", bg: "bg-amber-500", bgLight: "bg-amber-500/10", gradient: "from-amber-500/8 to-transparent", glow: "shadow-amber-500/20" },
  { key: "creativity" as const, label: "Creativity", desc: "Visual association", icon: Lightbulb, color: "text-emerald-400", bg: "bg-emerald-500", bgLight: "bg-emerald-500/10", gradient: "from-emerald-500/8 to-transparent", glow: "shadow-emerald-500/20" },
];

interface StatDiamondProps {
  stats: RPGStats;
}

export function StatDiamond({ stats }: StatDiamondProps) {
  const maxStat = Math.max(...Object.values(stats), 10);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-lg">&#x2694;&#xFE0F;</span>
          RPG Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {STAT_CONFIG.map(({ key, label, desc, icon: Icon, color, bg, bgLight, gradient, glow }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} bg-muted/30 p-3`}
            >
              {/* Watermark icon */}
              <Icon className={`absolute -right-2 -bottom-2 size-16 ${color} opacity-[0.06]`} />

              <div className="relative space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center size-9 rounded-lg ${bgLight} ${color} shadow-sm ${glow}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold tabular-nums leading-tight">{stats[key]}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[key] / maxStat) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
