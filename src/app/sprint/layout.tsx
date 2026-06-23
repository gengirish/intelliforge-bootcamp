import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";

export default function SprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProviderWrapper>{children}</ClerkProviderWrapper>;
}
