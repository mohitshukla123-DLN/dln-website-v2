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
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <div
        className="overflow-hidden rounded-3xl"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <img
          src={activeImage}
          alt={product.name}
          onClick={onImageClick}
          className={`w-full cursor-zoom-in rounded-3xl object-cover shadow-lg transition-transform duration-300 ${
            zoom ? "scale-150" : "scale-100"
          }`}
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