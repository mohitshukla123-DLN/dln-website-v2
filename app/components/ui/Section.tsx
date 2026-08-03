type Props = {
  children: React.ReactNode;
  className?: string;
  background?: string;
};

export default function Section({
  children,
  className = "",
  background = "bg-[var(--background)]",
}: Props) {
  return (
    <section className={`${background} py-24 ${className}`}>
      {children}
    </section>
  );
}