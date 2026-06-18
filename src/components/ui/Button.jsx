const VARIANTS = {
  primary:
    "bg-signal-amber text-base-950 hover:bg-amber-400 disabled:bg-base-600 disabled:text-base-400",
  secondary:
    "bg-base-700 text-base-100 hover:bg-base-600 border border-base-500 disabled:opacity-40",
  ghost: "bg-transparent text-base-200 hover:bg-base-700 disabled:opacity-40",
  success:
    "bg-signal-green text-base-950 hover:brightness-110 disabled:bg-base-600 disabled:text-base-400",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium font-display tracking-tight transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
