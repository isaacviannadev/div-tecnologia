"use client";

import { AsciiSkeleton } from "ascii-reveal";
import { useId, type CSSProperties } from "react";
import "./ascii-loading.css";

type AsciiSubmitButtonProps = {
  isLoading: boolean;
  label: string;
  busyLabel: string;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** ASCII decorates the real pending state without ever concealing an action label. */
export function AsciiSubmitButton({
  isLoading,
  label,
  busyLabel,
  compact = false,
  className,
  style,
}: AsciiSubmitButtonProps) {
  const statusId = useId();

  return (
    <>
      <div
        className={`ascii-submit${compact ? " ascii-submit--compact" : ""}`}
        aria-busy={isLoading}
        style={style}
      >
        <button
          type="submit"
          className={className}
          disabled={isLoading}
          aria-label={isLoading ? busyLabel : label}
          aria-describedby={isLoading ? statusId : undefined}
          data-magnet={compact ? undefined : true}
        >
          {!compact && (
            <span className="ascii-submit-label" aria-hidden="true">
              <span style={{ visibility: isLoading ? "hidden" : "visible" }}>{label}</span>
              <span style={{ visibility: isLoading ? "visible" : "hidden" }}>{busyLabel}</span>
            </span>
          )}
          <span className="ascii-submit-icon" aria-hidden="true">
            {isLoading ? (
              <AsciiSkeleton variant="scan" lines={1} widths={[24]} />
            ) : (
              <span className="arw">↗</span>
            )}
          </span>
        </button>
      </div>
      {/* Outside aria-busy: assistive technology can announce progress immediately. */}
      <span
        id={statusId}
        className={compact ? "ascii-submit-status" : "ascii-sr-only"}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? busyLabel : ""}
      </span>
    </>
  );
}
