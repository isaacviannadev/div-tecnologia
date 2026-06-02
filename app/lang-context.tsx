"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { L, Lang } from "./content";

type LangValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** current-language string from an { pt, en } pair */
  t: (l: L) => string;
  /** spread onto an element to render an HTML-bearing localized string */
  html: (l: L) => { dangerouslySetInnerHTML: { __html: string } };
};

const LangCtx = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  // Boot: enable JS-gated reveals once, then restore the stored language.
  useEffect(() => {
    document.documentElement.classList.add("js");
    const stored = localStorage.getItem("div-lang");
    if (stored === "pt" || stored === "en") setLang(stored);
  }, []);

  // Persist + reflect on <html lang>.
  useEffect(() => {
    localStorage.setItem("div-lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const t = useCallback((l: L) => l[lang], [lang]);
  const html = useCallback(
    (l: L) => ({ dangerouslySetInnerHTML: { __html: l[lang] } }),
    [lang],
  );

  return (
    <LangCtx.Provider value={{ lang, setLang, t, html }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
