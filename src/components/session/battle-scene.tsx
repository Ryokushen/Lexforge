"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SessionResult } from "@/lib/types";
import { CornerFlourish } from "@/components/rpg/sigils";

// ── Foe pool ─────────────────────────────────────────────────────────────

const FOES = [
  {
    name: "Myrddraal",
    subtitle: "Eyeless Half-man",
    color: "#3a3a3a",
    accent: "#8a1e1e",
    hpLabel: "Truths",
  },
  {
    name: "Trolloc Warband",
    subtitle: "Spawn of the Shadow",
    color: "#5a3318",
    accent: "#b85820",
    hpLabel: "Banners",
  },
  {
    name: "Draghkar",
    subtitle: "Whisperer of the Dark",
    color: "#2a1a2e",
    accent: "#7a3e7a",
    hpLabel: "Wards",
  },
  {
    name: "Gholam",
    subtitle: "Blood-drinker, Ageless",
    color: "#3b1f1f",
    accent: "#a02020",
    hpLabel: "Seals",
  },
  {
    name: "Fade",
    subtitle: "Shadowed Captain",
    color: "#1e1a2e",
    accent: "#5a5a8f",
    hpLabel: "Threads",
  },
  {
    name: "Dark Hound",
    subtitle: "Pack of the Blight",
    color: "#2e1a14",
    accent: "#d0692c",
    hpLabel: "Chains",
  },
];

interface BattleSceneProps {
  sessionSeed: number;
  totalWords: number;
  results: SessionResult[];
  /** Signals the reviewing state so we can trigger attack animation */
  lastResult: SessionResult | null;
}

export function BattleScene({ sessionSeed, totalWords, results, lastResult }: BattleSceneProps) {
  const foe = FOES[sessionSeed % FOES.length];

  const correctCount = results.filter((r) => r.correct).length;
  const maxHp = totalWords;
  const hp = Math.max(maxHp - correctCount, 0);
  const isDead = hp === 0;
  const attackPhase = lastResult ? (lastResult.correct ? "hit" : "miss") : "idle";
  const shaking = lastResult && lastResult.correct;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={`foe-${lastResult?.wordId ?? "idle"}-${attackPhase}`}
        animate={
          shaking
            ? { x: [0, -8, 8, -4, 4, 0] }
            : attackPhase === "miss"
              ? { x: [0, 4, -4, 0] }
              : { x: 0 }
        }
        transition={{ duration: 0.4 }}
        className="relative mx-auto overflow-hidden"
        style={{
          width: 220,
          height: 300,
          background: `linear-gradient(160deg,
            color-mix(in oklab, ${foe.color}, black 10%) 0%,
            color-mix(in oklab, ${foe.color}, black 40%) 100%)`,
          border: "3px solid var(--gold-deep)",
          outline: "1px solid var(--line)",
          outlineOffset: 3,
          borderRadius: 6,
          boxShadow: "0 10px 30px rgba(0,0,0,.3), inset 0 0 0 1px rgba(255,240,200,.12)",
        }}
      >
        {/* Corner flourishes */}
        {(["tl", "tr", "bl", "br"] as const).map((p) => (
          <span
            key={p}
            aria-hidden
            className="absolute"
            style={{
              top: p.includes("t") ? 4 : undefined,
              bottom: p.includes("b") ? 4 : undefined,
              left: p.includes("l") ? 4 : undefined,
              right: p.includes("r") ? 4 : undefined,
              color: "var(--gold-bright)",
              opacity: 0.85,
              transform:
                p === "tr"
                  ? "scaleX(-1)"
                  : p === "bl"
                    ? "scaleY(-1)"
                    : p === "br"
                      ? "scale(-1,-1)"
                      : "none",
            }}
          >
            <CornerFlourish size={22} />
          </span>
        ))}

        {/* Foe silhouette — hooded figure */}
        <svg
          viewBox="0 0 220 300"
          width="100%"
          height="100%"
          className="absolute inset-0"
          aria-hidden
        >
          <defs>
            <radialGradient id="foeglow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={foe.accent} stopOpacity=".5" />
              <stop offset="100%" stopColor={foe.accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="125" r="100" fill="url(#foeglow)" />
          <path
            d="M 58 100 Q 110 46 162 100 L 184 276 L 36 276 Z"
            fill="rgba(0,0,0,.55)"
            stroke={foe.accent}
            strokeWidth="1.2"
            strokeOpacity=".6"
          />
          <path
            d="M 76 114 Q 110 86 144 114 L 150 196 Q 110 216 68 196 Z"
            fill="rgba(0,0,0,.85)"
          />
          {!isDead && (
            <>
              <ellipse cx="95" cy="150" rx="4.5" ry="2" fill={foe.accent} opacity=".9" />
              <ellipse cx="125" cy="150" rx="4.5" ry="2" fill={foe.accent} opacity=".9" />
            </>
          )}
          <path d="M 46 184 L 174 184" stroke={foe.accent} strokeWidth=".6" opacity=".25" />
          <path d="M 40 230 L 180 230" stroke={foe.accent} strokeWidth=".6" opacity=".25" />
        </svg>

        {/* HP pip bar on top */}
        <div className="absolute top-3 left-3.5 right-3.5">
          <div
            className="flex justify-between items-baseline text-[9px] mb-1"
            style={{ color: "#f0e1b5", letterSpacing: ".15em" }}
          >
            <span className="font-display">{foe.hpLabel.toUpperCase()}</span>
            <span className="font-mono-num">
              {hp}/{maxHp}
            </span>
          </div>
          <div className="flex gap-[3px]">
            {Array.from({ length: maxHp }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  height: 6,
                  background: i < hp ? foe.accent : "rgba(0,0,0,.5)",
                  border: `1px solid ${i < hp ? "var(--gold-bright)" : "rgba(0,0,0,.7)"}`,
                  boxShadow: i < hp ? `0 0 4px ${foe.accent}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Name banner at bottom */}
        <div
          className="absolute left-2.5 right-2.5 bottom-2.5 px-3 py-2 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,.85))",
            border: "1px solid var(--gold-deep)",
          }}
        >
          <div
            className="font-display text-base font-bold"
            style={{ color: "var(--gold-bright)", letterSpacing: ".15em" }}
          >
            {foe.name.toUpperCase()}
          </div>
          <div className="text-[10px] italic mt-0.5" style={{ color: "#d7c9a7" }}>
            {foe.subtitle}
          </div>
        </div>

        {/* Damage / Miss floater */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              key={`dmg-${results.length}`}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -36, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute right-4 top-12 font-display font-bold text-sm pointer-events-none select-none"
              style={{
                color: attackPhase === "hit" ? "var(--sage)" : "var(--crimson-2)",
                textShadow: "0 1px 0 rgba(0,0,0,.6)",
                letterSpacing: ".1em",
              }}
            >
              {attackPhase === "hit" ? "-1" : "MISS"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Death overlay */}
        <AnimatePresence>
          {isDead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,.55)" }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
                className="font-display font-black tracking-[0.3em]"
                style={{
                  color: "var(--gold-bright)",
                  fontSize: 28,
                  textShadow: "0 0 12px rgba(236,198,115,.7)",
                }}
              >
                FALLEN
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
