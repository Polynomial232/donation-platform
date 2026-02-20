import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, Gift } from "lucide-react";

interface GachaProps {
  onOpen?: () => void;
}

export function Gacha({ onOpen }: GachaProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePull = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setResult("SSR Rare Item!");
      onOpen?.();
    }, 2000);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {result && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1.5, rotate: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setResult(null), 3000)}
          >
            <div className="bg-yellow-400 text-slate-900 font-black px-6 py-2 rounded-full border-4 border-white whitespace-nowrap">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handlePull}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full border-4 border-white text-white relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
        {isThinking ? (
          <Sparkles className="animate-spin" size={32} />
        ) : (
          <Gift size={32} className="animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
