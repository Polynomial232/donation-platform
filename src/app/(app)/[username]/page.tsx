"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";

import { ProfileHeader } from "@/components/donation/ProfileHeader";
import { PowerUpEffects } from "@/components/donation/PowerUpEffects";
import { DonationWrapper } from "@/components/donation/DonationWrapper";
import { DonationHistory } from "@/components/donation/DonationHistory";
import { PinnedWidget } from "@/components/donation/PinnedWidget";
import { LeaderboardWidget } from "@/components/donation/LeaderboardWidget";
import { RecentActivityWidget } from "@/components/donation/RecentActivityWidget";
import { AchievementsWidget } from "@/components/donation/AchievementsWidget";
import { CommunityQuestWidget } from "@/components/donation/CommunityQuestWidget";
import { Card } from "@/components/ui/card";

import { discoveryService } from "@/services/discovery";
import { CreatorDetailResponse, CreatorSection } from "@/types/discovery";

function SectionRenderer({ section }: { section: CreatorSection }) {
  if (!section.isEnabled) return null;

  switch (section.type) {
    case "COMMUNITY_QUEST":
      return <CommunityQuestWidget data={section.data} />;
    case "ACHIEVEMENTS":
      return <AchievementsWidget data={section.data} />;
    case "PINNED_WIDGET":
      return <PinnedWidget data={section.data} />;
    case "TOP_SUPPORTERS":
      return <LeaderboardWidget data={section.data} />;
    case "CUSTOM_CONTENT":
      return (
        <Card className="p-5 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl bg-white">
          <h3 className="font-extrabold text-sm text-slate-900 mb-3">{section.title}</h3>
          <p className="text-sm text-slate-600 font-medium">{section.data?.content}</p>
        </Card>
      );
    default:
      return null;
  }
}

export default function CreatorPage() {
  const params = useParams();
  const username = params?.username as string;

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<CreatorDetailResponse>({
    queryKey: ["creator", username],
    queryFn: () => discoveryService.getCreatorByUsername(username),
    enabled: !!username,
  });

  const data = response?.data;

  // Split into left and right based on some logic (e.g. type)
  const recentActivityData = useMemo(() => {
    return data?.sections.find((s) => s.type === "RECENT_ACTIVITY")?.data;
  }, [data?.sections]);

  const { leftSections, rightSections } = useMemo(() => {
    if (!data?.sections) return { leftSections: [], rightSections: [] };

    return {
      leftSections: data.sections.filter((s) => ["COMMUNITY_QUEST"].includes(s.type)),
      rightSections: data.sections.filter((s) => !["COMMUNITY_QUEST"].includes(s.type)),
    };
  }, [data?.sections]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-off-white)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--color-deep-purple)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return notFound();
  }

  const { profile, settings, soundBoard } = data;

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT/CENTER COLUMN (Main Content) */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileHeader
              username={profile.username}
              displayName={profile.displayName}
              bio={profile.bio}
              avatarUrl={profile.avatarUrl}
              bannerUrl={profile.bannerUrl}
              isLive={profile.isLive}
              isVerified={profile.isVerified}
            />

            {/* Dynamic Left Sections */}
            {leftSections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}

            <DonationWrapper settings={settings} soundBoard={soundBoard} />
            <DonationHistory data={recentActivityData} />
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dynamic Right Sections */}
            {rightSections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
