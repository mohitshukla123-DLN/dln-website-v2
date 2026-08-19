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

  const [imageLoaded, setImageLoaded] = useState(false);

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  const images = product.images ?? [];

  const currentIndex = Math.max(
    0,
    images.indexOf(activeImage)
  );

  function previousImage() {
    if (images.length <= 1) return;

    const previousIndex =
      currentIndex === 0
        ? images.length - 1
        : currentIndex - 1;

    setImageLoaded(false);
    setActiveImage(images[previousIndex]);
    resetZoom();
  }

  function nextImage() {
    if (images.length <= 1) return;

    const nextIndex =
      currentIndex === images.length - 1
        ? 0
        : currentIndex + 1;

    setImageLoaded(false);
    setActiveImage(images[nextIndex]);
    resetZoom();
  }

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const {
      left,
      top,
      width,
      height,
    } = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - left) / width) * 100;

    const y =
      ((e.clientY - top) / height) * 100;

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

  if (images.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--background)] p-10 text-center text-[var(--muted)]">
        No image available
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div
          className="group relative aspect-[4/5] w-full max-w-[620px] overflow-hidden rounded-2xl bg-[var(--background)]"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetZoom}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
        <button
          type="button"
          onClick={onImageClick}
          className="block h-full w-full cursor-zoom-in"
          aria-label={`View ${product.name} image`}
        >
          <img
            src={activeImage}
            alt={product.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
            className="h-full w-full object-contain transition-all duration-500"
            style={zoomStyle}
          />
        </button>

        {/* Previous image */}
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105"
          >
            ‹
          </button>
        )}

        {/* Next image */}
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 justify-center items-center rounded-full bg-white/90 text-2xl text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105"
          >
            ›
          </button>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setImageLoaded(false);
                setActiveImage(image);
                resetZoom();
              }}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                activeImage === image
                  ? "border-[var(--burgundy)]"
                  : "border-transparent hover:border-[var(--burgundy)]"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 object-cover"
                width={96}
                height={96}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}