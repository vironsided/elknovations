import { useState } from "react";
import { useBrand } from "../hooks/useSiteData";
import { Link } from "react-router-dom";
import { ElkLogo } from "./ElkLogo";

const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our work", href: "#work" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const id = href.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}

export function Header() {
  const { data: brand } = useBrand();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Animations here are CSS only: the header is on the critical path, and keeping
    // framer-motion out of it lets that library load with the rest of the page later.
    <header className="header-slide-in fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        <a href="#hero" className="flex h-9 shrink-0 items-center md:h-10" aria-label={brand.name}>
          <ElkLogo className="h-full" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-black text-white md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        inert={!menuOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-neutral-950">
            <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-white/95 hover:bg-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    window.setTimeout(() => scrollToSection(item.href), 120);
                  }}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/work"
                className="rounded-lg px-3 py-3 text-base font-medium text-amber-300 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                View projects
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
