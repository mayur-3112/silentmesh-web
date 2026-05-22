import { useState } from "react";
import { motion } from "framer-motion";

/* ─── shared animation preset ─── */
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = (i) => ({
  ...reveal,
  transition: { ...reveal.transition, delay: i * 0.15 },
});

/* ─── tiny inline icons (SVG) ─── */
const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#00c9a7]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#00c9a7]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const IconLock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#00c9a7]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

/* ═══════════════════════════════════════════════
   SECTION 1 — HOW IT WORKS (Orchestration)
   ═══════════════════════════════════════════════ */
function Orchestration() {
  const cards = [
    {
      Icon: IconEye,
      label: "OBSERVE",
      body: "eBPF probes attach to kernel syscalls. Zero instrumentation. Zero overhead. Complete visibility into every thread, socket, and memory boundary.",
    },
    {
      Icon: IconShield,
      label: "INTERVENE",
      body: "Surgical thread-level mitigation in 0.27ms. Isolate, suspend, or rollback malicious execution paths without disrupting production.",
    },
    {
      Icon: IconLock,
      label: "CONTAIN",
      body: "Cryptographic containment boundaries enforce zero lateral movement. Compromised sub-systems are severed before breach propagation.",
    },
  ];

  const stats = [
    { value: "0.27ms", label: "Mitigation Latency" },
    { value: "<1%", label: "CPU Overhead" },
    { value: "0", label: "False Positives (Shadow Mode)" },
    { value: "100%", label: "Kernel Visibility" },
  ];

  return (
    <section
      id="orchestration"
      className="relative bg-[#05070b] py-24 px-6 md:py-32 md:px-12 lg:px-24"
    >
      {/* heading */}
      <motion.p {...reveal} className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00c9a7] mb-4">
        How SilentMesh operates at the kernel level
      </motion.p>
      <motion.h2
        {...reveal}
        className="text-3xl md:text-5xl font-light tracking-tight text-white mb-16"
      >
        Runtime Orchestration
      </motion.h2>

      {/* 3-col cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            {...stagger(i)}
            data-cursor="hover"
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm flex flex-col gap-4"
          >
            <c.Icon />
            <h3 className="font-mono text-sm tracking-[0.25em] text-[#00c9a7]">
              {c.label}
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-white/60">
              {c.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* stats bar */}
      <motion.div
        {...reveal}
        className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-8 px-4 text-center"
            data-cursor="hover"
          >
            <span className="font-mono text-2xl md:text-3xl text-[#00c9a7] mb-1">
              {s.value}
            </span>
            <span className="text-[11px] md:text-xs tracking-wider text-white/40 uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2 — RUNTIME STATES
   ═══════════════════════════════════════════════ */
function RuntimeStates() {
  const states = [
    {
      color: "#00c9a7",
      title: "OBSERVE",
      body: "Passive kernel-level monitoring. eBPF probes silently watch syscalls, file descriptors, and network sockets.",
    },
    {
      color: "#3b82f6",
      title: "EVALUATE",
      body: "Behavioral analysis engine scores anomalies against known OT attack patterns in real-time.",
    },
    {
      color: "#06b6d4",
      title: "SIMULATE",
      body: "Shadow-mode execution traces the blast radius of detected threats without touching production.",
    },
    {
      color: "#f59e0b",
      title: "MITIGATE",
      body: "Surgical intervention. Malicious threads are suspended, connections severed, files frozen — in 0.27ms.",
    },
    {
      color: "#e2e8f0",
      title: "ROLLBACK",
      body: "If mitigation causes unexpected state drift, the system autonomously reverts to the last known-good checkpoint.",
    },
  ];

  return (
    <section
      id="runtime-states"
      className="relative bg-[#05070b] py-24 px-6 md:py-32 md:px-12 lg:px-24"
    >
      <motion.p {...reveal} className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00c9a7] mb-4">
        Five operational states. One continuous loop.
      </motion.p>
      <motion.h2
        {...reveal}
        className="text-3xl md:text-5xl font-light tracking-tight text-white mb-16"
      >
        Runtime Lifecycle
      </motion.h2>

      {/* vertical timeline */}
      <div className="relative max-w-2xl mx-auto pl-10 md:pl-14">
        {/* continuous line */}
        <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-white/10" />

        {states.map((s, i) => (
          <motion.div
            key={s.title}
            {...stagger(i)}
            className="relative mb-12 last:mb-0"
          >
            {/* dot */}
            <span
              className="absolute -left-7 md:-left-9 top-1 w-4 h-4 rounded-full border-2"
              style={{
                borderColor: s.color,
                backgroundColor: `${s.color}22`,
                boxShadow: `0 0 12px ${s.color}55`,
              }}
            />

            <h3
              className="font-mono text-sm tracking-[0.25em] mb-2"
              style={{ color: s.color }}
            >
              {s.title}
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-white/60">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3 — ARCHITECTURE DEEP DIVE
   ═══════════════════════════════════════════════ */
function Architecture() {
  const checklist = [
    "Post-Quantum Cryptographic (PQC) transport layer",
    "NIST FIPS 203/204 compliant key encapsulation",
    "Air-gapped deployment support",
    "IEC 62443 / NERC CIP alignment",
    "Sovereign data residency — zero cloud dependency",
  ];

  const terminalLines = [
    { text: "$ silentmesh deploy --mode=shadow", color: "#e2e8f0" },
    { text: "[BOOT]  Kernel version: 6.8.0-45-generic", color: "#00c9a7" },
    { text: "[PROBE] Attaching eBPF probes... 47 hooks active", color: "#06b6d4" },
    { text: "[PROBE] Syscall coverage: 100%", color: "#06b6d4" },
    { text: "[NET]   PQC transport: ML-KEM-768 active", color: "#00c9a7" },
    { text: "[STATE] Mode: SHADOW (observe-only)", color: "#f59e0b" },
    { text: "[STATE] Latency budget: 10ms", color: "#f59e0b" },
    { text: "[READY] SilentMesh daemon active. PID: 31847", color: "#00c9a7" },
  ];

  return (
    <section
      id="architecture"
      className="relative bg-[#05070b] py-24 px-6 md:py-32 md:px-12 lg:px-24"
    >
      <motion.p {...reveal} className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00c9a7] mb-4">
        Purpose-built for OT/ICS environments
      </motion.p>
      <motion.h2
        {...reveal}
        className="text-3xl md:text-5xl font-light tracking-tight text-white mb-16"
      >
        The Architecture
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* left — text */}
        <motion.div {...stagger(0)}>
          <p className="text-sm md:text-base leading-relaxed text-white/60 mb-8">
            SilentMesh operates as a lightweight Linux daemon with zero
            dependencies. It attaches eBPF probes directly to kernel syscalls —
            no agents, no instrumentation, no SDK integration.
          </p>

          <ul className="space-y-3">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm md:text-base text-white/70"
              >
                <span className="mt-0.5 text-[#00c9a7]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* right — terminal card */}
        <motion.div
          {...stagger(1)}
          data-cursor="hover"
          className="rounded-2xl border border-white/5 bg-[#030507] overflow-hidden backdrop-blur-sm"
        >
          {/* title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7]/80" />
            <span className="ml-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
              terminal
            </span>
          </div>

          {/* code */}
          <div className="p-5 md:p-6 font-mono text-xs md:text-sm leading-relaxed space-y-1 overflow-x-auto">
            {terminalLines.map((l, i) => (
              <div key={i} style={{ color: l.color }}>
                {l.text}
              </div>
            ))}
            {/* blinking cursor */}
            <span className="inline-block w-2 h-4 bg-[#00c9a7] animate-pulse mt-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4 — POC / CONTACT FORM
   ═══════════════════════════════════════════════ */
function POCForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    infrastructure: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#00c9a7]/50 focus:ring-1 focus:ring-[#00c9a7]/30 transition-colors backdrop-blur-sm";

  const guarantees = [
    "✦ 72-hour deployment",
    "✦ Zero production impact",
    "✦ Full telemetry export",
    "✦ Dedicated runtime engineer",
  ];

  return (
    <section
      id="poc-form"
      className="relative bg-[#05070b] py-24 px-6 md:py-32 md:px-12 lg:px-24"
    >
      <motion.p {...reveal} className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00c9a7] mb-4">
        Request early access to the runtime orchestration layer
      </motion.p>
      <motion.h2
        {...reveal}
        className="text-3xl md:text-5xl font-light tracking-tight text-white mb-16"
      >
        Deploy SilentMesh
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* left — copy + guarantee */}
        <motion.div {...stagger(0)}>
          <p className="text-sm md:text-base leading-relaxed text-white/60 mb-4">
            One unsafe enforcement action in production can become an outage event.
            SilentMesh eliminates that risk.
          </p>
          <p className="text-sm md:text-base leading-relaxed text-white/40 mb-8">
            Currently in controlled deployment with select critical infrastructure
            operators. Request access to begin a proof-of-concept.
          </p>

          <div
            className="rounded-2xl border border-[#00c9a7]/20 bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm space-y-3"
            data-cursor="hover"
          >
            {guarantees.map((g) => (
              <p
                key={g}
                className="font-mono text-sm text-white/70 tracking-wide"
              >
                {g}
              </p>
            ))}
          </div>
        </motion.div>

        {/* right — form */}
        <motion.div {...stagger(1)} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#00c9a7]/30 bg-[#00c9a7]/10">
                <svg className="h-7 w-7 text-[#00c9a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mb-2 font-mono text-sm tracking-[0.2em] text-[#00c9a7]">REQUEST RECEIVED</p>
              <p className="text-sm text-white/40">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                data-cursor="hover"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                data-cursor="hover"
              />
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                required
                value={form.organization}
                onChange={handleChange}
                className={inputClass}
                data-cursor="hover"
              />

              <select
                name="infrastructure"
                required
                value={form.infrastructure}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
                style={{ colorScheme: 'dark' }}
                data-cursor="hover"
              >
                <option value="" disabled>Infrastructure Type</option>
                <option value="power">Power Grid / Energy</option>
                <option value="water">Water / Utilities</option>
                <option value="manufacturing">Manufacturing / SCADA</option>
                <option value="transportation">Transportation</option>
                <option value="defense">Defense / Sovereign</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                data-cursor="hover"
              />

              <button
                type="submit"
                data-cursor="hover"
                className="w-full rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 py-3 font-mono text-sm tracking-[0.15em] text-[#00c9a7] hover:bg-[#00c9a7]/20 hover:border-[#00c9a7]/60 transition-all duration-300"
              >
                REQUEST ACCESS →
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5 — FOOTER
   ═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#030507] border-t border-white/5 py-20 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col gap-16">
        {/* Big Typography Header */}
        <div>
          <h2 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.25em] text-white select-none">
            SILENTMESH
          </h2>
        </div>

        {/* Minimal Bottom Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-t border-white/5 pt-12">
          {/* Brand & Tagline */}
          <div className="space-y-4 max-w-md">
            <p className="text-sm text-white/40 leading-relaxed">
              Runtime Orchestration for Critical Infrastructure
            </p>
            <p className="text-xs text-white/20 font-mono">
              © 2026 SilentMesh Systems Private Limited
            </p>
          </div>

          {/* Contact Details Only */}
          <div className="space-y-3 font-mono text-xs md:text-sm">
            <a
              href="https://www.silentmesh.me"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-white/40 hover:text-[#00c9a7] transition-all duration-300 tracking-wider"
              data-cursor="hover"
            >
              www.silentmesh.me
            </a>
            <a
              href="mailto:founder@silentmesh.me"
              className="block text-white/40 hover:text-[#00c9a7] transition-all duration-300 tracking-wider"
              data-cursor="hover"
            >
              founder@silentmesh.me
            </a>
            <a
              href="tel:+918088669439"
              className="block text-white/40 hover:text-[#00c9a7] transition-all duration-300 tracking-wider"
              data-cursor="hover"
            >
              +91 80886 69439
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   ROOT EXPORT
   ═══════════════════════════════════════════════ */
export default function RuntimeSections() {
  return (
    <>
      <Orchestration />
      <RuntimeStates />
      <Architecture />
      <POCForm />
      <Footer />
    </>
  );
}
