interface Props {
  description: string;
}

export default function ProductDescription({
  description,
}: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">
        Description
      </h2>

      <p className="mt-4 leading-8 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}