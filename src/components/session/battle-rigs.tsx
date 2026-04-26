"use client";

import { motion } from "framer-motion";

export type BattleEvent =
  | "idle"
  | "player-hit"
  | "monster-attack"
  | "monster-defeated";

type BattleRigProps = {
  event: BattleEvent;
  accent: string;
  reducedMotion: boolean;
  defeated?: boolean;
};

function playerMotion(event: BattleEvent, reducedMotion: boolean) {
  if (reducedMotion) {
    return event === "monster-attack"
      ? { opacity: [1, 0.72, 1] }
      : { opacity: 1 };
  }

  if (event === "player-hit" || event === "monster-defeated") {
    return { x: [0, 34, 42, 0], y: [0, -2, 0, 0] };
  }

  if (event === "monster-attack") {
    return { x: [0, -8, 6, -3, 0] };
  }

  return { y: [0, -2, 0] };
}

function swordArmMotion(event: BattleEvent, reducedMotion: boolean) {
  if (reducedMotion) {
    return event === "player-hit" || event === "monster-defeated"
      ? { opacity: [1, 0.55, 1] }
      : { opacity: 1 };
  }

  if (event === "player-hit" || event === "monster-defeated") {
    return { rotate: [0, -42, -18, 0], x: [0, 7, 5, 0] };
  }

  return { rotate: 0, x: 0 };
}

function monsterMotion(event: BattleEvent, reducedMotion: boolean) {
  if (reducedMotion) {
    if (event === "monster-defeated") return { opacity: [1, 0.28] };
    if (event === "player-hit") return { opacity: [1, 0.62, 1] };
    if (event === "monster-attack") return { opacity: [1, 0.86, 1] };
    return { opacity: 1 };
  }

  if (event === "monster-defeated") {
    return { x: [0, 8, -4, 0], y: [0, -3, 8], opacity: [1, 1, 0.22] };
  }

  if (event === "player-hit") {
    return { x: [0, 10, -6, 0], scale: [1, 0.98, 1.02, 1] };
  }

  if (event === "monster-attack") {
    return { x: [0, -28, -34, 0], y: [0, -2, 0, 0] };
  }

  return { y: [0, -2, 0] };
}

const attackTransition = {
  duration: 0.68,
  ease: "easeInOut" as const,
};

const idleTransition = {
  duration: 3.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function PlayerRig({ event, accent, reducedMotion }: BattleRigProps) {
  const activeTransition = event === "idle" && !reducedMotion
    ? idleTransition
    : attackTransition;

  return (
    <motion.svg
      viewBox="0 0 170 190"
      aria-hidden
      className="absolute left-1 bottom-7 h-[150px] w-[135px] sm:left-5 sm:h-[170px] sm:w-[150px]"
      initial={false}
      animate={playerMotion(event, reducedMotion)}
      transition={activeTransition}
      style={{ overflow: "visible" }}
    >
      <ellipse cx="82" cy="174" rx="48" ry="10" fill="rgba(0,0,0,.28)" />

      <motion.g
        initial={false}
        animate={swordArmMotion(event, reducedMotion)}
        transition={attackTransition}
        style={{ transformOrigin: "103px 94px" }}
      >
        <path
          d="M108 96 L150 76"
          stroke="#eadcbe"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M146 76 L167 60"
          stroke={accent}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M154 70 L168 62 L160 78 Z"
          fill="#f3efe1"
          stroke={accent}
          strokeWidth="1.2"
        />
      </motion.g>

      <g>
        <path
          d="M62 166 L52 183"
          stroke="#eadcbe"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M91 166 L101 183"
          stroke="#eadcbe"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M52 162 L102 162 L112 78 Q82 47 42 78 Z"
          fill="#3e5550"
          stroke="#d9b765"
          strokeWidth="2"
        />
        <path
          d="M46 84 Q78 49 111 84 L102 118 Q80 134 56 116 Z"
          fill="#526c63"
          stroke="rgba(255,240,200,.62)"
          strokeWidth="1.6"
        />
        <circle
          cx="80"
          cy="61"
          r="17"
          fill="#eadcbe"
          stroke="#8a6f3d"
          strokeWidth="2"
        />
        <path
          d="M63 58 Q80 34 100 58"
          fill="#5c6f69"
          stroke="#d9b765"
          strokeWidth="1.5"
        />
        <path
          d="M56 96 L24 118"
          stroke="#eadcbe"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M18 112 L39 122 L24 140 Z"
          fill="#2c3836"
          stroke="#d9b765"
          strokeWidth="2"
        />
      </g>
    </motion.svg>
  );
}

export function MonsterRig({
  event,
  accent,
  reducedMotion,
  defeated = false,
}: BattleRigProps) {
  const activeTransition = event === "idle" && !reducedMotion
    ? idleTransition
    : attackTransition;
  const showDamageFlash =
    event === "player-hit" || event === "monster-defeated" || defeated;

  return (
    <motion.svg
      viewBox="0 0 190 205"
      aria-hidden
      className="absolute right-0 bottom-5 h-[165px] w-[145px] sm:right-4 sm:h-[185px] sm:w-[168px]"
      initial={false}
      animate={monsterMotion(event, reducedMotion)}
      transition={activeTransition}
      style={{ overflow: "visible" }}
    >
      <ellipse cx="99" cy="188" rx="60" ry="12" fill="rgba(0,0,0,.34)" />
      <path
        d="M44 178 L151 178 L167 62 Q97 10 25 62 Z"
        fill="#633841"
        stroke="#d9b765"
        strokeWidth="2.2"
      />
      <path
        d="M55 72 Q96 32 138 72 L130 137 Q96 159 62 136 Z"
        fill="#201317"
        stroke="rgba(255,240,200,.24)"
        strokeWidth="1.4"
      />
      <path
        d="M45 86 L15 124"
        stroke="#633841"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M148 86 L179 126"
        stroke="#633841"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {!defeated && (
        <>
          <ellipse cx="81" cy="98" rx="5" ry="3" fill={accent} />
          <ellipse cx="112" cy="98" rx="5" ry="3" fill={accent} />
        </>
      )}
      <path
        d="M66 128 Q96 145 126 128"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeOpacity=".55"
      />
      {showDamageFlash && (
        <motion.path
          d="M46 58 L152 176 M145 55 L54 178"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          initial={false}
          animate={reducedMotion ? { opacity: [0, 0.7, 0] } : { opacity: [0, 1, 0] }}
          transition={{ duration: 0.62, ease: "easeOut" }}
        />
      )}
      {defeated && (
        <path
          d="M35 178 Q96 156 157 178"
          fill="rgba(0,0,0,.42)"
          stroke={accent}
          strokeWidth="1.4"
          strokeOpacity=".55"
        />
      )}
    </motion.svg>
  );
}
