import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import { LeadAttribution } from "@/components/lead-attribution";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// OG image uses og-sprint.png; a dedicated og-bootcamp.png can be added later.
const ogImage = {
  url: "/og-sprint.png",
  width: 1200,
  height: 630,
  alt: "IntelliForge AI Bootcamp",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://upskill.intelliforge.tech"),
  manifest: "/site.webmanifest",
  title: "IntelliForge AI Bootcamp — Ship AI in the job you already have.",
  description:
    "Twelve weekends of live, build-first AI sprints for working engineers: chatbots, RAG, agents and your own product, deployed to production. Founder-taught by Girish. ₹4,999 per sprint.",
  keywords: [
    "AI bootcamp",
    "AI agents",
    "vibe coding",
    "verifiable credential",
    "build alongside",
    "LangChain",
    "LangGraph",
    "AI engineering",
    "IntelliForge",
    "Hyderabad",
    "India",
  ],
  authors: [{ name: "IntelliForge AI" }],
  openGraph: {
    title: "IntelliForge AI Bootcamp — Ship AI in the job you already have.",
    description:
      "Twelve weekends of live AI build sprints for working engineers. Founder-taught. ₹4,999 per sprint.",
    url: "https://upskill.intelliforge.tech",
    siteName: "IntelliForge AI Bootcamp",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliForge AI Bootcamp",
    description:
      "Twelve weekends of live AI build sprints for working engineers. You leave with AI running in production.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <LeadAttribution />
        <Script
          src="https://masterclass-first-agent.vercel.app/embed.js"
          strategy="afterInteractive"
          data-position="bottom-right"
        />
      </body>
    </html>
  );
}
