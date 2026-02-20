"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QrCode, Save, Image as ImageIcon, History } from "lucide-react";
import { QRCodeOverlay } from "@/components/overlay/QRCode";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const qrSchema = z.object({
  headerLabel: z.string().min(1, "Header label is required"),
  footerLabel: z.string().min(1, "Footer label is required"),
  logoUrl: z.string().optional(),
});

type QRFormValues = z.infer<typeof qrSchema>;

export default function QROverlaySettingsPage() {
  const creatorUrl = "https://polynomial.id/polynomial232"; // Example creator URL

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QRFormValues>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      headerLabel: "SUPPORT STREAM",
      footerLabel: "SCAN TO DONATE",
      logoUrl: "",
    },
  });

  const formData = watch();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue("logoUrl", url);
    }
  };

  const onSubmit = (data: QRFormValues) => {
    console.log("Saving QR Settings:", data);
    // Logic to save to backend would go here
  };

  return (
    <OverlaySettingsTemplate
      title="QR Code"
      description="Personalize your QR code overlay with custom labels and brand logo to match your stream aesthetic."
      icon={<QrCode size={24} />}
      type="qr"
      previewContent={
        <QRCodeOverlay
          data={creatorUrl}
          headerLabel={formData.headerLabel}
          footerLabel={formData.footerLabel}
          logoSrc={formData.logoUrl}
        />
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-purple-50/50 border border-purple-100/50 rounded-xl">
            <div className="flex items-center gap-2">
              <History className="text-[var(--color-deep-purple)]" size={14} />
              <span className="font-semibold text-[var(--color-deep-purple)] text-[10px] uppercase tracking-wider">
                QR Configuration
              </span>
            </div>
          </div>

          <Card className="p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col gap-8 relative z-10">
              {/* QR Logo Upload */}
              <div className="flex flex-col items-center gap-3 border-b border-slate-50 pb-6">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center">
                  QR Brand Logo
                </label>
                <label className="w-28 h-28 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-[var(--color-deep-purple)]/50 cursor-pointer group/icon relative block shadow-inner">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      className="w-full h-full object-cover"
                      alt="QR Logo"
                    />
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="sr-only"
                  />
                  <div className="absolute inset-0 bg-[var(--color-deep-purple)]/60 opacity-0 group-hover/icon:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold uppercase tracking-tighter text-center px-2">
                    Change Logo
                  </div>
                </label>
                <p className="text-[9px] text-slate-400 font-medium text-center max-w-[100px]">
                  PNG or SVG recommended
                </p>
              </div>

              <div className="flex-1 space-y-5">
                {/* Data URL (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-slate-300 rounded-full" /> Donation URL
                  </label>
                  <input
                    type="text"
                    value={creatorUrl}
                    readOnly
                    className="w-full text-xs font-medium border border-slate-100 bg-slate-50 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed italic"
                  />
                  <p className="text-[8px] text-slate-300 font-medium">
                    This is the destination your QR code points to. Read-only.
                  </p>
                </div>

                {/* Header Label Input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-[var(--color-primary)] rounded-full" /> Header
                    Text
                  </label>
                  <input
                    type="text"
                    {...register("headerLabel")}
                    placeholder="e.g. SUPPORT STREAM"
                    className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white focus:border-[var(--color-deep-purple)]/30 focus:ring-4 focus:ring-purple-500/5 transition-all uppercase tracking-tighter"
                  />
                </div>

                {/* Footer Label Input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-400 rounded-full" /> Footer Text
                  </label>
                  <input
                    type="text"
                    {...register("footerLabel")}
                    placeholder="e.g. SCAN TO DONATE"
                    className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white focus:border-[var(--color-deep-purple)]/30 focus:ring-4 focus:ring-purple-500/5 transition-all uppercase tracking-tighter"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-black text-white font-semibold h-10 rounded-xl px-8 text-xs shadow-sm active:scale-95 flex gap-2"
              >
                <Save size={14} /> Update QR Overlay
              </Button>
            </div>
          </Card>
        </form>
      }
    />
  );
}
