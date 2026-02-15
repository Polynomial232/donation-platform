"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Volume2, Gavel, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const amounts = [5000, 10000, 20000, 50000, 100000];

interface DonationFormProps {
    activeTab: "gift" | "sound" | "auction";
    setActiveTab: (tab: "gift" | "sound" | "auction") => void;
    amount: number;
    setAmount: (amount: number) => void;
}

export function DonationForm({ activeTab, setActiveTab, amount, setAmount }: DonationFormProps) {
    const [isEmailPrivate, setIsEmailPrivate] = useState(false);

    return (
        <Card className="overflow-hidden border-none shadow-sm">
            <div className="flex p-2 gap-1 bg-slate-50/50">
                <button
                    onClick={() => setActiveTab("gift")}
                    className={cn(
                        "flex-1 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all",
                        activeTab === "gift"
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-400 hover:bg-white/50"
                    )}
                >
                    <Gift
                        className={cn(
                            "w-6 h-6",
                            activeTab === "gift" ? "text-[var(--color-deep-purple)]" : "text-slate-400"
                        )}
                    />
                    <span>Hadiah</span>
                    {activeTab === "gift" && (
                        <div className="h-1 w-4 rounded-full bg-[var(--color-accent-yellow)] mt-1"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("sound")}
                    className={cn(
                        "flex-1 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all",
                        activeTab === "sound"
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-400 hover:bg-white/50"
                    )}
                >
                    <Volume2
                        className={cn(
                            "w-6 h-6",
                            activeTab === "sound" ? "text-[var(--color-deep-purple)]" : "text-slate-400"
                        )}
                    />
                    <span>Sound</span>
                    {activeTab === "sound" && (
                        <div className="h-1 w-4 rounded-full bg-[var(--color-accent-yellow)] mt-1"></div>
                    )}
                </button>
                {/* <button
                    onClick={() => setActiveTab("auction")}
                    className={cn(
                        "flex-1 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all",
                        activeTab === "auction"
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-400 hover:bg-white/50"
                    )}
                >
                    <Gavel
                        className={cn(
                            "w-6 h-6",
                            activeTab === "auction" ? "text-[var(--color-deep-purple)]" : "text-slate-400"
                        )}
                    />
                    <span>Lelang</span>
                    {activeTab === "auction" && (
                        <div className="h-1 w-4 rounded-full bg-[var(--color-accent-yellow)] mt-1"></div>
                    )}
                </button> */}
            </div>

            <div className="p-6 space-y-5">
                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Nama Pengirim
                        </label>
                        <input
                            type="text"
                            placeholder="Siluman Taplak Meja"
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] transition-all outline-none font-medium placeholder:text-slate-300 text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Email (Opsional)
                        </label>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                className={cn(
                                    "w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] transition-all outline-none font-medium placeholder:text-slate-300 text-slate-800",
                                    isEmailPrivate && "blur-[3px] focus:blur-none transition-all duration-300"
                                )}
                            />

                            <div
                                onClick={() => setIsEmailPrivate(!isEmailPrivate)}
                                className="flex items-center gap-2 cursor-pointer select-none group"
                            >
                                <span className={cn(
                                    "text-xs font-bold transition-colors flex items-center gap-1.5",
                                    isEmailPrivate ? "text-[var(--color-deep-purple)]" : "text-slate-400 group-hover:text-slate-600"
                                )}>
                                    {isEmailPrivate ? <EyeOff size={14} /> : <Eye size={14} />}
                                    {isEmailPrivate ? "Email disembunyikan dari Creator" : "Sembunyikan email dari Creator"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Pesan Dukungan
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Semangat terus kontennya! ✨"
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] transition-all resize-none outline-none font-medium placeholder:text-slate-300 text-slate-800"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Jumlah Hadiah
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-[var(--color-deep-purple)] font-bold text-sm bg-[var(--color-pastel-purple)] px-2 py-0.5 rounded-md">
                                    IDR
                                </span>
                            </div>
                            <input
                                type="text"
                                value={amount === 0 ? "" : amount.toLocaleString("id-ID")}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    const numberValue = Number(value);
                                    setAmount(numberValue);
                                }}
                                disabled={activeTab === 'sound'}
                                placeholder="0"
                                className={cn(
                                    "w-full bg-slate-50 border-none rounded-2xl pl-16 pr-4 py-4 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-[var(--color-pastel-purple)] outline-none",
                                    activeTab === 'sound' && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-500"
                                )}
                            />
                        </div>
                        {/* Minimum Amount Info */}
                        <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">
                            Jumlah Minimum Muncul di Alert: <span className="text-slate-600">IDR 5.000</span>
                        </p>

                        {/* Validation Alert */}
                        {amount > 0 && amount < 5000 && (
                            <div className="mt-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-[10px] font-bold flex items-start gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                                <span className="text-lg leading-none">⚠️</span>
                                <span className="leading-tight">
                                    Hadiah kamu tidak akan tampil di alert kreator karena jumlahnya kurang dari IDR 5.000
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Only show quick amount buttons if NOT in Sound tab (since Sound tab has fixed prices) */}
                    {activeTab !== 'sound' && (
                        <div className="grid grid-cols-3 gap-2">
                            {amounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className={cn(
                                        "py-3 rounded-2xl text-[11px] font-medium transition-all",
                                        amount === amt
                                            ? "bg-[var(--color-pastel-yellow)] text-[var(--color-deep-purple)] font-bold ring-2 ring-[var(--color-accent-yellow)] ring-offset-2"
                                            : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    IDR {amt >= 1000 ? `${amt / 1000}k` : amt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
