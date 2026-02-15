
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Medal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const topSupporters = [
    { name: "Sultan Gabut", amount: "Rp 15.000.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 1 },
    { name: "Anak Sultan", amount: "Rp 8.500.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 2 },
    { name: "Hamba Allah", amount: "Rp 3.000.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 3 },
    { name: "Fanboy Garis Keras", amount: "Rp 1.500.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 4 },
    { name: "Secret Admirer", amount: "Rp 500.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 5 },
];

const fullLeaderboard = [
    ...topSupporters,
    { name: "Supporter 6", amount: "Rp 450.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 6 },
    { name: "Supporter 7", amount: "Rp 400.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 7 },
    { name: "Supporter 8", amount: "Rp 350.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 8 },
    { name: "Supporter 9", amount: "Rp 300.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 9 },
    { name: "Supporter 10", amount: "Rp 250.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 10 },
    { name: "Supporter 11", amount: "Rp 200.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 11 },
    { name: "Supporter 12", amount: "Rp 150.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 12 },
    { name: "Supporter 13", amount: "Rp 100.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 13 },
    { name: "Supporter 14", amount: "Rp 50.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 14 },
    { name: "Supporter 15", amount: "Rp 10.000", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", rank: 15 },
];

interface Supporter {
    name: string;
    amount: string;
    avatar: string;
    rank: number;
}

export function LeaderboardWidget() {
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);

    const SupporterItem = ({ supporter }: { supporter: Supporter }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="flex-shrink-0 w-6 text-center font-bold text-slate-400 text-xs">
                {supporter.rank === 1 && <Crown size={20} className="text-yellow-500 mx-auto" fill="currentColor" />}
                {supporter.rank === 2 && <Medal size={20} className="text-slate-400 mx-auto" />}
                {supporter.rank === 3 && <Medal size={20} className="text-amber-700 mx-auto" />}
                {supporter.rank > 3 && `#${supporter.rank}`}
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden relative border border-slate-100 flex-shrink-0">
                <Image src={supporter.avatar} alt={supporter.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{supporter.name}</p>
                <p className="text-[10px] text-[var(--color-deep-purple)] font-bold">{supporter.amount}</p>
            </div>
        </div>
    );

    return (
        <>
            <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
                <div className="bg-[var(--color-accent-yellow)] px-4 py-3 flex items-center gap-2">
                    <Trophy size={16} className="text-[var(--color-deep-purple)]" fill="currentColor" />
                    <h3 className="text-xs font-black text-[var(--color-deep-purple)] uppercase tracking-widest">Top Supporters</h3>
                </div>
                <div className="p-2">
                    {topSupporters.map((supporter, index) => (
                        <SupporterItem key={index} supporter={supporter} />
                    ))}
                </div>
                <div className="p-3 border-t border-slate-50 text-center">
                    <button
                        onClick={() => setIsViewAllOpen(true)}
                        className="text-[10px] font-bold text-slate-400 hover:text-[var(--color-deep-purple)] transition-colors uppercase tracking-widest"
                    >
                        View All Sultans
                    </button>
                </div>
            </Card>

            <Modal
                isOpen={isViewAllOpen}
                onClose={() => setIsViewAllOpen(false)}
                title="Top Sultans"
            >
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-1">
                        {fullLeaderboard.map((supporter, index) => (
                            <SupporterItem key={index} supporter={supporter} />
                        ))}
                    </div>
                </ScrollArea>
                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsViewAllOpen(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}
