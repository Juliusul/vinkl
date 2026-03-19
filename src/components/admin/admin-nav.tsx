"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  locale: string;
  active: "orders" | "customers" | "templates";
  userEmail: string;
}

export function AdminNav({ locale, active, userEmail }: Props) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  const navItems = [
    { key: "orders", label: "Bestellungen", href: `/${locale}/admin` },
    { key: "customers", label: "Kunden", href: `/${locale}/admin/customers` },
    { key: "templates", label: "Templates", href: `/${locale}/admin/templates` },
  ];

  return (
    <nav style={{
      backgroundColor: "#1a1a1a",
      color: "#fff",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: 13, letterSpacing: 2, marginRight: 32, color: "#aaa" }}>VINKL ADMIN</span>
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            style={{
              color: active === item.key ? "#fff" : "#888",
              textDecoration: "none",
              fontSize: 11,
              letterSpacing: 1,
              padding: "0 16px",
              height: 48,
              display: "flex",
              alignItems: "center",
              borderBottom: active === item.key ? "2px solid #fff" : "2px solid transparent",
            }}
          >
            {item.label.toUpperCase()}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 11, color: "#888" }}>{userEmail}</span>
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "1px solid #444",
            color: "#aaa",
            padding: "4px 10px",
            fontSize: 10,
            letterSpacing: 1,
            cursor: "pointer",
            fontFamily: "monospace",
          }}
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}
