import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  return (
    <header className="border-b border-border-default">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-[0.2em] text-ink-primary"
        >
          <span className="text-terracotta">V</span>INKL
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-widest text-ink-secondary transition-colors duration-[--duration-fast] hover:text-terracotta"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: locale switcher + account + cart */}
        <div className="flex items-center gap-6">
          <LocaleSwitcher />
          <AccountButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
