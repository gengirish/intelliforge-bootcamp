import { adminSignIn } from "./actions";

export function AdminSignIn({
  next,
  error,
  configured,
}: {
  next: string;
  error: boolean;
  configured: boolean;
}) {
  return (
    <main className="mx-auto flex max-w-sm flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Admin sign-in</h1>
      {!configured ? (
        <p className="mt-4 text-muted">
          <code>ADMIN_SECRET</code> is not set on this deployment, so admin
          pages are disabled.
        </p>
      ) : (
        <form action={adminSignIn} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="flex flex-col gap-2 text-sm font-medium">
            Admin secret
            <input
              type="password"
              name="secret"
              required
              autoComplete="current-password"
              className="rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-primary"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-500">
              That secret didn&apos;t match.
            </p>
          )}
          <button
            type="submit"
            className="rounded-lg bg-cta px-6 py-3 font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Sign in
          </button>
        </form>
      )}
    </main>
  );
}
