import { useState } from "react";
import Button from "../ui/Button";

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
    <Button
      type="button"
      onClick={handleShare}
      className="flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap px-1.5 text-[10px] leading-4 sm:h-10 sm:w-auto sm:px-2 sm:text-sm sm:leading-5"
    >
      {copied ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.6-4.6" />
            <path d="m8.2 13.2 7.6 4.6" />
          </svg>

          <span>Share</span>
        </>
      )}
    </Button>
  );
}