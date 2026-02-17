"use client";

import { Clock } from "lucide-react";
import { Subathon } from "@/components/overlay/Subathon";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

export default function SubathonOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Subathon"
      description="Countdown timer that extends with every support."
      icon={<Clock size={24} />}
      type="subathon"
      previewContent={
        <Subathon startTime={Date.now()} endTime={Date.now() + 10000000} />
      }
    />
  );
}
