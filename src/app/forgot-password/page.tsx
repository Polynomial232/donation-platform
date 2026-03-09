"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success(response.message || "Permintaan reset password terkirim");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-off-white) p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-(--color-accent-yellow) rounded-xl flex items-center justify-center text-(--color-deep-purple) font-black text-xl shadow-sm">
              D
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">DukuNasia</span>
          </Link>
        </div>

        <Card className="p-8 border-none shadow-2xl bg-white rounded-3xl">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900">Lupa Password? 🔑</h1>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Masukkan email kamu dan kami akan mengirimkan instruksi untuk reset password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full bg-slate-50 border ${
                      errors.email ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                    } rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) outline-none font-medium transition-all`}
                    placeholder="email@contoh.com"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl py-6 font-bold text-base shadow-lg shadow-yellow-100 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow)"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Kirim Instruksi"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-slate-900">Email Terkirim!</h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
                  Silakan periksa kotak masuk email kamu untuk melanjutkan proses reset password.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="w-full rounded-xl py-6 font-bold text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              >
                <Link href="/login">Kembali ke Login</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-(--color-deep-purple) transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali ke Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
