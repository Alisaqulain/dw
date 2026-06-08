import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, productSchema, breadcrumbSchema } from "@/lib/seo";

async function getProduct(slug) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, active: true }).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    `Shop ${product.name} — premium body-safe silicone wellness with discreet delivery across India.`;
  return buildMetadata({
    title: product.name,
    description,
    path: `/products/${slug}`,
    keywords: [product.name, product.category, product.shopCollection, "body-safe silicone", "TrustSilcon"].filter(Boolean),
    image: product.images?.[0] || "/og-image.svg",
    type: "website",
  });
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return children;

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: product.name },
          ]),
        ]}
      />
      {children}
    </>
  );
}
