"use client";

import NextLink, { useLinkStatus } from "next/link";
import { AsciiSkeleton } from "ascii-reveal";
import type { ComponentProps } from "react";
import { useLang } from "../lang-context";
import "./ascii-loading.css";

function PendingNavigation() {
  const { pending } = useLinkStatus();
  const { t } = useLang();
  if (!pending) return null;

  return (
    <>
      <span className="ascii-link-pending" aria-hidden="true">
        <AsciiSkeleton variant="scan" lines={1} widths={["100%"]} />
      </span>
      <span className="ascii-sr-only" role="status">
        {t({ pt: "Carregando página…", en: "Loading page…" })}
      </span>
    </>
  );
}

/** Decorates actual pending navigation without replacing server-rendered pages. */
export function MotionLink({ children, className = "", ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props} className={`motion-link ${className}`}>
      {children}
      <PendingNavigation />
    </NextLink>
  );
}
