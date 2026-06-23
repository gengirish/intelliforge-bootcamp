import { test, expect } from "@playwright/test";

const WHATSAPP_GROUP_INVITE_URL =
  "https://chat.whatsapp.com/LwxMCJ1EqLm4oLOG0fLqmE";
const ZOOM_MEETING_JOIN_URL =
  "https://us06web.zoom.us/j/86071939853?pwd=VovRc9JnO1qDKxqK9L3JNJ3cp3KwCB.1";

test.describe("Global Redirects", () => {
  test("GET /whatsapp redirects to WhatsApp group invite", async ({
    request,
  }) => {
    const response = await request.get("/whatsapp", { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe(WHATSAPP_GROUP_INVITE_URL);
  });

  test("GET /zoom redirects to Zoom meeting", async ({ request }) => {
    const response = await request.get("/zoom", { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe(ZOOM_MEETING_JOIN_URL);
  });
});
