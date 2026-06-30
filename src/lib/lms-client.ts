const MAX_RETRIES = 3;
const BACKOFF_MS = [200, 400, 800];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function enrollLearnerOnLms({
  email,
  courseSlug,
}: {
  email: string;
  courseSlug: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const baseUrl = process.env.LMS_API_URL;
  const apiKey = process.env.LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    return { ok: false, error: "LMS API not configured" };
  }

  let lastError = "Unknown error";

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/api/v1/enrollments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, course_slug: courseSlug }),
      });

      if (res.ok) {
        return { ok: true };
      }

      const body = await res.text().catch(() => res.statusText);
      lastError = `HTTP ${res.status}: ${body}`;

      if (res.status >= 500 && attempt < MAX_RETRIES - 1) {
        await sleep(BACKOFF_MS[attempt] ?? 800);
        continue;
      }

      return { ok: false, error: lastError };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES - 1) {
        await sleep(BACKOFF_MS[attempt] ?? 800);
        continue;
      }
    }
  }

  return { ok: false, error: lastError };
}

export async function enrollLearnerOnAllCourses(
  email: string,
  slugs: string[]
): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  const errors: string[] = [];

  for (const courseSlug of slugs) {
    const result = await enrollLearnerOnLms({ email, courseSlug });
    if (!result.ok) {
      errors.push(`${courseSlug}: ${result.error}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
