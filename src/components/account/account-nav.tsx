"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  locale: string;
  userEmail: string;
}

export function AccountNav({ locale, userEmail }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const navItems = [
    { label: "Meine Bestellungen", href: `/${locale}/account/orders` },
    { label: "Profil", href: `/${locale}/account/profile` },
  ];

  return (
    <aside style={{ fontFamily: "monospace" }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 20, wordBreak: "break-all" }}>{userEmail}</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontSize: 12,
              textDecoration: "none",
              padding: "8px 12px",
              color: pathname === item.href ? "#1a1a1a" : "#666",
              backgroundColor: pathname === item.href ? "#fff" : "transparent",
              fontWeight: pathname === item.href ? "bold" : "normal",
            }}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          style={{ fontSize: 12, padding: "8px 12px", textAlign: "left", background: "none", border: "none", color: "#888", cursor: "pointer", fontFamily: "monospace", marginTop: 8 }}
        >
          Abmelden
        </button>
      </nav>
    </aside>
  );
}
