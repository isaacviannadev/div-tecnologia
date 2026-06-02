/* Renders each headline line in an overflow-clipped row whose inner span
   rises into place — the same line-by-line entrance used by the home hero.
   Pure CSS animation (see .phero h1 .ln in globals.css), so it also replays
   on client-side navigation when the headline remounts. */
export function RisingLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((ln, i) => (
        <span className="ln" key={i}>
          <span>{ln}</span>
        </span>
      ))}
    </>
  );
}
