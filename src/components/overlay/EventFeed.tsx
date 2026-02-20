import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Zap, DollarSign, CreditCard, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventFeedItem {
  id: string;
  user: string;
  action: string;
  type?: "donation" | "subscription" | "follow";
  amount?: string;
  count?: string;
  message?: string;
}

interface EventFeedProps {
  events: EventFeedItem[];
}

export function EventFeed({ events }: EventFeedProps) {
  const getEventConfig = (item: EventFeedItem) => {
    // Basic heuristic to determine type if not provided
    const action = item.action?.toLowerCase() || "";
    const type =
      item.type ||
      (action.includes("donat") ? "donation" : action.includes("sub") ? "subscription" : "follow");

    switch (type) {
      case "donation":
        return {
          icon: <PiggyBank size={18} />,
          iconBg: "bg-yellow-100 text-purple-700",
          itemBg: "bg-white",
          accentColor: "text-yellow-600",
        };
      case "subscription":
        return {
          icon: <Star size={18} />,
          iconBg: "bg-purple-100 text-purple-700",
          itemBg: "bg-white",
          accentColor: "text-purple-600",
        };
      default:
        return {
          icon: <Heart size={18} fill="currentColor" />,
          iconBg: "bg-pink-50 text-pink-500",
          itemBg: "bg-white",
          accentColor: "text-pink-500",
        };
    }
  };

  return (
    <div className="flex flex-col items-center w-[360px] font-sans h-full">
      {/* Header Pill */}
      <div className="mb-6">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full py-2 px-6 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-purple-700 font-extrabold text-xs tracking-[0.2em] uppercase">
            LIVE FEED
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="relative w-full flex flex-col gap-4">
        {/* Vertical Separator Line */}
        <div className="absolute left-9 top-4 bottom-4 w-[1px] bg-purple-100" />

        <AnimatePresence mode="popLayout">
          {events.slice(0, 6).map((e, index) => {
            const config = getEventConfig(e);

            // Extract amount from action if it looks like "donated IDR 20.000"
            const displayAmount =
              e.amount || (e.action.includes("IDR") ? e.action.split("IDR")[1].trim() : null);
            const isSub = e.type === "subscription" || e.action.toLowerCase().includes("sub");

            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative z-10 w-full"
              >
                <div
                  className={cn(
                    "bg-white rounded-[1.5rem] border border-slate-50 p-3 flex items-center gap-3 transition-colors"
                  )}
                >
                  {/* Icon Box */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      config.iconBg
                    )}
                  >
                    {config.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-black text-[#5b21b6] text-sm truncate">{e.user}</p>

                      {displayAmount && !isSub && (
                        <div className="bg-[#fef9c3] text-[#ca8a04] px-2.5 py-0.5 rounded-lg text-[10px] font-black whitespace-nowrap">
                          IDR {displayAmount}
                        </div>
                      )}

                      {isSub && (
                        <span className="text-purple-400 text-[10px] font-bold">
                          {e.count || "Sub x1"}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-xs font-medium truncate mt-0.5">
                      {e.message ||
                        (e.action.includes("followed") ? "Started following" : e.action)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
