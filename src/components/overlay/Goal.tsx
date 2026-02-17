import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoalProps {
  title: string;
  current: number;
  target: number;
  currency?: string; // e.g. "Rp" or "" for followers
  color?: string;
}

export function Goal({ title, current, target, currency = "Rp", color = "bg-green-500" }: GoalProps) {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg border border-slate-200 w-64">
      <div className="flex justify-between items-end mb-1">
        <span className="font-bold text-slate-800 text-sm">{title}</span>
        <span className="text-xs font-medium text-slate-500">
          {Math.floor(percentage)}%
        </span>
      </div>

      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full transition-all", color)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, type: "spring" }}
        />

        {/* Text inside bar if enough space, or create a layered look */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800 drop-shadow-sm pointer-events-none">
          {currency && currency + " "}{current.toLocaleString()} / {currency && currency + " "}{target.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
