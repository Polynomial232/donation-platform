"use client";

import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Gift, Volume2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DonationFormValues } from "./DonationWrapper";

import { CreatorSettings } from "@/types/discovery";

interface DonationFormProps {
  onSuccess?: (values: DonationFormValues) => void;
  settings: CreatorSettings;
}

export function DonationForm({ onSuccess, settings }: DonationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DonationFormValues>();

  const activeTab = watch("activeTab");
  const amount = watch("amount");
  const isEmailPrivate = watch("isEmailPrivate");

  const onSubmit = (data: DonationFormValues) => {
    console.log("Donation Submitting:", data);
    onSuccess?.(data);
  };

  const showTabs = settings.isSoundEnabled; // Hide tabs if sound is disabled (assuming Gift is always the default)

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      {settings.isSoundEnabled && (
        <div className="flex p-2 gap-1 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setValue("activeTab", "gift")}
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
            type="button"
            onClick={() => setValue("activeTab", "sound")}
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
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nama Pengirim
            </label>
            <input
              type="text"
              {...register("senderName")}
              placeholder="Siluman Taplak Meja"
              className={cn(
                "w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none font-medium placeholder:text-slate-300 text-slate-800",
                errors.senderName
                  ? "ring-2 ring-red-100 placeholder:text-red-200"
                  : "focus:ring-[var(--color-pastel-purple)]"
              )}
            />
            {errors.senderName && (
              <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.senderName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="space-y-2">
              <input
                type="email"
                {...register("email")}
                placeholder="nama@email.com"
                className={cn(
                  "w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none font-medium placeholder:text-slate-300 text-slate-800",
                  isEmailPrivate && "blur-[3px] focus:blur-none transition-all duration-300",
                  errors.email ? "ring-2 ring-red-100" : "focus:ring-[var(--color-pastel-purple)]"
                )}
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email.message}</p>
              )}

              <div
                onClick={() => setValue("isEmailPrivate", !isEmailPrivate)}
                className="flex items-center gap-2 cursor-pointer select-none group"
              >
                <span
                  className={cn(
                    "text-xs font-bold transition-colors flex items-center gap-1.5",
                    isEmailPrivate
                      ? "text-[var(--color-deep-purple)]"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                >
                  {isEmailPrivate ? <EyeOff size={14} /> : <Eye size={14} />}
                  {isEmailPrivate
                    ? "Email disembunyikan dari Creator"
                    : "Sembunyikan email dari Creator"}
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
              {...register("message")}
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
                value={amount === 0 ? "" : amount?.toLocaleString("id-ID") || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  const numberValue = Number(value);
                  setValue("amount", isNaN(numberValue) ? 0 : numberValue);
                }}
                disabled={activeTab === "sound"}
                placeholder="0"
                className={cn(
                  "w-full bg-slate-50 border-none rounded-2xl pl-16 pr-4 py-4 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-[var(--color-pastel-purple)] outline-none",
                  activeTab === "sound" &&
                    "opacity-60 cursor-not-allowed bg-slate-100 text-slate-500"
                )}
              />
            </div>
            {errors.amount && (
              <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.amount.message}</p>
            )}

            <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">
              Jumlah Minimum Muncul di Alert:{" "}
              <span className="text-slate-600">
                IDR {settings.minAlertAmount.toLocaleString("id-ID")}
              </span>
            </p>

            {(amount ?? 0) > 0 && (amount ?? 0) < settings.minAlertAmount && (
              <div className="mt-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-[10px] font-bold flex items-start gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                <span className="text-lg leading-none">⚠️</span>
                <span className="leading-tight">
                  Hadiah kamu tidak akan tampil di alert kreator karena jumlahnya kurang dari IDR{" "}
                  {settings.minAlertAmount.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>

          {activeTab !== "sound" && (
            <div className="grid grid-cols-3 gap-2">
              {settings.fastAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue("amount", amt)}
                  className={cn(
                    "py-3 rounded-2xl text-[11px] font-medium transition-all",
                    amount === amt
                      ? "bg-[var(--color-pastel-yellow)] text-[var(--color-deep-purple)] font-bold ring-2 ring-[var(--color-accent-yellow)] ring-offset-2"
                      : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  IDR {amt.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}
