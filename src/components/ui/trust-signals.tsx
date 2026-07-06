import {
  Award,
  Building2,
  Clock,
  CreditCard,
  GitBranch,
  GraduationCap,
  Lock,
  Shield,
  ShieldCheck,
  User,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Award,
  Building2,
  Clock,
  CreditCard,
  GitBranch,
  GraduationCap,
  Lock,
  Shield,
  ShieldCheck,
  User,
  Users,
  Video,
} as const;

export type TrustSignalIcon = keyof typeof ICON_MAP;

export type TrustSignal = {
  icon: TrustSignalIcon;
  label: string;
};

interface TrustSignalsProps {
  signals: readonly TrustSignal[];
  variant?: "badges" | "inline";
  className?: string;
}

function TrustIcon({ icon, className }: { icon: TrustSignalIcon; className?: string }) {
  const Icon = ICON_MAP[icon] as LucideIcon;
  return <Icon className={className} aria-hidden />;
}

export function TrustSignals({
  signals,
  variant = "inline",
  className,
}: TrustSignalsProps) {
  if (variant === "badges") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
          className
        )}
      >
        {signals.map((signal) => (
          <span
            key={signal.label}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-muted sm:text-sm"
          >
            <TrustIcon icon={signal.icon} className="h-3.5 w-3.5 shrink-0 text-accent" />
            {signal.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted sm:gap-x-6",
        className
      )}
    >
      {signals.map((signal, index) => (
        <span key={signal.label} className="contents">
          {index > 0 && (
            <span className="hidden text-border sm:inline" aria-hidden>
              ·
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <TrustIcon icon={signal.icon} className="h-4 w-4 shrink-0 text-accent/80" />
            {signal.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function CtaMicroTrust({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted sm:text-sm", className)}>
      {text}
    </p>
  );
}
