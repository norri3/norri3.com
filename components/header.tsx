"use client";

import { Menu } from "lucide-react";
import { LanguageToggle } from "@/components/language-context";

const HEXAGON = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center bg-[var(--background)]/70 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-5xl w-full mx-auto px-6 md:px-8 flex items-center justify-center relative">
        {/* Hamburger Menu */}
        <button
          className="absolute left-4 md:left-8 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-7 h-7" />
        </button>

        {/* N3 Hexagon Logo + wordmark */}
        <a
          href="/"
          className="flex items-center gap-3 group"
          aria-label="norri3.com home"
        >
          <span
            className="relative w-12 h-12 bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-105 font-display"
            style={{
              clipPath: HEXAGON,
              filter: "drop-shadow(0 0 14px rgba(0,255,136,0.35))",
            }}
          >
            N3
          </span>
          <span className="hidden sm:inline text-lg font-semibold tracking-tight font-display">
            norri3<span className="text-[var(--muted-foreground)]">.com</span>
          </span>
        </a>

        {/* Language toggle */}
        <div className="absolute right-4 md:right-8">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
