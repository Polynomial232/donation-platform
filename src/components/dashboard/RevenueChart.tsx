"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const data = [
  { month: "Jan", revenue: 1200000 },
  { month: "Feb", revenue: 2100000 },
  { month: "Mar", revenue: 1800000 },
  { month: "Apr", revenue: 2400000 },
  { month: "May", revenue: 3200000 },
  { month: "Jun", revenue: 2800000 },
  { month: "Jul", revenue: 3500000 },
  { month: "Aug", revenue: 4100000 },
  { month: "Sep", revenue: 3900000 },
  { month: "Oct", revenue: 4800000 },
  { month: "Nov", revenue: 5200000 },
  { month: "Dec", revenue: 6400000 },
];

const currentMonthTotal = 6400000;
const lastMonthTotal = 5200000;
const growth = (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1);

export function RevenueChart() {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  return (
    <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest leading-none">
            Monthly Performance
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 tracking-tighter">
              IDR {(currentMonthTotal / 1000000).toFixed(1)}M
            </span>
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center bg-green-500/10 text-green-400"
              )}
            >
              +{growth}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
            Total Revenue
          </div>
          <div className="text-xl font-bold text-slate-100 italic">
            IDR {currentMonthTotal.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[240px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          {payload[0].payload.month} Revenue
                        </div>
                        <div className="text-lg font-black text-slate-100">
                          IDR {payload[0].value?.toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
