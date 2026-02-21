"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bell,
  Play,
  Save,
  Image as ImageIcon,
  Music,
  Volume2,
  VolumeX,
  Type,
  Video,
  Mic,
  Coins,
  Upload,
  Film,
  Globe,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const alertSchema = z.object({
  duration: z.number().min(1).max(60),
  minAmount: z.number().min(0),
  // Ringtone
  ringtoneEnabled: z.boolean(),
  ringtoneVolume: z.number().min(0).max(100),
  ringtoneFile: z.any().optional(),
  // Features
  ttsEnabled: z.boolean(),
  gifEnabled: z.boolean(),
  mediashareEnabled: z.boolean(),
  mediashareVolume: z.number().min(0).max(100),
  voiceNoteEnabled: z.boolean(),
  // Units
  unitEnabled: z.boolean(),
  unitName: z.string().optional(),
  unitValue: z.number().min(0).optional(),
  unitImage: z.any().optional(),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export default function AlertOverlaySettingsPage() {
  const [testAlert, setTestAlert] = useState<OverlayEvent | null>(null);
  const [ringtonePreview, setRingtonePreview] = useState<string | null>(null);
  const [unitImagePreview, setUnitImagePreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      minAmount: 10000,
      ringtoneEnabled: true,
      ringtoneVolume: 80,
      ttsEnabled: true,
      gifEnabled: true,
      mediashareEnabled: true,
      mediashareVolume: 70,
      voiceNoteEnabled: false,
      unitEnabled: true,
      unitName: "Cendol",
      unitValue: 5000,
    },
  });

  const formValues = watch();

  const handleTest = (forceFeature?: string) => {
    // Determine the unit information if enabled
    let unitData = undefined;
    const testAmount = formValues.minAmount || 50000;

    if (
      forceFeature === "unit" ||
      (formValues.unitEnabled && formValues.unitName && formValues.unitValue)
    ) {
      const unitCount = Math.floor(testAmount / (formValues.unitValue || 5000));
      unitData = {
        name: formValues.unitName || "Cendol",
        value: formValues.unitValue || 5000,
        icon: unitImagePreview || undefined,
        count: unitCount > 0 ? unitCount : 1,
      };
    }

    // Prepare media simulation
    let mediaData = undefined;
    // If we are specifically testing GIFs, don't show YouTube even if Media Share is on
    if (forceFeature === "gif" || (formValues.gifEnabled && forceFeature !== "mediashare")) {
      mediaData = {
        type: "image" as any,
        url: "https://media.tenor.com/nFODQdUDbwoAAAAj/lerolero-dancing-cat.gif",
      };
    }

    // If we are specifically testing Media Share OR it's enabled and we didn't force GIF
    if (forceFeature === "mediashare" || (formValues.mediashareEnabled && forceFeature !== "gif")) {
      mediaData = {
        type: "youtube" as const,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Dummy YT
      };
    }

    let message = "This is a test donation message with your current settings!";
    if (forceFeature === "tts" || formValues.ttsEnabled) message += " [TTS Enabled]";
    if (forceFeature === "voiceNote" || formValues.voiceNoteEnabled)
      message += " [Voice Note Included]";

    setTestAlert({
      type: "donation",
      user: "Test_User",
      amount: testAmount,
      message: message,
      soundUrl: formValues.ringtoneEnabled ? ringtonePreview || undefined : undefined,
      volume: formValues.ringtoneVolume,
      unit: unitData,
      media: mediaData,
    });
  };

  const handlePlayRingtone = () => {
    // Make alert sound play trigger the same full preview as test notification
    handleTest();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRingtonePreview(url);
      setValue("ringtoneFile", file);
    }
  };

  const onUnitImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUnitImagePreview(url);
      setValue("unitImage", file);
    }
  };

  const onSubmit = (data: AlertFormValues) => {
    console.log("Saving alert settings:", data);
    alert("Alert settings saved!");
  };

  const FeatureItem = ({
    label,
    icon: Icon,
    name,
    isActive,
  }: {
    label: string;
    icon: any;
    name: keyof AlertFormValues;
    isActive: boolean;
  }) => (
    <div className="group/feature flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setValue(name, !isActive as any)}
        className={cn(
          "p-4 w-full aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden",
          isActive
            ? "border-[var(--color-deep-purple)] bg-[var(--color-deep-purple)]/5 text-[var(--color-deep-purple)] shadow-[0_10px_25px_rgba(107,33,168,0.1)]"
            : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            isActive
              ? "bg-[var(--color-deep-purple)] text-white shadow-lg rotate-0"
              : "bg-slate-50 rotate-3 group-hover/feature:rotate-0"
          )}
        >
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>

        {/* Status Indicator Dot */}
        <div
          className={cn(
            "absolute top-3 right-3 w-2 h-2 rounded-full",
            isActive ? "bg-[var(--color-deep-purple)] animate-pulse" : "bg-slate-200"
          )}
        />
      </button>

      {/* Mini Test Button Below */}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!isActive}
        onClick={(e) => {
          e.stopPropagation();
          const featureType = name.replace("Enabled", "");
          handleTest(featureType);
        }}
        className={cn(
          "h-8 rounded-xl text-[10px] font-bold uppercase tracking-tighter gap-1.5 transition-all",
          isActive
            ? "text-[var(--color-deep-purple)] hover:bg-purple-100"
            : "text-slate-300 opacity-50 cursor-not-allowed"
        )}
      >
        <Play size={10} fill="currentColor" /> Test {label}
      </Button>
    </div>
  );

  return (
    <OverlaySettingsTemplate
      title="Notification Box"
      description="Configure alerts for donations, subscriptions, follows, and more."
      icon={<Bell size={24} />}
      type="alert"
      layout="stacked"
      previewContent={
        testAlert ? (
          <Alert
            event={testAlert}
            duration={formValues.duration * 1000}
            onComplete={() => setTestAlert(null)}
          />
        ) : (
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-medium">No active notification.</p>
            <p className="text-xs text-slate-300">Click "Test Notification" to see a preview.</p>
          </div>
        )
      }
      extraActions={
        <Button
          onClick={() => handleTest()}
          size="sm"
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
        >
          <Play size={14} /> Test Notification
        </Button>
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Section 1: Basic Config */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
              <div className="w-1.5 h-4 bg-[var(--color-accent-yellow)] rounded-full" />
              Main Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Duration (seconds)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("duration", { valueAsNumber: true })}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold focus:outline-none focus:border-[var(--color-deep-purple)] focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                    SEC
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Min. Amount to Trigger
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">
                    IDR
                  </span>
                  <input
                    type="number"
                    {...register("minAmount", { valueAsNumber: true })}
                    className="w-full pl-12 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold focus:outline-none focus:border-[var(--color-deep-purple)] focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Audio & Ringtone */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-end">
              <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                <div className="w-1.5 h-4 bg-blue-400 rounded-full" />
                Alert Audio
              </h4>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Enabled</span>
                <input
                  type="checkbox"
                  {...register("ringtoneEnabled")}
                  className="w-4 h-4 rounded text-[var(--color-deep-purple)] focus:ring-[var(--color-deep-purple)]"
                />
              </div>
            </div>

            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-8",
                !formValues.ringtoneEnabled && "opacity-40 pointer-events-none"
              )}
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Ringtone Upload
                </label>
                <div
                  className={cn(
                    "group relative w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden",
                    formValues.ringtoneFile
                      ? "border-green-400 bg-green-50"
                      : "border-slate-200 hover:border-[var(--color-deep-purple)] hover:bg-purple-50"
                  )}
                >
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {formValues.ringtoneFile ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center animate-in zoom-in">
                        <Check size={20} />
                      </div>
                      <p className="text-xs font-bold text-green-600 truncate px-4">
                        {formValues.ringtoneFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("ringtoneFile", undefined);
                          setRingtonePreview(null);
                        }}
                        className="text-[10px] font-bold text-red-400 hover:text-red-500 underline z-20"
                      >
                        Change File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[var(--color-deep-purple)] group-hover:text-white transition-colors">
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-400 group-hover:text-[var(--color-deep-purple)]">
                        Choose audio file
                      </p>
                      <p className="text-[10px] text-slate-300">MP3, WAV, OGG (Max 2MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Alert Volume
                    </label>
                    <span className="text-xs font-black text-[var(--color-deep-purple)] bg-purple-100 px-2 py-0.5 rounded-full">
                      {formValues.ringtoneVolume}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <VolumeX size={18} className="text-slate-300" />
                    <input
                      type="range"
                      {...register("ringtoneVolume", { valueAsNumber: true })}
                      className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-deep-purple)]"
                    />
                    <Volume2 size={18} className="text-slate-400" />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handlePlayRingtone}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-slate-100 hover:border-[var(--color-deep-purple)] hover:bg-purple-50 group transition-all"
                >
                  <Play
                    size={16}
                    className="mr-2 text-slate-400 group-hover:text-[var(--color-deep-purple)] group-hover:fill-[var(--color-deep-purple)] transition-all"
                  />
                  <span className="font-bold group-hover:text-[var(--color-deep-purple)]">
                    Test Alert Sound
                  </span>
                </Button>
                {ringtonePreview && <audio ref={audioRef} src={ringtonePreview} hidden />}
              </div>
            </div>
          </div>

          {/* Section 3: Toggle Features */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
              <div className="w-1.5 h-4 bg-pink-400 rounded-full" />
              Active Features
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <FeatureItem
                label="TTS"
                icon={Type}
                name="ttsEnabled"
                isActive={formValues.ttsEnabled}
              />
              <FeatureItem
                label="GIFs"
                icon={Film}
                name="gifEnabled"
                isActive={formValues.gifEnabled}
              />
              <FeatureItem
                label="Media Share"
                icon={Video}
                name="mediashareEnabled"
                isActive={formValues.mediashareEnabled}
              />
              <FeatureItem
                label="Voice Note"
                icon={Mic}
                name="voiceNoteEnabled"
                isActive={formValues.voiceNoteEnabled}
              />
              <FeatureItem
                label="Units"
                icon={Coins}
                name="unitEnabled"
                isActive={formValues.unitEnabled}
              />
            </div>

            {/* Sub-settings for Media Share */}
            {formValues.mediashareEnabled && (
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Max Volume
                    </label>
                    <span className="text-xs font-bold text-slate-500">
                      {formValues.mediashareVolume}%
                    </span>
                  </div>
                  <input
                    type="range"
                    {...register("mediashareVolume", { valueAsNumber: true })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Unit Settings */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-center">
              <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                <div className="w-1.5 h-4 bg-amber-400 rounded-full" />
                Donation Units (Optional)
              </h4>
              <p className="text-[10px] font-bold text-[var(--color-deep-purple)] bg-purple-50 px-3 py-1 rounded-full border border-purple-100 animate-pulse">
                Ex: 1 {formValues.unitName || "Unit"} ={" "}
                {formValues.unitValue?.toLocaleString("id-ID") || "0"} IDR
              </p>
            </div>

            {formValues.unitEnabled ? (
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Unit Name</label>
                    <input
                      type="text"
                      {...register("unitName")}
                      placeholder="e.g. Cendol, Coffee, Star"
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold focus:outline-none focus:border-[var(--color-deep-purple)] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Value (IDR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">
                        IDR
                      </span>
                      <input
                        type="number"
                        {...register("unitValue", { valueAsNumber: true })}
                        className="w-full pl-12 p-3 bg-white rounded-xl border border-slate-100 font-bold focus:outline-none focus:border-[var(--color-deep-purple)] shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Unit Icon</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-white overflow-hidden group hover:border-[var(--color-deep-purple)] transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onUnitImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {unitImagePreview ? (
                        <img
                          src={unitImagePreview}
                          className="w-full h-full object-contain p-2 animate-in fade-in"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={20} className="mx-auto text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                            PNG/SVG
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">
                        Upload a small icon for this unit.
                      </p>
                      <p className="text-[10px] text-slate-400">Recommended size: 64x64px</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dotted border-slate-100 rounded-[2rem]">
                <p className="text-sm font-medium text-slate-400 italic">
                  Donation units are disabled. Standard IDR amounts will be used.
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-10 sticky bottom-0 bg-white pb-6 z-20">
            <Button
              type="submit"
              className="w-full bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-extrabold h-14 rounded-2xl shadow-xl shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
            >
              <Save size={20} />
              <span className="text-lg">Save Configuration</span>
            </Button>
          </div>
        </form>
      }
    />
  );
}
