"use client";

import { Subathon } from "@/components/overlay/Subathon";

export default function SubathonOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Subathon startTime={Date.now()} endTime={Date.now() + 1000 * 60 * 60 * 4} />
    </div>
  );
}
