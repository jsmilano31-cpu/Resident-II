"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { ArchitecturalImage } from "@/types/architecture";
import { spaces } from "@/data/project";
import { useDialogLock } from "./useDialogLock";
import { MediaImage } from "./MediaImage";

export function ArchitecturalGallery({ items, label }: { items: ArchitecturalImage[]; label: string }) {
  const [room, setRoom] = useState("all");
  const filtered = items.filter(item => room === "all" || item.spaceId === room);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  useDialogLock(selected !== null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pages = Math.ceil(filtered.length / 6);
  const visible = filtered.slice(page * 6, page * 6 + 6);
  const active = selected === null ? null : filtered[selected];
  function step(direction: number) { setPage(value => (value + direction + pages) % pages); requestAnimationFrame(() => { stage.current?.focus({ preventScroll: true }); stage.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }); }
  function stepImage(direction: number) { setSelected(value => value === null ? null : (value + direction + filtered.length) % filtered.length); }
  if (!filtered.length) return null;
  return <div className="architectural-gallery" role="region" aria-label={label}>
    <label className="room-index">Explore by space <select value={room} onChange={event => { setRoom(event.target.value); setPage(0); }}><option value="all">All 41 perspectives</option>{spaces.map(space => <option key={space.id} value={space.id}>{space.name} / {space.japanese}</option>)}</select></label>
    <div className="editorial-grid" ref={stage} tabIndex={-1} aria-label="Gallery page">
      {visible.map((image, index) => <figure className="editorial-image" key={image.id}>
        <button className="editorial-image-button" aria-label={`Enlarge: ${image.caption}`} onClick={event => {
          opener.current = event.currentTarget; setSelected(page * 6 + index); dialog.current?.showModal();
        }}>
          <MediaImage image={image} sizes="(max-width:767px) 88vw, 70vw" />
          <span className="card-expand" aria-hidden="true"><Expand size={20} /></span>
          <span className="card-caption"><strong>{image.spaceName}</strong><span lang="ja">{image.japanese}</span></span>
        </button>
      </figure>)}
    </div>
    <div className="carousel-controls">
      <p aria-live="polite">{page * 6 + 1}–{Math.min((page + 1) * 6, filtered.length)} <span>/ {filtered.length} views</span></p>
      <span className="gallery-hint">Select a perspective to enlarge</span>
      <div className="carousel-arrows"><button className="icon-button" aria-label={`Previous ${label} views`} disabled={pages < 2} onClick={() => step(-1)}><ArrowLeft /></button><button className="icon-button" aria-label={`Next ${label} views`} disabled={pages < 2} onClick={() => step(1)}><ArrowRight /></button></div>
    </div>
    <dialog ref={dialog} className="lightbox" aria-label={`${label} image viewer`} onClose={() => { setSelected(null); opener.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); stepImage(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      <div className="lightbox-top"><span>{active?.spaceName} <span lang="ja">{active?.japanese}</span></span><button className="icon-button" aria-label="Close image" onClick={() => dialog.current?.close()}><X /></button></div>
      {active && <div className="lightbox-image"><MediaImage image={active} full key={active.id} /></div>}
      <div className="lightbox-bottom"><p aria-live="polite">{selected === null ? 0 : selected + 1} / {filtered.length}</p><div className="carousel-arrows"><button className="icon-button" aria-label="Previous image" onClick={() => stepImage(-1)}><ArrowLeft /></button><button className="icon-button" aria-label="Next image" onClick={() => stepImage(1)}><ArrowRight /></button></div></div>
    </dialog>
  </div>;
}
