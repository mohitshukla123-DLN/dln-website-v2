import { useEffect } from "react";

interface Props {
  title: string;
}

const SITE_NAME = "Dress Like Nawaabs";

export default function PageTitle({ title }: Props) {
  useEffect(() => {
    document.title =
      title === "Home"
        ? SITE_NAME
        : `${title} | ${SITE_NAME}`;
  }, [title]);

  return null;
}