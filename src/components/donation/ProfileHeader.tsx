import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
    username?: string;
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isLive?: boolean;
}

export function ProfileHeader({
    username = "Kaira Arcsladivya",
    bio = "Daging untuk majikan sejahtera ✨",
    avatarUrl = "https://i.imgur.com/1Z3MVNG.jpeg",
    bannerUrl = "https://i.imgur.com/1Z3MVNG.jpeg",
    isLive = true,
}: ProfileHeaderProps) {
    return (
        <Card className="overflow-hidden border-none shadow-sm">
            <div className="h-32 bg-gradient-to-br from-purple-100 to-yellow-50 relative">
                <Image
                    src={bannerUrl}
                    alt="Banner"
                    fill
                    className="object-cover opacity-40"
                />
            </div>
            <div className="px-6 pb-6 -mt-10 relative">
                <div className="relative inline-block">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-sm relative overflow-hidden",
                        isLive && "ring-2 ring-red-500 ring-offset-2 ring-offset-white transition-all"
                    )}>
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] rounded-full p-1 border-2 border-white">
                        <Check className="w-3 h-3 stroke-[4]" />
                    </div>
                </div>
                <div className="mt-3 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-xl font-extrabold text-slate-900">
                                {username}
                            </h1>
                            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
                            {isLive && (
                                <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 animate-pulse flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                    LIVE
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {bio}
                        </p>
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-full text-xs font-bold px-4">
                        Ikuti
                    </Button>
                </div>
            </div>
        </Card>
    );
}
