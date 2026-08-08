import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Container from "../../../components/ui/Container";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminMediaLibraryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data, error } = await supabase.storage
      .from("media-library")
      .list("", {
        limit: 100,
        sortBy: {
          column: "created_at",
          order: "desc",
        },
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data) return;

    const urls = data
      .filter((file) => file.name)
      .map(
        (file) =>
          supabase.storage
            .from("media-library")
            .getPublicUrl(file.name).data.publicUrl
      );

    setImages(urls);
  }

  async function uploadImages(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    setUploading(true);

    try {
      for (const file of files) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const originalName = file.name
          .replace(/\.[^/.]+$/, "");

        const baseName =
          slugify(originalName) || "image";

        const randomSuffix =
          crypto.randomUUID().split("-")[0];

        const filename =
          `${baseName}-${randomSuffix}.${extension}`;

        const { error } = await supabase.storage
          .from("media-library")
          .upload(filename, file);

        if (error) {
          throw error;
        }
      }

      await loadImages();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image(s)."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Container>
      <section className="py-12">
        <h1 className="mb-8 text-4xl font-bold">
          Media Library
        </h1>

        <label
          htmlFor="media-upload"
          className={`mb-8 inline-flex items-center rounded-lg bg-[var(--teal)] px-5 py-3 font-medium text-white transition ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:opacity-90"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </label>

        <input
          id="media-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={uploadImages}
          disabled={uploading}
          className="hidden"
        />

        <div className="grid gap-6 md:grid-cols-4">
          {images.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              loading="lazy"
              className="rounded-xl border object-cover"
            />
          ))}
        </div>
      </section>
    </Container>
  );
}