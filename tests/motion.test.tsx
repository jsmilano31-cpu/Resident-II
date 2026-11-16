import "./setup-dom";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { cleanup, render } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Motion } from "../src/components/Motion";

function media(mode: "reduced" | "mobile" | "desktop") {
  window.matchMedia = (query) => ({
    matches:
      mode !== "reduced" &&
      (query.includes("min-width")
        ? mode === "desktop"
        : query.includes("no-preference")),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
  });
}
function Scene() {
  return (
    <Motion>
      <div className="hero-copy">
        <h1>Home</h1>
        <p>Welcome</p>
      </div>
      <div data-reveal>Visible content</div>
      <div className="arrival-sequence">
        {[1, 2, 3, 4].map((n) => (
          <figure className="arrival-scene" key={n}>
            Scene {n}
          </figure>
        ))}
      </div>
    </Motion>
  );
}
afterEach(() => {
  cleanup();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
after(() => {
  ScrollTrigger.disable();
  gsap.ticker.sleep();
});
test("reduced motion keeps content untransformed and creates no scroll triggers", () => {
  media("reduced");
  const v = render(<Scene />);
  assert.equal(ScrollTrigger.getAll().length, 0);
  assert.equal(v.getByRole("heading").style.opacity, "");
  assert.equal(
    document.querySelector<HTMLElement>(".arrival-scene")?.style.position,
    "",
  );
});
test("normal small-screen motion initializes title animation and cleans up on unmount", () => {
  media("mobile");
  const v = render(<Scene />);
  assert.ok(gsap.getTweensOf(v.getByRole("heading")).length > 0);
  assert.equal(
    document.querySelector<HTMLElement>(".arrival-scene")?.style.position,
    "",
  );
  v.unmount();
  assert.equal(ScrollTrigger.getAll().length, 0);
});
test("data saving bypasses animation setup", () => {
  media("desktop");
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: { saveData: true },
  });
  render(<Scene />);
  assert.equal(ScrollTrigger.getAll().length, 0);
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: undefined,
  });
});
