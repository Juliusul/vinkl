import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";
import { MobileMenu } from "./mobile-menu";

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-border-default/70 bg-bg-cream/80 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-bg-cream/65">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="rounded-sm text-sm font-medium uppercase tracking-[0.2em] text-ink-primary transition-opacity duration-[--duration-fast] ease-[--ease-out] hover:opacity-70"
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

        {/* Right side: locale switcher + account + cart + mobile menu */}
        <div className="flex items-center gap-5 md:gap-6">
          <div className="hidden items-center gap-6 lg:flex">
            <LocaleSwitcher />
            <AccountButton />
          </div>
          <CartButton />
          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
