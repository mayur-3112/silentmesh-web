import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
// Fallback for Lenis in case it's loaded via CDN in index.html instead of module
import LenisModule from '@studio-freight/lenis'

export default function SilentMeshRuntimeExperience() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll()

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08])

  useEffect(() => {
    // Robust Lenis initialization (handles module or window global)
    const LenisClass = typeof LenisModule === 'function' ? LenisModule : window.Lenis;
    if (!LenisClass) return;

    const lenis = new LenisClass({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const gsapCore = window.gsap || gsap;

    if (gsapCore) {
      const ctx = gsapCore.context(() => {
        gsapCore.to('.runtime-orb', {
          y: -30,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        gsapCore.to('.signal-path', {
          strokeDashoffset: -300,
          duration: 6,
          repeat: -1,
          ease: 'none',
        })

        gsapCore.to('.ambient-grid', {
          backgroundPosition: '200px 200px',
          duration: 30,
          repeat: -1,
          ease: 'none',
        })
      })

      return () => {
        ctx.revert()
        lenis.destroy()
      }
    } else {
      return () => lenis.destroy()
    }
  }, [])

  return (
    <div className="relative overflow-hidden bg-[#05070b] text-white selection:bg-[#00c9a7] selection:text-black">
      <AmbientEnvironment />
      <CustomCursor />

      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <RuntimeTopologyBackground />

        <div className="relative z-20 mx-auto max-w-7xl px-8 w-full mt-20">
          <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm tracking-[0.2em] text-white/60 backdrop-blur-xl"
              >
                RUNTIME VISIBILITY PLATFORM
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.1 }}
                className="max-w-5xl text-[4rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[6rem] font-black leading-[0.92] tracking-[-0.05em]"
              >
                Controlled
                <span className="block bg-gradient-to-r from-[#00c9a7] via-cyan-300 to-white bg-clip-text text-transparent pb-2">
                  runtime orchestration
                </span>
                for operational trust.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="mt-10 max-w-2xl text-xl leading-relaxed text-white/55"
              >
                Linux-native telemetry and reversible mitigation workflows
                designed for modern production environments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.45 }}
                className="mt-14 flex flex-wrap gap-5"
              >
                <button className="group relative overflow-hidden rounded-2xl bg-[#00c9a7] px-8 py-5 text-lg font-semibold text-black transition duration-500 hover:scale-[1.03] hover:shadow-[0_0_80px_rgba(0,201,167,0.4)]">
                  <span className="relative z-10">Request Early Access</span>
                  <div className="absolute inset-0 translate-y-full bg-white/20 transition duration-500 group-hover:translate-y-0" />
                </button>

                <button className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5 text-lg text-white/70 backdrop-blur-xl transition duration-500 hover:border-[#00c9a7]/40 hover:bg-white/[0.06] hover:text-white">
                  Read Architecture
                </button>
              </motion.div>
            </div>

            <RuntimeOrbitalCore />
          </div>
        </div>
      </motion.section>

      <ProgressiveTrustSection />
      <RuntimeWorkflowSection />
      <OperationalSafetySection />
      <FooterSection />
    </div>
  )
}

function AmbientEnvironment() {
  return (
    <>
      <div className="ambient-grid pointer-events-none fixed inset-0 opacity-[0.06]" style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '120px 120px',
      }} />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,201,167,0.14),transparent_45%)]" />

      <div className="pointer-events-none fixed bottom-[-300px] left-1/2 h-[900px] w-[1200px] -translate-x-1/2 rounded-full bg-[#00c9a7]/10 blur-[180px]" />
    </>
  )
}

function RuntimeTopologyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1200" fill="none">
        <defs>
          <linearGradient id="signalGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00c9a7" stopOpacity="0" />
            <stop offset="50%" stopColor="#00c9a7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00c9a7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={`path-${i}`}
            className="signal-path"
            d={`M ${80 + i * 80} ${120 + i * 30} C ${500 + i * 40} ${300 - i * 20}, ${900 + i * 20} ${700 + i * 20}, ${1500 - i * 30} ${400 + i * 10}`}
            stroke="url(#signalGradient)"
            strokeWidth="1.5"
            strokeDasharray="12 18"
            opacity="0.4"
          />
        ))}

        {Array.from({ length: 50 }).map((_, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={100 + (i % 10) * 150}
              cy={100 + Math.floor(i / 10) * 180}
              r="2"
              fill="#00c9a7"
              opacity="0.8"
            />
            <circle
              className="runtime-orb"
              cx={100 + (i % 10) * 150}
              cy={100 + Math.floor(i / 10) * 180}
              r="20"
              fill="#00c9a7"
              opacity="0.06"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

function RuntimeOrbitalCore() {
  return (
    <div className="relative flex items-center justify-center scale-[0.6] md:scale-[0.8] lg:scale-100 mt-10 lg:mt-0">
      <div className="absolute h-[650px] w-[650px] rounded-full border border-[#00c9a7]/10" />
      <div className="absolute h-[480px] w-[480px] rounded-full border border-[#00c9a7]/10" />

      <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-3xl">
        <div className="absolute h-[220px] w-[220px] rounded-full border border-[#00c9a7]/20" />

        <div className="absolute h-[120px] w-[120px] rounded-full bg-[#00c9a7]/20 blur-[50px]" />

        <div className="relative z-10 text-center">
          <p className="mb-3 text-sm tracking-[0.3em] text-white/50">
            PROGRESSIVE TRUST
          </p>

          <h3 className="text-5xl font-black tracking-[-0.05em] text-[#00c9a7]">
            01
          </h3>
        </div>
      </div>
    </div>
  )
}

function ProgressiveTrustSection() {
  const stages = [
    'Observe',
    'Evaluate',
    'Simulate',
    'Mitigate',
    'Rollback',
  ]

  return (
    <section className="relative z-10 py-40">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-24 max-w-4xl">
          <p className="mb-5 text-sm tracking-[0.35em] text-[#00c9a7]">
            PROGRESSIVE TRUST
          </p>

          <h2 className="text-[3rem] md:text-6xl lg:text-[5rem] xl:text-8xl font-black leading-[0.95] tracking-[-0.05em]">
            Runtime states evolve through controlled orchestration.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl"
            >
              <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(0,201,167,0.25),transparent_70%)]" />

              <div className="relative z-10">
                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00c9a7]/20 bg-[#00c9a7]/10 text-[#00c9a7]">
                  0{i + 1}
                </div>

                <h3 className="mb-5 text-3xl font-bold tracking-[-0.04em]">
                  {stage}
                </h3>

                <p className="leading-relaxed text-white/55">
                  Controlled runtime orchestration with observable response
                  boundaries and progressive operational trust.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RuntimeWorkflowSection() {
  return (
    <section className="relative py-52">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-20 max-w-5xl">
          <p className="mb-5 text-sm tracking-[0.35em] text-[#00c9a7]">
            RUNTIME ORCHESTRATION CANVAS
          </p>

          <h2 className="text-[3rem] md:text-6xl lg:text-[5rem] xl:text-8xl font-black leading-[0.95] tracking-[-0.05em]">
            Controlled mitigation visualized as living infrastructure flow.
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.03] p-8 md:p-16 backdrop-blur-3xl min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,201,167,0.12),transparent_60%)]" />

          <svg className="relative z-10 h-[500px] md:h-[700px] w-full" viewBox="0 0 1400 700" fill="none" preserveAspectRatio="xMidYMid meet">
            <path
              d="M120 340 C 300 180, 520 520, 720 340 S 1100 180, 1280 340"
              stroke="#00c9a7"
              strokeOpacity="0.25"
              strokeWidth="2"
              strokeDasharray="12 20"
            />

            {[
              ['Observe', 120, 340],
              ['Evaluate', 380, 240],
              ['Simulate', 700, 340],
              ['Mitigate', 1020, 240],
              ['Rollback', 1280, 340],
            ].map(([label, x, y]) => (
              <g key={label}>
                <circle cx={x} cy={y} r="70" fill="#00c9a7" opacity="0.08" />
                <circle cx={x} cy={y} r="24" fill="#00c9a7" />
                <text
                  x={x}
                  y={y + 100}
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                  opacity="0.9"
                  fontFamily="system-ui, sans-serif"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}

function OperationalSafetySection() {
  return (
    <section className="relative py-40">
      <div className="mx-auto grid max-w-7xl gap-20 px-8 lg:grid-cols-2">
        <div>
          <p className="mb-5 text-sm tracking-[0.35em] text-[#00c9a7]">
            OPERATIONAL SAFETY
          </p>

          <h2 className="text-[3rem] md:text-5xl lg:text-6xl xl:text-[5rem] font-black leading-[0.95] tracking-[-0.05em]">
            Reversible runtime response by design.
          </h2>
        </div>

        <div className="space-y-8">
          {[
            'Shadow-mode evaluation before enforcement',
            'Scoped containment instead of global blocking',
            'Rollback-aware mitigation workflows',
            'Observable runtime decision boundaries',
          ].map((item) => (
            <div
              key={item}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-xl text-white/70 backdrop-blur-2xl"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-between px-8 gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold tracking-[-0.04em]">
            SilentMesh
          </h3>
          <p className="mt-2 text-white/50">
            Runtime visibility and controlled mitigation.
          </p>
        </div>

        <button className="rounded-2xl bg-[#00c9a7] px-8 py-4 font-semibold text-black transition hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(0,201,167,0.4)]">
          Request Early Access
        </button>
      </div>
    </footer>
  )
}

function CustomCursor() {
  useEffect(() => {
    // Only initialize on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div')
    const gsapCore = window.gsap || gsap;

    cursor.style.position = 'fixed'
    cursor.style.width = '18px'
    cursor.style.height = '18px'
    cursor.style.borderRadius = '9999px'
    cursor.style.background = 'rgba(0,201,167,0.7)'
    cursor.style.pointerEvents = 'none'
    cursor.style.zIndex = '9999'
    cursor.style.mixBlendMode = 'screen'
    cursor.style.backdropFilter = 'blur(10px)'

    document.body.appendChild(cursor)

    const move = (e) => {
      if (gsapCore) {
        gsapCore.to(cursor, {
          x: e.clientX - 9,
          y: e.clientY - 9,
          duration: 0.25,
          ease: 'power3.out',
        })
      } else {
        cursor.style.transform = `translate(${e.clientX - 9}px, ${e.clientY - 9}px)`
      }
    }

    window.addEventListener('mousemove', move)

    return () => {
      window.removeEventListener('mousemove', move)
      if(document.body.contains(cursor)) {
        cursor.remove()
      }
    }
  }, [])

  return null
}

const rootElement = document.getElementById('root')
if (rootElement && !rootElement.hasChildNodes()) {
  const root = createRoot(rootElement)
  root.render(<SilentMeshRuntimeExperience />)
}
