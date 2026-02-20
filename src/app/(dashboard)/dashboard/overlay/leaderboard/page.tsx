"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trophy, Save, List, Settings2, Clock, Eye, Layout } from "lucide-react";
import { Leaderboard } from "@/components/overlay/Leaderboard";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const leaderboardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  maxDonors: z.number().min(1).max(20),
  showDonation: z.boolean(),
  timeRange: z.enum([
    "all_time",
    "this_year",
    "last_6_months",
    "last_3_months",
    "this_month",
    "this_week",
    "today",
  ]),
});

type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;

const MOCK_DONORS = [
  { rank: 1, name: "Sultan_Budi", amount: 15000000 },
  { rank: 2, name: "Andi_Hero", amount: 7500000 },
  { rank: 3, name: "Siti_G", amount: 5000000 },
  { rank: 4, name: "Rizky_Ramadhan", amount: 2500000 },
  { rank: 5, name: "Dina_Oktavia", amount: 1000000 },
];

export default function LeaderboardOverlaySettingsPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: {
      title: "Top Donors",
      subtitle: "ALL TIME LEGENDS",
      maxDonors: 5,
      showDonation: true,
      timeRange: "all_time",
    },
  });

  const formData = watch();

  const onSubmit = (data: LeaderboardFormValues) => {
    console.log("Saving Leaderboard Settings:", data);
    alert("Leaderboard settings updated!");
  };

  return (
    <OverlaySettingsTemplate
      title="Leaderboard"
      description="Display your top supporters in a beautiful ranked list."
      icon={<Trophy size={24} />}
      type="leaderboard"
      previewContent={
        <div className="scale-90 origin-center">
          <Leaderboard
            title={formData.title}
            subtitle={formData.subtitle}
            entries={MOCK_DONORS.slice(0, formData.maxDonors)}
            showAmount={formData.showDonation}
          />
        </div>
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center p-3 bg-purple-50/50 border border-purple-100/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Settings2 className="text-[var(--color-deep-purple)]" size={14} />
              <span className="font-semibold text-[var(--color-deep-purple)] text-[10px] uppercase tracking-wider">
                Display Configuration
              </span>
            </div>
          </div>

          <Card className="p-6 border border-slate-100 shadow-sm space-y-5">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layout size={10} className="text-blue-400" /> Leaderboard Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Top Donors"
                  className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white focus:border-[var(--color-deep-purple)]/30 focus:ring-4 focus:ring-purple-500/5 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layout size={10} className="text-yellow-400" /> Subtitle / Description
                </label>
                <input
                  type="text"
                  {...register("subtitle")}
                  placeholder="e.g. ALL TIME LEGENDS"
                  className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white focus:border-[var(--color-deep-purple)]/30 focus:ring-4 focus:ring-purple-500/5 transition-all uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Eye size={10} className="text-green-400" /> Max Donors
                </label>
                <input
                  type="number"
                  {...register("maxDonors", { valueAsNumber: true })}
                  className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white focus:border-[var(--color-deep-purple)]/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={10} className="text-purple-400" /> Time Range
                </label>
                <select
                  {...register("timeRange")}
                  className="w-full text-xs font-medium border border-slate-100 bg-slate-50/50 rounded-xl py-3 px-4 focus:bg-white transition-all appearance-none outline-none"
                >
                  <option value="all_time">All Time (Legend)</option>
                  <option value="this_year">This Year</option>
                  <option value="last_6_months">Last 6 Months</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="this_month">This Month</option>
                  <option value="this_week">This Week</option>
                  <option value="today">Today</option>
                </select>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-700">Show Donation Amounts</p>
                <p className="text-[9px] text-slate-400">Display amount donor contributed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("showDonation")} className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-deep-purple)]"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-black text-white font-bold h-11 rounded-2xl px-10 text-xs shadow-xl active:scale-95 transition-all flex gap-2"
              >
                <Save size={16} /> Save Leaderboard
              </Button>
            </div>
          </Card>
        </form>
      }
    />
  );
}
