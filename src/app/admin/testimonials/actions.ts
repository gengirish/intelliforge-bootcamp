"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { TESTIMONIAL_LIMITS } from "@/lib/testimonials";
import { isTestimonialMediaConfigured } from "@/lib/testimonials-server";

async function requireAdmin() {
  if (!(await isAdminSession())) throw new Error("Not signed in as admin.");
}

function idFrom(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) throw new Error("Missing testimonial id.");
  return id;
}

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
}

export async function setTestimonialStatus(form: FormData): Promise<void> {
  await requireAdmin();
  const status = String(form.get("status"));
  if (status !== "APPROVED" && status !== "REJECTED" && status !== "PENDING") {
    throw new Error("Invalid status.");
  }
  await prisma.testimonial.update({
    where: { id: idFrom(form) },
    data: {
      status,
      reviewedAt: status === "PENDING" ? null : new Date(),
      ...(status !== "APPROVED" ? { featured: false } : {}),
    },
  });
  refreshPublicPages();
}

export async function toggleTestimonialFeatured(form: FormData): Promise<void> {
  await requireAdmin();
  const id = idFrom(form);
  const row = await prisma.testimonial.findUniqueOrThrow({ where: { id }, select: { featured: true, status: true } });
  await prisma.testimonial.update({
    where: { id },
    data: { featured: row.status === "APPROVED" ? !row.featured : false },
  });
  refreshPublicPages();
}

export async function saveTestimonialTranscript(form: FormData): Promise<void> {
  await requireAdmin();
  const transcript = String(form.get("transcript") ?? "").trim().slice(0, TESTIMONIAL_LIMITS.transcriptMax);
  await prisma.testimonial.update({
    where: { id: idFrom(form) },
    data: { transcript: transcript || null },
  });
  refreshPublicPages();
}

/** Removes the row and its recording, e.g. when a learner withdraws consent. */
export async function deleteTestimonial(form: FormData): Promise<void> {
  await requireAdmin();
  const id = idFrom(form);
  const row = await prisma.testimonial.delete({ where: { id }, select: { mediaUrl: true } });
  if (row.mediaUrl && isTestimonialMediaConfigured()) {
    await del(row.mediaUrl).catch((err) => console.error("[Testimonials] Failed to delete media:", err));
  }
  refreshPublicPages();
}
