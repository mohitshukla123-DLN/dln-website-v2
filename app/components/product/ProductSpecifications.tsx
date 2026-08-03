interface Props {
  specifications: Record<string, string | undefined>;
}

export default function ProductSpecifications({
  specifications,
}: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold">
        Product Details
      </h2>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">

        {Object.entries(specifications).map(
          ([key, value], index) => (

            <div
              key={key}
              className={`grid grid-cols-2 p-4 ${
                index !==
                Object.entries(specifications).length - 1
                  ? "border-b border-black/10"
                  : ""
              }`}
            >
              <strong>
                {key.charAt(0).toUpperCase() +
                  key.slice(1)}
              </strong>

              <span>{value || "—"}</span>

            </div>

          )
        )}

      </div>

    </div>
  );
}