import type { Metadata } from "next";
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
  title: "IntelliForge AI Bootcamp — Ship a Real Product. Earn a Verifiable Credential.",
  description:
    "The only AI cohort where top performers ship to a live IntelliForge repo, get mentor-scored, and leave with a recruiter-checkable credential. Founder-taught by Girish. Based in Hyderabad, India.",
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
    title: "IntelliForge AI Bootcamp — Ship a Real Product.",
    description:
      "Ship to a live repo. Get mentor-scored. Leave with a verifiable credential recruiters can check.",
    url: "https://upskill.intelliforge.tech",
    siteName: "IntelliForge AI Bootcamp",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliForge AI Bootcamp",
    description:
      "Don't build a portfolio project. Ship a real product. Verifiable credential with shipped-product link.",
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
      </body>
    </html>
  );
}
