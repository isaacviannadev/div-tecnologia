"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "../content";
import { useLang } from "../lang-context";
import { useTheme } from "../theme-context";
import { Logo } from "./Logo";

export function Nav() {
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Re-evaluate on scroll and on route change (client nav resets scroll to top
  // without firing a scroll event, so the border could otherwise stick on).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const langToggle = (
    <div className="lang">
      <button
        className={lang === "pt" ? "on" : undefined}
        onClick={() => setLang("pt")}
      >
        PT
      </button>
      <button
        className={lang === "en" ? "on" : undefined}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );

  const themeToggle = (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      onClick={toggle}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Fechar menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
      <nav className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="DIV">
          <Logo className="logo" />
        </Link>
        <div className="nav-links">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {t(l.label)}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          {themeToggle}
          {langToggle}
          <Link href="/contato" className="btn sm" data-magnet>
            <span>{t(nav.cta)}</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div className="nav-panel" hidden={!open}>
        <div className="nav-panel-links">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {t(l.label)}
            </Link>
          ))}
        </div>
        <div className="nav-panel-foot">
          {themeToggle}
          {langToggle}
          <Link href="/contato" className="btn sm" data-magnet>
            <span>{t(nav.cta)}</span>
          </Link>
        </div>
      </div>
      </nav>
    </>
  );
}
