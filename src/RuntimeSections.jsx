import { useState, useEffect, useRef } from "react";
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

const IconEyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#ffb700]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"
    />
  </svg>
);

const IconCpuDanger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#ff4a5a]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const IconDisconnect = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#ff4a5a]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.4}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/* ═══════════════════════════════════════════════
   PRE-SECTION — THE REALITIES OF PRODUCTION SECURITY
   ═══════════════════════════════════════════════ */
function PainPoints() {
  const cards = [
    {
      Icon: IconEyeOff,
      badge: "THE OBSERVE-ONLY TRAP",
      badgeColor: "text-[#ffb700] border-[#ffb700]/25 bg-[#ffb700]/5",
      glowColor: "rgba(255, 183, 0, 0.02)",
      title: "Alert Fatigue",
      body: "Passive monitoring logs exploits after the fact. Security teams are buried in thousands of telemetry alerts daily, unable to react within millisecond execution windows. Observation alone is not defense.",
    },
    {
      Icon: IconCpuDanger,
      badge: "THE OUTAGE RISK",
      badgeColor: "text-[#ff4a5a] border-[#ff4a5a]/25 bg-[#ff4a5a]/5",
      glowColor: "rgba(255, 74, 90, 0.02)",
      title: "Agent Overhead",
      body: "Traditional security agents run in heavy user-space, competing for CPU cycles and risking kernel panics. In critical industrial loops, the risk of security software causing a production outage is higher than the threat of a cyber attack itself.",
    },
    {
      Icon: IconDisconnect,
      badge: "THE TRUST GAP",
      badgeColor: "text-[#ff4a5a] border-[#ff4a5a]/25 bg-[#ff4a5a]/5",
      glowColor: "rgba(255, 74, 90, 0.02)",
      title: "False Enforcement",
      body: "Legacy EDR and firewall blocking rules are too blunt. They terminate whole systems or block legitimate control operations, severing critical industrial processes. Operators disable block-mode because they cannot trust automated logic.",
    },
  ];

  return (
    <section
      id="pain-points"
      className="relative bg-[#05070b] py-24 px-6 md:py-32 md:px-12 lg:px-24 border-t border-white/5"
    >
      <motion.p {...reveal} className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#ff4a5a] mb-4">
        The Realities of Production Security
      </motion.p>
      <motion.h2
        {...reveal}
        className="text-3xl md:text-5xl font-light tracking-tight text-white mb-16"
      >
        Why Industrial Security Fails
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            {...stagger(i)}
            data-cursor="hover"
            className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 md:p-8 backdrop-blur-sm flex flex-col gap-5 hover:border-white/10 transition-all duration-300"
            style={{
              boxShadow: `0 8px 30px ${c.glowColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <c.Icon />
              <span className={`font-mono text-[10px] tracking-widest ${c.badgeColor} px-2.5 py-1 rounded-full border`}>
                {c.badge}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-light text-white/90 mb-3 font-display">
                {c.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/40">
                {c.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

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

function Architecture() {
  const [selectedExploit, setSelectedExploit] = useState("toctou");
  const [simulating, setSimulating] = useState(false);
  const [logs, setLogs] = useState([
    { text: "$ silentmesh status", color: "#e2e8f0" },
    { text: "[READY] eBPF Engine: ACTIVE", color: "#00c9a7" },
    { text: "[READY] LSM Policy: ENFORCED", color: "#00c9a7" },
    { text: "[READY] PQC Tunnel: ESTABLISHED", color: "#00c9a7" },
    { text: "[READY] Select an exploit vector and click 'TRIGGER SIMULATION'", color: "#6b7280" },
  ]);
  const [mitigated, setMitigated] = useState(false);
  const [latency, setLatency] = useState(null);

  const terminalEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const checklist = [
    "Post-Quantum Cryptographic (PQC) transport layer",
    "NIST FIPS 203/204 compliant key encapsulation",
    "Air-gapped deployment support",
    "IEC 62443 / NERC CIP alignment",
    "Sovereign data residency — zero cloud dependency",
  ];

  const exploits = {
    toctou: {
      name: "TOCTOU Race Condition",
      desc: "Exploits the race window between signature verification and file access. SilentMesh intercepts the syscall at the LSM layer, verifying the inode has not shifted during the verification interval.",
      latency: "0.27ms",
      logs: [
        { text: "$ run-exploit --vector=toctou", color: "#e2e8f0" },
        { text: "[RECON]  mount-race-tool spawned (PID: 14205) — ancestry: /bin/bash → /tmp/.hidden/exploit", color: "#6b7280" },
        { text: "[KERNEL] stat() → /usr/bin/firmware.bin — inode: 90284, uid: 0, mode: 0755", color: "#6b7280" },
        { text: "[KERNEL] Signature validation passed. Hash: SHA256:a3f8c1...verified", color: "#00c9a7" },
        { text: "[ATTACK] ⚠ RACE WINDOW OPEN — unlink() + symlink() initiated on target path", color: "#ffb700" },
        { text: "[ATTACK] symlink(/tmp/malicious.bin → /usr/bin/firmware.bin) — elapsed: 0.8ms", color: "#ff4a5a" },
        { text: "[KERNEL] openat(AT_FDCWD, \"/usr/bin/firmware.bin\", O_WRONLY) — inode: 91022 ≠ 90284", color: "#ffb700" },
        { text: "[eBPF]  ✦ kprobe:sys_enter_openat triggered — inode mismatch detected in 512ns", color: "#00f0ff" },
        { text: "[eBPF]  ✦ LSM hook enforced: write blocked → EACCES (Permission Denied)", color: "#00c9a7" },
        { text: "[RESULT] ✓ TOCTOU race neutralized. Mitigation latency: 0.27ms. System integrity intact.", color: "#00c9a7" }
      ]
    },
    modbus: {
      name: "Modbus PLC Injection",
      desc: "Injects malicious commands into factory line PLC controllers. SilentMesh monitors network sockets at the kernel boundaries, shutting down sockets spawned by untrusted parent shell scripts.",
      latency: "0.27ms",
      logs: [
        { text: "$ run-exploit --vector=modbus_hijack", color: "#e2e8f0" },
        { text: "[RECON]  Rogue binary executed from /tmp/.modbus-cmd (PID: 8840)", color: "#6b7280" },
        { text: "[KERNEL] socket(AF_INET, SOCK_STREAM, 0) — port 502 (Modbus TCP)", color: "#6b7280" },
        { text: "[KERNEL] connect() → 192.168.12.10:502 (PLC Gateway)", color: "#ffb700" },
        { text: "[ATTACK] ⚠ Crafting Modbus frame: Function 0x05 (Write Single Coil) — Addr: 1002, Value: 0xFF00", color: "#ff4a5a" },
        { text: "[ATTACK] Target: Safety Interlock Bypass — downstream turbine protection", color: "#ff4a5a" },
        { text: "[eBPF]  ✦ connect() hook — process /tmp/.modbus-cmd not in trusted process registry", color: "#00f0ff" },
        { text: "[eBPF]  ✦ Ancestry trace: bash → wget → /tmp/.modbus-cmd — UNAUTHORIZED", color: "#ffb700" },
        { text: "[eBPF]  ✦ LSM socket enforcement: connect() blocked → ECONNREFUSED", color: "#00c9a7" },
        { text: "[RESULT] ✓ Modbus injection neutralized. Latency: 0.27ms. PLC safety loop intact.", color: "#00c9a7" }
      ]
    },
    tamper: {
      name: "Firmware Tampering",
      desc: "Attempts direct raw sector writes to storage partition headers. SilentMesh restricts mounting permissions at the LSM layer, blocking raw block writes and confining superuser updates to trusted crypt namespaces.",
      latency: "0.23ms",
      logs: [
        { text: "$ run-exploit --vector=firmware_tamper", color: "#e2e8f0" },
        { text: "[RECON]  Unauthorized process trying to mount writeable /boot directory (PID: 9015)", color: "#6b7280" },
        { text: "[KERNEL] mount(\"/dev/sda1\", \"/boot\", \"ext4\", MS_MGC_VAL, ...)", color: "#6b7280" },
        { text: "[ATTACK] Attempting direct raw block writes to kernel partition storage", color: "#ff4a5a" },
        { text: "[ATTACK] Writing malicious payload to partition offset: 0x4F000", color: "#ff4a5a" },
        { text: "[eBPF]  ✦ kprobe:sys_enter_mount triggered — checking credentials and namespace", color: "#00f0ff" },
        { text: "[eBPF]  ✦ Namespace check failed: unauthorized container namespace attempt", color: "#ff4a5a" },
        { text: "[eBPF]  ✦ LSM policy: mount request blocked → EPERM (Operation Not Permitted)", color: "#00c9a7" },
        { text: "[RESULT] ✓ Tampering blocked. Latency: 0.23ms. Cryptographic signature intact.", color: "#00c9a7" }
      ]
    }
  };

  const handleExploitSelect = (key) => {
    if (simulating) return;
    setSelectedExploit(key);
    setMitigated(false);
    setLatency(null);
    setLogs([
      { text: `$ silentmesh test-vector --type=${key}`, color: "#e2e8f0" },
      { text: `[LOAD] ${exploits[key].name} vector loaded.`, color: "#00c9a7" },
      { text: `[READY] Click 'TRIGGER SIMULATION' to execute.`, color: "#6b7280" }
    ]);
  };

  const triggerSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setMitigated(false);
    setLatency(null);

    if (intervalRef.current) clearInterval(intervalRef.current);

    const targetLogs = exploits[selectedExploit].logs;
    setLogs([{ text: targetLogs[0].text, color: targetLogs[0].color }]);

    let currentIndex = 1;
    intervalRef.current = setInterval(() => {
      if (currentIndex < targetLogs.length) {
        const nextLog = targetLogs[currentIndex];
        setLogs((prev) => [...prev, nextLog]);
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
        setSimulating(false);
        setMitigated(true);
        setLatency(exploits[selectedExploit].latency);
      }
    }, 250);
  };

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
        Interactive Exploit Simulator
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* left — controls */}
        <motion.div {...stagger(0)} className="flex flex-col gap-6">
          <p className="text-sm md:text-base leading-relaxed text-white/60">
            SilentMesh operates as a lightweight Linux daemon with zero dependencies. Click on any of the threat vectors below to test the eBPF / LSM kernel boundaries in real time.
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(exploits).map((key) => (
              <button
                key={key}
                disabled={simulating}
                onClick={() => handleExploitSelect(key)}
                className={`py-3 px-2 text-[10px] md:text-xs font-mono tracking-wider rounded-xl border transition-all duration-300 ${
                  selectedExploit === key
                    ? "border-[#00c9a7] bg-[#00c9a7]/10 text-[#00c9a7] shadow-[0_0_15px_rgba(0,201,167,0.15)]"
                    : "border-white/5 bg-white/[0.01] text-white/40 hover:text-white/70 hover:border-white/15"
                }`}
                data-cursor="hover"
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Vector Info Panel */}
          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm">
            <h4 className="font-mono text-xs text-[#00c9a7] tracking-wider mb-2 uppercase">
              Vector Profile: {exploits[selectedExploit].name}
            </h4>
            <p className="text-sm text-white/50 leading-relaxed">
              {exploits[selectedExploit].desc}
            </p>
          </div>

          {/* Trigger Button & Status */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              disabled={simulating}
              onClick={triggerSimulation}
              className={`flex-grow rounded-full border py-4 font-mono text-sm tracking-[0.15em] transition-all duration-300 ${
                simulating
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-500/50 cursor-not-allowed"
                  : "border-[#00c9a7]/40 bg-[#00c9a7]/10 text-[#00c9a7] hover:bg-[#00c9a7]/20 hover:border-[#00c9a7]/60"
              }`}
              data-cursor="hover"
              style={{
                boxShadow: simulating ? "none" : "0 0 20px rgba(0, 201, 167, 0.1)",
              }}
            >
              {simulating ? "SIMULATION RUNNING..." : "TRIGGER SIMULATED EXPLOIT →"}
            </button>

            {mitigated && (
              <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-xs tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                MITIGATED IN {latency}
              </div>
            )}
          </div>

          {/* Checklist */}
          <ul className="space-y-2.5 border-t border-white/5 pt-6">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-xs md:text-sm text-white/50"
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
          className="rounded-2xl border border-white/5 bg-[#030507] overflow-hidden backdrop-blur-sm h-[400px] flex flex-col w-full"
        >
          {/* title bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#080b11]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7]/80" />
              <span className="ml-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
                interactive_sandbox
              </span>
            </div>
            {simulating && (
              <span className="text-[10px] font-mono text-amber-500 animate-pulse tracking-widest">
                EXECUTION_ACTIVE
              </span>
            )}
          </div>

          {/* code */}
          <div className="flex-1 p-5 md:p-6 font-mono text-[11px] md:text-xs leading-relaxed space-y-2 overflow-y-auto scrollbar-thin">
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.color }}>
                {l.text}
              </div>
            ))}
            {/* blinking cursor */}
            <span className="inline-block w-2.5 h-4 bg-[#00c9a7] animate-pulse mt-1" />
            <div ref={terminalEndRef} />
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
            Security teams hesitate to enforce runtime controls in production because one unsafe action can become an outage event. SilentMesh eliminates that risk.
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
                className={`${inputClass} bg-[#0a0c12] ${form.infrastructure === "" ? "text-white/25" : "text-white"}`}
                style={{ colorScheme: 'dark' }}
                data-cursor="hover"
              >
                <option value="" disabled className="text-white/30 bg-[#0a0c12]">Infrastructure Type</option>
                <option value="power" className="text-white bg-[#0a0c12]">Power Grid / Energy</option>
                <option value="water" className="text-white bg-[#0a0c12]">Water / Utilities</option>
                <option value="manufacturing" className="text-white bg-[#0a0c12]">Manufacturing / SCADA</option>
                <option value="transportation" className="text-white bg-[#0a0c12]">Transportation</option>
                <option value="defense" className="text-white bg-[#0a0c12]">Defense / Sovereign</option>
                <option value="other" className="text-white bg-[#0a0c12]">Other</option>
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
      <PainPoints />
      <Orchestration />
      <RuntimeStates />
      <Architecture />
      <POCForm />
      <Footer />
    </>
  );
}
