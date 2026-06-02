import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the service layer and the MailerSend client constructor.
vi.mock("../../lib/mail", () => ({ sendMail: vi.fn() }));
vi.mock("mailersend", () => ({ MailerSend: vi.fn().mockImplementation(function () { return {}; }) }));

import { sendMail } from "../../lib/mail";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/mail", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/mail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILERSEND_API_KEY = "key";
    process.env.MAILERSEND_NEWSLETTER_TEMPLATE_ID = "nl";
    process.env.MAILERSEND_CONTACT_TEMPLATE_ID = "ct";
  });
  afterEach(() => {
    delete process.env.MAILERSEND_API_KEY;
    delete process.env.MAILERSEND_NEWSLETTER_TEMPLATE_ID;
    delete process.env.MAILERSEND_CONTACT_TEMPLATE_ID;
  });

  it("returns 200 on a valid newsletter payload", async () => {
    (sendMail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("returns 400 on invalid body", async () => {
    const res = await POST(req({ template: "newsletter", email: "nope" }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when the API key is missing", async () => {
    delete process.env.MAILERSEND_API_KEY;
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when the service throws", async () => {
    (sendMail as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("boom"));
    const res = await POST(req({ template: "newsletter", email: "a@b.com" }));
    expect(res.status).toBe(500);
  });
});
