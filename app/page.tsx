"use client";

import { Header } from "@/components/header";
import { ForceWipeCountdown } from "@/components/force-wipe-countdown";
import { useLang } from "@/components/language-context";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      <Header />
      <main className="px-5 pt-44 md:pt-56 pb-24">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <p
            className="fade-up inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] border border-[var(--border)] rounded-full px-4 py-1.5 mb-8"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            {t.tracker}
          </p>

          <h1
            className="fade-up font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            style={{ animationDelay: "0.12s" }}
          >
            {t.welcome}{" "}
            <span
              className="text-[var(--primary)]"
              style={{ textShadow: "0 0 32px rgba(0,255,136,0.45)" }}
            >
              norri3
            </span>
            <span className="text-[var(--muted-foreground)]">.com</span>
          </h1>

          <p
            className="fade-up text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto"
            style={{ animationDelay: "0.2s" }}
          >
            {t.tagline}
          </p>
        </section>

        {/* Countdown */}
        <div className="fade-up mt-4" style={{ animationDelay: "0.3s" }}>
          <ForceWipeCountdown />
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center">
        <p className="text-xs text-[var(--muted-foreground)]">{t.builtWith}</p>
      </footer>
    </>
  );
}
