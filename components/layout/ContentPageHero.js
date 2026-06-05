import Link from "next/link";

export default function ContentPageHero({ title, subtitle, breadcrumb = [] }) {
  return (
    <div className="relative overflow-hidden bg-[#0c1929] py-14 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(14,165,233,0.15),transparent_55%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {breadcrumb.length > 0 && (
          <nav className="mb-4 flex flex-wrap items-center justify-center gap-1 text-xs text-slate-400">
            <Link href="/" className="hover:text-sky-400">Home</Link>
            {breadcrumb.map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                <span>/</span>
                {item.href ? (
                  <Link href={item.href} className="hover:text-sky-400">{item.label}</Link>
                ) : (
                  <span className="text-sky-300">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}
