import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

interface SoundboardProps {
  activeSound?: {
    name: string;
    isPlaying: boolean;
    sender?: string;
    amount?: number;
  };
}

export function Soundboard({ activeSound }: SoundboardProps) {
  if (!activeSound?.isPlaying) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-lg border border-white/10"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Volume2 size={20} className="text-[var(--color-accent-yellow)]" />
      </motion.div>
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-medium">
          Playing: <span className="font-bold text-[var(--color-accent-yellow)]">{activeSound.name}</span>
        </span>
        {(activeSound.sender || activeSound.amount) && (
          <span className="text-xs text-white/80">
            {activeSound.sender && <span>by {activeSound.sender} </span>}
            {activeSound.amount && <span>(IDR {activeSound.amount.toLocaleString('id-ID')})</span>}
          </span>
        )}
      </div>

      {/* Visualizer bars simulation */}
      <div className="flex gap-1 h-3 items-end">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/80 rounded"
            animate={{ height: ["20%", "100%", "40%"] }}
            transition={{
              repeat: Infinity,
              duration: 0.4,
              delay: i * 0.1,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
