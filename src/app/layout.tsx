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
  title: "IntelliForge AI Bootcamp — Build AI Agents. Ship AI Products.",
  description:
    "12-week intensive bootcamp to master AI Agent Development and Vibe Coding. Build, deploy & monetize production AI systems. From the team with 13+ years of Fortune 500 enterprise experience. Based in Hyderabad, India.",
  keywords: [
    "AI bootcamp",
    "AI agents",
    "vibe coding",
    "LangChain",
    "LangGraph",
    "CrewAI",
    "AI engineering",
    "multi-agent systems",
    "IntelliForge",
    "Hyderabad",
    "India",
  ],
  authors: [{ name: "IntelliForge AI" }],
  openGraph: {
    title: "IntelliForge AI Bootcamp — Build AI Agents. Ship AI Products.",
    description:
      "12-week intensive bootcamp. Master AI Agents + Vibe Coding. 13+ years Fortune 500 enterprise DNA.",
    url: "https://upskill.intelliforge.tech",
    siteName: "IntelliForge AI Bootcamp",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliForge AI Bootcamp",
    description:
      "Build AI Agents. Ship AI Products. Own Your AI Future. 12-week intensive bootcamp.",
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
