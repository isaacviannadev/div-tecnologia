"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "../content";
import { useLang } from "../lang-context";
import { Logo } from "./Logo";

export function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Re-evaluate on scroll and on route change (client nav resets scroll to top
  // without firing a scroll event, so the border could otherwise stick on).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <nav className={scrolled ? "nav scrolled" : "nav"}>
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
          <Link href="/contato" className="btn sm" data-magnet>
            <span>{t(nav.cta)}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
