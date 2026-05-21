/**
 * SilentMesh Web Infrastructure Core - Architecture & Animation Controller
 * Pivot Framework: Universal Enterprise, Cloud-Native K8s, & High-Frequency Fintech
 * Dependencies: GSAP, ScrollTrigger, Lenis (Loaded via CDN)
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. UTILITIES & CUSTOM CURSOR
    // ==========================================
    const isMobile = () => window.innerWidth < 768 || ('ontouchstart' in window);
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    function initCustomCursor() {
        if (isMobile()) return;
        
        const dot = document.createElement('div');
        dot.classList.add('cursor-dot');
        const ring = document.createElement('div');
        ring.classList.add('cursor-ring');
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        function animateRing() {
            ringX = lerp(ringX, mouseX, 0.15);
            ringY = lerp(ringY, mouseY, 0.15);
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        }
        requestAnimationFrame(animateRing);

        const interactiveSelectors = 'a, button, input, select, textarea, .btn, .sim-selector-btn';
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
            });
        });
    }
    initCustomCursor();

    // ==========================================
    // 0.5. MESH CANVAS
    // ==========================================
    function initMeshCanvas() {
        const canvas = document.getElementById('mesh-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height, particles, mousePos = { x: -9999, y: -9999 };
        
        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
                vy: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
                radius: 1 + Math.random() * 1.5,
            };
        }
        
        function setup() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            const count = Math.min(100, Math.floor((width * height) / 12000));
            particles = Array.from({ length: count }, createParticle);
        }
        setup();
        window.addEventListener('resize', setup);
        
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mousePos.x = -9999;
            mousePos.y = -9999;
        });
        
        const CONNECT_DIST = 140;
        const MOUSE_DIST = 180;
        const REPULSION_STRENGTH = 0.02;
        
        function render() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                p.x = clamp(p.x, 0, width);
                p.y = clamp(p.y, 0, height);
                
                const dxm = p.x - mousePos.x;
                const dym = p.y - mousePos.y;
                const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                if (distMouse < MOUSE_DIST && distMouse > 0) {
                    const force = (1 - distMouse / MOUSE_DIST) * REPULSION_STRENGTH;
                    p.vx += (dxm / distMouse) * force;
                    p.vy += (dym / distMouse) * force;
                }
                
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 0.8) { p.vx *= 0.98; p.vy *= 0.98; }
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 102, 255, 0.3)';
                ctx.fill();
                
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
                        ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
                
                if (distMouse < MOUSE_DIST) {
                    const alpha = (1 - distMouse / MOUSE_DIST) * 0.24;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mousePos.x, mousePos.y);
                    ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
    initMeshCanvas();

    // ==========================================
    // 1. LENIS SMOOTH SCROLLING INITIALIZATION
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom kinetic cubic easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.registerPlugin(ScrollTrigger);

        // ==========================================
        // 2. GSAP AWWWARDS-TIER SCROLL ANIMATIONS
        // ==========================================
        const bentoCards = document.querySelectorAll('.bento-card');
        bentoCards.forEach((card) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 40, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
                  scrollTrigger: {
                      trigger: card,
                      start: "top 85%",
                      toggleActions: "play none none none"
                  }
                }
            );
        });

        gsap.to(".architecture-bg-glow", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: "#architecture-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        // Hero typography kinetic reveal
        gsap.fromTo(".hero-title span", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
        );
    }

    // ==========================================
    // 3. INTERACTIVE SIMULATOR CORE LOGIC
    // ==========================================
    const simulatorData = {
        kubernetes: {
            logs: [
                "[K8S CLUSTER] Inbound API request targeting gateway pod cluster /v2/deployments...",
                "[TRACE] Parsing host microservice communication layer via ingress controller...",
                "[EXPLOIT VECTOR] Remote Code Execution (RCE) payload injected into API headers via unauthorized deserialization.",
                "[SYS_CALL] Attempting shell breakout execution string: sys_execve('/bin/sh')...",
                "[KERNEL ENFORCEMENT] Modern eBPF cgroup socket hook intercepted threat token at Ring-0 path.",
                "[MUTATION] Destination memory pointer modified in 0.27ms. Connection rerouted away from real deployment pods.",
                "[ISOLATION] Attacker seamlessly isolated into high-fidelity ephemeral decoy runtime environment. Primary container health: nominal."
            ],
            metrics: { tap: "FAIL (Alert Only)", edr: "FAIL (Pod Terminated / SLA Dropped)", sm: "0.27ms MUTATED" }
        },
        fintech: {
            logs: [
                "[GATEWAY] Processing high-frequency clearing API payload: 2,400 concurrent transactions/sec...",
                "[METADATA] Validating microsecond settlement asset payload arrays...",
                "[EXPLOIT VECTOR] High-throughput race condition variant targeting API transaction settlement ledger.",
                "[CRITICAL] Malicious thread attempting double-spend ledger modification system calls.",
                "[KERNEL ENFORCEMENT] SilentMesh data plane maps anomalous execution pattern at socket abstraction layer.",
                "[OVERHEAD CHECK] Dynamic enforcement overhead validation: <0.8% host CPU cycle consumption.",
                "[RESOLVED] Connection isolated to dummy shadow ledger instance. Real transaction pipeline processing uninterrupted."
            ],
            metrics: { tap: "FAIL (Post-Event Log)", edr: "FAIL (Processing Jitter >15ms)", sm: "0.27ms PROTECTED" }
        },
        enterprise: {
            logs: [
                "[HOST NETWORK] Monitoring root core database deployment infrastructure...",
                "[TRACE] External connection sequence initiated toward persistent transaction database layer on port 5432...",
                "[EXPLOIT VECTOR] Automated scanning array launching credential stuffing and memory manipulation vectors.",
                "[CRITICAL] Unauthorized lateral movement query signature identified across internal network boundary.",
                "[KERNEL ENFORCEMENT] Shared BPF Ring Buffer pushing structural metadata to user-space Flight Recorder.",
                "[RESOLVED] Traffic transparently encapsulated and routed to isolated cloud honeypot space. No application downtime."
            ],
            metrics: { tap: "FAIL (Undetected)", edr: "FAIL (Host Kernel Crash)", sm: "0.27ms CONTAINED" }
        }
    };

    let typingTimeout = null;

    window.runInfrastructureSimulation = function(sectorKey) {
        document.querySelectorAll('.sim-selector-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-white', 'bg-blue-950/30');
            btn.classList.add('border-slate-800', 'text-slate-400', 'bg-transparent');
        });
        
        const activeBtn = document.getElementById(`btn-${sectorKey}`);
        if(activeBtn) {
            activeBtn.classList.remove('border-slate-800', 'text-slate-400', 'bg-transparent');
            activeBtn.classList.add('border-blue-500', 'text-white', 'bg-blue-950/30');
        }

        const logConsole = document.getElementById('terminal-stream-output');
        const dataset = simulatorData[sectorKey];
        if (!logConsole || !dataset) return;

        // Clear existing timeout if rapidly toggled
        if (typingTimeout) clearTimeout(typingTimeout);
        logConsole.innerHTML = "";
        
        const tapBox = document.getElementById('status-tap');
        const edrBox = document.getElementById('status-edr');
        const smBox = document.getElementById('status-sm');

        [tapBox, edrBox, smBox].forEach(box => {
            if (box) {
                box.innerText = "WAITING...";
                box.className = "font-mono text-sm text-slate-500";
            }
        });

        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex < dataset.logs.length) {
                const lineText = dataset.logs[lineIndex];
                let colorClass = "text-slate-400";
                
                if (lineText.includes("[EXPLOIT") || lineText.includes("[CRITICAL]")) colorClass = "text-red-400 font-semibold";
                if (lineText.includes("[KERNEL") || lineText.includes("[RESOLVED]")) colorClass = "text-emerald-400 font-semibold";
                
                const lineDiv = document.createElement('div');
                lineDiv.className = `${colorClass} mb-1.5 opacity-0 translate-y-2 transition-all duration-300`;
                lineDiv.innerText = lineText;
                logConsole.appendChild(lineDiv);
                
                // Trigger CSS reveal
                setTimeout(() => {
                    lineDiv.classList.remove('opacity-0', 'translate-y-2');
                    logConsole.scrollTop = logConsole.scrollHeight;
                }, 10);

                lineIndex++;
                typingTimeout = setTimeout(typeLine, 300);
            } else {
                if (tapBox) { tapBox.innerText = dataset.metrics.tap; tapBox.className = "font-mono text-sm text-red-500 font-bold"; }
                if (edrBox) { edrBox.innerText = dataset.metrics.edr; edrBox.className = "font-mono text-sm text-amber-500 font-bold"; }
                if (smBox) { smBox.innerText = dataset.metrics.sm; smBox.className = "font-mono text-sm text-emerald-400 font-bold tracking-wider"; }
            }
        }
        typeLine();
    };

    if (document.getElementById('btn-kubernetes')) {
        runInfrastructureSimulation('kubernetes');
    }
});
