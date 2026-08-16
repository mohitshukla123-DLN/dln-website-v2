import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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
        "inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--teal)] px-4 py-1.5 text-xs leading-4 text-white font-semibold transition-all duration-300 sm:min-h-10 sm:px-5 sm:py-2 sm:text-sm sm:leading-5",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
    >
      {children}
    </button>
  );
}