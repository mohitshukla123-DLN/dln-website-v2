import {
  useEffect,
  useRef,
  useState,
} from "react";
import Container from "../../../components/ui/Container";
import { supabase } from "../../../lib/supabase";

interface MediaItem {
  id: number;
  storage_path: string;
  file_name: string;
  public_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

interface PendingImage {
  id: string;
  file: File;
  preview: string;
  crop: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function processImage(
  file: File,
  cropPercent: number
): Promise<Blob> {
  const image = new Image();
  const sourceUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = sourceUrl;
    });

    const canvas = document.createElement("canvas");

    const size = Math.min(
      image.naturalWidth,
      image.naturalHeight
    );

    const cropAmount =
      Math.max(0, Math.min(60, cropPercent)) / 100;

    const cropSize = size * (1 - cropAmount);

    const sx =
      (image.naturalWidth - cropSize) / 2;

    const sy =
      (image.naturalHeight - cropSize) / 2;

    const outputSize = Math.min(
      cropSize,
      1800
    );

    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to process image.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(
      image,
      sx,
      sy,
      cropSize,
      cropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    const blob = await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          "image/webp",
          0.82
        )
    );

    if (!blob) {
      throw new Error("WebP conversion failed.");
    }

    return blob;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export default function AdminMediaLibraryPage() {
  const [images, setImages] =
    useState<MediaItem[]>([]);

  const [pendingImages, setPendingImages] =
    useState<PendingImage[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [dragActive, setDragActive] =
    useState(false);

  const [draggedId, setDraggedId] =
    useState<number | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data, error } = await supabase
      .from("media_library")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setImages(data ?? []);
  }

  function addFiles(files: File[]) {
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages: PendingImage[] =
      imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        crop: 0,
      }));

    setPendingImages((current) => [
      ...current,
      ...newImages,
    ]);
  }

  function removePending(id: string) {
    setPendingImages((current) => {
      const item = current.find(
        (image) => image.id === id
      );

      if (item) {
        URL.revokeObjectURL(item.preview);
      }

      return current.filter(
        (image) => image.id !== id
      );
    });
  }

  function updateCrop(
    id: string,
    crop: number
  ) {
    setPendingImages((current) =>
      current.map((image) =>
        image.id === id
          ? {
              ...image,
              crop,
            }
          : image
      )
    );
  }

  async function uploadImages() {
    if (!pendingImages.length) return;

    setUploading(true);

    try {
      const startingOrder =
        images.length;

      for (
        let index = 0;
        index < pendingImages.length;
        index++
      ) {
        const pending =
          pendingImages[index];

        const processed =
          await processImage(
            pending.file,
            pending.crop
          );

        const baseName =
          slugify(pending.file.name) ||
          "image";

        const filename =
          `${baseName}-${crypto
            .randomUUID()
            .split("-")[0]}.webp`;

        const { error: uploadError } =
          await supabase.storage
            .from("media-library")
            .upload(
              filename,
              processed,
              {
                contentType: "image/webp",
                cacheControl:
                  "31536000",
                upsert: false,
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } =
          supabase.storage
            .from("media-library")
            .getPublicUrl(filename);

        const { error: dbError } =
          await supabase
            .from("media_library")
            .insert({
              storage_path: filename,
              file_name: filename,
              public_url:
                urlData.publicUrl,

              // New uploads are NOT featured.
              is_featured: false,

              sort_order:
                startingOrder + index,
            });

        if (dbError) {
          await supabase.storage
            .from("media-library")
            .remove([filename]);

          throw dbError;
        }
      }

      pendingImages.forEach(
        (image) =>
          URL.revokeObjectURL(
            image.preview
          )
      );

      setPendingImages([]);

      await loadImages();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(
    image: MediaItem
  ) {
    const confirmed =
      window.confirm(
        `Delete "${image.file_name}"?`
      );

    if (!confirmed) return;

    const { error: storageError } =
      await supabase.storage
        .from("media-library")
        .remove([
          image.storage_path,
        ]);

    if (storageError) {
      alert(storageError.message);
      return;
    }

    const { error: dbError } =
      await supabase
        .from("media_library")
        .delete()
        .eq("id", image.id);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    await loadImages();
  }

  async function setFeatured(
    id: number
  ) {
    const { error: resetError } =
      await supabase
        .from("media_library")
        .update({
          is_featured: false,
        })
        .neq("id", id);

    if (resetError) {
      alert(resetError.message);
      return;
    }

    const { error } =
      await supabase
        .from("media_library")
        .update({
          is_featured: true,
        })
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadImages();
  }

  async function reorderImages(
    sourceId: number,
    targetId: number
  ) {
    if (sourceId === targetId) return;

    const current = [...images];

    const sourceIndex =
      current.findIndex(
        (image) =>
          image.id === sourceId
      );

    const targetIndex =
      current.findIndex(
        (image) =>
          image.id === targetId
      );

    if (
      sourceIndex === -1 ||
      targetIndex === -1
    ) {
      return;
    }

    const [moved] =
      current.splice(
        sourceIndex,
        1
      );

    current.splice(
      targetIndex,
      0,
      moved
    );

    setImages(current);

    for (
      let index = 0;
      index < current.length;
      index++
    ) {
      const { error } =
        await supabase
          .from("media_library")
          .update({
            sort_order: index,
          })
          .eq(
            "id",
            current[index].id
          );

      if (error) {
        alert(error.message);
        await loadImages();
        return;
      }
    }
  }

  function handleDrop(
    e: React.DragEvent
  ) {
    e.preventDefault();
    setDragActive(false);

    addFiles(
      Array.from(
        e.dataTransfer.files
      )
    );
  }

  return (
    <Container>
      <section className="py-12">
        <h1 className="text-4xl font-bold">
          Media Library
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Upload, crop, compress and
          organize website images.
        </p>

        {/* UPLOAD AREA */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() =>
            setDragActive(false)
          }
          onDrop={handleDrop}
          className={`mt-8 rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragActive
              ? "border-[var(--burgundy)] bg-[var(--burgundy)]/5"
              : "border-black/20"
          }`}
        >
          <p className="text-lg font-semibold">
            Drag & drop images here
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Or select multiple images
          </p>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="mt-5 rounded-xl bg-[var(--burgundy)] px-6 py-3 font-medium text-white"
          >
            Select Images
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              addFiles(
                Array.from(
                  e.target.files ?? []
                )
              );

              e.target.value = "";
            }}
            className="hidden"
          />
        </div>

        {/* PREVIEW */}
        {pendingImages.length > 0 && (
          <div className="mt-10 rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Preview Before Publishing
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Crop changes are shown
                  immediately. Images are
                  converted to compressed
                  WebP when published.
                </p>
              </div>

              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
                className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {uploading
                  ? "Processing..."
                  : "Publish Images"}
              </button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pendingImages.map(
                (image) => {
                  const scale =
                    1 +
                    image.crop /
                      100;

                  return (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border"
                    >
                      <div className="aspect-square overflow-hidden bg-black/5">
                        <img
                          src={image.preview}
                          alt={
                            image.file.name
                          }
                          className="h-full w-full object-cover transition-transform duration-150"
                          style={{
                            transform: `scale(${scale})`,
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <p className="truncate text-sm font-medium">
                          {image.file.name}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <label className="text-xs font-medium">
                            Crop
                          </label>

                          <span className="text-xs text-[var(--muted)]">
                            {image.crop}%
                          </span>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={60}
                          value={image.crop}
                          onChange={(e) =>
                            updateCrop(
                              image.id,
                              Number(
                                e.target
                                  .value
                              )
                            )
                          }
                          className="mt-2 w-full"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removePending(
                              image.id
                            )
                          }
                          className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* LIBRARY */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">
            Published Images
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Drag images to reorder them.
            Use "Set Featured" only when
            you want an image to be featured.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map(
              (image) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() =>
                    setDraggedId(
                      image.id
                    )
                  }
                  onDragEnd={() =>
                    setDraggedId(null)
                  }
                  onDragOver={(e) =>
                    e.preventDefault()
                  }
                  onDrop={() => {
                    if (
                      draggedId !== null
                    ) {
                      reorderImages(
                        draggedId,
                        image.id
                      );
                    }

                    setDraggedId(null);
                  }}
                  className={`overflow-hidden rounded-2xl border bg-white ${
                    draggedId === image.id
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <img
                    src={
                      image.public_url
                    }
                    alt={image.file_name}
                    loading="lazy"
                    className="aspect-square w-full cursor-grab object-cover"
                  />

                  <div className="p-4">
                    {image.is_featured && (
                      <span className="inline-flex rounded-full bg-[var(--burgundy)] px-3 py-1 text-xs font-semibold text-white">
                        Featured
                      </span>
                    )}

                    <p className="mt-2 truncate text-sm font-medium">
                      {image.file_name}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFeatured(
                            image.id
                          )
                        }
                        className="flex-1 rounded-lg border px-3 py-2 text-xs"
                      >
                        {image.is_featured
                          ? "Featured"
                          : "Set Featured"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(
                            image
                          )
                        }
                        className="rounded-lg border px-3 py-2 text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {images.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed p-10 text-center text-sm text-[var(--muted)]">
              No images uploaded yet.
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}