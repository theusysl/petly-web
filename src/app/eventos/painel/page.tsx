"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { eventService, type ApiEvent } from "@/services/eventService";

export default function EventModerationPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
    const canAccess = auth?.user?.role === "ADMIN";
    setAllowed(canAccess);
    if (!canAccess) { setLoading(false); return; }
    eventService.pending(auth.token).then(setEvents).catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar os eventos.")).finally(() => setLoading(false));
  }, []);
  async function moderate(id: number, status: "APPROVED" | "REJECTED") {
    const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
    try { await eventService.moderate(id, status, auth.token); setEvents((current) => current.filter((event) => event.id !== id)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar o evento."); }
  }
  if (!allowed) return <main className="min-h-screen bg-petly-cream px-5 py-8 text-center text-petly-ink"><Brand /><div className="mx-auto mt-24 max-w-md rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-2xl font-semibold">Acesso restrito</h1><p className="mt-3 text-sm text-petly-muted">Somente administradores podem aprovar eventos.</p><Link href="/eventos" className="mt-6 inline-block text-sm font-semibold text-petly-accent">Voltar para eventos</Link></div></main>;
  return (
    <main className="min-h-screen bg-petly-cream px-5 pb-24 text-petly-ink md:px-8">
    <section className="mx-auto max-w-7xl pb-10 pt-12">
      <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
      Administração</span>
    <h1 className="mt-4 text-5xl tracking-[-.06em]">
      Aprovação de eventos.</h1>
    <p className="mt-4 max-w-xl text-lg text-petly-muted">
      Revise os eventos enviados pela comunidade antes de publicá-los na agenda.</p>
    </section>
    <section className="mx-auto max-w-7xl">
      {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {error}</p>
    }{loading && <div className="rounded-3xl border border-petly-line bg-white p-12 text-center text-petly-muted">
      Carregando eventos pendentes...</div>
    }{!loading && !error && events.length === 0 && <div className="rounded-3xl border border-petly-line bg-white p-12 text-center text-petly-muted">
      Nenhum evento aguardando aprovação.</div>
    }<div className="grid gap-5 lg:grid-cols-2">
      {events.map((event) =>
       <article key={event.id} className="overflow-hidden rounded-3xl border border-petly-line bg-white shadow-sm">
      {event.photoUrl && <img src={event.photoUrl} alt="" className="h-40 w-full object-cover" />
    }<div className="p-6">
      <span className="text-xs font-bold uppercase tracking-wider text-petly-accent">
      Evento #{event.id}</span>
    <h2 className="mt-3 text-2xl font-semibold">
      {event.title}</h2>
    <p className="mt-3 text-sm leading-6 text-petly-muted">
      {event.description}</p>
    <div className="mt-5 border-t border-petly-line pt-4 text-sm text-petly-muted">
      <p>
      {new Date(event.date).toLocaleString("pt-BR")} · {event.address || event.location}</p>
    <p className="mt-2">
      Organizado por {event.organizer?.name || "Usuário"}</p>
    </div>
    <div className="mt-6 flex gap-3">
      <button onClick={() =>
       moderate(event.id, "APPROVED")} className="rounded-full bg-petly-accent px-5 py-2.5 text-sm font-semibold text-white">
      Aprovar</button>
    <button onClick={() =>
       moderate(event.id, "REJECTED")} className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700">
      Recusar</button>
    </div>
    </div>
    </article>
  )}</div>
    </section>
  </main>
  )
}
