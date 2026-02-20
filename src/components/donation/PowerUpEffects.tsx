import { Card } from "@/components/ui/card";
import { Zap, Flame, Sparkles } from "lucide-react";

export function PowerUpEffects() {
  return (
    <Card className="p-6 relative overflow-hidden border-none shadow-sm">
      <div className="absolute -top-6 -right-6 opacity-5">
        <Zap
          size={120}
          className="text-[var(--color-accent-purple)] fill-[var(--color-accent-purple)]"
        />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[var(--color-pastel-purple)] flex items-center justify-center">
          <Zap
            size={14}
            className="text-[var(--color-deep-purple)] fill-[var(--color-deep-purple)]"
          />
        </div>
        <h3 className="font-bold text-sm text-slate-800">Power Up Effects</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-white">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-orange-500 fill-orange-500" />
            <span className="text-[11px] font-bold text-slate-800">Fire Burst</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Min. IDR 100.000</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] font-bold text-slate-800">Sparkle Rain</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Dukungan XP</p>
        </div>
      </div>
    </Card>
  );
}
