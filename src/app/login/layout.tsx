import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProviderWrapper>{children}</ClerkProviderWrapper>;
}
