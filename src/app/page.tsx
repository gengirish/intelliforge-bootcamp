import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { WhyIntelliForge } from "@/components/sections/why-intelliforge";
import { DualTrack } from "@/components/sections/dual-track";
import { Curriculum } from "@/components/sections/curriculum";
import { CapstoneProducts } from "@/components/sections/capstone-products";
import { Instructor } from "@/components/sections/instructor";
import { WhoIsFor } from "@/components/sections/who-is-for";
import { Outcomes } from "@/components/sections/outcomes";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <WhyIntelliForge />
        <DualTrack />
        <Curriculum />
        <CapstoneProducts />
        <Instructor />
        <WhoIsFor />
        <Outcomes />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
