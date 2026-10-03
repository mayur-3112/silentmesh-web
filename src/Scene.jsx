// The hero's "aha": the same minute, from both sides. Left, an intruder's
// terminal: they scan, find what looks like a PLC, read it and write to it.
// Right, the plant's console at the same moment: every step landed on a decoy
// and the write pages someone. Then "pull the plug" shows fail-open: our
// software dies, the kernel lets go, plant traffic carries on.
//
// Illustration of tested behaviour with demo addresses, labelled as such on
// the page. Motion is opacity only, per the brand; with reduced motion the
// final state shows at once. Every claim in here must match CLAIMS.md: the
// page is "within 5 s", fail-open is the kernel releasing the program.
import { useEffect, useRef, useState } from "react";

const ATTACKER = [
  { t: "$ nmap -sS -p 102,502 10.20.4.0/24", c: "cmd" },
  { t: "10.20.4.40   102/tcp open  iso-tsap", c: "out" },
  { t: "             502/tcp open  modbus", c: "out" },
  { t: "$ modbus read 10.20.4.40 hr 0-7", c: "cmd" },
  { t: "[412, 0, 1, 88, 0, 0, 3, 1500]", c: "out" },
  { t: "$ modbus write 10.20.4.40 coil 3 on", c: "cmd" },
  { t: "ok", c: "out" },
  { t: "# found the plc.", c: "note" },
];

// Which attacker step reveals each plant line.
const PLANT = [
  { at: 2, t: "10.20.4.17   scanned 2 decoy ports", tag: "recon" },
  { at: 4, t: "10.20.4.17   read registers on decoy", tag: "recon" },
  { at: 6, t: "10.20.4.17   wrote coil 3 on decoy", tag: "critical", hot: true },
  { at: 7, t: "             security on call paged, within 5 s", tag: "" },
  { at: 7, t: "             real controllers: untouched", tag: "" },
];

const PLUG = [
  "silentmesh daemon killed (SIGKILL)",
  "kernel released the program, no code of ours ran",
  "decoys offline, nothing redirected",
  "plant traffic: still flowing",
];

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
  }, []);
  return r;
}

export default function Scene() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [plug, setPlug] = useState(0);
  const done = step >= ATTACKER.length;

  useEffect(() => {
    if (reduced) { setStep(ATTACKER.length); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started || done) return;
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 850);
    return () => clearTimeout(id);
  }, [started, step, done]);

  useEffect(() => {
    if (plug === 0 || plug > PLUG.length) return;
    if (reduced) { setPlug(PLUG.length + 1); return; }
    const id = setTimeout(() => setPlug((p) => p + 1), 650);
    return () => clearTimeout(id);
  }, [plug, reduced]);

  const replay = () => { setPlug(0); setStep(0); setStarted(true); };

  return (
    <div className="scene" ref={ref}>
      <div className="pane attacker">
        <div className="pane-bar"><span>intruder</span><span className="faint">laptop on the office network</span></div>
        <div className="pane-body">
          {ATTACKER.map((l, i) => (
            <div key={i} className={"ln " + l.c + (i < step ? " on" : "")}>{l.t}</div>
          ))}
        </div>
      </div>

      <div className="pane plant">
        <div className="pane-bar"><span>your plant console</span><span className="faint">same minute</span></div>
        <div className="pane-body">
          {PLANT.map((l, i) => (
            <div key={i} className={"ln ev" + (step >= l.at ? " on" : "") + (l.hot ? " hot" : "")}>
              <span className="ev-t">{l.hot && <i className="ev-dot" aria-hidden="true">●</i>}{l.t}</span>
              {l.tag && <span className="ev-tag">{l.tag}</span>}
            </div>
          ))}
          <div className={"verdict" + (done ? " on" : "")}>
            10.20.4.40 is a decoy. They found us, not your plant.
          </div>
          {plug > 0 && (
            <div className="plug-out">
              {PLUG.map((t, i) => (
                <div key={i} className={"ln" + (i < plug ? " on" : "")}>{i === 0 ? "$ " : "  "}{t}</div>
              ))}
            </div>
          )}
          <div className={"scene-actions" + (done ? " on" : "")}>
            {plug === 0
              ? <button type="button" className="btn btn-outline small" onClick={() => setPlug(1)}>Pull the plug on SilentMesh</button>
              : <button type="button" className="btn btn-outline small" onClick={replay}>Replay</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
