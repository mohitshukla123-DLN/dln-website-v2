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
        "rounded-full bg-[var(--teal)] px-4 py-2 text-sm leading-5 text-white font-medium transition-all duration-300 sm:px-8 sm:py-3 sm:text-base sm:leading-normal",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
    >
      {children}
    </button>
  );
}