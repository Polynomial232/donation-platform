"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Music, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSchema = z.object({
  minDonation: z.number().min(1000, "Minimum IDR 1.000"),
  isTtsEnabled: z.boolean(),
  overlayUrl: z.string().url(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      minDonation: 10000,
      isTtsEnabled: true,
      overlayUrl: "https://dukun.asia/overlay/xyz882190021-secret-key",
    },
  });

  const isTtsEnabled = watch("isTtsEnabled");
  const minDonation = watch("minDonation");

  const onSubmit = (data: SettingsFormValues) => {
    console.log("Saving settings:", data);
    alert("Settings saved! (Mock)");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Settings</h2>
        <p className="text-slate-500 font-medium">Configure your overlays and payout methods.</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Overlay Configuration</h3>
        <Card className="p-6 border-none shadow-sm space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                My Overlay URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {watch("overlayUrl")}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(watch("overlayUrl"));
                    alert("URL Copied!");
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                *Paste this URL into OBS Browser Source. Keep it secret!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-800">Alert Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600">Min. Donation Amount</span>
                      {errors.minDonation && (
                        <span className="text-[10px] text-red-500">
                          {errors.minDonation.message}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">IDR</span>
                      <input
                        type="number"
                        {...register("minDonation", { valueAsNumber: true })}
                        className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-[var(--color-deep-purple)] focus:outline-none focus:border-[var(--color-deep-purple)]"
                      />
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setValue("isTtsEnabled", !isTtsEnabled)}
                  >
                    <span className="text-sm font-bold text-slate-600">Text-to-Speech</span>
                    <div
                      className={cn(
                        "w-10 h-6 rounded-full relative transition-colors",
                        isTtsEnabled ? "bg-[var(--color-accent-yellow)]" : "bg-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all",
                          isTtsEnabled ? "right-1" : "left-1"
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-800">Media Assets</h4>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer min-h-[140px]">
                  <div className="w-10 h-10 bg-[var(--color-pastel-purple)] rounded-full flex items-center justify-center text-[var(--color-deep-purple)]">
                    <Music size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600">Upload Alert Sound</p>
                    <p className="text-[10px] text-slate-400">MP3/WAV up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                type="submit"
                className="rounded-xl px-8 bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-bold h-11"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
