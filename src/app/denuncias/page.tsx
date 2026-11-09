"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { reportService } from "@/services/reportService";

const reasons = ["Informação falsa", "Conteúdo inadequado", "Suspeita de golpe", "Exposição de dados pessoais", "Outro"];

export default function ReportsPage() {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
      await reportService.create({ description: "Motivo: " + reason + "\n\n" + description }, auth?.token);
      setSent(true);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Não foi possível enviar a denúncia."); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen bg-petly-cream px-5 pb-24 text-petly-ink p-8 md:px-24">
    <section className="mx-auto max-w-7xl pb-4 pt-4">
      <div className="mt-14 max-w-2xl">
        <h1 className="mt-4 text-3xl font-normal leading-tight tracking-[-.06em] md:text-7xl">
          Algo não parece certo?
        </h1>
        <p className="mt-5 text-lg leading-7 text-petly-muted">
          Conte para o Petly. Sua denúncia ajuda a manter a plataforma confiável.
        </p>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_.7fr]">
      <div className="rounded-3xl border border-petly-line bg-white p-7 shadow-lg md:p-10">
        {sent ? <div className="flex min-h-96 flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-petly-mint text-petly-accent">
            <Icon name="shield" size={28} />
          </span>
          <h2 className="mt-6 text-2xl font-normal">
            Denúncia recebida
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-petly-muted">
            Obrigado por ajudar a cuidar da comunidade. Nossa equipe analisará o relato.
          </p>
        </div> : 
        <>
          <h2 className="text-2xl font-semibold">
            Relatar um problema
          </h2>
          <p className="mt-2 text-sm text-petly-muted">
            Descreva o que aconteceu. Evite compartilhar dados sensíveis.
          </p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold">
              Motivo
              <select required value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-petly-line bg-white px-4 text-sm font-normal outline-none focus:border-petly-accent">
                <option value="">
                  Selecione um motivo
                </option>{reasons.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Descrição
              <textarea required minLength={10} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-40 w-full resize-y rounded-xl border border-petly-line px-4 py-3 text-sm font-normal outline-none focus:border-petly-accent" placeholder="Explique o que aconteceu..." />
            </label>
            <button disabled={loading} className="inline-flex items-center gap-2 rounded-full cursor-pointer bg-petly-ink px-6 py-2 text-sm font-semibold text-white disabled:opacity-50" type="submit">
              {loading ? "Enviando..." : "Enviar denúncia"}
              <Icon name="arrow" size={17} />
            </button>
          </form>
        </>
        }
      </div>
      <aside className="rounded-3xl bg-petly-mint p-7 md:p-9">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-petly-accent">
          <Icon name="shield" size={21} />
        </span>
        <h2 className="mt-6 text-2xl font-semibold">Quando denunciar?</h2>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-[#527265]">
          {reasons.slice(0, 4).map((item) => (
            <li key={item}>• {item}.</li>
          ))}
        </ul>
        <div className="mt-8 border-t border-[#bad6c5] pt-5 text-xs leading-5 text-[#668174]">
          As denúncias devem ser feitas de boa-fé.
        </div>
      </aside>
    </section>
  </main>;
}
