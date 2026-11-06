"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { petService, type ApiPet } from "@/services/petService";

export default function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const [pet, setPet] = useState<ApiPet | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { params.then(({ id }) => petService.getById(id).then(setPet).catch((e) => setError(e instanceof Error ? e.message : "Pet não encontrado."))); }, [params]);
  if (error) return <main className="min-h-screen bg-petly-cream p-8 text-center text-red-700">{error}</main>;
  if (!pet) return <main className="min-h-screen bg-petly-cream p-8 text-center text-petly-muted">Carregando pet...</main>;
  const status = pet.status === "LOST" ? "Pet perdido" : pet.status === "FOUND" ? "Pet encontrado" : "Para adoção";
  return <main className="min-h-screen bg-petly-cream text-petly-ink">
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
      <div className="grid overflow-hidden rounded-3xl border border-petly-line bg-white shadow-sm lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[380px] overflow-hidden bg-petly-mint lg:min-h-[570px]">{pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-petly-mint via-white to-petly-peach" />}<div className="absolute inset-0 bg-gradient-to-t from-petly-ink/45 via-transparent to-transparent" /><span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-petly-accent backdrop-blur-sm">{status}</span></div>
        <div className="flex flex-col justify-center p-7 md:p-12"><span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">{status}</span><h1 className="mt-4 text-5xl font-semibold leading-tight tracking-[-.06em]">Conheça {pet.name}.</h1><p className="mt-6 text-base leading-7 text-petly-muted">{pet.description || pet.name + " está esperando por uma família que possa oferecer carinho, segurança e um novo começo."}</p>
          <div className="mt-9 grid grid-cols-3 gap-3 border-y border-petly-line py-6 text-center"><div><strong className="block text-lg">{pet.species}</strong><span className="text-xs text-petly-muted">Espécie</span></div><div><strong className="block text-lg">{pet.breed || "Não informado"}</strong><span className="text-xs text-petly-muted">Raça</span></div><div><strong className="block text-lg">{pet.age ? pet.age + " anos" : "Não informado"}</strong><span className="text-xs text-petly-muted">Idade</span></div></div>
          <p className="mt-6 text-sm leading-6 text-petly-muted">A adoção é encaminhada diretamente com a pessoa ou organização responsável pelo animal.</p><button className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-petly-ink px-6 py-3 text-sm font-semibold text-white">Tenho interesse <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </section>
  </main>;
}
