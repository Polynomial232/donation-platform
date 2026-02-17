"use client";

import { Milestone } from "@/components/overlay/Milestone";

export default function MilestoneOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Milestone
        currentValue={2500}
        steps={[
          { value: 1000, label: "Face Reveal", completed: true },
          { value: 5000, label: "Horror Game", completed: false },
          { value: 10000, label: "Giveaway PC", completed: false }
        ]}
      />
    </div>
  );
}
