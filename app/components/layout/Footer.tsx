import Container from "../ui/Container";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Footer() {
  const [siteName, setSiteName] = useState("Dress Like Nawaabs");
  const [tagline, setTagline] = useState("");

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");

  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [copyrightText, setCopyrightText] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select(
          "site_name,tagline,phone,whatsapp,email,address,google_maps,instagram,facebook,youtube,pinterest,linkedin,copyright_text"
        )
        .limit(1)
        .single();

      if (!data) return;

      setSiteName(data.site_name ?? "Dress Like Nawaabs");
      setTagline(data.tagline ?? "");

      setPhone(data.phone ?? "");
      setWhatsapp(data.whatsapp ?? "");
      setEmail(data.email ?? "");
      setAddress(data.address ?? "");
      setGoogleMaps(data.google_maps ?? "");

      setInstagram(data.instagram ?? "");
      setFacebook(data.facebook ?? "");
      setYoutube(data.youtube ?? "");
      setPinterest(data.pinterest ?? "");
      setLinkedin(data.linkedin ?? "");

      setCopyrightText(data.copyright_text ?? "");
    }

    loadSettings();
  }, []);

  return (
    <footer className="mt-12 bg-black text-white sm:mt-16">
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {siteName}
          </h2>

          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="mt-4 text-sm text-gray-300 transition hover:text-white sm:text-base"
            >
              {phone}
            </a>
          )}

          <div className="mt-5 flex items-center justify-center gap-3">
            {[
              { url: instagram, label: "Instagram", icon: "◎" },
              { url: facebook, label: "Facebook", icon: "f" },
              { url: youtube, label: "YouTube", icon: "▶" },
              { url: pinterest, label: "Pinterest", icon: "P" },
              { url: linkedin, label: "LinkedIn", icon: "in" },
            ]
              .filter(({ url }) => Boolean(url))
              .map(({ url, label, icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-medium transition hover:border-white hover:bg-white hover:text-black"
                >
                  {icon}
                </a>
              ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-gray-500 sm:mt-10">
          {copyrightText ||
            `© ${new Date().getFullYear()} ${siteName}. All Rights Reserved.`}
        </div>
      </Container>
    </footer>
  );
}