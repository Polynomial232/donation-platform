"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bell, Play, Save, Image as ImageIcon, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { cn } from "@/lib/utils";

const alertSchema = z.object({
  duration: z.number().min(1).max(30),
  animationType: z.enum(["fade", "slide", "bounce"]),
  minAmount: z.number().min(0),
  soundEnabled: z.boolean(),
  imageEnabled: z.boolean(),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export default function AlertOverlaySettingsPage() {
  const [testAlert, setTestAlert] = useState<OverlayEvent | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      duration: 5,
      animationType: "fade",
      minAmount: 10000,
      soundEnabled: true,
      imageEnabled: true,
    },
  });

  const formValues = watch();

  const handleTest = () => {
    setTestAlert({
      type: "donation",
      user: "Test_User",
      amount: formValues.minAmount || 50000,
      message: "This is a test donation message from the dashboard!",
    });
  };

  const onSubmit = (data: AlertFormValues) => {
    console.log("Saving alert settings:", data);
    alert("Alert settings saved! (Mock)");
  };

  return (
    <OverlaySettingsTemplate
      title="Notification Box"
      description="Configure alerts for donations, subscriptions, follows, and more."
      icon={<Bell size={24} />}
      type="alert"
      previewContent={
        testAlert ? (
          <Alert event={testAlert} onComplete={() => setTestAlert(null)} />
        ) : (
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-medium">No active notification.</p>
            <p className="text-xs text-slate-300">Click "Test Notification" to see a preview.</p>
          </div>
        )
      }
      extraActions={
        <Button
          onClick={handleTest}
          size="sm"
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
        >
          <Play size={14} /> Test Notification
        </Button>
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration (seconds)</label>
              <input
                type="number"
                {...register("duration", { valueAsNumber: true })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-deep-purple)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Min. Amount to Trigger</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                  IDR
                </span>
                <input
                  type="number"
                  {...register("minAmount", { valueAsNumber: true })}
                  className="w-full pl-10 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-deep-purple)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Display Options</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("soundEnabled", !formValues.soundEnabled)}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all",
                  formValues.soundEnabled
                    ? "border-[var(--color-deep-purple)] bg-[var(--color-pastel-purple)]/30 text-[var(--color-deep-purple)]"
                    : "border-slate-100 bg-slate-50 text-slate-400"
                )}
              >
                <div className="flex items-center gap-3">
                  <Music size={18} />
                  <span className="text-sm font-bold">Sound</span>
                </div>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    formValues.soundEnabled ? "bg-current animate-pulse" : "bg-slate-300"
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => setValue("imageEnabled", !formValues.imageEnabled)}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all",
                  formValues.imageEnabled
                    ? "border-[var(--color-deep-purple)] bg-[var(--color-pastel-purple)]/30 text-[var(--color-deep-purple)]"
                    : "border-slate-100 bg-slate-50 text-slate-400"
                )}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} />
                  <span className="text-sm font-bold">Image</span>
                </div>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    formValues.imageEnabled ? "bg-current animate-pulse" : "bg-slate-300"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <Button
              type="submit"
              className="w-full bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-extrabold h-12 rounded-xl shadow-lg shadow-purple-200"
            >
              <Save size={18} className="mr-2" /> Save Alert Settings
            </Button>
          </div>
        </form>
      }
    />
  );
}
