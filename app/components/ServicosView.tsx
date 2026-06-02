"use client";

import Link from "next/link";
import { servicesPage as s } from "../content";
import { useLang } from "../lang-context";
import { Footer } from "./Footer";
import { RisingLines } from "./RisingLines";

export function ServicosView() {
  const { t } = useLang();
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="kicker">{t(s.kicker)}</span>
          <h1 className="display">
            <RisingLines lines={[t(s.titleA), t(s.titleB)]} />
          </h1>
          <p className="lead">{t(s.lead)}</p>
        </div>
      </header>

      <section className="sec" style={{ paddingTop: "clamp(40px,6vh,72px)" }}>
        <div className="wrap">
          {s.rows.map((row, i) => (
            <div className="svc-row reveal" data-d={(i % 4) + 1} key={row.ix}>
              <div className="ix">{row.ix}</div>
              <div>
                <h3>{t(row.title)}</h3>
                <p className="desc">{t(row.desc)}</p>
              </div>
              <ul>
                {row.bullets.map((b, i) => (
                  <li key={i}>{t(b)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="wrap reveal">
          <span className="kicker" style={{ justifyContent: "center" }}>
            {t(s.cta.kicker)}
          </span>
          <h2 className="display" style={{ marginTop: 24 }}>
            {t(s.cta.heading)}
          </h2>
          <p className="sub">{t(s.cta.sub)}</p>
          <Link href="/contato" className="btn" data-magnet>
            <span>{t(s.cta.button)}</span>
            <span className="arw">↗</span>
          </Link>
        </div>
      </section>

      <Footer variant="full" />
    </>
  );
}
