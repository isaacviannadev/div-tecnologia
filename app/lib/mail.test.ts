import { describe, expect, it, vi } from "vitest";
import { buildContactMessage, sendMail, type MailClient } from "./mail";

function fakeClient(error: unknown = null) {
  const send = vi.fn().mockResolvedValue({ data: { id: "email_1" }, error });
  const client: MailClient = { emails: { send } };
  return { client, send };
}

describe("buildContactMessage", () => {
  it("returns the message unchanged with no services", () => {
    expect(buildContactMessage("oi", [])).toBe("oi");
  });
  it("appends selected services", () => {
    expect(buildContactMessage("oi", ["Tokens", "Performance"])).toBe(
      "oi\n\nServiços de interesse: Tokens, Performance",
    );
  });
});

describe("sendMail (Resend)", () => {
  it("sends a newsletter to the subscriber from the verified domain", async () => {
    const { client, send } = fakeClient();
    await sendMail(client, { template: "newsletter", email: "a@b.com" });
    expect(send).toHaveBeenCalledTimes(1);
    const opts = send.mock.calls[0][0];
    expect(opts.to).toBe("a@b.com");
    expect(opts.from).toContain("contato@divtecnologia.com.br");
    expect(opts.subject).toMatch(/newsletter/i);
    expect(opts.html).toBeTruthy();
  });

  it("sends a contact notification to the DIV inbox with reply-to + escaped data", async () => {
    const { client, send } = fakeClient();
    await sendMail(client, {
      template: "contact",
      name: "Ana",
      email: "ana@b.com",
      company: "Div",
      services: ["Tokens"],
      message: "olá <script>",
    });
    const opts = send.mock.calls[0][0];
    expect(opts.to).toBe("contato@divtecnologia.com.br");
    expect(opts.replyTo).toBe("ana@b.com");
    expect(opts.subject).toContain("Ana");
    expect(opts.html).toContain("Serviços de interesse: Tokens");
    expect(opts.html).toContain("&lt;script&gt;"); // user input escaped
    expect(opts.html).not.toContain("<script>");
  });

  it("throws when Resend returns an error", async () => {
    const { client } = fakeClient({ message: "domain not verified", name: "validation_error" });
    await expect(
      sendMail(client, { template: "newsletter", email: "a@b.com" }),
    ).rejects.toThrow("domain not verified");
  });
});
