export const STORE_CONTACT = {
  email: "trustsilicon95@gmail.com",
  phones: [
    { display: "+91 93685 62100", tel: "+919368562100", whatsapp: "919368562100" },
    { display: "+91 81712 14737", tel: "+918171214737", whatsapp: "918171214737" },
  ],
  whatsapp: "919368562100",
};

export const COLLECTIONS = [
  { label: "For Him", slug: "for-him", href: "/shop?collection=For Him", icon: "👨", desc: "Premium wellness crafted for men" },
  { label: "For Her", slug: "for-her", href: "/shop?collection=For Her", icon: "👩", desc: "Body-safe comfort for her" },
  { label: "Couple Wellness", slug: "couple", href: "/shop?collection=Couple Wellness", icon: "💑", desc: "Shared wellness experiences" },
  { label: "Bestsellers", slug: "bestsellers", href: "/shop?sort=bestseller", icon: "⭐", desc: "Most loved by customers" },
  { label: "New Arrivals", slug: "new", href: "/shop?sort=newest", icon: "✨", desc: "Latest premium additions" },
  { label: "Lubes & Accessories", slug: "lubes", href: "/shop?collection=Lubes & Accessories", icon: "💧", desc: "Care essentials & accessories" },
  { label: "Gift Combos", slug: "gifts", href: "/shop?collection=Gift Combos", icon: "🎁", desc: "Curated gift sets" },
  { label: "Starter Kits", slug: "starter", href: "/shop?collection=Starter Kits", icon: "📦", desc: "Perfect for first-timers" },
];

export const CATEGORY_TILES = [
  { label: "For Him", href: "/shop?collection=For Him", gradient: "from-sky-500 via-blue-600 to-indigo-700", glow: "shadow-sky-400/40", icon: "👨", desc: "Premium wellness crafted for men" },
  { label: "For Her", href: "/shop?collection=For Her", gradient: "from-cyan-400 via-sky-500 to-blue-600", glow: "shadow-cyan-400/40", icon: "👩", desc: "Body-safe comfort designed for her" },
  { label: "Couple Wellness", href: "/shop?collection=Couple Wellness", gradient: "from-violet-500 via-indigo-600 to-blue-700", glow: "shadow-violet-400/40", icon: "💑", desc: "Shared experiences for two" },
  { label: "Starter Kits", href: "/shop?collection=Starter Kits", gradient: "from-teal-400 via-cyan-500 to-sky-600", glow: "shadow-teal-400/40", icon: "📦", desc: "Perfect for first-timers" },
  { label: "Combos", href: "/shop?collection=Gift Combos", gradient: "from-fuchsia-500 via-violet-600 to-indigo-700", glow: "shadow-fuchsia-400/40", icon: "🎁", desc: "Curated gift sets & bundles" },
];

export const TRUST_BADGES = [
  { icon: "🛡️", title: "Body-Safe Silicone", desc: "Medical-grade materials" },
  { icon: "📦", title: "Discreet Packaging", desc: "Plain unmarked boxes" },
  { icon: "🚀", title: "Fast Shipping", desc: "3–7 day delivery" },
  { icon: "📍", title: "Easy Tracking", desc: "Real-time order updates" },
  { icon: "🔒", title: "Private Billing", desc: "Discreet payment records" },
];

export const OFFER_TEXT = "🔥 HOT SALE — Up to 40% Off  •  Discreet Delivery Across India  •  COD Available  •  Free Shipping above ₹999";

export const BANNER_SLIDES = [
  {
    id: "hot-sale",
    badge: "🔥 Hot Sale",
    title: "Wellness Deals",
    highlight: "Up to 40% Off",
    description: "Limited-time discounts on bestsellers. Discreet delivery & COD across India.",
    cta: "Shop Hot Deals",
    href: "/shop?sort=sale",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&h=800&fit=crop",
    gradient: "from-rose-600/90 via-orange-600/80 to-amber-500/70",
    accent: "bg-rose-500",
  },
  {
    id: "bestsellers",
    badge: "⭐ Bestsellers",
    title: "Premium Wellness",
    highlight: "Elevated.",
    description: "Body-safe silicone products trusted by 50,000+ customers nationwide.",
    cta: "Shop Bestsellers",
    href: "/shop?sort=bestseller",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=800&fit=crop",
    gradient: "from-sky-600/90 via-cyan-600/80 to-blue-700/70",
    accent: "bg-sky-500",
  },
  {
    id: "new-arrivals",
    badge: "✨ New Arrivals",
    title: "Fresh Drops",
    highlight: "Just Landed",
    description: "Explore the latest intimate wellness additions to our curated collection.",
    cta: "See What's New",
    href: "/shop?sort=newest",
    image: "https://images.unsplash.com/photo-1515377905743-f58e3bc57fb8?w=1400&h=800&fit=crop",
    gradient: "from-violet-600/90 via-indigo-600/80 to-blue-600/70",
    accent: "bg-violet-500",
  },
  {
    id: "discreet",
    badge: "📦 100% Discreet",
    title: "Private Delivery",
    highlight: "Guaranteed",
    description: "Plain packaging, private billing, and fast 3–7 day shipping with live tracking.",
    cta: "Track Your Order",
    href: "/track-order",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1400&h=800&fit=crop",
    gradient: "from-emerald-600/90 via-teal-600/80 to-cyan-600/70",
    accent: "bg-emerald-500",
  },
];

export const PROMO_FEATURES = [
  { icon: "🔥", title: "Hot Deals", desc: "Up to 40% off", href: "/shop?sort=sale" },
  { icon: "🎁", title: "Bundle Save", desc: "Combo offers", href: "/shop?isBundle=true" },
  { icon: "📦", title: "Discreet Box", desc: "No labels", href: "/shipping-policy" },
  { icon: "💳", title: "COD Available", desc: "Pay on delivery", href: "/shop" },
  { icon: "🚀", title: "Fast Ship", desc: "3–7 days", href: "/track-order" },
];
