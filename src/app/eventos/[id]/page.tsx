"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { eventService, type ApiEvent } from "@/services/eventService";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { params.then(({ id }) => eventService.getById(id).then(setEvent).catch((e) => setError(e instanceof Error ? e.message : "Evento não encontrado."))); }, [params]);
  if (error) return <main className="min-h-screen bg-petly-cream p-8 text-center text-red-700">{error}</main>;
  if (!event) return <main className="min-h-screen bg-petly-cream p-8 text-center text-petly-muted">Carregando evento...</main>;
  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString("pt-BR", { dateStyle: "full" });
  const timeLabel = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return (
  <main className="min-h-screen bg-petly-cream text-petly-ink">
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8 md:pt-16">
      <div className="grid overflow-hidden rounded-3xl border border-petly-line bg-white shadow-sm lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-72 overflow-hidden bg-petly-mint lg:min-h-130">
          {event.photoUrl ? <img src={event.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
         : <div className="absolute inset-0 bg-linear-to-br from-petly-mint via-white to-petly-peach" />
        }<div className="absolute inset-0 bg-linear-to-t from-petly-ink/45 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 rounded-2xl bg-white/75 px-5 py-4 backdrop-blur-sm">
        <span className="block text-3xl font-semibold text-petly-accent">
          {date.toLocaleDateString("pt-BR", { day: "2-digit" })}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-petly-muted">
          {date.toLocaleDateString("pt-BR", { month: "long" })}</span>
        </div>
        </div>

        <div className="flex flex-col justify-center p-7 md:p-12">
          <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
          Evento Petly</span>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tighter md:text-5xl">
          {event.title}</h1>
        <p className="mt-6 text-lg leading-7 text-petly-muted ">
          {event.description}</p>

          <div className="mt-9 space-y-5 border-t border-petly-line pt-7 text-sm">
            <div className="flex gap-3">
            <Icon name="sun" size={19} />
          <div>
            <strong className="block">
            Quando</strong>
          <span className="text-petly-muted">
            {dateLabel}<br />
          às {timeLabel}</span>
          </div>
          </div>
          <div className="flex gap-3">
            <Icon name="map" size={19} />
          <div>
            <strong className="block">
            Onde</strong>
          <span className="text-petly-muted">
            {event.address || event.location}</span>
          </div>
          </div>
          {event.organizer?.name && <div className="flex gap-3">
            <Icon name="paw" size={19} />
          <div>
            <strong className="block">
            Organização</strong>
          <span className="text-petly-muted">
            {event.organizer.name}</span>
          </div>
          </div>
          }</div>

          <Link className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-petly-ink px-5 py-3 text-sm font-semibold text-white" href="/eventos">
          Ver outros eventos <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    </section>
  </main>
  )
}
