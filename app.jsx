import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Activity, Network, Command, Cpu, Layers } from 'lucide-react';

// ==========================================
// UTILITIES & GLOBAL HOOKS
// ==========================================
const useMousePosition = () => {
  useEffect(() => {
    const updateMousePosition = (ev) => {
      document.documentElement.style.setProperty('--mouse-x', `${ev.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${ev.clientY}px`);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
};

// ==========================================
// COMPONENTS
// ==========================================

// ── Hero Section ──
const ImmersiveHero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Animated background sys-calls
  const SyscallStream = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none font-mono text-[10px] text-runtime leading-none whitespace-pre">
      <motion.div
        animate={{ y: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute top-0 left-0 w-full"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="mb-2 opacity-50">
            {`[${(Math.random() * 10000).toFixed(4)}] sys_bpf(BPF_PROG_LOAD, {prog_type=BPF_PROG_TYPE_CGROUP_SKB, insn_cnt=${Math.floor(Math.random() * 100)}, ...}) = 3`}
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="relative h-screen w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 overflow-hidden bg-void border-b border-white/5">
      <SyscallStream />
      <motion.div style={{ y: y1, opacity }} className="z-10 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-runtime/20 bg-runtime/5 text-runtime font-mono text-xs uppercase tracking-widest"
        >
          <div className="w-2 h-2 bg-runtime rounded-full animate-pulse" />
          Runtime Intelligence Active
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tighter mb-8"
        >
          <span className="text-white">BEHAVIORAL</span><br/>
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>INTELLIGENCE</span><br/>
          <span className="text-white">ENGINE</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-xl text-lg text-white/50 font-light leading-relaxed mb-10"
        >
          A Linux runtime security platform. We decouple enforcement from the control plane, operating at ring-0 to deliver sub-millisecond deterministic anomaly resolution.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 font-mono text-sm uppercase tracking-widest"
        >
          <a href="#command" className="px-8 py-4 bg-white text-black hover:bg-white/80 transition-colors flex items-center justify-center gap-2">
            <Command size={16} /> Request Access
          </a>
          <a href="#narrative" className="px-8 py-4 border border-white/10 hover:border-white/30 text-white transition-colors flex items-center justify-center gap-2">
            Read Specs
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── Narrative Lineage Section ──
const NarrativeSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const drawLine = useTransform(scrollYProgress, [0, 1], [0, 1000]);

  return (
    <section id="narrative" ref={containerRef} className="relative min-h-[150vh] w-full px-8 md:px-16 lg:px-24 py-32 bg-machine border-b border-white/5 flex flex-col md:flex-row gap-16">
      <div className="w-full md:w-1/2 sticky top-1/3 h-fit">
        <div className="font-mono text-runtime text-xs tracking-widest uppercase mb-6">01. Process Lineage</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tighter mb-8">
          We map <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>ancestry</span>, not just payloads.
        </h2>
        <p className="text-lg text-white/50 font-light leading-relaxed mb-6">
          Traditional scanners look for known bad files. SilentMesh builds a deterministic graph of every process spawning in your kernel. When an unauthorized ingress controller spawns a shell, we snap the connection at the socket layer.
        </p>
      </div>

      <div className="w-full md:w-1/2 relative h-full min-h-[500px]">
        {/* Abstract SVG Lineage Graph */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
          <motion.path 
            d="M 50 50 L 50 200 L 150 250 L 150 400" 
            fill="transparent" 
            stroke="rgba(0, 255, 102, 0.3)" 
            strokeWidth="2"
            className="node-line"
          />
          <motion.path 
            d="M 50 200 L 250 300 L 250 500" 
            fill="transparent" 
            stroke="rgba(255, 42, 42, 0.4)" 
            strokeWidth="2"
            style={{ strokeDasharray: 1000, strokeDashoffset: drawLine }}
          />
          <circle cx="50" cy="50" r="6" fill="#111" stroke="#fff" strokeWidth="2" />
          <circle cx="50" cy="200" r="6" fill="#111" stroke="#fff" strokeWidth="2" />
          <circle cx="150" cy="400" r="6" fill="#111" stroke="#00ff66" strokeWidth="2" />
          <circle cx="250" cy="500" r="6" fill="#111" stroke="#ff2a2a" strokeWidth="2" />
          
          <text x="70" y="55" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="monospace">init (PID 1)</text>
          <text x="70" y="205" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="monospace">containerd (PID 402)</text>
          <text x="170" y="405" fill="#00ff66" fontSize="12" fontFamily="monospace">nginx (Authorized)</text>
          <text x="270" y="505" fill="#ff2a2a" fontSize="12" fontFamily="monospace">bash (RCE Detected)</text>
        </svg>
      </div>
    </section>
  );
};

// ── Floating Infrastructure Modules ──
const InfrastructureSection = () => {
  const modules = [
    { name: 'Kubernetes', icon: <Network />, delay: 0 },
    { name: 'Linux Kernel', icon: <Cpu />, delay: 0.2 },
    { name: 'eBPF Data Plane', icon: <Layers />, delay: 0.4 },
    { name: 'Cloud-Native', icon: <Activity />, delay: 0.6 },
  ];

  return (
    <section className="relative w-full py-32 px-8 md:px-16 lg:px-24 bg-void border-b border-white/5 overflow-hidden">
      <div className="text-center mb-24 max-w-2xl mx-auto">
        <div className="font-mono text-white/30 text-xs tracking-widest uppercase mb-6">02. Infrastructure Agnostic</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tighter">
          Universal <br/>Compatibility
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 relative z-10">
        {modules.map((mod, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: mod.delay, ease: "easeInOut" }}
            className="panel-glass w-64 h-64 flex flex-col items-center justify-center gap-6 rounded-none relative group"
          >
            <div className="absolute inset-0 bg-runtime/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-white/30 group-hover:text-runtime transition-colors">
              {React.cloneElement(mod.icon, { size: 48, strokeWidth: 1 })}
            </div>
            <div className="font-mono text-sm tracking-widest uppercase">{mod.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ── Threat Terminal Sequence ──
const TerminalSection = () => {
  const [lines, setLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  const logs = [
    { text: "[HOST NETWORK] Monitoring persistent database deployment...", color: "text-white/40" },
    { text: "[EXPLOIT VECTOR] Automated scanning array launching credential stuffing.", color: "text-threat font-bold" },
    { text: "[CRITICAL] Unauthorized lateral movement signature identified.", color: "text-threat font-bold" },
    { text: "[KERNEL ENFORCEMENT] BPF Ring Buffer pushing structural metadata.", color: "text-runtime font-bold" },
    { text: "[RESOLVED] Traffic transparently encapsulated to isolated honeypot.", color: "text-runtime font-bold" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTyping && lines.length === 0) {
          setIsTyping(true);
          let currentLine = 0;
          
          const typeLine = () => {
            if (currentLine < logs.length) {
              setLines(prev => [...prev, logs[currentLine]]);
              currentLine++;
              setTimeout(typeLine, Math.random() * 800 + 400);
            } else {
              setIsTyping(false);
            }
          };
          typeLine();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isTyping, lines]);

  return (
    <section ref={containerRef} className="relative w-full py-32 px-8 md:px-16 lg:px-24 bg-machine border-b border-white/5 flex flex-col items-center">
      <div className="w-full max-w-4xl panel-glass p-8 min-h-[400px] flex flex-col font-mono text-[13px] leading-loose shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div className="text-white/30">root@silentmesh-gateway ~ # ./ebpf_flight_recorder</div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-runtime/50" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <AnimatePresence>
            {lines.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${log.color} mb-2`}
              >
                {log.text}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-2 h-4 bg-white/50 mt-2"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ── Command Surface CTA ──
const CommandSurface = () => {
  return (
    <section id="command" className="relative w-full py-32 px-8 md:px-16 lg:px-24 bg-void flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl z-10">
        <Shield size={48} className="text-white/20 mx-auto mb-8" strokeWidth={1} />
        <h2 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tighter mb-8">
          Request <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>Access</span>
        </h2>
        <p className="text-lg text-white/40 font-light mb-12">
          SilentMesh is currently operating in stealth. Access to the runtime intelligence engine is strictly by invitation or verified staging pilot application.
        </p>
        
        <form action="https://formspree.io/f/xvonzgkb" method="POST" className="max-w-md mx-auto panel-glass p-8 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-void via-runtime to-void opacity-50" />
          
          <div className="mb-6">
            <label className="block font-mono text-xs text-white/30 uppercase tracking-widest mb-3">System Identifier (Email)</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full bg-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-runtime transition-colors placeholder:text-white/10" 
              placeholder="root@enterprise.com"
            />
          </div>
          <button type="submit" className="w-full bg-white hover:bg-white/80 text-black font-mono uppercase tracking-widest text-xs py-4 transition-colors font-bold">
            Initialize Pilot
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-6 w-full text-center font-mono text-[10px] text-white/20 uppercase tracking-widest">
        &copy; 2026 SilentMesh. Ring-0 Enforcement.
      </div>
    </section>
  );
};

// ── Main App Root ──
const App = () => {
  useMousePosition();

  return (
    <div className="relative">
      <div className="ambient-glow" />
      <ImmersiveHero />
      <NarrativeSection />
      <InfrastructureSection />
      <TerminalSection />
      <CommandSurface />
    </div>
  );
};

// Mount
const root = createRoot(document.getElementById('root'));
root.render(<App />);
