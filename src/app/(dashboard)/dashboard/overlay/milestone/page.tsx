"use client";

import { Target } from "lucide-react";
import { Milestone } from "@/components/overlay/Milestone";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

export default function MilestoneOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Milestone"
      description=" visualize your progress through multiple goals."
      icon={<Target size={24} />}
      type="milestone"
      previewContent={
        <Milestone
          currentValue={2500}
          steps={[
            { value: 1000, label: "Start", completed: true },
            { value: 5000, label: "Goal", completed: false }
          ]}
        />
      }
    />
  );
}
