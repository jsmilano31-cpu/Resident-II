import "./setup-dom";
import assert from "node:assert/strict";
import { test, afterEach, after } from "node:test";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicEntrance } from "../src/components/CinematicEntrance";

function media(enabled: boolean) {
 window.matchMedia = query => ({ matches: enabled, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } });
}
afterEach(() => { cleanup(); ScrollTrigger.getAll().forEach(trigger => trigger.kill()); });
after(() => { ScrollTrigger.disable(); gsap.ticker.sleep(); });
test("reduced motion preserves the three static scenes and working skip link", () => {
 media(false);
 const view = render(<CinematicEntrance/>);
 assert.equal(view.container.querySelectorAll(".entrance-scene").length, 3);
 assert.equal(view.container.querySelector("section")?.hasAttribute("data-immersive"), false);
 assert.equal(ScrollTrigger.getAll().length, 0);
 assert.equal(view.getByRole("link", {name: /Skip introduction/}).getAttribute("href"), "#concept");
 assert.equal(view.getByRole("heading").style.opacity, "");
});
test("desktop approach holds the exterior until destinations decode, then advances and cleans up", async () => {
 media(true);
 const view = render(<CinematicEntrance/>);
 const root = view.container.querySelector("section")!;
 const scenes = [...view.container.querySelectorAll<HTMLElement>(".entrance-scene")];
 const trigger = ScrollTrigger.getAll().find(item => item.trigger === root)!;
 assert.ok(trigger);
 assert.equal(root.dataset.immersive, "true");
 trigger.animation!.progress(.8);
 assert.equal(scenes[0].style.opacity, "1");
 assert.equal(scenes[2].style.opacity, "0");
 await act(async () => {
  for (const photo of view.container.querySelectorAll("img")) {
   Object.defineProperty(photo, "naturalWidth", {configurable: true, value: 2560});
   photo.decode = () => Promise.resolve();
   fireEvent.load(photo);
  }
  await Promise.resolve();
 });
 assert.ok(Number(scenes[2].style.opacity) > 0);
 assert.equal(root.dataset.ready, "true");
 view.unmount();
 assert.equal(root.hasAttribute("data-immersive"), false);
 assert.equal(ScrollTrigger.getAll().length, 0);
});
test("save-data keeps the entrance static", () => {
 media(true);
 Object.defineProperty(navigator, "connection", { configurable: true, value: {saveData: true} });
 const view = render(<CinematicEntrance/>);
 assert.equal(view.container.querySelector("section")?.hasAttribute("data-immersive"), false);
 assert.equal(ScrollTrigger.getAll().length, 0);
 Object.defineProperty(navigator, "connection", { configurable: true, value: undefined });
});
