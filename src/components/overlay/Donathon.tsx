import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { User, Star, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonathonRules {
  amount: string;
  time: string;
}

interface DonathonProps {
  startTime: number;
  endTime: number;
  onEnd?: () => void;
  goalProgress?: {
    current: number;
    target: number;
  };
  rules?: DonathonRules[];
  goalTitle?: string;
  rulesDescription?: string;
  badgeText?: string;
  collectedLabel?: string;
  showAmounts?: boolean;
}

export function Donathon({
  endTime,
  onEnd,
  goalProgress = { current: 1500000, target: 5000000 },
  rules = [
    { amount: "10rb", time: "1 Menit" },
    { amount: "20rb", time: "3 Menit" },
    { amount: "50rb", time: "10 Menit" },
  ],
  goalTitle = "Donation Goal",
  rulesDescription = "Server Rules & Rates",
  badgeText = "DONATHON LIVE!",
  collectedLabel = "Collected:",
  showAmounts = true,
}: DonathonProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(Math.max(0, endTime - Date.now()));

    const interval = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, endTime - now);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        onEnd?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  if (!isClient) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const progressPercentage = Math.min(
    100,
    Math.max(0, (goalProgress.current / goalProgress.target) * 100)
  );

  return (
    <div className="relative pt-12 font-sans w-[380px]">
      {/* Mascot & Badge Section */}
      <div className="absolute top-0 left-0 z-20 flex items-center">
        {/* Live Badge */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white py-2 px-6 rounded-full border border-purple-100 flex items-center gap-2 -ml-8 mt-4 z-0"
        >
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-purple-700 font-extrabold tracking-wider text-sm uppercase">
            {badgeText}
          </span>
        </motion.div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[3rem] p-6 pt-16 border border-purple-50 relative z-10 overflow-hidden">
        {/* Soft Glow Background */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(243,232,255,0.4)_0,transparent_50%)] pointer-events-none" />

        {/* Goal Progress */}
        <div className="relative mb-8 space-y-2">
          <div className="flex justify-between items-end text-[10px] font-black tracking-widest text-gray-400 uppercase">
            <span>{goalTitle}</span>
            {showAmounts && (
              <span className="text-purple-700">
                Goal: IDR {goalProgress.target.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          <div className="h-4 bg-purple-50 rounded-full overflow-hidden relative border border-purple-100/50 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mt-1.5 px-0.5">
            <div className="flex items-center gap-1.5">
              {showAmounts && (
                <>
                  <span className="text-slate-400">{collectedLabel}</span>
                  <span className="text-purple-600">
                    IDR {goalProgress.current.toLocaleString("id-ID")}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg text-[9px] shadow-sm">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-slate-50/50 rounded-[2rem] p-6 mb-8 text-center border border-slate-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-[2rem]" />
          <h1 className="relative text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-500 tracking-tighter leading-none filter drop-shadow-sm font-[family-name:var(--font-geist-mono)]">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </h1>
          <div className="relative flex justify-center gap-8 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
            <span>Hours</span>
            <span>Mins</span>
            <span>Secs</span>
          </div>
        </div>

        {/* Rules Section */}
        <div className="space-y-3">
          <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
            {rulesDescription}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="font-bold text-slate-700 text-sm">IDR {rule.amount}</span>
                </div>
                <span className="font-bold text-purple-600 text-sm">+{rule.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-300 via-yellow-300 to-purple-300 opacity-80" />
      </div>
    </div>
  );
}
