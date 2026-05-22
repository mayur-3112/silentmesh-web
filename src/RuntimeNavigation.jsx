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
      setScrolled(window.scrollY > 100);
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
    <div className={`pointer-events-auto absolute left-0 top-0 z-[60] flex w-full items-center justify-between px-6 py-6 transition-all duration-500 md:px-12 md:py-10 ${scrolled ? 'bg-[#05070b]/80 backdrop-blur-xl py-4 md:py-5' : ''}`}>
      <div
        className="text-base font-semibold tracking-[0.25em] text-white/70 md:text-lg"
        data-cursor="hover"
        style={{ cursor: "pointer" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        SILENTMESH
      </div>

      {/* Desktop nav */}
      <div className="hidden items-center gap-10 font-mono text-sm tracking-[0.2em] text-white/40 md:flex">
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
          className="rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-xs tracking-[0.15em] text-[#00c9a7] transition hover:border-[#00c9a7]/40 hover:bg-[#00c9a7]/10"
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
    </div>
  );
}
