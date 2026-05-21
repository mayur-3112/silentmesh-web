/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SILENTMESH — Interactive JavaScript Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * A production-grade, Awwwards-tier interaction layer for the SilentMesh
 * cybersecurity startup website. Pure vanilla ES6+ — zero dependencies.
 *
 * Modules:
 *   1. Custom Cursor          6. Exploit Simulator
 *   2. Smooth Scroll           7. Exposure Calculator
 *   3. Mesh Canvas             8. Contact Form
 *   4. Scroll Reveal            9. Mobile Nav
 *   5. Purdue Tabs             10. Magnetic Buttons
 *
 * © 2026 SilentMesh Systems Private Limited
 * ═══════════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Utility: detect mobile / touch device ───────────────────────────────────
  const isMobile = () => window.innerWidth < 768 || ('ontouchstart' in window);

  // ─── Utility: linear interpolation ───────────────────────────────────────────
  const lerp = (start, end, factor) => start + (end - start) * factor;

  // ─── Utility: clamp a value between min and max ─────────────────────────────
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


  /* ═══════════════════════════════════════════════════════════════════════════
   * 1. CUSTOM CURSOR
   * ═══════════════════════════════════════════════════════════════════════════
   * Two dynamically-created elements: a small dot that tracks instantly and
   * a ring that trails with lerp interpolation. Responds to interactive
   * element hovers and hides on mobile/touch devices.
   */
  function initCustomCursor() {
    if (isMobile()) return;

    // Create cursor elements
    const dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    const ring = document.createElement('div');
    ring.classList.add('cursor-ring');
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Inject cursor styles (self-contained — no external CSS dependency)
    const style = document.createElement('style');
    style.textContent = `
      .cursor-dot {
        position: fixed;
        top: 0; left: 0;
        width: 8px; height: 8px;
        background: #00f0ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10001;
        transform: translate(-50%, -50%);
        transition: width 0.25s cubic-bezier(.23,1,.32,1),
                    height 0.25s cubic-bezier(.23,1,.32,1),
                    background 0.25s ease;
        mix-blend-mode: difference;
      }
      .cursor-ring {
        position: fixed;
        top: 0; left: 0;
        width: 36px; height: 36px;
        border: 1.5px solid rgba(0, 240, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: width 0.35s cubic-bezier(.23,1,.32,1),
                    height 0.35s cubic-bezier(.23,1,.32,1),
                    border-color 0.3s ease;
      }
      .cursor-dot.hidden, .cursor-ring.hidden {
        opacity: 0;
      }
    `;
    document.head.appendChild(style);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let dotScale = 1, ringScale = 1;

    // Instant dot tracking
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Lerp ring trailing via rAF
    function animateRing() {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Interactive element hover states
    const interactiveSelectors = 'a, button, input, select, textarea, .btn, .attack-btn, .purdue-tab';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '54px';
        ring.style.height = '54px';
        dot.style.width = '4px';
        dot.style.height = '4px';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '36px';
        ring.style.height = '36px';
        dot.style.width = '8px';
        dot.style.height = '8px';
        ring.style.borderColor = 'rgba(0, 240, 255, 0.5)';
      });
    });

    // Terminal hover — green cursor ring
    const terminal = document.getElementById('terminal-screen');
    if (terminal) {
      terminal.addEventListener('mouseenter', () => {
        ring.style.borderColor = '#00ff88';
      });
      terminal.addEventListener('mouseleave', () => {
        ring.style.borderColor = 'rgba(0, 240, 255, 0.5)';
      });
    }

    // Hide on mouse leave window
    document.addEventListener('mouseleave', () => {
      dot.classList.add('hidden');
      ring.classList.add('hidden');
    });
    document.addEventListener('mouseenter', () => {
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 2. SMOOTH SCROLL
   * ═══════════════════════════════════════════════════════════════════════════
   * Lightweight lerp-based smooth scroll for nav link clicks. Desktop only —
   * mobile retains native scroll for performance and accessibility.
   */
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const isDesktop = !isMobile();

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        if (!isDesktop) {
          // Native scroll on mobile
          target.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // Lerp-based smooth scroll on desktop
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - 80;
        let currentY = window.pageYOffset;
        let rafId = null;

        function scrollStep() {
          currentY = lerp(currentY, targetY, 0.08);

          // Stop when close enough (sub-pixel precision)
          if (Math.abs(currentY - targetY) < 0.5) {
            window.scrollTo(0, targetY);
            return;
          }

          window.scrollTo(0, currentY);
          rafId = requestAnimationFrame(scrollStep);
        }

        // Cancel any prior scroll animation
        if (rafId) cancelAnimationFrame(rafId);
        requestAnimationFrame(scrollStep);
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 3. MESH CANVAS
   * ═══════════════════════════════════════════════════════════════════════════
   * Full-viewport fixed canvas with particle system. Particles drift slowly,
   * form connection lines when nearby, and react to cursor proximity with
   * brighter links and subtle repulsion force.
   */
  function initMeshCanvas() {
    const canvas = document.getElementById('mesh-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mousePos = { x: -9999, y: -9999 };

    // ── Particle factory ──
    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
        vy: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
        radius: 1 + Math.random() * 1.5,
      };
    }

    // ── Setup / Resize ──
    function setup() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(100, Math.floor((width * height) / 12000));
      particles = Array.from({ length: count }, createParticle);
    }
    setup();

    window.addEventListener('resize', setup);

    // ── Track mouse on canvas ──
    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mousePos.x = -9999;
      mousePos.y = -9999;
    });

    // ── Connection distance thresholds ──
    const CONNECT_DIST = 140;
    const MOUSE_DIST = 180;
    const REPULSION_STRENGTH = 0.02;

    // ── Main render loop ──
    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges (wrap with soft bounce)
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = clamp(p.x, 0, width);
        p.y = clamp(p.y, 0, height);

        // Mouse repulsion
        const dxm = p.x - mousePos.x;
        const dym = p.y - mousePos.y;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < MOUSE_DIST && distMouse > 0) {
          const force = (1 - distMouse / MOUSE_DIST) * REPULSION_STRENGTH;
          p.vx += (dxm / distMouse) * force;
          p.vy += (dym / distMouse) * force;
        }

        // Dampen velocity to keep particles slow
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.8) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(45, 99, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Brighter connection to mouse when nearby
        if (distMouse < MOUSE_DIST) {
          const alpha = (1 - distMouse / MOUSE_DIST) * 0.24;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 4. SCROLL REVEAL
   * ═══════════════════════════════════════════════════════════════════════════
   * IntersectionObserver-based one-time reveal animations. Elements with
   * `.reveal` get `.visible` when they enter the viewport. Staggered children
   * within `.stagger-children` containers are observed individually.
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const staggerContainers = document.querySelectorAll('.stagger-children');

    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // One-time reveal
        }
      });
    }, observerOptions);

    // Observe all .reveal elements
    revealElements.forEach(el => revealObserver.observe(el));

    // Handle staggered children — observe each child individually
    staggerContainers.forEach(container => {
      const children = container.querySelectorAll('.reveal');
      children.forEach(child => revealObserver.observe(child));
    });

    // Also observe major section elements for entrance animations
    const sectionElements = document.querySelectorAll(
      '.section-header, .pain-card, .purdue-layer-card, .res-card, ' +
      '.crypto-step, .spec-item, .stat-card, .form-group, .comparison-table tbody tr'
    );
    sectionElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 5. PURDUE TABS
   * ═══════════════════════════════════════════════════════════════════════════
   * Interactive tabbed navigation for the Purdue Model security diagram.
   * Clicking a tab highlights the corresponding layer card.
   */
  function initPurdueTabs() {
    const tabs = document.querySelectorAll('.purdue-tab');
    const layerCards = document.querySelectorAll('.purdue-layer-card');

    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');

        // Update tab active states
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update layer card highlights
        layerCards.forEach(card => card.classList.remove('active-highlight'));
        const targetCard = document.getElementById(`layer-${target}`);
        if (targetCard) {
          targetCard.classList.add('active-highlight');
        }
      });
    });

    // Default: 'l4-5' active on load (already set in HTML, reinforce via JS)
    const defaultTab = document.querySelector('.purdue-tab[data-target="l4-5"]');
    const defaultCard = document.getElementById('layer-l4-5');
    if (defaultTab) defaultTab.classList.add('active');
    if (defaultCard) defaultCard.classList.add('active-highlight');
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 6. EXPLOIT SIMULATOR
   * ═══════════════════════════════════════════════════════════════════════════
   * Interactive terminal simulation with typewriter output. Three exploit
   * scenarios show real kernel-level events being intercepted by the eBPF
   * engine. Results update comparison cards post-simulation.
   */
  function initExploitSimulator() {
    const terminalScreen = document.getElementById('terminal-screen');
    const runBtn = document.getElementById('run-simulation-btn');
    const attackBtns = document.querySelectorAll('.attack-btn');

    if (!terminalScreen || !runBtn) return;

    let selectedExploit = 'toctou';
    let isRunning = false;

    // ── Exploit scenario data ──
    const exploitData = {
      toctou: {
        lines: [
          { tag: 'RECON',  cls: 'recon',   text: 'mount-race-tool spawned (PID: 14205) — ancestry: /bin/bash → /tmp/.hidden/exploit' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'stat() → /usr/bin/firmware.bin — inode: 90284, uid: 0, mode: 0755' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'Signature validation passed. Hash: SHA256:a3f8c1...verified' },
          { tag: 'ATTACK', cls: 'attack',  text: '⚠ RACE WINDOW OPEN — unlink() + symlink() initiated on target path' },
          { tag: 'ATTACK', cls: 'attack',  text: 'symlink(/tmp/malicious.bin → /usr/bin/firmware.bin) — elapsed: 0.8ms' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'openat(AT_FDCWD, "/usr/bin/firmware.bin", O_WRONLY) — inode: 91022 ≠ 90284' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ kprobe:sys_enter_openat triggered — inode mismatch detected in 512ns' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ LSM hook enforced: write blocked → EACCES (Permission Denied)' },
          { tag: 'RESULT', cls: 'result',  text: '✓ TOCTOU race neutralized. Mitigation latency: 0.27ms. System integrity intact.' },
        ],
        netStatus: 'Alert generated 4.2s post-exploit. No blocking. Firmware replaced.',
        edrStatus: 'Scan triggered 340ms post-write. Race completed. PLC halted.',
        smStatus:  'eBPF kprobe blocked inode swap in 0.27ms. Firmware intact.',
      },
      modbus: {
        lines: [
          { tag: 'RECON',  cls: 'recon',   text: 'Rogue binary executed from /tmp/.modbus-cmd (PID: 8840)' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'socket(AF_INET, SOCK_STREAM, 0) — port 502 (Modbus TCP)' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'connect() → 192.168.12.10:502 (PLC Gateway)' },
          { tag: 'ATTACK', cls: 'attack',  text: '⚠ Crafting Modbus frame: Function 0x05 (Write Single Coil) — Addr: 1002, Value: 0xFF00' },
          { tag: 'ATTACK', cls: 'attack',  text: 'Target: Safety Interlock Bypass — downstream turbine protection' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ connect() hook — process /tmp/.modbus-cmd not in trusted process registry' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ Ancestry trace: bash → wget → /tmp/.modbus-cmd — UNAUTHORIZED' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ LSM socket enforcement: connect() blocked → ECONNREFUSED' },
          { tag: 'RESULT', cls: 'result',  text: '✓ Modbus injection neutralized. Latency: 0.27ms. PLC safety loop intact.' },
        ],
        netStatus: 'Packet logged after delivery to PLC. Alert: T+6.1s. No prevention.',
        edrStatus: 'Process flagged post-connect. Socket already transmitted frame.',
        smStatus:  'connect() blocked at LSM hook in 0.27ms. No frame sent to PLC.',
      },
      tamper: {
        lines: [
          { tag: 'RECON',  cls: 'recon',   text: 'Cleanup utility spawned (PID: 14221) — post-exploit evidence wipe' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'open("/var/log/audit/audit.log", O_WRONLY|O_TRUNC)' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'unlink("/var/log/scada/telemetry.db")' },
          { tag: 'KERNEL', cls: 'kernel',  text: 'truncate("/var/log/syslog", 0)' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ vfs_unlink hook — target path in IMMUTABLE registry' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ Process PID 14221 lacks CAP_IMMUTABLE_BYPASS capability' },
          { tag: 'eBPF',   cls: 'ebpf',    text: '✦ unlink() denied. truncate() denied. File descriptors frozen.' },
          { tag: 'RESULT', cls: 'result',  text: '✓ Evidence destruction blocked. Forensic audit trail preserved. Latency: 0.27ms.' },
        ],
        netStatus: 'No network event generated. Log deletion invisible to sensor.',
        edrStatus: 'Process allowed. Logs wiped before EDR could collect evidence.',
        smStatus:  'vfs_unlink blocked. All forensic logs immutable and preserved.',
      },
    };

    // ── Attack button selection ──
    attackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isRunning) return;
        attackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedExploit = btn.getAttribute('data-exploit');
      });
    });

    // ── Typewriter line renderer ──
    function typewriteLine(container, tag, cls, fullText, charDelay = 2) {
      return new Promise(resolve => {
        const line = document.createElement('div');
        line.classList.add('terminal-line', cls);

        const tagSpan = document.createElement('span');
        tagSpan.classList.add('term-tag');
        tagSpan.textContent = `[${tag}] `;
        line.appendChild(tagSpan);

        const textSpan = document.createElement('span');
        textSpan.classList.add('term-text');
        line.appendChild(textSpan);

        container.appendChild(line);

        // Auto-scroll terminal
        container.scrollTop = container.scrollHeight;

        let idx = 0;
        function typeChar() {
          if (idx < fullText.length) {
            textSpan.textContent += fullText[idx];
            idx++;
            container.scrollTop = container.scrollHeight;
            setTimeout(typeChar, charDelay);
          } else {
            resolve();
          }
        }
        typeChar();
      });
    }

    // ── Run simulation ──
    runBtn.addEventListener('click', async () => {
      if (isRunning) return;
      isRunning = true;

      const data = exploitData[selectedExploit];
      if (!data) return;

      // Disable button
      runBtn.textContent = 'Streaming kernel events...';
      runBtn.disabled = true;
      runBtn.style.opacity = '0.6';

      // Clear terminal (keep system init lines)
      terminalScreen.innerHTML = `
        <div class="terminal-line system-msg">[SYSTEM] SilentMesh eBPF Kernel Probe active. Ready.</div>
        <div class="terminal-line system-msg">[SYSTEM] Listening on syscall ring buffer. Hook latency: 512ns.</div>
        <div class="terminal-line system-msg">[SYSTEM] Simulation initiated — vector: ${selectedExploit.toUpperCase()}</div>
      `;

      // Reset result cards
      resetResultCards();

      // Type each line with 50ms gap between lines
      for (const lineData of data.lines) {
        await new Promise(r => setTimeout(r, 50));
        await typewriteLine(terminalScreen, lineData.tag, lineData.cls, lineData.text, 2);
      }

      // Add final cursor
      const cursor = document.createElement('div');
      cursor.classList.add('terminal-line', 'prompt');
      cursor.textContent = '> _';
      terminalScreen.appendChild(cursor);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;

      // Update result cards with animation
      await new Promise(r => setTimeout(r, 300));
      updateResultCards(data);

      // Re-enable button
      runBtn.textContent = 'Trigger Attack Simulation';
      runBtn.disabled = false;
      runBtn.style.opacity = '1';
      isRunning = false;
    });

    // ── Reset result cards ──
    function resetResultCards() {
      setCardContent('net', '--', 'Analyzing...', '--');
      setCardContent('edr', '--', 'Analyzing...', '--');
      setCardContent('sm', '--', 'Analyzing...', '--');
    }

    // ── Update result cards after simulation ──
    function updateResultCards(data) {
      // Network card — FAIL (red)
      const netTime = document.getElementById('net-time');
      const netStatus = document.getElementById('net-status');
      const netLatency = document.getElementById('net-latency');
      if (netTime) netTime.textContent = 'FAIL';
      if (netTime) netTime.style.color = '#ff4444';
      if (netStatus) { netStatus.textContent = data.netStatus; netStatus.style.color = '#ff6b6b'; }
      if (netLatency) netLatency.textContent = 'FAIL (Alert Only)';

      // EDR card — FAIL (yellow)
      const edrTime = document.getElementById('edr-time');
      const edrStatus = document.getElementById('edr-status');
      const edrLatency = document.getElementById('edr-latency');
      if (edrTime) edrTime.textContent = 'FAIL';
      if (edrTime) edrTime.style.color = '#ffaa00';
      if (edrStatus) { edrStatus.textContent = data.edrStatus; edrStatus.style.color = '#f0c040'; }
      if (edrLatency) edrLatency.textContent = 'FAIL (Too Slow)';

      // SilentMesh card — SUCCESS (green)
      const smTime = document.getElementById('sm-time');
      const smStatus = document.getElementById('sm-status');
      const smLatency = document.getElementById('sm-latency');
      if (smTime) smTime.textContent = '0.27ms';
      if (smTime) smTime.style.color = '#00ff88';
      if (smStatus) { smStatus.textContent = data.smStatus; smStatus.style.color = '#00ff88'; }
      if (smLatency) smLatency.textContent = '0.27ms (Enforced)';

      // Pulse animation on SilentMesh card
      const smCard = document.querySelector('.sm-res');
      if (smCard) {
        smCard.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
        setTimeout(() => {
          smCard.style.boxShadow = '';
        }, 1500);
      }
    }

    function setCardContent(prefix, time, status, latency) {
      const timeEl = document.getElementById(`${prefix}-time`);
      const statusEl = document.getElementById(`${prefix}-status`);
      const latencyEl = document.getElementById(`${prefix}-latency`);
      if (timeEl) { timeEl.textContent = time; timeEl.style.color = ''; }
      if (statusEl) { statusEl.textContent = status; statusEl.style.color = ''; }
      if (latencyEl) latencyEl.textContent = latency;
    }
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 7. EXPOSURE CALCULATOR
   * ═══════════════════════════════════════════════════════════════════════════
   * Real-time infrastructure risk calculator. Range slider and selects feed
   * into exposure window and trip risk computations. Values animate smoothly
   * using requestAnimationFrame number counting.
   */
  function initExposureCalculator() {
    const gatewayRange = document.getElementById('gateway-range');
    const gatewayVal = document.getElementById('gateway-val');
    const pollFrequency = document.getElementById('poll-frequency');
    const deviceType = document.getElementById('device-type');
    const calcWindow = document.getElementById('calc-window');
    const calcTripRisk = document.getElementById('calc-trip-risk');

    if (!gatewayRange || !pollFrequency || !deviceType) return;

    // Current displayed values (for smooth animation)
    let displayedWindow = 24.0;
    let displayedRisk = 84;

    // ── Animated number counter ──
    function animateValue(element, startVal, endVal, duration, suffix, decimals = 1) {
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (endVal - startVal) * eased;

        element.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    // ── Calculate exposure values ──
    function calculate() {
      const gateways = parseInt(gatewayRange.value, 10);
      const poll = pollFrequency.value;
      const safety = deviceType.value;

      // Update gateway display
      if (gatewayVal) gatewayVal.textContent = `${gateways} Gateways`;

      // Base vulnerability window (hours)
      let windowHours;
      let baseRisk;

      switch (poll) {
        case 'passive':
          windowHours = 24.0;
          baseRisk = 0;
          break;
        case '60':
          windowHours = 23.9;
          baseRisk = 2;
          break;
        case '5':
          windowHours = 4.2;
          baseRisk = 62;
          break;
        default:
          windowHours = 24.0;
          baseRisk = 0;
      }

      // Safety margin multiplier
      let safetyMultiplier;
      switch (safety) {
        case 'critical':
          safetyMultiplier = 1.5;
          break;
        case 'moderate':
          safetyMultiplier = 1.0;
          break;
        case 'flexible':
          safetyMultiplier = 0.4;
          break;
        default:
          safetyMultiplier = 1.0;
      }

      // Scale risk with gateway count (logarithmic scaling)
      const gatewayFactor = 1 + Math.log10(gateways / 10) * 0.15;
      let tripRisk = baseRisk * safetyMultiplier * gatewayFactor;
      tripRisk = clamp(Math.round(tripRisk), 0, 99);

      // Animate the value transitions
      if (calcWindow) {
        animateValue(calcWindow, displayedWindow, windowHours, 400, ' Hours', 1);
        displayedWindow = windowHours;
      }
      if (calcTripRisk) {
        animateValue(calcTripRisk, displayedRisk, tripRisk, 400, '% Risk', 0);
        displayedRisk = tripRisk;
      }

      // Color coding
      if (calcWindow) {
        calcWindow.className = 'm-val ' + (windowHours > 12 ? 'text-red' : windowHours > 4 ? 'text-orange' : 'text-yellow');
      }
      if (calcTripRisk) {
        calcTripRisk.className = 'm-val ' + (tripRisk > 60 ? 'text-red' : tripRisk > 20 ? 'text-orange' : 'text-green');
      }
    }

    // Bind events
    gatewayRange.addEventListener('input', calculate);
    pollFrequency.addEventListener('change', calculate);
    deviceType.addEventListener('change', calculate);

    // Initial calculation
    calculate();
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 8. CONTACT FORM
   * ═══════════════════════════════════════════════════════════════════════════
   * Multi-stage visual pipeline submission. Shows a cryptographic handshake
   * sequence before actually posting to Formspree, creating a "cybersecurity
   * product" feel for the form submission flow.
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
      }

      // Pipeline stages with crypto-themed messaging
      const stages = [
        { delay: 0,    text: '[INIT] Establishing secure channel...',            cls: 'status-init' },
        { delay: 800,  text: '[CRYPTO] ML-KEM-768 key encapsulation...',         cls: 'status-crypto' },
        { delay: 1600, text: '[AUTH] Dilithium-3 signature verification...',      cls: 'status-auth' },
        { delay: 2400, text: '[TRANSMIT] Encrypting and sending payload...',      cls: 'status-transmit' },
      ];

      // Show each stage sequentially
      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, stage.delay === 0 ? 0 : 800));
        status.textContent = stage.text;
        status.className = `form-status-msg ${stage.cls}`;
        status.style.color = '#00f0ff';
      }

      // Actually submit to Formspree
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          status.textContent = '[SUCCESS] ✓ Secure channel established. Pilot request transmitted. We will respond within 24 hours.';
          status.style.color = '#00ff88';
          status.className = 'form-status-msg status-success';
          form.reset();
        } else {
          throw new Error('Server responded with error');
        }
      } catch (err) {
        status.textContent = '[ERROR] ✗ Transmission failed. Please email founder@silentmesh.me directly.';
        status.style.color = '#ff4444';
        status.className = 'form-status-msg status-error';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 9. MOBILE NAV
   * ═══════════════════════════════════════════════════════════════════════════
   * Hamburger toggle that animates to an X and opens the mobile navigation
   * panel. Closes on nav link click for single-page scroll UX.
   */
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !navbar) return;

    toggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      // Prevent body scroll when nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Also close on CTA button click
    const ctaBtn = document.querySelector('.nav-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        navbar.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * 10. MAGNETIC BUTTONS
   * ═══════════════════════════════════════════════════════════════════════════
   * Buttons with `.btn-magnetic` subtly follow the cursor within their
   * bounding box, creating a tactile "magnetic pull" effect on hover.
   */
  function initMagneticButtons() {
    if (isMobile()) return;

    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
        btn.style.transition = 'transform 0.15s ease-out';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(.23,1,.32,1)';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * BONUS: Header scroll effect
   * ═══════════════════════════════════════════════════════════════════════════
   * Subtle header background darkening on scroll for visual depth.
   */
  function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * BONUS: Terminal cursor blink injection
   * ═══════════════════════════════════════════════════════════════════════════
   * Injects CSS for the terminal cursor blink and line styling.
   */
  function initTerminalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Terminal line color coding */
      .terminal-line { 
        padding: 2px 0; 
        line-height: 1.6; 
        font-size: 0.82rem;
        opacity: 0;
        animation: termFadeIn 0.15s ease forwards;
      }
      @keyframes termFadeIn {
        to { opacity: 1; }
      }
      .terminal-line .term-tag { font-weight: 700; }
      .terminal-line.system-msg { color: #6a737d; }
      .terminal-line.system-msg .term-tag { color: #6a737d; }
      .terminal-line.recon .term-tag { color: #79c0ff; }
      .terminal-line.recon .term-text { color: #c9d1d9; }
      .terminal-line.kernel .term-tag { color: #d2a8ff; }
      .terminal-line.kernel .term-text { color: #b0b8c4; }
      .terminal-line.attack .term-tag { color: #ff7b72; }
      .terminal-line.attack .term-text { color: #ffa198; }
      .terminal-line.ebpf .term-tag { color: #00f0ff; }
      .terminal-line.ebpf .term-text { color: #3fb950; }
      .terminal-line.result .term-tag { color: #3fb950; }
      .terminal-line.result .term-text { color: #56d364; font-weight: 600; }
      .terminal-line.prompt { color: #484f58; }

      /* Form status animation */
      .form-status-msg {
        padding: 12px 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        transition: color 0.3s ease;
      }
      .status-init { animation: statusPulse 0.8s ease-in-out infinite; }
      .status-crypto { animation: statusPulse 0.6s ease-in-out infinite; }
      .status-auth { animation: statusPulse 0.5s ease-in-out infinite; }
      .status-transmit { animation: statusPulse 0.4s ease-in-out infinite; }
      @keyframes statusPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .status-success { animation: none; opacity: 1; }
      .status-error { animation: none; opacity: 1; }

      /* Scroll reveal base styles */
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.7s cubic-bezier(.23,1,.32,1),
                    transform 0.7s cubic-bezier(.23,1,.32,1);
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Staggered children delay */
      .stagger-children .reveal:nth-child(1) { transition-delay: 0s; }
      .stagger-children .reveal:nth-child(2) { transition-delay: 0.1s; }
      .stagger-children .reveal:nth-child(3) { transition-delay: 0.2s; }
      .stagger-children .reveal:nth-child(4) { transition-delay: 0.3s; }
      .stagger-children .reveal:nth-child(5) { transition-delay: 0.4s; }
      .stagger-children .reveal:nth-child(6) { transition-delay: 0.5s; }

      /* Header scroll state */
      .main-header.scrolled {
        background: rgba(13, 17, 23, 0.95) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 1px 0 rgba(45, 99, 255, 0.1);
      }

      /* Purdue tab active highlight transition */
      .purdue-layer-card {
        transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
      }
      .purdue-layer-card.active-highlight {
        border-color: rgba(45, 99, 255, 0.6);
        background: rgba(45, 99, 255, 0.06);
        box-shadow: 0 0 20px rgba(45, 99, 255, 0.1);
      }

      /* Mobile nav hamburger → X animation */
      .mobile-nav-toggle .bar {
        transition: transform 0.35s cubic-bezier(.23,1,.32,1),
                    opacity 0.25s ease;
      }
      .mobile-nav-toggle.open .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }
      .mobile-nav-toggle.open .bar:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      .mobile-nav-toggle.open .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }

      /* Result card glow transition */
      .res-card {
        transition: box-shadow 0.6s ease;
      }
    `;
    document.head.appendChild(style);
  }


  /* ═══════════════════════════════════════════════════════════════════════════
   * INITIALIZATION
   * ═══════════════════════════════════════════════════════════════════════════
   * Boot all modules in sequence. Terminal styles first so reveal CSS
   * is available before IntersectionObserver fires.
   */
  initTerminalStyles();
  initCustomCursor();
  initSmoothScroll();
  initMeshCanvas();
  initScrollReveal();
  initPurdueTabs();
  initExploitSimulator();
  initExposureCalculator();
  initContactForm();
  initMobileNav();
  initMagneticButtons();
  initHeaderScroll();

  // ── Console signature ──
  console.log(
    '%c⬡ SilentMesh Engine Loaded %c 0.27ms Deterministic Enforcement ',
    'background: #2D63FF; color: #fff; padding: 4px 8px; font-weight: bold; border-radius: 3px 0 0 3px;',
    'background: #0D1117; color: #00f0ff; padding: 4px 8px; border: 1px solid #2D63FF; border-radius: 0 3px 3px 0;'
  );

});
