import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Container from "../ui/Container";
import fallbackLogo from "../../assets/logos/logo-navbar.png";
import { supabase } from "../../lib/supabase";
import { getWishlist } from "../../lib/wishlist";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors ${
    isActive
      ? "text-[var(--teal)] font-semibold"
      : "hover:text-[var(--teal)]"
  }`;

export default function Navbar() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadLogo() {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url")
        .eq("id", 1)
        .single();

      setLogoUrl(data?.logo_url?.trim() || "");
    }

    loadLogo();

    const updateWishlist = () => {
      setWishlistCount(getWishlist().length);
    };

    updateWishlist();

    window.addEventListener("storage", updateWishlist);
    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("storage", updateWishlist);
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);

  const currentLogo = logoUrl || fallbackLogo;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" aria-label="Dress Like Nawaabs Home">
          <img
            src={currentLogo}
            alt="Dress Like Nawaabs"
            className="h-14 w-14 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackLogo;
            }}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/new-arrivals" className={navLinkClass}>
            New Arrivals
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          <NavLink to="/wishlist" className={navLinkClass}>
            ❤️ Wishlist

            {wishlistCount > 0 && (
              <span className="ml-2 rounded-full bg-[var(--teal)] px-2 py-1 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          <Link
            to="/shop"
            aria-label="Search Products"
            className="rounded-full p-2 transition-colors hover:bg-black/5"
          >
            🔍
          </Link>
        </nav>
      </Container>
    </header>
  );
}