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
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-white hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1"/></svg>
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-white hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3.5l.5-4H13V9c0-.7.3-1 1-1Z"/></svg>
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-white hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>
              </a>
            )}
            {pinterest && (
              <a href={pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-white hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M12.2 3C7.4 3 5 6.4 5 9.2c0 2.2.8 4.1 2.6 4.8.3.1.5 0 .6-.3l.2-.9c.1-.3 0-.4-.2-.7-.5-.6-.8-1.4-.8-2.5 0-3.2 2.4-5.9 6.2-5.9 3.4 0 5.3 2.1 5.3 4.9 0 3.7-1.6 6.8-4 6.8-1.3 0-2.3-1.1-2-2.4.4-1.5 1.1-3.1 1.1-4.2 0-1-.5-1.8-1.5-1.8-1.2 0-2.1 1.2-2.1 2.9 0 1.1.4 1.8.4 1.8s-1.4 5.9-1.7 6.9c-.5 1.6-.1 3.6 0 3.8.1.1.2.1.3 0 .1-.1 1.5-1.8 2-3.4.2-.9 1.1-4.4 1.1-4.4.5.9 1.8 1.7 3.3 1.7 4.3 0 7.2-3.9 7.2-9.1C19 6.7 16.4 3 12.2 3Z"/></svg>
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-white hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M5 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 10h4v11H3V10Zm6 0h3.8v1.5h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H9V10Z"/></svg>
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