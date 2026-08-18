type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div className="mb-14 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-[var(--burgundy)]">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-bold">
        {title}
      </h2>

      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}