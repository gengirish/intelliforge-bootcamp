import Link from "next/link";

export default async function SprintSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F1E] px-6">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          You&apos;re in, Cohort 1!
        </h1>
        <p className="text-slate-300 mb-8 text-lg leading-relaxed">
          Payment confirmed. Your seat in the 2-Week AI Sprint is reserved.
          Check WhatsApp — the cohort group link has been sent to your number.
        </p>

        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-6 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4">What happens next</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="text-green-400 font-bold flex-shrink-0">1.</span>
              Join the WhatsApp cohort group using the link below
            </li>
            <li className="flex gap-3">
              <span className="text-green-400 font-bold flex-shrink-0">2.</span>
              Session 1 is Sunday 29 June · 9:00 AM IST — Zoom link in WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="text-green-400 font-bold flex-shrink-0">3.</span>
              Pre-read: Anthropic Claude API docs + The Illustrated Transformer
            </li>
            <li className="flex gap-3">
              <span className="text-green-400 font-bold flex-shrink-0">4.</span>
              Your research docs (IF-RES-2026-012 + 013) will be shared in the
              group
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://upskill.intelliforge.tech/whatsapp"
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Join WhatsApp Cohort Group →
          </a>
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Go to your dashboard
          </Link>
        </div>

        {params.payment_id && (
          <p className="mt-6 text-xs text-slate-600">
            Payment ID: {params.payment_id}
          </p>
        )}
      </div>
    </main>
  );
}
