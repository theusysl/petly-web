import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link className={`inline-flex items-center gap-2 font-bold tracking-tight text-petly-ink ${compact ? "text-xl" : "text-2xl"}`} href="/" aria-label="Petly, página inicial"><Image className={`${compact ? "h-5 w-5" : "h-6 w-6"} rounded-xl object-contain`} src="/logo-dark.png" alt="" width={32} height={32} priority /><span>petly</span></Link>;
}
