"use client";

import { useEffect, useState, type MouseEvent } from "react";
import styles from "./news.module.css";

const TABS = [
  { id: "local", label: "Local News" },
  { id: "global", label: "Global News" },
] as const;

// Two-option switcher at the top of /news. Local stays first on the page;
// the tabs jump between the sections and follow the scroll position.
export default function NewsTabs() {
  const [active, setActive] = useState<string>("local");

  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current: string = TABS[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className={styles.tabsBar}>
      <div className="wrap">
        <nav className={styles.tabs} aria-label="News sections">
          {TABS.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              onClick={(e) => go(e, t.id)}
              className={`${styles.tab} ${active === t.id ? styles.tabActive : ""}`}
              aria-current={active === t.id ? "true" : undefined}
            >
              {t.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
