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
        "rounded-full bg-[var(--teal)] px-8 py-3 text-white font-medium transition-all duration-300",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
    >
      {children}
    </button>
  );
}