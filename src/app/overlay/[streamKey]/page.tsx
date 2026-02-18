"use client";

import { useEffect, useState } from "react";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";
import { Goal } from "@/components/overlay/Goal";
import { RunningText } from "@/components/overlay/RunningText";
import { Leaderboard } from "@/components/overlay/Leaderboard";
import { Soundboard } from "@/components/overlay/Soundboard";
import { Milestone } from "@/components/overlay/Milestone";
import { EventFeed } from "@/components/overlay/EventFeed";
import { QRCodeOverlay } from "@/components/overlay/QRCode"; // Renamed to avoid reserved word conflict if any
import { Subathon } from "@/components/overlay/Subathon";
import { Poll } from "@/components/overlay/Poll";
import { Gacha } from "@/components/overlay/Gacha";

// Mock Data
const MOCK_LEADERBOARD = [
    { rank: 1, name: "Sultan_Budi", amount: 5000000 },
    { rank: 2, name: "Windah_Fans", amount: 2500000 },
    { rank: 3, name: "Reynaldi", amount: 1000000 },
    { rank: 4, name: "Asep_Gaming", amount: 500000 },
    { rank: 5, name: "Joko_99", amount: 250000 },
];

const MOCK_EVENTS = [
    { id: "1", user: "Budi01", action: "donated Rp 20.000", time: "2m ago" },
    { id: "2", user: "Siti_G", action: "subscribed (Prime)", time: "5m ago" },
    { id: "3", user: "Udin_World", action: "followed", time: "10m ago" },
];

const MOCK_POLL = {
    question: "Game selanjutnya?",
    options: [
        { id: "1", label: "Mobile Legends", votes: 450 },
        { id: "2", label: "Valorant", votes: 320 },
        { id: "3", label: "Horror Game", votes: 890 },
    ],
    totalVotes: 1660,
};

export default function OverlayPage() {
    const [alert, setAlert] = useState<OverlayEvent | null>(null);
    const [endTime, setEndTime] = useState(Date.now() + 1000 * 60 * 60 * 4); // Start with 4 hours
    const [goalProgress, setGoalProgress] = useState({ current: 1500000, target: 5000000 });
    const [latestDonation, setLatestDonation] = useState({
        name: "Sultan_Budi",
        amount: 50000,
        timeAdded: "+25m"
    });

    // Simulation Loop
    useEffect(() => {
        const timer = setInterval(() => {
            // Randomly trigger an alert every 10-15s
            if (Math.random() > 0.7) {
                const amount = 10000 * Math.floor(Math.random() * 10) + 10000;
                const user = "User_" + Math.floor(Math.random() * 100);

                // Add time logic: 10k = 5 mins
                const addedMinutes = (amount / 10000) * 5;

                if (Math.random() > 0.5) { // 50% chance it's a donation event
                    setAlert({
                        type: "donation",
                        user: user,
                        amount: amount,
                        message: "Semangat bang streamingnya! Tambah durasi " + addedMinutes + " menit",
                    });

                    // Update State
                    setEndTime(prev => prev + addedMinutes * 60 * 1000);
                    setGoalProgress(prev => ({ ...prev, current: prev.current + amount }));
                    setLatestDonation({
                        name: user,
                        amount: amount,
                        timeAdded: `+${addedMinutes}m`
                    });
                }
            }
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-transparent font-sans">
            {/* Grid Layout for Demo Purposes */}
            {/* In a real OBS setup, these would be separate browser sources or positioned absolutely */}

            {/* Top Left: Subathon & Integrated Goal */}
            <div className="absolute top-4 left-4 flex flex-col gap-4">
                <Subathon
                    startTime={Date.now()}
                    endTime={endTime}
                    goalProgress={goalProgress}
                    rules={[
                        { amount: "10.000", time: "1 Menit" },
                        { amount: "20.000", time: "3 Menit" },
                        { amount: "50.000", time: "10 Menit" },
                    ]}
                />
            </div>

            {/* Top Right: Leaderboard */}
            <div className="absolute top-4 right-4">
                <Leaderboard entries={MOCK_LEADERBOARD} />
            </div>

            {/* Bottom Right: Event Feed & Poll */}
            <div className="absolute bottom-16 right-4 flex flex-col items-end gap-4">
                <Poll {...MOCK_POLL} />
                <EventFeed events={MOCK_EVENTS} />
            </div>

            {/* Bottom Left: QR & Milestones */}
            <div className="absolute bottom-16 left-4 flex gap-4 items-end">
                <QRCodeOverlay
                    data="https://saweria.co/yourprofile"
                    gradientStart="#4c1d95"
                    gradientEnd="#db2777"
                    logoSrc="https://placehold.co/100x100/png?text=SA"
                />
                <Milestone
                    currentValue={10000}
                    steps={[
                        { value: 1000, label: "Face Reveal", completed: true },
                        { value: 5000, label: "Horror Game", completed: true },
                        { value: 10000, label: "Giveaway PC", completed: true },
                        { value: 20000, label: "Giveaway Console", completed: true },
                        { value: 30000, label: "Giveaway Console", completed: false },
                    ]}
                />
            </div>

            {/* Center: Alerts & Soundboard & Gacha */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 pointer-events-none">
                <div className="pointer-events-auto mb-8">
                    <Soundboard
                        activeSound={{ name: "Bruh Sound Effect #2", isPlaying: true, amount: 10000, sender: "Tester123" }}
                        style={{
                            backgroundColor: "#000000cc", // Example: Darker background
                            textColor: "#ffffff",
                            accentColor: "#FDE047",       // Keep yellow accent for now, or change to demonstrate dynamic capability
                            borderColor: "#ffffff20"
                        }}
                    />
                </div>

                {alert && (
                    <div className="pointer-events-auto">
                        <Alert event={alert} onComplete={() => setAlert(null)} />
                    </div>
                )}

                <div className="pointer-events-auto mt-8 opacity-80 hover:opacity-100 transition-opacity">
                    <Gacha />
                </div>
            </div>

            {/* Bottom: Running Text */}
            <RunningText messages={[
                "Top Donator: Sultan_Budi - Rp 5.000.000",
                "Recent Sub: Siti_G (Prime)",
                "Don't forget to follow and subscribe!",
                "Join Discord for updates."
            ]} />
        </div>
    );
}
