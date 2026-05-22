'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap, Shield, ArrowRight, ChevronDown, Bot, Sparkles,
  Lock, CheckCircle2, TrendingUp, X, ZoomIn,
} from 'lucide-react';
import { AGENTS } from '@/lib/agents';
import { Agent } from '@/types';
import { ThemePicker } from '@/components/ui/ThemePicker';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

const SUPPORTERS = [
  { name: 'Carlos Marinho',      role: 'Head of Tech LATAM' },
  { name: 'Nathalia Chamie',     role: 'Manager - Business Apps & Data' },
  { name: 'Carlos Junior',       role: 'Manager - Technology Services' },
  { name: 'Vanessa Araújo',      role: 'Supervisor - Solutions & Optimization' },
  { name: 'Alexandre Frasão',    role: 'Process Coordinator' },
  { name: 'James Piologo',       role: 'Production Manager' },
  { name: 'Silvia Moreira',      role: 'HR Shared Services Manager' },
  { name: 'Marlene Rosario',     role: 'HR Services Supervisor' },
  { name: 'Philippe Walliser',   role: 'Strategy Transformation Lead, Technology Transformation' },
  { name: 'Reto Bloch',          role: 'Head of Contact Center Technology' },
  { name: 'Miguel Garcia',       role: 'Senior Enterprise Data Architect' },
  { name: 'Lukas Freuler',       role: 'Senior Cloud Infrastructure Architect' },
  { name: 'Oscar Revilla',       role: 'Senior Cloud Architect' },
  { name: 'Christophe Antoine',  role: 'Global Data & Tech Lead Operations' },
  { name: 'Agoston Torok',       role: 'Head of AI Technology' },
];

const SUPPORTER_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function AgentCard({ agent, cta, online }: { agent: Agent; cta: string; online: string }) {
  return (
    <Link href={`/chat/${agent.id}`} className="group block">
      <div className="relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm
                      transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-1
                      hover:shadow-2xl hover:shadow-black/40 cursor-pointer overflow-hidden">
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${agent.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient} shadow-lg`}>
            <span className="text-xs font-bold tracking-widest text-white">{agent.icon}</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {online}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">{agent.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/40">{agent.specialty}</p>
          <p className="mt-3 text-sm text-white/60 leading-relaxed line-clamp-3">{agent.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {agent.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/40">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-white/8">
          <span className="text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">{cta}</span>
          <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function Pill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
      {text}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { lang, t, setLang } = useLanguage();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; whiteBg?: boolean } | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/backgrounds/Gemini_Generated_Image_62uvh162uvh162uv.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/55 via-black/65 to-black/92" />
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md p-4 cursor-zoom-out"
          style={{ background: lightbox.whiteBg ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.90)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div
            className={`relative rounded-2xl shadow-2xl overflow-hidden ${lightbox.whiteBg ? 'bg-white p-4' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-[92vw] object-contain block"
            />
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* ── Navbar ── */}
        <header className="sticky top-0 z-50 border-b border-white/8 bg-black/25 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/40">
                <span className="text-[9px] font-bold tracking-widest text-white">NS</span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white">Neoson</span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">Beta</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs text-white/40">
              <a href="#agents"     className="hover:text-white/70 transition-colors">{t.nav.agents}</a>
              <a href="#intro"      className="hover:text-white/70 transition-colors">{t.nav.intro}</a>
              <a href="#jornada"    className="hover:text-white/70 transition-colors">{t.nav.journey}</a>
              <a href="#status"     className="hover:text-white/70 transition-colors">{t.nav.status}</a>
              <a href="#apoiadores" className="hover:text-white/70 transition-colors">{t.nav.supporters}</a>
            </nav>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-white/35">{t.nav.platform}</span>
              <div className="h-4 w-px bg-white/15 hidden sm:block" />
              <LanguageSwitcher lang={lang} setLang={setLang} />
              <div className="h-4 w-px bg-white/15" />
              <ThemePicker />
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-xs font-medium text-emerald-300 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            {t.hero.badge}
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[5rem]">
            {t.hero.headline1}
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
              {t.hero.headline2}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/65 leading-relaxed">
            {t.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill icon={Bot}      text={t.hero.pill1} />
            <Pill icon={Sparkles} text={t.hero.pill2} />
            <Pill icon={Lock}     text={t.hero.pill3} />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/chat/SupervisorAgent"
              className="group flex items-center gap-2.5 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/40 transition-all hover:bg-emerald-400 hover:-translate-y-0.5 hover:shadow-emerald-800/50 active:scale-[0.98]"
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#agents"
              className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/6 px-8 py-3.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 hover:text-white hover:-translate-y-0.5"
            >
              {t.hero.cta2}
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </section>

        <SectionDivider />

        {/* ── Agents grid ── */}
        <section id="agents" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t.agents.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.agents.title}</h2>
            <p className="max-w-lg text-sm text-white/60 leading-relaxed">{t.agents.sub}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} cta={t.agents.cta} online={t.agents.online} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Intro ── */}
        <section id="intro" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t.intro.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.intro.title}</h2>
          </div>
          <div
            className="group relative mx-auto max-w-4xl cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/50 transition-transform duration-500 hover:scale-[1.01]"
            onClick={() => setLightbox({ src: '/backgrounds/slide-intro.png', alt: t.intro.title, whiteBg: true })}
          >
            <img
              src="/backgrounds/slide-intro.png"
              alt={t.intro.title}
              className="h-full w-full object-contain"
            />
            <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <ZoomIn className="h-3.5 w-3.5 text-white/60" />
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Timeline ── */}
        <section id="jornada" className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mb-20 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t.journey.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.journey.title}</h2>
            <p className="max-w-lg text-sm text-white/60 leading-relaxed">{t.journey.sub}</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent lg:block" />

            <div className="flex flex-col gap-28">
              {t.journey.timeline.map((item, i) => {
                const isImageLeft = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col gap-10 lg:flex-row lg:items-center ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}
                  >
                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/80 backdrop-blur-md z-10 shadow-lg">
                      <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${item.color} shadow-md`} />
                    </div>

                    {/* Image */}
                    <div className={`w-full lg:w-1/2 ${isImageLeft ? 'lg:pr-16' : 'lg:pl-16'}`}>
                      <div
                        className={`group relative overflow-hidden rounded-2xl border aspect-video shadow-2xl shadow-black/50 transition-transform duration-500 hover:scale-[1.015] cursor-zoom-in ${
                          i === t.journey.timeline.length - 1
                            ? 'border-white/20 bg-white backdrop-blur-md'
                            : 'border-white/10 bg-white/5 backdrop-blur-sm'
                        }`}
                        onClick={() => setLightbox({ src: item.image, alt: item.imageAlt, whiteBg: i === t.journey.timeline.length - 1 })}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-8`} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <TrendingUp className="h-10 w-10 text-white/10" />
                          <span className="text-xs text-white/15">{item.imageAlt}</span>
                        </div>
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className={`relative z-10 h-full w-full ${i === t.journey.timeline.length - 1 ? 'object-contain p-3' : 'object-cover'}`}
                        />
                        {i !== t.journey.timeline.length - 1 && (
                          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        )}
                        <div className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <ZoomIn className="h-3.5 w-3.5 text-white/60" />
                        </div>
                        <div className="absolute bottom-3 left-3 z-30">
                          <span className="rounded-lg border border-white/10 bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/75">
                            {item.phase}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className={`w-full lg:w-1/2 ${isImageLeft ? 'lg:pl-16' : 'lg:pr-16'}`}>
                      <div className="flex flex-col gap-5">
                        <span className={`self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${item.color}`}>
                          {item.label}
                        </span>
                        <h3 className="text-2xl font-bold text-white leading-tight sm:text-3xl">{item.title}</h3>
                        <p className="text-sm text-white/75 leading-[1.8]">{item.description}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400/60 shrink-0" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Project Status ── */}
        <section id="status" className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t.status.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.status.title}</h2>
            <p className="max-w-lg text-sm text-white/60 leading-relaxed">{t.status.sub}</p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-emerald-400/60 via-emerald-400/20 to-white/5" />
              <ol className="flex flex-col gap-1">
                {t.status.steps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-5 relative">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                      {step.state === 'done' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/50">
                          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {step.state === 'current' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 border border-amber-400/60 shadow-lg shadow-amber-900/30">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                        </div>
                      )}
                      {step.state === 'pending' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/4">
                          <div className="h-2 w-2 rounded-sm border border-white/20" />
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 flex items-center justify-between rounded-xl px-4 py-3 border transition-colors ${
                      step.state === 'done'
                        ? 'border-emerald-400/15 bg-emerald-400/5'
                        : step.state === 'current'
                        ? 'border-amber-400/30 bg-amber-400/8 shadow-md shadow-amber-900/20'
                        : 'border-white/6 bg-white/3'
                    }`}>
                      <span className={`text-sm font-medium ${
                        step.state === 'done'      ? 'text-emerald-200'
                        : step.state === 'current' ? 'text-amber-200'
                        : 'text-white/30'
                      }`}>
                        {step.label}
                      </span>
                      {step.state === 'done' && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/70">{t.status.done}</span>
                      )}
                      {step.state === 'current' && (
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {t.status.inProgress}
                        </span>
                      )}
                      {step.state === 'pending' && (
                        <span className="text-[10px] font-medium text-white/20">{t.status.pending}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Supporters ── */}
        <section id="apoiadores" className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t.supporters.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.supporters.title}</h2>
            <p className="max-w-lg text-sm text-white/60 leading-relaxed">{t.supporters.sub}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTERS.map((s, i) => {
              const initials = s.name.split(' ').slice(0, 2).map(n => n[0]).join('');
              const grad = SUPPORTER_GRADIENTS[i % SUPPORTER_GRADIENTS.length];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/7 hover:border-white/12"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${grad} shadow-sm`}>
                    <span className="text-[10px] font-bold text-white">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/85 truncate">{s.name}</p>
                    <p className="text-[11px] text-white/35 leading-tight line-clamp-1">{s.role}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/8 px-10 py-5 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-semibold text-emerald-300">{t.supporters.team}</span>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/8 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-400 to-teal-600">
                <span className="text-[7px] font-bold text-white">NS</span>
              </div>
              <span className="text-xs text-white/35">Neoson · Straumann Group © 2026</span>
            </div>
            <nav className="flex items-center gap-5 text-[11px] text-white/25">
              <a href="#agents"     className="hover:text-white/50 transition-colors">{t.nav.agents}</a>
              <a href="#intro"      className="hover:text-white/50 transition-colors">{t.nav.intro}</a>
              <a href="#jornada"    className="hover:text-white/50 transition-colors">{t.nav.journey}</a>
              <a href="#status"     className="hover:text-white/50 transition-colors">{t.nav.status}</a>
              <a href="#apoiadores" className="hover:text-white/50 transition-colors">{t.nav.supporters}</a>
            </nav>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Shield className="h-3 w-3" />
              {t.footer.guardrails}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
