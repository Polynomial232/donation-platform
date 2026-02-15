"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Play, Heart, Coffee } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import moment from "moment";

type DonationType = "Donation" | "Mediashare" | "Soundboard" | "Coffee";

interface Donation {
    id: string;
    supporter: string;
    avatar?: string;
    amount: number;
    message?: string;
    type: DonationType;
    timestamp: Date;
    mediaTitle?: string; // For Mediashare/Soundboard
}

export function DonationHistory() {
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);

    // Mock data state
    const [history, setHistory] = useState<Donation[]>([
        {
            id: "1",
            supporter: "Bambang Gentolet",
            amount: 50000,
            message: "Semangat bang live-nya! Request lagu galau dong.",
            type: "Mediashare",
            mediaTitle: "Bernadya - Satu Bulan (Official Lyric Video)",
            timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 mins ago
        },
        {
            id: "2",
            supporter: "Kucing Oren",
            amount: 10000,
            message: "Makan bang!",
            type: "Coffee",
            timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
        },
        {
            id: "3",
            supporter: "Anonim",
            amount: 100000,
            message: "Jumpscare active!",
            type: "Soundboard",
            mediaTitle: "Kuntilanak Laugh.mp3",
            timestamp: new Date(Date.now() - 1000 * 60 * 12) // 12 mins ago
        },
        {
            id: "4",
            supporter: "Siti Nurbaya",
            amount: 25000,
            message: "Gabut aja kirim duit.",
            type: "Donation",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
        },
        {
            id: "5",
            supporter: "Windah Lovers",
            amount: 69420,
            message: "Absen bang!",
            type: "Donation",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 800) // 2 hours ago
        },
    ]);

    const [fullHistory, setFullHistory] = useState<Donation[]>([
        ...history,
        { id: "6", supporter: "User 6", amount: 15000, message: "GGWP!", type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
        { id: "7", supporter: "User 7", amount: 20000, message: "Hello!", type: "Coffee", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
        { id: "8", supporter: "Sultan", amount: 1000000, message: "Support terus!", type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
        { id: "9", supporter: "Fans Berat", amount: 5000, message: "Semangat!", type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) },
        { id: "10", supporter: "Gamer", amount: 12000, message: "Main game horor bang", type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7) },
        { id: "11", supporter: "Viewer", amount: 10000, type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
        { id: "12", supporter: "Donatur", amount: 50000, message: "Nice content", type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9) },
        { id: "13", supporter: "Supporter", amount: 25000, type: "Donation", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10) },
        { id: "14", supporter: "User 14", amount: 10000, type: "Coffee", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11) },
        { id: "15", supporter: "User 15", amount: 100000, message: "Keep it up!", type: "Soundboard", mediaTitle: "Applause", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    ]);

    // Update time regularly
    useEffect(() => {
        const interval = setInterval(() => {
            setHistory(prev => [...prev]);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        const activityDate = moment(date);
        const now = moment();
        const diffDays = now.diff(activityDate, 'days');

        if (diffDays >= 7) {
            return activityDate.format('DD MMM YYYY');
        }

        return activityDate.fromNow(true)
            .replace('seconds', 's')
            .replace('second', 's')
            .replace('minutes', 'm')
            .replace('minute', 'm')
            .replace('hours', 'h')
            .replace('hour', 'h')
            .replace('days', 'd')
            .replace('day', 'd') + ' ago';
    };

    const HistoryItem = ({ item }: { item: Donation }) => (
        <div className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
            <Avatar className="w-10 h-10 border-2 border-slate-100">
                <AvatarImage src="https://i.imgur.com/1Z3MVNG.jpeg" />
                <AvatarFallback>{item.supporter[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-800 truncate block">
                        {item.supporter}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                        {formatTime(item.timestamp)}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
                    <span className="bg-[var(--color-pastel-yellow)] text-[var(--color-deep-purple)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Rp {item.amount.toLocaleString('id-ID')}
                    </span>
                    {item.type === "Mediashare" && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Play size={8} fill="currentColor" /> Media
                        </span>
                    )}
                    {item.type === "Soundboard" && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Music size={8} /> Sound
                        </span>
                    )}
                </div>

                {item.message && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                        "{item.message}"
                    </p>
                )}

                {item.mediaTitle && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-100">
                        {item.type === "Mediashare" ? <Play size={10} /> : <Music size={10} />}
                        <span className="truncate">{item.mediaTitle}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Card className="p-5 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl bg-white">
                <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
                    Recent Support <Heart className="w-4 h-4 text-red-500 fill-current" />
                </h3>

                <ScrollArea className="h-[280px] w-full rounded-md pr-4">
                    <div className="space-y-4">
                        {history.map((item) => (
                            <HistoryItem key={item.id} item={item} />
                        ))}
                    </div>
                </ScrollArea>

                <button
                    onClick={() => setIsViewAllOpen(true)}
                    className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-[var(--color-deep-purple)] py-2 transition-colors"
                >
                    View all history
                </button>
            </Card>

            <Modal
                isOpen={isViewAllOpen}
                onClose={() => setIsViewAllOpen(false)}
                title="Donation History"
            >
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {fullHistory.map((item) => (
                            <HistoryItem key={item.id} item={item} />
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
