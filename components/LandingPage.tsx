'use client';

import { lazy, Suspense } from "react";
import {
  PenLine,
  ListChecks,
  Mail,
  Sprout,
  Map,
  Languages,
  Wand2,
  Leaf,
  Check,
} from "lucide-react";
import AnchorGlyph from "./AnchorGlyph";
import { useReveal } from "../hooks/useReveal";

const ThreeScene = lazy(() => import("./ThreeScene"));

const NAV: { label: string; href: string }[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "The checklist", href: "#the-checklist" },
  { label: "Where it's going", href: "#future" },
];

const STEPS = [
  {
    n: "01",
    title: "Say it in plain words",
    body: "Tell Anchor what happened. No forms, no jargon — just describe your situation the way you'd tell a friend.",
    icon: PenLine,
  },
  {
    n: "02",
    title: "A calm, ordered checklist",
    body: "Anchor turns your situation into a gentle agenda — each task tagged by urgency, so you always know the next small thing.",
    icon: ListChecks,
  },
  {
    n: "03",
    title: "Letters written for you",
    body: "For each task, Anchor drafts a warm, ready-to-send note. Edit it, copy it, or download it — then breathe out.",
    icon: Mail,
  },
  {
    n: "04",
    title: "Progress at your own pace",
    body: "A quiet tracker shows how far you've come, with kind words along the way. There is no deadline on grieving.",
    icon: Sprout,
  },
];

const SAMPLE_TASKS = [
  { title: "Notify your bank", urgency: "This week", done: 80 },
  { title: "Contact Social Security", urgency: "This week", done: 55 },
  { title: "Cancel auto-enrolled subscriptions", urgency: "Soon", done: 30 },
  { title: "Request extra death certificates", urgency: "Soon", done: 10 },
  { title: "Forward & manage accounts", urgency: "Take your time", done: 20 },
];

const FUTURE = [
  {
    title: "Jurisdiction-aware guidance",
    icon: Map,
    body: "Death certificates and probate paperwork vary by county and country. We're adding location-aware guidance so Anchor tells you exactly which documents your region needs.",
  },
  {
    title: "Multi-language support",
    icon: Languages,
    body: "Grief isn't limited to English. We want Anchor to meet you in your own language — for both the checklists and the drafted words.",
  },
  {
    title: "More life-crisis categories",
    icon: Wand2,
    body: "The same gentle framework extends naturally to divorce, job loss, natural disasters, and serious illness — each with its own rhythms.",
  },
  {
    title: "Gentle emotional support",
    icon: Leaf,
    body: "Beyond tasks, we're exploring thoughtful support resources — built with care and mental-health professionals, not as a pure AI feature.",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, revealClass } = useReveal();
  return (
    <div ref={ref} className={`${revealClass} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ClosingMessage({ words }: { words: string }) {
  const { ref, revealClass } = useReveal(0.25);
  const active = revealClass === "rise";
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative px-6 py-32 text-center">
      <div className="mx-auto max-w-4xl">
        <AnchorGlyph className="mx-auto h-10 w-10 text-clay/70" />
        <h2 className="mt-10 font-serif text-3xl font-light leading-snug text-deep sm:text-4xl md:text-5xl">
          {words.split(" ").map((word, i) => (
            <span
              key={i}
              className={active ? "word" : "opacity-0"}
              style={{ animationDelay: active ? `${i * 450}ms` : "0ms" }}
            >
              {word}&nbsp;
            </span>
          ))}
        </h2>
        <p className="mt-14 text-sm font-medium uppercase tracking-[0.3em] text-clay">
          hold steady · anchor
        </p>
      </div>
    </section>
  );
}

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const closingWords =
    "Our goal with Anchor was never just to manage a to-do list. It's to give people back a little bit of steadiness, during a time when everything else feels unstable.";

  return (
    <div className="relative min-h-screen">
      <div className="bg-blobs" />
      <div className="grain" />

      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden">
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-8">
          <nav className="flex items-center justify-between">
            <a href="#top" className="flex items-center gap-2.5 text-clay">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 backdrop-blur glow-ring">
                <AnchorGlyph className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-medium text-deep">Anchor</span>
            </a>
            <div className="hidden items-center gap-8 text-sm text-ink/70 sm:flex">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-clay">
                  {item.label}
                </a>
              ))}
            </div>
            <button
              onClick={onGetStarted}
              className="rounded-full bg-deep px-5 py-2.5 text-sm font-medium text-cream shadow-lg shadow-clay/20 transition-transform hover:-translate-y-0.5 hover:bg-ink cursor-pointer"
            >
              Get steady
            </button>
          </nav>

          {/* Hero copy */}
          <div className="flex min-h-[82vh] flex-col items-center justify-center pb-20 text-center">
            <p className="rise stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-clay/25 bg-white/55 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-clay backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" /> a calm companion for hard days
            </p>
            <h1 className="rise floaty font-serif text-5xl font-light leading-[1.05] tracking-tight text-deep sm:text-6xl md:text-7xl">
              Hold steady.<br />
              <span className="italic text-clay">One small step</span><br />
              at a time.
            </h1>
            <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-ink/70">
              After the loss of a loved one, the paperwork feels impossible. Anchor turns
              {" "}&ldquo;everything&rdquo; into a gentle, ordered list of small things — and writes the words
              for you.
            </p>
            <div className="rise mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="rounded-full bg-clay px-8 py-4 text-sm font-medium text-cream shadow-xl shadow-clay/30 transition-transform hover:-translate-y-1 hover:bg-[#b97a59] cursor-pointer"
              >
                Step toward calm →
              </button>
              <a
                href="#future"
                className="text-sm font-medium text-ink/70 underline decoration-clay/50 underline-offset-8 transition-colors hover:text-clay"
              >
                See where it&apos;s going
              </a>
            </div>
            <div className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-3">
              {[
                ["No login", "nothing stored"],
                ["Single session", "your privacy stays yours"],
                ["Always steps", "never overwhelm"],
              ].map(([k, v], i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/60 bg-white/45 px-4 py-5 text-center backdrop-blur-md"
                >
                  <div className="font-serif text-lg font-medium text-deep">{k}</div>
                  <div className="mt-1 text-xs text-ink/60">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-40 bg-gradient-to-b from-transparent to-cream" />
      </header>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="relative scroll-mt-24 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-clay">The method</p>
            <h2 className="font-serif text-4xl font-light leading-tight text-deep sm:text-5xl">
              Grief already takes everything.<br />
              <span className="italic text-clay">Anchor removes the burden of words.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="group h-full rounded-[2rem] border border-white/70 bg-white/55 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-2xl hover:shadow-clay/10">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-clay/10 text-clay">
                      <step.icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <span className="font-serif text-sm italic text-clay/70">{step.n}</span>
                  </div>
                  <h3 className="mb-2.5 font-serif text-xl font-medium text-deep">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAMPLE CHECKLIST ============ */}
      <section id="the-checklist" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-moss">Your gentle agenda</p>
              <h2 className="font-serif text-4xl font-light leading-tight text-deep sm:text-5xl">
                Everything, broken into<br />
                <span className="italic text-moss">breathable pieces.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink/70">
                Each task is tagged by urgency, so your eyes always land on the one small thing
                that matters now — not the mountain behind it.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Urgency shown gently — this week · soon · take your time",
                  "Draft letters you can edit, copy, or download in one tap",
                  "Progress that leans on praise, not pressure",
                ].map((t, i) => (
                  <Reveal key={i} delay={i * 90}>
                    <div className="flex items-start gap-3 text-ink/80">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
                        <Check className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <span className="leading-relaxed">{t}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* floating checklist card */}
          <Reveal delay={150}>
            <div className="glow-ring rounded-[2.2rem] bg-white/70 p-6 backdrop-blur-lg sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-deep">
                  <AnchorGlyph className="h-5 w-5 text-clay" />
                  <span className="font-serif font-medium">A steady next few days</span>
                </div>
                <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-medium text-moss">3 of 5 done</span>
              </div>
              <div className="space-y-3">
                {SAMPLE_TASKS.map((task) => (
                  <div
                    key={task.title}
                    className="flex items-center gap-3 rounded-2xl border border-sand bg-cream/70 px-4 py-3"
                  >
                    <span
                      className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                        task.done > 60
                          ? "border-moss bg-moss/20 text-moss"
                          : "border-clay/40"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-deep">{task.title}</div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-glow to-clay transition-all"
                          style={{ width: `${task.done}%` }}
                        />
                      </div>
                    </div>
                    <span className="hidden shrink-0 text-[11px] uppercase tracking-wide text-ink/50 sm:block">
                      {task.urgency}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-glow/30 to-moss/15 p-4 text-sm italic leading-relaxed text-ink/75">
                &ldquo;You&apos;ve done so much already. This next one can wait until you&apos;re ready.&rdquo;
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FUTURE VISION ============ */}
      <section id="future" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-clay">What&apos;s next for Anchor</p>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-light leading-tight text-deep sm:text-5xl">
              Built to go far beyond<br />
              <span className="italic text-clay">a single hard day.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {FUTURE.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group h-full rounded-[2rem] border border-white/70 bg-white/55 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-2xl hover:shadow-moss/10">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-moss/15 text-moss">
                    <f.icon className="h-6 w-6" strokeWidth={1.6} />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-medium text-deep">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="relative px-6 py-20 text-center">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-clay">Ready when you are</p>
            <h2 className="font-serif text-3xl font-light leading-tight text-deep sm:text-4xl">
              Take the first small step.<br />
              <span className="italic text-clay">Anchor will hold the rest.</span>
            </h2>
            <button
              onClick={onGetStarted}
              className="mt-10 rounded-full bg-clay px-10 py-4 text-sm font-medium text-cream shadow-xl shadow-clay/30 transition-transform hover:-translate-y-1 hover:bg-[#b97a59] cursor-pointer"
            >
              Begin your checklist →
            </button>
          </div>
        </Reveal>
      </section>

      {/* ============ CLOSING MESSAGE ============ */}
      <ClosingMessage words={closingWords} />

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-clay/10 bg-white/40 px-6 py-14 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2.5 text-clay">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 glow-ring">
              <AnchorGlyph className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg text-deep">Anchor</span>
          </div>
          <p className="text-center text-sm text-ink/60">No login. No database. Just one calm session at a time.</p>
          <div className="text-sm text-ink/50">made with kindness · for the steady</div>
        </div>
      </footer>
    </div>
  );
}
