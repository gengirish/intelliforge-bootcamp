import { SprintCheckoutButtonClerk } from "@/components/sprint/SprintCheckoutButtonClerk";
import { SprintCheckoutButtonStub } from "@/components/sprint/SprintCheckoutButtonStub";

export const SprintCheckoutButton =
  process.env.NEXT_PUBLIC_E2E_BYPASS === "1"
    ? SprintCheckoutButtonStub
    : SprintCheckoutButtonClerk;
