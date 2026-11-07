import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · IntelliForge AI",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-bold">
            IntelliForge AI
          </Link>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
            Admin
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
