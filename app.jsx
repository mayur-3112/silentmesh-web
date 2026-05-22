import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex flex-col items-center justify-center font-mono text-muted p-8 text-center">
          <p className="text-sm mb-4">Something went wrong.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border border-muted/30 hover:border-accent text-sm transition-colors">
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// UTILITIES
// ============================================================
const ease = [0.25, 0.1, 0.25, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const Section = ({ id, ariaLabel, children, className = '' }) => (
  <section id={id} aria-label={ariaLabel} className={`relative w-full px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </section>
);

const SectionLabel = ({ number, text }) => (
  <div className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
    {number && <span className="text-accent mr-2">{number}</span>}{text}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold leading-tight tracking-tight mb-6 text-white">
    {children}
  </h2>
);

const RevealBlock = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#problem', label: 'Problem' },
    { href: '#safety', label: 'Safety' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav role="navigation" aria-label="Primary navigation" className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-void/90 backdrop-blur-md border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-16">
        <a href="#" className="font-display font-semibold text-lg text-white tracking-tight">
          SilentMesh
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-muted hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="text-sm font-medium px-4 py-2 border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
            Request Access
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className={`block w-5 h-px bg-white transition-transform duration-200 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-transform duration-200 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-void border-t border-white/5 px-6 py-6 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// ============================================================
// 1. HERO
// ============================================================
const Hero = () => (
  <Section id="hero" ariaLabel="Introduction" className="pt-32 pb-24 md:pt-40 md:pb-32 min-h-[85vh] flex flex-col justify-center">
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
      <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8 px-3 py-1 border border-accent/20 rounded-full">
        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
        <span className="font-mono text-[11px] text-accent tracking-widest uppercase">Runtime Visibility Platform</span>
      </motion.div>

      <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight text-white max-w-4xl mb-6">
        Runtime visibility and scoped response for Linux infrastructure.
      </motion.h1>

      <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-2xl mb-10">
        Safety-focused telemetry and runtime containment workflows designed for production environments.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-accent text-void font-medium text-sm hover:bg-accent/90 transition-colors">
          Request Early Access
        </a>
        <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 border border-white/10 text-sm text-muted hover:text-white hover:border-white/20 transition-colors">
          Talk to Us
        </a>
        <a href="#technical" className="inline-flex items-center justify-center px-6 py-3 border border-white/10 text-sm text-muted hover:text-white hover:border-white/20 transition-colors">
          Read Architecture
        </a>
      </motion.div>
    </motion.div>
  </Section>
);

// ============================================================
// 2. THE PROBLEM
// ============================================================
const ProblemSection = () => (
  <Section id="problem" ariaLabel="The operational problem" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-3xl">
      <RevealBlock>
        <SectionLabel number="01" text="The Problem" />
        <SectionTitle>Runtime security today optimizes for detection breadth, not operational safety.</SectionTitle>
        <p className="text-muted text-lg leading-relaxed mb-10">
          Existing tools generate noisy alerts, trigger risky automated blocks, and leave operators with limited visibility into why decisions were made. Deploying enforcement in production carries real operational risk.
        </p>
      </RevealBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'Alert volumes overwhelm operators before value is realized',
          'Immediate blocking causes unintended production disruption',
          'False positives erode trust in automated decision-making',
          'Telemetry is opaque, making root-cause analysis difficult',
          'Deployments require heavy coordination with large blast radius',
          'Limited rollback capability when enforcement goes wrong',
        ].map((point, i) => (
          <RevealBlock key={i} delay={i * 0.06}>
            <div className="flex items-start gap-3 py-3 border-b border-white/5">
              <span className="text-accent mt-0.5 text-sm">—</span>
              <p className="text-sm text-gray-400 leading-relaxed">{point}</p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  </Section>
);

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
    <Section id="safety" ariaLabel="Operational safety" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-5xl">
        <RevealBlock>
          <SectionLabel number="02" text="Operational Safety" />
          <SectionTitle>Safety-first runtime operations.</SectionTitle>
          <p className="text-muted text-lg leading-relaxed max-w-2xl mb-12">
            Runtime enforcement should reduce risk, not create it. Every mechanism in SilentMesh is designed around operator visibility, controlled scope, and reversibility.
          </p>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <RevealBlock key={i} delay={i * 0.06}>
              <div className="glass p-6 h-full hover:border-accent/15 transition-colors duration-300">
                <h3 className="font-display font-medium text-white text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
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
  const principles = [
    'Shadow-first deployment',
    'Reversible mitigation',
    'Observable enforcement',
    'Progressive trust',
    'Linux-native telemetry',
    'Operator visibility first',
  ];

  return (
    <Section id="principles" ariaLabel="Design principles" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="03" text="Design Principles" />
          <SectionTitle>Built around operational realism.</SectionTitle>
        </RevealBlock>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mt-8">
          {principles.map((p, i) => (
            <RevealBlock key={i} delay={i * 0.06}>
              <div className="flex items-center gap-3 py-3 border-b border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-sm text-gray-300">{p}</span>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 5. HOW IT WORKS
// ============================================================
const HowItWorksSection = () => {
  const steps = [
    { label: 'Observe', desc: 'Collect runtime events with minimal overhead using Linux-native instrumentation.' },
    { label: 'Evaluate', desc: 'Correlate runtime events with workload context and policy conditions.' },
    { label: 'Simulate', desc: 'Validate response logic in shadow mode with no production impact.' },
    { label: 'Mitigate', desc: 'Apply controlled, scoped runtime containment with operator approval.' },
    { label: 'Rollback', desc: 'Reverse any action with full audit trail and recovery visibility.' },
  ];

  return (
    <Section id="how-it-works" ariaLabel="How SilentMesh works" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="04" text="How It Works" />
          <SectionTitle>Five-stage runtime response workflow.</SectionTitle>
        </RevealBlock>

        <div className="mt-10 relative">
          {/* Vertical connector */}
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-white/5" />

          {steps.map((step, i) => (
            <RevealBlock key={i} delay={i * 0.08}>
              <div className="flex items-start gap-6 mb-8 last:mb-0 relative">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-accent/30 bg-void flex items-center justify-center z-10">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div className="pb-2">
                  <h3 className="font-display font-medium text-white text-sm mb-1">{step.label}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 6. EXAMPLE RUNTIME WORKFLOW
// ============================================================
const ExampleWorkflow = () => (
  <Section id="example" ariaLabel="Example runtime workflow" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-3xl">
      <RevealBlock>
        <SectionLabel number="05" text="Example Workflow" />
        <SectionTitle>What a runtime response looks like.</SectionTitle>
      </RevealBlock>

      <RevealBlock delay={0.1}>
        <div className="glass p-6 md:p-8 mt-6 font-mono text-sm leading-loose text-gray-400">
          <div className="flex items-start gap-3 mb-3"><span className="text-accent flex-shrink-0">1.</span><span>Unexpected binary execution detected in container workload</span></div>
          <div className="flex items-start gap-3 mb-3"><span className="text-accent flex-shrink-0">2.</span><span>Event correlated with process lineage and workload context</span></div>
          <div className="flex items-start gap-3 mb-3"><span className="text-accent flex-shrink-0">3.</span><span>Policy evaluated in shadow mode — no production impact</span></div>
          <div className="flex items-start gap-3 mb-3"><span className="text-accent flex-shrink-0">4.</span><span>Operator receives containment recommendation with full context</span></div>
          <div className="flex items-start gap-3"><span className="text-accent flex-shrink-0">5.</span><span>Scoped response applied — rollback available at any time</span></div>
        </div>
      </RevealBlock>
    </div>
  </Section>
);

// ============================================================
// 7. DEPLOYMENT PHILOSOPHY
// ============================================================
const DeploymentPhilosophy = () => {
  const tenets = [
    'Observe before enforce',
    'Progressive rollout',
    'Reversible policies',
    'Operator visibility first',
  ];

  return (
    <Section id="philosophy" ariaLabel="Deployment philosophy" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="06" text="Deployment Philosophy" />
          <SectionTitle>Observe before enforce.</SectionTitle>
          <p className="text-muted text-lg leading-relaxed mb-10">
            Runtime enforcement should never be deployed as a binary switch. SilentMesh follows a progressive model: observe first, validate in shadow, enforce with scope, and always maintain rollback.
          </p>
        </RevealBlock>

        <div className="flex flex-wrap gap-3">
          {tenets.map((t, i) => (
            <RevealBlock key={i} delay={i * 0.06}>
              <span className="inline-block px-4 py-2 border border-white/8 text-sm text-gray-400 bg-subtle/50">
                {t}
              </span>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 8. TECHNICAL PHILOSOPHY
// ============================================================
const TechnicalPhilosophy = () => (
  <Section id="technical" ariaLabel="Technical philosophy" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-3xl">
      <RevealBlock>
        <SectionLabel number="07" text="Technical Philosophy" />
        <SectionTitle>Linux-native telemetry using eBPF-based instrumentation.</SectionTitle>
        <p className="text-muted text-lg leading-relaxed mb-6">
          SilentMesh collects runtime events through eBPF-based instrumentation attached to Linux kernel subsystems. Controlled response mechanisms allow operators to scope containment workflows precisely, maintaining production stability while reducing risk.
        </p>
        <p className="text-muted leading-relaxed">
          Enforcement logic runs within carefully scoped response boundaries. Operators retain full visibility into what was observed, what was evaluated, and why a containment recommendation was generated. Every enforcement action is auditable and reversible.
        </p>
      </RevealBlock>
    </div>
  </Section>
);

// ============================================================
// 9. WHAT SILENTMESH DOES NOT DO
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
    <Section id="transparency" ariaLabel="What SilentMesh does not do" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="08" text="Architecture Transparency" />
          <SectionTitle>What SilentMesh does not do.</SectionTitle>
          <p className="text-muted text-lg leading-relaxed mb-10">
            Honest scope boundaries build trust. These are the things SilentMesh explicitly does not claim to do.
          </p>
        </RevealBlock>

        {items.map((item, i) => (
          <RevealBlock key={i} delay={i * 0.05}>
            <div className="flex items-start gap-3 py-3 border-b border-white/5">
              <span className="text-muted mt-0.5 text-xs">✕</span>
              <p className="text-sm text-gray-400 leading-relaxed">{item}</p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </Section>
  );
};

// ============================================================
// 10. WHO THIS IS FOR
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
    <Section id="audience" ariaLabel="Who this is for" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="09" text="Who This Is For" />
          <SectionTitle>Built for teams that deploy enforcement carefully.</SectionTitle>
        </RevealBlock>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {audiences.map((a, i) => (
            <RevealBlock key={i} delay={i * 0.05}>
              <div className="flex items-start gap-4 py-4 border-b border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-medium text-white text-sm mb-1">{a.label}</h3>
                  <p className="text-sm text-muted leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// 11. COMPATIBILITY
// ============================================================
const CompatibilitySection = () => (
  <Section id="compatibility" ariaLabel="Compatibility" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-3xl">
      <RevealBlock>
        <SectionLabel number="10" text="Compatibility" />
        <SectionTitle>Designed for Linux workloads.</SectionTitle>
        <p className="text-muted text-lg leading-relaxed">
          SilentMesh is designed for Linux workloads across cloud, hybrid, containerized, and edge environments. It operates at the runtime layer, independent of orchestration platform or deployment model.
        </p>
      </RevealBlock>
    </div>
  </Section>
);

// ============================================================
// 12. DEPLOYMENT REALITIES
// ============================================================
const DeploymentRealities = () => {
  const observations = [
    'High tuning burden before operators see value',
    'Alert fatigue from noisy, low-confidence detections',
    'Unsafe automated blocking in production environments',
    'Difficult progressive rollout without proper staging tools',
    'Weak operator trust in opaque enforcement decisions',
    'Limited rollback capability when things go wrong',
  ];

  return (
    <Section id="realities" ariaLabel="Deployment realities" className="py-24 md:py-32">
      <hr className="section-divider mb-16" />
      <div className="max-w-3xl">
        <RevealBlock>
          <SectionLabel number="11" text="Deployment Realities" />
          <SectionTitle>Common challenges in runtime security today.</SectionTitle>
          <p className="text-muted text-lg leading-relaxed mb-10">
            These are operational observations, not competitive claims. Understanding these tradeoffs shaped how we designed SilentMesh.
          </p>
        </RevealBlock>

        {observations.map((obs, i) => (
          <RevealBlock key={i} delay={i * 0.05}>
            <div className="flex items-start gap-3 py-3 border-b border-white/5">
              <span className="text-accent mt-0.5 text-sm">—</span>
              <p className="text-sm text-gray-400 leading-relaxed">{obs}</p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </Section>
  );
};

// ============================================================
// 13. WHY WE BUILT THIS
// ============================================================
const WhyWeBuiltThis = () => (
  <Section id="why" ariaLabel="Why we built this" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-2xl">
      <RevealBlock>
        <SectionLabel number="12" text="Why We Built This" />
        <p className="text-lg text-gray-400 leading-relaxed mb-4">
          We became interested in runtime security after observing how difficult it is to deploy enforcement safely in production environments.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed mb-4">
          Many existing workflows optimize for detection breadth while leaving operators with high tuning burden and limited rollback safety. Enforcement decisions are often opaque, and the tools that make them lack the operational caution that production infrastructure demands.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed">
          SilentMesh explores a more operationally cautious approach — one where observability comes before enforcement, where every action is reversible, and where operators retain clear visibility into what happened and why.
        </p>
      </RevealBlock>
    </div>
  </Section>
);

// ============================================================
// 14. CTA / CONTACT
// ============================================================
const CTASection = () => (
  <Section id="contact" ariaLabel="Request access" className="py-24 md:py-32">
    <hr className="section-divider mb-16" />
    <div className="max-w-lg">
      <RevealBlock>
        <SectionLabel text="Get in Touch" />
        <SectionTitle>Request early access.</SectionTitle>
        <p className="text-muted leading-relaxed mb-8">
          SilentMesh is in early development. If your team is working on runtime security for Linux infrastructure, we would like to hear from you.
        </p>
      </RevealBlock>

      <RevealBlock delay={0.1}>
        <form action="https://formspree.io/f/xvonzgkb" method="POST" className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full bg-surface border border-white/8 px-4 py-3 text-sm text-white placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">Context (optional)</label>
            <textarea
              id="message"
              name="message"
              rows="3"
              placeholder="What runtime challenges does your team face?"
              className="w-full bg-surface border border-white/8 px-4 py-3 text-sm text-white placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors resize-none"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-accent text-void font-medium text-sm hover:bg-accent/90 transition-colors">
            Request Access
          </button>
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
      <span className="font-display text-sm text-muted">&copy; 2026 SilentMesh</span>
      <span className="font-mono text-xs text-muted/50">Runtime Visibility Platform</span>
    </div>
  </footer>
);

// ============================================================
// APP ROOT
// ============================================================
const App = () => (
  <div className="relative">
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
      <AudienceSection />
      <CompatibilitySection />
      <DeploymentRealities />
      <WhyWeBuiltThis />
      <CTASection />
    </main>
    <Footer />
  </div>
);

// Mount
const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
