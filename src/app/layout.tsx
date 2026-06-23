import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const isE2E = process.env.NEXT_PUBLIC_E2E_BYPASS === "1";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    url: "https://bootcamp.intelliforge.tech",
    siteName: "IntelliForge AI Bootcamp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliForge AI Bootcamp",
    description:
      "Build AI Agents. Ship AI Products. Own Your AI Future. 12-week intensive bootcamp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );

  if (isE2E) {
    return body;
  }

  return <ClerkProvider>{body}</ClerkProvider>;
}
