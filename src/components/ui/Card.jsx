export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-base-800 border border-base-600 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`px-5 py-4 border-b border-base-600 flex items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
