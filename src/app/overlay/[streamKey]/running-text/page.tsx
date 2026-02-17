"use client";

import { RunningText } from "@/components/overlay/RunningText";

const RUNNING_TEXT_MESSAGES = [
  "Top Donator: Sultan_Budi - Rp 5.000.000",
  "Recent Sub: Siti_G (Prime)",
  "Don't forget to follow and subscribe!",
  "Join Discord for updates."
];

export default function RunningTextOverlayPage() {
  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden flex flex-col justify-end">
      <RunningText messages={RUNNING_TEXT_MESSAGES} />
    </div>
  );
}
