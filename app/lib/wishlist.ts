const STORAGE_KEY = "wishlist";

export function getWishlist(): number[] {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
}

export function isWishlisted(id: number) {
  return getWishlist().includes(id);
}

export function toggleWishlist(id: number) {
  const items = getWishlist();

  if (items.includes(id)) {
    const updated = items.filter(
      (item) => item !== id
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return false;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...items, id])
  );

  return true;
}