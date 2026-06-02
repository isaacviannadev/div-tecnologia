"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { feedback, footer, nav } from "../content";
import { useMailer } from "../hooks/useMailer";
import { useLang } from "../lang-context";
import { newsletterFormSchema, type NewsletterFormValues } from "../lib/mail-schema";
import { Logo } from "./Logo";

/* variant="full" renders the four-column top (home / serviços / sobre).
   variant="minimal" is just the wordmark + baseline row (contato). */
export function Footer({ variant = "full" }: { variant?: "full" | "minimal" }) {
  const { t } = useLang();
  const { sendNewsletter, isLoading } = useMailer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterFormSchema) });

  const onNewsletter = handleSubmit(async ({ email }) => {
    try {
      await sendNewsletter(email);
      toast.success(t(feedback.newsletterSuccess));
      reset();
    } catch {
      toast.error(t(feedback.newsletterError));
    }
  });

  return (
    <footer className="foot">
      <div className="wrap">
        {variant === "full" && (
          <div className="foot-top">
            <div>
              <h5>{t(footer.offices)}</h5>
              <ul>
                <li>
                  <p>
                    <b style={{ color: "var(--fg)" }}>Brasil</b>
                    <br />
                    R. Diogo Camarão, 18
                    <br />
                    Duque de Caxias · Rio de Janeiro
                  </p>
                </li>
                <li style={{ marginTop: 14 }}>
                  <p>
                    <b style={{ color: "var(--fg)" }}>Portugal</b>
                    <br />
                    R. dos Vinagres, 27
                    <br />
                    Pombal · Leiria
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h5>{t(footer.studio)}</h5>
              <ul>
                {nav.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{t(l.label)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5>{t(footer.connect)}</h5>
              <ul>
                <li>
                  <a
                    href="https://github.com/CodeTheApp"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/div-tecnologia"
                    target="_blank"
                    rel="noopener"
                  >
                    LinkedIn ↗
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5>{footer.newsletter}</h5>
              <p>{t(footer.newsletterNote)}</p>
              <form className="news" onSubmit={onNewsletter} noValidate>
                <input
                  type="email"
                  autoComplete="email"
                  aria-label={t(footer.emailPlaceholder)}
                  placeholder={t(footer.emailPlaceholder)}
                  {...register("email")}
                />
                <button type="submit" aria-label="Subscribe" disabled={isLoading}>
                  {isLoading ? "…" : "↗"}
                </button>
              </form>
              {errors.email && (
                <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6 }}>
                  {t(feedback.invalidEmail)}
                </p>
              )}
            </div>
          </div>
        )}
        <div
          className="foot-word"
          style={variant === "minimal" ? { borderTop: "1px solid var(--line)" } : undefined}
        >
          <Logo className="logo-xl" />
          <span className="reg">© 2026 · DIV TECNOLOGIA LTDA</span>
        </div>
        <div className="foot-bot">
          <span>{t(footer.tagline)}</span>
          <span>RJ · BR / Leiria · PT</span>
        </div>
      </div>
    </footer>
  );
}
