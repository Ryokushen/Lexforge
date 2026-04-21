"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import {
  Compass,
  HeronWheel,
  Scroll,
  Sword,
  Tome,
} from "@/components/rpg/sigils";

type NavIcon = ComponentType<{ size?: number; className?: string }>;

const NAV_ITEMS: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/", label: "Hall", icon: Compass },
  { href: "/session", label: "Trial", icon: Sword },
  { href: "/words", label: "Lexicon", icon: Tome },
  { href: "/stats", label: "Chronicle", icon: Scroll },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--line)]"
      style={{
        background: "color-mix(in oklab, var(--bg), transparent 15%)",
        backdropFilter: "blur(12px) saturate(1.1)",
        WebkitBackdropFilter: "blur(12px) saturate(1.1)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-4 h-14 gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          style={{ color: "var(--gold-deep)" }}
        >
          <HeronWheel size={26} className="shrink-0 sm:hidden" />
          <HeronWheel size={30} className="shrink-0 hidden sm:block" />
          <span
            className="font-display font-bold leading-none text-[17px] sm:text-[22px]"
            style={{ color: "var(--ink)", letterSpacing: ".18em" }}
          >
            LEX
            <span style={{ color: "var(--gold-deep)" }}>·</span>
            FORGE
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1 justify-end shrink-0">
          <AuthButton />
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                title={label}
                className={cn(
                  "nav-link-lex inline-flex items-center justify-center px-2 sm:px-3 py-1.5 font-display text-[12px] font-medium uppercase leading-none transition-colors border-b-2 border-transparent gap-1.5",
                )}
                style={{
                  letterSpacing: ".18em",
                  color: active ? "var(--gold-bright)" : "var(--muted-foreground)",
                  borderBottomColor: active ? "var(--gold)" : "transparent",
                }}
              >
                <Icon size={18} className="sm:hidden" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
