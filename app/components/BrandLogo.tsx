import Image from "next/image";

type Props = {
  className?: string;
  size?: number;
};

/** Branded UL mark — matches `public/brand-ul.svg` (favicon + navbar). */
export default function BrandLogo({ className, size = 40 }: Props) {
  return (
    <Image
      src="/brand-ul.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
