"use client";

import { Sparkles } from "lucide-react";
import { Gacha } from "@/components/overlay/Gacha";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

export default function GachaOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Gacha"
      description="Interactive gacha game for viewers."
      icon={<Sparkles size={24} />}
      type="gacha"
      previewContent={
        <div className="flex flex-col items-center gap-4">
          <Gacha />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Click me!</p>
        </div>
      }
    />
  );
}
