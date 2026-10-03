// SilentMesh homepage, engineering-first (2026-10-03). Product before
// promise: what it is, a real console screenshot, how it works, what it never
// does, the evidence with the test behind each number, and what is not done
// yet. Brand system unchanged (corridor mark, Instrument Serif / Sans, IBM
// Plex Mono, one green signal). Every number here must match CLAIMS.md in the
// company repo, and every "never" must be true of the code on main.

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

function Shot({ src, alt, caption }) {
  return (
    <figure className="shot">
      <img src={src} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

const BENCH = [
  { name: "silentmesh", val: "95.6", w: 94.7, us: true },
  { name: "real openplc", val: "100.9", w: 100, us: false },
  { name: "conpot honeypot", val: "4.7", w: 4.7, us: false },
  { name: "software ref.", val: "0.8", w: 0.8, us: false },
];

const NEVER = [
  ["Block, drop or delay plant traffic", "The kernel program has two outcomes: pass the packet, or hand it to a decoy. There is no drop path."],
  ["Sit in the control path", "One host, one IP. It sees only traffic addressed to its own decoy ports, never traffic between an HMI and a controller."],
  ["Keep redirecting after it stops", "Exit, crash or out of memory: the kernel releases the program with the daemon's last file descriptor. Frozen: a kernel lease lapses within about 9 seconds."],
  ["Open a connection into the plant", "Decoys only answer. Nothing starts a conversation with a plant device."],
  ["Arm without a way to disarm", "If the console, which carries the kill switch, cannot start, the daemon refuses to arm."],
  ["Take over a port a real service uses", "In a redirecting mode it refuses to arm if a decoy port is already in use, and re-checks about once a minute."],
  ["Let a model decide", "Fixed rules. Every verdict lists the reasons that produced it."],
  ["Send data off site by default", "Every alert destination is off until the plant configures it."],
];

const EVIDENCE = [
  ["Fails open, however it dies", "Kill, terminate, freeze, a hung decoy, every decoy dead, the kill switch: plant traffic carries on", "Chaos tests on every code change: kernels 6.6, 6.8, 6.12, 6.16 and 7.2 under emulation, plus real hardware on one"],
  ["Never touches plant traffic", "20,000 random packets per kernel returned byte for byte; none dropped", "Property test, new random seed every run"],
  ["Costs almost nothing", "+0.5 µs median added latency; 17 to 45 ns of program time per packet", "Paired benchmark, single environment, four trials; BPF_PROG_TEST_RUN on five kernels"],
  ["Survives hostile input", "5,937 structured fuzz cases across seven decoys, zero crashes; 11 Go fuzz targets", "Decoy fuzz sweep; Go fuzzing nightly"],
  ["Alerts fast", "A write to a decoy pages within 5 s; honest traffic raises no high-priority alert", "Detection-quality test on every kernel, synthetic traffic, limit enforced in CI"],
  ["Holds up to people trying to break it", "No remote code execution, no authentication bypass, no unauthorised change to process state; two findings, both fixed", "Independent penetration test against a live deployment"],
];

const NOT_YET = [
  "No plant runs it yet. Every figure on this page comes from CI, a lab range and a penetration test; the first pilot turns them into field evidence.",
  "Decoys run as separate processes on the host but do not yet drop root privileges. That is the next hardening step.",
  "IPv4 only. IPv6 passes through untouched and is not intercepted.",
  "Response timing matches a real PLC at the median; the spread is still wider.",
  "Multi-node forwarding is verified across network namespaces on one machine, not yet across separate hosts.",
  "No third-party security audit or safety certification.",
  "Linux 6.6 or newer, as a Debian package or container image. No RPM yet.",
];

const LOG = [
  { href: "/blog/fuzzing-that-ran-nothing/", date: "2026-10-03", title: "Our Go fuzzing ran nothing, and every check was green" },
  { href: "/blog/tests-that-could-not-fail/", date: "2026-09-06", title: "We built decoy fingerprint tests that could not fail" },
];

export default function App() {
  return (
    <>
      <header>
        <div className="wrap header-inner">
          <a className="lockup" href="/">
            <Mark size={26} />
            <span className="wordmark">Silentmesh</span>
          </a>
          <nav>
            <a href="#product">Product</a>
            <a href="#how">How it works</a>
            <a href="#evidence">Evidence</a>
            <a className="m" href="/pilot/">Pilot</a>
            <a className="m" href="/security/">Security</a>
            <a href="#log">Log</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="wrap">
            <span className="kicker accent">kernel-level deception for industrial networks</span>
            <h1 className="hero-h1">Decoy controllers that catch intruders inside a plant network, built so they cannot stop the plant.</h1>
            <p className="prose lede">
              SilentMesh places decoy PLCs and a decoy Windows file share on the
              plant network. Nothing legitimate talks to them, so any contact is
              a real signal, recorded with the source, the protocol and every
              command sent. A small eBPF program in the Linux kernel hands only
              decoy-bound connections to the decoys, and if our software stops,
              the kernel lets go on its own.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="/pilot/">Pilot details</a>
              <a className="btn btn-outline" href="#evidence">Evidence</a>
            </div>
            <Shot src="/img/console_01_incident_queue.webp"
                  alt="SilentMesh console: incident queue with an incident selected, showing why it was flagged and its plant impact."
                  caption="The console: each incident with the reasons behind its verdict and its plant impact. Demo data, labelled as simulated in the product." />
          </div>
        </section>

        <section id="product">
          <div className="wrap">
            <SectionHeader index="01" label="what it is" />
            <div className="two">
              <div>
                <p className="prose">
                  Industrial protocols trust anyone who can reach them. Intruders
                  usually land on the office side, cross over, and scan for
                  controllers. The common defences carry their own risk: inline
                  blocking can stop a line on a false alarm, and agents cannot be
                  installed on most controllers.
                </p>
                <p className="prose">
                  SilentMesh adds a detector built on decoys that no one has a
                  reason to touch. It sits beside the monitoring a plant already
                  runs and feeds it alerts that passive monitoring cannot produce
                  on its own.
                </p>
              </div>
              <div className="spec">
                <div className="spec-row"><span>decoys</span><span>Modbus/TCP · S7comm · IEC 60870-5-104 · DNP3 · OPC UA · SMB, plus read-only SNMP</span></div>
                <div className="spec-row"><span>host</span><span>one Linux host per zone, kernel 6.6 or newer</span></div>
                <div className="spec-row"><span>footprint</span><span>one IP, one MAC, declared on the asset register</span></div>
                <div className="spec-row"><span>first mode</span><span>MONITOR: observes and logs, changes nothing</span></div>
                <div className="spec-row"><span>alerts</span><span>Slack · Teams · email · signed webhook · CEF syslog</span></div>
                <div className="spec-row"><span>reports</span><span>incidents mapped to ATT&amp;CK for ICS, pilot report, CSV and XLSX export</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="how">
          <div className="wrap">
            <SectionHeader index="02" label="how it works" />
<pre className="diagram-pre" aria-label="Packet path: decoy-bound traffic goes to a decoy, everything else passes, and everything passes if the daemon is gone.">{`intruder on the plant network
  │  to this host only: 502 · 102 · 2404 · 445 · 20000 · 4840
  ▼
LINUX KERNEL · TCX · eBPF PROGRAM
  decoy port on this host   →  hand to the decoy
  any other packet          →  pass, byte for byte
  daemon gone or frozen     →  pass everything
  │
  ▼
DECOYS · supervised, restarted on failure
  │  validated event pipe
  ▼
DAEMON · evidence store · verdicts with reasons
  │
  ▼
CONSOLE · alerts · CEF syslog · pilot report`}</pre>
            <p className="prose">
              Traffic between HMIs, SCADA and controllers is never addressed to
              this host, so the program never sees it. The kernel holds the
              program through a link owned by the daemon: when the daemon exits
              for any reason, the kernel releases it. A frozen daemon stops
              renewing a kernel lease, and within about 9 seconds the program
              passes everything.
            </p>
          </div>
        </section>

        <section id="never">
          <div className="wrap">
            <SectionHeader index="03" label="what it never does" />
            <div className="table">
              {NEVER.map(([never, how]) => (
                <div className="table-row" key={never}>
                  <span className="t-key">{never}</span>
                  <span className="t-val">{how}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="evidence">
          <div className="wrap">
            <SectionHeader index="04" label="evidence" />
            <p className="prose">Each figure names the test or dated measurement behind it.</p>
            <div className="table three-col">
              <div className="table-row head"><span>claim</span><span>measured</span><span>proven by</span></div>
              {EVIDENCE.map(([c, m, p]) => (
                <div className="table-row" key={c}>
                  <span className="t-key">{c}</span>
                  <span className="t-val">{m}</span>
                  <span className="t-src">{p}</span>
                </div>
              ))}
            </div>

            <h3 className="sub">Looking like the real thing</h3>
            <p className="prose">
              A timing probe is the cheapest way to unmask a fake. We sent
              identical Modbus requests to four targets and measured the median
              response in milliseconds (4 September 2026).
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
            <p className="bench-note">
              The median sits within about 5% of a real PLC. The open-source
              honeypot and a plain server answer 20 to 100 times faster, which a
              single probe exposes. Our spread is still wider than a real PLC's;
              that is the next tuning target.
            </p>

            <div className="demo-frame">
              <video className="demo-video" controls preload="metadata"
                     aria-label="SilentMesh demo: a scan reaching the decoy, and the timing probe.">
                <source src="/demo.mp4" type="video/mp4" />
                <a href="/demo.mp4">Download the demo</a>.
              </video>
            </div>

            <div className="recog">
              <ul className="recog-list">
                <li><span>VulnCon</span> presented and reviewed with OT and vulnerability researchers</li>
                <li><span>E-Yuva, BIRAC</span> finalist</li>
                <li><span>ideaTown</span> finalist</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="console">
          <div className="wrap">
            <SectionHeader index="05" label="the console" />
            <div className="two shots">
              <Shot src="/img/console_02_incident_report.webp"
                    alt="Incident report with description, timeline, decoy ports and ATT&CK for ICS techniques."
                    caption="Incident report: what happened in order, which decoys answered, the ATT&CK for ICS techniques, and what the record cannot tell you." />
              <Shot src="/img/console_04_assurance.webp"
                    alt="Assurance view: hooks attached, coverage, fail-open events, decoy failures and store size."
                    caption="Assurance: hook coverage, fail-open events and decoy failures, each figure with its limits stated." />
            </div>
          </div>
        </section>

        <section id="not-yet">
          <div className="wrap">
            <SectionHeader index="06" label="not done yet" />
            <ul className="plain-list">
              {NOT_YET.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </section>

        <section id="log">
          <div className="wrap">
            <SectionHeader index="07" label="engineering log" />
            <ul className="log-list">
              {LOG.map((p) => (
                <li key={p.href}><span className="log-date">{p.date}</span><a href={p.href}>{p.title}</a></li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pilot">
          <div className="wrap">
            <div className="panel">
              <div className="pad cta-grid">
                <div>
                  <span className="kicker accent">pilot</span>
                  <h2>30 days on one segment you choose.</h2>
                  <p className="prose">
                    Monitor-only first, then the decoys on, against pass criteria
                    agreed in writing before anything is connected. The plant can
                    unplug the host at any time and production is unaffected.
                  </p>
                  <a className="btn btn-outline" href="/pilot/">What a pilot involves</a>
                </div>
                <div className="panel raised mail-panel">
                  <span className="kicker">contact</span>
                  <a className="addr" href="mailto:founder@silentmesh.me">founder@silentmesh.me</a>
                  <span className="kicker faint">no obligation · no sales call</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="founder">
          <div className="wrap founder-block">
            <div className="founder-photo">
              <img src="/founder.jpg" alt="Mayur Agarwala, founder of SilentMesh" />
            </div>
            <div className="founder-text">
              <span className="kicker accent">founder</span>
              <p className="founder-name">Mayur Agarwala</p>
              <p className="prose founder-line">
                Builds the kernel program, the decoys and the test harness.
                Questions about how any of it works reach the person who wrote it.
              </p>
              <div className="founder-contact">
                <a href="mailto:founder@silentmesh.me">founder@silentmesh.me</a>
                <span className="sep">·</span>
                <a href="https://www.linkedin.com/in/mayur-agarwala-42603a21a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

        <section id="motto-beat">
          <Mark size={36} />
          <p className="motto">Deceive, <span className="accent">never disrupt.</span></p>
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
              <a href="/pilot/">Pilot</a>
              <a href="/security/">Security</a>
              <a href="#log">Log</a>
              <a href="https://www.linkedin.com/in/mayur-agarwala-42603a21a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
