/* DIV wordmark — D (rounded) · I (bar) · V (wedge) + accent block.
   `.lk` paths follow --fg; the `.la` block follows --accent (the brand
   "color block" that the original prototype tied to the selected accent). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 274 78" role="img" aria-label="DIV">
      <path
        className="lk"
        d="M36.2571 73.008H0C0 -1.456 0 74.568 0 0.103999H36.2571C56.2503 0.103999 72.5142 16.536 72.5142 36.608C72.5142 56.68 56.2503 73.008 36.2571 73.008Z"
      />
      <path className="lk" d="M77.3878 0.103999H115.095V72.904H77.3878V0.103999Z" />
      <path
        className="lk"
        d="M207.484 0L161.696 78L115.805 0C195.881 0 127.822 0 207.484 0Z"
      />
      <path className="la" d="M205.112 47.424H274V72.904H205.112V47.424Z" />
    </svg>
  );
}
