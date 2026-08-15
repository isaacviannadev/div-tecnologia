"use client";

import Link from "next/link";
import { bookingUrl, diagnosticoPage as d } from "../content";
import { useLang } from "../lang-context";
import { Footer } from "./Footer";
import { RisingLines } from "./RisingLines";

const idxStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--faint)",
  letterSpacing: ".1em",
};

export function DiagnosticoView() {
  const { t, html, lang } = useLang();

  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="kicker">{t(d.kicker)}</span>
          <h1 className="display">
            <RisingLines lines={d.titleLines[lang]} />
          </h1>
          <p className="lead" {...html(d.lead)} />

          <div className="facts reveal">
            {d.facts.map((f) => (
              <div className="fact" key={f.label.en}>
                <span className="l">{t(f.label)}</span>
                <span className="v">{t(f.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 01 — Problem */}
      <section className="sec" style={{ paddingTop: "clamp(40px,6vh,72px)" }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {d.problemIdx}
              </span>
              <h2>{t(d.problemTitle)}</h2>
            </div>
            <p className="sec-note">{t(d.problemNote)}</p>
          </div>
          <ul className="pains reveal" data-d="2">
            {d.pains.map((p, i) => (
              <li key={i}>
                <span className="x" aria-hidden="true">
                  →
                </span>
                <span {...html(p)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 — Deliverables */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {d.deliverIdx}
              </span>
              <h2>{t(d.deliverTitle)}</h2>
            </div>
          </div>
          {d.deliverables.map((row, i) => (
            <div className="svc-row reveal" data-d={(i % 4) + 1} key={row.ix}>
              <div className="ix">{row.ix}</div>
              <div>
                <h3>{t(row.title)}</h3>
                <p className="desc">{t(row.desc)}</p>
              </div>
              <ul>
                {row.bullets.map((b, j) => (
                  <li key={j}>{t(b)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — How it works */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {d.howIdx}
              </span>
              <h2>{t(d.howTitle)}</h2>
            </div>
          </div>
          <div className="proc reveal" data-d="2">
            {d.steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="n">{s.n}</div>
                <h4>{t(s.title)}</h4>
                <p>{t(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Pricing */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {d.priceIdx}
              </span>
              <h2>{t(d.priceTitle)}</h2>
            </div>
          </div>
          <div className="tiers reveal" data-d="2">
            {d.tiers.map((tier) => (
              <div className={`tier${tier.lead ? " lead" : ""}`} key={tier.name.en}>
                {tier.lead && <span className="badge">{t(d.priceBadge)}</span>}
                <span className="stage">{t(tier.stage)}</span>
                <h3>{t(tier.name)}</h3>
                <div className="val">
                  {tier.value}
                  {tier.per && <span className="per">{t(tier.per)}</span>}
                </div>
                <p className="note">{t(tier.note)}</p>
              </div>
            ))}
          </div>
          <p className="credit reveal" data-d="3" {...html(d.creditNote)} />
        </div>
      </section>

      <section className="cta">
        <div className="wrap reveal">
          <span className="kicker" style={{ justifyContent: "center" }}>
            {t(d.cta.kicker)}
          </span>
          <h2 className="display" style={{ marginTop: 24 }}>
            {t(d.cta.heading)}
          </h2>
          <p className="sub">{t(d.cta.sub)}</p>
          <div className="cta-actions">
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener"
                className="btn"
                data-magnet
              >
                <span>{t(d.cta.book)}</span>
                <span className="arw">↗</span>
              </a>
            )}
            <Link
              href="/contato"
              className={`btn${bookingUrl ? " ghost" : ""}`}
              data-magnet
            >
              <span>{t(d.cta.write)}</span>
              <span className="arw">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="full" />
    </>
  );
}
