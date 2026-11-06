import Link from "next/link";
import { Brand } from "./Brand";

export function ProtectedPlaceholder({ title, description }: { title: string; description: string }) {
  return <main className="min-h-screen bg-petly-cream px-5 py-6 text-petly-ink"><Brand/><section className="mx-auto max-w-xl py-24 text-center"><span className="text-5xl">🐾</span><h1 className="mt-6 text-4xl font-semibold tracking-tight">{title}</h1><p className="mt-4 leading-7 text-petly-muted">{description}</p><Link className="mt-8 inline-flex rounded-full bg-petly-ink px-6 py-3 text-sm font-semibold text-white" href="/">Voltar para a home</Link></section></main>;
}
