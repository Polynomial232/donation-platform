import { Navbar } from "@/components/Navbar";

import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Zap, ShieldCheck, Gift, Volume2, Gavel } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-off-white)]">
      <div className="max-w-md mx-auto px-5 pt-8 space-y-10 pb-20">
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[var(--color-pastel-yellow)] rounded-full blur-2xl opacity-40 scale-110"></div>
            <Image
              alt="Mascot"
              width={160}
              height={160}
              className="w-40 h-40 mx-auto relative z-10"
              src="https://i.imgur.com/1Z3MVNG.jpeg"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Jembatan Dukungan Kreator
            </h1>
            <p className="text-slate-500 text-sm px-4">
              Platform donasi paling simpel, transparan, dan penuh kasih untuk kreator favoritmu.
            </p>
          </div>

          <div className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] p-2 flex items-center gap-2">
            <div className="pl-4 text-slate-400">
              <Search size={24} />
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 outline-none"
              placeholder="Cari kreator favoritmu..."
              type="text"
            />
            <button className="bg-[var(--color-accent-yellow)] p-3 rounded-2xl hover:bg-[var(--color-pastel-yellow)] transition-colors">
              <ArrowRight className="text-[var(--color-deep-purple)] block" />
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-center font-extrabold text-slate-800 tracking-tight">
            Kenapa DukuNasia?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-[var(--color-pastel-purple)] rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="text-[var(--color-deep-purple)]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Cepat & Instan</h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dukungan sampai dalam hitungan detik.
                </p>
              </div>
            </div>
            <div className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-[var(--color-pastel-yellow)] rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="text-[var(--color-deep-purple)]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">100% Aman</h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Keamanan berlapis untuk tiap transaksi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Widget */}
        <section className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] overflow-hidden pointer-events-none opacity-90 select-none transform scale-95 border-4 border-slate-50 relative">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-100">
              <span className="text-xs font-bold text-[var(--color-deep-purple)] uppercase tracking-widest">
                Interactive Demo
              </span>
            </div>
          </div>

          <div className="flex bg-slate-50/50 p-2 gap-1 blur-[1px]">
            <button className="flex-1 py-3 px-2 rounded-2xl bg-white text-slate-900 font-bold text-[11px] flex flex-col items-center gap-1 shadow-sm">
              <Gift className="text-[var(--color-deep-purple)]" size={18} />
              <span>Hadiah</span>
              <div className="h-1 w-4 rounded-full bg-[var(--color-accent-yellow)] mt-1"></div>
            </button>
            <button className="flex-1 py-3 px-2 rounded-2xl text-slate-400 font-bold text-[11px] flex flex-col items-center gap-1">
              <Volume2 size={18} />
              <span>Sound</span>
            </button>
            <button className="flex-1 py-3 px-2 rounded-2xl text-slate-400 font-bold text-[11px] flex flex-col items-center gap-1">
              <Gavel size={18} />
              <span>Lelang</span>
            </button>
          </div>
          <div className="p-6 space-y-6 blur-[1px]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Pengirim
                </label>
                <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-800 font-medium">
                  Nama samaranmu
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Pesan
                </label>
                <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-500 h-24">
                  Tulis dukungan hangatmu...
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Supported By
          </p>
          <div className="flex justify-center items-center gap-8 opacity-40 grayscale contrast-125">
            <span className="font-black italic text-sm text-slate-800">GOPAY</span>
            <span className="font-black italic text-sm text-slate-800">OVO</span>
            <span className="font-black italic text-sm text-slate-800">DANA</span>
            <span className="font-black italic text-sm text-slate-800">QRIS</span>
          </div>
        </section>
      </div>
    </main>
  );
}
