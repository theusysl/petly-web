"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { PetCard, type Pet } from "@/components/PetCard";
import { petService } from "@/services/petService";
type Filter = "Todos" | "Adoção" | "Perdidos" | "Encontrados";

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const statusFilter = new URLSearchParams(window.location.search).get("status");
    if (statusFilter === "lost") setFilter("Perdidos");
    if (statusFilter === "available") setFilter("Adoção");
    petService.list(controller.signal).then((data) => setPets(data.map((pet) => ({ id: String(pet.id), name: pet.name, kind: pet.species, breed: pet.breed ?? "Sem raça definida", age: pet.age ? pet.age + " anos" : "Idade não informada", city: "Baixada Santista", image: pet.photoUrl ?? "/logo.png", ownerId: pet.ownerId, status: pet.status })))).catch((requestError) => { if (requestError?.name !== "AbortError") setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os pets."); }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  const filteredPets = useMemo(() => pets.filter((pet) => {
    const matchesFilter = filter === "Todos" || (filter === "Adoção" && pet.status !== "LOST" && pet.status !== "FOUND") || (filter === "Perdidos" && pet.status === "LOST") || (filter === "Encontrados" && pet.status === "FOUND");
    return matchesFilter && (pet.name + " " + pet.kind + " " + pet.breed + " " + pet.city).toLowerCase().includes(query.toLowerCase());
  }), [pets, filter, query]);
  return <main className="min-h-screen bg-petly-cream px-5 pb-24 text-petly-ink md:px-8">
    <section className="mx-auto max-w-7xl pb-12 pt-12 md:pt-20"><span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">Encontre seu companheiro</span><div className="mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h1 className="text-5xl tracking-[-.06em] md:text-7xl">Pets que esperam <em className="font-serif font-medium text-petly-sage">por você.</em></h1><p className="mt-5 max-w-xl text-lg leading-7 text-petly-muted">Conheça os animais publicados pela comunidade Petly e encontre uma história que pode começar junto com a sua.</p></div><span className="text-sm text-petly-muted">{loading ? "Carregando..." : String(filteredPets.length) + (filteredPets.length === 1 ? " pet encontrado" : " pets encontrados")}</span></div><div className="mt-10 flex max-w-2xl items-center rounded-xl border border-petly-line bg-white px-4 py-3"><Icon name="search" size={18} /><input className="flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Buscar por nome, espécie, raça ou cidade" value={query} onChange={(event) => setQuery(event.target.value)} /></div></section>
    <section className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap gap-2">{(["Todos", "Adoção", "Perdidos", "Encontrados"] as Filter[]).map((item) => <button key={item} className={"rounded-full border px-4 py-2 text-sm " + (filter === item ? "border-petly-ink bg-petly-ink text-white" : "border-petly-line bg-white text-petly-muted")} onClick={() => setFilter(item)}>{item}</button>)}</div>{loading && <div className="rounded-2xl border border-petly-line bg-white p-12 text-center text-sm text-petly-muted">Carregando pets...</div>}{error && <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">{error}</div>}{!loading && !error && filteredPets.length === 0 && <div className="rounded-2xl border border-petly-line bg-white p-12 text-center text-petly-muted">Nenhum pet encontrado com esses filtros.</div>}{!loading && !error && filteredPets.length > 0 && <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}</div>}</section>
  </main>;
}
