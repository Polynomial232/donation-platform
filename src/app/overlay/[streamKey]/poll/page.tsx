"use client";

import { Poll } from "@/components/overlay/Poll";

const MOCK_POLL = {
  question: "Game selanjutnya?",
  options: [
    { id: "1", label: "Mobile Legends", votes: 450 },
    { id: "2", label: "Valorant", votes: 320 },
    { id: "3", label: "Horror Game", votes: 890 },
  ],
  totalVotes: 1660,
};

export default function PollOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <Poll {...MOCK_POLL} />
    </div>
  );
}
