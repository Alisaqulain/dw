import Image from "next/image";
import Link from "next/link";

const sizeMap = {
  sm: "h-12 w-auto max-w-[150px]",
  md: "h-16 w-auto max-w-[200px] sm:h-[4.5rem] sm:max-w-[220px]",
  lg: "h-20 w-auto max-w-[280px] sm:h-24 sm:max-w-[320px]",
  xl: "h-28 w-auto max-w-[360px] sm:h-32 sm:max-w-[400px]",
};

export default function Logo({ size = "md", href = "/", className = "" }) {
  const img = (
    <Image
      src="/lgowithbg.png"
      alt="TrustSilcon"
      width={360}
      height={180}
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
