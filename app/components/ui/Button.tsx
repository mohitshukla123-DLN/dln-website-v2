import clsx from "clsx";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  };

export default function Button({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--burgundy)] px-3.5 py-1 text-[13px] font-semibold tracking-wide text-white shadow-sm transition-all duration-300 sm:min-h-11 sm:px-6 sm:py-2 sm:text-base",
        "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {children}
    </button>
  );
}