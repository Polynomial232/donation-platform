"use client";

import { Goal } from "@/components/overlay/Goal";

export default function GoalOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Goal title="Donation Goal" current={1500000} target={5000000} />
    </div>
  );
}
