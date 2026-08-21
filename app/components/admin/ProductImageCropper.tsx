import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { processProductImage } from "../../lib/imageProcessing";

interface Props {
  file: File;
  onDone: (file: File) => void;
  onCancel: () => void;
}

export default function ProductImageCropper({
  file,
  onDone,
  onCancel,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback(
    (_area: Area, pixels: Area) => {
      setCropAreaPixels(pixels);
    },
    []
  );

  async function handleDone() {
    if (!cropAreaPixels) return;

    setProcessing(true);

    try {
      const processed = await processProductImage(
        file,
        cropAreaPixels
      );

      onDone(processed);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not process image."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold">
            Crop Product Image
          </h2>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="relative h-[65vh] min-h-[420px] w-full bg-neutral-900">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            minZoom={1}
            maxZoom={4}
            zoomSpeed={0.5}
            objectFit="contain"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="border-t bg-white px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Zoom
            </span>

            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />

            <span className="w-12 text-right text-sm">
              {zoom.toFixed(1)}×
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Drag to position the image. Use zoom to frame the product.
            The final image will use a 4:5 portrait format.
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDone}
              disabled={processing || !cropAreaPixels}
              className="rounded-lg bg-[var(--burgundy)] px-5 py-2 font-medium text-white disabled:opacity-50"
            >
              {processing
                ? "Processing..."
                : "Crop & Use Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}