"use client";

import { Card } from "@/components/ui/card";
import { Crown, Sparkles, Tv, Ghost, Mic2, ArrowUpRight } from "lucide-react";

export function VipPerksWidget() {
  const perks = [
    {
      amount: "IDR 10.000+",
      value: 10000,
      title: "Text-to-Speech",
      icon: <Mic2 size={14} className="text-pink-500" />,
      bgColor: "bg-pink-50",
      borderColor: "border-pink-100",
    },
    {
      amount: "IDR 50.000+",
      value: 50000,
      title: "Media Share",
      icon: <Tv size={14} className="text-purple-500" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      amount: "IDR 100.000+",
      value: 100000,
      title: "Jumpscare Alert",
      icon: <Ghost size={14} className="text-slate-600" />,
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
    },
  ];

  return (
    <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-yellow-400 blur-[40px] opacity-20 rounded-full"></div>
        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 relative z-10">
          <Crown size={14} className="text-yellow-400 fill-yellow-400" />
          VIP Perks
        </h3>
      </div>

      <div className="p-2">
        {perks.map((perk, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            onClick={() => {
              // Dispatch custom event to update donation amount
              const event = new CustomEvent("update-donation-amount", { detail: perk.value });
              window.dispatchEvent(event);

              // Smooth scroll to donation form
              const element = document.getElementById("donation-form");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${perk.bgColor} ${perk.borderColor}`}
              >
                {perk.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {perk.amount}
                </p>
                <p className="text-xs font-bold text-slate-800">{perk.title}</p>
              </div>
            </div>
            <ArrowUpRight
              size={14}
              className="text-slate-300 group-hover:text-slate-900 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-50 text-center bg-slate-50/50">
        <p className="text-[10px] text-slate-400 font-medium italic">
          Perks apply automatically! ✨
        </p>
      </div>
    </Card>
  );
}
