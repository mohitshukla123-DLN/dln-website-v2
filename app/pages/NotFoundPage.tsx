import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <>

      <section className="py-24">
        <Container className="text-center">
          <h1 className="text-7xl font-bold text-[var(--teal)]">
            404
          </h1>

          <h2 className="mt-6 text-3xl font-semibold">
            Page Not Found
          </h2>

          <p className="mt-4 text-[var(--muted)]">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <Link to="/">
            <Button className="mt-10">
              Back to Home
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}