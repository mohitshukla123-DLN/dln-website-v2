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
import ProductShare from "../components/product/ProductShare";
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

      const normalizedProduct: Product = {
          ...data,
          images: Array.isArray(data.images)
            ? data.images
            : data.image
              ? [data.image]
              : [],
          sizes: data.sizes ?? {},
          specifications: data.specifications ?? {},
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

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">

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

            <div>

              <ProductInfo
                category={product.category}
                name={product.name}
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
              />

              <div className="mt-4">
                <ProductShare
                  title={product.name}
                />
              </div>

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
          <section className="mt-24">
            <Container>

              <h2 className="mb-10 text-4xl font-bold">
                You May Also Like
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

      </section>
    </>
  );
}