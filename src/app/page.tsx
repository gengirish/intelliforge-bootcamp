import dynamic from "next/dynamic";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { WhyIntelliForge } from "@/components/sections/why-intelliforge";
import { DualTrack } from "@/components/sections/dual-track";
import { Curriculum } from "@/components/sections/curriculum";
import { WhatsAppFAB } from "@/components/whatsapp-fab-lazy";

const CapstoneProducts = dynamic(() =>
  import("@/components/sections/capstone-products").then((m) => ({
    default: m.CapstoneProducts,
  }))
);
const Instructor = dynamic(() =>
  import("@/components/sections/instructor").then((m) => ({
    default: m.Instructor,
  }))
);
const WhoIsFor = dynamic(() =>
  import("@/components/sections/who-is-for").then((m) => ({
    default: m.WhoIsFor,
  }))
);
const FreePreview = dynamic(() =>
  import("@/components/sections/free-preview").then((m) => ({
    default: m.FreePreview,
  }))
);
const Outcomes = dynamic(() =>
  import("@/components/sections/outcomes").then((m) => ({
    default: m.Outcomes,
  }))
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => ({
    default: m.Testimonials,
  }))
);
const Pricing = dynamic(() =>
  import("@/components/sections/pricing").then((m) => ({
    default: m.Pricing,
  }))
);
const FAQ = dynamic(() =>
  import("@/components/sections/faq").then((m) => ({ default: m.FAQ }))
);
const FinalCTA = dynamic(() =>
  import("@/components/sections/final-cta").then((m) => ({
    default: m.FinalCTA,
  }))
);
const ContactForm = dynamic(() =>
  import("@/components/sections/contact-form").then((m) => ({
    default: m.ContactForm,
  }))
);
const Footer = dynamic(() =>
  import("@/components/sections/footer").then((m) => ({ default: m.Footer }))
);

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <AnnouncementBanner />
        <Header />
      </div>
      <main id="main-content">
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
      <StickyMobileCta />
    </>
  );
}
