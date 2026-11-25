import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata: Metadata = {
  title: "Contact · IntelliForge AI Bootcamp",
  description: "Questions about the IntelliForge AI Bootcamp? Send us a message.",
};

export default function ContactPage() {
  return (
    <>
      <header className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          IntelliForge AI Bootcamp
        </Link>
      </header>
      <main id="main-content">
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
