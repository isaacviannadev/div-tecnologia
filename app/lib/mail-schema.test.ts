import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  mailPayloadSchema,
  newsletterFormSchema,
} from "./mail-schema";

describe("newsletterFormSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterFormSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(newsletterFormSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  it("requires name, email, message; defaults company/services", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Ana",
      email: "a@b.com",
      message: "oi",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.company).toBe("");
      expect(parsed.data.services).toEqual([]);
    }
  });
  it("rejects empty name and bad email", () => {
    expect(
      contactFormSchema.safeParse({ name: "", email: "x", message: "" }).success,
    ).toBe(false);
  });
});

describe("mailPayloadSchema (discriminated by template)", () => {
  it("accepts a newsletter payload", () => {
    expect(
      mailPayloadSchema.safeParse({ template: "newsletter", email: "a@b.com" }).success,
    ).toBe(true);
  });
  it("accepts a contact payload", () => {
    expect(
      mailPayloadSchema.safeParse({
        template: "contact",
        name: "Ana",
        email: "a@b.com",
        company: "Div",
        services: ["Tokens"],
        message: "oi",
      }).success,
    ).toBe(true);
  });
  it("rejects an unknown template", () => {
    expect(mailPayloadSchema.safeParse({ template: "spam", email: "a@b.com" }).success).toBe(false);
  });
});
