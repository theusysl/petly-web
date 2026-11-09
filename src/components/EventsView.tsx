"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "./Brand";
import { EventCard } from "./EventCard";
import { Icon } from "./Icon";
import { eventService, type ApiEvent } from "@/services/eventService";

export function EventsView() { const [events, setEvents] = useState<ApiEvent[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [query, setQuery] = useState(""); useEffect(() => { const controller = new AbortController(); eventService.list(controller.signal).then(setEvents).catch((requestError) => { if (requestError?.name !== "AbortError") setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os eventos."); }).finally(() => setLoading(false)); return () => controller.abort(); }, []); const filtered = useMemo(() => events.filter((event) => `${event.title} ${event.description} ${event.location} ${event.address ?? ""}`.toLowerCase().includes(query.toLowerCase())), [events, query]); return (
<main className="min-h-screen bg-petly-cream text-petly-ink">
  <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-8 md:pt-20">
    <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
      Na comunidade
    </span>
    <h1 className="mt-4 text-4xlleading-tight tracking-[-.06em] md:text-6xl font-light">
      Eventos que fazem <em className="font-serif font-medium italic text-petly-sage">a diferença.</em>
    </h1>
    <p className="mt-6 max-w-xl text-lg leading-7 text-petly-muted">
      Feiras de adoção, mutirões, campanhas e encontros para cuidar melhor dos animais da nossa região.
    </p>
    <div className="mt-10 flex max-w-xl items-center rounded-xl border border-petly-line bg-white px-4 py-3">
      <Icon name="search" size={18}/>
      <input
        className="flex-1 bg-transparent px-3 text-sm outline-none"
        placeholder="Buscar por evento ou cidade"
        value={query}
        onChange={(event) =>setQuery(event.target.value)}
      />
    </div>
  </section>
  <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
    <div className="mb-6 flex items-end justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-[.15em] text-petly-accent">Agenda Petly</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Próximos eventos</h2>
      </div>
      <span className="text-sm text-petly-muted">
        {loading ? "Carregando..." : `${filtered.length} ${filtered.length === 1 ? "evento" : "eventos"}`}
      </span>
    </div>
    {loading && <div className="h-64 animate-pulse rounded-2xl bg-petly-mint"/>
    }{error && <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">
      {error}
    </div>
    }{!loading && !error && filtered.length === 0 && <div className="rounded-2xl border border-petly-line bg-white p-12 text-center text-petly-muted">
        Nenhum evento encontrado.</div>
    }{!loading && !error && filtered.length >
    0 && <div className="grid gap-5 md:grid-cols-2">
      {filtered.map((event) => <EventCard key={event.id} event={event}/>)}
    </div>
  }
  </section>
</main>
)}
