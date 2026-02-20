import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  amount: number;
  avatarUrl?: string;
}

interface LeaderboardProps {
  title?: string;
  subtitle?: string;
  entries: LeaderboardEntry[];
  showAmount?: boolean;
}

export function Leaderboard({
  title = "Top Donors",
  subtitle = "ALL TIME LEGENDS",
  entries = [],
  showAmount = true,
}: LeaderboardProps) {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "JT";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + "K";
    }
    return amount.toLocaleString();
  };

  // Sort entries by rank just in case
  const sortedEntries = [...entries].sort((a, b) => a.rank - b.rank);
  const rank1Entry = sortedEntries.find((e) => e.rank === 1);
  const otherEntries = sortedEntries.filter((e) => e.rank !== 1);

  return (
    <div className="w-[320px] relative overflow-hidden flex flex-col select-none font-sans">
      {/* Header - Fixed */}
      <div className="pt-6 px-6 pb-4 text-center sticky top-0 z-30">
        <h3 className="text-[#6d28d9] font-[950] text-2xl tracking-tight leading-none mb-1">
          {title}
        </h3>
        <p className="text-[#94a3b8] text-[9px] font-extrabold tracking-[0.2em] uppercase opacity-80">
          {subtitle}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pb-8 overflow-y-auto max-h-[500px] scrollbar-hide space-y-3">
        {/* Highlight Rank 1 */}
        {rank1Entry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border-[2px] border-[#fde047] mb-4 mt-1"
          >
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-[#fef9c3] flex items-center justify-center font-black text-2xl text-[#713f12] shadow-inner">
              1
              <div className="absolute -top-2 -right-2 bg-[#facc15] text-white p-1 rounded-full border-2 border-white">
                <Crown size={12} fill="currentColor" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#94a3b8] text-[8px] font-black tracking-widest uppercase mb-0.5">
                TOP SUPPORTER
              </p>
              <p className="truncate font-black text-[#6d28d9] text-lg leading-tight">
                {rank1Entry.name}
              </p>
            </div>
            {showAmount && (
              <div className="text-right whitespace-nowrap">
                <span className="text-[#6d28d9] text-[10px] font-black opacity-80 block leading-none">
                  IDR
                </span>
                <span className="text-[#6d28d9] text-xl font-black leading-none">
                  {formatAmount(rank1Entry.amount)}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Scrollable Rest of List */}
        <div className="space-y-2 pb-2">
          <AnimatePresence mode="popLayout">
            {otherEntries.map((entry, index) => {
              const displayAmount = formatAmount(entry.amount);
              return (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-[1.2rem] bg-[#faf9ff] border border-[#f5f3ff] hover:bg-[#f5f3ff] transition-colors"
                >
                  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#f5f3ff] flex items-center justify-center font-black text-sm text-[#7c3aed]">
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-bold text-[#475569] text-sm">{entry.name}</p>
                  </div>
                  {showAmount && (
                    <div className="text-right whitespace-nowrap flex items-baseline gap-0.5">
                      <span className="text-[#7c3aed] text-[9px] font-black opacity-40">IDR</span>
                      <span className="text-[#7c3aed] text-base font-black">{displayAmount}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {otherEntries.length === 0 && !rank1Entry && (
            <div className="py-10 text-center">
              <p className="text-[#94a3b8] text-xs font-medium italic">No donations yet...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Decoration - Fixed Bottom */}
      <div className="h-4 sticky bottom-0 z-30 flex items-center justify-center px-10">
        <div className="h-[6px] w-full flex rounded-full overflow-hidden opacity-80">
          <div className="flex-1 bg-[#c4b5fd]" />
          <div className="flex-1 bg-[#fde047]" />
          <div className="flex-1 bg-[#c4b5fd]" />
        </div>
      </div>
    </div>
  );
}
