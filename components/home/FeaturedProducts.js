import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="bg-gradient-to-b from-white to-sky-50/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Featured Products</h2>
            <p className="mt-2 text-slate-500">Handpicked premium wellness essentials</p>
          </div>
          <Link href="/shop" className="hidden text-sm font-semibold text-sky-500 hover:text-sky-600 sm:block">
            View All →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="text-sm font-semibold text-sky-500">View All Products →</Link>
        </div>
      </div>
    </section>
  );
}
