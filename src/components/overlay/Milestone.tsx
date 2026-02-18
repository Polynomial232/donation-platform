import { motion } from "framer-motion";
import { Trophy, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneStep {
  value: number;
  label: string;
  completed?: boolean;
}

interface MilestoneProps {
  steps: MilestoneStep[];
  currentValue: number;
}

export function Milestone({ steps, currentValue }: MilestoneProps) {
  // Sort steps by value
  const sortedSteps = [...steps].sort((a, b) => a.value - b.value);

  return (
    <div className="w-[340px] font-sans">
      <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(168,85,247,0.1)] border border-purple-50 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-yellow-100 p-2.5 rounded-2xl text-yellow-600 shadow-sm transform -rotate-3">
            <Trophy size={20} fill="currentColor" className="text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-purple-900 leading-none tracking-tight">Milestones</h2>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 block">Progress Tracker</span>
          </div>
        </div>

        <div className="relative pl-2 space-y-6 z-10">
          {/* Vertical Connective Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 rounded-full" />

          {sortedSteps.map((step, idx) => {
            const isCompleted = currentValue >= step.value;
            // Active is the first uncompleted one
            const isActive = !isCompleted && (idx === 0 || currentValue >= sortedSteps[idx - 1].value);
            const isFuture = !isCompleted && !isActive;

            // Calculate progress for active step
            const prevValue = idx === 0 ? 0 : sortedSteps[idx - 1].value;
            const range = step.value - prevValue;
            const currentInStep = Math.max(0, currentValue - prevValue);
            const progressPercent = isActive ? Math.min(100, (currentInStep / range) * 100) : (isCompleted ? 100 : 0);

            return (
              <div key={idx} className="relative pl-10">
                {/* Indicator Dot */}
                <div className={cn(
                  "absolute -left-2 top-1 w-10 h-10 rounded-full flex items-center justify-center border-[4px] transition-all duration-300 z-10 bg-white",
                  isCompleted ? "border-purple-100 bg-purple-50" :
                    isActive ? "border-yellow-100 bg-yellow-50 shadow-md scale-105" :
                      "border-slate-50 bg-white"
                )}>
                  {isCompleted && <div className="w-2.5 h-2.5 bg-purple-300 rounded-full" />}
                  {isActive && <div className="w-3 h-3 rounded-full border-[2.5px] border-yellow-400" />}
                  {isFuture && <div className="w-2.5 h-2.5 bg-slate-200 rounded-full" />}
                </div>

                {/* Content */}
                <div className={cn("flex ml-3 flex-col gap-1 transition-all duration-500", isFuture && "opacity-40 grayscale")}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={cn(
                      "font-extrabold text-base leading-tight tracking-tight",
                      isCompleted ? "text-slate-300 line-through decoration-2 decoration-purple-200" :
                        isActive ? "text-purple-700" : "text-slate-400"
                    )}>
                      {step.label}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">{Math.round(progressPercent)}%</span>
                    )}
                  </div>

                  {isCompleted ? (
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Check size={12} strokeWidth={4} /> Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      TARGET: <span className="text-slate-500">{step.value.toLocaleString()}</span>
                    </span>
                  )}

                  {/* Progress Bar for Active */}
                  {isActive && (
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Decoration Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-300 via-yellow-300 to-purple-300 opacity-80" />
      </div>
    </div>
  );
}
