"use client";

import useSWRMutation from "swr/mutation";
import type { ContactFormValues } from "../lib/mail-schema";

type NewsletterPayload = { template: "newsletter"; email: string };
type ContactPayload = { template: "contact" } & ContactFormValues;
type MailArg = NewsletterPayload | ContactPayload;

async function sendRequest(url: string, { arg }: { arg: MailArg }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Erro ao enviar email");
  return res.json();
}

export function useMailer() {
  const { trigger, isMutating, error } = useSWRMutation("/api/mail", sendRequest);

  const sendNewsletter = (email: string) => trigger({ template: "newsletter", email });
  const sendContact = (data: ContactFormValues) => trigger({ template: "contact", ...data });

  return { sendNewsletter, sendContact, isLoading: isMutating, error };
}
