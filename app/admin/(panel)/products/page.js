"use client";

import { useEffect, useState } from "react";
import { formatPrice, createSlug } from "@/lib/utils";
import { compressImageFile } from "@/lib/clientCompress";
import { getDiscountPercent } from "@/components/product/PriceDisplay";
import {
  formatColorsForInput,
  formatSizesForInput,
  parseColorsInput,
  parseSizesInput,
  getProductColors,
  getProductSizes,
} from "@/lib/productVariants";

const emptyProduct = {
  name: "", shortDescription: "", fullDescription: "", price: "", comparePrice: "",
  stock: "", category: "Wellness", shopCollection: "For Her", tags: "", material: "Medical-grade silicone",
  size: "", color: "", colorsInput: "", sizesInput: "",
  discreetPackaging: true, featured: false, active: true, bestseller: false,
  dealOfDay: false, isBundle: false, images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState("");

  const fetchProducts = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadNote("Compressing image...");
    try {
      const compressed = await compressImageFile(file);
      setUploadNote("Uploading to storage...");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressed }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.url, publicId: data.publicId, storage: data.storage }],
        }));
        setUploadNote(
          data.savedPercent != null
            ? `Uploaded · Saved ${data.savedPercent}% · ${Math.round(data.compressedSize / 1024)}KB`
            : `Uploaded successfully (${data.storage || "local"})`
        );
      } else {
        setUploadNote(data.error || "Upload failed — log in as admin first");
      }
    } catch (err) {
      setUploadNote(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const colors = parseColorsInput(form.colorsInput);
    const sizes = parseSizesInput(form.sizesInput);
    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: Number(form.comparePrice) || 0,
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      colors,
      sizes,
      color: colors[0]?.name || form.color || "",
      size: sizes[0] || form.size || "",
      slug: createSlug(form.name),
    };
    delete payload.colorsInput;
    delete payload.sizesInput;

    const url = "/api/admin/products";
    const method = editing ? "PUT" : "POST";
    if (editing) payload.id = editing;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setForm(emptyProduct);
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save");
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      ...product,
      tags: product.tags?.join(", ") || "",
      price: product.price,
      comparePrice: product.comparePrice || "",
      stock: product.stock,
      colorsInput: formatColorsForInput(getProductColors(product)),
      sizesInput: formatSizesForInput(getProductSizes(product)),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const inputClass = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyProduct); }} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold">{editing ? "Edit Product" : "Add Product"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="text-xs text-slate-500">Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className="text-xs text-slate-500">Short Description *</label><input required value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className="text-xs text-slate-500">Full Description *</label><textarea required rows={3} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} className={inputClass} /></div>
              <div><label className="text-xs text-slate-500">Sale Price (₹) *</label><input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="1299" /></div>
              <div><label className="text-xs text-slate-500">Original Price / MRP (₹)</label><input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className={inputClass} placeholder="1799" /></div>
              {form.comparePrice > form.price && (
                <div className="sm:col-span-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  Discount preview: {getDiscountPercent(Number(form.price), Number(form.comparePrice))}% OFF
                </div>
              )}
              <div><label className="text-xs text-slate-500">Stock *</label><input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} /></div>
              <div><label className="text-xs text-slate-500">Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} /></div>
              <div><label className="text-xs text-slate-500">Collection</label>
                <select value={form.shopCollection} onChange={(e) => setForm({ ...form, shopCollection: e.target.value })} className={inputClass}>
                  {["For Him", "For Her", "Couple Wellness", "Starter Kits", "Lubes & Accessories", "Gift Combos", "Wellness"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div><label className="text-xs text-slate-500">Material</label><input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputClass} /></div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500">Colours (comma separated)</label>
                <input
                  value={form.colorsInput}
                  onChange={(e) => setForm({ ...form, colorsInput: e.target.value })}
                  placeholder="Rose, Black, Purple or Rose:#f43f5e, Black:#1a1a1a"
                  className={inputClass}
                />
                <p className="mt-1 text-[10px] text-slate-400">Customers pick one colour on the product page (Amazon-style swatches).</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500">Sizes (comma separated)</label>
                <input
                  value={form.sizesInput}
                  onChange={(e) => setForm({ ...form, sizesInput: e.target.value })}
                  placeholder="S, M, L, XL"
                  className={inputClass}
                />
                <p className="mt-1 text-[10px] text-slate-400">Customers pick one size before adding to cart.</p>
              </div>
              <div><label className="text-xs text-slate-500">Tags (comma separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} /></div>
              <div className="flex flex-wrap gap-4 sm:col-span-2">
                {["discreetPackaging", "featured", "active", "bestseller", "dealOfDay", "isBundle"].map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500">Images</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="mt-1 w-full text-sm" />
                <p className="mt-1 text-[10px] text-slate-400">
                  JPG, PNG, WebP · auto-compressed · localhost: /public/uploads · Vercel: Blob storage
                </p>
                {(uploading || uploadNote) && (
                  <p className={`text-xs ${uploadNote.toLowerCase().includes("fail") || uploadNote.includes("Unauthorized") || uploadNote.includes("Vercel") || uploadNote.includes("read-only") ? "text-red-500" : "text-emerald-600"}`}>
                    {uploading ? "Processing..." : uploadNote}
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  {form.images?.map((img, i) => (
                    <img key={i} src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" className="rounded-xl bg-sky-500 px-6 py-2 text-sm font-semibold text-white">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-200 px-6 py-2 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p className="mt-8 text-slate-500">Loading...</p> : (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Price</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(p)} className="mr-2 text-sky-500 hover:text-sky-600">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
