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
import { GoalsWidget } from "@/components/donation/GoalsWidget";
import { Card } from "@/components/ui/card";

import { discoveryService } from "@/services/discovery";
import { CreatorDetailResponse, CreatorSection } from "@/types/discovery";

function isSectionVisible(section: CreatorSection): boolean {
  if (!section.is_enabled) return false;

  const { data } = section;
  if (!data) return false;
  if (Array.isArray(data) && data.length === 0) return false;

  return true;
}

function SectionRenderer({ section }: { section: CreatorSection }) {
  if (!isSectionVisible(section)) return null;

  switch (section.type) {
    case "GOALS":
      return <GoalsWidget data={section.data} title={section.title} />;
    case "ACHIEVEMENTS":
      return <AchievementsWidget data={section.data} />;
    case "PINNED_WIDGET":
      return <PinnedWidget data={section.data} />;
    case "RECENT_ACTIVITY":
      return <DonationHistory data={section.data} />;
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

  const LEFT_SECTION_TYPES = ["GOALS"] as const;

  const RIGHT_SECTION_TYPES = [
    "ACHIEVEMENTS",
    "PINNED_WIDGET",
    "CUSTOM_CONTENT",
    "TOP_SUPPORTERS",
  ] as const;

  const { leftSections, rightSections } = useMemo(() => {
    if (!data?.sections) return { leftSections: [], rightSections: [] };

    return {
      leftSections: data.sections.filter((s) =>
        (LEFT_SECTION_TYPES as readonly string[]).includes(s.type)
      ),
      rightSections: data.sections.filter((s) =>
        (RIGHT_SECTION_TYPES as readonly string[]).includes(s.type)
      ),
    };
  }, [data?.sections]);

  const hasVisibleRightSections = useMemo(() => {
    return rightSections.some(isSectionVisible);
  }, [rightSections]);

  const recentActivitySection = useMemo(() => {
    return data?.sections.find((s) => s.type === "RECENT_ACTIVITY");
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

  const { profile, settings, sound_board: soundBoard } = data;

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
      <div className={`mx-auto px-4 pt-6 ${hasVisibleRightSections ? "max-w-6xl" : "max-w-3xl"}`}>
        <div
          className={`grid grid-cols-1 gap-8 ${hasVisibleRightSections ? "lg:grid-cols-12" : ""}`}
        >
          {/* Main Content Column */}
          <div className={`space-y-6 ${hasVisibleRightSections ? "lg:col-span-8" : ""}`}>
            <ProfileHeader
              username={profile.username}
              displayName={profile.display_name}
              bio={profile.bio}
              avatarUrl={profile.avatar_url}
              bannerUrl={profile.banner_url}
              isLive={profile.is_live}
              isVerified={profile.is_verified}
            />

            {/* Dynamic Left Sections */}
            {leftSections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}

            <DonationWrapper settings={settings} soundBoard={soundBoard} />

            {/* Recent Activity — rendered below donation form */}
            {recentActivitySection && isSectionVisible(recentActivitySection) && (
              <DonationHistory data={recentActivitySection.data} />
            )}
          </div>

          {/* Right Sidebar — only rendered when visible sections exist */}
          {hasVisibleRightSections && (
            <div className="lg:col-span-4 space-y-6">
              {rightSections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
