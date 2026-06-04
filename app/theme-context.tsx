"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  const firstRun = useRef(true);

  // Boot: restore the stored theme. The inline <head>/pre-paint script already
  // set <html data-palette> to avoid FOUC; this syncs React state to it.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("div-theme");
      if (stored === "ink" || stored === "light") setTheme(stored);
    } catch {
      // storage blocked (sandboxed iframe, privacy mode) — keep the default.
    }
  }, []);

  // Persist + reflect on <html data-palette>. Skip the first run: the pre-paint
  // script (see layout) already set data-palette before hydration, and writing
  // on mount with the initial "ink" state would clobber a stored "light" theme
  // (a visible flash). Subsequent runs reflect real theme changes.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    // Reflect the visual change even if storage is blocked, so guard only the write.
    try {
      localStorage.setItem("div-theme", theme);
    } catch {
      // storage blocked — the palette still applies below.
    }
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
