"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Generate dummy daily data for March
const generateDailyData = () => {
  const data = [];
  for (let i = 1; i <= 31; i++) {
    data.push({
      day: i,
      revenue: Math.floor(Math.random() * 200000) + 50000,
    });
  }
  return data;
};

const dailyData = generateDailyData();
const todayIndex = 28; // Assume today is March 29 (index 28)

export function DailyActivityChart() {
  return (
    <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
            Daily Activity
          </CardTitle>
          <div className="text-xl font-black text-slate-100 italic tracking-tight">MARCH 2026</div>
        </div>
        <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] font-bold">
          <span className="size-1.5 rounded-full bg-blue-500 anim-pulse" /> LIVE
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#475569", fontSize: 8, fontWeight: 700 }}
                interval={2}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "rgba(51, 65, 85, 0.3)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg shadow-2xl">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          March {payload[0].payload.day}
                        </div>
                        <div className="text-sm font-black text-slate-100">
                          IDR {payload[0].value?.toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === todayIndex ? "#3b82f6" : "#1e293b"}
                    className={cn(
                      "transition-all duration-300 hover:fill-blue-400",
                      index === todayIndex && "shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    )}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="px-6 pb-2 pt-4 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded bg-blue-500" />
            <span>Current Selection: Mar {todayIndex + 1}</span>
          </div>
          <div>Avg. IDR 124.5K / Day</div>
        </div>
      </CardContent>
    </Card>
  );
}
