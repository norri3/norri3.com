"use client";

import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useLang } from "@/components/language-context";

/**
 * Rust force wipes land on the FIRST THURSDAY of every month at 19:00 UK time
 * (Europe/London), alongside Facepunch's monthly update. The studio is UK-based
 * and ships at a consistent local hour, so the UTC time shifts with British
 * daylight saving: 18:00 UTC during BST (summer), 19:00 UTC in winter (GMT).
 * We resolve London's offset at runtime, so it stays correct across the DST
 * change and for every visitor, and never needs manual updating. (The actual
 * patch rollout can still drift an hour or two depending on patch size.)
 */

// How long after the wipe time we keep showing the "WIPED" state before
// rolling the countdown over to next month (rollouts typically take 1-3 hrs).
const WIPE_WINDOW_MS = 3 * 60 * 60 * 1000;

// A time zone's offset from UTC (in ms) at a given instant. Positive = ahead
// of UTC (e.g. London in summer is +3,600,000). Uses the Intl API so DST is
// handled automatically with no hardcoded rules.
function tzOffsetMs(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUTC - date.getTime();
}

function getWipeDate(year: number, month: number): Date {
  // First Thursday of the month (month is 0-indexed). 4 = Thursday.
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (4 - first.getUTCDay() + 7) % 7;
  const day = 1 + offset;
  // 19:00 wall-clock time in London, converted to the correct UTC instant.
  const guessUTC = Date.UTC(year, month, day, 19, 0, 0);
  const londonOffset = tzOffsetMs("Europe/London", new Date(guessUTC));
  return new Date(guessUTC - londonOffset);
}

function addMonth(year: number, month: number): [number, number] {
  return month === 11 ? [year + 1, 0] : [year, month + 1];
}

type WipeInfo = {
  upcoming: Date; // the next wipe to count down to
  inWindow: boolean; // currently inside the post-wipe rollout window
};

function getWipeInfo(now: Date): WipeInfo {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const thisMonth = getWipeDate(year, month);

  if (now.getTime() >= thisMonth.getTime()) {
    const inWindow = now.getTime() - thisMonth.getTime() < WIPE_WINDOW_MS;
    const [ny, nm] = addMonth(year, month);
    return { upcoming: inWindow ? thisMonth : getWipeDate(ny, nm), inWindow };
  }

  return { upcoming: thisMonth, inWindow: false };
}

function getUpcomingWipes(from: Date, count: number): Date[] {
  let year = from.getUTCFullYear();
  let month = from.getUTCMonth();
  const wipes: Date[] = [];
  for (let i = 0; i < count; i++) {
    wipes.push(getWipeDate(year, month));
    [year, month] = addMonth(year, month);
  }
  return wipes;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date, now: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

// Format a Date as an iCalendar UTC timestamp: 20260604T180000Z
function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadWipeReminder(wipe: Date): void {
  const dtStart = toICSDate(wipe);
  const dtEnd = toICSDate(new Date(wipe.getTime() + 60 * 60 * 1000));
  const stamp = toICSDate(new Date());
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//norri3.com//Rust Force Wipe//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:rust-wipe-${dtStart}@norri3.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "SUMMARY:Rust Force Wipe",
    "DESCRIPTION:Monthly Rust force wipe - new map and blueprint reset.",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Rust force wipe in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rust-force-wipe-${dtStart.slice(0, 8)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type LatestUpdate = { title: string; url: string };

// One big countdown number with its label.
function Block({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-display tabular-nums font-bold leading-none text-4xl sm:text-6xl md:text-7xl text-[var(--primary)]"
        style={{ textShadow: "0 0 26px rgba(0,255,136,0.45)" }}
      >
        {value}
      </span>
      <span className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
        {label}
      </span>
    </div>
  );
}

export function ForceWipeCountdown() {
  const { t, locale } = useLang();

  // Render nothing time-specific until mounted, to avoid SSR/client mismatch.
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<WipeInfo | null>(null);
  const [left, setLeft] = useState<TimeLeft | null>(null);
  const [update, setUpdate] = useState<LatestUpdate | null>(null);

  useEffect(() => {
    setMounted(true);

    const tick = () => {
      const now = new Date();
      const wipeInfo = getWipeInfo(now);
      setInfo(wipeInfo);
      setLeft(getTimeLeft(wipeInfo.upcoming, now));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const inWindow = mounted && info?.inWindow === true;

  // While wiped, pull the latest Facepunch update title from our server route.
  useEffect(() => {
    if (!inWindow) {
      setUpdate(null);
      return;
    }
    let cancelled = false;
    fetch("/api/rust-update")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: LatestUpdate | { title: null } | null) => {
        if (!cancelled && d && d.title) {
          setUpdate({ title: d.title, url: (d as LatestUpdate).url });
        }
      })
      .catch(() => {
        /* degrade silently — banner still shows without a title */
      });
    return () => {
      cancelled = true;
    };
  }, [inWindow]);

  const localTarget =
    mounted && info
      ? info.upcoming.toLocaleString(locale, {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })
      : null;

  const upcoming = mounted && info ? getUpcomingWipes(info.upcoming, 5) : null;

  return (
    <section className="max-w-3xl mx-auto px-4">
      {/* Countdown card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--border)] px-5 py-10 md:px-10 md:py-12 text-center"
        style={{ background: "linear-gradient(to bottom, #0e1114, #0a0c0e)" }}
      >
        {/* Top accent line + soft glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--primary), transparent)",
            opacity: 0.6,
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 -top-24 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(0,255,136,0.10)" }}
        />

        <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          {t.nextWipe}
        </p>

        {inWindow ? (
          <div className="py-2">
            <h2
              className="font-display text-4xl md:text-6xl font-bold text-[var(--primary)] mb-3"
              style={{ textShadow: "0 0 30px rgba(0,255,136,0.5)" }}
            >
              {t.wiped}
            </h2>
            <p className="text-base md:text-lg text-[var(--foreground)]">
              {t.updating}
            </p>
            {update && (
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                {t.latestUpdate}{" "}
                <a
                  href={update.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] font-semibold hover:underline"
                >
                  {update.title}
                </a>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-center gap-4 sm:gap-7 md:gap-10">
              <Block value={left ? pad(left.days) : "--"} label={t.days} />
              <Block value={left ? pad(left.hours) : "--"} label={t.hrs} />
              <Block value={left ? pad(left.minutes) : "--"} label={t.min} />
              <Block value={left ? pad(left.seconds) : "--"} label={t.sec} />
            </div>

            <p className="mt-9 text-sm text-[var(--muted-foreground)]">
              {localTarget ? (
                <>
                  {t.wipeHits}{" "}
                  <span className="text-[var(--foreground)] font-semibold">
                    {localTarget}
                  </span>
                </>
              ) : (
                <>&nbsp;</>
              )}
            </p>
          </>
        )}
      </div>

      {/* Upcoming wipes — tap the calendar icon to download a reminder (.ics) */}
      <div className="mt-9">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-3 text-center">
          {t.upcomingWipes}
        </p>
        <ul className="rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
          {upcoming ? (
            upcoming.map((d, i) => {
              const isNext = i === 0 && !inWindow;
              return (
                <li
                  key={d.toISOString()}
                  className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5"
                  style={
                    isNext ? { background: "rgba(0,255,136,0.05)" } : undefined
                  }
                >
                  {/* Left: optional NEXT badge + date */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isNext && (
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-[var(--primary-foreground)] bg-[var(--primary)] rounded px-1.5 py-0.5">
                        {t.next}
                      </span>
                    )}
                    <span
                      className={`font-display font-semibold ${
                        isNext
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {d.toLocaleDateString(locale, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Right: time + calendar button, clearly separated */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="tabular-nums text-sm text-[var(--muted-foreground)]">
                      {d.toLocaleTimeString(locale, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadWipeReminder(d)}
                      aria-label={t.addToCalendar}
                      title={t.addToCalendar}
                      className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-5 py-3.5 text-sm text-[var(--muted-foreground)]"
              >
                <span>&mdash;</span>
                <span>&mdash;</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <p className="mt-6 text-xs text-center text-[var(--muted-foreground)] opacity-70">
        {t.schedule}
      </p>
    </section>
  );
}
