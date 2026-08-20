interface Props {
  specifications: Record<string, string | undefined>;
}

const SPECIFICATION_ORDER = [
  "fabric",
  "embroidery",
  "fit",
  "occasion",
  "care",
];

const LABELS: Record<string, string> = {
  fabric: "Fabric",
  embroidery: "Embroidery",
  fit: "Fit",
  occasion: "Occasion",
  care: "Care",
};

export default function ProductSpecifications({
  specifications,
}: Props) {
  const entries = SPECIFICATION_ORDER
    .map((key) => [key, specifications[key]] as const)
    .filter(([, value]) => value);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">
        Product Details
      </h2>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`grid grid-cols-2 p-4 ${
              index !== entries.length - 1
                ? "border-b border-black/10"
                : ""
            }`}
          >
            <strong>
              {LABELS[key]}
            </strong>

            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}