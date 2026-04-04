"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { BGPattern } from "@/components/ui/bg-pattern";

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
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden">
          <div className="bg-slate-50/80 px-5 py-4 flex items-center gap-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {section.title}
            </h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {section.data?.content}
            </p>
          </div>
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
      <main className="min-h-screen bg-(--color-off-white) flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-(--color-deep-purple) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Summoning the sovereign&apos;s record...</p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return notFound();
  }

  const { profile, settings, sound_board: soundBoard } = data;

  return (
    <main className="min-h-screen bg-slate-50 relative pb-16">
      {/* Premium Background Pattern */}
      <BGPattern
        variant="grid"
        size={32}
        fill="rgba(0,0,0,0.04)"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Decorative Glowing Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-(--color-pastel-purple) mix-blend-multiply blur-[120px] opacity-40 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-(--color-pastel-yellow) mix-blend-multiply blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      <div
        className={`relative z-10 mx-auto px-4 pt-8 ${hasVisibleRightSections ? "max-w-6xl" : "max-w-3xl"}`}
      >
        <div
          className={`grid grid-cols-1 gap-10 ${hasVisibleRightSections ? "lg:grid-cols-12" : ""}`}
        >
          {/* Main Content Column */}
          <div className={`space-y-8 ${hasVisibleRightSections ? "lg:col-span-8" : ""}`}>
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
            <div className="lg:col-span-4 space-y-8">
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
