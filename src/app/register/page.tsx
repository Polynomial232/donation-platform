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

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Royal Handle must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Royal Handle can only contain letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid dispatch address"),
    password: z
      .string()
      .min(8, "Passkey must be at least 8 characters")
      .regex(/[A-Z]/, "Passkey must contain at least one uppercase letter")
      .regex(/[a-z]/, "Passkey must contain at least one lowercase letter")
      .regex(/[0-9]/, "Passkey must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Passkey must contain at least one special character"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passkeys do not match",
    path: ["password_confirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const { data: authSettingsData } = useQuery({
    queryKey: ["auth-settings"],
    queryFn: discoveryService.getAuthSettings,
  });

  const isGoogleEnabled = authSettingsData?.data?.is_google_login_enabled ?? true;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.status_code === 201 || response.status_code === 200) {
        toast.success(response.message || "Enlistment Successful!");
        router.push("/register/success");
      } else {
        throw new Error(response.message || "Enlistment failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Enlistment failed. Please try again."
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
          <h1 className="text-2xl font-extrabold text-slate-900">Enlist for thy Royal Scroll</h1>
          <p className="text-slate-500 font-medium text-sm">
            Become a sovereign of the realm and start receiving tributes today.
          </p>
        </div>

        <Card className="p-8 border-none shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Royal Handle
              </label>
              <input
                {...register("username")}
                type="text"
                className={`w-full bg-slate-50 border ${
                  errors.username ? "border-red-400 ring-1 ring-red-400" : "border-slate-100"
                } rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) outline-none font-medium transition-all`}
                placeholder="GamingWarrior"
              />
              {errors.username && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.username.message}
                </p>
              )}
            </div>

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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Secret Passkey
              </label>
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
              {errors.password ? (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-medium ml-1">
                  Min. 8 characters with upper, lower, number, and symbol.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Verify Passkey
              </label>
              <div className="relative group">
                <input
                  {...register("password_confirmation")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full bg-slate-50 border ${
                    errors.password_confirmation
                      ? "border-red-400 ring-1 ring-red-400"
                      : "border-slate-100"
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
              className="w-full rounded-xl py-6 font-bold text-base shadow-lg shadow-purple-500/10 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow)"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording enlistment...
                </>
              ) : (
                "Enlist Now"
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
                    Or enlist through other realms
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
                  Enlist with Google
                </Button>
              </div>
            </>
          )}
        </Card>

        <p className="text-center text-sm font-medium text-slate-500">
          Already a sovereign?{" "}
          <Link
            href="/login"
            className="text-(--color-deep-purple) font-extrabold hover:underline transition-all"
          >
            Enter the Gates
          </Link>
        </p>
      </div>
    </div>
  );
}
