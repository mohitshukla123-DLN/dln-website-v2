import { useState } from "react";

interface Props {
  product: {
    name: string;
    images: string[];
  };
  activeImage: string;
  setActiveImage: (image: string) => void;
  onImageClick: () => void;
}

export default function ProductGallery({
  product,
  activeImage,
  setActiveImage,
  onImageClick,
}: Props) {
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  function handleMouseMove(
    e: React.MouseEvent<HTMLImageElement>
  ) {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  }

  function resetZoom() {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  }

  return (
    <div>
      <div className="overflow-hidden rounded-3xl shadow-lg">
        <img
          src={activeImage}
          alt={product.name}
          onClick={onImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetZoom}
          style={zoomStyle}
          className="w-full cursor-zoom-in object-cover transition-transform duration-200"
        />
      </div>

      <div className="mt-6 flex gap-4">
        {product.images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              activeImage === image
                ? "border-[var(--teal)]"
                : "border-transparent hover:border-[var(--teal)]"
            }`}
          >
            <img
              src={image}
              alt={`${product.name} ${index + 1}`}
              className="h-24 w-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}