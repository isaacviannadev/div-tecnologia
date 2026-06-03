"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ai,
  clients,
  cta,
  hero,
  type Lang,
  process,
  quote,
  services,
  stats,
  ticker,
} from "../content";
import { useLang } from "../lang-context";
import { Footer } from "./Footer";
import { Stat } from "./Stat";

export function HomeView() {
  const { lang, t, html } = useLang();

  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  /* ---------- Hero rotating word (2400ms; language-aware) ---------- */
  const [swapIdx, setSwapIdx] = useState(0);
  const [swapStyle, setSwapStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const trans = "opacity .25s, transform .25s";
    const id = window.setInterval(() => {
      setSwapStyle({ transition: trans, opacity: 0, transform: "translateY(-30%)" });
      window.setTimeout(() => {
        setSwapIdx((i) => (i + 1) % hero.words[langRef.current].length);
        setSwapStyle({ transition: trans, opacity: 0, transform: "translateY(30%)" });
        requestAnimationFrame(() =>
          setSwapStyle({ transition: trans, opacity: 1, transform: "translateY(0)" }),
        );
      }, 250);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="wrap">
          <span className="kicker">{t(hero.kicker)}</span>
          <h1 className="display">
            <span className="ln">
              <span>{t(hero.line1)}</span>
            </span>
            <span className="ln">
              <span>{t(hero.line2)}</span>
            </span>
            <span className="ln">
              <span className="swap" style={swapStyle}>
                {hero.words[lang][swapIdx]}
              </span>
            </span>
          </h1>
          <div className="hero-foot">
            <p className="hero-lead" {...html(hero.lead)} />
            <div className="hero-cta">
              <Link href="/contato" className="btn" data-magnet>
                <span>{t(hero.ctaPrimary)}</span>
                <span className="arw">↗</span>
              </Link>
              <Link href="/servicos" className="btn ghost" data-magnet>
                <span>{t(hero.ctaSecondary)}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============ TICKER ============ */}
      <div className="ticker">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ============ CLIENTS ============ */}
      <section className="clients">
        <div className="wrap" style={{ marginBottom: 28 }}>
          <span className="kicker">{t(clients.kicker)}</span>
        </div>
        <div className="cl-row">
          <div className="cl-track">
            {[...clients.row1, ...clients.row1].map((c, i) => (
              <span className={`nm logo ${c.name.toLowerCase()}`} key={i}>
                <img src={c.logo} alt={c.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>
        <div className="cl-row">
          <div className="cl-track">
            {[...clients.row2, ...clients.row2].map((c, i) => (
              <span className={`nm logo ${c.name.toLowerCase()}`} key={i}>
                <img src={c.logo} alt={c.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx">{services.idx}</span>
              <h2>{t(services.title)}</h2>
            </div>
            <p className="sec-note">{t(services.note)}</p>
          </div>
        </div>
        <div className="wrap">
          <div className="svc-grid reveal">
            {services.items.map((s) => (
              <article className="svc" key={s.num}>
                <div className="fill" />
                <div className="num">{s.num}</div>
                <span className="tag">{t(s.tag)}</span>
                <h3>{t(s.title)}</h3>
                <p>{t(s.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI-ALIGNED ============ */}
      <section className="ai sec" id="ai">
        <div className="wrap">
          <div className="ai-inner">
            <div className="reveal">
              <span className="kicker">{ai.kicker}</span>
              <h2 {...html(ai.heading)} />
              <p>{t(ai.body)}</p>
              <ul>
                {ai.list.map((li, i) => (
                  <li key={i}>{t(li)}</li>
                ))}
              </ul>
            </div>
            <div className="reveal" data-d="2">
              <div className="code">
                <div className="code-bar">
                  <i />
                  <i />
                  <i />
                  <span>tokens.semantic.json</span>
                </div>
                <div className="code-body">
                  <span className="tokenline c" style={{ animationDelay: ".05s" }}>
                    {"// single source of truth · human + agent"}
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".15s" }}>
                    {"{"}
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".25s" }}>
                    {"  "}
                    <span className="k">&quot;color.bg.default&quot;</span>:{" "}
                    <span className="s">&quot;#08080a&quot;</span>,
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".35s" }}>
                    {"  "}
                    <span className="k">&quot;color.accent&quot;</span>:{"     "}
                    <span className="s">&quot;#F4A13F&quot;</span>,
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".45s" }}>
                    {"  "}
                    <span className="k">&quot;radius.control&quot;</span>:{"   "}
                    <span className="s">&quot;0&quot;</span>,
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".55s" }}>
                    {"  "}
                    <span className="k">&quot;space.gutter&quot;</span>:{"     "}
                    <span className="s">&quot;clamp(16,4vw,64)&quot;</span>
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: ".65s" }}>
                    {"}"}
                  </span>
                  {"\n"}
                  <span className="tokenline c" style={{ animationDelay: ".85s" }}>
                    {"\n▸ agent: read tokens → generate <Button/>"}
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: "1s" }}>
                    <span className="k">✓</span> contrast 7.1:1 · WCAG AAA
                  </span>
                  {"\n"}
                  <span className="tokenline" style={{ animationDelay: "1.15s" }}>
                    <span className="k">✓</span> matches brand guardrails{" "}
                    <span className="cursor" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stats reveal">
            {stats.map((s, i) => (
              <Stat
                key={i}
                count={s.count}
                dec={s.dec}
                unit={s.unit}
                label={t(s.label)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="sec" id="process">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx">{process.idx}</span>
              <h2>{t(process.title)}</h2>
            </div>
            <p className="sec-note">{t(process.note)}</p>
          </div>
          <div className="proc reveal">
            {process.steps.map((step) => (
              <div className="step" key={step.n}>
                <div className="n">{step.n}</div>
                <h4>{t(step.title)}</h4>
                <p>{t(step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="quote">
        <div className="wrap reveal">
          <blockquote {...html(quote.text)} />
          <div className="cite">
            <span className="ln" />
            <span>{t(quote.cite)}</span>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta">
        <div className="wrap reveal">
          <span className="kicker" style={{ justifyContent: "center" }}>
            {t(cta.kicker)}
          </span>
          <h2 className="display" style={{ marginTop: 24 }}>
            {t(cta.heading)}
          </h2>
          <p className="sub">{t(cta.sub)}</p>
          <Link href="/contato" className="btn" data-magnet>
            <span>{t(cta.button)}</span>
            <span className="arw">↗</span>
          </Link>
        </div>
      </section>

      <Footer variant="full" />
    </>
  );
}
