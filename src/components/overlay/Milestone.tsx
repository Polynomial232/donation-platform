import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface MilestoneStep {
  value: number;
  label: string;
  completed: boolean;
}

interface MilestoneProps {
  steps: MilestoneStep[];
  currentValue: number;
}

export function Milestone({ steps, currentValue }: MilestoneProps) {
  // Determine the next uncompleted milestone to focus on, or show last

  return (
    <div className="flex flex-col gap-2 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur text-white p-4 rounded-xl shadow-xl w-64 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={16} className="text-yellow-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Milestones</h3>
      </div>

      <div className="relative border-l-2 border-slate-600 ml-2 py-1 space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = currentValue >= step.value;
          const isNext = !isCompleted && (idx === 0 || currentValue >= steps[idx - 1].value);

          return (
            <div key={idx} className="relative pl-6">
              {/* Dot */}
              <div className={cn(
                "absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-slate-800 transition-colors duration-300",
                isCompleted ? "bg-green-500" : isNext ? "bg-yellow-400 animate-pulse" : "bg-slate-600"
              )} />

              <div className={cn("transition-opacity duration-300", isCompleted || isNext ? "opacity-100" : "opacity-40")}>
                <p className="text-sm font-bold">{step.label}</p>
                <p className="text-xs text-slate-400">Target: {step.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to concat classNames
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
