"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Expand, Minus, Plus, X } from "lucide-react";
import plans from "@/data/floorplans.json";
import { spaces, images } from "@/data/project";
import type { FloorPlan } from "@/types/architecture";
import { MediaImage } from "./MediaImage";
import { Gallery } from "./Gallery";

export const floorPlans: FloorPlan[] = plans;
export function FloorPlans() {
  const [floor, setFloor] = useState(0);
  const [opened, setOpened] = useState(false);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState("living");
  const plan = floorPlans[floor];
  function reset() {
    setZoom(1);
    if (viewport.current) { viewport.current.scrollTop = 0; viewport.current.scrollLeft = 0; }
  }
  function changeFloor(index: number) { setFloor(index); setRoomId(index === 0 ? "living" : "bedroom-2"); reset(); }
  function floorButtons() {
    return <div className="floor-selector" role="group" aria-label="Choose a floor">
      {floorPlans.map((item, index) => <button key={item.id} aria-pressed={index === floor} onClick={() => changeFloor(index)}>
        {item.title} <span lang="ja">{item.japanese}</span>
      </button>)}
    </div>;
  }
  return <>
    {floorButtons()}
    <div className="floorplan-layout">
      <figure className="floorplan-preview">
        <button ref={opener} className="floorplan-open" aria-label={`Enlarge ${plan.title} plan`} onClick={() => {
          reset(); setOpened(true); dialog.current?.showModal();
        }}>
          <MediaImage key={plan.id} image={plan} sizes="(max-width:900px) 90vw, 65vw" />
          <span className="floorplan-enlarge"><Expand size={16} /> Enlarge plan</span>
        </button>
        <figcaption aria-live="polite">{plan.title} <span lang="ja">/ {plan.japanese}</span> · Supplied furnished layout</figcaption>
      </figure>
      <aside className="floorplan-rooms" aria-label={`${plan.title} rooms`}>
        <span className="eyebrow">From layout to living</span>
        <h3>Step into a space.</h3>
        <p>Choose a room. Its perspectives appear alongside the plan.</p>
        <div className="floorplan-room-links">
          {plan.roomIds.map((id) => {
            const room = spaces.find((item) => item.id === id)!;
            return <a key={id} href="#selected-room" aria-current={roomId === id ? "true" : undefined} onClick={(event) => { event.preventDefault(); setRoomId(id); }}>
              <span>{room.name} <small lang="ja">{room.japanese}</small></span><ArrowUpRight size={15} />
            </a>;
          })}
        </div>
      </aside>
      <div id="selected-room" className="floor-room-preview" aria-label="Selected room perspectives"><Gallery key={roomId} items={images.filter((image) => image.spaceId === roomId)} initialSpaceId={roomId} compact /></div>
    </div>
    <dialog ref={dialog} className="plan-dialog" aria-label="Floor plan viewer" onClose={() => { setOpened(false); reset(); opener.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="plan-dialog-header"><span className="eyebrow">The Residence II / Floor plans</span><button className="icon-button" aria-label="Close floor plan" onClick={() => dialog.current?.close()}><X /></button></div>
      {opened && <>
        {floorButtons()}
        <div className="plan-zoom-controls" role="group" aria-label="Plan zoom">
          <button className="icon-button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))}><Minus size={18} /></button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button className="icon-button" aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + 0.5))}><Plus size={18} /></button>
          <button className="plan-fit" onClick={reset}>Fit to view</button>
        </div>
        <div ref={viewport} className="plan-viewport" tabIndex={0} role="region" aria-label="Enlarged floor plan; scroll to inspect when zoomed">
          <div className="plan-zoom-image" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><MediaImage key={plan.id} image={plan} full /></div>
        </div>
        <p className="plan-viewer-hint">{plan.title} · Zoom in, then scroll to explore the details.</p>
      </>}
    </dialog>
  </>;
}
