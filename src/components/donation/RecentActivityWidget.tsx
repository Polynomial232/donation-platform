"use client";

import { Card } from "@/components/ui/card";
import { Zap, Heart } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

// Tipe data untuk Activity
interface ActivityItem {
  user: string;
  action: string;
  amount: number;
  time: Date;
}

export function RecentActivityWidget({ data }: { data?: any[] }) {
  // Use data from props, fallback to empty array
  const activityItems: ActivityItem[] = (data || []).map((item) => ({
    user: item.donorName,
    action: "donated",
    amount: item.amount,
    time: new Date(item.createdAt),
  }));

  // State to trigger re-renders for relative time updates
  const [, setTick] = useState(0);

  // Update relative time ("2m ago") every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const activityDate = moment(date);
    const now = moment();
    const diffDays = now.diff(activityDate, "days");

    // Jika lebih dari 1 minggu (7 hari), tampilkan tanggal full
    if (diffDays >= 7) {
      return activityDate.format("DD MMM YYYY");
    }

    // Custom short relative time
    return (
      activityDate
        .fromNow(true)
        .replace("seconds", "s")
        .replace("second", "s")
        .replace("minutes", "m")
        .replace("minute", "m")
        .replace("hours", "h")
        .replace("hour", "h")
        .replace("days", "d")
        .replace("day", "d") + " ago"
    );
  };

  return (
    <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} className="text-[var(--color-accent-yellow)] fill-current" />
          Live Activity
        </h3>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-50">
        {activityItems.length > 0 ? (
          activityItems.map((activity, idx) => (
            <div
              key={idx}
              className="p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="bg-red-50 text-red-500 p-1.5 rounded-full mt-0.5">
                <Heart size={12} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">{activity.user}</span> donated{" "}
                  <span className="font-bold text-[var(--color-deep-purple)]">
                    IDR {activity.amount.toLocaleString("id-ID")}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  {formatTime(activity.time)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-400 font-bold">No activity yet</p>
          </div>
        )}
      </div>
    </Card>
  );
}
