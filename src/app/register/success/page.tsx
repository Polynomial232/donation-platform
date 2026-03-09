"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-off-white) p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-(--color-accent-yellow) rounded-xl flex items-center justify-center text-(--color-deep-purple) font-black text-xl shadow-sm">
              D
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">DukuNasia</span>
          </Link>
        </div>

        <Card className="p-8 border-none shadow-2xl bg-white rounded-3xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Registrasi Berhasil!</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
              Akun kamu telah berhasil dibuat. Silakan periksa kotak masuk email kamu untuk
              mengaktifkan akun.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-(--color-deep-purple)">
              <Mail size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Cek Email Kamu
              </p>
              <p className="text-[11px] text-slate-400 font-medium italic">
                Cek juga folder <b>Spam</b> jika tidak ada di Inbox.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full rounded-xl py-6 font-bold text-base bg-(--color-deep-purple) text-white hover:bg-opacity-90 transition-all shadow-lg shadow-purple-100 p-0">
              <Link
                href="https://mail.google.com"
                target="_blank"
                className="w-full h-full flex items-center justify-center px-6"
              >
                Buka Email
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full rounded-xl py-6 font-bold text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-0"
            >
              <Link href="/login" className="w-full h-full flex items-center justify-center px-6">
                Kirim ulang email aktivasi
              </Link>
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm font-medium text-slate-500 italic">
          Butuh bantuan?{" "}
          <Link href="/bantuan" className="text-(--color-deep-purple) font-bold hover:underline">
            Hubungi Support
          </Link>
        </p>
      </div>
    </div>
  );
}
