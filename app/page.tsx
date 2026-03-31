"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/* ─── static data ─── */

const MOATS = [
  { name: "Workflow", t: "p" },
  { name: "Distribution", t: "p" },
  { name: "Data", t: "s" },
  { name: "Network", t: "s" },
  { name: "Scale", t: "d" },
  { name: "Regulatory", t: "d" },
  { name: "Ecosystem", t: "d" },
] as const;

const FEATS = [
  {
    title: "Recruiting Workflow",
    desc: "Manage the entire process — discovery to offer — in one place. No more juggling spreadsheets, DMs, and calendar reminders.",
  },
  {
    title: "Student Distribution",
    desc: "Built by students, distributed via word-of-mouth to universities in Canada then the US. We are the community.",
  },
  {
    title: "Trust Factor",
    desc: '"We built it, not a corporation." Authenticity enterprise software can never replicate.',
  },
  {
    title: "Intelligence Layer",
    desc: "Every interaction feeds proprietary data: response rates, timing, tone, and funnel paths that compound.",
  },
] as const;

const INSIGHTS = [
  { ey: "Timing", stat: "+18%", lab: "Tues 9–11 AM cold emails get 18% higher reply rates." },
  { ey: "Length", stat: "2.4×", lab: "Short personalized emails outperform long generic ones." },
  { ey: "Alumni", stat: "School match", lab: "Alumni respond more to phrasing that signals shared context." },
  { ey: "Funnel", stat: "Best path", lab: '"2 chats → office visit" — we surface highest-ROI paths.' },
] as const;

const MOAT_SYSTEMS = [
  {
    name: "Workflow",
    badge: "Daily habit",
    metric: "One workspace, every step.",
    desc: "Discovery, outreach, follow-up, prep, and notes all live in the same operating layer students return to every day.",
    variant: "workflow",
  },
  {
    name: "Distribution",
    badge: "Campus spread",
    metric: "Students bring students.",
    desc: "Growth comes through club chats, class groups, and campus word-of-mouth that a generic recruiting tool cannot buy.",
    variant: "distribution",
  },
  {
    name: "Data",
    badge: "Signal flywheel",
    metric: "Response patterns compound.",
    desc: "Timing, message shape, alumni affinity, and funnel drop-off become proprietary signal with every interaction.",
    variant: "data",
  },
  {
    name: "Network",
    badge: "Shared graph",
    metric: "Each user sharpens the map.",
    desc: "Warm paths, known contacts, and proven routes improve for every student as more schools and companies appear.",
    variant: "network",
  },
  {
    name: "Scale",
    badge: "Software leverage",
    metric: "More output per student.",
    desc: "The product turns scattered effort into repeatable motion, so one student can run a far bigger search without extra chaos.",
    variant: "scale",
  },
  {
    name: "Regulatory",
    badge: "Trust moat",
    metric: "Structured beats messy.",
    desc: "Permissions, organized records, and safer collaboration beat the spreadsheet-and-DM workflow schools worry about.",
    variant: "regulatory",
  },
  {
    name: "Ecosystem",
    badge: "Expanding surface",
    metric: "Clubs, alumni, advisors, employers.",
    desc: "Once the workflow is trusted, adjacent groups can plug into the same system and make it harder to replace.",
    variant: "ecosystem",
  },
] as const;

const CONTACTS = [
  { name: "Sarah Chen", co: "Goldman Sachs", st: "responded", dot: "bl" },
  { name: "Alex Morgan", co: "McKinsey & Co", st: "pending", dot: "pu" },
  { name: "Priya Patel", co: "Deloitte", st: "interview", dot: "gr" },
  { name: "James Liu", co: "JP Morgan", st: "sent", dot: "or" },
] as const;

const SLIDE_COUNT = 8;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
};

function renderMoatVisual(variant: (typeof MOAT_SYSTEMS)[number]["variant"]) {
  switch (variant) {
    case "workflow":
      return (
        <div className="mv mv-workflow">
          <span />
          <span />
          <span />
        </div>
      );
    case "distribution":
      return (
        <div className="mv mv-distribution">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "data":
      return (
        <div className="mv mv-data">
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "network":
      return (
        <div className="mv mv-network">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "scale":
      return (
        <div className="mv mv-scale">
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "regulatory":
      return (
        <div className="mv mv-regulatory">
          <span />
          <span />
          <span />
        </div>
      );
    case "ecosystem":
      return (
        <div className="mv mv-ecosystem">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
  }
}

/* ─── component ─── */

export default function Home() {
  const [cur, setCur] = useState(0);
  const lockRef = useRef(false);

  const scrollToSlide = useCallback((index: number) => {
    document.querySelectorAll(".slide")[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* intersection observer for reveals */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("vis");
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".r, .rs").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* track current slide */
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const idx = Math.round(window.scrollY / vh);
      setCur(Math.min(idx, SLIDE_COUNT - 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* click to advance */
  const advance = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("nav") || target.closest(".dots") || target.closest("a")) return;
      if (lockRef.current) return;
      lockRef.current = true;
      setTimeout(() => (lockRef.current = false), 900);

      const next = Math.min(cur + 1, SLIDE_COUNT - 1);
      scrollToSlide(next);
    },
    [cur, scrollToSlide]
  );

  /* keyboard nav */
  useEffect(() => {
    const toggleFullscreen = async () => {
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined);
        return;
      }

      await document.documentElement.requestFullscreen?.().catch(() => undefined);
    };

    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const key = e.key.toLowerCase();
      if (e.metaKey && key === "f") {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (lockRef.current) return;

      let target = cur;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        target = Math.min(cur + 1, SLIDE_COUNT - 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        target = Math.max(cur - 1, 0);
      } else return;

      lockRef.current = true;
      setTimeout(() => (lockRef.current = false), 900);
      scrollToSlide(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur, scrollToSlide]);

  const goTo = (i: number) => {
    scrollToSlide(i);
  };

  const pct = ((cur + 1) / SLIDE_COUNT) * 100;

  return (
    <main onClick={advance} style={{ background: "#000" }}>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-w">
          <span className="x">RE</span>cruiter
        </div>
        <ul className="nav-l">
          <li><a href="#moat">Moat</a></li>
          <li><a href="#problem">Problem</a></li>
          <li><a href="#solution">Solution</a></li>
          <li><a href="#app">Product</a></li>
          <li><a href="#intel">Intelligence</a></li>
        </ul>
      </nav>

      {/* PROGRESS */}
      <div className="progress" style={{ width: `${pct}%` }} />

      {/* DOTS */}
      <div className="dots">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`dot ${cur === i ? "on" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* COUNTER */}
      <div className="counter">
        {String(cur + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}
      </div>

      {/* CLICK HINT */}
      <div className="click-hint">Click to advance · Cmd+F fullscreen</div>

      {/* ══════════════════════════════════════════
          1 · HERO
      ══════════════════════════════════════════ */}
      <section className="slide" style={{ background: "#000", padding: 0 }}>
        <div className="hero-orb" aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p className="hero-ey">Student Recruiting, Reimagined</p>
          <h1 className="hero-t">
            <span className="grad">RE</span>cruiter
          </h1>
          <p className="hero-s">
            The all-in-one tool that helps students find jobs, reach the right
            people, and track everything in one place.
          </p>
        </div>
        <div className="scroll-i" aria-hidden="true">
          <span>Scroll</span>
          <div className="bar" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2 · MOAT
      ══════════════════════════════════════════ */}
      <section className="slide" id="moat" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Ideation</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 580, marginBottom: 18 }}>
            Built on a <span className="grad">moat.</span>
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 460, marginBottom: 44 }}>
            Seven moats exist. We committed to the ones a student-built product can realistically own.
          </p>
          <div className="pills r d3">
            {MOATS.map((m) => (
              <span key={m.name} className={`pill ${m.t}`}>{m.name}</span>
            ))}
          </div>
          <hr className="hr r d4" />
          <p className="t-sm r d5" style={{ maxWidth: 400 }}>
            Workflow + Distribution — now.&ensp;Data + Network — compounds.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3 · PROBLEM
      ══════════════════════════════════════════ */}
      <section className="slide" id="problem" style={{ background: "#000" }}>
        <div className="slide-inner">
          <p className="t-label r d0">The Problem</p>
          <div className="q-wrap r d1">
            <span className="q-mark" aria-hidden="true">&ldquo;</span>
            <p className="q-text">
              Student recruiting is scattered across{" "}
              <span className="lo">too many disconnected tools</span> and
              manual steps, making it hard to find the right opportunities,
              contact the right people, and stay organized enough to{" "}
              <span className="lo">consistently turn effort into interviews.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4 · SOLUTION
      ══════════════════════════════════════════ */}
      <section className="slide" id="solution" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">The Solution</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 600, marginBottom: 40 }}>
            We built the <span className="grad">workflow</span> —
            <br />and the advantage inside it.
          </h2>
          <div className="feat">
            {FEATS.map((f, i) => (
              <div key={f.title} className={`feat-row r d${i + 2}`}>
                <span className="feat-n">0{i + 1}</span>
                <div>
                  <div className="feat-t">{f.title}</div>
                  <div className="feat-d">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5 · APP MOCKUP
      ══════════════════════════════════════════ */}
      <section className="slide" id="app" style={{ background: "#000" }}>
        <div className="slide-inner" style={{ flexDirection: "row", justifyContent: "center", gap: 80, flexWrap: "wrap" }}>
          {/* left text */}
          <div style={{ maxWidth: 340, textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p className="t-label r d0" style={{ marginBottom: 20 }}>The Product</p>
            <h2 className="t-lg r d1" style={{ marginBottom: 16 }}>
              One place for your <span className="grad">entire pipeline.</span>
            </h2>
            <p className="t-body r d2" style={{ marginBottom: 24 }}>
              Track contacts, manage outreach, and see what&apos;s working — all from your phone.
            </p>
            <p className="t-sm r d3">
              Pipeline&ensp;·&ensp;Contacts&ensp;·&ensp;Messages&ensp;·&ensp;Intelligence
            </p>
          </div>

          {/* phone */}
          <div className="phone-scene rs d4">
            <div className="phone-glow" aria-hidden="true" />
            <div className="phone phone-float">
              <div className="phone-di" />
              <div className="phone-scr">
                {/* header */}
                <div className="m-head">
                  <div className="m-logo"><span className="x">RE</span>cruiter</div>
                  <div className="m-ava" />
                </div>

                {/* tabs */}
                <div className="m-tabs">
                  <span className="m-tab on">Pipeline</span>
                  <span className="m-tab">Contacts</span>
                  <span className="m-tab">Messages</span>
                </div>

                {/* stats */}
                <div className="m-stats">
                  <div className="m-stat-card">
                    <div className="m-stat-n">12</div>
                    <div className="m-stat-l">Applied</div>
                  </div>
                  <div className="m-stat-card">
                    <div className="m-stat-n">8</div>
                    <div className="m-stat-l">Contacted</div>
                  </div>
                  <div className="m-stat-card">
                    <div className="m-stat-n">3</div>
                    <div className="m-stat-l">Interview</div>
                  </div>
                </div>

                {/* contact list */}
                <div className="m-list">
                  {CONTACTS.map((c) => (
                    <div key={c.name} className="m-card">
                      <div className={`m-dot ${c.dot}`} />
                      <div>
                        <div className="m-name">{c.name}</div>
                        <div className="m-co">{c.co}</div>
                      </div>
                      <div className={`m-st ${c.st}`}>{c.st}</div>
                    </div>
                  ))}
                </div>

                {/* bottom nav */}
                <div className="m-bnav">
                  <div className="m-bnav-i">
                    <div className="m-bnav-dot on" />
                    <span className="m-bnav-t on">Pipeline</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-dot" />
                    <span className="m-bnav-t">Contacts</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-dot" />
                    <span className="m-bnav-t">AI</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-dot" />
                    <span className="m-bnav-t">Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6 · INTELLIGENCE
      ══════════════════════════════════════════ */}
      <section className="slide" id="intel" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Proprietary Intelligence</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 640, marginBottom: 14 }}>
            The <span className="grad">best way</span> to reach this person.
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 460, marginBottom: 44 }}>
            A living intelligence layer no recruiter, platform, or competitor has.
          </p>
          <div className="dg">
            {INSIGHTS.map((c, i) => (
              <div key={c.ey} className={`dc rs d${i + 3}`}>
                <div className="dc-ey">{c.ey}</div>
                <div className="dc-stat">{c.stat}</div>
                <div className="dc-lab">{c.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7 · NETWORK
      ══════════════════════════════════════════ */}
      <section className="slide" id="network" style={{ background: "#000" }}>
        <div className="slide-inner moat-inner">
          <h2 className="t-xl r d0" style={{ maxWidth: 760, marginBottom: 16 }}>
            Seven moats.
            <br />
            <span className="grad">Seven different ways to widen the gap.</span>
          </h2>
          <p className="t-body r d1" style={{ maxWidth: 620, marginBottom: 40 }}>
            Not one generic network-effect story. A stacked system where workflow, distribution, data,
            network, scale, regulatory structure, and ecosystem depth all reinforce one another.
          </p>
          <div className="moat-grid">
            {MOAT_SYSTEMS.map((moat, i) => (
              <div key={moat.name} className={`moat-card rs d${Math.min(i + 2, 8)} ${moat.variant}`}>
                <div className="moat-card-top">
                  <div className="moat-kicker">{moat.name}</div>
                  <div className="moat-badge">{moat.badge}</div>
                </div>
                <div className="moat-visual-shell" aria-hidden="true">
                  {renderMoatVisual(moat.variant)}
                </div>
                <div className="moat-metric">{moat.metric}</div>
                <div className="moat-desc">{moat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8 · CLOSING
      ══════════════════════════════════════════ */}
      <section className="slide" style={{ background: "#000" }}>
        <div className="close-orb" aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="t-label r d0" style={{ marginBottom: 28 }}>REcruiter</p>
          <h2 className="t-hero r d1" style={{ maxWidth: 660 }}>
            Turn effort into
            <br />
            <span className="grad">interviews.</span>
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 380, margin: "28px auto 0" }}>
            Built by students.
            <br />
            Distributed by trust.
            <br />
            Powered by data.
          </p>
        </div>
      </section>
    </main>
  );
}
