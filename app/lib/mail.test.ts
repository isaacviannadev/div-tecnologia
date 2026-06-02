import { describe, expect, it, vi } from "vitest";
import { buildContactMessage, sendMail, type MailClient } from "./mail";

const templates = { newsletter: "nl-tpl", contact: "ct-tpl" };

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

describe("sendMail", () => {
  function fakeClient() {
    const send = vi.fn().mockResolvedValue({});
    const client: MailClient = { email: { send } };
    return { client, send };
  }

  it("sends a newsletter email to the subscriber", async () => {
    const { client, send } = fakeClient();
    await sendMail(client, { template: "newsletter", email: "a@b.com" }, templates);
    expect(send).toHaveBeenCalledTimes(1);
    const params = send.mock.calls[0][0];
    expect(params.to[0].email).toBe("a@b.com");
    expect(params.template_id).toBe("nl-tpl");
  });

  it("sends a contact email to the DIV inbox with personalization including services", async () => {
    const { client, send } = fakeClient();
    await sendMail(
      client,
      {
        template: "contact",
        name: "Ana",
        email: "a@b.com",
        company: "Div",
        services: ["Tokens"],
        message: "oi",
      },
      templates,
    );
    const params = send.mock.calls[0][0];
    // notification goes to the DIV inbox on the verified domain
    expect(params.to[0].email).toBe("contato@divtecnologia.com.br");
    expect(params.personalization[0].email).toBe("contato@divtecnologia.com.br");
    expect(params.template_id).toBe("ct-tpl");
    const data = params.personalization[0].data;
    expect(data.email).toBe("a@b.com"); // submitter's email carried in the data
    expect(data.message).toContain("Serviços de interesse: Tokens");
    expect(data.services).toEqual(["Tokens"]);
  });

  it("propagates client send errors", async () => {
    const send = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(
      sendMail({ email: { send } }, { template: "newsletter", email: "a@b.com" }, templates),
    ).rejects.toThrow("boom");
  });
});
