"use client";

import { authService } from "@/services/auth";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Rocket } from "lucide-react";

function ActivationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const token = searchParams.get("token");

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await authService.activate(token);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    activateAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-off-white) p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-(--color-accent-yellow) rounded-xl flex items-center justify-center text-(--color-deep-purple) font-black text-xl shadow-sm">
              D
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">DukuNasia</span>
          </Link>
        </div>

        <Card className="p-10 border-none shadow-2xl bg-white rounded-3xl text-center">
          {status === "loading" && (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-(--color-deep-purple) mx-auto">
                <Loader2 size={40} className="animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold text-slate-900">Mengaktivasi Akun...</h1>
                <p className="text-slate-500 text-sm font-medium">
                  Bentar ya, lagi verifikasi data kamu.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto">
                <Rocket size={40} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900">Selamat Berbagi! 💜</h1>
                <p className="text-slate-500 text-sm font-medium px-4">
                  Akun kamu sudah aktif. Sekarang kamu bisa mulai mencari kreator favorit atau mulai
                  mendapatkan dukungan!
                </p>
              </div>
              <div className="pt-2">
                <Button className="w-full rounded-xl py-6 font-bold text-base bg-(--color-deep-purple) text-white hover:bg-opacity-90 transition-all shadow-lg shadow-purple-100 p-0">
                  <Link
                    href="/login"
                    className="w-full h-full flex items-center justify-center px-6"
                  >
                    Masuk ke Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-8">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                <XCircle size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900">Oops! Link Tidak Valid</h1>
                <p className="text-slate-500 text-sm font-medium px-4">
                  Link aktivasi kamu mungkin sudah kedaluwarsa atau tidak valid. Silakan coba kirim
                  ulang email aktivasi.
                </p>
              </div>
              <div className="pt-2">
                <Button className="w-full rounded-xl py-6 font-bold text-base bg-slate-900 text-white hover:bg-slate-800 transition-all p-0">
                  <Link
                    href="/register"
                    className="w-full h-full flex items-center justify-center px-6"
                  >
                    Daftar Ulang
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivationContent />
    </Suspense>
  );
}
