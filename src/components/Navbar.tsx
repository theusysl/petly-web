"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

export function Navbar() { const [authUser, setAuthUser] = useState<{ name: string; role: string } | null>(null); const [hydrated, setHydrated] = useState(false); useEffect(() => { const syncAuth = () => { try { setAuthUser(JSON.parse(localStorage.getItem("petly-auth") ?? "null")?.user ?? null); } catch { setAuthUser(null); } }; syncAuth(); setHydrated(true); window.addEventListener("petly-auth-changed", syncAuth); window.addEventListener("storage", syncAuth); return () => { window.removeEventListener("petly-auth-changed", syncAuth); window.removeEventListener("storage", syncAuth); }; }, []); return (
  <header className="mx-auto flex max-w-7xl items-center gap-10 px-5 py-5 md:px-8">
    <Brand />
    <nav className="hidden flex-1 gap-8 text-sm text-[#587069] md:flex">
        <Link href="/pets?status=available">Adotar</Link>
      <Link href="/eventos">Eventos</Link>
        <Link href="/pets?status=lost">Achados e perdidos</Link>
      <a href="#como-funciona">Como funciona</a>
    </nav>
    <div className="ml-auto hidden items-center gap-3 text-sm md:flex">
      {!hydrated ? <div className="h-10 w-28" aria-hidden="true" /> : !authUser ? <>
        <Link className="rounded-full px-4 py-2 font-semibold hover:bg-petly-line transition" href="/login">Entrar</Link>
        <Link className="rounded-full bg-petly-ink px-4 py-2 font-semibold text-white" href="/cadastro">Criar conta</Link>
      </>
      : <>
        <Link className="rounded-full border border-petly-line px-4 py-2.5 pb-2 font-semibold text-petly-ink text-center" href="/perfil">
          Olá, {authUser.name.split(" ")[0]}
        </Link>
        <Link className="rounded-full bg-petly-accent px-4 py-2.5 pb-2 font-semibold text-white text-center" href="/cadastrar-pet">
          Cadastrar pet
        </Link>
        {["ADMIN", "ONG", "VET"].includes(authUser.role) && <Link className="rounded-full bg-petly-ink px-4 py-2.5 pb-2 font-semibold text-white text-center" href="/eventos/novo">
          Adicionar evento
        </Link>
        }
      </>
      }
    </div>
    <button className="ml-auto md:hidden" aria-label="Abrir menu">
      <Icon name="menu" />
    </button>
  </header>
)}
