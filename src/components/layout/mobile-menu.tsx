"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

/**
 * Mobile navigation — the small-screen counterpart to the desktop nav,
 * which is hidden below `lg`. A hamburger opens a full-bleed cream
 * overlay with large editorial nav links.
 *
 * - Locks body scroll while open.
 * - Closes on Escape, on backdrop intent, and on any link tap.
 * - Moves focus to the close button on open, returns it to the
 *   trigger on close (keyboard users never get stranded).
 * - Entrance choreography is pure CSS transition; the global
 *   reduced-motion rule collapses it to an instant swap.
 */
export function MobileMenu({ navItems }: MobileMenuProps) {
  const t = useTranslations("common.menu");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close + focus management
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
      return;
    }
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-1 flex h-9 w-9 items-center justify-center text-ink-primary transition-colors duration-[--duration-fast] hover:text-terracotta"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 5.5h16M2 14.5h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={`fixed inset-0 z-[var(--z-cart)] flex flex-col bg-bg-cream transition-opacity duration-[--duration-moderate] ease-[--ease-out] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Top bar — mirrors the header so the close sits where the burger was */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4 md:px-10">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-ink-primary">
            <span className="text-terracotta">V</span>INKL
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="-mr-1 flex h-9 w-9 items-center justify-center text-ink-primary transition-colors duration-[--duration-fast] hover:text-terracotta"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links — large, editorial, staggered in */}
        <nav className="flex flex-1 flex-col justify-center gap-2 px-5 md:px-10" aria-label="Main">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
              className={`font-serif text-[clamp(2.25rem,9vw,3.25rem)] font-light leading-[1.1] tracking-tight text-ink-primary transition-[color,transform] duration-[--duration-moderate] ease-[--ease-out] hover:text-terracotta ${
                open ? "translate-y-0" : "translate-y-3"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer row — account + language */}
        <div className="flex items-center justify-between border-t border-border-default px-5 py-6 md:px-10">
          <Link
            href="/account/login"
            onClick={() => setOpen(false)}
            className="text-xs font-medium uppercase tracking-widest text-ink-secondary transition-colors duration-[--duration-fast] hover:text-terracotta"
          >
            {t("account")}
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
