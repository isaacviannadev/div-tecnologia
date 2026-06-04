"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "sonner";

export type Theme = "ink" | "light";

type ThemeValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("ink");

  // Boot: restore the stored theme. The inline <head>/pre-paint script already
  // set <html data-palette> to avoid FOUC; this syncs React state to it.
  useEffect(() => {
    const stored = localStorage.getItem("div-theme");
    if (stored === "ink" || stored === "light") setTheme(stored);
  }, []);

  // Persist + reflect on <html data-palette>.
  useEffect(() => {
    localStorage.setItem("div-theme", theme);
    document.documentElement.dataset.palette = theme;
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "ink" ? "light" : "ink")),
    [],
  );

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/** Toaster (sonner) que segue o tema ativo. Deve ficar dentro do ThemeProvider. */
export function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
