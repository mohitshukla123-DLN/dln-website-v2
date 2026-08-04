import { Link } from "react-router-dom";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import SEO from "../components/common/SEO";

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for could not be found."
        canonical="https://dresslikenawaabs.pages.dev/404"
      />

      <section className="py-24">
        <Container className="text-center">
          <h1 className="text-7xl font-bold text-[var(--teal)]">
            404
          </h1>

          <h2 className="mt-6 text-3xl font-semibold">
            Page Not Found
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            The page you're looking for doesn't exist, may have been moved,
            or the URL might be incorrect.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/">
              <Button>
                Back to Home
              </Button>
            </Link>

            <Link to="/shop">
              <Button className="bg-black hover:bg-black/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}