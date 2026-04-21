"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import { HeronWheel } from "@/components/rpg/sigils";

const NAV_ITEMS = [
  { href: "/", label: "Hall" },
  { href: "/session", label: "Trial" },
  { href: "/words", label: "Lexicon" },
  { href: "/stats", label: "Chronicle" },
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
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14 gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          style={{ color: "var(--gold-deep)" }}
        >
          <HeronWheel size={30} />
          <span
            className="font-display text-[22px] font-bold leading-none"
            style={{ color: "var(--ink)", letterSpacing: ".22em" }}
          >
            LEX
            <span style={{ color: "var(--gold-deep)" }}>·</span>
            FORGE
          </span>
        </Link>

        <nav className="flex items-center gap-1 flex-wrap justify-end">
          <AuthButton />
          {NAV_ITEMS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "nav-link-lex inline-flex items-center px-3 py-1.5 font-display text-[12px] font-medium uppercase leading-none transition-colors border-b-2 border-transparent",
                )}
                style={{
                  letterSpacing: ".18em",
                  color: active ? "var(--gold-bright)" : "var(--muted-foreground)",
                  borderBottomColor: active ? "var(--gold)" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
