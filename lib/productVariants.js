const COLOR_HEX = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  red: "#dc2626",
  rose: "#f43f5e",
  pink: "#ec4899",
  purple: "#9333ea",
  blue: "#2563eb",
  navy: "#1e3a5f",
  green: "#16a34a",
  teal: "#0d9488",
  gold: "#d4a017",
  silver: "#9ca3af",
  beige: "#d4b896",
  brown: "#78350f",
  grey: "#6b7280",
  gray: "#6b7280",
  nude: "#c9a88a",
  coral: "#f97316",
};

export function guessColorHex(name) {
  if (!name) return "#94a3b8";
  const key = String(name).toLowerCase().trim();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  if (key.startsWith("#") && /^#[0-9a-f]{3,8}$/i.test(key)) return key;
  for (const [word, hex] of Object.entries(COLOR_HEX)) {
    if (key.includes(word)) return hex;
  }
  return "#94a3b8";
}

export function normalizeColorEntry(entry) {
  if (!entry) return null;
  if (typeof entry === "string") {
    const name = entry.trim();
    if (!name) return null;
    return { name, hex: guessColorHex(name) };
  }
  const name = String(entry.name || "").trim();
  if (!name) return null;
  return {
    name,
    hex: entry.hex?.trim() || guessColorHex(name),
  };
}

export function getProductColors(product) {
  if (!product) return [];
  const fromArray = (product.colors || []).map(normalizeColorEntry).filter(Boolean);
  if (fromArray.length) return fromArray;
  if (product.color?.trim()) {
    return [normalizeColorEntry(product.color)];
  }
  return [];
}

export function getProductSizes(product) {
  if (!product) return [];
  const fromArray = (product.sizes || []).map((s) => String(s).trim()).filter(Boolean);
  if (fromArray.length) return fromArray;
  if (product.size?.trim()) return [product.size.trim()];
  return [];
}

export function productHasVariantOptions(product) {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  return colors.length > 0 || sizes.length > 0;
}

export function requiresVariantSelection(product) {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  return colors.length > 1 || sizes.length > 1 || (colors.length > 0 && sizes.length > 0);
}

export function getCartLineId(productId, color = "", size = "") {
  return `${productId}|${color || ""}|${size || ""}`;
}

export function parseColorsInput(text) {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, hex] = part.split(":").map((s) => s.trim());
      return normalizeColorEntry(hex ? { name, hex } : name);
    })
    .filter(Boolean);
}

export function formatColorsForInput(colors) {
  return getProductColors({ colors })
    .map((c) => (c.hex && c.hex !== guessColorHex(c.name) ? `${c.name}:${c.hex}` : c.name))
    .join(", ");
}

export function parseSizesInput(text) {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatSizesForInput(sizes) {
  return (sizes || []).join(", ");
}
