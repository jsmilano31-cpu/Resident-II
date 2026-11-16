import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:3000",
  pretendToBeVisual: true,
});
for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "Node",
  "Element",
  "SVGElement",
  "HTMLDialogElement",
  "HTMLImageElement",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "MutationObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
]) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: dom.window[name as keyof Window],
  });
}
dom.window.scrollTo = () => {};
dom.window.matchMedia = (query: string) => ({
  matches: false,
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
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,
  writable: true,
  value: true,
});

// JSDOM has no native modal implementation. These tests check component state;
// browser focus trapping and native Escape behavior require a real browser check.
dom.window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
dom.window.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
  this.dispatchEvent(new dom.window.Event("close"));
};
