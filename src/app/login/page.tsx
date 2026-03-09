"use client";

import { useQuery } from "@tanstack/react-query";
import { discoveryService } from "@/services/discovery";
import { authService } from "@/services/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().min(1, "Username atau Email wajib diisi"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { data: authSettingsData } = useQuery({
    queryKey: ["auth-settings"],
    queryFn: discoveryService.getAuthSettings,
  });

  const isGoogleEnabled = authSettingsData?.data?.is_google_login_enabled ?? true;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.login({
        username: data.email,
        password: data.password,
      });

      if (response.status_code === 200) {
        toast.success("Login Berhasil!");
        router.push("/dashboard");
      } else {
        throw new Error(response.message || "Gagal masuk");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal masuk. Periksa email atau password."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-slate-900">Selamat Datang Kembali!</h1>
          <p className="text-slate-500 font-medium text-sm">
            Masuk untuk mengelola halaman kreator kamu.
          </p>
        </div>

        <Card className="p-8 border-none shadow-lg bg-white rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="anda@email.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pr-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-(--color-deep-purple) hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
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

            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-slate-400 hover:text-(--color-deep-purple) transition-colors"
              >
                Lupa password? 🔑
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-6 font-bold text-base shadow-lg shadow-yellow-100 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow)"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>

          {isGoogleEnabled && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-white px-3 text-slate-400 font-black">Atau masuk dengan</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl py-6 font-bold gap-3 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="Google"
                />
                Google
              </Button>
            </>
          )}
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-(--color-deep-purple) font-extrabold hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
