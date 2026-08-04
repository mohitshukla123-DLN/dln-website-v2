import { useEffect, useState } from "react";
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
import RecentlyViewed from "../components/product/RecentlyViewed";
import ProductCard from "../components/product/ProductCard";
import EnquiryDrawer from "../components/product/EnquiryDrawer";
import ProductLightbox from "../components/product/ProductLightbox";
import ProductShare from "../components/product/ProductShare";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/common/SEO";
import ProductSchema from "../components/common/ProductSchema";



import { products } from "../data/products";

export default function ProductPage() {
  const { slug } = useParams();

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <Container>
        <section className="py-24 text-center">
          <h1 className="text-4xl font-bold">
            Product not found
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            The product you are looking for does not exist.
          </p>
        </section>
      </Container>
    );
  }

  const [selectedSize, setSelectedSize] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [activeImage, setActiveImage] = useState(
    product.images[0]
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
  const viewed: string[] = JSON.parse(
    localStorage.getItem("recentlyViewed") || "[]"
  );

  const updated = [
    product.slug,
    ...viewed.filter((slug) => slug !== product.slug),
  ].slice(0, 8);

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(updated)
  );
}, [product.slug]);

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 3);

  return (
    <>
    <ProductSchema product={product} />
    
    <SEO
      title={product.name}
      description={product.description}
      canonical={`https://dresslikenawaabs.pages.dev/products/${product.slug}`}
      image={product.images[0]}
      keywords={[
        product.category,
        product.subcategory,
        product.color,
        product.name,
        "Dress Like Nawaabs",
        "Luxury Ethnic Wear",
      ].join(", ")}
    />
    
    <PageTitle title={product.name} />
    <section className="py-20">
      <Container>

        {/* Breadcrumb */}

        <div className="mb-10 text-sm text-[var(--muted)]">

          <Link
            to="/"
            className="hover:text-[var(--teal)]"
          >
            Home
          </Link>

          {" / "}

          <Link
            to="/shop"
            className="hover:text-[var(--teal)]"
          >
            Shop
          </Link>

          {" / "}

          <span className="text-[var(--foreground)]">
            {product.name}
          </span>

        </div>

        <div className="grid gap-16 lg:grid-cols-2">

          <ProductGallery
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            onImageClick={() => setLightboxOpen(true)}
          />

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
              <ProductShare title={product.name} />
            </div>

            <ProductDescription
              description={product.description}
            />

            <ProductSpecifications
              specifications={product.specifications}
            />

            <ProductReviews
              reviews={[
                {
                  name: "Priya Sharma",
                  rating: 5,
                  comment:
                    "Beautiful craftsmanship and premium quality fabric. Highly recommended.",
                  date: "12 July 2026",
                },
                {
                  name: "Ayesha Khan",
                  rating: 5,
                  comment:
                    "Exactly as shown in the pictures. Loved the embroidery.",
                  date: "3 June 2026",
                },
              ]}
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

        <RecentlyViewed
          currentSlug={product.slug}
        />

      </Container>

      <EnquiryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <ProductLightbox
        images={product.images}
        activeImage={activeImage}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onImageChange={setActiveImage}
      />

    </section>
    </>
  );
}