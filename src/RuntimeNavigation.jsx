import { useState } from "react";

export default function RuntimeNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="pointer-events-auto absolute left-0 top-0 z-[60] flex w-full items-center justify-between px-6 py-6 md:px-12 md:py-10">
      <div className="text-base font-semibold tracking-[0.25em] text-white/70 md:text-lg">
        SILENTMESH
      </div>

      {/* Desktop nav */}
      <div className="hidden items-center gap-10 font-mono text-sm tracking-[0.2em] text-white/40 md:flex">
        <button data-cursor="hover" className="transition hover:text-[#00c9a7]">
          ORCHESTRATION
        </button>
        <button data-cursor="hover" className="transition hover:text-[#00c9a7]">
          RUNTIME STATES
        </button>
        <button data-cursor="hover" className="transition hover:text-[#00c9a7]">
          ARCHITECTURE
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
        <button
          className="font-mono text-lg tracking-[0.3em] text-white/60 transition hover:text-[#00c9a7]"
          onClick={() => setMenuOpen(false)}
        >
          ORCHESTRATION
        </button>
        <button
          className="font-mono text-lg tracking-[0.3em] text-white/60 transition hover:text-[#00c9a7]"
          onClick={() => setMenuOpen(false)}
        >
          RUNTIME STATES
        </button>
        <button
          className="font-mono text-lg tracking-[0.3em] text-white/60 transition hover:text-[#00c9a7]"
          onClick={() => setMenuOpen(false)}
        >
          ARCHITECTURE
        </button>
      </div>
    </div>
  );
}
