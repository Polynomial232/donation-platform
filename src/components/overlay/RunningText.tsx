// RunningText Component
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface RunningTextProps {
  messages: string[];
  speed?: number; // px per second
}

export function RunningText({ messages, speed = 50 }: RunningTextProps) {
  // Simple ticker implementation
  return (
    <div className="fixed bottom-0 left-0 w-full h-12 bg-slate-900/90 backdrop-blur-sm shadow-lg border-t-2 border-[var(--color-accent-purple)] overflow-hidden flex items-center z-50">
      <div className="absolute left-0 top-0 bottom-0 bg-[var(--color-accent-purple)] px-4 flex items-center justify-center z-10 skew-x-[-10deg] ml-[-10px]">
        <span className="font-black text-white ml-2 skew-x-[10deg] text-sm uppercase tracking-wider">Latest</span>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden w-full relative pl-24 mask-gradient-overlay"> {/* pl-24 for the "Latest" label space */}
        <motion.div
          className="flex gap-12"
          animate={{ x: ["100%", "-100%"] }} // Ideally use seamless loop
          transition={{
            repeat: Infinity,
            duration: 20, // Adjust based on content length
            ease: "linear"
          }}
        >
          {[...messages, ...messages].map((msg, i) => ( // Duplicate for easier wrapping illusion
            <div key={i} className="flex items-center gap-2 text-white font-medium text-sm">
              <User size={14} className="text-[var(--color-accent-purple)]" />
              {msg}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
