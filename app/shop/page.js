"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Loading";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/constants";
import ShopCROHeader from "@/components/cro/ShopCROHeader";
import WhyChooseUs from "@/components/cro/WhyChooseUs";

function buildShopParams({
  search = "",
  collection = "",
  sort = "newest",
  minPrice = "",
  maxPrice = "",
  minRating = "0",
  inStock = false,
  onSale = false,
  featured = false,
  isBundle = false,
} = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (collection) params.set("collection", collection);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (minRating && minRating !== "0") params.set("minRating", minRating);
  if (inStock) params.set("inStock", "true");
  if (onSale) params.set("onSale", "true");
  if (featured) params.set("featured", "true");
  if (isBundle) params.set("isBundle", "true");
  return params;
}

function getFilterState(searchParams) {
  return {
    search: searchParams.get("search") || "",
    collection: searchParams.get("collection") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "0",
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    featured: searchParams.get("featured") === "true",
    isBundle: searchParams.get("isBundle") === "true",
  };
}

function pillClass(active) {
  return `shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
    active
      ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
      : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
  }`;
}

function DesktopFilters({ filters, collectionOptions, onNavigate, onClear }) {
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);

  useEffect(() => {
    setPriceMin(filters.minPrice);
    setPriceMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Collections</h3>
        <div className="mt-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate({ collection: "" })}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              !filters.collection ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          {collectionOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onNavigate({ collection: c })}
              className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                filters.collection === c ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800">Price Range (₹)</h3>
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <button
            type="button"
            onClick={() => onNavigate({ minPrice: priceMin, maxPrice: priceMax })}
            className="rounded-full bg-[#0c1929] py-2 text-sm font-semibold text-white hover:bg-[#1e3a5f]"
          >
            Apply Price
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800">Rating</h3>
        <div className="mt-3 flex flex-col gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onNavigate({ minRating: String(r) })}
              className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                filters.minRating === String(r) ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {r === 0 ? "All Ratings" : `${r}★ & above`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-800">Quick Filters</h3>
        <div className="flex flex-col gap-1.5">
          {[
            { key: "inStock", label: "In Stock Only" },
            { key: "onSale", label: "On Sale" },
            { key: "featured", label: "Featured" },
            { key: "isBundle", label: "Bundles & Combos" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate({ [key]: !filters[key] })}
              className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                filters[key] ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}

function MobileFilters({ filters, collectionOptions, onNavigate, onClear }) {
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);

  useEffect(() => {
    setPriceMin(filters.minPrice);
    setPriceMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const applyPrice = () => {
    onNavigate({ minPrice: priceMin, maxPrice: priceMax });
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Collections</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate({ collection: "" })}
            className={pillClass(!filters.collection)}
          >
            All
          </button>
          {collectionOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onNavigate({ collection: c })}
              className={pillClass(filters.collection === c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Filters</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { key: "inStock", label: "In Stock" },
            { key: "onSale", label: "On Sale" },
            { key: "featured", label: "Featured" },
            { key: "isBundle", label: "Bundles" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate({ [key]: !filters[key] })}
              className={pillClass(filters[key])}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rating</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onNavigate({ minRating: String(r) })}
              className={pillClass(filters.minRating === String(r))}
            >
              {r === 0 ? "All" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Price (₹)</p>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
          />
          <button
            type="button"
            onClick={applyPrice}
            className="shrink-0 rounded-xl bg-[#0c1929] px-4 text-sm font-semibold text-white"
          >
            Go
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-600"
      >
        Clear All Filters
      </button>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [apiCollections, setApiCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const filters = getFilterState(searchParams);

  const collectionOptions = [
    ...new Set([
      ...COLLECTIONS.filter((c) => c.href.includes("collection=")).map((c) => c.label),
      ...apiCollections,
    ]),
  ].filter(Boolean);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = buildShopParams(getFilterState(searchParams));
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setApiCollections(data.collections || []);
    setTotal(data.total ?? (data.products || []).length);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const navigateWithFilters = (overrides = {}) => {
    const next = { ...filters, ...overrides };
    const params = buildShopParams(next);
    const url = `/shop${params.toString() ? `?${params}` : ""}`;
    router.push(url, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  const handleSortChange = (sort) => {
    navigateWithFilters({ sort });
  };

  const pageTitle = filters.search
    ? `Results for "${filters.search}"`
    : filters.collection ||
      (filters.onSale ? "On Sale" : filters.featured ? "Featured" : filters.isBundle ? "Bundles" : "All Products");

  const activeFilters = [
    filters.collection && { key: "collection", label: filters.collection },
    filters.minPrice && { key: "minPrice", label: `Min ₹${filters.minPrice}` },
    filters.maxPrice && { key: "maxPrice", label: `Max ₹${filters.maxPrice}` },
    filters.minRating !== "0" && { key: "minRating", label: `${filters.minRating}★+` },
    filters.inStock && { key: "inStock", label: "In Stock" },
    filters.onSale && { key: "onSale", label: "On Sale" },
    filters.featured && { key: "featured", label: "Featured" },
    filters.isBundle && { key: "isBundle", label: "Bundles" },
  ].filter(Boolean);

  const removeFilter = (key) => {
    const overrides = {
      collection: filters.collection,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      inStock: filters.inStock,
      onSale: filters.onSale,
      featured: filters.featured,
      isBundle: filters.isBundle,
    };
    if (key === "collection") overrides.collection = "";
    if (key === "minPrice") overrides.minPrice = "";
    if (key === "maxPrice") overrides.maxPrice = "";
    if (key === "minRating") overrides.minRating = "0";
    if (key === "inStock") overrides.inStock = false;
    if (key === "onSale") overrides.onSale = false;
    if (key === "featured") overrides.featured = false;
    if (key === "isBundle") overrides.isBundle = false;
    navigateWithFilters(overrides);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ShopCROHeader bestsellerSlug={products.find((p) => p.bestseller)?.slug || products[0]?.slug} />
      <WhyChooseUs title="Why Customers Choose TrustSilcon" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">Home / Shop</p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{total} products</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="min-h-[44px] w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-sky-400 sm:w-auto"
          >
            <option value="newest">Newest</option>
            <option value="sale">Hot Sale</option>
            <option value="bestseller">Bestsellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => removeFilter(f.key)}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100"
            >
              {f.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="text-xs font-medium text-slate-500 hover:text-sky-600">
            Clear all
          </button>
        </div>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {COLLECTIONS.map((col) => {
          const colParam = col.href.includes("collection=")
            ? decodeURIComponent(col.href.split("collection=")[1]?.split("&")[0] || "")
            : "";
          const sortParam = col.href.includes("sort=")
            ? col.href.split("sort=")[1]?.split("&")[0]
            : "";
          const isActive = colParam
            ? filters.collection === colParam && !filters.onSale && !filters.featured && !filters.isBundle
            : sortParam
              ? filters.sort === sortParam && searchParams.has("sort")
              : false;

          const chipParams = buildShopParams({
            ...filters,
            collection: colParam || "",
            sort: sortParam || filters.sort,
          });
          if (sortParam === "newest") chipParams.set("sort", "newest");

          return (
            <Link
              key={col.slug}
              href={`/shop?${chipParams}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isActive ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              {col.icon} {col.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile: all filters visible on page — no popup */}
      <div className="mt-4 lg:hidden">
        <MobileFilters
          filters={filters}
          collectionOptions={collectionOptions}
          onNavigate={navigateWithFilters}
          onClear={clearFilters}
        />
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-36 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <DesktopFilters
              filters={filters}
              collectionOptions={collectionOptions}
              onNavigate={navigateWithFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20"><ProductGridSkeleton /></div>}>
      <ShopContent />
    </Suspense>
  );
}
