"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AccountButton() {
  const locale = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const href = isLoggedIn ? `/${locale}/account/orders` : `/${locale}/account/login`;

  return (
    <Link
      href={href}
      aria-label="Konto"
      className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink-secondary transition-colors duration-[--duration-fast] hover:text-terracotta"
    >
      {/* Person icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <span className="hidden sm:inline">Konto</span>
    </Link>
  );
}
