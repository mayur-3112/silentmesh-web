/**
 * SilentMesh Web Infrastructure Core - Cinematic Controller
 * Dependencies: Lenis (Loaded via CDN)
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. UTILITIES & CUSTOM CURSOR
    // ==========================================
    const isMobile = () => window.innerWidth < 768 || ('ontouchstart' in window);
    const lerp = (start, end, factor) => start + (end - start) * factor;

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

        const interactiveSelectors = 'a, button, input, select, textarea, .sim-btn';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.style.width = '60px';
                ring.style.height = '60px';
                dot.style.width = '4px';
                dot.style.height = '4px';
                ring.style.borderColor = 'rgba(255,255,255,0.8)';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.width = '40px';
                ring.style.height = '40px';
                dot.style.width = '6px';
                dot.style.height = '6px';
                ring.style.borderColor = 'rgba(255,255,255,0.4)';
            });
        });
    }
    initCustomCursor();

    // ==========================================
    // 1. CINEMATIC PRELOADER
    // ==========================================
    function initPreloader() {
        const loader = document.getElementById('loader');
        const countDisplay = document.getElementById('loader-count-value');
        const utcDisplay = document.getElementById('loader-utc');
        if (!loader || !countDisplay) return;

        // UTC Time updater
        function updateUTC() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
            if(utcDisplay) utcDisplay.innerText = `UTC ${timeStr}`;
        }
        updateUTC();
        setInterval(updateUTC, 1000);

        // Counter Logic
        let count = 0;
        const duration = 2200; // 2.2 seconds loading
        const startTime = performance.now();

        function easeOutQuart(x) {
            return 1 - Math.pow(1 - x, 4);
        }

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            let progress = elapsed / duration;
            if (progress > 1) progress = 1;

            const currentCount = Math.floor(easeOutQuart(progress) * 100);
            countDisplay.innerText = currentCount.toString().padStart(2, '0');

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                // Done loading
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    // Trigger the first animations
                    setTimeout(() => {
                        document.body.classList.remove('overflow-hidden');
                        initScrollReveal();
                    }, 500);
                }, 300);
            }
        }
        requestAnimationFrame(updateCount);
    }
    document.body.classList.add('overflow-hidden'); // Lock scroll during load
    initPreloader();

    // ==========================================
    // 2. LENIS SMOOTH SCROLLING
    // ==========================================
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 3. BLUR-REVEAL OBSERVER
    // ==========================================
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.blur-text, .blur-stagger').forEach(el => observer.observe(el));
    }

    // ==========================================
    // 4. INTERACTIVE SIMULATOR CORE LOGIC
    // ==========================================
    const simulatorData = {
        cloud: {
            logs: [
                "[K8S CLUSTER] Inbound API request targeting gateway pod cluster...",
                "[TRACE] Parsing host microservice communication layer via ingress controller...",
                "[EXPLOIT VECTOR] Remote Code Execution (RCE) payload injected via deserialization.",
                "[SYS_CALL] Attempting shell breakout execution string: sys_execve('/bin/sh')...",
                "[KERNEL ENFORCEMENT] Modern eBPF cgroup socket hook intercepted threat token.",
                "[MUTATION] Destination memory pointer modified in 0.27ms. Connection rerouted.",
                "[ISOLATION] Attacker seamlessly isolated into high-fidelity ephemeral decoy runtime."
            ],
            metric: "0.27ms MUTATED",
            title: "Cloud-Native Protection"
        },
        fintech: {
            logs: [
                "[GATEWAY] Processing high-frequency clearing API payload: 2,400 TX/sec...",
                "[EXPLOIT VECTOR] High-throughput race condition targeting settlement ledger.",
                "[CRITICAL] Malicious thread attempting double-spend ledger modification.",
                "[KERNEL ENFORCEMENT] SilentMesh maps anomalous execution pattern at socket layer.",
                "[OVERHEAD CHECK] Dynamic enforcement validation: <0.8% host CPU cycle consumption.",
                "[RESOLVED] Connection isolated to dummy shadow ledger. Real TX pipeline uninterrupted."
            ],
            metric: "0.27ms PROTECTED",
            title: "Strict SLA Preservation"
        },
        enterprise: {
            logs: [
                "[HOST NETWORK] External connection sequence initiated toward persistent DB...",
                "[EXPLOIT VECTOR] Automated scanning array launching credential stuffing.",
                "[CRITICAL] Unauthorized lateral movement query signature identified.",
                "[KERNEL ENFORCEMENT] Shared BPF Ring Buffer pushing metadata to Flight Recorder.",
                "[RESOLVED] Traffic transparently encapsulated and routed to isolated cloud honeypot."
            ],
            metric: "0.27ms CONTAINED",
            title: "Zero Business Interruption"
        }
    };

    let typingTimeout = null;

    window.runCinematicSimulation = function(sectorKey) {
        // Toggle Active Button Styles
        document.querySelectorAll('.sim-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('text-slate-400', 'border-white/10');
            btn.classList.remove('text-black', 'border-white');
        });
        
        const activeBtn = document.getElementById(`btn-${sectorKey}`);
        if(activeBtn) {
            activeBtn.classList.add('active', 'text-black', 'border-white');
            activeBtn.classList.remove('text-slate-400', 'border-white/10');
        }

        const logConsole = document.getElementById('terminal-stream-output');
        const metricDisplay = document.getElementById('terminal-metric');
        const titleDisplay = document.getElementById('terminal-title');
        
        const dataset = simulatorData[sectorKey];
        if (!logConsole || !dataset) return;

        if (typingTimeout) clearTimeout(typingTimeout);
        logConsole.innerHTML = "";
        if(metricDisplay) metricDisplay.innerText = "STREAMING...";
        if(metricDisplay) metricDisplay.className = "text-slate-500 font-mono tracking-widest text-sm uppercase";
        if(titleDisplay) titleDisplay.innerText = "Analyzing Vector...";

        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex < dataset.logs.length) {
                const lineText = dataset.logs[lineIndex];
                let colorClass = "text-slate-400";
                
                if (lineText.includes("[EXPLOIT") || lineText.includes("[CRITICAL]")) colorClass = "text-red-400 font-semibold";
                if (lineText.includes("[KERNEL") || lineText.includes("[RESOLVED]") || lineText.includes("[ISOLATION]") || lineText.includes("[MUTATION]")) colorClass = "text-emerald-400 font-semibold";
                
                const lineDiv = document.createElement('div');
                lineDiv.className = `${colorClass} mb-2 opacity-0 translate-y-2 transition-all duration-300`;
                lineDiv.innerText = lineText;
                logConsole.appendChild(lineDiv);
                
                // Cinematic reveal
                setTimeout(() => {
                    lineDiv.classList.remove('opacity-0', 'translate-y-2');
                    logConsole.scrollTop = logConsole.scrollHeight;
                }, 10);

                lineIndex++;
                typingTimeout = setTimeout(typeLine, Math.random() * 200 + 150); // Variable typing speed for realism
            } else {
                if (metricDisplay) {
                    metricDisplay.innerText = dataset.metric;
                    metricDisplay.className = "text-emerald-400 font-mono tracking-widest font-bold text-sm uppercase";
                }
                if (titleDisplay) titleDisplay.innerText = dataset.title;
            }
        }
        typeLine();
    };

    // Wait for loader to finish before starting first sim
    setTimeout(() => {
        if (document.getElementById('btn-cloud')) runCinematicSimulation('cloud');
    }, 2800);
});
