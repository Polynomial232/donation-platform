import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface SubathonProps {
  startTime: number; // timestamp
  endTime: number; // timestamp
  onEnd?: () => void;
}

export function Subathon({ endTime, onEnd }: SubathonProps) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
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

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="bg-slate-900 border-2 border-[var(--color-accent-purple)] rounded-xl p-4 flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
      <h2 className="text-[var(--color-accent-purple)] font-black text-xl uppercase tracking-widest flex items-center gap-2">
        <Clock className="animate-pulse" /> Subathon
      </h2>
      <div className="text-4xl font-mono text-white font-bold tabular-nums">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--color-accent-purple)]"
          animate={{ width: "100%" }} // This would be dynamic based on max cap in real app
        />
      </div>
    </div>
  );
}
