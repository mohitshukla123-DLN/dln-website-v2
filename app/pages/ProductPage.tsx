import {
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";

import { Link, useParams } from "react-router-dom";

import Container from "../components/ui/Container";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSizes from "../components/product/ProductSizes";
import ProductActions from "../components/product/ProductActions";
import ProductDescription from "../components/product/ProductDescription";
import ProductSpecifications from "../components/product/ProductSpecifications";
import ProductReviews from "../components/product/ProductReviews";
import ProductFAQ from "../components/product/ProductFAQ";
import ProductCard from "../components/product/ProductCard";
import {getWishlist,toggleWishlist,} from "../lib/wishlist";

import SEO from "../components/common/SEO";
import ProductSchema from "../components/common/ProductSchema";

import ReviewForm from "../components/product/ReviewForm";

import {
  getProductBySlug,
  getProducts,
} from "../lib/products";

import type { Product } from "../types/product";

import {
  getReviews,
  type Review,
} from "../lib/reviews";

const ProductLightbox = lazy(
  () =>
    import(
      "../components/product/ProductLightbox"
    )
);

const RecentlyViewed = lazy(
  () =>
    import(
      "../components/product/RecentlyViewed"
    )
);

const EnquiryDrawer = lazy(
  () =>
    import(
      "../components/product/EnquiryDrawer"
    )
);

export default function ProductPage() {
  const { slug } = useParams();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [activeImage, setActiveImage] =
    useState("");

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const data =
        await getProductBySlug(slug);

      if (!data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      console.log("PRODUCT PRICE:", data.price, typeof data.price);
      console.log("PRODUCT COLOR:", data.color);

      const normalizedProduct: Product = {
          ...data,
          price: Number(data.price) || 0,
          images: Array.isArray(data.images)
            ? data.images
            : data.image
              ? [data.image]
              : [],
          videos: Array.isArray(data.videos)
            ? data.videos
            : [],
          sizes: data.sizes ?? {},
          specifications: {
              fabric: data.fabric ?? "",
              embroidery: data.embroidery ?? "",
              fit: data.fit ?? "",
              occasion: data.occasion ?? "",
              care: data.care ?? "",
            },
        };

        setProduct(normalizedProduct);

        setWishlisted(
          getWishlist().includes(normalizedProduct.id)
        );

        setActiveImage(
          normalizedProduct.images[0] ?? ""
        );

      const allProducts =
        await getProducts();

      setRelatedProducts(
        allProducts
          .filter(
            (item) =>
              item.category === data.category &&
              item.id !== data.id
          )
          .slice(0, 3)
      );

      setLoading(false);
    }

    loadProduct();
  }, [slug]);
    useEffect(() => {
    async function loadReviews() {
      if (!product) return;

      const data = await getReviews(
        product.slug
      );

      setReviews(data);
    }

    loadReviews();
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const viewed: string[] = JSON.parse(
      localStorage.getItem(
        "recentlyViewed"
      ) || "[]"
    );

    const updated = [
      product.slug,
      ...viewed.filter(
        (item) => item !== product.slug
      ),
    ].slice(0, 8);

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated)
    );
  }, [product]);

  if (loading) {
    return (
      <Container>
        <section className="py-24 text-center">
          <h2 className="text-2xl font-semibold">
            Loading product...
          </h2>
        </section>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <section className="py-24 text-center">
          <h1 className="text-4xl font-bold">
            Product not found
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            The product you are looking
            for does not exist.
          </p>
        </section>
      </Container>
    );
  }

  return (
    <>
      <ProductSchema product={product} />

      <SEO
        title={product.name}
        description={`${product.name} by Dress Like Nawaabs. View product details, fabric, available sizes and WhatsApp enquiry options.`}
        canonical={`https://dresslikenawaabs.pages.dev/products/${product.slug}`}
        image={product.images[0] ?? product.image}
        keywords={[
          product.category,
          product.subcategory,
          product.color,
          product.name,
          "Dress Like Nawaabs",
          "Luxury Ethnic Wear",
        ].join(", ")}
      />

        <Container className="pt-2 sm:pt-5 lg:pt-8">
          <div className="grid grid-cols-1 items-start gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">

            <div className="relative">
              <ProductGallery
                product={product}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
                onImageClick={() =>
                  setLightboxOpen(true)
                }
              />

              <button
                type="button"
                aria-label={
                  wishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                onClick={() => {
                  const next = toggleWishlist(product.id);
                  setWishlisted(next);
                  window.dispatchEvent(
                    new Event("wishlistUpdated")
                  );
                }}
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md transition hover:scale-105"
              >
                <span
                  className={
                    wishlisted
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                >
                  {wishlisted ? "♥" : "♡"}
                </span>
              </button>
            </div>

            <div className="min-w-0 pt-0 lg:pt-1">
              <ProductInfo
                category={product.category}
                name={product.name}
                color={product.color}
                rating={product.rating}
                reviews={product.reviews}
                price={product.price}
              />

              {product.availability && (
                <p className="mt-2 text-sm font-medium text-[var(--green)]">
                  {product.availability}
                </p>
              )}

              <ProductSizes
                sizes={product.sizes}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />

              <ProductActions
                product={product}
                selectedSize={selectedSize}
                onShare={async () => {
                  const url = window.location.href;

                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: product.name,
                        url,
                      });
                    } catch {
                      // User cancelled the share sheet.
                    }

                    return;
                  }

                  try {
                    await navigator.clipboard.writeText(url);
                  } catch {
                    // Clipboard unavailable.
                  }
                }}
              />

              <ProductDescription
                description={product.description}
              />

              <ProductSpecifications
                specifications={
                  product.specifications
                }
              />

              <ProductReviews
                reviews={reviews}
              />

              <ReviewForm
                productSlug={product.slug}
                onReviewAdded={async () => {
                  const data =
                    await getReviews(
                      product.slug
                    );

                  setReviews(data);
                }}
              />

              <ProductFAQ />

            </div>

           </div>
</Container>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <Container>

              <h2 className="mb-6 font-serif text-2xl font-bold sm:text-3xl">
                You May Also Like
              </h2>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                  />
                ))}
              </div>

            </Container>
          </section>
        )}

        <Container>
          <Suspense fallback={null}>
            <RecentlyViewed
              currentSlug={product.slug}
            />
          </Suspense>
        </Container>

        <Suspense fallback={null}>
          <EnquiryDrawer
            open={drawerOpen}
            onClose={() =>
              setDrawerOpen(false)
            }
          />
        </Suspense>

        <Suspense fallback={null}>
          <ProductLightbox
            images={product.images}
            activeImage={activeImage}
            open={lightboxOpen}
            onClose={() =>
              setLightboxOpen(false)
            }
            onImageChange={setActiveImage}
          />
        </Suspense>
    </>
  );
}