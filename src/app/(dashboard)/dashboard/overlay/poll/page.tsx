"use client";

import { PieChart } from "lucide-react";
import { Poll } from "@/components/overlay/Poll";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

const MOCK_POLL = {
  question: "Game selanjutnya?",
  options: [
    { id: "1", label: "Mobile Legends", votes: 450 },
    { id: "2", label: "Valorant", votes: 320 },
    { id: "3", label: "Horror Game", votes: 890 },
  ],
  totalVotes: 1660,
};

export default function PollOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Polling"
      description="Engage your audience with live polls."
      icon={<PieChart size={24} />}
      type="poll"
      previewContent={<Poll {...MOCK_POLL} />}
    />
  );
}
