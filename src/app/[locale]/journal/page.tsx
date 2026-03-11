import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JournalHero } from "@/components/journal/journal-hero";
import { JournalEntries } from "@/components/journal/journal-entries";
import { JournalClosing } from "@/components/journal/journal-closing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JournalHero />
      <JournalEntries />
      <JournalClosing />
    </>
  );
}
