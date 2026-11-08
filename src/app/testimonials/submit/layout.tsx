import type { Metadata } from "next";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";

export const metadata: Metadata = {
  title: "Share your testimonial · IntelliForge AI",
  robots: { index: false, follow: false },
};

export default function SubmitTestimonialLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProviderWrapper>{children}</ClerkProviderWrapper>;
}
