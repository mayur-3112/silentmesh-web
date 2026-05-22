export default function RuntimeNavigation() {
  return (
    <div className="pointer-events-auto absolute left-0 top-0 flex w-full items-center justify-between px-12 py-10">
      <div className="text-lg font-semibold tracking-[0.25em] text-white/70">
        SILENTMESH
      </div>

      <div className="flex items-center gap-10 text-sm tracking-[0.2em] text-white/40">
        <button className="transition hover:text-[#00c9a7]">
          ORCHESTRATION
        </button>

        <button className="transition hover:text-[#00c9a7]">
          RUNTIME STATES
        </button>

        <button className="transition hover:text-[#00c9a7]">
          ARCHITECTURE
        </button>
      </div>
    </div>
  );
}
