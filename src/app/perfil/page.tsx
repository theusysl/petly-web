"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { petService, type ApiPet } from "@/services/petService";
import { authService } from "@/services/authService";

type AuthUser = { id: number; name: string; email: string; role: string };

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
      setUser(auth?.user ?? null);
      if (auth?.user?.id) petService.list().then((data) => setPets(data.filter((pet) => Number(pet.ownerId) === Number(auth.user.id)))).finally(() => setLoading(false));
      else setLoading(false);
    } catch { setLoading(false); }
  }, []);

  function logout() {
    localStorage.removeItem("petly-auth");
    window.dispatchEvent(new Event("petly-auth-changed"));
    window.location.href = "/";
  }

  async function deleteAccount() {
    const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null");
    if (!auth?.token || !user || !window.confirm("Excluir sua conta permanentemente? Essa ação não pode ser desfeita.")) return;
    setDeleting(true);
    try { await authService.remove(user.id, auth.token); localStorage.removeItem("petly-auth"); window.dispatchEvent(new Event("petly-auth-changed")); window.location.href = "/"; }
    catch (requestError) { setDeleting(false); window.alert(requestError instanceof Error ? requestError.message : "Não foi possível excluir sua conta."); }
  }

  if (!user) return <main className="min-h-screen bg-petly-cream px-5 py-6 text-petly-ink"><header className="mx-auto max-w-7xl"><Brand /></header><section className="mx-auto mt-24 max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-semibold">Entre para acessar seu perfil</h1><p className="mt-3 text-sm text-petly-muted">Acompanhe seus pets, interesses e notificações em um só lugar.</p><Link className="mt-7 inline-flex rounded-full bg-petly-ink px-6 py-3 text-sm font-semibold text-white" href="/login">Entrar no Petly</Link></section></main>;

  return <main className="min-h-screen bg-petly-cream px-5 pb-24 text-petly-ink md:px-8">
    <header className="mx-auto flex max-w-7xl items-center justify-between py-6"><Brand /><Link className="text-sm font-semibold text-petly-accent" href="/">Voltar para início</Link></header>
    <section className="mx-auto max-w-7xl pb-12 pt-10"><span className="text-[11px] font-bold uppercase tracking-[.18em] text-petly-accent">Minha conta</span><div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="text-5xl font-semibold tracking-[-.06em]">Olá, {user.name.split(" ")[0]}.</h1><p className="mt-3 text-petly-muted">Gerencie suas contribuições e acompanhe o que acontece com a comunidade.</p></div><button onClick={logout} className="w-fit rounded-full border border-petly-line bg-white px-5 py-2.5 text-sm font-semibold text-petly-muted">Sair da conta</button></div></section>
    <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-3xl border border-petly-line bg-white p-7 shadow-sm md:p-9"><div className="flex items-center gap-5 border-b border-petly-line pb-7"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-petly-mint text-2xl font-semibold text-petly-accent">{user.name.charAt(0).toUpperCase()}</div><div><h2 className="text-xl font-semibold">{user.name}</h2><p className="text-sm text-petly-muted">{user.email}</p><span className="mt-2 inline-block rounded-full bg-petly-mint px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-petly-accent">{user.role}</span></div></div><div className="mt-7 flex items-center justify-between"><div><span className="text-[11px] font-bold uppercase tracking-[.16em] text-petly-accent">Minhas publicações</span><h2 className="mt-2 text-2xl font-semibold">Pets cadastrados</h2></div><Link className="rounded-full bg-petly-ink px-4 py-2.5 text-sm font-semibold text-white" href="/cadastrar-pet">Cadastrar pet</Link></div>{loading && <p className="mt-7 rounded-xl bg-petly-cream p-6 text-sm text-petly-muted">Carregando suas publicações...</p>}{!loading && pets.length === 0 && <p className="mt-7 rounded-xl border border-dashed border-petly-line p-8 text-center text-sm text-petly-muted">Você ainda não cadastrou nenhum pet.</p>}{!loading && pets.length > 0 && <div className="mt-6 divide-y divide-petly-line">{pets.map((pet) => <Link href={"/pets/" + pet.id} key={pet.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"><div className="h-14 w-14 overflow-hidden rounded-xl bg-petly-mint">{pet.photoUrl && <img src={pet.photoUrl} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1"><strong>{pet.name}</strong><p className="text-xs text-petly-muted">{pet.species} · {pet.breed || "Sem raça definida"}</p></div><Icon name="arrow" size={17} /></Link>)}</div>}</div>
      <aside className="space-y-5"><div className="rounded-3xl border border-petly-line bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-petly-peach text-petly-accent"><Icon name="sun" size={19} /></span><div><span className="text-[11px] font-bold uppercase tracking-[.16em] text-petly-accent">Notificações</span><h2 className="mt-1 text-xl font-semibold">Tudo tranquilo por aqui</h2></div></div><p className="mt-5 text-sm leading-6 text-petly-muted">Quando alguém demonstrar interesse em um pet seu ou enviar uma atualização, você verá aqui.</p></div>{["ADMIN", "ONG", "VET"].includes(user.role) && <Link href="/eventos/novo" className="block rounded-3xl bg-petly-ink p-7 text-white"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-petly-mint">Sua atuação importa</span><h2 className="mt-3 text-2xl font-semibold">Organizar um evento</h2><p className="mt-2 text-sm leading-6 text-white/70">Leve uma ação da sua organização para a agenda Petly.</p><span className="mt-5 inline-block text-sm font-semibold text-petly-mint">Criar evento →</span></Link>}<div className="rounded-3xl border border-red-100 bg-red-50/50 p-7"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-red-600">Zona de segurança</span><h2 className="mt-2 text-lg font-semibold text-red-900">Excluir conta</h2><p className="mt-2 text-sm leading-6 text-red-800/70">Essa ação remove seu acesso permanentemente.</p><button onClick={deleteAccount} disabled={deleting} className="mt-5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">{deleting ? "Excluindo..." : "Excluir minha conta"}</button></div></aside>
    </section>
  </main>;
}
