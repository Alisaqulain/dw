"use client";

import TrustBadges from "@/components/ui/TrustBadges";

export default function HomeTrustSection() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TrustBadges variant="compact" />
      </div>
    </section>
  );
}
