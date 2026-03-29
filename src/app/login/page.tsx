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
import { BGPattern } from "@/components/ui/bg-pattern";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().min(1, "Dispatch address is required"),
  password: z.string().min(1, "Passkey cannot be empty"),
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
        toast.success("Welcome, sovereign!");
        router.push("/dashboard");
      } else {
        throw new Error(response.message || "Entry denied");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Entry denied. Check thy credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <BGPattern
        variant="grid"
        size={32}
        fill="rgba(0,0,0,0.04)"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Decorative Glowing Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-(--color-pastel-purple) mix-blend-multiply blur-[120px] opacity-40 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-(--color-pastel-yellow) mix-blend-multiply blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-(--color-accent-yellow) rounded-xl flex items-center justify-center text-(--color-deep-purple) font-black text-xl shadow-sm uppercase">
              {process.env.NEXT_PUBLIC_APP_NAME?.charAt(0) || "D"}
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              {process.env.NEXT_PUBLIC_APP_NAME || "DukuNasia"}
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Re-enter the Royal Keep</h1>
          <p className="text-slate-500 font-medium text-sm">
            Access thy scroll to manage thy kingdom's tributes.
          </p>
        </div>

        <Card className="p-8 border-none shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Dispatch Address
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full bg-slate-50 border ${
                  errors.email ? "border-red-400 ring-1 ring-red-400" : "border-slate-100"
                } rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) outline-none font-medium transition-all`}
                placeholder="thy@email.com"
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
                  Secret Passkey
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-(--color-deep-purple) hover:underline"
                >
                  Forgot Passkey?
                </Link>
              </div>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-slate-50 border ${
                    errors.password ? "border-red-400 ring-1 ring-red-400" : "border-slate-100"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-6 font-bold text-base shadow-lg shadow-purple-500/10 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow)"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Granting access...
                </>
              ) : (
                "Enter the Gates"
              )}
            </Button>
          </form>

          {isGoogleEnabled && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-400">
                  <span className="bg-white/50 backdrop-blur-md px-3 font-black">
                    Or enter through other realms
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full rounded-xl py-6 font-bold gap-3 border-slate-100 bg-white/50 hover:bg-slate-50 transition-all"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-5 h-5"
                    alt="Google"
                  />
                  Authenticate with Google
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-slate-500">
            Not yet a sovereign?{" "}
            <Link
              href="/register"
              className="text-(--color-deep-purple) font-extrabold hover:underline transition-all"
            >
              Enlist for thy scroll
            </Link>
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Return to the Courtyard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
