"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "./Brand";
import { authService } from "@/services/authService";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = isLogin ? await authService.login(email, password) : await authService.register(name, email, password);
      localStorage.setItem("petly-auth", JSON.stringify({ token: auth.token, user: { id: auth.id, name: auth.name, email: auth.email, role: auth.role } }));
      window.dispatchEvent(new Event("petly-auth-changed"));
      router.push(isLogin ? "/" : "/login");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível concluir a autenticação.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="min-h-screen bg-petly-cream px-5 py-6 text-petly-ink sm:px-8">
    <section className="flex items-center pt-20">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-petly-ink/5 sm:p-10">
        <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[.18em] text-petly-accent">
        {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}</span>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">
        {isLogin ? "Entrar no Petly" : "Junte-se ao Petly"}</h2>
      <p className="mt-2 text-sm text-petly-muted">
        {isLogin ? "Acesse sua conta para continuar." : "É rápido, gratuito e feito para a comunidade."}</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold">
        E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-petly-line px-4 text-sm font-normal outline-none transition placeholder:text-[#9aaba5] focus:border-petly-accent focus:ring-4 focus:ring-petly-mint" type="email" placeholder="voce@email.com" required />
      </label>
      {!isLogin && <label className="block text-sm font-semibold">
        Nome completo<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-petly-line px-4 text-sm font-normal outline-none transition placeholder:text-[#9aaba5] focus:border-petly-accent focus:ring-4 focus:ring-petly-mint" type="text" placeholder="Como podemos chamar você?" required />
      </label>
      }<label className="block text-sm font-semibold">
        Senha<div className="relative mt-2">
        <input value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-petly-line px-4 pr-20 text-sm font-normal outline-none transition placeholder:text-[#9aaba5] focus:border-petly-accent focus:ring-4 focus:ring-petly-mint" type={showPassword ? "text" : "password"} placeholder="••••••••" minLength={3} required />
      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-petly-accent" onClick={() =>
        setShowPassword(!showPassword)}>
        {showPassword ? "Ocultar" : "Mostrar"}</button>
      </div>
      </label>
      {!isLogin && <label className="flex items-start gap-3 text-xs leading-5 text-petly-muted">
        <input className="mt-1 accent-petly-accent" type="checkbox" required />
      <span>
        Concordo com os termos de uso e a política de privacidade do Petly.</span>
      </label>
      }{isLogin && <div className="text-right">
        <button type="button" className="text-xs font-semibold text-petly-accent">
        Esqueci minha senha</button>
      </div>
      }{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full cursor-pointer rounded-full bg-petly-ink py-3 text-sm font-semibold text-white transition hover:bg-petly-accent disabled:cursor-wait disabled:opacity-60" type="submit">
        {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar minha conta"}</button>
      </form><p className="mt-7 text-center text-sm text-petly-muted">
        {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"} <Link className="font-semibold text-petly-accent" href={isLogin ? "/cadastro" : "/login"}>
        {isLogin ? "Criar conta" : "Entrar"}</Link>
      </p>
      </div>
    </section>
  </main>
  )
}
