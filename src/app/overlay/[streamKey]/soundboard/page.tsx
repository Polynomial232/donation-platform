"use client";

import { Soundboard } from "@/components/overlay/Soundboard";

export default function SoundboardOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Soundboard activeSound={{ name: "Bruh Sound Effect #2", isPlaying: true }} />
    </div>
  );
}
