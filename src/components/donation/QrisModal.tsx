"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Copy, AlertCircle, RefreshCw, CheckCircle2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QrisModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
}

export function QrisModal({ isOpen, onClose, amount }: QrisModalProps) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [status, setStatus] = useState<"pending" | "success">("pending");

    useEffect(() => {
        if (!isOpen) return;

        // Reset state when opened
        setTimeLeft(300);
        setStatus("pending");

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Simulator: Payment success after 5 seconds to demonstrate the invoice view
        const successTimer = setTimeout(() => {
            setStatus("success");
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(successTimer);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const InvoiceView = () => (
        <div className="bg-white rounded-[32px] w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-4 border-slate-50">
            <div className="bg-[var(--color-accent-yellow)] p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="mb-4 bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <CheckCircle2 size={32} className="text-green-500" strokeWidth={3} />
                </div>
                <h3 className="font-black text-slate-900 text-xl uppercase tracking-wide">Pembayaran Berhasil!</h3>
                <p className="text-slate-700 text-sm font-bold mt-1">Terima kasih atas dukunganmu</p>
            </div>

            <div className="px-6 py-6 space-y-6 relative">
                {/* Ticket jagged edge effect */}
                <div className="absolute top-0 left-0 w-full h-4 -mt-2 bg-white skew-y-0 flex justify-between px-2">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-[var(--color-accent-yellow)] -mt-2"></div>
                    ))}
                </div>

                <div className="text-center space-y-1 pt-2">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Dibayar</p>
                    <p className="text-3xl font-black text-[var(--color-deep-purple)]">IDR {amount.toLocaleString('id-ID')}</p>
                </div>

                <div className="space-y-4 border-t border-dashed border-slate-200 pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">ID Transaksi</span>
                        <span className="font-bold text-slate-800">INV-{Math.floor(Date.now() / 1000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Tanggal</span>
                        <span className="font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Metode</span>
                        <span className="font-bold text-slate-800">QRIS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Kepada</span>
                        <span className="font-bold text-slate-800">Content Creator</span>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button className="w-full bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-bold py-3 rounded-2xl gap-2 shadow-lg shadow-purple-200">
                        <Download size={16} />
                        Download Invoice
                    </Button>
                    <Button variant="outline" className="w-full border-2 border-slate-100 text-slate-600 font-bold py-3 rounded-2xl gap-2 hover:bg-slate-50" onClick={onClose}>
                        Tutup
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Bukti pembayaran ini sah dan diterbitkan oleh DukuNasia</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {status === 'success' ? <InvoiceView /> : (
                /* Modal Content - Pending State */
                <div className="bg-white rounded-[32px] w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-4 border-slate-50">
                    {/* Header */}
                    <div className="bg-[var(--color-pastel-purple)] p-5 text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1.5 rounded-full text-[var(--color-deep-purple)] transition-colors"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                        <h3 className="font-extrabold text-[var(--color-deep-purple)] text-lg">Selesaikan Pembayaran</h3>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col items-center space-y-5">

                        <div className="text-center space-y-1">
                            <div className="w-16 h-8 bg-white border-2 border-slate-100 rounded-lg mx-auto flex items-center justify-center shadow-sm mb-2">
                                <span className="font-bold text-slate-800 text-xs tracking-widest">QRIS</span>
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Nominal</p>
                            <p className="text-2xl font-black text-slate-900">IDR {amount.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="bg-[var(--color-pastel-yellow)] text-[var(--color-deep-purple)] px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 animate-pulse">
                            <RefreshCw size={12} className="animate-spin" />
                            Menunggu Pembayaran
                        </div>

                        {/* QR Code Container */}
                        <div className="relative group">
                            <div className="w-56 h-56 bg-white border-4 border-slate-100 rounded-3xl p-2 shadow-inner flex items-center justify-center relative">
                                {/* Placeholder for QR Code - typically you'd fetch this or generate it */}
                                <Image
                                    // src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DukuNasia-Pay-${amount}`}
                                    src={`https://i.imgur.com/1Z3MVNG.jpeg`}
                                    alt="QRIS Code"
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-contain mix-blend-multiply opacity-90"
                                />

                                {/* Mascot in Center */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full p-1 shadow-lg flex items-center justify-center">
                                    <Image
                                        src="https://i.imgur.com/1Z3MVNG.jpeg"
                                        alt="Mascot"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold text-center mt-2">ID: DKN-{Math.floor(Math.random() * 1000000)}</p>
                        </div>

                        <div className="text-center space-y-2 w-full">
                            <p className="text-xs text-slate-500 font-medium">Selesaikan dalam <span className="font-bold text-red-500">{formatTime(timeLeft)}</span></p>

                            <Button
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl gap-2 h-auto text-xs"
                            >
                                <Copy size={14} />
                                Salin Detail Pembayaran
                            </Button>
                        </div>

                        {/* Footer / Help */}
                        <div className="pt-4 border-t border-slate-50 w-full space-y-3">
                            <div className="flex items-start gap-2 bg-red-50 p-3 rounded-xl">
                                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-red-600/80 font-medium leading-tight text-left">
                                    Jika status belum berubah setelah 5 menit pembayaran, klik tombol di bawah untuk bantuan admin.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="text-[11px] font-bold text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-colors">
                                    Laporkan Masalah
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-[11px] font-bold text-slate-400 hover:bg-slate-50 py-2.5 rounded-xl transition-colors"
                                >
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
