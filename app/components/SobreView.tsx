"use client";

import Link from "next/link";
import { Fragment } from "react";
import { aboutPage as a } from "../content";
import { useLang } from "../lang-context";
import { Footer } from "./Footer";
import { RisingLines } from "./RisingLines";

const idxStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--faint)",
  letterSpacing: ".1em",
};

// Render an array of strings as lines separated by <br/>.
function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((ln, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {ln}
        </Fragment>
      ))}
    </>
  );
}

export function SobreView() {
  const { t, html, lang } = useLang();
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="kicker">{t(a.kicker)}</span>
          <h1 className="display">
            <RisingLines lines={a.titleLines[lang]} />
          </h1>
          <p className="lead">{t(a.lead)}</p>
        </div>
      </header>

      {/* Manifesto */}
      <section className="sec">
        <div className="wrap">
          <div className="ai-inner" style={{ alignItems: "start" }}>
            <div className="reveal">
              <span className="idx" style={idxStyle}>
                {a.manifestoIdx}
              </span>
              <h2
                className="display"
                style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", margin: "18px 0 0" }}
              >
                <Lines lines={a.manifestoHeading[lang]} />
              </h2>
            </div>
            <div className="prose reveal" data-d="2">
              {a.manifesto.map((p, i) => (
                <p key={i} {...html(p)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {a.principlesIdx}
              </span>
              <h2>{t(a.principlesTitle)}</h2>
            </div>
          </div>
          <div className="cards">
            {a.principles.map((c, i) => (
              <div className="card reveal" data-d={(i % 4) + 1} key={c.ix}>
                <div className="ix">{c.ix}</div>
                <h3>{t(c.title)}</h3>
                <p>{t(c.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we are */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="idx" style={idxStyle}>
                {a.whereIdx}
              </span>
              <h2>
                <Lines lines={a.whereTitle[lang]} />
              </h2>
            </div>
            <p className="sec-note">{t(a.whereNote)}</p>
          </div>
          <div className="cards" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
            {a.offices.map((o, i) => (
              <div className="card reveal" data-d={i + 1} key={o.ix}>
                <div className="ix">{o.ix}</div>
                <h3>{o.city}</h3>
                <p>
                  {o.addr.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap reveal">
          <span className="kicker" style={{ justifyContent: "center" }}>
            {t(a.cta.kicker)}
          </span>
          <h2 className="display" style={{ marginTop: 24 }}>
            {t(a.cta.heading)}
          </h2>
          <p className="sub">{t(a.cta.sub)}</p>
          <Link href="/contato" className="btn" data-magnet>
            <span>{t(a.cta.button)}</span>
            <span className="arw">↗</span>
          </Link>
        </div>
      </section>

      <Footer variant="full" />
    </>
  );
}
