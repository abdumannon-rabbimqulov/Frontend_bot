import {
  Brain,
  Cpu,
  Mail,
  MapPin,
  Phone,
  Plane,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { HeroBackground } from "@/components/home/hero-background";
import { UzbekistanMap } from "@/components/home/uzbekistan-map";

const TELEGRAM_USERNAME = "Abdumannonrab";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

const AI_ICONS = [
  { Icon: Cpu, label: "AI chip" },
  { Icon: Brain, label: "Neural tarmoq" },
  { Icon: Plane, label: "Drone" },
  { Icon: MapPin, label: "Xarita" },
] as const;

function LogoMark() {
  return (
    <div className="grid h-9 w-9 grid-cols-2 gap-0.5 p-1">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-sm bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020812] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-500/10 bg-[#020812]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <span className="text-sm font-bold tracking-wider sm:text-base">
              LOGISTIC.UZ
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#bosh-sahifa"
              className="text-sm text-slate-300 transition hover:text-[#00d4ff]"
            >
              Bosh sahifa
            </Link>
            <Link
              href="#xizmatlar"
              className="text-sm text-slate-300 transition hover:text-[#00d4ff]"
            >
              Xizmatlar
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#00d4ff]/50 bg-[#0a1628]/80 px-3 py-2 text-xs text-white shadow-[0_0_16px_rgba(0,212,255,0.2)] transition-all duration-300 hover:scale-[1.03] hover:border-[#00d4ff] hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] sm:px-4 sm:text-sm"
            >
              <Send className="h-4 w-4 text-[#00d4ff] animate-pulse" />
              <span className="hidden sm:inline">Telegram orqali kirish</span>
              <span className="sm:hidden">Telegram</span>
            </a>

            <button
              type="button"
              className="group flex items-center gap-2 text-sm text-white transition-all duration-300 hover:text-[#00d4ff]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00d4ff]/40 bg-[#0a1628] transition-all duration-300 group-hover:scale-105 group-hover:border-[#00d4ff]">
                <User className="h-4 w-4 text-[#00d4ff]" />
              </span>
              <span className="font-medium">Kirish</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section
          id="bosh-sahifa"
          className="relative flex min-h-[90vh] items-center overflow-hidden"
        >
          <HeroBackground />

          <div className="relative z-10 mx-auto flex min-h-[calc(90vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl rounded-2xl border border-white/5 bg-[#020812]/40 p-6 backdrop-blur-md sm:p-8 md:bg-[#020812]/0 md:p-0 md:backdrop-blur-none">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#0a1628]/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-[#00d4ff]" />
                AI logistika platformasi
              </p>
              <h1 className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-3xl font-extrabold uppercase leading-tight tracking-wide text-transparent text-glow sm:text-4xl lg:text-5xl">
                Logistikaning kelajagi: AI va raqamli innovatsiyalar
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                O&apos;zbekiston bo&apos;ylab aqlli, samarali va barqaror
                yetkazib berish yechimlari.
              </p>
              <Link
                href="#xizmatlar"
                className="mt-8 inline-flex rounded-lg bg-gradient-to-r from-[#00d4ff] via-[#0ea5e9] to-[#6366f1] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] hover:brightness-110"
              >
                Xizmatlarni ko&apos;rish
              </Link>
            </div>
          </div>
        </section>

        <section
          id="xizmatlar"
          className="relative border-t border-cyan-500/10 bg-[#050f1f] py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Biz haqimizda
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                Biz O&apos;zbekistonda logistika sohasini sun&apos;iy intellekt
                va raqamli texnologiyalar yordamida rivojlantirishga
                intilamiz. Bizning maqsadimiz — aqlli marshrutlash, xavfsiz
                yetkazib berish va zamonaviy logistika ekotizimini yaratish.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Sun&apos;iy intellekt texnologiyalari
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {AI_ICONS.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-[#00d4ff]/30 bg-gradient-to-b from-[#0a1628] to-[#050f1f] p-3 shadow-card transition hover:border-[#00d4ff]/70 hover:shadow-glow-sm"
                  >
                    <Icon className="h-9 w-9 text-[#00d4ff] drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] transition group-hover:scale-110" />
                    <span className="text-center text-[10px] font-medium uppercase tracking-wide text-slate-500 group-hover:text-[#00d4ff]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="kontaktlar"
          className="relative border-t border-cyan-500/10 bg-[#020812] py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Kontaktlar
              </h2>
              <div className="mt-8 rounded-xl border border-[#00d4ff]/40 bg-[#0a1628]/80 p-6 shadow-card sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]">
                  Loyiha dasturchisi haqida ma&apos;lumot
                </p>
                <p className="mt-4 text-sm font-medium text-white sm:text-base">
                  Dasturchi: Abdumannon Rabbimqulov Abdumutal o&apos;g&apos;li
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Mail className="h-5 w-5 shrink-0 text-[#00d4ff]" />
                    <a
                      href="mailto:rabbimqulovabdumannon588@gmail.com"
                      className="hover:text-[#00d4ff]"
                    >
                      rabbimqulovabdumannon588@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Send className="h-5 w-5 shrink-0 text-[#00d4ff]" />
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#00d4ff]"
                    >
                      @{TELEGRAM_USERNAME}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Phone className="h-5 w-5 shrink-0 text-[#00d4ff]" />
                    <a href="tel:+998991134543" className="hover:text-[#00d4ff]">
                      +998 99 113 45 43
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <UzbekistanMap />
            </div>
          </div>
        </section>

        <footer className="border-t border-cyan-500/10 py-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LOGISTIC.UZ — Logistika AI
        </footer>
      </main>
    </div>
  );
}
