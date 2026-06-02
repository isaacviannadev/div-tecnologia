import { z } from "zod";

/** Client-side form schemas (no `template` discriminator). */
export const newsletterFormSchema = z.object({
  email: z.email(),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  company: z.string().trim().optional().default(""),
  services: z.array(z.string()).optional().default([]),
  message: z.string().trim().min(1),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Server payload: form fields + the `template` discriminator. */
export const mailPayloadSchema = z.discriminatedUnion("template", [
  z.object({ template: z.literal("newsletter") }).merge(newsletterFormSchema),
  z.object({ template: z.literal("contact") }).merge(contactFormSchema),
]);

export type MailPayload = z.infer<typeof mailPayloadSchema>;
