"use client";

import { getProductColors, getProductSizes } from "@/lib/productVariants";

export default function VariantSelector({
  product,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  compact = false,
}) {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);

  if (!colors.length && !sizes.length) return null;

  return (
    <div className={`space-y-4 ${compact ? "space-y-3" : ""}`}>
      {colors.length > 0 && (
        <div>
          <p className={`font-semibold text-slate-800 ${compact ? "text-xs" : "text-sm"}`}>
            Colour: <span className="font-medium text-slate-600">{selectedColor || "Select"}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => {
              const active = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => onColorChange(c.name)}
                  className={`group flex items-center gap-2 rounded-lg border px-2 py-1.5 transition ${
                    active
                      ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-full border border-slate-200 ${compact ? "h-5 w-5" : "h-6 w-6"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  {!compact && (
                    <span className={`text-xs font-medium ${active ? "text-sky-700" : "text-slate-600"}`}>
                      {c.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className={`font-semibold text-slate-800 ${compact ? "text-xs" : "text-sm"}`}>
            Size: <span className="font-medium text-slate-600">{selectedSize || "Select"}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function validateVariantSelection(product, selectedColor, selectedSize) {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  if (colors.length && !selectedColor) return "Please select a colour";
  if (sizes.length && !selectedSize) return "Please select a size";
  return null;
}
