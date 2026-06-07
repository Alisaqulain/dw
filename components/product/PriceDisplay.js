import { formatPrice } from "@/lib/utils";

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  className = "",
}) {
  const sale = Number(price) || 0;
  const original = Number(originalPrice) || 0;
  const hasDiscount = original > sale;
  const discount = getDiscountPercent(sale, original);

  const saleCls = {
    sm: "text-base font-bold text-emerald-600",
    md: "text-lg font-bold text-emerald-600 sm:text-xl",
    lg: "text-2xl font-bold text-emerald-600 sm:text-3xl",
  }[size];

  const originalCls = {
    sm: "text-xs text-slate-400 line-through",
    md: "text-sm text-slate-400 line-through sm:text-base",
    lg: "text-base text-slate-400 line-through sm:text-lg",
  }[size];

  const badgeCls = {
    sm: "rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white",
    md: "rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white",
    lg: "rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white",
  }[size];

  if (!hasDiscount) {
    return (
      <div className={className}>
        <span className={saleCls.replace("text-emerald-600", "text-slate-900")}>{formatPrice(sale)}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={saleCls}>{formatPrice(sale)}</span>
      <span className={originalCls}>{formatPrice(original)}</span>
      <span className={badgeCls}>{discount}% OFF</span>
    </div>
  );
}
