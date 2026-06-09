import Image from "next/image";
import Link from "next/link";
import { SITE_LOGO } from "@/lib/constants";

const sizeMap = {
  sm: "h-10 w-auto max-w-[140px] sm:h-12 sm:max-w-[160px]",
  md: "h-12 w-auto max-w-[180px] sm:h-14 sm:max-w-[200px]",
  lg: "h-16 w-auto max-w-[240px] sm:h-20 sm:max-w-[280px]",
  xl: "h-24 w-auto max-w-[320px] sm:h-28 sm:max-w-[360px]",
};

export default function Logo({ size = "md", href = "/", className = "" }) {
  const img = (
    <Image
      src={SITE_LOGO}
      alt="TrustSilcon — Trusted Quality. Built to Last."
      width={480}
      height={320}
      className={`object-contain ${sizeMap[size]} ${className}`}
      priority={size === "lg" || size === "xl"}
    />
  );

  if (href != null && href !== false) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {img}
      </Link>
    );
  }
  return img;
}
