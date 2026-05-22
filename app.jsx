import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center">
        <p className="text-sm mb-4">Something went wrong.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 border border-gray-700 hover:border-[#00c9a7] text-sm transition-colors">Reload</button>
      </div>
    );
    return this.props.children;
  }
}

// ============================================================
// LENIS SMOOTH SCROLL
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

    // handle anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });

    return () => lenis.destroy();
  }, []);
};

// ============================================================
// CUSTOM CURSOR
// ============================================================
const CustomCursor = () => {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 150, damping: 20, mass: 0.5 });
  const [state, setState] = useState('default'); // default | hovering | hovering-cta
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e) => {
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
      if (!visible) setVisible(true);
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    // Hover detection
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => {
          const isCta = el.classList.contains('cta-primary') || el.getAttribute('type') === 'submit';
          setState(isCta ? 'hovering-cta' : 'hovering');
        });
        el.addEventListener('mouseleave', () => setState('default'));
      });
    };
    // Delay to let React render
    setTimeout(addHoverListeners, 1000);
    const observer = new MutationObserver(() => setTimeout(addHoverListeners, 200));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <motion.div
        className={`cursor-dot ${state !== 'default' ? 'hovering' : ''}`}
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className={`cursor-ring ${state}`}
        style={{
          x: useTransform(ringX, v => v - (state === 'hovering-cta' ? 25 : state === 'hovering' ? 21 : 13)),
          y: useTransform(ringY, v => v - (state === 'hovering-cta' ? 25 : state === 'hovering' ? 21 : 13)),
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

// ============================================================
// MAGNETIC BUTTON
// ============================================================
const MagneticButton = ({ children, className = '', as = 'a', ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.2);
    y.set((e.clientY - cy) * 0.2);
  };

  const reset = () => { x.set(0); y.set(0); };

  const Tag = motion[as] || motion.a;

  return (
    <Tag ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`magnetic ${className}`} {...props}>
      {children}
    </Tag>
  );
};

// ============================================================
// MOTION UTILITIES
// ============================================================
const ease = [0.25, 0.1, 0.25, 1];
const springCfg = { stiffness: 100, damping: 20 };

const RevealBlock = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const dirs = { up: { y: 32 }, down: { y: -32 }, left: { x: 50 }, right: { x: -50 } };
  const from = dirs[direction] || dirs.up;
  return (
    <motion.div
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >{children}</motion.div>
  );
};

const SectionLabel = ({ number, text }) => (
  <RevealBlock direction="left">
    <div className="font-mono text-xs text-gray-500 tracking-[0.2em] uppercase mb-4">
      {number && <span className="text-[#00c9a7] mr-3">{number}</span>}{text}
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
    className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-20 origin-left"
  />
);

const Section = ({ id, ariaLabel, children, className = '' }) => (
  <section id={id} aria-label={ariaLabel} className={`relative w-full px-6 md:px-12 lg:px-24 overflow-hidden ${className}`}>
    {children}
  </section>
);

// ============================================================
// TOPOLOGY BACKGROUND (ambient living infrastructure)
// ============================================================
const TopologyBackground = () => {
  const nodes = useMemo(() => [
    { cx: 10, cy: 20 }, { cx: 25, cy: 65 }, { cx: 42, cy: 30 },
    { cx: 55, cy: 75 }, { cx: 70, cy: 25 }, { cx: 85, cy: 55 },
    { cx: 35, cy: 50 }, { cx: 60, cy: 45 }, { cx: 78, cy: 70 },
    { cx: 15, cy: 80 }, { cx: 90, cy: 35 }, { cx: 48, cy: 85 },
  ], []);
  const edges = useMemo(() => [
    [0,2],[0,1],[1,6],[2,7],[2,4],[3,5],[3,8],[4,10],[5,8],[6,7],[7,4],[9,1],[9,11],[11,3],
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        {edges.map(([a,b], i) => (
          <motion.line key={`e${i}`} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="#00c9a7" strokeWidth="0.15"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: i * 0.12, ease }} />
        ))}
        {nodes.map((n, i) => (
          <motion.circle key={`n${i}`} cx={n.cx} cy={n.cy} r="0.5" fill="#00c9a7"
            initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.35 }} />
        ))}
      </svg>
    </div>
  );
};

// ============================================================
// NAVIGATION with active section tracking
// ============================================================
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['hero','problem','safety','how-it-works','philosophy','technical','contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) { setActiveSection(id); break; }
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
      className={`fixed top-0 w-full z-40 transition-all duration-700 ${scrolled ? 'bg-[#090a0f]/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_40px_rgba(0,0,0,0.5)]' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-16">
        <a href="#" className="font-['Space_Grotesk'] font-semibold text-lg text-white tracking-tight hover:text-[#00c9a7] transition-colors duration-300">
          SilentMesh
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className={`relative text-sm transition-colors duration-300 py-1 ${activeSection === l.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
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
            className="cta-primary text-sm font-medium px-5 py-2 border border-[#00c9a7]/30 text-[#00c9a7] hover:bg-[#00c9a7] hover:text-[#090a0f] transition-all duration-300">
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
            className="md:hidden bg-[#090a0f]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-white">{l.label}</a>)}
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
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const heroY = useTransform(scrollY, [0, 700], [0, 100]);
  const gridOpacity = useTransform(scrollY, [0, 500], [0.025, 0]);

  return (
    <Section id="hero" ariaLabel="Introduction" className="min-h-screen flex flex-col justify-center pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="ambient-mesh"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>
      <motion.div style={{ opacity: gridOpacity }} className="drift-grid" />
      <TopologyBackground />

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="inline-flex items-center gap-2.5 mb-10 px-4 py-1.5 border border-[#00c9a7]/20 rounded-full bg-[#00c9a7]/[0.04]"
        >
          <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-[#00c9a7] rounded-full" />
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#00c9a7] tracking-[0.15em] uppercase">Runtime Visibility Platform</span>
        </motion.div>

        {['Runtime visibility', 'and scoped response', 'for Linux infrastructure.'].map((line, i) => (
          <div key={i} className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`text-4xl md:text-6xl lg:text-[5.5rem] font-['Space_Grotesk'] font-bold leading-[1.08] tracking-tight ${i === 2 ? 'text-transparent' : 'text-white'}`}
              style={i === 2 ? { WebkitTextStroke: '1.5px rgba(255,255,255,0.18)' } : {}}
            >{line}</motion.h1>
          </div>
        ))}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
          className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mt-8 mb-10">
          Safety-focused telemetry and runtime containment workflows designed for production environments.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3, ease }}
          className="flex flex-col sm:flex-row gap-3">
          <MagneticButton href="#contact"
            className="cta-primary inline-flex items-center justify-center px-7 py-3.5 bg-[#00c9a7] text-[#090a0f] font-medium text-sm hover:shadow-[0_0_40px_rgba(0,201,167,0.15)] transition-all duration-300">
            Request Early Access <span className="ml-2">→</span>
          </MagneticButton>
          <MagneticButton href="#contact"
            className="inline-flex items-center justify-center px-7 py-3.5 border border-white/10 text-sm text-gray-500 hover:text-white hover:border-white/20 transition-all duration-300">
            Talk to Us
          </MagneticButton>
          <MagneticButton href="#technical"
            className="inline-flex items-center justify-center px-7 py-3.5 border border-white/10 text-sm text-gray-500 hover:text-white hover:border-white/20 transition-all duration-300">
            Read Architecture
          </MagneticButton>
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
    'Alert volumes overwhelm operators before value is realized',
    'Immediate blocking causes unintended production disruption',
    'False positives erode trust in automated decision-making',
    'Telemetry is opaque, making root-cause analysis difficult',
    'Deployments require heavy coordination with large blast radius',
    'Limited rollback capability when enforcement goes wrong',
  ];
  return (
    <Section id="problem" ariaLabel="The operational problem" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-4xl">
        <SectionLabel number="01" text="The Problem" />
        <SectionTitle>Runtime security today optimizes for detection breadth, not operational safety.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-500 text-lg leading-relaxed mb-14 max-w-2xl">
            Existing tools generate noisy alerts, trigger risky automated blocks, and leave operators with limited visibility into why decisions were made.
          </p>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          {points.map((p, i) => (
            <RevealBlock key={i} delay={i * 0.07} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div whileHover={{ x: 8, borderColor: 'rgba(0,201,167,0.12)' }}
                className="flex items-start gap-3 py-4 border-b border-white/5 cursor-default group transition-colors duration-300">
                <span className="text-[#00c9a7] mt-0.5 text-sm opacity-20 group-hover:opacity-100 transition-all duration-500">—</span>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{p}</p>
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 3. OPERATIONAL SAFETY
// ============================================================
const SafetySection = () => {
  const items = [
    { title: 'Shadow mode', desc: 'Observe runtime behavior without enforcing. Validate policies safely before activation.' },
    { title: 'Rollback controls', desc: 'Every containment action is reversible. Undo enforcement with a full audit trail.' },
    { title: 'Operator approval', desc: 'Humans confirm before containment is applied. No autonomous blocking without input.' },
    { title: 'Blast-radius reduction', desc: 'Scoped responses target specific workloads, not global enforcement rules.' },
    { title: 'Policy simulation', desc: 'Test enforcement logic against historical data before deploying to production.' },
    { title: 'Failure handling', desc: 'Configurable fail-open or fail-closed policies with observable enforcement failures and mitigation timeouts.' },
  ];
  return (
    <Section id="safety" ariaLabel="Operational safety" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-5xl">
        <SectionLabel number="02" text="Operational Safety" />
        <SectionTitle>Safety-first runtime operations.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mb-14">
            Runtime enforcement should reduce risk, not create it. Every mechanism is designed around operator visibility, controlled scope, and reversibility.
          </p>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <RevealBlock key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,201,167,0.1)' }}
                transition={{ type: 'spring', ...springCfg }}
                className="glass p-6 h-full cursor-default group"
              >
                <motion.div className="w-9 h-9 rounded-full border border-[#00c9a7]/15 flex items-center justify-center mb-5 group-hover:border-[#00c9a7]/40 group-hover:shadow-[0_0_16px_rgba(0,201,167,0.1)] transition-all duration-500">
                  <motion.span animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5 }}
                    className="w-2 h-2 rounded-full bg-[#00c9a7]" />
                </motion.div>
                <h3 className="font-['Space_Grotesk'] font-medium text-white text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 4. DESIGN PRINCIPLES
// ============================================================
const PrinciplesSection = () => {
  const principles = ['Shadow-first deployment','Reversible mitigation','Observable enforcement','Progressive trust','Linux-native telemetry','Operator visibility first'];
  return (
    <Section id="principles" ariaLabel="Design principles" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-4xl">
        <SectionLabel number="03" text="Design Principles" />
        <SectionTitle>Built around operational realism.</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {principles.map((p, i) => (
            <RevealBlock key={i} delay={i * 0.07}>
              <motion.div whileHover={{ scale: 1.04, borderColor: 'rgba(0,201,167,0.25)', backgroundColor: 'rgba(0,201,167,0.03)' }}
                transition={{ type: 'spring', ...springCfg }}
                className="flex items-center gap-3 px-5 py-4 border border-white/5 cursor-default">
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] flex-shrink-0" />
                <span className="text-sm text-gray-300">{p}</span>
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 5. RUNTIME WORKFLOW CANVAS — THE CENTERPIECE
// ============================================================
const WorkflowCanvas = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    let stage = 0;
    const interval = setInterval(() => {
      setActiveStage(stage);
      stage++;
      if (stage > 4) { stage = 0; }
    }, 2200);
    return () => clearInterval(interval);
  }, [isInView]);

  const stages = [
    { label: 'Observe', x: 90, desc: 'Collect runtime events using Linux-native instrumentation.' },
    { label: 'Evaluate', x: 270, desc: 'Correlate events with workload context and policy conditions.' },
    { label: 'Simulate', x: 450, desc: 'Validate response logic in shadow mode — no production impact.' },
    { label: 'Mitigate', x: 630, desc: 'Apply controlled, scoped containment with operator approval.' },
    { label: 'Rollback', x: 810, desc: 'Reverse any action with full audit trail and recovery visibility.' },
  ];

  return (
    <Section id="how-it-works" ariaLabel="Runtime workflow" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-6xl" ref={ref}>
        <SectionLabel number="04" text="How It Works" />
        <SectionTitle>Five-stage runtime response workflow.</SectionTitle>

        <RevealBlock delay={0.15}>
          <div className="relative mt-12 mb-10 glass-elevated p-8 md:p-12 overflow-hidden">
            {/* Ambient background glow */}
            <motion.div
              animate={isInView ? {
                background: stages.map((s,i) =>
                  `radial-gradient(300px circle at ${s.x/9.2}% 50%, ${i === activeStage ? 'rgba(0,201,167,0.06)' : 'transparent'}, transparent)`
                )[activeStage] || 'none'
              } : {}}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-none"
            />

            <svg viewBox="0 0 900 180" className="w-full h-auto relative z-10" style={{ minHeight: '120px' }}>
              {/* Connection lines */}
              {stages.slice(0,-1).map((s, i) => (
                <React.Fragment key={`p${i}`}>
                  <motion.line x1={s.x + 24} y1={70} x2={stages[i+1].x - 24} y2={70}
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.25, ease }} />
                  {/* Signal pulse */}
                  {isInView && (
                    <motion.circle r="4" fill="#00c9a7"
                      initial={{ opacity: 0 }}
                      animate={{
                        cx: [s.x + 24, stages[i+1].x - 24],
                        cy: [70, 70],
                        opacity: activeStage === i ? [0, 0.9, 0.9, 0] : 0,
                      }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  )}
                </React.Fragment>
              ))}

              {/* Stage nodes */}
              {stages.map((s, i) => {
                const active = i === activeStage;
                const completed = i < activeStage;
                return (
                  <motion.g key={`s${i}`}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.15, type: 'spring', stiffness: 150 }}
                    style={{ transformOrigin: `${s.x}px 70px` }}
                  >
                    {/* Containment scope ring — only on active */}
                    <motion.circle cx={s.x} cy={70} r={30} fill="none"
                      stroke={active ? 'rgba(0,201,167,0.2)' : 'transparent'} strokeWidth="1"
                      strokeDasharray="4 4"
                      animate={active ? { r: [26, 34, 26], opacity: [0.5, 0.2, 0.5] } : { opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Node */}
                    <motion.circle cx={s.x} cy={70} r={18}
                      fill={active ? 'rgba(0,201,167,0.05)' : '#0a0a0f'}
                      stroke={active ? 'rgba(0,201,167,0.5)' : completed ? 'rgba(0,201,167,0.25)' : 'rgba(255,255,255,0.08)'}
                      strokeWidth={active ? 1.5 : 1}
                      animate={{ scale: active ? 1.1 : 1 }}
                      transition={{ type: 'spring', ...springCfg }}
                    />
                    {/* Core dot */}
                    <motion.circle cx={s.x} cy={70} r={active ? 5 : 3}
                      fill="#00c9a7"
                      animate={{ opacity: active ? 1 : completed ? 0.7 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Label */}
                    <text x={s.x} y={116} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono', monospace"
                      fill={active ? 'rgba(0,201,167,0.7)' : 'rgba(255,255,255,0.25)'}>
                      0{i+1}
                    </text>
                    <text x={s.x} y={135} textAnchor="middle" fontSize="12" fontFamily="'Space Grotesk', sans-serif"
                      fontWeight={active ? '600' : '400'}
                      fill={active ? '#fff' : 'rgba(255,255,255,0.5)'}>
                      {s.label}
                    </text>
                  </motion.g>
                );
              })}

              {/* Rollback reverse path — visible when rollback is active */}
              <motion.path
                d={`M ${stages[4].x - 24} 55 C ${stages[3].x} 30, ${stages[2].x} 30, ${stages[1].x + 24} 55`}
                fill="none" stroke="rgba(0,201,167,0.15)" strokeWidth="1" strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: activeStage === 4 ? 1 : 0, opacity: activeStage === 4 ? 0.6 : 0 }}
                transition={{ duration: 1.2, ease }}
              />
              {activeStage === 4 && (
                <text x={450} y={25} textAnchor="middle" fontSize="9" fontFamily="'JetBrains Mono', monospace" fill="rgba(0,201,167,0.4)">
                  rollback path
                </text>
              )}
            </svg>
          </div>
        </RevealBlock>

        {/* Step descriptions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stages.map((s, i) => (
            <RevealBlock key={i} delay={0.3 + i * 0.08}>
              <motion.div animate={{ opacity: i === activeStage ? 1 : 0.5 }} transition={{ duration: 0.4 }}>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 6. EXAMPLE WORKFLOW (typewriter orchestration)
// ============================================================
const ExampleWorkflow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    { prefix: 'DETECT', text: 'Unexpected binary execution detected in container workload' },
    { prefix: 'CORRELATE', text: 'Event correlated with process lineage and workload context' },
    { prefix: 'SHADOW', text: 'Policy evaluated in shadow mode — no production impact' },
    { prefix: 'RECOMMEND', text: 'Operator receives containment recommendation with full context' },
    { prefix: 'CONTAIN', text: 'Scoped response applied — rollback available at any time' },
  ];

  useEffect(() => {
    if (isInView && visibleLines < lines.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 750);
      return () => clearTimeout(timer);
    }
  }, [isInView, visibleLines]);

  return (
    <Section id="example" ariaLabel="Example workflow" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="05" text="Example Workflow" />
        <SectionTitle>What a runtime response looks like.</SectionTitle>
        <RevealBlock delay={0.1}>
          <div ref={ref} className="glass p-6 md:p-8 mt-8 font-['JetBrains_Mono'] text-sm leading-loose relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-[#00c9a7]/50" />
              <span className="ml-3 text-[10px] text-gray-600">runtime-workflow.log</span>
            </div>
            {lines.map((line, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                animate={i < visibleLines ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.5, ease }}
                className="flex items-start gap-3 mb-3"
              >
                <span className="text-[#00c9a7]/40 flex-shrink-0 text-[10px] mt-0.5 w-24 text-right tracking-wider">[{line.prefix}]</span>
                <span className={i < visibleLines - 1 ? 'text-gray-500' : 'text-gray-300'}>{line.text}</span>
              </motion.div>
            ))}
            <AnimatePresence>
              {visibleLines >= lines.length && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
                  <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: 2 }} className="text-[#00c9a7] text-xs">✓</motion.span>
                  <span className="text-[#00c9a7]/70 text-xs">Workflow complete — all actions auditable and reversible</span>
                </motion.div>
              )}
            </AnimatePresence>
            {visibleLines < lines.length && visibleLines > 0 && (
              <motion.div key="cursor" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
                className="w-2 h-4 bg-[#00c9a7]/50 mt-2 ml-28" />
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
  const tenets = ['Observe before enforce','Progressive rollout','Reversible policies','Operator visibility first'];
  return (
    <Section id="philosophy" ariaLabel="Deployment philosophy" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="06" text="Deployment Philosophy" />
        <SectionTitle>Observe before enforce.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            Runtime enforcement should never be deployed as a binary switch. SilentMesh follows a progressive model: observe first, validate in shadow, enforce with scope, and always maintain rollback.
          </p>
        </RevealBlock>
        <div className="flex flex-wrap gap-3">
          {tenets.map((t, i) => (
            <RevealBlock key={i} delay={i * 0.1}>
              <motion.span whileHover={{ scale: 1.06, borderColor: 'rgba(0,201,167,0.3)', backgroundColor: 'rgba(0,201,167,0.05)' }}
                className="inline-block px-5 py-3 border border-white/8 text-sm text-gray-400 cursor-default transition-all duration-300">
                {t}
              </motion.span>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 8. TECHNICAL PHILOSOPHY with animated lineage SVG
// ============================================================
const TechnicalPhilosophy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { cx: 150, cy: 30, label: 'init', color: '#fff', safe: true },
    { cx: 150, cy: 90, label: 'containerd', color: '#fff', safe: true },
    { cx: 80, cy: 155, label: 'nginx', color: '#00c9a7', safe: true },
    { cx: 220, cy: 155, label: 'unknown', color: '#ef4444', safe: false },
    { cx: 50, cy: 225, label: 'worker', color: '#00c9a7', safe: true },
    { cx: 115, cy: 225, label: 'logger', color: '#00c9a7', safe: true },
    { cx: 220, cy: 225, label: 'blocked', color: '#ef4444', safe: false },
  ];
  const edges = [[0,1],[1,2],[1,3],[2,4],[2,5],[3,6]];

  return (
    <Section id="technical" ariaLabel="Technical philosophy" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-5xl flex flex-col lg:flex-row gap-16 items-start" ref={ref}>
        <div className="flex-1">
          <SectionLabel number="07" text="Technical Philosophy" />
          <SectionTitle>Linux-native telemetry using eBPF-based instrumentation.</SectionTitle>
          <RevealBlock delay={0.1}>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              SilentMesh collects runtime events through eBPF-based instrumentation attached to Linux kernel subsystems. Controlled response mechanisms allow operators to scope containment workflows precisely, maintaining production stability while reducing risk.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Operators retain full visibility into what was observed, what was evaluated, and why a containment recommendation was generated. Every enforcement action is auditable and reversible.
            </p>
          </RevealBlock>
        </div>

        <RevealBlock delay={0.2} direction="right" className="w-full lg:w-2/5 flex-shrink-0">
          <div className="glass-elevated p-6 relative">
            <svg viewBox="0 0 300 280" className="w-full h-auto">
              {edges.map(([a,b], i) => (
                <motion.line key={`le${i}`}
                  x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
                  stroke={nodes[b].safe ? 'rgba(0,201,167,0.2)' : 'rgba(239,68,68,0.25)'}
                  strokeWidth="1" strokeDasharray="4 4"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease }}
                />
              ))}
              {nodes.map((n, i) => (
                <motion.g key={`ln${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1, type: 'spring', stiffness: 180 }}
                  style={{ transformOrigin: `${n.cx}px ${n.cy}px`, cursor: 'default' }}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.circle cx={n.cx} cy={n.cy} r={hoveredNode === i ? 14 : 11}
                    fill="#0a0a0f"
                    stroke={n.safe ? 'rgba(0,201,167,0.35)' : 'rgba(239,68,68,0.45)'}
                    strokeWidth={hoveredNode === i ? 1.5 : 1}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <motion.circle cx={n.cx} cy={n.cy} r={hoveredNode === i ? 4 : 3} fill={n.color} opacity={0.8} />
                  <text x={n.cx} y={n.cy + (hoveredNode === i ? 26 : 22)} textAnchor="middle"
                    fill={hoveredNode === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)'}
                    fontSize="9" fontFamily="'JetBrains Mono', monospace">
                    {n.label}
                  </text>
                </motion.g>
              ))}
              {/* Containment scope ring */}
              <motion.circle cx={220} cy={190} r={55} fill="none"
                stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="3 3"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: 1.5, ease }}
                style={{ transformOrigin: '220px 190px' }}
              />
              <motion.text x={268} y={258}
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}}
                transition={{ delay: 2 }}
                fill="rgba(239,68,68,0.4)" fontSize="8" fontFamily="'JetBrains Mono', monospace">
                containment scope
              </motion.text>
            </svg>
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
    'Autonomously block workloads without operator input',
    'Replace existing SOC or incident-response workflows',
    'Guarantee prevention of all attack scenarios',
    'Require deep kernel modifications or custom modules',
    'Make enforcement decisions without observable reasoning',
  ];
  return (
    <Section id="transparency" ariaLabel="Architecture transparency" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="08" text="Architecture Transparency" />
        <SectionTitle>What SilentMesh does not do.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            Honest scope boundaries build trust. These are the things SilentMesh explicitly does not claim to do.
          </p>
        </RevealBlock>
        {items.map((item, i) => (
          <RevealBlock key={i} delay={i * 0.08} direction="left">
            <motion.div whileHover={{ x: 10, borderColor: 'rgba(239,68,68,0.08)' }}
              className="flex items-start gap-4 py-4 border-b border-white/5 cursor-default group transition-colors duration-300">
              <span className="text-gray-700 group-hover:text-red-400/50 mt-0.5 text-xs transition-colors duration-300">✕</span>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item}</p>
            </motion.div>
          </RevealBlock>
        ))}
      </div>
    </Section>
  );
};

// ============================================================
// 10-13. REMAINING SECTIONS (audience, compat, realities, why)
// ============================================================
const AudienceSection = () => {
  const audiences = [
    { label: 'Platform engineering teams', desc: 'Managing runtime behavior across multi-service infrastructure.' },
    { label: 'DevSecOps teams', desc: 'Integrating security workflows into deployment pipelines.' },
    { label: 'Linux infrastructure operators', desc: 'Running production workloads where stability is non-negotiable.' },
    { label: 'Cloud-native engineering orgs', desc: 'Operating containerized and orchestrated environments at scale.' },
    { label: 'Runtime-conscious security teams', desc: 'Seeking enforcement that respects operational constraints.' },
  ];
  return (
    <Section id="audience" ariaLabel="Who this is for" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="09" text="Who This Is For" />
        <SectionTitle>Built for teams that deploy enforcement carefully.</SectionTitle>
        <div className="grid grid-cols-1 gap-1 mt-8">
          {audiences.map((a, i) => (
            <RevealBlock key={i} delay={i * 0.07}>
              <motion.div whileHover={{ x: 8, borderColor: 'rgba(0,201,167,0.12)' }}
                className="flex items-start gap-4 py-5 border-b border-white/5 cursor-default group transition-colors duration-300">
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-['Space_Grotesk'] font-medium text-white text-sm mb-1 group-hover:text-[#00c9a7] transition-colors duration-300">{a.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

const CompatibilitySection = () => (
  <Section id="compatibility" ariaLabel="Compatibility" className="py-24 md:py-36">
    <Divider />
    <div className="max-w-3xl">
      <SectionLabel number="10" text="Compatibility" />
      <SectionTitle>Designed for Linux workloads.</SectionTitle>
      <RevealBlock delay={0.1}>
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          SilentMesh is designed for Linux workloads across cloud, hybrid, containerized, and edge environments. It operates at the runtime layer, independent of orchestration platform or deployment model.
        </p>
      </RevealBlock>
      <div className="flex flex-wrap gap-3">
        {['Linux','Kubernetes','Containers','VMs','Cloud','Hybrid','Edge'].map((env, i) => (
          <RevealBlock key={i} delay={0.15 + i * 0.05}>
            <motion.span whileHover={{ scale: 1.08, borderColor: 'rgba(0,201,167,0.3)', backgroundColor: 'rgba(0,201,167,0.04)', color: '#e5e7eb' }}
              className="inline-block px-4 py-2 border border-white/8 text-xs text-gray-500 font-['JetBrains_Mono'] tracking-wider cursor-default transition-all duration-300">
              {env}
            </motion.span>
          </RevealBlock>
        ))}
      </div>
    </div>
  </Section>
);

const DeploymentRealities = () => {
  const items = ['High tuning burden before operators see value','Alert fatigue from noisy, low-confidence detections',
    'Unsafe automated blocking in production environments','Difficult progressive rollout without proper staging tools',
    'Weak operator trust in opaque enforcement decisions','Limited rollback capability when things go wrong'];
  return (
    <Section id="realities" ariaLabel="Deployment realities" className="py-24 md:py-36">
      <Divider />
      <div className="max-w-3xl">
        <SectionLabel number="11" text="Deployment Realities" />
        <SectionTitle>Common challenges in runtime security today.</SectionTitle>
        <RevealBlock delay={0.1}>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">These are operational observations, not competitive claims. Understanding these tradeoffs shaped how we designed SilentMesh.</p>
        </RevealBlock>
        {items.map((obs, i) => (
          <RevealBlock key={i} delay={i * 0.06} direction={i % 2 === 0 ? 'left' : 'right'}>
            <motion.div whileHover={{ x: 8 }}
              className="flex items-start gap-3 py-3.5 border-b border-white/5 group hover:border-[#00c9a7]/10 transition-colors duration-300 cursor-default">
              <span className="text-[#00c9a7] mt-0.5 text-sm opacity-20 group-hover:opacity-100 transition-all duration-500">—</span>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{obs}</p>
            </motion.div>
          </RevealBlock>
        ))}
      </div>
    </Section>
  );
};

const WhyWeBuiltThis = () => (
  <Section id="why" ariaLabel="Why we built this" className="py-24 md:py-36">
    <Divider />
    <div className="max-w-2xl">
      <SectionLabel number="12" text="Why We Built This" />
      {['We became interested in runtime security after observing how difficult it is to deploy enforcement safely in production environments.',
        'Many existing workflows optimize for detection breadth while leaving operators with high tuning burden and limited rollback safety. Enforcement decisions are often opaque, and the tools that make them lack the operational caution that production infrastructure demands.',
        'SilentMesh explores a more operationally cautious approach — one where observability comes before enforcement, where every action is reversible, and where operators retain clear visibility into what happened and why.'
      ].map((p, i) => (
        <RevealBlock key={i} delay={i * 0.12}>
          <p className="text-lg text-gray-400 leading-relaxed mb-5">{p}</p>
        </RevealBlock>
      ))}
    </div>
  </Section>
);

// ============================================================
// 14. CTA
// ============================================================
const CTASection = () => (
  <Section id="contact" ariaLabel="Request access" className="py-24 md:py-36">
    <Divider />
    <div className="max-w-lg relative">
      <SectionLabel text="Get in Touch" />
      <SectionTitle>Request early access.</SectionTitle>
      <RevealBlock delay={0.1}>
        <p className="text-gray-500 leading-relaxed mb-8">
          SilentMesh is in early development. If your team is working on runtime security for Linux infrastructure, we would like to hear from you.
        </p>
      </RevealBlock>
      <RevealBlock delay={0.15}>
        <form action="https://formspree.io/f/xvonzgkb" method="POST" className="glass-elevated p-6 md:p-8 space-y-5 relative overflow-hidden">
          <motion.div animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 8, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-[#00c9a7]/30 to-transparent" />
          <div>
            <label htmlFor="email" className="block font-['JetBrains_Mono'] text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-2">Email</label>
            <input id="email" type="email" name="email" required placeholder="you@company.com"
              className="w-full bg-[#090a0f] border border-white/8 px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/40 transition-colors duration-300" />
          </div>
          <div>
            <label htmlFor="message" className="block font-['JetBrains_Mono'] text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-2">Context (optional)</label>
            <textarea id="message" name="message" rows="3" placeholder="What runtime challenges does your team face?"
              className="w-full bg-[#090a0f] border border-white/8 px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/40 transition-colors duration-300 resize-none" />
          </div>
          <MagneticButton as="button" type="submit"
            className="cta-primary w-full py-3.5 bg-[#00c9a7] text-[#090a0f] font-medium text-sm hover:shadow-[0_0_30px_rgba(0,201,167,0.12)] transition-all duration-300">
            Request Access
          </MagneticButton>
        </form>
      </RevealBlock>
    </div>
  </Section>
);

// ============================================================
// FOOTER
// ============================================================
const Footer = () => (
  <footer className="w-full px-6 md:px-12 lg:px-24 py-8 border-t border-white/5">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-['Space_Grotesk'] text-sm text-gray-600">&copy; 2026 SilentMesh</span>
      <span className="font-['JetBrains_Mono'] text-[10px] text-gray-700 tracking-[0.15em] uppercase">Runtime Visibility Platform</span>
    </div>
  </footer>
);

// ============================================================
// APP
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
        <WorkflowCanvas />
        <ExampleWorkflow />
        <DeploymentPhilosophy />
        <TechnicalPhilosophy />
        <TransparencySection />
        <AudienceSection />
        <CompatibilitySection />
        <DeploymentRealities />
        <WhyWeBuiltThis />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
