import { useEffect } from "react";

interface Props {
  images: string[];
  activeImage: string;
  open: boolean;
  onClose: () => void;
  onImageChange: (image: string) => void;
}

export default function ProductLightbox({
  images,
  activeImage,
  open,
  onClose,
  onImageChange,
}: Props) {
  const currentIndex = images.indexOf(activeImage);

  const previousImage = () => {
    const index =
      currentIndex === 0
        ? images.length - 1
        : currentIndex - 1;

    onImageChange(images[index]);
  };

  const nextImage = () => {
    const index =
      currentIndex === images.length - 1
        ? 0
        : currentIndex + 1;

    onImageChange(images[index]);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          previousImage();
          break;

        case "ArrowRight":
          nextImage();
          break;

        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, activeImage]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-5xl text-white"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          previousImage();
        }}
        className="absolute left-6 text-5xl text-white"
      >
        ‹
      </button>

      <img
        src={activeImage}
        alt=""
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        className="absolute right-6 text-5xl text-white"
      >
        ›
      </button>
    </div>
  );
}