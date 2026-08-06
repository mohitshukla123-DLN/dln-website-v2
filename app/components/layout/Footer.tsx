import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Footer() {

const [siteName, setSiteName] = useState("Dress Like Nawaabs");
const [tagline, setTagline] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [address, setAddress] = useState("");

useEffect(() => {
  async function loadSettings() {
    const { data } = await supabase
      .from("site_settings")
      .select("site_name,tagline,phone,email,address")
      .limit(1)
      .single();

    if (!data) return;

    setSiteName(data.site_name ?? "Dress Like Nawaabs");
    setTagline(data.tagline ?? "");
    setPhone(data.phone ?? "");
    setEmail(data.email ?? "");
    setAddress(data.address ?? "");
  }

  loadSettings();
}, []);

  return (
    <footer className="mt-24 bg-black text-white">
      <Container className="py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>
            <h2 className="text-2xl font-bold">
              {siteName}
            </h2>

            <p className="mt-4 text-sm text-gray-300 leading-7">
              {tagline}
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

              <p>📞 {phone}</p>

              <p>✉️ {email}</p>

              <p>📍 {address}</p>

            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {siteName}.
          All Rights Reserved.
        </div>

      </Container>
    </footer>
  );
}