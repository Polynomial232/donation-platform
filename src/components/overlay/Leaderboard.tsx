import { motion, AnimatePresence } from "framer-motion";
import { Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  amount: number;
  avatarUrl?: string;
}

interface LeaderboardProps {
  title?: string;
  entries: LeaderboardEntry[];
}

export function Leaderboard({ title = "Top Donators", entries }: LeaderboardProps) {
  // Only show top 5
  const topEntries = entries.slice(0, 5);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 w-64 border border-slate-700/50 shadow-xl overflow-hidden">
      <h3 className="text-center font-bold text-white mb-3 uppercase tracking-wider text-xs border-b border-slate-700 pb-2">
        {title}
      </h3>

      <div className="space-y-2">
        <AnimatePresence>
          {topEntries.map((entry, index) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-300 overflow-hidden">
                {entry.avatarUrl ? (
                  <img src={entry.avatarUrl} alt={entry.name} className="w-full h-full object-cover" />
                ) : (
                  entry.rank
                )}

                {entry.rank <= 3 && (
                  <div className={`absolute -top-1 -right-1`}>
                    <Medal size={12} className={
                      entry.rank === 1 ? "text-yellow-400 fill-yellow-400" :
                        entry.rank === 2 ? "text-gray-300 fill-gray-300" :
                          "text-amber-700 fill-amber-700"
                    } />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{entry.name}</p>
                <p className="text-xs text-slate-400 truncate">Rp {entry.amount.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
