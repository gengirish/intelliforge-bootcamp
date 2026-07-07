import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";

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
  title: "IntelliForge AI Bootcamp — Ship Proof Before Your Interview.",
  description:
    "Interview in weeks, not months? Ship two live AI products in 14 days and earn a recruiter-checkable credential. Founder-taught by Girish. Based in Hyderabad, India.",
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
    title: "IntelliForge AI Bootcamp — Ship Proof Before Your Interview.",
    description:
      "Two live deploy URLs in 14 days. Recruiter-checkable credential. Founder-taught sprint and bootcamp.",
    url: "https://upskill.intelliforge.tech",
    siteName: "IntelliForge AI Bootcamp",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliForge AI Bootcamp",
    description:
      "Don't show up with tutorials. Ship proof they can click — two live deploy URLs in 14 days plus a verifiable credential.",
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
        <Script
          src="https://masterclass-first-agent.vercel.app/embed.js"
          strategy="afterInteractive"
          data-position="bottom-right"
        />
      </body>
    </html>
  );
}
