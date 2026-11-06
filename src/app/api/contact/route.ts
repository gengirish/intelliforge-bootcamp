import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CONTACT_FORM_LIMITS } from "@/lib/constants";
import { sendEnquiryNotification } from "@/lib/email";

const REQUIRED = "Name, email, and message are required";

const schema = z.object({
  name: z
    .string()
    .min(1, REQUIRED)
    .max(CONTACT_FORM_LIMITS.name, "Name is too long"),
  email: z
    .string()
    .min(1, REQUIRED)
    .max(CONTACT_FORM_LIMITS.email, "Invalid email address")
    .email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(\+?[0-9 ().-]{7,20})?$/, "Invalid phone number"),
  message: z
    .string()
    .min(1, REQUIRED)
    .max(CONTACT_FORM_LIMITS.message, "Message is too long"),
});

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse({
      name: text(body?.name),
      email: text(body?.email),
      phone: text(body?.phone),
      message: text(body?.message),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;
    await sendEnquiryNotification({
      name,
      email,
      phone: phone || undefined,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
