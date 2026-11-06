"use client";

import { useEffect, useRef, useState } from "react";

export function StyledDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <div className="relative" ref={ref}><span className="text-sm font-semibold">{label}</span><button type="button" className={`mt-2 flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm transition ${open ? "border-petly-accent ring-4 ring-petly-mint" : "border-petly-line"}`} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>{value}<span className={`text-petly-accent transition ${open ? "rotate-180" : ""}`}>⌄</span></button>{open && <div className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-petly-line bg-white p-1 shadow-xl shadow-petly-ink/10" role="listbox">{options.map((option) => <button type="button" key={option} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${option === value ? "bg-petly-mint font-semibold text-petly-ink" : "text-petly-muted hover:bg-petly-cream hover:text-petly-ink"}`} onClick={() => { onChange(option); setOpen(false); }}>{option}</button>)}</div>}</div>;
}
