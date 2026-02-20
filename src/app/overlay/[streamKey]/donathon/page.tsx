"use client";

import { Donathon } from "@/components/overlay/Donathon";

export default function DonathonOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Donathon startTime={Date.now()} endTime={Date.now() + 1000 * 60 * 60 * 4} />
    </div>
  );
}
