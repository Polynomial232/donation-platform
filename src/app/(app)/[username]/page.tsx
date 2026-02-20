import { Navbar } from "@/components/Navbar";
import { ProfileHeader } from "@/components/donation/ProfileHeader";

import { PowerUpEffects } from "@/components/donation/PowerUpEffects";
import { DonationWrapper } from "@/components/donation/DonationWrapper";
import { DonationHistory } from "@/components/donation/DonationHistory";
import { PinnedWidget } from "@/components/donation/PinnedWidget";
import { LeaderboardWidget } from "@/components/donation/LeaderboardWidget";
import { RecentActivityWidget } from "@/components/donation/RecentActivityWidget";
import { AchievementsWidget } from "@/components/donation/AchievementsWidget";
import { CommunityQuestWidget } from "@/components/donation/CommunityQuestWidget";
import { VipPerksWidget } from "@/components/donation/VipPerksWidget";

import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

// Mock data fetcher
async function getCreator(username: string) {
  // In a real app, fetch from API/DB
  // For demo, we just return mock data based on username
  const decodedUsername = decodeURIComponent(username);

  return {
    username: decodedUsername,
    bio: `Content Creator • ${decodedUsername}`,
    description:
      "Halo guys! Dukung aku untuk upgrade PC biar bisa streaming game AAA dengan lancar ya. Setiap dukungan kalian sangat berarti buat perkembangan channel ini. Terima kasih banyak supportnya! 🚀",
    currentAmount: 2500000,
    goalAmount: 5000000,
    goalTitle: "Upgrade PC Streaming 🖥️",
    avatarUrl: `https://i.imgur.com/1Z3MVNG.jpeg`,
    bannerUrl: `https://i.imgur.com/1Z3MVNG.jpeg`,
    isLive: true,
  };
}

export default async function CreatorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const creator = await getCreator(username);

  if (!creator) return notFound();

  const progressPercentage = Math.min(
    100,
    Math.round((creator.currentAmount / creator.goalAmount) * 100)
  );

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
      {/* Wider container for multi-column layout */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT/CENTER COLUMN (Main Content) - Spans 8 cols on desktop */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileHeader
              username={creator.username}
              bio={creator.bio}
              avatarUrl={creator.avatarUrl}
              bannerUrl={creator.bannerUrl}
              isLive={creator.isLive}
            />

            {/* Phase 2: Community Quest Widget */}
            <CommunityQuestWidget />

            {/* Description */}
            <Card className="p-5 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl">
              <h3 className="font-extrabold text-sm text-slate-900 mb-3">About Creator</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {creator.description}
              </p>
            </Card>

            <DonationWrapper />

            <DonationHistory />
          </div>

          {/* RIGHT COLUMN (Sidebar) - Spans 4 cols on desktop */}
          <div className="lg:col-span-4 space-y-6">
            {/* Phase 2: VIP Perks Widget */}
            {/* <VipPerksWidget /> */}

            {/* Achievements */}
            <AchievementsWidget />

            {/* Pinned Content */}
            <PinnedWidget />

            {/* Leaderboard */}
            <LeaderboardWidget />

            {/* Recent Activity */}
            <RecentActivityWidget />
          </div>
        </div>
      </div>
    </main>
  );
}
