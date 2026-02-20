import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

export interface SoundboardStyle {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
}

interface SoundboardProps {
  activeSound?: {
    name: string;
    isPlaying: boolean;
    sender?: string;
    amount?: number;
  };
  style?: SoundboardStyle;
}

export function Soundboard({ activeSound, style }: SoundboardProps) {
  if (!activeSound?.isPlaying) return null;

  const {
    backgroundColor = "rgba(0, 0, 0, 0.7)",
    textColor = "#ffffff",
    accentColor = "var(--color-accent-yellow)", // Default to CSS variable or a static hex like #FDE047
    borderColor = "rgba(255, 255, 255, 0.1)",
  } = style || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-3 backdrop-blur-md px-4 py-2 rounded-full border"
      style={{
        backgroundColor,
        color: textColor,
        borderColor,
      }}
    >
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
        <Volume2 size={20} style={{ color: accentColor }} />
      </motion.div>
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-medium">
          Playing:{" "}
          <span className="font-bold" style={{ color: accentColor }}>
            {activeSound.name}
          </span>
        </span>
        {(activeSound.sender || activeSound.amount) && (
          <span className="text-xs opacity-80">
            {activeSound.sender && <span>by {activeSound.sender} </span>}
            {activeSound.amount && <span>(IDR {activeSound.amount.toLocaleString("id-ID")})</span>}
          </span>
        )}
      </div>

      {/* Visualizer bars simulation */}
      <div className="flex gap-1 h-3 items-end">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 rounded"
            style={{ backgroundColor: textColor, opacity: 0.8 }}
            animate={{ height: ["20%", "100%", "40%"] }}
            transition={{
              repeat: Infinity,
              duration: 0.4,
              delay: i * 0.1,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
