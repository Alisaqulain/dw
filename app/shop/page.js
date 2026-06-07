"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Loading";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/constants";

function FilterSidebar({ draft, setDraft, collectionOptions, onApply }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Collections</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="collection"
              checked={!draft.collection}
              onChange={() => setDraft({ ...draft, collection: "" })}
              className="text-sky-500"
            />
            All
          </label>
          {collectionOptions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="collection"
                checked={draft.collection === c}
                onChange={() => setDraft({ ...draft, collection: c })}
                className="text-sky-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">Price Range</h3>
        <div className="mt-3 flex gap-2">
          <input type="number" placeholder="Min" value={draft.minPrice} onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
          <input type="number" placeholder="Max" value={draft.maxPrice} onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">Rating</h3>
        <div className="mt-3 space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-slate-600">
              <input type="radio" name="rating" checked={draft.minRating === String(r)} onChange={() => setDraft({ ...draft, minRating: String(r) })} className="text-sky-500" />
              {r === 0 ? "All Ratings" : `${r}★ & above`}
            </label>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={draft.inStock} onChange={(e) => setDraft({ ...draft, inStock: e.target.checked })} className="rounded text-sky-500" />
        In Stock Only
      </label>
      <button onClick={onApply} className="w-full rounded-full bg-[#0c1929] py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]">Apply Filters</button>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [apiCollections, setApiCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const selectedCollection = searchParams.get("collection") || "";
  const selectedSort = searchParams.get("sort") || "newest";
  const selectedSearch = searchParams.get("search") || "";
  const selectedFeatured = searchParams.get("featured") === "true";
  const selectedIsBundle = searchParams.get("isBundle") === "true";
  const selectedMinPrice = searchParams.get("minPrice") || "";
  const selectedMaxPrice = searchParams.get("maxPrice") || "";
  const selectedMinRating = searchParams.get("minRating") || "0";
  const selectedInStock = searchParams.get("inStock") === "true";

  const [draft, setDraft] = useState({
    collection: selectedCollection,
    minPrice: selectedMinPrice,
    maxPrice: selectedMaxPrice,
    minRating: selectedMinRating,
    inStock: selectedInStock,
  });

  const collectionOptions = [
    ...new Set([
      ...COLLECTIONS.filter((c) => c.href.includes("collection=")).map((c) => c.label),
      ...apiCollections,
    ]),
  ].filter(Boolean);

  useEffect(() => {
    setDraft({
      collection: selectedCollection,
      minPrice: selectedMinPrice,
      maxPrice: selectedMaxPrice,
      minRating: selectedMinRating,
      inStock: selectedInStock,
    });
  }, [selectedCollection, selectedMinPrice, selectedMaxPrice, selectedMinRating, selectedInStock]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSearch) params.set("search", selectedSearch);
    if (selectedCollection) params.set("collection", selectedCollection);
    if (selectedSort) params.set("sort", selectedSort);
    if (selectedMinPrice) params.set("minPrice", selectedMinPrice);
    if (selectedMaxPrice) params.set("maxPrice", selectedMaxPrice);
    if (selectedMinRating && selectedMinRating !== "0") params.set("minRating", selectedMinRating);
    if (selectedInStock) params.set("inStock", "true");
    if (selectedFeatured) params.set("featured", "true");
    if (selectedIsBundle) params.set("isBundle", "true");

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setApiCollections(data.collections || []);
    setTotal((data.products || []).length);
    setLoading(false);
  }, [
    selectedSearch,
    selectedCollection,
    selectedSort,
    selectedMinPrice,
    selectedMaxPrice,
    selectedMinRating,
    selectedInStock,
    selectedFeatured,
    selectedIsBundle,
  ]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (draft.collection) params.set("collection", draft.collection);
    if (selectedSort && selectedSort !== "newest") params.set("sort", selectedSort);
    if (selectedSearch) params.set("search", selectedSearch);
    if (draft.minPrice) params.set("minPrice", draft.minPrice);
    if (draft.maxPrice) params.set("maxPrice", draft.maxPrice);
    if (draft.minRating && draft.minRating !== "0") params.set("minRating", draft.minRating);
    if (draft.inStock) params.set("inStock", "true");
    if (selectedFeatured) params.set("featured", "true");
    if (selectedIsBundle) params.set("isBundle", "true");
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  const handleSortChange = (sort) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== "newest") params.set("sort", sort);
    else params.delete("sort");
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  const pageTitle =
    selectedCollection ||
    (selectedFeatured ? "Featured" : selectedIsBundle ? "Bundles" : "All Products");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">Home / Shop</p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{total} products</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setFilterOpen(true)} className="flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50 lg:hidden">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="min-h-[44px] flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-sky-400 sm:flex-none"
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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {COLLECTIONS.map((col) => {
          const colParam = col.href.includes("collection=")
            ? decodeURIComponent(col.href.split("collection=")[1]?.split("&")[0] || "")
            : "";
          const isActive = colParam
            ? selectedCollection === colParam
            : col.href.includes("sort=") && selectedSort === col.href.split("sort=")[1]?.split("&")[0];
          return (
            <Link
              key={col.slug}
              href={col.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${isActive ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"}`}
            >
              {col.icon} {col.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-36 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <FilterSidebar
              draft={draft}
              setDraft={setDraft}
              collectionOptions={collectionOptions}
              onApply={applyFilters}
            />
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" description="Try adjusting your filters." action={<Link href="/shop" className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white">Clear Filters</Link>} />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {filterOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setFilterOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="text-slate-400">✕</button>
            </div>
            <FilterSidebar
              draft={draft}
              setDraft={setDraft}
              collectionOptions={collectionOptions}
              onApply={() => { applyFilters(); setFilterOpen(false); }}
            />
          </div>
        </>
      )}
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
