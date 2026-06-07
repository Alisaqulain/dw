export default function Stars({ rating = 0, size = "sm", showValue = false, alwaysShow = false }) {
  const cls = size === "xs" ? "h-3.5 w-3.5" : size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-8 w-8";
  const displayRating = alwaysShow && rating <= 0 ? 5 : Math.round(rating);
  const filled = Math.min(5, Math.max(0, displayRating));

  if (!alwaysShow && rating <= 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`${cls} ${s <= filled ? "text-amber-400" : "text-slate-200"} transition`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-600">
          {(rating > 0 ? rating : 5).toFixed(1)}
        </span>
      )}
    </div>
  );
}
