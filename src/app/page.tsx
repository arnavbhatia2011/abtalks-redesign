import Link from "next/link";
import { ArrowRight, Code2, Flame, Share2, ShieldCheck, Trophy, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Header */}
      <header className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base">
            AB
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ABTalks</span>
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
        >
          Sign In
        </Link>
      </header>

      {/* Main Content (390px Optimized Padding) */}
      <main className="flex-1 p-5 space-y-7">
        
        {/* Hero Section */}
        <section className="space-y-4 text-center pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-800/60 text-orange-400 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>60-Day Student Challenge</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Build Consistency. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Get Hired.
            </span>
          </h1>

          <p className="text-xs text-neutral-400 leading-relaxed px-2">
            Build one project every night after college. Submit proof of work on GitHub & LinkedIn to build a public streak that recruiters notice.
          </p>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-950/50 transition active:scale-[0.98]"
            >
              <span>Accept 60-Day Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 3-Step Proof-of-Work System */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            How It Works Daily
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-neutral-800 text-orange-400 shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">1. Receive Daily Task</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Get practical coding challenges designed for college tracks every night.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-neutral-800 text-amber-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">2. Submit Dual Proof</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Submit your GitHub commit & share a quick update post on LinkedIn.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-neutral-800 text-emerald-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">3. Stand Out to Recruiters</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Maintain your streak to rank on the public student talent board.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-black text-white">1,250+</div>
            <div className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-neutral-500" /> Students
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-orange-400">60 Days</div>
            <div className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" /> Proof
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-neutral-800/80 text-center text-neutral-600 text-xs">
        ABTalks • Designed Mobile-First (390px)
      </footer>
    </div>
  );
}
