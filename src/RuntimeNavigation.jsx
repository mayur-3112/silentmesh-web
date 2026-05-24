import { useState, useEffect } from "react";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function RuntimeNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "ORCHESTRATION", target: "orchestration" },
    { label: "RUNTIME STATES", target: "runtime-states" },
    { label: "ARCHITECTURE", target: "architecture" },
  ];

  return (
    <header className={`pointer-events-auto fixed left-0 top-0 right-0 z-[60] flex w-full items-center justify-between transition-all duration-500 ${
      scrolled 
        ? 'bg-[#05070b]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:py-5 md:px-12 lg:px-24 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'py-8 px-6 md:py-10 md:px-12 lg:px-24'
    }`}>
      {/* Typographic Logo with Brand Mark */}
      <div
        className="flex items-center gap-3 select-none group"
        data-cursor="hover"
        style={{ cursor: "pointer" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        {/* Gradient Square Icon Mark */}
        <div className="relative flex h-5.5 w-5.5 items-center justify-center rounded bg-gradient-to-br from-[#00c9a7] to-cyan-500 p-[1.5px] shadow-[0_0_15px_rgba(0,201,167,0.3)] transition-transform duration-500 group-hover:rotate-[90deg]">
          <div className="h-full w-full rounded-[2px] bg-[#05070b] flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-sm bg-[#00c9a7] animate-pulse" />
          </div>
        </div>

        {/* Text Logo */}
        <span className="font-mono text-base font-bold tracking-[0.3em] bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent uppercase transition-all duration-300 group-hover:tracking-[0.35em] md:text-lg">
          SILENTMESH
        </span>
      </div>

      {/* Desktop nav */}
      <div className="hidden items-center gap-10 font-mono text-xs tracking-[0.25em] text-white/50 md:flex">
        {navItems.map((item) => (
          <button
            key={item.target}
            data-cursor="hover"
            className="transition hover:text-[#00c9a7]"
            onClick={() => scrollTo(item.target)}
          >
            {item.label}
          </button>
        ))}
        <button
          data-cursor="hover"
          className="rounded-full border border-[#00c9a7]/35 bg-[#00c9a7]/5 px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-[#00c9a7] transition-all duration-300 hover:border-[#00c9a7]/70 hover:bg-[#00c9a7]/15 hover:shadow-[0_0_15px_rgba(0,201,167,0.2)]"
          onClick={() => scrollTo("poc-form")}
        >
          GET ACCESS
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block h-px w-6 bg-white/70 transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`block h-px w-6 bg-white/70 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-px w-6 bg-white/70 transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-[65] flex flex-col items-center justify-center gap-10 bg-[#05070b]/95 backdrop-blur-xl transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navItems.map((item) => (
          <button
            key={item.target}
            className="font-mono text-lg tracking-[0.3em] text-white/60 transition hover:text-[#00c9a7]"
            onClick={() => { scrollTo(item.target); setMenuOpen(false); }}
          >
            {item.label}
          </button>
        ))}
        <button
          className="mt-4 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 px-8 py-3 font-mono text-sm tracking-[0.2em] text-[#00c9a7] transition hover:bg-[#00c9a7]/20"
          onClick={() => { scrollTo("poc-form"); setMenuOpen(false); }}
        >
          GET ACCESS
        </button>
      </div>
    </header>
  );
}
