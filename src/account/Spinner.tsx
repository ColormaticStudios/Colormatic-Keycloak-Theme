import "./spinner.css";

export function Spinner() {
  return (
    <div
      className="kc-spinner-wrapper"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="kc-spinner-label">Loading…</span>
      <span className="kc-spinner-loader" aria-hidden="true" />
    </div>
  );
}
