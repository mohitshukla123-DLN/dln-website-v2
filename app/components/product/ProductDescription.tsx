interface Props {
  description: string;
}

export default function ProductDescription({
  description,
}: Props) {
  return (
    <div className="mt-5 sm:mt-8">
      <h2 className="text-xl font-semibold sm:text-2xl">
        Description
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:mt-4 sm:text-base sm:leading-7">
        {description}
      </p>
    </div>
  );
}