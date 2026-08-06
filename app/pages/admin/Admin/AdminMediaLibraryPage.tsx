import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Container from "../../../components/ui/Container";

export default function AdminMediaLibraryPage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data } = await supabase.storage
      .from("media-library")
      .list("", {
        limit: 100,
      });

    if (!data) return;

    const urls = data.map((file) => {
      return supabase.storage
        .from("media-library")
        .getPublicUrl(file.name).data.publicUrl;
    });

    setImages(urls);
  }

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const extension = file.name.split(".").pop();

    const filename =
      `${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("media-library")
      .upload(filename, file);

    if (error) {
      alert(error.message);
      return;
    }

    loadImages();
  }

  return (
    <Container>
      <section className="py-16">

        <h1 className="mb-8 text-4xl font-bold">
          Media Library
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="mb-8"
        />

        <div className="grid gap-6 md:grid-cols-4">

          {images.map((url) => (

            <img
              key={url}
              src={url}
              alt=""
              className="rounded-xl border"
            />

          ))}

        </div>

      </section>
    </Container>
  );
}