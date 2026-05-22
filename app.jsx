import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from 'framer-motion';

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center">
        <p className="text-sm mb-4">Something went wrong.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 border border-gray-800 hover:border-[#00c9a7] text-sm transition-colors">Reload</button>
      </div>
    );
    return this.props.children;
  }
}

// ============================================================
// LENIS SMOOTH SCROLL (Delegated Anchor Interception)
// ============================================================
const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Lenis) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile

    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Event delegation for smooth anchor scrolling
    const handleAnchorClick = (e) => {
      const targetAnchor = e.target.closest('a[href^="#"]');
      if (!targetAnchor) return;
      const targetId = targetAnchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -85 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

// ============================================================
// CUSTOM CURSOR
// ============================================================
const CustomCursor = () => {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 220, damping: 22 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 22 });
  const [state, setState] = useState('default'); // default | hovering | hovering-cta
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const leave = () => { visibleRef.current = false; setVisible(false); };
    const enter = () => { visibleRef.current = true; setVisible(true); };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    // Dynamic Hover Delegation
    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, .magnetic, .interactive-node');
      if (el) {
        const isCta = el.classList.contains('cta-primary') || el.getAttribute('type') === 'submit';
        setState(isCta ? 'hovering-cta' : 'hovering');
      }
    };

    const handleMouseOut = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, .magnetic, .interactive-node');
      if (el) {
        setState('default');
      }
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <motion.div
        className={`cursor-dot ${state !== 'default' ? 'hovering' : ''}`}
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className={`cursor-ring ${state}`}
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
      />
    </>
  );
};

// ============================================================
// MAGNETIC COMPONENT wrapper
// ============================================================
const MagneticButton = ({ children, className = '', as = 'a', ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.22);
    y.set((e.clientY - cy) * 0.22);
  };

  const reset = () => { x.set(0); y.set(0); };

  const { as: tagType, ...propsWithoutAs } = props;
  const Tag = motion[as] || motion.a;

  return (
    <Tag ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`magnetic ${className}`} {...propsWithoutAs}>
      {children}
    </Tag>
  );
};

// ============================================================
// ANIMATION LAYOUT UTILITIES
// ============================================================
const ease = [0.25, 0.1, 0.25, 1];

const RevealBlock = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const dirs = { up: { y: 24 }, down: { y: -24 }, left: { x: 30 }, right: { x: -30 } };
  const from = dirs[direction] || dirs.up;
  return (
    <motion.div
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >{children}</motion.div>
  );
};

const SectionLabel = ({ number, text }) => (
  <RevealBlock direction="left">
    <div className="font-mono text-xs text-gray-500 tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
      {number && <span className="text-[#00c9a7]">{number}</span>}
      <span className="w-1.5 h-px bg-gray-700" />
      <span>{text}</span>
    </div>
  </RevealBlock>
);

const SectionTitle = ({ children }) => (
  <div className="overflow-hidden">
    <motion.h2
      initial={{ y: '100%' }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-3xl md:text-4xl lg:text-5xl font-['Space_Grotesk'] font-semibold leading-tight tracking-tight mb-6 text-white"
    >{children}</motion.h2>
  </div>
);

const Divider = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease }}
    className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-16 origin-left"
  />
);

const Section = ({ id, ariaLabel, children, className = '' }) => (
  <section id={id} aria-label={ariaLabel} className={`relative w-full px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </section>
);

// ============================================================
// LIVING RUNTIME TOPOLOGY (Hero Visual)
// ============================================================
const LivingTopology = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const nodes = [
    { id: 'observe', cx: 120, cy: 100, label: '01 OBSERVE', title: 'eBPF Telemetry', color: '#00c9a7', desc: 'Kernel-space monitoring, low-overhead event ingestion.' },
    { id: 'evaluate', cx: 280, cy: 180, label: '02 EVALUATE', title: 'Context Engine', color: '#00c9a7', desc: 'Anomalous parent-child tracing & system-call analysis.' },
    { id: 'simulate', cx: 160, cy: 300, label: '03 SIMULATE', title: 'Shadow Mode Run', color: '#00c9a7', desc: 'Predict impact on active threads before mitigating.' },
    { id: 'mitigate', cx: 340, cy: 380, label: '04 MITIGATE', title: 'Scoped Response', color: '#ff4a5a', desc: 'Targeted workload containment, namespaces restricted.' }
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center min-h-[350px] md:min-h-[450px]">
      {/* Background Living Elements */}
      <svg viewBox="0 0 450 450" className="w-full h-full max-w-[450px] relative z-10" role="img" aria-label="Interactive runtime topology map">
        {/* Connection Paths */}
        <motion.path
          d="M 120 100 Q 200 120, 280 180 T 160 300 T 340 380"
          fill="none"
          stroke="rgba(0, 201, 167, 0.1)"
          strokeWidth="1.5"
        />
        {/* Flow pulses */}
        <motion.path
          d="M 120 100 Q 200 120, 280 180 T 160 300 T 340 380"
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth="2.5"
          strokeDasharray="15 80"
          animate={{ strokeDashoffset: [-200, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        />

        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c9a7" stopOpacity="0" />
            <stop offset="50%" stopColor="#00c9a7" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff4a5a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient surrounding nodes */}
        {[[60, 150], [90, 320], [380, 110], [410, 290]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.15)" />
        ))}

        {/* Interactive nodes */}
        {nodes.map((n, i) => {
          const isHovered = hoveredNode === n.id;
          return (
            <g key={n.id} className="interactive-node"
               onMouseEnter={() => setHoveredNode(n.id)}
               onMouseLeave={() => setHoveredNode(null)}>
              {/* Outer pulsing ring */}
              <motion.circle
                cx={n.cx} cy={n.cy} r={isHovered ? 24 : 14}
                fill="none"
                stroke={n.color}
                strokeWidth="1"
                strokeOpacity={isHovered ? 0.4 : 0.15}
                animate={{ scale: isHovered ? [1, 1.1, 1] : [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              />
              {/* Inner solid node */}
              <circle cx={n.cx} cy={n.cy} r="5" fill={n.color} />
              
              {/* Hover text indicator */}
              <text x={n.cx} y={n.cy - 20} textAnchor="middle" fill="#8892b0" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Technical Detail Overlays */}
        <foreignObject x="40" y="200" width="370" height="230" className="pointer-events-none">
          <AnimatePresence>
            {hoveredNode && (() => {
              const nd = nodes.find(x => x.id === hoveredNode);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="glass p-4 border border-[#00c9a7]/20 rounded shadow-xl text-left pointer-events-auto"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Space_Grotesk'] text-sm font-semibold text-white tracking-wide">{nd.title}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] animate-ping" />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{nd.desc}</p>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </foreignObject>
      </svg>
    </div>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['hero','problem','safety','how-it-works','philosophy','technical','contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 150) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#problem', label: 'Problem', id: 'problem' },
    { href: '#safety', label: 'Safety', id: 'safety' },
    { href: '#how-it-works', label: 'How It Works', id: 'how-it-works' },
    { href: '#philosophy', label: 'Philosophy', id: 'philosophy' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav role="navigation" aria-label="Primary navigation"
      initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease }}
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-[#050608]/85 backdrop-blur-2xl border-b border-white/[0.03] shadow-2xl' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-16">
        <a href="#" className="font-['Space_Grotesk'] font-bold text-lg text-white tracking-tight hover:text-[#00c9a7] transition-colors duration-300">
          SilentMesh
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className={`relative text-xs font-mono uppercase tracking-widest transition-colors duration-300 py-1 ${activeSection === l.id ? 'text-[#00c9a7]' : 'text-gray-400 hover:text-white'}`}>
              {l.label}
              <motion.span
                className="absolute bottom-0 left-0 h-px bg-[#00c9a7]"
                initial={{ width: 0 }}
                animate={{ width: activeSection === l.id ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
              />
            </a>
          ))}
          <MagneticButton href="#contact"
            className="cta-primary text-xs font-mono tracking-wider px-5 py-2 border border-[#00c9a7]/30 text-[#00c9a7] hover:bg-[#00c9a7] hover:text-[#050608] transition-all duration-300">
            Request Access
          </MagneticButton>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden bg-[#050608]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-mono tracking-wide text-gray-400 hover:text-white">{l.label}</a>)}
              <a href="#contact" onClick={() => setOpen(false)} className="text-sm font-mono tracking-wide text-[#00c9a7]">Request Access</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ============================================================
// 1. HERO
// ============================================================
const Hero = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);

  return (
    <Section id="hero" ariaLabel="Introduction" className="min-h-screen flex flex-col justify-center pt-24 pb-20 md:pt-32">
      <div className="ambient-glow">
        <div className="glow-blob blob-primary" />
        <div className="glow-blob blob-secondary" />
      </div>
      <div className="grid-mesh" />

      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Text Block */}
        <div className="lg:col-span-7 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 border border-[#00c9a7]/20 rounded-full bg-[#00c9a7]/[0.03]"
          >
            <motion.span animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-[#00c9a7] rounded-full" />
            <span className="font-mono text-[10px] text-[#00c9a7] tracking-[0.2em] uppercase">Linux Runtime Intelligence</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-['Space_Grotesk'] font-bold leading-[1.1] tracking-tight mb-8 text-white">
            Runtime protection that <span className="text-accent-gradient">thinks in context.</span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-xl mb-10">
            SilentMesh observes, evaluates, and mitigates in real time—with low-overhead eBPF instrumentation and reversible response workflows.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8, ease }}
            className="flex flex-wrap gap-4">
            <MagneticButton href="#contact"
              className="cta-primary inline-flex items-center justify-center px-6 py-3.5 bg-[#00c9a7] text-[#050608] font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,201,167,0.25)] transition-all duration-300">
              Request Early Access <span className="ml-2">→</span>
            </MagneticButton>
            <a href="#safety"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/5 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:border-white/15 transition-all duration-300">
              Explore Platform
            </a>
          </motion.div>
        </div>

        {/* Live Visual Block */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="lg:col-span-5 relative"
        >
          <LivingTopology />
        </motion.div>
      </motion.div>
    </Section>
  );
};

// ============================================================
// 2. THE PROBLEM
// ============================================================
const ProblemSection = () => {
  const points = [
    { label: 'Alert Fatigue', desc: 'Detection breadth creates thousands of raw alarms that exhaust response capabilities.' },
    { label: 'Unsafe Autonomous Blocking', desc: 'Opaque automation rules frequently block clean production threads, disrupting operation.' },
    { label: 'Irreversible Enforcement', desc: 'When automatic remediation triggers incorrectly, restoring original container state causes friction.' },
    { label: 'Opaque Telemetry Data', desc: 'Security operations lack the underlying system call trace necessary to audit decisions.' }
  ];
  return (
    <Section id="problem" ariaLabel="The operational problem" className="py-20 md:py-32">
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 text-left">
          <SectionLabel number="01" text="The Problem" />
          <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-semibold leading-tight text-white mb-6">
            Runtime security today optimizes for alerts, not operational continuity.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Security software often treats live production processes like test beds, triggering heavy global blocks without contextual verification or simple recovery pathways.
          </p>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((p, i) => (
            <RevealBlock key={i} delay={i * 0.1} className="glass p-6 border-white/5 cursor-default hover:border-white/10 transition-colors duration-300">
              <span className="font-mono text-xs text-[#00c9a7] mb-2 block">{`0${i + 1}`}</span>
              <h3 className="font-['Space_Grotesk'] text-white text-base font-medium mb-1.5">{p.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">{p.desc}</p>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 3. OPERATIONAL SAFETY (Orbit/Threat Simulator Centerpiece)
// ============================================================
const SafetySection = () => {
  const [simulationState, setSimulationState] = useState('idle'); // idle | threat | evaluating | mitigating | rollbacked
  const timelineRef = useRef(null);

  const startSimulation = () => {
    setSimulationState('threat');
    setTimeout(() => setSimulationState('evaluating'), 1200);
    setTimeout(() => setSimulationState('mitigating'), 2600);
  };

  const resetSimulation = () => {
    setSimulationState('rollbacked');
    setTimeout(() => setSimulationState('idle'), 1800);
  };

  const getStatusText = () => {
    switch (simulationState) {
      case 'threat': return 'ANOMALOUS PID SIGNAL IN CONTAINER';
      case 'evaluating': return 'EVALUATING RISK: PATH EXPLOIT PROBABLE';
      case 'mitigating': return 'MITIGATION APPLIED: PROCESS CONTAINED';
      case 'rollbacked': return 'ROLLBACK COMMAND ISSUED: REVERT SUCCESSFUL';
      default: return 'SYSTEM MONITORING ACTIVE';
    }
  };

  return (
    <Section id="safety" ariaLabel="Operational safety simulator" className="py-20 md:py-32">
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-5 text-left">
          <SectionLabel number="02" text="Operational Safety" />
          <SectionTitle>Reversible runtime containment.</SectionTitle>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
            Production response should be surgically precise. SilentMesh isolates anomalous system behaviors instantly while retaining the ability to undo changes instantly.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] mt-1.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed"><strong className="text-white font-medium">Shadow Validation:</strong> Observe alert outcomes before enforcement mode is activated.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] mt-1.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed"><strong className="text-white font-medium">Atomic Reversals:</strong> Rolling back containment triggers a kernel state swap with zero container restart cost.</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {simulationState === 'idle' && (
              <button onClick={startSimulation} className="px-5 py-2.5 bg-[#00c9a7] text-[#050608] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Simulate Threat
              </button>
            )}
            {simulationState === 'mitigating' && (
              <button onClick={resetSimulation} className="px-5 py-2.5 border border-[#00c9a7]/30 text-[#00c9a7] font-mono text-[10px] uppercase tracking-wider hover:bg-[#00c9a7] hover:text-[#050608] transition-all">
                Trigger Rollback
              </button>
            )}
            {simulationState !== 'idle' && simulationState !== 'mitigating' && (
              <div className="px-5 py-2.5 bg-white/5 border border-white/5 text-gray-500 font-mono text-[10px] uppercase tracking-wider cursor-not-allowed">
                Simulating...
              </div>
            )}
          </div>
        </div>

        {/* Right Orbit Simulation Canvas */}
        <div className="lg:col-span-7 flex justify-center">
          <div ref={timelineRef} className="w-full max-w-[400px] aspect-square relative bg-[#0a0b0e] border border-white/[0.03] rounded-lg p-6 flex flex-col justify-between overflow-hidden">
            {/* Ambient status readout */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 z-10">
              <span className="font-mono text-[9px] text-gray-500">SIMULATION ENGINE v1.2</span>
              <span className={`font-mono text-[9px] tracking-wide px-2 py-0.5 rounded ${
                simulationState === 'threat' || simulationState === 'evaluating' ? 'bg-[#ff4a5a]/10 text-[#ff4a5a]' :
                simulationState === 'mitigating' ? 'bg-[#ff9800]/10 text-[#ff9800]' :
                simulationState === 'rollbacked' ? 'bg-[#00c9a7]/20 text-[#00c9a7]' : 'bg-[#00c9a7]/10 text-[#00c9a7]'
              }`}>
                {simulationState.toUpperCase()}
              </span>
            </div>

            {/* Orbit SVG */}
            <svg viewBox="0 0 300 240" className="w-full flex-grow relative z-10" role="img" aria-label="Runtime safety execution path simulator">
              {/* Connection Lines from Center Shield */}
              {[[150, 40], [240, 100], [210, 190], [90, 190], [60, 100]].map(([x, y], i) => (
                <line key={i} x1="150" y1="120" x2={x} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}

              {/* Loop Connections */}
              <path d="M 150 40 L 240 100 L 210 190 L 90 190 L 60 100 Z" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Pulsing signal on path during evaluation */}
              {simulationState === 'evaluating' && (
                <motion.circle r="3" fill="#ff4a5a"
                  animate={{
                    cx: [150, 240, 210],
                    cy: [40, 100, 190],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Central Shield Hub */}
              <circle cx="150" cy="120" r="28" fill="#050608" stroke={
                simulationState === 'threat' || simulationState === 'evaluating' ? '#ff4a5a' :
                simulationState === 'mitigating' ? '#ff9800' : '#00c9a7'
              } strokeWidth="1.5" className="transition-colors duration-500" />
              
              <text x="150" y="124" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="'Space Grotesk', sans-serif" fontWeight="bold">
                MESH
              </text>

              {/* Node - 01 OBSERVE */}
              <circle cx="150" cy="40" r="10" fill="#050608" stroke="#00c9a7" strokeWidth="1" />
              <circle cx="150" cy="40" r="3" fill="#00c9a7" />
              <text x="150" y="24" textAnchor="middle" fill="#8892b0" fontSize="8" fontFamily="'JetBrains Mono', monospace">OBSERVE</text>

              {/* Node - 02 EVALUATE */}
              <circle cx="240" cy="100" r="10" fill="#050608" stroke={simulationState !== 'idle' && simulationState !== 'rollbacked' ? '#ff4a5a' : '#00c9a7'} strokeWidth="1" />
              <circle cx="240" cy="100" r="3" fill={simulationState !== 'idle' && simulationState !== 'rollbacked' ? '#ff4a5a' : '#00c9a7'} />
              <text x="240" y="85" textAnchor="left" fill="#8892b0" fontSize="8" fontFamily="'JetBrains Mono', monospace">EVALUATE</text>

              {/* Node - 03 SIMULATE */}
              <circle cx="210" cy="190" r="10" fill="#050608" stroke={simulationState === 'mitigating' || simulationState === 'evaluating' ? '#ff9800' : '#00c9a7'} strokeWidth="1" />
              <circle cx="210" cy="190" r="3" fill={simulationState === 'mitigating' || simulationState === 'evaluating' ? '#ff9800' : '#00c9a7'} />
              <text x="210" y="212" textAnchor="middle" fill="#8892b0" fontSize="8" fontFamily="'JetBrains Mono', monospace">SIMULATE</text>

              {/* Node - 04 MITIGATE */}
              <circle cx="90" cy="190" r="10" fill="#050608" stroke={simulationState === 'mitigating' ? '#ff4a5a' : '#00c9a7'} strokeWidth="1" />
              <circle cx="90" cy="190" r="3" fill={simulationState === 'mitigating' ? '#ff4a5a' : '#00c9a7'} />
              <text x="90" y="212" textAnchor="middle" fill="#8892b0" fontSize="8" fontFamily="'JetBrains Mono', monospace">MITIGATE</text>

              {/* Mitigate Red containment field ring */}
              {simulationState === 'mitigating' && (
                <motion.circle cx="90" cy="190" r="18" fill="none" stroke="#ff4a5a" strokeWidth="1" strokeDasharray="3 3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              )}

              {/* Node - 05 ROLLBACK */}
              <circle cx="60" cy="100" r="10" fill="#050608" stroke={simulationState === 'rollbacked' ? '#00c9a7' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <circle cx="60" cy="100" r="3" fill={simulationState === 'rollbacked' ? '#00c9a7' : 'rgba(255,255,255,0.2)'} />
              <text x="60" y="85" textAnchor="middle" fill="#8892b0" fontSize="8" fontFamily="'JetBrains Mono', monospace">ROLLBACK</text>

              {/* Rollback Sweep animation */}
              {simulationState === 'rollbacked' && (
                <motion.circle cx="60" cy="100" r="120" fill="none" stroke="#00c9a7" strokeWidth="1.5" strokeOpacity="0.4"
                  initial={{ r: 0 }} animate={{ r: 200, opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              )}
            </svg>

            {/* Readout log console */}
            <div className="bg-[#050608] border border-white/[0.04] p-3 text-left">
              <span className="font-mono text-[9px] text-[#00c9a7] block tracking-wide uppercase mb-1">Status Report</span>
              <span className="font-mono text-[10px] text-gray-300 block font-light leading-snug">
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 4. DESIGN PRINCIPLES
// ============================================================
const PrinciplesSection = () => {
  const principles = [
    { title: 'Observe First', desc: 'No blocking actions are executed until comprehensive behavioral context is mapped.' },
    { title: 'Reversible Logic', desc: 'Every containment policy maintains a native kernel rollback mechanism.' },
    { title: 'Minimum Overhead', desc: 'Telemetry leverages non-blocking eBPF hook points, protecting application latency.' },
    { title: 'Progressive Trust', desc: 'Workload policies phase from dry-run simulations to selective micro-enforcement.' }
  ];
  return (
    <Section id="principles" ariaLabel="Platform principles" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-4xl">
        <SectionLabel number="03" text="Design Principles" />
        <SectionTitle>Built around operational constraint.</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
          {principles.map((p, i) => (
            <RevealBlock key={i} delay={i * 0.08} className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#00c9a7]/20 transition-all duration-300">
              <h3 className="font-['Space_Grotesk'] text-white text-base font-semibold mb-2 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#00c9a7] rounded-full" />
                {p.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">{p.desc}</p>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 5. PROGRESSIVE TRUST (Isometric Layer centerpiece)
// ============================================================
const HowItWorksSection = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { label: 'Observe', color: '#00c9a7', desc: 'Low-impact eBPF probes gather granular context around socket connections, syscall arguments, and namespaces.', stats: '95% telemetry coverage' },
    { label: 'Evaluate', color: '#00c9a7', desc: 'System calls are mapped to process lineages and cross-referenced with local behavior parameters.', stats: 'anomaly identification in <1ms' },
    { label: 'Simulate', color: '#00c9a7', desc: 'Response policies execute in shadow mode. Evaluate blast-radius impact on dry-run containers.', stats: 'zero risk simulation' },
    { label: 'Mitigate', color: '#ff4a5a', desc: 'Apply targeted response vectors: cgroup restriction, socket teardown, or namespace isolation.', stats: 'containment in 8ms' },
    { label: 'Rollback', color: '#00c9a7', desc: 'Restore namespaces, resume suspended workloads, and reconnect sockets instantly with zero state loss.', stats: 'reversion in 22ms' }
  ];

  return (
    <Section id="how-it-works" ariaLabel="The progressive trust pipeline" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-6xl">
        <SectionLabel number="04" text="How It Works" />
        <SectionTitle>Five levels of progressive trust.</SectionTitle>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-12 font-light">
          SilentMesh routes process actions through five stages of system validation, isolating execution vectors with surgical precision.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Isometric SVG */}
          <div className="lg:col-span-6 flex justify-center">
            <svg viewBox="0 0 350 480" className="w-full max-w-[350px] h-auto overflow-visible" role="img" aria-label="3D isometric visualization of safety layers">
              {/* Laser Core Line */}
              <line x1="175" y1="60" x2="175" y2="400" stroke="rgba(0, 201, 167, 0.1)" strokeWidth="1.5" />
              <motion.line x1="175" y1="60" x2="175" y2="400" stroke="#00c9a7" strokeWidth="2.5" strokeDasharray="30 200"
                animate={{ strokeDashoffset: [-400, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Isometric diamond layers */}
              {stages.map((st, i) => {
                const cy = 80 + i * 80;
                const isActive = activeStage === i;
                return (
                  <g key={i} className="cursor-pointer isometric-stage" onClick={() => setActiveStage(i)}>
                    {/* Shadow Layer Grid Rhombus */}
                    <polygon
                      points={`175,${cy - 35} 295,${cy} 175,${cy + 35} 55,${cy}`}
                      fill={isActive ? 'rgba(0, 201, 167, 0.05)' : 'rgba(255, 255, 255, 0.01)'}
                      stroke={isActive ? '#00c9a7' : 'rgba(255, 255, 255, 0.04)'}
                      strokeWidth={isActive ? '1.5' : '1'}
                      className="transition-all duration-300"
                    />

                    {/* Nodes inside layer */}
                    <circle cx="175" cy={cy} r={isActive ? 5 : 3} fill={isActive ? '#00c9a7' : 'rgba(255,255,255,0.2)'} />
                    <circle cx="140" cy={cy - 10} r="2" fill="rgba(255,255,255,0.1)" />
                    <circle cx="210" cy={cy + 10} r="2" fill="rgba(255,255,255,0.1)" />

                    {/* Label Tag */}
                    <text x="45" y={cy + 4} fill={isActive ? '#fff' : 'rgba(255,255,255,0.25)'} fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight={isActive ? 'bold' : 'normal'}>
                      {`0${i + 1}`} {st.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Stage Copy Details */}
          <div className="lg:col-span-6 text-left">
            <div className="glass-elevated p-8 border-accent-dim min-h-[220px] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-2">Stage Details</span>
                <h3 className="font-['Space_Grotesk'] text-white text-xl font-medium mb-3">
                  {activeStage + 1}. {stages[activeStage].label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {stages[activeStage].desc}
                </p>
              </div>

              <div className="border-t border-white/[0.04] mt-6 pt-4 flex items-center justify-between">
                <span className="font-mono text-[9px] text-gray-500">PERFORMANCE TARGETS</span>
                <span className="font-mono text-[10px] text-[#00c9a7] font-semibold tracking-wide uppercase">{stages[activeStage].stats}</span>
              </div>
            </div>
            
            {/* Quick selectors */}
            <div className="flex gap-2 mt-4">
              {stages.map((st, i) => (
                <button key={i} onClick={() => setActiveStage(i)} className={`flex-1 py-2 font-mono text-[9px] border transition-colors ${
                  activeStage === i ? 'bg-[#00c9a7]/10 border-[#00c9a7]/30 text-[#00c9a7]' : 'bg-transparent border-white/5 text-gray-500 hover:text-white'
                }`}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 6. EXAMPLE WORKFLOW
// ============================================================
const ExampleWorkflow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    { prefix: 'DETECT', text: 'Unexpected socket call initiated by unauthorized task worker' },
    { prefix: 'CORRELATE', text: 'Parent task verified: execution context matches baseline profile' },
    { prefix: 'SHADOW', text: 'Dry-run containment simulation completes successfully, zero production impact' },
    { prefix: 'RECOMMEND', text: 'Platform telemetry outputs recommendation for localized process isolation' },
    { prefix: 'CONTAIN', text: 'Cgroup namespace frozen. System metrics intact. Rollback window active' },
  ];

  useEffect(() => {
    if (isInView && visibleLines < lines.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 750);
      return () => clearTimeout(timer);
    }
  }, [isInView, visibleLines]);

  return (
    <Section id="example" ariaLabel="Example workflow" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="05" text="Example Workflow" />
        <SectionTitle>Believable containment logs.</SectionTitle>
        <RevealBlock delay={0.1}>
          <div ref={ref} className="glass p-6 md:p-8 mt-8 font-mono text-xs leading-loose relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <span className="ml-3 text-[9px] text-gray-500 font-mono tracking-wider">runtime-isolation.log</span>
            </div>
            {lines.map((line, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease }}
                className="flex items-start gap-4 mb-3"
              >
                <span className="text-[#00c9a7]/50 flex-shrink-0 text-[9px] mt-0.5 w-20 text-right tracking-widest">[{line.prefix}]</span>
                <span className={i < visibleLines - 1 ? 'text-gray-500' : 'text-gray-300 font-light'}>{line.text}</span>
              </motion.div>
            ))}
            {visibleLines >= lines.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-[#00c9a7]">
                <span>✓</span>
                <span className="text-[10px] tracking-wide uppercase">Audit State Locked — Mitigation Complete</span>
              </motion.div>
            )}
          </div>
        </RevealBlock>
      </div>
    </Section>
  );
};

// ============================================================
// 7. DEPLOYMENT PHILOSOPHY
// ============================================================
const DeploymentPhilosophy = () => {
  return (
    <Section id="philosophy" ariaLabel="Deployment philosophy" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="06" text="Deployment Philosophy" />
        <SectionTitle>Observe before enforce.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
            Enforcement is not a binary choice. It is a spectrum of operations that scales with telemetry confidence and organizational trust parameters.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            SilentMesh validates behavior indicators first, isolates anomalous execution vectors within narrow containment layers, and ensures recovery triggers are available before enforcing policy.
          </p>
        </RevealBlock>
      </div>
    </Section>
  );
};

// ============================================================
// 8. TECHNICAL PHILOSOPHY (eBPF Lineage Tree)
// ============================================================
const TechnicalPhilosophy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredTrace, setHoveredTrace] = useState(null);

  const treeNodes = [
    { id: 'init', cx: 160, cy: 30, label: 'systemd (PID 1)', probe: 'none' },
    { id: 'dockerd', cx: 160, cy: 90, label: 'containerd (PID 840)', probe: 'tracepoint/sched/sched_process_fork' },
    { id: 'nginx', cx: 90, cy: 160, label: 'nginx (PID 1021)', probe: 'kprobe/sys_socket' },
    { id: 'python', cx: 230, cy: 160, label: 'python3 (PID 1024)', probe: 'kprobe/sys_execve' },
    { id: 'helper', cx: 230, cy: 230, label: 'curl helper (PID 1028)', probe: 'tracepoint/syscalls/sys_enter_connect' }
  ];
  const treeEdges = [['init','dockerd'],['dockerd','nginx'],['dockerd','python'],['python','helper']];

  return (
    <Section id="technical" ariaLabel="Technical philosophy" className="py-20 md:py-32">
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" ref={ref}>
        <div className="lg:col-span-5 text-left">
          <SectionLabel number="07" text="Technical Philosophy" />
          <SectionTitle>Linux-native eBPF instrumentation.</SectionTitle>
          <RevealBlock delay={0.1}>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
              Telemetry shouldn't degrade runtime performance. SilentMesh instruments system-call execution contexts using sandboxed kernel probes.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Hover over the execution nodes in the tree diagram to inspect the active eBPF hooks monitoring process lifecycle changes.
            </p>
          </RevealBlock>
        </div>

        {/* eBPF Lineage Tree SVG */}
        <RevealBlock delay={0.2} className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[360px] aspect-square bg-[#0a0b0e] border border-white/[0.03] rounded-lg p-6 flex flex-col justify-between overflow-hidden">
            <svg viewBox="0 0 320 260" className="w-full flex-grow overflow-visible" role="img" aria-label="Process execution lineage tree map">
              {/* Lines */}
              {treeEdges.map(([a, b], i) => {
                const nodeA = treeNodes.find(x => x.id === a);
                const nodeB = treeNodes.find(x => x.id === b);
                return (
                  <motion.line key={i} x1={nodeA.cx} y1={nodeA.cy} x2={nodeB.cx} y2={nodeB.cy}
                    stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  />
                );
              })}

              {/* Circles */}
              {treeNodes.map((n, i) => {
                const isHovered = hoveredTrace === n.id;
                return (
                  <g key={n.id} className="cursor-default" onMouseEnter={() => setHoveredTrace(n.id)} onMouseLeave={() => setHoveredTrace(null)}>
                    <circle cx={n.cx} cy={n.cy} r={isHovered ? 12 : 8} fill="#050608" stroke="#00c9a7" strokeWidth="1.2" className="transition-all duration-300" />
                    <circle cx={n.cx} cy={n.cy} r="3" fill="#00c9a7" />
                    <text x={n.cx + 14} y={n.cy + 3} textAnchor="start" fill={isHovered ? '#fff' : 'rgba(255,255,255,0.4)'} fontSize="7" fontFamily="'JetBrains Mono', monospace">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hook detail box */}
            <div className="bg-[#050608] border border-white/[0.04] p-3 text-left min-h-[60px]">
              <span className="font-mono text-[8px] text-gray-500 block tracking-widest uppercase mb-0.5">Active eBPF Probe</span>
              <span className="font-mono text-[10px] text-[#00c9a7] block font-medium">
                {hoveredTrace ? treeNodes.find(x => x.id === hoveredTrace).probe : 'Hover on node to inspect kernel hook point'}
              </span>
            </div>
          </div>
        </RevealBlock>
      </div>
    </Section>
  );
};

// ============================================================
// 9. TRANSPARENCY
// ============================================================
const TransparencySection = () => {
  const items = [
    'Apply autonomous block decisions without SRE oversight.',
    'Replace traditional log aggregators or security monitoring tools.',
    'Guarantee coverage of every possible runtime threat vector.',
    'Require kernel modifications or out-of-tree loadable modules.',
    'Isolate containers without maintaining transactional audit history.'
  ];
  return (
    <Section id="transparency" ariaLabel="Architecture transparency" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="08" text="Architecture Transparency" />
        <SectionTitle>What SilentMesh does not do.</SectionTitle>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
          We maintain explicit architectural boundaries. To build operational trust, here is what SilentMesh does not claim to execute:
        </p>
        <div className="space-y-4">
          {items.map((item, i) => (
            <RevealBlock key={i} delay={i * 0.08} direction="left" className="flex items-start gap-4 py-3 border-b border-white/[0.03]">
              <span className="text-gray-600 text-xs mt-0.5">✕</span>
              <p className="text-xs text-gray-400 font-light leading-relaxed">{item}</p>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 10. WORKLOAD MATRIX (ICP & Compatibility centerpiece)
// ============================================================
const WorkloadMatrix = () => {
  const [selectedRole, setSelectedRole] = useState(0);

  const matrix = [
    {
      role: 'Platform Engineering',
      useCase: 'Deploy runtime visibility across microservices with zero agent maintenance.',
      compat: ['Containers', 'Kubernetes', 'Multi-tenant Isolation'],
      hooks: ['Cgroup tracepoints', 'Network namespace isolation']
    },
    {
      role: 'DevSecOps Teams',
      useCase: 'Inject policy-simulation validation steps directly into canary deployment chains.',
      compat: ['Virtual Machines', 'Kubernetes', 'CI/CD Pipelines'],
      hooks: ['Dry-run shadow enforcement', 'Audit report generation']
    },
    {
      role: 'SRE Operators',
      useCase: 'Maintain service uptime SLAs while safely quarantining anomalous threads.',
      compat: ['Bare Metal', 'Virtual Machines', 'Kernel Containment'],
      hooks: ['Reversible process suspension', 'Dynamic rollback triggers']
    }
  ];

  return (
    <Section id="audience" ariaLabel="Workload and audience matrix" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-5xl">
        <SectionLabel number="09" text="Workload Matrix" />
        <SectionTitle>Interactive operational matrix.</SectionTitle>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-12 font-light">
          Explore how SilentMesh aligns runtime telemetry hooks with target workloads based on team parameters.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Selector Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {matrix.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedRole(i)}
                className={`w-full text-left p-5 border font-['Space_Grotesk'] transition-all ${
                  selectedRole === i
                    ? 'bg-[#00c9a7]/5 border-[#00c9a7]/30 text-white'
                    : 'bg-transparent border-white/5 text-gray-500 hover:text-white'
                }`}
              >
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-wider block mb-1">ROLE 0{i+1}</span>
                <span className="text-sm font-semibold">{item.role}</span>
              </button>
            ))}
          </div>

          {/* Right Visual Result Column */}
          <div className="lg:col-span-8 glass p-8 border-accent-dim flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] text-gray-500 block uppercase mb-2">Primary Application</span>
              <p className="text-sm text-gray-300 font-light leading-relaxed mb-8">
                {matrix[selectedRole].useCase}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-mono text-[9px] text-[#00c9a7] block uppercase tracking-wider mb-3">Target Environments</span>
                  <div className="flex flex-wrap gap-2">
                    {matrix[selectedRole].compat.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/5 bg-white/[0.01] font-mono text-[10px] text-gray-400">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#00c9a7] block uppercase tracking-wider mb-3">Kernel Enforcements</span>
                  <div className="flex flex-wrap gap-2">
                    {matrix[selectedRole].hooks.map((h, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/5 bg-white/[0.01] font-mono text-[10px] text-gray-400">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/[0.04] pt-4 mt-8 flex justify-between items-center text-[10px] text-gray-600 font-mono">
              <span>COMPATIBILITY VERIFIED</span>
              <span>LINUX KERNEL 5.4+ REQUIRED</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 11. DEPLOYMENT REALITIES (Editorial layout)
// ============================================================
const DeploymentRealities = () => {
  return (
    <Section id="realities" ariaLabel="Deployment realities" className="py-20 md:py-32">
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        <div className="lg:col-span-5">
          <SectionLabel number="10" text="Deployment Realities" />
          <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-semibold leading-tight text-white mb-6">
            Why building runtime trust is hard.
          </h2>
          <p className="text-gray-400 text-xs tracking-wider font-mono text-[#00c9a7] uppercase mb-4">
            AN ENGINEERING ESSAY ON CAUTION
          </p>
        </div>
        <div className="lg:col-span-7 space-y-6 text-gray-400 font-light leading-relaxed text-sm">
          <p>
            When we began researching process telemetry, we noticed a consistent pattern: security tools attempt to automate mitigation too quickly. The logic is simple—if a thread diverges from expected profiles, suspend it immediately.
          </p>
          <p>
            But in production environment realities, unexpected process states are often legitimate events. A configuration script restarts, database shards shift, or a container process spins up an authorized helper task.
          </p>
          <p className="border-l border-[#00c9a7]/30 pl-4 py-2 italic text-gray-300">
            "Automated protection should never degrade target service availability. The risk of automated false positives often outpaces the risk of the anomalous process itself."
          </p>
          <p>
            SilentMesh was designed around this caution. We focus on capturing clean process lineages using kernel tracepoints, validating rules inside risk-controlled simulation layers, and keeping operators in the loop with instant rollback functionality.
          </p>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 12. CTA / CONTACT (AJAX Submit)
// ============================================================
const CTASection = () => {
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    const form = e.target;
    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <Section id="contact" ariaLabel="Request access" className="py-20 md:py-32">
      <Divider />
      <div className="max-w-lg mx-auto relative text-center">
        <SectionLabel text="Access Registry" />
        <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-semibold leading-tight text-white mb-6">
          Request early access.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light max-w-sm mx-auto">
          SilentMesh is currently in early evaluation phase. If your team is interested in deploying safety-focused runtime telemetry, request entry below.
        </p>

        <form action="https://formspree.io/f/xvonzgkb" method="POST" onSubmit={handleFormSubmit} className="glass p-6 md:p-8 space-y-4 text-left relative overflow-hidden">
          <div className="scan-line" />
          
          <div>
            <label htmlFor="email" className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
            <input id="email" type="email" name="email" required placeholder="name@company.com"
              className="w-full bg-[#050608] border border-white/5 px-4 py-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/30 transition-colors" />
          </div>
          <div>
            <label htmlFor="message" className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1.5">Context / Infrastructure Goals</label>
            <textarea id="message" name="message" rows="3" placeholder="What workloads are you looking to trace?"
              className="w-full bg-[#050608] border border-white/5 px-4 py-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/30 transition-colors resize-none" />
          </div>

          <button type="submit" disabled={formStatus === 'loading'}
            className="cta-primary w-full py-3 bg-[#00c9a7] text-[#050608] font-mono text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_20px_rgba(0,201,167,0.15)] transition-all disabled:opacity-50">
            {formStatus === 'loading' ? 'Registering...' : 'Request Access'}
          </button>

          <AnimatePresence>
            {formStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 p-3 bg-[#00c9a7]/10 border border-[#00c9a7]/20 text-[#00c9a7] text-[11px] font-mono text-center">
                ✓ REGISTRATION SUBMITTED SUCCESSFULLY. WE WILL GET IN TOUCH.
              </motion.div>
            )}
            {formStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 p-3 bg-red-950/20 border border-red-500/20 text-[#ff4a5a] text-[11px] font-mono text-center">
                ✕ REGISTRATION FAILED. PLEASE TRY AGAIN LATER.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </Section>
  );
};

// ============================================================
// FOOTER
// ============================================================
const Footer = () => (
  <footer className="w-full px-6 md:px-12 lg:px-24 py-8 border-t border-white/[0.03]">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-['Space_Grotesk'] text-xs text-gray-600">&copy; 2026 SilentMesh</span>
      <span className="font-mono text-[9px] text-gray-700 tracking-widest uppercase">Runtime Visibility Platform</span>
    </div>
  </footer>
);

// ============================================================
// APP ENTRYPOINT
// ============================================================
const App = () => {
  useLenis();
  return (
    <div className="relative">
      <CustomCursor />
      <NavBar />
      <main id="main-content">
        <Hero />
        <ProblemSection />
        <SafetySection />
        <PrinciplesSection />
        <HowItWorksSection />
        <ExampleWorkflow />
        <DeploymentPhilosophy />
        <TechnicalPhilosophy />
        <TransparencySection />
        <WorkloadMatrix />
        <DeploymentRealities />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
