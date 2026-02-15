"use client";

import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";

interface Achievement {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

const achievements: Achievement[] = [
    {
        id: "1",
        title: "Official Partner",
        description: "Verified content creator partner",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "2",
        title: "Top Streamer",
        description: "Streaming consistency is key!",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "3",
        title: "Fast Responder",
        description: "Replies to comments within 1 hour",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "4",
        title: "1 Year",
        description: "Active for 1+ year",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
    {
        id: "5",
        title: "Crowd Favorite",
        description: "Most engaged community",
        imageUrl: "https://i.imgur.com/1Z3MVNG.jpeg"
    },
];

export function AchievementsWidget() {
    return (
        <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl p-4 overflow-visible">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Award size={14} /> Achievements
            </h3>

            {/* Flex Wrap Layout - No Scroll */}
            <div className="flex flex-wrap gap-3 relative z-10">
                {achievements.map((item) => (
                    <div
                        key={item.id}
                        className="group relative cursor-help"
                    >
                        {/* Achievement Image */}
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-slate-100 p-1 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[var(--color-deep-purple)] relative z-20">
                            <div className="relative w-full h-full rounded-lg overflow-hidden">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Tooltip - Absolute positioning with high z-index to prevent clipping */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 hidden group-hover:block z-50 w-max max-w-[150px]">
                            <div className="bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                                <div className="font-bold mb-0.5">{item.title}</div>
                                <div className="text-slate-300 font-medium whitespace-normal leading-tight">{item.description}</div>

                                {/* Arrow */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
