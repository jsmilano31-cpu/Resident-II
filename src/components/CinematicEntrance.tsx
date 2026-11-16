"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { entranceScenes } from "@/data/project";
import { MediaImage } from "./MediaImage";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicEntrance() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const element = root.current!;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let disposed = false;
      const first = element.querySelector<HTMLImageElement>(".entrance-scene img");
      const start = () => {
        if (disposed || !first?.naturalWidth) return;
        element.setAttribute("data-ready", "true");
      };
      if (first?.complete) { if (first.decode) first.decode().then(start, () => {}); else start(); }
      else first?.addEventListener("load", start, { once: true });
      return () => { disposed = true; first?.removeEventListener("load", start); element.removeAttribute("data-ready"); };
    });
    mm.add("(min-width:1100px) and (min-height:700px) and (pointer:fine) and (prefers-reduced-motion:no-preference)", () => {
      element.setAttribute("data-immersive", "true");
      const scenes = [...element.querySelectorAll<HTMLElement>(".entrance-scene")];
      const media = scenes.map(scene => scene.querySelector<HTMLElement>(".scene-scroll-layer")!);
      const photos = scenes.map(scene => scene.querySelector<HTMLImageElement>("img"));
      const copy = element.querySelectorAll(".cinematic-copy,.scroll-cue");
      const state = { progress: 0 };
      const ready = photos.map(() => false);
      let disposed = false;
      function paint() {
        const progress = ready[1] ? Math.min(state.progress, ready[2] ? 2 : 1) : 0;
        gsap.set(scenes[0], { opacity: 1 - Math.min(progress, 1) });
        gsap.set(scenes[1], { opacity: progress <= 1 ? progress : 2 - progress });
        gsap.set(scenes[2], { opacity: Math.max(0, progress - 1) });
        media.forEach((layer, index) => gsap.set(layer, { scale: 1 + Math.max(0, Math.min(1, progress - index)) * .08 }));
        gsap.set(copy, { opacity: 1 - Math.min(progress * 1.7, 1) });
      }
      const loaded = photos.map((photo, index) => {
        const done = () => { if (!disposed) { ready[index] = Boolean(photo?.naturalWidth); paint(); } };
        const load = () => { if (photo?.decode) photo.decode().then(done, () => {}); else done(); };
        photo?.addEventListener("load", load);
        if (photo?.complete) load();
        return load;
      });
      paint();
      gsap.to(state, { progress: 2, ease: "none", scrollTrigger: {
        trigger: element, start: "top top", end: "bottom bottom", scrub: .7, invalidateOnRefresh: true,
      }, onUpdate: paint });
      return () => {
        disposed = true;
        photos.forEach((photo, index) => photo?.removeEventListener("load", loaded[index]));
        element.removeAttribute("data-immersive");
        [...scenes,...media,...element.querySelectorAll<HTMLElement>(".cinematic-copy,.scroll-cue")].forEach(node => { node.style.removeProperty("opacity"); node.style.removeProperty("transform"); });
      };
    });
    return () => mm.revert();
  }, { scope: root });
  return <section id="hero" className="cinematic-entrance" ref={root} aria-labelledby="hero-title">
    <div className="entrance-stage">
    <a className="skip-intro" href="#concept">Skip introduction ↗</a>

      {entranceScenes.map((scene, index) => <figure key={scene.image.id} className="entrance-scene" style={{ "--focal": scene.focal } as React.CSSProperties}>
        <div className="scene-scroll-layer"><div className="scene-zoom-layer"><MediaImage image={scene.image} priority={index === 0} sizes="100vw" /></div></div>
        <div className="scene-shade" aria-hidden="true" />
        <figcaption>{scene.label} <span lang="ja">{scene.japanese}</span></figcaption>
        {index === 0 && <div className="cinematic-copy"><h1 id="hero-title" className="cinematic-title">The Residence II</h1><p className="cinematic-subtitle">A contemporary two-storey home.<span lang="ja">光と重なりのある住まい</span></p></div>}
      </figure>)}
      <a className="scroll-cue" href="#concept" aria-label="Continue to the project introduction"><span>SCROLL TO EXPLORE</span><i /></a>
    </div>
  </section>;
}
