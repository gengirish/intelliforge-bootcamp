import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { BootcampCheckoutButtonClerk } from "@/components/bootcamp/BootcampCheckoutButtonClerk";
import { BootcampCheckoutButtonStub } from "@/components/bootcamp/BootcampCheckoutButtonStub";

interface BootcampCheckoutButtonProps {
  plan?: "earlyBird";
  label?: string;
  className?: string;
}

function BootcampCheckoutButtonInner(props: BootcampCheckoutButtonProps) {
  const Component =
    process.env.NEXT_PUBLIC_E2E_BYPASS === "1"
      ? BootcampCheckoutButtonStub
      : BootcampCheckoutButtonClerk;
  return <Component {...props} />;
}

export function BootcampCheckoutButton(props: BootcampCheckoutButtonProps) {
  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return <BootcampCheckoutButtonInner {...props} />;
  }

  return (
    <ClerkProviderWrapper>
      <BootcampCheckoutButtonInner {...props} />
    </ClerkProviderWrapper>
  );
}
