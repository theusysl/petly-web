import type { ReactNode } from "react";

export type IconName = "search" | "map" | "heart" | "paw" | "arrow" | "sun" | "shield" | "menu";

const paths: Record<IconName, ReactNode> = {
  paw: <><path d="M8.2 11.4c-1.3-1.4-3.1-1.3-4.1-.2-1.1 1.2-.7 3.3.8 4.2 1 .6 2.1.4 3.1-.3l1.2-.8c.5-.3 1.1-.3 1.6 0l1.2.8c1 .7 2.1.9 3.1.3 1.5-.9 1.9-3 .8-4.2-1-1.1-2.8-1.2-4.1.2-.7.8-2.1.8-2.8 0Z"/><circle cx="6.5" cy="6.5" r="1.7"/><circle cx="17.5" cy="6.5" r="1.7"/><circle cx="11.9" cy="4.3" r="1.7"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  map: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></>,
  heart: <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.5Z"/>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
  shield: <path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.8 7.5-9.5V6L12 3Z"/>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
