import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, ThemedToaster } from "./theme-context";
import { CursorDot } from "./components/CursorDot";
import { Nav } from "./components/Nav";
import { RouteMotion } from "./components/RouteMotion";
import "./globals.css";
import { LangProvider } from "./lang-context";

// Display: Bricolage Grotesque (variable opsz/wght) · Mono: JetBrains Mono.
// Exposed as CSS variables consumed by --font-display / --font-mono in globals.css.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIV — Design Systems & Front-end Performance",
  description:
    "Consultoria especializada em Design Systems e performance de front-end. Bases legíveis por humanos e por agentes de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang starts pt-BR; the client toggle updates documentElement.lang at runtime.
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("div-theme");document.documentElement.dataset.palette=(t==="light"?"light":"ink");}catch(e){document.documentElement.dataset.palette="ink";}})();',
          }}
        />
        <ThemeProvider>
          <LangProvider>
            <div className="bg-grid" />
            <div className="scanline" />
            <Nav />
            {children}
            <CursorDot />
            <RouteMotion />
            <ThemedToaster />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
