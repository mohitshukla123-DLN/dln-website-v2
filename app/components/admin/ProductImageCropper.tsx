import { useCallback, useState } from "react";
import Cropper, {
  type Area,
} from "react-easy-crop";
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
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [cropAreaPixels, setCropAreaPixels] =
    useState<Area | null>(null);

  const [processing, setProcessing] =
    useState(false);

  const previewUrl = URL.createObjectURL(file);

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
      URL.revokeObjectURL(previewUrl);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-5">
        <h2 className="mb-4 text-xl font-bold">
          Crop Product Image
        </h2>

        <div className="relative h-[55vh] min-h-[350px] w-full overflow-hidden rounded-xl bg-black">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">
            Zoom
          </label>

          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) =>
              setZoom(Number(e.target.value))
            }
            className="w-full"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(previewUrl);
              onCancel();
            }}
            disabled={processing}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDone}
            disabled={processing}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {processing
              ? "Processing..."
              : "Crop & Use Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
