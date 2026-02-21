import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Heart, Bell, Play, UserPlus, Gift, Star, Quote, Zap, Sparkles } from "lucide-react";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

export type OverlayEvent = {
  type: "donation" | "subscription" | "follow" | "raid" | "bits" | "share";
  user: string;
  message?: string;
  amount?: number;
  months?: number; // for subs
  tier?: string;
  count?: number; // for raid/bits
  media?: {
    type: "youtube" | "video" | "image";
    url: string;
    start?: number;
    end?: number;
  };
  unit?: {
    name: string;
    value: number;
    icon?: string;
    count?: number;
  };
  soundUrl?: string;
  volume?: number;
};

interface AlertProps {
  event: OverlayEvent;
  duration?: number;
  onComplete?: () => void;
}

export function Alert({ event, duration = 10000, onComplete }: AlertProps) {
  const [show, setShow] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play notification sound if provided
    if (event.soundUrl) {
      const audio = new Audio(event.soundUrl);
      audio.volume = (event.volume ?? 100) / 100;
      audio.play().catch((e) => console.error("Sound play failed", e));
    }

    const timer = setTimeout(
      () => {
        setShow(false);
        setTimeout(() => onComplete?.(), 500);
      },
      duration + (event.media ? 10000 : 0)
    ); // Give more time for media
    return () => clearTimeout(timer);
  }, [duration, onComplete, event.media, event.soundUrl, event.volume]);

  const variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 25 },
    },
    exit: {
      y: 20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const colors = {
    donation: { bg: "bg-purple-100", text: "text-purple-600", accent: "bg-purple-500" },
    subscription: { bg: "bg-indigo-100", text: "text-indigo-600", accent: "bg-indigo-500" },
    follow: { bg: "bg-pink-100", text: "text-pink-600", accent: "bg-pink-500" },
    raid: { bg: "bg-red-100", text: "text-red-600", accent: "bg-red-500" },
    bits: { bg: "bg-amber-100", text: "text-amber-600", accent: "bg-amber-500" },
    share: { bg: "bg-cyan-100", text: "text-cyan-600", accent: "bg-cyan-500" },
  };

  const icons = {
    donation: <Gift size={24} className="text-white" />,
    subscription: <Star size={24} className="text-white" />,
    follow: <UserPlus size={24} className="text-white" />,
    raid: <Bell size={24} className="text-white" />,
    bits: <Play size={24} className="text-white" />,
    share: <Heart size={24} className="text-white" />,
  };

  const currentTheme = colors[event.type];

  const getEventLabel = () => {
    switch (event.type) {
      case "donation":
        return "DUKUNGAN";
      case "subscription":
        return "BERLANGGANAN";
      case "follow":
        return "FOLLOW BARU";
      case "raid":
        return "RAID";
      case "bits":
        return "BITS";
      case "share":
        return "MEDIA SHARE";
      default:
        return "EVENT";
    }
  };

  const getEventValue = () => {
    switch (event.type) {
      case "donation":
        if (event.unit && event.unit.count) {
          return `${event.unit.count} ${event.unit.name}`;
        }
        return `IDR ${event.amount?.toLocaleString("id-ID") || 0} `;
      case "subscription":
        return `${event.months} Bulan`;
      case "bits":
        return `${event.amount} Bits`;
      case "raid":
        return `${event.count} Viewers`;
      case "follow":
        return "";
      case "share":
        return "";
      default:
        return "";
    }
  };

  const handlePlayMedia = () => {
    setPlaying(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden font-sans mx-auto shadow-2xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Media Section (Dominant) */}
          <div className="relative h-[480px] bg-gray-900 w-full overflow-hidden group">
            {/* "New Media" Badge */}
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                New
              </span>
              <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </div>

            {/* Pattern Text Overlay (Only if no media playing) */}
            {/* Media Rendering */}
            {event.media && (
              <div
                className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: "#ffffff",
                  backgroundImage: `
                    linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
                    linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
                    linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {event.media.type === "image" ? (
                  <motion.img
                    src={event.media.url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    onLoad={() => setIsReady(true)}
                    className="w-full h-full object-contain relative z-10"
                    alt="notification-media"
                  />
                ) : (
                  <div className="relative z-10 w-full h-full">
                    {(() => {
                      const Player = ReactPlayer as any;
                      return (
                        <Player
                          ref={playerRef}
                          url={event.media.url}
                          width="100%"
                          height="100%"
                          playing={playing}
                          onReady={() => {
                            console.log("Player Ready");
                            setIsReady(true);
                          }}
                          onEnded={() => setPlaying(false)}
                          onError={(e: any) => console.error("Player Error:", e)}
                          controls={false}
                          config={{
                            youtube: {
                              playerVars: { controls: 0, modestbranding: 1 },
                            },
                          }}
                        />
                      );
                    })()}

                    {!playing && isReady && (
                      <div
                        className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/20"
                        onClick={handlePlayMedia}
                      >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-2 fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Minimalist Content Section */}
          <div className="relative z-10 bg-white -mt-6 rounded-t-[2rem] px-8 pb-6 pt-0 flex flex-col items-center">
            {/* User Icon (Floating overlapping) */}
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center -mt-10 mb-3 bg-white p-1.5 transform rotate-3 shadow-lg"
              )}
            >
              <div
                className={cn(
                  "w-full h-full rounded-xl flex items-center justify-center overflow-hidden",
                  currentTheme.accent
                )}
              >
                {event.unit?.icon ? (
                  <img src={event.unit.icon} className="w-12 h-12 object-contain" alt="unit" />
                ) : (
                  icons[event.type]
                )}
              </div>
            </div>

            <div className="w-full text-center space-y-1">
              {/* Username & Event Inline */}
              <div className="flex flex-col items-center justify-center gap-1">
                <h2 className="text-3xl font-black text-slate-900 leading-none">{event.user}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {getEventLabel()}
                  </span>
                  {getEventValue() && (
                    <div
                      className={cn(
                        "px-3 py-0.5 rounded-full text-sm font-bold flex items-center gap-2",
                        currentTheme.bg,
                        currentTheme.text
                      )}
                    >
                      {getEventValue()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Box (Compact) */}
            {event.message && (
              <div className="mt-4 w-full">
                <div className="bg-slate-50 border-l-4 border-slate-200 pl-4 py-2 pr-2 rounded-r-xl">
                  <p className="text-base font-medium text-slate-700 italic">"{event.message}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
