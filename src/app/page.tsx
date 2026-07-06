import dynamic from "next/dynamic";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { BuildAlongside } from "@/components/sections/build-alongside";
import { VerifiableCredential } from "@/components/sections/verifiable-credential";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { Curriculum } from "@/components/sections/curriculum";
import { WhatsAppFAB } from "@/components/whatsapp-fab-lazy";

const WhosBehind = dynamic(() =>
  import("@/components/sections/whos-behind").then((m) => ({
    default: m.WhosBehind,
  }))
);
const CohortOutcomes = dynamic(() =>
  import("@/components/sections/cohort-outcomes").then((m) => ({
    default: m.CohortOutcomes,
  }))
);
const FreePreview = dynamic(() =>
  import("@/components/sections/free-preview").then((m) => ({
    default: m.FreePreview,
  }))
);
const FunnelLoop = dynamic(() =>
  import("@/components/sections/funnel-loop").then((m) => ({
    default: m.FunnelLoop,
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
        <BuildAlongside />
        <VerifiableCredential />
        <ComparisonTable />
        <Curriculum />
        <WhosBehind />
        <CohortOutcomes />
        <FreePreview />
        <FunnelLoop />
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
