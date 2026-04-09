"use client";

import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-black border-b border-[var(--border)] z-50 flex items-center">
      <div className="max-w-5xl w-full mx-auto px-8 flex items-center justify-center relative">
        {/* Hamburger Menu */}
        <button
          className="absolute left-8 p-2 text-white hover:opacity-70 transition-opacity"
          aria-label="Menu"
        >
          <Menu className="w-8 h-8" />
        </button>

        {/* N3 Hexagon Logo */}
        <div className="flex justify-center">
          <div
            className="w-[68px] h-[68px] bg-white text-black flex items-center justify-center text-[28px] font-black shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            N3
          </div>
        </div>
      </div>
    </header>
  );
}
