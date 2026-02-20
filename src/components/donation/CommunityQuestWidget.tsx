"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Sword, Users, ChevronRight } from "lucide-react";

export function CommunityQuestWidget() {
  // Mock Data
  const currentAmount = 750000;
  const targetAmount = 1000000;
  const progress = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

  return (
    <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#6d28d9_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-pastel-purple)] flex items-center justify-center text-[var(--color-deep-purple)] shadow-sm border border-purple-100">
              <Shield size={20} className="fill-purple-200" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                Cosplay Stream
                <span className="bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">
                  Quest
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Unlock special costume reveal!</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[var(--color-deep-purple)]">{progress}% Completed</span>
            <span className="text-slate-400">
              {currentAmount.toLocaleString()} / {targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
            <div
              className="h-full bg-[var(--color-accent-yellow)] rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12 translate-x-[-100%]"></div>
            </div>
          </div>
        </div>

        {/* Footer / Stats */}
        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative"
                >
                  <img
                    src={`https://i.imgur.com/1Z3MVNG.jpeg`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-bold ml-1">+12 Heroes joined</span>
          </div>

          <Button
            size="sm"
            className="h-8 bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-200"
            onClick={() => {
              const element = document.getElementById("donation-form");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          >
            Join Quest <Sword size={12} className="ml-1.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
