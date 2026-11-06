"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Brand } from "@/components/Brand";
import { StyledDropdown } from "@/components/StyledDropdown";
import { petService } from "@/services/petService";

const inputClass = "mt-2 block h-12 w-full rounded-xl border border-petly-line bg-white px-4 text-sm outline-none transition placeholder:text-[#9aaba5] focus:border-petly-accent focus:ring-4 focus:ring-petly-mint";
const speciesBreeds: Record<string, string[]> = { Cachorro: ["Sem raça definida", "Labrador", "Golden Retriever", "Poodle", "Shih-tzu", "Yorkshire", "Bulldog", "Pastor Alemão"], Gato: ["Sem raça definida", "Siamês", "Persa", "Maine Coon", "Ragdoll", "Angorá"], Ave: ["Sem raça definida", "Calopsita", "Papagaio", "Periquito", "Canário"], Coelho: ["Sem raça definida", "Mini Lop", "Holland Lop", "Rex", "Angorá"], Hamster: ["Sírio", "Anão russo", "Chinês"], Réptil: ["Sem raça definida", "Tigre d'água", "Iguana", "Jabuti"], Outro: ["Sem raça definida"] };

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { if (label === "Situação") return <fieldset className="h-full"><legend className="text-sm font-semibold">Situação</legend><div className="mt-2 grid h-12 gap-3 sm:grid-cols-3">{[["AVAILABLE", "Para adoção"], ["LOST", "Perdido"], ["FOUND", "Encontrado"]].map(([option, text]) => <button type="button" key={option} className={`h-full rounded-xl border px-4 text-sm font-semibold transition ${value === option ? "border-petly-accent bg-petly-mint text-petly-ink ring-2 ring-petly-mint" : "border-petly-line bg-white text-petly-muted hover:border-petly-accent"}`} onClick={() => onChange(option)} aria-pressed={value === option}>{text}</button>)}</div></fieldset>; return <div className="h-full"><StyledDropdown label={label} value={value} options={options} onChange={onChange}/></div>; }

export default function RegisterPetPage() { const [form, setForm] = useState({ name: "", species: "Cachorro", breed: "Sem raça definida", age: "", description: "", status: "AVAILABLE" as "AVAILABLE" | "LOST" | "FOUND", photoUrl: "" }); const [fileName, setFileName] = useState(""); const [loading, setLoading] = useState(false); const [uploading, setUploading] = useState(false); const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null); const breeds = useMemo(() => speciesBreeds[form.species] ?? speciesBreeds.Outro, [form.species]); const update = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function handleFileChange(file: File | undefined) { if (!file) return; if (!file.type.startsWith("image/")) { setFeedback({ type: "error", message: "Selecione um arquivo de imagem válido." }); return; } if (file.size > 5 * 1024 * 1024) { setFeedback({ type: "error", message: "A imagem deve ter no máximo 5MB." }); return; } setUploading(true); setFeedback(null); try { const reader = new FileReader(); const dataUrl = await new Promise<string>((resolve, reject) => { reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Não foi possível ler a imagem.")); reader.readAsDataURL(file); }); update("photoUrl", dataUrl); setFileName(file.name); } catch (error) { setFeedback({ type: "error", message: error instanceof Error ? error.message : "Não foi possível processar a imagem." }); } finally { setUploading(false); } }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setFeedback(null); const auth = localStorage.getItem("petly-auth"); const token = auth ? JSON.parse(auth).token : null; if (!token) { setFeedback({ type: "error", message: "Faça login para cadastrar um pet." }); return; } setLoading(true); try { await petService.create({ ...form, age: form.age ? Number(form.age) : undefined }, token); setFeedback({ type: "success", message: "Pet cadastrado com sucesso!" }); } catch (error) { setFeedback({ type: "error", message: error instanceof Error ? error.message : "Não foi possível cadastrar o pet." }); } finally { setLoading(false); } }

  return (
  <main className="min-h-screen bg-petly-cream px-5 py-6 text-petly-ink">
    <section className="mx-auto max-w-3xl py-12 md:py-20">
      <div className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">
        Sua contribuição
        </span>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.06em]">
          Cadastrar um pet
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-petly-muted">
          Compartilhe as informações do animal para que a comunidade possa ajudar.
        </p>
      </div>
      <form className="rounded-3xl border border-petly-line bg-white p-6 shadow-xl shadow-petly-ink/5 md:p-9" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Nome do pet<input className={inputClass} value={form.name} onChange={(event) =>
          update("name", event.target.value)} placeholder="Ex.: Lilica" required/>
        </label>
        <label className="text-sm font-semibold">
          Idade<input className={inputClass} type="number" min="0" value={form.age} onChange={(event) =>
          update("age", event.target.value)} placeholder="Em anos"/>
        </label>
        <SelectField label="Espécie" value={form.species} options={Object.keys(speciesBreeds)} onChange={(value) =>
          setForm((current) =>
          ({ ...current, species: value, breed: speciesBreeds[value][0] }))}/>
        <SelectField label="Raça" value={form.breed} options={breeds} onChange={(value) =>
          update("breed", value)}/>
        </div>
        <div className="mt-5">
          <SelectField label="Situação" value={form.status} options={["AVAILABLE", "LOST", "FOUND"]} onChange={(value) =>
          update("status", value)}/>
        </div>
        <label className="mt-5 block text-sm font-semibold">
          Descrição<textarea className="mt-2 min-h-32 w-full resize-y rounded-xl border border-petly-line bg-white p-4 text-sm outline-none transition placeholder:text-[#9aaba5] focus:border-petly-accent focus:ring-4 focus:ring-petly-mint" value={form.description} onChange={(event) =>
          update("description", event.target.value)} placeholder="Conte um pouco sobre o pet..." required/>
        </label>
        <div className="mt-5">
          <span className="text-sm font-semibold">
          Foto do pet <span className="font-normal text-petly-muted">
          (opcional)</span>
        </span>
        <label className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-petly-line bg-petly-cream/50 px-5 text-center transition hover:border-petly-accent hover:bg-petly-mint/40">
          <span className="text-2xl">
          📷</span>
        <span className="mt-2 text-sm font-semibold text-petly-accent">
          {uploading ? "Enviando imagem..." : fileName || "Escolher uma imagem"}</span>
        <span className="mt-1 text-xs text-petly-muted">
          JPG, PNG ou WEBP</span>
        <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) =>
          handleFileChange(event.target.files?.[0])} />
        </label>
        </div>
        {feedback && <p className={`mt-5 rounded-xl p-4 text-sm ${feedback.type === "success" ? "bg-petly-mint text-petly-ink" : "bg-red-50 text-red-700"}`}>
          {feedback.message}</p>
        }<button className="mt-7 w-full rounded-full bg-petly-ink py-4 text-sm font-semibold text-white transition hover:bg-petly-accent disabled:cursor-wait disabled:opacity-60" disabled={loading || uploading} type="submit">
          {loading ? "Cadastrando..." : "Cadastrar pet"}
        </button>
      </form>
    </section>
  </main>
  )
}
