"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "zh";

type Dict = {
  tracker: string;
  welcome: string; // prefix before the "norri3.com" wordmark
  tagline: string;
  nextWipe: string;
  days: string;
  hrs: string;
  min: string;
  sec: string;
  wipeHits: string; // followed by the formatted date
  wiped: string;
  updating: string;
  latestUpdate: string;
  upcomingWipes: string;
  next: string;
  addToCalendar: string;
  schedule: string;
  builtWith: string;
};

const translations: Record<Lang, Dict> = {
  en: {
    tracker: "Rust Wipe Tracker",
    welcome: "Welcome to",
    tagline:
      "A live countdown to the next Rust force wipe — with upcoming dates and one-tap calendar reminders.",
    nextWipe: "Next Rust Force Wipe",
    days: "Days",
    hrs: "Hrs",
    min: "Min",
    sec: "Sec",
    wipeHits: "Wipe hits",
    wiped: "WIPED",
    updating: "Servers are updating — fresh map incoming. Refresh in a bit.",
    latestUpdate: "Latest update:",
    upcomingWipes: "Upcoming Wipes",
    next: "Next",
    addToCalendar: "Add to calendar",
    schedule: "First Thursday of every month · 7:00 PM UK time",
    builtWith: "norri3.com · built with Next.js",
  },
  zh: {
    tracker: "Rust 清檔追蹤器",
    welcome: "歡迎來到",
    tagline:
      "即時倒數下一次 Rust 強制清檔 — 附上未來日期與一鍵行事曆提醒。",
    nextWipe: "下一次 Rust 強制清檔",
    days: "天",
    hrs: "時",
    min: "分",
    sec: "秒",
    wipeHits: "清檔時間：",
    wiped: "已清檔",
    updating: "伺服器更新中 — 新地圖即將上線，請稍後重新整理。",
    latestUpdate: "最新更新：",
    upcomingWipes: "未來清檔時間",
    next: "下次",
    addToCalendar: "加入行事曆",
    schedule: "每月第一個星期四 · 英國時間晚上 7:00",
    builtWith: "norri3.com · 使用 Next.js 建置",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  locale: string; // for Intl date/time formatting
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English on the server and first client render (avoids hydration
  // mismatch); a stored choice or a Chinese browser is applied after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang");
      if (stored === "en" || stored === "zh") {
        setLangState(stored);
        return;
      }
    } catch {
      /* localStorage unavailable — fall through to language detection */
    }
    if (
      typeof navigator !== "undefined" &&
      navigator.language.toLowerCase().startsWith("zh")
    ) {
      setLangState("zh");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
  };

  const value: Ctx = {
    lang,
    setLang,
    t: translations[lang],
    locale: lang === "zh" ? "zh-TW" : "en",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  const base =
    "px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer";
  const active = "bg-[var(--primary)] text-[var(--primary-foreground)]";
  const inactive = "text-[var(--muted-foreground)] hover:text-[var(--foreground)]";

  return (
    <div className="flex items-center rounded-full border border-[var(--border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? active : inactive}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("zh")}
        className={`${base} ${lang === "zh" ? active : inactive}`}
        aria-pressed={lang === "zh"}
      >
        中文
      </button>
    </div>
  );
}
