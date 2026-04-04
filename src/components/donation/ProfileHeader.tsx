import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BadgeCheck, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import Toaster, { ToasterRef } from "@/components/ui/toast";

interface ProfileHeaderProps {
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isLive?: boolean;
  isVerified?: boolean;
}

export function ProfileHeader({
  username = "Kaira Arcsladivya",
  displayName,
  bio = "Daging untuk majikan sejahtera ✨",
  avatarUrl = "https://i.imgur.com/1Z3MVNG.jpeg",
  bannerUrl = "https://i.imgur.com/1Z3MVNG.jpeg",
  isLive = true,
  isVerified = false,
}: ProfileHeaderProps) {
  const toasterRef = useRef<ToasterRef>(null);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    toasterRef.current?.show({
      title: "Scroll Inscribed!",
      message: "The link to this realm has been etched for thy dispatch.",
      variant: "success",
    });
  };

  return (
    <>
      <Toaster ref={toasterRef} />
      <Card className="overflow-hidden border border-slate-100 shadow-sm rounded-3xl">
        {/* Banner with gradient overlay for premium feel */}
        <div className="h-44 relative bg-slate-100">
          <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 lg:px-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative inline-block">
              {/* Avatar with thick white ring & glow */}
              <div
                className={cn(
                  "w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-xl relative overflow-hidden z-10",
                  isLive && "ring-4 ring-red-500 ring-offset-2 ring-offset-white shadow-red-500/20"
                )}
              >
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
              </div>
              {/* Verified initial badge - positioned correctly */}
              <div className="absolute -bottom-1 -right-1 z-20 bg-(--color-accent-yellow) text-(--color-deep-purple) rounded-xl p-1.5 border-2 border-white shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="rounded-xl border-slate-200 hover:bg-slate-50 shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Share2 size={16} className="text-slate-600" />
              </Button>
              <Button className="rounded-xl font-bold px-6 shadow-md shadow-purple-500/10 bg-(--color-pastel-purple) text-(--color-deep-purple) hover:bg-purple-200 transition-transform hover:scale-105 active:scale-95">
                Enlist
              </Button>
            </div>
          </div>

          {/* Info Area */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {displayName || username}
                </h1>
                {isVerified && (
                  <BadgeCheck className="w-5 h-5 text-(--color-accent-purple) fill-(--color-pastel-purple)" />
                )}
                {isLive && (
                  <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1 animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    LIVE
                  </div>
                )}
              </div>
            </div>
            {displayName && <p className="text-sm text-slate-500 font-bold">@{username}</p>}
            <p className="text-[15px] text-slate-700 mt-2 font-medium leading-relaxed">{bio}</p>
          </div>
        </div>
      </Card>
    </>
  );
}
