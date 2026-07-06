import { Check, Minus } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { COMPARISON_ROWS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-accent" aria-label="Yes" />
    ) : (
      <Minus className="mx-auto h-5 w-5 text-muted" aria-label="No" />
    );
  }
  return <span className="text-sm text-muted">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section
      id="comparison"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="comparison-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="comparison-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            How We Compare
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Substance over hype. Here&apos;s what you actually get.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-light">
                  <th
                    scope="col"
                    className="px-4 py-4 text-sm font-medium text-muted sm:px-6"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-sm font-semibold text-accent sm:px-6"
                  >
                    IntelliForge AI Bootcamp
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-sm font-medium text-muted sm:px-6"
                  >
                    Recorded AI courses
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-sm font-medium text-muted sm:px-6"
                  >
                    University AI certificates
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      index % 2 === 0 ? "bg-surface" : "bg-surface-light/50"
                    )}
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 text-sm font-medium text-foreground sm:px-6"
                    >
                      {row.feature}
                    </th>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CellValue value={row.intelliforge} />
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CellValue value={row.recorded} />
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CellValue value={row.university} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
