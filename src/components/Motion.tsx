"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
export function Motion({ children }: { children: React.ReactNode }) {
 const root = useRef<HTMLDivElement>(null);
 useGSAP(() => {
  if ((navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData) return;
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
   gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => gsap.from(el, { y: 20, opacity: 0, duration: .7, scrollTrigger: { trigger: el, start: "top 94%", once: true } }));
  });
  const refresh = () => ScrollTrigger.refresh();
  const current = root.current;
  current?.addEventListener("load", refresh, true);
  return () => { current?.removeEventListener("load", refresh, true); mm.revert(); };
 }, { scope: root });
 return <div ref={root}>{children}</div>;
}
