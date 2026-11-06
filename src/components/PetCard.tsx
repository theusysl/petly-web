"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { petService } from "@/services/petService";
export type Pet = { id: string; name: string; kind: string; breed: string; age: string; city: string; image: string; ownerId: number; status?: string };
export function PetCard({ pet }: { pet: Pet }) { const [liked, setLiked] = useState(false); const [deleting, setDeleting] = useState(false); let canDelete = false; try { const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null"); canDelete = auth?.user?.role === "ADMIN" || Number(auth?.user?.id) === pet.ownerId; } catch {} async function removePet() { const auth = JSON.parse(localStorage.getItem("petly-auth") ?? "null"); if (!auth?.token || !confirm(`Excluir ${pet.name}?`)) return; setDeleting(true); try { await petService.remove(pet.id, auth.token); window.location.reload(); } catch { setDeleting(false); alert("Não foi possível excluir este pet."); } } return (
  <article className="overflow-hidden rounded-2xl border-petly-line bg-white transition shadow-lg shadow-olive-150">
    <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${pet.image})` }}>
      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-petly-accent">{pet.status === "LOST" ? "Pet perdido" : pet.status === "FOUND" ? "Pet encontrado" : "Para adoção"}</span>
      <button className={`absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/90 ${liked ? "text-red-500" : "text-petly-ink"}`} aria-label={`Favoritar ${pet.name}`} onClick={() => setLiked(!liked)}>
        <Icon name="heart" size={18} />
      </button>
    </div>
    <div className="flex justify-between gap-3 p-4">
      <div>
        <h3 className="mb-1 text-xl font-semibold tracking-tighter text-petly-ink">{pet.name}</h3>
        <p className="text-xs text-petly-muted">{pet.kind} · {pet.breed} · {pet.age}</p>
      </div>
      <span className="flex items-center gap-1 whitespace-nowrap text-xs text-petly-muted pr-1">
        <Icon name="map" size={15} /> {pet.city}
      </span>
    </div>
    <Link className="flex items-center justify-between border-t border-petly-line px-5 py-4 text-xs font-bold text-petly-accent" href={`/pets/${pet.id}`}>
      Conhecer {pet.name} <Icon name="arrow" size={17} />
    </Link>
    {canDelete && <button className="w-full border-t border-petly-line px-5 py-3 text-left text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" onClick={removePet} disabled={deleting}>{deleting ? "Excluindo..." : "Excluir pet"}</button>}
  </article>
); }
