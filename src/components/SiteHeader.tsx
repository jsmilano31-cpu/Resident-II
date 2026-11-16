"use client";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [["concept", "Project"], ["collection", "Gallery"], ["layout", "Plans"]];
export function SiteHeader() {
  const menu = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <>
      <header className="site-header"><span className="chapter-progress" aria-hidden="true" />
        <a className="wordmark" href="#hero">
          THE RESIDENCE II
        </a>
        <button
          ref={opener}
          className="menu-button"
          aria-label="Open navigation"
          onClick={() => menu.current?.showModal()}
        >
          <span>Menu</span><Menu size={18} />
        </button>
      </header>
      <dialog
        className="mobile-menu"
        ref={menu}
        aria-label="Navigation"
        onClose={() => opener.current?.focus()}
      >
        <div className="mobile-menu-top">
          <span>THE RESIDENCE II</span>
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => menu.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav>
          {links.map(([id, name]) => (
            <a key={id} href={"#" + id} onClick={() => menu.current?.close()}>
              {name}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}
