"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf besar")
      .regex(/[a-z]/, "Harus mengandung huruf kecil")
      .regex(/[0-9]/, "Harus mengandung angka")
      .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      toast.error("Token reset password tidak valid");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token, {
        password: data.password,
      });

      toast.success(response.message || "Password berhasil diubah!");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-off-white) p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-xl font-bold text-red-500">Token Tidak Valid</h1>
          <p className="text-slate-500 font-medium">
            Link reset password kamu tidak valid atau sudah kedaluwarsa.
          </p>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Minta Link Baru</Link>
          </Button>
        </Card>
      </div>
    );
  }

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
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900">Password Baru 🔒</h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Silakan buat password baru yang kuat untuk akun kamu.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Password Baru
                </label>
                <div className="relative group">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-slate-50 border ${
                      errors.password ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                    } rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) outline-none font-medium transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-(--color-deep-purple) transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <input
                    {...register("password_confirmation")}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full bg-slate-50 border ${
                      errors.password_confirmation
                        ? "border-red-400 ring-1 ring-red-400"
                        : "border-slate-200"
                    } rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) outline-none font-medium transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-(--color-deep-purple) transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                    {errors.password_confirmation.message}
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
                  "Reset Password"
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
