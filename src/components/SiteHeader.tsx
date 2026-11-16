"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [["hero", "The home"], ["layers", "Light & layers"], ["layout", "Explore"], ["collection", "All perspectives"]];
export function SiteHeader() {
  const [active, setActive] = useState("hero");
  const menu = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <header className="site-header"><span className="chapter-progress" aria-hidden="true" />
        <a className="wordmark" href="#hero">
          THE RESIDENCE II
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([id, name]) => (
            <a
              key={id}
              href={"#" + id}
              aria-current={active === id ? "location" : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#layout">
          Explore the home <ArrowUpRight size={14} />
        </a>
        <button
          ref={opener}
          className="icon-button mobile-menu-button"
          aria-label="Open navigation"
          onClick={() => menu.current?.showModal()}
        >
          <Menu />
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
