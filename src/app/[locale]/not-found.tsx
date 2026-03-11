import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="flex min-h-[60vh] flex-col items-start justify-center px-5 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
          404
        </p>
        <h1 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-ink-secondary">{t("description")}</p>
        <Link
          href="/"
          className="mt-8 inline-block border border-ink-primary px-6 py-3 text-xs font-medium uppercase tracking-widest text-ink-primary transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-ink-primary hover:text-ink-inverse"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
