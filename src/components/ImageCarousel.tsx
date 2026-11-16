"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { ArchitecturalImage } from "@/types/architecture";
import { MediaImage } from "./MediaImage";

export function ImageCarousel({ items, label }: { items: ArchitecturalImage[]; label: string }) {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pages = Math.ceil(items.length / 3);
  const visible = items.slice(page * 3, page * 3 + 3);
  const active = selected === null ? null : items[selected];
  function step(direction: number) { setPage(value => (value + direction + pages) % pages); if (stage.current) stage.current.scrollLeft = 0; }
  function stepImage(direction: number) { setSelected(value => value === null ? null : (value + direction + items.length) % items.length); }
  if (!items.length) return null;
  return <div className="image-carousel" role="region" aria-label={label} aria-roledescription="carousel">
    <div className="carousel-stage" ref={stage}>
      {visible.map((image, index) => <figure className="image-card" key={image.id}>
        <button className="image-card-button" aria-label={`Enlarge: ${image.caption}`} onClick={event => {
          opener.current = event.currentTarget; setSelected(page * 3 + index); dialog.current?.showModal();
        }}>
          <MediaImage image={image} sizes="(max-width:767px) 88vw, 55vw" />
          <span className="card-expand" aria-hidden="true"><Expand size={20} /></span>
          <span className="card-caption"><strong>{image.spaceName}</strong><span lang="ja">{image.japanese}</span></span>
        </button>
      </figure>)}
    </div>
    <div className="carousel-controls">
      <p aria-live="polite">{page * 3 + 1}–{Math.min((page + 1) * 3, items.length)} <span>/ {items.length} views</span></p>
      <span className="carousel-hint">Hover to look closer · Select to open</span>
      <div className="carousel-arrows"><button className="icon-button" aria-label={`Previous ${label} views`} disabled={pages < 2} onClick={() => step(-1)}><ArrowLeft /></button><button className="icon-button" aria-label={`Next ${label} views`} disabled={pages < 2} onClick={() => step(1)}><ArrowRight /></button></div>
    </div>
    <dialog ref={dialog} className="lightbox" aria-label={`${label} image viewer`} onClose={() => { setSelected(null); opener.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); stepImage(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      <div className="lightbox-top"><span>{active?.spaceName} <span lang="ja">{active?.japanese}</span></span><button className="icon-button" aria-label="Close image" onClick={() => dialog.current?.close()}><X /></button></div>
      {active && <div className="lightbox-image"><MediaImage image={active} full key={active.id} /></div>}
      <div className="lightbox-bottom"><p aria-live="polite">{selected === null ? 0 : selected + 1} / {items.length}</p><div className="carousel-arrows"><button className="icon-button" aria-label="Previous image" onClick={() => stepImage(-1)}><ArrowLeft /></button><button className="icon-button" aria-label="Next image" onClick={() => stepImage(1)}><ArrowRight /></button></div></div>
    </dialog>
  </div>;
}
