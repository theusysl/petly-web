"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PetCard, type Pet } from "@/components/PetCard";
import { EventCard } from "@/components/EventCard";
import { petService } from "@/services/petService";
import { eventService, type ApiEvent } from "@/services/eventService";

const button = "inline-flex items-center justify-center gap-3 rounded-full bg-petly-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-petly-accent";

export default function Home() {
  const [filter, setFilter] = useState("Todos");
  const [authUser, setAuthUser] = useState<{ name: string; role: string } | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsError, setPetsError] = useState<string | null>(null);
  const [petsLoading, setPetsLoading] = useState(true);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  useEffect(() => { try { const stored = localStorage.getItem("petly-auth"); if (stored) setAuthUser(JSON.parse(stored).user ?? null); } catch { localStorage.removeItem("petly-auth"); } }, []);
  const fetchPets = useCallback(async () => { setPetsLoading(true); try { const data = await petService.list(); const mappedPets = data.map((pet) => ({ id: String(pet.id), name: pet.name, kind: pet.species, breed: pet.breed ?? "Sem raça definida", age: pet.age ? `${pet.age} anos` : "Idade não informada", city: "Baixada Santista", image: pet.photoUrl ?? "/logo.png", ownerId: pet.ownerId, status: pet.status })); setPets(mappedPets); setPetsError(null); } catch (error) { setPetsError(error instanceof Error ? error.message : "Não foi possível carregar os pets."); } finally { setPetsLoading(false); } }, []);
  useEffect(() => { fetchPets(); }, [fetchPets]);
  useEffect(() => { const controller = new AbortController(); eventService.list(controller.signal).then((data) => setEvents(data.slice(0, 3))).catch((error) => { if (error?.name !== "AbortError") setEventsError(error instanceof Error ? error.message : "Não foi possível carregar os eventos."); }).finally(() => setEventsLoading(false)); return () => controller.abort(); }, []);
  const visiblePets = filter === "Todos" ? pets.filter((pet) => pet.status !== "LOST") : pets.filter((pet) => pet.status !== "LOST" && pet.kind.toLowerCase().includes(filter === "Cão" ? "cach" : "gat"));
  const lostPets = pets.filter((pet) => pet.status === "LOST");
  
  return (
  <main className="min-h-screen bg-petly-cream font-sans text-petly-ink">
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
      <div>
      <div className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#e89d76]"/>
        Uma rede que cuida
      </div>
    <h1 className="mt-5 max-w-2xl text-6xl font-normal leading-[.98] tracking-[-.06em] md:text-8xl">
      Encontre um novo <em className="font-serif font-medium italic text-[#4e9877]">
      começo.</em>
    </h1>
    <p className="mt-7 max-w-lg text-lg leading-7 text-petly-muted">
      O Petly aproxima pessoas e animais que precisam se encontrar. Adote com responsabilidade ou ajude a trazer um pet de volta para casa.</p>
    <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
      <Link className={button} href="#adotar">
      Encontrar um pet <Icon name="arrow" />
    </Link>
    <a className="flex items-center gap-2 text-sm font-semibold text-petly-accent" href="#perdidos">
      Procuro um pet perdido <Icon name="arrow" />
    </a>
    </div>
    <div className="mt-12 flex items-center gap-2 text-xs text-[#82968e]">
      <Icon name="shield"/>
    <span>
      Uma plataforma segura para toda a comunidade</span>
    </div>
    </div>
    <div className="relative h-105 md:h-125">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#dfeee4] md:h-96 md:w-96"/>
    <div className="absolute bottom-5 left-0 h-28 w-28 rounded-full bg-[#f4dfcf]"/>
    <div className="absolute inset-8 rounded-[48%] bg-cover bg-center shadow-lg md:inset-12" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85)" }}/>
    <div className="absolute left-0 top-24 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dfeee4] text-petly-accent">
      <Icon name="paw" size={17}/>
    </span>
    <span>
      <strong className="block text-sm">
      +1.200</strong>
    <small className="text-[10px] text-[#6f837d]">
      encontros realizados</small>
    </span>
    </div>
    <div className="absolute bottom-12 right-0 flex items-center gap-2 rounded-full bg-petly-ink px-4 py-2.5 text-xs text-white">
      <Icon name="map" size={15}/>
    Baixada Santista</div>
    </div>
    </section>
    <section id="buscar" className="mx-auto mb-24 flex max-w-6xl flex-col gap-5 rounded-2xl border border-[#e3e9e3] bg-white p-5 shadow-lg shadow-[#2d5c48]/5 md:flex-row md:items-center">
      <div className="flex items-center gap-3 md:min-w-60">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfeee4] text-petly-accent">
      <Icon name="search"/>
    </span>
    <span>
      <strong className="block text-sm">
      O que você está procurando?</strong>
    <small className="text-xs text-[#6f837d]">
      Comece por aqui</small>
    </span>
    </div>
    <div className="flex h-12 flex-1 items-center rounded-lg border border-[#e3e9e3] px-4 text-[#91a39d]">
      <Icon name="search" size={18}/>
    <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Nome, raça ou cidade"/>
    <button className="grid h-9 w-9 place-items-center rounded-lg bg-petly-ink text-white" aria-label="Buscar">
      <Icon name="arrow" size={18}/>
    </button>
    </div>
    <a className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-petly-accent" href="#mapa">
      <Icon name="map" size={18}/>
    Ver no mapa</a>
    </section>
    <section id="adotar" className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
      <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
      Para adotar</span>
    <h2 className="mt-3 text-4xl font-normal leading-tight tracking-[-.05em] md:text-5xl">
      Talvez o seu melhor amigo<br/>
    esteja aqui.</h2>
    </div>
    <Link className="flex w-fit items-center gap-2 rounded-full border border-[#e3e9e3] px-4 py-3 text-sm font-semibold text-petly-accent" href="/pets">
      Ver todos os pets <Icon name="arrow" size={17}/>
    </Link>
    </div>
    <div className="mb-6 flex items-center gap-2 text-xs text-[#6f837d]">
      <span>
      Filtrar por:</span>
    {["Todos", "Cão", "Gato"].map((item) =>
      <button key={item} className={`rounded-full border px-3 py-1 ${filter === item ? "border-petly-ink bg-petly-ink text-white" : "border-[#e3e9e3]"}`} onClick={() =>
      setFilter(item)}>
      {item}</button>
  )}</div>
    {petsError && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{petsError}</p>}
    {petsLoading && <p className="mb-5 rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Carregando pets disponíveis...</p>}
    {!petsLoading && !petsError && visiblePets.length === 0 && <p className="mb-5 rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Nenhum pet disponível no momento.</p>}
    <div className="grid gap-5 md:grid-cols-3">
      {visiblePets.map((pet) =>
      <PetCard key={pet.id} pet={pet}/>
  )}</div>
    </section>
    <section id="perdidos" className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">Ajude a encontrar</span><h2 className="mt-3 text-4xl font-normal tracking-[-.05em] md:text-5xl">Pets perdidos precisam <em className="font-serif text-petly-sage">voltar para casa.</em></h2><p className="mt-4 max-w-xl text-[#6f837d]">Compartilhe uma história, fique atento à sua região e ajude uma família a reencontrar seu melhor amigo.</p></div>
        <Link className="flex w-fit items-center gap-2 rounded-full border border-[#e3e9e3] px-4 py-3 text-sm font-semibold text-petly-accent" href="/pets?status=lost">Ver todos os perdidos <Icon name="arrow" size={17} /></Link>
      </div>
      {petsLoading && <p className="rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Carregando pets perdidos...</p>}
      {!petsLoading && lostPets.length === 0 && <p className="rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Nenhum pet perdido publicado no momento.</p>}
      {!petsLoading && lostPets.length > 0 && <div className="grid gap-5 md:grid-cols-3">{lostPets.slice(0, 3).map((pet) => <PetCard key={pet.id} pet={pet} />)}</div>}
    </section>
    <section className="mx-auto mb-28 max-w-7xl px-5 md:px-8"><div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-petly-mint p-7 md:flex-row md:items-center md:p-10"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-petly-accent"><Icon name="shield" size={21} /></span><div><span className="text-[11px] font-bold uppercase tracking-[.16em] text-petly-accent">Cuidar também é proteger</span><h2 className="mt-2 text-2xl font-semibold">Viu algo que não parece certo?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#668174]">Envie uma denúncia e ajude a manter o Petly seguro para toda a comunidade.</p></div></div><Link href="/denuncias" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-petly-ink px-5 py-3 text-sm font-semibold text-white">Fazer uma denúncia <Icon name="arrow" size={17} /></Link></div></section>
    <section className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">Na comunidade</span><h2 className="mt-3 text-4xl font-normal tracking-[-.05em] md:text-5xl">Eventos que fazem <em className="font-serif text-petly-sage">a diferença.</em></h2></div>
        <Link className="flex w-fit items-center gap-2 rounded-full border border-[#e3e9e3] px-4 py-3 text-sm font-semibold text-petly-accent" href="/eventos">Ver todos os eventos <Icon name="arrow" size={17} /></Link>
      </div>
      {eventsError && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{eventsError}</p>}
      {eventsLoading && <p className="rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Carregando eventos...</p>}
      {!eventsLoading && !eventsError && events.length === 0 && <p className="rounded-xl border border-petly-line bg-white p-8 text-center text-sm text-petly-muted">Nenhum evento disponível no momento.</p>}
      {!eventsLoading && !eventsError && events.length > 0 && <div className="grid gap-5 lg:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>}
    </section>
    <section id="como-funciona" className="grid gap-12 bg-[#dfeee4] px-5 py-20 md:grid-cols-2 md:px-[max(2rem,calc((100%_-_1176px)/2))]">
      <div>
      <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
      Como funciona</span>
    <h2 className="mt-3 text-4xl font-semibold tracking-[-.05em] md:text-5xl">
      Adotar muda duas vidas.</h2>
    <p className="my-6 max-w-md leading-7 text-[#5d786c]">
      O Petly torna cada etapa mais simples, transparente e responsável — para você e para o animal.</p>
    <a className="flex items-center gap-2 text-sm font-semibold text-petly-accent" href="/como-funciona">
      Entenda o processo <Icon name="arrow" size={17}/>
    </a>
    </div>
    <div className="space-y-6">
      {[["01","Conheça","Encontre pets que combinam com a sua rotina."],["02","Conecte-se","Veja a história e entre em contato com quem cuida."],["03","Transforme","Uma adoção responsável começa com uma conversa."]].map(([number,title,text]) =>
      <div className="flex gap-5 border-b border-[#bad6c5] pb-6" key={number}>
      <span className="font-serif text-2xl text-[#5a9a7c]">
      {number}</span>
    <div>
      <strong>
      {title}</strong>
    <p className="mt-1 text-sm leading-6 text-[#668174]">
      {text}</p>
    </div>
    </div>
  )}</div>
    </section>
  </main>
  )
}
