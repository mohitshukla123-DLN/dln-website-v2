import { Link } from "react-router-dom";
import Container from "../ui/Container";

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <Container className="py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>
            <h2 className="text-2xl font-bold">
              Dress Like Nawaabs
            </h2>

            <p className="mt-4 text-sm text-gray-300 leading-7">
              Premium Indian ethnic wear inspired by royal heritage,
              handcrafted with elegance and timeless craftsmanship.
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li><Link to="/">Home</Link></li>

              <li><Link to="/shop">Shop</Link></li>

              <li><Link to="/about">About Us</Link></li>

              <li><Link to="/contact">Contact</Link></li>

              <li><Link to="/size-guide">Size Guide</Link></li>

            </ul>
          </div>

          {/* Policies */}

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Policies
            </h3>

            <ul className="space-y-3 text-gray-300">
                    <li><Link to="/policies">Policies</Link></li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Contact
            </h3>

            <div className="space-y-3 text-gray-300">

              <p>📞 +91 XXXXX XXXXX</p>

              <p>✉️ contact@dresslikenawaabs.com</p>

              <p>📍 India</p>

            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Dress Like Nawaabs.
          All Rights Reserved.
        </div>

      </Container>
    </footer>
  );
}