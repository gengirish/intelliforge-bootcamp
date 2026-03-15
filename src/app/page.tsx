import { AnnouncementBanner } from "@/components/announcement-banner";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { WhyIntelliForge } from "@/components/sections/why-intelliforge";
import { DualTrack } from "@/components/sections/dual-track";
import { Curriculum } from "@/components/sections/curriculum";
import { CapstoneProducts } from "@/components/sections/capstone-products";
import { Instructor } from "@/components/sections/instructor";
import { WhoIsFor } from "@/components/sections/who-is-for";
import { FreePreview } from "@/components/sections/free-preview";
import { Outcomes } from "@/components/sections/outcomes";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/sections/footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <AnnouncementBanner />
        <Header />
      </div>
      <main>
        <Hero />
        <StatsBar />
        <WhyIntelliForge />
        <DualTrack />
        <Curriculum />
        <CapstoneProducts />
        <Instructor />
        <WhoIsFor />
        <FreePreview />
        <Outcomes />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
