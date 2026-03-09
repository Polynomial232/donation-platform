"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { discoveryService } from "@/services/discovery";
import Link from "next/link";
import { Search, ArrowRight, Zap, ShieldCheck, Gift, Volume2, Gavel, Compass } from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Lightning":
      return <Zap className="text-[var(--color-deep-purple)]" />;
    case "Shield":
      return <ShieldCheck className="text-[var(--color-deep-purple)]" />;
    case "Gift":
      return <Gift className="text-[var(--color-deep-purple)]" size={18} />;
    case "Volume2":
      return <Volume2 size={18} />;
    case "Gavel":
      return <Gavel size={18} />;
    default:
      return null;
  }
};

export default function LandingPage() {
  const landingQuery = useQuery({
    queryKey: ["landing-data"],
    queryFn: discoveryService.getLanding,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!landingQuery.isError) return;

    const error = landingQuery.error as any;
    const errorMessage =
      error?.response?.data?.message || error?.message || "Gagal memuat data landing";
    toast.error(errorMessage);
  }, [landingQuery.isError, landingQuery.error]);

  if (landingQuery.isLoading || !landingQuery.data?.data) {
    return (
      <main className="min-h-screen bg-[var(--color-off-white)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--color-deep-purple)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Bentar ya...</p>
        </div>
      </main>
    );
  }

  const landing = landingQuery.data.data;

  const hero = landing?.hero;
  const features = landing?.features;
  const demo = landing?.demo;
  const supportedBy = landing?.site_setting?.supported_by;

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
              src={hero.image_url}
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{hero.title}</h1>
            <p className="text-slate-500 text-sm px-4">{hero.subtitle}</p>
          </div>

          <div className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] p-2 flex items-center gap-2">
            <div className="pl-4 text-slate-400">
              <Search size={24} />
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 outline-none"
              placeholder={hero.search_placeholder}
              type="text"
            />
            <button className="bg-[var(--color-accent-yellow)] p-3 rounded-2xl hover:bg-[var(--color-pastel-yellow)] transition-colors">
              <ArrowRight className="text-[var(--color-deep-purple)] block" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-[var(--color-deep-purple)] text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-purple-200 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Compass size={16} />
              Explore Kreator
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-deep-purple)] font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-slate-100 border border-slate-200 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Register
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-center font-extrabold text-slate-800 tracking-tight">
            {features.title}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {features.items.map(
              (item: { icon: string; title: string; description: string }, idx: number) => (
                <div
                  key={idx}
                  className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.01)] rounded-[32px] p-5 text-center space-y-3"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${idx === 0 ? "bg-[var(--color-pastel-purple)]" : "bg-[var(--color-pastel-yellow)]"}`}
                  >
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                  </div>
                </div>
              )
            )}
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
            {demo.tabs.map((tab: { icon: string; label: string }, idx: number) => (
              <button
                key={idx}
                className={
                  idx === 0
                    ? "flex-1 py-3 px-2 rounded-2xl bg-white text-slate-900 font-bold text-[11px] flex flex-col items-center gap-1 shadow-sm"
                    : "flex-1 py-3 px-2 rounded-2xl text-slate-400 font-bold text-[11px] flex flex-col items-center gap-1"
                }
              >
                {getIcon(tab.icon)}
                <span>{tab.label}</span>
                {idx === 0 && (
                  <div className="h-1 w-4 rounded-full bg-[var(--color-accent-yellow)] mt-1"></div>
                )}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-6 blur-[1px]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Pengirim
                </label>
                <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-800 font-medium">
                  {demo.placeholder_name}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Pesan
                </label>
                <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-500 h-24">
                  {demo.placeholder_message}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            {supportedBy.title}
          </p>
          <div className="flex justify-center items-center gap-8 opacity-40 grayscale contrast-125 flex-wrap">
            {supportedBy.partners.map((partner: { name: string }, idx: number) => (
              <span key={idx} className="font-black italic text-sm text-slate-800">
                {partner.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
