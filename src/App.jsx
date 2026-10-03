// SilentMesh homepage, overhaul of 2026-10-03. Six sections around one strong
// hero: the console, framed large, with the corridor mark as a still, faint
// watermark behind the page. Detail lives on /pilot/ and /security/; the
// engineering log has its own index at /blog/. Brand system unchanged (corridor
// mark, Instrument Serif / Sans, IBM Plex Mono, one green signal, no shadows,
// no gradients, no motion beyond opacity). Every number must match CLAIMS.md in
// the company repo, and every "never" must be true of the code on main.

import Scene from "./Scene.jsx";

const MARK_FULL = "M40 6H74V74H6V6H63M63 17H17V63H63V28M52 28V52H28V17";
const MARK_OUTER = "M40 6H74V74H6V6";

function Mark({ size = 30, label = "SilentMesh" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
         stroke="var(--sm-signal)" strokeWidth="2" strokeLinecap="square"
         role={label ? "img" : undefined} aria-label={label || undefined}
         aria-hidden={label ? undefined : "true"}>
      <path d={MARK_FULL} opacity="0.55" />
      <path d={MARK_OUTER} opacity="0.9" />
      <rect x="36" y="36" width="8" height="8" fill="var(--sm-signal)" stroke="none" />
    </svg>
  );
}

function SectionHeader({ index, label }) {
  return (
    <div className="section-header">
      <span className="idx">{index}</span>
      <span className="lbl">{label}</span>
      <span className="rule" />
    </div>
  );
}

const STRENGTHS = [
  { n: "0", l: "plant packets dropped, 20,000 random packets per kernel, every run" },
  { n: "5", l: "Linux kernels, 6.6 to 7.2, in the fail-open suite on every change" },
  { n: "0", l: "crashes in 5,937 structured fuzz cases across seven decoys" },
  { n: "101.3 ms", l: "Modbus decoy median, against 100.9 ms on a real PLC" },
];

const HOW = [
  { k: "the kernel", h: "The kernel is the safety switch",
    p: "A small eBPF program hands decoy-bound connections to the decoys and passes everything else byte for byte. It lives only as long as our daemon's kernel link; a lease covers the frozen case. If our software dies, the kernel undoes it." },
  { k: "the decoys", h: "Decoys timed like the real thing",
    p: "Modbus, S7comm, IEC 60870-5-104, DNP3, OPC UA and a Windows file share. Most decoys answer instantly, which one timing probe exposes. Ours answer in a real controller's scan-cycle band." },
  { k: "the record", h: "Evidence a plant can act on",
    p: "Every contact is recorded with source, protocol and commands, grouped into incidents with the reasons behind each verdict, mapped to ATT&CK for ICS, and sent to the tools the plant already runs." },
];

const NEVER = [
  ["Blocks or drops", "Two outcomes only: pass, or hand to a decoy."],
  ["Sits inline", "One host, one IP, beside the network, not in it."],
  ["Outlives its daemon", "Exit, crash or freeze: the kernel lets go."],
  ["Starts a conversation", "Decoys only answer. Nothing connects out."],
  ["Arms without a kill switch", "No console, no arming."],
  ["Hands a decoy the host", "Decoys run unprivileged, with no capabilities."],
  ["Lets a model decide", "Fixed rules, with the reasons shown."],
  ["Sends data off site", "Every destination is off until configured."],
];

const BENCH = [
  { name: "silentmesh", val: "101.3", w: 100, us: true },
  { name: "real openplc", val: "100.9", w: 99.6, us: false },
  { name: "conpot honeypot", val: "4.7", w: 4.6, us: false },
  { name: "software ref.", val: "0.8", w: 0.8, us: false },
];

const FIGURES = [
  ["+0.5 µs", "median added latency", "paired benchmark, single environment, four trials"],
  ["17 to 45 ns", "program time per packet", "BPF_PROG_TEST_RUN, five kernels"],
  ["5 s", "from a decoy write to a page", "detection-quality test on every kernel"],
  ["2 of 2", "pentest findings fixed in the engagement", "independent black-box test, July 2026"],
];

const RETRACTED = [
  ["0.52 ms interception, ±2 ns jitter, under 4.2 MB memory", "retracted 9 August 2026 after our own audit: could not be verified"],
  ["95.6 ms Modbus median", "superseded 3 October 2026: it was mostly a database write, and a safety change had quietly made the decoy answer in 24 ms"],
  ["55 ms decoy round trip", "superseded 4 September 2026 by a measurement beside a real PLC"],
  ["kernel 5.15 or newer", "corrected: the floor is 6.6, where TCX exists"],
];

const POSTS = [
  { href: "/blog/faster-when-we-made-it-safer/", date: "3 October 2026", title: "Our decoy got faster when we made it safer",
    ex: "Our published PLC-like timing was mostly a database write. A security fix removed the write, and the decoy quietly started answering four times faster than a real PLC." },
  { href: "/blog/fuzzing-that-ran-nothing/", date: "3 October 2026", title: "Our Go fuzzing ran nothing, and every check was green",
    ex: "For three days the fuzz step passed in 0.6 seconds having fuzzed nothing. A failing command inside a shell for-list is not caught by set -e." },
];

const LINKEDIN = "https://www.linkedin.com/in/mayur-agarwala-42603a21a/";

export default function App() {
  return (
    <>
      <div className="watermark" aria-hidden="true"><Mark size={760} label="" /></div>

      <header>
        <div className="wrap header-inner">
          <a className="lockup" href="/">
            <Mark size={26} />
            <span className="wordmark">Silentmesh</span>
          </a>
          <nav>
            <a href="#how">How it works</a>
            <a href="#evidence">Evidence</a>
            <a className="m" href="/blog/">Blog</a>
            <a className="m" href="/security/">Security</a>
            <a className="m nav-cta" href="/pilot/">Pilot</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <span className="kicker accent">kernel-level deception for industrial networks</span>
            <h1>They think they found your PLC.<br /><span className="h1-quiet">You know they are here.</span></h1>
            <p className="lede">
              Decoy controllers that nothing legitimate ever touches, so any
              contact is a real signal. Watch the same minute from both sides.
            </p>

            <Scene />
            <p className="scene-note">Illustration of tested behaviour with demo addresses. The page time and fail-open are measured on every code change; see <a className="inline" href="#evidence">evidence</a>.</p>

            <div className="hero-ctas">
              <a className="btn btn-primary" href="/pilot/">Run a pilot</a>
              <a className="btn btn-outline" href="#how">How it works</a>
            </div>

            <div className="strengths">
              {STRENGTHS.map((x) => (
                <div className="strength" key={x.l}>
                  <div className="n">{x.n}</div>
                  <div className="l">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how">
          <div className="wrap">
            <SectionHeader index="01" label="how it works" />
            <h2 className="section-title">Three parts. Each one built to be checked.</h2>
            <figure className="console">
              <div className="console-bar">
                <span className="dots"><i /><i /><i /></span>
                <span>silentmesh console · incident queue</span>
                <span className="faint">demo data</span>
              </div>
              <img src="/img/console_01_incident_queue.webp" loading="lazy"
                   alt="SilentMesh console: incident queue with an incident selected, showing why it was flagged and its plant impact." />
            </figure>
            <div className="cards three">
              {HOW.map((c, i) => (
                <article className="card" key={c.k}>
                  <span className="card-k">{String(i + 1).padStart(2, "0")} · {c.k}</span>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </article>
              ))}
            </div>
            <div className="shots">
              <figure>
                <img src="/img/console_02_incident_report.webp" loading="lazy"
                     alt="Incident report with timeline, decoy ports and ATT&CK for ICS techniques." />
                <figcaption>Incident report: what happened, in order, and what the record cannot tell you.</figcaption>
              </figure>
              <figure>
                <img src="/img/console_04_assurance.webp" loading="lazy"
                     alt="Assurance view: hooks attached, coverage, fail-open events and decoy failures." />
                <figcaption>Assurance: hook coverage, fail-open events and decoy failures, with their limits stated.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="never">
          <div className="wrap">
            <SectionHeader index="02" label="what it never does" />
            <h2 className="section-title">The list a plant manager reads first.</h2>
            <div className="never-grid">
              {NEVER.map(([h, p]) => (
                <div className="never" key={h}>
                  <span className="never-k">never</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="evidence">
          <div className="wrap">
            <SectionHeader index="03" label="evidence" />
            <h2 className="section-title">Measured beside a real PLC.</h2>
            <div className="evidence">
              <div>
                <p className="body">
                  A timing probe is the cheapest way to unmask a fake. Identical
                  Modbus requests to four targets; median response in
                  milliseconds. Decoy measured 3 October 2026, the others
                  4 September 2026, same harness.
                </p>
                <div className="bench">
                  {BENCH.map((b) => (
                    <div className="bench-row" key={b.name}>
                      <span className={"bench-name" + (b.us ? " us" : "")}>{b.name}</span>
                      <div className="bench-track">
                        <div className={"bench-fill" + (b.us ? " us" : "")} style={{ width: b.w + "%" }} />
                      </div>
                      <span className={"bench-val" + (b.us ? " us" : "")}>{b.val}</span>
                    </div>
                  ))}
                </div>
                <p className="note">
                  The honeypot and a plain server answer 21 and 126 times faster.
                  Spread: 3.0 ms interquartile range against the real PLC's
                  1.8 ms, down from 32.3 ms. A side-by-side rerun is next.{" "}
                  <a className="inline" href="/blog/faster-when-we-made-it-safer/">What went wrong →</a>
                </p>
              </div>
              <div className="figures">
                {FIGURES.map(([n, l, s]) => (
                  <div className="figure" key={l}>
                    <div className="n">{n}</div>
                    <div className="l">{l}</div>
                    <div className="s">{s}</div>
                  </div>
                ))}
                <a className="more" href="/security/">Every guarantee and the test behind it →</a>
              </div>
            </div>
            <div className="demo-frame">
              <video className="demo-video" controls preload="metadata"
                     aria-label="SilentMesh demo: a scan reaching the decoy, and the timing probe.">
                <source src="/demo.mp4" type="video/mp4" />
                <a href="/demo.mp4">Download the demo</a>.
              </video>
            </div>
            <ul className="recog">
              <li><span>VulnCon</span> presented and reviewed with OT and vulnerability researchers</li>
              <li><span>E-Yuva, BIRAC</span> finalist</li>
              <li><span>ideaTown</span> finalist</li>
            </ul>
          </div>
        </section>

        <section id="challenge">
          <div className="wrap">
            <SectionHeader index="04" label="challenge it" />
            <div className="challenge">
              <div>
                <h2 className="section-title">Break it, and we will say so.</h2>
                <p className="body">
                  The product rests on three claims: an attacker cannot tell a
                  decoy from a real controller, cannot get past the kernel hook to
                  a real device, and cannot switch it off without authorisation.
                  Eight researchers, working black-box with no source, are
                  attacking exactly those claims on an isolated range for eight
                  weeks.
                </p>
                <p className="body">
                  Found a way? Write to <a className="inline" href="mailto:founder@silentmesh.me">founder@silentmesh.me</a>.
                  Confirmed findings are credited, fixed and written up on the
                  blog, including the embarrassing ones.
                </p>
              </div>
              <div className="retracted">
                <span className="kicker">numbers we have taken back</span>
                {RETRACTED.map(([n, why]) => (
                  <div className="retract" key={n}>
                    <s>{n}</s>
                    <span>{why}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="blog">
          <div className="wrap">
            <SectionHeader index="05" label="from the blog" />
            <div className="blog-head">
              <h2 className="section-title">What we got wrong, and what we changed.</h2>
              <a className="more" href="/blog/">All posts →</a>
            </div>
            <div className="cards two">
              {POSTS.map((p) => (
                <a className="card post" href={p.href} key={p.href}>
                  <span className="card-k">{p.date}</span>
                  <h3>{p.title}</h3>
                  <p>{p.ex}</p>
                  <span className="read">Read →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="pilot">
          <div className="wrap">
            <SectionHeader index="06" label="pilot" />
            <div className="pilot">
              <div>
                <h2 className="section-title">30 days on one segment you choose.</h2>
                <ol className="steps">
                  <li><span>01</span>Two weeks in MONITOR: it observes and changes nothing.</li>
                  <li><span>02</span>30 days with the decoys on, against pass criteria agreed in writing first.</li>
                  <li><span>03</span>A pilot report and a review. Unplug the host at any time.</li>
                </ol>
                <div className="hero-ctas">
                  <a className="btn btn-primary" href="/pilot/">What a pilot involves</a>
                  <a className="btn btn-outline" href="mailto:founder@silentmesh.me">founder@silentmesh.me</a>
                </div>
              </div>
              <div className="founder">
                <img src="/founder.jpg" alt="Mayur Agarwala, founder of SilentMesh" />
                <div>
                  <span className="kicker accent">founder</span>
                  <p className="founder-name">Mayur Agarwala</p>
                  <p className="body">
                    Builds the kernel program, the decoys and the test harness.
                    Questions about how any of it works reach the person who
                    wrote it.
                  </p>
                  <a className="inline mono" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn →</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="motto-beat">
          <Mark size={40} />
          <p className="motto">Deceive, <span className="accent">never disrupt.</span></p>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <a className="lockup" href="/">
              <Mark size={18} />
              <span className="wordmark foot-word">Silentmesh</span>
            </a>
            <nav className="foot-nav">
              <a href="/pilot/">Pilot</a>
              <a href="/security/">Security</a>
              <a href="/blog/">Blog</a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
          </div>
          <div className="foot-bottom">
            <span className="terminal-line">SilentMesh Systems · Bengaluru, India · built for industrial networks worldwide</span>
            <span className="kicker faint">© 2026 SilentMesh Systems</span>
          </div>
        </div>
      </footer>
    </>
  );
}
