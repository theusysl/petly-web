"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Brand } from "@/components/Brand";
import { eventService } from "@/services/eventService";

const input = "mt-2 block h-12 w-full rounded-xl border border-petly-line px-4 text-sm outline-none focus:border-petly-accent focus:ring-4 focus:ring-petly-mint";
export default function NewEventPage() { const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", address: "", photoUrl: "" }); const [fileName, setFileName] = useState(""); const [feedback, setFeedback] = useState(""); const [loading, setLoading] = useState(false); const update = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value })); function readPhoto(file?: File) { if (!file) return; if (!file.type.startsWith("image/")) { setFeedback("Selecione uma imagem válida."); return; } const reader = new FileReader(); reader.onload = () => { update("photoUrl", String(reader.result)); setFileName(file.name); }; reader.readAsDataURL(file); } async function submit(event: FormEvent) { event.preventDefault(); const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null"); if (!auth?.token) { setFeedback("Faça login para criar um evento."); return; } setLoading(true); try { await eventService.create({ title: form.title, description: form.description, location: form.location, address: form.address, photoUrl: form.photoUrl, date: `${form.date}T${form.time}:00` }, auth.token); setFeedback("Evento criado com sucesso!"); } catch (error) { setFeedback(error instanceof Error ? error.message : "Não foi possível criar o evento."); } finally { setLoading(false); } } return (
  <main className="min-h-screen bg-petly-cream px-5 py-6 text-petly-ink">
    <section className="mx-auto max-w-3xl py-14">
      <span className="text-xs font-bold uppercase tracking-[.18em] text-petly-accent">
        Na comunidade
      </span>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-.06em]">
        Adicionar evento
      </h1>
      <form className="mt-8 rounded-3xl border border-petly-line bg-white p-7 shadow-xl shadow-petly-ink/5" onSubmit={submit}>
        <label className="block text-sm font-semibold">
          Título
          <input className={input} value={form.title} onChange={(event) => update("title", event.target.value)} required/>
        </label>
        <label className="mt-5 block text-sm font-semibold">
          Descrição<textarea className="mt-2 min-h-32 w-full rounded-xl border border-petly-line p-4 text-sm outline-none focus:border-petly-accent focus:ring-4 focus:ring-petly-mint" value={form.description} onChange={(event) =>
          update("description", event.target.value)} required/>
        </label>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Data
            <input className={input} type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required/>
          </label>
          <label className="text-sm font-semibold">
            Horário<input className={input} type="time" value={form.time} onChange={(event) =>
            update("time", event.target.value)} required/>
          </label>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Nome do local
            <input className={input} value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Ex.: Feira Petly" required/>
          </label>
          <label className="text-sm font-semibold">
            Endereço exato
            <input className={input} value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Rua, número, bairro e cidade" required/>
          </label>
        </div>
        <label className="mt-5 block text-sm font-semibold">
          Imagem do evento
          <label className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-petly-line bg-petly-cream/50 text-center hover:border-petly-accent">
            <span className="text-2xl">
              📷
            </span>
            <span className="mt-2 text-sm font-semibold text-petly-accent">
              {fileName || "Escolher uma imagem"}
            </span>
            <span className="text-xs text-petly-muted">
              JPG, PNG ou WEBP
            </span>
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => readPhoto(event.target.files?.[0])}/>
          </label>
        </label>
        {feedback && <p className="mt-5 rounded-xl bg-petly-mint p-4 text-sm">
          {feedback}
        </p>
        }<button className="mt-7 w-full rounded-full bg-petly-ink py-4 text-sm font-semibold text-white disabled:opacity-60" disabled={loading}>
          {loading ? "Publicando..." : "Publicar evento"}
        </button>
      </form>
    </section>
  </main>
  )
}
