"use server";

import { redirect } from "next/navigation";
import {
  endAdminSession,
  isValidAdminSecret,
  startAdminSession,
} from "@/lib/admin-session";

export async function adminSignIn(formData: FormData): Promise<void> {
  const secret = String(formData.get("secret") ?? "");
  const next = String(formData.get("next") ?? "/admin/waitlist");
  const target = next.startsWith("/admin") ? next : "/admin/waitlist";

  if (!isValidAdminSecret(secret)) {
    redirect(`${target}?error=1`);
  }
  await startAdminSession();
  redirect(target);
}

export async function adminSignOut(): Promise<void> {
  await endAdminSession();
  redirect("/admin/waitlist");
}
