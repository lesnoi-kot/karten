type Props = {
  source?: string;
  meta?: object;
  message?: string;
};

export default function Stub({ source = "", meta, message }: Props) {
  if (import.meta.env.VITE_NODE_ENV === "production") {
    return null;
  }

  // TODO: use context to provide debug info?
  return (
    <div style={{ color: "#fcba03" }}>
      <span>Warning - can't correctly render component "{source}"</span>
      {message && <span>{message}</span>}
    </div>
  );
}
