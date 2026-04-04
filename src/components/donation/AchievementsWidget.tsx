"use client";

import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";

export function AchievementsWidget({ data }: { data?: any[] }) {
  const items = (data || []).map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description,
    imageUrl: item.imageUrl || "https://i.imgur.com/1Z3MVNG.jpeg",
  }));

  if (items.length === 0) return null;

  return (
    <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
      <div className="bg-linear-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
          <Award size={16} className="text-amber-400" />
        </div>
        <h3 className="text-sm font-extrabold text-white tracking-tight">Imperial Honors</h3>
      </div>

      {/* Flex Wrap Layout - No Scroll */}
      <div className="flex flex-wrap gap-3 relative z-10 p-5">
        {items.map((item) => (
          <div key={item.id} className="group relative cursor-help">
            {/* Achievement Image */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-slate-100 p-1 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-(--color-deep-purple) relative z-20">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
            </div>

            {/* Tooltip - Absolute positioning with high z-index to prevent clipping */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 hidden group-hover:block z-50 w-max max-w-[150px]">
              <div className="bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="font-bold mb-0.5">{item.title}</div>
                <div className="text-slate-300 font-medium whitespace-normal leading-tight">
                  {item.description}
                </div>

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
