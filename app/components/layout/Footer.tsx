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

          <div className="mt-6 flex items-center justify-center gap-4">
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4405F] text-white shadow-sm transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/>
                </svg>
              </a>
            )}

            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M13.5 21v-8h2.75l.5-3H13.5V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2Z"/>
                </svg>
              </a>
            )}

            {youtube && (
              <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-sm transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.5.4a3 3 0 0 0-2.1 2C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.5.4 8.5.4 8.5.4s7 0 8.5-.4a3 3 0 0 0 2.1-2.1C23 15.2 23 12 23 12Zm-13 3.5v-7l6 3.5-6 3.5Z"/>
                </svg>
              </a>
            )}

            {pinterest && (
              <a href={pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E60023] text-white shadow-sm transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-1.6 0-3.5.4-5l1.1-4.7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.7 2 2.1 0 3.7-2.2 3.7-5.3 0-2.8-2-4.8-5-4.8-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.4l-.3 1.2c-.1.4-.3.5-.7.3-1.7-.8-2.7-3.2-2.7-5.1 0-4.1 3-8 8.7-8 4.6 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.9 8.3-1.3 0-2.5-.7-2.9-1.5l-.8 3.1c-.3 1.1-1 2.5-1.5 3.3.9.3 1.9.5 2.9.5A10 10 0 1 0 12 2Z"/>
                </svg>
              </a>
            )}

            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-sm transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M6.5 8.5A2.5 2.5 0 1 0 6.5 3a2.5 2.5 0 0 0 0 5.5ZM4 10h5v11H4V10Zm8 0h4.8v1.5h.1c.7-1.2 2-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-5v-4.8c0-1.2 0-2.8-1.8-2.8-1.8 0-2.1 1.4-2.1 2.7V21h-5V10Z"/>
                </svg>
              </a>
            )}
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