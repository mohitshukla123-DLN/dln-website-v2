import { useState } from "react";

interface Props {
  title: string;
}

export default function ProductShare({
  title,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-xl border border-black/10 px-5 py-3 transition hover:border-[var(--teal)] hover:text-[var(--teal)]"
    >
      {copied ? "✓ Link Copied" : "🔗 Share Product"}
    </button>
  );
}