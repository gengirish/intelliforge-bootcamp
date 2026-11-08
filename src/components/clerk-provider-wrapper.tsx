import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

/**
 * Clerk's defaults are a light theme: colorNeutral is black, so anything we
 * don't colour ourselves (social buttons, the "or" divider, footer, borders)
 * renders black-on-navy. The dark base theme fixes that for every Clerk
 * component; the variables below only map it onto the site palette in
 * globals.css (--primary, --surface, --surface-light, --foreground, --muted).
 *
 * Contrast on the #111827 card: foreground 14:1, muted 6.9:1, danger 6.2:1,
 * white on the purple button 5.7:1. Purple text would only be 3.1:1, so text
 * links use --primary-light (6.5:1) instead.
 */
const LINK = { color: "#A78BFA" };

const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "#7C3AED",
    // dark's primary is white with black text; ours is purple, so flip it back.
    colorPrimaryForeground: "#FFFFFF",
    colorBackground: "#111827",
    colorInput: "#1E293B",
    colorForeground: "#E2E8F0",
    colorInputForeground: "#E2E8F0",
    colorMutedForeground: "#94A3B8",
    colorDanger: "#F87171",
  },
  elements: {
    footerActionLink: LINK,
    formFieldAction: LINK,
    formResendCodeLink: LINK,
    identityPreviewEditButton: LINK,
  },
};

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return children;
  }

  return <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>;
}
