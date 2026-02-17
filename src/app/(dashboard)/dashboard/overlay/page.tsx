"use client";

import Link from "next/link";
import {
  Bell, Flag, Trophy, Type, List, Target, Clock, PieChart, QrCode, Grid, Volume2, Sparkles, Sliders
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OVERLAY_TYPES = [
  { id: "alert", label: "Notification Box", icon: Bell, description: "Donation, Sub, Follow alerts" },
  { id: "goal", label: "Target / Goal", icon: Flag, description: "Donation bar progress" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, description: "Top donators list" },
  { id: "running-text", label: "Running Text", icon: Type, description: "Ticker for recent events" },
  { id: "event-feed", label: "Event Feed", icon: List, description: "Stream activity log" },
  { id: "milestone", label: "Milestone", icon: Target, description: "Timeline of achievements" },
  { id: "subathon", label: "Subathon", icon: Clock, description: "Countdown timer" },
  { id: "poll", label: "Polling", icon: PieChart, description: "Live voting results" },
  { id: "qr", label: "QR Code", icon: QrCode, description: "Scan to donate" },
  { id: "soundboard", label: "Soundboard", icon: Volume2, description: "Visualizer for sounds" },
  { id: "gacha", label: "Gacha", icon: Sparkles, description: "Interactive gacha game" },
];

export default function OverlaySettingsIndexPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Overlay Settings</h2>
          <p className="text-slate-500 font-medium">Select an overlay component to configure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OVERLAY_TYPES.map((type) => (
          <Card key={type.id} className="p-6 border-none shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[var(--color-accent-purple)] group relative overflow-hidden">
            <Link href={`/dashboard/overlay/${type.id}`} className="block">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[var(--color-pastel-purple)] group-hover:text-[var(--color-deep-purple)] transition-colors text-slate-500">
                  <type.icon size={28} />
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider group-hover:bg-[var(--color-deep-purple)] group-hover:text-white transition-colors">
                  Configure
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[var(--color-deep-purple)] transition-colors relative z-10">
                {type.label}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 relative z-10">
                {type.description}
              </p>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-pastel-purple)] rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
