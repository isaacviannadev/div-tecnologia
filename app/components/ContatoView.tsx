"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { contactPage as c, feedback } from "../content";
import { useMailer } from "../hooks/useMailer";
import { useLang } from "../lang-context";
import { contactFormSchema, type ContactFormValues } from "../lib/mail-schema";
import { Footer } from "./Footer";
import { RisingLines } from "./RisingLines";

// RHF input type: optional fields not yet transformed by zod defaults.
type ContactFormInput = z.input<typeof contactFormSchema>;

export function ContatoView() {
  const { t, lang } = useLang();
  const { sendContact, isLoading } = useMailer();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", company: "", services: [], message: "" },
  });
  const services = watch("services") ?? [];

  const toggleChip = (label: string) => {
    const current = getValues("services") ?? [];
    const next = current.includes(label)
      ? current.filter((s) => s !== label)
      : [...current, label];
    setValue("services", next, { shouldValidate: false });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendContact(data);
      toast.success(t(feedback.contactSuccess));
      reset();
    } catch {
      toast.error(t(feedback.contactError));
    }
  });

  return (
    <>
      <header className="phero" style={{ paddingBottom: "clamp(32px,5vh,56px)" }}>
        <div className="wrap">
          <span className="kicker">{t(c.kicker)}</span>
          <h1 className="display">
            <RisingLines lines={c.titleLines[lang]} />
          </h1>
          <p className="lead">{t(c.lead)}</p>
        </div>
      </header>

      <section className="sec" style={{ paddingTop: "clamp(32px,5vh,56px)" }}>
        <div className="wrap">
          <div className="contact-grid">
            <form className="reveal" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="ct-name">{t(c.form.name)}</label>
                <input id="ct-name" type="text" autoComplete="name" placeholder={t(c.form.namePlaceholder)} {...register("name")} />
                {errors.name && <p style={{ color: "#ff6b6b", fontSize: 12 }}>{t(feedback.required)}</p>}
              </div>
              <div className="field">
                <label htmlFor="ct-company">{t(c.form.company)}</label>
                <input id="ct-company" type="text" autoComplete="organization" placeholder={t(c.form.companyPlaceholder)} {...register("company")} />
              </div>
              <div className="field">
                <label htmlFor="ct-email">{t(c.form.email)}</label>
                <input id="ct-email" type="email" autoComplete="email" placeholder={t(c.form.emailPlaceholder)} {...register("email")} />
                {errors.email && <p style={{ color: "#ff6b6b", fontSize: 12 }}>{t(feedback.invalidEmail)}</p>}
              </div>
              <div className="field">
                <label>{t(c.form.help)}</label>
                <div className="chips">
                  {c.form.chips.map((chip, i) => {
                    const label = t(chip);
                    const on = services.includes(label);
                    return (
                      <span key={i} className={on ? "chip on" : "chip"}
                        onClick={() => toggleChip(label)}>
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <label htmlFor="ct-more">{t(c.form.more)}</label>
                <textarea id="ct-more" placeholder={t(c.form.morePlaceholder)} {...register("message")} />
                {errors.message && <p style={{ color: "#ff6b6b", fontSize: 12 }}>{t(feedback.required)}</p>}
              </div>
              <button
                type="submit"
                className="btn"
                data-magnet
                disabled={isLoading}
                style={{ marginTop: 8 }}
              >
                <span>{isLoading ? t(feedback.sending) : t(c.form.submit)}</span>
                <span className="arw">↗</span>
              </button>
            </form>

            <aside className="contact-aside reveal" data-d="2">
              <h5>{t(c.aside.emailDirect)}</h5>
              <a href="mailto:hello@divtecnologia.com.br" className="big-mail">
                hello@divtecnologia.com.br
              </a>

              <h5>{t(c.aside.offices)}</h5>
              <p>
                <b style={{ color: "var(--fg)" }}>Brasil</b>
                <br />
                R. Diogo Camarão, 18 — Duque de Caxias
                <br />
                Rio de Janeiro
              </p>
              <p style={{ marginTop: 14 }}>
                <b style={{ color: "var(--fg)" }}>Portugal</b>
                <br />
                R. dos Vinagres, 27 — Pombal
                <br />
                Leiria
              </p>

              <h5>{t(c.aside.connect)}</h5>
              <a href="https://github.com/CodeTheApp" target="_blank" rel="noopener">
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/company/div-tecnologia"
                target="_blank"
                rel="noopener"
              >
                LinkedIn ↗
              </a>

              <h5>{t(c.aside.responseTime)}</h5>
              <p>{t(c.aside.responseNote)}</p>
            </aside>
          </div>
        </div>
      </section>

      <Footer variant="minimal" />
    </>
  );
}
