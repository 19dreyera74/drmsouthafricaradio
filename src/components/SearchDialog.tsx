"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { SearchResult } from "@/lib/search";
import styles from "./SearchDialog.module.css";

type Props = { open: boolean; onClose: () => void };

export default function SearchDialog({ open, onClose }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Search as the visitor types, waiting for a short pause.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = await res.json();
        setResults(data.results || []);
        setActive(0);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const close = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      router.push(results[active].href);
      close();
    }
  };

  const q = query.trim();

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Search the site"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className={styles.panel}>
        <div className={styles.inputRow}>
          <SearchIcon className={styles.inputIcon} />
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="Search news, DRM, membership…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Search"
            autoComplete="off"
          />
          <button type="button" className={styles.close} onClick={close} aria-label="Close search">
            &times;
          </button>
        </div>

        <div className={styles.results} aria-live="polite">
          {q.length < 2 ? (
            <p className={styles.hint}>Type at least two letters to search the site.</p>
          ) : loading && !results.length ? (
            <p className={styles.hint}>Searching…</p>
          ) : !results.length ? (
            <p className={styles.hint}>No results for “{q}”.</p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className={`${styles.result} ${i === active ? styles.resultActive : ""}`}
                    onClick={close}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className={styles.kind}>
                      {r.kind}
                      {r.date && ` · ${new Date(r.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`}
                    </span>
                    <span className={styles.title}>{r.title}</span>
                    <span className={styles.snippet}>{r.snippet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
