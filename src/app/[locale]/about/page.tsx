import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/about-hero";
import { AboutOrigin } from "@/components/about/about-origin";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutArchitecture } from "@/components/about/about-architecture";
import { AboutVision } from "@/components/about/about-vision";
import { AboutManifesto } from "@/components/about/about-manifesto";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <AboutOrigin />
      <AboutPhilosophy />
      <AboutArchitecture />
      <AboutVision />
      <AboutManifesto />
    </>
  );
}
