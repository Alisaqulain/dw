import ContentPageHero from "@/components/layout/ContentPageHero";

export default function PolicyLayout({ title, subtitle, breadcrumb, children }) {
  return (
    <>
      <ContentPageHero title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-5 text-sm leading-relaxed text-slate-600 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-800 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:space-y-1">
          {children}
        </div>
        <p className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>
    </>
  );
}
