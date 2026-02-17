import { motion } from "framer-motion";

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface PollProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export function Poll({ question, options, totalVotes }: PollProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-2xl w-80 border-2 border-slate-200">
      <h3 className="font-bold text-lg text-slate-800 mb-4 text-center">{question}</h3>

      <div className="space-y-3">
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;

          return (
            <div key={opt.id} className="relative">
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1 z-10 relative">
                <span>{opt.label}</span>
                <span>{Math.round(percentage)}%</span>
              </div>

              <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full bg-[var(--color-deep-purple)]/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-slate-500 font-bold uppercase">
        {totalVotes} Votes Total
      </div>
    </div>
  );
}
