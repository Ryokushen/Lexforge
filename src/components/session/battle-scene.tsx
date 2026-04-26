"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SessionResult } from "@/lib/types";
import { CornerFlourish } from "@/components/rpg/sigils";
import {
  MonsterRig,
  PlayerRig,
  type BattleEvent,
} from "@/components/session/battle-rigs";

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

export function getMonsterHp(
  totalWords: number,
  results: SessionResult[],
): number {
  const maxHp = Math.max(totalWords, 0);
  const correctCount = results.filter((r) => r.correct).length;
  return Math.max(maxHp - correctCount, 0);
}

export function getBattleEvent(
  lastResult: SessionResult | null,
  hp: number,
): BattleEvent {
  if (!lastResult) return "idle";
  if (!lastResult.correct) return "monster-attack";
  return hp === 0 ? "monster-defeated" : "player-hit";
}

export function BattleScene({
  sessionSeed,
  totalWords,
  results,
  lastResult,
}: BattleSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const foe = FOES[sessionSeed % FOES.length];
  const maxHp = Math.max(totalWords, 0);
  const hp = getMonsterHp(maxHp, results);
  const isDead = hp === 0;
  const battleEvent = getBattleEvent(lastResult, hp);
  const showSlash = battleEvent === "player-hit" || battleEvent === "monster-defeated";
  const showMonsterAttack = battleEvent === "monster-attack";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: "min(100%, 420px)",
          height: 260,
          background: `linear-gradient(160deg,
            color-mix(in oklab, ${foe.color}, white 10%) 0%,
            color-mix(in oklab, ${foe.color}, black 46%) 100%)`,
          border: "3px solid var(--gold-deep)",
          outline: "1px solid var(--line)",
          outlineOffset: 3,
          borderRadius: 6,
          boxShadow:
            "0 10px 30px rgba(0,0,0,.26), inset 0 0 0 1px rgba(255,240,200,.12)",
        }}
      >
        {(["tl", "tr", "bl", "br"] as const).map((p) => (
          <span
            key={p}
            aria-hidden
            className="absolute z-20"
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

        <div
          aria-hidden
          className="absolute left-8 right-8 bottom-9 h-5 rounded-full blur-[1px]"
          style={{ background: "rgba(0,0,0,.28)" }}
        />

        <div className="absolute top-3 left-3.5 right-3.5 z-30">
          <div
            className="flex justify-between items-baseline text-[9px] mb-1"
            style={{ color: "#f0e1b5" }}
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
                  background: i < hp ? foe.accent : "rgba(0,0,0,.48)",
                  border: `1px solid ${
                    i < hp ? "var(--gold-bright)" : "rgba(0,0,0,.68)"
                  }`,
                  boxShadow: i < hp ? `0 0 4px ${foe.accent}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <PlayerRig
          event={battleEvent}
          accent="var(--gold-bright)"
          reducedMotion={reducedMotion}
        />
        <MonsterRig
          event={battleEvent}
          accent={foe.accent}
          reducedMotion={reducedMotion}
          defeated={isDead}
        />

        <AnimatePresence>
          {showSlash && (
            <motion.div
              key={`slash-${results.length}`}
              aria-hidden
              initial={{ opacity: 0, scaleX: 0.25, x: -20, rotate: -18 }}
              animate={
                reducedMotion
                  ? { opacity: [0, 0.85, 0] }
                  : { opacity: [0, 1, 0], scaleX: [0.25, 1, 1.18], x: [-18, 2, 18] }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.62, ease: "easeOut" }}
              className="absolute left-[45%] top-[42%] z-30 h-2 w-24 origin-center"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--gold-bright), transparent)",
                boxShadow: "0 0 14px rgba(236,198,115,.7)",
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lastResult && (
            <motion.div
              key={`dmg-${results.length}`}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: reducedMotion ? -8 : -32, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.45 : 0.75, ease: "easeOut" }}
              className="absolute right-8 top-14 z-40 font-display font-bold text-sm pointer-events-none select-none"
              style={{
                color: lastResult.correct ? "var(--sage)" : "var(--crimson-2)",
                textShadow: "0 1px 0 rgba(0,0,0,.6)",
              }}
            >
              {lastResult.correct ? "-1" : "MISS"}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMonsterAttack && (
            <motion.div
              key={`guard-${results.length}`}
              aria-hidden
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: [0, 0.75, 0], scale: reducedMotion ? 1 : [0.92, 1.05, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute left-[18%] top-[38%] z-30 size-16 rounded-full"
              style={{
                border: "2px solid var(--crimson-2)",
                boxShadow: "0 0 20px rgba(160,32,32,.5)",
              }}
            />
          )}
        </AnimatePresence>

        <div
          className="absolute left-2.5 right-2.5 bottom-2.5 z-30 px-3 py-2 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,.46), rgba(0,0,0,.82))",
            border: "1px solid var(--gold-deep)",
          }}
        >
          <div
            className="font-display text-base font-bold"
            style={{ color: "var(--gold-bright)" }}
          >
            {foe.name.toUpperCase()}
          </div>
          <div className="text-[10px] italic mt-0.5" style={{ color: "#d7c9a7" }}>
            {foe.subtitle}
          </div>
        </div>

        <AnimatePresence>
          {isDead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.18 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,.48)" }}
            >
              <motion.div
                initial={{ scale: reducedMotion ? 1 : 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                  delay: reducedMotion ? 0 : 0.2,
                }}
                className="font-display font-black"
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
      </div>
    </div>
  );
}
