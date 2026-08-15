import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Container from "../ui/Container";
import fallbackLogo from "../../assets/logos/logo-navbar.png";
import { supabase } from "../../lib/supabase";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors ${
    isActive
      ? "text-[var(--teal)] font-semibold"
      : "hover:text-[var(--teal)]"
  }`;

export default function Navbar() {
  const [logoUrl, setLogoUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
  }, []);

  const currentLogo = logoUrl || fallbackLogo;

  return (
  <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
    <Container>
      <div className="flex h-20 items-center justify-between">
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

        {/* Desktop navigation */}
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
            Wishlist
          </NavLink>

          <NavLink to="/policies" className={navLinkClass}>
            Policies
          </NavLink>

          <Link
            to="/shop"
            aria-label="Search Products"
            className="rounded-full p-2 transition-colors hover:bg-black/5"
          >
            🔍
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-2xl md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="border-t border-black/5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </NavLink>

            <NavLink
              to="/new-arrivals"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              New Arrivals
            </NavLink>

            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>

            <NavLink
              to="/wishlist"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/policies"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Policies
            </NavLink>

            <Link
              to="/shop"
              aria-label="Search Products"
              onClick={() => setMenuOpen(false)}
              className="py-2"
            >
              🔍 Search Products
            </Link>
          </div>
        </nav>
      )}
    </Container>
  </header>
);}