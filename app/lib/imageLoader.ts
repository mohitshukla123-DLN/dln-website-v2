const imageModules = import.meta.glob(
  "../assets/products/**/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

const images: Record<string, string> = {};

Object.entries(imageModules).forEach(([path, src]) => {
  const key = path.replace("../assets/products/", "");
  images[key] = src;
});

export function getProductImage(path: string): string {
  return images[path] ?? "";
}