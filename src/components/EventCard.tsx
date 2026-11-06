import Link from "next/link";
import type { ApiEvent } from "@/services/eventService";

export function EventCard({ event }: { event: ApiEvent }) {
  const date = new Date(event.date);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-petly-line-150">
      <div className="relative h-36 overflow-hidden bg-petly-mint">
        {event.photoUrl ? (
          <img src={event.photoUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-petly-mint to-petly-peach" />
        )}
        <div className="absolute inset-0" />
        <div className="absolute bottom-3.5 left-5 grid h-20 w-20 place-items-center rounded-2xl bg-white/70 text-center text-petly-accent shadow-sm backdrop-blur-md">
          <div>
            <strong className="block text-[26px] leading-none">{date.toLocaleDateString("pt-BR", { day: "2-digit" })}</strong>
            <small className="text-[10px] font-bold">{date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}</small>
          </div>
        </div>
      </div>
      <div className="p-5 pt-7">
        <h3 className="text-2xl font-semibold tracking-tight">{event.title}</h3>
        <p className="mt-3 line-clamp-3 text-[16px] leading-6 text-petly-muted">{event.description}</p>
        <div className="mt-4 border-t border-petly-line pt-5 text-sm text-petly-muted">
          <p className="font-medium text-petly-ink">{date.toLocaleDateString("pt-BR", { dateStyle: "full" })} · {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="mt-2">{event.address || event.location}</p>
          {event.organizer?.name && <p className="mt-2 text-xs">Organizado por {event.organizer.name}</p>}
          <Link className="mt-4 inline-block font-semibold bg-petly-accent text-white rounded-full px-5 py-1.5" href={`/eventos/${event.id}`}>Ver detalhes</Link>
        </div>
      </div>
    </article>
  );
}
