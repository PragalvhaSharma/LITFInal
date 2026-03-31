"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/* ─── static data ─── */

const MOAT_ACCESSIBLE = [
  {
    title: "Workflow",
    description:
      "Own the day-to-day recruiting pipeline with one polished flow. Every outreach, follow-up, and reply lives in one place.",
    tone: "blue",
  },
  {
    title: "Distribution",
    description:
      "Leverage peer-to-peer credibility and university referrals, the distribution channel no enterprise stack can copy fast.",
    tone: "purple",
  },
] as const;

const MOAT_COMPOUNDING = [
  {
    title: "Data",
    description:
      "Every contact outcome, timeline, and response signal compounds into better targeting, timing, and content suggestions.",
    tone: "pink",
  },
  {
    title: "Network",
    description:
      "Each student adds more shared intelligence to the graph, improving reach and conversion for everyone.",
    tone: "green",
  },
] as const;

const MOAT_FUTURE = [
  {
    title: "Scale",
    description:
      "Depth with schools and recruiting cycles grows harder to replicate once execution quality and habits become the standard.",
    tone: "orange",
  },
  {
    title: "Regulatory",
    description:
      "Compliance posture, data handling, and trust standards become a competitive advantage as recruiting tech scrutiny rises.",
    tone: "blue",
  },
  {
    title: "Ecosystem",
    description:
      "APIs, integrations, and platform fit create switching-costs as students build their own workflows inside it.",
    tone: "purple",
  },
] as const;

const FEATS = [
  {
    title: "Recruiting Workflow",
    desc: "Manage the entire process from discovery to offer in one place. No more juggling spreadsheets, DMs, and calendar reminders.",
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
  { ey: "Timing", stat: "+18%", lab: "Tues 9-11 AM cold emails get +18% higher reply rates." },
  { ey: "Length", stat: "2.4×", lab: "Short personalized emails get 2.4x better replies than long generic ones." },
  { ey: "Alumni", stat: "+22%", lab: "Alumni from matching schools respond 22% more to context-rich phrasing." },
  { ey: "Funnel", stat: "2 chats", lab: "The highest-ROI path is usually 2 chats before an office visit." },
] as const;

const NET = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    ),
    title: "Shared Intelligence",
    desc: "Every student's data improves predictions for every other student.",
    color: "blue"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: "Warm Intros",
    desc: '"Your school already reached out to X." Zero cold start.',
    color: "purple"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
    ),
    title: "Your Benchmark",
    desc: "Compare your rate against similar companies, roles, stages.",
    color: "pink"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
    ),
    title: "Community Forum",
    desc: "Insider knowledge organized by company, role, and stage.",
    color: "green"
  },
];

const PHONE_SIGNALS = [
  { label: "Warm intros", value: "04", tone: "bl" },
  { label: "AI drafts", value: "03", tone: "pu" },
  { label: "Reply rate", value: "+18%", tone: "gr" },
] as const;

const PHONE_PIPELINE = [
  {
    role: "Summer Analyst",
    company: "Goldman Sachs",
    stage: "Follow-up ready",
    score: "92%",
    state: "Hot",
    tone: "bl",
    progress: 86,
  },
  {
    role: "Strategy Intern",
    company: "McKinsey & Co",
    stage: "Coffee chat booked",
    score: "81%",
    state: "Booked",
    tone: "pu",
    progress: 68,
  },
  {
    role: "Audit Associate",
    company: "Deloitte",
    stage: "Interview prep",
    score: "73%",
    state: "Prep",
    tone: "gr",
    progress: 54,
  },
] as const;

const PHONE_FLYOUTS = [
  {
    eyebrow: "AI draft",
    title: "Follow-up ready",
    body: "82 words with alumni context already woven in.",
    pos: "right",
  },
] as const;

const MOMENTUM_BARS = [
  { day: "M", height: 10, tone: "dim" },
  { day: "T", height: 20, tone: "bl" },
  { day: "W", height: 14, tone: "pu" },
  { day: "T", height: 28, tone: "gr" },
  { day: "F", height: 24, tone: "bl" },
] as const;

const SLIDE_COUNT = 10;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
};

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
      if (target.closest("nav") || target.closest("a")) return;
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

  return (
    <main onClick={advance} style={{ background: "#000" }}>
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
          2 · PROBLEM
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
          3 · MOAT ACCESSIBLE
      ══════════════════════════════════════════ */}
      <section className="slide" id="moat-core" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Moats</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 640, marginBottom: 18 }}>
            The most accessible moats first.
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 560, marginBottom: 36 }}>
            We start with the moats students can feel immediately. These are built into the product from day one.
          </p>
          <div className="moat-grid r d3">
            {MOAT_ACCESSIBLE.map((m, i) => (
              <div key={m.title} className={`moat-card r d${i + 4} ${m.tone}`}>
                <p className="moat-badge">{m.title}</p>
                <h3 className="moat-title">{m.title}</h3>
                <p className="moat-copy">{m.description}</p>
              </div>
            ))}
          </div>
          <p className="t-sm r d5" style={{ marginTop: 32, maxWidth: 460 }}>
            Next come the moats that compound over time.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4 · MOAT COMPOUNDING
      ══════════════════════════════════════════ */}
      <section className="slide" id="moat-compounding" style={{ background: "#000" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Moats</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 640, marginBottom: 18 }}>
            The compounding moats.
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 560, marginBottom: 36 }}>
            These create a virtuous cycle. Better signal means better matching, better matching means better outcomes.
          </p>
          <div className="moat-grid r d3">
            {MOAT_COMPOUNDING.map((m, i) => (
              <div key={m.title} className={`moat-card r d${i + 4} ${m.tone}`}>
                <p className="moat-badge">{m.title}</p>
                <h3 className="moat-title">{m.title}</h3>
                <p className="moat-copy">{m.description}</p>
              </div>
            ))}
          </div>
          <p className="t-sm r d5" style={{ marginTop: 32, maxWidth: 460 }}>
            We then build the remaining moats after momentum compounds.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5 · MOAT LONG-TERM
      ══════════════════════════════════════════ */}
      <section className="slide" id="moat-future" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Moats</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 640, marginBottom: 18 }}>
            The remaining moats.
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 560, marginBottom: 36 }}>
            These are the long-range protections we are building as the product and community expand.
          </p>
          <div className="moat-grid r d3">
            {MOAT_FUTURE.map((m, i) => (
              <div key={m.title} className={`moat-card r d${i + 4} ${m.tone}`}>
                <p className="moat-badge">{m.title}</p>
                <h3 className="moat-title">{m.title}</h3>
                <p className="moat-copy">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6 · SOLUTION
      ══════════════════════════════════════════ */}
      <section className="slide" id="solution" style={{ background: "var(--bg2)" }}>
        <div className="slide-inner">
          <p className="t-label r d0">The Solution</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 600, marginBottom: 40 }}>
            We built the <span className="grad">workflow</span> and the advantage is inside it.
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
          7 · APP MOCKUP
      ══════════════════════════════════════════ */}
      <section className="slide app-slide" id="app" style={{ background: "#000" }}>
        <div className="slide-inner app-layout">
          {/* left text */}
          <div className="app-copy">
            <p className="t-label r d0" style={{ marginBottom: 20 }}>The Product</p>
            <h2 className="t-lg r d1" style={{ marginBottom: 16 }}>
              One place for your <span className="grad">entire pipeline.</span>
            </h2>
            <p className="t-body r d2" style={{ marginBottom: 24 }}>
              Track contacts, manage outreach, and see what&apos;s working from your phone.
            </p>
            <p className="t-sm r d3">
              Pipeline&ensp;·&ensp;Contacts&ensp;·&ensp;Messages&ensp;·&ensp;Intelligence
            </p>
          </div>

          {/* phone */}
          <div className="phone-scene rs d4">
            <div className="phone-grid" aria-hidden="true" />
            <div className="phone-glow" aria-hidden="true" />
            {PHONE_FLYOUTS.map((flyout) => (
              <div key={flyout.title} className={`phone-flyout ${flyout.pos}`}>
                <span className="phone-flyout-eyebrow">{flyout.eyebrow}</span>
                <strong>{flyout.title}</strong>
                <span>{flyout.body}</span>
              </div>
            ))}
            <div className="phone phone-float">
              <div className="phone-shine" aria-hidden="true" />
              <div className="phone-side phone-side-top" aria-hidden="true" />
              <div className="phone-side phone-side-mid" aria-hidden="true" />
              <div className="phone-side-right" aria-hidden="true" />
              <div className="phone-di" />
              <div className="phone-scr">
                <div className="m-status">
                  <span className="m-time">9:41</span>
                  <div className="m-status-icons" aria-hidden="true">
                    <span className="m-sig" />
                    <span className="m-sig" />
                    <span className="m-bat" />
                  </div>
                </div>

                <div className="m-head">
                  <div>
                    <div className="m-k">Recruiting autopilot</div>
                    <div className="m-title">Your pipeline is heating up.</div>
                  </div>
                  <div className="m-ava">
                    <span />
                  </div>
                </div>

                <div className="m-hero-card">
                  <div className="m-hero-row">
                    <div>
                      <p className="m-hero-ey">Next move</p>
                      <h3 className="m-hero-title">Ping Sarah before lunch</h3>
                    </div>
                    <span className="m-badge blue">92% match</span>
                  </div>
                  <p className="m-hero-copy">
                    AI tightened the follow-up and anchored it to your alumni overlap.
                  </p>
                  <div className="m-hero-meta">
                    <span>Goldman Sachs</span>
                    <span>Warm intro live</span>
                  </div>
                </div>

                <div className="m-signals">
                  {PHONE_SIGNALS.map((signal) => (
                    <div key={signal.label} className={`m-signal-card ${signal.tone}`}>
                      <span className="m-signal-label">{signal.label}</span>
                      <span className="m-signal-value">{signal.value}</span>
                    </div>
                  ))}
                </div>

                <div className="m-tabs">
                  <span className="m-tab on">Pipeline</span>
                  <span className="m-tab">Messages</span>
                  <span className="m-tab">Intel</span>
                </div>

                <div className="m-section-head">
                  <span>Priority pipeline</span>
                  <span>3 live</span>
                </div>

                <div className="m-list">
                  {PHONE_PIPELINE.map((item) => (
                    <div key={item.role} className={`m-pipe-card ${item.tone}`}>
                      <div className="m-pipe-top">
                        <div>
                          <div className="m-name">{item.role}</div>
                          <div className="m-co">{item.company}</div>
                        </div>
                        <div className={`m-st ${item.tone}`}>{item.state}</div>
                      </div>
                      <div className="m-pipe-meta">
                        <span>{item.stage}</span>
                        <span>{item.score}</span>
                      </div>
                      <div className="m-progress-track">
                        <span style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="m-intel">
                  <div className="m-intel-copy">
                    <span className="m-intel-ey">Momentum</span>
                    <strong>3 replies projected by Friday</strong>
                  </div>
                  <div className="m-intel-bars" aria-hidden="true">
                    {MOMENTUM_BARS.map((bar) => (
                      <span
                        key={`${bar.day}-${bar.height}`}
                        className={`m-intel-bar ${bar.tone}`}
                        style={{ height: `${bar.height}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="m-bnav">
                  <div className="m-bnav-i">
                    <div className="m-bnav-icon on">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <span className="m-bnav-t on">Pipeline</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <span className="m-bnav-t">Contacts</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    </div>
                    <span className="m-bnav-t">AI</span>
                  </div>
                  <div className="m-bnav-i">
                    <div className="m-bnav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <span className="m-bnav-t">Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8 · INTELLIGENCE
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
          9 · NETWORK
      ══════════════════════════════════════════ */}
      <section className="slide" id="network" style={{ background: "#000" }}>
        <div className="slide-inner">
          <p className="t-label r d0">Network Effect</p>
          <h2 className="t-xl r d1" style={{ maxWidth: 600, marginBottom: 14 }}>
            More students = <span className="grad">smarter for everyone.</span>
          </h2>
          <p className="t-body r d2" style={{ maxWidth: 440, marginBottom: 44 }}>
            Each student who joins makes the product more valuable for every student already here.
          </p>
          <div className="ng">
            {NET.map((c, i) => (
              <div key={c.title} className={`nc rs d${i + 3}`}>
                <div className={`nc-i ${c.color}`}>{c.icon}</div>
                <div className="nc-t">{c.title}</div>
                <div className="nc-d">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10 · CLOSING
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
