import { motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Heart, Bell, Play, UserPlus, Gift, Star } from "lucide-react";

export type OverlayEvent = {
  type: "donation" | "subscription" | "follow" | "raid" | "bits" | "share";
  user: string;
  message?: string;
  amount?: number;
  months?: number; // for subs
  tier?: string;
  count?: number; // for raid/bits
};

interface AlertProps {
  event: OverlayEvent;
  duration?: number;
  onComplete?: () => void;
}

export function Alert({ event, duration = 5000, onComplete }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const variants = {
    hidden: { y: 100, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: {
      y: -50,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const colors = {
    donation: "bg-emerald-500",
    subscription: "bg-indigo-500",
    follow: "bg-pink-500",
    raid: "bg-red-500",
    bits: "bg-amber-500",
    share: "bg-cyan-500",
  };

  const icons = {
    donation: <Gift size={32} className="text-white" />,
    subscription: <Star size={32} className="text-white" />,
    follow: <UserPlus size={32} className="text-white" />,
    raid: <Bell size={32} className="text-white" />,
    bits: <Play size={32} className="text-white" />,
    share: <Heart size={32} className="text-white" />,
  };

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-white/50 max-w-md w-full",
        "overflow-hidden isolate"
      )}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background Accent */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-2",
        colors[event.type]
      )} />

      {/* Icon Circle */}
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4",
        colors[event.type]
      )}>
        {icons[event.type]}
      </div>

      <div className="text-center space-y-2 relative z-10 w-full">
        <h2 className="text-2xl font-black text-slate-800 drop-shadow-sm">
          {event.user}
        </h2>

        <p className="font-bold text-lg text-slate-600">
          {event.type === 'donation' && `donated Rp ${event.amount?.toLocaleString('id-ID')}`}
          {event.type === 'subscription' && `subscribed for ${event.months} month(s)`}
          {event.type === 'follow' && `followed the channel!`}
          {event.type === 'raid' && `raided with ${event.count} viewers!`}
          {event.type === 'bits' && `cheered ${event.amount} bits!`}
          {event.type === 'share' && `shared the stream!`}
        </p>

        {event.message && (
          <div className="bg-slate-100 p-3 rounded-xl mt-4 text-slate-700 italic border-l-4 border-slate-300 w-full text-center">
            "{event.message}"
          </div>
        )}
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-white/30 translate-x-[-100%] skew-x-[-20deg]"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 3 }}
      />
    </motion.div>
  );
}
