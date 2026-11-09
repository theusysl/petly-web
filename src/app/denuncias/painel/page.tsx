"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { reportService, type ApiReport } from "@/services/reportService";

const labels = { OPEN: "Aberta", IN_PROGRESS: "Em análise", RESOLVED: "Resolvida" };

export default function ReportsPanelPage() {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [error, setError] = useState("");
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
    const canAccess = ["ADMIN", "ONG", "VET"].includes(auth?.user?.role);
    setAllowed(canAccess);
    if (canAccess) reportService.list(auth.token).then(setReports).catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar as denúncias."));
  }, []);
  async function changeStatus(id: number, status: ApiReport["status"]) {
    const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
    try { const updated = await reportService.updateStatus(id, status, auth.token); setReports((current) => current.map((report) => report.id === id ? updated : report)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar a denúncia."); }
  }
  if (!allowed) return <main className="min-h-screen bg-petly-cream px-5 py-8 text-center text-petly-ink"><Brand /><div className="mx-auto mt-24 max-w-md rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-2xl font-semibold">Acesso restrito</h1><p className="mt-3 text-sm text-petly-muted">Este painel é destinado a administradores, ONGs e veterinários.</p><Link href="/" className="mt-6 inline-block text-sm font-semibold text-petly-accent">Voltar para o início</Link></div></main>;
  return (
    <main className="min-h-screen bg-petly-cream px-5 pb-24 text-petly-ink md:px-8">
      <section className="mx-auto max-w-7xl pb-10 pt-12">
        <span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">Moderação</span>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em]">Painel de denúncias.</h1>
        <p className="mt-4 max-w-xl text-lg text-petly-muted">
          Analise os relatos da comunidade e acompanhe o tratamento de cada caso.
        </p>
      </section>
      <section className="mx-auto max-w-7xl">{error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}{reports.length === 0 && !error && <div className="rounded-3xl border border-petly-line bg-white p-12 text-center text-petly-muted">Nenhuma denúncia encontrada.</div>}<div className="space-y-4">{reports.map((report) => <article key={report.id} className="rounded-2xl border border-petly-line bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><span className="text-xs font-bold uppercase tracking-wider text-petly-accent">Denúncia #{report.id}</span><p className="mt-3 whitespace-pre-line text-sm leading-6 text-petly-ink">{report.description}</p><p className="mt-4 text-xs text-petly-muted">{new Date(report.createdAt).toLocaleString("pt-BR")}</p></div><select value={report.status} onChange={(event) => changeStatus(report.id, event.target.value as ApiReport["status"])} className="h-11 rounded-xl border border-petly-line bg-white px-3 text-sm font-semibold text-petly-accent"><option value="OPEN">{labels.OPEN}</option><option value="IN_PROGRESS">{labels.IN_PROGRESS}</option><option value="RESOLVED">{labels.RESOLVED}</option></select></div></article>)}</div></section>
    </main>
  );
}
