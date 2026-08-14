import { useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  activeImage: string;
  open: boolean;
  onClose: () => void;
  onImageChange: (image: string) => void;
}

function distance(a: React.Touch, b: React.Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export default function ProductLightbox({
  images,
  activeImage,
  open,
  onClose,
  onImageChange,
}: Props) {
  const currentIndex = images.indexOf(activeImage);
  const [scale, setScale] = useState(1);
  const pinchStart = useRef(0);
  const pinchScale = useRef(1);
  const lastTap = useRef(0);

  const previousImage = () => {
    const index = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setScale(1);
    onImageChange(images[index]);
  };

  const nextImage = () => {
    const index = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setScale(1);
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeImage]);

  useEffect(() => {
    if (!open) setScale(1);
  }, [open, activeImage]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 p-4 sm:p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 text-5xl leading-none text-white"
        aria-label="Close image viewer"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); previousImage(); }}
        className="absolute left-3 z-20 text-5xl text-white sm:left-6"
        aria-label="Previous image"
      >
        ‹
      </button>

      <div
        className="flex h-full w-full items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            pinchStart.current = distance(e.touches[0], e.touches[1]);
            pinchScale.current = scale;
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinchStart.current > 0) {
            e.preventDefault();
            const next = pinchScale.current * (distance(e.touches[0], e.touches[1]) / pinchStart.current);
            setScale(Math.min(4, Math.max(1, next)));
          }
        }}
        onTouchEnd={() => { pinchStart.current = 0; }}
      >
        <img
          src={activeImage}
          alt=""
          className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain transition-transform duration-150"
          style={{ transform: `scale(${scale})`, touchAction: "none" }}
          onDoubleClick={(e) => {
            e.preventDefault();
            setScale((current) => (current > 1 ? 1 : 2.5));
          }}
          onTouchEnd={(e) => {
            if (e.touches.length !== 0) return;
            const now = Date.now();
            if (now - lastTap.current < 300) {
              setScale((current) => (current > 1 ? 1 : 2.5));
            }
            lastTap.current = now;
          }}
          draggable={false}
        />
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); nextImage(); }}
        className="absolute right-3 z-20 text-5xl text-white sm:right-6"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}
