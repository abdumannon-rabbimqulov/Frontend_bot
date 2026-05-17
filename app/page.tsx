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
import Image from "next/image";
import Link from "next/link";
import { UzbekistanMap } from "@/components/home/uzbekistan-map";

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
              LOGISTIC.UZ.UZ
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
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#00d4ff]/50 bg-[#0a1628]/80 px-3 py-2 text-xs text-white shadow-[0_0_16px_rgba(0,212,255,0.2)] transition hover:border-[#00d4ff] sm:px-4 sm:text-sm"
            >
              <Send className="h-4 w-4 text-[#00d4ff]" />
              <span className="hidden sm:inline">Telegram orqali kirish</span>
              <span className="sm:hidden">Telegram</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 text-sm text-white transition hover:text-[#00d4ff]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00d4ff]/40 bg-[#0a1628]">
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
          className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.png"
              alt="AI logistika — futuristik yuk mashinasi"
              fill
              priority
              className="object-cover object-[70%_center] opacity-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020812] via-[#020812]/85 to-[#020812]/30" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="max-w-3xl text-3xl font-extrabold uppercase leading-tight tracking-wide text-white text-glow sm:text-4xl lg:text-5xl">
              Logistikaning kelajagi: AI va raqamli innovatsiyalar
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              O&apos;zbekiston bo&apos;ylab aqlli, samarali va barqaror
              yetkazib berish yechimlari.
            </p>
            <Link
              href="#xizmatlar"
              className="mt-8 inline-flex rounded-lg bg-gradient-to-r from-[#00d4ff] via-[#0ea5e9] to-[#6366f1] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition hover:brightness-110"
            >
              Xizmatlarni ko&apos;rish
            </Link>
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
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border border-[#00d4ff]/30 bg-[#0a1628]/60 shadow-card transition hover:border-[#00d4ff]/60"
                  >
                    <Icon className="h-10 w-10 text-[#00d4ff] drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]" />
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
                    <span>Abdumannonrab</span>
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
          © {new Date().getFullYear()} LOGISTIC.UZ.UZ — Logistika AI
        </footer>
      </main>
    </div>
  );
}
