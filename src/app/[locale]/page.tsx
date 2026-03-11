import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { FeaturedObjectSection } from "@/components/home/featured-object-section";
import { AdaptsSection } from "@/components/home/adapts-section";
import { AngleSection } from "@/components/home/angle-section";
import { MaterialSection } from "@/components/home/material-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* 1. The declaration */}
      <HeroSection />

      {/* 2. The why */}
      <PhilosophySection />

      {/* 3. The object */}
      <FeaturedObjectSection />

      {/* 4. The concept */}
      <AdaptsSection />

      {/* 5. The number */}
      <AngleSection />

      {/* 6. The material */}
      <MaterialSection />
    </>
  );
}
