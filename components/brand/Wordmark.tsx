import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

/** Logotipo de marca: estrella + "PRIME ACADEMY". */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt={APP_NAME}
      width={308}
      height={148}
      priority
      className={`h-8 w-auto ${className}`}
    />
  );
}
