"use client";

import { Milestone } from "@/components/overlay/Milestone";

export default function MilestoneOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Milestone
        currentValue={35000}
        steps={[
          { value: 1000, label: "Face Reveal", completed: true },
          { value: 5000, label: "Horror Game", completed: false },
          { value: 10000, label: "Giveaway PC", completed: false },
          { value: 20000, label: "Giveaway PC", completed: false },
          { value: 30000, label: "Giveaway PC", completed: false },
          { value: 40000, label: "Giveaway PC", completed: false },
          { value: 50000, label: "Giveaway PC", completed: false },
        ]}
      />
    </div>
  );
}
