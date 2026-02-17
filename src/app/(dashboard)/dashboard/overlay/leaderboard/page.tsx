"use client";

import { Trophy } from "lucide-react";
import { Leaderboard } from "@/components/overlay/Leaderboard";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Sultan_Budi", amount: 5000000 },
  { rank: 2, name: "Windah_Fans", amount: 2500000 },
  { rank: 3, name: "Reynaldi", amount: 1000000 },
  { rank: 4, name: "Asep_Gaming", amount: 500000 },
  { rank: 5, name: "Joko_99", amount: 250000 },
];

export default function LeaderboardOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Leaderboard"
      description="Display your top supporters."
      icon={<Trophy size={24} />}
      type="leaderboard"
      previewContent={
        <div className="scale-110 origin-center">
          <Leaderboard entries={MOCK_LEADERBOARD} />
        </div>
      }
    />
  );
}
