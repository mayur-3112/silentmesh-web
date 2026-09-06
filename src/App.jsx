// SilentMesh homepage. Built on the locked brand system (green signal on
// near-black, Instrument Serif / Instrument Sans / IBM Plex Mono, corridor
// mark, "Deceive, never disrupt."). Kit-strict: no motion beyond the CSS
// opacity states the tokens allow. The "aha" is carried by copy + composition,
// layered public-first (a plant owner feels the stakes in five seconds) then
// technical proof deeper down. All numbers are the real measured figures.

const MARK_FULL = "M40 6H74V74H6V6H63M63 17H17V63H63V28M52 28V52H28V17";
const MARK_OUTER = "M40 6H74V74H6V6";

function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
         stroke="var(--sm-signal)" strokeWidth="2" strokeLinecap="square"
         role="img" aria-label="SilentMesh">
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

const BENCH = [
  { name: "silentmesh", val: "95.6", w: 94.7, us: true },
  { name: "real openplc", val: "100.9", w: 100, us: false },
  { name: "conpot honeypot", val: "4.7", w: 4.7, us: false },
  { name: "software ref.", val: "0.8", w: 0.8, us: false },
];

const STATS = [
  { n: "1,815", l: "fuzz cases across 4 decoys · 0 crashes" },
  { n: "218", l: "automated tests incl. subtests · race-clean" },
  { n: "~300", l: "lines of c — small enough to audit line by line" },
  { n: "+0.5µs", l: "median added latency · single env., 4 trials" },
];

export default function App() {
  return (
    <>
      <div className="bg-watermark" aria-hidden="true"><Mark size={640} /></div>
      <header>
        <div className="wrap header-inner">
          <div className="lockup">
            <Mark size={28} />
            <span className="wordmark">Silentmesh</span>
          </div>
          <nav>
            <a href="#stakes">Why</a>
            <a href="#principle">How</a>
            <a href="#proof">Proof</a>
            <a href="#vision">Vision</a>
            <a href="#pilot">Pilot</a>
            <a href="/blog/tests-that-could-not-fail/">Log</a>
          </nav>
          <span className="badge">● decoys armed</span>
        </div>
      </header>

      <main>
        {/* HERO — public-first, no jargon. The one idea, plainly. */}
        <section className="hero-section">
          <div className="wrap hero-grid">
            <div className="hero">
              <span className="kicker accent">kernel-level cyber deception</span>
              <h1>Give the attacker a plant that isn't there.</h1>
              <p className="prose lede">
                SilentMesh shows an intruder a convincing fake of your machinery
                and quietly records every move they make. Your real equipment is
                never touched, never slowed, and never at risk of being shut down.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary" href="#pilot">Run a pilot</a>
                <a className="btn btn-outline" href="#proof">See the proof</a>
              </div>
            </div>

            <div className="panel">
              <div className="pad">
                <div className="kicker panel-title">
                  <span>what the attacker sees</span><span className="accent">● live</span>
                </div>
                <svg className="diagram" viewBox="0 0 380 236" width="100%" role="img"
                     aria-label="An attacker's scan reaches a decoy controller; the real controller sits on a private branch and is never touched.">
                  <line x1="26" y1="48" x2="330" y2="48" stroke="var(--border-hair)" strokeWidth="1.4" />
                  <text x="26" y="38" fontSize="9.5">attacker scan</text>
                  <circle cx="26" cy="48" r="3.5" fill="var(--text-tertiary)" />

                  <path d="M 26 48 H 150 Q 168 48 168 66 V 112 Q 168 130 186 130 H 296"
                        fill="none" stroke="var(--sm-signal)" strokeWidth="1.4" opacity="0.5" />
                  <circle cx="296" cy="130" r="3" fill="var(--sm-signal)" />
                  <rect x="296" y="114" width="64" height="32" rx="1" className="node-box node-decoy" />
                  <text x="328" y="127" textAnchor="middle" fontSize="9" className="strong">decoy</text>
                  <text x="328" y="139" textAnchor="middle" fontSize="8">controller</text>

                  <path d="M 26 48 V 188 H 296" fill="none" stroke="var(--border-hair)"
                        strokeWidth="1.2" strokeDasharray="2 4" />
                  <rect x="296" y="172" width="64" height="32" rx="1" className="node-box node-real" />
                  <text x="328" y="185" textAnchor="middle" fontSize="9">real plc</text>
                  <text x="328" y="197" textAnchor="middle" fontSize="8">untouched</text>

                  <text x="26" y="220" fontSize="9">0 packets reach the real</text>
                  <text x="26" y="232" fontSize="9">controller. ever.</text>
                </svg>
              </div>
              <div className="foot">decoy engaged · real device zero-touch</div>
            </div>
          </div>
        </section>

        {/* STAKES — the emotional aha for anyone, technical or not. */}
        <section id="stakes" className="stakes-section">
          <div className="wrap">
            <p className="stakes-line">
              A factory is built brick by brick, over years.
              <br /><span className="accent">An attacker can undo it in a single afternoon.</span>
            </p>
            <p className="prose stakes-prose">
              Plants run on controllers that were never designed to be online, and
              the tools sold to protect them were built for office computers — they
              add delay, they block real signals, and a plant owner's worst fear is
              that the security tool is what stops the line. SilentMesh is built the
              other way around: it protects by deceiving, and it can never be the
              reason production halts.
            </p>
          </div>
        </section>

        {/* PRINCIPLE — three rules, plain-language headings, technical detail under. */}
        <section id="principle">
          <div className="wrap">
            <SectionHeader index="01" label="the three rules that never bend" />
            <div className="three">
              <div>
                <span className="kicker accent">rule 1</span>
                <h3>Invisible</h3>
                <p>It runs below the operating system, in the kernel, adding steady
                  and predictable overhead. OT control loops are tuned around
                  timing that does not surprise them.</p>
              </div>
              <div>
                <span className="kicker accent">rule 2</span>
                <h3>Deception, never disruption</h3>
                <p>No blocking, no dropped packets, ever, on the production path.
                  It is built to look like a target — not to police the network.</p>
              </div>
              <div>
                <span className="kicker accent">rule 3</span>
                <h3>Absolute operator trust</h3>
                <p>If it ever fails, it fails open and vanishes. The kernel detaches
                  the hook on its own — no code of ours has to run for the plant to
                  keep running.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROOF — this is where the technical audience gets the real numbers. */}
        <section id="proof">
          <div className="wrap">
            <SectionHeader index="02" label="measured against a real plc" />
            <p className="prose">
              A timing probe is the cheapest way to unmask a fake. Here is what
              that looks like end to end:
            </p>

            <div className="demo-frame">
              <video
                className="demo-video"
                controls
                preload="metadata"
                aria-label="SilentMesh demo: an attacker's scan reaching the decoy, and the timing probe that unmasks a fake."
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support embedded video —
                <a href="/demo.mp4">download the demo</a> instead.
              </video>
            </div>

            <p className="prose demo-note">
              Then the numbers behind it. We sent identical industrial-protocol
              requests to four targets — SilentMesh, a real OpenPLC controller,
              the standard open-source honeypot, and a plain software server —
              and measured how long each took to answer. A real controller is
              slow in a very particular way. Median response, in milliseconds:
            </p>

            <div className="bench">
              {BENCH.map((b) => (
                <div className="bench-row" key={b.name}>
                  <span className={"bench-name" + (b.us ? " us" : "")}>{b.name}</span>
                  <div className="bench-track">
                    <div className={"bench-fill" + (b.us ? " us" : "")}
                         style={{ width: b.w + "%" }} />
                  </div>
                  <span className={"bench-val" + (b.us ? " us" : "")}>{b.val}</span>
                </div>
              ))}
            </div>
            <p className="bench-note">
              SilentMesh lands within 5% of a real PLC's scan cycle. The honeypot
              and the bare software server are 20–100× faster — a single timing
              probe unmasks either of them in one pass. SilentMesh does not.
              {" "}<a className="bench-link" href="/blog/tests-that-could-not-fail/">
                How we test that our timing tests can actually fail →
              </a>
            </p>

            <div className="stat-row">
              {STATS.map((s) => (
                <div className="stat" key={s.l}>
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALIDATED */}
        <section id="validated">
          <div className="wrap">
            <SectionHeader index="03" label="tested by people trying to break it" />
            <div className="valid-item">
              <span className="valid-mark">01</span>
              <div>
                <h4>Independent penetration test</h4>
                <p>Against a live deployment, under written rules of engagement —
                  no remote code execution, no authentication bypass, no
                  unauthorised change to process state. Two genuine findings, both
                  fixed within the engagement.</p>
              </div>
            </div>
            <div className="valid-item">
              <span className="valid-mark">02</span>
              <div>
                <h4>An eight-week external adversarial program</h4>
                <p>A black-box research cohort probing a live, isolated range for
                  the three failure modes that matter: fingerprinting the decoy,
                  slipping past the kernel hook, and forcing a shutdown they were
                  not authorised to trigger.</p>
              </div>
            </div>
            <div className="valid-item">
              <span className="valid-mark">03</span>
              <div>
                <h4>Findings get shipped, not filed</h4>
                <p>Every confirmed finding so far — a dashboard identity leak, a
                  repeated device fingerprint, a logging bottleneck — has already
                  landed as a fix.</p>
              </div>
            </div>
          </div>
        </section>

        {/* VISION — where this is going. Aspirational, but on-voice: no hype. */}
        <section id="vision">
          <div className="wrap">
            <SectionHeader index="04" label="the company we're building" />
            <p className="vision-line">
              The floor and the office were never
              <br />two networks. <span className="accent">Attackers already know that.</span>
            </p>
            <p className="prose vision-prose">
              A ransomware crew doesn't need to speak Modbus to shut down a
              line — a phished laptop on the office network, one hop to an
              engineering workstation, and they're inside the same segment as
              the PLC. Most plants defend the OT side and the IT side with two
              different teams and two different tools, and the seam between
              them is where nearly every real incident starts. SilentMesh
              exists to cover that seam: kernel-level deception that speaks
              both worlds — industrial protocols like Modbus, S7comm and
              IEC-104 on one side, Windows lateral movement and SMB on the
              other — so an attacker can't find a safe side to land on.
            </p>
            <div className="goals">
              <div className="goal">
                <span className="kicker accent">where we're headed</span>
                <p>Make kernel-level deception the default first layer across
                  the whole plant network — controllers and engineering
                  workstations alike, not a specialist add-on to either.</p>
              </div>
              <div className="goal">
                <span className="kicker accent">how we get there</span>
                <p>Earn operator trust the hard way — shadow mode first,
                  verifiable safety, one-command rollback — before anything ever
                  runs active.</p>
              </div>
              <div className="goal">
                <span className="kicker accent">what we add</span>
                <p>Feed the monitoring tools a plant already runs with
                  higher-fidelity signal than any off-the-shelf honeypot can,
                  on both the OT and IT side of the same network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER — a quiet signature, not a numbered section. */}
        <section id="founder">
          <div className="wrap founder-block">
            <div className="founder-photo">
              <img src="/founder.jpg" alt="Mayur Agarwala, founder of SilentMesh" />
            </div>
            <div className="founder-text">
              <span className="kicker accent">who's behind this</span>
              <p className="founder-name">Mayur Agarwala</p>
              <p className="prose founder-line">
                Founder of SilentMesh. Building kernel-level deception for the
                seam between plant floor and office network — the path most
                real intrusions actually take.
              </p>
              <div className="founder-contact">
                <a href="mailto:founder@silentmesh.me">founder@silentmesh.me</a>
                <span className="sep">·</span>
                <a href="https://www.linkedin.com/in/mayur-agarwala-42603a21a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

        {/* PILOT */}
        <section id="pilot">
          <div className="wrap">
            <div className="panel">
              <div className="pad cta-grid">
                <div>
                  <span className="kicker accent">05 — the ask</span>
                  <h2>Run it on a real floor. At no cost. With no disruption.</h2>
                  <p className="prose">
                    SilentMesh is opening a small first group of pilots with plants
                    running industrial controllers or a Windows engineering
                    workstation — which is nearly all of them.
                  </p>
                  <div className="cta-list">
                    <span className="terminal-line"><span className="dot">●</span> no cost to run the pilot</span>
                    <span className="terminal-line"><span className="dot">●</span> no disruption — fail-open by design</span>
                    <span className="terminal-line"><span className="dot">●</span> works alongside what you already run</span>
                    <span className="terminal-line"><span className="dot">●</span> you define what success looks like</span>
                  </div>
                </div>
                <div className="panel raised mail-panel">
                  <div className="mail-watermark"><Mark size={180} /></div>
                  <span className="kicker">start a conversation</span>
                  <a className="addr" href="mailto:pilots@silentmesh.me">pilots@silentmesh.me</a>
                  <span className="kicker faint">no obligation · no sales call</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOTTO BEAT — the pause. Nothing else in view. */}
        <section id="motto-beat">
          <Mark size={44} />
          <p className="motto">Deceive,<br /><span className="accent">never disrupt.</span></p>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <div className="lockup">
              <Mark size={18} />
              <span className="wordmark foot-word">Silentmesh</span>
            </div>
            <nav className="foot-nav">
              <a href="#stakes">Why</a>
              <a href="#principle">How</a>
              <a href="#proof">Proof</a>
              <a href="#vision">Vision</a>
              <a href="#pilot">Pilot</a>
            </nav>
          </div>
          <div className="foot-bottom">
            <span className="terminal-line">industrial control protocols · it lateral movement · spoken natively</span>
            <span className="kicker faint">© 2026 SilentMesh Systems</span>
          </div>
        </div>
      </footer>
    </>
  );
}
