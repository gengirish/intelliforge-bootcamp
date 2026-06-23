import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return children;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
