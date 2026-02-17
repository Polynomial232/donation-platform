"use client";

import { Type } from "lucide-react";
import { RunningText } from "@/components/overlay/RunningText";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

const RUNNING_TEXT_MESSAGES = [
  "Top Donator: Sultan_Budi - Rp 5.000.000",
  "Recent Sub: Siti_G (Prime)",
  "Don't forget to follow and subscribe!",
  "Join Discord for updates."
];

export default function RunningTextOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Running Text"
      description="A scrolling ticker for announcements and events."
      icon={<Type size={24} />}
      type="running-text"
      previewContent={
        <div className="w-full absolute bottom-0">
          <RunningText messages={RUNNING_TEXT_MESSAGES} />
        </div>
      }
    />
  );
}
