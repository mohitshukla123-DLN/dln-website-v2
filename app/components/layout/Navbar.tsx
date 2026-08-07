import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Container from "../ui/Container";
import logo from "../../assets/logos/logo-navbar.png";
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
      const { data, error } = await supabase
        .from("site_settings")
        .select("logo_url")
        .limit(1);

      console.log("Navbar data:", data);
      console.log("Navbar error:", error);

      if (data && data.length > 0 && data[0].logo_url) {
        console.log("Setting logo:", data[0].logo_url);
        setLogoUrl(data[0].logo_url);
      } else {
        console.log("No logo found.");
      }
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <Container className="flex h-20 items-center justify-between">

        <Link to="/">
          <img
            src={
              logoUrl
                ? `${logoUrl}?v=${Date.now()}`
                : logo
            }
            alt="Dress Like Nawaabs"
            className="h-14 w-14 rounded-full object-cover"
            onError={(e) => {
              console.log("Navbar logo failed:", logoUrl);
              (e.currentTarget as HTMLImageElement).src = logo;
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