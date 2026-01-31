import "./spinner.css";

export function Spinner() {
  return (
    <div className="kc-spinner-wrapper" aria-busy="true" aria-live="polite">
      <h1>
        Loading...
        <div className="kc-spinner-loader" />
      </h1>
    </div>
  );
}
