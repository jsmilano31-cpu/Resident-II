"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import { categories, spaces } from "@/data/project";
import type { ArchitecturalImage } from "@/types/architecture";
import { useDialogLock } from "./useDialogLock";
import { MediaImage } from "./MediaImage";
export function ArchitecturalGallery({ items, label }: { items: ArchitecturalImage[]; label: string }) {
  const [category, setCategory] = useState("All spaces");
  const [spaceId, setSpaceId] = useState("living");
  const [angle, setAngle] = useState(0);
  const [modal, setModal] = useState<number | null>(null);
  useDialogLock(modal !== null);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<number | null>(null);
  const filtered = items.filter(
    (i) => category === "All spaces" || i.category === category,
  );
  const available = spaces.filter((s) =>
    filtered.some((i) => i.spaceId === s.id),
  );
  const activeId = available.some((s) => s.id === spaceId)
    ? spaceId
    : available[0]?.id;
  const views = filtered.filter((i) => i.spaceId === activeId);
  const active = views[angle] ?? views[0];
  const selected = modal === null ? null : filtered[modal];
  function step(delta: number) {
    if (views.length)
      setAngle((i) => (i + delta + views.length) % views.length);
  }
  function stepModal(delta: number) {
    setModal((i) =>
      i === null ? null : (i + delta + filtered.length) % filtered.length,
    );
  }
  function open(image: ArchitecturalImage, button: HTMLButtonElement) {
    trigger.current = button;
    setModal(filtered.findIndex((i) => i.id === image.id));
    dialog.current?.showModal();
  }
  function swipe(end: number, isModal = false) {
    if (touch.current !== null && Math.abs(end - touch.current) > 45) {
      const delta = end < touch.current ? 1 : -1;
      if (isModal) stepModal(delta);
      else step(delta);
    }
    touch.current = null;
  }
  return (
    <div className="architectural-gallery space-explorer" role="region" aria-label={label}>
      <div className="gallery-toolbar">
        <div className="gallery-filters" aria-label="Collections">
          {categories.map((name) => (
            <button
              key={name}
              aria-pressed={category === name}
              onClick={() => {
                setCategory(name);
                setAngle(0);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <span className="view-total">{filtered.length} perspectives</span>
      </div>
      <div className="explorer-layout">
        <label className="mobile-space-select">
          Choose a space / <span lang="ja">空間を選ぶ</span>
          <select
            value={activeId ?? ""}
            onChange={(event) => {
              setSpaceId(event.target.value);
              setAngle(0);
            }}
          >
            {available.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} / {space.japanese}
              </option>
            ))}
          </select>
        </label>
        <div className="explorer-main">
          {active ? (
            <>
              <button
                className="explorer-image"
                aria-label={"Enlarge: " + active.caption}
                onClick={(e) => open(active, e.currentTarget)}
                onTouchStart={(e) => {
                  touch.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (
                    touch.current !== null &&
                    Math.abs(e.changedTouches[0].clientX - touch.current) > 45
                  ) {
                    e.preventDefault();
                    swipe(e.changedTouches[0].clientX);
                  }
                }}
              >
                <MediaImage key={active.id} image={active} />
                <span className="expand">
                  <Expand size={18} />
                </span>
              </button>
              <div className="angle-controls">
                <button
                  className="icon-button"
                  aria-label="Previous angle"
                  disabled={views.length < 2}
                  onClick={() => step(-1)}
                >
                  <ArrowLeft size={18} />
                </button>
                <p aria-live="polite">
                  {active.spaceName}
                  <span>
                    View {views.indexOf(active) + 1} / {views.length}
                  </span>
                </p>
                <button
                  className="icon-button"
                  aria-label="Next angle"
                  disabled={views.length < 2}
                  onClick={() => step(1)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <div
                className="angle-thumbnails"
                aria-label="Choose a perspective"
              >
                {views.map((image, i) => (
                  <button
                    key={image.id}
                    aria-label={image.spaceName + ", angle " + (i + 1)}
                    aria-pressed={image.id === active.id}
                    onClick={() => setAngle(i)}
                  >
                    <MediaImage image={image} sizes="100px" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>No perspectives available.</p>
          )}
        </div>
        <div className="space-list" aria-label="Choose a space">
          {available.map((space) => (
            <button
              key={space.id}
              aria-pressed={space.id === activeId}
              onClick={() => {
                setSpaceId(space.id);
                setAngle(0);
              }}
            >
              <span>
                {space.name} <small lang="ja">{space.japanese}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
      <div className="all-views-heading">
        <div>
          <span className="eyebrow">The complete collection</span>
          <h3>Every perspective. A closer look.</h3>
        </div>
        <button
          className="button"
          aria-expanded={expanded}
          aria-controls="all-perspectives"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? "Hide collection"
            : "Browse all " + filtered.length + " views"}{" "}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </div>
      <div id="all-perspectives" hidden={!expanded} className="all-views">
        {expanded &&
          filtered.map((image) => (
            <figure key={image.id}>
              <button
                aria-label={"Enlarge: " + image.caption}
                onClick={(e) => open(image, e.currentTarget)}
              >
                <MediaImage
                  image={image}
                  sizes="(max-width:767px) 90vw, 30vw"
                />
              </button>
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${label} image viewer`}
        onClose={() => {
          setModal(null);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            stepModal(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="lightbox-top">
          <span className="eyebrow">The Residence II / Architectural renders</span>
          <button
            className="icon-button"
            aria-label="Close image"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        {selected && (
          <div
            className="lightbox-image"
            onTouchStart={(e) => {
              touch.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => swipe(e.changedTouches[0].clientX, true)}
          >
            <MediaImage key={selected.id} image={selected} full />
          </div>
        )}
        <div className="lightbox-bottom">
          <p aria-live="polite">
            {selected?.caption}
            <span>
              {modal === null ? 0 : modal + 1} / {filtered.length}
            </span>
          </p>
          <div className="lightbox-arrows">
            <button
              className="icon-button"
              aria-label="Previous image"
              disabled={filtered.length < 2}
              onClick={() => stepModal(-1)}
            >
              <ArrowLeft />
            </button>
            <button
              className="icon-button"
              aria-label="Next image"
              disabled={filtered.length < 2}
              onClick={() => stepModal(1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
